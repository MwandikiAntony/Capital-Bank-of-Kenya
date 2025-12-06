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

function Home({ currentUser }) {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-white text-gray-900">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-center px-6 md:px-12 py-4 md:py-6 bg-blue-900 text-white shadow sticky top-0 z-50">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
          🏦 Capital Bank
        </h1>
        <nav className="flex flex-wrap gap-4 md:gap-6 mt-3 md:mt-0 text-sm md:text-base font-medium">
          {!currentUser && <Link to="/register" className="hover:text-yellow-400 transition">Open Account</Link>}
          {!currentUser && <Link to="/login" className="hover:text-yellow-400 transition">Login</Link>}
          {currentUser && <Link to="/dashboard" className="hover:text-yellow-400 transition">Dashboard</Link>}
          <Link to="/terms" className="hover:text-yellow-400 transition">Terms</Link>
          <Link to="/help" className="hover:text-yellow-400 transition">Help</Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-16 md:py-24 bg-gradient-to-r from-blue-800 via-indigo-700 to-blue-900 text-white">
        <h2 className="text-3xl md:text-5xl font-bold mb-4 drop-shadow-lg">
          Welcome to Capital Bank
        </h2>
        <p className="text-lg md:text-xl text-blue-200 max-w-2xl mb-8">
          Secure accounts, instant transfers, flexible loans, and smart savings tools — all at your fingertips.
        </p>
        <div className="flex flex-col md:flex-row gap-4">
          {!currentUser && (
            <>
              <Link to="/register" className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold shadow-lg transition transform hover:-translate-y-1">
                Open Free Account
              </Link>
              <Link to="/login" className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold shadow-lg transition transform hover:-translate-y-1">
                Login
              </Link>
            </>
          )}
          {currentUser && (
            <Link to="/dashboard" className="px-8 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-semibold shadow-lg transition transform hover:-translate-y-1">
              Go to Dashboard
            </Link>
          )}
        </div>
      </main>

      {/* Features Section */}
      <section className="grid md:grid-cols-3 gap-8 px-6 md:px-12 py-16 bg-gray-50 text-gray-800">
        <div className="p-6 rounded-xl shadow-xl hover:shadow-2xl transition bg-white">
          <h3 className="text-xl font-semibold mb-2">💳 Digital Banking</h3>
          <p className="text-sm">Manage your money anytime, anywhere via our online and mobile banking platform.</p>
        </div>
        <div className="p-6 rounded-xl shadow-xl hover:shadow-2xl transition bg-white">
          <h3 className="text-xl font-semibold mb-2">💰 Smart Loans</h3>
          <p className="text-sm">Instant loans with flexible repayment periods and competitive interest rates.</p>
        </div>
        <div className="p-6 rounded-xl shadow-xl hover:shadow-2xl transition bg-white">
          <h3 className="text-xl font-semibold mb-2">🔒 Secure Accounts</h3>
          <p className="text-sm">Advanced security and fraud monitoring for your peace of mind.</p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center py-16 bg-blue-900 text-white">
        <h3 className="text-3xl md:text-4xl font-bold mb-4 drop-shadow-md">Banking Made Simple and Reliable</h3>
        <p className="mb-6 text-blue-200 max-w-xl mx-auto">
          Join thousands of customers who trust Capital Bank with their savings, loans, and investments.
        </p>
        {!currentUser && (
          <Link to="/register" className="px-8 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-semibold shadow-lg transition transform hover:-translate-y-1">
            Get Started Now
          </Link>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-blue-200 px-6 md:px-12 py-6 text-xs md:text-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <p>© {new Date().getFullYear()} Capital Bank. All rights reserved.</p>
          <p>Licensed by the Central Bank of Kenya.</p>
        </div>
        <div className="flex gap-4 mt-4 md:mt-0">
          <Link to="/privacy" className="hover:text-yellow-400 transition">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-yellow-400 transition">Terms of Use</Link>
          <Link to="/contact" className="hover:text-yellow-400 transition">Contact Us</Link>
        </div>
      </footer>
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
