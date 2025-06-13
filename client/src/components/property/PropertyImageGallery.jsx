//client/src/components/property/PropertyImageGallery.jsx
import React, { useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const PropertyImageGallery = ({ images, onClose, initialIndex = 0 }) => {
  const [currentImageIndex, setCurrentImageIndex] =
    React.useState(initialIndex);

  const handlePrevious = useCallback(() => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const handleNext = useCallback(() => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        handlePrevious();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [onClose, handlePrevious, handleNext]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  // Handle click outside image to close
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-95 z-50 overflow-hidden gallery-modal"
      onClick={handleBackdropClick}
    >
      {/* Close button */}
      <div className="absolute top-4 right-4 z-50">
        <button
          className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
          onClick={onClose}
          aria-label="Close gallery"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <div className="h-full flex flex-col">
        {/* Image counter */}
        <div className="text-white text-center py-4 text-sm font-medium">
          {currentImageIndex + 1} / {images.length}
        </div>

        {/* Main image container */}
        <div className="flex-1 flex items-center justify-center p-4 relative">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Main image */}
            <img
              src={images[currentImageIndex].url}
              alt={`Property image ${currentImageIndex + 1}`}
              className="max-h-full max-w-full object-contain gallery-image select-none"
              draggable={false}
            />

            {/* Navigation buttons */}
            {images.length > 1 && (
              <>
                <button
                  className="absolute left-4 text-white hover:bg-white/20 p-3 rounded-full transition-colors"
                  onClick={handlePrevious}
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  className="absolute right-4 text-white hover:bg-white/20 p-3 rounded-full transition-colors"
                  onClick={handleNext}
                  aria-label="Next image"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="h-20 flex gap-2 p-4 overflow-x-auto gallery-thumbnails">
            {images.map((image, index) => (
              <div
                key={index}
                className={`h-full aspect-video cursor-pointer rounded overflow-hidden border-2 transition-all flex-shrink-0 ${
                  currentImageIndex === index
                    ? "border-white shadow-lg"
                    : "border-transparent opacity-60 hover:opacity-90 hover:border-white/50"
                }`}
                onClick={() => setCurrentImageIndex(index)}
              >
                <img
                  src={image.url}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Loading indicator for images */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-white text-sm opacity-0 transition-opacity duration-300">
          Loading...
        </div>
      </div>
    </div>
  );
};

export default PropertyImageGallery;