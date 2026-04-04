// client/src/App.js
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard, Building2, ShieldCheck, Send,
  ChevronDown, ChevronRight, Star, Menu, X,
  ArrowUpRight, ArrowDownLeft, Receipt, FileText,
} from "lucide-react";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import Terms from "./pages/Terms";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Help from "./pages/Help";
import ContactUs from "./pages/ContactUs";
import VerifyPhone from "./pages/VerifyPhone";
import VerifyEmail from "./pages/VerifyEmail";
import api from "./utils/api";

/* ── Design tokens ─────────────────────────────────────────── */
const T = {
  navy:      "#0B1F3A",
  navyMid:   "#122848",
  navyLight: "#1A3A5C",
  gold:      "#C9A84C",
  goldLight: "#E4C170",
  goldPale:  "#F9F2E1",
  cream:     "#FAFAF7",
  border:    "#E8EDF2",
  borderMid: "#D0D9E2",
  muted:     "#6B7A8D",
  hint:      "#A9B5C2",
};

/* ════════════════════════════════════════════════════════════
   HOME PAGE
════════════════════════════════════════════════════════════ */
function Home({ currentUser }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div style={{ fontFamily: "'DM Sans', -apple-system, sans-serif", background: T.cream, color: T.navy }}>

      {/* ── GOOGLE FONTS ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');
        @keyframes fadeUp { from { opacity:0; transform:translateY(22px) } to { opacity:1; transform:translateY(0) } }
        .fade-up { animation: fadeUp 0.65s ease both; }
        .d1 { animation-delay:.1s } .d2 { animation-delay:.2s }
        .d3 { animation-delay:.3s } .d4 { animation-delay:.45s }
        * { box-sizing: border-box; }
        a { text-decoration: none; }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav style={{
        position:"sticky", top:0, zIndex:100,
        background:"rgba(250,250,247,0.95)", backdropFilter:"blur(14px)",
        borderBottom:`1px solid ${T.border}`, padding:"0 5vw",
      }}>
        <div style={{ maxWidth:1200, margin:"0 auto", height:68, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <LogoMark />

          {/* Desktop nav */}
          <div style={{ display:"flex", alignItems:"center", gap:32 }} className="hidden-mobile">
            {["Personal","Business","Loans","Help"].map(l => (
              <Link key={l} to={l==="Help"?"/help":"#"} style={{ fontSize:14, fontWeight:500, color:T.muted, letterSpacing:".3px" }}
                onMouseEnter={e=>e.target.style.color=T.navy}
                onMouseLeave={e=>e.target.style.color=T.muted}
              >{l}</Link>
            ))}
            {currentUser ? (
              <NavDropdown user={currentUser} />
            ) : (
              <>
                <NavBtn to="/login" ghost>Log In</NavBtn>
                <NavBtn to="/register">Open Account</NavBtn>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setMobileOpen(o => !o)}
            style={{ display:"none", background:"none", border:"none", cursor:"pointer", color:T.navy }}
            className="show-mobile">
            {mobileOpen ? <X size={22}/> : <Menu size={22}/>}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}}
              style={{ padding:"16px 5vw 24px", borderTop:`1px solid ${T.border}`, background:T.cream }}>
              {["Personal","Business","Loans"].map(l=>(
                <div key={l} style={{ padding:"10px 0", fontSize:15, fontWeight:500, color:T.muted, borderBottom:`1px solid ${T.border}` }}>{l}</div>
              ))}
              <Link to="/help" style={{ display:"block", padding:"10px 0", fontSize:15, fontWeight:500, color:T.muted, borderBottom:`1px solid ${T.border}` }}>Help</Link>
              <div style={{ display:"flex", gap:12, marginTop:20 }}>
                <Link to="/login" style={{ flex:1, textAlign:"center", padding:"10px", border:`1.5px solid ${T.navy}`, borderRadius:6, fontSize:13, fontWeight:600, color:T.navy }}>Log In</Link>
                <Link to="/register" style={{ flex:1, textAlign:"center", padding:"10px", background:T.navy, borderRadius:6, fontSize:13, fontWeight:600, color:"white" }}>Open Account</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ── HERO ── */}
      <section style={{ background:T.navy, color:"white", padding:"90px 5vw 0", position:"relative", overflow:"hidden" }}>
        {/* Decorative rings */}
        <div style={{ position:"absolute", top:-80, right:-80, width:480, height:480, borderRadius:"50%", border:`1px solid rgba(201,168,76,.14)`, pointerEvents:"none" }}/>
        <div style={{ position:"absolute", top:-20, right:-20, width:300, height:300, borderRadius:"50%", border:`1px solid rgba(201,168,76,.07)`, pointerEvents:"none" }}/>

        <div style={{ maxWidth:1200, margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 420px", gap:60, alignItems:"end" }}>

          {/* Left copy */}
          <div>
            <div className="fade-up d1" style={{ display:"inline-flex", alignItems:"center", gap:8, fontSize:11, fontWeight:600, letterSpacing:2, textTransform:"uppercase", color:T.gold, marginBottom:24 }}>
              <span style={{ display:"block", width:28, height:1, background:T.gold }}/>
              Licensed &amp; Regulated · CBK
            </div>

            <h1 className="fade-up d2" style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"clamp(38px,5vw,62px)", fontWeight:700, lineHeight:1.1, letterSpacing:"-.5px", marginBottom:24 }}>
              Banking built for<br/><em style={{ color:T.goldLight }}>Kenya's future.</em>
            </h1>

            <p className="fade-up d3" style={{ fontSize:16, fontWeight:300, color:"rgba(255,255,255,.65)", maxWidth:420, lineHeight:1.75, marginBottom:40 }}>
              Seamless transfers, instant access to credit, and total financial control — all from one trusted platform.
            </p>

            <div className="fade-up d4" style={{ display:"flex", gap:14, flexWrap:"wrap", marginBottom:48 }}>
              {currentUser ? (
                <HeroBtn to="/dashboard" gold>Go to Dashboard</HeroBtn>
              ) : (
                <>
                  <HeroBtn to="/register" gold>Open Free Account</HeroBtn>
                  <HeroBtn to="/help" ghost>See How It Works</HeroBtn>
                </>
              )}
            </div>

            <div className="fade-up d4" style={{ display:"flex", alignItems:"center", gap:24, paddingTop:28, borderTop:"1px solid rgba(255,255,255,.08)" }}>
              {[["52,000+","Customers"],["KES 1.2B+","Transacted"],["99.97%","Uptime"]].map(([n,l],i) => (
                <React.Fragment key={l}>
                  {i>0 && <div style={{ width:1, height:36, background:"rgba(255,255,255,.1)" }}/>}
                  <div>
                    <div style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:700, color:"white" }}>{n}</div>
                    <div style={{ fontSize:11, letterSpacing:.8, textTransform:"uppercase", color:"rgba(255,255,255,.4)", marginTop:3 }}>{l}</div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Right: Hero card */}
          <motion.div initial={{opacity:0,x:30}} animate={{opacity:1,x:0}} transition={{delay:.3}}
            style={{ background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.1)", borderRadius:16, padding:28, alignSelf:"end" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:32 }}>
              <div style={{ width:40, height:28, background:`linear-gradient(135deg,${T.gold},${T.goldLight})`, borderRadius:4 }}/>
              <span style={{ fontSize:18, fontWeight:700, color:"rgba(255,255,255,.5)", letterSpacing:1 }}>VISA</span>
            </div>
            <div style={{ fontSize:15, letterSpacing:3, color:"rgba(255,255,255,.55)", marginBottom:8, fontWeight:300 }}>•••• •••• •••• 4821</div>
            <div style={{ fontSize:11, textTransform:"uppercase", letterSpacing:1.5, color:"rgba(255,255,255,.35)", marginBottom:4 }}>Available Balance</div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:30, fontWeight:700, color:"white" }}>
              <span style={{ fontSize:14, fontWeight:400, opacity:.6 }}>KES </span>48,250.00
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", marginTop:20, paddingTop:16, borderTop:"1px solid rgba(255,255,255,.08)", fontSize:12, color:"rgba(255,255,255,.45)", textTransform:"uppercase", letterSpacing:.8 }}>
              <span>J. Mwangi</span><span>09 / 28</span>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginTop:14 }}>
              {[["↑","Send",ArrowUpRight],["↓","Receive",ArrowDownLeft],["⬡","Pay Bills",Receipt],["≡","Statement",FileText]].map(([,label,Icon])=>(
                <div key={label} style={{ background:"rgba(255,255,255,.05)", border:"1px solid rgba(255,255,255,.08)", borderRadius:8, padding:"12px 10px", textAlign:"center", cursor:"pointer" }}
                  onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,.1)"}
                  onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,.05)"}>
                  <Icon size={14} color={T.gold} style={{ margin:"0 auto 4px" }}/>
                  <div style={{ fontSize:11, color:"rgba(255,255,255,.45)", letterSpacing:.3 }}>{label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <Section>
        <SectionLabel>What We Offer</SectionLabel>
        <SectionTitle>Everything you need,<br/><em>nothing you don't.</em></SectionTitle>
        <SectionSub>Designed for individuals, families, and businesses across Kenya.</SectionSub>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:16, marginTop:48 }}>
          {[
            { Icon:CreditCard, title:"Personal Accounts",  desc:"Savings and current accounts with zero hidden fees and real-time notifications." },
            { Icon:Building2,  title:"Business Banking",   desc:"Multi-user accounts, payroll solutions, and trade finance for growing businesses." },
            { Icon:Send,       title:"Loans & Credit",     desc:"Personal, home, and SME loans with competitive rates and fast digital approval." },
            { Icon:ShieldCheck,title:"Secure Transfers",   desc:"Send money locally and internationally via RTGS, EFT, SWIFT, and M-Pesa." },
          ].map(({ Icon, title, desc }) => (
            <ServiceCard key={title} Icon={Icon} title={title} desc={desc} />
          ))}
        </div>
      </Section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ background:T.navy, padding:"80px 5vw" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <SectionLabel dark>Getting Started</SectionLabel>
          <SectionTitle dark>Up and running<br/><em>in minutes.</em></SectionTitle>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))", gap:1, background:"rgba(255,255,255,.08)", borderRadius:12, overflow:"hidden", marginTop:52 }}>
            {[
              ["01","Create Your Account","Register with your national ID and a valid phone number. No branch visit required."],
              ["02","Verify Your Identity","Quick KYC process — upload a selfie and ID. Verified within 24 hours."],
              ["03","Start Banking","Deposit funds, send money, apply for a loan, and manage everything online."],
            ].map(([n,t,d]) => (
              <div key={n} style={{ background:T.navy, padding:"40px 32px" }}>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:52, fontWeight:700, color:"rgba(201,168,76,.14)", lineHeight:1, marginBottom:20 }}>{n}</div>
                <div style={{ fontSize:16, fontWeight:600, color:"white", marginBottom:10 }}>{t}</div>
                <div style={{ fontSize:13, color:"rgba(255,255,255,.45)", lineHeight:1.75, fontWeight:300 }}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <Section>
        <SectionLabel>Client Stories</SectionLabel>
        <SectionTitle>Trusted by thousands<br/><em>across Kenya.</em></SectionTitle>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:20, marginTop:48 }}>
          {[
            { init:"JM", name:"James Mwangi",   role:"Business owner, Nairobi", text:"Getting my SME loan approved took less than 48 hours. Transparent rates, entirely paperless." },
            { init:"SK", name:"Sarah Kamau",     role:"Teacher, Kisumu",         text:"International transfers to my family in the diaspora are instant now. Capital Bank is a game changer." },
            { init:"DO", name:"David Otieno",    role:"Tech founder, Mombasa",   text:"The business account dashboard is exactly what I needed to track cash flow. Highly recommend." },
          ].map(t => <TestimonialCard key={t.name} {...t} />)}
        </div>
      </Section>

      {/* ── FAQ ── */}
      <section style={{ background:T.goldPale, padding:"80px 5vw" }}>
        <div style={{ maxWidth:1200, margin:"0 auto", textAlign:"center" }}>
          <SectionLabel>Common Questions</SectionLabel>
          <SectionTitle>Frequently asked.</SectionTitle>
        </div>
        <div style={{ maxWidth:720, margin:"48px auto 0" }}>
          {[
            ["Is Capital Bank licensed by the Central Bank of Kenya?","Yes. Capital Bank is fully licensed and regulated by the Central Bank of Kenya (CBK) under the Banking Act. Your deposits are protected."],
            ["How secure are my funds and personal data?","We use 256-bit AES encryption, two-factor authentication, and real-time fraud monitoring to keep your money and data safe at all times."],
            ["Can I link my M-Pesa to my Capital Bank account?","Absolutely. You can link M-Pesa and transfer funds between your mobile wallet and bank account instantly and for free."],
            ["How do I apply for a loan?","Log in to your dashboard, navigate to Loans, choose your product, and fill in a short application. Most decisions are made within 24–48 hours."],
          ].map(([q,a]) => <FAQItem key={q} question={q} answer={a} />)}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      {!currentUser && (
        <section style={{ background:T.navy, padding:"80px 5vw" }}>
          <div style={{ maxWidth:1200, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between", gap:40, flexWrap:"wrap" }}>
            <div>
              <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(26px,3vw,40px)", fontWeight:700, color:"white", lineHeight:1.2, marginBottom:12 }}>
                Start your journey<br/>with <em style={{ color:T.goldLight }}>Capital Bank.</em>
              </h2>
              <p style={{ fontSize:14, color:"rgba(255,255,255,.5)", fontWeight:300 }}>Open a free account in under 5 minutes. No minimum balance.</p>
            </div>
            <div style={{ display:"flex", gap:14, flexWrap:"wrap" }}>
              <HeroBtn to="/register" gold>Open Account Free</HeroBtn>
              <HeroBtn to="/contact" ghost>Talk to an Advisor</HeroBtn>
            </div>
          </div>
        </section>
      )}

      {/* ── FOOTER ── */}
      <footer style={{ background:"#07152A", padding:"52px 5vw 28px", color:"rgba(255,255,255,.4)" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <div style={{ display:"grid", gridTemplateColumns:"1.5fr 1fr 1fr 1fr", gap:40, paddingBottom:40, borderBottom:"1px solid rgba(255,255,255,.06)" }}>
            <div>
              <LogoMark dark />
              <p style={{ fontSize:13, color:"rgba(255,255,255,.3)", lineHeight:1.7, marginTop:16, fontWeight:300, maxWidth:240 }}>
                Secure, modern banking for every Kenyan — from Nairobi to the Rift Valley.
              </p>
            </div>
            {[
              ["Personal", ["Current Account","Savings Account","Fixed Deposit","Cards"]],
              ["Business", ["SME Banking","Trade Finance","Payroll","Corporate Loans"]],
              ["Company",  ["About Us","Careers","Privacy Policy","Contact"]],
            ].map(([heading, links]) => (
              <div key={heading}>
                <div style={{ fontSize:11, fontWeight:600, letterSpacing:1.5, textTransform:"uppercase", color:"rgba(255,255,255,.45)", marginBottom:16 }}>{heading}</div>
                {links.map(l => (
                  <Link key={l} to="/" style={{ display:"block", fontSize:13, color:"rgba(255,255,255,.3)", marginBottom:8, fontWeight:300 }}
                    onMouseEnter={e=>e.target.style.color=T.gold}
                    onMouseLeave={e=>e.target.style.color="rgba(255,255,255,.3)"}>
                    {l}
                  </Link>
                ))}
              </div>
            ))}
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", paddingTop:24, gap:20, flexWrap:"wrap" }}>
            <p style={{ fontSize:12 }}>© {new Date().getFullYear()} Capital Bank Kenya Ltd. All rights reserved.</p>
            <span style={{ display:"inline-flex", alignItems:"center", gap:6, fontSize:11, padding:"5px 14px", border:`1px solid rgba(201,168,76,.3)`, borderRadius:20, color:T.gold }}>
              CBK Licensed · Member of KBA
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   REUSABLE COMPONENTS
════════════════════════════════════════════════════════════ */

function LogoMark({ dark }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
      <div style={{ width:36, height:36, background: dark ? "rgba(255,255,255,.1)" : T.navy, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", position:"relative" }}>
        <div style={{ width:14, height:14, border:`2px solid ${T.gold}`, borderRadius:3, transform:"rotate(45deg)" }}/>
      </div>
      <span style={{ fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:700, color: dark ? "white" : T.navy, letterSpacing:.5 }}>
        Capital <span style={{ color:T.gold }}>Bank</span>
      </span>
    </div>
  );
}

function NavBtn({ to, children, ghost }) {
  const base = { padding:"9px 22px", borderRadius:6, fontSize:13, fontWeight:600, cursor:"pointer", letterSpacing:.5, textDecoration:"none", display:"inline-block", transition:"all .2s" };
  return ghost
    ? <Link to={to} style={{ ...base, background:"transparent", border:`1.5px solid ${T.navy}`, color:T.navy }}>{children}</Link>
    : <Link to={to} style={{ ...base, background:T.navy, border:`1.5px solid ${T.navy}`, color:"white" }}>{children}</Link>;
}

function HeroBtn({ to, children, gold, ghost }) {
  const base = { padding:"14px 32px", borderRadius:6, fontSize:14, fontWeight:700, cursor:"pointer", letterSpacing:.5, textDecoration:"none", display:"inline-block", transition:"all .25s" };
  if (gold) return <Link to={to} style={{ ...base, background:T.gold, color:T.navy, border:`1.5px solid ${T.gold}` }}>{children}</Link>;
  return <Link to={to} style={{ ...base, background:"transparent", color:"white", border:"1.5px solid rgba(255,255,255,.3)" }}>{children}</Link>;
}

function Section({ children, cream }) {
  return (
    <section style={{ padding:"80px 5vw", background: cream ? T.cream : "white" }}>
      <div style={{ maxWidth:1200, margin:"0 auto" }}>{children}</div>
    </section>
  );
}

function SectionLabel({ children, dark }) {
  return (
    <div style={{ display:"inline-flex", alignItems:"center", gap:8, fontSize:11, fontWeight:600, letterSpacing:2, textTransform:"uppercase", color:T.gold, marginBottom:12 }}>
      <span style={{ display:"block", width:20, height:1, background:T.gold }}/>
      {children}
    </div>
  );
}

function SectionTitle({ children, dark }) {
  return (
    <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(26px,3.5vw,42px)", fontWeight:700, lineHeight:1.2, color: dark ? "white" : T.navy, marginBottom:12 }}>
      {children}
    </h2>
  );
}

function SectionSub({ children }) {
  return <p style={{ fontSize:15, color:T.muted, maxWidth:500, lineHeight:1.75, fontWeight:300 }}>{children}</p>;
}

function ServiceCard({ Icon, title, desc }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background:"white", border:`1px solid ${hov ? T.borderMid : T.border}`, borderRadius:12, padding:"28px 24px",
        cursor:"pointer", transition:"all .3s", transform: hov ? "translateY(-4px)" : "none",
        boxShadow: hov ? "0 12px 40px rgba(11,31,58,.08)" : "none", position:"relative", overflow:"hidden",
      }}>
      <div style={{ position:"absolute", bottom:0, left:0, right:0, height:2, background:T.gold, transform: hov ? "scaleX(1)" : "scaleX(0)", transition:"transform .3s", transformOrigin:"left" }}/>
      <div style={{ width:44, height:44, borderRadius:10, background:T.navy, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:20 }}>
        <Icon size={20} color={T.gold} strokeWidth={1.5} />
      </div>
      <div style={{ fontSize:15, fontWeight:600, color:T.navy, marginBottom:8 }}>{title}</div>
      <div style={{ fontSize:13, color:T.muted, lineHeight:1.65, fontWeight:300 }}>{desc}</div>
      <div style={{ display:"inline-flex", alignItems:"center", gap:6, fontSize:12, fontWeight:600, color:T.gold, marginTop:16, letterSpacing:.3 }}>
        Learn more <ChevronRight size={12} />
      </div>
    </div>
  );
}

function TestimonialCard({ init, name, role, text }) {
  return (
    <motion.div whileHover={{ y:-5 }}
      style={{ background:"white", border:`1px solid ${T.border}`, borderRadius:12, padding:28 }}>
      <div style={{ display:"flex", gap:4, marginBottom:16 }}>
        {[...Array(5)].map((_,i) => <Star key={i} size={13} fill={T.gold} color={T.gold} />)}
      </div>
      <p style={{ fontSize:14, color:T.muted, lineHeight:1.75, fontStyle:"italic", fontWeight:300, marginBottom:20 }}>"{text}"</p>
      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
        <div style={{ width:36, height:36, borderRadius:"50%", background:T.navy, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, color:T.gold }}>
          {init}
        </div>
        <div>
          <div style={{ fontSize:13, fontWeight:600, color:T.navy }}>{name}</div>
          <div style={{ fontSize:11, color:T.hint }}>{role}</div>
        </div>
      </div>
    </motion.div>
  );
}

function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom:`1px solid rgba(11,31,58,.1)`, padding:"20px 0" }}>
      <button onClick={() => setOpen(o => !o)}
        style={{ display:"flex", justifyContent:"space-between", alignItems:"center", width:"100%", background:"none", border:"none", cursor:"pointer", textAlign:"left", gap:12 }}>
        <span style={{ fontSize:15, fontWeight:500, color:T.navy }}>{question}</span>
        <span style={{
          width:24, height:24, borderRadius:"50%", border:`1.5px solid ${T.navy}`,
          display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0,
          background: open ? T.navy : "transparent", color: open ? "white" : T.navy,
          transform: open ? "rotate(45deg)" : "none", transition:"all .2s",
        }}>+</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.p initial={{opacity:0,height:0}} animate={{opacity:1,height:"auto"}} exit={{opacity:0,height:0}}
            style={{ fontSize:14, color:T.muted, lineHeight:1.75, fontWeight:300, paddingTop:12, overflow:"hidden" }}>
            {answer}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

