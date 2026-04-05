import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  Wallet, ArrowLeftRight, UserCog, Settings2, Bell,
  CreditCard, FileText, BarChart3, Menu, X, LogOut,
  TrendingUp, TrendingDown, ArrowUpRight, ArrowDownLeft,
  Plus, Eye, EyeOff, Home,
} from "lucide-react";
import UpdateProfile from "../components/UpdateProfile";
import LoanApplication from "../components/LoanApplication";
import Withdraw from "../components/Withdraw";
import Deposit from "../components/Deposit";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../utils/api";
import { fetchNotifications as fetchNotificationsService } from "../services/notifications";
import Statements from "../pages/Statements";

/* ── Design tokens ─────────────────────────────────── */
const T = {
  navy:      "#0B1F3A",
  navyMid:   "#122848",
  navyLight: "#1A3A5C",
  navyGlass: "rgba(11,31,58,0.97)",
  gold:      "#C9A84C",
  goldLight: "#E4C170",
  goldPale:  "#F9F2E1",
  cream:     "#FAFAF7",
  white:     "#FFFFFF",
  border:    "#E8EDF2",
  borderMid: "#D0D9E2",
  muted:     "#6B7A8D",
  hint:      "#A9B5C2",
  success:   "#1A7A4A",
  danger:    "#C0392B",
  // dark variants
  darkBg:    "#060F1E",
  darkSurf:  "#0D1E35",
  darkCard:  "#112234",
  darkBord:  "#1A3050",
};

const FONT_URL = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=DM+Sans:wght@300;400;500;600&display=swap";

const NAV_ITEMS = [
  { key: "overview",       label: "Overview",        Icon: Home },
  { key: "deposit",        label: "Deposit",          Icon: ArrowDownLeft },
  { key: "withdraw",       label: "Withdraw",         Icon: ArrowUpRight },
  { key: "transfer",       label: "Transfer Funds",   Icon: ArrowLeftRight },
  { key: "cards",          label: "My Cards",         Icon: CreditCard },
  { key: "statements",     label: "Statements",       Icon: FileText },
  { key: "limits",         label: "Loans",            Icon: BarChart3 },
  { key: "notifications",  label: "Notifications",    Icon: Bell },
  { key: "profile",        label: "Update Profile",   Icon: UserCog },
  { key: "settings",       label: "Settings",         Icon: Settings2 },
];

