// server/src/config/cloudinary.js
const cloudinary = require("cloudinary").v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Test connection
const testConnection = async () => {
  try {
    const result = await cloudinary.api.ping();
    console.log("✅ Cloudinary connected successfully:", result);
    return true;
  } catch (error) {
    console.error("❌ Cloudinary connection failed:", error.message);
    return false;
  }
};

// Helper function to upload buffer to Cloudinary
const uploadImage = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      resource_type: "image",
      folder: "wanderlust/properties",
      transformation: [
        { width: 1920, height: 1080, crop: "limit" },
        { quality: "auto" },
        { fetch_format: "auto" },
      ],
      ...options,
    };

    cloudinary.uploader
      .upload_stream(uploadOptions, (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          reject(error);
        } else {
          resolve(result);
        }
      })
      .end(buffer);
  });
};

// Helper function to delete image from Cloudinary
const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    throw error;
  }
};

// Helper function to extract public_id from URL
const extractPublicId = (imageUrl) => {
  try {
    if (!imageUrl || typeof imageUrl !== "string") {
      return null;
    }

    const parts = imageUrl.split("/");
    const uploadIndex = parts.findIndex((part) => part === "upload");

    if (uploadIndex === -1) {
      return null;
    }

    // Skip version if present (starts with 'v' followed by numbers)
    let startIndex = uploadIndex + 1;
    if (startIndex < parts.length && /^v\d+$/.test(parts[startIndex])) {
      startIndex += 1;
    }

    if (startIndex >= parts.length) {
      return null;
    }

    const publicIdParts = parts.slice(startIndex);
    const publicIdWithExtension = publicIdParts.join("/");

    // Remove file extension
    const lastDotIndex = publicIdWithExtension.lastIndexOf(".");
    if (lastDotIndex !== -1) {
      return publicIdWithExtension.substring(0, lastDotIndex);
    }

    return publicIdWithExtension;
  } catch (error) {
    console.error("Error extracting public_id:", error);
    return null;
  }
};

// Helper function to generate optimized URL
const generateOptimizedUrl = (publicId, options = {}) => {
  const defaultOptions = {
    quality: "auto",
    fetch_format: "auto",
    ...options,
  };

  return cloudinary.url(publicId, defaultOptions);
};

// Helper function to get image info
const getImageInfo = async (publicId) => {
  try {
    const result = await cloudinary.api.resource(publicId);
    return result;
  } catch (error) {
    console.error("Error getting image info:", error);
    throw error;
  }
};

module.exports = {
  cloudinary,
  testConnection,
  uploadImage,
  deleteImage,
  extractPublicId,
  generateOptimizedUrl,
  getImageInfo,
};
