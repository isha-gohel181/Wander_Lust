// server/src/controllers/uploadController.js
const { cloudinary } = require("../config/cloudinary");
const multer = require("multer");
const { Readable } = require("stream");

// Configure multer for memory storage (not Cloudinary storage)
const storage = multer.memoryStorage();

// Configure multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
});

// Helper function to upload buffer to Cloudinary
const uploadToCloudinary = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "image",
        folder: options.folder || "wanderlust/properties",
        transformation: [
          { width: 1920, height: 1080, crop: "limit" },
          { quality: "auto" },
          { fetch_format: "auto" },
        ],
        ...options,
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    // Convert buffer to stream and pipe to Cloudinary
    const bufferStream = new Readable();
    bufferStream.push(buffer);
    bufferStream.push(null);
    bufferStream.pipe(stream);
  });
};

// Upload single image
const uploadSingleImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided",
      });
    }

    const folder = req.body.folder || "wanderlust/properties";

    // Upload to Cloudinary
    const result = await uploadToCloudinary(req.file.buffer, { folder });

    res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      imageUrl: result.secure_url,
      imageId: result.public_id,
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes,
      },
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upload image",
      error: error.message,
    });
  }
};

// Upload multiple images
const uploadMultipleImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No image files provided",
      });
    }

    const folder = req.body.folder || "wanderlust/properties";
    const uploadPromises = req.files.map((file) =>
      uploadToCloudinary(file.buffer, { folder })
    );

    // Upload all images
    const results = await Promise.all(uploadPromises);

    const uploadedImages = results.map((result) => ({
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
    }));

    res.status(200).json({
      success: true,
      message: `${results.length} images uploaded successfully`,
      images: uploadedImages,
      imageUrls: results.map((r) => r.secure_url),
      imageIds: results.map((r) => r.public_id),
    });
  } catch (error) {
    console.error("Error uploading images:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upload images",
      error: error.message,
    });
  }
};

// Delete image from Cloudinary
const deleteImage = async (req, res) => {
  try {
    const { imageUrl, publicId } = req.body;

    if (!imageUrl && !publicId) {
      return res.status(400).json({
        success: false,
        message: "Image URL or public ID is required",
      });
    }

    let targetPublicId = publicId;

    // Extract public_id from URL if not provided
    if (!targetPublicId && imageUrl) {
      const parts = imageUrl.split("/");
      const uploadIndex = parts.findIndex((part) => part === "upload");

      if (uploadIndex !== -1 && uploadIndex < parts.length - 1) {
        // Skip version if present
        let startIndex = uploadIndex + 1;
        if (parts[startIndex].startsWith("v")) {
          startIndex += 1;
        }

        const publicIdParts = parts.slice(startIndex);
        const publicIdWithExtension = publicIdParts.join("/");
        targetPublicId = publicIdWithExtension.split(".")[0];
      }
    }

    if (!targetPublicId) {
      return res.status(400).json({
        success: false,
        message: "Could not extract public ID from image URL",
      });
    }

    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(targetPublicId);

    if (result.result === "ok" || result.result === "not found") {
      res.status(200).json({
        success: true,
        message: "Image deleted successfully",
        result: result,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Failed to delete image",
        result: result,
      });
    }
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete image",
      error: error.message,
    });
  }
};

// Get image info
const getImageInfo = async (req, res) => {
  try {
    const { publicId } = req.query;

    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: "Public ID is required",
      });
    }

    const result = await cloudinary.api.resource(publicId);

    res.status(200).json({
      success: true,
      imageInfo: {
        publicId: result.public_id,
        format: result.format,
        width: result.width,
        height: result.height,
        bytes: result.bytes,
        createdAt: result.created_at,
        url: result.secure_url,
      },
    });
  } catch (error) {
    console.error("Error getting image info:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get image info",
      error: error.message,
    });
  }
};

module.exports = {
  upload,
  uploadSingleImage,
  uploadMultipleImages,
  deleteImage,
  getImageInfo,
};