/* ── Helpers ───────────────────────────────────────── */
function fmt(n) { return Number(n || 0).toLocaleString("en-KE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
function fmtDate(d) { return new Date(d).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" }); }
function fmtTime(d) { return new Date(d).toLocaleTimeString("en-KE", { hour: "2-digit", minute: "2-digit" }); }

/* ── Shared card shell ─────────────────────────────── */
function Card({ children, style, dark }) {
  return (
    <div style={{
      background: dark ? T.darkCard : T.white,
      border: `1px solid ${dark ? T.darkBord : T.border}`,
      borderRadius: 14, padding: "24px 28px",
      ...style,
    }}>
      {children}
    </div>
  );
}

function SectionTitle({ children, dark, sub }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: dark ? T.white : T.navy, margin: 0, lineHeight: 1.2 }}>
        {children}
      </h2>
      {sub && <p style={{ fontSize: 13, color: dark ? "rgba(255,255,255,.4)" : T.muted, fontWeight: 300, marginTop: 5 }}>{sub}</p>}
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   OVERVIEW
══════════════════════════════════════════════════════ */
function Overview({ balance, transactions, darkMode, userName }) {
  const [balanceVisible, setBalanceVisible] = useState(true);
  const dark = darkMode;

  const totalIn  = transactions.filter(t => t.type?.toLowerCase() === "deposit").reduce((s,t) => s + Number(t.amount),0);
  const totalOut = transactions.filter(t => t.type?.toLowerCase() !== "deposit").reduce((s,t) => s + Number(t.amount),0);
  const recent   = transactions.slice(0, 8);

  return (
    <div>
      {/* Balance hero card */}
      <div style={{
        background: T.navy, borderRadius: 16, padding: "32px",
        position: "relative", overflow: "hidden", marginBottom: 20,
      }}>
        {/* Rings */}
        <div style={{ position:"absolute", top:-60, right:-60, width:240, height:240, borderRadius:"50%", border:`1px solid rgba(201,168,76,.12)`, pointerEvents:"none" }}/>
        <div style={{ position:"absolute", top:-20, right:-20, width:150, height:150, borderRadius:"50%", border:`1px solid rgba(201,168,76,.07)`, pointerEvents:"none" }}/>

        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom: 24 }}>
          <div>
            <div style={{ fontSize:11, fontWeight:600, letterSpacing:2, textTransform:"uppercase", color:"rgba(255,255,255,.4)", marginBottom:6 }}>
              Total Balance
            </div>
            <div style={{ display:"flex", alignItems:"baseline", gap:10 }}>
              <span style={{ fontSize:13, color:"rgba(255,255,255,.5)", fontWeight:300 }}>KES</span>
              <span style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(28px,5vw,42px)", fontWeight:700, color:"white" }}>
                {balanceVisible ? fmt(balance) : "••••••"}
              </span>
            </div>
          </div>
          <button onClick={() => setBalanceVisible(v => !v)}
            style={{ background:"rgba(255,255,255,.08)", border:"none", borderRadius:8, padding:"8px 12px", cursor:"pointer", color:"rgba(255,255,255,.6)", display:"flex", alignItems:"center", gap:6, fontSize:12 }}>
            {balanceVisible ? <EyeOff size={15}/> : <Eye size={15}/>}
            {balanceVisible ? "Hide" : "Show"}
          </button>
        </div>

        {/* Mini stats */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          {[
            { label:"Money In",  value: fmt(totalIn),  color:"#4ADE80", Icon: TrendingUp },
            { label:"Money Out", value: fmt(totalOut), color:"#F87171", Icon: TrendingDown },
          ].map(({ label, value, color, Icon }) => (
            <div key={label} style={{ background:"rgba(255,255,255,.06)", borderRadius:10, padding:"14px 16px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:6 }}>
                <Icon size={13} color={color} />
                <span style={{ fontSize:11, fontWeight:600, textTransform:"uppercase", letterSpacing:.8, color:"rgba(255,255,255,.4)" }}>{label}</span>
              </div>
              <div style={{ fontSize:16, fontWeight:700, color }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Greeting */}
        {userName && (
          <div style={{ marginTop:20, paddingTop:16, borderTop:"1px solid rgba(255,255,255,.08)", fontSize:13, color:"rgba(255,255,255,.45)", fontWeight:300 }}>
            Welcome back, <span style={{ color:T.goldLight, fontWeight:600 }}>{userName}</span>
          </div>
        )}
      </div>

      {/* Recent transactions */}
      <Card dark={dark}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
          <h3 style={{ fontSize:15, fontWeight:600, color: dark ? T.white : T.navy, margin:0 }}>Recent Transactions</h3>
          <span style={{ fontSize:12, color:T.gold, fontWeight:600 }}>{transactions.length} total</span>
        </div>

        {recent.length > 0 ? (
          <div>
            {recent.map((tx, i) => {
              const isIn = tx.type?.toLowerCase() === "deposit";
              return (
                <div key={tx.id || i} style={{
                  display:"flex", alignItems:"center", justifyContent:"space-between",
                  padding:"12px 0",
                  borderBottom: i < recent.length - 1 ? `1px solid ${dark ? T.darkBord : T.border}` : "none",
                }}>
                  <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                    <div style={{
                      width:36, height:36, borderRadius:"50%",
                      background: isIn ? (dark ? "rgba(26,122,74,.2)" : "#EAFAF2") : (dark ? "rgba(192,57,43,.15)" : "#FEF0EF"),
                      display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0,
                    }}>
                      {isIn ? <ArrowDownLeft size={16} color={T.success}/> : <ArrowUpRight size={16} color={T.danger}/>}
                    </div>
                    <div>
                      <div style={{ fontSize:13, fontWeight:600, color: dark ? T.white : T.navy }}>{tx.type}</div>
                      <div style={{ fontSize:11, color: dark ? "rgba(255,255,255,.35)" : T.hint, fontWeight:300 }}>
                        {fmtDate(tx.created_at)} · {fmtTime(tx.created_at)}
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ fontSize:14, fontWeight:700, color: isIn ? T.success : T.danger }}>
                      {isIn ? "+" : "−"}KES {fmt(tx.amount)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ textAlign:"center", padding:"40px 0", color: dark ? "rgba(255,255,255,.3)" : T.hint }}>
            <Wallet size={32} style={{ margin:"0 auto 12px", opacity:.4 }} />
            <p style={{ fontSize:14, fontWeight:300 }}>No transactions yet.</p>
          </div>
        )}
      </Card>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   TRANSFER FUNDS
══════════════════════════════════════════════════════ */
function TransferFunds({ amount, setAmount, recipient, setRecipient, transfer, darkMode: dark }) {
  const [focused, setFocused] = useState(null);

  const inputStyle = (field) => ({
    width:"100%", padding:"12px 14px", fontSize:14, fontFamily:"inherit",
    background: focused === field ? (dark ? T.darkSurf : T.cream) : (dark ? T.darkCard : "#FAFBFC"),
    border:`1.5px solid ${focused === field ? T.gold : (dark ? T.darkBord : T.border)}`,
    borderRadius:8, outline:"none", color: dark ? T.white : T.navy,
    transition:"all .2s", boxSizing:"border-box",
  });

  return (
    <div>
      <SectionTitle dark={dark} sub="Send money to any Capital Bank account instantly.">Transfer Funds</SectionTitle>
      <Card dark={dark} style={{ maxWidth: 520 }}>
        <div style={{ marginBottom:18 }}>
          <label style={{ display:"block", fontSize:11, fontWeight:600, letterSpacing:.8, textTransform:"uppercase", color: dark ? "rgba(255,255,255,.4)" : T.muted, marginBottom:7 }}>
            Recipient Email
          </label>
          <input
            type="email" value={recipient} onChange={e => setRecipient(e.target.value)}
            placeholder="recipient@example.com"
            onFocus={() => setFocused("email")} onBlur={() => setFocused(null)}
            style={inputStyle("email")}
          />
        </div>
        <div style={{ marginBottom:24 }}>
          <label style={{ display:"block", fontSize:11, fontWeight:600, letterSpacing:.8, textTransform:"uppercase", color: dark ? "rgba(255,255,255,.4)" : T.muted, marginBottom:7 }}>
            Amount (KES)
          </label>
          <div style={{ position:"relative" }}>
            <span style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", fontSize:13, color: dark ? "rgba(255,255,255,.3)" : T.muted, fontWeight:600 }}>KES</span>
            <input
              type="number" value={amount} onChange={e => setAmount(e.target.value)}
              placeholder="0.00"
              onFocus={() => setFocused("amount")} onBlur={() => setFocused(null)}
              style={{ ...inputStyle("amount"), paddingLeft:52 }}
            />
          </div>
        </div>
        <button onClick={transfer}
          style={{
            width:"100%", padding:"13px", background: (!recipient || !amount) ? T.muted : T.navy,
            color:"white", border:"none", borderRadius:8, fontSize:14, fontWeight:600,
            cursor: (!recipient || !amount) ? "not-allowed" : "pointer",
            fontFamily:"inherit", letterSpacing:.5, transition:"background .2s",
            display:"flex", alignItems:"center", justifyContent:"center", gap:8,
          }}>
          <ArrowLeftRight size={16} /> Send Transfer
        </button>
        <p style={{ fontSize:12, color: dark ? "rgba(255,255,255,.25)" : T.hint, fontWeight:300, textAlign:"center", marginTop:12 }}>
          Transfers are processed instantly. Please verify recipient details before sending.
        </p>
      </Card>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   SETTINGS
══════════════════════════════════════════════════════ */
function Settings({ darkMode, toggleDarkMode, dark }) {
  const labelStyle = { fontSize:14, fontWeight:500, color: dark ? T.white : T.navy };
  const subStyle   = { fontSize:12, fontWeight:300, color: dark ? "rgba(255,255,255,.4)" : T.muted };

  const ToggleRow = ({ label, sub, checked, onChange }) => (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 0", borderBottom:`1px solid ${dark ? T.darkBord : T.border}` }}>
      <div>
        <div style={labelStyle}>{label}</div>
        {sub && <div style={subStyle}>{sub}</div>}
      </div>
      <label style={{ position:"relative", width:44, height:24, cursor:"pointer", flexShrink:0 }}>
        <input type="checkbox" checked={checked} onChange={onChange} style={{ opacity:0, width:0, height:0 }} />
        <span style={{
          position:"absolute", inset:0, borderRadius:24,
          background: checked ? T.navy : (dark ? T.darkBord : T.border),
          transition:"background .2s",
        }}>
          <span style={{
            position:"absolute", left: checked ? "calc(100% - 22px)" : 2,
            top:2, width:20, height:20, borderRadius:"50%",
            background: checked ? T.gold : (dark ? T.muted : T.hint),
            transition:"left .2s",
          }}/>
        </span>
      </label>
    </div>
  );

  const [notifs, setNotifs] = useState(true);
  const [twofa, setTwofa]   = useState(false);
  const [intl, setIntl]     = useState(false);

  return (
    <div>
      <SectionTitle dark={dark} sub="Manage your account preferences and security settings.">Settings</SectionTitle>
      <Card dark={dark} style={{ maxWidth: 560 }}>
        <ToggleRow label="Dark Mode" sub="Switch between light and dark interface" checked={darkMode} onChange={toggleDarkMode} />
        <ToggleRow label="Push Notifications" sub="Receive alerts for transactions and offers" checked={notifs} onChange={() => setNotifs(v => !v)} />
        <ToggleRow label="Two-Factor Authentication" sub="Add an extra layer of security to your account" checked={twofa} onChange={() => setTwofa(v => !v)} />
        <ToggleRow label="International Transfers" sub="Enable sending money outside Kenya" checked={intl} onChange={() => setIntl(v => !v)} />
      </Card>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   NOTIFICATIONS
══════════════════════════════════════════════════════ */
function Notifications({ notifications, darkMode: dark }) {
  return (
    <div>
      <SectionTitle dark={dark} sub="Stay updated on your account activity.">Notifications</SectionTitle>
      <Card dark={dark}>
        {notifications.length > 0 ? (
          notifications.map((note, i) => (
            <div key={i} style={{
              display:"flex", alignItems:"flex-start", gap:12, padding:"14px 0",
              borderBottom: i < notifications.length - 1 ? `1px solid ${dark ? T.darkBord : T.border}` : "none",
            }}>
              <div style={{ width:8, height:8, borderRadius:"50%", background:T.gold, flexShrink:0, marginTop:5 }}/>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:500, color: dark ? T.white : T.navy, lineHeight:1.5 }}>{note.message}</div>
                <div style={{ fontSize:11, color: dark ? "rgba(255,255,255,.3)" : T.hint, fontWeight:300, marginTop:4 }}>
                  {fmtDate(note.created_at)} · {fmtTime(note.created_at)}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={{ textAlign:"center", padding:"48px 0", color: dark ? "rgba(255,255,255,.3)" : T.hint }}>
            <Bell size={32} style={{ margin:"0 auto 12px", opacity:.4 }} />
            <p style={{ fontSize:14, fontWeight:300 }}>No notifications yet.</p>
          </div>
        )}
      </Card>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   CARDS
══════════════════════════════════════════════════════ */
function DebitCard({ card, onView }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      onClick={() => onView(card)}
      style={{
        background: T.navy, borderRadius:16, padding:28, cursor:"pointer",
        transition:"transform .25s, box-shadow .25s", position:"relative", overflow:"hidden",
        transform: hov ? "translateY(-4px)" : "none",
        boxShadow: hov ? "0 20px 48px rgba(11,31,58,.3)" : "0 4px 20px rgba(11,31,58,.1)",
      }}>
      <div style={{ position:"absolute", top:-40, right:-40, width:160, height:160, borderRadius:"50%", border:`1px solid rgba(201,168,76,.12)`, pointerEvents:"none" }}/>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:28 }}>
        <div style={{ width:40, height:28, background:`linear-gradient(135deg,${T.gold},${T.goldLight})`, borderRadius:4 }}/>
        <span style={{ fontSize:16, fontWeight:700, color:"rgba(255,255,255,.5)", letterSpacing:1 }}>VISA</span>
      </div>
      <div style={{ fontSize:15, letterSpacing:3, color:"rgba(255,255,255,.55)", marginBottom:20, fontWeight:300 }}>
        {card.number.replace(/(\d{4})/g,"$1 ").trim().replace(/\d{4} \d{4} \d{4}/,"•••• •••• ••••")}
      </div>
      <div style={{ display:"flex", justifyContent:"space-between" }}>
        <div>
          <div style={{ fontSize:9, textTransform:"uppercase", letterSpacing:1.5, color:"rgba(255,255,255,.3)", marginBottom:3 }}>Card Holder</div>
          <div style={{ fontSize:13, fontWeight:600, color:"white" }}>{card.holder}</div>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ fontSize:9, textTransform:"uppercase", letterSpacing:1.5, color:"rgba(255,255,255,.3)", marginBottom:3 }}>Expires</div>
          <div style={{ fontSize:13, fontWeight:600, color:"white" }}>{card.expiry}</div>
        </div>
      </div>
    </div>
  );
}

function AddCardModal({ show, onClose, onAdd }) {
  const [number, setNumber] = useState("");
  const [holder, setHolder] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv]       = useState("");

  const handleAdd = () => {
    if (!number || !holder || !expiry || !cvv) return;
    onAdd({ number, holder, expiry, cvv });
    setNumber(""); setHolder(""); setExpiry(""); setCvv("");
    onClose();
  };

  if (!show) return null;
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(11,31,58,.7)", backdropFilter:"blur(4px)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:200 }}>
      <div style={{ background:T.cream, borderRadius:16, padding:36, width:"100%", maxWidth:400, boxShadow:"0 24px 64px rgba(11,31,58,.2)" }}>
        <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:22, color:T.navy, marginBottom:24 }}>Add New Card</h2>
        {[
          { label:"Card Holder", value:holder, set:setHolder, placeholder:"Full name on card" },
          { label:"Card Number", value:number, set:setNumber, placeholder:"1234 5678 9012 3456" },
          { label:"Expiry Date", value:expiry, set:setExpiry, placeholder:"MM/YY" },
          { label:"CVV",         value:cvv,    set:setCvv,    placeholder:"•••" },
        ].map(({ label, value, set, placeholder }) => (
          <div key={label} style={{ marginBottom:16 }}>
            <label style={{ display:"block", fontSize:11, fontWeight:600, letterSpacing:.8, textTransform:"uppercase", color:T.muted, marginBottom:7 }}>{label}</label>
            <input value={value} onChange={e => set(e.target.value)} placeholder={placeholder}
              style={{ width:"100%", padding:"11px 14px", fontSize:14, border:`1.5px solid ${T.border}`, borderRadius:8, outline:"none", color:T.navy, fontFamily:"inherit", boxSizing:"border-box" }}
              onFocus={e => e.target.style.borderColor = T.navy} onBlur={e => e.target.style.borderColor = T.border}
            />
          </div>
        ))}
        <div style={{ display:"flex", gap:10, marginTop:8 }}>
          <button onClick={onClose} style={{ flex:1, padding:"12px", background:"transparent", border:`1px solid ${T.border}`, borderRadius:8, fontSize:13, fontWeight:500, color:T.muted, cursor:"pointer", fontFamily:"inherit" }}>Cancel</button>
          <button onClick={handleAdd} style={{ flex:2, padding:"12px", background:T.navy, border:"none", borderRadius:8, fontSize:13, fontWeight:600, color:"white", cursor:"pointer", fontFamily:"inherit" }}>Add Card</button>
        </div>
      </div>
    </div>
  );
}

function CardDetailsModal({ card, onClose }) {
  if (!card) return null;
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(11,31,58,.7)", backdropFilter:"blur(4px)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:200 }}>
      <div style={{ background:T.cream, borderRadius:16, padding:36, width:"100%", maxWidth:360 }}>
        <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:20, color:T.navy, marginBottom:24 }}>Card Details</h2>
        {[["Holder", card.holder], ["Number", card.number], ["Expiry", card.expiry], ["CVV", card.cvv]].map(([k,v]) => (
          <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"10px 0", borderBottom:`1px solid ${T.border}` }}>
            <span style={{ fontSize:12, textTransform:"uppercase", letterSpacing:.8, color:T.muted, fontWeight:600 }}>{k}</span>
            <span style={{ fontSize:14, fontWeight:600, color:T.navy }}>{v}</span>
          </div>
        ))}
        <button onClick={onClose} style={{ width:"100%", marginTop:20, padding:"12px", background:T.navy, border:"none", borderRadius:8, fontSize:13, fontWeight:600, color:"white", cursor:"pointer", fontFamily:"inherit" }}>Close</button>
      </div>
    </div>
  );
}

