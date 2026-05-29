"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useSearch } from "@/store/search";
import { formatPrice } from "@/lib/utils";
import { productImageSrc } from "@/lib/product-images";
import type { Product } from "@/types/catalog";

export default function SearchModal() {
  const { isOpen, close } = useSearch();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setResults([]);
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

  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, {
          signal: ctrl.signal,
        });
        const data = await res.json();
        setResults(data.results ?? []);
      } catch {
        /* aborted */
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => {
      ctrl.abort();
      clearTimeout(t);
    };
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
            className="fixed inset-0 bg-shade/40 backdrop-blur-sm z-[70]"
          />
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.22 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl z-[71] px-4"
          >
            <div className="bg-bg-card rounded-2xl overflow-hidden border border-ink/10 shadow-soft-lg">
              <div className="flex items-center gap-3 px-5 py-4 border-b border-ink/8">
                {loading ? (
                  <Loader2 size={18} className="text-gold-500 animate-spin flex-shrink-0" />
                ) : (
                  <Search size={18} className="text-ink-mute flex-shrink-0" />
                )}
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products, brands..."
                  aria-label="Search products"
                  className="flex-1 bg-transparent text-ink placeholder:text-ink/40 focus:outline-none text-lg"
                />
                <kbd className="hidden sm:inline-flex px-2 py-0.5 text-[10px] rounded border border-ink/15 text-ink-mute">
                  ESC
                </kbd>
                <button
                  onClick={close}
                  aria-label="Close search"
                  className="p-1 text-ink-mute hover:text-ink"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="max-h-[60vh] overflow-y-auto">
                {query.trim() === "" ? (
                  <div className="p-6 text-center text-ink-mute text-sm">
                    <p>Type to search across all products</p>
                    <p className="mt-1 text-[11px] text-ink/30">
                      Tip: Use Ctrl+K to open search anytime
                    </p>
                  </div>
                ) : !loading && results.length === 0 ? (
                  <div className="p-6 text-center text-ink-mute">
                    <p className="font-display text-lg font-semibold text-ink">
                      No results
                    </p>
                    <p className="text-sm mt-1">Try a different search term</p>
                  </div>
                ) : (
                  <ul className="py-2">
                    {results.map((product) => (
                      <li key={product.id}>
                        <Link
                          href={`/products/${product.id}`}
                          onClick={close}
                          className="flex items-center gap-4 px-5 py-3 hover:bg-bg-soft transition-colors"
                        >
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-bg-soft">
                            <Image
                              src={productImageSrc(product.images)}
                              alt={product.name}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-ink truncate">{product.name}</p>
                            <p className="text-xs text-ink-mute">{product.brand}</p>
                          </div>
                          <span className="text-sm font-display font-semibold text-ink flex-shrink-0">
                            {formatPrice(product.price)}
                          </span>
                        </Link>
                      </li>
                    ))}
                    {results.length > 0 && (
                      <li className="px-5 py-3 border-t border-ink/8">
                        <Link
                          href={`/products?search=${encodeURIComponent(query)}`}
                          onClick={close}
                          className="flex items-center justify-center gap-2 text-sm text-gold-600 hover:text-gold-700 font-medium"
                        >
                          View all results <ArrowRight size={14} />
                        </Link>
                      </li>
                    )}
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
