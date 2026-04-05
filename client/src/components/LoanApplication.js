import React, { useState } from "react";
import { BarChart3, CheckCircle, AlertCircle, Clock } from "lucide-react";
import api from "../utils/api";

const T = {
  navy: "#0B1F3A", navyLight: "#1A3A5C",
  gold: "#C9A84C", goldPale: "#F9F2E1",
  cream: "#FAFAF7", white: "#FFFFFF",
  border: "#E8EDF2", muted: "#6B7A8D", hint: "#A9B5C2",
  danger: "#C0392B", success: "#1A7A4A",
  darkCard: "#112234", darkBord: "#1A3050", darkSurf: "#0D1E35",
};

const FONT_URL = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=DM+Sans:wght@300;400;500;600&display=swap";

const PERIODS = [
  { value: "1",  label: "1 Month" },
  { value: "2",  label: "2 Months" },
  { value: "3",  label: "3 Months" },
  { value: "6",  label: "6 Months" },
  { value: "10", label: "10 Months" },
];

// Simple monthly interest estimate (flat 5%)
function calcMonthly(amount, months) {
  if (!amount || !months) return null;
  const total = Number(amount) * 1.05;
  return (total / Number(months)).toFixed(2);
}

export default function LoanApplication({ userId, fetchNotifications, addNotification, darkMode }) {
  const dark = darkMode;
  const [amount, setAmount]           = useState("");
  const [repaymentMonths, setMonths]  = useState("3");
  const [status, setStatus]           = useState(null); // { type, text }
  const [loan, setLoan]               = useState(null);
  const [loading, setLoading]         = useState(false);
  const [focused, setFocused]         = useState(false);

  const monthly = calcMonthly(amount, repaymentMonths);

  const handleApply = async () => {
    if (!amount || !repaymentMonths) {
      setStatus({ type: "error", text: "Please enter an amount and select a repayment period." });
      return;
    }
    setLoading(true);
    setStatus(null);
    try {
      const res = await api.post("/loans/apply", {
        amount: Number(amount),
        repaymentMonths: Number(repaymentMonths),
      });
      setStatus({ type: "success", text: res.data.message || "Loan application submitted successfully." });
      setLoan(res.data.loan);
      fetchNotifications?.();
      addNotification?.("Loan request submitted successfully.");
      setAmount("");
      setMonths("3");
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", text: err.response?.data?.error || "Network error. Please try again." });
    }
    setLoading(false);
  };

  const statusColors = {
    success: { bg: dark ? "rgba(26,122,74,.15)" : "#EAFAF2",  border: dark ? "rgba(26,122,74,.3)"  : "#9FEACE", text: T.success, Icon: CheckCircle },
    error:   { bg: dark ? "rgba(192,57,43,.12)" : "#FEF0EF",  border: dark ? "rgba(192,57,43,.3)"  : "#FCCFCC", text: T.danger,  Icon: AlertCircle },
  };

  const loanStatusColor = (s) => {
    if (s === "approved") return T.success;
    if (s === "rejected") return T.danger;
    return T.gold;
  };

  return (
    <div style={{ fontFamily: "'DM Sans', -apple-system, sans-serif" }}>
      <link rel="stylesheet" href={FONT_URL} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Amount input */}
      <div style={{ marginBottom: 20 }}>
        <label style={{ display: "block", fontSize: 11, fontWeight: 600, letterSpacing: ".8px", textTransform: "uppercase", color: dark ? "rgba(255,255,255,.4)" : T.muted, marginBottom: 7 }}>
          Loan Amount (KES)
        </label>
        <div style={{ position: "relative" }}>
          <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 13, color: dark ? "rgba(255,255,255,.3)" : T.muted, fontWeight: 600, pointerEvents: "none" }}>
            KES
          </span>
          <input
            type="number" value={amount} onChange={e => setAmount(e.target.value)}
            placeholder="0.00"
            onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
            style={{
              width: "100%", padding: "12px 14px 12px 52px", fontSize: 14, fontFamily: "inherit",
              background: focused ? (dark ? T.darkSurf : T.cream) : (dark ? T.darkCard : "#FAFBFC"),
              border: `1.5px solid ${focused ? T.gold : (dark ? T.darkBord : T.border)}`,
              borderRadius: 8, outline: "none", color: dark ? T.white : T.navy,
              transition: "all .2s", boxSizing: "border-box",
            }}
          />
        </div>
      </div>

      {/* Repayment period */}
      <div style={{ marginBottom: 20 }}>
        <label style={{ display: "block", fontSize: 11, fontWeight: 600, letterSpacing: ".8px", textTransform: "uppercase", color: dark ? "rgba(255,255,255,.4)" : T.muted, marginBottom: 7 }}>
          Repayment Period
        </label>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
          {PERIODS.map(p => (
            <button key={p.value} onClick={() => setMonths(p.value)}
              style={{
                padding: "10px 4px", borderRadius: 8, fontSize: 12, fontWeight: 600,
                cursor: "pointer", fontFamily: "inherit", transition: "all .15s",
                background: repaymentMonths === p.value ? T.navy : (dark ? T.darkCard : T.cream),
                color: repaymentMonths === p.value ? T.gold : (dark ? "rgba(255,255,255,.5)" : T.muted),
                border: `1.5px solid ${repaymentMonths === p.value ? T.navy : (dark ? T.darkBord : T.border)}`,
              }}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Estimated monthly repayment */}
      {monthly && amount && (
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: dark ? "rgba(201,168,76,.07)" : T.goldPale,
          border: "1px solid rgba(201,168,76,.2)",
          borderRadius: 8, padding: "12px 16px", marginBottom: 20,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <Clock size={14} color={T.gold} />
            <span style={{ fontSize: 12, color: dark ? "rgba(255,255,255,.45)" : T.muted, fontWeight: 300 }}>
              Estimated monthly repayment
            </span>
          </div>
          <span style={{ fontSize: 14, fontWeight: 700, color: dark ? T.white : T.navy }}>
            KES {Number(monthly).toLocaleString()}
          </span>
        </div>
      )}

      {/* Status message */}
      {status && (() => {
        const { bg, border, text, Icon } = statusColors[status.type];
        return (
          <div style={{ display: "flex", alignItems: "flex-start", gap: 8, background: bg, border: `1px solid ${border}`, borderRadius: 8, padding: "10px 14px", marginBottom: 18 }}>
            <Icon size={14} color={text} style={{ flexShrink: 0, marginTop: 1 }} />
            <span style={{ fontSize: 13, color: text, lineHeight: 1.5 }}>{status.text}</span>
          </div>
        );
      })()}

      {/* Submit */}
      <button onClick={handleApply} disabled={loading}
        style={{
          width: "100%", padding: "13px",
          background: loading ? T.muted : T.navy,
          color: "white", border: "none", borderRadius: 8,
          fontSize: 14, fontWeight: 600, cursor: loading ? "wait" : "pointer",
          fontFamily: "inherit", letterSpacing: .5, transition: "background .2s",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        }}>
        {loading ? (
          <>
            <span style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,.3)", borderTopColor: "white", borderRadius: "50%", animation: "spin .7s linear infinite", display: "inline-block" }} />
            Submitting…
          </>
        ) : (
          <><BarChart3 size={15} /> Submit Application</>
        )}
      </button>

      {/* Loan result card */}
      {loan && (
        <div style={{
          marginTop: 20, background: dark ? T.darkCard : T.cream,
          border: `1px solid ${dark ? T.darkBord : T.border}`,
          borderRadius: 10, padding: "18px 20px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
            <CheckCircle size={14} color={T.success} />
            <span style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: .8, color: T.success }}>Application Received</span>
          </div>
          {[
            ["Loan ID",    `#${loan.id}`],
            ["Amount",     `KES ${Number(loan.amount).toLocaleString()}`],
            ["Repayment",  `${loan.repaymentMonths ?? loan.repayment_months} month(s)`],
            ["Status",     loan.status],
          ].map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${dark ? T.darkBord : T.border}`, fontSize: 13 }}>
              <span style={{ color: dark ? "rgba(255,255,255,.4)" : T.muted, fontWeight: 300 }}>{k}</span>
              <span style={{ fontWeight: 600, color: k === "Status" ? loanStatusColor(loan.status) : (dark ? T.white : T.navy) }}>{v}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}