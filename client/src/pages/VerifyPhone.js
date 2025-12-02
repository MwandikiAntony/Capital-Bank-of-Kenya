import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function VerifyPhone() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId"); // stored during register

const handleVerify = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

try {
  const token = localStorage.getItem("token");
  console.log("Token:", token);

  if (!token) {
    console.error("❌ No token found in localStorage");
    return;
  }

  const res = await axios.post(
    "/auth/verify-phone",
    {
      userId,
      otp,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  alert(res.data.message);


    // Fetch updated user data
   
    const userRes = await axios.get("/auth/user", {
      headers: { Authorization: `Bearer ${token}` }
    });

    const updatedUser = userRes.data.user;

    // Update localStorage
    localStorage.setItem("user", JSON.stringify(updatedUser));

    // Navigate based on latest user status
    if (!updatedUser.email_verified) {
      navigate("/verify-email");
    } else {
      navigate("/dashboard/overview");
    }

  } catch (err) {
    console.error("OTP verify error:", err);
    setError(err.response?.data?.error || "Verification failed");
  } finally {
    setLoading(false);
  }
};



  const handleResend = async () => {
    setError("");
    setResendLoading(true);

    try {
      const res = await axios.post("/auth/resend-phone-otp", {
        userId,
      });
      alert(res.data.message);
    } catch (err) {
      console.error("Resend OTP error:", err);
      setError(err.response?.data?.error || "Failed to resend OTP");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-xl font-semibold text-center mb-6">Verify Phone</h1>

        <form onSubmit={handleVerify} className="space-y-4">
          <input
            type="text"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full p-3 border rounded-lg"
            required
          />

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-semibold ${
              loading
                ? "bg-gray-400 cursor-wait"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {loading ? "Verifying..." : "Verify Phone"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={handleResend}
            disabled={resendLoading}
            className="text-sm text-indigo-600 hover:underline"
          >
            {resendLoading ? "Resending..." : "Didn’t get OTP? Resend"}
          </button>
        </div>
      </div>
    </div>
  );
}
