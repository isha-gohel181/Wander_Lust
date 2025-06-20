const crypto = require("crypto");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const Booking = require("../models/Booking");
const User = require("../models/User");

// Base URLs for Cashfree API
const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://api.cashfree.com/pg"
    : "https://sandbox.cashfree.com/pg";

class CashfreeService {
  constructor() {
    this.appId = process.env.CASHFREE_APP_ID;
    this.secretKey = process.env.CASHFREE_SECRET_KEY;
    // Fix the webhook URL - use correct route path
    this.returnUrl =
      process.env.CASHFREE_RETURN_URL ||
      "http://localhost:5000/api/payment/return";
    this.notifyUrl =
      process.env.CASHFREE_NOTIFY_URL ||
      "http://localhost:5000/api/payment/webhook";
  }

  /**
   * Create a payment order
   * @param {Object} params - Object containing bookingId and orderAmount
   * @returns {Object} - Payment order details
   */
  async createOrder({ bookingId, orderAmount }) {
    try {
      console.log("Creating order for:", { bookingId, orderAmount });

      const booking = await Booking.findById(bookingId)
        .populate("guest")
        .populate("property");

      if (!booking) {
        throw new Error("Booking not found");
      }

      console.log("Found booking:", {
        id: booking._id,
        totalAmount: booking.pricing?.total,
        providedAmount: orderAmount,
      });

      // Get the correct total amount from booking
      const bookingTotal = booking.pricing?.total || booking.totalAmount;

      if (!bookingTotal) {
        throw new Error("Booking total amount not found in booking record");
      }

      // Optional safety check - allow small differences for rounding
      const amountDifference = Math.abs(bookingTotal - orderAmount);
      if (amountDifference > 1) {
        console.warn("Amount mismatch:", {
          bookingTotal,
          orderAmount,
          difference: amountDifference,
        });
        orderAmount = bookingTotal;
      }

      const orderId = `WL-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      const user = await User.findById(booking.guest);
      if (!user) {
        throw new Error("User not found");
      }

      const orderData = {
        order_id: orderId,
        order_amount: orderAmount,
        order_currency: "INR",
        order_note: `Payment for booking at ${booking.property.title}`,
        customer_details: {
          customer_id: user._id.toString(),
          customer_name: `${user.firstName} ${user.lastName}`,
          customer_email: user.email,
          customer_phone: user.phone || "9999999999",
        },
        order_meta: {
          // Use proper Cashfree template variables
          return_url: `${this.returnUrl}?order_id={order_id}&booking_id=${booking._id}`,
          notify_url: this.notifyUrl,
        },
      };

      console.log("Sending order data to Cashfree:", orderData);

      const headers = {
        "x-api-version": "2022-01-01",
        "x-client-id": this.appId,
        "x-client-secret": this.secretKey,
        "Content-Type": "application/json",
      };

      const response = await axios.post(`${BASE_URL}/orders`, orderData, {
        headers,
      });

      console.log("Cashfree response:", response.data);

      // Update booking with payment information
      booking.payment = {
        orderId: orderId,
        cfOrderId: response.data.cf_order_id,
        amount: orderAmount,
        currency: "INR",
        status: "pending",
        gateway: "cashfree",
        createdAt: new Date(),
      };

      // Also ensure totalAmount is set if missing
      if (!booking.totalAmount && booking.pricing?.total) {
        booking.totalAmount = booking.pricing.total;
      }

      await booking.save();

      console.log("Debug payment amounts:", {
        bookingId,
        providedOrderAmount: orderAmount,
        storedBookingTotal: booking.pricing?.total,
        totalAmount: booking.totalAmount,
        difference: Math.abs((booking.pricing?.total || 0) - orderAmount),
      });

      return {
        orderId: orderId,
        paymentSessionId: response.data.payment_session_id,
        cfOrderId: response.data.cf_order_id,
        paymentLink: response.data.payment_link,
        currency: "INR",
        amount: orderAmount,
        booking: booking,
      };
    } catch (error) {
      console.error("Error creating Cashfree order:", error);

      if (error.response) {
        console.error("Cashfree API Error:", error.response.data);
        throw new Error(
          `Cashfree API Error: ${
            error.response.data?.message || error.response.statusText
          }`
        );
      }

      throw new Error(error.message || "Failed to create payment order");
    }
  }

  /**
   * Verify payment signature for webhook
   * @param {Object} payload - Webhook payload
   * @param {String} signature - Signature sent by Cashfree
   * @returns {Boolean}
   */
  verifySignature(payload, signature) {
    try {
      // For Cashfree v3 API, construct signature string differently
      const signatureData = JSON.stringify(payload);

      const expectedSignature = crypto
        .createHmac("sha256", this.secretKey)
        .update(signatureData)
        .digest("hex");

      return expectedSignature === signature;
    } catch (error) {
      console.error("Error verifying signature:", error);
      return false;
    }
  }

  /**
   * Get payment status
   * @param {String} orderId
   * @returns {Object}
   */
  async getOrderStatus(orderId) {
    try {
      const headers = {
        "x-api-version": "2022-01-01",
        "x-client-id": this.appId,
        "x-client-secret": this.secretKey,
        "Content-Type": "application/json",
      };

      const response = await axios.get(`${BASE_URL}/orders/${orderId}`, {
        headers,
      });

      return response.data;
    } catch (error) {
      console.error("Error getting order status:", error);
      throw new Error("Failed to get payment status");
    }
  }

  /**
   * Process Cashfree webhook
   * @param {Object} webhookData
   * @returns {Object} - Updated booking
   */
  async processWebhook(webhookData) {
    try {
      console.log("Processing webhook data:", webhookData);

      // Handle different webhook event types
      const eventType = webhookData.type;

      if (eventType === "PAYMENT_SUCCESS_WEBHOOK") {
        const paymentData = webhookData.data;
        const orderId = paymentData.order?.order_id;

        if (!orderId) {
          throw new Error("Order ID not found in webhook data");
        }

        const booking = await Booking.findOne({
          "payment.orderId": orderId,
        });

        if (!booking) {
          throw new Error("Booking not found for the given order ID");
        }

        // Update booking with successful payment
        booking.payment.status = "paid";
        booking.payment.paymentId = paymentData.payment?.cf_payment_id;
        booking.payment.method = paymentData.payment?.payment_method?.type;
        booking.payment.paidAt = new Date();
        booking.status = "confirmed";

        await booking.save();
        console.log("Booking updated successfully for order:", orderId);

        return booking;
      } else if (eventType === "PAYMENT_FAILED_WEBHOOK") {
        const paymentData = webhookData.data;
        const orderId = paymentData.order?.order_id;

        const booking = await Booking.findOne({
          "payment.orderId": orderId,
        });

        if (booking) {
          booking.payment.status = "failed";
          booking.status = "payment_failed";
          await booking.save();
        }

        return booking;
      }

      console.log("Unhandled webhook event type:", eventType);
      return null;
    } catch (error) {
      console.error("Error processing webhook:", error);
      throw new Error("Failed to process payment webhook");
    }
  }
}

module.exports = new CashfreeService();
