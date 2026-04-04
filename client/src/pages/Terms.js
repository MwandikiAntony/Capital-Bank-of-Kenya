import React from "react";
import { Link } from "react-router-dom";
import { FileText } from "lucide-react";
import PageLayout from "./PageLayout";
import Card from "./Card";
import { T } from "./theme";

export default function Terms() {
  return (
    <PageLayout title="Terms & Conditions" eyebrow="Legal" icon={FileText}>
      <Card>
        <p>Terms content...</p>
      </Card>
      <Link to="/">Back</Link>
    </PageLayout>
  );
}