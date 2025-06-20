const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const bodyParser = require("body-parser");
require("dotenv").config();

const connectDB = require("./config/database");
const errorHandler = require("./middleware/errorHandler");

const { handleClerkWebhook } = require("./controllers/authController");
const { requireAuth, getUserFromClerk } = require("./middleware/auth");

const userRoutes = require("./routes/users");
const propertyRoutes = require("./routes/properties");
const bookingRoutes = require("./routes/bookings");
const reviewRoutes = require("./routes/reviews");
const uploadRoutes = require("./routes/upload");
const messageRoutes = require("./routes/messages");
const paymentRoutes = require("./routes/payment");

const { testConnection } = require("./config/cloudinary");
testConnection();

const app = express();
connectDB();

const http = require("http");
const { initializeSocket } = require("./config/socket");
const server = http.createServer(app);
initializeSocket(server);

// Security and utility middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL,
      "http://localhost:5173",
      "http://localhost:3000",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Rate limiters
app.use(
  "/api/",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP, please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
  })
);

const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    error: "Too many upload requests, please try again later.",
  },
});

// Webhook handler (raw body)
app.post(
  "/api/auth/webhook",
  bodyParser.raw({ type: "*/*" }),
  handleClerkWebhook
);

// JSON parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({
    message: "Wanderlust API is running!",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// ROUTES
app.use("/api/properties", propertyRoutes);
app.use("/api/payment", paymentRoutes);

app.use("/api/users", requireAuth, getUserFromClerk, userRoutes);
app.use("/api/bookings", requireAuth, getUserFromClerk, bookingRoutes);
app.use("/api/reviews", requireAuth, getUserFromClerk, reviewRoutes);
app.use(
  "/api/upload",
  requireAuth,
  getUserFromClerk,
  uploadLimiter,
  uploadRoutes
);
app.use("/api/messages", messageRoutes);

// 404 fallback
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    requestedUrl: req.url,
    method: req.method,
  });
});

// Global error handler
app.use(errorHandler);

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("SIGINT received. Shutting down gracefully...");
  process.exit(0);
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV}`);
});
