#!/usr/bin/env node
// Daftar baris voice over satu video dan statusnya terhadap src/videos/<Video>/voiceover.json.
//   node scripts/vo-lines.mjs [--video VueTutorial]            tabel semua baris (id, suara, hash, status)
//   node scripts/vo-lines.mjs [--video VueTutorial] --pending  JSON baris yang perlu di-generate (belum ada atau teks/suara/model berubah)
// Hash = sha1(voiceId | model | teksTTS), 12 huruf pertama. Dipakai Claude untuk memutuskan baris mana yang di-generate
// ulang, supaya kredit tidak terbuang, dan oleh vo-process.py untuk mencatat hasilnya.
import { build } from "esbuild";
import { createHash } from "node:crypto";
import { mkdirSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const vi = process.argv.indexOf("--video");
const video = vi > 0 ? process.argv[vi + 1] : "VueTutorial";
const dir = join(root, "src/videos", video);
const tmp = join(root, "node_modules", ".vo-tmp");
mkdirSync(tmp, { recursive: true });
const out = join(tmp, "lines.mjs");

await build({
  entryPoints: [join(dir, "scenes.tsx")],
  bundle: true,
  platform: "node",
  format: "esm",
  outfile: out,
  external: ["remotion", "react", "react/*", "@remotion/*"],
  loader: { ".tsx": "tsx", ".json": "json", ".mp3": "empty" },
  logLevel: "error",
});
const scenes = await import(pathToFileURL(out).href);
const vo = await import(pathToFileURL((await bundleVo()).path).href);

async function bundleVo() {
  const p = join(tmp, "vo.mjs");
  await build({ entryPoints: [join(dir, "voiceover.ts")], bundle: true, platform: "node", format: "esm", outfile: p, external: ["remotion", "react"], loader: { ".json": "json", ".mp3": "empty" }, logLevel: "error" });
  return { path: p };
}

const rows = [];
scenes.BASE_SCENES.forEach((s) => {
  s.lines.forEach((l, i) => {
    const id = vo.lineId(s.id, i);
    const text = vo.ttsText(l);
    const voice = vo.VO_VOICES[l.who];
    const hash = createHash("sha1").update(`${voice.id}|${vo.VO_MODEL}|${text}`).digest("hex").slice(0, 12);
    const entry = vo.VO_MANIFEST[id];
    const status = !entry ? "baru" : entry.hash !== hash ? "berubah" : "ok";
    rows.push({ id, scene: s.id, who: l.who, voice: voice.name, voice_id: voice.id, model: vo.VO_MODEL, text, chars: text.length, hash, status, slot: l.dur, duration: entry?.duration ?? null });
  });
});
rmSync(tmp, { recursive: true, force: true });

if (process.argv.includes("--pending")) {
  console.log(JSON.stringify(rows.filter((r) => r.status !== "ok"), null, 2));
} else {
  for (const r of rows) console.log(`${r.id.padEnd(18)} ${r.who.padEnd(6)} ${r.voice.padEnd(9)} ${String(r.chars).padStart(3)}h ${r.hash} ${r.status.padEnd(7)} slot=${r.slot.toFixed(1)}s ${r.duration ? `audio=${r.duration.toFixed(2)}s` : ""}`);
  const pend = rows.filter((r) => r.status !== "ok");
  console.log(`\n${rows.length} baris, ${pend.length} perlu generate (${pend.reduce((a, r) => a + r.chars, 0)} huruf ≈ ${pend.reduce((a, r) => a + r.chars, 0)} kredit).`);
}
