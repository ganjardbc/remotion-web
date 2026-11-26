// Bikin Video MP4 Cukup Pakai HTML. Reels 9:16, 30 fps. Alur scene: Hook, Konteks, Syarat, Install, Init, Pakai, Agen, Cta.
// Voiceover: ElevenLabs, suara Nilasari. Teks yang diucapkan ada di SPOKEN; singkatan Inggris ditulis fonetis
// ("Ei Ai") agar terbaca benar. Selama voiceover.json kosong, durasi scene diperkirakan dari panjang teks
// (CHARS_PER_SEC); setelah ada voiceover.json, durasi mengikuti audio.
import type { DisplayFix } from "../../desk-world";
import { NARRATOR_MODES, type NarratorMode } from "../../reelsLayout";
import manifest from "./voiceover.json";
import { VO_FILES } from "./voiceover-files";

export const FPS = 30;
// Jeda sebelum suara mulai di tiap scene, dan ekor setelah suara selesai.
export const LEAD = 6;
const TAIL = 0.45;
// Perkiraan kecepatan bicara Nilasari dengan eleven_v4 (rata-rata CodeGraph, SpecKit, ClaudeSetup, SeleraDesain: 11-15 huruf/detik),
// dipakai selama voiceover.json kosong. Setelah klip jadi, durasi mengikuti audio.
const CHARS_PER_SEC = 13.2;

export const SCENE_IDS = ["hook", "konteks", "syarat", "install", "init", "pakai", "agen", "cta"] as const;
export type SceneId = (typeof SCENE_IDS)[number];

export const SPOKEN: Readonly<Record<SceneId, string>> = {
  hook: "Hei Jen merilis HyperFrames, framework gratis yang mengubah HTML biasa jadi video em pe empat, tanpa React.",
  konteks: "Cukup tulis HTML, lalu Chrome merender tiap frame dan Ef Ef Em Peg menyatukannya jadi video.",
  syarat: "Syaratnya cuma Node dua puluh dua ke atas dan Ef Ef Em Peg, lisensinya Apache dua titik nol.",
  install: "Untuk agen, jalankan en pe eks skills add Hei Jen com slash hyperframes, lalu pilih Core Skills.",
  init: "Mau tanpa agen? Jalankan en pe eks hyperframes init my video, dan folder proyeknya langsung jadi.",
  pakai: "Lalu preview membuka tampilan langsung di browser, dan render mengubahnya jadi file em pe empat.",
  agen: "Atau minta saja ke agen: pakai slash hyperframes, buat intro produk sepuluh detik dengan judul fade in dan musik latar.",
  cta: "Follow kalau kamu mau tahu tools Ei Ai lain yang bikin kerja developer lebih ringan.",
};

// Voiceover: eleven_v4 (bawaan Reels baru; mengabaikan speed). Tag emosi Inggris di depan teks TTS membuat intonasi mengikuti isi
// scene, jadi suara tidak datar. VO_TEXT = teks yang dikirim ke TTS (SPOKEN tetap teks subtitle dan cue); di sini tiap scene diberi satu
// tag dari VO_TAGS. Untuk kalimat penting, tulis VO_TEXT per scene dengan tag per kalimat: "[curious] Kalimat satu. [serious] Kalimat dua."
// Mengubah model atau teks TTS mengubah hash klip, jadi putuskan sebelum generate semua.
export const VO_SETTINGS = { model: "eleven_v4", speed: null } as const;
export const VO_TEXT: Readonly<Record<SceneId, string>> = {
  hook: "[curious] Hei Jen merilis HyperFrames, [confident] framework gratis yang mengubah HTML biasa jadi video em pe empat, tanpa React.",
  konteks: "[calm] Cukup tulis HTML, [confident] lalu Chrome merender tiap frame dan Ef Ef Em Peg menyatukannya jadi video.",
  syarat: "[calm] Syaratnya cuma Node dua puluh dua ke atas dan Ef Ef Em Peg, [thoughtful] lisensinya Apache dua titik nol.",
  install: "[calm] Untuk agen, jalankan en pe eks skills add Hei Jen com slash hyperframes, [confident] lalu pilih Core Skills.",
  init: "[curious] Mau tanpa agen? [calm] Jalankan en pe eks hyperframes init my video, dan folder proyeknya langsung jadi.",
  pakai: "[calm] Lalu preview membuka tampilan langsung di browser, [confident] dan render mengubahnya jadi file em pe empat.",
  agen: "[curious] Atau minta saja ke agen: [confident] pakai slash hyperframes, buat intro produk sepuluh detik dengan judul fade in dan musik latar.",
  cta: "[friendly] Follow kalau kamu mau tahu tools Ei Ai lain yang bikin kerja developer lebih ringan.",
};

