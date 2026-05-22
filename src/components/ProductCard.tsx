"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, Plus, ShoppingBag } from "lucide-react";
import type { Product } from "@/data/products";
import { useCart } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { useRef } from "react";

function thumbnailUrl(url: string): string {
  if (url.includes("unsplash.com")) {
    return url.replace(/w=\d+/, "w=400").replace(/q=\d+/, "q=75");
  }
  return url;
}

export default function ProductCard({
  product,
  index = 0,
}: {
  product: Product;
  index?: number;
}) {
  const addItem = useCart((s) => s.addItem);
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    const rx = (0.5 - y) * 6;
    const ry = (x - 0.5) * 8;
    el.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
  };

  const handleMouseLeave = () => {
    if (ref.current)
      ref.current.style.transform =
        "perspective(1000px) rotateX(0deg) rotateY(0deg)";
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: index * 0.04, ease: "easeOut" }}
      className="group tilt"
    >
      <div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="tilt-inner relative rounded-2xl overflow-hidden bg-bg-card border border-white/5 card-hover h-full flex flex-col"
      >
        <Link href={`/products/${product.id}`} className="block">
          <div className="relative aspect-square overflow-hidden">
            <Image
              src={thumbnailUrl(product.images[0])}
              alt={product.name}
              fill
              sizes="(min-width:1280px) 20vw, (min-width:1024px) 25vw, (min-width:640px) 33vw, 50vw"
              className="object-cover transition-all duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg/70 via-transparent to-transparent" />
            {product.badge && (
              <span className="absolute top-2.5 left-2.5 px-2 py-0.5 text-[9px] uppercase tracking-widest rounded-full bg-bg/80 backdrop-blur-sm border border-gold-500/40 text-gold-300 font-semibold">
                {product.badge}
              </span>
            )}
            {discount > 0 && (
              <span className="absolute top-2.5 right-2.5 px-2 py-0.5 text-[9px] uppercase tracking-widest rounded-full bg-rose-500/90 text-white font-bold">
                {discount}% off
              </span>
            )}
            <button
              aria-label="Add to bag"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                addItem(product, 1);
              }}
              className="absolute bottom-2.5 right-2.5 inline-flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-gold-400 to-gold-700 text-bg shadow-gold-sm opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:scale-110"
            >
              <Plus size={16} strokeWidth={2.5} />
            </button>
          </div>
        </Link>

        <div className="p-4 flex flex-col flex-1">
          <p className="text-[9px] uppercase tracking-[0.25em] text-ink/50">
            {product.brand}
          </p>
          <Link href={`/products/${product.id}`}>
            <h3 className="mt-0.5 font-display text-lg text-ink leading-snug group-hover:text-gold-300 transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>
          {product.unit && (
            <p className="text-[10px] text-ink/40 mt-0.5">{product.unit}</p>
          )}
          <div className="mt-1 flex items-center gap-1.5 text-xs text-ink/60">
            <Star size={11} className="text-gold-400 fill-gold-400" />
            <span>{product.rating}</span>
            <span className="text-ink/30">·</span>
            <span>{product.reviews.toLocaleString("en-IN")} reviews</span>
          </div>
          <div className="mt-auto pt-3 flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="font-display text-lg gold-text">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-[11px] text-ink/40 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            <button
              aria-label="Add to bag"
              onClick={(e) => {
                e.preventDefault();
                addItem(product, 1);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] uppercase tracking-wider font-semibold bg-gold-500/10 border border-gold-500/30 text-gold-300 hover:bg-gold-500/20 hover:border-gold-500/50 transition-all"
            >
              <ShoppingBag size={12} />
              Add
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
