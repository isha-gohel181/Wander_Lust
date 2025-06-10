// server/src/controllers/bookingController.js
const Booking = require("../models/Booking");
const Property = require("../models/Property");
const User = require("../models/User");

// Consistent populate options for all booking queries
const BOOKING_POPULATE_OPTIONS = [
  {
    path: "property",
    select: "title images location pricing accommodates propertyType",
    populate: {
      path: "host",
      select: "firstName lastName avatar",
    },
  },
  {
    path: "guest",
    select: "firstName lastName avatar email",
  },
  {
    path: "host",
    select: "firstName lastName avatar email",
  },
];

// Create a new booking
const createBooking = async (req, res) => {
  try {
    const { propertyId, checkIn, checkOut, guests, specialRequests } = req.body;

    const user = await User.findOne({ clerkId: req.clerkId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // Check if property is active
    if (!property.isActive) {
      return res
        .status(400)
        .json({ message: "Property is not available for booking" });
    }

    // Check guest capacity
    const totalGuests = guests.adults + guests.children + guests.infants;
    if (totalGuests > property.accommodates) {
      return res
        .status(400)
        .json({ message: "Exceeds maximum guest capacity" });
    }

    // Check availability
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    const conflictingBooking = await Booking.findOne({
      property: propertyId,
      status: { $in: ["confirmed", "pending"] },
      $or: [
        {
          checkIn: { $lte: checkInDate },
          checkOut: { $gt: checkInDate },
        },
        {
          checkIn: { $lt: checkOutDate },
          checkOut: { $gte: checkOutDate },
        },
        {
          checkIn: { $gte: checkInDate },
          checkOut: { $lte: checkOutDate },
        },
      ],
    });

    if (conflictingBooking) {
      return res
        .status(400)
        .json({ message: "Property is not available for selected dates" });
    }

    // Calculate pricing
    const nights = Math.ceil(
      (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)
    );
    const subtotal = property.pricing.basePrice * nights;
    const cleaningFee = property.pricing.cleaningFee || 0;
    const serviceFee = Math.round(subtotal * 0.14); // 14% service fee
    const taxes = Math.round((subtotal + cleaningFee + serviceFee) * 0.08); // 8% tax
    const total = subtotal + cleaningFee + serviceFee + taxes;

    const booking = new Booking({
      property: propertyId,
      guest: user._id,
      host: property.host,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests,
      specialRequests,
      pricing: {
        basePrice: property.pricing.basePrice,
        nights,
        subtotal,
        cleaningFee,
        serviceFee,
        taxes,
        total,
      },
      paymentDetails: {
        paymentMethod: "credit_card",
        paymentStatus: "pending",
      },
    });

    await booking.save();

    // Add booking to user's bookings
    user.bookings.push(booking._id);
    await user.save();

    // Populate booking for response with consistent options
    await booking.populate(BOOKING_POPULATE_OPTIONS);

    res.status(201).json(booking);
  } catch (error) {
    console.error("Create booking error:", error);
    res.status(500).json({ message: "Failed to create booking" });
  }
};

// Get user's bookings
const getMyBookings = async (req, res) => {
  try {
    const user = await User.findOne({ clerkId: req.clerkId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const bookings = await Booking.find({ guest: user._id })
      .populate(BOOKING_POPULATE_OPTIONS)
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    console.error("Get bookings error:", error);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};

// Get host's bookings
const getHostBookings = async (req, res) => {
  try {
    const user = await User.findOne({ clerkId: req.clerkId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const bookings = await Booking.find({ host: user._id })
      .populate(BOOKING_POPULATE_OPTIONS)
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    console.error("Get host bookings error:", error);
    res.status(500).json({ message: "Failed to fetch host bookings" });
  }
};

// Update booking status - FIXED: Added proper population
const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const user = await User.findOne({ clerkId: req.clerkId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check authorization
    const isHost = booking.host.toString() === user._id.toString();
    const isGuest = booking.guest.toString() === user._id.toString();

    if (!isHost && !isGuest && user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Not authorized to update this booking" });
    }

    // Validate status transitions
    const validTransitions = {
      pending: ["confirmed", "cancelled_by_host", "cancelled_by_guest"],
      confirmed: [
        "completed",
        "cancelled_by_host",
        "cancelled_by_guest",
        "no_show",
      ],
      cancelled_by_guest: [],
      cancelled_by_host: [],
      completed: [],
      no_show: [],
    };

    if (!validTransitions[booking.status].includes(status)) {
      return res.status(400).json({ message: "Invalid status transition" });
    }

    booking.status = status;

    if (status.includes("cancelled")) {
      booking.cancellation = {
        cancelledBy: user._id,
        cancelledAt: new Date(),
        reason: req.body.reason || "",
      };
    }

    await booking.save();

    // 🔥 CRITICAL FIX: Populate the booking before returning it
    const updatedBooking = await Booking.findById(id).populate(BOOKING_POPULATE_OPTIONS);

    res.json(updatedBooking);
  } catch (error) {
    console.error("Update booking status error:", error);
    res.status(500).json({ message: "Failed to update booking status" });
  }
};

// Get single booking
const getBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ clerkId: req.clerkId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const booking = await Booking.findById(id).populate(BOOKING_POPULATE_OPTIONS);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check authorization
    const isHost = booking.host._id.toString() === user._id.toString();
    const isGuest = booking.guest._id.toString() === user._id.toString();

    if (!isHost && !isGuest && user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(booking);
  } catch (error) {
    console.error("Get booking error:", error);
    res.status(500).json({ message: "Failed to fetch booking" });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getHostBookings,
  updateBookingStatus,
  getBooking,
};