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

// Waktu tiap kata SPOKEN (detik sejak klip suara mulai), dari timestamp kata ElevenLabs scribe pada klip olahan.
// Dipakai caption karaoke dan at(). Ukur ulang kalau SPOKEN atau klip suara berubah.
export const WORDS: Readonly<Record<SceneId, readonly (readonly [string, number])[]>> = {
  hook: [["Setup", 0.08], ["Claude", 0.46], ["Code-mu", 0.7], ["masih", 1.06], ["nebak-nebak?", 1.28], ["Ada", 2.54], ["plugin", 2.76], ["resmi", 3.12], ["yang", 3.5], ["membaca", 3.66], ["proyekmu", 4.06], ["dulu,", 4.48], ["baru", 5.28], ["kasih", 5.52], ["saran.", 5.8]],
  konteks: [["Namanya", 0.08], ["Claude", 0.6], ["Code", 0.84], ["Setup.", 1.02], ["Cuma", 1.86], ["membaca,", 2.12], ["tidak", 3.04], ["mengubah", 3.26], ["satu", 3.56], ["file", 3.82], ["pun.", 4.1]],
  install: [["Pasang", 0.1], ["lewat", 0.46], ["satu", 0.66], ["perintah,", 0.88], ["di", 1.58], ["Claude", 1.68], ["Code.", 1.94]],
  pakai: [["Lalu", 0.08], ["minta", 0.36], ["Claude", 0.66], ["merekomendasikan", 0.9], ["otomasi", 1.76], ["untuk", 2.34], ["proyekmu.", 2.56]],
  hasil: [["Hasilnya", 0.06], ["satu", 0.52], ["sampai", 0.78], ["dua", 1.08], ["pilihan", 1.7], ["per", 2.1], ["kategori:", 2.22], ["MCP,", 3.22], ["skill,", 4.16], ["hook,", 4.98], ["subagent,", 5.58], ["dan", 6.56], ["slash", 6.78], ["command.", 7.06]],
  cta: [["Follow", 0.08], ["kalau", 0.86], ["mau", 1.08], ["aku", 1.3], ["bahas", 1.5], ["cara", 1.96], ["memilih", 2.18], ["hook", 2.6], ["yang", 2.84], ["benar-benar", 2.98], ["terpakai.", 3.5]],
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
