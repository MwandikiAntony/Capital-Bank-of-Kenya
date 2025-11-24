import axios from "axios";

// Use environment variable for API URL, fallback to localhost for dev
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
});

// Automatically include token in requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // or sessionStorage if you prefer
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
