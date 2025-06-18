// server/src/models/Property.js
const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    location: {
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
      zipCode: {
        type: String,
        required: true,
      },
      coordinates: {
        lat: {
          type: Number,
          required: true,
        },
        lng: {
          type: Number,
          required: true,
        },
      },
    },
    propertyType: {
      type: String,
      required: true,
      enum: [
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
      ],
    },
    roomType: {
      type: String,
      required: true,
      enum: ["entire_place", "private_room", "shared_room"],
    },
    accommodates: {
      type: Number,
      required: true,
      min: 1,
      max: 20,
    },
    bedrooms: {
      type: Number,
      required: true,
      min: 0,
    },
    bathrooms: {
      type: Number,
      required: true,
      min: 0.5,
    },
    beds: {
      type: Number,
      required: true,
      min: 1,
    },
    pricing: {
      basePrice: {
        type: Number,
        required: true,
        min: 0,
      },
      currency: {
        type: String,
        default: "INR",
      },
      cleaningFee: {
        type: Number,
        default: 0,
      },
      serviceFee: {
        type: Number,
        default: 0,
      },
      weeklyDiscount: {
        type: Number,
        default: 0,
        max: 50,
      },
      monthlyDiscount: {
        type: Number,
        default: 0,
        max: 50,
      },
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        publicId: {
          type: String,
          required: true,
        },
        isPrimary: {
          type: Boolean,
          default: false,
        },
      },
    ],
    amenities: [
      {
        type: String,
        enum: [
          "wifi",
          "tv",
          "kitchen",
          "washer",
          "free_parking",
          "paid_parking",
          "air_conditioning",
          "heating",
          "pool",
          "hot_tub",
          "gym",
          "breakfast",
          "laptop_workspace",
          "fireplace",
          "iron",
          "hair_dryer",
          "essentials",
          "shampoo",
          "hangers",
          "bed_linens",
          "extra_pillows",
          "smoke_alarm",
          "carbon_monoxide_alarm",
          "fire_extinguisher",
          "first_aid_kit",
        ],
      },
    ],
    houseRules: {
      checkInTime: {
        type: String,
        default: "15:00",
      },
      checkOutTime: {
        type: String,
        default: "11:00",
      },
      smokingAllowed: {
        type: Boolean,
        default: false,
      },
      petsAllowed: {
        type: Boolean,
        default: false,
      },
      partiesAllowed: {
        type: Boolean,
        default: false,
      },
      maxGuests: {
        type: Number,
        default: function () {
          return this.accommodates;
        },
      },
      additionalRules: [
        {
          type: String,
          maxlength: 200,
        },
      ],
    },
    availability: {
      isActive: {
        type: Boolean,
        default: true,
      },
      calendar: [
        {
          date: {
            type: Date,
            required: true,
          },
          isAvailable: {
            type: Boolean,
            default: true,
          },
          price: {
            type: Number,
          },
        },
      ],
      minStay: {
        type: Number,
        default: 1,
      },
      maxStay: {
        type: Number,
        default: 365,
      },
    },
    ratings: {
      overall: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      cleanliness: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      communication: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      checkIn: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      accuracy: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      location: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      value: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    bookingCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better performance
propertySchema.index({ host: 1 });
propertySchema.index({ "location.coordinates": "2dsphere" });
propertySchema.index({ propertyType: 1 });
propertySchema.index({ "pricing.basePrice": 1 });
propertySchema.index({ "ratings.overall": -1 });
propertySchema.index({ createdAt: -1 });
propertySchema.index({ isActive: 1 });

// Virtual for calculating total price with fees
propertySchema.virtual("totalPricePerNight").get(function () {
  return (
    this.pricing.basePrice + this.pricing.cleaningFee + this.pricing.serviceFee
  );
});

module.exports = mongoose.model("Property", propertySchema);
