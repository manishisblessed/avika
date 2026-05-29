"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, Loader2 } from "lucide-react";
import type { Category, ProductSort } from "@/types/catalog";
import { cn } from "@/lib/utils";

export default function ProductFilters({
  categories,
}: {
  categories: Category[];
}) {
  const router = useRouter();
  const params = useSearchParams();

  const activeCat = params.get("category") ?? "all";
  const sort = (params.get("sort") as ProductSort) ?? "featured";
  const maxPrice = Number(params.get("maxPrice") ?? 5000);

  const [search, setSearch] = useState(params.get("search") ?? "");
  const [price, setPrice] = useState(maxPrice);
  const [isPending, startTransition] = useTransition();

  const pushParams = (next: Record<string, string | number | null>) => {
    const sp = new URLSearchParams(Array.from(params.entries()));
    Object.entries(next).forEach(([k, v]) => {
      if (v === null || v === "" || v === "all") sp.delete(k);
      else sp.set(k, String(v));
    });
    sp.delete("page");
    startTransition(() => {
      router.replace(`/products${sp.toString() ? `?${sp.toString()}` : ""}`, {
        scroll: false,
      });
    });
  };

  // Debounce the search box.
  useEffect(() => {
    const current = params.get("search") ?? "";
    if (search === current) return;
    const t = setTimeout(() => pushParams({ search: search || null }), 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="relative w-full md:w-80">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-mute"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or brand"
            aria-label="Search products"
            className="w-full bg-white border border-ink/15 rounded-full pl-10 pr-9 py-3 text-sm text-ink placeholder:text-ink/40 focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/30"
          />
          {isPending && (
            <Loader2
              size={15}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gold-500 animate-spin"
            />
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-6">
        <Chip
          label="All"
          active={activeCat === "all"}
          onClick={() => pushParams({ category: null })}
        />
        {categories.map((c) => (
          <Chip
            key={c.id}
            label={`${c.name} (${c.count})`}
            active={activeCat === c.id}
            onClick={() => pushParams({ category: c.id })}
          />
        ))}
      </div>

      <div className="card p-5 mb-10 flex flex-col md:flex-row md:items-center gap-5">
        <div className="flex items-center gap-2 text-ink-soft text-sm font-medium">
          <SlidersHorizontal size={14} />
          <span>Refine</span>
        </div>
        <div className="flex-1 flex flex-wrap items-center gap-5">
          <label className="flex items-center gap-3 text-sm text-ink-soft">
            <span>Max price</span>
            <input
              type="range"
              min={50}
              max={5000}
              step={50}
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              onMouseUp={() => pushParams({ maxPrice: price })}
              onTouchEnd={() => pushParams({ maxPrice: price })}
              className="accent-gold-500 w-44"
            />
            <span className="text-gold-700 font-semibold w-20">₹{price}</span>
          </label>
          <label className="flex items-center gap-3 text-sm text-ink-soft md:ml-auto">
            <span>Sort</span>
            <select
              value={sort}
              onChange={(e) => pushParams({ sort: e.target.value })}
              className="bg-white border border-ink/15 rounded-full px-4 py-1.5 text-sm text-ink focus:outline-none focus:border-gold-500"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price · low to high</option>
              <option value="price-desc">Price · high to low</option>
              <option value="rating">Top rated</option>
            </select>
          </label>
        </div>
      </div>
    </div>
  );
}

function Chip({
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
        "px-3.5 py-2 text-xs font-medium rounded-full border transition-all",
        active
          ? "border-gold-500 text-white bg-gold-500"
          : "border-ink/12 text-ink-soft bg-white hover:border-gold-500/50 hover:text-ink",
      )}
    >
      {label}
    </button>
  );
}
