//server/src/config/clerk.js
const { ClerkExpressRequireAuth } = require("@clerk/clerk-sdk-node");

const clerkMiddleware = ClerkExpressRequireAuth({
  // Optional: Add any clerk configuration here
});

module.exports = clerkMiddleware;
