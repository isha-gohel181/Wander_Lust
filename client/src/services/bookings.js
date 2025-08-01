// client/src/services/bookings.js
import api from "./api";

export const bookingService = {
  // Create new booking
  createBooking: async (bookingData) => {
    const response = await api.post("/bookings", bookingData);
    return response.data;
  },

  // Get user's bookings
  getMyBookings: async () => {
    const response = await api.get("/bookings/my-bookings");
    return response.data;
  },

  // Get host's bookings
  getHostBookings: async () => {
    const response = await api.get("/bookings/host-bookings");
    return response.data;
  },

  // Update booking status
  updateBookingStatus: async (bookingId, status, reason = "") => {
    const response = await api.patch(`/bookings/${bookingId}/status`, {
      status,
      reason,
    });
    return response.data;
  },

  //get all booking
  getAllBookings: async (params = {}) => {
    const searchParams = new URLSearchParams(params).toString();
    const response = await api.get(
      `/bookings/all${searchParams ? "?" + searchParams : ""}`
    );
    return response.data;
  },
};
