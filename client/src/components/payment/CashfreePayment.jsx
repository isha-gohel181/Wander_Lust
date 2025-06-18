//client/src/components/payment/CashfreePayment.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { paymentService } from "@/services/payment";
import { formatPrice } from "@/utils/helpers";
import {
  Shield,
  AlertCircle,
  CreditCard,
  AlertTriangle,
  IndianRupee,
} from "lucide-react";
import toast from "react-hot-toast";

const CashfreePayment = ({ booking, onSuccess, onClose }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentLink, setPaymentLink] = useState(null);

  useEffect(() => {
    const initializePayment = async () => {
      const bookingAmount = booking?.totalAmount || booking?.pricing?.total;

      if (!booking?._id || !bookingAmount) {
        console.error("Booking data:", booking);
        setError("Invalid booking data - missing ID or amount");
        return;
      }

      setLoading(true);
      try {
        const data = await paymentService.createOrder({
          bookingId: booking._id,
          orderAmount: bookingAmount,
        });

        if (data?.paymentLink) {
          setPaymentLink(data.paymentLink);
        } else {
          throw new Error("Payment link not available from server");
        }
      } catch (err) {
        console.error("Payment initialization error:", err);
        setError(err.message || "Failed to initialize payment");
        toast.error("Payment initialization failed");
      } finally {
        setLoading(false);
      }
    };

    initializePayment();
  }, [booking]);

  const handleManualPayment = () => {
    if (paymentLink) {
      window.open(paymentLink, "_blank");
    } else {
      setError("Payment link not available");
      toast.error("Payment link not available");
    }
  };

  const displayAmount = booking?.totalAmount || booking?.pricing?.total;

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p>Generating payment link...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Complete Payment</h3>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        )}
      </div>

      <div className="bg-blue-50 p-4 rounded-lg flex items-center text-sm">
        <Shield className="h-5 w-5 text-blue-600 mr-2" />
        <span>This is a secure, encrypted payment via Cashfree</span>
      </div>

      <div className="space-y-2">
        <div className="font-medium">Payment Amount</div>
        <div className="text-2xl font-bold flex items-center">
          <IndianRupee className="h-5 w-5 mr-1" />
          {displayAmount ? formatPrice(displayAmount, "INR") : "Loading..."}
        </div>
      </div>

      <Separator />

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4 mr-2" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardContent className="p-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">
              Click the button below to complete your payment:
            </p>
            <Button onClick={handleManualPayment} className="w-full">
              <CreditCard className="mr-2 h-4 w-4" />
              Pay Now
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="text-xs text-gray-500 text-center">
        <p>This is a test payment using Cashfree Sandbox mode.</p>
        <p>No real charges will be made.</p>
      </div>

      <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200 text-xs">
        <div className="flex items-center">
          <AlertCircle className="h-4 w-4 text-yellow-500 mr-2 flex-shrink-0" />
          <p className="font-medium text-yellow-800">Sandbox Test Mode</p>
        </div>
        <p className="text-yellow-700 ml-6">
          This is a simulated payment system for educational purposes. Use
          Cashfree's test cards for payments.
        </p>
      </div>
    </div>
  );
};

export default CashfreePayment;
