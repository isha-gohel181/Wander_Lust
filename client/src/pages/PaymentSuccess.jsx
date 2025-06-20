//client/src/pages/PaymentSuccess.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  CheckCircle,
  ArrowRight,
  Calendar,
  Users,
  Clock,
  IndianRupee,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { paymentService } from "@/services/payment";
import { formatPrice, formatDate } from "@/utils/helpers";
import api from "@/services/api";
import toast from "react-hot-toast";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [bookingData, setBookingData] = useState(null);

  // Enhanced URL parameter extraction
  const getUrlParams = () => {
    const searchParams = new URLSearchParams(location.search);

    return {
      orderId:
        location.state?.orderId ||
        searchParams.get("orderId") ||
        searchParams.get("order_id"),
      bookingId:
        location.state?.bookingId ||
        searchParams.get("bookingId") ||
        searchParams.get("booking_id"),
      status: location.state?.status || searchParams.get("status"),
    };
  };

  const { orderId, bookingId, status } = getUrlParams();

  useEffect(() => {
    const fetchData = async () => {
      console.log("PaymentSuccess - URL params:", {
        orderId,
        bookingId,
        status,
      });
      console.log("PaymentSuccess - Full search:", location.search);
      console.log("PaymentSuccess - Location state:", location.state);

      if (!orderId) {
        console.error("No orderId found in URL params or state");
        setError("Payment information not found - missing order ID");
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching payment status for orderId:", orderId);
        const paymentStatus = await paymentService.getPaymentStatus(orderId);
        console.log("Payment status response:", paymentStatus);

        setPaymentData(paymentStatus);

        // If we have a booking ID from payment status, fetch booking details
        const targetBookingId = paymentStatus.booking || bookingId;

        if (targetBookingId) {
          console.log("Fetching booking details for:", targetBookingId);
          try {
            // Updated API call - removed leading slash to use relative path
            const response = await fetch(`api/bookings/${targetBookingId}`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
              },
            });

            if (response.ok) {
              const data = await response.json();
              console.log("Booking data:", data);
              setBookingData(data);
            } else {
              console.warn(
                "Failed to fetch booking details:",
                response.status,
                response.statusText
              );
              // Try alternative API endpoint if the first one fails
              try {
                const altResponse = await fetch(
                  `api/user/bookings/${targetBookingId}`,
                  {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                      "Content-Type": "application/json",
                    },
                  }
                );

                if (altResponse.ok) {
                  const altData = await altResponse.json();
                  console.log(
                    "Booking data from alternative endpoint:",
                    altData
                  );
                  setBookingData(altData);
                }
              } catch (altError) {
                console.warn(
                  "Alternative booking fetch also failed:",
                  altError
                );
              }
            }
          } catch (bookingError) {
            console.warn("Error fetching booking details:", bookingError);
            // Continue without booking details - payment info is still valid
          }
        }
      } catch (err) {
        console.error("Error fetching payment details:", err);

        // Check if it's a network or API error
        if (
          err.message.includes("Failed to fetch") ||
          err.message.includes("NetworkError")
        ) {
          setError(
            "Network error - please check your connection and try again"
          );
        } else if (err.message.includes("404")) {
          setError("Payment record not found - it may still be processing");
        } else {
          setError(`Failed to load payment details: ${err.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [orderId, bookingId, location.search, location.state]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (error || !paymentData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {error || "Payment information not found"}
            </h1>
            <p className="text-gray-600 mb-6">
              {error
                ? "There was an issue loading your payment details."
                : "We couldn't find details for this payment."}
            </p>
            <div className="space-y-2">
              <Button onClick={() => navigate("/bookings")} className="w-full">
                Go to My Bookings
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/")}
                className="w-full"
              >
                Back to Home
              </Button>
              {/* Add retry button for network errors */}
              {error && error.includes("Network") && (
                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                  className="w-full"
                >
                  Retry
                </Button>
              )}
            </div>
            {/* Debug info in development */}
            {process.env.NODE_ENV === "development" && (
              <div className="mt-4 text-xs text-gray-400 text-left">
                <p>Debug Info:</p>
                <p>Order ID: {orderId || "Not found"}</p>
                <p>Booking ID: {bookingId || "Not found"}</p>
                <p>Status: {status || "Not found"}</p>
                <p>Search: {location.search}</p>
                <p>Error: {error}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Determine if payment was successful
  const isSuccessful =
    paymentData.status === "PAID" ||
    paymentData.status === "SUCCESS" ||
    paymentData.status === "paid" ||
    paymentData.status === "success";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full shadow-lg">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div
              className={`inline-flex items-center justify-center ${
                isSuccessful ? "bg-green-100" : "bg-red-100"
              } rounded-full p-3 mb-4`}
            >
              <CheckCircle
                className={`h-10 w-10 ${
                  isSuccessful ? "text-green-600" : "text-red-600"
                }`}
              />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {isSuccessful ? "Payment Successful!" : "Payment Status"}
            </h1>
            <p className="text-gray-600 text-lg">
              {isSuccessful
                ? "Your booking has been confirmed"
                : `Payment status: ${paymentData.status}`}
            </p>
          </div>

          {/* Order Details */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Order Details
                </h2>
                <p className="text-gray-600">
                  {formatDate(new Date(), "MMM dd, yyyy")}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Order ID</p>
                <p className="font-semibold">{orderId}</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Payment Status */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Payment Status</h3>
                <div
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    isSuccessful
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {paymentData.status.toUpperCase()}
                </div>
              </div>

              {/* Booking Details */}
              {bookingData && (
                <>
                  <Separator />
                  {/* Property Details */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Property Details
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium">
                            {bookingData.property?.title || "Property Name"}
                          </p>
                          <p className="text-gray-600 text-sm">
                            {bookingData.property?.location?.city &&
                            bookingData.property?.location?.state
                              ? `${bookingData.property.location.city}, ${bookingData.property.location.state}`
                              : "Location details unavailable"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Booking Dates */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Booking Details
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-start">
                        <Calendar className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-600">Check-in</p>
                          <p className="font-medium">
                            {bookingData.checkIn
                              ? formatDate(bookingData.checkIn, "MMM dd, yyyy")
                              : "Not available"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Calendar className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-600">Check-out</p>
                          <p className="font-medium">
                            {bookingData.checkOut
                              ? formatDate(bookingData.checkOut, "MMM dd, yyyy")
                              : "Not available"}
                          </p>
                        </div>
                      </div>
                      {bookingData.guests && (
                        <div className="flex items-start">
                          <Users className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-600">Guests</p>
                            <p className="font-medium">
                              {(bookingData.guests.adults || 0) +
                                (bookingData.guests.children || 0)}
                              {bookingData.guests.infants > 0 &&
                                ` + ${bookingData.guests.infants} infant(s)`}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              <Separator />

              {/* Payment Summary */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Payment Summary</h3>

                <div className="flex justify-between font-semibold text-lg">
                  <span>Total {isSuccessful ? "Paid" : "Amount"}</span>
                  <span className="flex items-center">
                    {/* <IndianRupee className="h-5 w-5 mr-1" /> */}
                    {paymentData.amount
                      ? formatPrice(
                          paymentData.amount,
                          paymentData.currency || "INR"
                        )
                      : "Amount not available"}
                  </span>
                </div>

                {/* Add currency display */}
                <div className="text-sm text-gray-600 text-right mt-1">
                  Currency: {paymentData.currency || "INR"}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <Button
              variant="outline"
              onClick={() => window.print()}
              className="flex items-center justify-center"
            >
              Print Receipt
            </Button>

            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                onClick={() => navigate("/")}
                className="flex-1"
              >
                Back to Home
              </Button>

              <Button
                onClick={() => navigate("/bookings")}
                className="flex items-center justify-center flex-1"
              >
                View Bookings
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              {isSuccessful
                ? "A confirmation email has been sent to your registered email address"
                : "You will receive an email update when the payment is processed"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
