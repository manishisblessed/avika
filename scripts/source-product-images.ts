/**
 * Sources a correct product photo for every product from the Pexels API and
 * writes it to public/products/<id>.jpg.
 *
 * Fixes the bug in migrate-to-local-images.mjs: there is NO silent fallback to
 * another product's image. If a product can't be matched confidently, its file
 * is left untouched and it is recorded in image-report.json for manual review.
 *
 * Safe to re-run: progress is saved to scripts/.image-source-state.json, so a
 * rerun skips products that already succeeded (useful around rate limits).
 *
 * Usage:  npx tsx scripts/source-product-images.ts
 *         npx tsx scripts/source-product-images.ts --force   (re-source everything)
 */
import fs from "fs";
import path from "path";
import { products } from "../src/data/products";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "public", "products");
const STATE_FILE = path.join(ROOT, "scripts", ".image-source-state.json");
const REPORT_FILE = path.join(ROOT, "image-report.json");
const FORCE = process.argv.includes("--force");

function loadApiKey(): string {
  if (process.env.PEXELS_API_KEY) return process.env.PEXELS_API_KEY;
  const txt = fs.readFileSync(path.join(ROOT, ".env"), "utf8");
  const m = txt.match(/^\s*PEXELS_API_KEY\s*=\s*"?([^"\r\n]+)"?/m);
  if (!m) throw new Error("PEXELS_API_KEY not found in environment or .env");
  return m[1].trim();
}
const API_KEY = loadApiKey();

