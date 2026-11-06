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
const REELS_DIALOG_FILES = (n) => ["README.md", `${n}Video.tsx`, "config.ts", "scenes.ts", "voiceover.json", "voiceover-files.ts"];
const CAROUSEL_FILES = (n) => [`${n}Carousel.tsx`, "carousel.content.ts"];
const DIALOG_FILES = (n) => ["README.md", `${n}Video.tsx`, "scenes.tsx", "SceneRenderer.tsx", "world.tsx", "cards.tsx", "sfxTypes.ts", SFX_EXCEPTION[n] ?? `${n}Sfx.tsx`, "voiceover.ts", "voiceover.json", "voiceover-files.ts"];

const read = (p) => readFileSync(p, "utf8");
const listFiles = (dir, prefix = "") =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? listFiles(p, `${prefix}${f}/`) : [`${prefix}${f}`];
  });

// Isi scenes.ts Reels dialog: urutan dan durasi baris, cutaway (`inserts`), ekspresi, teks layar, nada. Dibaca dengan regex
// dari teks berkas (bukan dijalankan), jadi hanya mengenali bentuk yang dipakai scaffold dan JagoDikit.
const INSERT_KINDS = ["promptKode", "terminalError", "muridBertanya", "alarmProduction", "kartuFollow", "gitBlame", "landingKelas", "silabusBaru"];
const EXPRESSIONS = ["netral", "senang", "sedih", "kaget", "bingung", "mikir", "kesal", "marah", "serius", "malu", "mataTertutup"];
const TONES = ["terang", "biru", "gelap"];
const MOTIONS = ["headTurn", "point", "startle", "armGesture", "tunjuk", "surprise", "walk"];
const TAIL = 0.6;
// Pedoman irama Reels narator (peringatan saja, bukan error).
const BEAT_MAX_SCENE = 8;
const BEAT_EVERY = 4;

const checkDialogScenes = (sc, err, warns) => {
  const starts = [...sc.matchAll(/^ {4}id: "([^"]+)",$/gm)];
  starts.forEach((m, i) => {
    const id = m[1];
    const block = sc.slice(m.index, i + 1 < starts.length ? starts[i + 1].index : sc.length);
    const seconds = Number(block.match(/^ {4}seconds:\s*([\d.]+)/m)?.[1] ?? 0);
    const tone = block.match(/^ {4}tone:\s*"([^"]+)"/m)?.[1];
    if (tone && !TONES.includes(tone)) err(`scene ${id}: tone "${tone}" tidak dikenal (${TONES.join(", ")}).`);
    const lines = [...block.matchAll(/who:\s*"(\w+)",\s*from:\s*([\d.]+),\s*dur:\s*([\d.]+)/g)].map((x) => ({ who: x[1], from: Number(x[2]), dur: Number(x[3]) }));
    lines.forEach((l, k) => {
      const prev = lines[k - 1];
      if (prev && l.from < prev.from + prev.dur) warns.push(`scene ${id}: baris ${k + 1} mulai ${l.from} dtk sebelum baris ${k} selesai (${(prev.from + prev.dur).toFixed(1)} dtk); mesin akan menggesernya.`);
    });
    const end = lines.reduce((mx, l) => Math.max(mx, l.from + l.dur), 0);
    const length = Math.max(seconds, end + TAIL);
    for (const e of block.matchAll(/expressions:\s*\{([^}]*)\}/g))
      for (const [, who, ex] of e[1].matchAll(/(\w+):\s*"(\w+)"/g)) if (!EXPRESSIONS.includes(ex)) err(`scene ${id}: ekspresi "${ex}" (${who}) tidak ada di kosakata.`);
    for (const e of block.matchAll(/motions:\s*\{([^}]*)\}/g))
      for (const [, who, mo] of e[1].matchAll(/(\w+):\s*"(\w+)"/g)) if (!MOTIONS.includes(mo)) err(`scene ${id}: gerak "${mo}" (${who}) tidak dikenal (${MOTIONS.join(", ")}).`);
    const zoom = block.match(/^ {4}zoom:\s*\{\s*from:\s*([\d.]+),\s*to:\s*([\d.]+)/m);
    if (zoom && [zoom[1], zoom[2]].some((z) => Number(z) < 0.8 || Number(z) > 1.4)) err(`scene ${id}: zoom ${zoom[1]} ke ${zoom[2]} di luar 0,8-1,4 (kanvas tepi bisa terlihat atau terlalu dekat).`);
    for (const t of block.matchAll(/(?:screenText|onScreenText):\s*"([^"]*)"/g)) {
      const marks = (t[1].match(/\*/g) ?? []).length;
      if (marks % 2 !== 0) err(`scene ${id}: teks layar "${t[1]}" punya tanda * yang tidak berpasangan.`);
      else if (marks > 2) err(`scene ${id}: teks layar "${t[1]}" punya lebih dari satu sorotan (oranye hanya satu frasa per layar).`);
    }
    const inserts = [...block.matchAll(/kind:\s*"(\w+)",\s*from:\s*([\d.]+),\s*dur:\s*([\d.]+)/g)].map((x) => ({ kind: x[1], from: Number(x[2]), dur: Number(x[3]) }));
    inserts.forEach((x, k) => {
      if (!INSERT_KINDS.includes(x.kind)) err(`scene ${id}: cutaway "${x.kind}" tidak dikenal (${INSERT_KINDS.join(", ")}).`);
      if (x.dur < 1.5) warns.push(`scene ${id}: cutaway ${x.kind} hanya ${x.dur} dtk; terlalu singkat untuk terbaca.`);
      if (x.from + x.dur > length + 1e-6) err(`scene ${id}: cutaway ${x.kind} berakhir di ${(x.from + x.dur).toFixed(1)} dtk, melewati akhir scene (${length.toFixed(1)} dtk).`);
      const prev = inserts[k - 1];
      if (prev && x.from < prev.from + prev.dur) err(`scene ${id}: cutaway ${x.kind} tumpang tindih dengan ${prev.kind}.`);
    });
    if (/TODO/.test(block)) warns.push(`scene ${id}: masih ada teks TODO.`);
    if (id === "hook" && lines.length !== 1) warns.push(`scene hook punya ${lines.length} baris ucapan; Format A: hook 1 kalimat dari satu baris.`);
  });
};

