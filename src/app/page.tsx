"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { ArrowRight, Truck, ShieldCheck, Clock, Percent, Check } from "lucide-react";

import { categories } from "@/data/categories";
import { getFeaturedProducts } from "@/data/products";
import { testimonials } from "@/data/testimonials";

import CategoryCard from "@/components/CategoryCard";
import ProductCard from "@/components/ProductCard";
import Marquee from "@/components/Marquee";
import { Reveal, StaggerWords } from "@/components/Reveal";
import Counter from "@/components/Counter";

const Hero3D = dynamic(() => import("@/components/Hero3D"), { ssr: false });

export default function HomePage() {
  const featured = getFeaturedProducts();
  const heroRef = useRef<HTMLElement>(null);
  const [nlEmail, setNlEmail] = useState("");
  const [nlDone, setNlDone] = useState(false);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);

  return (
    <>
      {/* HERO */}
      <section
        ref={heroRef}
        className="relative min-h-[100svh] flex items-center pt-32 pb-20 overflow-hidden"
      >
        <div className="absolute inset-0 bg-radial-gold pointer-events-none" />
        <Hero3D />

        <motion.div
          style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
          className="section relative z-10 grid lg:grid-cols-12 gap-10 items-center"
        >
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="eyebrow mb-6"
            >
              <span>Fresh · Daily · Delivered</span>
            </motion.div>
            <h1 className="display text-5xl md:text-7xl lg:text-[5.5rem] leading-[1.02] text-ink">
              <StaggerWords text="Your grocery" />
              <br />
              <span className="gold-text">
                <StaggerWords text="store, online." delay={0.25} />
              </span>
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="mt-7 text-lg text-ink/75 max-w-xl leading-relaxed"
            >
              From farm-fresh vegetables to daily essentials — everything your
              kitchen needs, delivered to your doorstep. Quality products,
              fair prices, same-day delivery.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.15, duration: 0.6 }}
              className="mt-10 flex flex-wrap gap-4"
            >
              <Link href="/products" className="btn-gold">
                Shop Now
                <ArrowRight size={18} />
              </Link>
              <Link href="/categories" className="btn-ghost">
                Browse Categories
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4, duration: 0.8 }}
              className="mt-14 grid grid-cols-3 gap-6 max-w-md"
            >
              {[
                { v: 15000, s: "+", l: "happy families" },
                { v: 1000, s: "+", l: "quality products" },
                { v: 50, s: "+", l: "areas served" },
              ].map((s) => (
                <div key={s.l}>
                  <div className="font-display text-3xl gold-text">
                    <Counter to={s.v} suffix={s.s} />
                  </div>
                  <p className="text-xs text-ink/60 mt-1">{s.l}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-ink/50 text-[10px] uppercase tracking-[0.4em]"
        >
          <span>Scroll</span>
          <span className="w-px h-12 bg-gradient-to-b from-gold-500 to-transparent" />
        </motion.div>
      </section>

      <Marquee />

      {/* VALUES */}
      <section className="section py-24">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Truck, t: "Same-Day Delivery", d: "Order by 2 PM, get it today." },
            { icon: ShieldCheck, t: "Quality Assured", d: "Fresh & verified products." },
            { icon: Percent, t: "Best Prices", d: "Daily deals & weekly offers." },
            { icon: Clock, t: "Open 7 AM - 10 PM", d: "Shop anytime, any day." },
          ].map((v, i) => (
            <Reveal key={v.t} delay={i * 0.08}>
              <div className="glass rounded-2xl p-7 h-full card-hover">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold-400/20 to-gold-700/10 border border-gold-500/30 flex items-center justify-center text-gold-300 mb-5">
                  <v.icon size={20} />
                </div>
                <h4 className="font-display text-xl text-ink">{v.t}</h4>
                <p className="text-sm text-ink/65 mt-1.5">{v.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section id="categories" className="section pt-12 pb-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <Reveal>
            <div>
              <span className="eyebrow mb-3">Shop by Aisle</span>
              <h2 className="display text-4xl md:text-6xl mt-4 leading-tight">
                Browse our <span className="gold-text">categories.</span>
              </h2>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <Link
              href="/categories"
              className="group inline-flex items-center gap-2 text-gold-300 hover:text-gold-200 transition-colors"
            >
              All categories
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {categories.slice(0, 8).map((c, i) => (
            <CategoryCard key={c.id} category={c} index={i} />
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="relative py-24">
        <div className="absolute inset-0 bg-radial-fade pointer-events-none" />
        <div className="section relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <Reveal>
              <div>
                <span className="eyebrow mb-3">Bestsellers</span>
                <h2 className="display text-4xl md:text-6xl mt-4 leading-tight">
                  Customer <span className="gold-text">favorites.</span>
                </h2>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <Link
                href="/products"
                className="group inline-flex items-center gap-2 text-gold-300 hover:text-gold-200 transition-colors"
              >
                Shop all
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </Reveal>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {featured.slice(0, 8).map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* SHOWCASE BAND */}
      <section className="relative py-24 overflow-hidden">
        <div className="section grid lg:grid-cols-2 gap-12 items-center">
          <Reveal>
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-white/5">
              <img
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1400&q=80"
                alt="Fresh groceries"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-bg via-bg/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-8">
                <span className="eyebrow">Fresh Daily</span>
                <h3 className="font-display text-3xl mt-4">
                  Farm to Your Table, Every Day
                </h3>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="space-y-6">
              <span className="eyebrow">Our Promise</span>
              <h3 className="display text-4xl md:text-5xl leading-tight">
                Quality you can <span className="gold-text">trust</span>.
                Prices you'll love.
              </h3>
              <p className="text-ink/75 text-lg leading-relaxed">
                We source directly from farmers and trusted suppliers to bring
                you the freshest groceries at fair prices. Every product is
                quality-checked before it reaches your doorstep.
              </p>
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/10">
                {[
                  { v: 98, s: "%", l: "on-time delivery" },
                  { v: 4, s: "hr", l: "avg. delivery" },
                  { v: 100, s: "%", l: "quality assured" },
                ].map((s) => (
                  <div key={s.l}>
                    <div className="font-display text-3xl gold-text">
                      <Counter to={s.v} suffix={s.s} />
                    </div>
                    <p className="text-xs text-ink/60 mt-1">{s.l}</p>
                  </div>
                ))}
              </div>
              <Link href="/about" className="btn-ghost mt-2">
                Learn more about us
                <ArrowRight size={16} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section py-24">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="eyebrow mb-3">Happy Customers</span>
            <h2 className="display text-4xl md:text-6xl mt-4 leading-tight">
              Loved by <span className="gold-text">families.</span>
            </h2>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {testimonials.map((t, i) => (
            <Reveal key={t.id} delay={i * 0.08}>
              <figure className="glass rounded-2xl p-6 h-full flex flex-col card-hover">
                <div className="flex gap-0.5 text-gold-400 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <span key={j}>★</span>
                  ))}
                </div>
                <blockquote className="text-ink/85 leading-relaxed flex-1">
                  "{t.quote}"
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 pt-4 border-t border-white/5">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm text-ink">{t.name}</p>
                    <p className="text-xs text-ink/55">{t.role}</p>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="section pt-12 pb-32">
        <Reveal>
          <div className="relative overflow-hidden rounded-[32px] border border-gold-500/20 p-10 md:p-16 text-center">
            <div className="absolute inset-0 bg-radial-gold" />
            <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-gold-500/10 blur-3xl" />
            <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-gold-700/10 blur-3xl" />
            <div className="relative">
              <span className="eyebrow">Weekly Deals</span>
              <h2 className="display text-4xl md:text-6xl mt-6 max-w-3xl mx-auto leading-tight">
                Save more. <span className="gold-text">Eat fresh.</span>
              </h2>
              <p className="mt-5 text-ink/75 max-w-xl mx-auto">
                Subscribe to our newsletter for exclusive deals, weekly offers,
                and updates on new products. Fresh savings delivered to your inbox!
              </p>
              <form
                className="mt-9 max-w-lg mx-auto flex flex-col sm:flex-row gap-3"
                onSubmit={async (e) => {
                  e.preventDefault();
                  await fetch("/api/newsletter", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: nlEmail }),
                  });
                  setNlDone(true);
                  setNlEmail("");
                  setTimeout(() => setNlDone(false), 4000);
                }}
              >
                <input
                  type="email"
                  value={nlEmail}
                  onChange={(e) => setNlEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="flex-1 bg-white/5 border border-white/10 rounded-full px-6 py-4 placeholder:text-ink/40 focus:outline-none focus:border-gold-500/60"
                />
                <button type="submit" className="btn-gold">
                  {nlDone ? <><Check size={16} /> Subscribed!</> : "Subscribe"}
                </button>
              </form>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
