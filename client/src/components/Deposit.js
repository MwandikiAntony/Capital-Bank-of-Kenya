import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import api from "../utils/api";
export default function Deposit({ addNotification, fetchAccount, darkMode }) {
  const [amount, setAmount] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState(null);
  const socketRef = useRef(null); // useRef to persist socket across renders

  // Fetch userId from localStorage on mount
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      setMessage("❌ User not logged in.");
    }
  }, []);

  // Setup WebSocket connection for real-time balance updates
  useEffect(() => {
    if (!userId) return;

    // Only create socket once
    if (!socketRef.current) {
      socketRef.current = io("https://capital-bank-of-kenya.onrender.com", {
        transports: ["websocket", "polling"], // allow fallback
        withCredentials: true,
      });

      socketRef.current.on("connect", () => {
        console.log("Socket connected:", socketRef.current.id);
        socketRef.current.emit("joinUserRoom", userId); // join user's room
      });

      socketRef.current.on("balanceUpdated", () => {
        fetchAccount?.();
      });

      socketRef.current.on("connect_error", (err) => {
        console.error("Socket connection error:", err.message);
      });
    }

    return () => {
      socketRef.current?.disconnect();
    };
  }, [userId, fetchAccount]);

  const handleDeposit = async (e) => {
    e.preventDefault();
    if (!amount || !phone) return alert("Enter phone and amount");
    if (!userId) return alert("User not logged in");

    setLoading(true);
    try {
      await api.post("/mpesa/stkpush", {
        phone,
        amount,
        userId,
      });

      setMessage(" STK Push sent! Check your phone to complete payment.");
      addNotification?.(`Deposit request of Ksh ${amount} sent to ${phone}.`);

      setAmount("");
      setPhone("");
      fetchAccount?.();
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
