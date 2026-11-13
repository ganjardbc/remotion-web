// AI-Native SDLC Itu Sebenarnya Loop. Reels 9:16, 30 fps. Alur scene: Hook, Relate, Shift, Urgency, Cara, Closing, Cta.
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
// Perkiraan kecepatan bicara Nilasari dengan eleven_v4 (rata-rata video v4 lain: 11-15 huruf/detik).
const CHARS_PER_SEC = 13.2;

export const SCENE_IDS = ["hook", "relate", "shift", "urgency", "cara", "closing", "cta"] as const;
export type SceneId = (typeof SCENE_IDS)[number];

export const SPOKEN: Readonly<Record<SceneId, string>> = {
  hook: "Anthropic menjelaskan satu istilah baru untuk developer: Ei Ai-native Es Di El Si. Artinya bukan agen yang menulis kodenya, tapi cara kerja yang dirancang ulang.",
  relate: "Agen sudah menulis kodenya dalam sejam. Tapi review, persetujuan, dan rilis masih berjalan selambat dulu.",
  shift: "Es Di El Si lama itu garis lurus: rencana, desain, build, tes, rilis. Di Ei Ai-native Es Di El Si, alur itu jadi loop, dan tiap tahap berakhir dengan satu file di Git yang dibaca tahap berikutnya.",
  urgency: "Tapi loop saja belum cukup. Yang bikin loop ini benar-benar jalan adalah apa yang ditulis di tiap file, dan itu yang paling sering dilewatkan.",
  cara: "Mulai dari intent: apa yang diminta dan kenapa. Jadi spec: apa yang harus benar. Jadi plan: langkah yang disetujui sebelum kode ditulis. Lalu kode dan tes, dan masalah dari produksi masuk lagi jadi intent baru.",
  closing: "Agen mengerjakan tiap tahap, manusia memegang keputusan di gerbangnya. Loop-nya terus berjalan, penilaian manusia tetap di atasnya.",
  cta: "Follow kalau kamu mau paham cara kerja bareng agen dari alurnya, bukan cuma dari tools-nya.",
};

// Voiceover eleven_v4 (bawaan Reels baru; mengabaikan speed) dengan tag emosi per kalimat supaya intonasi mengikuti naskah.
// VO_TEXT = teks TTS; SPOKEN tetap teks subtitle dan cue.
export const VO_SETTINGS = { model: "eleven_v4", speed: null } as const;
export const VO_TEXT: Readonly<Record<SceneId, string>> = {
  hook: "[curious] Anthropic menjelaskan satu istilah baru untuk developer: Ei Ai-native Es Di El Si. [serious] Artinya bukan agen yang menulis kodenya, tapi cara kerja yang dirancang ulang.",
  relate: "[thoughtful] Agen sudah menulis kodenya dalam sejam. [frustrated] Tapi review, persetujuan, dan rilis masih berjalan selambat dulu.",
  shift: "[serious] Es Di El Si lama itu garis lurus: rencana, desain, build, tes, rilis. [confident] Di Ei Ai-native Es Di El Si, alur itu jadi loop, dan tiap tahap berakhir dengan satu file di Git yang dibaca tahap berikutnya.",
  urgency: "[intrigued] Tapi loop saja belum cukup. Yang bikin loop ini benar-benar jalan adalah apa yang ditulis di tiap file, dan itu yang paling sering dilewatkan.",
  cara: "[calm] Mulai dari intent: apa yang diminta dan kenapa. Jadi spec: apa yang harus benar. Jadi plan: langkah yang disetujui sebelum kode ditulis. [confident] Lalu kode dan tes, dan masalah dari produksi masuk lagi jadi intent baru.",
  closing: "[calm] Agen mengerjakan tiap tahap, manusia memegang keputusan di gerbangnya. [warm] Loop-nya terus berjalan, penilaian manusia tetap di atasnya.",
  cta: "[friendly] Follow kalau kamu mau paham cara kerja bareng agen dari alurnya, bukan cuma dari tools-nya.",
};

