import Link from "next/link";
import { getCategories, getProducts } from "@/lib/catalog";
import type { ProductSort } from "@/types/catalog";
import ProductCard from "@/components/ProductCard";
import ProductFilters from "@/components/ProductFilters";
import { cn } from "@/lib/utils";

export const revalidate = 0;

type SearchParams = {
  category?: string;
  search?: string;
  sort?: string;
  maxPrice?: string;
  page?: string;
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const page = Math.max(1, Number(searchParams.page ?? 1) || 1);
  const maxPrice = searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined;
  const sort = (searchParams.sort as ProductSort) || "featured";
  const category = searchParams.category ?? "all";
  const search = searchParams.search ?? "";

  const [categories, result] = await Promise.all([
    getCategories(),
    getProducts({ category, search, sort, maxPrice, page, pageSize: 24 }),
  ]);

  const activeCategory = categories.find((c) => c.id === category);
  const title =
    category === "all" ? "Everything in store" : activeCategory?.name ?? "Products";

  const buildHref = (p: number) => {
    const sp = new URLSearchParams();
    if (category !== "all") sp.set("category", category);
    if (search) sp.set("search", search);
    if (sort !== "featured") sp.set("sort", sort);
    if (maxPrice) sp.set("maxPrice", String(maxPrice));
    if (p > 1) sp.set("page", String(p));
    return `/products${sp.toString() ? `?${sp.toString()}` : ""}`;
  };

  const pages = Array.from({ length: result.pageCount }, (_, i) => i + 1).filter(
    (n) => n === 1 || n === result.pageCount || Math.abs(n - result.page) <= 1,
  );

  return (
    <div className="pt-32 pb-24">
      <section className="section">
        <div className="mb-10">
          <span className="eyebrow mb-3">The Shop</span>
          <h1 className="display text-4xl md:text-5xl font-bold mt-4 leading-tight text-ink">
            {title}
          </h1>
          <p className="mt-3 text-ink-soft">
            {result.total} products
            {result.pageCount > 1 ? ` · page ${result.page} of ${result.pageCount}` : ""}
          </p>
        </div>

        <ProductFilters categories={categories} />

        {result.products.length === 0 ? (
          <div className="text-center py-24 text-ink-soft">
            <p className="font-display text-2xl font-semibold text-ink mb-2">
              No matches.
            </p>
            <p>Try widening the price range or clearing your search.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {result.products.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>

            {result.pageCount > 1 && (
              <nav
                className="mt-12 flex flex-wrap items-center justify-center gap-2"
                aria-label="Pagination"
              >
                {result.page > 1 && (
                  <Link href={buildHref(result.page - 1)} className="pagination-btn">
                    Previous
                  </Link>
                )}
                {pages.map((n, idx) => {
                  const prev = pages[idx - 1];
                  const gap = prev && n - prev > 1;
                  return (
                    <span key={n} className="flex items-center gap-2">
                      {gap && <span className="px-1 text-ink-mute">…</span>}
                      <Link
                        href={buildHref(n)}
                        className={cn(
                          "pagination-btn",
                          n === result.page &&
                            "border-gold-500 text-white bg-gold-500",
                        )}
                        aria-current={n === result.page ? "page" : undefined}
                      >
                        {n}
                      </Link>
                    </span>
                  );
                })}
                {result.page < result.pageCount && (
                  <Link href={buildHref(result.page + 1)} className="pagination-btn">
                    Next
                  </Link>
                )}
              </nav>
            )}
          </>
        )}
      </section>
    </div>
  );
}
