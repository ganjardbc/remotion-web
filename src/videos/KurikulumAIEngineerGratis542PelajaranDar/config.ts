// Kurikulum AI Engineer Gratis (reels 9:16, 30 fps). Durasi scene mengikuti audio voiceover (voiceover.json),
// teks ucapan dari `spoken` di scenes.ts. Voiceover tidak diubah; waktu cue visual diperkirakan dari posisi frasa
// di dalam teks ucapan (proporsional terhadap durasi audio).
import { lineId, ttsText } from "../DraftKit";
import { BASE_SCENES } from "./scenes";
import { VO_MANIFEST } from "./voiceover";
import { VO_FILES } from "./voiceover-files";

export const FPS = 30;
// Jeda sebelum suara mulai di tiap scene, dan ekor setelah suara selesai.
export const LEAD = 9;
const TAIL = 0.6;

export const SCENE_IDS = ["hook", "repo", "kurikulum", "kuis", "cara", "proyek", "cta"] as const;
export type SceneId = (typeof SCENE_IDS)[number];

const DRAFT = Object.fromEntries(SCENE_IDS.map((id, i) => [id, BASE_SCENES[i]])) as Record<SceneId, (typeof BASE_SCENES)[number]>;

export const SPOKEN: Readonly<Record<SceneId, string>> = Object.fromEntries(SCENE_IDS.map((id) => [id, ttsText(DRAFT[id].lines[0])])) as Record<SceneId, string>;

export const VO: Readonly<Record<SceneId, { readonly file: string; readonly seconds: number }>> = Object.fromEntries(
  SCENE_IDS.map((id) => {
    const line = lineId(DRAFT[id].id, 0);
    return [id, { file: VO_FILES[line], seconds: VO_MANIFEST[line].duration }];
  }),
) as Record<SceneId, { file: string; seconds: number }>;

// Detik sejak suara mulai saat `phrase` diucapkan (perkiraan proporsional dari posisi frasa di teks ucapan).
export const when = (id: SceneId, phrase: string): number => {
  const text = SPOKEN[id];
  const i = text.indexOf(phrase);
  if (i < 0) throw new Error(`Frasa "${phrase}" tidak ada di ucapan scene ${id}`);
  return (i / text.length) * VO[id].seconds;
};

export const SCENE_FRAMES: readonly number[] = SCENE_IDS.map((id) => LEAD + Math.ceil((VO[id].seconds + TAIL) * FPS));
export const SCENE_START: readonly number[] = SCENE_FRAMES.map((_, i) => SCENE_FRAMES.slice(0, i).reduce((a, b) => a + b, 0));
export const TOTAL_FRAMES = SCENE_FRAMES.reduce((a, b) => a + b, 0);

export const MUSIC_FILE = "music/vue_bed.mp3";
