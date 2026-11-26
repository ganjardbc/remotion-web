// Tulisan AI Yang Terdengar Manusia. Reels 9:16, 30 fps. Alur scene: Hook, Relate, Shift, Urgency, Install, Pakai, Hasil, Closing, Cta.
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

export const SCENE_IDS = ["hook", "relate", "shift", "urgency", "install", "pakai", "hasil", "closing", "cta"] as const;
export type SceneId = (typeof SCENE_IDS)[number];

export const SPOKEN: Readonly<Record<SceneId, string>> = {
  hook: "Editor Wikipedia punya daftar tanda tulisan Ei Ai, dan skill Hiuman Aizer memakainya untuk membersihkan tulisanmu.",
  relate: "Kamu minta Ei Ai menulis postingan, hasilnya rapi, tapi penuh kalimat klise seperti bukan sekadar fitur, dan pembaca langsung sadar.",
  shift: "Hiuman Aizer mengecek dua puluh enam pola dari panduan itu, lalu menulis ulang kalimatnya tanpa mengubah isinya.",
  urgency: "Dan memasangnya cuma dua perintah, lalu kamu bisa langsung mencobanya di tulisanmu sendiri.",
  install: "Di Claude Code, jalankan plugin marketplace add blader Hiuman Aizer, lalu plugin install, selesai.",
  pakai: "Ketik slash Hiuman Aizer lalu tempel tulisanmu, atau sebut nama file-nya, dan kasih contoh tulisanmu supaya hasilnya mirip gayamu.",
  hasil: "Kalimatnya jadi lebih pendek dan spesifik, tanpa penutup dramatis, dan isinya tetap sama, tapi ini untuk pembaca, bukan untuk mengakali detektor.",
  closing: "Tulisan yang enak dibaca bukan yang lolos detektor, tapi yang terdengar seperti kamu.",
  cta: "Follow kalau kamu mau tahu skill Ei Ai lainnya yang bikin tulisan dan kerja developer lebih rapi.",
};

// Voiceover: eleven_v4 (bawaan Reels baru; mengabaikan speed). Tag emosi Inggris di depan teks TTS membuat intonasi mengikuti isi
// scene, jadi suara tidak datar. VO_TEXT = teks yang dikirim ke TTS (SPOKEN tetap teks subtitle dan cue); di sini tiap scene diberi satu
// tag dari VO_TAGS. Untuk kalimat penting, tulis VO_TEXT per scene dengan tag per kalimat: "[curious] Kalimat satu. [serious] Kalimat dua."
// Mengubah model atau teks TTS mengubah hash klip, jadi putuskan sebelum generate semua.
export const VO_SETTINGS = { model: "eleven_v4", speed: null } as const;
const VO_TAGS: Readonly<Partial<Record<string, string>>> = { hook: "[serious]", relate: "[thoughtful]", shift: "[confident]", urgency: "[intrigued]", install: "[calm]", pakai: "[calm]", hasil: "[confident]", closing: "[calm]", cta: "[friendly]" };
export const VO_TEXT: Readonly<Record<SceneId, string>> = Object.fromEntries(SCENE_IDS.map((id) => [id, `${VO_TAGS[id] ?? "[confident]"} ${SPOKEN[id]}`])) as Record<SceneId, string>;

