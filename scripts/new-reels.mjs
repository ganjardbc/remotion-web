#!/usr/bin/env node
// Membuat folder Reels baru (Format A/C, narator Claude Code) sesuai docs/struktur-video.md.
//   node scripts/new-reels.mjs <NamaPascalCase> "<Judul video>" [--scenes hook,relate,shift,urgency,closing,cta]
//   node scripts/new-reels.mjs <NamaPascalCase> "<Judul video>" --dialog [--cast ganjar,robot] [--style rig|stickman|block] [--scenes ...]
// Tanpa --dialog: Reels narator Claude Code (config, scenes.tsx, parts.tsx, Video dengan POSES per scene dan subtitle Caption). Dengan --dialog: Reels dialog dua
// karakter atau lebih (config, scenes.ts berisi data scene dan baris ucapan, Video yang memanggil src/dialog-reels).
// Menulis README.md, config.ts, scenes.tsx, <Nama>Video.tsx dari scripts/templates/reels, menyalin parts.tsx dari
// src/videos/PromptPanjang (selalu versi terbaru), menyiapkan voiceover.json kosong dan voiceover-files.ts.
// Komposisi <Nama>-Reels terdaftar otomatis dari export COMPOSITION di <Nama>Video.tsx (src/compositions.ts), jadi
// src/Root.tsx tidak perlu diubah. Setelah itu: isi SPOKEN dan CAPTION di config.ts, isi scene di scenes.tsx, dan
// ikuti README.md di folder baru. Untuk video dialog (Ganjar dan Claude) pakai scripts/new-video.mjs.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const argv = process.argv.slice(2);
const VALUE_FLAGS = ["--scenes", "--cast", "--style"];
const flag = (n, fallback) => {
  const i = argv.indexOf(n);
  return i >= 0 ? argv[i + 1] : fallback;
};
const sceneArg = flag("--scenes", "hook,relate,shift,urgency,closing,cta");
const dialog = argv.includes("--dialog");
const castArg = flag("--cast", "ganjar,robot");
const style = flag("--style", "rig");
const args = argv.filter((a, i) => !a.startsWith("--") && !VALUE_FLAGS.includes(argv[i - 1]));
const [name, title] = args;

const usage = 'Pakai: node scripts/new-reels.mjs <NamaPascalCase> "<Judul video>" [--scenes hook,relate,shift,urgency,closing,cta] [--dialog [--cast ganjar,robot] [--style rig|stickman|block]]';
const fail = (msg) => {
  console.error(msg);
  process.exit(1);
};
if (!name || !title || !/^[A-Z][A-Za-z0-9]*$/.test(name)) fail(usage);
if (!sceneArg) fail(usage);

const ids = sceneArg.split(",").map((s) => s.trim());
if (ids.some((s) => !/^[a-z]+$/.test(s))) fail("Id scene harus huruf kecil a-z, satu kata (contoh: hook,relate,cara).");
if (new Set(ids).size !== ids.length) fail("Id scene tidak boleh kembar.");
const FORMAT_A = ["hook", "relate", "shift", "urgency", "closing", "cta"];
const missing = FORMAT_A.filter((s) => !ids.includes(s));
if (missing.length > 0) console.warn(`Peringatan: Format A butuh scene ${missing.join(", ")}. Lanjut kalau ini Format C (tutorial).`);

const CHARACTERS = ["ganjar", "robot", "claudecode"];
const cast = castArg.split(",").map((c) => c.trim());
if (dialog) {
  if (cast.length < 1 || cast.length > 3 || cast.some((c) => !CHARACTERS.includes(c)) || new Set(cast).size !== cast.length) fail(`--cast: 1-3 karakter berbeda dari ${CHARACTERS.join(", ")}.`);
  if (!["rig", "stickman", "block"].includes(style)) fail("--style harus rig, stickman, atau block.");
}

const upper = name.replace(/([a-z0-9])([A-Z])/g, "$1_$2").toUpperCase();
const dst = join(root, "src/videos", name);
const tpl = join(root, "scripts/templates/reels");
if (existsSync(dst)) fail(`sudah ada: src/videos/${name}`);

const cap = (s) => s[0].toUpperCase() + s.slice(1);
const components = ids.map((s) => `${cap(s)}Scene`);
const read = (p) => readFileSync(p, "utf8");
const fill = (s, extra = {}) => {
  const vars = {
    __NAME__: name,
    __UPPER__: upper,
    __TITLE__: title,
    __COUNT__: String(ids.length),
    __FLOW__: ids.map(cap).join(", "),
    __SCENE_IDS__: ids.map((s) => `"${s}"`).join(", "),
    __SCENE_COMPONENTS__: components.join(", "),
    ...extra,
  };
  return Object.entries(vars).reduce((acc, [k, v]) => acc.replaceAll(k, v), s);
};

const spoken = ids.map((s) => `  ${s}: "TODO: teks yang diucapkan di scene ${s}.",`).join("\n");
const scenes = ids
  .map((s, i) => {
    const c = `${cap(s)}Scene`;
    return `// ---------- ${i + 1}. ${cap(s)} ----------\n\nexport const ${c}: React.FC = () => (\n  <Frame id="${s}">\n    <Headline delay={cue(0.1)}>${cap(s)}</Headline>\n  </Frame>\n);\n`;
  })
  .join("\n");
const scenesMap = ids.map((s, i) => `  ${s}: ${components[i]},`).join("\n");
// Pose karakter: hook, urgency, dan scene terakhir di tengah (besar); sisanya selang-seling kiri dan kanan (kecil).
let side = 0;
const poses = ids
  .map((s, i) => {
    if (i === 0 || i === ids.length - 1 || s === "urgency") return `  ${s}: { x: 0.5, h: ${s === "urgency" ? 480 : 500} },`;
    return `  ${s}: { x: ${side++ % 2 === 0 ? "0.32" : "0.68"}, h: 440 },`;
  })
  .join("\n");
