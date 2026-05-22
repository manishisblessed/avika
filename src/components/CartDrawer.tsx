"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 280, damping: 32 }}
            className="fixed top-0 right-0 bottom-0 w-full sm:max-w-md z-[61] glass-strong border-l border-white/10 flex flex-col"
          >
            <header className="flex items-center justify-between px-6 py-5 border-b border-white/5">
              <div>
                <h3 className="font-display text-2xl">Your Bag</h3>
                <p className="text-xs text-ink/60 mt-0.5">
                  {totalItems()} {totalItems() === 1 ? "item" : "items"}
                </p>
              </div>
              <button
                onClick={close}
                aria-label="Close cart"
                className="p-2 rounded-full hover:bg-white/5"
              >
                <X size={18} />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-ink/60 gap-4">
                  <div className="p-5 rounded-full bg-white/5 border border-white/10">
                    <ShoppingBag size={32} className="text-gold-400" />
                  </div>
                  <p className="font-display text-2xl text-ink">Your bag awaits</p>
                  <p className="text-sm max-w-xs">
                    Add a few finds and we'll wrap them up beautifully.
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
                        className="flex gap-4 p-3 rounded-2xl border border-white/5 bg-white/[0.02]"
                      >
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-bg-card">
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] uppercase tracking-widest text-ink/50">
                            {product.brand}
                          </p>
                          <Link
                            href={`/products/${product.id}`}
                            onClick={close}
                            className="block text-sm text-ink hover:text-gold-300 line-clamp-1"
                          >
                            {product.name}
                          </Link>
                          <div className="mt-2 flex items-center justify-between">
                            <div className="inline-flex items-center border border-white/10 rounded-full">
                              <button
                                onClick={() =>
                                  updateQty(product.id, Math.max(0, qty - 1))
                                }
                                className="p-1.5 hover:text-gold-400"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="px-2 text-xs w-6 text-center">
                                {qty}
                              </span>
                              <button
                                onClick={() => updateQty(product.id, qty + 1)}
                                className="p-1.5 hover:text-gold-400"
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                            <p className="text-sm text-gold-300">
                              {formatPrice(product.price * qty)}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeItem(product.id)}
                          className="self-start p-1 text-ink/40 hover:text-rose-400"
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
              <footer className="px-6 py-5 border-t border-white/5 space-y-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-ink/70 text-sm">Subtotal</span>
                  <span className="font-display text-2xl gold-text">
                    {formatPrice(subtotal())}
                  </span>
                </div>
                <p className="text-[11px] text-ink/50">
                  Shipping & taxes calculated at checkout.
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
