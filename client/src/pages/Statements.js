import React, { useState } from "react";
import { FileText } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function Statements({ transactions = [], darkMode }) {
  const [filter, setFilter] = useState("all");

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Statement", 14, 16);
    autoTable(doc, {
      head: [["Type", "Amount"]],
      body: transactions.map(t => [t.type, t.amount])
    });
    doc.save("statement.pdf");
  };

  return (
    <div>
      <h2><FileText /> Statements</h2>
      <button onClick={downloadPDF}>Download PDF</button>
    </div>
  );
}