"use client";

import { useState, useRef, use } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Star,
  ShoppingBag,
  Heart,
  Truck,
  ShieldCheck,
  RotateCcw,
  Minus,
  Plus,
  ArrowLeft,
} from "lucide-react";

import { getProductById, products } from "@/data/products";
import { useCart } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import ProductCard from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const resolved =
    typeof (params as Promise<{ id: string }>).then === "function"
      ? use(params as Promise<{ id: string }>)
      : (params as { id: string });

  const product = getProductById(resolved.id);
  if (!product) notFound();

  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const addItem = useCart((s) => s.addItem);
  const imgRef = useRef<HTMLDivElement>(null);

  const handleAdd = () => {
    addItem(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = imgRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    const rx = (0.5 - y) * 6;
    const ry = (x - 0.5) * 8;
    el.style.transform = `perspective(1100px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  };
  const handleMouseLeave = () => {
    if (imgRef.current)
      imgRef.current.style.transform = "perspective(1100px) rotateX(0) rotateY(0)";
  };

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="pt-36 pb-24">
      <section className="section">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm text-ink/60 hover:text-gold-300 mb-8"
        >
          <ArrowLeft size={14} />
          Back to shop
        </Link>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Gallery */}
          <div>
            <Reveal>
              <div
                ref={imgRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="relative aspect-square rounded-3xl overflow-hidden bg-bg-card border border-white/5 transition-transform duration-300"
              >
                <motion.div
                  key={activeImg}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={product.images[activeImg]}
                    alt={product.name}
                    fill
                    sizes="(min-width:1024px) 50vw, 100vw"
                    priority
                    className="object-cover"
                  />
                </motion.div>
                {product.badge && (
                  <span className="absolute top-5 left-5 px-3 py-1 text-[10px] uppercase tracking-widest rounded-full bg-bg/70 backdrop-blur border border-gold-500/40 text-gold-300">
                    {product.badge}
                  </span>
                )}
              </div>
            </Reveal>
            {product.images.length > 1 && (
              <div className="mt-4 flex gap-3">
                {product.images.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      activeImg === i
                        ? "border-gold-500"
                        : "border-white/5 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image src={src} alt="" fill sizes="80px" className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <Reveal>
              <p className="text-[11px] uppercase tracking-[0.3em] text-gold-400/90">
                {product.brand}
              </p>
              <h1 className="display text-4xl md:text-5xl mt-3 leading-tight">
                {product.name}
              </h1>
              <div className="mt-4 flex items-center gap-3 text-sm text-ink/70">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star
                      key={j}
                      size={14}
                      className={
                        j < Math.round(product.rating)
                          ? "text-gold-400 fill-gold-400"
                          : "text-ink/20"
                      }
                    />
                  ))}
                </div>
                <span>{product.rating}</span>
                <span className="text-ink/30">·</span>
                <span>{product.reviews} reviews</span>
              </div>

              <div className="mt-6 flex items-baseline gap-4">
                <span className="font-display text-4xl gold-text">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-ink/40 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>

              <p className="mt-7 text-ink/75 leading-relaxed">
                {product.description}
              </p>

              <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {product.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2 text-sm text-ink/75"
                  >
                    <span className="mt-1.5 w-1 h-1 bg-gold-500 rounded-full flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <div className="mt-10 flex flex-wrap items-center gap-4">
                <div className="inline-flex items-center border border-white/10 rounded-full">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="p-3 hover:text-gold-400"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="px-3 w-8 text-center font-medium">{qty}</span>
                  <button
                    onClick={() => setQty(qty + 1)}
                    className="p-3 hover:text-gold-400"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <motion.button
                  onClick={handleAdd}
                  whileTap={{ scale: 0.96 }}
                  className="btn-gold flex-1 min-w-[180px]"
                >
                  <ShoppingBag size={18} />
                  {added ? "Added!" : `Add to bag · ${formatPrice(product.price * qty)}`}
                </motion.button>
                <button
                  aria-label="Wishlist"
                  className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-ink/70 hover:text-rose-400 hover:border-rose-400/40 transition-all"
                >
                  <Heart size={18} />
                </button>
              </div>

              <div className="mt-10 grid grid-cols-3 gap-4 pt-8 border-t border-white/5">
                {[
                  { icon: Truck, t: "Free delivery over ₹499" },
                  { icon: RotateCcw, t: "Easy returns" },
                  { icon: ShieldCheck, t: "Quality assured" },
                ].map((b) => (
                  <div
                    key={b.t}
                    className="flex flex-col items-center text-center gap-2 text-xs text-ink/60"
                  >
                    <b.icon size={18} className="text-gold-400" />
                    {b.t}
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-32">
            <Reveal>
              <h2 className="display text-3xl md:text-4xl mb-10">
                You may also <span className="gold-text">love</span>
              </h2>
            </Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
