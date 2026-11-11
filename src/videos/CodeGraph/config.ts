// CodeGraph Hemat Token? Aku Tes Sendiri. Reels 9:16, 30 fps. Alur scene: Hook, Relate, Hasil, Shift, Urgency, Closing, Cta.
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

export const SCENE_IDS = ["hook", "relate", "hasil", "shift", "urgency", "closing", "cta"] as const;
export type SceneId = (typeof SCENE_IDS)[number];

export const SPOKEN: Readonly<Record<SceneId, string>> = {
  hook: "Aku tes CodeGraph. Malah lebih mahal.",
  relate: "Katanya hemat 62% token. Aku nggak langsung percaya. Pertanyaan yang sama, aku jalankan dua kali. Satu pakai CodeGraph, satu nggak. Tiga kali tiap sisi, ambil tengahnya.",
  hasil: "Pakai CodeGraph: 0,29 dolar, 385 ribu token. Tanpa CodeGraph: 0,19 dolar, 206 ribu token.",
  shift: "Aku cek kenapa. Tool-nya jalan, bukan rusak. Hasilnya besar, dan Claude tetap grep sendiri sesudahnya.",
  urgency: "Tapi ini baru separuh ceritanya.",
  closing: "Proyekku 692 file. Pertanyaannya gampang buat grep. Jadi bukan vonis. Satu proyek, satu pertanyaan.",
  cta: "Tes sendiri dulu. Tool apa yang mau aku tes? Tulis di komentar.",
};

export const CAPTION =
  "Katanya CodeGraph hemat 62% token. Di proyekku justru lebih mahal: 0,29 dolar lawan 0,19 dolar. Bukan vonis, cuma satu proyek dan satu pertanyaan. Tes sendiri dulu, lalu ceritakan hasilmu.";
export const HASHTAGS = ["#DeveloperIndonesia", "#AIForDeveloper", "#CareerDeveloper", "#ProgrammerIndonesia", "#TechMindset"] as const;

const entries = (manifest as { lines: Record<string, { duration: number }> }).lines;

export const VO: Readonly<Record<SceneId, { readonly file: string | null; readonly seconds: number }>> = Object.fromEntries(
  SCENE_IDS.map((id) => [id, entries[id] ? { file: VO_FILES[id], seconds: entries[id].duration } : { file: null, seconds: SPOKEN[id].length / CHARS_PER_SEC }]),
) as Record<SceneId, { file: string | null; seconds: number }>;

// Detik sejak suara mulai saat `phrase` diucapkan: awal kata (dari WORDS) tempat frasa dimulai di SPOKEN.
export const at = (id: SceneId, phrase: string): number => {
  const i = SPOKEN[id].indexOf(phrase);
  if (i < 0) throw new Error(`Frasa "${phrase}" tidak ada di SPOKEN.${id}`);
  const index = SPOKEN[id].slice(0, i).split(" ").length - 1;
  return WORDS[id][Math.max(0, index)][1];
};

// Voiceover memakai eleven_v4 dengan tag emosi per kalimat (intonasi mengikuti naskah). eleven_v4 mengabaikan speed.
// VO_TEXT = teks yang dikirim ke TTS: nama dieja fonetis ("Kod Graf"), angka dieja; SPOKEN tetap teks subtitle dan cue.
export const VO_SETTINGS = { model: "eleven_v4", speed: null } as const;
export const VO_TEXT: Readonly<Record<SceneId, string>> = {
  hook: "[serious] Aku tes Kod Graf. [frustrated] Malah lebih mahal.",
  relate:
    "[skeptical] Katanya hemat enam puluh dua persen token. Aku nggak langsung percaya. [curious] Pertanyaan yang sama, aku jalankan dua kali. Satu pakai Kod Graf, satu nggak. Tiga kali tiap sisi, ambil tengahnya.",
  hasil: "[confident] Pakai Kod Graf: nol koma dua puluh sembilan dolar, tiga ratus delapan puluh lima ribu token. Tanpa Kod Graf: nol koma sembilan belas dolar, dua ratus enam ribu token.",
  shift: "[thoughtful] Aku cek kenapa. Tool-nya jalan, bukan rusak. [serious] Hasilnya besar, dan Claude tetap grep sendiri sesudahnya.",
  urgency: "[intrigued] Tapi ini baru separuh ceritanya.",
  closing: "[calm] Proyekku enam ratus sembilan puluh dua file. Pertanyaannya gampang buat grep. [warm] Jadi bukan vonis. Satu proyek, satu pertanyaan.",
  cta: "[friendly] Tes sendiri dulu. Tool apa yang mau aku tes? Tulis di komentar.",
};

