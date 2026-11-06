#!/usr/bin/env node
// Mengukur waktu tiap kata voiceover Reels narator dari audio asli (ElevenLabs scribe) dan menulisnya ke WORDS di config.ts.
//   node scripts/vo-words.mjs --video <Nama> [--only hook,cta] [--yes] [--refresh]
// Alur: untuk tiap scene, kirim klip olahan src/videos/<Nama>/voiceover/<id>.mp3 ke speech-to-text (scribe_v1, bahasa ind,
// timestamp kata), petakan kata SPOKEN ke waktu mulai lewat posisi huruf (tahan terhadap ejaan scribe yang beda, mis. "Cloud"
// untuk "Claude"), lalu tulis ulang baris scene itu di `export const WORDS` (dibuat kalau belum ada). Respons mentah disimpan di
// out/vo-scribe/<Nama>/<id>.json bersama hash klip, jadi dijalankan ulang tanpa perubahan klip tidak memanggil API lagi
// (--refresh memaksa). Memakai kredit kecil (≈ detik audio); meminta konfirmasi, --yes melewatinya. `at()` dan caption
// membaca WORDS, jadi cue ikut audio asli.
import { build } from "esbuild";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { createInterface } from "node:readline/promises";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const arg = (n) => {
  const i = process.argv.indexOf(n);
  return i > 0 ? process.argv[i + 1] : undefined;
};
const video = arg("--video");
if (!video) {
  console.error("Pakai: node scripts/vo-words.mjs --video <Nama> [--only id,id] [--yes] [--refresh]");
  process.exit(1);
}
const only = arg("--only")?.split(",");
const refresh = process.argv.includes("--refresh");
const dir = join(root, "src/videos", video);
const configFile = join(dir, "config.ts");

const tmp = join(root, "node_modules", ".vo-tmp");
mkdirSync(tmp, { recursive: true });
const outfile = join(tmp, "vo-words-config.mjs");
await build({ entryPoints: [configFile], bundle: true, platform: "node", format: "esm", outfile, external: ["remotion", "react", "react/*", "@remotion/*"], loader: { ".ts": "ts", ".tsx": "tsx", ".json": "json", ".mp3": "empty" }, logLevel: "error" });
const cfg = await import(`${pathToFileURL(outfile).href}?t=${Date.now()}`);
const manifest = JSON.parse(readFileSync(join(dir, "voiceover.json"), "utf8")).lines ?? {};

const cacheDir = join(root, "out/vo-scribe", video);
mkdirSync(cacheDir, { recursive: true });
const cachePath = (id) => join(cacheDir, `${id}.json`);
const cached = (id) => {
  if (refresh || !existsSync(cachePath(id))) return undefined;
  const c = JSON.parse(readFileSync(cachePath(id), "utf8"));
  return c.hash === manifest[id]?.hash ? c.scribe : undefined;
};

const ids = cfg.SCENE_IDS.filter((id) => (!only || only.includes(id)) && manifest[id] && existsSync(join(dir, "voiceover", `${id}.mp3`)));
if (ids.length === 0) {
  console.error("Tidak ada klip untuk diukur (cek voiceover.json dan --only).");
  process.exit(1);
}
const need = ids.filter((id) => !cached(id));
const seconds = need.reduce((a, id) => a + manifest[id].duration, 0);
console.log(`${ids.length} scene: ${ids.join(", ")}. Perlu scribe: ${need.length ? need.join(", ") : "tidak ada (dari cache)"} (≈ ${seconds.toFixed(1)} detik audio).`);

