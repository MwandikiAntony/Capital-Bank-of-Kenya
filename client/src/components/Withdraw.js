import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { ArrowUpRight, Smartphone, AlertCircle } from "lucide-react";
import api from "../utils/api";

const T = {
  navy: "#0B1F3A", navyLight: "#1A3A5C",
  gold: "#C9A84C", goldPale: "#F9F2E1",
  cream: "#FAFAF7", white: "#FFFFFF",
  border: "#E8EDF2", muted: "#6B7A8D", hint: "#A9B5C2",
  danger: "#C0392B", success: "#1A7A4A",
  darkCard: "#112234", darkBord: "#1A3050", darkSurf: "#0D1E35",
};

const FONT_URL = "https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap";

function FormInput({ label, type = "text", placeholder, value, onChange, prefix, required, dark, readOnly }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{
        display: "block", fontSize: 11, fontWeight: 600,
        letterSpacing: ".8px", textTransform: "uppercase",
        color: dark ? "rgba(255,255,255,.4)" : T.muted, marginBottom: 7,
      }}>
        {label}
      </label>
      <div style={{ position: "relative" }}>
        {prefix && (
          <span style={{
            position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
            fontSize: 13, color: dark ? "rgba(255,255,255,.3)" : T.muted,
            fontWeight: 600, pointerEvents: "none",
          }}>
            {prefix}
          </span>
        )}
        <input
          type={type} placeholder={placeholder} value={value}
          onChange={onChange} required={required} readOnly={readOnly}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{
            width: "100%", padding: `12px 14px 12px ${prefix ? "52px" : "14px"}`,
            fontSize: 14, fontFamily: "inherit",
            background: readOnly
              ? (dark ? "rgba(255,255,255,.03)" : "#F4F5F7")
              : focused
                ? (dark ? T.darkSurf : T.cream)
                : (dark ? T.darkCard : "#FAFBFC"),
            border: `1.5px solid ${focused && !readOnly ? T.gold : (dark ? T.darkBord : T.border)}`,
            borderRadius: 8, outline: "none",
            color: dark ? (readOnly ? "rgba(255,255,255,.4)" : T.white) : (readOnly ? T.muted : T.navy),
            transition: "all .2s", boxSizing: "border-box",
            cursor: readOnly ? "default" : "text",
          }}
        />
      </div>
    </div>
  );
}