// Waktu tiap kata SPOKEN (detik sejak klip suara mulai), dari timestamp scribe (scripts/vo-words.mjs). Baris relate dan hasil dikoreksi
// tangan: "62%" diucapkan "enam puluh dua persen" (4 kata scribe), jadi pemetaan per huruf bergeser ±2 dtk. Kalau vo-words
// dijalankan ulang, periksa lagi baris relate dan hasil (angka dieja panjang di audio), juga closing.
export const WORDS: Readonly<Record<SceneId, readonly (readonly [string, number])[]>> = {
  hook: [["Aku", 0.14], ["tes", 0.5], ["CodeGraph.", 0.78], ["Malah", 1.78], ["lebih", 2.06], ["mahal.", 2.34]],
  relate: [["Katanya", 0.08], ["hemat", 0.9], ["62%", 1.22], ["token.", 2.32], ["Aku", 3.52], ["nggak", 3.76], ["langsung", 3.94], ["percaya.", 4.24], ["Pertanyaan", 5.36], ["yang", 5.88], ["sama,", 6.08], ["aku", 6.84], ["jalankan", 7.08], ["dua", 7.6], ["kali.", 7.88], ["Satu", 8.66], ["pakai", 9.1], ["CodeGraph,", 9.38], ["satu", 10.22], ["nggak.", 10.5], ["Tiga", 11.28], ["kali", 11.58], ["tiap", 11.86], ["sisi,", 12.1], ["ambil", 12.8], ["tengahnya.", 13.04]],
  hasil: [["Pakai", 0.06], ["CodeGraph:", 0.38], ["0,29", 1.5], ["dolar,", 2.8], ["385", 3.5], ["ribu", 4.92], ["token.", 5.22], ["Tanpa", 6.16], ["CodeGraph:", 6.58], ["0,19", 7.66], ["dolar,", 8.8], ["206", 9.52], ["ribu", 10.36], ["token.", 10.62]],
  shift: [["Aku", 0.12], ["cek", 0.52], ["kenapa.", 0.76], ["Tool-nya", 1.9], ["jalan,", 2.38], ["bukan", 3.1], ["rusak.", 3.4], ["Hasilnya", 4.32], ["besar,", 4.86], ["dan", 5.76], ["Claude", 6.02], ["tetap", 6.4], ["grep", 6.82], ["sendiri", 7.08], ["sesudahnya.", 7.48]],
  urgency: [["Tapi", 0.06], ["ini", 1.04], ["baru", 1.3], ["separuh", 1.58], ["ceritanya.", 2.04]],
  closing: [["Proyekku", 0.06], ["692", 1.1], ["file.", 2.44], ["Pertanyaannya", 3.16], ["gampang", 3.92], ["buat", 4.48], ["grep.", 4.76], ["Jadi", 5.52], ["bukan", 5.94], ["vonis.", 6.3], ["Satu", 7.34], ["proyek,", 7.64], ["satu", 8.36], ["pertanyaan.", 8.64]],
  cta: [["Tes", 0.06], ["sendiri", 0.22], ["dulu.", 0.62], ["Tool", 1.46], ["apa", 1.76], ["yang", 2], ["mau", 2.12], ["aku", 2.32], ["tes?", 2.58], ["Tulis", 3.22], ["di", 3.5], ["komentar.", 3.6]],
};

export const SCENE_FRAMES: readonly number[] = SCENE_IDS.map((id) => LEAD + Math.ceil((VO[id].seconds + TAIL) * FPS));
export const SCENE_START: readonly number[] = SCENE_FRAMES.map((_, i) => SCENE_FRAMES.slice(0, i).reduce((a, b) => a + b, 0));
export const TOTAL_FRAMES = SCENE_FRAMES.reduce((a, b) => a + b, 0);

export const MUSIC_FILE = "music/vue_bed.mp3";
