#!/usr/bin/env node
// Membuat folder carousel baru (Format B opini atau C tutorial) sesuai docs/struktur-video.md dan docs/carousel.md.
//   node scripts/new-carousel.mjs <NamaPascalCase> "<Judul carousel>" [--format B|C] [--variant quick-tips|walkthrough]
// Menulis carousel.content.ts (kerangka slide dengan teks TODO yang lolos validator) dan <Nama>Carousel.tsx dari
// scripts/templates/carousel, komposisi <Nama>-Carousel terdaftar otomatis dari export COMPOSITION
// (src/compositions.ts), jadi src/Root.tsx tidak perlu diubah. Setelah itu: isi semua baris TODO, `npm run validate` sampai bersih, dan render dengan `--sequence --image-format=png` (lihat docs/carousel.md).
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const argv = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 ? argv[i + 1] : fallback;
};
const valueIdx = new Set(["--format", "--variant"].map((n) => argv.indexOf(n) + 1).filter((i) => i > 0));
const [name, title] = argv.filter((a, i) => !a.startsWith("--") && !valueIdx.has(i));
const format = opt("--format", "B");
const variant = opt("--variant", "quick-tips");

const usage = 'Pakai: node scripts/new-carousel.mjs <NamaPascalCase> "<Judul carousel>" [--format B|C] [--variant quick-tips|walkthrough]';
const fail = (msg) => {
  console.error(msg);
  process.exit(1);
};
if (!name || !title || !/^[A-Z][A-Za-z0-9]*$/.test(name)) fail(usage);
if (!["B", "C"].includes(format)) fail("--format harus B atau C.");
if (format === "C" && !["quick-tips", "walkthrough"].includes(variant)) fail("--variant harus quick-tips atau walkthrough.");
const titleWords = title.trim().split(/\s+/).length;
if (format === "B" && (titleWords < 4 || titleWords > 8)) fail(`Judul Format B harus 4-8 kata, sekarang ${titleWords}.`);

const upper = name.replace(/([a-z0-9])([A-Z])/g, "$1_$2").toUpperCase();
const dst = join(root, "src/videos", name);
const tpl = join(root, "scripts/templates/carousel");
if (existsSync(dst)) fail(`sudah ada: src/videos/${name}`);

const q = (s) => JSON.stringify(s);
// Satu slide sebagai teks TypeScript. Teks isi sengaja berupa satu kalimat TODO supaya lolos aturan jumlah kalimat.
const slide = ({ role, label, extra = [], code = false, cta = false }) => {
  const lines = ["    {", `      role: ${q(role)},`, `      title: ${q(`TODO: judul slide ${label}`)},`, `      paragraphs: [${q(`TODO: isi slide ${label}.`)}],`];
  if (code) lines.push(`      code: { lang: "bash", code: "# TODO: perintah atau kode, maksimal 12 baris" },`);
  if (cta) lines.push(`      cta: ${q("TODO: ajakan follow dengan alasan spesifik ke isi konten.")},`);
  lines.push(...extra, "    },");
  return lines.join("\n");
};

let slides;
if (format === "B") {
  slides = [
    slide({ role: "hook", label: "hook" }),
    slide({ role: "relate", label: "relate", cta: true }),
    slide({ role: "shift", label: "shift (inti)", extra: [`      quote: ${q("TODO: kalimat kunci, maksimal 120 karakter.")},`] }),
    slide({ role: "detail", label: "pendalaman 1" }),
    slide({ role: "detail", label: "pendalaman 2" }),
    slide({ role: "closing", label: "closing (quotable)" }),
  ];
} else {
  const steps = variant === "quick-tips" ? 3 : 6;
  slides = [
    slide({ role: "hook", label: "hook (satu kalimat, boleh berupa hasil)" }),
    slide({ role: "detail", label: "konteks singkat", cta: true }),
    ...Array.from({ length: steps }, (_, i) => slide({ role: "step", label: `langkah ${i + 1}`, code: true })),
    slide({ role: "closing", label: "hasil dan closing" }),
  ];
}

const fill = (s) =>
  s
    .replaceAll("__NAME__", name)
    .replaceAll("__UPPER__", upper)
    .replaceAll("__TITLE__", title)
    .replaceAll("__FORMAT__", format)
    .replaceAll("__KIND__", format === "B" ? "opini" : `tutorial, ${variant}`)
    .replaceAll("__VARIANT__", format === "C" ? `\n  variant: ${q(variant)},` : "")
    .replaceAll("__SLIDES__", slides.join("\n"));
const read = (p) => readFileSync(p, "utf8");

mkdirSync(dst, { recursive: true });
writeFileSync(join(dst, "carousel.content.ts"), fill(read(join(tpl, "carousel.content.ts.tmpl"))));
writeFileSync(join(dst, `${name}Carousel.tsx`), fill(read(join(tpl, "Carousel.tsx.tmpl"))));

console.log(`Dibuat src/videos/${name} (Format ${format}${format === "C" ? `, ${variant}` : ""}, ${slides.length} slide). Berikutnya: isi baris TODO di carousel.content.ts, lalu npm run validate.`);
