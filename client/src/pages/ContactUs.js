import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, MessageSquare, Phone } from "lucide-react";
import PageLayout from "./PageLayout";
import Card from "./Card";
import FormInput from "./FormInput";
import { T } from "./theme";

export default function ContactUs() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    setSent(true);
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <PageLayout title="Contact Us" eyebrow="Get in Touch" icon={MessageSquare} maxWidth={960}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24 }}>

        <Card>
          {sent ? (
            <div style={{ textAlign: "center", padding: "40px 20px" }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>✓</div>
              <h3>Message sent.</h3>
              <button onClick={() => setSent(false)}>Send another</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <FormInput label="Full Name" name="name" value={formData.name} onChange={handleChange} required />
              <FormInput label="Email Address" type="email" name="email" value={formData.email} onChange={handleChange} required />
              <FormInput label="Subject" name="subject" value={formData.subject} onChange={handleChange} required />
              <FormInput label="Message" name="message" value={formData.message} onChange={handleChange} rows={5} required />
              <button type="submit">Send Message →</button>
            </form>
          )}
        </Card>

        <div>
          <Card>
            <Phone /> +254 700 000 000
          </Card>
          <Card>
            <Mail /> support@capitalbank.co.ke
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}