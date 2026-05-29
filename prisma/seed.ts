import { PrismaClient } from "@prisma/client";
import { products, featuredIds } from "../src/data/products";
import { categories } from "../src/data/categories";

const prisma = new PrismaClient();

const featuredSet = new Set(featuredIds);

async function main() {
  console.log(`Seeding ${categories.length} categories and ${products.length} products…`);

  for (let i = 0; i < categories.length; i++) {
    const c = categories[i];
    await prisma.category.upsert({
      where: { id: c.id },
      create: {
        id: c.id,
        name: c.name,
        tagline: c.tagline,
        image: `/categories/${c.id}.jpg`,
        accent: c.accent,
        sortOrder: i,
      },
      update: {
        name: c.name,
        tagline: c.tagline,
        image: `/categories/${c.id}.jpg`,
        accent: c.accent,
        sortOrder: i,
      },
    });
  }

  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    // Correct every product to reference its own asset by id.
    const image = `/products/${p.id}.jpg`;
    const data = {
      name: p.name,
      brand: p.brand,
      categoryId: p.category,
      price: p.price,
      originalPrice: p.originalPrice ?? null,
      rating: p.rating,
      reviews: p.reviews,
      description: p.description,
      features: p.features,
      images: [image],
      badge: p.badge ?? null,
      stock: p.stock,
      unit: p.unit ?? null,
      featured: featuredSet.has(p.id),
      sortOrder: i,
    };
    await prisma.product.upsert({
      where: { id: p.id },
      create: { id: p.id, ...data },
      update: data,
    });
  }

  const [catCount, prodCount, featuredCount] = await Promise.all([
    prisma.category.count(),
    prisma.product.count(),
    prisma.product.count({ where: { featured: true } }),
  ]);
  console.log(`Done. Categories: ${catCount}, Products: ${prodCount}, Featured: ${featuredCount}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
