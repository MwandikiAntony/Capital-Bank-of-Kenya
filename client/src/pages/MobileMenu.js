import { useState } from "react";
import { Link } from "react-router-dom";
import { X, Menu, LayoutDashboard, User, LogOut } from "lucide-react";

const T = {
  navy: "#0B1F3A", navyLight: "#1A3A5C",
  gold: "#C9A84C", cream: "#FAFAF7",
  border: "#E8EDF2", muted: "#6B7A8D",
};

export function MobileMenu({ currentUser }) {
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    window.location.reload();
  };

  return (
    <div style={{ position: "relative" }}>
      {/* Hamburger / Close button */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          background: "none", border: "none", cursor: "pointer",
          padding: 6, display: "flex", alignItems: "center", justifyContent: "center",
          color: T.navy,
        }}
        aria-label="Toggle menu"
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Dropdown */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setOpen(false)}
            style={{ position: "fixed", inset: 0, zIndex: 40, background: "rgba(11,31,58,.2)", backdropFilter: "blur(2px)" }}
          />

          {/* Menu panel */}
          <div style={{
            position: "absolute", right: 0, top: "calc(100% + 12px)",
            width: 240, background: T.cream, borderRadius: 14,
            border: `1px solid ${T.border}`,
            boxShadow: "0 16px 48px rgba(11,31,58,.14)",
            zIndex: 50, overflow: "hidden",
          }}>

            {/* User info (if logged in) */}
            {currentUser && (
              <div style={{ padding: "16px 18px", borderBottom: `1px solid ${T.border}`, background: T.navy }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: "50%", background: "rgba(201,168,76,.15)",
                    border: `1.5px solid ${T.gold}`, display: "flex", alignItems: "center",
                    justifyContent: "center", fontSize: 13, fontWeight: 700, color: T.gold,
                    flexShrink: 0,
                  }}>
                    {currentUser.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "white", lineHeight: 1.3 }}>{currentUser.name}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,.4)", fontWeight: 300 }}>{currentUser.phone || currentUser.email}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Nav links */}
            <div style={{ padding: "8px 0" }}>
              {!currentUser ? (
                <>
                  <NavLink to="/register" onClick={() => setOpen(false)} highlight>Open Account</NavLink>
                  <NavLink to="/login" onClick={() => setOpen(false)}>Log In</NavLink>
                  <div style={{ height: 1, background: T.border, margin: "4px 0" }} />
                  <NavLink to="/help" onClick={() => setOpen(false)}>Help Center</NavLink>
                  <NavLink to="/contact" onClick={() => setOpen(false)}>Contact Us</NavLink>
                </>
              ) : (
                <>
                  <NavLink to="/dashboard" onClick={() => setOpen(false)} icon={<LayoutDashboard size={15} />}>Dashboard</NavLink>
                  <NavLink to="/profile" onClick={() => setOpen(false)} icon={<User size={15} />}>My Profile</NavLink>
                  <div style={{ height: 1, background: T.border, margin: "4px 0" }} />
                  <NavLink to="/help" onClick={() => setOpen(false)}>Help Center</NavLink>
                  <NavLink to="/contact" onClick={() => setOpen(false)}>Contact Us</NavLink>
                  <div style={{ height: 1, background: T.border, margin: "4px 0" }} />
                  <button
                    onClick={handleLogout}
                    style={{
                      display: "flex", alignItems: "center", gap: 10, width: "100%",
                      padding: "10px 18px", background: "none", border: "none",
                      fontSize: 13, color: "#C0392B", fontWeight: 500,
                      cursor: "pointer", fontFamily: "inherit", textAlign: "left",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "#FEF0EF"}
                    onMouseLeave={e => e.currentTarget.style.background = "none"}
                  >
                    <LogOut size={15} />
                    Log Out
                  </button>
                </>
              )}
            </div>

            {/* CBK badge */}
            <div style={{ padding: "10px 18px", borderTop: `1px solid ${T.border}`, background: "#F7F8FA" }}>
              <span style={{ fontSize: 10, color: T.muted, display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ fontSize: 11 }}>🔒</span> CBK Licensed · Deposits Protected
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function NavLink({ to, children, onClick, icon, highlight }) {
  const [hov, setHov] = useState(false);
  return (
    <Link
      to={to}
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "10px 18px", fontSize: 13, fontWeight: highlight ? 600 : 500,
        color: highlight ? T.navy : hov ? T.navy : T.muted,
        background: highlight && hov ? "#F0F4F8" : hov ? "#F7F8FA" : "transparent",
        transition: "all .15s", textDecoration: "none",
      }}
    >
      {icon && <span style={{ color: T.muted }}>{icon}</span>}
      {children}
      {highlight && <span style={{ marginLeft: "auto", fontSize: 11, color: T.gold, fontWeight: 700 }}>→</span>}
    </Link>
  );
}

export default MobileMenu;