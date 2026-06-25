/**
 * Re-sources product images for 20 specific products that had incorrect/
 * unrelated Pexels photos. Uses multiple targeted search queries per product
 * and picks the best match.
 *
 * Usage:  npx tsx scripts/fix-20-images.ts
 */
import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "public", "products");

function loadApiKey(): string {
  if (process.env.PEXELS_API_KEY) return process.env.PEXELS_API_KEY;
  const txt = fs.readFileSync(path.join(ROOT, ".env"), "utf8");
  const m = txt.match(/^\s*PEXELS_API_KEY\s*=\s*"?([^"\r\n]+)"?/m);
  if (!m) throw new Error("PEXELS_API_KEY not found in environment or .env");
  return m[1].trim();
}
const API_KEY = loadApiKey();

// Each product gets multiple query attempts — the script tries them in order
// and uses the first one that returns a good result.
const PRODUCTS: { id: string; name: string; queries: string[] }[] = [
  {
    id: "sg011",
    name: "Besan (Gram Flour)",
    queries: [
      "gram flour besan powder bowl",
      "chickpea flour yellow powder",
      "besan flour close up",
    ],
  },
  {
    id: "bc005",
    name: "Baby Cerelac - Wheat",
    queries: [
      "baby cereal box food",
      "infant cereal wheat porridge bowl",
      "baby food cereal powder",
    ],
  },
  {
    id: "fv020",
    name: "Fresh Broccoli",
    queries: [
      "fresh green broccoli vegetable",
      "broccoli florets close up",
      "raw broccoli head green",
    ],
  },
  {
    id: "de013",
    name: "Condensed Milk",
    queries: [
      "condensed milk tin can pouring",
      "sweetened condensed milk bowl",
      "condensed milk dripping spoon",
    ],
  },
  {
    id: "sg003",
    name: "Toor Dal (Arhar)",
    queries: [
      "yellow toor dal lentils raw",
      "pigeon pea lentils bowl",
      "dried yellow lentils close up",
    ],
  },
  {
    id: "sg006",
    name: "Chana Dal",
    queries: [
      "chana dal split chickpea lentils",
      "yellow split gram lentils bowl",
      "dried chana dal close up",
    ],
  },
  {
    id: "sg005",
    name: "Sugar",
    queries: [
      "white sugar granulated bowl",
      "sugar crystals close up white",
      "refined white sugar spoon",
    ],
  },
  {
    id: "co009",
    name: "Sesame Oil (Til Ka Tel)",
    queries: [
      "sesame oil glass bottle",
      "sesame seed oil bottle",
      "cooking oil bottle sesame",
    ],
  },
  {
    id: "co015",
    name: "Sunflower Oil - 5L",
    queries: [
      "sunflower oil bottle yellow",
      "cooking oil bottle sunflower",
      "vegetable sunflower oil large bottle",
    ],
  },
  {
    id: "co018",
    name: "Mustard Oil - 5L Pack",
    queries: [
      "mustard oil bottle yellow",
      "mustard seed oil glass bottle",
      "yellow mustard cooking oil bottle",
    ],
  },
  {
    id: "co021",
    name: "A2 Cow Ghee",
    queries: [
      "clarified butter ghee jar",
      "desi ghee bowl golden",
      "pure ghee glass jar",
    ],
  },
  {
    id: "sm002",
    name: "Red Chilli Powder",
    queries: [
      "red chilli powder bowl spoon",
      "ground red pepper powder",
      "cayenne chili powder red",
    ],
  },
  {
    id: "sb005",
    name: "Namkeen Mix",
    queries: [
      "indian namkeen mixture snack bowl",
      "indian savory snack mix",
      "crunchy indian namkeen",
    ],
  },
  {
    id: "sb009",
    name: "Aloo Bhujia",
    queries: [
      "bhujia sev indian snack bowl",
      "thin crispy noodle snack indian",
      "aloo bhujia namkeen crispy",
    ],
  },
  {
    id: "he002",
    name: "Detergent Powder",
    queries: [
      "laundry detergent powder box",
      "washing powder detergent scoop",
      "detergent powder white blue",
    ],
  },
  {
    id: "he007",
    name: "Glass Cleaner",
    queries: [
      "glass cleaner spray bottle blue",
      "window cleaning spray bottle",
      "glass cleaner bottle",
    ],
  },
  {
    id: "he018",
    name: "Mop Refill",
    queries: [
      "mop head refill cleaning",
      "floor mop flat refill pad",
      "cleaning mop replacement head",
    ],
  },
  {
    id: "co023",
    name: "Castor Oil (Food Grade)",
    queries: [
      "castor oil bottle clear",
      "castor oil small bottle",
      "natural castor oil bottle",
    ],
  },
  {
    id: "co024",
    name: "Organic Mustard Oil",
    queries: [
      "mustard oil small bottle organic",
      "cold pressed mustard oil bottle",
      "mustard oil golden bottle",
    ],
  },
  {
    id: "bb024",
    name: "Dinner Rolls - Butter",
    queries: [
      "butter dinner rolls bread basket",
      "soft round bread rolls",
      "fresh baked dinner rolls",
    ],
  },
];

