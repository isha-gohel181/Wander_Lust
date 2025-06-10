//src/middleware/auth.js
const { requireAuth } = require("@clerk/express");
const User = require("../models/User");

// Middleware to protect routes
const authGuard = requireAuth();

// Attach Clerk user to request and get user from DB
const getUserFromClerk = async (req, res, next) => {
  try {
    console.log(
      "🔧 getUserFromClerk middleware called for:",
      req.method,
      req.path
    );

    // Use req.auth() as a function instead of req.auth as property
    const auth = req.auth();
    console.log("🔧 Auth object:", auth ? "exists" : "null");

    const clerkId = auth?.userId;
    console.log("🔧 Clerk ID:", clerkId);

    if (!clerkId) {
      console.log("❌ No clerk ID found");
      return res.status(401).json({ message: "Unauthorized - No user ID" });
    }

    const user = await User.findOne({ clerkId });
    console.log("🔧 User found in DB:", user ? "yes" : "no");

    if (!user) {
      console.log("❌ User not found in database");
      return res.status(404).json({ message: "User not found in DB" });
    }

    req.user = user;
    req.clerkId = clerkId;
    console.log("✅ Auth middleware completed successfully");

    next();
  } catch (error) {
    console.error("❌ Auth middleware error:", error);
    res.status(500).json({ message: "Authentication error" });
  }
};

const requireHost = (req, res, next) => {
  const role = req.user?.role;
  if (!role || (role !== "host" && role !== "admin")) {
    return res.status(403).json({ message: "Host access required" });
  }
  next();
};

const requireAdmin = (req, res, next) => {
  const role = req.user?.role;
  if (role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};

module.exports = {
  requireAuth: authGuard,
  getUserFromClerk,
  requireHost,
  requireAdmin,
};
