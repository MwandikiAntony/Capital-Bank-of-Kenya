import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [idNumber, setIdNumber] = useState(""); // ✅ ID number
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    // ✅ Validate phone format (must start with 07 and 10 digits)
    if (!/^07\d{8}$/.test(phone)) {
      setError("Phone number must be in format 07xxxxxxxx");
      return;
    }

    // ✅ Validate PIN (must be 4 digits)
    if (!/^\d{4}$/.test(pin)) {
      setError("PIN must be exactly 4 digits");
      return;
    }

    // ✅ Validate ID number (at least 5 digits, Kenyan IDs usually 7–8 digits)
    if (!/^\d{5,10}$/.test(idNumber)) {
      setError("Enter a valid ID number (5–10 digits)");
      return;
    }

    setLoading(true);
    try {
      // Convert phone to 2547xxxxxxxx
      const formattedPhone = "254" + phone.slice(1);

      const res = await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        phone: formattedPhone,
        id_number: idNumber, // ✅ include ID number
        pin,
      });

      // Save token + userId
if (res.data.userId) {
  localStorage.setItem("userId", res.data.userId);
}
if (res.data.token) {
  localStorage.setItem("token", res.data.token);}

      alert(res.data.message || "Registration successful. Verify your phone and email.");
      
    // redirect based on verification status
    if (!res.data.phone_verified) {
      navigate("/verify-phone");
    } else if (!res.data.email_verified) {
      navigate("/verify-email");
    } else {
      navigate("/dashboard");
    }
  } catch (err) {
    console.error("Registration error:", err);
    setError(err.response?.data?.error || "Registration failed");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-200 via-blue-100 to-indigo-300 px-4">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-indigo-200">
        <h1 className="text-2xl font-semibold text-center mb-6 text-gray-800">Create Account</h1>

        <form onSubmit={handleRegister} className="space-y-5">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border rounded-lg"
            required
          />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded-lg"
            required
          />
          <input
            type="text"
            placeholder="Phone (07xxxxxxxx)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-3 border rounded-lg"
            required
          />
          <input
            type="text"
            placeholder="National ID Number"
            value={idNumber}
            onChange={(e) => setIdNumber(e.target.value)}
            className="w-full p-3 border rounded-lg"
            required
          />
          <input
            type="password"
            placeholder="4-digit PIN"
            maxLength={4}
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="w-full p-3 border rounded-lg"
            required
          />

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
            {loading ? "Registering..." : "Register"}
          </button>

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
