// client/src/services/reviews.js
import api from "./api";

export const reviewService = {
  // Get property reviews
  getPropertyReviews: async (propertyId, params = {}) => {
    const response = await api.get(`/reviews/property/${propertyId}`, {
      params,
    });
    return response.data;
  },

  // Create review
  createReview: async (reviewData) => {
    const response = await api.post("/reviews", reviewData);
    return response.data;
  },

  // Add host reply
  addHostReply: async (reviewId, comment) => {
    const response = await api.post(`/reviews/${reviewId}/reply`, { comment });
    return response.data;
  },
};
