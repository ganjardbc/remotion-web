#!/usr/bin/env node
// Memeriksa semua berkas konten carousel (src/**/carousel.content.ts) terhadap aturan personal branding.
//   node scripts/validate-content.mjs [berkas...]
// Berkas konten mengekspor `CAROUSEL`. Keluar dengan kode 1 bila ada ERROR (warn tidak menggagalkan).
// Butuh Node >= 22.18 (pembuangan tipe TypeScript bawaan).
import { readdirSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const found = (dir) =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? found(p) : f.endsWith(".content.ts") ? [p] : [];
  });

const files = process.argv.length > 2 ? process.argv.slice(2).map((f) => resolve(f)) : found(join(root, "src"));
const { validateCarousel, formatIssues } = await import(pathToFileURL(join(root, "src/content/validate.ts")).href);

let errors = 0;
for (const file of files) {
  const rel = relative(root, file);
  const mod = await import(pathToFileURL(file).href);
  if (!mod.CAROUSEL) {
    console.log(`ERROR ${rel}: tidak mengekspor CAROUSEL.`);
    errors += 1;
    continue;
  }
  const issues = validateCarousel(mod.CAROUSEL);
  const bad = issues.filter((i) => i.level === "error").length;
  errors += bad;
  console.log(`${bad ? "GAGAL" : "OK   "} ${rel} (${mod.CAROUSEL.slides.length} slide, ${issues.length - bad} warn)`);
  if (issues.length) console.log(formatIssues(issues).replace(/^/gm, "    "));
}
if (!files.length) console.log("Belum ada berkas *.content.ts.");
process.exit(errors ? 1 : 0);
