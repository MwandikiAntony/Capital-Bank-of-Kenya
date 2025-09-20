import React from "react";
import { Link } from "react-router-dom";

export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-6 overflow-auto" style={{ maxHeight: "80vh" }}>
        <h1 className="text-2xl font-bold mb-4">Terms & Conditions</h1>

        <p className="text-sm text-gray-700 mb-3">
          Welcome to MyBank. These Terms & Conditions ("Terms") govern your use of our services...
        </p>

        <h2 className="font-semibold mt-4 mb-2">1. Acceptance</h2>
        <p className="text-sm text-gray-700 mb-2">
          By creating an account you accept these terms. You must be at least 18 years old...
        </p>

        <h2 className="font-semibold mt-4 mb-2">2. Accounts</h2>
        <p className="text-sm text-gray-700 mb-2">
          You are responsible for maintaining the confidentiality of your account credentials...
        </p>

        <h2 className="font-semibold mt-4 mb-2">3. Transactions</h2>
        <p className="text-sm text-gray-700 mb-2">
          All transactions are subject to verification. We reserve the right to refuse or reverse transactions...
        </p>

        <h2 className="font-semibold mt-4 mb-2">4. Privacy</h2>
        <p className="text-sm text-gray-700 mb-2">
          Your privacy is important. We use reasonable measures to protect your data...
        </p>

        <h2 className="font-semibold mt-4 mb-2">5. Contact</h2>
        <p className="text-sm text-gray-700 mb-6">
          For support contact support@mybank.example
        </p>

        <div className="flex justify-end">
          <Link to="/register" className="text-green-600 hover:underline font-medium">Back</Link>
        </div>
      </div>
    </div>
  );
}
