// client/src/App.js
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";

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
import { motion } from "framer-motion";
import {
  ShieldCheck,
  CreditCard,
  Landmark,
  Smartphone,
  Star,
  ChevronDown,
  ArrowRight,
} from "lucide-react";

function Home({ currentUser }) {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-white">

      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl shadow-sm dark:bg-gray-950/80 border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-900 dark:text-white">
            Capital Bank
          </h1>

          <nav className="flex gap-6 text-sm font-medium items-center">
            {!currentUser && (
              <>
                <Link to="/register" className="hover:text-blue-700 transition-all duration-300">Open Account</Link>
                <Link to="/login" className="hover:text-blue-700 transition-all duration-300">Login</Link>
              </>
            )}

            {currentUser && (
              <NavbarDropdown currentUser={currentUser} />
            )}

            <Link to="/help" className="hover:text-blue-700 transition-all duration-300">Help</Link>
          </nav>
        </div>
      </header>

      {/* ================= HERO ================= */}
      <section className="bg-gradient-to-br from-blue-900 via-indigo-800 to-blue-950 text-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 px-6 py-24 items-center">

          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              Banking that works <br /> as fast as you do
            </h2>

            <p className="mt-6 text-blue-200 text-lg">
              Save smarter, transfer instantly, and access loans anytime.
              Secure, Simple and Modern.
            </p>

            <div className="flex gap-4 mt-8 flex-wrap">
              {!currentUser && (
                <>
                  <Link
                    to="/register"
                    className="px-8 py-3 bg-yellow-500 hover:bg-yellow-600 rounded-xl font-semibold flex items-center gap-2 transition-all duration-300 hover:scale-105"
                  >
                    Get Started <ArrowRight size={18} />
                  </Link>

                  <Link
                    to="/login"
                    className="px-8 py-3 bg-white/10 border border-white/30 rounded-xl transition-all duration-300 hover:scale-105"
                  >
                    Login
                  </Link>
                </>
              )}

              {currentUser && (
                <Link
                  to="/dashboard"
                  className="px-8 py-3 bg-yellow-500 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                >
                  Dashboard
                </Link>
              )}
            </div>
          </motion.div>


    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.03, y: -2 }}
      transition={{ type: "spring", stiffness: 120 }}
      className="bg-gradient-to-br from-blue-900/20 via-blue-800/20 to-blue-950/20 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-blue-200/30 transition-all duration-300"
    >
      <p className="text-sm text-blue-200">Available Balance</p>
      <h3 className="text-4xl font-bold mt-2 text-white">Ksh. 12,450.00</h3>
      <div className="mt-6 space-y-2 text-sm text-blue-200">
        <p>✔ Send Money</p>
        <p>✔ Pay Bills</p>
        <p>✔ Apply Loans</p>
      </div>
    </motion.div>
  
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-4 gap-8">
        <Feature icon={<CreditCard />} title="Digital Banking" text="24/7 online access to your money" />
        <Feature icon={<Landmark />} title="Instant Loans" text="Fast approvals within minutes" />
        <Feature icon={<ShieldCheck />} title="Secure" text="Bank-grade encryption" />
        <Feature icon={<Smartphone />} title="Mobile App" text="Bank on the go anytime" />
      </section>

      {/* ================= TRUST STATS ================= */}
      <section className="bg-white dark:bg-gray-900 border-y">
        <div className="max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-3 text-center gap-10">
          <Stat number="50K+" label="Customers" />
          <Stat number="KES 1B+" label="Transactions" />
          <Stat number="99.99%" label="System Uptime" />
        </div>
      </section>

      {/* ================= DASHBOARD PREVIEW ================= */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto text-center px-6">
          <h3 className="text-3xl font-bold mb-10">Simple. Clean. Powerful.</h3>

          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            className="rounded-3xl shadow-2xl bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-950 p-10 transition-all duration-300"
          >
            <p className="text-gray-500">Dashboard preview area</p>
          </motion.div>
        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section className="bg-gray-100 dark:bg-gray-900 py-20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 px-6">
          <Testimonial name="James M." text="Fastest banking app I’ve ever used." />
          <Testimonial name="Sarah K." text="Loans approved in minutes. Amazing!" />
          <Testimonial name="David O." text="Safe and reliable for my business." />
        </div>
      </section>

     {/* ================= PARTNERS ================= */}
<section className="py-14 text-center text-gray-400 text-sm">
  <h4 className="text-lg font-semibold mb-6 text-gray-700 dark:text-gray-300">
    Trusted by businesses & partners worldwide
  </h4>

  <div className="flex justify-center gap-12 mt-6">
    {/* Visa */}
    <motion.div
      whileHover={{ scale: 1.1 }}
      className="flex flex-col items-center transition-all duration-300"
    >
      <span className="mb-2 text-gray-600 dark:text-gray-400 font-medium">Visa</span>
      <img src="/images/visa.webp" alt="Visa" className="h-10 object-contain" />
    </motion.div>

    {/* Mastercard */}
    <motion.div
      whileHover={{ scale: 1.1 }}
      className="flex flex-col items-center transition-all duration-300"
    >
      <span className="mb-2 text-gray-600 dark:text-gray-400 font-medium">Mastercard</span>
      <img src="/images/mastercard.png" alt="Mastercard" className="h-10 object-contain" />
    </motion.div>

    {/* Safaricom */}
    <motion.div
      whileHover={{ scale: 1.1 }}
      className="flex flex-col items-center transition-all duration-300"
    >
      <span className="mb-2 text-gray-600 dark:text-gray-400 font-medium">Safaricom</span>
      <img src="/images/safaricom.png" alt="Safaricom" className="h-10 object-contain" />
    </motion.div>

    {/* PayPal */}
    <motion.div
      whileHover={{ scale: 1.1 }}
      className="flex flex-col items-center transition-all duration-300"
    >
      <span className="mb-2 text-gray-600 dark:text-gray-400 font-medium">PayPal</span>
      <img src="/images/paypal.webp" alt="PayPal" className="h-10 object-contain" />
    </motion.div>
  </div>
</section>


      {/* ================= FAQ ================= */}
      <section className="max-w-3xl mx-auto py-20 px-6">
        <h3 className="text-3xl font-bold text-center mb-10">FAQs</h3>
        <FAQ question="Is my money secure?" answer="Yes, we use bank-grade encryption and monitoring." />
        <FAQ question="How fast are transfers?" answer="Most transfers are instant." />
        <FAQ question="How do I apply for a loan?" answer="Login → Loans → Apply." />
      </section>

      {/* ================= CTA ================= */}
      {!currentUser && (
        <section className="bg-blue-900 text-white text-center py-20">
          <h3 className="text-3xl font-bold">Open your free account today</h3>
          <Link
            to="/register"
            className="inline-block mt-8 px-10 py-4 bg-gradient-to-r from-yellow-400 to-amber-500 hover:scale-105 shadow-lg rounded-xl font-semibold transition-all duration-300"
          >
            Create Account
          </Link>
        </section>
      )}

      {/* ================= FOOTER ================= */}
      <footer className="bg-gray-100 dark:bg-gray-950 text-gray-500 text-sm py-6 text-center">
        © {new Date().getFullYear()} Capital Bank • Licensed by Central Bank of Kenya
      </footer>
    </div>
  );
}

