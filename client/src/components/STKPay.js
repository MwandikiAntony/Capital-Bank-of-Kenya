// client/src/components/STKPay.js
import React, { useState } from "react";
import { Smartphone, DollarSign, CheckCircle, AlertCircle } from "lucide-react";
import api from "../utils/api";

const T = {
  navy: "#0B1F3A", navyLight: "#1A3A5C",
  gold: "#C9A84C", goldPale: "#F9F2E1",
  cream: "#FAFAF7", white: "#FFFFFF",
  border: "#E8EDF2", muted: "#6B7A8D", hint: "#A9B5C2",
  danger: "#C0392B", success: "#1A7A4A",
};

const FONT_URL = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=DM+Sans:wght@300;400;500;600&display=swap";

function FormInput({ label, type = "text", placeholder, value, onChange, prefix, required }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{
        display: "block", fontSize: 11, fontWeight: 600,
        letterSpacing: ".8px", textTransform: "uppercase",
        color: T.muted, marginBottom: 7,
      }}>
        {label}
      </label>
      <div style={{ position: "relative" }}>
        {prefix && (
          <span style={{
            position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
            fontSize: 13, color: T.muted, fontWeight: 600, pointerEvents: "none",
          }}>
            {prefix}
          </span>
        )}
        <input
          type={type} placeholder={placeholder} value={value}
          onChange={onChange} required={required}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{
            width: "100%",
            padding: `12px 14px 12px ${prefix ? "56px" : "14px"}`,
            fontSize: 14, fontFamily: "inherit",
            background: focused ? T.cream : "#FAFBFC",
            border: `1.5px solid ${focused ? T.gold : T.border}`,
            borderRadius: 8, outline: "none", color: T.navy,
            transition: "all .2s", boxSizing: "border-box",
          }}
        />
      </div>
    </div>
  );
}

export default function STKPay({ onDone }) {
  const [phone, setPhone]   = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus]   = useState(null); // { type: 'success'|'error', text: '' }

  const token = localStorage.getItem("token");

  async function handlePay(e) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const res = await api.post(
        "/mpesa/stk/push",
        { phone, amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStatus({ type: "success", text: "STK push sent. Enter your M-Pesa PIN on your phone to complete payment." });
      onDone && onDone(res.data);
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", text: err.response?.data?.error || "Payment request failed. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  const statusStyles = {
    success: { bg: "#EAFAF2", border: "#9FEACE", text: T.success, Icon: CheckCircle },
    error:   { bg: "#FEF0EF", border: "#FCCFCC", text: T.danger,  Icon: AlertCircle },
  };

  return (
    <div style={{ fontFamily: "'DM Sans', -apple-system, sans-serif" }}>
      <link rel="stylesheet" href={FONT_URL} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 9, background: T.navy,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Smartphone size={16} color={T.gold} strokeWidth={1.5} />
        </div>
        <div>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: T.navy, margin: 0 }}>
            Pay with M-Pesa
          </h3>
          <p style={{ fontSize: 12, color: T.muted, fontWeight: 300, margin: 0 }}>
            Secure STK push to your Safaricom number
          </p>
        </div>
      </div>

      {/* M-Pesa badge */}
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        background: T.goldPale, border: "1px solid rgba(201,168,76,.25)",
        borderRadius: 20, padding: "4px 14px", marginBottom: 22,
      }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: T.navy, letterSpacing: .5 }}>
          🔒 Safaricom M-Pesa · Encrypted
        </span>
      </div>

      <form onSubmit={handlePay}>
        <FormInput
          label="M-Pesa Phone Number"
          placeholder="+2547XXXXXXXX"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          required
        />
        <FormInput
          label="Amount (KES)"
          type="number"
          placeholder="0.00"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          prefix="KES"
          required
        />

        {/* Status banner */}
        {status && (() => {
          const { bg, border, text, Icon } = statusStyles[status.type];
          return (
            <div style={{
              display: "flex", alignItems: "flex-start", gap: 8,
              background: bg, border: `1px solid ${border}`,
              borderRadius: 8, padding: "10px 14px", marginBottom: 18,
            }}>
              <Icon size={14} color={text} style={{ flexShrink: 0, marginTop: 1 }} />
              <span style={{ fontSize: 13, color: text, lineHeight: 1.55 }}>{status.text}</span>
            </div>
          );
        })()}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%", padding: "13px",
            background: loading ? T.muted : T.navy,
            color: "white", border: "none", borderRadius: 8,
            fontSize: 14, fontWeight: 600,
            cursor: loading ? "wait" : "pointer",
            fontFamily: "inherit", letterSpacing: .5, transition: "background .2s",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}
          onMouseEnter={e => { if (!loading) e.currentTarget.style.background = T.navyLight; }}
          onMouseLeave={e => { if (!loading) e.currentTarget.style.background = T.navy; }}
        >
          {loading ? (
            <>
              <span style={{
                width: 14, height: 14,
                border: "2px solid rgba(255,255,255,.3)", borderTopColor: "white",
                borderRadius: "50%", animation: "spin .7s linear infinite", display: "inline-block",
              }} />
              Requesting…
            </>
          ) : (
            <><DollarSign size={15} /> Pay with M-Pesa</>
          )}
        </button>
      </form>

      <p style={{ fontSize: 11, color: T.hint, fontWeight: 300, textAlign: "center", marginTop: 14, lineHeight: 1.65 }}>
        You'll receive a prompt on your phone. Enter your M-Pesa PIN to confirm the payment.
      </p>
    </div>
  );
}