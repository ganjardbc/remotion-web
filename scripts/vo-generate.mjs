#!/usr/bin/env node
// Membuat voice over yang belum ada (atau teks/suara/modelnya berubah) untuk satu video lewat API ElevenLabs.
//   node scripts/vo-generate.mjs --video <Video> [--yes]
// Daftar baris dari `scripts/vo-lines.mjs --pending`. Sebelum memanggil API, jumlah baris dan huruf (≈ kredit)
// ditampilkan dan diminta konfirmasi; --yes melewatinya. Tiap klip mentah disimpan di out/vo-raw/<Video>/<id>.mp3,
// lalu diolah scripts/vo-process.py ke folder video. Butuh ELEVENLABS_API_KEY (environment atau .env.local).
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { createInterface } from "node:readline/promises";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const vi = process.argv.indexOf("--video");
const video = vi > 0 ? process.argv[vi + 1] : undefined;
if (!video) {
  console.error("Pakai: node scripts/vo-generate.mjs --video <Video> [--yes]");
  process.exit(1);
}

const pending = JSON.parse(execFileSync("node", [join(root, "scripts/vo-lines.mjs"), "--video", video, "--pending"], { encoding: "utf8" }));
if (!pending.length) {
  console.log(`${video}: semua baris voice over sudah ada.`);
  process.exit(0);
}

const chars = pending.reduce((a, r) => a + r.chars, 0);
for (const r of pending) {
  const text = r.text.length > 70 ? `${r.text.slice(0, 67)}...` : r.text;
  console.log(`${r.id.padEnd(14)} ${r.voice.padEnd(9)} ${String(r.chars).padStart(4)}h  ${r.status.padEnd(7)} ${text}`);
}
console.log(`\n${pending.length} baris, ${chars} huruf (≈ ${chars} kredit ElevenLabs), model ${pending[0].model}${pending[0].speed ? `, speed ${pending[0].speed}` : ""}.`);

if (!process.argv.includes("--yes")) {
  if (!process.stdin.isTTY) {
    console.error("Butuh konfirmasi: jalankan di terminal, atau tambahkan --yes.");
    process.exit(1);
  }
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const answer = (await rl.question("Lanjut generate? [y/N] ")).trim().toLowerCase();
  rl.close();
  if (answer !== "y" && answer !== "ya") {
    console.log("Dibatalkan; tidak ada kredit terpakai.");
    process.exit(0);
  }
}

const envKey = () => {
  if (process.env.ELEVENLABS_API_KEY) return process.env.ELEVENLABS_API_KEY;
  const file = join(root, ".env.local");
  if (!existsSync(file)) return undefined;
  const line = readFileSync(file, "utf8").split("\n").find((l) => l.startsWith("ELEVENLABS_API_KEY="));
  return line?.slice("ELEVENLABS_API_KEY=".length).trim().replace(/^["']|["']$/g, "");
};
const key = envKey();
if (!key) {
  console.error("ELEVENLABS_API_KEY tidak ada di environment maupun .env.local.");
  process.exit(1);
}

const rawDir = join(root, "out/vo-raw", video);
mkdirSync(rawDir, { recursive: true });
let done = 0;
for (const r of pending) {
  const body = { text: r.text, model_id: r.model, ...(r.speed ? { voice_settings: { speed: r.speed } } : {}) };
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${r.voice_id}?output_format=mp3_44100_128`, {
    method: "POST",
    headers: { "xi-api-key": key, "Content-Type": "application/json", Accept: "audio/mpeg" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    console.error(`Gagal ${r.id}: HTTP ${res.status} ${await res.text()}`);
    console.error(`${done} dari ${pending.length} baris selesai; jalankan lagi untuk melanjutkan sisanya.`);
    process.exit(1);
  }
  const raw = join(rawDir, `${r.id}.mp3`);
  writeFileSync(raw, Buffer.from(await res.arrayBuffer()));
  execFileSync("python3", [join(root, "scripts/vo-process.py"), r.id, raw, "--hash", r.hash, "--video", video], { stdio: "inherit" });
  done += 1;
}
console.log(`${done} baris selesai. Durasi scene kini mengikuti audio; cek dengan Remotion Studio atau render.`);
