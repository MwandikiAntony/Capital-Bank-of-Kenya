import React from "react";
import { Link } from "react-router-dom";

export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div
        className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-6 overflow-auto"
        style={{ maxHeight: "80vh" }}
      >
        <h1 className="text-2xl font-bold mb-4">Terms & Conditions</h1>

        <p className="text-sm text-gray-700 mb-3">
          Welcome to <strong>Capital Bank</strong>. These Terms & Conditions
          (“Terms”) govern your use of our banking services, mobile and online
          platforms, and related products. Please read carefully before opening
          or using your account.
        </p>

        <h2 className="font-semibold mt-4 mb-2">1. Acceptance of Terms</h2>
        <p className="text-sm text-gray-700 mb-2">
          By registering for an account or conducting transactions with Capital
          Bank, you agree to be bound by these Terms and applicable laws of the
          Republic of Kenya, including Central Bank of Kenya (CBK) regulations.
        </p>

        <h2 className="font-semibold mt-4 mb-2">2. Eligibility & KYC</h2>
        <p className="text-sm text-gray-700 mb-2">
          You must be at least 18 years old to operate an account. All customers
          must provide valid identification (National ID/Passport) and meet{" "}
          <strong>Know Your Customer (KYC)</strong> requirements. Capital Bank
          reserves the right to verify and retain copies of your documents.
        </p>

        <h2 className="font-semibold mt-4 mb-2">3. Accounts & Security</h2>
        <p className="text-sm text-gray-700 mb-2">
          You are responsible for keeping your login credentials and PIN secure.
          Any activity under your account will be considered as authorized by
          you. Notify us immediately if you suspect unauthorized access.
        </p>

        <h2 className="font-semibold mt-4 mb-2">4. Transactions</h2>
        <p className="text-sm text-gray-700 mb-2">
          Transactions (deposits, withdrawals, transfers) are processed subject
          to availability of funds and compliance checks. We may decline,
          reverse, or delay a transaction where fraud, error, or regulatory
          issues are suspected.
        </p>

        <h2 className="font-semibold mt-4 mb-2">5. Fees & Charges</h2>
        <p className="text-sm text-gray-700 mb-2">
          Applicable fees (transaction charges, maintenance fees, penalties) are
          published in our tariff guide and may change from time to time. By
          using our services, you consent to such deductions from your account.
        </p>

        <h2 className="font-semibold mt-4 mb-2">6. Liability</h2>
        <p className="text-sm text-gray-700 mb-2">
          Capital Bank is not liable for losses resulting from system downtime,
          network failures, third-party errors, or circumstances beyond our
          control. You are responsible for ensuring accuracy when initiating
          transfers or payments.
        </p>

        <h2 className="font-semibold mt-4 mb-2">7. Privacy & Data Protection</h2>
        <p className="text-sm text-gray-700 mb-2">
          Your personal data will be collected and processed in line with the{" "}
          <strong>Kenya Data Protection Act, 2019</strong>. We will not share
          your data with third parties without your consent, except as required
          by law or regulators.
        </p>

        <h2 className="font-semibold mt-4 mb-2">8. Dispute Resolution</h2>
        <p className="text-sm text-gray-700 mb-2">
          Any disputes arising from these Terms will be addressed through our
          internal complaint-handling procedures. If unresolved, disputes may be
          referred to the Central Bank of Kenya or other legal forums.
        </p>

        <h2 className="font-semibold mt-4 mb-2">9. Amendments</h2>
        <p className="text-sm text-gray-700 mb-2">
          Capital Bank may amend these Terms from time to time. Customers will
          be notified through official communication channels (email, SMS,
          website).
        </p>

        <h2 className="font-semibold mt-4 mb-2">10. Contact Us</h2>
        <p className="text-sm text-gray-700 mb-6">
          For support or inquiries, contact our Customer Care at{" "}
          <a
            href="mailto:support@capitalbank.co.ke"
            className="text-blue-600 underline"
          >
            support@capitalbank.co.ke
          </a>{" "}
          or call us at +254 700 000 000.
        </p>

        <div className="flex justify-end">
          <Link
            to="/register"
            className="text-green-600 hover:underline font-medium"
          >
            Back
          </Link>
        </div>
      </div>
    </div>
  );
}
