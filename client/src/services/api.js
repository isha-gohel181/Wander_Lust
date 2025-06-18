import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    try {
      const token = await window.Clerk?.session?.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      console.error("Failed to get Clerk token:", err.message);
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error.message);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || "Something went wrong";

    console.error("API Error:", {
      status: error.response?.status,
      message,
      url: error.config?.url,
      method: error.config?.method,
    });

    if (error.response?.status === 401) {
      console.error("Unauthorized access - check authentication");
    }

    return Promise.reject(new Error(message));
  }
);

export default api;
