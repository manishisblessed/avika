import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const PUBLIC = path.join(ROOT, "public");

const productRe =
  /id: "([^"]+)"[\s\S]*?images: \[\s*\n\s*"(https:\/\/images\.unsplash\.com\/[^"]+)"/g;

const categoryRe =
  /id: "([^"]+)"[\s\S]*?image:\s*\n\s*"(https:\/\/images\.unsplash\.com\/[^"]+)"/g;

const testimonialRe =
  /id: "([^"]+)"[\s\S]*?avatar:\s*\n\s*"(https:\/\/images\.unsplash\.com\/[^"]+)"/g;

function downloadUrl(url, width = 800) {
  return url.replace(/w=\d+/, `w=${width}`).replace(/q=\d+/, "q=80");
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

async function downloadImage(url, destPath, width = 800) {
  if (fs.existsSync(destPath) && fs.statSync(destPath).size > 1024) {
    return true;
  }

  try {
    const res = await fetch(downloadUrl(url, width), { redirect: "follow" });
    if (!res.ok) return false;
    const buffer = Buffer.from(await res.arrayBuffer());
    if (buffer.length < 512) return false;
    ensureDir(path.dirname(destPath));
    fs.writeFileSync(destPath, buffer);
    return true;
  } catch {
    return false;
  }
}

async function runBatch(items, worker, concurrency = 8) {
  let index = 0;
  const results = [];

  async function next() {
    while (index < items.length) {
      const i = index++;
      results[i] = await worker(items[i], i);
    }
  }

  await Promise.all(Array.from({ length: concurrency }, next));
  return results;
}

function replaceInFile(filePath, replacements) {
  let text = fs.readFileSync(filePath, "utf8");
  let count = 0;
  for (const [from, to] of replacements) {
    const escaped = from.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const next = text.replace(new RegExp(escaped, "g"), to);
    if (next !== text) {
      count += (text.match(new RegExp(escaped, "g")) ?? []).length;
      text = next;
    }
  }
  fs.writeFileSync(filePath, text);
  return count;
}

async function main() {
  const productsFile = path.join(ROOT, "src/data/products.ts");
  const categoriesFile = path.join(ROOT, "src/data/categories.ts");
  const testimonialsFile = path.join(ROOT, "src/data/testimonials.ts");
  const homePageFile = path.join(ROOT, "src/app/page.tsx");

  const productsText = fs.readFileSync(productsFile, "utf8");
  const products = [];
  let match;
  while ((match = productRe.exec(productsText))) {
    products.push({ id: match[1], url: match[2] });
  }

  const categories = [];
  const categoriesText = fs.readFileSync(categoriesFile, "utf8");
  while ((match = categoryRe.exec(categoriesText))) {
    categories.push({ id: match[1], url: match[2] });
  }

  const testimonials = [];
  const testimonialsText = fs.readFileSync(testimonialsFile, "utf8");
  while ((match = testimonialRe.exec(testimonialsText))) {
    testimonials.push({ id: match[1], url: match[2] });
  }

  const heroMatch = fs
    .readFileSync(homePageFile, "utf8")
    .match(/src="(https:\/\/images\.unsplash\.com\/[^"]+)"/);

  ensureDir(path.join(PUBLIC, "products"));
  ensureDir(path.join(PUBLIC, "categories"));
  ensureDir(path.join(PUBLIC, "testimonials"));
  ensureDir(path.join(PUBLIC, "site"));

  const urlToCache = new Map();
  let fallbackPath = null;

  async function resolveDownload(url, destPath, width) {
    if (urlToCache.has(url)) {
      fs.copyFileSync(urlToCache.get(url), destPath);
      return true;
    }
    const ok = await downloadImage(url, destPath, width);
    if (ok) {
      urlToCache.set(url, destPath);
      if (!fallbackPath) fallbackPath = destPath;
      return true;
    }
    if (fallbackPath && fs.existsSync(fallbackPath)) {
      fs.copyFileSync(fallbackPath, destPath);
      return true;
    }
    return false;
  }

  console.log(`Downloading ${products.length} product images...`);
  const productResults = await runBatch(products, async (item) => {
    const dest = path.join(PUBLIC, "products", `${item.id}.jpg`);
    const ok = await resolveDownload(item.url, dest, 800);
    return { ...item, local: `/products/${item.id}.jpg`, ok };
  });

  console.log(`Downloading ${categories.length} category images...`);
  const categoryResults = await runBatch(categories, async (item) => {
    const dest = path.join(PUBLIC, "categories", `${item.id}.jpg`);
    const ok = await resolveDownload(item.url, dest, 600);
    return { ...item, local: `/categories/${item.id}.jpg`, ok };
  });

  console.log(`Downloading ${testimonials.length} testimonial avatars...`);
  const testimonialResults = await runBatch(testimonials, async (item) => {
    const dest = path.join(PUBLIC, "testimonials", `${item.id}.jpg`);
    const ok = await resolveDownload(item.url, dest, 200);
    return { ...item, local: `/testimonials/${item.id}.jpg`, ok };
  });

  if (heroMatch) {
    const heroUrl = heroMatch[1];
    const heroDest = path.join(PUBLIC, "site", "fresh-groceries.jpg");
    console.log("Downloading homepage hero image...");
    await resolveDownload(heroUrl, heroDest, 1400);
  }

  const productReplacements = productResults.map((r) => [r.url, r.local]);
  const categoryReplacements = categoryResults.map((r) => [r.url, r.local]);
  const testimonialReplacements = testimonialResults.map((r) => [r.url, r.local]);

  const productUpdates = replaceInFile(productsFile, productReplacements);
  const categoryUpdates = replaceInFile(categoriesFile, categoryReplacements);
  const testimonialUpdates = replaceInFile(testimonialsFile, testimonialReplacements);

  if (heroMatch) {
    replaceInFile(homePageFile, [[heroMatch[1], "/site/fresh-groceries.jpg"]]);
  }

  const failedProducts = productResults.filter((r) => !r.ok).length;
  console.log("\nDone.");
  console.log(`Products: ${productUpdates} URLs updated (${failedProducts} used fallback)`);
  console.log(`Categories: ${categoryUpdates} URLs updated`);
  console.log(`Testimonials: ${testimonialUpdates} URLs updated`);
  console.log(`Unique source images cached: ${urlToCache.size}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
