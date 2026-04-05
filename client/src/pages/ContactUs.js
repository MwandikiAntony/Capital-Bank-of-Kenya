import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MessageSquare } from "lucide-react";

const T = {
  navy: "#0B1F3A", navyLight: "#1A3A5C",
  gold: "#C9A84C", goldLight: "#E4C170", goldPale: "#F9F2E1",
  cream: "#FAFAF7", white: "#FFFFFF",
  border: "#E8EDF2", borderMid: "#D0D9E2",
  muted: "#6B7A8D", hint: "#A9B5C2",
  danger: "#C0392B", success: "#1A7A4A",
};

const FONT_URL = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=DM+Sans:wght@300;400;500;600&display=swap";

function FormInput({ label, type = "text", name, value, onChange, required, placeholder }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: "block", fontSize: 11, fontWeight: 600, letterSpacing: ".8px", textTransform: "uppercase", color: T.muted, marginBottom: 7 }}>
        {label}
      </label>
      <input
        type={type} name={name} value={value} onChange={onChange}
        required={required} placeholder={placeholder}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          width: "100%", padding: "12px 14px", fontSize: 14, fontFamily: "inherit",
          background: focused ? T.cream : "#FAFBFC",
          border: `1.5px solid ${focused ? T.navy : T.border}`,
          borderRadius: 8, outline: "none", color: T.navy,
          transition: "all .2s", boxSizing: "border-box",
        }}
      />
    </div>
  );
}

function TextareaInput({ label, name, value, onChange, required, placeholder, rows = 5 }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: "block", fontSize: 11, fontWeight: 600, letterSpacing: ".8px", textTransform: "uppercase", color: T.muted, marginBottom: 7 }}>
        {label}
      </label>
      <textarea
        name={name} value={value} onChange={onChange}
        required={required} placeholder={placeholder} rows={rows}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          width: "100%", padding: "12px 14px", fontSize: 14, fontFamily: "inherit",
          background: focused ? T.cream : "#FAFBFC",
          border: `1.5px solid ${focused ? T.navy : T.border}`,
          borderRadius: 8, outline: "none", color: T.navy,
          transition: "all .2s", boxSizing: "border-box", resize: "vertical",
        }}
      />
    </div>
  );
}

