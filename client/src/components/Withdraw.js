import React, { useState } from "react";
import axios from "axios";

export default function Withdraw({ user, addNotification, fetchAccount, darkMode }) {
  const [amount, setAmount] = useState("");
  const [phone, setPhone] = useState(user?.phone || ""); // ✅ new state for phone
  const [loading, setLoading] = useState(false);

  const handleWithdraw = async () => {
    if (!amount) return alert("Enter amount");
    if (!phone) return alert("Enter phone number");

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/mpesa/withdraw", {
        phone,
        amount,
      });

      addNotification(`Withdraw request of Ksh ${amount} sent to ${phone}.`);
      alert(res.data.ResponseDescription || "Withdraw request sent");

      setAmount("");
      fetchAccount();
    } catch (err) {
      console.error(err);
      alert("Withdraw failed");
    }
    setLoading(false);
  };

  return (
    <div
      className={`${
        darkMode ? "bg-gray-700 text-white" : "bg-white text-gray-900"
      } p-6 rounded-xl shadow w-full mb-8`}
    >
      <h3 className="font-semibold mb-3">Withdraw</h3>

      {/* ✅ Phone number input */}
      <input
        type="text"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Phone (2547XXXXXXXX)"
        className="w-full p-3 border rounded-lg mb-3 dark:bg-gray-800 dark:border-gray-600"
      />

      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
        className="w-full p-3 border rounded-lg mb-3 dark:bg-gray-800 dark:border-gray-600"
      />

      <button
        onClick={handleWithdraw}
        disabled={loading}
        className="w-full bg-blue-500 text-white py-2 rounded-lg shadow hover:bg-blue-600"
      >
        {loading ? "Processing..." : "Withdraw"}
      </button>
    </div>
  );
}
