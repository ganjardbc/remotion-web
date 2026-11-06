#!/usr/bin/env node
// Memeriksa voice over Reels narator yang sudah jadi, tanpa memanggil API: tempo bicara, kenyaringan, variasi nada
// (deteksi suara datar), dan nada akhir kalimat tanya.
//   node scripts/vo-check.mjs --video <Nama> [--only hook,cta]
// Butuh ffmpeg. Tempo dan nada dihitung dari klip olahan src/videos/<Nama>/voiceover/<id>.mp3. Waktu kata untuk nada
// akhir tanya dibaca dari WORDS di config.ts (opsional). Hasilnya PERINGATAN (kode keluar selalu 0): ini pengukur kasar dari
// autokorelasi, bukan pengganti telinga; pakai untuk membandingkan take dan menangkap masalah yang jelas.
import { build } from "esbuild";
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const arg = (n) => {
  const i = process.argv.indexOf(n);
  return i > 0 ? process.argv[i + 1] : undefined;
};
const video = arg("--video");
if (!video) {
  console.error("Pakai: node scripts/vo-check.mjs --video <Nama> [--only hook,cta]");
  process.exit(1);
}
const only = arg("--only")?.split(",");
const dir = join(root, "src/videos", video);

// Ambang (pedoman, lihat docs/struktur-video.md, bagian Voiceover).
const RATE_MIN = 13;
const RATE_MAX = 18.5;
const LUFS_MIN = -18;
const LUFS_MAX = -14;
const RANGE_MIN_ST = 9;

const tmp = join(root, "node_modules", ".vo-tmp");
mkdirSync(tmp, { recursive: true });
const outfile = join(tmp, "vo-check-config.mjs");
await build({ entryPoints: [join(dir, "config.ts")], bundle: true, platform: "node", format: "esm", outfile, external: ["remotion", "react", "react/*", "@remotion/*"], loader: { ".ts": "ts", ".tsx": "tsx", ".json": "json", ".mp3": "empty" }, logLevel: "error" });
const cfg = await import(`${pathToFileURL(outfile).href}?t=${Date.now()}`);
const manifest = JSON.parse(readFileSync(join(dir, "voiceover.json"), "utf8")).lines ?? {};

const SR = 16000;
const decode = (file) => {
  const buf = execFileSync("ffmpeg", ["-v", "quiet", "-i", file, "-ac", "1", "-ar", String(SR), "-f", "f32le", "-"], { maxBuffer: 256 * 1024 * 1024 });
  return new Float32Array(buf.buffer, buf.byteOffset, Math.floor(buf.byteLength / 4));
};

// Pelacak nada kasar: autokorelasi per jendela 40 ms, hop 10 ms, jendela yang bersuara dan cukup periodik.
const pitchTrack = (x) => {
  const frame = 640;
  const hop = 160;
  const lo = Math.floor(SR / 400);
  const hi = Math.floor(SR / 75);
  const win = new Float32Array(frame).map((_, i) => 0.5 - 0.5 * Math.cos((2 * Math.PI * i) / (frame - 1)));
  const out = [];
  const w = new Float32Array(frame);
  for (let i = 0; i + frame < x.length; i += hop) {
    let energy = 0;
    for (let k = 0; k < frame; k += 1) {
      w[k] = x[i + k] * win[k];
      energy += w[k] * w[k];
    }
    if (Math.sqrt(energy / frame) < 0.015) continue;
    let best = 0;
    let bestLag = 0;
    for (let lag = lo; lag <= hi; lag += 1) {
      let s = 0;
      for (let k = 0; k + lag < frame; k += 1) s += w[k] * w[k + lag];
      if (s > best) {
        best = s;
        bestLag = lag;
      }
    }
    if (bestLag && best / energy > 0.45) out.push({ t: (i + frame / 2) / SR, f: SR / bestLag });
  }
  return out;
};
const median = (a) => {
  const s = [...a].sort((p, q) => p - q);
  return s[Math.floor(s.length / 2)];
};
const pct = (a, p) => [...a].sort((x, y) => x - y)[Math.min(a.length - 1, Math.floor(a.length * p))];
const semis = (f, ref) => 12 * Math.log2(f / ref);