// Waktu tiap kata SPOKEN (detik sejak klip suara mulai) untuk subtitle `Caption`. Kosong = pakai estimateWords() di bawah;
// diisi dari audio asli oleh `node scripts/vo-words.mjs --video AiNativeSdlc` setelah voiceover jadi.
export const WORDS: Readonly<Record<SceneId, readonly (readonly [string, number])[]>> = {
  hook: [["Anthropic", 0.12], ["menjelaskan", 0.62], ["satu", 1.24], ["istilah", 1.56], ["baru", 1.98], ["untuk", 2.36], ["developer:", 2.6], ["Ei", 3.84], ["Ai-native", 3.84], ["Es", 5.34], ["Di", 7.04], ["El", 7.04], ["Si.", 7.04], ["Artinya", 7.04], ["bukan", 8.14], ["agen", 8.44], ["yang", 8.56], ["menulis", 8.56], ["kodenya,", 8.94], ["tapi", 10.54], ["cara", 10.82], ["kerja", 11.26], ["yang", 11.4], ["dirancang", 11.4], ["ulang.", 11.9]],
  relate: [["Agen", 0.16], ["sudah", 0.56], ["menulis", 0.84], ["kodenya", 1.26], ["dalam", 1.76], ["sejam.", 2.06], ["Tapi", 3.26], ["review,", 3.6], ["persetujuan,", 4.4], ["dan", 5.26], ["rilis", 5.48], ["masih", 6], ["berjalan", 6.26], ["selambat", 6.88], ["dulu.", 7.28]],
  shift: [["Es", 0.2], ["Di", 0.2], ["El", 0.84], ["Si", 0.84], ["lama", 1.22], ["itu", 1.54], ["garis", 1.54], ["lurus:", 1.9], ["rencana,", 2.76], ["desain,", 3.7], ["build,", 4.56], ["tes,", 5.9], ["rilis.", 5.9], ["Di", 7.34], ["Ei", 7.34], ["Ai-native", 7.34], ["Es", 9.08], ["Di", 9.42], ["El", 9.42], ["Si,", 9.7], ["alur", 9.7], ["itu", 10.02], ["jadi", 10.66], ["loop,", 10.9], ["dan", 11.16], ["tiap", 11.62], ["tahap", 11.62], ["berakhir", 12.04], ["dengan", 12.68], ["satu", 13.1], ["file", 13.42], ["di", 13.56], ["Git", 13.56], ["yang", 14.14], ["dibaca", 14.14], ["tahap", 14.44], ["berikutnya.", 14.44]],
  urgency: [["Tapi", 0.08], ["loop", 0.84], ["saja", 1.08], ["belum", 1.46], ["cukup.", 1.76], ["Yang", 2.76], ["bikin", 2.94], ["loop", 3.24], ["ini", 3.44], ["benar-benar", 3.64], ["jalan", 4.3], ["adalah", 4.94], ["apa", 5.52], ["yang", 5.88], ["ditulis", 6.02], ["di", 6.42], ["tiap", 6.56], ["file,", 6.84], ["dan", 7.54], ["itu", 7.88], ["yang", 8.24], ["paling", 8.42], ["sering", 8.66], ["dilewatkan.", 8.88]],
  cara: [["Mulai", 0.08], ["dari", 0.42], ["intent:", 0.74], ["apa", 1.8], ["yang", 2.04], ["diminta", 2.22], ["dan", 2.88], ["kenapa.", 3.1], ["Jadi", 4.28], ["spec:", 4.56], ["apa", 5.4], ["yang", 5.74], ["harus", 5.98], ["benar.", 6.38], ["Jadi", 7.34], ["plan:", 7.66], ["langkah", 8.44], ["yang", 8.86], ["disetujui", 8.98], ["sebelum", 9.74], ["kode", 10.18], ["ditulis.", 10.5], ["Lalu", 11.48], ["kode", 11.96], ["dan", 12.28], ["tes,", 12.54], ["dan", 13.2], ["masalah", 13.38], ["dari", 13.8], ["produksi", 14], ["masuk", 14.7], ["lagi", 15.08], ["jadi", 15.72], ["intent", 16.06], ["baru.", 16.42]],
  closing: [["Agen", 0.12], ["mengerjakan", 0.48], ["tiap", 1.16], ["tahap,", 1.46], ["manusia", 2.32], ["memegang", 3.06], ["keputusan", 3.48], ["di", 4.18], ["gerbangnya.", 4.3], ["Loop-nya", 5.44], ["terus", 5.98], ["berjalan,", 6.4], ["penilaian", 7.48], ["manusia", 7.98], ["tetap", 8.86], ["di", 9.32], ["atasnya.", 9.46]],
  cta: [["Follow", 0.12], ["kalau", 0.8], ["kamu", 1.06], ["mau", 1.38], ["paham", 1.62], ["cara", 2.04], ["kerja", 2.28], ["bareng", 2.6], ["agen", 2.96], ["dari", 3.28], ["alurnya,", 3.56], ["bukan", 4.5], ["cuma", 4.78], ["dari", 5.02], ["tools-nya.", 5.32]],
};

// Posisi dan mode karakter narator per scene: `x` titik tengah (0-1), `mode` normal | small | hidden (lihat reelsLayout.ts,
// "Tata letak narator aman platform"). Mode juga menentukan tinggi area konten dan posisi subtitle scene itu.
export const NARRATOR: Readonly<Record<SceneId, { readonly x: number; readonly mode: NarratorMode }>> = {
  hook: { x: 0.5, mode: "normal" },
  relate: { x: 0.3, mode: "small" },
  shift: { x: 0.7, mode: "small" },
  urgency: { x: 0.3, mode: "small" },
  cara: { x: 0.5, mode: "hidden" },
  closing: { x: 0.7, mode: "small" },
  cta: { x: 0.5, mode: "normal" },
};
export const SUBTITLE_Y: readonly number[] = SCENE_IDS.map((id) => NARRATOR_MODES[NARRATOR[id].mode].subtitleTop);

// Subtitle menampilkan ejaan asli, bukan ejaan fonetis SPOKEN yang hanya untuk suara.
export const DISPLAY_FIXES: readonly DisplayFix[] = [
  { match: ["ei", "ai-native"], to: "AI-native" },
  { match: ["ei", "ai"], to: "AI" },
  { match: ["es", "di", "el", "si"], to: "SDLC" },
];

export const CAPTION = "Anthropic menjelaskan AI-native SDLC: bukan sekadar agen yang menulis kode. Alurnya jadi loop, tiap tahap meninggalkan satu file di Git, dan manusia tetap memegang keputusan.";
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
