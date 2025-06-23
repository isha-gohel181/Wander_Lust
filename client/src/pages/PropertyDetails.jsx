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
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BookingForm from "@/components/booking/BookingForm";
import ReviewSection from "@/components/reviews/ReviewSection";
import ReviewForm from "@/components/reviews/ReviewForm";
import StarRating from "@/components/reviews/StarRating";
import LeafletMap from "@/components/map/LeafletMap";
import MapError from "@/components/map/MapError";
import { reviewService } from "@/services/reviews";
import { useProperty } from "@/hooks/useProperty";
import { useWishlist } from "@/hooks/useWishlist";
import { useAuth } from "@/hooks/useAuth";
import { formatPrice, getAmenityIcon } from "@/utils/helpers";
import PropertyImageGallery from "@/components/property/PropertyImageGallery";
import ContactHostModal from "@/components/messages/ContactHostModal";
import toast from "react-hot-toast";
import { useUser, SignInButton } from "@clerk/clerk-react";

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { property, loading, error } = useProperty(id);

  // Always call hooks at the top level - no conditional hook calls
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [mapError, setMapError] = React.useState(null);
  const [isMapLoading, setIsMapLoading] = React.useState(false);

  // Only determine userIsHost if user is loaded and property is loaded
  const userIsHost = user && property && user._id === property.host._id;

  // Only check bookings if user is authenticated and has bookings data
  const hasStayedAtProperty =
    user &&
    user.bookings?.some(
      (b) => b.propertyId === property?._id && b.status === "completed"
    );

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

    if (authLoading) {
      toast.error("Please wait while we load your account");
      return;
    }

    if (!property?._id) {
      toast.error("Property not found");
      return;
    }

    try {
      await toggleWishlist(property._id);
      toast.success(
        isInWishlist(property._id)
          ? "Removed from wishlist"
          : "Added to wishlist"
      );
    } catch (error) {
      console.error("Wishlist toggle error:", error);
      toast.error("Failed to update wishlist");
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

  // Show loading state while property is loading
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

  // Show error state only if property fetch failed (not auth-related)
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
            <Button
              variant="ghost"
              size="sm"
              onClick={handleWishlistToggle}
              disabled={authLoading}
              title={user ? undefined : "Sign in to save"}
            >
              <Heart
                className={`h-4 w-4 mr-2 ${
                  user && !authLoading && property && isInWishlist(property._id)
                    ? "fill-red-500 text-red-500"
                    : ""
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
                  onClick={() => setShowGallery(true)}
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
                    onClick={() => setShowGallery(true)}
                  />
                  {index === 3 && otherImages.length > 4 && (
                    <div
                      className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer text-white font-semibold"
                      onClick={() => setShowGallery(true)}
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
              onClick={() => setShowGallery(true)}
            >
              Show all {property.images.length} photos
            </Button>
          )}

          {/* Image Gallery Modal */}
          {showGallery && (
            <PropertyImageGallery
              images={property.images}
              onClose={() => setShowGallery(false)}
            />
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
                <div className="h-[400px] rounded-lg overflow-hidden relative">
                  {property.location?.coordinates ? (
                    <LeafletMap
                      center={{
                        lat: property.location.coordinates.lat,
                        lng: property.location.coordinates.lng,
                      }}
                      markerPosition={{
                        lat: property.location.coordinates.lat,
                        lng: property.location.coordinates.lng,
                      }}
                      zoom={15}
                      draggable={false}
                    />
                  ) : (
                    <MapError message="Property location not available" />
                  )}
                  {isMapLoading && (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                      <div className="text-gray-600">Loading map...</div>
                    </div>
                  )}
                </div>

                {mapError && (
                  <Alert variant="destructive">
                    <AlertDescription>{mapError}</AlertDescription>
                  </Alert>
                )}
              </div>
            </div>

            <Separator className="my-8" />

            <div className="space-y-6">
              {/* Review Header with Summary */}
              <div className="flex flex-col space-y-2 md:space-y-0 md:flex-row md:justify-between md:items-center">
                <h2 className="text-xl font-semibold text-gray-900">
                  Guest Reviews
                </h2>

                <div className="flex items-center">
                  <StarRating
                    rating={property.ratings?.overall || 0}
                    showValue={true}
                    size="lg"
                  />
                  {property.reviewCount > 0 && (
                    <span className="ml-2 text-gray-600">
                      ({property.reviewCount}{" "}
                      {property.reviewCount === 1 ? "review" : "reviews"})
                    </span>
                  )}
                </div>
              </div>

              {/* Rating Categories Breakdown */}
              {property.ratings && property.reviewCount > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  {Object.entries(property.ratings)
                    .filter(([key]) => key !== "overall")
                    .map(([category, rating]) => (
                      <div
                        key={category}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm text-gray-600 capitalize">
                          {category.replace(/_/g, " ")}
                        </span>
                        <div className="flex items-center">
                          <StarRating rating={rating} size="sm" />
                          <span className="ml-2 text-sm font-medium">
                            {rating.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              )}

              {/* Review CTA for eligible users - only show if user is authenticated */}
              {user && !authLoading && !userIsHost && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h4 className="font-medium text-blue-800 mb-2">
                    Share your experience
                  </h4>
                  <p className="text-sm text-blue-600 mb-3">
                    {hasStayedAtProperty
                      ? "Thank you for staying with us! Your review helps future guests make informed decisions."
                      : "You can write a review after completing your stay at this property."}
                  </p>
                  <Button
                    variant={hasStayedAtProperty ? "default" : "outline"}
                    onClick={() => {
                      if (hasStayedAtProperty) {
                        setShowReviewForm(true);
                      } else {
                        toast.error(
                          "You can only review properties where you've completed a stay"
                        );
                      }
                    }}
                    disabled={!hasStayedAtProperty}
                  >
                    Write a review
                  </Button>
                </div>
              )}

              {/* Sign in prompt for unauthenticated users */}
              {!user && !authLoading && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 className="font-medium text-gray-800 mb-2">
                    Join the community
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Sign in to save properties, book stays, and write reviews.
                  </p>
                  <SignInButton mode="modal">
                    <Button variant="outline">Sign In</Button>
                  </SignInButton>
                </div>
              )}

              {/* Review Form Modal/Section (conditionally rendered) */}
              {showReviewForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                  <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">Write a Review</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowReviewForm(false)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <ReviewForm
                      propertyId={property._id}
                      onSubmit={async (reviewData) => {
                        try {
                          await reviewService.createReview({
                            propertyId: property._id,
                            ...reviewData,
                          });
                          setShowReviewForm(false);
                          toast.success("Your review has been submitted!");
                          // Refresh the page to show the new review
                          window.location.reload();
                        } catch (error) {
                          console.error("Failed to submit review:", error);
                          toast.error(
                            "Failed to submit your review. Please try again."
                          );
                        }
                      }}
                      onCancel={() => setShowReviewForm(false)}
                    />
                  </div>
                </div>
              )}

              {/* Review Filters */}
              {property.reviewCount > 5 && (
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" className="text-sm">
                    All Reviews
                  </Button>
                  <Button variant="outline" size="sm" className="text-sm">
                    Recent First
                  </Button>
                  <Button variant="outline" size="sm" className="text-sm">
                    Highest Rated
                  </Button>
                  <Button variant="outline" size="sm" className="text-sm">
                    With Photos
                  </Button>
                </div>
              )}

              {/* Main Review Section */}
              <ReviewSection propertyId={property._id} />
            </div>
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
                  {!user && !authLoading ? (
                    <div className="text-center py-8">
                      <p className="text-gray-600  mb-4">
                        Sign in to book this property
                      </p>
                      <SignInButton mode="modal">
                        <Button className="w-full bg-gradient-to-r from-wanderlust-500 to-wanderlust-600">
                          Sign In to Book
                        </Button>
                      </SignInButton>
                    </div>
                  ) : (
                    <BookingForm
                      property={property}
                      onBookingSuccess={() => navigate("/bookings")}
                    />
                  )}
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

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      if (!user) {
                        toast.error("Please sign in to contact the host");
                        return;
                      }
                      setShowContactModal(true);
                    }}
                  >
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
      {showContactModal && (
        <ContactHostModal
          host={property.host}
          property={property}
          onClose={() => setShowContactModal(false)}
        />
      )}
    </div>
  );
};

export default PropertyDetails;
