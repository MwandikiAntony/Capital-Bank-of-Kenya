import React, { useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function Statements({ transactions, darkMode }) {
  const [filter, setFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const filteredTx = transactions.filter((tx) => {
    const date = new Date(tx.created_at);

    if (filter === "month") {
      const now = new Date();
      return (
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      );
    }

    if (filter === "custom" && startDate && endDate) {
      return date >= new Date(startDate) && date <= new Date(endDate);
    }

    return true;
  });

  const totalCredit = filteredTx
    .filter((t) => t.type.toLowerCase() === "deposit")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalDebit = filteredTx
    .filter((t) => t.type.toLowerCase() !== "deposit")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  // Generate PDF
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Capital Bank of Kenya – Account Statement", 14, 15);

    const table = filteredTx.map((tx) => [
      tx.type,
      `Ksh ${tx.amount}`,
      new Date(tx.created_at).toLocaleDateString(),
      new Date(tx.created_at).toLocaleTimeString(),
    ]);

    doc.autoTable({
      head: [["Type", "Amount", "Date", "Time"]],
      body: table,
      startY: 25,
    });

    doc.save("Capital-Bank-Statement.pdf");
  };

  return (
    <div
      className={`${
        darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      } p-6 rounded-xl shadow`}
    >
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        📄 Account Statements
      </h2>

      {/* Filter Controls */}
      <div className="flex flex-wrap gap-3 mb-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="all">All Transactions</option>
          <option value="month">This Month</option>
          <option value="custom">Custom Range</option>
        </select>

        {filter === "custom" && (
          <>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="p-2 border rounded"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="p-2 border rounded"
            />
          </>
        )}

        <button
          onClick={downloadPDF}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Download PDF
        </button>
      </div>

      {/* Summary */}
      <div className="flex gap-6 mb-4">
        <p className="font-semibold">
          Total Credit: <span className="text-green-500">Ksh {totalCredit}</span>
        </p>
        <p className="font-semibold">
          Total Debit:{" "}
          <span className="text-red-500">Ksh {totalDebit}</span>
        </p>
      </div>

      {/* Statement Table */}
      <div className="overflow-x-auto max-h-96 overflow-y-auto text-sm">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="py-2 text-left">Type</th>
              <th className="py-2 text-left">Amount</th>
              <th className="py-2 text-left">Date</th>
              <th className="py-2 text-left">Time</th>
            </tr>
          </thead>
          <tbody>
            {filteredTx.length > 0 ? (
              filteredTx.map((tx) => (
                <tr key={tx.id} className="border-b">
                  <td className="py-2">{tx.type}</td>
                  <td className="py-2">Ksh {tx.amount}</td>
                  <td className="py-2">
                    {new Date(tx.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-2">
                    {new Date(tx.created_at).toLocaleTimeString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-4 text-center text-gray-500">
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
