import React from "react";
import { ShieldCheck } from "lucide-react";
import PageLayout from "./PageLayout";
import Card from "./Card";

export default function PrivacyPolicy() {
  return (
    <PageLayout title="Privacy Policy" eyebrow="Data Protection" icon={ShieldCheck}>
      <Card>
        <p>Privacy policy content...</p>
      </Card>
    </PageLayout>
  );
}