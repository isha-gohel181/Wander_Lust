// client/src/hooks/useBookings.js
import { useState, useEffect, useCallback } from "react";
import { bookingService } from "../services/bookings";
import toast from "react-hot-toast";

export const useBookings = (type = "guest") => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data =
        type === "host"
          ? await bookingService.getHostBookings()
          : await bookingService.getMyBookings();

      setBookings(data);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [type]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const createBooking = async (bookingData) => {
    try {
      const newBooking = await bookingService.createBooking(bookingData);
      setBookings((prev) => [newBooking, ...prev]);
      toast.success("Booking created successfully!");
      return newBooking;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  const updateBookingStatus = async (bookingId, status, reason = "") => {
    try {
      const updatedBooking = await bookingService.updateBookingStatus(
        bookingId,
        status,
        reason
      );
      setBookings((prev) =>
        prev.map((booking) =>
          booking._id === bookingId ? updatedBooking : booking
        )
      );
      toast.success("Booking status updated");
      return updatedBooking;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  return {
    bookings,
    loading,
    error,
    createBooking,
    updateBookingStatus,
    refresh: fetchBookings,
  };
};
