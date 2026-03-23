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
import {MobileMenu} from "./pages/MobileMenu";
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
   <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-lg shadow-lg border-b border-gray-200 dark:border-gray-700">
  <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
    
    {/* Logo */}
    <h1 className="text-2xl font-bold text-blue-900 dark:text-white tracking-wide">
      Capital Bank
    </h1>

    {/* Navigation */}
    <nav className="hidden md:flex gap-8 items-center text-sm font-medium">
      {!currentUser && (
        <>
          <Link
            to="/register"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300"
          >
            Open Account
          </Link>
          <Link
            to="/login"
            className="hover:text-blue-600 transition-all duration-300"
          >
            Login
          </Link>
        </>
      )}

      {currentUser && <NavbarDropdown currentUser={currentUser} />}

      <Link
        to="/help"
        className="hover:text-blue-600 transition-all duration-300"
      >
        Help
      </Link>
    </nav>

    {/* Mobile Hamburger */}
    <div className="md:hidden">
      <MobileMenu currentUser={currentUser} />
    </div>
  </div>
</header>


      {/* ================= HERO ================= */}
      <section className="relative bg-gradient-to-br from-blue-900 via-indigo-800 to-blue-950 text-white overflow-hidden">
        {/* subtle floating circles for luxury effect */}
        <div className="absolute -top-20 -left-32 w-96 h-96 bg-blue-700/20 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-32 -right-20 w-96 h-96 bg-indigo-700/20 rounded-full filter blur-3xl animate-pulse"></div>

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 px-6 py-28 items-center relative z-10">

          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              Premium Banking Experience <br /> Tailored for You
            </h2>

            <p className="mt-6 text-blue-200 text-lg">
              Capital Bank empowers you with instant transfers, smart saving insights, premium loan options, and 24/7 mobile access. Banking redefined for the discerning user.
            </p>

            <ul className="mt-6 text-blue-200 space-y-2 text-sm">
              <li>✔ Personalized account management</li>
              <li>✔ Instant payments and transfers</li>
              <li>✔ Exclusive premium features and rewards</li>
            </ul>

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
            <p className="mt-3 text-blue-200 text-sm">Your premium account gives you exclusive benefits and faster transfers.</p>
            <div className="mt-6 space-y-2 text-sm text-blue-200">
              <p>✔ Send Money Instantly</p>
              <p>✔ Pay Bills Securely</p>
              <p>✔ Apply for Premium Loans</p>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-4 gap-8">
        <Feature icon={<CreditCard />} title="Digital Banking" text="Access your accounts 24/7 with intelligent dashboards and analytics." />
        <Feature icon={<Landmark />} title="Instant Loans" text="Get instant approvals on personal and business loans with competitive rates." />
        <Feature icon={<ShieldCheck />} title="Secure & Trusted" text="Bank-grade encryption, fraud monitoring, and privacy-first design." />
        <Feature icon={<Smartphone />} title="Mobile App" text="Bank on the go with our premium mobile app, with instant notifications." />
      </section>

      {/* ================= TRUST STATS ================= */}
      <section className="bg-white dark:bg-gray-900 border-y">
        <div className="max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-3 text-center gap-10">
          <Stat number="50K+" label="Active Premium Users" />
          <Stat number="KES 1B+" label="Transactions Processed" />
          <Stat number="99.99%" label="System Uptime" />
        </div>
      </section>

      {/* ================= DASHBOARD PREVIEW ================= */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto text-center px-6">
          <h3 className="text-3xl font-bold mb-10">Simple. Clean. Luxurious.</h3>

          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            className="rounded-3xl shadow-2xl bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-950 p-10 transition-all duration-300"
          >
            <p className="text-gray-500">Premium dashboard with full analytics, insights, and quick access to all features.</p>
          </motion.div>
        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section className="bg-gray-100 dark:bg-gray-900 py-20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 px-6">
          <Testimonial name="James M." text="Fastest banking app I’ve ever used. Premium experience that feels exclusive." />
          <Testimonial name="Sarah K." text="Loans approved in minutes with excellent rates and no hassle. Truly luxurious." />
          <Testimonial name="David O." text="Safe, reliable, and intuitive for my business. A must-have for premium clients." />
        </div>
      </section>

      {/* ================= FAQ ================= */}
      <section className="max-w-3xl mx-auto py-20 px-6">
        <h3 className="text-3xl font-bold text-center mb-10">FAQs</h3>
        <FAQ question="Is my money secure?" answer="Yes, we use bank-grade encryption, continuous monitoring, and two-factor authentication for every transaction." />
        <FAQ question="How fast are transfers?" answer="Most transfers are instant, including international payments for premium clients." />
        <FAQ question="How do I apply for a loan?" answer="Login, navigate to Loans, choose your amount, and submit. Approval is near-instant for verified accounts." />
      </section>

      {/* ================= CTA ================= */}
      {!currentUser && (
        <section className="bg-blue-900 text-white text-center py-20">
          <h3 className="text-3xl font-bold">Join the Capital Bank Premium Experience</h3>
          <p className="mt-4 max-w-xl mx-auto text-blue-200">
            Enjoy exclusive rewards, faster transactions, premium support, and financial insights that elevate your banking.
          </p>
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
        © {new Date().getFullYear()} Capital Bank • Licensed by Central Bank of Kenya • Premium Experience
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
