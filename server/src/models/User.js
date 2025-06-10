// server/src/models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    avatar: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
      maxlength: 500,
    },
    role: {
      type: String,
      enum: ["guest", "host", "admin"],
      default: "guest",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    properties: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property",
      },
    ],
    bookings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
      },
    ],
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property",
      },
    ],
    dateJoined: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// // Indexes for better performance
// userSchema.index({ clerkId: 1 });
// userSchema.index({ email: 1 });

module.exports = mongoose.model("User", userSchema);
