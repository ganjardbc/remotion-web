// Setup Claude Code Tanpa Menebak. Reels 9:16, 30 fps. Alur scene: Hook, Konteks, Install, Pakai, Hasil, Cta.
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

export const SCENE_IDS = ["hook", "konteks", "install", "pakai", "hasil", "cta"] as const;
export type SceneId = (typeof SCENE_IDS)[number];

export const SPOKEN: Readonly<Record<SceneId, string>> = {
  hook: "Setup Claude Code-mu masih nebak-nebak? Ada plugin resmi yang membaca proyekmu dulu, baru kasih saran.",
  konteks: "Namanya Claude Code Setup. Cuma membaca, tidak mengubah satu file pun.",
  install: "Pasang lewat satu perintah, di Claude Code.",
  pakai: "Lalu minta Claude merekomendasikan otomasi untuk proyekmu.",
  hasil: "Hasilnya satu sampai dua pilihan per kategori: MCP, skill, hook, subagent, dan slash command.",
  cta: "Follow kalau mau aku bahas cara memilih hook yang benar-benar terpakai.",
};

// Voiceover memakai eleven_v4 dengan tag emosi per kalimat supaya intonasi mengikuti naskah (multilingual_v2 terdengar datar).
// eleven_v4 mengabaikan speed. VO_TEXT = teks yang dikirim ke TTS; SPOKEN tetap teks caption dan cue.
export const VO_SETTINGS = { model: "eleven_v4", speed: null } as const;
export const VO_TEXT: Readonly<Record<SceneId, string>> = {
  hook: "[curious] Setup Claude Code-mu masih nebak-nebak? [excited] Ada plugin resmi yang membaca proyekmu dulu, baru kasih saran.",
  konteks: "[warm] Namanya Claude Code Setup. [reassuring] Cuma membaca, tidak mengubah satu file pun.",
  install: "[confident] Pasang lewat satu perintah, di Claude Code.",
  pakai: "[casual] Lalu minta Claude merekomendasikan otomasi untuk proyekmu.",
  hasil: "[enthusiastic] Hasilnya satu sampai dua pilihan per kategori: MCP, skill, hook, subagent, dan slash command.",
  cta: "[friendly] Follow kalau mau aku bahas cara memilih hook yang benar-benar terpakai.",
};

// Waktu tiap kata SPOKEN (detik sejak klip suara mulai), dari timestamp kata ElevenLabs scribe pada klip olahan.
// Dipakai caption karaoke dan at(). Ukur ulang kalau SPOKEN atau klip suara berubah.
export const WORDS: Readonly<Record<SceneId, readonly (readonly [string, number])[]>> = {
  hook: [["Setup", 0.12], ["Claude", 0.48], ["Code-mu", 0.78], ["masih", 1.38], ["nebak-nebak?", 1.66], ["Ada", 2.78], ["plugin", 3.02], ["resmi", 3.36], ["yang", 3.82], ["membaca", 3.94], ["proyekmu", 4.36], ["dulu,", 4.84], ["baru", 5.48], ["kasih", 5.88], ["saran.", 6.16]],
  konteks: [["Namanya", 0.1], ["Claude", 0.86], ["Code", 1.3], ["Setup.", 1.62], ["Cuma", 2.46], ["membaca,", 2.74], ["tidak", 3.76], ["mengubah", 4.02], ["satu", 4.46], ["file", 4.76], ["pun.", 5.1]],
  install: [["Pasang", 0.06], ["lewat", 0.46], ["satu", 0.82], ["perintah,", 1.18], ["di", 1.98], ["Claude", 2.12], ["Code.", 2.46]],
  pakai: [["Lalu", 0.1], ["minta", 0.58], ["Claude", 0.94], ["merekomendasikan", 1.28], ["otomasi", 2.18], ["untuk", 2.8], ["proyekmu.", 3.04]],
  hasil: [["Hasilnya", 0.08], ["satu", 0.74], ["sampai", 1.16], ["dua", 1.5], ["pilihan", 1.88], ["per", 2.32], ["kategori:", 2.48], ["MCP,", 3.56], ["skill,", 4.5], ["hook,", 5.34], ["subagent,", 5.92], ["dan", 6.82], ["slash", 7.08], ["command.", 7.48]],
  cta: [["Follow", 0.14], ["kalau", 0.76], ["mau", 1.04], ["aku", 1.28], ["bahas", 1.5], ["cara", 1.94], ["memilih", 2.24], ["hook", 2.68], ["yang", 2.98], ["benar-benar", 3.26], ["terpakai.", 4.02]],
};

export const CAPTION = "Jangan setup Claude Code sambil menebak. Plugin resmi claude-code-setup membaca proyekmu dulu, lalu merekomendasikan MCP, skill, hook, subagent, dan slash command yang cocok. Sumber: https://github.com/anthropics/claude-plugins-official/tree/main/plugins/claude-code-setup";
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

export const INSTALL_CMD = "/plugin install claude-code-setup@claude-plugins-official";
export const PROMPT_TEXT = "recommend automations for this project";

export const MUSIC_FILE = "music/vue_bed.mp3";