type Photo = {
  id: number;
  src: { large2x?: string; large?: string; original?: string; medium?: string };
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function searchPexels(query: string) {
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=5&orientation=square`;
  const res = await fetch(url, { headers: { Authorization: API_KEY } });
  const remaining = Number(res.headers.get("x-ratelimit-remaining") ?? "999");
  const reset = Number(res.headers.get("x-ratelimit-reset") ?? "0");
  if (res.status !== 200) {
    return { status: res.status, photos: [] as Photo[], remaining, reset };
  }
  const data = (await res.json()) as { photos?: Photo[] };
  return { status: 200, photos: data.photos ?? [], remaining, reset };
}

async function downloadTo(url: string, dest: string): Promise<boolean> {
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) return false;
  const ct = res.headers.get("content-type") ?? "";
  if (!ct.startsWith("image/")) return false;
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 5000) return false;
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, buf);
  return true;
}

async function waitForReset(resetEpoch: number) {
  const ms = Math.max(resetEpoch * 1000 - Date.now(), 0) + 3000;
  const mins = Math.ceil(ms / 60000);
  console.log(`Rate limit reached. Waiting ~${mins} min for reset...`);
  await sleep(ms);
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const succeeded: string[] = [];
  const failed: string[] = [];

  for (let i = 0; i < PRODUCTS.length; i++) {
    const p = PRODUCTS[i];
    let placed = false;

    for (const query of p.queries) {
      if (placed) break;

      const result = await searchPexels(query);

      if (result.status === 429) {
        await waitForReset(result.reset);
        const retry = await searchPexels(query);
        if (retry.status !== 200 || retry.photos.length === 0) continue;
        result.photos = retry.photos;
        result.remaining = retry.remaining;
        result.reset = retry.reset;
      }

      if (result.status !== 200 || result.photos.length === 0) {
        await sleep(400);
        continue;
      }

      const photo = result.photos[0];
      const src =
        photo.src.large2x ??
        photo.src.large ??
        photo.src.original ??
        photo.src.medium;
      if (!src) continue;

      const dest = path.join(OUT, `${p.id}.jpg`);
      const ok = await downloadTo(src, dest);
      if (ok) {
        placed = true;
        succeeded.push(p.id);
        console.log(
          `[${i + 1}/${PRODUCTS.length}] ✓ ${p.id} ${p.name}  ←  "${query}"`
        );
      }

      if (result.remaining <= 1) {
        await waitForReset(result.reset);
      } else {
        await sleep(400);
      }
    }

    if (!placed) {
      failed.push(p.id);
      console.log(
        `[${i + 1}/${PRODUCTS.length}] ✗ ${p.id} ${p.name}  (all queries failed)`
      );
    }
  }

  console.log(
    `\nDone. Succeeded: ${succeeded.length}/${PRODUCTS.length}. Failed: ${failed.length}.`
  );
  if (failed.length) {
    console.log("Failed IDs:", failed.join(", "));
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
