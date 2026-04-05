import React, { useEffect, useState } from "react";
import { User, Phone, Mail, CreditCard, Hash, Wallet, ShieldCheck } from "lucide-react";
import api from "../utils/api";

const T = {
  navy: "#0B1F3A", navyLight: "#1A3A5C",
  gold: "#C9A84C", goldPale: "#F9F2E1",
  cream: "#FAFAF7", white: "#FFFFFF",
  border: "#E8EDF2", muted: "#6B7A8D", hint: "#A9B5C2",
  success: "#1A7A4A",
  darkCard: "#112234", darkBord: "#1A3050",
};

const FONT_URL = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=DM+Sans:wght@300;400;500;600&display=swap";

function ProfileRow({ icon: Icon, label, value, highlight, dark }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 14,
      padding: "14px 0",
      borderBottom: `1px solid ${dark ? T.darkBord : T.border}`,
    }}>
      <div style={{
        width: 34, height: 34, borderRadius: 8,
        background: dark ? "rgba(255,255,255,.05)" : T.cream,
        border: `1px solid ${dark ? T.darkBord : T.border}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
      }}>
        <Icon size={15} color={T.gold} strokeWidth={1.5} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".8px", textTransform: "uppercase", color: dark ? "rgba(255,255,255,.3)" : T.hint, marginBottom: 2 }}>
          {label}
        </div>
        <div style={{
          fontSize: 14, fontWeight: highlight ? 700 : 500,
          color: highlight ? T.success : (dark ? T.white : T.navy),
          wordBreak: "break-all",
        }}>
          {value}
        </div>
      </div>
    </div>
  );
}

export default function UpdateProfile({ currentUser, darkMode }) {
  const dark = darkMode;
  const [accountDetails, setAccountDetails] = useState({ balance: 0, account_number: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/auth/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const user = res.data.user;
        setAccountDetails({
          balance: user.balance,
          account_number: user.account_number || "N/A",
        });
      } catch (err) {
        console.error("Failed to fetch account info:", err);
        setAccountDetails({ balance: "Error", account_number: "Error" });
      } finally {
        setLoading(false);
      }
    };
    fetchAccount();
  }, []);

  // Avatar initials
  const initials = currentUser?.name
    ? currentUser.name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  return (
    <div style={{ fontFamily: "'DM Sans', -apple-system, sans-serif" }}>
      <link rel="stylesheet" href={FONT_URL} />

      {loading ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 0", gap: 10 }}>
          <span style={{ width: 16, height: 16, border: "2px solid rgba(201,168,76,.3)", borderTopColor: T.gold, borderRadius: "50%", animation: "spin .7s linear infinite", display: "inline-block" }} />
          <span style={{ fontSize: 14, color: dark ? "rgba(255,255,255,.4)" : T.muted, fontWeight: 300 }}>Loading profile…</span>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : (
        <>
          {/* Avatar + name hero */}
          <div style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            padding: "32px 24px 28px", textAlign: "center",
            background: T.navy, borderRadius: 12, marginBottom: 20,
            position: "relative", overflow: "hidden",
          }}>
            <div style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, borderRadius: "50%", border: "1px solid rgba(201,168,76,.1)", pointerEvents: "none" }} />

            {/* Avatar circle */}
            <div style={{
              width: 64, height: 64, borderRadius: "50%",
              background: "rgba(201,168,76,.15)",
              border: `2px solid ${T.gold}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 22, fontWeight: 700, color: T.gold,
              marginBottom: 14, fontFamily: "'DM Sans', sans-serif",
            }}>
              {initials}
            </div>

            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: "white", margin: "0 0 4px" }}>
              {currentUser?.name || "N/A"}
            </h2>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,.4)", fontWeight: 300, margin: 0 }}>
              {currentUser?.email || ""}
            </p>

            {/* Verified badge */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              background: "rgba(26,122,74,.2)", border: "1px solid rgba(26,122,74,.35)",
              borderRadius: 20, padding: "4px 12px", marginTop: 12,
            }}>
              <ShieldCheck size={12} color={T.success} />
              <span style={{ fontSize: 11, color: T.success, fontWeight: 600, letterSpacing: .3 }}>Verified Account</span>
            </div>
          </div>

          {/* Profile fields */}
          <div style={{ paddingBottom: 4 }}>
            <ProfileRow icon={User}       label="Full Name"       value={currentUser?.name       || "N/A"} dark={dark} />
            <ProfileRow icon={Mail}       label="Email Address"   value={currentUser?.email      || "N/A"} dark={dark} />
            <ProfileRow icon={Phone}      label="Phone Number"    value={currentUser?.phone      || "N/A"} dark={dark} />
            <ProfileRow icon={CreditCard} label="National ID"     value={currentUser?.id_number  || "N/A"} dark={dark} />
            <ProfileRow icon={Hash}       label="Account Number"  value={accountDetails.account_number}    dark={dark} />
            <ProfileRow
              icon={Wallet}
              label="Account Balance"
              value={`KES ${Number(accountDetails.balance || 0).toLocaleString()}`}
              highlight dark={dark}
            />
          </div>

          {/* Info note */}
          <div style={{
            display: "flex", alignItems: "flex-start", gap: 8,
            background: dark ? "rgba(201,168,76,.06)" : T.goldPale,
            border: "1px solid rgba(201,168,76,.2)",
            borderRadius: 8, padding: "10px 14px", marginTop: 16,
          }}>
            <ShieldCheck size={13} color={T.gold} style={{ flexShrink: 0, marginTop: 1 }} />
            <p style={{ fontSize: 12, color: dark ? "rgba(255,255,255,.4)" : T.muted, fontWeight: 300, margin: 0, lineHeight: 1.65 }}>
              To update your personal details, please visit your nearest Capital Bank branch or contact support at{" "}
              <strong style={{ color: dark ? "rgba(255,255,255,.6)" : T.navy }}>support@capitalbank.co.ke</strong>.
            </p>
          </div>
        </>
      )}
    </div>
  );
}