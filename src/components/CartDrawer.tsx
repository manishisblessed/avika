"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { productImageSrc } from "@/lib/product-images";
import { Minus, Plus, X, ShoppingBag } from "lucide-react";

export default function CartDrawer() {
  const { isOpen, close, items, removeItem, updateQty, subtotal, totalItems } =
    useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 bg-shade/40 backdrop-blur-sm z-[60]"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 280, damping: 32 }}
            className="fixed top-0 right-0 bottom-0 w-full sm:max-w-md z-[61] bg-bg-card border-l border-ink/10 shadow-soft-lg flex flex-col"
          >
            <header className="flex items-center justify-between px-6 py-5 border-b border-ink/8">
              <div>
                <h3 className="font-display text-xl font-bold text-ink">Your Bag</h3>
                <p className="text-xs text-ink-mute mt-0.5">
                  {totalItems()} {totalItems() === 1 ? "item" : "items"}
                </p>
              </div>
              <button
                onClick={close}
                aria-label="Close cart"
                className="p-2 rounded-full text-ink-soft hover:bg-bg-soft"
              >
                <X size={18} />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-ink-soft gap-4">
                  <div className="p-5 rounded-full bg-gold-500/10 border border-gold-500/20">
                    <ShoppingBag size={32} className="text-gold-600" />
                  </div>
                  <p className="font-display text-xl font-bold text-ink">Your bag awaits</p>
                  <p className="text-sm max-w-xs">
                    Add a few finds and we&apos;ll get them to your door.
                  </p>
                  <Link
                    href="/products"
                    onClick={close}
                    className="btn-gold mt-2"
                  >
                    Start shopping
                  </Link>
                </div>
              ) : (
                <ul className="space-y-4">
                  <AnimatePresence initial={false}>
                    {items.map(({ product, qty }) => (
                      <motion.li
                        key={product.id}
                        layout
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 60 }}
                        className="flex gap-4 p-3 rounded-2xl border border-ink/10 bg-bg-soft"
                      >
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-white">
                          <Image
                            src={productImageSrc(product.images)}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] uppercase tracking-widest text-ink-mute">
                            {product.brand}
                          </p>
                          <Link
                            href={`/products/${product.id}`}
                            onClick={close}
                            className="block text-sm text-ink hover:text-gold-700 line-clamp-1"
                          >
                            {product.name}
                          </Link>
                          <div className="mt-2 flex items-center justify-between">
                            <div className="inline-flex items-center border border-ink/15 rounded-full bg-white">
                              <button
                                onClick={() =>
                                  updateQty(product.id, Math.max(0, qty - 1))
                                }
                                aria-label="Decrease quantity"
                                className="p-1.5 text-ink-soft hover:text-gold-600"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="px-2 text-xs w-6 text-center">
                                {qty}
                              </span>
                              <button
                                onClick={() => updateQty(product.id, qty + 1)}
                                aria-label="Increase quantity"
                                className="p-1.5 text-ink-soft hover:text-gold-600"
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                            <p className="text-sm font-semibold text-ink">
                              {formatPrice(product.price * qty)}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeItem(product.id)}
                          aria-label="Remove item"
                          className="self-start p-1 text-ink-mute hover:text-rose-500"
                        >
                          <X size={14} />
                        </button>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <footer className="px-6 py-5 border-t border-ink/8 space-y-4 bg-bg-card">
                <div className="flex items-baseline justify-between">
                  <span className="text-ink-soft text-sm">Subtotal</span>
                  <span className="font-display text-2xl font-bold text-ink">
                    {formatPrice(subtotal())}
                  </span>
                </div>
                <p className="text-[11px] text-ink-mute">
                  Shipping &amp; taxes calculated at checkout.
                </p>
                <Link
                  href="/checkout"
                  onClick={close}
                  className="btn-gold w-full"
                >
                  Checkout
                </Link>
                <Link
                  href="/cart"
                  onClick={close}
                  className="btn-ghost w-full"
                >
                  View Cart
                </Link>
              </footer>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
