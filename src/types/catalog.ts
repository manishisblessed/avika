export type ProductBadge = "New" | "Bestseller" | "Limited" | "Exclusive";

export type Product = {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number | null;
  rating: number;
  reviews: number;
  description: string;
  features: string[];
  images: string[];
  badge?: ProductBadge | string | null;
  stock: number;
  unit?: string | null;
  featured?: boolean;
};

export type Category = {
  id: string;
  name: string;
  tagline: string;
  image: string;
  accent: string;
  count: number;
};

export type ProductSort = "featured" | "price-asc" | "price-desc" | "rating";

export type ProductQuery = {
  category?: string;
  search?: string;
  sort?: ProductSort;
  maxPrice?: number;
  page?: number;
  pageSize?: number;
};
