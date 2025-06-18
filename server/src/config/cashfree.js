//server/src/config/cashfree.jsx
const { Cashfree } = require("cashfree-sdk");

const env = process.env.NODE_ENV === "production" ? "PROD" : "TEST";
const appId = process.env.CASHFREE_APP_ID;
const secretKey = process.env.CASHFREE_SECRET_KEY;

// Initialize Cashfree payment gateway
const cashfree = new Cashfree({
  appId: appId,
  secretKey: secretKey,
  env: env,
});

module.exports = cashfree;
