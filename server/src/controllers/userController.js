//server/src/controllers/userController.js

const User = require("../models/User");
const Property = require("../models/Property");
const Booking = require("../models/Booking");

// Get current user profile
const getProfile = async (req, res) => {
  try {
    if (!req.clerkId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findOne({ clerkId: req.clerkId })
      .populate("properties")
      .populate("bookings")
      .select("-__v");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    if (!req.clerkId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { firstName, lastName, phone, bio } = req.body;

    const user = await User.findOneAndUpdate(
      { clerkId: req.clerkId },
      { firstName, lastName, phone, bio },
      { new: true, runValidators: true }
    ).select("-__v");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Failed to update profile" });
  }
};

// Upgrade to host
const becomeHost = async (req, res) => {
  try {
    if (!req.clerkId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findOneAndUpdate(
      { clerkId: req.clerkId },
      { role: "host" },
      { new: true }
    ).select("-__v");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Successfully upgraded to host", user });
  } catch (error) {
    console.error("Become host error:", error);
    res.status(500).json({ message: "Failed to upgrade to host" });
  }
};

// Get user's wishlist
const getWishlist = async (req, res) => {
  try {
    if (!req.clerkId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findOne({ clerkId: req.clerkId }).populate({
      path: "wishlist",
      populate: {
        path: "host",
        select: "firstName lastName avatar",
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.wishlist);
  } catch (error) {
    console.error("Get wishlist error:", error);
    res.status(500).json({ message: "Failed to fetch wishlist" });
  }
};

// Add property to wishlist
const addToWishlist = async (req, res) => {
  try {
    if (!req.clerkId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { propertyId } = req.params;

    const user = await User.findOne({ clerkId: req.clerkId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    if (user.wishlist.includes(propertyId)) {
      return res.status(400).json({ message: "Property already in wishlist" });
    }

    user.wishlist.push(propertyId);
    await user.save();

    res.json({ message: "Property added to wishlist" });
  } catch (error) {
    console.error("Add to wishlist error:", error);
    res.status(500).json({ message: "Failed to add to wishlist" });
  }
};

// Remove property from wishlist
const removeFromWishlist = async (req, res) => {
  try {
    if (!req.clerkId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { propertyId } = req.params;

    const user = await User.findOne({ clerkId: req.clerkId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.wishlist = user.wishlist.filter((id) => id.toString() !== propertyId);
    await user.save();

    res.json({ message: "Property removed from wishlist" });
  } catch (error) {
    console.error("Remove from wishlist error:", error);
    res.status(500).json({ message: "Failed to remove from wishlist" });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  becomeHost,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};
