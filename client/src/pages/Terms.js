import React from "react";
import { Link } from "react-router-dom";
import { FileText } from "lucide-react";

const T = {
  navy: "#0B1F3A", navyLight: "#1A3A5C",
  gold: "#C9A84C", goldLight: "#E4C170", goldPale: "#F9F2E1",
  cream: "#FAFAF7", white: "#FFFFFF",
  border: "#E8EDF2", muted: "#6B7A8D", hint: "#A9B5C2",
};

const FONT_URL = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=DM+Sans:wght@300;400;500;600&display=swap";

const sections = [
  ["1. Acceptance of Terms", "By registering for an account or conducting transactions with Capital Bank, you agree to be bound by these Terms and applicable laws of the Republic of Kenya, including Central Bank of Kenya (CBK) regulations."],
  ["2. Eligibility & KYC", "You must be at least 18 years old to operate an account. All customers must provide valid identification (National ID or Passport) and meet Know Your Customer (KYC) requirements. Capital Bank reserves the right to verify and retain copies of your documents."],
  ["3. Accounts & Security", "You are responsible for keeping your login credentials and PIN secure. Any activity under your account will be considered as authorized by you. Notify us immediately if you suspect unauthorized access to your account."],
  ["4. Transactions", "Transactions (deposits, withdrawals, transfers) are processed subject to availability of funds and compliance checks. We may decline, reverse, or delay a transaction where fraud, error, or regulatory issues are suspected."],
  ["5. Fees & Charges", "Applicable fees including transaction charges, maintenance fees, and penalties are published in our tariff guide and may change from time to time. By using our services, you consent to such deductions from your account."],
  ["6. Liability", "Capital Bank is not liable for losses resulting from system downtime, network failures, third-party errors, or circumstances beyond our control. You are responsible for ensuring accuracy when initiating transfers or payments."],
  ["7. Privacy & Data Protection", "Your personal data will be collected and processed in line with the Kenya Data Protection Act, 2019. We will not share your data with third parties without your consent, except as required by law or regulators."],
  ["8. Dispute Resolution", "Any disputes arising from these Terms will be addressed through our internal complaint-handling procedures. If unresolved, disputes may be referred to the Central Bank of Kenya or other legal forums as appropriate."],
  ["9. Amendments", "Capital Bank may amend these Terms from time to time. Customers will be notified through official communication channels including email, SMS, and the website."],
  ["10. Contact Us", "For support or inquiries, contact our Customer Care at support@capitalbank.co.ke or call us at +254 700 000 000."],
];

export default function Terms() {
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
            Legal
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <FileText size={28} color={T.gold} strokeWidth={1.5} />
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(26px,4vw,40px)", fontWeight: 700, color: "white", margin: 0 }}>
              Terms & Conditions
            </h1>
          </div>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,.4)", fontWeight: 300, marginTop: 12 }}>
            Last updated: January 2025
          </p>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "48px 5vw 80px" }}>

        {/* Intro card */}
        <div style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 12, padding: "24px 28px", marginBottom: 36 }}>
          <p style={{ fontSize: 14, color: T.muted, fontWeight: 300, lineHeight: 1.8, margin: 0, borderLeft: `3px solid ${T.gold}`, paddingLeft: 16 }}>
            Welcome to <strong style={{ color: T.navy }}>Capital Bank</strong>. These Terms & Conditions govern your use of our banking services, mobile and online platforms, and related products. Please read carefully before opening or using your account.
          </p>
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

        {/* CTA row */}
        <div style={{ display: "flex", gap: 12, marginTop: 36, paddingTop: 24, borderTop: `1px solid ${T.border}` }}>
          <Link to="/register"
            style={{ padding: "12px 28px", background: T.navy, color: "white", borderRadius: 8, fontSize: 13, fontWeight: 600, letterSpacing: .4 }}>
            Open Account
          </Link>
          <Link to="/"
            style={{ padding: "12px 24px", background: "transparent", color: T.muted, border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 13, fontWeight: 500 }}>
            ← Back to Home
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ background: T.navy, padding: "28px 5vw", textAlign: "center" }}>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,.3)", margin: 0 }}>
          © {new Date().getFullYear()} Capital Bank Kenya Ltd &nbsp;·&nbsp;
          <Link to="/privacy" style={{ color: "rgba(255,255,255,.4)" }}>Privacy Policy</Link> &nbsp;·&nbsp;
          <Link to="/contact" style={{ color: "rgba(255,255,255,.4)" }}>Contact</Link>
        </p>
      </footer>
    </div>
  );
}