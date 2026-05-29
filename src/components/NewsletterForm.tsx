"use client";

import { useState } from "react";
import { Check } from "lucide-react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <form
      className="mt-9 max-w-lg mx-auto flex flex-col sm:flex-row gap-3"
      onSubmit={async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
          await fetch("/api/newsletter", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
          });
        } catch {
          /* non-blocking */
        }
        setLoading(false);
        setDone(true);
        setEmail("");
        setTimeout(() => setDone(false), 4000);
      }}
    >
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        required
        aria-label="Email address"
        className="flex-1 bg-white border border-ink/15 rounded-full px-6 py-4 text-ink placeholder:text-ink/40 focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/30"
      />
      <button type="submit" disabled={loading} className="btn-gold disabled:opacity-70">
        {done ? (
          <>
            <Check size={16} /> Subscribed!
          </>
        ) : loading ? (
          "Subscribing…"
        ) : (
          "Subscribe"
        )}
      </button>
    </form>
  );
}
