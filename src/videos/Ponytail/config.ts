// Agen AI Yang Malas Justru Lebih Jago. Reels 9:16, 30 fps. Alur scene: Hook, Relate, Shift, Urgency, Cara, Case, Manfaat, Closing, Cta.
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

export const SCENE_IDS = ["hook", "relate", "shift", "urgency", "cara", "case", "manfaat", "closing", "cta"] as const;
export type SceneId = (typeof SCENE_IDS)[number];

export const SPOKEN: Readonly<Record<SceneId, string>> = {
  hook: "Dietrich Gebert bikin skill yang membuat agen Ei Ai malas, dan kodenya turun separuh.",
  relate: "Kamu minta fitur kecil, agen menulis ratusan baris, dan kamu yang capek mereview.",
  shift: "Poni Teil membuat agen berhenti di solusi pertama yang cukup, tanpa membuang validasi dan keamanan.",
  urgency: "Dan pasangnya cuma dua perintah, lalu kamu bisa langsung lihat bedanya di contoh nyata.",
  cara: "Di Claude Code, jalankan plugin marketplace add lalu plugin install, selesai.",
  case: "Minta date picker: tanpa skill 335 baris, dengan Poni Teil 10 baris, karena browser sudah punya kalendernya.",
  manfaat: "Di benchmark-nya kode turun 53 persen, waktu 41 persen, dan tes untuk logika berisiko naik dari 68 ke 98 persen.",
  closing: "Kode paling aman adalah yang tidak perlu ditulis, jadi agen terbaik tahu kapan berhenti.",
  cta: "Follow kalau kamu mau tahu info Ei Ai tools lainnya yang bikin kerja developer lebih ringan.",
};

// Voiceover: eleven_v4 (bawaan Reels baru; mengabaikan speed). Tag emosi Inggris di depan teks TTS membuat intonasi mengikuti isi
// scene, jadi suara tidak datar. VO_TEXT = teks yang dikirim ke TTS (SPOKEN tetap teks subtitle dan cue); di sini tiap scene diberi satu
// tag dari VO_TAGS. Untuk kalimat penting, tulis VO_TEXT per scene dengan tag per kalimat: "[curious] Kalimat satu. [serious] Kalimat dua."
// Mengubah model atau teks TTS mengubah hash klip, jadi putuskan sebelum generate semua.
export const VO_SETTINGS = { model: "eleven_v4", speed: null } as const;
const VO_TAGS: Readonly<Partial<Record<string, string>>> = { hook: "[serious]", relate: "[thoughtful]", shift: "[confident]", urgency: "[intrigued]", cara: "[calm]", case: "[intrigued]", manfaat: "[confident]", closing: "[calm]", cta: "[friendly]" };
export const VO_TEXT: Readonly<Record<SceneId, string>> = Object.fromEntries(SCENE_IDS.map((id) => [id, `${VO_TAGS[id] ?? "[confident]"} ${SPOKEN[id]}`])) as Record<SceneId, string>;

