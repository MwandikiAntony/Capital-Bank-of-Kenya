import React from "react";
import { ShieldCheck } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-10">
        <div className="flex items-center space-x-3 mb-6">
          <ShieldCheck className="text-blue-600" size={32} />
          <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
        </div>

        <p className="text-gray-600 mb-6">
          At <strong>Capital Bank</strong>, your privacy is important to us. This
          policy explains how we collect, use, and protect your information.
        </p>

        <div className="space-y-5 text-gray-700">
          <section>
            <h2 className="font-semibold text-lg">1. Information We Collect</h2>
            <p>
              Personal details such as your name, ID number, phone, and financial
              data may be collected for service provision.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-lg">2. How We Use Information</h2>
            <p>
              To process transactions, improve banking services, comply with
              regulations, and ensure customer safety.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-lg">3. Security</h2>
            <p>
              Advanced encryption and fraud monitoring protect your sensitive
              information.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-lg">4. Data Sharing</h2>
            <p>
              We never sell personal data. Data may only be shared with regulators
              or service providers if required by law.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-lg">5. Contact Us</h2>
            <p>
              Reach us via{" "}
              <a
                href="mailto:support@capitalbank.com"
                className="text-blue-600 underline"
              >
                support@capitalbank.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
