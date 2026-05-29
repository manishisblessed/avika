import "server-only";
import { prisma } from "@/lib/prisma";
import type {
  Category,
  Product,
  ProductQuery,
  ProductSort,
} from "@/types/catalog";

type DbProduct = {
  id: string;
  name: string;
  brand: string;
  categoryId: string;
  price: number;
  originalPrice: number | null;
  rating: number;
  reviews: number;
  description: string;
  features: string[];
  images: string[];
  badge: string | null;
  stock: number;
  unit: string | null;
  featured: boolean;
};

function toProduct(p: DbProduct): Product {
  return {
    id: p.id,
    name: p.name,
    brand: p.brand,
    category: p.categoryId,
    price: p.price,
    originalPrice: p.originalPrice,
    rating: p.rating,
    reviews: p.reviews,
    description: p.description,
    features: p.features,
    images: p.images,
    badge: p.badge,
    stock: p.stock,
    unit: p.unit,
    featured: p.featured,
  };
}

const orderByForSort = (sort?: ProductSort) => {
  switch (sort) {
    case "price-asc":
      return [{ price: "asc" as const }];
    case "price-desc":
      return [{ price: "desc" as const }];
    case "rating":
      return [{ rating: "desc" as const }];
    default:
      return [{ featured: "desc" as const }, { sortOrder: "asc" as const }];
  }
};

export async function getCategories(): Promise<Category[]> {
  const [cats, grouped] = await Promise.all([
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.product.groupBy({ by: ["categoryId"], _count: { _all: true } }),
  ]);
  const counts = new Map(grouped.map((g) => [g.categoryId, g._count._all]));
  return cats.map((c) => ({
    id: c.id,
    name: c.name,
    tagline: c.tagline,
    image: c.image,
    accent: c.accent,
    count: counts.get(c.id) ?? 0,
  }));
}

export async function getCategoryById(id: string): Promise<Category | null> {
  const c = await prisma.category.findUnique({ where: { id } });
  if (!c) return null;
  const count = await prisma.product.count({ where: { categoryId: id } });
  return {
    id: c.id,
    name: c.name,
    tagline: c.tagline,
    image: c.image,
    accent: c.accent,
    count,
  };
}

export async function getFeaturedProducts(limit = 10): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: { featured: true },
    orderBy: { sortOrder: "asc" },
    take: limit,
  });
  return rows.map(toProduct);
}

export async function getProductById(id: string): Promise<Product | null> {
  const row = await prisma.product.findUnique({ where: { id } });
  return row ? toProduct(row) : null;
}

export async function getRelatedProducts(
  categoryId: string,
  excludeId: string,
  limit = 5,
): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: { categoryId, NOT: { id: excludeId } },
    orderBy: { sortOrder: "asc" },
    take: limit,
  });
  return rows.map(toProduct);
}

export async function getProducts(query: ProductQuery = {}): Promise<{
  products: Product[];
  total: number;
  page: number;
  pageCount: number;
  pageSize: number;
}> {
  const page = Math.max(1, query.page ?? 1);
  const pageSize = query.pageSize ?? 24;

  const where: Record<string, unknown> = {};
  if (query.category && query.category !== "all") {
    where.categoryId = query.category;
  }
  if (query.search && query.search.trim()) {
    const term = query.search.trim();
    where.OR = [
      { name: { contains: term, mode: "insensitive" } },
      { brand: { contains: term, mode: "insensitive" } },
    ];
  }
  if (typeof query.maxPrice === "number") {
    where.price = { lte: query.maxPrice };
  }

  const [rows, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: orderByForSort(query.sort),
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products: rows.map(toProduct),
    total,
    page,
    pageCount: Math.max(1, Math.ceil(total / pageSize)),
    pageSize,
  };
}

export async function searchProducts(term: string, limit = 8): Promise<Product[]> {
  const t = term.trim();
  if (!t) return [];
  const rows = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: t, mode: "insensitive" } },
        { brand: { contains: t, mode: "insensitive" } },
      ],
    },
    orderBy: { featured: "desc" },
    take: limit,
  });
  return rows.map(toProduct);
}

export async function getAllProductIds(): Promise<string[]> {
  const rows = await prisma.product.findMany({ select: { id: true } });
  return rows.map((r) => r.id);
}

export async function getCatalogStats(): Promise<{
  products: number;
  categories: number;
}> {
  const [products, categories] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
  ]);
  return { products, categories };
}
