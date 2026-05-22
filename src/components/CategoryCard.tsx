"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Category } from "@/data/categories";

export default function CategoryCard({
  category,
  index = 0,
}: {
  category: Category;
  index?: number;
  size?: "sm" | "md" | "lg";
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.45, delay: index * 0.04, ease: "easeOut" }}
    >
      <Link
        href={`/products?category=${category.id}`}
        className="group flex items-center gap-4 p-3 rounded-2xl border border-white/5 bg-bg-card hover:border-gold-500/30 hover:bg-white/[0.03] transition-all duration-300"
      >
        <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
          <Image
            src={category.image}
            alt={category.name}
            fill
            sizes="64px"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-lg text-ink leading-tight group-hover:text-gold-300 transition-colors truncate">
            {category.name}
          </h3>
          <p className="text-xs text-ink/50 mt-0.5 truncate">
            {category.tagline}
          </p>
        </div>
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-ink/50 group-hover:bg-gold-500 group-hover:text-bg group-hover:border-gold-500 group-hover:rotate-45 transition-all duration-300">
          <ArrowUpRight size={14} />
        </div>
      </Link>
    </motion.div>
  );
}
