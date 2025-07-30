const express = require("express");
const {
  getAnalytics,
  getAllUsers,
  updateUserRole,
  suspendUser,
  getAllProperties,
  updatePropertyStatus,
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

// Property Management
router.get("/properties", getAllProperties);
router.put("/properties/:propertyId/status", updatePropertyStatus);

// Booking Management
router.get("/bookings", getAllBookings);

// Review Management
router.get("/reviews", getAllReviews);
router.put("/reviews/:reviewId/moderate", moderateReview);

module.exports = router;
