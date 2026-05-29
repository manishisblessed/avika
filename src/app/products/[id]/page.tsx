import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Truck, RotateCcw, ShieldCheck } from "lucide-react";

import {
  getFeaturedProducts,
  getProductById,
  getRelatedProducts,
} from "@/lib/catalog";
import ProductCard from "@/components/ProductCard";
import ProductDetailClient from "@/components/ProductDetailClient";

export const revalidate = 300;

// Pre-render the popular (featured) products at build time; the rest are
// generated on-demand via ISR (dynamicParams defaults to true).
export async function generateStaticParams() {
  const featured = await getFeaturedProducts(24);
  return featured.map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const product = await getProductById(params.id);
  if (!product) return { title: "Product not found" };
  return {
    title: `${product.name} — ${product.brand}`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images?.length ? [{ url: product.images[0] }] : undefined,
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await getProductById(params.id);
  if (!product) notFound();

  const related = await getRelatedProducts(product.category, product.id, 5);

  return (
    <div className="pt-32 pb-24">
      <section className="section">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm text-ink-soft hover:text-gold-600 mb-8"
        >
          <ArrowLeft size={14} />
          Back to shop
        </Link>

        <ProductDetailClient product={product} />

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl">
          {[
            { icon: Truck, t: "Free delivery over ₹499" },
            { icon: RotateCcw, t: "Easy returns" },
            { icon: ShieldCheck, t: "Quality assured" },
          ].map((b) => (
            <div
              key={b.t}
              className="card p-4 flex items-center gap-3 text-sm text-ink-soft"
            >
              <b.icon size={18} className="text-gold-600 flex-shrink-0" />
              {b.t}
            </div>
          ))}
        </div>

        {related.length > 0 && (
          <div className="mt-24">
            <h2 className="display text-2xl md:text-3xl font-bold mb-8 text-ink">
              You may also <span className="gold-text">love</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
