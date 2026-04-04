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

function FormInput({ label, type = "text", placeholder, value, onChange, maxLength, required, hint }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: "block", fontSize: 11, fontWeight: 600, letterSpacing: ".8px", textTransform: "uppercase", color: T.muted, marginBottom: 7 }}>
        {label}
      </label>
      <input
        type={type} placeholder={placeholder} value={value}
        onChange={onChange} maxLength={maxLength} required={required}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          width: "100%", padding: "11px 14px", fontSize: 14, fontFamily: "inherit",
          background: focused ? T.cream : "#FAFBFC",
          border: `1.5px solid ${focused ? T.navy : T.border}`,
          borderRadius: 8, outline: "none", color: T.navy,
          transition: "all .2s", boxSizing: "border-box",
        }}
      />
      {hint && <p style={{ fontSize: 11, color: T.hint, marginTop: 5 }}>{hint}</p>}
    </div>
  );
}

const steps = ["Personal Info", "Contact & ID", "Set Your PIN"];

export default function Register({ onRegister }) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const nextStep = (e) => {
    e.preventDefault();
    setError("");
    if (step === 1) {
      if (!/^07\d{8}$/.test(phone)) { setError("Phone must be in format 07xxxxxxxx"); return; }
      if (!/^\d{5,10}$/.test(idNumber)) { setError("Enter a valid ID number (5–10 digits)"); return; }
    }
    if (step === 2) {
      if (!/^\d{4}$/.test(pin)) { setError("PIN must be exactly 4 digits"); return; }
      if (pin !== confirmPin) { setError("PINs do not match"); return; }
      if (!agreed) { setError("Please accept the terms and conditions"); return; }
      handleRegister();
      return;
    }
    setStep(s => s + 1);
  };

  const handleRegister = async () => {
    setLoading(true);
    try {
      const formattedPhone = "254" + phone.slice(1);
      const res = await api.post("/auth/register", { name, email, phone: formattedPhone, id_number: idNumber, pin }, { withCredentials: true });
      if (res.data.userId) localStorage.setItem("userId", res.data.userId);
      if (res.data.token) localStorage.setItem("token", res.data.token);
      if (res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        if (onRegister) onRegister(res.data.user);
      }
      if (!res.data.phone_verified) navigate("/verify-phone");
      else if (!res.data.email_verified) navigate("/verify-email");
      else navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", fontFamily: "'DM Sans', -apple-system, sans-serif", background: T.navy }}>
      <link rel="stylesheet" href={FONT_URL} />
      <style>{`* { box-sizing: border-box; } a { text-decoration: none; }`}</style>

      {/* Left panel */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "60px 5vw", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -100, left: -100, width: 500, height: 500, borderRadius: "50%", border: `1px solid rgba(201,168,76,.1)`, pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -60, right: -60, width: 280, height: 280, borderRadius: "50%", border: `1px solid rgba(201,168,76,.07)`, pointerEvents: "none" }} />

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 64 }}>
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, background: "rgba(201,168,76,.15)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 14, height: 14, border: `2px solid ${T.gold}`, borderRadius: 3, transform: "rotate(45deg)" }} />
            </div>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: "white", letterSpacing: .5 }}>
              Capital <span style={{ color: T.gold }}>Bank</span>
            </span>
          </Link>
        </div>

        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", color: T.gold, marginBottom: 20 }}>
          <span style={{ display: "block", width: 20, height: 1, background: T.gold }} />
          New Account
        </div>

        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(30px,3.5vw,48px)", fontWeight: 700, color: "white", lineHeight: 1.15, marginBottom: 20 }}>
          Join thousands of<br /><em style={{ color: T.goldLight }}>Kenyans banking smarter.</em>
        </h1>
        <p style={{ fontSize: 14, fontWeight: 300, color: "rgba(255,255,255,.5)", maxWidth: 320, lineHeight: 1.8, marginBottom: 40 }}>
          Open a free account in minutes. No branch visit. No minimum balance.
        </p>

        {/* Checklist */}
        {["Zero account opening fee", "Instant M-Pesa integration", "CBK licensed & insured", "24/7 digital access"].map(item => (
          <div key={item} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{ width: 18, height: 18, borderRadius: "50%", background: "rgba(201,168,76,.15)", border: `1px solid ${T.gold}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: T.gold, flexShrink: 0 }}>✓</div>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,.55)", fontWeight: 300 }}>{item}</span>
          </div>
        ))}
      </div>

      {/* Right panel — form */}
      <div style={{ width: "min(520px, 100%)", background: T.cream, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 48px" }}>
        <div style={{ width: "100%", maxWidth: 380 }}>

          {/* Step indicator */}
          <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 36 }}>
            {steps.map((s, i) => (
              <React.Fragment key={s}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%",
                    background: i <= step ? T.navy : T.border,
                    color: i <= step ? "white" : T.hint,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 12, fontWeight: 600, transition: "all .3s",
                  }}>{i < step ? "✓" : i + 1}</div>
                  <span style={{ fontSize: 10, color: i === step ? T.navy : T.hint, fontWeight: i === step ? 600 : 400, whiteSpace: "nowrap", letterSpacing: .3 }}>{s}</span>
                </div>
                {i < steps.length - 1 && (
                  <div style={{ flex: 1, height: 1.5, background: i < step ? T.navy : T.border, margin: "0 8px", marginBottom: 22, transition: "background .3s" }} />
                )}
              </React.Fragment>
            ))}
          </div>

          <form onSubmit={nextStep}>
            {step === 0 && (
              <>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: T.navy, marginBottom: 6 }}>Personal details</h2>
                <p style={{ fontSize: 13, color: T.muted, fontWeight: 300, marginBottom: 28 }}>Tell us a bit about yourself.</p>
                <FormInput label="Full Name" placeholder="e.g. James Mwangi" value={name} onChange={e => setName(e.target.value)} required />
                <FormInput label="Email Address" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
              </>
            )}

            {step === 1 && (
              <>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: T.navy, marginBottom: 6 }}>Contact & identity</h2>
                <p style={{ fontSize: 13, color: T.muted, fontWeight: 300, marginBottom: 28 }}>Required for KYC verification.</p>
                <FormInput label="Phone Number" placeholder="07xxxxxxxx" value={phone} onChange={e => setPhone(e.target.value)} hint="Must start with 07, 10 digits total" required />
                <FormInput label="National ID Number" placeholder="e.g. 12345678" value={idNumber} onChange={e => setIdNumber(e.target.value)} hint="Kenyan National ID or Passport number" required />
              </>
            )}

            {step === 2 && (
              <>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: T.navy, marginBottom: 6 }}>Set your PIN</h2>
                <p style={{ fontSize: 13, color: T.muted, fontWeight: 300, marginBottom: 28 }}>Choose a 4-digit PIN to secure your account.</p>
                <FormInput label="4-Digit PIN" type="password" placeholder="••••" value={pin} onChange={e => setPin(e.target.value)} maxLength={4} hint="Keep this secret — it's like your password" required />
                <FormInput label="Confirm PIN" type="password" placeholder="••••" value={confirmPin} onChange={e => setConfirmPin(e.target.value)} maxLength={4} required />
                <div style={{ display: "flex", alignItems: "flex-start", gap: 10, margin: "16px 0 20px" }}>
                  <input type="checkbox" id="agree" checked={agreed} onChange={e => setAgreed(e.target.checked)}
                    style={{ marginTop: 3, accentColor: T.navy, cursor: "pointer" }} />
                  <label htmlFor="agree" style={{ fontSize: 12, color: T.muted, lineHeight: 1.6, cursor: "pointer" }}>
                    I agree to Capital Bank's{" "}
                    <Link to="/terms" style={{ color: T.gold, fontWeight: 600 }}>Terms & Conditions</Link>{" "}
                    and{" "}
                    <Link to="/privacy" style={{ color: T.gold, fontWeight: 600 }}>Privacy Policy</Link>
                  </label>
                </div>
              </>
            )}

            {error && (
              <div style={{ background: "#FEF0EF", border: "1px solid #FCCFCC", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: T.danger, marginBottom: 18 }}>
                {error}
              </div>
            )}

            <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
              {step > 0 && (
                <button type="button" onClick={() => { setError(""); setStep(s => s - 1); }}
                  style={{ flex: 1, padding: "13px", background: "transparent", border: `1.5px solid ${T.border}`, borderRadius: 8, fontSize: 14, fontWeight: 500, color: T.muted, cursor: "pointer", fontFamily: "inherit" }}>
                  ← Back
                </button>
              )}
              <button type="submit" disabled={loading}
                style={{
                  flex: 2, padding: "13px", background: loading ? T.muted : T.navy,
                  color: "white", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600,
                  cursor: loading ? "wait" : "pointer", letterSpacing: .5, transition: "background .2s", fontFamily: "inherit",
                }}>
                {loading ? "Creating account…" : step < 2 ? "Continue →" : "Open My Account →"}
              </button>
            </div>
          </form>

          <p style={{ textAlign: "center", marginTop: 28, fontSize: 13, color: T.muted }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: T.gold, fontWeight: 600 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}