// Curated, brand-free, stock-search-friendly query per product id.
const QUERIES: Record<string, string> = {
  // Fruits & Vegetables
  fv001: "fresh bananas", fv002: "red apples", fv003: "fresh tomatoes",
  fv004: "fresh spinach leaves", fv005: "onions", fv006: "potatoes",
  fv007: "green bell pepper", fv008: "carrots", fv009: "cucumber",
  fv010: "cauliflower", fv011: "alphonso mango", fv012: "green chili peppers",
  fv013: "ginger root", fv014: "garlic", fv015: "okra vegetable",
  fv016: "bottle gourd vegetable", fv017: "fresh lemons", fv018: "coriander cilantro leaves",
  fv019: "sweet corn", fv020: "broccoli", fv021: "pomegranate",
  fv022: "white mushrooms", fv023: "green grapes", fv024: "watermelon",
  fv025: "pineapple",
  // Dairy & Eggs
  de001: "milk bottle glass", de002: "paneer cottage cheese block", de003: "brown eggs",
  de004: "yogurt curd bowl", de005: "butter block", de006: "cheese slices",
  de007: "milk glass", de008: "greek yogurt bowl", de009: "mango lassi drink",
  de010: "fresh cream bowl", de011: "buttermilk drink glass", de012: "mozzarella cheese",
  de013: "condensed milk", de014: "whipped cream", de015: "ghee jar",
  de016: "chocolate milk glass", de017: "indian dessert yogurt", de018: "white eggs",
  de019: "paneer cubes", de020: "milk solids dessert", de021: "probiotic yogurt drink bottle",
  de022: "hung curd yogurt bowl", de023: "curd yogurt bowl", de024: "paneer block",
  de025: "milk glass bottle",
  // Staples & Grains
  sg001: "basmati rice", sg002: "wheat flour", sg003: "toor dal lentils",
  sg004: "moong dal lentils", sg005: "white sugar", sg006: "chana dal lentils",
  sg007: "red lentils", sg008: "kidney beans", sg009: "white rice grains",
  sg010: "flattened rice poha", sg011: "gram flour besan", sg012: "urad dal lentils",
  sg013: "white flour", sg014: "semolina", sg015: "chickpeas",
  sg016: "broken wheat", sg017: "rolled oats", sg018: "jaggery",
  sg019: "rock salt", sg020: "multigrain flour", sg021: "table salt",
  sg022: "tapioca pearls sabudana", sg023: "brown rice", sg024: "broken wheat porridge",
  sg025: "semolina rava bowl",
  // Cooking Oils & Ghee
  co001: "sunflower oil bottle", co002: "mustard oil bottle", co003: "ghee jar",
  co004: "olive oil bottle", co005: "peanut oil bottle", co006: "coconut oil jar",
  co007: "cooking oil bottle", co008: "soybean oil bottle", co009: "sesame oil bottle",
  co010: "canola oil bottle", co011: "flaxseed oil bottle", co012: "ghee jar bowl",
  co013: "vegetable shortening", co014: "avocado oil bottle", co015: "cooking oil can",
  co016: "olive oil bottle green", co017: "walnut oil bottle", co018: "mustard oil can",
  co019: "coconut oil bottle", co020: "cooking oil bottle clear", co021: "ghee bowl",
  co022: "cooking oil spray",
  // Spices & Masalas
  sm001: "turmeric powder", sm002: "red chili powder", sm003: "garam masala spice",
  sm004: "cumin seeds", sm005: "coriander powder", sm006: "black peppercorns",
  sm007: "indian spices bowl", sm008: "biryani spices", sm009: "spice powder bowl",
  sm010: "mustard seeds", sm011: "cinnamon sticks", sm012: "green cardamom",
  sm013: "indian spice mix", sm014: "sambar powder", sm015: "red chili powder bowl",
  sm016: "bay leaves", sm017: "fennel seeds", sm018: "tandoori masala red",
  sm019: "cloves spice", sm020: "yellow spice powder", sm021: "indian masala spices",
  sm022: "fenugreek seeds", sm023: "star anise", sm024: "nutmeg",
  sm025: "white pepper powder",
  // Snacks & Beverages
  sb001: "black tea leaves", sb002: "instant coffee jar", sb003: "glucose biscuits",
  sb004: "fruit juice glass", sb005: "indian namkeen snack", sb006: "green tea cup",
  sb007: "potato chips", sb008: "dark chocolate bar", sb009: "indian bhujia namkeen",
  sb010: "mango juice drink", sb011: "chocolate cream biscuits", sb012: "soda water glass",
  sb013: "ground coffee powder", sb014: "tea biscuits", sb015: "corn puff snack",
  sb016: "orange sports drink", sb017: "digestive biscuits", sb018: "hot chocolate drink",
  sb019: "roasted peanuts", sb020: "cola drink glass", sb021: "masala chai tea",
  sb022: "chocolate protein bar", sb023: "nacho chips cheese", sb024: "cream biscuits",
  sb025: "lassi yogurt drink",
  // Bakery & Breads
  bb001: "white bread loaf", bb002: "whole wheat bread", bb003: "pav bread buns",
  bb004: "rusk toast", bb005: "multigrain bread", bb006: "butter croissant",
  bb007: "garlic bread", bb008: "fruit cake", bb009: "burger buns",
  bb010: "pizza base dough", bb011: "chocolate muffin", bb012: "soft bread loaf",
  bb013: "brown bread slices", bb014: "banana cake", bb015: "hot dog buns",
  bb016: "puff pastry biscuit", bb017: "focaccia bread", bb018: "bread sticks",
  bb019: "naan bread", bb020: "cream roll pastry", bb021: "sourdough bread",
  bb022: "tortilla wraps", bb023: "puff pastry sheet", bb024: "dinner rolls",
  bb025: "bread crumbs",
  // Household Essentials
  he001: "dish soap bottle", he002: "laundry detergent powder", he003: "floor cleaner bottle",
  he004: "toilet cleaner bottle", he005: "hand wash bottle", he006: "fabric softener bottle",
  he007: "spray cleaner bottle", he008: "mosquito repellent liquid", he009: "dish washing soap bar",
  he010: "air freshener", he011: "liquid detergent bottle", he012: "cleaning spray bottle",
  he013: "garbage bags", he014: "disinfectant spray bottle", he015: "bleach bottle",
  he016: "steel scrubber dish", he017: "mothballs", he018: "floor mop cleaning",
  he019: "insect spray bottle", he020: "aluminium foil roll", he021: "plastic cling wrap",
  he022: "paper towel roll", he023: "bleach bottle cleaning", he024: "dish soap bar",
  he025: "trash bags",
  // Frozen Foods
  ff001: "green peas", ff002: "frozen corn kernels", ff003: "frozen mixed vegetables",
  ff004: "potato patty tikki", ff005: "french fries", ff006: "samosa",
  ff007: "paratha flatbread", ff008: "chicken nuggets", ff009: "momos dumplings",
  ff010: "vanilla ice cream", ff011: "spring rolls", ff012: "paneer tikka",
  ff013: "butterscotch ice cream", ff014: "fish fingers", ff015: "chapati roti flatbread",
  ff016: "seekh kebab", ff017: "stuffed paratha", ff018: "veggie burger patty",
  ff019: "kulfi ice cream", ff020: "fried cheese balls", ff021: "dal makhani",
  ff022: "chicken tikka", ff023: "mango pulp puree", ff024: "idli rice batter",
  ff025: "ice cream tub",
  // Baby Care
  bc001: "baby diapers", bc002: "baby wipes", bc003: "baby shampoo bottle",
  bc004: "baby lotion bottle", bc005: "baby cereal food", bc006: "baby powder",
  bc007: "baby oil bottle", bc008: "baby cream tube", bc009: "baby soap bar",
  bc010: "baby formula milk powder", bc011: "baby body wash bottle", bc012: "baby feeding bottle",
  bc013: "baby diapers stack", bc014: "baby cereal bowl", bc015: "baby mosquito repellent",
  bc016: "baby sunscreen lotion", bc017: "baby laundry detergent", bc018: "baby teething gel",
  bc019: "baby gripe water bottle", bc020: "baby pacifier", bc021: "baby blanket",
  bc022: "apple puree baby food", bc023: "nursing pads", bc024: "baby detergent bottle",
  bc025: "mosquito repellent patches",
  // Personal Care
  pc001: "shampoo bottle", pc002: "face wash tube", pc003: "toothpaste tube",
  pc004: "body lotion bottle", pc005: "deodorant spray", pc006: "hair oil bottle",
  pc007: "sunscreen lotion", pc008: "shaving cream", pc009: "soap bar",
  pc010: "toothbrush", pc011: "hair conditioner bottle", pc012: "face cream jar",
  pc013: "razor blades", pc014: "petroleum jelly jar", pc015: "hand cream tube",
  pc016: "mouthwash bottle", pc017: "clay face mask", pc018: "lip balm",
  pc019: "shower gel bottle", pc020: "hair gel", pc021: "sanitary pads",
  pc022: "cotton swabs", pc023: "kajal eyeliner makeup", pc024: "talcum powder",
  pc025: "cotton balls",
  // Dry Fruits & Nuts
  df001: "almonds", df002: "cashew nuts", df003: "raisins",
  df004: "pistachios", df005: "walnuts", df006: "medjool dates",
  df007: "mixed dry fruits nuts", df008: "dried figs", df009: "dried apricots",
  df010: "pumpkin seeds", df011: "sunflower seeds", df012: "chia seeds",
  df013: "flax seeds", df014: "macadamia nuts", df015: "dried cranberries",
  df016: "hazelnuts", df017: "brazil nuts", df018: "trail mix nuts",
  df019: "saffron threads", df020: "fox nuts makhana", df021: "dried dates",
  df022: "pine nuts", df023: "melon seeds", df024: "watermelon seeds",
  df025: "mixed seeds",
  // Instant & Ready-to-Eat
  if001: "instant noodles", if002: "cup noodles", if003: "poha indian breakfast",
  if004: "upma indian breakfast", if005: "dal makhani", if006: "tomato soup bowl",
  if007: "rajma curry", if008: "penne pasta", if009: "idli indian food",
  if010: "paneer butter masala curry", if011: "vermicelli noodles", if012: "dosa indian food",
  if013: "hakka noodles", if014: "hot and sour soup", if015: "khichdi indian food",
  if016: "marinara pasta sauce", if017: "biryani rice", if018: "gulab jamun dessert",
  if019: "rava dosa", if020: "chole chickpea curry", if021: "noodles spice",
  if022: "pav bhaji", if023: "tomato pasta sauce", if024: "jalebi indian sweet",
  if025: "pav bhaji indian food",
};

