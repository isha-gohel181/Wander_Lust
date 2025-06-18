import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const PaymentError = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const errorMessage =
    location.state?.message ||
    new URLSearchParams(location.search).get("message") ||
    "There was an issue with your payment";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="p-6 text-center">
          <div className="inline-flex items-center justify-center bg-red-100 rounded-full p-3 mb-4">
            <AlertTriangle className="h-10 w-10 text-red-600" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Payment Failed
          </h1>

          <p className="text-gray-600 mb-6">{errorMessage}</p>

          <div className="space-y-3">
            <Button onClick={() => navigate("/bookings")} className="w-full">
              View My Bookings
            </Button>

            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="w-full"
            >
              Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentError;