export default function ContactUs() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div style={{ minHeight: "100vh", background: T.cream, fontFamily: "'DM Sans', -apple-system, sans-serif" }}>
      <link rel="stylesheet" href={FONT_URL} />
      <style>{`* { box-sizing: border-box; } a { text-decoration: none; }`}</style>

      {/* Nav */}
      <nav style={{ background: T.navy, padding: "0 5vw" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 30, height: 30, background: "rgba(201,168,76,.15)", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 12, height: 12, border: `1.5px solid ${T.gold}`, borderRadius: 2, transform: "rotate(45deg)" }} />
            </div>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 700, color: "white" }}>
              Capital <span style={{ color: T.gold }}>Bank</span>
            </span>
          </Link>
          <div style={{ display: "flex", gap: 20 }}>
            <Link to="/login" style={{ fontSize: 13, color: "rgba(255,255,255,.5)", fontWeight: 500 }}>Sign In</Link>
            <Link to="/register" style={{ fontSize: 13, color: T.gold, fontWeight: 600 }}>Open Account</Link>
          </div>
        </div>
      </nav>

      {/* Hero strip */}
      <div style={{ background: T.navy, padding: "48px 5vw 52px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 10, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", color: T.gold, marginBottom: 16 }}>
            <span style={{ width: 18, height: 1, background: T.gold, display: "block" }} />
            Get In Touch
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <MessageSquare size={28} color={T.gold} strokeWidth={1.5} />
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(26px,4vw,40px)", fontWeight: 700, color: "white", margin: 0 }}>
              Contact Us
            </h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "48px 5vw 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24, alignItems: "start" }}>

          {/* Form card */}
          <div style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 12, padding: "32px" }}>
            {sent ? (
              <div style={{ textAlign: "center", padding: "48px 20px" }}>
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#EAFAF2", border: "1px solid #9FEACE", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 22 }}>✓</div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: T.navy, marginBottom: 10 }}>Message sent.</h3>
                <p style={{ fontSize: 14, color: T.muted, fontWeight: 300, lineHeight: 1.7 }}>
                  Our support team will respond within 1 business day.
                </p>
                <button onClick={() => setSent(false)}
                  style={{ marginTop: 24, padding: "10px 28px", background: T.navy, color: "white", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                  Send another message
                </button>
              </div>
            ) : (
              <>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: T.navy, marginBottom: 6 }}>Send a message</h2>
                <p style={{ fontSize: 13, color: T.muted, fontWeight: 300, marginBottom: 28 }}>We'll get back to you within 24 hours on business days.</p>
                <form onSubmit={handleSubmit}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
                    <FormInput label="Full Name" name="name" value={formData.name} onChange={handleChange} placeholder="James Mwangi" required />
                    <FormInput label="Email Address" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@email.com" required />
                  </div>
                  <FormInput label="Subject" name="subject" value={formData.subject} onChange={handleChange} placeholder="What's this about?" required />
                  <TextareaInput label="Message" name="message" value={formData.message} onChange={handleChange} placeholder="Describe your issue or question in detail…" required />
                  <button type="submit"
                    style={{ padding: "13px 32px", background: T.navy, color: "white", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", letterSpacing: .5, transition: "background .2s" }}
                    onMouseEnter={e => e.currentTarget.style.background = T.navyLight}
                    onMouseLeave={e => e.currentTarget.style.background = T.navy}>
                    Send Message →
                  </button>
                </form>
              </>
            )}
          </div>

          {/* Contact info sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { Icon: Phone, label: "Phone", value: "+254 700 000 000", sub: "Mon–Fri, 8am–6pm EAT" },
              { Icon: Mail,  label: "Email", value: "support@capitalbank.co.ke", sub: "24hr response time" },
            ].map(({ Icon, label, value, sub }) => (
              <div key={label} style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 12, padding: "20px 24px" }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: T.navy, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                  <Icon size={16} color={T.gold} strokeWidth={1.5} />
                </div>
                <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1, color: T.hint, marginBottom: 4, fontWeight: 600 }}>{label}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: T.navy }}>{value}</div>
                <div style={{ fontSize: 12, color: T.muted, fontWeight: 300, marginTop: 3 }}>{sub}</div>
              </div>
            ))}

            <div style={{ background: T.goldPale, border: "1px solid rgba(201,168,76,.25)", borderRadius: 12, padding: "20px 24px" }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: T.navy, marginBottom: 8 }}>🚨 Emergency support</div>
              <p style={{ fontSize: 12, color: T.muted, fontWeight: 300, lineHeight: 1.65, margin: 0 }}>
                For lost cards or unauthorized transactions, call <strong style={{ color: T.navy }}>+254 700 000 000</strong> anytime — 24/7.
              </p>
            </div>

            <div style={{ background: T.navy, borderRadius: 12, padding: "20px 24px" }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "white", marginBottom: 6 }}>Branch locations</div>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,.45)", fontWeight: 300, lineHeight: 1.65, margin: "0 0 14px" }}>
                Find your nearest Capital Bank branch or ATM across Kenya.
              </p>
              <Link to="/help" style={{ fontSize: 12, fontWeight: 600, color: T.gold }}>View branches →</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ background: T.navy, padding: "28px 5vw", textAlign: "center" }}>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,.3)", margin: 0 }}>
          © {new Date().getFullYear()} Capital Bank Kenya Ltd &nbsp;·&nbsp;
          <Link to="/terms" style={{ color: "rgba(255,255,255,.4)" }}>Terms</Link> &nbsp;·&nbsp;
          <Link to="/privacy" style={{ color: "rgba(255,255,255,.4)" }}>Privacy</Link>
        </p>
      </footer>
    </div>
  );
}