const checkFolder = (name) => {
  const dir = join(videos, name);
  const errors = [];
  const warns = [];
  const files = listFiles(dir);
  const top = new Set(files.map((f) => f.split("/")[0]));
  const has = (f) => files.includes(f);
  const err = (m) => errors.push(m);

  if (!/^[A-Z][A-Za-z0-9]*$/.test(name)) err("nama folder harus PascalCase.");

  const type = has("carousel.content.ts") ? "carousel" : has("SceneRenderer.tsx") ? "dialog" : has("config.ts") && has("scenes.tsx") ? "reels" : has("config.ts") && has("scenes.ts") ? "reels-dialog" : null;
  if (!type) return { type: "?", errors: ["jenis folder tidak dikenali (bukan carousel, dialog, Reels, atau Reels dialog)."], warns };

  const required = type === "carousel" ? CAROUSEL_FILES(name) : type === "dialog" ? DIALOG_FILES(name) : type === "reels-dialog" ? REELS_DIALOG_FILES(name) : REELS_FILES(name);
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
      // Irama visual (docs/struktur-video.md, "Irama scene"): scene lebih dari BEAT_MAX_SCENE detik perlu beat visual baru tiap ~4 dtk.
      if (has("voiceover.json")) {
        const lines = JSON.parse(read(join(dir, "voiceover.json"))).lines ?? {};
        for (const [id, e] of Object.entries(lines)) {
          if (typeof e?.duration === "number" && e.duration > BEAT_MAX_SCENE) warns.push(`scene ${id}: ${e.duration.toFixed(1)} dtk (> ${BEAT_MAX_SCENE}). Pastikan ada perubahan visual baru tiap ~${BEAT_EVERY} dtk, jangan ada dead time.`);
        }
      }
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
  } else if (type === "reels-dialog") {
    if (!registered(`${name}-Reels`, `${name}Video.tsx`)) err(`${name}Video.tsx tidak mengekspor COMPOSITION dengan id "${name}-Reels".`);
    if (has("config.ts")) {
      const cfg = read(join(dir, "config.ts"));
      for (const e of ["META", "CAPTION", "HASHTAGS", "VO_MANIFEST"]) if (!new RegExp(`export const ${e}\\b`).test(cfg)) err(`config.ts tidak mengekspor ${e}.`);
      const tagMatch = cfg.match(/export const HASHTAGS = \[([^\]]*)\]/);
      if (tagMatch) {
        const tags = [...tagMatch[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]);
        if (tags.length !== 5) err(`HASHTAGS harus tepat 5, ada ${tags.length}.`);
        else if (tags.join(" ") !== HASHTAGS.join(" ")) err("HASHTAGS bukan set baku.");
      }
    }
    if (has("scenes.ts")) {
      const sc = read(join(dir, "scenes.ts"));
      if (!/export const BASE_SCENES\b/.test(sc)) err("scenes.ts tidak mengekspor BASE_SCENES.");
      const ids = [...sc.matchAll(/^ {4}id: "([^"]+)",$/gm)].map((m) => m[1]);
      if (ids.length === 0) err("scenes.ts tidak punya scene (id: \"...\" pada indentasi 4 spasi).");
      for (const id of ids) if (!/^[a-z]+$/.test(id)) err(`id scene "${id}" harus huruf kecil, satu kata.`);
      const order = FORMAT_A.map((x) => ids.indexOf(x));
      if (order.some((i) => i < 0) || order.some((v, i) => i > 0 && v < order[i - 1])) warns.push("scene Format A (hook, relate, shift, urgency, closing, cta) tidak lengkap atau urutannya beda; abaikan kalau ini Format C.");
      checkDialogScenes(sc, err, warns);
    }
    if (has(`${name}Video.tsx`)) {
      const v = read(join(dir, `${name}Video.tsx`));
      if (!new RegExp(`export const ${name}Video\\b`).test(v)) err(`${name}Video.tsx tidak mengekspor ${name}Video.`);
      if (!/export const TOTAL_FRAMES\b|export \{ TOTAL_FRAMES \}/.test(v)) err(`${name}Video.tsx tidak mengekspor TOTAL_FRAMES.`);
      if (!/\bDraftVideo\b/.test(v)) err(`${name}Video.tsx tidak memakai DraftVideo (mesin Reels dialog, merender BrandFooter).`);
    }
    if (has("README.md")) {
      const r = read(join(dir, "README.md"));
      for (const h of ["## Voiceover", "## Caption"]) if (!r.includes(h)) err(`README.md tidak punya bagian "${h}".`);
    }
    if (!top.has("voiceover") && /"file"/.test(read(join(dir, "voiceover.json")))) err("voiceover.json berisi klip tapi folder voiceover/ tidak ada.");
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
