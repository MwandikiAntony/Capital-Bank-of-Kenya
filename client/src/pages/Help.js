import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Lock, FileText, Phone, ShieldCheck, Mail, MessageSquare, HelpCircle } from "lucide-react";
import PageLayout from "./PageLayout";
import Card from "./Card";
import { T } from "./theme";

const helpTopics = [
  { Icon: Lock, title: "Resetting Your PIN", desc: "Use the Forgot PIN option..." },
  { Icon: FileText, title: "Applying for a Loan", desc: "Go to Dashboard → Loans..." },
  { Icon: Phone, title: "Customer Support", desc: "Call +254..." },
  { Icon: ShieldCheck, title: "Account Security", desc: "Enable 2FA..." },
  { Icon: Mail, title: "Email Issues", desc: "Check spam..." },
  { Icon: MessageSquare, title: "Disputing a Transaction", desc: "Go to Statements..." },
];

export default function Help() {
  const [search, setSearch] = useState("");

  const filtered = helpTopics.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PageLayout title="Help Center" eyebrow="Support" icon={HelpCircle}>
      <input value={search} onChange={e => setSearch(e.target.value)} />

      {filtered.map(({ Icon, title, desc }) => (
        <Card key={title}>
          <Icon /> {title}
          <p>{desc}</p>
        </Card>
      ))}
    </PageLayout>
  );
}