// Waktu tiap kata SPOKEN (detik sejak klip suara mulai) untuk subtitle `SubtitleBand`. Kosong = pakai estimateWords() di bawah;
// diisi dari audio asli oleh `node scripts/vo-words.mjs --video Ponytail` setelah voiceover jadi.
export const WORDS: Readonly<Record<SceneId, readonly (readonly [string, number])[]>> = {
  hook: [["Dietrich", 0.1], ["Gebert", 0.56], ["bikin", 1.12], ["skill", 1.52], ["yang", 1.92], ["membuat", 2.06], ["agen", 2.46], ["Ei", 2.82], ["Ai", 3.22], ["malas,", 3.22], ["dan", 4.22], ["kodenya", 4.4], ["turun", 4.96], ["separuh.", 5.34]],
  relate: [["Kamu", 0.08], ["minta", 0.38], ["fitur", 0.68], ["kecil,", 1.02], ["agen", 2.14], ["menulis", 2.5], ["ratusan", 2.9], ["baris,", 3.38], ["dan", 4.34], ["kamu", 4.64], ["yang", 5.1], ["capek", 5.28], ["mereview.", 5.58]],
  shift: [["Poni", 0.04], ["Teil", 0.04], ["membuat", 0.68], ["agen", 1.14], ["berhenti", 1.44], ["di", 2.06], ["solusi", 2.18], ["pertama", 2.56], ["yang", 2.96], ["cukup,", 3.16], ["tanpa", 3.94], ["membuang", 4.36], ["validasi", 4.78], ["dan", 5.48], ["keamanan.", 5.68]],
  urgency: [["Dan", 0.1], ["pasangnya", 0.34], ["cuma", 0.96], ["dua", 1.22], ["perintah,", 1.46], ["lalu", 2.6], ["kamu", 3.14], ["bisa", 3.4], ["langsung", 3.62], ["lihat", 3.96], ["bedanya", 4.22], ["di", 4.72], ["contoh", 4.84], ["nyata.", 5.14]],
  cara: [["Di", 0.1], ["Claude", 0.26], ["Code,", 0.26], ["jalankan", 1.34], ["plugin", 1.88], ["marketplace", 2.24], ["add", 2.96], ["lalu", 3.5], ["plugin", 4.04], ["install,", 4.42], ["selesai.", 5.32]],
  case: [["Minta", 0.08], ["date", 0.4], ["picker:", 0.64], ["tanpa", 1.54], ["skill", 1.94], ["335", 2.32], ["baris,", 2.32], ["dengan", 2.56], ["Poni", 3.14], ["Teil", 3.34], ["10", 3.62], ["baris,", 3.62], ["karena", 4.44], ["browser", 4.74], ["sudah", 5.36], ["punya", 5.36], ["kalendernya.", 5.74]],
  manfaat: [["Di", 0.1], ["benchmark-nya", 0.22], ["kode", 1.12], ["turun", 1.44], ["53", 1.94], ["persen,", 2.46], ["waktu", 3.36], ["41", 4.08], ["persen,", 4.7], ["dan", 5.58], ["tes", 5.86], ["untuk", 6.08], ["logika", 6.32], ["berisiko", 6.82], ["naik", 7.36], ["dari", 7.8], ["68", 8.34], ["ke", 9.2], ["98", 9.52], ["persen.", 10.3]],
  closing: [["Kode", 0.08], ["paling", 0.44], ["aman", 0.82], ["adalah", 1.36], ["yang", 1.78], ["tidak", 2.06], ["perlu", 2.46], ["ditulis,", 2.74], ["jadi", 3.8], ["agen", 4.56], ["terbaik", 4.82], ["tahu", 5.4], ["kapan", 5.76], ["berhenti.", 6.04]],
  cta: [["Follow", 0.12], ["kalau", 0.74], ["kamu", 0.98], ["mau", 1.24], ["tahu", 1.46], ["info", 1.72], ["Ei", 2.08], ["Ai", 2.38], ["tools", 2.38], ["lainnya", 2.66], ["yang", 3.26], ["bikin", 3.46], ["kerja", 3.76], ["developer", 4.08], ["lebih", 4.64], ["ringan.", 4.9]],
};

// Posisi dan mode karakter narator per scene: `x` titik tengah (0-1), `mode` normal | small | hidden (lihat reelsLayout.ts,
// "Tata letak narator aman platform"). Mode menentukan tinggi karakter, tinggi area konten, dan posisi subtitle scene itu:
// konten banyak -> small (karakter kecil) atau hidden (tanpa karakter). Sesuaikan per storyboard.
export const NARRATOR: Readonly<Record<SceneId, { readonly x: number; readonly mode: NarratorMode }>> = {
  hook: { x: 0.5, mode: "normal" },
  relate: { x: 0.3, mode: "hidden" },
  shift: { x: 0.7, mode: "normal" },
  urgency: { x: 0.3, mode: "hidden" },
  cara: { x: 0.3, mode: "normal" },
  case: { x: 0.7, mode: "hidden" },
  manfaat: { x: 0.7, mode: "normal" },
  closing: { x: 0.3, mode: "hidden" },
  cta: { x: 0.5, mode: "normal" },
};
// Latar per scene. "kantor" = kantor malam dari Reels block, dipakai di scene yang ada karakternya; "datar" = latar `Backdrop` biasa
// (ground, dark, primary) di scene tanpa karakter (mode hidden), supaya scene berselang-seling antara dunia kantor dan panel datar.
export const WORLD: Readonly<Record<SceneId, "kantor" | { readonly flat: "ground" | "dark" | "primary" }>> = {
  hook: "kantor",
  relate: { flat: "primary" },
  shift: "kantor",
  urgency: { flat: "dark" },
  cara: "kantor",
  case: { flat: "ground" },
  manfaat: "kantor",
  closing: { flat: "primary" },
  cta: "kantor",
};
export const SUBTITLE_Y: readonly number[] = SCENE_IDS.map((id) => NARRATOR_MODES[NARRATOR[id].mode].subtitleTop);

// Subtitle menampilkan ejaan asli, bukan ejaan fonetis SPOKEN yang hanya untuk suara. Contoh: { match: ["ei", "ai"], to: "AI" }
// (urutan kata fonetis huruf kecil -> pengganti). Kosong bila tidak ada singkatan fonetis.
export const DISPLAY_FIXES: readonly DisplayFix[] = [
  { match: ["ei", "ai"], to: "AI" },
  { match: ["poni", "teil"], to: "Ponytail" },
];

export const CAPTION = "Agen AI biasanya rajin menulis kode. Ponytail bikin dia malas dulu: cek yang sudah ada, baru tulis. Menurut benchmark repo-nya, kode turun 53% dan tes untuk logika berisiko naik. Sumber: github.com/DietrichGebert/ponytail";
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
