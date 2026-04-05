import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

const T = {
  navy: "#0B1F3A", navyLight: "#1A3A5C",
  gold: "#C9A84C", goldLight: "#E4C170", goldPale: "#F9F2E1",
  cream: "#FAFAF7", white: "#FFFFFF",
  border: "#E8EDF2", muted: "#6B7A8D", hint: "#A9B5C2",
};

const FONT_URL = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=DM+Sans:wght@300;400;500;600&display=swap";

const sections = [
  ["1. Information We Collect", "Personal details such as your name, ID number, phone, email, and financial data may be collected for service provision and regulatory compliance. This includes transaction history, device information, and usage data on our platforms."],
  ["2. How We Use Information", "To process transactions, improve banking services, comply with CBK regulations, detect and prevent fraud, and ensure customer safety and account security. We may also use your data to send service updates and relevant product information."],
  ["3. Security Measures", "We use 256-bit AES encryption, two-factor authentication, and real-time fraud monitoring systems to protect your sensitive information at all times. Our infrastructure is audited regularly by independent security firms."],
  ["4. Data Sharing", "We never sell personal data. Your information may only be shared with regulators (CBK, KRA), licensed service providers operating under strict confidentiality agreements, or as required by Kenyan law and court orders."],
  ["5. Your Rights", "Under the Kenya Data Protection Act 2019, you have the right to access, correct, or request deletion of your personal data. You may also object to certain processing activities. Contact us at support@capitalbank.co.ke to exercise your rights."],
  ["6. Cookies & Analytics", "Our platform uses cookies to improve your browsing experience and understand usage patterns. You may disable cookies in your browser settings, though some features may be affected as a result."],
  ["7. Data Retention", "We retain your personal data for as long as your account is active and for a period thereafter as required by Kenyan banking regulations and the Kenya Revenue Authority. You may request deletion of non-mandatory data at any time."],
  ["8. Contact Us", "For privacy-related queries or to exercise your data rights, reach us at support@capitalbank.co.ke or +254 700 000 000."],
];

export default function PrivacyPolicy() {
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
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 10, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", color: T.gold, marginBottom: 16 }}>
            <span style={{ width: 18, height: 1, background: T.gold, display: "block" }} />
            Data Protection
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <ShieldCheck size={28} color={T.gold} strokeWidth={1.5} />
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(26px,4vw,40px)", fontWeight: 700, color: "white", margin: 0 }}>
              Privacy Policy
            </h1>
          </div>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,.4)", fontWeight: 300, marginTop: 12 }}>
            Last updated: January 2025
          </p>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "48px 5vw 80px" }}>

        {/* Intro card with shield */}
        <div style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 12, padding: "24px 28px", marginBottom: 36 }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
            <div style={{ width: 40, height: 40, borderRadius: 9, background: T.navy, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
              <ShieldCheck size={18} color={T.gold} strokeWidth={1.5} />
            </div>
            <p style={{ fontSize: 14, color: T.muted, fontWeight: 300, lineHeight: 1.8, margin: 0 }}>
              At <strong style={{ color: T.navy }}>Capital Bank</strong>, your privacy is our priority. This policy explains how we collect, use, and protect your personal information in full compliance with the{" "}
              <strong style={{ color: T.navy }}>Kenya Data Protection Act, 2019</strong> and Central Bank of Kenya guidelines.
            </p>
          </div>
        </div>

        {/* Sections */}
        {sections.map(([heading, body], i) => (
          <div key={heading} style={{ marginBottom: 28, paddingBottom: 28, borderBottom: i < sections.length - 1 ? `1px solid ${T.border}` : "none" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 10 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: T.gold, flexShrink: 0, marginTop: 6 }} />
              <h2 style={{ fontSize: 15, fontWeight: 600, color: T.navy, margin: 0 }}>{heading}</h2>
            </div>
            <p style={{ fontSize: 14, color: T.muted, lineHeight: 1.85, fontWeight: 300, margin: 0, paddingLeft: 20 }}>
              {body}
            </p>
          </div>
        ))}

        {/* Compliance badge */}
        <div style={{ background: T.goldPale, border: "1px solid rgba(201,168,76,.25)", borderRadius: 12, padding: "20px 24px", marginTop: 12 }}>
          <p style={{ fontSize: 13, color: T.navy, fontWeight: 400, margin: 0, lineHeight: 1.7 }}>
            🔒 <strong>Capital Bank is compliant with the Central Bank of Kenya's cybersecurity guidelines and the Kenya Data Protection Act 2019.</strong> Your data is never sold to third parties under any circumstances.
          </p>
        </div>

        {/* CTA row */}
        <div style={{ display: "flex", gap: 12, marginTop: 36, paddingTop: 24, borderTop: `1px solid ${T.border}` }}>
          <Link to="/"
            style={{ padding: "12px 24px", background: "transparent", color: T.muted, border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 13, fontWeight: 500 }}>
            ← Back to Home
          </Link>
          <Link to="/contact"
            style={{ padding: "12px 24px", background: T.navy, color: "white", borderRadius: 8, fontSize: 13, fontWeight: 600 }}>
            Contact Privacy Team
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ background: T.navy, padding: "28px 5vw", textAlign: "center" }}>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,.3)", margin: 0 }}>
          © {new Date().getFullYear()} Capital Bank Kenya Ltd &nbsp;·&nbsp;
          <Link to="/terms" style={{ color: "rgba(255,255,255,.4)" }}>Terms & Conditions</Link> &nbsp;·&nbsp;
          <Link to="/contact" style={{ color: "rgba(255,255,255,.4)" }}>Contact</Link>
        </p>
      </footer>
    </div>
  );
}