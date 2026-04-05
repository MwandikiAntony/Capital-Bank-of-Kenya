// client/src/utils/api.js
import axios from "axios";

/**
 * Pre-configured Axios instance for all Capital Bank API requests.
 *
 * - Base URL is read from the REACT_APP_API_URL environment variable.
 *   Set this in your .env file:  REACT_APP_API_URL=https://your-api.onrender.com/api
 *
 * - The request interceptor automatically attaches the Bearer token
 *   from localStorage to every outgoing request.
 *
 * - withCredentials: true ensures session cookies are included
 *   for endpoints that use cookie-based auth alongside JWT.
 */
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true,
});

// ── Request interceptor ────────────────────────────────────────
// Attaches the JWT token to every request automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor ───────────────────────────────────────
// Handles expired / invalid sessions globally.
// On 401: clears auth state and redirects to /login.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("userId");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;