const loudness = (file) => {
  const r = execFileSync("sh", ["-c", `ffmpeg -hide_banner -nostats -i "${file}" -af ebur128 -f null - 2>&1 | grep -E "^\\s+I:" | tail -1`], { encoding: "utf8" });
  const m = r.match(/I:\s*(-?[\d.]+)/);
  return m ? Number(m[1]) : undefined;
};

let warnCount = 0;
console.log("scene     h/dtk   LUFS  rentang  tanya   catatan");
for (const id of cfg.SCENE_IDS) {
  if (only && !only.includes(id)) continue;
  const file = join(dir, "voiceover", `${id}.mp3`);
  if (!existsSync(file) || !manifest[id]) {
    console.log(`${id.padEnd(9)} (belum ada klip)`);
    continue;
  }
  const spoken = cfg.SPOKEN[id];
  const dur = manifest[id].duration;
  const rate = spoken.length / dur;
  const lu = loudness(file);
  const track = pitchTrack(decode(file));
  const notes = [];
  if (rate < RATE_MIN) notes.push(`lambat (${rate.toFixed(1)}, ideal ${RATE_MIN}-${RATE_MAX})`);
  if (rate > RATE_MAX) notes.push(`terburu-buru (${rate.toFixed(1)}, ideal ${RATE_MIN}-${RATE_MAX})`);
  if (lu !== undefined && (lu < LUFS_MIN || lu > LUFS_MAX)) notes.push(`kenyaringan ${lu} LUFS di luar ${LUFS_MIN}..${LUFS_MAX}`);
  let rangeText = "-";
  let questionText = "-";
  if (track.length > 20) {
    const ref = median(track.map((p) => p.f));
    const st = track.map((p) => semis(p.f, ref));
    const range = pct(st, 0.95) - pct(st, 0.05);
    rangeText = `${range.toFixed(1)} st`;
    if (range < RANGE_MIN_ST) notes.push(`nada datar (rentang ${range.toFixed(1)} < ${RANGE_MIN_ST} semitone)`);
    // Kalimat tanya: kata berakhiran "?" di WORDS; bandingkan nada 45% akhir kata itu dengan nada kata-kata sebelumnya.
    const words = cfg.WORDS?.[id];
    if (words) {
      const rises = [];
      words.forEach(([w, start], i) => {
        if (!w.endsWith("?")) return;
        const end = i + 1 < words.length ? words[i + 1][1] : dur;
        const wordEnd = Math.min(end, start + 1.2);
        const before = track.filter((p) => p.t >= Math.max(0, start - 1.0) && p.t < start + (wordEnd - start) * 0.5);
        const tail = track.filter((p) => p.t >= start + (wordEnd - start) * 0.55 && p.t <= wordEnd);
        if (before.length < 3 || tail.length < 2) return;
        const rise = median(tail.map((p) => semis(p.f, ref))) - median(before.map((p) => semis(p.f, ref)));
        rises.push(rise);
        if (rise < 0) notes.push(`tanya "${w}" nadanya turun (${rise.toFixed(1)} st); susun ulang agar ditutup kata benda`);
      });
      if (rises.length) questionText = rises.map((r) => `${r >= 0 ? "+" : ""}${r.toFixed(1)}`).join(",");
    }
  } else notes.push("nada tidak terbaca (klip terlalu pendek atau senyap)");
  warnCount += notes.length;
  console.log(`${id.padEnd(9)} ${rate.toFixed(1).padStart(5)}  ${String(lu ?? "?").padStart(5)}  ${rangeText.padStart(7)}  ${questionText.padEnd(6)}  ${notes.join("; ") || "ok"}`);
}
console.log(warnCount ? `\n${warnCount} catatan. Pedoman kasar; dengarkan klipnya sebelum generate ulang.` : "\nTidak ada catatan.");
