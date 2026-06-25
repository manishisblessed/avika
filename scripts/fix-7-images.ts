/**
 * Fixes 7 product images using Pexels API with very strict filtering.
 * Usage: npx tsx scripts/fix-7-images.ts
 */
import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "public", "products");

function loadApiKey(): string {
  if (process.env.PEXELS_API_KEY) return process.env.PEXELS_API_KEY;
  const txt = fs.readFileSync(path.join(ROOT, ".env"), "utf8");
  const m = txt.match(/^\s*PEXELS_API_KEY\s*=\s*"?([^"\r\n]+)"?/m);
  if (!m) throw new Error("PEXELS_API_KEY not found");
  return m[1].trim();
}
const API_KEY = loadApiKey();

type Photo = {
  id: number;
  alt: string;
  src: { large2x?: string; large?: string; original?: string; medium?: string };
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const usedPhotoIds = new Set<number>();

async function searchPexels(query: string, perPage = 80, page = 1) {
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${perPage}&page=${page}`;
  const res = await fetch(url, { headers: { Authorization: API_KEY } });
  const remaining = Number(res.headers.get("x-ratelimit-remaining") ?? "999");
  const reset = Number(res.headers.get("x-ratelimit-reset") ?? "0");
  if (res.status !== 200) return { status: res.status, photos: [] as Photo[], remaining, reset };
  const data = (await res.json()) as { photos?: Photo[] };
  return { status: 200, photos: data.photos ?? [], remaining, reset };
}

async function downloadTo(url: string, dest: string): Promise<number> {
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) return 0;
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 5000) return 0;
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, buf);
  return buf.length;
}

async function waitForReset(resetEpoch: number) {
  const ms = Math.max(resetEpoch * 1000 - Date.now(), 0) + 3000;
  console.log(`Rate limit. Waiting ${Math.ceil(ms / 60000)} min...`);
  await sleep(ms);
}

interface ProductTask {
  id: string;
  name: string;
  queries: string[];
  filter: (alt: string) => boolean;
}

const PRODUCTS: ProductTask[] = [
  {
    id: "sg003",
    name: "Toor Dal - RAW yellow lentils",
    queries: ["yellow lentils raw", "dried lentils pile", "lentils texture background", "raw pulses yellow"],
    filter: (alt) => {
      const a = alt.toLowerCase();
      const bad = ["cooked", "soup", "curry", "stew", "served", "meal", "dish", "plate",
        "tadka", "garnish", "spice", "herb", "garnished", "green", "red", "black",
        "salad", "rice", "recipe", "restaurant", "cuisine"];
      if (bad.some(b => a.includes(b))) return false;
      const good = ["lentil", "dal", "pulse", "legume"];
      const context = ["dry", "raw", "texture", "background", "pile", "close", "uncooked", "dried", "surface"];
      return good.some(g => a.includes(g)) && context.some(c => a.includes(c));
    },
  },
  {
    id: "sg006",
    name: "Chana Dal - RAW split chickpeas",
    queries: ["dried chickpeas", "chickpeas raw texture", "dry chickpeas pile", "split peas dried"],
    filter: (alt) => {
      const a = alt.toLowerCase();
      const bad = ["cooked", "hummus", "soup", "curry", "salad", "served", "plate", "meal", "recipe"];
      if (bad.some(b => a.includes(b))) return false;
      const good = ["chickpea", "pea", "legume"];
      const context = ["dry", "raw", "texture", "background", "pile", "close", "surface", "natural"];
      return good.some(g => a.includes(g)) && context.some(c => a.includes(c));
    },
  },
  {
    id: "sg005",
    name: "Sugar - white granulated",
    queries: ["sugar cubes", "white sugar spoon", "sugar crystals close up", "granulated sugar pile"],
    filter: (alt) => {
      const a = alt.toLowerCase();
      const bad = ["candy", "gummy", "cake", "cookie", "chocolate", "fruit", "drink",
        "coffee", "tea", "black and white", "artistic", "dramatic", "bake", "dessert", "donut"];
      if (bad.some(b => a.includes(b))) return false;
      return a.includes("sugar") && (a.includes("cube") || a.includes("crystal") || a.includes("white") ||
        a.includes("spoon") || a.includes("granul") || a.includes("pile") || a.includes("close") || a.includes("sweet"));
    },
  },
  {
    id: "co009",
    name: "Sesame Oil bottle",
    queries: ["sesame oil bottle", "sesame seed oil", "dark cooking oil bottle", "sesame oil glass"],
    filter: (alt) => {
      const a = alt.toLowerCase();
      const bad = ["capsule", "pill", "supplement", "vitamin", "essential oil", "cosmetic",
        "skin", "hair", "salad", "pouring on food", "drizzle", "risotto"];
      if (bad.some(b => a.includes(b))) return false;
      return a.includes("oil") && (a.includes("bottle") || a.includes("jar") || a.includes("container")) &&
        (a.includes("sesame") || a.includes("cooking") || a.includes("kitchen") || a.includes("glass"));
    },
  },
  {
    id: "co015",
    name: "Sunflower Oil - 5L bottle",
    queries: ["sunflower cooking oil", "large oil bottle yellow", "vegetable oil plastic bottle", "cooking oil container"],
    filter: (alt) => {
      const a = alt.toLowerCase();
      const bad = ["capsule", "pill", "supplement", "essential", "cosmetic", "salad", "drizzle", "olives"];
      if (bad.some(b => a.includes(b))) return false;
      return a.includes("oil") && (a.includes("bottle") || a.includes("container") || a.includes("plastic") || a.includes("can"));
    },
  },
  {
    id: "co018",
    name: "Mustard Oil - 5L bottle",
    queries: ["mustard oil bottle", "yellow oil bottle cooking", "cooking oil large bottle", "oil tin container"],
    filter: (alt) => {
      const a = alt.toLowerCase();
      const bad = ["capsule", "pill", "supplement", "essential", "cosmetic", "salad",
        "preparation", "radish", "drizzle", "olives", "rose"];
      if (bad.some(b => a.includes(b))) return false;
      return a.includes("oil") && (a.includes("bottle") || a.includes("container") || a.includes("tin") || a.includes("can"));
    },
  },
  {
    id: "co021",
    name: "A2 Cow Ghee - golden clarified butter",
    queries: ["ghee jar golden", "clarified butter glass jar", "desi ghee bowl", "pure ghee golden", "butter golden melted bowl"],
    filter: (alt) => {
      const a = alt.toLowerCase();
      const bad = ["pickle", "plum", "jam", "fruit", "preserve", "candy", "knife",
        "slice", "bread", "honey", "milk"];
      if (bad.some(b => a.includes(b))) return false;
      return (a.includes("ghee") || a.includes("butter") || a.includes("clarified")) &&
        (a.includes("golden") || a.includes("jar") || a.includes("bowl") || a.includes("glass") || a.includes("pure") || a.includes("melted"));
    },
  },
];

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const succeeded: string[] = [];
  const failed: string[] = [];

  for (let i = 0; i < PRODUCTS.length; i++) {
    const p = PRODUCTS[i];
    let placed = false;
    console.log(`\n[${i + 1}/${PRODUCTS.length}] ${p.name} (${p.id})`);

    for (const query of p.queries) {
      if (placed) break;
      console.log(`  "${query}"`);

      const result = await searchPexels(query);
      if (result.status === 429) {
        await waitForReset(result.reset);
        const retry = await searchPexels(query);
        if (retry.status !== 200) continue;
        result.photos = retry.photos;
        result.remaining = retry.remaining;
      }
      if (result.photos.length === 0) { await sleep(300); continue; }

      // Exclude already-used photo IDs to avoid duplicates
      const available = result.photos.filter(ph => !usedPhotoIds.has(ph.id));
      const matched = available.filter((photo) => photo.alt && p.filter(photo.alt));
      console.log(`    ${result.photos.length} results → ${matched.length} matched`);

      if (matched.length === 0) {
        console.log(`    Top alts: ${result.photos.slice(0, 3).map(x => `"${x.alt?.slice(0, 60)}"`).join(" | ")}`);
        await sleep(300);
        continue;
      }

      for (const photo of matched.slice(0, 5)) {
        if (placed) break;
        const src = photo.src.large2x ?? photo.src.large ?? photo.src.original ?? photo.src.medium;
        if (!src) continue;
        const dest = path.join(OUT, `${p.id}.jpg`);
        const size = await downloadTo(src, dest);
        if (size >= 20000) {
          placed = true;
          usedPhotoIds.add(photo.id);
          succeeded.push(p.id);
          console.log(`    ✓ ${Math.round(size / 1024)}KB #${photo.id}: "${photo.alt}"`);
        }
      }

      if (result.remaining <= 2) await waitForReset(result.reset);
      else await sleep(400);
    }

    if (!placed) {
      failed.push(p.id);
      console.log(`  ✗ FAILED`);
    }
  }

  console.log(`\n${"=".repeat(50)}`);
  console.log(`Done: ${succeeded.length}/${PRODUCTS.length} succeeded, ${failed.length} failed`);
  if (failed.length) console.log("Failed:", failed.join(", "));
}

main().catch(console.error);
