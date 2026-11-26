// Jelaskan Ide Jadi Mesin Yang Bisa Dimainkan. Reels 9:16, 30 fps. Alur scene: Hook, Relate, Shift, Urgency, Install, Pakai, Hasil, Closing, Cta.
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

export const SCENE_IDS = ["hook", "relate", "shift", "urgency", "install", "pakai", "hasil", "closing", "cta"] as const;
export type SceneId = (typeof SCENE_IDS)[number];

export const SPOKEN: Readonly<Record<SceneId, string>> = {
  hook: "Skill Anatomi dari Ryan mengubah satu kalimat ide jadi mesin yang bisa kamu putar sendiri.",
  relate: "Kamu menjelaskan kesh pakai kotak dan panah, dan yang membaca tetap bingung.",
  shift: "Anatomi membangun idenya jadi benda nyata, misalnya kesh key jadi gembok yang bisa dibuka.",
  urgency: "Dan pasangnya cuma satu perintah, lalu satu kalimat sudah cukup untuk memulai figurnya.",
  install: "Di terminal jalankan en pi eks skills add wers raian dua dua garis miring anatomi, selesai.",
  pakai: "Lalu ketik garis miring anatomi dan idenya, tambah interactive, web ji el, atau tiga D.",
  hasil: "Satu figur butuh 30 sampai 90 menit, jadi anggap hasil pertama draf lalu minta perbaikan.",
  closing: "Penjelasan terbaik bukan yang paling panjang, tapi yang bisa kamu pegang.",
  cta: "Follow kalau mau lihat skill Ei Ai lain yang bikin dokumentasi hidup.",
};

// Voiceover: eleven_v4 (bawaan Reels baru; mengabaikan speed). Tag emosi Inggris di depan teks TTS membuat intonasi mengikuti isi
// scene, jadi suara tidak datar. VO_TEXT = teks yang dikirim ke TTS (SPOKEN tetap teks subtitle dan cue); di sini tiap scene diberi satu
// tag dari VO_TAGS. Untuk kalimat penting, tulis VO_TEXT per scene dengan tag per kalimat: "[curious] Kalimat satu. [serious] Kalimat dua."
// Mengubah model atau teks TTS mengubah hash klip, jadi putuskan sebelum generate semua.
export const VO_SETTINGS = { model: "eleven_v4", speed: null } as const;
const VO_TAGS: Readonly<Partial<Record<string, string>>> = { hook: "[serious]", relate: "[thoughtful]", shift: "[confident]", urgency: "[intrigued]", install: "[calm]", pakai: "[calm]", hasil: "[thoughtful]", closing: "[calm]", cta: "[friendly]" };
export const VO_TEXT: Readonly<Record<SceneId, string>> = Object.fromEntries(SCENE_IDS.map((id) => [id, `${VO_TAGS[id] ?? "[confident]"} ${SPOKEN[id]}`])) as Record<SceneId, string>;

// Waktu tiap kata SPOKEN (detik sejak klip suara mulai) untuk subtitle `SubtitleBand`. Kosong = pakai estimateWords() di bawah;
// diisi dari audio asli oleh `node scripts/vo-words.mjs --video Anatomy` setelah voiceover jadi.
export const WORDS: Readonly<Record<SceneId, readonly (readonly [string, number])[]>> = {
  hook: [["Skill", 0.12], ["Anatomi", 0.46], ["dari", 0.96], ["Ryan", 1.22], ["mengubah", 1.88], ["satu", 2.34], ["kalimat", 2.72], ["ide", 3.22], ["jadi", 3.72], ["mesin", 4], ["yang", 4.46], ["bisa", 4.72], ["kamu", 5.06], ["putar", 5.3], ["sendiri.", 5.6]],
  relate: [["Kamu", 0.08], ["menjelaskan", 0.38], ["kesh", 1.2], ["pakai", 1.56], ["kotak", 1.9], ["dan", 2.36], ["panah,", 2.58], ["dan", 3.62], ["yang", 3.76], ["membaca", 3.9], ["tetap", 4.52], ["bingung.", 4.88]],
  shift: [["Anatomi", 0.1], ["membangun", 0.7], ["idenya", 1.18], ["jadi", 1.72], ["benda", 1.94], ["nyata,", 2.24], ["misalnya", 3.14], ["kesh", 4.04], ["key", 4.38], ["jadi", 4.82], ["gembok", 5.08], ["yang", 5.56], ["bisa", 5.8], ["dibuka.", 6.12]],
  urgency: [["Dan", 0.1], ["pasangnya", 0.32], ["cuma", 0.92], ["satu", 1.18], ["perintah,", 1.46], ["lalu", 2.5], ["satu", 2.74], ["kalimat", 2.98], ["sudah", 3.8], ["cukup", 4.12], ["untuk", 4.54], ["memulai", 4.76], ["figurnya.", 5.14]],
  install: [["Di", 0.1], ["terminal", 0.24], ["jalankan", 1.18], ["en", 1.8], ["pi", 1.98], ["eks", 2.15], ["skills", 2.42], ["add", 3], ["wers", 3.33], ["raian", 3.76], ["dua", 4.31], ["dua", 4.63], ["garis", 4.96], ["miring", 5.5], ["anatomi,", 6.16], ["selesai.", 6.92]],
  pakai: [["Lalu", 0.08], ["ketik", 0.44], ["garis", 0.84], ["miring", 1.16], ["anatomi", 1.6], ["dan", 2.22], ["idenya,", 2.44], ["tambah", 3.42], ["interactive,", 3.9], ["web", 5.04], ["ji", 5.04], ["el,", 6.14], ["atau", 6.14], ["tiga", 6.68], ["D.", 6.68]],
  hasil: [["Satu", 0.14], ["figur", 0.52], ["butuh", 1.22], ["30", 1.62], ["sampai", 2.44], ["90", 2.86], ["menit,", 3.46], ["jadi", 4.34], ["anggap", 5.08], ["hasil", 5.44], ["pertama", 5.74], ["draf", 6.22], ["lalu", 6.82], ["minta", 7.24], ["perbaikan.", 7.54]],
  closing: [["Penjelasan", 0.06], ["terbaik", 0.64], ["bukan", 1.32], ["yang", 1.64], ["paling", 1.8], ["panjang,", 2.12], ["tapi", 3.22], ["yang", 3.98], ["bisa", 4.24], ["kamu", 4.64], ["pegang.", 4.88]],
  cta: [["Follow", 0.12], ["kalau", 0.68], ["mau", 0.96], ["lihat", 1.14], ["skill", 1.42], ["Ei", 1.76], ["Ai", 2.12], ["lain", 2.12], ["yang", 2.6], ["bikin", 2.76], ["dokumentasi", 3.04], ["hidup.", 3.66]],
};

