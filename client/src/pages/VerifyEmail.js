import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import api from "./api";
export default function VerifyEmail() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

 const handleVerify = async (e) => {
  e.preventDefault();
  setError("");

  try {
    const res = await api.post("/auth/verify-email", {
      userId,
      otp,
    });

    alert(res.data.message);

    // Fetch updated user data
    const token = localStorage.getItem("token");
    const userRes = await api.get("/auth/user", {
      headers: { Authorization: `Bearer ${token}` }
    });

    const updatedUser = userRes.data.user;

    // Update localStorage
    localStorage.setItem("user", JSON.stringify(updatedUser));

    // Navigate based on updated verification status
    navigate("/dashboard/overview");

  } catch (err) {
    setError(err.response?.data?.error || "Verification failed");
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-100">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold text-center mb-4">Verify Email</h2>
        <form onSubmit={handleVerify} className="space-y-4">
          <input
            type="text"
            placeholder="Enter Email OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full p-3 border rounded-lg"
            required
          />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg"
          >
            Verify Email
          </button>
        </form>
      </div>
    </div>
  );
}
