#!/usr/bin/env node
// Membuat folder Reels baru (Format A/C, narator Claude Code) sesuai docs/struktur-video.md.
//   node scripts/new-reels.mjs <NamaPascalCase> "<Judul video>" [--scenes hook,relate,shift,urgency,closing,cta] [--no-register]
// Menulis README.md, config.ts, scenes.tsx, <Nama>Video.tsx dari scripts/templates/reels, menyalin parts.tsx dari
// src/videos/PromptPanjang (selalu versi terbaru), menyiapkan voiceover.json kosong dan voiceover-files.ts, lalu
// mendaftarkan komposisi <Nama>-Reels di src/Root.tsx. Setelah itu: isi SPOKEN dan CAPTION di config.ts, isi scene di
// scenes.tsx, dan ikuti README.md di folder baru. Untuk video dialog (Ganjar dan Claude) pakai scripts/new-video.mjs.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const argv = process.argv.slice(2);
const si = argv.indexOf("--scenes");
const sceneArg = si >= 0 ? argv[si + 1] : "hook,relate,shift,urgency,closing,cta";
const args = argv.filter((a, i) => !a.startsWith("--") && !(si >= 0 && i === si + 1));
const [name, title] = args;

const usage = 'Pakai: node scripts/new-reels.mjs <NamaPascalCase> "<Judul video>" [--scenes hook,relate,shift,urgency,closing,cta] [--no-register]';
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
const faces = ids.map((s) => `  ${s}: [[0, "netral"]],`).join("\n");

mkdirSync(dst, { recursive: true });
const write = (f, s) => writeFileSync(join(dst, f), s);
write("config.ts", fill(read(join(tpl, "config.ts.tmpl")), { __SPOKEN__: spoken }));
write("scenes.tsx", fill(read(join(tpl, "scenes.tsx.tmpl")), { __SCENES__: scenes }));
write(`${name}Video.tsx`, fill(read(join(tpl, "Video.tsx.tmpl")), { __SCENES_MAP__: scenesMap, __FACES__: faces }));
write("README.md", fill(read(join(tpl, "README.md.tmpl"))));
// Komponen bersama video Reels: salinan versi terbaru dari video rujukan.
write("parts.tsx", read(join(root, "src/videos/PromptPanjang/parts.tsx")));
// Voiceover kosong; vo-process.mjs mengisinya.
write("voiceover.json", '{ "lines": {} }\n');
write("voiceover-files.ts", '// Dibuat otomatis oleh scripts/vo-process.mjs. Jangan diubah tangan.\n\nexport const VO_FILES: Readonly<Record<string, string>> = {};\n');

// Daftarkan komposisi di src/Root.tsx.
if (!process.argv.includes("--no-register")) {
  const rootFile = join(root, "src/Root.tsx");
  const lines = read(rootFile).split("\n");
  if (lines.some((l) => l.includes(`id="${name}-Reels"`))) {
    console.log(`Root.tsx sudah punya komposisi ${name}-Reels, dilewati.`);
  } else {
    const importLine = `import { ${name}Video, TOTAL_FRAMES as ${upper}_FRAMES } from "./videos/${name}/${name}Video";`;
    let lastImport = -1;
    lines.forEach((l, i) => {
      if (/^import .* from ".*";$/.test(l) || /^\} from ".*";$/.test(l)) lastImport = i;
    });
    lines.splice(lastImport + 1, 0, importLine);
    const comp = [
      "      <Composition",
      `        id="${name}-Reels"`,
      `        component={${name}Video}`,
      `        durationInFrames={${upper}_FRAMES}`,
      "        fps={30}",
      "        width={1080}",
      "        height={1920}",
      '        defaultProps={{ theme: "gh" }}',
      "      />",
    ];
    const at = lines.findIndex((l) => l.includes('<Folder name="Characters">'));
    const closing = lines.lastIndexOf("    </>");
    if (at < 0 && closing < 0) {
      console.error("Titik sisip di Root.tsx tidak ditemukan; daftarkan komposisi secara manual.");
    } else {
      lines.splice(at >= 0 ? at : closing, 0, ...comp);
      writeFileSync(rootFile, lines.join("\n"));
    }
  }
}

console.log(`Dibuat src/videos/${name} (${ids.length} scene). Berikutnya: isi SPOKEN dan CAPTION di config.ts, edit scenes.tsx, lihat src/videos/${name}/README.md.`);
