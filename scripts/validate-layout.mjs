#!/usr/bin/env node
// Memeriksa peta zona layout Reels (src/reelsLayout.ts) dan berkas video yang memakainya.
//   node scripts/validate-layout.mjs [Nama...]
// 1. Zona masuk akal (layoutProblems): ERROR kalau tidak.
// 2. Berkas src/videos/<Nama>/*.ts(x) yang mengimpor reelsLayout dicari posisi piksel yang ditulis langsung
//    (`top: 120`, `top={120}`, `y = 120`, `CAPTION_Y ... : 120`). Posisi di zona atas (di atas contentTop) atau pita caption
//    yang keluar dari meja atau menimpa footer dicatat sebagai PERINGATAN: pakai ZONES dari reelsLayout.
//    Video yang belum mengimpor reelsLayout dilewati (belum ikut peta).
import { build } from "esbuild";
import { existsSync, mkdirSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const tmp = join(root, "node_modules", ".vo-tmp");
mkdirSync(tmp, { recursive: true });
const outfile = join(tmp, "reelsLayout.mjs");
await build({ entryPoints: [join(root, "src/reelsLayout.ts")], bundle: true, platform: "node", format: "esm", outfile, logLevel: "error" });
const layout = await import(`${pathToFileURL(outfile).href}?t=${Date.now()}`);
const { ZONES, DESK_BOTTOM } = layout;

let errors = 0;
for (const msg of layout.layoutProblems()) {
  console.log(`ERROR layout: ${msg}`);
  errors += 1;
}

const only = process.argv.slice(2);
const videos = join(root, "src/videos");
let warned = 0;
for (const name of readdirSync(videos).filter((n) => (only.length ? only.includes(n) : true))) {
  const dir = join(videos, name);
  const files = existsSync(dir) ? readdirSync(dir).filter((f) => /\.(ts|tsx)$/.test(f)) : [];
  const uses = files.filter((f) => /from\s+"(\.\.\/)+reelsLayout"/.test(readFileSync(join(dir, f), "utf8")));
  if (uses.length === 0) continue;
  const out = [];
  for (const f of files) {
    const src = readFileSync(join(dir, f), "utf8");
    const lines = src.split("\n");
    lines.forEach((line, i) => {
      if (/^\s*\/\//.test(line)) return;
      for (const m of line.matchAll(/\btop:\s*(\d+)\b|\btop=\{(\d+)\}|[,(]\s*y\s*=\s*(\d+)\b/g)) {
        const n = Number(m[1] ?? m[2] ?? m[3]);
        if (n > 0 && n < ZONES.contentTop) out.push(`${f}:${i + 1}: posisi ${n} di atas contentTop (${ZONES.contentTop}); pakai ZONES.contentTop agar tidak menempel header.`);
      }
      for (const m of line.matchAll(/CAPTION_Y[^=]*=.*/g)) {
        for (const n of [...m[0].matchAll(/:\s*(\d{3,4})\b/g)].map((x) => Number(x[1]))) {
          if (n < ZONES.deskTop || n + ZONES.captionHeight > DESK_BOTTOM) out.push(`${f}:${i + 1}: caption y ${n} di luar meja (${ZONES.deskTop}-${DESK_BOTTOM}); pakai ZONES.captionTop.`);
        }
      }
    });
  }
  if (out.length === 0) console.log(`OK    ${name} (memakai peta zona)`);
  else {
    console.log(`WARN  ${name}`);
    for (const o of out) console.log(`    warn  ${o}`);
    warned += out.length;
  }
}
console.log(errors ? `${errors} ERROR` : `Peta zona beres${warned ? `, ${warned} peringatan` : ""}.`);
process.exit(errors ? 1 : 0);