// Waktu tiap kata SPOKEN (detik sejak klip suara mulai) untuk subtitle `SubtitleBand`. Kosong = pakai estimateWords() di bawah;
// diisi dari audio asli oleh `node scripts/vo-words.mjs --video HyperFrames` setelah voiceover jadi.
export const WORDS: Readonly<Record<SceneId, readonly (readonly [string, number])[]>> = {
  hook: [["Hei", 0.12], ["Jen", 0.54], ["merilis", 0.78], ["HyperFrames,", 1.2], ["framework", 2.36], ["gratis", 2.8], ["yang", 3.38], ["mengubah", 3.52], ["HTML", 4.16], ["biasa", 4.72], ["jadi", 5.34], ["video", 5.62], ["em", 6], ["pe", 6.22], ["empat,", 6.44], ["tanpa", 6.98], ["React.", 7.4]],
  konteks: [["Cukup", 0.08], ["tulis", 0.4], ["HTML,", 0.92], ["lalu", 2.82], ["Chrome", 3.18], ["merender", 3.46], ["tiap", 3.96], ["frame", 4.28], ["dan", 4.72], ["Ef", 5.12], ["Ef", 5.35], ["Em", 5.57], ["Peg", 5.8], ["menyatukannya", 6.14], ["jadi", 7.04], ["video.", 7.34]],
  syarat: [["Syaratnya", 0.1], ["cuma", 0.96], ["Node", 1.3], ["dua", 1.56], ["puluh", 1.73], ["dua", 2.03], ["ke", 2.2], ["atas", 2.36], ["dan", 3], ["Ef", 3.48], ["Ef", 3.8], ["Em", 4.12], ["Peg,", 4.44], ["lisensinya", 4.92], ["Apache", 6.28], ["dua", 7.02], ["titik", 7.3], ["nol.", 7.78]],
  install: [["Untuk", 0.1], ["agen,", 0.4], ["jalankan", 1.28], ["en", 1.94], ["pe", 2.14], ["eks", 2.34], ["skills", 2.63], ["add", 3.23], ["Hei", 3.52], ["Jen", 3.82], ["com", 4.12], ["slash", 4.42], ["hyperframes,", 4.91], ["lalu", 6], ["pilih", 6.52], ["Core", 6.9], ["Skills.", 7.16]],
  init: [["Mau", 0.12], ["tanpa", 0.34], ["agen?", 0.68], ["Jalankan", 1.64], ["en", 2.24], ["pe", 2.39], ["eks", 2.54], ["hyperframes", 2.76], ["init", 3.5], ["my", 3.74], ["video,", 4.07], ["dan", 4.88], ["folder", 5.12], ["proyeknya", 5.48], ["langsung", 6.16], ["jadi.", 6.54]],
  pakai: [["Lalu", 0.1], ["preview", 0.7], ["membuka", 1.24], ["tampilan", 1.66], ["langsung", 2.2], ["di", 2.66], ["browser,", 2.8], ["dan", 3.74], ["render", 4.06], ["mengubahnya", 4.74], ["jadi", 5.46], ["file", 5.76], ["em", 6.18], ["pe", 6.37], ["empat.", 6.56]],
  agen: [["Atau", 0.1], ["minta", 0.76], ["saja", 1.04], ["ke", 1.38], ["agen:", 1.54], ["pakai", 2.34], ["slash", 2.68], ["hyperframes,", 2.96], ["buat", 3.96], ["intro", 4.2], ["produk", 4.48], ["sepuluh", 4.88], ["detik", 5.2], ["dengan", 5.68], ["judul", 6], ["fade", 6.38], ["in", 6.72], ["dan", 6.98], ["musik", 7.16], ["latar.", 7.44]],
  cta: [["Follow", 0.14], ["kalau", 0.7], ["kamu", 0.94], ["mau", 1.2], ["tahu", 1.4], ["tools", 1.74], ["Ei", 1.93], ["Ai", 2.12], ["lain", 2.5], ["yang", 3], ["bikin", 3.18], ["kerja", 3.46], ["developer", 3.76], ["lebih", 4.36], ["ringan.", 4.64]],
};

