// src/components/ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ currentUser, children }) {
  const isComplete = currentUser?.phone && currentUser?.national_id;

  if (!isComplete) {
    return <Navigate to="/update-profile" replace />;
  }

  return children;
}
