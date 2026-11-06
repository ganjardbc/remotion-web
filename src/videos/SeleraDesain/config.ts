// AI Kamu Tidak Punya Selera Desain. Reels 9:16, 30 fps. Alur scene: Hook, Relate, Shift, Urgency, Cara, Closing, Cta.
// Voiceover: ElevenLabs, suara Nilasari, model eleven_v4. SPOKEN = teks tampilan (caption dan cue); VO_TEXT = teks TTS
// fonetis ("Yu Ai", "Ei Ai", "Desain Em Di") dengan tag emosi. Durasi scene mengikuti audio di voiceover.json;
// CHARS_PER_SEC hanya cadangan untuk scene yang klipnya belum ada.
import manifest from "./voiceover.json";
import { VO_FILES } from "./voiceover-files";

export const FPS = 30;
// Jeda sebelum suara mulai di tiap scene, dan ekor setelah suara selesai.
export const LEAD = 6;
const TAIL = 0.45;
// Cadangan perkiraan durasi (huruf per detik) bila klip suara belum ada.
const CHARS_PER_SEC = 15.3;

export const SCENE_IDS = ["hook", "relate", "shift", "urgency", "cara", "closing", "cta"] as const;
export type SceneId = (typeof SCENE_IDS)[number];

export const SPOKEN: Readonly<Record<SceneId, string>> = {
  hook: "UI buatan AI selalu mirip semua. Dan itu bukan salah modelnya.",
  relate: "Kamu sudah minta yang bagus, sudah nulis prompt panjang. Hasilnya tetap gradien ungu dan kartu bulat.",
  shift: "Model tidak tahu bagus menurutmu itu seperti apa, jadi ia memilih rata-rata. AI tidak kekurangan kemampuan. Ia kekurangan referensi.",
  urgency: "Tahan dulu. Obatnya tidak butuh tool baru, cuma satu file teks.",
  cara: "Pilih satu DESIGN.md dari repo awesome-design-md, salin ke root proyek, lalu minta agent bangun halaman berdasarkan file itu. Isinya warna, huruf, dan aturan komponen.",
  closing: "Prompt itu perintah. DESIGN.md itu selera yang bisa dibaca.",
  cta: "Follow kalau kamu mau AI yang bekerja sesuai seleramu, bukan selera rata-ratanya.",
};

// Voiceover memakai eleven_v4 dengan tag emosi per kalimat supaya intonasi mengikuti naskah; eleven_v4 mengabaikan speed.
export const VO_SETTINGS = { model: "eleven_v4", speed: null } as const;

// Teks yang dikirim ke TTS (fonetis: "Yu Ai", "Ei Ai", "Desain Em Di"); SPOKEN tetap teks tampilan untuk caption dan cue.
export const VO_TEXT: Readonly<Record<SceneId, string>> = {
  hook: "[curious] Yu Ai buatan Ei Ai selalu mirip semua. [confident] Dan itu bukan salah modelnya.",
  relate: "[friendly] Kamu sudah minta yang bagus, sudah nulis prompt panjang. [curious] Hasilnya tetap gradien ungu dan kartu bulat.",
  shift: "[confident] Model tidak tahu bagus menurutmu itu seperti apa, jadi ia memilih rata-rata. [excited] Ei Ai tidak kekurangan kemampuan. [confident] Ia kekurangan referensi.",
  urgency: "[curious] Tahan dulu. [excited] Obatnya tidak butuh tool baru, cuma satu file teks.",
  cara: "[friendly] Pilih satu Desain Em Di dari repo awesome design em di, salin ke root proyek, lalu minta agent bangun halaman berdasarkan file itu. [warm] Isinya warna, huruf, dan aturan komponen.",
  closing: "[confident] Prompt itu perintah. [warm] Desain Em Di itu selera yang bisa dibaca.",
  cta: "[friendly] Follow kalau kamu mau Ei Ai yang bekerja sesuai seleramu, bukan selera rata-ratanya.",
};

