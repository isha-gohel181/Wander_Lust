//src/components/payment/paymentFrom.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { paymentService } from "@/services/payment";
import { formatPrice } from "@/utils/helpers";
import {
  Shield,
  CreditCard as CreditCardIcon,
  Lock,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
} from "lucide-react";
import toast from "react-hot-toast";
import CreditCard from "@/components/payment/CreditCard";

// List of test cards for simulation
const TEST_CARDS = [
  {
    number: "4242424242424242",
    name: "Successful payment",
    result: "success",
    brand: "visa",
  },
  {
    number: "4000000000000002",
    name: "Declined payment",
    result: "decline",
    brand: "visa",
  },
  {
    number: "4000000000009995",
    name: "Insufficient funds",
    result: "insufficient",
    brand: "visa",
  },
  {
    number: "378282246310005",
    name: "Successful Amex",
    result: "success",
    brand: "amex",
  },
  {
    number: "5555555555554444",
    name: "Successful Mastercard",
    result: "success",
    brand: "mastercard",
  },
];

const PaymentForm = ({ booking, onSuccess, onClose }) => {
  const navigate = useNavigate();

  const [paymentIntentId, setPaymentIntentId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [processingState, setProcessingState] = useState("idle"); // idle, processing, success, error
  const [error, setError] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [selectedCard, setSelectedCard] = useState(TEST_CARDS[0]);
  const [formData, setFormData] = useState({
    cardNumber: TEST_CARDS[0].number,
    cardHolder: "John Doe",
    expiryMonth: "12",
    expiryYear: "2028",
    cvv: "123",
  });
  const [amount, setAmount] = useState(0);

  // Ensure we have a valid amount from the booking
  useEffect(() => {
    if (booking && booking.totalAmount) {
      // Make sure it's a number
      const numericAmount = parseFloat(booking.totalAmount);
      if (!isNaN(numericAmount)) {
        setAmount(numericAmount);
      }
    }
  }, [booking]);

  // Create payment intent when component mounts
  useEffect(() => {
    const createIntent = async () => {
      try {
        if (!booking || !booking._id) {
          console.error("Invalid booking data:", booking);
          setError("Invalid booking data. Please try again.");
          return;
        }

        setProcessingState("processing");
        const response = await paymentService.createPaymentIntent(booking._id);
        console.log("Payment intent created:", response);

        if (response && response.id) {
          setClientSecret(response.clientSecret || "");
          setPaymentIntentId(response.id);

          // Check if amount is valid, if not use the booking amount
          const responseAmount = parseFloat(response.amount);
          if (!isNaN(responseAmount) && responseAmount > 0) {
            setAmount(responseAmount);
          } else if (booking.totalAmount) {
            setAmount(parseFloat(booking.totalAmount));
          }

          setProcessingState("idle");
        } else {
          throw new Error("Invalid response from payment service");
        }
      } catch (err) {
        console.error("Payment initialization error:", err);
        setError("Failed to initialize payment. Please try again later.");
        setProcessingState("error");
        toast.error("Payment initialization failed");
      }
    };

    if (booking?._id) {
      createIntent();
    }
  }, [booking]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectTestCard = (card) => {
    setSelectedCard(card);
    setFormData((prev) => ({
      ...prev,
      cardNumber: card.number,
    }));
  };

  const formatCardNumber = (value) => {
    return value
      .replace(/\s/g, "")
      .replace(/(\d{4})/g, "$1 ")
      .trim();
  };

  const validateForm = () => {
    // Basic validation
    if (paymentMethod === "card") {
      if (formData.cardNumber.replace(/\s/g, "").length < 15) {
        setError("Please enter a valid card number");
        return false;
      }
      if (!formData.expiryMonth || !formData.expiryYear) {
        setError("Please enter expiration date");
        return false;
      }
      if (formData.cvv.length < 3) {
        setError("Please enter a valid CVV");
        return false;
      }
      if (!formData.cardHolder) {
        setError("Please enter cardholder name");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setProcessingState("processing");
    setError(null);

    try {
      // Simulate payment processing delay for realism
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Prepare payment method object (similar to what Stripe would generate)
      const paymentMethodObj = {
        type: paymentMethod,
        card: {
          brand: selectedCard.brand,
          last4: formData.cardNumber.slice(-4),
          exp_month: formData.expiryMonth,
          exp_year: formData.expiryYear,
        },
        billing_details: {
          name: formData.cardHolder,
        },
      };

      // Process payment with our mock payment service
      const result = await paymentService.confirmPayment(
        paymentIntentId,
        paymentMethodObj
      );

      if (result.success) {
        setProcessingState("success");

        // Simulate a delay before navigating away for better UX
        setTimeout(() => {
          toast.success("Payment successful!");

          if (onSuccess) {
            onSuccess(result.booking);
          } else {
            // Navigate to success page if no onSuccess handler
            navigate("/payment/success", {
              state: { booking: result.booking },
            });
          }
        }, 1500);
      } else {
        setProcessingState("error");
        setError(result.error || "Payment failed");
        toast.error(result.error || "Payment failed");
      }
    } catch (err) {
      console.error("Payment processing error:", err);
      setProcessingState("error");
      setError(
        "An error occurred while processing your payment. Please try again."
      );
      toast.error("Payment processing error");
    }
  };

  const renderProcessingState = () => {
    switch (processingState) {
      case "processing":
        return (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-sm w-full text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold mb-2">Processing Payment</h3>
              <p className="text-gray-600">
                Please do not close this window...
              </p>
            </div>
          </div>
        );
      case "success":
        return (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-sm w-full text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Payment Successful!
              </h3>
              <p className="text-gray-600">Your booking has been confirmed.</p>
            </div>
          </div>
        );
      case "error":
        return null; // We'll show errors in the form
      default:
        return null;
    }
  };

  if (processingState === "initializing") {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p>Initializing payment...</p>
      </div>
    );
  }

  // Format the amount for display using the helper function with INR currency
  const displayAmount = isNaN(amount) ? formatPrice(0) : formatPrice(amount);

  return (
    <div className="space-y-6">
      {renderProcessingState()}

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
        <span>This is a secure, encrypted payment</span>
      </div>

      <div className="space-y-2">
        <div className="font-medium">Payment Amount</div>
        <div className="text-2xl font-bold">{displayAmount}</div>
      </div>

      <Separator />

      <Tabs defaultValue="card" onValueChange={setPaymentMethod}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="card">Credit Card</TabsTrigger>
          <TabsTrigger value="paypal">PayPal</TabsTrigger>
        </TabsList>

        <TabsContent value="card" className="space-y-4 pt-4">

          {/* Test Card Selection */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="font-medium mb-2">Test Cards (For Demo)</div>
            <div className="grid grid-cols-2 gap-2">
              {TEST_CARDS.map((card) => (
                <Button
                  key={card.number}
                  variant={
                    selectedCard.number === card.number ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => handleSelectTestCard(card)}
                  className="justify-start overflow-hidden text-ellipsis whitespace-nowrap"
                >
                  <span className="truncate">{card.name}</span>
                </Button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              <AlertCircle className="h-3 w-3 inline mr-1" />
              This is a demo - no real charges will be made
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <div className="relative">
                <CreditCardIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="cardNumber"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  placeholder="1234 5678 9012 3456"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardHolder">Cardholder Name</Label>
              <Input
                id="cardHolder"
                name="cardHolder"
                value={formData.cardHolder}
                onChange={handleInputChange}
                placeholder="John Doe"
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiryMonth">Month</Label>
                <Select
                  name="expiryMonth"
                  value={formData.expiryMonth}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, expiryMonth: value }))
                  }
                >
                  <SelectTrigger id="expiryMonth">
                    <SelectValue placeholder="MM" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => {
                      const month = i + 1;
                      return (
                        <SelectItem
                          key={month}
                          value={month.toString().padStart(2, "0")}
                        >
                          {month.toString().padStart(2, "0")}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiryYear">Year</Label>
                <Select
                  name="expiryYear"
                  value={formData.expiryYear}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, expiryYear: value }))
                  }
                >
                  <SelectTrigger id="expiryYear">
                    <SelectValue placeholder="YY" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 10 }, (_, i) => {
                      const year = new Date().getFullYear() + i;
                      return (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <div className="relative">
                  <Input
                    id="cvv"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleInputChange}
                    placeholder="123"
                    maxLength={4}
                    className="pl-10"
                    required
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                </div>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4 mr-2" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              disabled={processingState !== "idle"}
              className="w-full"
            >
              {processingState === "processing" ? (
                <>Processing...</>
              ) : (
                <>Pay {displayAmount}</>
              )}
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="paypal" className="space-y-4 pt-4">
          <div className="bg-[#0070ba] text-white py-4 px-6 rounded-lg text-center">
            <div className="text-2xl font-bold mb-2">PayPal</div>
            <p className="text-sm">Simulated PayPal integration</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-center text-gray-600">
              In a real application, this would connect to the PayPal API.
            </p>
            <p className="text-center text-gray-600 text-sm mt-1">
              For this demo, you can proceed by clicking the button below.
            </p>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={processingState !== "idle"}
            className="w-full bg-[#0070ba] hover:bg-[#005ea6]"
          >
            {processingState === "processing"
              ? "Processing..."
              : `Pay with PayPal (${displayAmount})`}
          </Button>
        </TabsContent>
      </Tabs>

      <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
        <Lock className="h-3 w-3" />
        <span>Your payment info is secured with 256-bit encryption</span>
      </div>

      <div className="grid grid-cols-5 gap-4">
        <img
          src="https://cdn.iconscout.com/icon/free/png-256/free-visa-3-226460.png"
          alt="Visa"
          className="h-6 object-contain"
        />
        <img
          src="https://cdn.iconscout.com/icon/free/png-256/free-mastercard-3-226450.png"
          alt="Mastercard"
          className="h-6 object-contain"
        />
        <img
          src="https://cdn.iconscout.com/icon/free/png-256/free-american-express-51-675738.png"
          alt="Amex"
          className="h-6 object-contain"
        />
        <img
          src="https://cdn.iconscout.com/icon/free/png-256/free-discover-5-886096.png"
          alt="Discover"
          className="h-6 object-contain"
        />
        <img
          src="https://cdn.iconscout.com/icon/free/png-256/free-paypal-34-226455.png"
          alt="PayPal"
          className="h-6 object-contain"
        />
      </div>

      <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200 text-xs">
        <div className="flex items-center">
          <AlertCircle className="h-4 w-4 text-yellow-500 mr-2 flex-shrink-0" />
          <p className="font-medium text-yellow-800">Demo Payment System</p>
        </div>
        <p className="text-yellow-700 ml-6">
          This is a simulated payment system for educational purposes. No real
          payments will be processed.
        </p>
      </div>
    </div>
  );
};  

export default PaymentForm;
