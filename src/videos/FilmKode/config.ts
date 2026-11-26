// Film 99 Gaya Tanpa Model Video. Reels 9:16, 30 fps. Alur scene: Hook, Relate, Shift, Urgency, Install, Pakai, Closing, Cta.
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

export const SCENE_IDS = ["hook", "relate", "shift", "urgency", "install", "pakai", "closing", "cta"] as const;
export type SceneId = (typeof SCENE_IDS)[number];

export const SPOKEN: Readonly<Record<SceneId, string>> = {
  hook: "Film sembilan puluh sembilan gaya tanpa model video, dibuat plugin Claude Code dari Lemomo.",
  relate: "Kamu mau bikin video, tapi harus edit manual atau bayar generator yang hasilnya acak.",
  shift: "Lemo Opuskar membuat agen menulis kode yang menggambar tiap frame, menyusun musik, dan membacakan narasinya, jadi filmnya murni hasil kode.",
  urgency: "Dan memasangnya cuma dua perintah, tapi cara kamu memintanya yang menentukan hasilnya.",
  install: "Di terminal, tambahkan marketplace-nya, lalu pasang pluginnya, dan siapkan Node, ffmpeg, dan Python.",
  pakai: "Ketik Lemo Opuskar, pilih bahasa, lalu minta dengan rumus gaya, topik, dan durasi, misalnya watercolor tentang kebun kopi selama empat puluh lima detik.",
  closing: "Film tidak harus lahir dari model video, kadang cukup dari agen yang paham cara menggambar lewat kode.",
  cta: "Follow kalau kamu mau tahu plugin Claude Code lainnya yang bisa dipakai untuk bikin konten.",
};

// Voiceover: eleven_v4 (bawaan Reels baru; mengabaikan speed). Tag emosi Inggris di depan teks TTS membuat intonasi mengikuti isi
// scene, jadi suara tidak datar. VO_TEXT = teks yang dikirim ke TTS (SPOKEN tetap teks subtitle dan cue); di sini tiap scene diberi satu
// tag dari VO_TAGS. Untuk kalimat penting, tulis VO_TEXT per scene dengan tag per kalimat: "[curious] Kalimat satu. [serious] Kalimat dua."
// Mengubah model atau teks TTS mengubah hash klip, jadi putuskan sebelum generate semua.
export const VO_SETTINGS = { model: "eleven_v4", speed: null } as const;
const VO_TAGS: Readonly<Partial<Record<string, string>>> = { hook: "[intrigued]", relate: "[thoughtful]", shift: "[confident]", urgency: "[intrigued]", install: "[calm]", pakai: "[friendly]", closing: "[calm]", cta: "[friendly]" };
// "Claude" terbaca "cloud" di hook, jadi hanya teks TTS hook yang memakai ejaan fonetis ("Klod Kod"); subtitle tetap dari SPOKEN.
const TTS_FIX: Readonly<Partial<Record<SceneId, readonly [string, string]>>> = { hook: ["Claude Code", "Klod Kod"] };
export const VO_TEXT: Readonly<Record<SceneId, string>> = Object.fromEntries(
  SCENE_IDS.map((id) => [id, `${VO_TAGS[id] ?? "[confident]"} ${TTS_FIX[id] ? SPOKEN[id].replace(TTS_FIX[id][0], TTS_FIX[id][1]) : SPOKEN[id]}`]),
) as Record<SceneId, string>;

