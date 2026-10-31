#!/usr/bin/env node
// Membuat video Reels 9:16 atau carousel 4:5 dari draft content_studio (draft.json) di atas src/videos/DraftKit.
//   node scripts/from-draft.mjs <draft.json> <NamaPascalCase> [--source <keterangan>] [--theme gh|insell]
//                               [--voice <karakter>=<id suara>]... [--no-register]
// Menulis src/videos/<Nama>/ (scenes.ts berisi data scene, voice over kosong, <Nama>Video.tsx, README.md) dan
// mendaftarkan komposisi <Nama>-Reels di src/Root.tsx. Narator atau dialog mengikuti `delivery` di draft; draft lama
// tanpa `delivery` dianggap narator bila hanya satu karakter yang berbicara. `--theme` memilih design system
// (default gh); `--voice` mengganti suara bawaan karakter dari src/videos/DraftKit/voices.json untuk video ini saja.
// Setelah itu: periksa `spoken` di scenes.ts, lalu `node scripts/vo-generate.mjs --video <Nama>`.
// Carousel menulis slides.ts dan <Nama>Carousel.tsx lalu mendaftarkan <Nama>-Carousel (satu frame per slide, tanpa
// voice over; `--voice` diabaikan). Render jadi PNG per slide:
//   npx remotion render src/index.ts <Nama>-Carousel out/<Nama> --sequence --image-format=png
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const argv = process.argv.slice(2);
const VALUED = ["--source", "--theme", "--voice"];
const opts = (name) => argv.flatMap((a, i) => (a === name && argv[i + 1] !== undefined ? [argv[i + 1]] : []));
const source = opts("--source")[0];
const args = argv.filter((a, i) => !a.startsWith("--") && !VALUED.includes(argv[i - 1]));
const [draftPath, name] = args;
const fail = (msg) => {
  console.error(msg);
  process.exit(1);
};
if (!draftPath || !name || !/^[A-Z][A-Za-z0-9]*$/.test(name)) {
  fail('Pakai: node scripts/from-draft.mjs <draft.json> <NamaPascalCase> [--source "<keterangan>"] [--theme gh] [--voice robot=<id>] [--no-register]');
}

// Nama tema dari tipe ThemeName di src/themes/types.ts.
const themeType = readFileSync(join(root, "src/themes/types.ts"), "utf8").match(/export type ThemeName\s*=\s*([^;]+);/);
const themes = themeType ? [...themeType[1].matchAll(/"(\w+)"/g)].map(([, t]) => t) : [];
const theme = opts("--theme")[0] ?? "gh";
if (!themes.includes(theme)) fail(`tema '${theme}' tidak dikenal; pilih: ${themes.join(", ")}.`);

const voiceBook = JSON.parse(readFileSync(join(root, "src/videos/DraftKit/voices.json"), "utf8"));
const voices = {};
for (const pair of opts("--voice")) {
  const [who, id] = pair.split("=");
  if (!(who in voiceBook.defaults)) fail(`--voice ${pair}: karakter '${who}' tidak ada di voices.json.`);
  if (!voiceBook.voices.some((v) => v.id === id)) fail(`--voice ${pair}: suara '${id}' tidak ada di voices.json.`);
  if (id !== voiceBook.defaults[who]) voices[who] = id;
}
const draft = JSON.parse(readFileSync(resolve(draftPath), "utf8"));
if (!["reels", "carousel"].includes(draft.format)) fail(`format '${draft.format}' belum didukung; hanya reels dan carousel.`);
if (!["rig", "stickman"].includes(draft.visual_style)) fail(`visual_style '${draft.visual_style}' belum didukung; hanya rig dan stickman.`);

const dst = join(root, "src/videos", name);
if (existsSync(dst)) fail(`sudah ada: src/videos/${name}`);

const upper = name.replace(/([a-z0-9])([A-Z])/g, "$1_$2").toUpperCase();
const write = (f, s) => writeFileSync(join(dst, f), s);
const cueOf = ({ character, expression, motion, position }) => ({ character, expression, motion: motion ?? null, position });

// Menambah import dan <Composition> sebelum penutup </> terakhir di src/Root.tsx, kecuali --no-register.
const register = (id, importLine, composition) => {
  if (argv.includes("--no-register")) return;
  const rootFile = join(root, "src/Root.tsx");
  const lines = readFileSync(rootFile, "utf8").split("\n");
  if (lines.some((l) => l.includes(`id="${id}"`))) {
    console.log(`Root.tsx sudah punya komposisi ${id}, dilewati.`);
    return;
  }
  let lastImport = -1;
  lines.forEach((l, i) => {
    if (/^import .* from ".*";$/.test(l) || /^\} from ".*";$/.test(l)) lastImport = i;
  });
  lines.splice(lastImport + 1, 0, importLine);
  const closing = lines.lastIndexOf("    </>");
  if (closing < 0) {
    console.error("Penutup </> di Root.tsx tidak ditemukan; daftarkan komposisi secara manual.");
    return;
  }
  lines.splice(closing, 0, `      ${composition}`);
  writeFileSync(rootFile, lines.join("\n"));
};

