//client/src/pages/Booking.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBookings } from "@/hooks/useBookings";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { formatPrice, formatDate } from "@/utils/helpers";
import {
  Calendar,
  Users,
  Clock,
  ExternalLink,
  MapPin,
  IndianRupee,
  AlertCircle,
  Search,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

const BookingCard = ({ booking }) => {
  const navigate = useNavigate();

  // Safe property access with fallbacks
  const property = booking?.property || {};
  const guests = booking?.guests || { adults: 0, children: 0, infants: 0 };
  const payment = booking?.payment || {};

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "refunded":
        return "bg-purple-100 text-purple-800";
      case "payment_failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatStatus = (status) => {
    if (!status) return "Unknown";
    return status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, " ");
  };

  const handleViewProperty = () => {
    if (property._id) {
      navigate(`/property/${property._id}`);
    } else {
      toast.error("Property details not available");
    }
  };

  const handleCancelBooking = () => {
    // Add your cancel booking logic here
    toast.success("Booking cancelled successfully");
  };

  // Check if cancellation is allowed
  const canCancel = ["pending", "confirmed"].includes(booking?.status);

  // Calculate total guests
  const totalGuests = guests.adults + guests.children;
  const guestText =
    totalGuests > 0
      ? `${totalGuests} guest${totalGuests !== 1 ? "s" : ""}${
          guests.infants > 0
            ? ` + ${guests.infants} infant${guests.infants !== 1 ? "s" : ""}`
            : ""
        }`
      : "No guest info";

  // Get location string
  const locationText = property.location
    ? `${property.location.city || ""}${
        property.location.city && property.location.state ? ", " : ""
      }${property.location.state || ""}`
    : "Location not available";

  return (
    <Card className="mb-4 hover:shadow-md transition-shadow">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row">
          {/* Property Image */}
          <div className="sm:w-1/3 md:w-1/4 mb-4 sm:mb-0 sm:mr-4 md:mr-6">
            {property.images && property.images[0]?.url ? (
              <img
                src={property.images[0].url}
                alt={property.title || "Property"}
                className="w-full h-40 sm:h-28 md:h-32 object-cover rounded-lg"
                loading="lazy"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
            ) : null}
            <div
              className={`w-full h-40 sm:h-28 md:h-32 bg-gray-200 rounded-lg flex items-center justify-center ${
                property.images && property.images[0]?.url ? "hidden" : ""
              }`}
            >
              <span className="text-gray-500 text-sm">No image available</span>
            </div>
          </div>

          {/* Booking Details */}
          <div className="sm:w-2/3 md:w-3/4 flex flex-col flex-1">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-0">
              <div className="space-y-2 flex-1">
                {/* Property Title and Location */}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 line-clamp-1">
                    {property.title || "Property name not available"}
                  </h3>
                  {locationText !== "Location not available" && (
                    <div className="flex items-center text-xs sm:text-sm text-gray-600 mt-0.5">
                      <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      <span className="line-clamp-1">{locationText}</span>
                    </div>
                  )}
                </div>

                {/* Status Badge */}
                <div className="flex items-center flex-wrap gap-2">
                  <Badge className={getStatusColor(booking?.status)}>
                    {formatStatus(booking?.status)}
                  </Badge>

                  {payment.status && (
                    <Badge className={getStatusColor(payment.status)}>
                      Payment: {formatStatus(payment.status)}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Price */}
              <div className="flex-none text-right">
                <div className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center sm:justify-end">
                  {/* <IndianRupee className="h-4 w-4 sm:h-5 sm:w-5 mr-1" /> */}
                  {booking?.totalAmount || booking?.pricing?.total
                    ? formatPrice(
                        booking.totalAmount || booking.pricing.total,
                        "INR"
                      )
                    : "N/A"}
                </div>
                {booking?.pricing && booking.pricing.nights && (
                  <div className="text-xs sm:text-sm text-gray-500 mt-0.5">
                    {booking.pricing.nights} night
                    {booking.pricing.nights !== 1 ? "s" : ""}
                  </div>
                )}
              </div>
            </div>

            {/* Booking Information Grid */}
            <div className="grid grid-cols-2 gap-y-2 gap-x-3 mt-3 text-xs sm:text-sm text-gray-600">
              <div className="flex items-center">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 text-gray-400 flex-shrink-0" />
                <span className="line-clamp-1">
                  Check-in:{" "}
                  {booking?.checkIn ? formatDate(booking.checkIn) : "N/A"}
                </span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 text-gray-400 flex-shrink-0" />
                <span className="line-clamp-1">
                  Check-out:{" "}
                  {booking?.checkOut ? formatDate(booking.checkOut) : "N/A"}
                </span>
              </div>
              <div className="flex items-center">
                <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 text-gray-400 flex-shrink-0" />
                <span className="line-clamp-1">{guestText}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 text-gray-400 flex-shrink-0" />
                <span className="line-clamp-1">
                  Booked:{" "}
                  {booking?.createdAt ? formatDate(booking.createdAt) : "N/A"}
                </span>
              </div>
            </div>

            {/* Payment Details */}
            {payment.orderId && (
              <div className="text-xs sm:text-sm text-gray-600 mt-2">
                <span className="font-medium">Order ID:</span>{" "}
                <span className="font-mono">{payment.orderId}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleViewProperty}
                className="flex-1 text-xs sm:text-sm h-8 sm:h-9"
                disabled={!property._id}
              >
                <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                View Property
              </Button>

              {canCancel && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCancelBooking}
                  className="flex-1 text-xs sm:text-sm h-8 sm:h-9 border-red-200 text-red-600 hover:bg-red-50"
                >
                  <X className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                  Cancel Booking
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Bookings = () => {
  const navigate = useNavigate();
  const { bookings, loading, error } = useBookings();
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Loading State
  if (loading) {
    return (
      <div className="p-4 sm:p-6 max-w-6xl mx-auto">
        <div className="mb-6">
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse mb-4"></div>
          <div className="h-10 bg-gray-200 rounded w-full animate-pulse"></div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-48 bg-gray-200 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="p-4 sm:p-6 max-w-6xl mx-auto">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Failed to load bookings: {error}</AlertDescription>
        </Alert>
        <div className="text-center">
          <Button
            onClick={() => navigate("/search")}
            className="flex items-center"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Explore Properties
          </Button>
        </div>
      </div>
    );
  }

  // Filter bookings based on active tab and search term
  const filteredBookings = (bookings || []).filter((booking) => {
    if (!booking) return false;

    // Search filter
    const searchFields = [
      booking?.property?.title || "",
      booking?.property?.location?.city || "",
      booking?.property?.location?.state || "",
    ]
      .join(" ")
      .toLowerCase();

    const matchesSearch =
      searchTerm === "" || searchFields.includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    // Tab filter
    switch (activeTab) {
      case "all":
        return true;
      case "upcoming":
        return (
          booking.checkIn &&
          new Date(booking.checkIn) >= new Date() &&
          booking.status !== "cancelled"
        );
      case "past":
        return (
          booking.status === "completed" ||
          booking.status === "cancelled" ||
          (booking.checkOut && new Date(booking.checkOut) < new Date())
        );
      default:
        return true;
    }
  });

  // Get tab counts
  const getTabCount = (tabType) => {
    return (bookings || []).filter((booking) => {
      if (!booking) return false;
      switch (tabType) {
        case "upcoming":
          return (
            booking.checkIn &&
            new Date(booking.checkIn) >= new Date() &&
            booking.status !== "cancelled"
          );
        case "past":
          return (
            booking.status === "completed" ||
            booking.status === "cancelled" ||
            (booking.checkOut && new Date(booking.checkOut) < new Date())
          );
        default:
          return true;
      }
    }).length;
  };

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
        My Bookings
      </h1>

      {/* Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search by property name or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-10"
        />
      </div>

      {/* Simplified Tabs */}
      <Tabs
        defaultValue="all"
        value={activeTab}
        onValueChange={setActiveTab}
        className="mb-4"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all" className="relative">
            All
            {bookings && bookings.length > 0 && (
              <span className="ml-2 bg-gray-200 text-gray-700 text-xs px-1.5 py-0.5 rounded-full">
                {bookings.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="relative">
            Upcoming
            {getTabCount("upcoming") > 0 && (
              <span className="ml-2 bg-blue-100 text-blue-700 text-xs px-1.5 py-0.5 rounded-full">
                {getTabCount("upcoming")}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="past" className="relative">
            Past
            {getTabCount("past") > 0 && (
              <span className="ml-2 bg-gray-100 text-gray-700 text-xs px-1.5 py-0.5 rounded-full">
                {getTabCount("past")}
              </span>
            )}
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {filteredBookings.length === 0 ? (
        <div className="text-center p-6 sm:p-12 bg-gray-50 rounded-lg">
          <div className="max-w-md mx-auto">
            <Calendar className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
              {searchTerm
                ? "No bookings match your search"
                : `No ${activeTab !== "all" ? activeTab : ""} bookings found`}
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mb-6">
              {searchTerm
                ? "Try adjusting your search or clear the search field"
                : activeTab === "all"
                ? "You haven't made any bookings yet. Start exploring amazing places to stay!"
                : `You don't have any ${activeTab} bookings at the moment.`}
            </p>
            <Button
              onClick={() => {
                if (searchTerm) {
                  setSearchTerm("");
                } else {
                  navigate("/search");
                }
              }}
              className="flex items-center text-sm sm:text-base"
            >
              {searchTerm ? (
                "Clear Search"
              ) : (
                <>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Find a Place to Stay
                </>
              )}
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <BookingCard key={booking._id || Math.random()} booking={booking} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookings;
