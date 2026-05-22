"use client";

import { useMemo, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";

import { products } from "@/data/products";
import { categories } from "@/data/categories";
import ProductCard from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";

function ProductsView() {
  const router = useRouter();
  const params = useSearchParams();
  const initialCat = params.get("category") || "all";

  const [activeCat, setActiveCat] = useState<string>(initialCat);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"featured" | "price-asc" | "price-desc" | "rating">(
    "featured",
  );
  const [maxPrice, setMaxPrice] = useState<number>(5000);

  const filtered = useMemo(() => {
    let list = products.slice();
    if (activeCat !== "all") list = list.filter((p) => p.category === activeCat);
    if (search.trim())
      list = list.filter((p) =>
        (p.name + " " + p.brand).toLowerCase().includes(search.toLowerCase()),
      );
    list = list.filter((p) => p.price <= maxPrice);
    switch (sort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list.sort((a, b) => b.rating - a.rating);
        break;
    }
    return list;
  }, [activeCat, search, sort, maxPrice]);

  const handleCat = (id: string) => {
    setActiveCat(id);
    const url = id === "all" ? "/products" : `/products?category=${id}`;
    router.replace(url, { scroll: false });
  };

  return (
    <div className="pt-36 pb-24">
      <section className="section">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="eyebrow mb-3">The Shop</span>
              <h1 className="display text-5xl md:text-6xl mt-5 leading-tight">
                {activeCat === "all"
                  ? "Everything in store"
                  : categories.find((c) => c.id === activeCat)?.name}
              </h1>
              <p className="mt-4 text-ink/65">
                {filtered.length} pieces · curated for you
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40"
                />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name or brand"
                  className="bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-3 text-sm w-72 max-w-full placeholder:text-ink/40 focus:outline-none focus:border-gold-500/60"
                />
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <FilterChip
              label="All"
              active={activeCat === "all"}
              onClick={() => handleCat("all")}
            />
            {categories.map((c) => (
              <FilterChip
                key={c.id}
                label={c.name}
                active={activeCat === c.id}
                onClick={() => handleCat(c.id)}
              />
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="glass rounded-2xl p-5 mb-10 flex flex-col md:flex-row md:items-center gap-5">
            <div className="flex items-center gap-2 text-ink/60 text-sm">
              <SlidersHorizontal size={14} />
              <span>Refine</span>
            </div>
            <div className="flex-1 flex flex-wrap items-center gap-5">
              <label className="flex items-center gap-3 text-sm text-ink/70">
                <span>Max price</span>
                <input
                  type="range"
                  min={50}
                  max={5000}
                  step={50}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="accent-gold-500 w-44"
                />
                <span className="text-gold-300 w-20">₹{maxPrice}</span>
              </label>
              <label className="flex items-center gap-3 text-sm text-ink/70 ml-auto">
                <span>Sort</span>
                <select
                  value={sort}
                  onChange={(e) =>
                    setSort(e.target.value as typeof sort)
                  }
                  className="bg-bg-card border border-white/10 rounded-full px-4 py-1.5 text-sm focus:outline-none focus:border-gold-500/60"
                >
                  <option value="featured">Featured</option>
                  <option value="price-asc">Price · low to high</option>
                  <option value="price-desc">Price · high to low</option>
                  <option value="rating">Top rated</option>
                </select>
              </label>
            </div>
          </div>
        </Reveal>

        {filtered.length === 0 ? (
          <div className="text-center py-24 text-ink/60">
            <p className="font-display text-3xl text-ink mb-2">
              No matches.
            </p>
            <p>Try widening the price range or clearing your search.</p>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
          >
            {filtered.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </motion.div>
        )}
      </section>
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative px-4 py-2 text-xs uppercase tracking-widest rounded-full border transition-all",
        active
          ? "border-gold-500/60 text-gold-300 bg-gold-500/10"
          : "border-white/10 text-ink/70 hover:border-white/20 hover:text-ink",
      )}
    >
      {label}
    </button>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="pt-36 pb-24 section text-ink/60">Loading…</div>
      }
    >
      <ProductsView />
    </Suspense>
  );
}
