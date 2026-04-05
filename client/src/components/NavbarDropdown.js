import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, LayoutDashboard, User, LogOut } from "lucide-react";

const T = {
  navy: "#0B1F3A", navyLight: "#1A3A5C",
  gold: "#C9A84C",
  cream: "#FAFAF7", white: "#FFFFFF",
  border: "#E8EDF2", muted: "#6B7A8D",
  danger: "#C0392B",
};

export default function NavbarDropdown({ currentUser }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close on ESC
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const initials = currentUser?.name
    ? currentUser.name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    window.location.reload();
  };

  return (
    <div ref={ref} style={{ position: "relative" }}>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "none", border: "none", cursor: "pointer",
          padding: "6px 10px", borderRadius: 8,
          transition: "background .15s",
          fontFamily: "'DM Sans', -apple-system, sans-serif",
        }}
        onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,.06)"}
        onMouseLeave={e => e.currentTarget.style.background = "none"}
      >
        {/* Avatar */}
        <div style={{
          width: 30, height: 30, borderRadius: "50%",
          background: "rgba(201,168,76,.15)",
          border: `1.5px solid ${T.gold}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 11, fontWeight: 700, color: T.gold,
          flexShrink: 0,
        }}>
          {initials}
        </div>

        <span style={{ fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,.75)", maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {currentUser?.name}
        </span>

        <ChevronDown size={13} style={{ color: "rgba(255,255,255,.4)", transition: "transform .2s", transform: open ? "rotate(180deg)" : "none", flexShrink: 0 }} />
      </button>

      {/* Dropdown panel */}
      {open && (
        <>
          {/* Backdrop */}
          <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 10 }} />

          <div style={{
            position: "absolute", right: 0, top: "calc(100% + 8px)",
            width: 210, background: T.white,
            border: `1px solid ${T.border}`,
            borderRadius: 12,
            boxShadow: "0 16px 48px rgba(11,31,58,.14)",
            zIndex: 20, overflow: "hidden",
            fontFamily: "'DM Sans', -apple-system, sans-serif",
          }}>
            {/* User info header */}
            <div style={{ padding: "14px 16px", borderBottom: `1px solid ${T.border}`, background: T.navy }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "white", marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {currentUser?.name}
              </div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,.4)", fontWeight: 300, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {currentUser?.email || currentUser?.phone}
              </div>
            </div>

            {/* Menu items */}
            <div style={{ padding: "6px 0" }}>
              <DropdownLink to="/dashboard" icon={<LayoutDashboard size={13} />} label="Dashboard" />
              <DropdownLink to="/profile"   icon={<User size={13} />}            label="My Profile" />

              <div style={{ height: 1, background: T.border, margin: "4px 0" }} />

              <button
                onClick={handleLogout}
                style={{
                  display: "flex", alignItems: "center", gap: 9,
                  width: "100%", padding: "9px 16px",
                  background: "none", border: "none",
                  fontSize: 13, color: T.danger,
                  cursor: "pointer", fontFamily: "inherit", textAlign: "left",
                  transition: "background .15s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "#FEF0EF"}
                onMouseLeave={e => e.currentTarget.style.background = "none"}
              >
                <LogOut size={13} />
                Log Out
              </button>
            </div>

            {/* CBK badge */}
            <div style={{ padding: "8px 16px", borderTop: `1px solid ${T.border}`, background: T.cream }}>
              <span style={{ fontSize: 10, color: T.muted, display: "flex", alignItems: "center", gap: 4 }}>
                🔒 CBK Licensed · Deposits Protected
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function DropdownLink({ to, icon, label }) {
  const [hov, setHov] = useState(false);
  return (
    <Link
      to={to}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", alignItems: "center", gap: 9,
        padding: "9px 16px", fontSize: 13,
        color: hov ? T.navy : T.muted,
        background: hov ? T.cream : "transparent",
        transition: "all .15s", textDecoration: "none",
      }}
    >
      <span style={{ color: hov ? T.gold : T.muted, transition: "color .15s" }}>{icon}</span>
      {label}
    </Link>
  );
}