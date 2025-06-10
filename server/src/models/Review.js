// server/src/models/Review.js
const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
    guest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    ratings: {
      overall: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },
      cleanliness: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },
      communication: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },
      checkIn: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },
      accuracy: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },
      location: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },
      value: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },
    },
    comment: {
      type: String,
      required: true,
      maxlength: 1000,
      trim: true,
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
      },
    ],
    hostReply: {
      comment: {
        type: String,
        maxlength: 500,
      },
      createdAt: {
        type: Date,
      },
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
    helpfulVotes: {
      type: Number,
      default: 0,
    },
    reportedBy: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        reason: {
          type: String,
          enum: ["inappropriate", "spam", "fake", "other"],
        },
        reportedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes
reviewSchema.index({ property: 1 });
reviewSchema.index({ guest: 1 });
reviewSchema.index({ booking: 1 });
reviewSchema.index({ "ratings.overall": -1 });
reviewSchema.index({ createdAt: -1 });

// Compound index to prevent duplicate reviews
reviewSchema.index({ guest: 1, booking: 1 }, { unique: true });

module.exports = mongoose.model("Review", reviewSchema);
