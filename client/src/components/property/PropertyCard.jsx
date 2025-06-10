// client/src/components/property/PropertyCard.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Star, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const PropertyCard = ({ property, onWishlistToggle, isInWishlist = false }) => {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (wishlistLoading) return;

    setWishlistLoading(true);
    try {
      await onWishlistToggle?.(property._id);
    } finally {
      setWishlistLoading(false);
    }
  };

  const primaryImage =
    property.images?.find((img) => img.isPrimary) || property.images?.[0];

  return (
    <Link to={`/property/${property._id}`} className="group block">
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-200">
          {primaryImage && (
            <img
              src={primaryImage.url}
              alt={property.title}
              className={cn(
                "w-full h-full object-cover group-hover:scale-105 transition-transform duration-300",
                isImageLoading && "opacity-0"
              )}
              onLoad={() => setIsImageLoading(false)}
            />
          )}

          {isImageLoading && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
          )}

          {/* Wishlist Button */}
          {onWishlistToggle && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleWishlistToggle}
              disabled={wishlistLoading}
              className="absolute top-3 right-3 h-8 w-8 p-0 bg-white/80 hover:bg-white/90 backdrop-blur-sm"
            >
              <Heart
                className={cn(
                  "h-4 w-4 transition-colors",
                  isInWishlist ? "fill-red-500 text-red-500" : "text-gray-600"
                )}
              />
            </Button>
          )}

          {/* Property Type Badge */}
          <Badge
            variant="secondary"
            className="absolute top-3 left-3 bg-white/90 text-gray-900"
          >
            {property.propertyType?.replace("_", " ")}
          </Badge>

          {/* Image Count */}
          {property.images?.length > 1 && (
            <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded">
              1 / {property.images.length}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Location */}
          <div className="flex items-center space-x-1 text-sm text-gray-600 mb-2">
            <MapPin className="h-3 w-3" />
            <span>
              {property.location?.city}, {property.location?.state}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-wanderlust-600 transition-colors">
            {property.title}
          </h3>

          {/* Details */}
          <div className="flex items-center space-x-3 text-sm text-gray-600 mb-3">
            <span>{property.accommodates} guests</span>
            <span>•</span>
            <span>
              {property.bedrooms} bed{property.bedrooms !== 1 ? "s" : ""}
            </span>
            <span>•</span>
            <span>
              {property.bathrooms} bath{property.bathrooms !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Rating */}
          {property.ratings?.overall > 0 && (
            <div className="flex items-center space-x-1 mb-3">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">
                {property.ratings.overall.toFixed(1)}
              </span>
              <span className="text-sm text-gray-600">
                ({property.reviewCount})
              </span>
            </div>
          )}

          {/* Amenities Preview */}
          {property.amenities?.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {property.amenities.slice(0, 3).map((amenity) => (
                <Badge key={amenity} variant="outline" className="text-xs">
                  {amenity.replace("_", " ")}
                </Badge>
              ))}
              {property.amenities.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{property.amenities.length - 3} more
                </Badge>
              )}
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-lg font-bold text-gray-900">
                ${property.pricing?.basePrice}
              </span>
              <span className="text-sm text-gray-600 ml-1">per night</span>
            </div>

            {/* Host Info */}
            {property.host && (
              <div className="flex items-center space-x-1">
                <img
                  src={property.host.avatar || "/default-avatar.png"}
                  alt={property.host.firstName}
                  className="w-6 h-6 rounded-full object-cover"
                />
                <span className="text-sm text-gray-600">
                  {property.host.firstName}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