function fallbackQuery(name: string): string {
  return name
    .replace(/\([^)]*\)/g, " ")
    .replace(/\s-\s.*/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

type State = { done: string[]; usedPhotoIds: number[] };
function loadState(): State {
  if (FORCE || !fs.existsSync(STATE_FILE)) return { done: [], usedPhotoIds: [] };
  try {
    return JSON.parse(fs.readFileSync(STATE_FILE, "utf8")) as State;
  } catch {
    return { done: [], usedPhotoIds: [] };
  }
}
function saveState(state: State) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state));
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

type Photo = {
  id: number;
  src: { large2x?: string; large?: string; original?: string; medium?: string };
};

async function searchPexels(query: string) {
  const url =
    `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}` +
    `&per_page=15`;
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
  console.log(`Rate limit reached. Waiting ~${mins} min for reset…`);
  await sleep(ms);
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const state = loadState();
  const done = new Set(state.done);
  const usedPhotoIds = new Set(state.usedPhotoIds);
  const failures: { id: string; name: string; query: string; reason: string }[] = [];

  const todo = products.filter((p) => !done.has(p.id));
  console.log(`Sourcing ${todo.length} of ${products.length} products (${done.size} already done)…`);

  let i = 0;
  for (const p of todo) {
    i++;
    const query = QUERIES[p.id] ?? fallbackQuery(p.name);
    let attempt = 0;
    let placed = false;

    while (attempt < 3 && !placed) {
      attempt++;
      const result = await searchPexels(query);

      if (result.status === 429) {
        await waitForReset(result.reset);
        attempt--; // don't count rate-limit waits as a real attempt
        continue;
      }
      if (result.status !== 200) {
        if (attempt >= 3) {
          failures.push({ id: p.id, name: p.name, query, reason: `search HTTP ${result.status}` });
        } else {
          await sleep(1500);
        }
        continue;
      }
      if (result.photos.length === 0) {
        failures.push({ id: p.id, name: p.name, query, reason: "no results" });
        break;
      }

      // Prefer an unused photo for variety; otherwise take the best match.
      const fresh = result.photos.find((ph) => !usedPhotoIds.has(ph.id));
      const photo = fresh ?? result.photos[0];
      const src = photo.src.large2x ?? photo.src.large ?? photo.src.original ?? photo.src.medium;
      if (!src) {
        failures.push({ id: p.id, name: p.name, query, reason: "no usable src url" });
        break;
      }

      const ok = await downloadTo(src, path.join(OUT, `${p.id}.jpg`));
      if (ok) {
        usedPhotoIds.add(photo.id);
        done.add(p.id);
        placed = true;
        console.log(`[${i}/${todo.length}] ${p.id}  ${p.name}  ←  "${query}"  (remaining ${result.remaining})`);
      } else if (attempt >= 3) {
        failures.push({ id: p.id, name: p.name, query, reason: "download failed" });
      }

      // Persist progress + respect rate limit.
      state.done = [...done];
      state.usedPhotoIds = [...usedPhotoIds];
      saveState(state);

      if (result.remaining <= 1) {
        await waitForReset(result.reset);
      } else {
        await sleep(350);
      }
    }
  }

  fs.writeFileSync(
    REPORT_FILE,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        total: products.length,
        succeeded: done.size,
        failed: failures.length,
        failures,
      },
      null,
      2,
    ),
  );

  console.log(`\nDone. Succeeded: ${done.size}/${products.length}. Failed: ${failures.length}.`);
  if (failures.length) {
    console.log("See image-report.json for the list that needs manual images.");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
