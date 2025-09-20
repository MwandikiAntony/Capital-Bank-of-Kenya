import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    if (!agree) {
      setError("You must agree to the Terms & Conditions to continue.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative px-4 
      bg-gradient-to-br from-indigo-200 via-blue-100 to-indigo-300">

      {/* Decorative background glow */}
      <div className="absolute inset-0 
        bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.6),transparent_60%),radial-gradient(circle_at_80%_70%,rgba(255,255,255,0.4),transparent_70%)]">
      </div>

      {/* Card */}
      <div className="relative w-full max-w-md bg-white/90 backdrop-blur-lg 
        rounded-2xl shadow-2xl p-8 border border-indigo-200">

        {/* Logo / Branding */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-600 to-blue-500 
            flex items-center justify-center text-white text-xl font-bold shadow-lg">
            CK
          </div>
          <h1 className="mt-4 text-2xl font-semibold text-gray-800">Sign Up</h1>
          <p className="text-sm text-gray-500 mt-1">Open your secure mobile banking account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-5">
          <fieldset className="border border-indigo-200 rounded-lg p-4 bg-indigo-50/30">
            <legend className="px-2 text-sm font-medium text-indigo-700">Personal Info</legend>

            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">Full name</label>
              <input
                type="text"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </fieldset>

          {/* Terms */}
          <div className="flex items-start gap-3">
            <input
              id="terms"
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="mt-1 h-4 w-4 text-indigo-600 border-gray-300 rounded"
            />
            <label htmlFor="terms" className="text-sm text-gray-700">
              By registering I agree to the{" "}
              <Link to="/terms" className="text-indigo-600 font-medium hover:underline">
                Terms & Conditions
              </Link>.
            </label>
          </div>

          {/* Error */}
          {error && <p className="text-sm text-red-600">{error}</p>}

          {/* Submit */}
          <button
            type="submit"
            disabled={!agree || loading}
            className={`w-full py-3 rounded-lg text-white font-semibold shadow-md transition ${
              !agree || loading
                ? "bg-indigo-300 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600"
            }`}
          >
            {loading ? "Creating account..." : "Create account"}
          </button>

          {/* Switch to Login */}
          <div className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 font-medium hover:underline">
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
