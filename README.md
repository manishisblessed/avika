# LuxeMart

A next-level luxury department-store web app built with Next.js 14, React,
TailwindCSS, Framer Motion, and Three.js (via @react-three/fiber).

> Dark cinematic theme · gold-leaf accents · glassmorphism · live 3D hero ·
> page transitions · scroll-driven parallax · animated counters · magnetic
> nav · persistent cart drawer · multi-step checkout.

## Stack

- **Next.js 14** (App Router, TypeScript, dynamic imports)
- **TailwindCSS 3** with a custom luxury design system (`gold-*`, `bg-*`, `ink-*`)
- **Framer Motion** for page transitions, reveals, layout animations, and
  micro-interactions
- **Three.js + @react-three/fiber + drei** for the floating 3D hero
- **Zustand** with persistence for the shopping bag
- **lucide-react** icons
- **Cormorant Garamond** + **Inter** for type pairing

## Pages

| Route             | What's there                                                     |
| ----------------- | ---------------------------------------------------------------- |
| `/`               | 3D hero, marquee, value props, categories, featured, testimonials |
| `/categories`     | Animated grid of all 8 floors                                    |
| `/products`       | Filters, search, price slider, sort, animated grid               |
| `/products/[id]`  | Tilt gallery, thumbnails, add-to-cart with confetti motion       |
| `/cart`           | Itemized review with live totals + sticky summary                |
| `/checkout`       | 4-step animated wizard with order success                        |
| `/about`          | Story, animated stats, four pillars, team grid                   |
| `/contact`        | Channel cards, contact form, embedded map                        |

## Run it

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

## Production

```bash
npm run build
npm start
```

## File map

```
src/
  app/                    # App Router pages + layout + globals.css
  components/             # Navbar, Footer, Hero3D, ProductCard, CartDrawer, …
  data/                   # Mock products, categories, testimonials
  lib/utils.ts            # cn(), formatPrice(), slugify()
  store/cart.ts           # Zustand cart with localStorage persistence
```

## Notes

- All product photography is loaded from Unsplash via `next/image` (configured
  in `next.config.mjs`).
- The cart store is persisted to `localStorage` under `luxemart-cart`.
- The 3D hero is dynamically imported with `ssr: false` so SSR isn't blocked
  by WebGL.
- A subtle SVG film-grain overlay sits above everything for a cinematic feel.
