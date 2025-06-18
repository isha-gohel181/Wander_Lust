// client/src/components/booking/BookingCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Calendar, Users, MapPin, Clock, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatPrice, formatDateRange, formatTimeAgo } from "@/utils/helpers";
import { BOOKING_STATUS } from "@/utils/constants";

const BookingCard = ({ booking, onStatusUpdate, userRole = "guest" }) => {
  const status = BOOKING_STATUS[booking.status] || BOOKING_STATUS.pending;
  const isGuest = userRole === "guest";
  const canCancel =
    booking.status === "pending" || booking.status === "confirmed";
  const canConfirm = !isGuest && booking.status === "pending";

  const handleStatusUpdate = (newStatus) => {
    onStatusUpdate?.(booking._id, newStatus);
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <Link
              to={`/property/${booking.property._id}`}
              className="text-lg font-semibold text-gray-900 hover:text-wanderlust-600 transition-colors"
            >
              {booking.property.title}
            </Link>
            <div className="flex items-center text-sm text-gray-600 mt-1">
              <MapPin className="h-3 w-3 mr-1" />
              <span>
                {booking.property.location.city},{" "}
                {booking.property.location.state}
              </span>
            </div>
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
        {booking.property.images?.[0] && (
          <div className="aspect-[16/9] rounded-lg overflow-hidden">
            <img
              src={booking.property.images[0].url}
              alt={booking.property.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Booking Details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{formatDateRange(booking.checkIn, booking.checkOut)}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Users className="h-4 w-4 mr-2" />
            <span>
              {booking.guests.adults +
                booking.guests.children +
                booking.guests.infants}{" "}
              guests
            </span>
          </div>
          <div className="flex items-center text-gray-600">
            {/* <IndianRupee className="h-4 w-4 mr-2" /> */}
            <span>{formatPrice(booking.pricing.total)}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Clock className="h-4 w-4 mr-2" />
            <span>{formatTimeAgo(booking.createdAt)}</span>
          </div>
        </div>

        {/* Guest/Host Info */}
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <img
            src={isGuest ? booking.host?.avatar : booking.guest?.avatar}
            alt={isGuest ? booking.host?.firstName : booking.guest?.firstName}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <div className="font-medium text-gray-900">
              {isGuest ? (
                <>
                  Hosted by {booking.host?.firstName} {booking.host?.lastName}
                </>
              ) : (
                <>
                  Guest: {booking.guest?.firstName} {booking.guest?.lastName}
                </>
              )}
            </div>
            <div className="text-sm text-gray-600">
              {isGuest ? "Host" : "Guest"}
            </div>
          </div>
        </div>

        {/* Special Requests */}
        {booking.specialRequests && (
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Special Requests</h4>
            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
              {booking.specialRequests}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        {canCancel || canConfirm ? (
          <div className="flex space-x-2 pt-2">
            {canConfirm && (
              <Button
                onClick={() => handleStatusUpdate("confirmed")}
                className="flex-1 bg-green-600 hover:bg-green-700"
                size="sm"
              >
                Confirm Booking
              </Button>
            )}
            {canCancel && (
              <Button
                onClick={() =>
                  handleStatusUpdate(
                    isGuest ? "cancelled_by_guest" : "cancelled_by_host"
                  )
                }
                variant="outline"
                className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                size="sm"
              >
                Cancel
              </Button>
            )}
          </div>
        ) : (
          <div className="pt-2">
            <Link to={`/property/${booking.property._id}`}>
              <Button variant="outline" className="w-full" size="sm">
                View Property
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BookingCard;
