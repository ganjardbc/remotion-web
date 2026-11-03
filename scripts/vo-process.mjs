#!/usr/bin/env node
// Mengolah satu klip voice over hasil ElevenLabs menjadi berkas siap pakai dan mencatatnya di manifest.
//
//   node scripts/vo-process.mjs <id-baris> <berkas-mentah.mp3> --hash <hash> [--video VueTutorial]
//
// Langkah: potong senyap di awal dan akhir (ambang -45 dB, sisakan 60 ms), samakan kenyaringan (loudnorm -16 LUFS,
// puncak -1,5 dB), simpan sebagai mp3 mono ke src/videos/<video>/voiceover/<id>.mp3, ukur durasi, tulis
// src/videos/<video>/voiceover.json, lalu buat ulang src/videos/<video>/voiceover-files.ts (impor tiap mp3, dipakai
// config.ts atau voiceover.ts). Aset ada di folder video, bukan public/, jadi ikut dibundel Remotion. <hash> dari
// `node scripts/vo-lines.mjs` (kolom hash baris itu) atau sha1 `voiceId|model|teks`, 12 huruf pertama.
// Butuh ffmpeg dan ffprobe.
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const fail = (msg) => {
  console.error(msg);
  process.exit(1);
};

const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = args.indexOf(name);
  if (i < 0) return fallback;
  const v = args[i + 1];
  if (v === undefined || v.startsWith("--")) fail(`${name} butuh nilai`);
  return v;
};
const positional = args.filter((a, i) => !a.startsWith("--") && !(i > 0 && args[i - 1].startsWith("--")));
const [id, rawArg] = positional;
const hash = opt("--hash");
const video = opt("--video", "VueTutorial");
if (!id || !rawArg || !hash) fail("Pakai: node scripts/vo-process.mjs <id-baris> <berkas-mentah.mp3> --hash <hash> [--video VueTutorial]");

const videoDir = join(root, "src/videos", video);
const manifestPath = join(videoDir, "voiceover.json");
const raw = resolve(rawArg);
if (!existsSync(raw)) fail(`berkas tidak ada: ${raw}`);
if (!existsSync(videoDir)) fail(`folder video tidak ada: src/videos/${video}`);

const dst = join(videoDir, "voiceover", `${id}.mp3`);
mkdirSync(dirname(dst), { recursive: true });

// silenceremove dua kali (awal, lalu balik untuk akhir) agar ujung bersih; ambang -45 dB.
const trim = "silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.06,areverse,silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.06,areverse";
const chain = `${trim},loudnorm=I=-16:TP=-1.5:LRA=11`;
try {
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", raw, "-af", chain, "-ac", "1", "-ar", "44100", "-codec:a", "libmp3lame", "-b:a", "128k", dst], { stdio: "inherit" });
} catch (e) {
  fail(`ffmpeg gagal: ${e.code === "ENOENT" ? "ffmpeg belum terpasang" : e.message}`);
}
const dur = Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", dst], { encoding: "utf8" }).trim());

const data = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, "utf8")) : { lines: {} };
data.lines[id] = { hash, file: `voiceover/${id}.mp3`, duration: Number(dur.toFixed(2)) };
data.lines = Object.fromEntries(Object.entries(data.lines).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)));
writeFileSync(manifestPath, `${JSON.stringify(data, null, 2)}\n`);

// Impor statis tiap mp3 agar bundler Remotion memberi URL-nya (dibaca config.ts atau voiceover.ts lewat VO_FILES).
const ids = Object.keys(data.lines);
const lines = ["// Dibuat otomatis oleh scripts/vo-process.mjs. Jangan diubah tangan."];
ids.forEach((k, n) => lines.push(`import f${n} from "./voiceover/${k}.mp3";`));
lines.push("", "export const VO_FILES: Readonly<Record<string, string>> = {");
ids.forEach((k, n) => lines.push(`  "${k}": f${n},`));
lines.push("};", "");
writeFileSync(join(videoDir, "voiceover-files.ts"), lines.join("\n"));
console.log(`ok ${id}: ${dur.toFixed(2)} dtk -> ${relative(root, dst)}`);
