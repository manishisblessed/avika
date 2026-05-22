"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useSearch } from "@/store/search";
import { products } from "@/data/products";
import { formatPrice } from "@/lib/utils";

export default function SearchModal() {
  const { isOpen, close } = useSearch();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        useSearch.getState().toggle();
      }
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [close]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      )
      .slice(0, 8);
  }, [query]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[70]"
          />
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl z-[71] px-4"
          >
            <div className="glass-strong rounded-2xl overflow-hidden border border-white/10">
              <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5">
                <Search size={18} className="text-ink/50 flex-shrink-0" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products, brands..."
                  className="flex-1 bg-transparent text-ink placeholder:text-ink/40 focus:outline-none text-lg"
                />
                <kbd className="hidden sm:inline-flex px-2 py-0.5 text-[10px] rounded border border-white/10 text-ink/40">
                  ESC
                </kbd>
                <button onClick={close} className="p-1 text-ink/50 hover:text-ink">
                  <X size={18} />
                </button>
              </div>

              <div className="max-h-[60vh] overflow-y-auto">
                {query.trim() === "" ? (
                  <div className="p-6 text-center text-ink/50 text-sm">
                    <p>Type to search across all products</p>
                    <p className="mt-1 text-[11px] text-ink/30">
                      Tip: Use Ctrl+K to open search anytime
                    </p>
                  </div>
                ) : results.length === 0 ? (
                  <div className="p-6 text-center text-ink/50">
                    <p className="font-display text-xl text-ink">No results</p>
                    <p className="text-sm mt-1">
                      Try a different search term
                    </p>
                  </div>
                ) : (
                  <ul className="py-2">
                    {results.map((product) => (
                      <li key={product.id}>
                        <Link
                          href={`/products/${product.id}`}
                          onClick={close}
                          className="flex items-center gap-4 px-5 py-3 hover:bg-white/5 transition-colors"
                        >
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-bg-card">
                            <Image
                              src={product.images[0].replace("w=1200", "w=96")}
                              alt={product.name}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-ink truncate">
                              {product.name}
                            </p>
                            <p className="text-xs text-ink/50">{product.brand}</p>
                          </div>
                          <span className="text-sm font-display gold-text flex-shrink-0">
                            {formatPrice(product.price)}
                          </span>
                        </Link>
                      </li>
                    ))}
                    <li className="px-5 py-3 border-t border-white/5">
                      <Link
                        href={`/products?search=${encodeURIComponent(query)}`}
                        onClick={close}
                        className="flex items-center justify-center gap-2 text-sm text-gold-300 hover:text-gold-200"
                      >
                        View all results <ArrowRight size={14} />
                      </Link>
                    </li>
                  </ul>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
