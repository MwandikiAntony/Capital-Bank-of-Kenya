import React, { useState } from "react";
import axios from "axios";

export default function Deposit() {
  const [amount, setAmount] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const handleDeposit = async (e) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem("userId"); // assuming stored after login
      const res = await axios.post("http://localhost:5000/api/mpesa/stkpush", {
        phone,
        amount,
        userId
      });
      setMessage("STK Push sent! Check your phone to complete payment.");
      console.log(res.data);
    } catch (err) {
      console.error(err);
      setMessage("Failed to initiate deposit.");
    }
  };

  return (
    <div className="deposit-box">
      <h3>Deposit via M-Pesa</h3>
      <form onSubmit={handleDeposit}>
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Phone (2547XXXXXXXX)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <button type="submit">Deposit</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
