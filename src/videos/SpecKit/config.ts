// Spec Kit Mengubah Cara Ngoding AI. Reels 9:16, 30 fps. Alur scene: Hook, Relate, Shift, Urgency, Closing, Cta.
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

export const SCENE_IDS = ["hook", "relate", "shift", "urgency", "closing", "cta"] as const;
export type SceneId = (typeof SCENE_IDS)[number];

export const SPOKEN: Readonly<Record<SceneId, string>> = {
  hook: "Ei Ai kamu bisa menulis kode dalam hitungan detik, lalu membangun fitur yang bahkan bukan kamu minta.",
  relate: "Seringnya masalah bukan modelnya. Kita kasih satu kalimat, berharap agent paham konteks, batasan, dan definisi selesai sekaligus.",
  shift: "Spec Kit dari GitHub membalik urutannya: jelaskan kebutuhan dulu, turunkan jadi spesifikasi, rencana, lalu tugas sebelum implementasi.",
  urgency: "Tapi ini bukan ritual wajib untuk setiap perubahan. Spec Kit juga punya alur terpisah untuk memperbaiki bug dan menilai ide.",
  closing: "Agent yang cepat tetap butuh arah. Spesifikasi yang jelas mengurangi tebak-tebakan, bukan menjamin kode sempurna.",
  cta: "Follow kalau kamu ingin melihat cara kerja coding agent dengan lebih terstruktur, tanpa menganggap Ei Ai selalu benar.",
};

// Voiceover memakai eleven_v4 dengan tag emosi per kalimat supaya intonasi mengikuti naskah (multilingual_v2 terdengar datar).
// eleven_v4 mengabaikan speed. VO_TEXT = teks yang dikirim ke TTS; SPOKEN tetap teks caption dan cue.
export const VO_SETTINGS = { model: "eleven_v4", speed: null } as const;
export const VO_TEXT: Readonly<Record<SceneId, string>> = {
  hook: "[curious] Ei Ai kamu bisa menulis kode dalam hitungan detik, [serious] lalu membangun fitur yang bahkan bukan kamu minta.",
  relate: "[thoughtful] Seringnya masalah bukan modelnya. [casual] Kita kasih satu kalimat, berharap agent paham konteks, batasan, dan definisi selesai sekaligus.",
  shift: "[confident] Spec Kit dari GitHub membalik urutannya: [excited] jelaskan kebutuhan dulu, turunkan jadi spesifikasi, rencana, lalu tugas sebelum implementasi.",
  urgency: "[calm] Tapi ini bukan ritual wajib untuk setiap perubahan. [curious] Spec Kit juga punya alur terpisah untuk memperbaiki bug dan menilai ide.",
  closing: "[serious] Agent yang cepat tetap butuh arah. [warm] Spesifikasi yang jelas mengurangi tebak-tebakan, bukan menjamin kode sempurna.",
  cta: "[friendly] Follow kalau kamu ingin melihat cara kerja coding agent dengan lebih terstruktur, tanpa menganggap Ey Ai selalu benar.",
};

export const CAPTION = "Spec Kit membantu memberi struktur pada cara coding agent bekerja, dari spesifikasi sampai implementasi.";
export const HASHTAGS = ["#DeveloperIndonesia", "#AIForDeveloper", "#CareerDeveloper", "#ProgrammerIndonesia", "#TechMindset"] as const;

const entries = (manifest as { lines: Record<string, { duration: number }> }).lines;

export const VO: Readonly<Record<SceneId, { readonly file: string | null; readonly seconds: number }>> = Object.fromEntries(
  SCENE_IDS.map((id) => [id, entries[id] ? { file: VO_FILES[id], seconds: entries[id].duration } : { file: null, seconds: SPOKEN[id].length / CHARS_PER_SEC }]),
) as Record<SceneId, { file: string | null; seconds: number }>;

// Waktu tiap kata SPOKEN (detik sejak klip suara mulai) untuk subtitle `Caption`. Kosong = pakai estimateWords() di bawah;
// diisi dari audio asli oleh `node scripts/vo-words.mjs --video SpecKit` setelah voiceover jadi.
export const WORDS: Readonly<Record<SceneId, readonly (readonly [string, number])[]>> = {
  hook: [["Ei", 0.1], ["Ai", 0.66], ["kamu", 0.66], ["bisa", 0.94], ["menulis", 1.18], ["kode", 1.62], ["dalam", 2], ["hitungan", 2.22], ["detik,", 2.58], ["lalu", 3.48], ["membangun", 3.86], ["fitur", 4.34], ["yang", 4.82], ["bahkan", 5.06], ["bukan", 5.6], ["kamu", 5.86], ["minta.", 6.12]],
  relate: [["Seringnya", 0.12], ["masalah", 1.2], ["bukan", 1.84], ["modelnya.", 2.12], ["Kita", 3.28], ["kasih", 3.48], ["satu", 3.76], ["kalimat,", 3.98], ["berharap", 4.78], ["agent", 5.44], ["paham", 5.76], ["konteks,", 6.1], ["batasan,", 6.84], ["dan", 7.6], ["definisi", 7.78], ["selesai", 8.34], ["sekaligus.", 8.88]],
  shift: [["Spec", 0.12], ["Kit", 0.12], ["dari", 0.44], ["GitHub", 0.66], ["membalik", 0.88], ["urutannya:", 1.36], ["jelaskan", 1.94], ["kebutuhan", 3], ["dulu,", 3.42], ["turunkan", 3.9], ["jadi", 4.6], ["spesifikasi,", 5.14], ["rencana,", 5.38], ["lalu", 6.48], ["tugas", 7.36], ["sebelum", 7.74], ["implementasi.", 8.1]],
  urgency: [["Tapi", 0.06], ["ini", 0.92], ["bukan", 1.12], ["ritual", 1.42], ["wajib", 1.82], ["untuk", 2.36], ["setiap", 2.58], ["perubahan.", 2.9], ["Spec", 4.04], ["Kit", 4.36], ["juga", 4.54], ["punya", 4.78], ["alur", 5.08], ["terpisah", 5.32], ["untuk", 6.06], ["memperbaiki", 6.28], ["bug", 7], ["dan", 7.32], ["menilai", 7.48], ["ide.", 7.92]],
  closing: [["Agent", 0.08], ["yang", 0.46], ["cepat", 0.66], ["tetap", 1.3], ["butuh", 1.78], ["arah.", 2.12], ["Spesifikasi", 3.04], ["yang", 3.8], ["jelas", 4], ["mengurangi", 4.58], ["tebak-tebakan,", 5.02], ["bukan", 6.22], ["menjamin", 6.64], ["kode", 7.08], ["sempurna.", 7.3]],
  cta: [["Follow", 0.14], ["kalau", 0.76], ["kamu", 1.02], ["ingin", 1.34], ["melihat", 1.56], ["cara", 1.96], ["kerja", 2.22], ["coding", 2.54], ["agent", 2.88], ["dengan", 3.26], ["lebih", 3.54], ["terstruktur,", 3.86], ["tanpa", 4.96], ["menganggap", 5.34], ["Ei", 5.9], ["Ai", 6.3], ["selalu", 6.3], ["benar.", 6.78]],
};

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
