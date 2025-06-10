// client/src/pages/PropertyDetails.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Heart,
  Star,
  MapPin,
  Users,
  Bed,
  Bath,
  Wifi,
  Car,
  Coffee,
  Tv,
  UtensilsCrossed,
  Waves,
  Dumbbell,
  Shield,
  Calendar,
  ArrowLeft,
  Share,
  Flag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BookingForm from "@/components/booking/BookingForm";
import ReviewSection from "@/components/reviews/ReviewSection";
import { useProperty } from "@/hooks/useProperty";
import { useWishlist } from "@/hooks/useWishlist";
import { useAuth } from "@/hooks/useAuth";
import { formatPrice, getAmenityIcon } from "@/utils/helpers";
import toast from "react-hot-toast";

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { property, loading, error } = useProperty(id);
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showAllPhotos, setShowAllPhotos] = useState(false);

  const amenityIcons = {
    wifi: <Wifi className="h-4 w-4" />,
    free_parking: <Car className="h-4 w-4" />,
    breakfast: <Coffee className="h-4 w-4" />,
    tv: <Tv className="h-4 w-4" />,
    kitchen: <UtensilsCrossed className="h-4 w-4" />,
    pool: <Waves className="h-4 w-4" />,
    gym: <Dumbbell className="h-4 w-4" />,
    smoke_alarm: <Shield className="h-4 w-4" />,
  };

  const handleWishlistToggle = async () => {
    if (!user) {
      toast.error("Please sign in to add to wishlist");
      return;
    }

    try {
      await toggleWishlist(property._id);
    } catch (error) {
      console.error("Wishlist toggle error:", error);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: property.title,
          text: property.description,
          url: window.location.href,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
              <div className="aspect-[4/3] bg-gray-200 rounded-lg" />
              <div className="grid grid-cols-2 gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square bg-gray-200 rounded-lg"
                  />
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-6 bg-gray-200 rounded w-2/3" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
              </div>
              <div className="h-96 bg-gray-200 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Property not found
          </h1>
          <p className="text-gray-600 mb-4">
            The property you're looking for doesn't exist.
          </p>
          <Button onClick={() => navigate("/search")}>Back to Search</Button>
        </div>
      </div>
    );
  }

  const primaryImage =
    property.images?.find((img) => img.isPrimary) || property.images?.[0];
  const otherImages = property.images?.filter((img) => !img.isPrimary) || [];

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={handleShare}>
              <Share className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="ghost" size="sm" onClick={handleWishlistToggle}>
              <Heart
                className={`h-4 w-4 mr-2 ${
                  isInWishlist(property._id) ? "fill-red-500 text-red-500" : ""
                }`}
              />
              Save
            </Button>
          </div>
        </div>

        {/* Title and basic info */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {property.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
              <span className="font-medium">
                {property.ratings?.overall?.toFixed(1) || "New"}
              </span>
              {property.reviewCount > 0 && (
                <span className="ml-1">({property.reviewCount} reviews)</span>
              )}
            </div>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              <span>
                {property.location.city}, {property.location.state},{" "}
                {property.location.country}
              </span>
            </div>
          </div>
        </div>

        {/* Photo Gallery */}
        <div className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 rounded-xl overflow-hidden">
            {/* Main Image */}
            <div className="relative aspect-[4/3] lg:row-span-2">
              {primaryImage && (
                <img
                  src={primaryImage.url}
                  alt={property.title}
                  className="w-full h-full object-cover cursor-pointer hover:brightness-90 transition-all"
                  onClick={() => setShowAllPhotos(true)}
                />
              )}
            </div>

            {/* Other Images */}
            <div className="grid grid-cols-2 gap-2">
              {otherImages.slice(0, 4).map((image, index) => (
                <div key={index} className="relative aspect-square">
                  <img
                    src={image.url}
                    alt={`${property.title} ${index + 2}`}
                    className="w-full h-full object-cover cursor-pointer hover:brightness-90 transition-all"
                    onClick={() => setShowAllPhotos(true)}
                  />
                  {index === 3 && otherImages.length > 4 && (
                    <div
                      className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer text-white font-semibold"
                      onClick={() => setShowAllPhotos(true)}
                    >
                      +{otherImages.length - 3} more
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {property.images?.length > 5 && (
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setShowAllPhotos(true)}
            >
              Show all {property.images.length} photos
            </Button>
          )}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Property Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Property Overview */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">
                    {property.roomType?.replace("_", " ")} hosted by{" "}
                    {property.host?.firstName}
                  </h2>
                  <div className="flex items-center space-x-4 text-gray-600">
                    <span className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {property.accommodates} guests
                    </span>
                    <span className="flex items-center">
                      <Bed className="h-4 w-4 mr-1" />
                      {property.bedrooms} bedrooms
                    </span>
                    <span className="flex items-center">
                      <Bath className="h-4 w-4 mr-1" />
                      {property.bathrooms} bathrooms
                    </span>
                  </div>
                </div>
                <Avatar className="h-12 w-12">
                  <AvatarImage src={property.host?.avatar} />
                  <AvatarFallback>
                    {property.host?.firstName?.[0]}
                    {property.host?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
              </div>

              <Badge variant="secondary" className="mb-4 capitalize">
                {property.propertyType?.replace("_", " ")}
              </Badge>
            </div>

            <Separator />

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                About this place
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {property.description}
              </p>
            </div>

            <Separator />

            {/* Amenities */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                What this place offers
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {property.amenities?.map((amenity) => (
                  <div key={amenity} className="flex items-center space-x-3">
                    <div className="text-gray-400">
                      {amenityIcons[amenity] || (
                        <span>{getAmenityIcon(amenity)}</span>
                      )}
                    </div>
                    <span className="text-gray-700 capitalize">
                      {amenity.replace("_", " ")}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Location */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Where you'll be
              </h3>
              <div className="space-y-3">
                <p className="text-gray-600">
                  {property.location.address}, {property.location.city},{" "}
                  {property.location.state} {property.location.zipCode}
                </p>
                {/* Here you could add a map component */}
                <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">Map would go here</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Reviews */}
            <ReviewSection propertyId={property._id} />
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-32">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-baseline space-x-2">
                    <span className="text-2xl font-bold">
                      {formatPrice(property.pricing?.basePrice)}
                    </span>
                    <span className="text-base font-normal text-gray-600">
                      per night
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <BookingForm
                    property={property}
                    onBookingSuccess={() => navigate("/bookings")}
                  />
                </CardContent>
              </Card>

              {/* Host Info Card */}
              <Card className="mt-6">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={property.host?.avatar} />
                      <AvatarFallback>
                        {property.host?.firstName?.[0]}
                        {property.host?.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {property.host?.firstName} {property.host?.lastName}
                      </h4>
                      <p className="text-sm text-gray-600">Host</p>
                    </div>
                  </div>

                  {property.host?.bio && (
                    <p className="text-sm text-gray-600 mb-4">
                      {property.host.bio}
                    </p>
                  )}

                  <Button variant="outline" className="w-full">
                    Contact Host
                  </Button>
                </CardContent>
              </Card>

              {/* Report Listing */}
              <div className="mt-6 text-center">
                <Button variant="ghost" size="sm" className="text-gray-500">
                  <Flag className="h-4 w-4 mr-2" />
                  Report this listing
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
