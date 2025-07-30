const User = require("../models/User");
const Property = require("../models/Property");
const Booking = require("../models/Booking");
const Review = require("../models/Review");
const Message = require("../models/Message");

// Get admin analytics/dashboard data
const getAnalytics = async (req, res) => {
  try {
    const [
      totalUsers,
      totalProperties,
      totalBookings,
      totalReviews,
      recentUsers,
      recentProperties,
      bookingStats,
      revenueStats,
    ] = await Promise.all([
      User.countDocuments(),
      Property.countDocuments(),
      Booking.countDocuments(),
      Review.countDocuments(),
      User.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select("firstName lastName email createdAt"),
      Property.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select("title location createdAt"),
      Booking.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]),
      Booking.aggregate([
        {
          $match: { status: "completed" },
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$totalAmount" },
          },
        },
      ]),
    ]);

    const analytics = {
      totalUsers,
      totalProperties,
      totalBookings,
      totalReviews,
      totalRevenue: revenueStats[0]?.totalRevenue || 0,
      recentUsers,
      recentProperties,
      bookingStats: bookingStats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {}),
    };

    res.json(analytics);
  } catch (error) {
    console.error("Get analytics error:", error);
    res.status(500).json({ message: "Failed to fetch analytics" });
  }
};

// User Management
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", role = "all" } = req.query;
    const skip = (page - 1) * limit;

    let query = {};

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (role !== "all") {
      query.role = role;
    }

    const [users, total] = await Promise.all([
      User.find(query)
        .select("-__v")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      User.countDocuments(query),
    ]);

    res.json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!["guest", "host", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select("-__v");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User role updated successfully", user });
  } catch (error) {
    console.error("Update user role error:", error);
    res.status(500).json({ message: "Failed to update user role" });
  }
};

const suspendUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndUpdate(
      userId,
      { isVerified: false },
      { new: true }
    ).select("-__v");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User suspended successfully", user });
  } catch (error) {
    console.error("Suspend user error:", error);
    res.status(500).json({ message: "Failed to suspend user" });
  }
};

// Property Management - Enhanced
const getAllProperties = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status = "all",
      propertyType = "all",
      featured = "all",
      search = "",
    } = req.query;
    const skip = (page - 1) * limit;

    let query = {};

    // Status filter
    if (status !== "all") {
      query.status = status;
    }

    // Property type filter
    if (propertyType !== "all") {
      query.propertyType = propertyType;
    }

    // Featured filter
    if (featured !== "all") {
      query.featured = featured === "true";
    }

    // Search filter
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { "location.city": { $regex: search, $options: "i" } },
        { "location.state": { $regex: search, $options: "i" } },
      ];
    }

    const [properties, total] = await Promise.all([
      Property.find(query)
        .populate("host", "firstName lastName email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Property.countDocuments(query),
    ]);

    res.json({
      properties,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get all properties error:", error);
    res.status(500).json({ message: "Failed to fetch properties" });
  }
};

const getPropertyStats = async (req, res) => {
  try {
    const stats = await Promise.all([
      Property.countDocuments({ status: "pending" }),
      Property.countDocuments({ status: "approved" }),
      Property.countDocuments({ status: "rejected" }),
      Property.countDocuments({ status: "suspended" }),
      Property.countDocuments({ featured: true }),
      Property.aggregate([
        { $group: { _id: "$propertyType", count: { $sum: 1 } } },
      ]),
    ]);

    res.json({
      pending: stats[0],
      approved: stats[1],
      rejected: stats[2],
      suspended: stats[3],
      featured: stats[4],
      byType: stats[5],
    });
  } catch (error) {
    console.error("Get property stats error:", error);
    res.status(500).json({ message: "Failed to fetch property statistics" });
  }
};

const updatePropertyStatus = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const { status } = req.body;

    if (!["pending", "approved", "rejected", "suspended"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const property = await Property.findByIdAndUpdate(
      propertyId,
      {
        status,
        // Set isActive based on status
        isActive: status === "approved",
      },
      { new: true }
    ).populate("host", "firstName lastName email");

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.json({ message: "Property status updated successfully", property });
  } catch (error) {
    console.error("Update property status error:", error);
    res.status(500).json({ message: "Failed to update property status" });
  }
};

const togglePropertyFeatured = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const { featured } = req.body;

    const property = await Property.findByIdAndUpdate(
      propertyId,
      { featured },
      { new: true }
    ).populate("host", "firstName lastName email");

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.json({
      message: `Property ${featured ? "featured" : "unfeatured"} successfully`,
      property,
    });
  } catch (error) {
    console.error("Toggle property featured error:", error);
    res.status(500).json({ message: "Failed to update featured status" });
  }
};

const deleteProperty = async (req, res) => {
  try {
    const { propertyId } = req.params;

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // Soft delete by setting isActive to false
    await Property.findByIdAndUpdate(propertyId, {
      isActive: false,
      status: "suspended",
    });

    res.json({ message: "Property deleted successfully" });
  } catch (error) {
    console.error("Delete property error:", error);
    res.status(500).json({ message: "Failed to delete property" });
  }
};

const bulkUpdateProperties = async (req, res) => {
  try {
    const { propertyIds, updates } = req.body;

    if (!Array.isArray(propertyIds) || propertyIds.length === 0) {
      return res
        .status(400)
        .json({ message: "Property IDs array is required" });
    }

    const updateData = { ...updates };
    if (updates.status) {
      updateData.isActive = updates.status === "approved";
    }

    const result = await Property.updateMany(
      { _id: { $in: propertyIds } },
      updateData
    );

    res.json({
      message: `${result.modifiedCount} properties updated successfully`,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Bulk update properties error:", error);
    res.status(500).json({ message: "Failed to update properties" });
  }
};

// Booking Management
const getAllBookings = async (req, res) => {
  try {
    const { page = 1, limit = 10, status = "all" } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (status !== "all") {
      query.status = status;
    }

    const [bookings, total] = await Promise.all([
      Booking.find(query)
        .populate("guest", "firstName lastName email")
        .populate("property", "title location")
        .populate("host", "firstName lastName email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Booking.countDocuments(query),
    ]);

    res.json({
      bookings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get all bookings error:", error);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};

// Review Management
const getAllReviews = async (req, res) => {
  try {
    const { page = 1, limit = 10, status = "all" } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (status !== "all") {
      query.status = status;
    }

    const [reviews, total] = await Promise.all([
      Review.find(query)
        .populate("guest", "firstName lastName")
        .populate("property", "title")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Review.countDocuments(query),
    ]);

    res.json({
      reviews,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get all reviews error:", error);
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
};

const moderateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { action } = req.body; // 'approve', 'reject', 'flag'

    if (!["approve", "reject", "flag"].includes(action)) {
      return res.status(400).json({ message: "Invalid action" });
    }

    const statusMap = {
      approve: "approved",
      reject: "rejected",
      flag: "flagged",
    };

    const review = await Review.findByIdAndUpdate(
      reviewId,
      { status: statusMap[action] },
      { new: true }
    )
      .populate("guest", "firstName lastName")
      .populate("property", "title");

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.json({ message: `Review ${action}ed successfully`, review });
  } catch (error) {
    console.error("Moderate review error:", error);
    res.status(500).json({ message: "Failed to moderate review" });
  }
};

module.exports = {
  getAnalytics,
  getAllUsers,
  updateUserRole,
  suspendUser,
  getAllProperties,
  getPropertyStats,
  updatePropertyStatus,
  togglePropertyFeatured,
  deleteProperty,
  bulkUpdateProperties,
  getAllBookings,
  getAllReviews,
  moderateReview,
};
