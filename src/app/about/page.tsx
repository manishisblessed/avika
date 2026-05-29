"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Leaf, Heart, Truck, ShieldCheck, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import Counter from "@/components/Counter";
import { COMPANY_LEGAL_NAME } from "@/lib/company";
import Link from "next/link";

const values = [
  {
    icon: Leaf,
    t: "Farm Fresh Always",
    d: "We source directly from local farmers and trusted suppliers. Your vegetables reach you within 24 hours of harvest.",
  },
  {
    icon: Heart,
    t: "Quality First",
    d: "Every product is quality-checked before it reaches your doorstep. No compromises on freshness or authenticity.",
  },
  {
    icon: Truck,
    t: "Reliable Delivery",
    d: "Same-day delivery across Delhi NCR. Our trained delivery partners handle your groceries with care.",
  },
  {
    icon: ShieldCheck,
    t: "Fair Pricing",
    d: "Direct sourcing means no middlemen. We pass the savings to you with competitive prices every day.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      delay: i * 0.1,
      ease: [0.2, 0.8, 0.2, 1],
    },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      delay: i * 0.08,
      ease: [0.2, 0.8, 0.2, 1],
    },
  }),
};

export default function AboutPage() {
  return (
    <div className="pb-24 overflow-hidden">
      {/* Hero */}
      <section className="relative pt-36 pb-16 section">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
          className="grid lg:grid-cols-2 gap-12 items-center"
        >
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <span className="eyebrow mb-3">Our Story</span>
            <h1 className="display text-4xl md:text-6xl font-bold mt-5 leading-[1.05] text-ink">
              Your trusted{" "}
              <span className="gold-text">neighborhood grocery store.</span>
            </h1>
            <p className="mt-7 text-ink-soft text-lg leading-relaxed">
              {COMPANY_LEGAL_NAME} started with a simple belief: every family
              deserves access to fresh, quality groceries at fair prices. What
              began as a small store in Dwarka has grown into a trusted name
              across Delhi NCR.
            </p>
            <p className="mt-5 text-ink-soft leading-relaxed">
              Today, we serve thousands of families daily, bringing farm-fresh
              vegetables, quality staples, and everyday essentials right to their
              doorsteps — with the same warmth and care of a neighborhood kirana
              store, but with the convenience of modern delivery.
            </p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
              className="mt-8"
            >
              <Link href="/products" className="btn-gold">
                Shop Now <ArrowRight size={18} />
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
            className="relative"
          >
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-soft-lg group">
              <Image
                src="/site/fresh-groceries.jpg"
                alt="Fresh groceries"
                fill
                sizes="(min-width:1024px) 50vw, 100vw"
                className="object-cover transition-transform duration-[1.2s] group-hover:scale-105"
                priority
              />
            </div>
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-6 -right-6 w-24 h-24 rounded-2xl bg-gradient-to-br from-gold-400/20 to-gold-700/5 border border-gold-500/20 backdrop-blur-sm"
            />
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-4 -left-4 w-16 h-16 rounded-xl bg-gradient-to-br from-brand-green-400/20 to-brand-green-700/5 border border-brand-green-500/20 backdrop-blur-sm"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="section mt-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="card p-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
        >
          {[
            { v: 5, s: "+", l: "Years serving you" },
            { v: 50, s: "+", l: "Areas covered" },
            { v: 13, s: "", l: "Categories" },
            { v: 325, s: "+", l: "Quality products" },
          ].map((s, i) => (
            <motion.div
              key={s.l}
              custom={i}
              variants={scaleIn}
              className="relative group"
            >
              <div className="relative p-4">
                <div className="font-display text-4xl md:text-5xl font-bold text-ink">
                  <Counter to={s.v} suffix={s.s} />
                </div>
                <p className="text-sm text-ink-soft mt-2">{s.l}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Values */}
      <section className="section py-24">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="eyebrow mb-3">What we believe</span>
            <h2 className="display text-4xl md:text-6xl mt-4 leading-tight">
              Our <span className="gold-text">promise to you.</span>
            </h2>
          </div>
        </Reveal>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {values.map((v, i) => (
            <motion.div
              key={v.t}
              custom={i}
              variants={fadeUp}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="card card-hover p-7 h-full relative overflow-hidden group"
            >
              <div className="relative">
                <motion.div
                  whileHover={{ rotate: 5, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center text-gold-600 mb-5"
                >
                  <v.icon size={20} />
                </motion.div>
                <h3 className="font-display text-lg font-semibold text-ink">{v.t}</h3>
                <p className="text-sm text-ink-soft mt-2 leading-relaxed">{v.d}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* How It Works */}
      <section className="section py-12">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="eyebrow mb-3">Simple & Easy</span>
            <h2 className="display text-4xl md:text-6xl mt-4 leading-tight">
              How it <span className="gold-text">works.</span>
            </h2>
          </div>
        </Reveal>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="grid md:grid-cols-3 gap-8 relative"
        >
          <div className="hidden md:block absolute top-8 left-[20%] right-[20%] h-[2px]">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
              className="h-full bg-gradient-to-r from-transparent via-gold-500/40 to-transparent origin-left"
            />
          </div>

          {[
            {
              step: "01",
              title: "Browse & Add",
              desc: "Explore our wide range of groceries. Add items to your cart with just a click.",
            },
            {
              step: "02",
              title: "Choose Delivery",
              desc: "Select same-day delivery or schedule for a time that works for you.",
            },
            {
              step: "03",
              title: "Receive Fresh",
              desc: "Our team carefully packs and delivers your order fresh to your doorstep.",
            },
          ].map((item, i) => (
            <motion.div
              key={item.step}
              custom={i}
              variants={fadeUp}
              whileHover={{ y: -6 }}
              className="text-center relative"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 3 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 text-white font-display text-2xl mb-6 shadow-gold relative z-10"
              >
                {item.step}
              </motion.div>
              <h3 className="font-display text-xl font-semibold text-ink mb-3">{item.title}</h3>
              <p className="text-ink-soft leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Sourcing */}
      <section className="section py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
          className="card p-10 md:p-16 overflow-hidden relative"
        >
          <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-gold-500/5 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-brand-green-500/5 blur-3xl" />

          <div className="grid lg:grid-cols-2 gap-10 items-center relative">
            <div>
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="eyebrow mb-3"
              >
                Our Sourcing
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="display text-3xl md:text-4xl font-bold mt-4 leading-tight text-ink"
              >
                From farm to <span className="gold-text">your table.</span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="mt-6 text-ink-soft leading-relaxed"
              >
                We partner directly with farmers across Haryana, Punjab, and UP
                to bring you the freshest produce. Our staples and packaged goods
                come from trusted brands you know and love.
              </motion.p>
              <ul className="mt-6 space-y-3">
                {[
                  "Direct farmer partnerships for fresh produce",
                  "Quality checks at every stage",
                  "Temperature-controlled storage",
                  "Careful handling during delivery",
                ].map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                    className="flex items-center gap-3 text-ink-soft"
                  >
                    <motion.span
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                      className="w-2 h-2 rounded-full bg-gold-500"
                    />
                    {item}
                  </motion.li>
                ))}
              </ul>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
              className="relative group"
            >
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                <Image
                  src="/site/farm-produce.jpg"
                  alt="Fresh farm produce"
                  fill
                  sizes="(min-width:1024px) 50vw, 100vw"
                  className="object-cover transition-transform duration-[1.2s] group-hover:scale-105"
                  loading="lazy"
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
