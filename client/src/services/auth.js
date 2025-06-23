//client/src/services/auth.js
import api from "./api";

export const authService = {
  getProfile: async () => {
    const response = await api.get("/users/profile");
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put("/users/profile", profileData);
    return response.data;
  },

  becomeHost: async () => {
    const response = await api.post("/users/become-host");
    return response.data;
  },

  getWishlist: async () => {
    const response = await api.get("/users/wishlist");
    return response.data;
  },

  addToWishlist: async (propertyId) => {
    const response = await api.post(`/users/wishlist/${propertyId}`);
    return response.data;
  },

  removeFromWishlist: async (propertyId) => {
    const response = await api.delete(`/users/wishlist/${propertyId}`);
    return response.data;
  },
};
