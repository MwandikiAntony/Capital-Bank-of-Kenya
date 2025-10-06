// utils/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Automatically include token in requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");  // or sessionStorage, depending on where you store it
 

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
