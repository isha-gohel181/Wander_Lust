const express = require("express");
const {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  uploadPropertyImages,
  getHostProperties,
} = require("../controllers/propertyController");

const { requireAuth, getUserFromClerk, requireHost } = require("../middleware/auth");
const { uploadMultiple, handleUploadError } = require("../middleware/upload");
const { validateProperty } = require("../middleware/validation");

const router = express.Router();

// PUBLIC ROUTES (no authentication required)
router.get("/", getProperties);
router.get("/:id", getProperty);

// PROTECTED ROUTES (authentication required)
// Apply auth middleware to specific routes that need it
router.get("/host/my-properties", requireAuth, getUserFromClerk, requireHost, getHostProperties);
router.post("/", requireAuth, getUserFromClerk, requireHost, validateProperty, createProperty);
router.put("/:id", requireAuth, getUserFromClerk, requireHost, validateProperty, updateProperty);
router.delete("/:id", requireAuth, getUserFromClerk, requireHost, deleteProperty);
router.post(
  "/:id/images",
  requireAuth,
  getUserFromClerk,
  requireHost,
  uploadMultiple,
  handleUploadError,
  uploadPropertyImages
);

module.exports = router;