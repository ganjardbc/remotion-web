#!/usr/bin/env node
// Memeriksa struktur folder src/videos/<Nama> terhadap docs/struktur-video.md.
//   node scripts/validate-structure.mjs [Nama...]
// Jenis folder dikenali dari isinya: carousel (carousel.content.ts), video dialog (SceneRenderer.tsx), Reels
// (config.ts + scenes.tsx). Folder di EXEMPT dilewati. Keluar dengan kode 1 bila ada ERROR.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const videos = join(root, "src/videos");

// Bukan konten video (prototipe karakter untuk Studio), jadi tidak mengikuti pola folder.
const EXEMPT = new Set(["CharacterRigDemo"]);
// Pengecualian nama berkas yang sudah disepakati di docs/struktur-video.md.
const SFX_EXCEPTION = { VueTutorial: "VueSfx.tsx" };

const HASHTAGS = ["#DeveloperIndonesia", "#AIForDeveloper", "#CareerDeveloper", "#ProgrammerIndonesia", "#TechMindset"];
const FORMAT_A = ["hook", "relate", "shift", "urgency", "closing", "cta"];
const CONFIG_EXPORTS = ["FPS", "LEAD", "SCENE_IDS", "SPOKEN", "CAPTION", "HASHTAGS", "VO", "at", "SCENE_FRAMES", "SCENE_START", "TOTAL_FRAMES", "MUSIC_FILE"];
const cap = (s) => s[0].toUpperCase() + s.slice(1);

const REELS_FILES = (n) => ["README.md", `${n}Video.tsx`, "config.ts", "scenes.tsx", "parts.tsx", "voiceover.json", "voiceover-files.ts"];
const CAROUSEL_FILES = (n) => [`${n}Carousel.tsx`, "carousel.content.ts"];
const DIALOG_FILES = (n) => ["README.md", `${n}Video.tsx`, "scenes.tsx", "SceneRenderer.tsx", "world.tsx", "cards.tsx", "sfxTypes.ts", SFX_EXCEPTION[n] ?? `${n}Sfx.tsx`, "voiceover.ts", "voiceover.json", "voiceover-files.ts"];

const read = (p) => readFileSync(p, "utf8");
const listFiles = (dir, prefix = "") =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? listFiles(p, `${prefix}${f}/`) : [`${prefix}${f}`];
  });

