//server/src/routes/bookings.js
const express = require("express");
const {
  createBooking,
  getMyBookings,
  getHostBookings,
  updateBookingStatus,
} = require("../controllers/bookingController");
const { requireAuth, requireHost } = require("../middleware/auth");
const { validateBooking } = require("../middleware/validation");

const router = express.Router();

router.use(requireAuth);

router.post("/", validateBooking, createBooking);
router.get("/my-bookings", getMyBookings);
router.get("/host-bookings", requireHost, getHostBookings);
router.patch("/:id/status", updateBookingStatus);

module.exports = router;
