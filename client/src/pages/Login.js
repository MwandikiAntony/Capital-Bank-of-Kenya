import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../utils/api";

const T = {
  navy: "#0B1F3A", navyLight: "#1A3A5C",
  gold: "#C9A84C", goldLight: "#E4C170", goldPale: "#F9F2E1",
  cream: "#FAFAF7", border: "#E8EDF2", borderMid: "#D0D9E2",
  muted: "#6B7A8D", hint: "#A9B5C2", danger: "#C0392B",
};

const FONT_URL = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=DM+Sans:wght@300;400;500;600&display=swap";

function FormInput({ label, type = "text", placeholder, value, onChange, maxLength, required }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: "block", fontSize: 12, fontWeight: 600, letterSpacing: ".8px", textTransform: "uppercase", color: T.muted, marginBottom: 8 }}>
        {label}
      </label>
      <input
        type={type} placeholder={placeholder} value={value}
        onChange={onChange} maxLength={maxLength} required={required}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          width: "100%", padding: "12px 16px", fontSize: 14, fontFamily: "inherit",
          background: focused ? T.cream : "#FAFBFC",
          border: `1.5px solid ${focused ? T.navy : T.border}`,
          borderRadius: 8, outline: "none", color: T.navy,
          transition: "all .2s", boxSizing: "border-box",
        }}
      />
    </div>
  );
}

export default function Login({ onLogin }) {
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { phone, pin });
      const { token } = res.data;
      if (!token) { setError("Login failed: No token received"); setLoading(false); return; }
      localStorage.setItem("token", token);
      const profileRes = await api.get("/auth/user", { headers: { Authorization: `Bearer ${token}` } });
      const user = profileRes.data.user;
      if (!user) { setError("Failed to fetch user profile."); setLoading(false); return; }
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("userId", user.id);
      localStorage.setItem("userPhone", user.phone);
      if (onLogin) onLogin(user);
      if (!user.phone_verified) navigate("/verify-phone");
      else navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", fontFamily: "'DM Sans', -apple-system, sans-serif", background: T.navy }}>
      <link rel="stylesheet" href={FONT_URL} />
      <style>{`* { box-sizing: border-box; } a { text-decoration: none; }`}</style>

      {/* Left panel — branding */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "60px 5vw", position: "relative", overflow: "hidden" }}>
        {/* Decorative rings */}
        <div style={{ position: "absolute", top: -100, left: -100, width: 500, height: 500, borderRadius: "50%", border: `1px solid rgba(201,168,76,.12)`, pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -60, right: -60, width: 300, height: 300, borderRadius: "50%", border: `1px solid rgba(201,168,76,.08)`, pointerEvents: "none" }} />

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 64 }}>
          <div style={{ width: 36, height: 36, background: "rgba(201,168,76,.15)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
            <div style={{ width: 14, height: 14, border: `2px solid ${T.gold}`, borderRadius: 3, transform: "rotate(45deg)" }} />
          </div>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: "white", letterSpacing: .5 }}>
            Capital <span style={{ color: T.gold }}>Bank</span>
          </span>
        </div>

        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", color: T.gold, marginBottom: 20 }}>
          <span style={{ display: "block", width: 20, height: 1, background: T.gold }} />
          Secure Access
        </div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(32px,4vw,52px)", fontWeight: 700, color: "white", lineHeight: 1.15, marginBottom: 20 }}>
          Welcome<br /><em style={{ color: T.goldLight }}>back.</em>
        </h1>
        <p style={{ fontSize: 15, fontWeight: 300, color: "rgba(255,255,255,.5)", maxWidth: 340, lineHeight: 1.8 }}>
          Sign in to manage your accounts, transfers, and more — securely from anywhere.
        </p>

        <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 64, paddingTop: 32, borderTop: "1px solid rgba(255,255,255,.08)" }}>
          {[["🔒", "256-bit encrypted"], ["✓", "CBK regulated"], ["⚡", "Instant access"]].map(([icon, label]) => (
            <div key={label} style={{ fontSize: 12, color: "rgba(255,255,255,.4)", display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 13 }}>{icon}</span>{label}
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div style={{ width: "min(480px, 100%)", background: T.cream, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 48px" }}>
        <div style={{ width: "100%", maxWidth: 360 }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, color: T.navy, marginBottom: 8 }}>Sign in</h2>
          <p style={{ fontSize: 14, color: T.muted, fontWeight: 300, marginBottom: 36 }}>Enter your phone number and PIN.</p>

          <form onSubmit={handleLogin}>
            <FormInput label="Phone Number" placeholder="07xxxxxxxx" value={phone} onChange={e => setPhone(e.target.value)} required />
            <FormInput label="PIN" type="password" placeholder="••••" value={pin} onChange={e => setPin(e.target.value)} maxLength={4} required />

            {error && (
              <div style={{ background: "#FEF0EF", border: "1px solid #FCCFCC", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: T.danger, marginBottom: 20 }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              style={{
                width: "100%", padding: "14px", background: loading ? T.muted : T.navy,
                color: "white", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600,
                cursor: loading ? "wait" : "pointer", letterSpacing: .5, transition: "background .2s",
                fontFamily: "inherit",
              }}>
              {loading ? "Signing in…" : "Sign In →"}
            </button>
          </form>

          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "24px 0" }}>
            <div style={{ flex: 1, height: 1, background: T.border }} />
            <span style={{ fontSize: 12, color: T.hint }}>or</span>
            <div style={{ flex: 1, height: 1, background: T.border }} />
          </div>

          <p style={{ textAlign: "center", fontSize: 13, color: T.muted }}>
            Don't have an account?{" "}
            <Link to="/register" style={{ color: T.gold, fontWeight: 600 }}>Open one free</Link>
          </p>

          <p style={{ textAlign: "center", marginTop: 32, fontSize: 11, color: T.hint, lineHeight: 1.7 }}>
            By continuing you agree to our{" "}
            <Link to="/terms" style={{ color: T.muted }}>Terms</Link> &amp;{" "}
            <Link to="/privacy" style={{ color: T.muted }}>Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
}