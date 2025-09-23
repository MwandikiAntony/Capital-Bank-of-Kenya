// frontend/src/components/LoanApplication.js
import React, { useState } from "react";

export default function LoanApplication({ userId }) {
  const [amount, setAmount] = useState("");
  const [repaymentMonths, setRepaymentMonths] = useState("1");
  const [message, setMessage] = useState("");

  const handleApply = async () => {
    const res = await fetch("http://localhost:5000/api/loans/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, amount, repaymentMonths }),
    });

    const data = await res.json();
    setMessage(data.message || data.error);
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Apply for a Loan</h2>

      <label className="block mb-2">Loan Amount (Ksh)</label>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full border px-3 py-2 rounded mb-4"
        min="100"
        max="50000"
      />

      <label className="block mb-2">Repayment Period (Months)</label>
      <select
        value={repaymentMonths}
        onChange={(e) => setRepaymentMonths(e.target.value)}
        className="w-full border px-3 py-2 rounded mb-4"
      >
        <option value="1">1 Month</option>
        <option value="2">2 Months</option>
        <option value="3">3 Months</option>
        <option value="6">6 Months</option>
        <option value="10">10 Months</option>
      </select>

      <button
        onClick={handleApply}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Apply
      </button>

      {message && <p className="mt-4 text-sm text-gray-700">{message}</p>}
    </div>
  );
}
