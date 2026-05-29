export type Category = {
  id: string;
  name: string;
  tagline: string;
  image: string;
  accent: string;
  count: number;
};

export const categories: Category[] = [
  {
    id: "fruits-vegetables",
    name: "Fruits & Vegetables",
    tagline: "Farm-fresh produce, delivered daily",
    image:
      "/categories/fruits-vegetables.jpg",
    accent: "from-green-500/40 to-emerald-900/10",
    count: 156,
  },
  {
    id: "dairy-eggs",
    name: "Dairy & Eggs",
    tagline: "Fresh milk, paneer, curd & more",
    image:
      "/categories/dairy-eggs.jpg",
    accent: "from-sky-400/40 to-blue-900/10",
    count: 84,
  },
  {
    id: "staples-grains",
    name: "Staples & Grains",
    tagline: "Rice, atta, pulses & everyday essentials",
    image:
      "/categories/staples-grains.jpg",
    accent: "from-amber-500/40 to-yellow-900/10",
    count: 198,
  },
  {
    id: "cooking-oils",
    name: "Cooking Oils & Ghee",
    tagline: "Pure oils for healthy cooking",
    image:
      "/categories/cooking-oils.jpg",
    accent: "from-yellow-500/40 to-orange-900/10",
    count: 62,
  },
  {
    id: "spices-masalas",
    name: "Spices & Masalas",
    tagline: "Aromatic spices for authentic flavors",
    image:
      "/categories/spices-masalas.jpg",
    accent: "from-red-500/40 to-rose-900/10",
    count: 124,
  },
  {
    id: "snacks-beverages",
    name: "Snacks & Beverages",
    tagline: "Tea, coffee, biscuits & munchies",
    image:
      "/categories/snacks-beverages.jpg",
    accent: "from-orange-500/40 to-amber-900/10",
    count: 215,
  },
  {
    id: "bakery-breads",
    name: "Bakery & Breads",
    tagline: "Freshly baked goodness every day",
    image:
      "/categories/bakery-breads.jpg",
    accent: "from-amber-400/40 to-yellow-900/10",
    count: 78,
  },
  {
    id: "household-essentials",
    name: "Household Essentials",
    tagline: "Cleaning, personal care & daily needs",
    image:
      "/categories/household-essentials.jpg",
    accent: "from-teal-500/40 to-cyan-900/10",
    count: 167,
  },
  {
    id: "frozen-foods",
    name: "Frozen Foods",
    tagline: "Ready-to-cook meals & frozen veggies",
    image:
      "/categories/frozen-foods.jpg",
    accent: "from-blue-500/40 to-indigo-900/10",
    count: 92,
  },
  {
    id: "baby-care",
    name: "Baby Care",
    tagline: "Diapers, food, and essentials for your little one",
    image:
      "/categories/baby-care.jpg",
    accent: "from-pink-400/40 to-rose-900/10",
    count: 56,
  },
  {
    id: "personal-care",
    name: "Personal Care",
    tagline: "Skincare, hair care & hygiene",
    image:
      "/categories/personal-care.jpg",
    accent: "from-purple-400/40 to-violet-900/10",
    count: 143,
  },
  {
    id: "dry-fruits",
    name: "Dry Fruits & Nuts",
    tagline: "Almonds, cashews, raisins & more",
    image:
      "/categories/dry-fruits.jpg",
    accent: "from-amber-600/40 to-brown-900/10",
    count: 48,
  },
  {
    id: "instant-food",
    name: "Instant & Ready-to-Eat",
    tagline: "Noodles, soups, ready meals",
    image:
      "/categories/instant-food.jpg",
    accent: "from-red-400/40 to-orange-900/10",
    count: 87,
  },
];
