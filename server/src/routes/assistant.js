// server/src/routes/assistant.js
const express = require("express");
const rateLimit = require("express-rate-limit");
const { chatWithAssistant } = require("../controllers/assistantController");

const router = express.Router();

const assistantLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many assistant requests. Please slow down.",
});

router.post("/chat", assistantLimiter, chatWithAssistant);

module.exports = router;
