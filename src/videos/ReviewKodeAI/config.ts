// Review Kode AI Kamu Bohong. Format A (opini): Hook, Relate, Shift, Urgency, Closing, CTA. Reels 9:16, 30 fps.
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
  hook: "Ei Ai bilang kodenya sudah benar, dan semua tes hijau. Kamu percaya?",
  relate: "Kamu minta Ei Ai menulis fitur. Tesnya lolos semua, jadi kamu langsung merge. Seminggu kemudian, bug muncul di produksi.",
  shift: "Masalahnya, Ei Ai menulis kode dan tesnya sekaligus. Tes hijau cuma membuktikan dia paham tesnya, bukan paham masalahmu.",
  urgency: "Ini baru bagian pertama. Ada satu pertanyaan yang jauh lebih tajam, yang harus kamu tanyakan sebelum menekan merge.",
  closing: "Review kode itu soal niat, bukan soal sintaks. Tes hijau bukan bukti benar, cuma bukti lolos.",
  cta: "Follow kalau kamu mau tahu pertanyaan yang kutanyakan sebelum merge kode dari Ei Ai.",
};

export const CAPTION = "Tes hijau belum tentu berarti kodenya benar. Kalau AI menulis kode dan tesnya sekaligus, yang diuji cuma dirinya sendiri.";
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
