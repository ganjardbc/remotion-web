#!/usr/bin/env node
// Membuat folder Reels block baru (dialog karakter block di dunia diorama, 9:16, tanpa BrandFooter). Lihat docs/block-reels.md.
//   node scripts/new-block.mjs <NamaPascalCase> "<Judul video>" [--cast ganjar,claudecode] [--scenes hook,relate,shift,urgency,closing,cta] [--sets mejaMalam,kantor,terminal,kafe]
// Menulis README.md, config.ts, scenes.ts, <Nama>Video.tsx. Komposisi <Nama>-Reels terdaftar otomatis (src/compositions.ts).
// Latar (`--sets`) dipakai bergantian per scene. Pembicara bergantian per scene; semua teks berisi TODO.
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const argv = process.argv.slice(2);
const VALUE_FLAGS = ["--scenes", "--cast", "--sets"];
const flag = (n, fallback) => {
  const i = argv.indexOf(n);
  return i >= 0 ? argv[i + 1] : fallback;
};
const args = argv.filter((a, i) => !a.startsWith("--") && !VALUE_FLAGS.includes(argv[i - 1]));
const [name, title] = args;
const usage = 'Pakai: node scripts/new-block.mjs <NamaPascalCase> "<Judul video>" [--cast ganjar,claudecode] [--scenes hook,relate,shift,urgency,closing,cta] [--sets mejaMalam,kantor,terminal,kafe]';
const fail = (msg) => {
  console.error(msg);
  process.exit(1);
};
if (!name || !title || !/^[A-Z][A-Za-z0-9]*$/.test(name)) fail(usage);

const CHARACTERS = ["ganjar", "robot", "claudecode"];
const SETS = ["mejaMalam", "kantor", "terminal", "kafe"];
const ids = flag("--scenes", "hook,relate,shift,urgency,closing,cta").split(",").map((s) => s.trim());
const cast = flag("--cast", "ganjar,claudecode").split(",").map((s) => s.trim());
const sets = flag("--sets", SETS.join(",")).split(",").map((s) => s.trim());
if (ids.some((s) => !/^[a-z]+$/.test(s)) || new Set(ids).size !== ids.length) fail("Id scene harus huruf kecil a-z, satu kata, tidak kembar.");
if (cast.length < 1 || cast.length > 3 || cast.some((c) => !CHARACTERS.includes(c)) || new Set(cast).size !== cast.length) fail(`--cast: 1-3 karakter berbeda dari ${CHARACTERS.join(", ")}.`);
if (sets.length < 1 || sets.some((s) => !SETS.includes(s))) fail(`--sets: pilih dari ${SETS.join(", ")}.`);

const dst = join(root, "src/videos", name);
if (existsSync(dst)) fail(`sudah ada: src/videos/${name}`);
mkdirSync(dst, { recursive: true });
const write = (f, s) => writeFileSync(join(dst, f), s);
const cap = (s) => s[0].toUpperCase() + s.slice(1);
const positions = { 1: ["tengah"], 2: ["kiri", "kanan"], 3: ["kiri", "tengah", "kanan"] }[cast.length];

const sceneBlocks = ids.map((s, i) => {
  const who = cast[i % cast.length];
  const set = sets[i % sets.length];
  const castLines = cast.map((c, k) => `      { character: "${c}", expression: "netral", position: "${positions[k]}" },`).join("\n");
  return ["  {", `    id: "${s}",`, "    seconds: 5,", `    set: "${set}",`, "    cast: [", castLines, "    ],", "    lines: [", `      { who: "${who}", from: 0.3, dur: 4, text: "TODO: ucapan scene ${s}.", shot: "medium" },`, "    ],", "  },"].join("\n");
});

write("scenes.ts", `import type { BlockScene } from "../../block-reels";\n\n// Data scene ${name}. Ubah tangan: baris dialog (\`who\`, \`from\` detik sejak scene mulai, \`dur\` perkiraan), ekspresi, gesture,\n// dan jenis shot per baris (\`shot\`: wide, medium, closeUp, extremeCloseUp, dutch, lowAngle, highAngle, overShoulder, pov, reveal;\n// bisa daftar \`{ at, kind }\`). Latar (\`set\`): mejaMalam, kantor, terminal, kafe; ganti antar scene. Lihat docs/block-reels.md.\n\nexport const BASE_SCENES: readonly BlockScene[] = [\n${sceneBlocks.join("\n")}\n];\n`);
write("config.ts", `import type { BlockMeta } from "../../block-reels";\n\n// ${title}. Reels block 9:16, 30 fps, pemeran: ${cast.join(", ")}. Data scene dan baris ada di scenes.ts.\n\n// Judul tampil di kartu atas hanya selama scene pertama. `highlight` = satu frasa di dalam judul yang diwarnai oranye (opsional).\nexport const META: BlockMeta = {\n  title: ${JSON.stringify(title)},\n  // highlight: "frasa",\n};\n\nexport const CAPTION = "TODO: caption pendek.";\nexport const HASHTAGS = ["#DeveloperIndonesia", "#AIForDeveloper", "#CareerDeveloper", "#ProgrammerIndonesia", "#TechMindset"] as const;\n`);
write(`${name}Video.tsx`, `import type React from "react";\nimport type { VideoComposition } from "../../compositions";\nimport { BlockReels, totalFrames } from "../../block-reels";\nimport { META } from "./config";\nimport { BASE_SCENES } from "./scenes";\n\n// ${title} (Reels block 9:16). Tanpa BrandFooter: jenis folder ini memang tanpa footer (docs/block-reels.md).\nexport const TOTAL_FRAMES = totalFrames(BASE_SCENES);\n\nexport const ${name}Video: React.FC<{ readonly theme: string }> = ({ theme }) => <BlockReels theme={theme} meta={META} scenes={BASE_SCENES} />;\n\nexport const COMPOSITION: VideoComposition = {\n  id: "${name}-Reels",\n  component: ${name}Video,\n  durationInFrames: TOTAL_FRAMES,\n  fps: 30,\n  width: 1080,\n  height: 1920,\n  defaultProps: { theme: "gh" },\n};\n`);
write("README.md", `# ${name}\n\n"${title}": Reels block 9:16 (1080x1920, 30 fps), ${ids.length} scene (${ids.map(cap).join(", ")}), dialog ${cast.join(", ")}. Komposisi \`${name}-Reels\` (terdaftar otomatis lewat \`COMPOSITION\`). Dibuat dengan \`node scripts/new-block.mjs\`. Tanpa BrandFooter.\n\n- \`config.ts\`: \`META\`, caption, dan 5 hashtag.\n- \`scenes.ts\`: data scene (\`BASE_SCENES\`): latar diorama, pemeran, baris dialog, jenis shot per baris.\n- \`${name}Video.tsx\`: memanggil mesin \`src/block-reels\`.\n\n## Voiceover\n\nBelum ada. Durasi baris dari perkiraan di \`scenes.ts\`.\n\n\`\`\`bash\nnpx remotion still src/index.ts ${name}-Reels out/still/${name}.png --frame=30\nnpx remotion render src/index.ts ${name}-Reels out/${name}-Reels.mp4\n\`\`\`\n\n## Caption\n\nTODO: caption pendek.\n\n\`#DeveloperIndonesia #AIForDeveloper #CareerDeveloper #ProgrammerIndonesia #TechMindset\`\n`);
console.log(`Dibuat src/videos/${name} (Reels block: ${cast.join(", ")}, ${ids.length} scene). Berikutnya: isi TODO di scenes.ts dan CAPTION di config.ts, lihat docs/block-reels.md.`);
