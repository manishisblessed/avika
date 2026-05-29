"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, User, Phone, ArrowRight, Eye, EyeOff } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (key: string, val: string) =>
    setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      setLoading(false);
      setError(data.error || "Something went wrong.");
      return;
    }

    const signInRes = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    setLoading(false);

    if (signInRes?.error) {
      setError("Account created but sign-in failed. Please try logging in.");
    } else {
      router.push("/account");
      router.refresh();
    }
  };

  return (
    <div className="pt-36 pb-24 min-h-screen">
      <section className="section max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-10">
            <h1 className="display text-3xl md:text-4xl font-bold text-ink">
              Create your <span className="gold-text">account.</span>
            </h1>
            <p className="mt-3 text-ink-soft">
              Join AVIKA for fresh groceries delivered to your door
            </p>
          </div>

          <form onSubmit={handleSubmit} className="card p-8 space-y-5">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl bg-rose-500/10 border border-rose-500/30 p-4 text-sm text-rose-700"
              >
                {error}
              </motion.div>
            )}

            <label className="block">
              <span className="text-xs uppercase tracking-widest text-ink-mute font-medium">Full Name</span>
              <div className="relative mt-2">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-mute" />
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="Rahul Sharma"
                  required
                  className="w-full bg-white border border-ink/15 rounded-xl pl-11 pr-4 py-3 text-ink placeholder:text-ink/40 focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/30 transition-colors"
                />
              </div>
            </label>

            <label className="block">
              <span className="text-xs uppercase tracking-widest text-ink-mute font-medium">Email</span>
              <div className="relative mt-2">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-mute" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="rahul@example.com"
                  required
                  className="w-full bg-white border border-ink/15 rounded-xl pl-11 pr-4 py-3 text-ink placeholder:text-ink/40 focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/30 transition-colors"
                />
              </div>
            </label>

            <label className="block">
              <span className="text-xs uppercase tracking-widest text-ink-mute font-medium">Phone (optional)</span>
              <div className="relative mt-2">
                <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-mute" />
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-white border border-ink/15 rounded-xl pl-11 pr-4 py-3 text-ink placeholder:text-ink/40 focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/30 transition-colors"
                />
              </div>
            </label>

            <label className="block">
              <span className="text-xs uppercase tracking-widest text-ink-mute font-medium">Password</span>
              <div className="relative mt-2">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-mute" />
                <input
                  type={showPw ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => update("password", e.target.value)}
                  placeholder="Min 6 characters"
                  required
                  minLength={6}
                  className="w-full bg-white border border-ink/15 rounded-xl pl-11 pr-11 py-3 text-ink placeholder:text-ink/40 focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/30 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  aria-label={showPw ? "Hide password" : "Show password"}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-mute hover:text-ink"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </label>

            <motion.button
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading}
              className="btn-gold w-full disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Create Account"}
              <ArrowRight size={16} />
            </motion.button>

            <p className="text-center text-sm text-ink-soft">
              Already have an account?{" "}
              <Link href="/login" className="text-gold-700 hover:text-gold-800 font-medium transition-colors">
                Sign in
              </Link>
            </p>
          </form>
        </motion.div>
      </section>
    </div>
  );
}
