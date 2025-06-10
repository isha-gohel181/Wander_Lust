// client/src/services/upload.js
import api from "./api";

export const uploadService = {
  // Upload single image
  uploadImage: async (file, folder = "properties") => {
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("folder", folder);

      console.log("📤 Uploading single image:", file.name);

      const response = await api.post("/upload/image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("✅ Single image upload response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error uploading image:", error);
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to upload image"
      );
    }
  },

  // Upload multiple images
  uploadImages: async (files, folder = "properties") => {
    try {
      const formData = new FormData();

      // Convert File objects to actual files if needed
      const fileArray = Array.isArray(files) ? files : [files];

      fileArray.forEach((fileItem) => {
        // Handle both direct File objects and objects with file property
        const actualFile = fileItem.file || fileItem;
        if (actualFile instanceof File) {
          formData.append("images", actualFile);
        } else {
          console.warn("⚠️ Invalid file object:", fileItem);
        }
      });

      formData.append("folder", folder);

      console.log("📤 Uploading multiple images:", fileArray.length, "files");
      console.log("📋 FormData contents:");
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`  ${key}: ${value.name} (${value.size} bytes)`);
        } else {
          console.log(`  ${key}: ${value}`);
        }
      }

      const response = await api.post("/upload/images", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("✅ Multiple images upload response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error uploading images:", error);
      console.error("❌ Error details:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
      });

      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to upload images"
      );
    }
  },

  // Upload images with progress tracking
  uploadImagesWithProgress: async (
    files,
    folder = "properties",
    onProgress
  ) => {
    try {
      const formData = new FormData();

      // Convert File objects to actual files if needed
      const fileArray = Array.isArray(files) ? files : [files];

      fileArray.forEach((fileItem) => {
        // Handle both direct File objects and objects with file property
        const actualFile = fileItem.file || fileItem;
        if (actualFile instanceof File) {
          formData.append("images", actualFile);
        } else {
          console.warn("⚠️ Invalid file object:", fileItem);
        }
      });

      formData.append("folder", folder);

      console.log("📤 Uploading with progress:", fileArray.length, "files");

      const response = await api.post("/upload/images", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log(`📊 Upload progress: ${percentCompleted}%`);
          if (onProgress) {
            onProgress(percentCompleted);
          }
        },
      });

      console.log("✅ Upload with progress response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error uploading images with progress:", error);
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to upload images"
      );
    }
  },

  // Delete image
  deleteImage: async (imageUrl, publicId = null) => {
    try {
      console.log("🗑️ Deleting image:", imageUrl, publicId);

      const response = await api.delete("/upload/image", {
        data: {
          imageUrl,
          publicId,
        },
      });

      console.log("✅ Delete image response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error deleting image:", error);
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to delete image"
      );
    }
  },

  // Compress image before upload (client-side)
  compressImage: (file, maxWidth = 1920, maxHeight = 1080, quality = 0.8) => {
    return new Promise((resolve, reject) => {
      if (!(file instanceof File)) {
        reject(new Error("Input must be a File object"));
        return;
      }

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onerror = () => {
        reject(new Error("Failed to load image"));
      };

      img.onload = () => {
        try {
          // Calculate new dimensions
          let { width, height } = img;

          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }

          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }

          canvas.width = width;
          canvas.height = height;

          // Draw and compress
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(
                  new File([blob], file.name, {
                    type: file.type,
                    lastModified: Date.now(),
                  })
                );
              } else {
                reject(new Error("Failed to compress image"));
              }
            },
            file.type,
            quality
          );
        } catch (error) {
          reject(error);
        }
      };

      img.src = URL.createObjectURL(file);
    });
  },

  // Validate image file
  validateImage: (file) => {
    const errors = [];

    // Check if it's a file
    if (!(file instanceof File)) {
      errors.push("Invalid file object");
      return errors;
    }

    // Check file type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
    ];
    if (!allowedTypes.includes(file.type)) {
      errors.push("File type not supported. Please use JPG, PNG, WEBP, or GIF");
    }

    // Check file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      errors.push("File size too large. Maximum size is 5MB");
    }

    return errors;
  },

  // Batch validate images
  validateImages: (files) => {
    const fileArray = Array.isArray(files) ? files : [files];
    const allErrors = [];

    fileArray.forEach((fileItem, index) => {
      const actualFile = fileItem.file || fileItem;
      const errors = uploadService.validateImage(actualFile);
      if (errors.length > 0) {
        allErrors.push({
          index,
          fileName: actualFile?.name || `File ${index + 1}`,
          errors,
        });
      }
    });

    return allErrors;
  },
};
