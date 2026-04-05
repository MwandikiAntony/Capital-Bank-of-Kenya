// client/src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import axios from "axios";
import "./index.css";
import App from "./App";

// ── Auth bootstrap ─────────────────────────────────────────────
// Restore token on page load so all axios requests include the header
const token = localStorage.getItem("token");
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

// ── Global 401 interceptor ─────────────────────────────────────
// Automatically clears auth state and redirects to /login on expired sessions
axios.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("userId");
      delete axios.defaults.headers.common["Authorization"];
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

// ── Render ─────────────────────────────────────────────────────
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);