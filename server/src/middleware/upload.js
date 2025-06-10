// server/src/middleware/upload.js
const multer = require("multer");
const path = require("path");

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter function
const fileFilter = (req, file, cb) => {
  // Check file type
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Only image files are allowed (jpeg, jpg, png, gif, webp)"));
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: fileFilter,
});

// Middleware for single image upload
const uploadSingle = upload.single("image");

// Middleware for multiple image uploads
const uploadMultiple = upload.array("images", 10); // Max 10 images

// Error handling middleware for multer
const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ message: "File too large. Maximum size is 10MB." });
    }
    if (error.code === "LIMIT_FILE_COUNT") {
      return res
        .status(400)
        .json({ message: "Too many files. Maximum is 10 images." });
    }
  }

  if (error.message.includes("Only image files are allowed")) {
    return res.status(400).json({ message: error.message });
  }

  next(error);
};

module.exports = {
  uploadSingle,
  uploadMultiple,
  handleUploadError,
};
