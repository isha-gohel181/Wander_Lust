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

// Property Management
const getAllProperties = async (req, res) => {
  try {
    const { page = 1, limit = 10, status = "all" } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (status !== "all") {
      query.status = status;
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

const updatePropertyStatus = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const { status } = req.body;

    if (!["pending", "approved", "rejected", "suspended"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const property = await Property.findByIdAndUpdate(
      propertyId,
      { status },
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
  updatePropertyStatus,
  getAllBookings,
  getAllReviews,
  moderateReview,
};