if (draft.format === "carousel") {
  const slides = draft.slides.map((s) => ({
    id: s.slide_id,
    role: s.role,
    headline: s.headline,
    body: s.body ?? "",
    cast: s.visual.characters.map(cueOf),
    backdrop: s.visual.backdrop,
    time: s.visual.time,
    note: s.visual.description,
  }));
  mkdirSync(dst, { recursive: true });
  write(
    "slides.ts",
    `import type { CarouselMeta, CarouselSlide } from "../DraftKit";

// Dibuat dari draft content_studio${source ? ` (${source})` : ""} oleh scripts/from-draft.mjs. Boleh diubah tangan:
// teks, ekspresi, atau pose pemeran. \`backdrop\`, \`time\`, dan \`note\` dari draft tidak dirender.

export const META: CarouselMeta = ${JSON.stringify({ title: draft.title, style: draft.visual_style }, null, 2)};

export const SLIDES: readonly CarouselSlide[] = ${JSON.stringify(slides, null, 2)};
`,
  );
  write(
    `${name}Carousel.tsx`,
    `import type React from "react";
import { CarouselDeck } from "../DraftKit";
import { META, SLIDES } from "./slides";

// ${draft.title.replace(/\n/g, " ")} (carousel 4:5, ${slides.length} slide). Satu frame = satu slide.
export const ${upper}_SLIDES = SLIDES.length;

export const ${name}Carousel: React.FC<{ readonly theme: string }> = ({ theme }) => <CarouselDeck theme={theme} meta={META} slides={SLIDES} />;
`,
  );
  write(
    "README.md",
    `# ${name}

"${draft.title}": carousel 4:5 (1080x1350), ${slides.length} slide, gaya ${draft.visual_style}, tema ${theme}. Komposisi \`${name}-Carousel\` di \`src/Root.tsx\`, satu frame per slide. Dibuat dari draft content_studio${source ? ` (${source})` : ""} dengan \`scripts/from-draft.mjs\`, dirender oleh \`src/videos/DraftKit/Carousel.tsx\`.

- \`slides.ts\`: data slide (peran, judul, isi, pemeran; \`note\` = arahan visual dari draft).

## Langkah

1. Cek satu slide: \`npx remotion still src/index.ts ${name}-Carousel out/${name}-01.png --frame=0\`.
2. Render semua slide jadi PNG: \`npx remotion render src/index.ts ${name}-Carousel out/${name} --sequence --image-format=png\`.
`,
  );
  register(
    `${name}-Carousel`,
    `import { ${upper}_SLIDES, ${name}Carousel } from "./videos/${name}/${name}Carousel";`,
    `<Composition id="${name}-Carousel" component={${name}Carousel} durationInFrames={${upper}_SLIDES} fps={1} width={1080} height={1350} defaultProps={{ theme: "${theme}" }} />`,
  );
  if (Object.keys(voices).length) console.log("Carousel tanpa voice over; --voice diabaikan.");
  console.log(`Dibuat src/videos/${name} (carousel, ${slides.length} slide, tema ${theme}).`);
  console.log(`Berikutnya: npx remotion render src/index.ts ${name}-Carousel out/${name} --sequence --image-format=png`);
  process.exit(0);
}

const speakerOf = (scene) => scene.visual.characters.find((c) => c.speaking)?.character;
const speakers = [...new Set(draft.scenes.map(speakerOf).filter(Boolean))];
const delivery = draft.delivery ?? (speakers.length > 1 ? "dialog" : "narator");
const fallbackSpeaker = speakers[0] ?? draft.scenes[0]?.visual.characters[0]?.character;
if (!fallbackSpeaker) fail("draft tidak punya karakter yang bisa berbicara.");

const digits = [];
const scenes = draft.scenes.map((s) => {
  // Narator: satu suara untuk semua scene, walau karakter lain tampil. Dialog: pembicara tiap scene dari draft.
  const who = delivery === "narator" ? fallbackSpeaker : speakerOf(s) ?? s.visual.characters[0]?.character ?? fallbackSpeaker;
  if (/\d/.test(s.spoken || s.narration)) digits.push(s.scene_id);
  return {
    id: s.scene_id,
    seconds: s.duration_seconds,
    backdrop: s.visual.backdrop,
    time: s.visual.time,
    cast: s.visual.characters.map(cueOf),
    onScreenText: s.on_screen_text,
    lines: [{ who, from: 0.3, dur: Math.max(1, s.duration_seconds - 0.6), text: s.narration, ...(s.spoken ? { spoken: s.spoken } : {}) }],
    note: s.visual.description,
  };
});

