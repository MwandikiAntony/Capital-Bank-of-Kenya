import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [phone, setPhone] = useState(""); // changed from email
  const [pin, setPin] = useState("");     // changed from password
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        phone, // changed
        pin,   // changed
      });

      const { token, user } = res.data;

      if (!token || !user) {
        setError("Invalid response from server. Please try again.");
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("userId", user.id);
      localStorage.setItem("userPhone", user.phone);

      if (!user.phone_verified) {
        navigate("/verify-phone");
      } else {
        navigate("/dashboard");
      }

    } catch (err) {
      console.error("Login failed:", err);
      setError(
        err.response?.data?.error ||
        "Login failed. Please check your credentials and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-200 via-blue-100 to-indigo-300 px-4">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-indigo-200">

        {/* Branding */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-600 to-blue-500 flex items-center justify-center text-white text-xl font-bold shadow-lg">
            CK
          </div>
          <h1 className="mt-4 text-2xl font-semibold text-gray-800">Welcome Back</h1>
          <p className="text-sm text-gray-500 mt-1">Sign in to access your account</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input
              type="text"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="07xxxxxxxx"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">PIN</label>
            <input
              type="password"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Your PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-semibold shadow-md transition ${
              loading
                ? "bg-indigo-300 cursor-wait"
                : "bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600"
            }`}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>

          <div className="text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-indigo-600 font-medium hover:underline"
            >
              Create Account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
