"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, X, ArrowRight, ShoppingBag } from "lucide-react";

import { useCart } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { Reveal } from "@/components/Reveal";

export default function CartPage() {
  const { items, removeItem, updateQty, subtotal } = useCart();
  const ship = items.length > 0 ? (subtotal() > 499 ? 0 : 49) : 0;
  const tax = items.length > 0 ? subtotal() * 0.05 : 0;
  const total = subtotal() + ship + tax;

  return (
    <div className="pt-36 pb-24">
      <section className="section">
        <Reveal>
          <span className="eyebrow mb-3">Your Bag</span>
          <h1 className="display text-5xl md:text-6xl mt-5 leading-tight">
            Review your <span className="gold-text">selection.</span>
          </h1>
        </Reveal>

        {items.length === 0 ? (
          <Reveal delay={0.1}>
            <div className="mt-16 glass rounded-3xl p-16 text-center max-w-xl mx-auto">
              <div className="inline-flex p-5 rounded-full bg-white/5 border border-white/10 mb-6">
                <ShoppingBag size={32} className="text-gold-400" />
              </div>
              <h2 className="font-display text-3xl text-ink">Your bag is empty</h2>
              <p className="text-ink/60 mt-3">
                A few hand-picked finds and you'll be on your way.
              </p>
              <Link href="/products" className="btn-gold mt-8 inline-flex">
                Browse the shop
                <ArrowRight size={16} />
              </Link>
            </div>
          </Reveal>
        ) : (
          <div className="mt-12 grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence initial={false}>
                {items.map(({ product, qty }) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 60 }}
                    className="flex gap-5 p-5 rounded-2xl border border-white/5 bg-white/[0.02] card-hover"
                  >
                    <Link
                      href={`/products/${product.id}`}
                      className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-xl overflow-hidden flex-shrink-0 bg-bg-card"
                    >
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        sizes="128px"
                        className="object-cover"
                      />
                    </Link>
                    <div className="flex-1 min-w-0 flex flex-col">
                      <p className="text-[10px] uppercase tracking-widest text-ink/50">
                        {product.brand}
                      </p>
                      <Link
                        href={`/products/${product.id}`}
                        className="font-display text-xl text-ink hover:text-gold-300"
                      >
                        {product.name}
                      </Link>
                      <p className="text-sm text-ink/55 mt-1 line-clamp-1">
                        {product.description}
                      </p>
                      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4">
                        <div className="inline-flex items-center border border-white/10 rounded-full">
                          <button
                            onClick={() =>
                              updateQty(product.id, Math.max(0, qty - 1))
                            }
                            className="p-2 hover:text-gold-400"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="px-3 text-sm w-8 text-center">
                            {qty}
                          </span>
                          <button
                            onClick={() => updateQty(product.id, qty + 1)}
                            className="p-2 hover:text-gold-400"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <p className="font-display text-2xl gold-text">
                          {formatPrice(product.price * qty)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem(product.id)}
                      aria-label="Remove"
                      className="self-start p-2 text-ink/40 hover:text-rose-400"
                    >
                      <X size={16} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <aside className="lg:sticky lg:top-28 h-fit">
              <div className="glass rounded-2xl p-7 space-y-4">
                <h3 className="font-display text-2xl">Order Summary</h3>
                <Row label="Subtotal" value={formatPrice(subtotal())} />
                <Row
                  label="Shipping"
                  value={ship === 0 ? "Free" : formatPrice(ship)}
                />
                <Row label="Estimated tax" value={formatPrice(tax)} />
                <div className="h-px bg-white/10" />
                <div className="flex items-baseline justify-between">
                  <span className="text-ink">Total</span>
                  <span className="font-display text-3xl gold-text">
                    {formatPrice(total)}
                  </span>
                </div>
                <Link href="/checkout" className="btn-gold w-full mt-2">
                  Proceed to checkout
                  <ArrowRight size={16} />
                </Link>
                <p className="text-[11px] text-ink/50 text-center pt-2">
                  Free delivery on orders over ₹499.
                </p>
              </div>
            </aside>
          </div>
        )}
      </section>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-ink/65">{label}</span>
      <span className="text-ink">{value}</span>
    </div>
  );
}
