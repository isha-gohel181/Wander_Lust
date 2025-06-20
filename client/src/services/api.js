import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

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
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || "Something went wrong";

    if (error.response?.status === 401) {
      console.error("Unauthorized access - check authentication.");
    }

    if (error.response?.status === 404) {
      console.error("Route not found - check endpoint URL.");
    }

    return Promise.reject(new Error(message));
  }
);

export default api;
