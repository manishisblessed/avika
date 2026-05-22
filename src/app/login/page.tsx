"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("Invalid email or password. Please try again.");
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
            <h1 className="display text-4xl md:text-5xl">
              Welcome <span className="gold-text">back.</span>
            </h1>
            <p className="mt-3 text-ink/60">
              Sign in to your AVIKA account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="glass rounded-3xl p-8 space-y-5">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl bg-rose-500/10 border border-rose-500/30 p-4 text-sm text-rose-200"
              >
                {error}
              </motion.div>
            )}

            <label className="block">
              <span className="text-xs uppercase tracking-widest text-ink/55">Email</span>
              <div className="relative mt-2">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 placeholder:text-ink/30 focus:outline-none focus:border-gold-500/60 transition-colors"
                />
              </div>
            </label>

            <label className="block">
              <span className="text-xs uppercase tracking-widest text-ink/55">Password</span>
              <div className="relative mt-2">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40" />
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-11 py-3 placeholder:text-ink/30 focus:outline-none focus:border-gold-500/60 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink/70"
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
              {loading ? "Signing in..." : "Sign In"}
              <ArrowRight size={16} />
            </motion.button>

            <p className="text-center text-sm text-ink/60">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-gold-300 hover:text-gold-200 transition-colors">
                Create one
              </Link>
            </p>
          </form>
        </motion.div>
      </section>
    </div>
  );
}
