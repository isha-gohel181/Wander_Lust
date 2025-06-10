// server/src/models/Booking.js
const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
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
    checkIn: {
      type: Date,
      required: true,
    },
    checkOut: {
      type: Date,
      required: true,
    },
    guests: {
      adults: {
        type: Number,
        required: true,
        min: 1,
      },
      children: {
        type: Number,
        default: 0,
        min: 0,
      },
      infants: {
        type: Number,
        default: 0,
        min: 0,
      },
      pets: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
    pricing: {
      basePrice: {
        type: Number,
        required: true,
      },
      nights: {
        type: Number,
        required: true,
      },
      subtotal: {
        type: Number,
        required: true,
      },
      cleaningFee: {
        type: Number,
        default: 0,
      },
      serviceFee: {
        type: Number,
        default: 0,
      },
      taxes: {
        type: Number,
        default: 0,
      },
      total: {
        type: Number,
        required: true,
      },
      currency: {
        type: String,
        default: "USD",
      },
    },
    paymentDetails: {
      paymentMethod: {
        type: String,
        enum: ["credit_card", "debit_card", "paypal", "stripe"],
        required: true,
      },
      paymentStatus: {
        type: String,
        enum: ["pending", "paid", "failed", "refunded", "partially_refunded"],
        default: "pending",
      },
      transactionId: {
        type: String,
      },
      paidAt: {
        type: Date,
      },
    },
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "cancelled_by_guest",
        "cancelled_by_host",
        "completed",
        "no_show",
      ],
      default: "pending",
    },
    specialRequests: {
      type: String,
      maxlength: 500,
    },
    cancellation: {
      cancelledBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      cancelledAt: {
        type: Date,
      },
      reason: {
        type: String,
        maxlength: 500,
      },
      refundAmount: {
        type: Number,
        default: 0,
      },
    },
    review: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
bookingSchema.index({ property: 1 });
bookingSchema.index({ guest: 1 });
bookingSchema.index({ host: 1 });
bookingSchema.index({ checkIn: 1, checkOut: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ createdAt: -1 });

// Virtual for calculating number of nights
bookingSchema.virtual("numberOfNights").get(function () {
  const checkIn = new Date(this.checkIn);
  const checkOut = new Date(this.checkOut);
  const timeDiff = checkOut.getTime() - checkIn.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
});

// Pre-save middleware to calculate total guests
bookingSchema.pre("save", function (next) {
  this.totalGuests =
    this.guests.adults + this.guests.children + this.guests.infants;
  next();
});

module.exports = mongoose.model("Booking", bookingSchema);
