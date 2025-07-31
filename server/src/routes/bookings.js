const express = require("express");
const {
  createBooking,
  getMyBookings,
  getHostBookings,
  getAllBookings, // ADD THIS
  updateBookingStatus,
} = require("../controllers/bookingController");
const {
  requireAuth,
  requireHost,
  requireAdmin,
} = require("../middleware/auth");
const { validateBooking } = require("../middleware/validation");

const router = express.Router();

router.use(requireAuth);

router.post("/", validateBooking, createBooking);
router.get("/my-bookings", getMyBookings);
router.get("/host-bookings", requireHost, getHostBookings);
router.get("/all", requireAdmin, getAllBookings); // ADD THIS
router.patch("/:id/status", updateBookingStatus);

module.exports = router;
