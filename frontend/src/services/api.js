import axios from "axios";

// Create Axios instance with base configuration
const api = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request Interceptor
 * Injects the JWT token from localStorage into the Authorization header.
 */
api.interceptors.request.use(
  (config) => {
    // Retrieves token set by AuthContext
    const token = localStorage.getItem("token");

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