// Posisi dan mode karakter narator per scene: `x` titik tengah (0-1), `mode` normal | small | hidden (lihat reelsLayout.ts,
// "Tata letak narator aman platform"). Mode menentukan tinggi karakter, tinggi area konten, dan posisi subtitle scene itu:
// konten banyak -> small (karakter kecil) atau hidden (tanpa karakter). Sesuaikan per storyboard.
export const NARRATOR: Readonly<Record<SceneId, { readonly x: number; readonly mode: NarratorMode }>> = {
  hook: { x: 0.5, mode: "normal" },
  konteks: { x: 0.3, mode: "small" },
  syarat: { x: 0.5, mode: "hidden" },
  install: { x: 0.7, mode: "small" },
  init: { x: 0.3, mode: "small" },
  pakai: { x: 0.7, mode: "small" },
  agen: { x: 0.3, mode: "small" },
  cta: { x: 0.5, mode: "normal" },
};
// Latar per scene. "kantor" = kantor malam dari Reels block (seperti Ponytail) untuk hook dan CTA dengan karakter besar; scene padat
// memakai latar datar `Backdrop` yang berselang-seling supaya tidak ada dua scene berurutan dengan latar sama.
export const WORLD: Readonly<Record<SceneId, "kantor" | { readonly flat: "ground" | "dark" | "primary" }>> = {
  hook: "kantor",
  konteks: { flat: "ground" },
  syarat: { flat: "primary" },
  install: { flat: "dark" },
  init: { flat: "ground" },
  pakai: { flat: "primary" },
  agen: { flat: "dark" },
  cta: "kantor",
};
export const SUBTITLE_Y: readonly number[] = SCENE_IDS.map((id) => NARRATOR_MODES[NARRATOR[id].mode].subtitleTop);

// Subtitle menampilkan ejaan asli, bukan ejaan fonetis SPOKEN yang hanya untuk suara. Contoh: { match: ["ei", "ai"], to: "AI" }
// (urutan kata fonetis huruf kecil -> pengganti). Kosong bila tidak ada singkatan fonetis.
export const DISPLAY_FIXES: readonly DisplayFix[] = [
  { match: ["en", "pe", "eks"], to: "npx" },
  { match: ["em", "pe", "empat"], to: "MP4" },
  { match: ["ef", "ef", "em", "peg"], to: "FFmpeg" },
  { match: ["node", "dua", "puluh", "dua"], to: "Node 22" },
  { match: ["apache", "dua", "titik", "nol"], to: "Apache 2.0" },
  { match: ["hei", "jen", "com", "slash", "hyperframes"], to: "heygen-com/hyperframes" },
  { match: ["hei", "jen"], to: "HeyGen" },
  { match: ["my", "video"], to: "my-video" },
  { match: ["slash", "hyperframes"], to: "/hyperframes" },
  { match: ["ei", "ai"], to: "AI" },
];

export const CAPTION = "HyperFrames dari HeyGen mengubah HTML jadi video MP4. Untuk agen: npx skills add heygen-com/hyperframes. Mau tanpa agen: npx hyperframes init my-video. Perlu Node 22+ dan FFmpeg. Sumber: github.com/heygen-com/hyperframes";
export const HASHTAGS = ["#DeveloperIndonesia", "#AIForDeveloper", "#CareerDeveloper", "#ProgrammerIndonesia", "#TechMindset"] as const;

const entries = (manifest as { lines: Record<string, { duration: number }> }).lines;

export const VO: Readonly<Record<SceneId, { readonly file: string | null; readonly seconds: number }>> = Object.fromEntries(
  SCENE_IDS.map((id) => [id, entries[id] ? { file: VO_FILES[id], seconds: entries[id].duration } : { file: null, seconds: SPOKEN[id].length / CHARS_PER_SEC }]),
) as Record<SceneId, { file: string | null; seconds: number }>;

// Detik sejak suara mulai saat `phrase` diucapkan: awal kata tempat frasa dimulai di SPOKEN, dari WORDS (audio asli) atau
// estimateWords() selama WORDS scene itu masih kosong.
export const at = (id: SceneId, phrase: string): number => {
  const i = SPOKEN[id].indexOf(phrase);
  if (i < 0) throw new Error(`Frasa "${phrase}" tidak ada di SPOKEN.${id}`);
  const index = SPOKEN[id].slice(0, i).split(" ").length - 1;
  const words = WORDS[id].length > 0 ? WORDS[id] : estimateWords(id);
  return words[Math.max(0, index)][1];
};

// Perkiraan waktu kata dari posisi huruf di SPOKEN, dipakai subtitle selama WORDS scene itu masih kosong.
export const estimateWords = (id: SceneId): readonly (readonly [string, number])[] =>
  [...SPOKEN[id].matchAll(/\S+/g)].map((m) => [m[0], ((m.index ?? 0) / SPOKEN[id].length) * VO[id].seconds] as const);

export const SCENE_FRAMES: readonly number[] = SCENE_IDS.map((id) => LEAD + Math.ceil((VO[id].seconds + TAIL) * FPS));
export const SCENE_START: readonly number[] = SCENE_FRAMES.map((_, i) => SCENE_FRAMES.slice(0, i).reduce((a, b) => a + b, 0));
export const TOTAL_FRAMES = SCENE_FRAMES.reduce((a, b) => a + b, 0);

export const MUSIC_FILE = "music/vue_bed.mp3";
