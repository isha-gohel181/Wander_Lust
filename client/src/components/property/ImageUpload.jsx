// client/src/components/property/ImageUpload.jsx
import React, { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import toast from "react-hot-toast";

const ImageUpload = ({ images = [], onImagesChange, maxImages = 10 }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleFiles = async (files) => {
    // Filter for image files only
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    if (imageFiles.length !== files.length) {
      toast.error("Please select only image files");
    }

    if (images.length + imageFiles.length > maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`);
      return;
    }

    // Validate file sizes (max 5MB per image)
    const oversizedFiles = imageFiles.filter(
      (file) => file.size > 5 * 1024 * 1024
    );
    if (oversizedFiles.length > 0) {
      toast.error("Each image must be less than 5MB");
      return;
    }

    setUploading(true);

    try {
      const newImages = await Promise.all(
        imageFiles.map(async (file) => {
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              resolve({
                id: Date.now() + Math.random(),
                file: file,
                preview: e.target.result,
                name: file.name,
                size: file.size,
                uploaded: false,
              });
            };
            reader.readAsDataURL(file);
          });
        })
      );

      onImagesChange([...images, ...newImages]);
      toast.success(`${newImages.length} image(s) added`);
    } catch (error) {
      console.error("Error processing images:", error);
      toast.error("Error processing images");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (imageId) => {
    const updatedImages = images.filter((img) => img.id !== imageId);
    onImagesChange(updatedImages);
    toast.success("Image removed");
  };

  const moveImage = (fromIndex, toIndex) => {
    const updatedImages = [...images];
    const [movedImage] = updatedImages.splice(fromIndex, 1);
    updatedImages.splice(toIndex, 0, movedImage);
    onImagesChange(updatedImages);
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <Card className="border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors">
        <CardContent className="p-6">
          <div
            className={`
              flex flex-col items-center justify-center space-y-4 p-8 rounded-lg transition-colors
              ${dragActive ? "bg-blue-50 border-blue-200" : "bg-gray-50"}
              ${uploading ? "opacity-50 pointer-events-none" : "cursor-pointer"}
            `}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="flex flex-col items-center space-y-2">
              {uploading ? (
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              ) : (
                <Upload className="h-12 w-12 text-gray-400" />
              )}
              <div className="text-center">
                <p className="text-lg font-medium text-gray-700">
                  {uploading
                    ? "Processing images..."
                    : "Upload property images"}
                </p>
                <p className="text-sm text-gray-500">
                  Drag and drop images here, or click to browse
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Maximum {maxImages} images, 5MB each (JPG, PNG, WEBP)
                </p>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              disabled={uploading}
            />
          </div>
        </CardContent>
      </Card>

      {/* Images Preview */}
      {images.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              Property Images ({images.length}/{maxImages})
            </h3>
            {images.length > 0 && (
              <p className="text-sm text-gray-500">
                First image will be the main photo
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div
                key={image.id}
                className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200"
              >
                {/* Main Image Badge */}
                {index === 0 && (
                  <div className="absolute top-2 left-2 z-10 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                    Main Photo
                  </div>
                )}

                {/* Image */}
                <img
                  src={image.preview || image.url}
                  alt={image.name}
                  className="w-full h-full object-cover"
                />

                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                  {/* Move Left */}
                  {index > 0 && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        moveImage(index, index - 1);
                      }}
                      className="p-1 h-8 w-8"
                    >
                      ←
                    </Button>
                  )}

                  {/* Move Right */}
                  {index < images.length - 1 && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        moveImage(index, index + 1);
                      }}
                      className="p-1 h-8 w-8"
                    >
                      →
                    </Button>
                  )}

                  {/* Remove */}
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(image.id);
                    }}
                    className="p-1 h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Image Info */}
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-2">
                  <p className="text-xs truncate">{image.name}</p>
                  <p className="text-xs text-gray-300">
                    {(image.size / 1024 / 1024).toFixed(1)} MB
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Upload Guidelines */}
          <Alert>
            <ImageIcon className="h-4 w-4" />
            <AlertDescription>
              <strong>Photo Tips:</strong> Use high-quality images that showcase
              your property's best features. The first image will be the main
              photo shown in search results.
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
