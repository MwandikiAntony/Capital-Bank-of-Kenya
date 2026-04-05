import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { ArrowDownLeft, Smartphone, DollarSign } from "lucide-react";
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

function FormInput({ label, type = "text", placeholder, value, onChange, prefix, required, dark }) {
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
          onChange={onChange} required={required}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{
            width: "100%", padding: `12px 14px 12px ${prefix ? "52px" : "14px"}`,
            fontSize: 14, fontFamily: "inherit",
            background: focused
              ? (dark ? T.darkSurf : T.cream)
              : (dark ? T.darkCard : "#FAFBFC"),
            border: `1.5px solid ${focused ? T.gold : (dark ? T.darkBord : T.border)}`,
            borderRadius: 8, outline: "none",
            color: dark ? T.white : T.navy,
            transition: "all .2s", boxSizing: "border-box",
          }}
        />
      </div>
    </div>
  );
}

export default function Deposit({ addNotification, fetchAccount, darkMode }) {
  const dark = darkMode;
  const [amount, setAmount]   = useState("");
  const [phone, setPhone]     = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus]   = useState(null); // { type: 'success'|'error'|'info', text: '' }
  const [userId, setUserId]   = useState(null);
  const socketRef             = useRef(null);

  useEffect(() => {
    const storedId = localStorage.getItem("userId");
    if (storedId) setUserId(storedId);
    else setStatus({ type: "error", text: "User not logged in." });
  }, []);

  useEffect(() => {
    if (!userId || socketRef.current) return;

    socketRef.current = io("https://capital-bank-of-kenya.onrender.com", {
      transports: ["websocket", "polling"],
      withCredentials: true,
    });

    socketRef.current.on("connect", () => {
      socketRef.current.emit("joinUserRoom", userId);
    });

    socketRef.current.on("balanceUpdated", () => {
      fetchAccount?.();
    });

    socketRef.current.on("connect_error", (err) => {
      console.error("Socket error:", err.message);
    });

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [userId, fetchAccount]);

  const handleDeposit = async (e) => {
    e.preventDefault();
    if (!amount || !phone) { setStatus({ type: "error", text: "Please enter both phone and amount." }); return; }
    if (!userId) { setStatus({ type: "error", text: "User not logged in." }); return; }

    setLoading(true);
    setStatus(null);
    try {
      await api.post("/mpesa/stkpush", { phone, amount, userId });
      setStatus({ type: "success", text: `STK Push sent to ${phone}. Check your phone to complete payment.` });
      addNotification?.(`Deposit request of KES ${amount} sent to ${phone}.`);
      setAmount("");
      setPhone("");
      fetchAccount?.();
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", text: err.response?.data?.error || "Failed to initiate deposit." });
    }
    setLoading(false);
  };

  const statusColors = {
    success: { bg: dark ? "rgba(26,122,74,.15)" : "#EAFAF2", border: dark ? "rgba(26,122,74,.3)" : "#9FEACE", text: T.success },
    error:   { bg: dark ? "rgba(192,57,43,.12)" : "#FEF0EF", border: dark ? "rgba(192,57,43,.3)" : "#FCCFCC", text: T.danger  },
    info:    { bg: dark ? "rgba(201,168,76,.1)"  : T.goldPale, border: "rgba(201,168,76,.3)", text: T.gold },
  };

  return (
    <div style={{ fontFamily: "'DM Sans', -apple-system, sans-serif" }}>
      <link rel="stylesheet" href={FONT_URL} />

      {/* Section header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <div style={{ width: 36, height: 36, borderRadius: 9, background: T.navy, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ArrowDownLeft size={16} color={T.gold} strokeWidth={1.5} />
          </div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: dark ? T.white : T.navy, margin: 0 }}>
            Deposit via M-Pesa
          </h2>
        </div>
        <p style={{ fontSize: 13, color: dark ? "rgba(255,255,255,.4)" : T.muted, fontWeight: 300, paddingLeft: 46 }}>
          Enter your M-Pesa number and amount. An STK push will be sent to your phone.
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
          <span style={{ fontSize: 11, fontWeight: 600, color: T.navy, letterSpacing: .5 }}>Safaricom M-Pesa STK Push</span>
        </div>

        <form onSubmit={handleDeposit}>
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

          <button type="submit" disabled={loading}
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
              <><DollarSign size={15} /> Deposit Now</>
            )}
          </button>
        </form>

        <p style={{ fontSize: 11, color: dark ? "rgba(255,255,255,.2)" : T.hint, fontWeight: 300, textAlign: "center", marginTop: 14, lineHeight: 1.6 }}>
          You will receive a prompt on your phone. Enter your M-Pesa PIN to confirm.
        </p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}