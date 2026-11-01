#!/usr/bin/env node
// Menulis teks alternatif (alt text) per slide, caption, dan hashtag dari berkas konten carousel, siap ditempel di
// kolom alt Instagram/LinkedIn (carousel itu gambar, jadi pembaca layar tidak bisa membaca isinya).
//   node scripts/carousel-alt.mjs <berkas carousel.content.ts> [--out <folder>]
// Hasil: <out>/<NamaFolder>-alt.md (bawaan out/). Gagal bila image.src tidak ada di public/.
// Butuh Node >= 22.18.
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const argv = process.argv.slice(2);
const outIdx = argv.indexOf("--out");
const outDir = resolve(root, outIdx >= 0 ? argv[outIdx + 1] : "out");
const file = argv.find((a, i) => !a.startsWith("--") && argv[i - 1] !== "--out");
if (!file) {
  console.error("Pakai: node scripts/carousel-alt.mjs <berkas carousel.content.ts> [--out <folder>]");
  process.exit(1);
}

const abs = resolve(file);
const { CAROUSEL: c } = await import(pathToFileURL(abs).href);
if (!c) {
  console.error("Berkas tidak mengekspor CAROUSEL.");
  process.exit(1);
}

const sentence = (s) => (/[.!?:]$/.test(s.trim()) ? s.trim() : `${s.trim()}.`);
const missing = [];
const alt = c.slides.map((s, i) => {
  const parts = [`Slide ${i + 1} dari ${c.slides.length}.`, sentence(s.title)];
  if (s.stat) parts.push(sentence(`${s.stat.label}: ${s.stat.value}${s.stat.note ? `, ${s.stat.note}` : ""}`));
  parts.push(...s.paragraphs.map(sentence));
  if (s.quote) parts.push(sentence(`Kutipan: ${s.quote}`));
  if (s.code) parts.push(`Kode ${s.code.lang}: ${s.code.code.trim().replace(/\s*\n\s*/g, "; ")}`);
  if (s.cta) parts.push(sentence(s.cta));
  if (s.image) {
    parts.push(sentence(`Gambar: ${s.image.alt}`));
    if (!existsSync(join(root, "public", s.image.src))) missing.push(`slide ${i + 1}: public/${s.image.src}`);
  }
  if (s.cast?.length) parts.push(`Karakter: ${s.cast.map((k) => `${k.character} (${k.expression})`).join(", ")}.`);
  return parts.join(" ");
});

if (missing.length) {
  console.error(`Gambar tidak ditemukan:\n  ${missing.join("\n  ")}`);
  process.exit(1);
}

const name = basename(dirname(abs));
const md = `# ${c.title} (carousel, ${c.slides.length} slide)

## Alt text per slide

${alt.map((a, i) => `${i + 1}. ${a}`).join("\n")}

## Caption

${c.caption}

${c.hashtags.join(" ")}
`;
mkdirSync(outDir, { recursive: true });
const target = join(outDir, `${name}-alt.md`);
writeFileSync(target, md);
console.log(`Ditulis ${target} (${c.slides.length} slide).`);
