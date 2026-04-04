import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../utils/api";

const T = {
  navy: "#0B1F3A", gold: "#C9A84C", goldLight: "#E4C170",
  cream: "#FAFAF7", border: "#E8EDF2", muted: "#6B7A8D",
  hint: "#A9B5C2", danger: "#C0392B", success: "#1A7A4A",
};

const FONT_URL = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=DM+Sans:wght@300;400;500;600&display=swap";

function OTPInput({ value, onChange }) {
  return (
    <div style={{ display: "flex", gap: 10, justifyContent: "center", margin: "28px 0" }}>
      {[...Array(6)].map((_, i) => (
        <input
          key={i}
          type="text"
          maxLength={1}
          value={value[i] || ""}
          onChange={e => {
            const chars = value.split("");
            chars[i] = e.target.value.replace(/\D/, "");
            onChange(chars.join(""));
            if (e.target.value && i < 5) {
              const next = document.getElementById(`otp-${i + 1}`);
              if (next) next.focus();
            }
          }}
          onKeyDown={e => {
            if (e.key === "Backspace" && !value[i] && i > 0) {
              const prev = document.getElementById(`otp-${i - 1}`);
              if (prev) prev.focus();
            }
          }}
          id={`otp-${i}`}
          style={{
            width: 48, height: 56, textAlign: "center", fontSize: 22, fontWeight: 600,
            border: `1.5px solid ${value[i] ? T.navy : T.border}`, borderRadius: 10,
            outline: "none", background: value[i] ? T.cream : "#FAFBFC",
            color: T.navy, fontFamily: "inherit", transition: "all .2s",
          }}
          onFocus={e => e.target.style.borderColor = T.navy}
          onBlur={e => e.target.style.borderColor = value[i] ? T.navy : T.border}
        />
      ))}
    </div>
  );
}

function PageShell({ icon, eyebrow, title, subtitle, children }) {
  return (
    <div style={{ minHeight: "100vh", background: T.navy, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', -apple-system, sans-serif", padding: "20px" }}>
      <link rel="stylesheet" href={FONT_URL} />
      <style>{`* { box-sizing: border-box; } a { text-decoration: none; }`}</style>

      <div style={{ position: "fixed", top: -100, left: -100, width: 500, height: 500, borderRadius: "50%", border: `1px solid rgba(201,168,76,.1)`, pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: -80, right: -80, width: 400, height: 400, borderRadius: "50%", border: `1px solid rgba(201,168,76,.07)`, pointerEvents: "none" }} />

      <div style={{ width: "100%", maxWidth: 440, background: T.cream, borderRadius: 20, padding: "44px 40px", position: "relative" }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 40, textDecoration: "none" }}>
          <div style={{ width: 30, height: 30, background: T.navy, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 12, height: 12, border: `1.5px solid ${T.gold}`, borderRadius: 2, transform: "rotate(45deg)" }} />
          </div>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, color: T.navy }}>Capital <span style={{ color: T.gold }}>Bank</span></span>
        </Link>

        <div style={{ width: 56, height: 56, borderRadius: "50%", background: T.navy, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, marginBottom: 24 }}>
          {icon}
        </div>

        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 10, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", color: T.gold, marginBottom: 12 }}>
          <span style={{ width: 16, height: 1, background: T.gold, display: "block" }} />{eyebrow}
        </div>

        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, color: T.navy, marginBottom: 8, lineHeight: 1.2 }}>{title}</h1>
        <p style={{ fontSize: 14, color: T.muted, fontWeight: 300, lineHeight: 1.7, marginBottom: 4 }}>{subtitle}</p>

        {children}
      </div>
    </div>
  );
}

export function VerifyEmail() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const handleVerify = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await api.post("/auth/verify-email", { userId, otp });
      setSuccess(res.data.message || "Email verified!");
      const token = localStorage.getItem("token");
      const userRes = await api.get("/auth/user", { headers: { Authorization: `Bearer ${token}` } });
      const updatedUser = userRes.data.user;
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setTimeout(() => navigate("/dashboard/overview"), 800);
    } catch (err) {
      setError(err.response?.data?.error || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell
      icon="✉️"
      eyebrow="Step 2 of 2"
      title="Verify your email"
      subtitle="We sent a verification code to your email address. Check your inbox (and spam)."
    >
      <form onSubmit={handleVerify}>
        <OTPInput value={otp} onChange={setOtp} />

        {error && <div style={{ background: "#FEF0EF", border: "1px solid #FCCFCC", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: T.danger, marginBottom: 16 }}>{error}</div>}
        {success && <div style={{ background: "#EAFAF2", border: "1px solid #9FEACE", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: T.success, marginBottom: 16 }}>{success}</div>}

        <button type="submit" disabled={loading || otp.length < 6}
          style={{
            width: "100%", padding: "14px", background: (loading || otp.length < 6) ? T.muted : T.navy,
            color: "white", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600,
            cursor: (loading || otp.length < 6) ? "not-allowed" : "pointer", fontFamily: "inherit", letterSpacing: .5,
          }}>
          {loading ? "Verifying…" : "Verify Email →"}
        </button>
      </form>

      <p style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: T.muted }}>
              <Link to="/login" style={{ color: T.gold, fontWeight: 600 }}>← Back to sign in</Link>
            </p>
          </PageShell>
        );
      }
      
export default VerifyEmail;