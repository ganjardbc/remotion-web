// Prompt Panjang Itu Tanda Malas. Format A (opini), satu konten tuntas: Hook, Relate, Shift, Urgency, Cara (jawaban
// "bagian kedua" langsung dibayar di video yang sama), Closing, CTA. Reels 9:16, 30 fps.
// Voiceover: ElevenLabs, suara Nilasari. Teks yang diucapkan ada di SPOKEN; singkatan Inggris ditulis fonetis
// ("Ei Ai") agar terbaca benar. Selama voiceover.json kosong, durasi scene diperkirakan dari panjang teks
// (CHARS_PER_SEC); setelah ada voiceover.json, durasi mengikuti audio.
import manifest from "./voiceover.json";
import { VO_FILES } from "./voiceover-files";

export const FPS = 30;
// Jeda sebelum suara mulai di tiap scene, dan ekor setelah suara selesai.
export const LEAD = 6;
const TAIL = 0.45;
// Kecepatan bicara Nilasari, speed 1.2 (diukur dari Haiku55).
const CHARS_PER_SEC = 15.3;

export const SCENE_IDS = ["hook", "relate", "shift", "urgency", "cara", "closing", "cta"] as const;
export type SceneId = (typeof SCENE_IDS)[number];

export const SPOKEN: Readonly<Record<SceneId, string>> = {
  hook: "Prompt lima ratus kata itu bukan skill. Itu tanda kamu malas berpikir.",
  relate: "Kamu tulis prompt panjang, hasilnya melenceng. Kamu tambah aturan, tetap melenceng. Lalu kamu menyalahkan Ei Ai.",
  shift: "Prompt panjang sering jadi tempat menyembunyikan pikiran yang belum jernih. Padahal Ei Ai tidak bisa menebak apa yang kamu sendiri belum tahu.",
  urgency: "Ini baru bagian pertama. Bagian kedua yang membuat prompt-mu pendek tapi tajam.",
  cara: "Tulis masalahnya dalam dua kalimat dulu: apa yang kamu mau, dan apa yang tidak boleh terjadi. Kalau sulit, berarti masalahnya yang belum jelas.",
  closing: "Prompt yang bagus bukan yang paling panjang, tapi yang paling jelas.",
  cta: "Follow kalau kamu mau belajar berpikir jernih sebelum menyentuh Ei Ai, bukan cuma belajar prompt.",
};

export const CAPTION = "Prompt lima ratus kata bukan tanda jago. Sering itu tanda pikirannya belum jernih. Tulis masalahnya dalam dua kalimat dulu.";
export const HASHTAGS = ["#DeveloperIndonesia", "#AIForDeveloper", "#CareerDeveloper", "#ProgrammerIndonesia", "#TechMindset"] as const;

const entries = (manifest as { lines: Record<string, { duration: number }> }).lines;

export const VO: Readonly<Record<SceneId, { readonly file: string | null; readonly seconds: number }>> = Object.fromEntries(
  SCENE_IDS.map((id) => [id, entries[id] ? { file: VO_FILES[id], seconds: entries[id].duration } : { file: null, seconds: SPOKEN[id].length / CHARS_PER_SEC }]),
) as Record<SceneId, { file: string | null; seconds: number }>;

// Detik sejak suara mulai saat `phrase` diucapkan, diperkirakan dari posisi huruf di SPOKEN.
export const at = (id: SceneId, phrase: string): number => {
  const i = SPOKEN[id].indexOf(phrase);
  if (i < 0) throw new Error(`Frasa "${phrase}" tidak ada di SPOKEN.${id}`);
  return (i / SPOKEN[id].length) * VO[id].seconds;
};

export const SCENE_FRAMES: readonly number[] = SCENE_IDS.map((id) => LEAD + Math.ceil((VO[id].seconds + TAIL) * FPS));
export const SCENE_START: readonly number[] = SCENE_FRAMES.map((_, i) => SCENE_FRAMES.slice(0, i).reduce((a, b) => a + b, 0));
export const TOTAL_FRAMES = SCENE_FRAMES.reduce((a, b) => a + b, 0);

export const MUSIC_FILE = "music/vue_bed.mp3";
