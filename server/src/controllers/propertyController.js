// server/src/controllers/propertyController.js
const Property = require("../models/Property");
const User = require("../models/User");
const { uploadImage, deleteImage } = require("../config/cloudinary");

// Get all properties with search and filters
const getProperties = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      search,
      city,
      state,
      country,
      propertyType,
      roomType,
      minPrice,
      maxPrice,
      guests,
      bedrooms,
      bathrooms,
      amenities,
      lat,
      lng,
      radius = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    // Build query object
    const query = { isActive: true };

    // Search filter
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { "location.city": { $regex: search, $options: "i" } },
        { "location.state": { $regex: search, $options: "i" } },
      ];
    }

    // Location filters
    if (city) query["location.city"] = { $regex: city, $options: "i" };
    if (state) query["location.state"] = { $regex: state, $options: "i" };
    if (country) query["location.country"] = { $regex: country, $options: "i" };

    // Property type filter
    if (propertyType) query.propertyType = propertyType;
    if (roomType) query.roomType = roomType;

    // Price range filter
    if (minPrice || maxPrice) {
      query["pricing.basePrice"] = {};
      if (minPrice) query["pricing.basePrice"].$gte = parseFloat(minPrice);
      if (maxPrice) query["pricing.basePrice"].$lte = parseFloat(maxPrice);
    }

    // Guest capacity filter
    if (guests) query.accommodates = { $gte: parseInt(guests) };

    // Room filters
    if (bedrooms) query.bedrooms = { $gte: parseInt(bedrooms) };
    if (bathrooms) query.bathrooms = { $gte: parseFloat(bathrooms) };

    // Amenities filter
    if (amenities) {
      const amenitiesList = Array.isArray(amenities)
        ? amenities
        : amenities.split(",");
      query.amenities = { $all: amenitiesList };
    }

    // Geospatial filter
    if (lat && lng) {
      query["location.coordinates"] = {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          $maxDistance: parseFloat(radius) * 1000, // Convert km to meters
        },
      };
    }

    // Sort configuration
    const sort = {};
    sort[sortBy] = sortOrder === "asc" ? 1 : -1;

    // Execute query with pagination
    const properties = await Property.find(query)
      .populate("host", "firstName lastName avatar")
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select("-__v");

    const total = await Property.countDocuments(query);

    res.json({
      properties,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalCount: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Get properties error:", error);
    res.status(500).json({ message: "Failed to fetch properties" });
  }
};

// Get single property by ID
const getProperty = async (req, res) => {
  try {
    const { id } = req.params;

    const property = await Property.findById(id)
      .populate("host", "firstName lastName avatar bio dateJoined")
      .select("-__v");

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // Increment view count (optional)
    // await Property.findByIdAndUpdate(id, { $inc: { viewCount: 1 } });

    res.json(property);
  } catch (error) {
    console.error("Get property error:", error);
    res.status(500).json({ message: "Failed to fetch property" });
  }
};

// Create new property
const createProperty = async (req, res) => {
  try {
    const user = await User.findOne({ clerkId: req.clerkId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Ensure user is a host
    if (user.role !== "host" && user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Only hosts can create properties" });
    }

    const propertyData = {
      ...req.body,
      host: user._id,
    };

    const property = new Property(propertyData);
    await property.save();

    // Add property to user's properties array
    user.properties.push(property._id);
    await user.save();

    await property.populate("host", "firstName lastName avatar");

    res.status(201).json(property);
  } catch (error) {
    console.error("Create property error:", error);
    res.status(500).json({ message: "Failed to create property" });
  }
};

// Update property
const updateProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ clerkId: req.clerkId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // Check if user owns the property
    if (
      property.host.toString() !== user._id.toString() &&
      user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this property" });
    }

    const updatedProperty = await Property.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    }).populate("host", "firstName lastName avatar");

    res.json(updatedProperty);
  } catch (error) {
    console.error("Update property error:", error);
    res.status(500).json({ message: "Failed to update property" });
  }
};

// Delete property
const deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ clerkId: req.clerkId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // Check if user owns the property
    if (
      property.host.toString() !== user._id.toString() &&
      user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this property" });
    }

    // Delete property images from Cloudinary
    for (const image of property.images) {
      await deleteImage(image.publicId);
    }

    await Property.findByIdAndDelete(id);

    // Remove property from user's properties array
    user.properties = user.properties.filter(
      (propId) => propId.toString() !== id
    );
    await user.save();

    res.json({ message: "Property deleted successfully" });
  } catch (error) {
    console.error("Delete property error:", error);
    res.status(500).json({ message: "Failed to delete property" });
  }
};

// Upload property images
const uploadPropertyImages = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ clerkId: req.clerkId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // Check if user owns the property
    if (
      property.host.toString() !== user._id.toString() &&
      user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this property" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No images provided" });
    }

    const uploadedImages = [];

    for (const file of req.files) {
      try {
        const result = await uploadImage(file.buffer, {
          folder: `wanderlust/properties/${id}`,
          resource_type: "image",
          transformation: [
            { width: 1200, height: 800, crop: "fill" },
            { quality: "auto" },
          ],
        });

        uploadedImages.push({
          url: result.secure_url,
          publicId: result.public_id,
          isPrimary:
            uploadedImages.length === 0 && property.images.length === 0,
        });
      } catch (uploadError) {
        console.error("Image upload error:", uploadError);
      }
    }

    if (uploadedImages.length === 0) {
      return res.status(500).json({ message: "Failed to upload images" });
    }

    // Add new images to property
    property.images.push(...uploadedImages);
    await property.save();

    res.json({
      message: "Images uploaded successfully",
      images: uploadedImages,
    });
  } catch (error) {
    console.error("Upload images error:", error);
    res.status(500).json({ message: "Failed to upload images" });
  }
};

// Get host's properties
const getHostProperties = async (req, res) => {
  try {
    const user = await User.findOne({ clerkId: req.clerkId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const properties = await Property.find({ host: user._id })
      .sort({ createdAt: -1 })
      .select("-__v");

    res.json(properties);
  } catch (error) {
    console.error("Get host properties error:", error);
    res.status(500).json({ message: "Failed to fetch properties" });
  }
};

module.exports = {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  uploadPropertyImages,
  getHostProperties,
};
