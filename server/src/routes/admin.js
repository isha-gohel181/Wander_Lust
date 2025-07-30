const express = require("express");
const {
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
} = require("../controllers/adminController");
const { requireAdmin } = require("../middleware/auth");

const router = express.Router();

// All admin routes require admin role
router.use(requireAdmin);

// Analytics
router.get("/analytics", getAnalytics);

// User Management
router.get("/users", getAllUsers);
router.put("/users/:userId/role", updateUserRole);
router.put("/users/:userId/suspend", suspendUser);

// Property Management - Enhanced
router.get("/properties", getAllProperties);
router.get("/properties/stats", getPropertyStats);
router.put("/properties/:propertyId/status", updatePropertyStatus);
router.put("/properties/:propertyId/featured", togglePropertyFeatured);
router.delete("/properties/:propertyId", deleteProperty);
router.put("/properties/bulk", bulkUpdateProperties);

// Booking Management
router.get("/bookings", getAllBookings);

// Review Management
router.get("/reviews", getAllReviews);
router.put("/reviews/:reviewId/moderate", moderateReview);

module.exports = router;
