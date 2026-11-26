// Bikin Video Pakai React, Bukan Editor. Reels 9:16, 30 fps. Alur scene: Hook, Konteks, Install, Kode, Render, Agen, Closing, Cta.
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

export const SCENE_IDS = ["hook", "konteks", "install", "kode", "render", "agen", "closing", "cta"] as const;
export type SceneId = (typeof SCENE_IDS)[number];

export const SPOKEN: Readonly<Record<SceneId, string>> = {
  hook: "Video ini tidak diedit di editor video, tapi ditulis sebagai kode React pakai Remotion.",
  konteks: "Remotion menjadikan tiap frame komponen React, jadi animasi, teks, dan data kamu atur lewat kode.",
  install: "Cukup punya Node Ji Es, jalankan en pe eks create video at latest, pilih template, dan proyeknya siap.",
  kode: "Di kodenya, use Current Frame memberi nomor frame, dan interpolate mengubahnya jadi posisi atau opacity.",
  render: "En pe em run dev membuka Studio untuk preview, dan en pe eks remotion render mengubahnya jadi file em pe empat.",
  agen: "Kerja bareng Claude Code? Jalankan en pe eks remotion skills Ed, supaya agen paham aturan mainnya.",
  closing: "Begitu video jadi kode, kamu bisa mereview dan mengulangnya seperti fitur lain.",
  cta: "Follow kalau kamu mau terus belajar bikin video lewat kode, bukan lewat editor.",
};

// Voiceover: eleven_v4 (bawaan Reels baru; mengabaikan speed). Tag emosi Inggris di depan teks TTS membuat intonasi mengikuti isi
// scene, jadi suara tidak datar. VO_TEXT = teks yang dikirim ke TTS (SPOKEN tetap teks subtitle dan cue), tag per kalimat.
// Perintah dieja fonetis ("en pe eks", "Node Ji Es", "ed" untuk add); subtitle menampilkan ejaan asli lewat DISPLAY_FIXES.
// Mengubah model atau teks TTS mengubah hash klip, jadi putuskan sebelum generate semua.
export const VO_SETTINGS = { model: "eleven_v4", speed: null } as const;
export const VO_TEXT: Readonly<Record<SceneId, string>> = {
  hook: "[curious] Video ini tidak diedit di editor video, [confident] tapi ditulis sebagai kode React pakai Remotion.",
  konteks: "[thoughtful] Remotion menjadikan tiap frame komponen React, [confident] jadi animasi, teks, dan data kamu atur lewat kode.",
  install: "[calm] Cukup punya Node Ji Es, jalankan en pe eks create video at latest, pilih template, [confident] dan proyeknya siap.",
  kode: "[calm] Di kodenya, use Current Frame memberi nomor frame, dan interpolate mengubahnya jadi posisi atau opacity.",
  render: "[confident] En pe em run dev membuka Studio untuk preview, dan en pe eks remotion render mengubahnya jadi file em pe empat.",
  agen: "[curious] Kerja bareng Claude Code? [confident] Jalankan en pe eks remotion skills Ed, supaya agen paham aturan mainnya.",
  closing: "[calm] Begitu video jadi kode, [warm] kamu bisa mereview dan mengulangnya seperti fitur lain.",
  cta: "[friendly] Follow kalau kamu mau terus belajar bikin video lewat kode, [warm] bukan lewat editor.",
};

