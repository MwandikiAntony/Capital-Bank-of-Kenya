import React, { useState } from "react";
import { Link } from "react-router-dom";
import { HelpCircle, Phone, Lock, FileText, ShieldCheck, Mail, MessageSquare, RefreshCw } from "lucide-react";

const T = {
  navy: "#0B1F3A", navyLight: "#1A3A5C",
  gold: "#C9A84C", goldLight: "#E4C170", goldPale: "#F9F2E1",
  cream: "#FAFAF7", white: "#FFFFFF",
  border: "#E8EDF2", borderMid: "#D0D9E2",
  muted: "#6B7A8D", hint: "#A9B5C2",
};

const FONT_URL = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=DM+Sans:wght@300;400;500;600&display=swap";

const helpTopics = [
  { Icon: Lock,         title: "Resetting Your PIN",        desc: "Use the Forgot PIN option on the login screen. A reset link will be sent to your registered email or phone number within a few minutes." },
  { Icon: FileText,     title: "Applying for a Loan",       desc: "Go to Dashboard → Loans, fill the short application form, and select your preferred repayment plan. Decisions are made within 24–48 hours." },
  { Icon: Phone,        title: "Customer Support",          desc: "Call +254 700 123 456 (Mon–Fri 8am–6pm) or email support@capitalbank.co.ke. Emergency card support is available 24/7." },
  { Icon: ShieldCheck,  title: "Account Security",          desc: "Enable two-factor authentication in Settings → Security. Never share your PIN with anyone, including Capital Bank staff." },
  { Icon: Mail,         title: "Email Verification Issues", desc: "Check your spam folder. If the email is not received, go to Settings → Resend Verification Email, or contact support." },
  { Icon: MessageSquare,title: "Disputing a Transaction",   desc: "Go to Statements, find the transaction, and tap Report Issue. Our team resolves disputes within 3 business days." },
  { Icon: RefreshCw,    title: "M-Pesa Integration",        desc: "Link your M-Pesa in Settings → Linked Accounts. Transfers between M-Pesa and your Capital Bank account are instant and free." },
  { Icon: HelpCircle,   title: "Closing an Account",        desc: "To close your account, visit any Capital Bank branch with a valid ID or call our support line. Ensure your balance is zero before closure." },
];

export default function Help() {
  const [search, setSearch] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  const filtered = helpTopics.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.desc.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ minHeight: "100vh", background: T.cream, fontFamily: "'DM Sans', -apple-system, sans-serif" }}>
      <link rel="stylesheet" href={FONT_URL} />
      <style>{`
        * { box-sizing: border-box; }
        a { text-decoration: none; }
        .help-card {
          background: ${T.white};
          border: 1px solid ${T.border};
          border-radius: 12px;
          padding: 24px;
          cursor: pointer;
          transition: all .25s;
          position: relative;
          overflow: hidden;
        }
        .help-card:hover {
          border-color: ${T.borderMid};
          transform: translateY(-3px);
          box-shadow: 0 8px 32px rgba(11,31,58,.07);
        }
        .help-card .bottom-line {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: ${T.gold};
          transform: scaleX(0);
          transform-origin: left;
          transition: transform .3s;
        }
        .help-card:hover .bottom-line {
          transform: scaleX(1);
        }
      `}</style>

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
      <div style={{ background: T.navy, padding: "48px 5vw 64px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -60, right: -60, width: 300, height: 300, borderRadius: "50%", border: "1px solid rgba(201,168,76,.1)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 10, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", color: T.gold, marginBottom: 16 }}>
            <span style={{ width: 18, height: 1, background: T.gold, display: "block" }} />
            Support
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
            <HelpCircle size={28} color={T.gold} strokeWidth={1.5} />
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(26px,4vw,40px)", fontWeight: 700, color: "white", margin: 0 }}>
              Help Center
            </h1>
          </div>

          {/* Search bar */}
          <div style={{ position: "relative", maxWidth: 520 }}>
            <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", fontSize: 15, color: searchFocused ? T.gold : "rgba(255,255,255,.3)", transition: "color .2s" }}>🔍</span>
            <input
              type="text"
              placeholder="Search help articles…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              style={{
                width: "100%", padding: "14px 20px 14px 48px", fontSize: 14,
                border: `1.5px solid ${searchFocused ? T.gold : "rgba(255,255,255,.15)"}`,
                borderRadius: 10, outline: "none",
                background: "rgba(255,255,255,.07)", color: "white",
                fontFamily: "inherit", boxSizing: "border-box", transition: "border .2s",
              }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "48px 5vw 80px" }}>
        {search && (
          <p style={{ fontSize: 13, color: T.muted, marginBottom: 24, fontWeight: 300 }}>
            {filtered.length} result{filtered.length !== 1 ? "s" : ""} for <strong style={{ color: T.navy }}>"{search}"</strong>
          </p>
        )}

        {filtered.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
            {filtered.map(({ Icon, title, desc }) => (
              <div key={title} className="help-card">
                <div className="bottom-line" />
                <div style={{ width: 40, height: 40, borderRadius: 9, background: T.navy, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                  <Icon size={18} color={T.gold} strokeWidth={1.5} />
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: T.navy, marginBottom: 8 }}>{title}</div>
                <div style={{ fontSize: 13, color: T.muted, lineHeight: 1.7, fontWeight: 300 }}>{desc}</div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "72px 0", color: T.muted }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🔍</div>
            <p style={{ fontSize: 16, fontWeight: 500, color: T.navy }}>No results for "{search}"</p>
            <p style={{ fontSize: 13, fontWeight: 300, marginTop: 6 }}>
              Try different keywords or{" "}
              <Link to="/contact" style={{ color: T.gold, fontWeight: 600 }}>contact support</Link>.
            </p>
          </div>
        )}

        {/* Bottom CTA */}
        <div style={{ marginTop: 48, background: T.navy, borderRadius: 12, padding: "28px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 600, color: "white", marginBottom: 4 }}>Still need help?</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,.45)", fontWeight: 300 }}>Our support team is available Mon–Fri, 8am–6pm EAT.</div>
          </div>
          <Link to="/contact"
            style={{ padding: "11px 24px", background: T.gold, color: T.navy, borderRadius: 8, fontSize: 13, fontWeight: 700, letterSpacing: .4 }}>
            Contact Support →
          </Link>
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