// Waktu tiap kata SPOKEN (detik sejak klip suara mulai) untuk subtitle `SubtitleBand`. Kosong = pakai estimateWords() di bawah;
// diisi dari audio asli oleh `node scripts/vo-words.mjs --video Humanizer` setelah voiceover jadi.
export const WORDS: Readonly<Record<SceneId, readonly (readonly [string, number])[]>> = {
  hook: [["Editor", 0.08], ["Wikipedia", 0.46], ["punya", 1.22], ["daftar", 1.54], ["tanda", 2.04], ["tulisan", 2.3], ["Ei", 2.84], ["Ai,", 3.78], ["dan", 3.78], ["skill", 4.04], ["Hiuman", 4.42], ["Aizer", 4.42], ["memakainya", 5.36], ["untuk", 6.1], ["membersihkan", 6.36], ["tulisanmu.", 7.14]],
  relate: [["Kamu", 0.08], ["minta", 0.4], ["Ei", 0.78], ["Ai", 1.18], ["menulis", 1.18], ["postingan,", 1.6], ["hasilnya", 2.72], ["rapi,", 3.22], ["tapi", 4.22], ["penuh", 4.64], ["kalimat", 4.92], ["klise", 5.36], ["seperti", 5.92], ["bukan", 6.7], ["sekadar", 7], ["fitur,", 7.46], ["dan", 8.48], ["pembaca", 8.64], ["langsung", 9.22], ["sadar.", 9.56]],
  shift: [["Hiuman", 0.08], ["Aizer", 0.08], ["mengecek", 0.96], ["dua", 2.28], ["puluh", 2.28], ["enam", 2.84], ["pola", 2.84], ["dari", 3.28], ["panduan", 3.98], ["itu,", 4.44], ["lalu", 4.88], ["menulis", 5.16], ["ulang", 5.16], ["kalimatnya", 5.92], ["tanpa", 6.38], ["mengubah", 6.78], ["isinya.", 6.78]],
  urgency: [["Dan", 0.1], ["memasangnya", 0.3], ["cuma", 1.06], ["dua", 1.3], ["perintah,", 1.52], ["lalu", 2.64], ["kamu", 3.12], ["bisa", 3.34], ["langsung", 3.58], ["mencobanya", 3.88], ["di", 4.48], ["tulisanmu", 4.6], ["sendiri.", 5.06]],
  install: [["Di", 0.1], ["Claude", 0.26], ["Code,", 0.6], ["jalankan", 1.36], ["plugin", 1.9], ["marketplace", 2.3], ["add", 3.16], ["blader", 3.38], ["Hiuman", 3.86], ["Aizer,", 3.86], ["lalu", 5.2], ["plugin", 5.7], ["install,", 6.08], ["selesai.", 6.96]],
  pakai: [["Ketik", 0.06], ["slash", 0.58], ["Hiuman", 1.12], ["Aizer", 1.12], ["lalu", 2.42], ["tempel", 2.74], ["tulisanmu,", 3.18], ["atau", 4.3], ["sebut", 4.78], ["nama", 5.06], ["file-nya,", 5.34], ["dan", 6.28], ["kasih", 6.48], ["contoh", 6.78], ["tulisanmu", 7.1], ["supaya", 7.9], ["hasilnya", 8.3], ["mirip", 8.9], ["gayamu.", 9.32]],
  hasil: [["Kalimatnya", 0.06], ["jadi", 0.74], ["lebih", 0.94], ["pendek", 1.26], ["dan", 1.72], ["spesifik,", 1.92], ["tanpa", 2.94], ["penutup", 3.36], ["dramatis,", 3.74], ["dan", 4.66], ["isinya", 4.88], ["tetap", 5.32], ["sama,", 5.62], ["tapi", 6.44], ["ini", 6.96], ["untuk", 7.16], ["pembaca,", 7.38], ["bukan", 8.3], ["untuk", 8.74], ["mengakali", 8.94], ["detektor.", 9.42]],
  closing: [["Tulisan", 0.06], ["yang", 0.56], ["enak", 0.72], ["dibaca", 0.96], ["bukan", 1.84], ["yang", 2.14], ["lolos", 2.28], ["detektor,", 2.58], ["tapi", 3.78], ["yang", 4.54], ["terdengar", 4.72], ["seperti", 5.34], ["kamu.", 5.74]],
  cta: [["Follow", 0.14], ["kalau", 0.7], ["kamu", 0.94], ["mau", 1.2], ["tahu", 1.42], ["skill", 1.74], ["Ei", 2.08], ["Ai", 2.44], ["lainnya", 2.44], ["yang", 3.04], ["bikin", 3.2], ["tulisan", 3.5], ["dan", 4.12], ["kerja", 4.34], ["developer", 4.68], ["lebih", 5.28], ["rapi.", 5.66]],
};

// Posisi dan mode karakter narator per scene: `x` titik tengah (0-1), `mode` normal | small | hidden (lihat reelsLayout.ts,
// "Tata letak narator aman platform"). Mode menentukan tinggi karakter, tinggi area konten, dan posisi subtitle scene itu:
// konten banyak -> small (karakter kecil) atau hidden (tanpa karakter). Sesuaikan per storyboard.
export const NARRATOR: Readonly<Record<SceneId, { readonly x: number; readonly mode: NarratorMode }>> = {
  hook: { x: 0.5, mode: "normal" },
  relate: { x: 0.3, mode: "hidden" },
  shift: { x: 0.7, mode: "normal" },
  urgency: { x: 0.3, mode: "hidden" },
  install: { x: 0.3, mode: "normal" },
  pakai: { x: 0.7, mode: "hidden" },
  hasil: { x: 0.7, mode: "normal" },
  closing: { x: 0.3, mode: "hidden" },
  cta: { x: 0.5, mode: "normal" },
};
// Latar per scene: "kantor" = kantor malam Reels block (scene dengan karakter); { flat } = latar `Backdrop` datar (scene hidden).
export const WORLD: Readonly<Record<SceneId, "kantor" | { readonly flat: "ground" | "dark" | "primary" }>> = {
  hook: "kantor",
  relate: { flat: "primary" },
  shift: "kantor",
  urgency: { flat: "dark" },
  install: "kantor",
  pakai: { flat: "ground" },
  hasil: "kantor",
  closing: { flat: "primary" },
  cta: "kantor",
};
export const SUBTITLE_Y: readonly number[] = SCENE_IDS.map((id) => NARRATOR_MODES[NARRATOR[id].mode].subtitleTop);

// Subtitle menampilkan ejaan asli, bukan ejaan fonetis SPOKEN yang hanya untuk suara. Contoh: { match: ["ei", "ai"], to: "AI" }
// (urutan kata fonetis huruf kecil -> pengganti). Kosong bila tidak ada singkatan fonetis.
export const DISPLAY_FIXES: readonly DisplayFix[] = [
  { match: ["ei", "ai"], to: "AI" },
  { match: ["hiuman", "aizer"], to: "Humanizer" },
];

export const CAPTION = "Tulisan AI punya tanda yang gampang dikenali. Humanizer mengecek 26 pola dari panduan Wikipedia lalu menulis ulang tanpa mengubah isi. Pasang dengan dua perintah di Claude Code. Sumber: github.com/blader/humanizer";
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