const meta = { title: draft.title, delivery, style: draft.visual_style };
mkdirSync(dst, { recursive: true });

write(
  "scenes.ts",
  `import type { DraftMeta, DraftScene } from "../DraftKit";

// Dibuat dari draft content_studio${source ? ` (${source})` : ""} oleh scripts/from-draft.mjs. Boleh diubah tangan:
// tambah baris dialog, ubah ekspresi atau gerak, dan isi \`spoken\` bila teks yang diucapkan beda dari subtitle
// (angka dieja, singkatan dibaca utuh). Mengubah teks atau \`spoken\` membuat baris itu perlu di-generate ulang.

export const META: DraftMeta = ${JSON.stringify(meta, null, 2)};

export const BASE_SCENES: readonly DraftScene[] = ${JSON.stringify(scenes, null, 2)};
`,
);

write(
  "voiceover.ts",
  `import manifest from "./voiceover.json";
import type { VoEntry } from "../DraftKit";
import { voicesWith } from "../DraftKit/voiceover";

// Dipakai scripts/vo-lines.mjs dan vo-generate.mjs. Model dan id baris ada di DraftKit/voiceover.ts, daftar suara di
// DraftKit/voices.json. VO_VOICES = suara bawaan, ditimpa pilihan untuk video ini.
export { lineId, ttsText, VO_MODEL, VO_SPEED } from "../DraftKit/voiceover";
export const VO_VOICES = voicesWith(${JSON.stringify(voices)});
export const VO_MANIFEST: Readonly<Record<string, VoEntry>> = (manifest as { lines: Record<string, VoEntry> }).lines;
`,
);
write("voiceover.json", '{ "lines": {} }\n');
write("voiceover-files.ts", '// Dibuat otomatis oleh scripts/vo-process.py. Jangan diubah tangan.\n\nexport const VO_FILES: Readonly<Record<string, string>> = {};\n');

write(
  `${name}Video.tsx`,
  `import type React from "react";
import { DraftVideo, fitScenes, totalFrames } from "../DraftKit";
import { BASE_SCENES, META } from "./scenes";
import { VO_MANIFEST } from "./voiceover";
import { VO_FILES } from "./voiceover-files";

// ${draft.title.replace(/\n/g, " ")} (reels 9:16, ${delivery}). Durasi scene mengikuti voice over bila sudah ada.
const SCENES = fitScenes(BASE_SCENES, VO_MANIFEST, VO_FILES);
export const ${upper}_FRAMES = totalFrames(SCENES);

export const ${name}Video: React.FC<{ readonly theme: string }> = ({ theme }) => <DraftVideo theme={theme} meta={META} scenes={SCENES} />;
`,
);

write(
  "README.md",
  `# ${name}

"${draft.title}": reels 9:16 (1080x1920, 30 fps), ${scenes.length} scene, ${delivery === "narator" ? `narator ${fallbackSpeaker}` : `dialog ${speakers.join(", ")}`}, gaya ${draft.visual_style}, tema ${theme}. Komposisi \`${name}-Reels\` di \`src/Root.tsx\`. Dibuat dari draft content_studio${source ? ` (${source})` : ""} dengan \`scripts/from-draft.mjs\`, dirender oleh \`src/videos/DraftKit\`.

- \`scenes.ts\`: data scene (latar, waktu, pemeran, teks layar, baris ucapan, \`note\` = arahan visual dari draft).
- \`voiceover.ts\`, \`voiceover.json\`, \`voiceover-files.ts\`, \`voiceover/\`: voice over ElevenLabs. Suara per karakter untuk video ini di \`voiceover.ts\`; daftar suara dan model di \`DraftKit/voices.json\`.

## Langkah

1. Periksa \`spoken\` di \`scenes.ts\` untuk baris berangka atau berisi singkatan. Cek satu frame: \`npx remotion still src/index.ts ${name}-Reels out/${name}.png --frame=60\`.
2. Voice over: \`node scripts/vo-generate.mjs --video ${name}\` menampilkan baris yang perlu dibuat dan jumlah hurufnya, lalu meminta konfirmasi sebelum memanggil ElevenLabs.
3. Render: \`npx remotion render src/index.ts ${name}-Reels out/${name}-Reels.mp4\`.
`,
);

register(
  `${name}-Reels`,
  `import { ${upper}_FRAMES, ${name}Video } from "./videos/${name}/${name}Video";`,
  `<Composition id="${name}-Reels" component={${name}Video} durationInFrames={${upper}_FRAMES} fps={30} width={1080} height={1920} defaultProps={{ theme: "${theme}" }} />`,
);

console.log(`Dibuat src/videos/${name} (${scenes.length} scene, ${delivery}, tema ${theme}).`);
if (digits.length) console.log(`Baris berangka, periksa \`spoken\`: ${digits.join(", ")}`);
console.log(`Berikutnya: node scripts/vo-generate.mjs --video ${name}`);
