// client/src/components/booking/BookingCard.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Users,
  MapPin,
  Clock,
  IndianRupee,
  Download,
  ExternalLink,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  formatPrice,
  formatDateRange,
  formatTimeAgo,
  formatDate,
} from "@/utils/helpers";
import { BOOKING_STATUS } from "@/utils/constants";
import toast from "react-hot-toast";

const BookingCard = ({ booking, onStatusUpdate, userRole = "guest" }) => {
  const [updating, setUpdating] = useState(false);

  const status = BOOKING_STATUS[booking.status] || BOOKING_STATUS.pending;
  const isGuest = userRole === "guest";
  const canCancel = ["pending", "confirmed"].includes(booking.status);
  const canConfirm = !isGuest && booking.status === "pending";
  const canDownloadReceipt = ["confirmed", "completed"].includes(
    booking.status
  );

  const handleStatusUpdate = async (newStatus) => {
    if (updating) return;

    setUpdating(true);
    try {
      await onStatusUpdate?.(booking._id, newStatus);
      toast.success(
        `Booking ${
          newStatus === "confirmed" ? "confirmed" : "cancelled"
        } successfully`
      );
    } catch (error) {
      toast.error("Failed to update booking status");
    } finally {
      setUpdating(false);
    }
  };

  const handleDownloadReceipt = () => {
    // Add receipt download logic here
    toast.success("Receipt download started");
  };

  // Safe data access
  const property = booking.property || {};
  const location = property.location || {};
  const guests = booking.guests || { adults: 0, children: 0, infants: 0 };
  const user = isGuest
    ? booking.host || {}
    : booking.user || booking.guest || {};

  const totalGuests = guests.adults + guests.children + guests.infants;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <Link
              to={`/property/${property._id}`}
              className="text-lg font-semibold text-gray-900 hover:text-wanderlust-600 transition-colors"
            >
              {property.title || "Property name not available"}
            </Link>
            {(location.city || location.state) && (
              <div className="flex items-center text-sm text-gray-600 mt-1">
                <MapPin className="h-3 w-3 mr-1" />
                <span>
                  {location.city}
                  {location.city && location.state && ", "}
                  {location.state}
                </span>
              </div>
            )}
          </div>
          <Badge
            variant="secondary"
            className={`
              ${status.color === "green" && "bg-green-100 text-green-800"}
              ${status.color === "yellow" && "bg-yellow-100 text-yellow-800"}
              ${status.color === "red" && "bg-red-100 text-red-800"}
              ${status.color === "blue" && "bg-blue-100 text-blue-800"}
              ${status.color === "gray" && "bg-gray-100 text-gray-800"}
            `}
          >
            {status.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Property Image */}
        {property.images?.[0]?.url && (
          <div className="aspect-[16/9] rounded-lg overflow-hidden">
            <img
              src={property.images[0].url}
              alt={property.title || "Property"}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
            />
            <div className="w-full h-full bg-gray-200 rounded-lg hidden items-center justify-center">
              <span className="text-gray-500 text-sm">No image available</span>
            </div>
          </div>
        )}

        {/* Booking Details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center text-gray-600">
            <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="truncate">
              {booking.checkIn && booking.checkOut
                ? formatDateRange(booking.checkIn, booking.checkOut)
                : "Dates not available"}
            </span>
          </div>
          <div className="flex items-center text-gray-600">
            <Users className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>
              {totalGuests > 0
                ? `${totalGuests} guest${totalGuests !== 1 ? "s" : ""}`
                : "No guest info"}
            </span>
          </div>
          <div className="flex items-center text-gray-600">
            <IndianRupee className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>
              {booking.totalAmount || booking.pricing?.total
                ? formatPrice(
                    booking.totalAmount || booking.pricing.total,
                    "INR"
                  )
                : "Amount not available"}
            </span>
          </div>
          <div className="flex items-center text-gray-600">
            <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>
              {booking.createdAt
                ? formatTimeAgo(booking.createdAt)
                : "Date not available"}
            </span>
          </div>
        </div>

        {/* Guest/Host Info */}
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <div className="w-10 h-10 rounded-full bg-wanderlust-100 flex items-center justify-center">
            <Users className="h-5 w-5 text-wanderlust-600" />
          </div>
          <div className="flex-1">
            <div className="font-medium text-gray-900">
              {isGuest ? (
                <>Hosted by {user.firstName || user.name || "Host"}</>
              ) : (
                <>
                  Guest: {user.firstName || user.name || user.email || "Guest"}
                </>
              )}
            </div>
            <div className="text-sm text-gray-600">
              {user.email || (isGuest ? "Host" : "Guest")}
            </div>
          </div>
        </div>

        {/* Special Requests */}
        {booking.specialRequests && (
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Special Requests</h4>
            <p className="text-sm text-gray-600 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
              {booking.specialRequests}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 pt-2">
          {canConfirm && (
            <Button
              onClick={() => handleStatusUpdate("confirmed")}
              disabled={updating}
              className="flex-1 min-w-[120px] bg-green-600 hover:bg-green-700"
              size="sm"
            >
              {updating ? "Updating..." : "Confirm"}
            </Button>
          )}

          {canDownloadReceipt && (
            <Button
              onClick={handleDownloadReceipt}
              variant="outline"
              className="flex-1 min-w-[120px] border-blue-200 text-blue-600 hover:bg-blue-50"
              size="sm"
            >
              <Download className="h-4 w-4 mr-2" />
              Receipt
            </Button>
          )}

          <Button
            asChild
            variant="outline"
            className="flex-1 min-w-[120px]"
            size="sm"
          >
            <Link to={`/property/${property._id}`}>
              <ExternalLink className="h-4 w-4 mr-2" />
              View Property
            </Link>
          </Button>

          {canCancel && (
            <Button
              onClick={() =>
                handleStatusUpdate(
                  isGuest ? "cancelled_by_guest" : "cancelled_by_host"
                )
              }
              disabled={updating}
              variant="outline"
              className="flex-1 min-w-[120px] border-red-200 text-red-600 hover:bg-red-50"
              size="sm"
            >
              <X className="h-4 w-4 mr-2" />
              {updating ? "Updating..." : "Cancel"}
            </Button>
          )}
        </div>

        {/* Booking ID for reference */}
        <div className="text-xs text-gray-500 pt-2 border-t">
          Booking ID: {booking._id || "Not available"}
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingCard;