export default function Withdraw({ addNotification, fetchAccount, darkMode }) {
  const dark = darkMode;
  const [amount, setAmount]   = useState("");
  const [phone, setPhone]     = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus]   = useState(null);
  const [userId, setUserId]   = useState(null);
  const socketRef             = useRef(null);

  useEffect(() => {
    const storedId    = localStorage.getItem("userId");
    const storedPhone = localStorage.getItem("userPhone");
    if (storedId)    setUserId(storedId);
    if (storedPhone) setPhone(storedPhone);
    if (!storedId)   setStatus({ type: "error", text: "User not logged in." });
  }, []);

  useEffect(() => {
    if (!userId || socketRef.current) return;

    socketRef.current = io("https://capital-bank-of-kenya.onrender.com", {
      transports: ["websocket", "polling"],
    });

    socketRef.current.on("connect", () => {
      socketRef.current.emit("joinUserRoom", userId);
    });

    socketRef.current.on("balanceUpdated", () => {
      fetchAccount?.();
    });

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [userId, fetchAccount]);

  const handleWithdraw = async () => {
    if (!amount) { setStatus({ type: "error", text: "Please enter an amount." }); return; }
    if (!phone)  { setStatus({ type: "error", text: "Phone number is required." }); return; }
    if (!userId) { setStatus({ type: "error", text: "User not logged in." }); return; }

    setLoading(true);
    setStatus(null);
    try {
      const res = await api.post("/mpesa/withdraw", { phone, amount, userId });
      setStatus({ type: "success", text: res.data.ResponseDescription || "Withdrawal request sent successfully." });
      addNotification?.(`Withdrawal of KES ${amount} initiated to ${phone}.`);
      setAmount("");
      fetchAccount?.();
    } catch (err) {
      console.error(err.response?.data || err.message);
      setStatus({ type: "error", text: err.response?.data?.error || "Withdrawal failed. Please try again." });
    }
    setLoading(false);
  };

  const statusColors = {
    success: { bg: dark ? "rgba(26,122,74,.15)" : "#EAFAF2",  border: dark ? "rgba(26,122,74,.3)"  : "#9FEACE", text: T.success },
    error:   { bg: dark ? "rgba(192,57,43,.12)" : "#FEF0EF",  border: dark ? "rgba(192,57,43,.3)"  : "#FCCFCC", text: T.danger  },
  };

  return (
    <div style={{ fontFamily: "'DM Sans', -apple-system, sans-serif" }}>
      <link rel="stylesheet" href={FONT_URL} />

      {/* Section header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <div style={{ width: 36, height: 36, borderRadius: 9, background: T.navy, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ArrowUpRight size={16} color={T.gold} strokeWidth={1.5} />
          </div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: dark ? T.white : T.navy, margin: 0 }}>
            Withdraw via M-Pesa
          </h2>
        </div>
        <p style={{ fontSize: 13, color: dark ? "rgba(255,255,255,.4)" : T.muted, fontWeight: 300, paddingLeft: 46 }}>
          Funds will be sent directly to your M-Pesa number.
        </p>
      </div>

      {/* Form card */}
      <div style={{
        background: dark ? T.darkCard : T.white,
        border: `1px solid ${dark ? T.darkBord : T.border}`,
        borderRadius: 14, padding: "28px 28px 24px",
        maxWidth: 480,
      }}>
        {/* M-Pesa badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 7,
          background: T.goldPale, border: "1px solid rgba(201,168,76,.25)",
          borderRadius: 20, padding: "5px 14px", marginBottom: 24,
        }}>
          <Smartphone size={13} color={T.gold} />
          <span style={{ fontSize: 11, fontWeight: 600, color: T.navy, letterSpacing: .5 }}>M-Pesa B2C Transfer</span>
        </div>

        <FormInput
          label="M-Pesa Phone Number"
          placeholder="2547XXXXXXXX"
          value={phone} onChange={e => setPhone(e.target.value)}
          required dark={dark}
        />
        <FormInput
          label="Amount (KES)"
          type="number"
          placeholder="0.00"
          value={amount} onChange={e => setAmount(e.target.value)}
          prefix="KES" required dark={dark}
        />

        {/* Warning notice */}
        <div style={{
          display: "flex", alignItems: "flex-start", gap: 8,
          background: dark ? "rgba(201,168,76,.07)" : T.goldPale,
          border: "1px solid rgba(201,168,76,.2)",
          borderRadius: 8, padding: "10px 14px", marginBottom: 20,
        }}>
          <AlertCircle size={14} color={T.gold} style={{ flexShrink: 0, marginTop: 1 }} />
          <p style={{ fontSize: 12, color: dark ? "rgba(255,255,255,.45)" : T.muted, fontWeight: 300, margin: 0, lineHeight: 1.6 }}>
            Withdrawals are processed within minutes. Ensure your phone number is correct before proceeding.
          </p>
        </div>

        {status && (
          <div style={{
            background: statusColors[status.type].bg,
            border: `1px solid ${statusColors[status.type].border}`,
            borderRadius: 8, padding: "10px 14px",
            fontSize: 13, color: statusColors[status.type].text,
            marginBottom: 18, lineHeight: 1.5,
          }}>
            {status.text}
          </div>
        )}

        <button onClick={handleWithdraw} disabled={loading}
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
              Processing…
            </>
          ) : (
            <><ArrowUpRight size={15} /> Withdraw Now</>
          )}
        </button>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}