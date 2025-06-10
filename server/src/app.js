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

// Auth-protected middleware
const { requireAuth, getUserFromClerk } = require("./middleware/auth");

// Routes
const userRoutes = require("./routes/users");
const propertyRoutes = require("./routes/properties");
const bookingRoutes = require("./routes/bookings");
const reviewRoutes = require("./routes/reviews");
const uploadRoutes = require('./routes/upload'); // Add upload routes

// Import Cloudinary config and test connection
const { testConnection } = require('./config/cloudinary');
testConnection();
const app = express();
connectDB();

// Security and utility middlewares
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }, // Allow Cloudinary images
  })
);

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// Rate limiter
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

// Special rate limit for uploads (more restrictive)
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 upload requests per windowMs
  message: {
    error: 'Too many upload requests, please try again later.'
  }
});

// Webhook route (must use raw body before express.json)
app.post(
  "/api/auth/webhook",
  bodyParser.raw({ type: "*/*" }),
  handleClerkWebhook
);

// JSON parsers (after raw)
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    message: "Wanderlust API is running!",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// PUBLIC ROUTES (no authentication required)
// Mount properties routes without auth middleware first for public endpoints
app.use("/api/properties", propertyRoutes);

// PROTECTED ROUTES (authentication required)
app.use("/api/users", requireAuth, getUserFromClerk, userRoutes);
app.use("/api/bookings", requireAuth, getUserFromClerk, bookingRoutes);
app.use("/api/reviews", requireAuth, getUserFromClerk, reviewRoutes);
app.use('/api/upload', uploadLimiter, uploadRoutes); // Add upload routes with special rate limiting

// 404 Fallback
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Global error handler
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV}`)
);