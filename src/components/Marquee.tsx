"use client";

import { Star } from "lucide-react";

const items = [
  "Farm Fresh Produce",
  "Same-Day Delivery",
  "Quality Assured",
  "Best Prices Guaranteed",
  "300+ Products",
  "Open 7 Days a Week",
];

export default function Marquee() {
  return (
    <div className="border-y border-ink/10 py-5 bg-bg-soft">
      <div className="marquee">
        {[0, 1].map((k) => (
          <div className="marquee-track" key={k} aria-hidden={k === 1}>
            {items.map((it, i) => (
              <div
                key={`${k}-${i}`}
                className="flex items-center gap-3 text-sm tracking-widest uppercase text-ink-soft"
              >
                <Star size={12} className="text-gold-500 fill-gold-500" />
                <span>{it}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
