// Create this new file for debugging auth
const debugAuth = (req, res, next) => {
  console.log("🔍 Auth Debug:", {
    url: req.url,
    method: req.method,
    headers: {
      authorization: req.headers.authorization ? "Present" : "Missing",
      contentType: req.headers["content-type"],
    },
    user: req.user ? "Present" : "Missing",
  });
  next();
};

module.exports = { debugAuth };
