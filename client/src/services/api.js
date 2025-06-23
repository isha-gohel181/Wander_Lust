//client/src/services/api.js
import axios from "axios";
import toast from "react-hot-toast"; // ✅ import toast

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:10000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 seconds
});

// Request Interceptor: attach Clerk token if available
api.interceptors.request.use(
  async (config) => {
    try {
      let token = null;
      let retries = 5;

      while (retries > 0 && !token) {
        if (window.Clerk?.loaded && window.Clerk?.session) {
          token = await window.Clerk.session.getToken();
        }

        if (token) break;

        await new Promise((resolve) => setTimeout(resolve, 200));
        retries--;
      }

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      console.error("Failed to attach Clerk token:", err.message);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response Interceptor with Toast for Errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = "Something went wrong. Please try again later.";

    if (error.code === "ECONNABORTED") {
      message = "Server is taking too long to respond. Please try again.";
    } else if (error.response?.status === 401) {
      message = "Unauthorized. Please sign in again.";
    } else if (error.response?.status === 404) {
      message = "Resource not found.";
    } else if (error.response?.status === 429) {
      message = "Too many requests. Please slow down.";
    } else if (error.response?.data?.message) {
      message = error.response.data.message;
    }

    // ✅ Show the error as a toast
    if (typeof window !== "undefined") {
      toast.error(message, {
        duration: 4000,
        position: "top-right",
      });
    }

    return Promise.reject(new Error(message));
  }
);

export default api;
