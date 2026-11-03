#!/usr/bin/env node
// Membuat video baru berpola VueTutorial (dialog Ganjar dan Claude, kamera 2D, sisipan layar, SFX, musik, voice over).
//   node scripts/new-video.mjs <NamaPascalCase> "<Judul video>"
// Menyalin berkas umum dari src/videos/VueTutorial (selalu versi terbaru), menulis scenes.tsx contoh 3 scene dari
// scripts/templates/dialog-video, menyiapkan voiceover kosong. Komposisi <Nama> terdaftar otomatis dari export COMPOSITION di <Nama>Video.tsx
// (src/compositions.ts), jadi src/Root.tsx tidak perlu diubah.
// Setelah itu: edit scenes.tsx, lalu ikuti README.md di folder video baru.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const [name, title] = args;
if (!name || !title || !/^[A-Z][A-Za-z0-9]*$/.test(name)) {
  console.error('Pakai: node scripts/new-video.mjs <NamaPascalCase> "<Judul video>"');
  process.exit(1);
}
const upper = name.replace(/([a-z0-9])([A-Z])/g, "$1_$2").toUpperCase();
const src = join(root, "src/videos/VueTutorial");
const dst = join(root, "src/videos", name);
const tpl = join(root, "scripts/templates/dialog-video");
if (existsSync(dst)) {
  console.error(`sudah ada: src/videos/${name}`);
  process.exit(1);
}
mkdirSync(dst, { recursive: true });

const fill = (s) => s.replaceAll("__NAME__", name).replaceAll("__UPPER__", upper).replaceAll("__TITLE__", title);
const read = (p) => readFileSync(p, "utf8");
const write = (f, s) => writeFileSync(join(dst, f), s);

// Berkas umum: disalin dari VueTutorial, nama simbol khusus Vue diganti.
const rename = (s) => s.replaceAll("VueWorld", `${name}World`).replaceAll("VueSfx", `${name}Sfx`).replaceAll("VUE_TUTORIAL_FRAMES", `${upper}_FRAMES`).replaceAll("video Vue", `video ${name}`);
for (const [from, to] of [["SceneRenderer.tsx"], ["world.tsx"], ["cards.tsx"], ["sfxTypes.ts"], ["voiceover.ts"], ["VueSfx.tsx", `${name}Sfx.tsx`]]) {
  write(to ?? from, rename(read(join(src, from))));
}

// Berkas dari template.
write("scenes.tsx", fill(read(join(tpl, "scenes.tsx.tmpl"))));
write(`${name}Video.tsx`, fill(read(join(tpl, "Video.tsx.tmpl"))));
write("README.md", fill(read(join(tpl, "README.md.tmpl"))));

// Voice over kosong; vo-process.mjs mengisinya.
write("voiceover.json", '{ "lines": {} }\n');
write("voiceover-files.ts", '// Dibuat otomatis oleh scripts/vo-process.mjs. Jangan diubah tangan.\n\nexport const VO_FILES: Readonly<Record<string, string>> = {};\n');

console.log(`Dibuat src/videos/${name}. Berikutnya: edit scenes.tsx, lalu lihat src/videos/${name}/README.md.`);
