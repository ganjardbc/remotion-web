// Menyusun Opus, Sonnet, dan Haiku dalam Satu Sistem (reels 9:16, 30 fps). Durasi scene mengikuti audio voiceover (voiceover.json).
// Voiceover: ElevenLabs, suara Nilasari. Teks yang diucapkan ada di SPOKEN (angka dieja agar terbaca benar).
import manifest from "./voiceover.json";
import { VO_FILES } from "./voiceover-files";

export const FPS = 30;
// Jeda sebelum suara mulai di tiap scene, dan ekor setelah suara selesai.
export const LEAD = 6;
// Kecepatan bicara Nilasari, speed 1.2 (diukur dari Haiku55).
const CHARS_PER_SEC = 15.3;
const TAIL = 0.4;

export const SCENE_IDS = ["hook", "relate", "team", "opus", "sonnet", "haiku", "key", "closing", "cta"] as const;
export type SceneId = (typeof SCENE_IDS)[number];

export const SPOKEN: Readonly<Record<SceneId, string>> = {
  hook: "Kalau kamu masih pakai satu model untuk semua pekerjaan, kamu sedang membuang uang dan waktu.",
  relate: "Banyak dari kita memilih satu model favorit, lalu memakainya untuk segala hal. Mulai dari merancang fitur, menulis kode, sampai merapikan teks. Hasilnya sering bagus, tapi tagihannya ikut membengkak.",
  team: "Coba pikirkan Opus, Sonnet, dan Haiku sebagai tiga peran dalam satu tim.",
  opus: "Opus adalah arsitek. Pakai dia untuk keputusan yang sulit diubah nanti, dan pekerjaan yang salah sedikit saja bisa mahal.",
  sonnet: "Sonnet adalah pengembang utama. Dengan selisih kualitas yang kecil dibanding Opus, dia cocok untuk implementasi, perbaikan bug, dan iterasi harian.",
  haiku: "Haiku adalah operator. Dia cepat dan murah, pas untuk klasifikasi, ringkasan singkat, atau tugas berulang dalam jumlah besar.",
  key: "Kuncinya ada di pembagiannya. Rancang dengan model yang paling teliti, kerjakan dengan model yang seimbang, lalu jalankan tugas rutin dengan model yang paling efisien.",
  closing: "Model terbaik bukan yang paling mahal, melainkan yang ditempatkan di posisi yang tepat.",
  cta: "Ini konten terakhir dari seri Haiku lima koma lima. Kalau sudah membantu, simpan video ini dan terapkan pembagiannya di proyekmu.",
};

export const CAPTION = "Satu model untuk semua pekerjaan itu boros. Opus merancang, Sonnet mengerjakan, Haiku menjalankan tugas rutin. Kuncinya ada di pembagiannya.";
export const HASHTAGS = ["#DeveloperIndonesia", "#AIForDeveloper", "#CareerDeveloper", "#ProgrammerIndonesia", "#TechMindset"] as const;

// Voiceover lama: eleven_multilingual_v2 speed 1.2. Dikunci di sini karena bawaan Reels baru eleven_v4 (scripts/vo-lines.mjs); mengubahnya mengubah hash klip.
export const VO_SETTINGS = { model: "eleven_multilingual_v2", speed: 1.2 } as const;

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