// Waktu tiap kata SPOKEN (detik sejak klip suara mulai), dari timestamp kata ElevenLabs scribe (scripts/vo-words.mjs).
// Ukur ulang dengan `node scripts/vo-words.mjs --video SeleraDesain` kalau SPOKEN atau klip suara berubah.
export const WORDS: Readonly<Record<SceneId, readonly (readonly [string, number])[]>> = {
  hook: [["UI", 0.14], ["buatan", 0.74], ["AI", 1.18], ["selalu", 1.58], ["mirip", 1.92], ["semua.", 2.24], ["Dan", 3.32], ["itu", 3.64], ["bukan", 4.04], ["salah", 4.3], ["modelnya.", 4.56]],
  relate: [["Kamu", 0.06], ["sudah", 0.3], ["minta", 0.56], ["yang", 0.82], ["bagus,", 1], ["sudah", 1.94], ["nulis", 2.2], ["prompt", 2.5], ["panjang.", 2.76], ["Hasilnya", 3.9], ["tetap", 4.64], ["gradien", 4.98], ["ungu", 5.52], ["dan", 5.86], ["kartu", 6.04], ["bulat.", 6.34]],
  shift: [["Model", 0.1], ["tidak", 0.42], ["tahu", 0.74], ["bagus", 1.04], ["menurutmu", 1.4], ["itu", 1.94], ["seperti", 2.12], ["apa,", 2.56], ["jadi", 3.34], ["ia", 3.96], ["memilih", 4.14], ["rata-rata.", 4.5], ["AI", 5.7], ["tidak", 6.26], ["kekurangan", 6.5], ["kemampuan.", 6.98], ["Ia", 8.28], ["kekurangan", 8.54], ["referensi.", 9.04]],
  urgency: [["Tahan", 0.06], ["dulu.", 0.34], ["Obatnya", 1.24], ["tidak", 1.72], ["butuh", 1.98], ["tool", 2.28], ["baru,", 2.52], ["cuma", 3.34], ["satu", 3.6], ["file", 3.9], ["teks.", 4.22]],
  cara: [["Pilih", 0.06], ["satu", 0.36], ["DESIGN.md", 0.66], ["dari", 1.64], ["repo", 2.04], ["awesome-design-md,", 2.54], ["salin", 4.28], ["ke", 4.66], ["root", 4.76], ["proyek,", 4.96], ["lalu", 5.72], ["minta", 6.02], ["agent", 6.36], ["bangun", 6.76], ["halaman", 7.06], ["berdasarkan", 7.5], ["file", 8.12], ["itu.", 8.34], ["Isinya", 9.16], ["warna,", 9.66], ["huruf,", 10.52], ["dan", 11.16], ["aturan", 11.46], ["komponen.", 11.82]],
  closing: [["Prompt", 0.08], ["itu", 0.5], ["perintah.", 0.92], ["DESIGN.md", 2.22], ["itu", 3.08], ["selera", 3.68], ["yang", 4.28], ["bisa", 4.5], ["dibaca.", 4.92]],
  cta: [["Follow", 0.14], ["kalau", 0.7], ["kamu", 0.94], ["mau", 1.24], ["AI", 1.58], ["yang", 2.02], ["bekerja", 2.18], ["sesuai", 2.68], ["seleramu,", 3.04], ["bukan", 4], ["selera", 4.44], ["rata-ratanya.", 4.8]],
};

export const REPO_URL = "github.com/VoltAgent/awesome-design-md";

export const CAPTION = "Bukan modelnya yang kurang pintar. AI-mu tidak pernah tahu seperti apa \"bagus\" menurutmu. Satu file Markdown bisa mengubah itu, dan repo awesome-design-md mengumpulkan puluhan contohnya: github.com/VoltAgent/awesome-design-md";
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

export const SCENE_FRAMES: readonly number[] = SCENE_IDS.map((id) => LEAD + Math.ceil((VO[id].seconds + TAIL) * FPS));
export const SCENE_START: readonly number[] = SCENE_FRAMES.map((_, i) => SCENE_FRAMES.slice(0, i).reduce((a, b) => a + b, 0));
export const TOTAL_FRAMES = SCENE_FRAMES.reduce((a, b) => a + b, 0);

export const MUSIC_FILE = "music/vue_bed.mp3";