function NavDropdown({ user }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position:"relative" }} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button style={{ display:"flex", alignItems:"center", gap:6, background:"none", border:"none", cursor:"pointer", fontSize:14, fontWeight:500, color:T.muted }}>
        {user.name} <ChevronDown size={14} style={{ transform: open ? "rotate(180deg)" : "none", transition:"transform .2s" }} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{opacity:0,y:4}} animate={{opacity:1,y:0}} exit={{opacity:0,y:4}}
            style={{ position:"absolute", right:0, top:"100%", marginTop:4, width:180, background:"white", border:`1px solid ${T.border}`, borderRadius:10, boxShadow:"0 12px 40px rgba(11,31,58,.1)", overflow:"hidden", zIndex:200 }}>
            {[["Dashboard","/dashboard"],["Profile","/profile"]].map(([l,to]) => (
              <Link key={l} to={to} style={{ display:"block", padding:"10px 16px", fontSize:14, color:T.navy, fontWeight:400 }}
                onMouseEnter={e=>e.target.style.background="#F5F7FA"}
                onMouseLeave={e=>e.target.style.background="transparent"}>
                {l}
              </Link>
            ))}
            <button onClick={() => { localStorage.removeItem("token"); localStorage.removeItem("user"); window.location.reload(); }}
              style={{ display:"block", width:"100%", textAlign:"left", padding:"10px 16px", fontSize:14, color:T.navy, background:"none", border:"none", cursor:"pointer", borderTop:`1px solid ${T.border}` }}>
              Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   APP ROOT
════════════════════════════════════════════════════════════ */
export default function App() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    api.get("/auth/user", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => { setCurrentUser(res.data.user); localStorage.setItem("user", JSON.stringify(res.data.user)); })
      .catch(() => { setCurrentUser(null); localStorage.removeItem("user"); localStorage.removeItem("token"); });
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/"           element={<Home currentUser={currentUser} />} />
        <Route path="/login"      element={<Login onLogin={setCurrentUser} />} />
        <Route path="/register"   element={<Register onRegister={setCurrentUser} />} />
        <Route path="/terms"      element={<Terms />} />
        <Route path="/privacy"    element={<PrivacyPolicy />} />
        <Route path="/help"       element={<Help />} />
        <Route path="/contact"    element={<ContactUs />} />
        <Route path="/verify-phone"  element={<VerifyPhone />} />
        <Route path="/verify-email"  element={<VerifyEmail />} />
        <Route path="/dashboard/*" element={
          <PrivateRoute currentUser={currentUser}>
            <Dashboard currentUser={currentUser} />
          </PrivateRoute>
        }/>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}