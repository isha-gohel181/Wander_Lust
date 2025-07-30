import api from "./api";

export const adminService = {
  // Analytics
  getAnalytics: async () => {
    const response = await api.get("/admin/analytics");
    return response.data;
  },

  // User Management
  getAllUsers: async (page = 1, limit = 10, search = "") => {
    const response = await api.get(
      `/admin/users?page=${page}&limit=${limit}&search=${search}`
    );
    return response.data;
  },

  updateUserRole: async (userId, role) => {
    const response = await api.put(`/admin/users/${userId}/role`, { role });
    return response.data;
  },

  suspendUser: async (userId) => {
    const response = await api.put(`/admin/users/${userId}/suspend`);
    return response.data;
  },

  unsuspendUser: async (userId) => {
    const response = await api.put(`/admin/users/${userId}/unsuspend`);
    return response.data;
  },

  // Property Management - Enhanced
  getAllProperties: async (page = 1, limit = 10, filters = {}) => {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters,
    });

    const response = await api.get(`/admin/properties?${queryParams}`);
    return response.data;
  },

  getPropertyStats: async () => {
    const response = await api.get("/admin/properties/stats");
    return response.data;
  },

  updatePropertyStatus: async (propertyId, status) => {
    const response = await api.put(`/admin/properties/${propertyId}/status`, {
      status,
    });
    return response.data;
  },

  togglePropertyFeatured: async (propertyId, featured) => {
    const response = await api.put(`/admin/properties/${propertyId}/featured`, {
      featured,
    });
    return response.data;
  },

  deleteProperty: async (propertyId) => {
    const response = await api.delete(`/admin/properties/${propertyId}`);
    return response.data;
  },

  bulkUpdateProperties: async (propertyIds, updates) => {
    const response = await api.put("/admin/properties/bulk", {
      propertyIds,
      updates,
    });
    return response.data;
  },

  // Booking Management
  getAllBookings: async (page = 1, limit = 10, status = "all") => {
    const response = await api.get(
      `/admin/bookings?page=${page}&limit=${limit}&status=${status}`
    );
    return response.data;
  },

  updateBookingStatus: async (bookingId, status) => {
    const response = await api.put(`/admin/bookings/${bookingId}/status`, {
      status,
    });
    return response.data;
  },

  // Review Management
  getAllReviews: async (page = 1, limit = 10, status = "all") => {
    const response = await api.get(
      `/admin/reviews?page=${page}&limit=${limit}&status=${status}`
    );
    return response.data;
  },

  moderateReview: async (reviewId, action) => {
    const response = await api.put(`/admin/reviews/${reviewId}/moderate`, {
      action,
    });
    return response.data;
  },

  // Message Management
  getAllMessages: async (page = 1, limit = 10) => {
    const response = await api.get(
      `/admin/messages?page=${page}&limit=${limit}`
    );
    return response.data;
  },

  getFlaggedMessages: async () => {
    const response = await api.get("/admin/messages/flagged");
    return response.data;
  },
};
