//server/src/routes/payment.js
const express = require("express");
const { requireAuth, getUserFromClerk } = require("../middleware/auth");
const {
  createPaymentOrder,
  getPaymentStatus,
  handleWebhook,
  handlePaymentReturn,
} = require("../controllers/paymentController");

const router = express.Router();

// Protected routes - need authentication
router.post("/create-order", requireAuth, getUserFromClerk, createPaymentOrder);
router.get("/status/:orderId", requireAuth, getUserFromClerk, getPaymentStatus);

// Public routes for callbacks and webhooks
router.post("/webhook", handleWebhook);
router.get("/return", handlePaymentReturn);

module.exports = router;