// Waktu tiap kata SPOKEN (detik sejak klip suara mulai) untuk subtitle `SubtitleBand`. Kosong = pakai estimateWords() di bawah;
// diisi dari audio asli oleh `node scripts/vo-words.mjs --video FilmKode` setelah voiceover jadi.
export const WORDS: Readonly<Record<SceneId, readonly (readonly [string, number])[]>> = {
  hook: [["Film", 0.12], ["sembilan", 0.48], ["puluh", 0.91], ["sembilan", 1.33], ["gaya", 2.02], ["tanpa", 2.46], ["model", 2.78], ["video,", 3.16], ["dibuat", 4.1], ["plugin", 4.48], ["Claude", 4.92], ["Code", 5.24], ["dari", 5.64], ["Lemomo.", 5.98]],
  relate: [["Kamu", 0.08], ["mau", 0.4], ["bikin", 0.6], ["video,", 0.94], ["tapi", 1.92], ["harus", 2.36], ["edit", 2.66], ["manual", 2.94], ["atau", 3.84], ["bayar", 4.12], ["generator", 4.4], ["yang", 5.02], ["hasilnya", 5.16], ["acak.", 5.74]],
  shift: [["Lemo", 0.1], ["Opuskar", 0.4], ["membuat", 1.1], ["agen", 1.62], ["menulis", 2.0], ["kode", 2.42], ["yang", 2.8], ["menggambar", 2.92], ["tiap", 3.54], ["frame,", 3.82], ["menyusun", 4.46], ["musik,", 4.9], ["dan", 5.62], ["membacakan", 5.76], ["narasinya,", 6.32], ["jadi", 7.4], ["filmnya", 7.96], ["murni", 8.52], ["hasil", 8.96], ["kode.", 9.28]],
  urgency: [["Dan", 0.1], ["memasangnya", 0.28], ["cuma", 1.08], ["dua", 1.34], ["perintah,", 1.56], ["tapi", 2.74], ["cara", 3.26], ["kamu", 3.54], ["memintanya", 3.8], ["yang", 4.6], ["menentukan", 4.76], ["hasilnya.", 5.26]],
  install: [["Di", 0.08], ["terminal,", 0.22], ["tambahkan", 1.22], ["marketplace-nya,", 1.74], ["lalu", 3.14], ["pasang", 3.58], ["pluginnya,", 3.94], ["dan", 4.94], ["siapkan", 5.24], ["Node,", 5.78], ["ffmpeg,", 6.48], ["dan", 7.28], ["Python.", 7.56]],
  pakai: [["Ketik", 0.06], ["Lemo", 0.5], ["Opuskar,", 0.82], ["pilih", 1.86], ["bahasa,", 2.16], ["lalu", 3.2], ["minta", 3.48], ["dengan", 3.88], ["rumus", 4.18], ["gaya,", 4.56], ["topik,", 5.3], ["dan", 5.84], ["durasi,", 6.02], ["misalnya", 7.0], ["watercolor", 8.04], ["tentang", 8.8], ["kebun", 9.14], ["kopi", 9.44], ["selama", 9.94], ["empat", 10.48], ["puluh", 10.73], ["lima", 10.97], ["detik.", 11.26]],
  closing: [["Film", 0.12], ["tidak", 0.5], ["harus", 0.76], ["lahir", 1.08], ["dari", 1.54], ["model", 1.76], ["video,", 2.1], ["kadang", 3.12], ["cukup", 3.88], ["dari", 4.18], ["agen", 4.48], ["yang", 4.78], ["paham", 5.02], ["cara", 5.5], ["menggambar", 5.74], ["lewat", 6.26], ["kode.", 6.56]],
  cta: [["Follow", 0.14], ["kalau", 0.74], ["kamu", 0.98], ["mau", 1.26], ["tahu", 1.48], ["plugin", 1.78], ["Claude", 2.16], ["Code", 2.44], ["lainnya", 2.68], ["yang", 3.26], ["bisa", 3.44], ["dipakai", 3.68], ["untuk", 4.28], ["bikin", 4.52], ["konten.", 4.78]],
};

// Posisi dan mode karakter narator per scene: `x` titik tengah (0-1), `mode` normal | small | hidden (lihat reelsLayout.ts,
// "Tata letak narator aman platform"). Mode menentukan tinggi karakter, tinggi area konten, dan posisi subtitle scene itu:
// konten banyak -> small (karakter kecil) atau hidden (tanpa karakter). Sesuaikan per storyboard.
export const NARRATOR: Readonly<Record<SceneId, { readonly x: number; readonly mode: NarratorMode }>> = {
  hook: { x: 0.5, mode: "normal" },
  relate: { x: 0.3, mode: "hidden" },
  shift: { x: 0.62, mode: "normal" },
  urgency: { x: 0.3, mode: "hidden" },
  install: { x: 0.3, mode: "small" },
  pakai: { x: 0.7, mode: "hidden" },
  closing: { x: 0.3, mode: "small" },
  cta: { x: 0.5, mode: "normal" },
};
// Latar per scene. "kantor" = kantor malam dari Reels block, dipakai di scene yang ada karakternya; "datar" = latar `Backdrop` biasa
// (ground, dark, primary) di scene tanpa karakter (mode hidden), supaya scene berselang-seling antara dunia kantor dan panel datar.
export const WORLD: Readonly<Record<SceneId, "kantor" | { readonly flat: "ground" | "dark" | "primary" }>> = {
  hook: "kantor",
  relate: { flat: "primary" },
  shift: "kantor",
  urgency: { flat: "dark" },
  install: "kantor",
  pakai: { flat: "ground" },
  closing: { flat: "primary" },
  cta: "kantor",
};
export const SUBTITLE_Y: readonly number[] = SCENE_IDS.map((id) => NARRATOR_MODES[NARRATOR[id].mode].subtitleTop);

// Subtitle menampilkan ejaan asli, bukan ejaan fonetis SPOKEN yang hanya untuk suara. Contoh: { match: ["ei", "ai"], to: "AI" }
// (urutan kata fonetis huruf kecil -> pengganti). Kosong bila tidak ada singkatan fonetis.
export const DISPLAY_FIXES: readonly DisplayFix[] = [
  { match: ["lemo", "opuskar"], to: "Lemo Opuscar" },
  { match: ["sembilan", "puluh", "sembilan"], to: "99" },
];

export const CAPTION = "Lemo Opuscar dari Lemomo: 99 gaya film untuk Claude Code, dibuat murni dari kode tanpa model video. Pasang lewat dua perintah plugin, lalu minta filmnya. Satu film butuh sekitar 30-60 menit dan banyak token. Sumber: github.com/lemomo-ai/lemo-opuscar";
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
