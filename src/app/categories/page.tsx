import { getCategories, getCatalogStats } from "@/lib/catalog";
import CategoryCard from "@/components/CategoryCard";

export const revalidate = 300;

export const metadata = {
  title: "Categories — Shop by aisle",
};

export default async function CategoriesPage() {
  const [categories, stats] = await Promise.all([
    getCategories(),
    getCatalogStats(),
  ]);

  return (
    <div className="pt-32 pb-24">
      <section className="section">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="eyebrow mb-3">Browse</span>
          <h1 className="display text-4xl md:text-5xl font-bold mt-4 leading-tight text-ink">
            All <span className="gold-text">categories.</span>
          </h1>
          <p className="mt-4 text-ink-soft">
            {stats.categories} categories · {stats.products} products in stock
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {categories.map((c, i) => (
            <CategoryCard key={c.id} category={c} index={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
