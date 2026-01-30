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


export default function Home({ currentUser }) {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-white">

      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-gray-950/80 backdrop-blur border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-900 dark:text-white">
            Capital Bank
          </h1>

          <nav className="flex gap-6 text-sm font-medium items-center">
            {!currentUser && (
              <>
                <Link to="/register" className="hover:text-blue-700">Open Account</Link>
                <Link to="/login" className="hover:text-blue-700">Login</Link>
              </>
            )}

            {currentUser && (
              <Link to="/dashboard" className="hover:text-blue-700">Dashboard</Link>
            )}

            <Link to="/help" className="hover:text-blue-700">Help</Link>
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
              Save smarter, transfer instantly, and access loans anytime —
              secure, simple and modern.
            </p>

            <div className="flex gap-4 mt-8 flex-wrap">
              {!currentUser && (
                <>
                  <Link
                    to="/register"
                    className="px-8 py-3 bg-yellow-500 hover:bg-yellow-600 rounded-xl font-semibold flex items-center gap-2"
                  >
                    Get Started <ArrowRight size={18} />
                  </Link>

                  <Link
                    to="/login"
                    className="px-8 py-3 bg-white/10 border border-white/30 rounded-xl"
                  >
                    Login
                  </Link>
                </>
              )}

              {currentUser && (
                <Link
                  to="/dashboard"
                  className="px-8 py-3 bg-yellow-500 rounded-xl font-semibold"
                >
                  Dashboard
                </Link>
              )}
            </div>
          </motion.div>

          {/* App preview */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20"
          >
            <p className="text-sm text-blue-200">Available Balance</p>
            <h3 className="text-4xl font-bold mt-2">$12,450.00</h3>
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

          <div className="rounded-3xl shadow-2xl bg-white dark:bg-gray-900 p-10">
            <p className="text-gray-500">Dashboard preview area (add screenshot later)</p>
          </div>
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
        Trusted by businesses & partners worldwide
        <div className="flex justify-center gap-12 mt-6 opacity-60">
          <span>Visa</span>
          <span>Mastercard</span>
          <span>Safaricom</span>
          <span>PayPal</span>
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
            className="inline-block mt-8 px-10 py-4 bg-yellow-500 rounded-xl font-semibold"
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


/* ================= REUSABLE COMPONENTS ================= */

function Feature({ icon, title, text }) {
  return (
    <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-md hover:shadow-xl transition text-center">
      <div className="w-12 h-12 mx-auto flex items-center justify-center rounded-xl bg-blue-100 text-blue-700 mb-4">
        {icon}
      </div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-500">{text}</p>
    </div>
  );
}

function Stat({ number, label }) {
  return (
    <div>
      <p className="text-3xl font-bold text-blue-900 dark:text-white">{number}</p>
      <p className="text-gray-500 text-sm">{label}</p>
    </div>
  );
}

function Testimonial({ name, text }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow">
      <Star className="text-yellow-400 mb-3" />
      <p className="text-sm text-gray-600 dark:text-gray-300">"{text}"</p>
      <p className="mt-3 font-semibold">{name}</p>
    </div>
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
        <ChevronDown
          className={`transition ${open ? "rotate-180" : ""}`}
          size={18}
        />
      </button>

      {open && (
        <p className="mt-3 text-sm text-gray-500">{answer}</p>
      )}
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
