import React, { useState } from "react";
import axios from "axios";

export default function Deposit({ addNotification, fetchAccount, darkMode }) {
  const [amount, setAmount] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleDeposit = async (e) => {
    e.preventDefault();
    if (!amount || !phone) return alert("Enter phone and amount");

    setLoading(true);
    try {
      const userId = localStorage.getItem("userId"); // stored after login

      await axios.post("http://localhost:5000/api/mpesa/stkpush", {
        phone,
        amount,
        userId,
      });

      setMessage("✅ STK Push sent! Check your phone to complete payment.");
      addNotification?.(`Deposit request of Ksh ${amount} sent to ${phone}.`);

      setAmount("");
      setPhone("");
      fetchAccount?.(); // refresh account (and balance)
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to initiate deposit.");
    }
    setLoading(false);
  };

  return (
    <div
      className={`${
        darkMode ? "bg-gray-700 text-white" : "bg-white text-gray-900"
      } p-6 rounded-xl shadow w-full mb-8`}
    >
      <h3 className="font-semibold mb-3">Deposit via M-Pesa</h3>
      <form onSubmit={handleDeposit}>
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          className="w-full p-3 border rounded-lg mb-3 dark:bg-gray-800 dark:border-gray-600"
        />
        <input
          type="text"
          placeholder="Phone (2547XXXXXXXX)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          className="w-full p-3 border rounded-lg mb-3 dark:bg-gray-800 dark:border-gray-600"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 rounded-lg shadow hover:bg-blue-600"
        >
          {loading ? "Processing..." : "Deposit"}
        </button>
      </form>
      {message && (
        <p
          className={`mt-3 text-sm ${
            message.includes("✅")
              ? "text-green-500"
              : message.includes("❌")
              ? "text-red-500"
              : "text-gray-500"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
