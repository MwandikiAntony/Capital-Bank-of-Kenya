// frontend/src/components/LoanApplication.js

import React, { useState } from "react";
import api from "../utils/api"; // import your Axios instance

export default function LoanApplication({ userId, fetchNotifications, addNotification }) {
  const [amount, setAmount] = useState("");
  const [repaymentMonths, setRepaymentMonths] = useState("1");
  const [message, setMessage] = useState("");
  const [loan, setLoan] = useState(null);

  const handleApply = async () => {
    if (!amount || !repaymentMonths) {
      setMessage("Please enter amount & repayment period");
      return;
    }

    try {
      const res = await api.post("/loans/apply", {
        amount: Number(amount),
        repaymentMonths: Number(repaymentMonths),
      });

      setMessage(res.data.message || "Loan application successful");
      setLoan(res.data.loan);

      // After loan request success:
      fetchNotifications();
      addNotification("Loan request submitted successfully");

    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || "Network error. Please try again.");
    }
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

      {loan && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <p><strong>Loan ID:</strong> {loan.id}</p>
          <p><strong>Amount:</strong> KSh {loan.amount}</p>
          <p><strong>Status:</strong> {loan.status}</p>
          <p><strong>Repayment:</strong> {loan.repaymentMonths ?? loan.repayment_months} month(s)</p>
        </div>
      )}
    </div>
  );
}
