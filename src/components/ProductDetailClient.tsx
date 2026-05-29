"use client";

import { useState } from "react";
import Image from "next/image";
import { ShoppingBag, Heart, Minus, Plus, Check } from "lucide-react";
import type { Product } from "@/types/catalog";
import { useCart } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { productImageSrc } from "@/lib/product-images";

export default function ProductDetailClient({ product }: { product: Product }) {
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [wished, setWished] = useState(false);
  const addItem = useCart((s) => s.addItem);

  const outOfStock = product.stock <= 0;

  const handleAdd = () => {
    addItem(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
      {/* Gallery */}
      <div>
        <div className="relative aspect-square rounded-3xl overflow-hidden bg-bg-soft border border-ink/10">
          <Image
            key={activeImg}
            src={productImageSrc(product.images, activeImg)}
            alt={product.name}
            fill
            sizes="(min-width:1024px) 50vw, 100vw"
            priority
            className="object-cover"
          />
          {product.badge && (
            <span className="absolute top-5 left-5 px-3 py-1 text-[10px] uppercase tracking-widest rounded-full bg-white/90 border border-gold-500/40 text-gold-700 font-semibold">
              {product.badge}
            </span>
          )}
        </div>
        {product.images.length > 1 && (
          <div className="mt-4 flex gap-3">
            {product.images.map((src, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                aria-label={`View image ${i + 1}`}
                className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                  activeImg === i
                    ? "border-gold-500"
                    : "border-ink/10 opacity-70 hover:opacity-100"
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
        <p className="text-[11px] uppercase tracking-[0.3em] text-gold-600 font-semibold">
          {product.brand}
        </p>
        <h1 className="display text-3xl md:text-4xl font-bold mt-3 leading-tight text-ink">
          {product.name}
        </h1>

        <div className="mt-6 flex items-baseline gap-4">
          <span className="font-display text-4xl font-bold text-ink">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-ink-mute line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
          {product.unit && (
            <span className="text-sm text-ink-mute">/ {product.unit}</span>
          )}
        </div>

        <p className="mt-2 text-sm">
          {outOfStock ? (
            <span className="text-rose-600 font-medium">Currently out of stock</span>
          ) : product.stock < 20 ? (
            <span className="text-gold-700 font-medium">
              Only {product.stock} left in stock
            </span>
          ) : (
            <span className="text-brand-green-600 font-medium">In stock</span>
          )}
        </p>

        <p className="mt-7 text-ink-soft leading-relaxed">{product.description}</p>

        <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2">
          {product.features.map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm text-ink-soft">
              <Check size={15} className="mt-0.5 text-brand-green-500 flex-shrink-0" />
              {f}
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <div className="inline-flex items-center border border-ink/15 rounded-full bg-white">
            <button
              onClick={() => setQty(Math.max(1, qty - 1))}
              aria-label="Decrease quantity"
              className="p-3 text-ink-soft hover:text-gold-600"
            >
              <Minus size={14} />
            </button>
            <span className="px-3 w-8 text-center font-medium">{qty}</span>
            <button
              onClick={() => setQty(qty + 1)}
              aria-label="Increase quantity"
              className="p-3 text-ink-soft hover:text-gold-600"
            >
              <Plus size={14} />
            </button>
          </div>
          <button
            onClick={handleAdd}
            disabled={outOfStock}
            className="btn-gold flex-1 min-w-[180px] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingBag size={18} />
            {added ? "Added!" : `Add to bag · ${formatPrice(product.price * qty)}`}
          </button>
          <button
            aria-label="Add to wishlist"
            aria-pressed={wished}
            onClick={() => setWished((w) => !w)}
            className="w-12 h-12 rounded-full border border-ink/15 bg-white flex items-center justify-center text-ink-soft hover:text-rose-500 hover:border-rose-400/50 transition-all"
          >
            <Heart size={18} className={wished ? "fill-rose-500 text-rose-500" : ""} />
          </button>
        </div>
      </div>
    </div>
  );
}
