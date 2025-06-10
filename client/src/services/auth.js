// client/src/services/auth.js
import api from "./api";

export const authService = {
  // Get current user profile
  getProfile: async () => {
    console.log("🔧 authService.getProfile called");
    const response = await api.get("/users/profile");
    return response.data;
  },

  // Update user profile
  updateProfile: async (profileData) => {
    console.log("🔧 authService.updateProfile called");
    const response = await api.put("/users/profile", profileData);
    return response.data;
  },

  // Become a host
  becomeHost: async () => {
    console.log("🔧 authService.becomeHost called");
    const response = await api.post("/users/become-host");
    return response.data;
  },

  // Get user's wishlist
  getWishlist: async () => {
    console.log("🔧 authService.getWishlist called");
    const response = await api.get("/users/wishlist");
    return response.data;
  },

  // Add to wishlist
  addToWishlist: async (propertyId) => {
    console.log("🔧 authService.addToWishlist called for:", propertyId);
    const response = await api.post(`/users/wishlist/${propertyId}`);
    return response.data;
  },

  // Remove from wishlist
  removeFromWishlist: async (propertyId) => {
    console.log("🔧 authService.removeFromWishlist called for:", propertyId);
    const response = await api.delete(`/users/wishlist/${propertyId}`);
    return response.data;
  },
};
