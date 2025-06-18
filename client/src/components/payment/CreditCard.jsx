import React from "react";

// Credit card component for a realistic look
const CreditCard = ({
  cardNumber = "•••• •••• •••• ••••",
  cardHolder = "Your Name",
  expiryMonth = "••",
  expiryYear = "••",
  cardType = "unknown",
}) => {
  const getCardIcon = () => {
    const firstDigit = cardNumber?.charAt(0) || "";

    if (cardNumber?.startsWith("4")) return "💳 Visa";
    if (cardNumber?.startsWith("5")) return "💳 Mastercard";
    if (cardNumber?.startsWith("3")) return "💳 Amex";
    if (cardNumber?.startsWith("6")) return "💳 Discover";
    return "💳 Card";
  };

  // Format card number with spaces
  const formatCardNumber = () => {
    if (cardNumber === "•••• •••• •••• ••••") return cardNumber;

    const cardStr = cardNumber.toString().replace(/\s/g, "");
    const formatted = cardStr.replace(/(\d{4})/g, "$1 ").trim();

    // Mask all but last 4 digits
    return formatted.slice(0, -5).replace(/\d/g, "•") + formatted.slice(-5);
  };

  return (
    <div className="w-full h-48 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-md overflow-hidden relative p-5">
      <div className="absolute top-0 right-0 mt-3 mr-3 text-white opacity-80">
        {getCardIcon()}
      </div>

      <div className="h-10 w-12 mb-4">
        <div className="h-full w-full bg-yellow-400 rounded-md opacity-80"></div>
      </div>

      <div className="text-white text-xl font-mono mt-6 mb-8">
        {formatCardNumber()}
      </div>

      <div className="flex justify-between">
        <div>
          <div className="text-white text-xs opacity-75 font-semibold">
            Card Holder
          </div>
          <div className="text-white font-medium">{cardHolder}</div>
        </div>

        <div>
          <div className="text-white text-xs opacity-75 font-semibold">
            Expires
          </div>
          <div className="text-white font-medium">
            {expiryMonth}/{expiryYear.slice(-2)}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 right-0 mb-3 mr-3 text-white text-xs opacity-50">
        Demo Card - No real charges
      </div>
    </div>
  );
};

export default CreditCard;
