// server/src/routes/users.js

const express = require("express");
const {
  getProfile,
  updateProfile,
  becomeHost,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} = require("../controllers/userController");

const router = express.Router();

// Profile routes
router.get("/profile", getProfile);
router.put("/profile", updateProfile);

// Become a host
router.post("/become-host", becomeHost);

// Wishlist routes
router.get("/wishlist", getWishlist);
router.post("/wishlist/:propertyId", addToWishlist);
router.delete("/wishlist/:propertyId", removeFromWishlist);

module.exports = router;