/* ================= NAVBAR DROPDOWN ================= */
function NavbarDropdown({ currentUser }) {
  return (
    <div className="relative group">
      <button className="flex items-center gap-2 hover:text-blue-700 font-medium transition-all duration-300">
        {currentUser.name}
        <ChevronDown size={16} className="transition group-hover:rotate-180" />
      </button>
      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-blue-950 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto">
        <Link to="/dashboard" className="block px-4 py-2 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-xl">Dashboard</Link>
        <Link to="/profile" className="block px-4 py-2 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-xl">Profile</Link>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.reload();
          }}
          className="w-full text-left px-4 py-2 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-xl"
        >
          Logout
        </button>
      </div>
    </div>
  );
}


/* ================= REUSABLE COMPONENTS ================= */

function Feature({ icon, title, text }) {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.03 }}
      className="group bg-white/90 dark:bg-blue-950/80 backdrop-blur-xl p-8 rounded-3xl border border-blue-200/30 shadow-lg hover:shadow-2xl transition-all duration-300 text-center"
    >
      <div className="w-14 h-14 mx-auto flex items-center justify-center rounded-2xl bg-gradient-to-br from-blue-900 to-blue-700 text-white shadow-md group-hover:scale-110 transition mb-5">
        {icon}
      </div>
      <h3 className="font-semibold text-lg mb-2 text-blue-900 dark:text-white">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-300">{text}</p>
    </motion.div>
  );
}

function Stat({ number, label }) {
  return (
    <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-white dark:from-blue-900 dark:to-blue-950 shadow-md transition-all duration-300">
      <p className="text-4xl font-extrabold text-blue-900 dark:text-white">{number}</p>
      <p className="text-gray-500 text-sm mt-2 tracking-wide uppercase">{label}</p>
    </div>
  );
}

function Testimonial({ name, text }) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      className="bg-white/90 dark:bg-blue-950/80 backdrop-blur-xl p-7 rounded-3xl shadow-lg border border-blue-200/30 hover:shadow-2xl transition-all duration-300"
    >
      <Star className="text-yellow-400 mb-3" />
      <p className="text-sm text-gray-600 dark:text-gray-300 italic">"{text}"</p>
      <p className="mt-4 font-semibold text-blue-900 dark:text-white">— {name}</p>
    </motion.div>
  );
}

function FAQ({ question, answer }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b py-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex justify-between w-full font-medium"
      >
        {question}
        <ChevronDown className={`transition ${open ? "rotate-180" : ""}`} size={18} />
      </button>
      {open && <p className="mt-3 text-sm text-gray-500">{answer}</p>}
    </div>
  );
}

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    api
      .get("/auth/user", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setCurrentUser(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user));
      })
      .catch((err) => {
        console.error("Error fetching user:", err);
        setCurrentUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      });
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home currentUser={currentUser} />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/login" element={<Login onLogin={setCurrentUser} />} />
        <Route path="/register" element={<Register onRegister={setCurrentUser} />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/help" element={<Help />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/verify-phone" element={<VerifyPhone />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        {/* Protected Dashboard */}
        <Route
          path="/dashboard/*"
          element={
            <PrivateRoute currentUser={currentUser}>
              <Dashboard currentUser={currentUser} />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
