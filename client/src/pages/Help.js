// client/src/pages/Help.js
import React from "react";
import { HelpCircle, Phone, Lock, FileText } from "lucide-react";

export default function Help() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-10">
        <div className="flex items-center space-x-3 mb-6">
          <HelpCircle className="text-green-600" size={32} />
          <h1 className="text-3xl font-bold text-gray-900">Help Center</h1>
        </div>

        <p className="text-gray-600 mb-6">
          Welcome to the <strong>Capital Bank Help Center</strong>. Browse common
          questions and solutions below.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="p-5 bg-gray-50 rounded-xl shadow-sm">
            <div className="flex items-center space-x-2 mb-2">
              <Lock className="text-blue-600" />
              <h2 className="font-semibold">Resetting Your Password</h2>
            </div>
            <p className="text-sm text-gray-600">
              Use the <strong>Forgot Password</strong> option on login to reset via
              email or SMS.
            </p>
          </div>

          <div className="p-5 bg-gray-50 rounded-xl shadow-sm">
            <div className="flex items-center space-x-2 mb-2">
              <FileText className="text-blue-600" />
              <h2 className="font-semibold">Applying for a Loan</h2>
            </div>
            <p className="text-sm text-gray-600">
              Go to <strong>Dashboard → Loans</strong>, fill the form, and select
              your repayment plan.
            </p>
          </div>

          <div className="p-5 bg-gray-50 rounded-xl shadow-sm">
            <div className="flex items-center space-x-2 mb-2">
              <Phone className="text-blue-600" />
              <h2 className="font-semibold">Customer Support</h2>
            </div>
            <p className="text-sm text-gray-600">
              Contact us at{" "}
              <a href="mailto:support@capitalbank.com" className="text-blue-600">
                support@capitalbank.com
              </a>{" "}
              or call <strong>+254 700 123 456</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
