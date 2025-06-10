//server/src/routes/upload.js
const express = require("express");
const router = express.Router();
const {
  upload,
  uploadSingleImage,
  uploadMultipleImages,
  deleteImage,
  getImageInfo,
} = require("../controllers/uploadController");

const { requireAuth, getUserFromClerk } = require("../middleware/auth");

// Apply authentication middleware
router.use(requireAuth);
router.use(getUserFromClerk);

// Upload single image
router.post("/image", upload.single("image"), uploadSingleImage);

// Upload multiple images
router.post("/images", upload.array("images", 10), uploadMultipleImages);

// Delete image
router.delete("/image", deleteImage);

// Get image info (via query string to handle `/`)
router.get("/image", getImageInfo);

// Global Multer error handler
router.use((error, req, res, next) => {
  if (error.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      success: false,
      message: "File size too large. Max size is 5MB per image.",
    });
  }

  if (error.code === "LIMIT_FILE_COUNT") {
    return res.status(400).json({
      success: false,
      message: "Too many files. Max 10 images allowed.",
    });
  }

  if (error.message === "Only image files are allowed!") {
    return res.status(400).json({
      success: false,
      message: "Only image files (JPG, JPEG, PNG, WEBP) are allowed.",
    });
  }

  res.status(500).json({
    success: false,
    message: "Upload failed",
    error: error.message,
  });
});

module.exports = router;
