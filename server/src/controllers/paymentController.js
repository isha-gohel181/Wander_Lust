//server/src/controllers/paymentController.js
const cashfreeService = require("../services/cashfreeService");
const Booking = require("../models/Booking");
const User = require("../models/User");

/**
 * Create a payment order
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const createPaymentOrder = async (req, res) => {
  try {
    const { bookingId, orderAmount } = req.body;

    if (!bookingId || !orderAmount) {
      return res
        .status(400)
        .json({ message: "Booking ID and Order Amount are required" });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const user = await User.findOne({ clerkId: req.clerkId });
    if (!user || booking.guest.toString() !== user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to access this booking" });
    }

    const orderData = await cashfreeService.createOrder({
      bookingId,
      orderAmount,
    });

    res.json(orderData);
  } catch (error) {
    console.error("Create payment order error:", error);
    res
      .status(500)
      .json({ message: error.message || "Failed to create payment order" });
  }
};


/**
 * Get payment status
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const getPaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({ message: "Order ID is required" });
    }

    const orderStatus = await cashfreeService.getOrderStatus(orderId);

    // Find and update booking
    const booking = await Booking.findOne({ "payment.orderId": orderId });
    if (booking) {
      booking.payment.status = orderStatus.order_status.toLowerCase();

      if (orderStatus.order_status === "PAID") {
        booking.status = "confirmed";
        booking.payment.paidAt = new Date();
      } else if (
        orderStatus.order_status === "EXPIRED" ||
        orderStatus.order_status === "CANCELLED"
      ) {
        booking.status = "payment_failed";
      }

      await booking.save();
    }

    res.json({
      orderId: orderId,
      status: orderStatus.order_status,
      amount: orderStatus.order_amount,
      currency: orderStatus.order_currency || "INR", // Ensure currency is always returned
      booking: booking ? booking._id : null,
    });
  } catch (error) {
    console.error("Get payment status error:", error);
    res
      .status(500)
      .json({ message: error.message || "Failed to get payment status" });
  }
};

/**
 * Process payment webhook
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const handleWebhook = async (req, res) => {
  try {
    const webhookData = req.body;
    const signature = req.headers["x-webhook-signature"];

    // Verify signature (optional but recommended)
    // const isValid = cashfreeService.verifySignature(webhookData, signature);
    // if (!isValid) {
    //   return res.status(400).json({ message: 'Invalid signature' });
    // }

    const booking = await cashfreeService.processWebhook(webhookData);

    res.json({ success: true, bookingId: booking._id });
  } catch (error) {
    console.error("Webhook processing error:", error);
    res
      .status(500)
      .json({ message: error.message || "Failed to process webhook" });
  }
};

/**
 * Payment success callback
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const handlePaymentReturn = async (req, res) => {
  try {
    const { order_id, booking_id } = req.query;

    if (!order_id || !booking_id) {
      return res
        .status(400)
        .json({ message: "Order ID and Booking ID are required" });
    }

    const orderStatus = await cashfreeService.getOrderStatus(order_id);

    // Find and update booking
    const booking = await Booking.findById(booking_id);
    if (booking) {
      booking.payment.status = orderStatus.order_status.toLowerCase();

      if (orderStatus.order_status === "PAID") {
        booking.status = "confirmed";
        booking.payment.paidAt = new Date();
      } else if (
        orderStatus.order_status === "EXPIRED" ||
        orderStatus.order_status === "CANCELLED"
      ) {
        booking.status = "payment_failed";
      }

      await booking.save();
    }

    // Redirect to client
    res.redirect(
      `${process.env.CLIENT_URL}/payment/success?orderId=${order_id}&bookingId=${booking_id}&status=${orderStatus.order_status}`
    );
  } catch (error) {
    console.error("Payment return error:", error);
    res.redirect(
      `${process.env.CLIENT_URL}/payment/error?message=${encodeURIComponent(
        error.message
      )}`
    );
  }
};

module.exports = {
  createPaymentOrder,
  getPaymentStatus,
  handleWebhook,
  handlePaymentReturn,
};
