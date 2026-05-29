"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Category } from "@/types/catalog";

export default function CategoryCard({
  category,
  index = 0,
}: {
  category: Category;
  index?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.4, delay: Math.min(index, 6) * 0.04, ease: "easeOut" }}
    >
      <Link
        href={`/products?category=${category.id}`}
        className="group flex items-center gap-4 p-3 rounded-2xl border border-ink/10 bg-bg-card shadow-soft hover:border-gold-500/40 hover:shadow-soft-lg transition-all duration-300"
      >
        <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-bg-soft">
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
          <h3 className="font-display font-semibold text-ink leading-tight group-hover:text-gold-700 transition-colors truncate">
            {category.name}
          </h3>
          <p className="text-xs text-ink-mute mt-0.5 truncate">{category.tagline}</p>
          <p className="text-[11px] text-gold-600 font-medium mt-1">
            {category.count} products
          </p>
        </div>
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-bg-soft border border-ink/10 flex items-center justify-center text-ink-mute group-hover:bg-gold-500 group-hover:text-white group-hover:border-gold-500 transition-all duration-300">
          <ArrowUpRight size={14} />
        </div>
      </Link>
    </motion.div>
  );
}
