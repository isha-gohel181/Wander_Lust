const { body, validationResult } = require("express-validator");

// Generic validation error handler with detailed logging
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Log the request body for debugging
    console.log("❌ Validation failed for request body:", JSON.stringify(req.body, null, 2));
    console.log("❌ Validation errors:", errors.array());

    return res.status(400).json({
      success: false,
      message: "Validation errors",
      errors: errors.array(),
    });
  }
  next();
};

// Property validation rules
const validateProperty = [
  body("title")
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage("Title must be between 5 and 100 characters"),
  body("description")
    .trim()
    .isLength({ min: 50, max: 1000 })
    .withMessage("Description must be between 50 and 1000 characters"),
  body("propertyType")
    .isIn([
      "apartment",
      "house",
      "villa",
      "condo",
      "townhouse",
      "cabin",
      "cottage",
      "loft",
      "studio",
      "other",
    ])
    .withMessage("Invalid property type"),
  body("roomType")
    .isIn(["entire_place", "private_room", "shared_room"])
    .withMessage("Invalid room type"),
  body("accommodates")
    .isInt({ min: 1, max: 20 })
    .withMessage("Accommodates must be between 1 and 20"),
  body("bedrooms")
    .isInt({ min: 0 })
    .withMessage("Bedrooms must be a non-negative number"),
  body("bathrooms")
    .isFloat({ min: 0.5 })
    .withMessage("Bathrooms must be at least 0.5"),
  body("beds").isInt({ min: 1 }).withMessage("Beds must be at least 1"),
  body("pricing.basePrice")
    .isFloat({ min: 1 })
    .withMessage("Base price must be at least $1"),
  body("location.address").trim().notEmpty().withMessage("Address is required"),
  body("location.city").trim().notEmpty().withMessage("City is required"),
  body("location.state").trim().notEmpty().withMessage("State is required"),
  body("location.country").trim().notEmpty().withMessage("Country is required"),
  // Add zipCode validation since it's required in the model
  body("location.zipCode").trim().notEmpty().withMessage("Zip code is required"),
  body("location.coordinates.lat")
    .isFloat({ min: -90, max: 90 })
    .withMessage("Invalid latitude"),
  body("location.coordinates.lng")
    .isFloat({ min: -180, max: 180 })
    .withMessage("Invalid longitude"),
  handleValidationErrors,
];

// Booking validation rules
const validateBooking = [
  body("checkIn")
    .isISO8601()
    .toDate()
    .custom((value) => {
      if (value <= new Date()) {
        throw new Error("Check-in date must be in the future");
      }
      return true;
    }),
  body("checkOut")
    .isISO8601()
    .toDate()
    .custom((value, { req }) => {
      if (value <= new Date(req.body.checkIn)) {
        throw new Error("Check-out date must be after check-in date");
      }
      return true;
    }),
  body("guests.adults")
    .isInt({ min: 1 })
    .withMessage("At least 1 adult is required"),
  body("guests.children")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Children count must be non-negative"),
  body("guests.infants")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Infants count must be non-negative"),
  handleValidationErrors,
];

// Review validation rules
const validateReview = [
  body("ratings.overall")
    .isInt({ min: 1, max: 5 })
    .withMessage("Overall rating must be between 1 and 5"),
  body("ratings.cleanliness")
    .isInt({ min: 1, max: 5 })
    .withMessage("Cleanliness rating must be between 1 and 5"),
  body("ratings.communication")
    .isInt({ min: 1, max: 5 })
    .withMessage("Communication rating must be between 1 and 5"),
  body("ratings.checkIn")
    .isInt({ min: 1, max: 5 })
    .withMessage("Check-in rating must be between 1 and 5"),
  body("ratings.accuracy")
    .isInt({ min: 1, max: 5 })
    .withMessage("Accuracy rating must be between 1 and 5"),
  body("ratings.location")
    .isInt({ min: 1, max: 5 })
    .withMessage("Location rating must be between 1 and 5"),
  body("ratings.value")
    .isInt({ min: 1, max: 5 })
    .withMessage("Value rating must be between 1 and 5"),
  body("comment")
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage("Comment must be between 10 and 1000 characters"),
  handleValidationErrors,
];

module.exports = {
  validateProperty,
  validateBooking,
  validateReview,
  handleValidationErrors,
};