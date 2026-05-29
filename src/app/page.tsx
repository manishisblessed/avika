import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Truck, ShieldCheck, Clock, Percent } from "lucide-react";

import { getCategories, getFeaturedProducts, getCatalogStats } from "@/lib/catalog";
import { testimonials } from "@/data/testimonials";

import CategoryCard from "@/components/CategoryCard";
import ProductCard from "@/components/ProductCard";
import Marquee from "@/components/Marquee";
import { Reveal } from "@/components/Reveal";
import Counter from "@/components/Counter";
import NewsletterForm from "@/components/NewsletterForm";

export const revalidate = 300;

export default async function HomePage() {
  const [categories, featured, stats] = await Promise.all([
    getCategories(),
    getFeaturedProducts(10),
    getCatalogStats(),
  ]);

  return (
    <>
      {/* HERO */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-radial-gold pointer-events-none opacity-70" />
        <div className="section relative z-10 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6">
            <Reveal>
              <span className="eyebrow mb-6">Fresh · Daily · Delivered</span>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="display text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] text-ink">
                Your daily groceries,{" "}
                <span className="gold-text">delivered fresh.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-7 text-lg text-ink-soft max-w-xl leading-relaxed">
                From farm-fresh vegetables to everyday essentials — everything
                your kitchen needs, delivered to your doorstep across Delhi NCR.
                Quality products, fair prices, same-day delivery.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="mt-9 flex flex-wrap gap-4">
                <Link href="/products" className="btn-gold">
                  Shop Now
                  <ArrowRight size={18} />
                </Link>
                <Link href="/categories" className="btn-ghost">
                  Browse Categories
                </Link>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="mt-12 grid grid-cols-3 gap-6 max-w-md">
                {[
                  { v: stats.products, s: "+", l: "quality products" },
                  { v: stats.categories, s: "", l: "categories" },
                  { v: 50, s: "+", l: "areas served" },
                ].map((s) => (
                  <div key={s.l}>
                    <div className="font-display text-3xl font-bold text-ink">
                      <Counter to={s.v} suffix={s.s} />
                    </div>
                    <p className="text-xs text-ink-mute mt-1">{s.l}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-6">
            <Reveal delay={0.1}>
              <div className="relative">
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-soft-lg border border-ink/5">
                  <Image
                    src="/site/fresh-groceries.jpg"
                    alt="Fresh groceries delivered by AVIKA"
                    fill
                    priority
                    sizes="(min-width:1024px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="absolute -bottom-5 -left-5 bg-bg-card rounded-2xl shadow-soft border border-ink/10 px-5 py-4 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-brand-green-500/10 flex items-center justify-center text-brand-green-600">
                    <Truck size={18} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink">Same-day delivery</p>
                    <p className="text-xs text-ink-mute">Order by 2 PM</p>
                  </div>
                </div>
                <div className="absolute -top-5 -right-5 bg-bg-card rounded-2xl shadow-soft border border-ink/10 px-5 py-4 hidden sm:flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-600">
                    <ShieldCheck size={18} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink">Quality assured</p>
                    <p className="text-xs text-ink-mute">Fresh & verified</p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <Marquee />

      {/* VALUES */}
      <section className="section py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { icon: Truck, t: "Same-Day Delivery", d: "Order by 2 PM, get it today." },
            { icon: ShieldCheck, t: "Quality Assured", d: "Fresh & verified products." },
            { icon: Percent, t: "Best Prices", d: "Daily deals & weekly offers." },
            { icon: Clock, t: "Open 7 AM - 10 PM", d: "Shop anytime, any day." },
          ].map((v, i) => (
            <Reveal key={v.t} delay={i * 0.06}>
              <div className="card card-hover p-7 h-full">
                <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center text-gold-600 mb-5">
                  <v.icon size={20} />
                </div>
                <h4 className="font-display text-lg font-semibold text-ink">{v.t}</h4>
                <p className="text-sm text-ink-soft mt-1.5">{v.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section id="categories" className="section pt-8 pb-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <Reveal>
            <div>
              <span className="eyebrow mb-3">Shop by Aisle</span>
              <h2 className="display text-3xl md:text-5xl font-bold mt-4 leading-tight text-ink">
                Browse our <span className="gold-text">categories.</span>
              </h2>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <Link
              href="/categories"
              className="group inline-flex items-center gap-2 text-gold-600 hover:text-gold-700 font-medium transition-colors"
            >
              All categories
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
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
      <section className="relative py-20 bg-bg-soft">
        <div className="section relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <Reveal>
              <div>
                <span className="eyebrow mb-3">Bestsellers</span>
                <h2 className="display text-3xl md:text-5xl font-bold mt-4 leading-tight text-ink">
                  Customer <span className="gold-text">favorites.</span>
                </h2>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <Link
                href="/products"
                className="group inline-flex items-center gap-2 text-gold-600 hover:text-gold-700 font-medium transition-colors"
              >
                Shop all
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </Reveal>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {featured.slice(0, 10).map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* SHOWCASE BAND */}
      <section className="relative py-20 overflow-hidden">
        <div className="section grid lg:grid-cols-2 gap-12 items-center">
          <Reveal>
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-soft-lg">
              <Image
                src="/site/fresh-groceries.jpg"
                alt="Fresh groceries"
                fill
                sizes="(min-width:1024px) 50vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-shade/80 to-transparent">
                <span className="text-[11px] uppercase tracking-[0.3em] text-gold-300 font-semibold">
                  Fresh Daily
                </span>
                <h3 className="font-display text-2xl md:text-3xl font-semibold mt-3 text-white">
                  Farm to your table, every day
                </h3>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="space-y-6">
              <span className="eyebrow">Our Promise</span>
              <h3 className="display text-3xl md:text-4xl font-bold leading-tight text-ink">
                Quality you can <span className="gold-text">trust</span>. Prices
                you&apos;ll love.
              </h3>
              <p className="text-ink-soft text-lg leading-relaxed">
                We source directly from farmers and trusted suppliers to bring
                you the freshest groceries at fair prices. Every product is
                quality-checked before it reaches your doorstep.
              </p>
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-ink/10">
                {[
                  { v: 98, s: "%", l: "on-time delivery" },
                  { v: 4, s: "hr", l: "avg. delivery" },
                  { v: 100, s: "%", l: "quality assured" },
                ].map((s) => (
                  <div key={s.l}>
                    <div className="font-display text-3xl font-bold text-ink">
                      <Counter to={s.v} suffix={s.s} />
                    </div>
                    <p className="text-xs text-ink-mute mt-1">{s.l}</p>
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
      <section className="section py-20">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="eyebrow mb-3">Happy Customers</span>
            <h2 className="display text-3xl md:text-5xl font-bold mt-4 leading-tight text-ink">
              Loved by <span className="gold-text">families.</span>
            </h2>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {testimonials.map((t, i) => (
            <Reveal key={t.id} delay={i * 0.06}>
              <figure className="card p-6 h-full flex flex-col card-hover">
                <div className="flex gap-0.5 text-gold-500 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <span key={j}>★</span>
                  ))}
                </div>
                <blockquote className="text-ink-soft leading-relaxed flex-1">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 pt-4 border-t border-ink/10">
                  <span className="w-10 h-10 rounded-full bg-gold-500/15 flex items-center justify-center text-gold-700 font-semibold">
                    {t.name.charAt(0)}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-ink">{t.name}</p>
                    <p className="text-xs text-ink-mute">{t.role}</p>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="section pt-8 pb-28">
        <Reveal>
          <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-brand-green-700 to-brand-green-900 p-10 md:p-16 text-center">
            <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-gold-500/20 blur-3xl" />
            <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-gold-400/10 blur-3xl" />
            <div className="relative">
              <span className="text-[11px] uppercase tracking-[0.3em] text-gold-300 font-semibold">
                Weekly Deals
              </span>
              <h2 className="display text-3xl md:text-5xl font-bold mt-6 max-w-3xl mx-auto leading-tight text-white">
                Save more. <span className="text-gold-300">Eat fresh.</span>
              </h2>
              <p className="mt-5 text-white/80 max-w-xl mx-auto">
                Subscribe to our newsletter for exclusive deals, weekly offers,
                and updates on new products. Fresh savings to your inbox!
              </p>
              <NewsletterForm />
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
