// client/src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import Terms from "./pages/Terms";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Help from "./pages/Help";
import ContactUs from "./pages/ContactUs";


function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-900 text-white">
      {/* Header / Navbar */}
      <header className="flex justify-between items-center px-10 py-6 bg-blue-800 bg-opacity-90 shadow-lg">
        <h1 className="text-2xl font-extrabold flex items-center gap-2">
          🏦 Capital Bank
        </h1>
        <nav className="flex gap-6 text-sm font-medium">
          <Link to="/register" className="hover:underline">
            Open Account
          </Link>
          <Link to="/login" className="hover:underline">
            Login
          </Link>
          <Link to="/dashboard" className="hover:underline">
            Dashboard
          </Link>
          <Link to="/terms" className="hover:underline">
            Terms
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          Welcome to Capital Bank
        </h2>
        <p className="text-lg text-blue-100 max-w-2xl mb-8">
          Experience the future of banking with secure accounts, instant
          transfers, flexible loans, and smart savings tools.
        </p>

        <div className="flex gap-4">
          <Link
            to="/register"
            className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold shadow-lg transition"
          >
            Open Free Account
          </Link>
          <Link
            to="/login"
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold shadow-lg transition"
          >
            Login
          </Link>
        </div>
      </main>

      {/* Features Section */}
      <section className="grid md:grid-cols-3 gap-8 px-10 py-16 bg-white text-gray-800">
        <div className="p-6 rounded-xl shadow-lg bg-gray-50">
          <h3 className="text-xl font-semibold mb-2">💳 Digital Banking</h3>
          <p className="text-sm">
            Manage your money anytime, anywhere with our easy-to-use online and
            mobile banking platform.
          </p>
        </div>
        <div className="p-6 rounded-xl shadow-lg bg-gray-50">
          <h3 className="text-xl font-semibold mb-2">💰 Smart Loans</h3>
          <p className="text-sm">
            Access instant loans with flexible repayment periods and low
            interest rates tailored to your needs.
          </p>
        </div>
        <div className="p-6 rounded-xl shadow-lg bg-gray-50">
          <h3 className="text-xl font-semibold mb-2">🔒 Secure Accounts</h3>
          <p className="text-sm">
            Your security is our priority — we use advanced encryption and
            fraud monitoring for peace of mind.
          </p>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center py-12 bg-blue-800 text-white">
        <h3 className="text-2xl font-bold mb-4">
          Banking Made Simple and Reliable
        </h3>
        <p className="mb-6 text-blue-200">
          Join thousands of customers who trust Capital Bank with their savings,
          loans, and investments.
        </p>
        <Link
          to="/register"
          className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-semibold shadow-lg transition"
        >
          Get Started Now
        </Link>
      </section>

      {/* Footer */}
      <footer className="px-10 py-6 bg-blue-900 text-blue-200 text-sm flex justify-between">
        <p>© {new Date().getFullYear()} Capital Bank. All rights reserved.</p>
        <div className="flex gap-4">
        <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
        <Link to="/help" className="hover:underline">Help Center</Link>
        <Link to="/contact" className="hover:underline">Contact Us</Link>

        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/help" element={<Help />} />
        <Route path="/contact" element={<ContactUs />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}