// Waktu tiap kata SPOKEN (detik sejak klip suara mulai) untuk subtitle `SubtitleBand`. Kosong = pakai estimateWords() di bawah;
// diisi dari audio asli oleh `node scripts/vo-words.mjs --video RemotionIntro` setelah voiceover jadi.
export const WORDS: Readonly<Record<SceneId, readonly (readonly [string, number])[]>> = {
  hook: [["Video", 0.12], ["ini", 0.52], ["tidak", 0.9], ["diedit", 1.18], ["di", 1.6], ["editor", 1.72], ["video,", 2.08], ["tapi", 3], ["ditulis", 3.52], ["sebagai", 3.92], ["kode", 4.28], ["React", 4.56], ["pakai", 4.98], ["Remotion.", 5.26]],
  konteks: [["Remotion", 0.1], ["menjadikan", 0.98], ["tiap", 1.62], ["frame", 2.04], ["komponen", 2.34], ["React,", 2.9], ["jadi", 3.78], ["animasi,", 4.42], ["teks,", 5.44], ["dan", 5.88], ["data", 6.08], ["kamu", 6.7], ["atur", 7.08], ["lewat", 7.4], ["kode.", 7.68]],
  install: [["Cukup", 0.08], ["punya", 0.42], ["Node", 0.74], ["Ji", 0.74], ["Es,", 1.98], ["jalankan", 1.98], ["en", 2.56], ["pe", 3.26], ["eks", 3.26], ["create", 3.66], ["video", 4.14], ["at", 4.36], ["latest,", 5.26], ["pilih", 5.56], ["template,", 5.56], ["dan", 6.82], ["proyeknya", 6.82], ["siap.", 7.36]],
  kode: [["Di", 0.08], ["kodenya,", 0.22], ["use", 1.36], ["Current", 1.66], ["Frame", 2.06], ["memberi", 2.44], ["nomor", 2.84], ["frame,", 3.22], ["dan", 4.08], ["interpolate", 4.36], ["mengubahnya", 5.32], ["jadi", 6.02], ["posisi", 6.26], ["atau", 7.04], ["opacity.", 7.48]],
  render: [["En", 0.12], ["pe", 0.12], ["em", 0.6], ["run", 0.82], ["dev", 1.24], ["membuka", 1.24], ["Studio", 1.66], ["untuk", 2.2], ["preview,", 2.48], ["dan", 4.14], ["en", 4.7], ["pe", 4.7], ["eks", 4.7], ["remotion", 4.7], ["render", 6], ["mengubahnya", 6], ["jadi", 7.1], ["file", 7.5], ["em", 7.5], ["pe", 7.5], ["empat.", 7.5]],
  agen: [["Kerja", 0.08], ["bareng", 0.5], ["Claude", 0.84], ["Code?", 1.22], ["Jalankan", 2.04], ["en", 2.58], ["pe", 2.58], ["eks", 2.58], ["remotion", 2.58], ["skills", 3.56], ["Ed,", 4.54], ["supaya", 4.54], ["agen", 4.92], ["paham", 5.28], ["aturan", 5.74], ["mainnya.", 6.08]],
  closing: [["Begitu", 0.1], ["video", 0.54], ["jadi", 0.92], ["kode,", 1.18], ["kamu", 2.16], ["bisa", 2.44], ["mereview", 2.72], ["dan", 3.38], ["mengulangnya", 3.54], ["seperti", 4.3], ["fitur", 4.68], ["lain.", 4.96]],
  cta: [["Follow", 0.12], ["kalau", 0.76], ["kamu", 1.04], ["mau", 1.42], ["terus", 1.64], ["belajar", 2], ["bikin", 2.38], ["video", 2.68], ["lewat", 3.04], ["kode,", 3.34], ["bukan", 4.16], ["lewat", 4.44], ["editor.", 4.74]],
};

// Posisi dan mode karakter narator per scene: `x` titik tengah (0-1), `mode` normal | small | hidden (lihat reelsLayout.ts,
// "Tata letak narator aman platform"). Mode menentukan tinggi karakter, tinggi area konten, dan posisi subtitle scene itu:
// konten banyak -> small (karakter kecil) atau hidden (tanpa karakter). Sesuaikan per storyboard.
export const NARRATOR: Readonly<Record<SceneId, { readonly x: number; readonly mode: NarratorMode }>> = {
  hook: { x: 0.5, mode: "normal" },
  konteks: { x: 0.3, mode: "hidden" },
  install: { x: 0.3, mode: "normal" },
  kode: { x: 0.3, mode: "hidden" },
  render: { x: 0.7, mode: "normal" },
  agen: { x: 0.3, mode: "normal" },
  closing: { x: 0.3, mode: "hidden" },
  cta: { x: 0.5, mode: "normal" },
};
// Latar per scene (pola Ponytail). "kantor" = kantor malam dari Reels block, dipakai di scene yang ada karakternya; "datar" = latar
// `Backdrop` biasa di scene tanpa karakter (mode hidden). Render dan agen sama-sama kantor: agen butuh narator karena naskahnya
// menyebut Claude Code; kamera dan posisi karakter dibedakan.
export const WORLD: Readonly<Record<SceneId, "kantor" | { readonly flat: "ground" | "dark" | "primary" }>> = {
  hook: "kantor",
  konteks: { flat: "primary" },
  install: "kantor",
  kode: { flat: "ground" },
  render: "kantor",
  agen: "kantor",
  closing: { flat: "primary" },
  cta: "kantor",
};
export const SUBTITLE_Y: readonly number[] = SCENE_IDS.map((id) => NARRATOR_MODES[NARRATOR[id].mode].subtitleTop);

// Subtitle menampilkan ejaan asli, bukan ejaan fonetis SPOKEN yang hanya untuk suara. Contoh: { match: ["ei", "ai"], to: "AI" }
// (urutan kata fonetis huruf kecil -> pengganti). Kosong bila tidak ada singkatan fonetis.
export const DISPLAY_FIXES: readonly DisplayFix[] = [
  { match: ["node", "ji", "es"], to: "Node.js" },
  { match: ["ed"], to: "add" },
  { match: ["en", "pe", "eks"], to: "npx" },
  { match: ["en", "pe", "em"], to: "npm" },
  { match: ["create", "video", "at", "latest"], to: "create-video@latest" },
  { match: ["use", "current", "frame"], to: "useCurrentFrame" },
  { match: ["em", "pe", "empat"], to: "MP4" },
];

export const CAPTION = "Remotion bikin video bisa ditulis sebagai kode React: install dengan npx create-video@latest, preview di Studio, lalu render jadi MP4. Gratis untuk individu dan perusahaan sampai 3 karyawan; di atas itu perlu company license.";
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
