const Review = require("../models/Review");
const Booking = require("../models/Booking");
const Property = require("../models/Property");
const User = require("../models/User");

// ✅ Create a review
const createReview = async (req, res) => {
  try {
    const { bookingId, ratings, comment } = req.body;

    const user = await User.findOne({ clerkId: req.clerkId });
    if (!user) return res.status(404).json({ message: "User not found" });

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.guest.toString() !== user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You can only review your own bookings" });
    }

    if (booking.status !== "completed") {
      return res
        .status(400)
        .json({ message: "You can only review completed stays" });
    }

    const existingReview = await Review.findOne({ booking: bookingId });
    if (existingReview) {
      return res
        .status(400)
        .json({ message: "Review already exists for this booking" });
    }

    const review = new Review({
      property: booking.property,
      guest: user._id,
      host: booking.host,
      booking: bookingId,
      ratings,
      comment,
    });

    await review.save();

    booking.review = review._id;
    await booking.save();

    await updatePropertyRatings(booking.property);

    await review.populate([
      { path: "guest", select: "firstName lastName avatar" },
      { path: "property", select: "title" },
    ]);

    res.status(201).json(review);
  } catch (error) {
    console.error("Create review error:", error);
    res.status(500).json({ message: "Failed to create review" });
  }
};

// ✅ Get all public reviews for a property
const getPropertyReviews = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const reviews = await Review.find({ property: propertyId, isVisible: true })
      .populate("guest", "firstName lastName avatar")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Review.countDocuments({
      property: propertyId,
      isVisible: true,
    });

    res.status(200).json({
      reviews,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalCount: total,
      },
    });
  } catch (error) {
    console.error("Get property reviews error:", error);
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
};

// ✅ Add host reply to a review
const addHostReply = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { comment } = req.body;

    const user = await User.findOne({ clerkId: req.clerkId });
    if (!user) return res.status(404).json({ message: "User not found" });

    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ message: "Review not found" });

    if (review.host.toString() !== user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Only the host can reply to reviews" });
    }

    review.hostReply = {
      comment,
      createdAt: new Date(),
    };

    await review.save();
    res.status(200).json(review);
  } catch (error) {
    console.error("Add host reply error:", error);
    res.status(500).json({ message: "Failed to add host reply" });
  }
};

// ✅ Update average property ratings
const updatePropertyRatings = async (propertyId) => {
  try {
    const reviews = await Review.find({
      property: propertyId,
      isVisible: true,
    });
    if (reviews.length === 0) return;

    const totals = {
      overall: 0,
      cleanliness: 0,
      communication: 0,
      checkIn: 0,
      accuracy: 0,
      location: 0,
      value: 0,
    };

    reviews.forEach((review) => {
      Object.keys(totals).forEach((key) => {
        totals[key] += review.ratings[key];
      });
    });

    const averages = {};
    Object.keys(totals).forEach((key) => {
      averages[key] = parseFloat((totals[key] / reviews.length).toFixed(2));
    });

    await Property.findByIdAndUpdate(propertyId, {
      ratings: averages,
      reviewCount: reviews.length,
    });
  } catch (error) {
    console.error("Update property ratings error:", error);
  }
};

module.exports = {
  createReview,
  getPropertyReviews,
  addHostReply,
};
