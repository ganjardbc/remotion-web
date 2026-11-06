#!/usr/bin/env node
// Merender beberapa still per scene Reels lalu menggabungkannya jadi satu contact sheet untuk dicek mata (atau dibaca Claude).
//   node scripts/reels-stills.mjs --video <Nama> [--per 2] [--only hook,cta] [--width 360]
// Frame tiap scene dihitung dari config.ts (SCENE_START, SCENE_FRAMES, LEAD): --per 1 = tengah, 2 = 30% dan 80%, 3 = 15%,
// 50%, 90%. Susunan sheet: satu kolom per scene (urutan scene), satu baris per posisi. Hasil di
// out/still/<Nama>/ (still per frame) dan out/still/<Nama>-sheet.png. Butuh ffmpeg dan Chrome Remotion.
import { build } from "esbuild";
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const arg = (n, d) => {
  const i = process.argv.indexOf(n);
  return i > 0 ? process.argv[i + 1] : d;
};
const video = arg("--video");
if (!video) {
  console.error("Pakai: node scripts/reels-stills.mjs --video <Nama> [--per 2] [--only hook,cta] [--width 360]");
  process.exit(1);
}
const per = Math.max(1, Math.min(3, Number(arg("--per", "2"))));
const only = arg("--only")?.split(",");
const width = Number(arg("--width", "360"));
const POS = { 1: [0.5], 2: [0.3, 0.8], 3: [0.15, 0.5, 0.9] }[per];

const tmp = join(root, "node_modules", ".vo-tmp");
mkdirSync(tmp, { recursive: true });
const outfile = join(tmp, "stills-config.mjs");
await build({ entryPoints: [join(root, "src/videos", video, "config.ts")], bundle: true, platform: "node", format: "esm", outfile, external: ["remotion", "react", "react/*", "@remotion/*"], loader: { ".ts": "ts", ".tsx": "tsx", ".json": "json", ".mp3": "empty" }, logLevel: "error" });
const cfg = await import(`${pathToFileURL(outfile).href}?t=${Date.now()}`);

const dir = join(root, "out/still", video);
mkdirSync(dir, { recursive: true });
const ids = cfg.SCENE_IDS.filter((id) => !only || only.includes(id));
const files = [];
let n = 0;
for (const p of POS) {
  for (const id of ids) {
    const i = cfg.SCENE_IDS.indexOf(id);
    const frame = cfg.SCENE_START[i] + cfg.LEAD + Math.round((cfg.SCENE_FRAMES[i] - cfg.LEAD) * p);
    const file = join(dir, `${String(n).padStart(2, "0")}-${id}-${frame}.png`);
    execFileSync("npx", ["remotion", "still", "src/index.ts", `${video}-Reels`, file, `--frame=${frame}`], { cwd: root, stdio: "ignore" });
    files.push(file);
    n += 1;
    console.log(`still ${id} frame ${frame}`);
  }
}
const sheet = join(root, "out/still", `${video}-sheet.png`);
const listFile = join(dir, "list.txt");
writeFileSync(listFile, files.map((f) => `file '${f}'\nduration 1`).join("\n"));
execFileSync("ffmpeg", ["-y", "-v", "error", "-f", "concat", "-safe", "0", "-i", listFile, "-vf", `scale=${width}:-1,tile=${ids.length}x${POS.length}:padding=6:color=black`, "-frames:v", "1", sheet]);
console.log(`Contact sheet: ${sheet} (${ids.length} kolom x ${POS.length} baris)`);
