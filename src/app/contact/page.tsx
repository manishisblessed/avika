"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, Send, Check } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import {
  COMPANY_ADDRESS_LINE,
  COMPANY_CONTACT_EMAIL,
  COMPANY_PHONE,
  COMPANY_WORKING_HOURS,
} from "@/lib/company";

const channels = [
  {
    icon: Phone,
    label: "Call Us",
    value: COMPANY_PHONE,
    sub: "For orders & support",
  },
  {
    icon: Mail,
    label: "Email",
    value: COMPANY_CONTACT_EMAIL,
    sub: "We reply within a few hours",
  },
  {
    icon: MapPin,
    label: "Store Address",
    value: "Eros Metro Mall, Dwarka",
    sub: "Sector-14, New Delhi",
  },
  {
    icon: Clock,
    label: "Working Hours",
    value: "7 AM - 10 PM",
    sub: "Open all 7 days",
  },
];

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        email: formData.get("email"),
        subject: formData.get("subject"),
        message: formData.get("message"),
      }),
    });

    setLoading(false);
    setSent(true);
    form.reset();
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <div className="pt-36 pb-24">
      <section className="section">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="eyebrow mb-3">Get in touch</span>
            <h1 className="display text-5xl md:text-7xl mt-5 leading-tight">
              We're here to <span className="gold-text">help you.</span>
            </h1>
            <p className="mt-6 text-ink/70 text-lg">
              Questions about your order? Need help finding a product? Want to
              give feedback? Reach out — our team is always happy to assist.
            </p>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {channels.map((c, i) => (
            <Reveal key={c.label} delay={i * 0.06}>
              <div className="glass rounded-2xl p-6 h-full card-hover">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-gold-400/20 to-gold-700/10 border border-gold-500/30 flex items-center justify-center text-gold-300 mb-4">
                  <c.icon size={18} />
                </div>
                <p className="text-[10px] uppercase tracking-widest text-ink/50">{c.label}</p>
                <p className="font-display text-xl text-ink mt-1.5">{c.value}</p>
                <p className="text-xs text-ink/55 mt-1">{c.sub}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          <Reveal>
            <form onSubmit={submit} className="glass rounded-3xl p-8 space-y-5">
              <h2 className="font-display text-3xl">Send us a message</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Name" name="name" placeholder="Your name" />
                <Field label="Email" name="email" type="email" placeholder="you@example.com" />
              </div>
              <Field label="Subject" name="subject" placeholder="Order inquiry, feedback, etc." />
              <label className="block">
                <span className="text-xs uppercase tracking-widest text-ink/55">Message</span>
                <textarea
                  name="message"
                  rows={6}
                  placeholder="How can we help you today?"
                  required
                  className="mt-2 w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 placeholder:text-ink/30 focus:outline-none focus:border-gold-500/60 transition-colors resize-none"
                />
              </label>
              <motion.button
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={loading}
                className="btn-gold w-full disabled:opacity-60"
              >
                {sent ? (
                  <>
                    <Check size={18} /> Sent — we&apos;ll be in touch
                  </>
                ) : loading ? (
                  "Sending..."
                ) : (
                  <>
                    Send <Send size={16} />
                  </>
                )}
              </motion.button>
            </form>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="relative h-full min-h-[440px] rounded-3xl overflow-hidden border border-white/5">
              <iframe
                title="AVIKA location — Dwarka Sector 14"
                className="absolute inset-0 w-full h-full grayscale opacity-90"
                src="https://www.openstreetmap.org/export/embed.html?bbox=77.0828%2C28.5738%2C77.0913%2C28.5785&amp;layer=mapnik"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent pointer-events-none" />
              <div className="absolute bottom-6 left-6 right-6 glass-strong rounded-2xl p-5">
                <p className="text-[10px] uppercase tracking-widest text-gold-400">
                  Visit us
                </p>
                <p className="font-display text-xl md:text-2xl mt-1 leading-snug">
                  {COMPANY_ADDRESS_LINE}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
}: {
  label: string;
  name?: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-widest text-ink/55">{label}</span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required
        className="mt-2 w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 placeholder:text-ink/30 focus:outline-none focus:border-gold-500/60 transition-colors"
      />
    </label>
  );
}
