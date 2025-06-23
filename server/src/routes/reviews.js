const express = require("express");
const {
  createReview,
  getPropertyReviews,
  addHostReply,
} = require("../controllers/reviewController");

const {
  requireAuth,
  getUserFromClerk,
  requireHost,
} = require("../middleware/auth");
const { validateReview } = require("../middleware/validation");

const router = express.Router();

// ✅ PUBLIC route to get property reviews
router.get("/property/:propertyId", getPropertyReviews);

// ✅ PROTECTED routes
router.post("/", requireAuth, getUserFromClerk, validateReview, createReview);
router.post(
  "/:reviewId/reply",
  requireAuth,
  getUserFromClerk,
  requireHost,
  addHostReply
);

module.exports = router;