function Cards({ darkMode: dark }) {
  const [cards, setCards]         = useState([]);
  const [showAdd, setShowAdd]     = useState(false);
  const [viewCard, setViewCard]   = useState(null);

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:24 }}>
        <SectionTitle dark={dark} sub="Manage your debit and credit cards.">My Cards</SectionTitle>
        <button onClick={() => setShowAdd(true)}
          style={{ display:"flex", alignItems:"center", gap:6, padding:"9px 20px", background:T.navy, color:"white", border:"none", borderRadius:8, fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>
          <Plus size={14}/> Add Card
        </button>
      </div>

      {cards.length > 0 ? (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(280px,1fr))", gap:20 }}>
          {cards.map((card, i) => <DebitCard key={i} card={card} onView={setViewCard} />)}
        </div>
      ) : (
        <Card dark={dark}>
          <div style={{ textAlign:"center", padding:"48px 0", color: dark ? "rgba(255,255,255,.3)" : T.hint }}>
            <CreditCard size={40} style={{ margin:"0 auto 16px", opacity:.4 }} />
            <p style={{ fontSize:15, fontWeight:500, color: dark ? "rgba(255,255,255,.5)" : T.muted, marginBottom:8 }}>No cards yet</p>
            <p style={{ fontSize:13, fontWeight:300 }}>Add your first card to get started.</p>
            <button onClick={() => setShowAdd(true)}
              style={{ marginTop:20, padding:"10px 24px", background:T.navy, color:"white", border:"none", borderRadius:8, fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>
              Add Card
            </button>
          </div>
        </Card>
      )}

      <AddCardModal show={showAdd} onClose={() => setShowAdd(false)} onAdd={card => setCards(prev => [...prev, card])} />
      <CardDetailsModal card={viewCard} onClose={() => setViewCard(null)} />
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   LOANS / LIMITS
══════════════════════════════════════════════════════ */
function Loans({ user, fetchNotificationsService, addNotification, darkMode: dark, loans }) {
  return (
    <div>
      <SectionTitle dark={dark} sub="Apply for personal, SME, or home loans.">Loan Application</SectionTitle>
      <Card dark={dark}>
        <LoanApplication userId={user?.id} fetchNotifications={fetchNotificationsService} addNotification={addNotification} />
      </Card>
      {loans?.length > 0 && (
        <Card dark={dark} style={{ marginTop:16 }}>
          <h3 style={{ fontSize:15, fontWeight:600, color: dark ? T.white : T.navy, marginBottom:16 }}>Loan History</h3>
          {loans.map(loan => (
            <div key={loan.id} style={{ display:"flex", justifyContent:"space-between", padding:"10px 0", borderBottom:`1px solid ${dark ? T.darkBord : T.border}`, fontSize:13 }}>
              <span style={{ color: dark ? T.white : T.navy }}>KES {fmt(loan.amount)} — {loan.duration}</span>
              <span style={{ color: loan.status === "approved" ? T.success : T.muted, fontWeight:600 }}>{loan.status}</span>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   MAIN DASHBOARD
══════════════════════════════════════════════════════ */
export default function Dashboard() {
  const [balance, setBalance]         = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount]           = useState("");
  const [recipient, setRecipient]     = useState("");
  const [user, setUser]               = useState(null);
  const [darkMode, setDarkMode]       = useState(localStorage.getItem("darkMode") === "true");
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loans]                       = useState([]);

  const navigate = useNavigate();

  const storedUser = useMemo(() => JSON.parse(localStorage.getItem("user")), []);
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const dark = darkMode;
  const bg   = dark ? T.darkBg   : T.cream;
  const sidebar = dark ? T.darkSurf : T.white;
  const sidebarBord = dark ? T.darkBord : T.border;

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user"));
    if (stored) setUser(stored);
  }, []);

  const addNotification = (message) => {
    setNotifications(prev => [{ message, created_at: new Date() }, ...prev]);
  };

  const fetchAccount = useCallback(async () => {
    try {
      const res = await api.get("/account");
      setBalance(res.data.balance);
      setTransactions(res.data.transactions);
      if (storedUser) setUser(storedUser);
    } catch (err) {
      console.error("Error fetching account:", err.response?.data || err.message);
    }
  }, [storedUser]);

  useEffect(() => { fetchAccount(); }, [fetchAccount]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchNotificationsService().then(setNotifications).catch(() => {});
    }
  }, []);

  const transfer = async () => {
    if (!recipient || !amount) return;
    try {
      await api.post("/transfer", { email: recipient, amount });
      toast.success(`Transferred KES ${amount} to ${recipient}`);
      addNotification(`Transferred KES ${amount} to ${recipient} successfully.`);
      setAmount(""); setRecipient("");
      fetchAccount();
    } catch (err) {
      toast.error(err.response?.data?.error || "Transfer failed");
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(prev => {
      localStorage.setItem("darkMode", String(!prev));
      return !prev;
    });
  };

  const handleLogout = () => {
    localStorage.clear();
    toast.success("You have been logged out.");
    setTimeout(() => navigate("/login"), 1200);
  };

  // Unread notification count
  const unreadCount = notifications.length;

  return (
    <div style={{ minHeight:"100vh", background:bg, fontFamily:"'DM Sans', -apple-system, sans-serif", display:"flex", flexDirection:"column" }}>
      <link rel="stylesheet" href={FONT_URL} />
      <style>{`
        * { box-sizing: border-box; }
        a { text-decoration: none; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${dark ? T.darkBord : T.borderMid}; border-radius: 4px; }
        @keyframes fadeIn { from { opacity:0; transform:translateY(10px) } to { opacity:1; transform:translateY(0) } }
        .section-anim { animation: fadeIn .35s ease both; }
      `}</style>

      {/* ── TOPBAR ── */}
      <header style={{
        background: T.navy, padding:"0 24px", height:64,
        display:"flex", alignItems:"center", justifyContent:"space-between",
        position:"sticky", top:0, zIndex:100,
        borderBottom:"1px solid rgba(255,255,255,.06)",
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          <button onClick={() => setSidebarOpen(o => !o)}
            style={{ background:"none", border:"none", cursor:"pointer", color:"rgba(255,255,255,.6)", display:"flex", padding:4 }}
            className="mobile-only">
            {sidebarOpen ? <X size={20}/> : <Menu size={20}/>}
          </button>
          {/* Logo */}
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ width:30, height:30, background:"rgba(201,168,76,.15)", borderRadius:7, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <div style={{ width:12, height:12, border:`1.5px solid ${T.gold}`, borderRadius:2, transform:"rotate(45deg)" }}/>
            </div>
            <span style={{ fontFamily:"'Playfair Display',serif", fontSize:17, fontWeight:700, color:"white", letterSpacing:.4 }}>
              Capital <span style={{ color:T.gold }}>Bank</span>
            </span>
          </div>
        </div>

        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          {/* Notification bell */}
          <button onClick={() => setActiveSection("notifications")}
            style={{ position:"relative", background:"rgba(255,255,255,.07)", border:"none", borderRadius:8, padding:"8px 10px", cursor:"pointer", color:"rgba(255,255,255,.6)", display:"flex" }}>
            <Bell size={17}/>
            {unreadCount > 0 && (
              <span style={{ position:"absolute", top:4, right:4, width:8, height:8, borderRadius:"50%", background:T.gold }}/>
            )}
          </button>

          {/* User chip */}
          {user && (
            <div style={{ display:"flex", alignItems:"center", gap:8, background:"rgba(255,255,255,.06)", borderRadius:8, padding:"6px 12px" }}>
              <div style={{ width:28, height:28, borderRadius:"50%", background:"rgba(201,168,76,.15)", border:`1.5px solid ${T.gold}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:T.gold }}>
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <span style={{ fontSize:13, fontWeight:500, color:"rgba(255,255,255,.7)" }}>{user.name}</span>
            </div>
          )}

          <button onClick={handleLogout}
            style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 14px", background:"rgba(192,57,43,.15)", border:"1px solid rgba(192,57,43,.3)", borderRadius:8, fontSize:12, fontWeight:600, color:"#F87171", cursor:"pointer", fontFamily:"inherit" }}>
            <LogOut size={13}/> Logout
          </button>
        </div>
      </header>

      <div style={{ display:"flex", flex:1, overflow:"hidden" }}>

        {/* ── SIDEBAR ── */}
        <>
          {sidebarOpen && (
            <div onClick={() => setSidebarOpen(false)}
              style={{ position:"fixed", inset:0, background:"rgba(11,31,58,.5)", zIndex:49 }}/>
          )}
          <aside style={{
            width:240, flexShrink:0,
            background:sidebar, borderRight:`1px solid ${sidebarBord}`,
            display:"flex", flexDirection:"column",
            position:"fixed", top:64, bottom:0, left:0, zIndex:50,
            transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
            transition:"transform .3s", overflowY:"auto",
          }}
          className="sidebar-desktop">
            <style>{`
              @media(min-width:768px){ .sidebar-desktop { transform: translateX(0) !important; position: sticky !important; top: 64px !important; height: calc(100vh - 64px) !important; } .mobile-only { display: none !important; } }
            `}</style>

            <nav style={{ padding:"16px 12px", flex:1 }}>
              {NAV_ITEMS.map(({ key, label, Icon }) => {
                const active = activeSection === key;
                return (
                  <button key={key}
                    onClick={() => { setActiveSection(key); setSidebarOpen(false); }}
                    style={{
                      display:"flex", alignItems:"center", gap:10, width:"100%",
                      padding:"10px 14px", borderRadius:9, marginBottom:4,
                      background: active ? T.navy : "transparent",
                      color: active ? "white" : (dark ? "rgba(255,255,255,.55)" : T.muted),
                      border:"none", cursor:"pointer", fontFamily:"inherit",
                      fontSize:13, fontWeight: active ? 600 : 400,
                      transition:"all .15s", textAlign:"left",
                    }}
                    onMouseEnter={e => { if(!active) e.currentTarget.style.background = dark ? "rgba(255,255,255,.04)" : T.cream; }}
                    onMouseLeave={e => { if(!active) e.currentTarget.style.background = "transparent"; }}>
                    <Icon size={15} color={active ? T.gold : "currentColor"} strokeWidth={active ? 2 : 1.5}/>
                    {label}
                    {key === "notifications" && unreadCount > 0 && (
                      <span style={{ marginLeft:"auto", background:T.gold, color:T.navy, fontSize:10, fontWeight:700, borderRadius:20, padding:"1px 7px" }}>{unreadCount}</span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Sidebar balance mini */}
            <div style={{ margin:"12px", padding:"16px", background: dark ? T.darkCard : T.navy, borderRadius:12, border:`1px solid ${dark ? T.darkBord : "rgba(255,255,255,.06)"}` }}>
              <div style={{ fontSize:10, textTransform:"uppercase", letterSpacing:1.5, color:T.gold, marginBottom:6, fontWeight:600 }}>Balance</div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:700, color:"white" }}>KES {fmt(balance)}</div>
            </div>
          </aside>
        </>

        {/* ── MAIN CONTENT ── */}
        <main style={{
          flex:1, padding:"32px 28px", overflowY:"auto",
          marginLeft:0,
        }}>
          <style>{`
            @media(min-width:768px){ main { margin-left: 240px; } }
          `}</style>

          <div className="section-anim" key={activeSection}>
            {activeSection === "overview" && (
              <Overview balance={balance} transactions={transactions} darkMode={darkMode} userName={user?.name} />
            )}

            {activeSection === "deposit" && (
              <div>
                <Deposit user={user} addNotification={addNotification} fetchAccount={fetchAccount} darkMode={darkMode} />
                <div style={{ marginTop:20 }}>
                  <Overview balance={balance} transactions={transactions} darkMode={darkMode} />
                </div>
              </div>
            )}

            {activeSection === "withdraw" && (
              <div>
                <Withdraw user={user} addNotification={addNotification} fetchAccount={fetchAccount} darkMode={darkMode} />
                <div style={{ marginTop:20 }}>
                  <Overview balance={balance} transactions={transactions} darkMode={darkMode} />
                </div>
              </div>
            )}

            {activeSection === "transfer" && (
              <div>
                <TransferFunds amount={amount} setAmount={setAmount} recipient={recipient} setRecipient={setRecipient} transfer={transfer} darkMode={darkMode} />
                <div style={{ marginTop:20 }}>
                  <Overview balance={balance} transactions={transactions} darkMode={darkMode} />
                </div>
              </div>
            )}

            {activeSection === "profile" && (
              <div>
                <SectionTitle dark={dark} sub="Keep your personal information up to date.">Update Profile</SectionTitle>
                <Card dark={dark}>
                  <UpdateProfile currentUser={currentUser} />
                </Card>
              </div>
            )}

            {activeSection === "settings" && (
              <Settings darkMode={darkMode} toggleDarkMode={toggleDarkMode} dark={dark} />
            )}

            {activeSection === "notifications" && (
              <Notifications notifications={notifications} darkMode={darkMode} />
            )}

            {activeSection === "cards" && (
              <Cards darkMode={darkMode} />
            )}

            {activeSection === "limits" && (
              <Loans user={user} fetchNotificationsService={fetchNotificationsService} addNotification={addNotification} darkMode={darkMode} loans={loans} />
            )}

            {activeSection === "statements" && (
              <div>
                <SectionTitle dark={dark} sub="View and export your full transaction history.">Statements</SectionTitle>
                <Statements transactions={transactions} darkMode={darkMode} />
              </div>
            )}
          </div>
        </main>
      </div>

      <ToastContainer
        position="top-right" autoClose={3000}
        theme={darkMode ? "dark" : "light"}
        hideProgressBar={false} newestOnTop closeOnClick
        pauseOnFocusLoss draggable pauseOnHover
      />
    </div>
  );
}
