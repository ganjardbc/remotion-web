#!/usr/bin/env node
// Daftar baris voice over satu video dan statusnya terhadap src/videos/<Video>/voiceover.json.
//   node scripts/vo-lines.mjs [--video VueTutorial]            tabel semua baris (id, suara, hash, status)
//   node scripts/vo-lines.mjs [--video VueTutorial] --pending  JSON baris yang perlu di-generate (belum ada atau teks/suara/model berubah)
// Hash = sha1(voiceId | model | teksTTS), 12 huruf pertama. Dipakai Claude untuk memutuskan baris mana yang di-generate
// ulang, supaya kredit tidak terbuang, dan oleh vo-process.mjs untuk mencatat hasilnya.
// Dua pola video dikenali dari isi folder:
//   - Reels (config.ts + SPOKEN, tanpa voiceover.ts): satu baris per scene, id = id scene, teks = SPOKEN[id],
//     suara Nilasari, model eleven_multilingual_v2, speed 1.2 (lihat docs/struktur-video.md).
//   - Reels dialog (config.ts + scenes.ts, tanpa voiceover.ts): satu baris per baris ucapan, id = id scene + nomor urut
//     (hook-01), suara per karakter dari src/dialog-reels/voices.json.
//   - video dialog 16:9 (scenes.tsx + voiceover.ts): baris per dialog, suara per karakter.
import { build } from "esbuild";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const vi = process.argv.indexOf("--video");
const video = vi > 0 ? process.argv[vi + 1] : "VueTutorial";
const dir = join(root, "src/videos", video);
if (!existsSync(dir)) {
  console.error(`folder video tidak ada: src/videos/${video}`);
  process.exit(1);
}
const tmp = join(root, "node_modules", ".vo-tmp");
mkdirSync(tmp, { recursive: true });

// Suara baku Reels (narator Claude Code). Ubah di sini dan semua baris Reels berstatus "berubah".
const REELS_VOICE = { id: "NPDHDOOQCSyifTJZOe6J", name: "Nilasari" };
const REELS_MODEL = "eleven_multilingual_v2";
const REELS_SPEED = 1.2;

const bundle = async (entry, name, external = ["remotion", "react", "react/*", "@remotion/*"]) => {
  const outfile = join(tmp, name);
  await build({ entryPoints: [entry], bundle: true, platform: "node", format: "esm", outfile, external, loader: { ".ts": "ts", ".tsx": "tsx", ".json": "json", ".mp3": "empty" }, logLevel: "error" });
  return import(pathToFileURL(outfile).href);
};
const sha = (voiceId, model, text) => createHash("sha1").update(`${voiceId}|${model}|${text}`).digest("hex").slice(0, 12);
const statusOf = (entry, hash) => (!entry ? "baru" : entry.hash !== hash ? "berubah" : "ok");

const noVoiceoverTs = !existsSync(join(dir, "voiceover.ts"));
const isReelsDialog = existsSync(join(dir, "config.ts")) && existsSync(join(dir, "scenes.ts")) && noVoiceoverTs;
const isReels = existsSync(join(dir, "config.ts")) && existsSync(join(dir, "scenes.tsx")) && noVoiceoverTs;
const rows = [];

if (isReelsDialog) {
  const scenes = await bundle(join(dir, "scenes.ts"), "scenes.mjs");
  const vo = await bundle(join(root, "src/dialog-reels/voiceover.ts"), "dialog-vo.mjs", ["remotion", "react"]);
  const manifestFile = join(dir, "voiceover.json");
  const manifest = existsSync(manifestFile) ? JSON.parse(readFileSync(manifestFile, "utf8")).lines : {};
  scenes.BASE_SCENES.forEach((sc) => {
    sc.lines.forEach((l, i) => {
      const id = vo.lineId(sc.id, i);
      const text = vo.ttsText(l);
      const voice = vo.VO_VOICES[l.who];
      const hash = sha(voice.id, vo.VO_MODEL, text);
      const entry = manifest[id];
      rows.push({ id, scene: sc.id, who: l.who, voice: voice.name, voice_id: voice.id, model: vo.VO_MODEL, speed: vo.VO_SPEED ?? null, text, chars: text.length, hash, status: statusOf(entry, hash), slot: l.dur, duration: entry?.duration ?? null });
    });
  });
} else if (isReels) {
  const cfg = await bundle(join(dir, "config.ts"), "config.mjs");
  if (!cfg.SCENE_IDS || !cfg.SPOKEN) {
    console.error(`src/videos/${video}/config.ts tidak mengekspor SCENE_IDS dan SPOKEN.`);
    process.exit(1);
  }
  const manifestFile = join(dir, "voiceover.json");
  const manifest = existsSync(manifestFile) ? JSON.parse(readFileSync(manifestFile, "utf8")).lines : {};
  for (const id of cfg.SCENE_IDS) {
    const text = cfg.SPOKEN[id];
    const hash = sha(REELS_VOICE.id, REELS_MODEL, text);
    const entry = manifest[id];
    rows.push({ id, scene: id, who: "narator", voice: REELS_VOICE.name, voice_id: REELS_VOICE.id, model: REELS_MODEL, speed: REELS_SPEED, text, chars: text.length, hash, status: statusOf(entry, hash), slot: cfg.VO[id].seconds, duration: entry?.duration ?? null });
  }
} else {
  // Video dialog 16:9 berpola VueTutorial: scenes.tsx (BASE_SCENES) + voiceover.ts.
  const scenes = await bundle(join(dir, "scenes.tsx"), "lines.mjs");
  const vo = await bundle(join(dir, "voiceover.ts"), "vo.mjs", ["remotion", "react"]);
  scenes.BASE_SCENES.forEach((s) => {
    s.lines.forEach((l, i) => {
      const id = vo.lineId(s.id, i);
      const text = vo.ttsText(l);
      const voice = vo.VO_VOICES[l.who];
      const hash = sha(voice.id, vo.VO_MODEL, text);
      const entry = vo.VO_MANIFEST[id];
      rows.push({ id, scene: s.id, who: l.who, voice: voice.name, voice_id: voice.id, model: vo.VO_MODEL, speed: vo.VO_SPEED ?? null, text, chars: text.length, hash, status: statusOf(entry, hash), slot: l.dur, duration: entry?.duration ?? null });
    });
  });
}
rmSync(tmp, { recursive: true, force: true });

if (process.argv.includes("--pending")) {
  console.log(JSON.stringify(rows.filter((r) => r.status !== "ok"), null, 2));
} else {
  for (const r of rows) console.log(`${r.id.padEnd(18)} ${r.who.padEnd(7)} ${r.voice.padEnd(9)} ${String(r.chars).padStart(3)}h ${r.hash} ${r.status.padEnd(7)} slot=${r.slot.toFixed(1)}s ${r.duration ? `audio=${r.duration.toFixed(2)}s` : ""}`);
  const pend = rows.filter((r) => r.status !== "ok");
  console.log(`\n${rows.length} baris, ${pend.length} perlu generate (${pend.reduce((a, r) => a + r.chars, 0)} huruf ≈ ${pend.reduce((a, r) => a + r.chars, 0)} kredit).`);
}
