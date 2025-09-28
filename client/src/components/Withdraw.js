import React, { useState, useEffect, useRef } from "react"; 
import axios from "axios";
import { io } from "socket.io-client";

export default function Withdraw({ addNotification, fetchAccount, darkMode }) {
  const [amount, setAmount] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState(null);

  const socketRef = useRef(null); // ✅ persist socket across renders

  // Fetch userId and optionally phone from localStorage
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const storedPhone = localStorage.getItem("userPhone"); 
    if (storedUserId) setUserId(storedUserId);
    if (storedPhone) setPhone(storedPhone);
    if (!storedUserId) setMessage("❌ User not logged in.");
  }, []);

  // Setup WebSocket only once
  useEffect(() => {
    if (!userId) return;

    // ✅ create socket only if not already created
    if (!socketRef.current) {
      socketRef.current = io("http://localhost:5000", { transports: ["websocket", "polling"] });

      socketRef.current.on("connect", () => {
        console.log("Connected to Socket.IO:", socketRef.current.id);
        socketRef.current.emit("joinUserRoom", userId);
      });

      socketRef.current.on("balanceUpdated", () => {
        fetchAccount?.();
      });

      socketRef.current.on("disconnect", () => {
        console.log("Socket disconnected");
      });
    }

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [userId, fetchAccount]);

  const handleWithdraw = async () => {
    if (!amount) return alert("Enter amount");
    if (!phone) return alert("Enter phone number");
    if (!userId) return alert("User not logged in");

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/mpesa/withdraw", {
        phone,
        amount,
        userId,
      });

      setMessage(res.data.ResponseDescription || "✅ Withdraw request sent");
      addNotification?.(`Withdrawal request of Ksh ${amount} sent to ${phone}.`);
      setAmount("");
      fetchAccount?.(); 
    } catch (err) {
      console.error(err.response?.data || err.message);
      setMessage(err.response?.data?.error || "❌ Withdraw failed");
    }
    setLoading(false);
  };

  return (
    <div className={`${darkMode ? "bg-gray-700 text-white" : "bg-white text-gray-900"} p-6 rounded-xl shadow w-full mb-8`}>
      <h3 className="font-semibold mb-3">Withdraw</h3>

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

      {message && (
        <p className={`mt-3 text-sm ${message.includes("✅") ? "text-green-500" : message.includes("❌") ? "text-red-500" : "text-gray-500"}`}>
          {message}
        </p>
      )}
    </div>
  );
}
