//client/src/components/booking/BookigForm.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Users,
  CreditCard,
  Info,
  Shield,
  ArrowRight,
} from "lucide-react";
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
import CashfreePayment from "@/components/payment/CashfreePayment";

const BookingForm = ({ property, onBookingSuccess }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createBooking } = useBookings();
  const [loading, setLoading] = useState(false);
  const [createdBooking, setCreatedBooking] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
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
  const serviceFee =
    nights > 0 ? Math.round(property.pricing.basePrice * nights * 0.14) : 0;
  const pricing =
    nights > 0
      ? calculateTotalPrice(
          property.pricing.basePrice,
          nights,
          property.pricing.cleaningFee,
          serviceFee // Include the service fee here
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

  // Frontend - add to BookingForm.jsx
  if (pricing) {
    console.log("FRONTEND pricing breakdown:", {
      basePrice: property.pricing.basePrice,
      nights,
      subtotal: property.pricing.basePrice * nights,
      cleaningFee: property.pricing.cleaningFee || 0,
      serviceFee: Math.round(property.pricing.basePrice * nights * 0.14),
      taxes: Math.round(
        (property.pricing.basePrice * nights +
          (property.pricing.cleaningFee || 0) +
          Math.round(property.pricing.basePrice * nights * 0.14)) *
          0.08
      ),
      total: pricing.total,
    });
  }

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
        totalAmount: pricing.total,
      });

      setCreatedBooking(booking);
      setShowPayment(true);
      toast.success("Booking created! Proceed with payment.");
    } catch (error) {
      toast.error(error.message || "Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  // Fixed: Navigate to bookings page after successful payment
  const handlePaymentSuccess = (updatedBooking) => {
    toast.success("Payment successful!");

    // Navigate to bookings page after successful payment
    setTimeout(() => {
      navigate("/bookings");
    }, 2000); // Give user time to see the success message

    // Also call the onBookingSuccess callback if provided
    if (onBookingSuccess) {
      onBookingSuccess(updatedBooking);
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

  if (showPayment && createdBooking) {
    return (
      <div className="space-y-6 relative">
        {/* Booking Summary */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">Booking Summary</h3>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-7 px-2"
              onClick={() => setShowPayment(false)}
            >
              Edit Booking
            </Button>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Check-in:</span>
              <span>
                {format(new Date(createdBooking.checkIn), "MMM dd, yyyy")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Check-out:</span>
              <span>
                {format(new Date(createdBooking.checkOut), "MMM dd, yyyy")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Guests:</span>
              <span>
                {totalGuests} {totalGuests === 1 ? "guest" : "guests"}
              </span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between font-semibold">
              <span>Total:</span>
              <span>{formatPrice(pricing.total)}</span>
            </div>
          </div>
        </div>

        {/* Secure Payment Badge */}
        {/* <div className="flex items-center justify-center bg-blue-50 p-3 rounded-lg border border-blue-100">
          <Shield className="h-4 w-4 text-blue-600 mr-2" />
          <span className="text-sm text-blue-800">
            Secure payment processing via Cashfree
          </span>
        </div> */}

        {/* Success Message */}
        {/* <div className="bg-green-50 p-3 rounded-lg border border-green-200">
          <p className="text-sm text-green-700">
            After payment completion, you'll be redirected to your bookings
            page.
          </p>
        </div> */}

        {/* Cashfree Payment Component */}
        <CashfreePayment
          booking={createdBooking}
          onSuccess={handlePaymentSuccess}
          onClose={() => setShowPayment(false)}
        />
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
            <PopoverContent className="w-auto p-0 " align="start">
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
                <div className="flex items-center">
                  <span>Cleaning fee</span>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 ml-1"
                      >
                        <Info className="h-3 w-3" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-60">
                      <p className="text-xs text-gray-600">
                        One-time fee charged by host to cover the cost of
                        cleaning their space.
                      </p>
                    </PopoverContent>
                  </Popover>
                </div>
                <span>{formatPrice(pricing.cleaningFee)}</span>
              </div>
            )}

            <div className="flex justify-between">
              <div className="flex items-center">
                <span>Service fee</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 ml-1"
                    >
                      <Info className="h-3 w-3" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-60">
                    <p className="text-xs text-gray-600">
                      This helps us run our platform and offer services like
                      24/7 support.
                    </p>
                  </PopoverContent>
                </Popover>
              </div>
              <span>{formatPrice(pricing.serviceFee)}</span>
            </div>

            <div className="flex justify-between">
              <div className="flex items-center">
                <span>Taxes</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 ml-1"
                    >
                      <Info className="h-3 w-3" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-60">
                    <p className="text-xs text-gray-600">
                      Local taxes required by law. May include VAT, GST, and
                      other applicable taxes.
                    </p>
                  </PopoverContent>
                </Popover>
              </div>
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
        className="w-full bg-wanderlust-500 hover:bg-wanderlust-600 group"
        size="lg"
      >
        {loading ? (
          "Processing..."
        ) : (
          <div className="flex items-center justify-center w-full">
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Book Now</span>
            <ArrowRight className="h-4 w-4 ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
          </div>
        )}
      </Button>

      {/* Payment Trust Indicators */}
      <div className="flex flex-col space-y-2">
        <p className="text-xs text-gray-500 text-center">
          You won't be charged until your booking is confirmed.
        </p>

        <div className="flex items-center justify-center space-x-4 mt-2">
          <img
            src="https://cdn.iconscout.com/icon/free/png-256/free-visa-3-226460.png"
            alt="Visa"
            className="h-5 opacity-70"
          />
          <img
            src="https://cdn.iconscout.com/icon/free/png-256/free-mastercard-3-226450.png"
            alt="Mastercard"
            className="h-5 opacity-70"
          />
          <img
            src="https://cdn.iconscout.com/icon/free/png-256/free-american-express-51-675738.png"
            alt="Amex"
            className="h-5 opacity-70"
          />
          <img
            src="https://cdn.iconscout.com/icon/free/png-256/free-paypal-34-226455.png"
            alt="PayPal"
            className="h-5 opacity-70"
          />
        </div>

        <div className="flex items-center justify-center text-xs text-gray-500 mt-1">
          <Shield className="h-3 w-3 mr-1" />
          <span>Secure payment processing</span>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
