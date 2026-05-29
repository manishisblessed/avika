"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, Plus } from "lucide-react";
import type { Product } from "@/types/catalog";
import { useCart } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { productImageSrc } from "@/lib/product-images";

export default function ProductCard({
  product,
}: {
  product: Product;
  index?: number;
}) {
  const addItem = useCart((s) => s.addItem);

  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100,
      )
    : 0;

  const outOfStock = product.stock <= 0;

  return (
    <article className="group card card-hover h-full flex flex-col overflow-hidden">
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-bg-soft">
          <Image
            src={productImageSrc(product.images)}
            alt={product.name}
            fill
            sizes="(min-width:1280px) 20vw, (min-width:1024px) 25vw, (min-width:640px) 33vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          {product.badge && (
            <span className="absolute top-2.5 left-2.5 px-2 py-0.5 text-[9px] uppercase tracking-widest rounded-full bg-white/90 border border-gold-500/40 text-gold-700 font-semibold">
              {product.badge}
            </span>
          )}
          {discount > 0 && (
            <span className="absolute top-2.5 right-2.5 px-2 py-0.5 text-[10px] rounded-full bg-rose-500 text-white font-bold">
              {discount}% OFF
            </span>
          )}
          {outOfStock && (
            <span className="absolute inset-0 bg-white/60 flex items-center justify-center text-ink font-semibold text-sm">
              Out of stock
            </span>
          )}
        </div>
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <p className="text-[10px] uppercase tracking-[0.18em] text-ink-mute">
          {product.brand}
        </p>
        <Link href={`/products/${product.id}`}>
          <h3 className="mt-0.5 font-display text-[15px] font-semibold text-ink leading-snug group-hover:text-gold-700 transition-colors line-clamp-2 min-h-[2.6em]">
            {product.name}
          </h3>
        </Link>
        {product.unit && (
          <p className="text-[11px] text-ink-mute mt-0.5">{product.unit}</p>
        )}
        <div className="mt-1 flex items-center gap-1.5 text-xs text-ink-soft">
          <Star size={11} className="text-gold-500 fill-gold-500" />
          <span className="font-medium text-ink">{product.rating}</span>
          <span className="text-ink/30">·</span>
          <span>{product.reviews.toLocaleString("en-IN")}</span>
        </div>

        <div className="mt-auto pt-3 flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-1.5">
            <span className="font-display text-lg font-bold text-ink">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-[11px] text-ink-mute line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          <button
            aria-label={`Add ${product.name} to bag`}
            disabled={outOfStock}
            onClick={() => addItem(product, 1)}
            className="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-full text-xs font-semibold bg-gold-500 text-white hover:bg-gold-600 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Plus size={14} strokeWidth={2.5} />
            Add
          </button>
        </div>
      </div>
    </article>
  );
}