const emptyWords = ids.map((s) => `  ${s}: [],`).join("\n");
const faces = ids.map((s) => `  ${s}: [[0, "netral"]],`).join("\n");

mkdirSync(dst, { recursive: true });
const write = (f, s) => writeFileSync(join(dst, f), s);

if (dialog) {
  // Reels dialog: data scene di scenes.ts, mesin di src/dialog-reels. Pembicara bergantian; baris berisi TODO.
  const dtpl = join(root, "scripts/templates/dialog-reels");
  // Bawaan gaya block: latar komputer malam, subtitle caption, potongan gambar per pembicara (shots: "bicara").
  const block = style === "block";
  const positions = { 1: ["tengah"], 2: ["kiri", "kanan"], 3: ["kiri", "tengah", "kanan"] }[cast.length];
  const sceneBlocks = ids.map((s, i) => {
    const who = cast[i % cast.length];
    const castLines = cast.map((c, k) => `      { character: "${c}", expression: "netral", motion: null, position: "${positions[k]}" },`).join("\n");
    return [
      "  {",
      `    id: "${s}",`,
      "    seconds: 5,",
      `    backdrop: "${block ? "komputer" : "ruangKerja"}",`,
      `    time: "${block ? "malam" : "siang"}",`,
      ...(block ? ['    // Isi layar monitor (latar komputer): meter token, baris kode, warna mood. Lihat docs/dialog-reels.md, bagian latar komputer.', '    tokenBack: { mood: "gelap", level: [1, 1], code: "mengalir" },'] : []),
      "    cast: [",
      castLines,
      "    ],",
      `    onScreenText: "TODO: teks layar scene ${s}",`,
      "    lines: [",
      `      { who: "${who}", from: 0.3, dur: 4.2, text: "TODO: ucapan scene ${s}." },`,
      "    ],",
      "  },",
    ].join("\n");
  });
  const scenesTs = `import type { DraftScene } from "../../dialog-reels";\n\n// Data scene ${name}. Ubah tangan: tambah baris dialog (\`who\`, \`from\` detik sejak scene mulai, \`dur\` perkiraan), ekspresi,\n// gerak (block: nama gesture, mis. sorak, mikir, putar), jenis shot per baris (\`shot\`, lihat docs/dialog-reels.md), dan isi \`spoken\` bila ucapan beda dari subtitle (angka dieja, singkatan dibaca utuh). Mengubah teks atau \`spoken\`\n// membuat baris itu perlu di-generate ulang. Id scene: huruf kecil, satu kata; Format A butuh hook, relate, shift, urgency, closing, cta.\n\nexport const BASE_SCENES: readonly DraftScene[] = [\n${sceneBlocks.join("\n")}\n];\n`;
  const dfill = (t) =>
    t
      .replaceAll("__NAME__", name)
      .replaceAll("__TITLE__", title)
      .replaceAll("__COUNT__", String(ids.length))
      .replaceAll("__FLOW__", ids.map(cap).join(", "))
      .replaceAll("__CAST__", cast.join(", "))
      .replaceAll("__STYLE__", style)
      .replaceAll("__META_EXTRA__", block ? '\n  subtitle: "caption",\n  shots: "bicara",' : "");
  write("config.ts", dfill(read(join(dtpl, "config.ts.tmpl"))));
  write("scenes.ts", scenesTs);
  write(`${name}Video.tsx`, dfill(read(join(dtpl, "Video.tsx.tmpl"))));
  write("README.md", dfill(read(join(dtpl, "README.md.tmpl"))));
  write("voiceover.json", '{ "lines": {} }\n');
  write("voiceover-files.ts", '// Dibuat otomatis oleh scripts/vo-process.mjs. Jangan diubah tangan.\n\nexport const VO_FILES: Readonly<Record<string, string>> = {};\n');
  console.log(`Dibuat src/videos/${name} (Reels dialog: ${cast.join(", ")}, ${ids.length} scene). Berikutnya: isi teks TODO di scenes.ts dan CAPTION di config.ts, lihat src/videos/${name}/README.md.`);
  process.exit(0);
}

write("config.ts", fill(read(join(tpl, "config.ts.tmpl")), { __SPOKEN__: spoken, __WORDS__: emptyWords }));
write("scenes.tsx", fill(read(join(tpl, "scenes.tsx.tmpl")), { __SCENES__: scenes }));
write(`${name}Video.tsx`, fill(read(join(tpl, "Video.tsx.tmpl")), { __SCENES_MAP__: scenesMap, __FACES__: faces, __POSES__: poses }));
write("README.md", fill(read(join(tpl, "README.md.tmpl"))));
// Komponen bersama video Reels: salinan versi terbaru dari video rujukan.
write("parts.tsx", read(join(root, "src/videos/PromptPanjang/parts.tsx")));
// Voiceover kosong; vo-process.mjs mengisinya.
write("voiceover.json", '{ "lines": {} }\n');
write("voiceover-files.ts", '// Dibuat otomatis oleh scripts/vo-process.mjs. Jangan diubah tangan.\n\nexport const VO_FILES: Readonly<Record<string, string>> = {};\n');

console.log(`Dibuat src/videos/${name} (${ids.length} scene). Berikutnya: isi SPOKEN dan CAPTION di config.ts, edit scenes.tsx, lihat src/videos/${name}/README.md.`);
