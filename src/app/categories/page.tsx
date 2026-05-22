"use client";

import { categories } from "@/data/categories";
import CategoryCard from "@/components/CategoryCard";
import { Reveal } from "@/components/Reveal";

export default function CategoriesPage() {
  return (
    <div className="pt-36 pb-24">
      <section className="section">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="eyebrow mb-3">Browse</span>
            <h1 className="display text-4xl md:text-6xl mt-5 leading-tight">
              All <span className="gold-text">categories.</span>
            </h1>
            <p className="mt-4 text-ink/70">
              {categories.length} categories · {categories.reduce((n, c) => n + c.count, 0)}+ products
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {categories.map((c, i) => (
            <CategoryCard key={c.id} category={c} index={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
