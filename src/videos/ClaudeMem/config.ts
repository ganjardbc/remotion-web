// Claude Code-mu Pelupa Akut. Konten tuntas, satu video (reels 9:16, 30 fps). Topik: claude-mem (github.com/thedotmack/claude-mem, v15.8.3).
// Voiceover: ElevenLabs, suara Nilasari. Teks yang diucapkan ada di SPOKEN (angka dieja agar terbaca benar).
// Selama voiceover belum di-generate, durasi scene diperkirakan dari panjang teks (CHARS_PER_SEC); setelah ada
// voiceover.json, durasi mengikuti audio.
import manifest from "./voiceover.json";
import { VO_FILES } from "./voiceover-files";

export const FPS = 30;
// Jeda sebelum suara mulai di tiap scene, dan ekor setelah suara selesai.
export const LEAD = 6;
const TAIL = 0.45;
// Kecepatan bicara Nilasari, speed 1.2 (diukur dari Haiku55).
const CHARS_PER_SEC = 15.3;

export const SCENE_IDS = ["hook", "repo", "catat", "simpan", "ingat", "pasang", "closing", "cta"] as const;
export type SceneId = (typeof SCENE_IDS)[number];

export const SPOKEN: Readonly<Record<SceneId, string>> = {
  hook: "Claude Code kamu pintar, tapi pelupa. Tiap sesi baru, dia lupa semuanya, dan kamu mengulang dari awal.",
  repo: "Namanya Claude Mem. Kode terbuka, gratis dipakai, dan dibintangi lebih dari seratus ribu orang di GitHub.",
  catat: "Pertama, dia mencatat sendiri. Enam momen dalam satu sesi direkam, lalu diringkas jadi catatan pendek.",
  simpan: "Kedua, secara bawaan catatan disimpan di komputer kamu, bisa dicari lewat kata kunci atau arti.",
  ingat: "Ketiga, yang terpenting: dia tidak menumpahkan semua ingatan. Cari daftar ringkas dulu, baru buka detail yang perlu. Hemat token sekitar sepuluh kali lipat.",
  pasang: "Pasangnya mudah. Ketik dua perintah ini di Claude Code, lalu mulai ulang.",
  closing: "Ingatan yang bagus bukan yang menyimpan segalanya, tapi yang tahu kapan harus mengingat.",
  cta: "Cari Claude Mem di GitHub, linknya ada di layar. Follow untuk tools lain yang memperkuat Claude Code.",
};

export const REPO_URL = "github.com/thedotmack/claude-mem";

export const CAPTION = "Claude Code-mu lupa semuanya tiap sesi baru? Claude-Mem memberinya ingatan, dan hemat token sekitar 10x. Repo: https://github.com/thedotmack/claude-mem";
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
