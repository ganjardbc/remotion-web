// Haiku 5.5 Bukan Model Kelas Dua (reels 9:16, 30 fps). Durasi scene mengikuti audio voiceover (voiceover.json).
// Voiceover: ElevenLabs, suara Nilasari. Teks yang diucapkan ada di SPOKEN (angka dieja agar terbaca benar).
import manifest from "./voiceover.json";
import { VO_FILES } from "./voiceover-files";

export const FPS = 30;
// Jeda sebelum suara mulai di tiap scene, dan ekor setelah suara selesai.
export const LEAD = 6;
const TAIL = 0.45;

export const SCENE_IDS = ["hook", "relate", "intro", "fast", "context", "volume", "teaser", "closing", "cta"] as const;
export type SceneId = (typeof SCENE_IDS)[number];

export const SPOKEN: Readonly<Record<SceneId, string>> = {
  hook: "Kebanyakan developer menganggap Haiku itu model kelas dua. Aku mau bilang, itu salah besar.",
  relate: "Tiap ada rilis model baru, kita refleks pakai yang paling pintar. Padahal tagihannya naik, dan untuk tugas kecil hasilnya tidak jauh beda.",
  intro: "Haiku lima koma lima dirilis tujuh Oktober, dan menggantikan Haiku empat koma lima.",
  fast: "Yang pertama wajib kamu tahu: dia yang paling cepat di keluarga Claude lima koma lima. Sekitar dua ratus tiga puluh tujuh token per detik, hampir dua kali lipat Sonnet lima koma lima.",
  context: "Yang kedua, konteks input-nya sampai satu juta token, dengan output hingga seratus dua puluh delapan ribu token. Jadi bukan model kecil yang kepepet.",
  volume: "Yang ketiga, dan ini yang paling penting: dia dibuat untuk volume tinggi. Klasifikasi, ringkasan singkat, validasi input, routing request. Di tugas seperti itu, kecepatan dan biaya per panggilan lebih berarti daripada kepintaran maksimal.",
  teaser: "Dan ini baru setengah cerita. Kalau kamu cuma menilai dari skor benchmark, kamu akan melewatkan bagian yang paling menentukan desain sistem kamu.",
  closing: "Model terbaik bukan yang paling pintar, tapi yang paling pas dengan pekerjaannya.",
  cta: "Follow kalau kamu mau lanjut ke bagian kedua, yaitu cara menyusun pembagian Opus, Sonnet, dan Haiku dalam satu sistem.",
};

const entries = (manifest as { lines: Record<string, { duration: number }> }).lines;

export const VO: Readonly<Record<SceneId, { readonly file: string; readonly seconds: number }>> = Object.fromEntries(
  SCENE_IDS.map((id) => [id, { file: VO_FILES[id], seconds: entries[id].duration }]),
) as Record<SceneId, { file: string; seconds: number }>;

export const SCENE_FRAMES: readonly number[] = SCENE_IDS.map((id) => LEAD + Math.ceil((VO[id].seconds + TAIL) * FPS));
export const SCENE_START: readonly number[] = SCENE_FRAMES.map((_, i) => SCENE_FRAMES.slice(0, i).reduce((a, b) => a + b, 0));
export const TOTAL_FRAMES = SCENE_FRAMES.reduce((a, b) => a + b, 0);

export const MUSIC_FILE = "music/vue_bed.mp3";
