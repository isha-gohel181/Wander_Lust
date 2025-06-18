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
        default: "INR",
      },
    },

    // Add a direct totalAmount field for easier access
    totalAmount: {
      type: Number,
      // This will be automatically set from pricing.total
    },

    payment: {
      orderId: String,
      paymentId: String,
      cfOrderId: String,
      amount: Number,
      currency: {
        type: String,
        default: "INR",
      },
      status: {
        type: String,
        enum: ["pending", "success", "failed","paid", "cancelled", "refunded"],
        default: "pending",
      },
      gateway: {
        type: String,
        enum: ["cashfree", "other"],
        default: "cashfree",
      },
      method: String,
      createdAt: Date,
      paidAt: Date,
      refundId: String,
      refundAmount: Number,
      refundedAt: Date,
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
        "payment_failed",
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
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
bookingSchema.index({ property: 1 });
bookingSchema.index({ guest: 1 });
bookingSchema.index({ host: 1 });
bookingSchema.index({ checkIn: 1, checkOut: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ createdAt: -1 });

// Virtual: Number of Nights
bookingSchema.virtual("numberOfNights").get(function () {
  const timeDiff = new Date(this.checkOut) - new Date(this.checkIn);
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
});

// Virtual: Total Guests
bookingSchema.virtual("totalGuests").get(function () {
  return this.guests.adults + this.guests.children + this.guests.infants;
});

// Pre-save middleware to ensure totalAmount is set
bookingSchema.pre("save", function (next) {
  // Ensure totalAmount matches pricing.total
  if (this.pricing && this.pricing.total) {
    this.totalAmount = this.pricing.total;
  }

  // Calculate total guests for legacy compatibility
  if (this.guests) {
    this.totalGuests =
      this.guests.adults + this.guests.children + this.guests.infants;
  }

  next();
});

// Method to get the booking total amount
bookingSchema.methods.getTotalAmount = function () {
  return this.totalAmount || this.pricing?.total || 0;
};

// Static method to create a booking with proper total amount
bookingSchema.statics.createBooking = function (bookingData) {
  if (bookingData.pricing && bookingData.pricing.total) {
    bookingData.totalAmount = bookingData.pricing.total;
  }
  return this.create(bookingData);
};

module.exports = mongoose.model("Booking", bookingSchema);
