//client/src/services/api.js
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

console.log("🔧 API_BASE_URL:", API_BASE_URL); // Debug log

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    try {
      // Log the full URL being requested
      const fullUrl = `${config.baseURL}${config.url}`;
      console.log("🚀 Making request to:", fullUrl);
      console.log("🔧 Method:", config.method?.toUpperCase());

      const token = await window.Clerk?.session?.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log("✅ Token added to request");
      } else {
        console.warn("⚠️ No Clerk token available");
      }
    } catch (err) {
      console.error("❌ Failed to get Clerk token", err);
    }
    return config;
  },
  (error) => {
    console.error("❌ Request interceptor error:", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log("✅ Response received:", response.status, response.config.url);
    return response;
  },
  (error) => {
    const message =
      error.response?.data?.message || error.message || "Something went wrong";

    console.error("❌ API Error:", {
      status: error.response?.status,
      message,
      url: error.config?.url,
      method: error.config?.method,
      fullUrl: `${error.config?.baseURL}${error.config?.url}`,
    });

    if (error.response?.status === 401) {
      console.error("🔒 Unauthorized access - check authentication");
    }

    return Promise.reject(new Error(message));
  }
);

export default api;
