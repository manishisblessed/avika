"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Truck,
  Clock,
  MapPin,
  ShieldCheck,
  Package,
  RefreshCw,
  Phone,
  Mail,
  HelpCircle,
  CreditCard,
  Leaf,
  Scale,
  ChevronDown,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { Reveal } from "@/components/Reveal";
import type { InfoPageData } from "@/data/info-pages";

const iconMap: Record<string, LucideIcon> = {
  truck: Truck,
  clock: Clock,
  map: MapPin,
  shield: ShieldCheck,
  package: Package,
  refresh: RefreshCw,
  phone: Phone,
  mail: Mail,
  help: HelpCircle,
  credit: CreditCard,
  leaf: Leaf,
  scale: Scale,
};

export default function InfoPage({ data }: { data: InfoPageData }) {
  return (
    <div className="pt-36 pb-24">
      <section className="section">
        <Reveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="eyebrow mb-3">{data.eyebrow}</span>
            <h1 className="display text-4xl md:text-6xl font-bold mt-5 leading-tight text-ink">
              {data.title}{" "}
              <span className="gold-text">{data.highlight}</span>
            </h1>
            <p className="mt-6 text-ink-soft text-lg leading-relaxed">{data.description}</p>
          </div>
        </Reveal>

        {data.highlights && data.highlights.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
            {data.highlights.map((h, i) => {
              const Icon = iconMap[h.icon] ?? HelpCircle;
              return (
                <Reveal key={h.title} delay={i * 0.05}>
                  <div className="card p-6 h-full card-hover">
                    <div className="w-11 h-11 rounded-xl bg-gold-500/10 flex items-center justify-center text-gold-600 mb-4">
                      <Icon size={18} />
                    </div>
                    <h3 className="font-display text-lg font-semibold text-ink">{h.title}</h3>
                    <p className="text-sm text-ink-soft mt-2 leading-relaxed">{h.description}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        )}

        {data.faqs && data.faqs.length > 0 && (
          <div className="max-w-3xl mx-auto mb-16">
            <Reveal>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-ink mb-8 text-center">
                Frequently asked <span className="gold-text">questions</span>
              </h2>
            </Reveal>
            <div className="space-y-3">
              {data.faqs.map((faq, i) => (
                <FaqItem key={faq.q} faq={faq} index={i} />
              ))}
            </div>
          </div>
        )}

        <div className="max-w-3xl mx-auto space-y-10">
          {data.sections.map((section, i) => (
            <Reveal key={section.title} delay={i * 0.04}>
              <article className="card p-8 md:p-10">
                <h2 className="font-display text-xl md:text-2xl font-bold text-ink mb-5">
                  {section.title}
                </h2>
                {section.paragraphs?.map((p) => (
                  <p key={p.slice(0, 40)} className="text-ink-soft leading-relaxed mb-4 last:mb-0">
                    {p}
                  </p>
                ))}
                {section.bullets && section.bullets.length > 0 && (
                  <ul className="mt-4 space-y-2.5">
                    {section.bullets.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-ink-soft text-sm md:text-base">
                        <span className="w-1.5 h-1.5 rounded-full bg-gold-500 mt-2 flex-shrink-0" />
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            </Reveal>
          ))}
        </div>

        {data.cta && (
          <Reveal delay={0.1}>
            <div className="mt-16 max-w-3xl mx-auto card p-10 text-center">
              <p className="text-ink-soft leading-relaxed mb-6">{data.cta.text}</p>
              <Link href={data.cta.href} className="btn-gold inline-flex">
                {data.cta.label}
                <ArrowRight size={18} />
              </Link>
            </div>
          </Reveal>
        )}
      </section>
    </div>
  );
}

function FaqItem({ faq, index }: { faq: { q: string; a: string }; index: number }) {
  const [open, setOpen] = useState(index === 0);

  return (
    <Reveal delay={index * 0.03}>
      <div className="card overflow-hidden">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="w-full flex items-center justify-between gap-4 p-6 text-left hover:bg-bg-soft transition-colors"
          aria-expanded={open}
        >
          <span className="font-display font-semibold text-ink pr-4">{faq.q}</span>
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.25 }}
            className="flex-shrink-0 text-gold-600"
          >
            <ChevronDown size={20} />
          </motion.span>
        </button>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
              className="overflow-hidden"
            >
              <p className="px-6 pb-6 text-ink-soft text-sm leading-relaxed border-t border-ink/8 pt-4">
                {faq.a}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Reveal>
  );
}