// Posisi dan mode karakter narator per scene: `x` titik tengah (0-1), `mode` normal | small | hidden (lihat reelsLayout.ts,
// "Tata letak narator aman platform"). Mode menentukan tinggi karakter, tinggi area konten, dan posisi subtitle scene itu:
// konten banyak -> small (karakter kecil) atau hidden (tanpa karakter). Sesuaikan per storyboard.
export const NARRATOR: Readonly<Record<SceneId, { readonly x: number; readonly mode: NarratorMode }>> = {
  hook: { x: 0.5, mode: "normal" },
  relate: { x: 0.3, mode: "hidden" },
  shift: { x: 0.7, mode: "small" },
  urgency: { x: 0.3, mode: "hidden" },
  install: { x: 0.3, mode: "small" },
  pakai: { x: 0.3, mode: "hidden" },
  hasil: { x: 0.7, mode: "small" },
  closing: { x: 0.3, mode: "hidden" },
  cta: { x: 0.5, mode: "normal" },
};
// Latar per scene (seperti Ponytail): "kantor" = kantor malam dari Reels block di scene berkarakter; "datar" = `Backdrop` di scene hidden.
export const WORLD: Readonly<Record<SceneId, "kantor" | { readonly flat: "ground" | "dark" | "primary" }>> = {
  hook: "kantor",
  relate: { flat: "primary" },
  shift: "kantor",
  urgency: { flat: "dark" },
  install: "kantor",
  pakai: { flat: "ground" },
  hasil: "kantor",
  closing: { flat: "primary" },
  cta: "kantor",
};
export const SUBTITLE_Y: readonly number[] = SCENE_IDS.map((id) => NARRATOR_MODES[NARRATOR[id].mode].subtitleTop);

// Subtitle menampilkan ejaan asli, bukan ejaan fonetis SPOKEN yang hanya untuk suara. Contoh: { match: ["ei", "ai"], to: "AI" }
// (urutan kata fonetis huruf kecil -> pengganti). Kosong bila tidak ada singkatan fonetis.
// Urutan penting: aturan panjang dulu (aturan pertama yang cocok dipakai).
export const DISPLAY_FIXES: readonly DisplayFix[] = [
  { match: ["wers", "raian", "dua", "dua", "garis", "miring", "anatomi"], to: "wheresryan22/anatomy" },
  { match: ["garis", "miring", "anatomi"], to: "/anatomy" },
  { match: ["en", "pi", "eks"], to: "npx" },
  { match: ["web", "ji", "el"], to: "WebGL" },
  { match: ["tiga", "d"], to: "3D" },
  { match: ["ei", "ai"], to: "AI" },
  { match: ["anatomi"], to: "Anatomy" },
  { match: ["kesh"], to: "cache" },
];

export const CAPTION = "Menjelaskan ide teknis dengan kotak dan panah sering tidak cukup. Anatomy, skill dari Ryan (wheresryan22), mengubah idenya jadi objek isometrik yang bisa dimainkan. Pasang lewat npx skills add, pakai lewat /anatomy. Sumber: github.com/wheresryan22/anatomy";
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
