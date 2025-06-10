// client/src/components/booking/BookingForm.jsx
import React, { useState } from "react";
import { Calendar, Users, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useBookings } from "@/hooks/useBookings";
import { useAuth } from "@/hooks/useAuth";
import {
  formatPrice,
  formatDate,
  calculateNights,
  calculateTotalPrice,
} from "@/utils/helpers";
import { format } from "date-fns";
import toast from "react-hot-toast";

const BookingForm = ({ property, onBookingSuccess }) => {
  const { user } = useAuth();
  const { createBooking } = useBookings();
  const [loading, setLoading] = useState(false);
  const [bookingData, setBookingData] = useState({
    checkIn: null,
    checkOut: null,
    guests: {
      adults: 1,
      children: 0,
      infants: 0,
    },
    specialRequests: "",
  });

  const nights = calculateNights(bookingData.checkIn, bookingData.checkOut);
  const pricing =
    nights > 0
      ? calculateTotalPrice(
          property.pricing.basePrice,
          nights,
          property.pricing.cleaningFee
        )
      : null;

  const updateGuests = (type, increment) => {
    setBookingData((prev) => ({
      ...prev,
      guests: {
        ...prev.guests,
        [type]: Math.max(0, prev.guests[type] + increment),
      },
    }));
  };

  const totalGuests =
    bookingData.guests.adults +
    bookingData.guests.children +
    bookingData.guests.infants;

  const isFormValid = () => {
    return (
      bookingData.checkIn &&
      bookingData.checkOut &&
      bookingData.checkIn < bookingData.checkOut &&
      totalGuests > 0 &&
      totalGuests <= property.accommodates &&
      user
    );
  };

  const handleBooking = async () => {
    if (!isFormValid()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const booking = await createBooking({
        propertyId: property._id,
        checkIn: bookingData.checkIn,
        checkOut: bookingData.checkOut,
        guests: bookingData.guests,
        specialRequests: bookingData.specialRequests,
      });

      toast.success("Booking request submitted successfully!");
      onBookingSuccess?.(booking);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center p-6">
        <p className="text-gray-600 mb-4">
          Please sign in to book this property
        </p>
        <Button className="w-full bg-wanderlust-500 hover:bg-wanderlust-600">
          Sign In to Book
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Date Selection */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="checkin">Check-in</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <Calendar className="mr-2 h-4 w-4" />
                {bookingData.checkIn
                  ? format(bookingData.checkIn, "MMM dd")
                  : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={bookingData.checkIn}
                onSelect={(date) =>
                  setBookingData((prev) => ({ ...prev, checkIn: date }))
                }
                disabled={(date) => date < new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <Label htmlFor="checkout">Check-out</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <Calendar className="mr-2 h-4 w-4" />
                {bookingData.checkOut
                  ? format(bookingData.checkOut, "MMM dd")
                  : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={bookingData.checkOut}
                onSelect={(date) =>
                  setBookingData((prev) => ({ ...prev, checkOut: date }))
                }
                disabled={(date) =>
                  date < bookingData.checkIn || date < new Date()
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Guest Selection */}
      <div>
        <Label>Guests</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal"
            >
              <Users className="mr-2 h-4 w-4" />
              {totalGuests === 1 ? "1 guest" : `${totalGuests} guests`}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Adults</div>
                  <div className="text-sm text-gray-500">Ages 13 or above</div>
                </div>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateGuests("adults", -1)}
                    disabled={bookingData.guests.adults <= 1}
                    className="h-8 w-8 p-0"
                  >
                    -
                  </Button>
                  <span className="w-8 text-center">
                    {bookingData.guests.adults}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateGuests("adults", 1)}
                    disabled={totalGuests >= property.accommodates}
                    className="h-8 w-8 p-0"
                  >
                    +
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Children</div>
                  <div className="text-sm text-gray-500">Ages 2-12</div>
                </div>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateGuests("children", -1)}
                    disabled={bookingData.guests.children <= 0}
                    className="h-8 w-8 p-0"
                  >
                    -
                  </Button>
                  <span className="w-8 text-center">
                    {bookingData.guests.children}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateGuests("children", 1)}
                    disabled={totalGuests >= property.accommodates}
                    className="h-8 w-8 p-0"
                  >
                    +
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Infants</div>
                  <div className="text-sm text-gray-500">Under 2</div>
                </div>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateGuests("infants", -1)}
                    disabled={bookingData.guests.infants <= 0}
                    className="h-8 w-8 p-0"
                  >
                    -
                  </Button>
                  <span className="w-8 text-center">
                    {bookingData.guests.infants}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateGuests("infants", 1)}
                    className="h-8 w-8 p-0"
                  >
                    +
                  </Button>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {totalGuests > property.accommodates && (
          <p className="text-sm text-red-600 mt-1">
            This property accommodates up to {property.accommodates} guests
          </p>
        )}
      </div>

      {/* Special Requests */}
      <div>
        <Label htmlFor="requests">Special Requests (Optional)</Label>
        <Textarea
          id="requests"
          placeholder="Any special requests or questions for the host?"
          value={bookingData.specialRequests}
          onChange={(e) =>
            setBookingData((prev) => ({
              ...prev,
              specialRequests: e.target.value,
            }))
          }
          className="mt-1"
        />
      </div>

      {/* Price Breakdown */}
      {pricing && (
        <div className="space-y-3">
          <Separator />
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>
                {formatPrice(property.pricing.basePrice)} × {nights} nights
              </span>
              <span>{formatPrice(pricing.subtotal)}</span>
            </div>

            {pricing.cleaningFee > 0 && (
              <div className="flex justify-between">
                <span>Cleaning fee</span>
                <span>{formatPrice(pricing.cleaningFee)}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Service fee</span>
              <span>{formatPrice(pricing.serviceFee)}</span>
            </div>

            <div className="flex justify-between">
              <span>Taxes</span>
              <span>{formatPrice(pricing.taxes)}</span>
            </div>
          </div>

          <Separator />

          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>{formatPrice(pricing.total)}</span>
          </div>
        </div>
      )}

      {/* Book Button */}
      <Button
        onClick={handleBooking}
        disabled={!isFormValid() || loading}
        className="w-full bg-wanderlust-500 hover:bg-wanderlust-600"
        size="lg"
      >
        {loading ? "Processing..." : "Request to Book"}
      </Button>

      <p className="text-xs text-gray-500 text-center">
        You won't be charged yet. The host will review your request.
      </p>
    </div>
  );
};

export default BookingForm;