const checkFolder = (name) => {
  const dir = join(videos, name);
  const errors = [];
  const warns = [];
  const files = listFiles(dir);
  const top = new Set(files.map((f) => f.split("/")[0]));
  const has = (f) => files.includes(f);
  const err = (m) => errors.push(m);

  if (!/^[A-Z][A-Za-z0-9]*$/.test(name)) err("nama folder harus PascalCase.");

  const type = has("carousel.content.ts") ? "carousel" : has("SceneRenderer.tsx") ? "dialog" : has("config.ts") && has("scenes.tsx") ? "reels" : null;
  if (!type) return { type: "?", errors: ["jenis folder tidak dikenali (bukan carousel, dialog, atau Reels)."], warns };

  const required = type === "carousel" ? CAROUSEL_FILES(name) : type === "dialog" ? DIALOG_FILES(name) : REELS_FILES(name);
  for (const f of required) if (!has(f)) err(`berkas wajib tidak ada: ${f}`);
  const allowed = new Set([...required, "voiceover"]);
  for (const t of top) if (!allowed.has(t)) err(`berkas tidak diizinkan: ${t}`);
  if (type === "carousel" && top.has("voiceover")) err("carousel tidak boleh punya voiceover/.");

  // Tidak boleh mengimpor dari folder video lain: "../<Nama>/..." (dua tingkat ke atas ke src/ tetap boleh).
  for (const f of files.filter((x) => /\.(ts|tsx)$/.test(x))) {
    const depth = f.split("/").length - 1;
    const up = "../".repeat(depth + 1);
    const re = new RegExp(`from\\s+"${up.replaceAll(".", "\\.")}[A-Za-z]`);
    if (re.test(read(join(dir, f)))) err(`${f}: impor dari folder video lain.`);
  }

  // Komposisi terdaftar otomatis (src/compositions.ts) dari export COMPOSITION di berkas utama folder.
  const registered = (id, file) => {
    if (!has(file)) return false;
    const src = read(join(dir, file));
    return /export const COMPOSITION\b/.test(src) && src.includes(`id: "${id}"`);
  };
  if (type === "reels") {
    if (!registered(`${name}-Reels`, `${name}Video.tsx`)) err(`${name}Video.tsx tidak mengekspor COMPOSITION dengan id "${name}-Reels".`);
    if (has("config.ts")) {
      const cfg = read(join(dir, "config.ts"));
      for (const e of CONFIG_EXPORTS) if (!new RegExp(`export (const|type) ${e}\\b`).test(cfg)) err(`config.ts tidak mengekspor ${e}.`);
      const tagMatch = cfg.match(/export const HASHTAGS = \[([^\]]*)\]/);
      if (tagMatch) {
        const tags = [...tagMatch[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]);
        if (tags.length !== 5) err(`HASHTAGS harus tepat 5, ada ${tags.length}.`);
        else if (tags.join(" ") !== HASHTAGS.join(" ")) err("HASHTAGS bukan set baku.");
      }
      const idsMatch = cfg.match(/export const SCENE_IDS = \[([^\]]*)\]/);
      const ids = idsMatch ? [...idsMatch[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]) : [];
      if (ids.length === 0) err("SCENE_IDS kosong atau tidak terbaca.");
      for (const id of ids) {
        if (!/^[a-z]+$/.test(id)) err(`id scene "${id}" harus huruf kecil, satu kata.`);
        if (has("scenes.tsx") && !new RegExp(`export const ${cap(id)}Scene\\b`).test(read(join(dir, "scenes.tsx")))) err(`scenes.tsx tidak mengekspor ${cap(id)}Scene.`);
      }
      const order = FORMAT_A.map((s) => ids.indexOf(s));
      if (order.some((i) => i < 0) || order.some((v, i) => i > 0 && v < order[i - 1])) warns.push("scene Format A (hook, relate, shift, urgency, closing, cta) tidak lengkap atau urutannya beda; abaikan kalau ini Format C.");
      if (top.has("voiceover") === false && /"file"/.test(read(join(dir, "voiceover.json")))) err("voiceover.json berisi klip tapi folder voiceover/ tidak ada.");
    }
    if (has(`${name}Video.tsx`)) {
      const v = read(join(dir, `${name}Video.tsx`));
      if (!new RegExp(`export const ${name}Video\\b`).test(v)) err(`${name}Video.tsx tidak mengekspor ${name}Video.`);
      if (!/export \{ TOTAL_FRAMES \}/.test(v)) err(`${name}Video.tsx tidak mengekspor ulang TOTAL_FRAMES.`);
      const footers = (v.match(/<BrandFooter\b/g) ?? []).length;
      if (footers !== 1) err(`BrandFooter harus dirender tepat sekali di root, ada ${footers}.`);
    }
    if (has("README.md")) {
      const r = read(join(dir, "README.md"));
      for (const h of ["## Voiceover", "## Caption"]) if (!r.includes(h)) err(`README.md tidak punya bagian "${h}".`);
    }
  } else if (type === "carousel") {
    if (!registered(`${name}-Carousel`, `${name}Carousel.tsx`)) err(`${name}Carousel.tsx tidak mengekspor COMPOSITION dengan id "${name}-Carousel".`);
    if (has(`${name}Carousel.tsx`) && !new RegExp(`export const ${name}Carousel\\b`).test(read(join(dir, `${name}Carousel.tsx`)))) err(`${name}Carousel.tsx tidak mengekspor ${name}Carousel.`);
  } else if (!registered(name, `${name}Video.tsx`)) {
    err(`${name}Video.tsx tidak mengekspor COMPOSITION dengan id "${name}".`);
  }
  return { type, errors, warns };
};

const only = process.argv.slice(2);
const unknown = only.filter((n) => !existsSync(join(videos, n)));
if (unknown.length) {
  console.error(`folder tidak ada: ${unknown.map((n) => `src/videos/${n}`).join(", ")}`);
  process.exit(1);
}
const names = (only.length ? only : readdirSync(videos)).filter((n) => statSync(join(videos, n)).isDirectory());
let bad = 0;
for (const name of names) {
  if (EXEMPT.has(name)) {
    console.log(`SKIP  ${name} (bukan konten video)`);
    continue;
  }
  const { type, errors, warns } = checkFolder(name);
  bad += errors.length;
  console.log(`${errors.length ? "GAGAL" : "OK   "} ${name} (${type})`);
  for (const e of errors) console.log(`    ERROR ${e}`);
  for (const w of warns) console.log(`    warn  ${w}`);
}
for (const l of EXEMPT) if (!existsSync(join(videos, l))) console.log(`warn  EXEMPT berisi folder yang sudah tidak ada: ${l}`);
process.exit(bad ? 1 : 0);
