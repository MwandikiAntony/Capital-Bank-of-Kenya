// client/src/components/PrivateRoute.js
import React from "react";
import { Navigate } from "react-router-dom";

/**
 * Protects routes that require authentication.
 * Redirects to /login if no token is found in localStorage.
 */
export default function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}