//server/src/controllers/paymentController.js
const Booking = require("../models/Booking");
const cashfreeService = require("../services/cashfreeService");

const createPaymentOrder = async (req, res) => {
  try {
    const { bookingId, orderAmount } = req.body;
    const userId = req.user.id;

    // Verify the booking belongs to the user
    const booking = await Booking.findOne({
      _id: bookingId,
      guest: userId,
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found or access denied",
      });
    }

    const orderData = await cashfreeService.createOrder({
      bookingId,
      orderAmount,
    });

    res.json({
      success: true,
      ...orderData,
    });
  } catch (error) {
    console.error("Error creating payment order:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create payment order",
    });
  }
};

const getPaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const booking = await Booking.findOne({
      "payment.orderId": orderId,
      guest: userId,
    }).populate("property", "title location");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Payment record not found or access denied",
      });
    }

    try {
      const cashfreeStatus = await cashfreeService.getOrderStatus(orderId);

      if (cashfreeStatus?.order_status) {
        const cfStatus = cashfreeStatus.order_status.toLowerCase();

        if (cfStatus !== booking.payment.status) {
          booking.payment.status = cfStatus === "paid" ? "paid" : cfStatus;

          if (cfStatus === "paid") {
            booking.status = "confirmed";
          }

          await booking.save();
        }
      }
    } catch (err) {
      console.error("Error fetching status from Cashfree:", err.message);
    }

    res.json({
      success: true,
      orderId: booking.payment.orderId,
      status: booking.payment.status,
      amount: booking.payment.amount,
      currency: booking.payment.currency,
      paymentId: booking.payment.paymentId,
      method: booking.payment.method,
      paidAt: booking.payment.paidAt,
      booking: booking._id,
      property: booking.property,
    });
  } catch (error) {
    console.error("Error getting payment status:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to get payment status",
    });
  }
};

const handleWebhook = async (req, res) => {
  try {
    const webhookData = req.body;

    await cashfreeService.processWebhook(webhookData);

    res.json({
      success: true,
      message: "Webhook processed successfully",
    });
  } catch (error) {
    console.error("Error processing webhook:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to process webhook",
    });
  }
};

const handlePaymentReturn = async (req, res) => {
  try {
    const { order_id, booking_id } = req.query;
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const redirectUrl = `${frontendUrl}/payment/success?order_id=${order_id}&booking_id=${booking_id}`;
    res.redirect(redirectUrl);
  } catch (error) {
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    res.redirect(`${frontendUrl}/payment/error`);
  }
};

module.exports = {
  createPaymentOrder,
  getPaymentStatus,
  handleWebhook,
  handlePaymentReturn,
};
