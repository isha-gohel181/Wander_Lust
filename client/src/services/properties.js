// client/src/services/properties.js
import api from "./api";

export const propertyService = {
  // Get all properties with filters
  getProperties: async (params = {}) => {
    console.log("🔧 propertyService.getProperties called with params:", params);
    const response = await api.get("/properties", { params });
    return response.data;
  },

  // Get single property
  getProperty: async (id) => {
    console.log("🔧 propertyService.getProperty called for ID:", id);
    const response = await api.get(`/properties/${id}`);
    return response.data;
  },

  // Create new property (host only)
  createProperty: async (propertyData) => {
    console.log("🔧 propertyService.createProperty called");
    const response = await api.post("/properties", propertyData);
    return response.data;
  },

  // Update property (host only)
  updateProperty: async (id, propertyData) => {
    console.log("🔧 propertyService.updateProperty called for ID:", id);
    const response = await api.put(`/properties/${id}`, propertyData);
    return response.data;
  },

  // Delete property (host only)
  deleteProperty: async (id) => {
    console.log("🔧 propertyService.deleteProperty called for ID:", id);
    const response = await api.delete(`/properties/${id}`);
    return response.data;
  },

  // Upload property images
  uploadImages: async (propertyId, files) => {
    console.log(
      "🔧 propertyService.uploadImages called for property:",
      propertyId
    );
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("images", file);
    });

    const response = await api.post(
      `/properties/${propertyId}/images`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  // Get host's properties
  getHostProperties: async () => {
    console.log("🔧 propertyService.getHostProperties called");
    const response = await api.get("/properties/host/my-properties");
    return response.data;
  },
};
