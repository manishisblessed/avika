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
      "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=400&q=75",
    accent: "from-green-500/40 to-emerald-900/10",
    count: 156,
  },
  {
    id: "dairy-eggs",
    name: "Dairy & Eggs",
    tagline: "Fresh milk, paneer, curd & more",
    image:
      "https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=400&q=75",
    accent: "from-sky-400/40 to-blue-900/10",
    count: 84,
  },
  {
    id: "staples-grains",
    name: "Staples & Grains",
    tagline: "Rice, atta, pulses & everyday essentials",
    image:
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=75",
    accent: "from-amber-500/40 to-yellow-900/10",
    count: 198,
  },
  {
    id: "cooking-oils",
    name: "Cooking Oils & Ghee",
    tagline: "Pure oils for healthy cooking",
    image:
      "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=400&q=75",
    accent: "from-yellow-500/40 to-orange-900/10",
    count: 62,
  },
  {
    id: "spices-masalas",
    name: "Spices & Masalas",
    tagline: "Aromatic spices for authentic flavors",
    image:
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=75",
    accent: "from-red-500/40 to-rose-900/10",
    count: 124,
  },
  {
    id: "snacks-beverages",
    name: "Snacks & Beverages",
    tagline: "Tea, coffee, biscuits & munchies",
    image:
      "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=400&q=75",
    accent: "from-orange-500/40 to-amber-900/10",
    count: 215,
  },
  {
    id: "bakery-breads",
    name: "Bakery & Breads",
    tagline: "Freshly baked goodness every day",
    image:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=75",
    accent: "from-amber-400/40 to-yellow-900/10",
    count: 78,
  },
  {
    id: "household-essentials",
    name: "Household Essentials",
    tagline: "Cleaning, personal care & daily needs",
    image:
      "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=400&q=75",
    accent: "from-teal-500/40 to-cyan-900/10",
    count: 167,
  },
  {
    id: "frozen-foods",
    name: "Frozen Foods",
    tagline: "Ready-to-cook meals & frozen veggies",
    image:
      "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?auto=format&fit=crop&w=400&q=75",
    accent: "from-blue-500/40 to-indigo-900/10",
    count: 92,
  },
  {
    id: "baby-care",
    name: "Baby Care",
    tagline: "Diapers, food, and essentials for your little one",
    image:
      "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=400&q=75",
    accent: "from-pink-400/40 to-rose-900/10",
    count: 56,
  },
  {
    id: "personal-care",
    name: "Personal Care",
    tagline: "Skincare, hair care & hygiene",
    image:
      "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=400&q=75",
    accent: "from-purple-400/40 to-violet-900/10",
    count: 143,
  },
  {
    id: "dry-fruits",
    name: "Dry Fruits & Nuts",
    tagline: "Almonds, cashews, raisins & more",
    image:
      "https://images.unsplash.com/photo-1608797178974-15b35a64ede9?auto=format&fit=crop&w=400&q=75",
    accent: "from-amber-600/40 to-brown-900/10",
    count: 48,
  },
  {
    id: "instant-food",
    name: "Instant & Ready-to-Eat",
    tagline: "Noodles, soups, ready meals",
    image:
      "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=400&q=75",
    accent: "from-red-400/40 to-orange-900/10",
    count: 87,
  },
];