const envKey = () => {
  if (process.env.ELEVENLABS_API_KEY) return process.env.ELEVENLABS_API_KEY;
  const file = join(root, ".env.local");
  if (!existsSync(file)) return undefined;
  const line = readFileSync(file, "utf8").split("\n").find((l) => l.startsWith("ELEVENLABS_API_KEY="));
  return line?.slice("ELEVENLABS_API_KEY=".length).trim().replace(/^["']|["']$/g, "");
};

if (need.length && !process.argv.includes("--yes")) {
  if (!process.stdin.isTTY) {
    console.error("Butuh konfirmasi: jalankan di terminal, atau tambahkan --yes.");
    process.exit(1);
  }
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const a = (await rl.question("Lanjut scribe? [y/N] ")).trim().toLowerCase();
  rl.close();
  if (a !== "y" && a !== "ya") {
    console.log("Dibatalkan; tidak ada kredit terpakai.");
    process.exit(0);
  }
}

const scribe = async (id) => {
  const key = envKey();
  if (!key) throw new Error("ELEVENLABS_API_KEY tidak ada di environment maupun .env.local.");
  const form = new FormData();
  form.append("model_id", "scribe_v1");
  form.append("language_code", "ind");
  form.append("timestamps_granularity", "word");
  form.append("tag_audio_events", "false");
  form.append("file", new Blob([readFileSync(join(dir, "voiceover", `${id}.mp3`))], { type: "audio/mpeg" }), `${id}.mp3`);
  const res = await fetch("https://api.elevenlabs.io/v1/speech-to-text", { method: "POST", headers: { "xi-api-key": key }, body: form });
  if (!res.ok) throw new Error(`scribe ${id}: HTTP ${res.status} ${await res.text()}`);
  const data = await res.json();
  writeFileSync(cachePath(id), JSON.stringify({ hash: manifest[id].hash, scribe: data }));
  return data;
};

const letters = (s) => s.replace(/[^A-Za-z0-9]/g, "").length;
// Waktu mulai tiap token SPOKEN: posisi huruf pertama token dicari di daftar kata scribe (diurutkan menurut jumlah huruf).
const mapWords = (spoken, scribeWords) => {
  const cum = [];
  let c = 0;
  for (const w of scribeWords) {
    cum.push({ a: c, b: c + letters(w.text), start: w.start });
    c += letters(w.text);
  }
  let pos = 0;
  return spoken.split(" ").map((tok) => {
    const hit = cum.find((x) => x.a <= pos && pos < x.b) ?? cum[cum.length - 1];
    pos += letters(tok);
    return [tok, Math.round(hit.start * 100) / 100];
  });
};

const result = {};
for (const id of ids) {
  const data = cached(id) ?? (await scribe(id));
  const words = (data.words ?? []).filter((w) => w.type === "word");
  const spoken = cfg.SPOKEN[id];
  const total = words.reduce((a, w) => a + letters(w.text), 0);
  const want = spoken.split(" ").reduce((a, t) => a + letters(t), 0);
  result[id] = mapWords(spoken, words);
  const drift = Math.abs(total - want);
  console.log(`ok ${id}: ${result[id].length} kata${drift > 2 ? `  PERINGATAN: jumlah huruf beda ${drift} (scribe salah dengar?). Transkrip: ${data.text}` : ""}`);
}

let src = readFileSync(configFile, "utf8");
const line = (id) => `  ${id}: [${result[id].map(([t, s]) => `[${JSON.stringify(t)}, ${s}]`).join(", ")}],`;
const hasBlock = /export const WORDS\b/.test(src);
if (!hasBlock) {
  const all = cfg.SCENE_IDS.map((id) => (result[id] ? line(id) : `  ${id}: [],`)).join("\n");
  const block = `// Waktu tiap kata SPOKEN (detik sejak klip suara mulai), dari timestamp kata ElevenLabs scribe (scripts/vo-words.mjs).\nexport const WORDS: Readonly<Record<SceneId, readonly (readonly [string, number])[]>> = {\n${all}\n};\n\n`;
  src = src.replace(/export const CAPTION\b/, `${block}export const CAPTION`);
} else {
  for (const id of ids) {
    const re = new RegExp(`^  ${id}: \\[.*\\],$`, "m");
    const start = src.indexOf("export const WORDS");
    const end = src.indexOf("\n};", start);
    const body = src.slice(start, end);
    src = re.test(body) ? src.slice(0, start) + body.replace(re, line(id)) + src.slice(end) : src.slice(0, end) + `\n${line(id)}` + src.slice(end);
  }
}
writeFileSync(configFile, src);
console.log(`WORDS ditulis ke src/videos/${video}/config.ts. Jalankan npm run lint.`);
