import React, { useState } from "react";
import { FileText, Download, TrendingUp, TrendingDown } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const T = {
  navy: "#0B1F3A", navyLight: "#1A3A5C",
  gold: "#C9A84C", goldPale: "#F9F2E1",
  cream: "#FAFAF7", white: "#FFFFFF",
  border: "#E8EDF2", borderMid: "#D0D9E2",
  muted: "#6B7A8D", hint: "#A9B5C2",
  danger: "#C0392B", success: "#1A7A4A",
};

const FONT_URL = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=DM+Sans:wght@300;400;500;600&display=swap";

export default function Statements({ transactions = [], darkMode }) {
  const [filter, setFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Dark mode palette
  const bg      = darkMode ? "#0F172A" : T.white;
  const surface = darkMode ? "#1E293B" : T.cream;
  const text     = darkMode ? "#F1F5F9" : T.navy;
  const sub      = darkMode ? "#94A3B8" : T.muted;
  const bord     = darkMode ? "#1E293B" : T.border;
  const inputBg  = darkMode ? "#1E293B" : "#FAFBFC";

  const filteredTx = transactions.filter(tx => {
    const date = new Date(tx.created_at);
    if (filter === "month") {
      const now = new Date();
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }
    if (filter === "custom" && startDate && endDate) {
      return date >= new Date(startDate) && date <= new Date(endDate);
    }
    return true;
  });

  const totalCredit = filteredTx
    .filter(t => t.type.toLowerCase() === "deposit")
    .reduce((s, t) => s + Number(t.amount), 0);

  const totalDebit = filteredTx
    .filter(t => t.type.toLowerCase() !== "deposit")
    .reduce((s, t) => s + Number(t.amount), 0);

  const downloadPDF = () => {
    const doc = new jsPDF();

    // Header
    doc.setFillColor(11, 31, 58);
    doc.rect(0, 0, 220, 30, "F");
    doc.setTextColor(201, 168, 76);
    doc.setFontSize(14);
    doc.text("Capital Bank of Kenya", 14, 13);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.text("Account Statement", 14, 21);

    // Meta
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(9);
    doc.text(`Generated: ${new Date().toLocaleDateString("en-KE", { dateStyle: "long" })}`, 14, 38);
    doc.text(`Transactions: ${filteredTx.length}  |  Total Credit: KES ${totalCredit.toLocaleString()}  |  Total Debit: KES ${totalDebit.toLocaleString()}`, 14, 45);

    autoTable(doc, {
      head: [["Type", "Amount (KES)", "Date", "Time"]],
      body: filteredTx.map(tx => [
        tx.type,
        Number(tx.amount).toLocaleString(),
        new Date(tx.created_at).toLocaleDateString("en-KE"),
        new Date(tx.created_at).toLocaleTimeString("en-KE"),
      ]),
      startY: 52,
      styles: { fontSize: 9, cellPadding: 4 },
      headStyles: { fillColor: [11, 31, 58], textColor: [201, 168, 76], fontStyle: "bold" },
      alternateRowStyles: { fillColor: [250, 250, 247] },
      didParseCell: (data) => {
        if (data.section === "body" && data.column.index === 0) {
          const type = data.cell.raw?.toLowerCase();
          if (type === "deposit") data.cell.styles.textColor = [26, 122, 74];
          else data.cell.styles.textColor = [192, 57, 43];
        }
      },
    });

    doc.save("Capital-Bank-Statement.pdf");
  };

  const inputStyle = {
    padding: "9px 12px", fontSize: 13, fontFamily: "inherit",
    border: `1px solid ${bord}`, borderRadius: 8, outline: "none",
    background: inputBg, color: text, cursor: "pointer", transition: "border .2s",
  };

  return (
    <div style={{ background: bg, borderRadius: 14, padding: "28px", border: `1px solid ${bord}`, fontFamily: "'DM Sans', -apple-system, sans-serif" }}>
      <link rel="stylesheet" href={FONT_URL} />

      {/* Header row */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 28 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <FileText size={18} color={T.gold} strokeWidth={1.5} />
            <h2 style={{ fontSize: 17, fontWeight: 600, color: text, margin: 0 }}>Account Statement</h2>
          </div>
          <p style={{ fontSize: 12, color: sub, margin: 0, fontWeight: 300 }}>View, filter, and export your transaction history</p>
        </div>
        <button onClick={downloadPDF}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "9px 20px", background: T.navy, color: "white",
            border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600,
            cursor: "pointer", fontFamily: "inherit", letterSpacing: .4, transition: "background .2s",
          }}
          onMouseEnter={e => e.currentTarget.style.background = T.navyLight}
          onMouseLeave={e => e.currentTarget.style.background = T.navy}>
          <Download size={14} />
          Download PDF
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 24 }}>
        <select value={filter} onChange={e => setFilter(e.target.value)} style={inputStyle}>
          <option value="all">All Transactions</option>
          <option value="month">This Month</option>
          <option value="custom">Custom Range</option>
        </select>
        {filter === "custom" && (
          <>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={inputStyle} />
            <input type="date" value={endDate}   onChange={e => setEndDate(e.target.value)}   style={inputStyle} />
          </>
        )}
      </div>

      {/* Summary chips */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
        <div style={{
          background: darkMode ? "rgba(26,122,74,.15)" : "#EAFAF2",
          border: `1px solid ${darkMode ? "rgba(26,122,74,.3)" : "#9FEACE"}`,
          borderRadius: 10, padding: "14px 18px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
            <TrendingUp size={14} color={T.success} />
            <span style={{ fontSize: 11, color: T.success, fontWeight: 600, textTransform: "uppercase", letterSpacing: .8 }}>Total Credit</span>
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: T.success }}>
            KES {totalCredit.toLocaleString()}
          </div>
        </div>
        <div style={{
          background: darkMode ? "rgba(192,57,43,.12)" : "#FEF0EF",
          border: `1px solid ${darkMode ? "rgba(192,57,43,.3)" : "#FCCFCC"}`,
          borderRadius: 10, padding: "14px 18px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
            <TrendingDown size={14} color={T.danger} />
            <span style={{ fontSize: 11, color: T.danger, fontWeight: 600, textTransform: "uppercase", letterSpacing: .8 }}>Total Debit</span>
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: T.danger }}>
            KES {totalDebit.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Transaction table */}
      <div style={{ overflowX: "auto", borderRadius: 10, border: `1px solid ${bord}` }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 480 }}>
          <thead>
            <tr style={{ background: surface }}>
              {["Type", "Amount (KES)", "Date", "Time"].map(h => (
                <th key={h} style={{
                  padding: "11px 16px", textAlign: "left",
                  fontSize: 11, fontWeight: 600, textTransform: "uppercase",
                  letterSpacing: .8, color: sub, whiteSpace: "nowrap",
                  borderBottom: `1px solid ${bord}`,
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredTx.length > 0 ? filteredTx.map((tx, i) => {
              const isCredit = tx.type.toLowerCase() === "deposit";
              return (
                <tr key={tx.id || i}
                  style={{ borderBottom: `1px solid ${bord}`, transition: "background .15s", cursor: "default" }}
                  onMouseEnter={e => e.currentTarget.style.background = darkMode ? "rgba(255,255,255,.03)" : T.cream}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{
                      display: "inline-flex", alignItems: "center", gap: 5,
                      fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 20,
                      background: isCredit
                        ? (darkMode ? "rgba(26,122,74,.15)" : "#EAFAF2")
                        : (darkMode ? "rgba(192,57,43,.12)" : "#FEF0EF"),
                      color: isCredit ? T.success : T.danger,
                    }}>
                      {isCredit ? "↑" : "↓"} {tx.type}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px", fontWeight: 600, color: isCredit ? T.success : T.danger }}>
                    {isCredit ? "+" : "−"}{Number(tx.amount).toLocaleString()}
                  </td>
                  <td style={{ padding: "12px 16px", color: sub }}>
                    {new Date(tx.created_at).toLocaleDateString("en-KE")}
                  </td>
                  <td style={{ padding: "12px 16px", color: sub }}>
                    {new Date(tx.created_at).toLocaleTimeString("en-KE", { hour: "2-digit", minute: "2-digit" })}
                  </td>
                </tr>
              );
            }) : (
              <tr>
                <td colSpan="4" style={{ padding: "56px 20px", textAlign: "center", color: sub }}>
                  <div style={{ fontSize: 32, marginBottom: 12 }}>📄</div>
                  <div style={{ fontSize: 15, fontWeight: 500, color: text, marginBottom: 6 }}>No transactions found</div>
                  <div style={{ fontSize: 13, fontWeight: 300 }}>Try adjusting your date range or filter.</div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {filteredTx.length > 0 && (
        <p style={{ fontSize: 12, color: sub, marginTop: 14, fontWeight: 300, textAlign: "right" }}>
          Showing {filteredTx.length} transaction{filteredTx.length !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
}