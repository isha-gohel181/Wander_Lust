//server/src/routes/reviews.js
const express = require("express");
const {
  createReview,
  getPropertyReviews,
  addHostReply,
} = require("../controllers/reviewController");

const { requireAuth, getUserFromClerk } = require("../middleware/auth");
const { validateReview } = require("../middleware/validation");

const router = express.Router();

// Public routes
router.get("/property/:propertyId", getPropertyReviews);

// Protected routes (authenticated)
router.use(requireAuth);
router.use(getUserFromClerk);

router.post("/", validateReview, createReview);
router.post("/:reviewId/reply", addHostReply);

module.exports = router;
