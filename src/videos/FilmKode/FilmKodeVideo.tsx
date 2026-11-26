import type React from "react";
import { Audio } from "@remotion/media";
import { Easing, interpolate, Series, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { BrandFooter } from "../../BrandFooter";
import { displayWords, SubtitleBand } from "../../desk-world";
import { ClaudeCodeBlock, claudeCodeBlockSize } from "../../assets/characters";
import type { GestureKey } from "../../assets/characters/shared/gestures";
import { characterFilter } from "../../assets/backdrops";
import type { FaceKey } from "../../assets/characters/robot/rig/face";
import type { VideoComposition } from "../../compositions";
import { NARRATOR_FEET_Y, NARRATOR_MODES } from "../../reelsLayout";
import { ThemeProvider } from "../../themes";
import { at, DISPLAY_FIXES, estimateWords, FPS, LEAD, MUSIC_FILE, NARRATOR, SCENE_FRAMES, SCENE_IDS, SCENE_START, SUBTITLE_Y, TOTAL_FRAMES, VO, WORDS, type SceneId } from "./config";
import { HookScene, RelateScene, ShiftScene, UrgencyScene, InstallScene, PakaiScene, ClosingScene, CtaScene } from "./scenes";

export { TOTAL_FRAMES };

const SCENES: Readonly<Record<SceneId, React.FC>> = {
  hook: HookScene,
  relate: RelateScene,
  shift: ShiftScene,
  urgency: UrgencyScene,
  install: InstallScene,
  pakai: PakaiScene,
  closing: ClosingScene,
  cta: CtaScene,
};

// Ekspresi Claude Code per scene: [detik sejak suara mulai, ekspresi]. Tambah entri dengan at("<id>", "frasa").
const FACES: Readonly<Record<SceneId, readonly (readonly [number, FaceKey["expression"]])[]>> = {
  hook: [[0, "serius"], [at("hook", "tanpa"), "kaget"]],
  relate: [[0, "bingung"]],
  shift: [[0, "mikir"], [at("shift", "jadi"), "senang"]],
  urgency: [[0, "mikir"]],
  install: [[0, "serius"]],
  pakai: [[0, "senang"]],
  closing: [[0, "serius"]],
  cta: [[0, "senang"]],
};

const sec = (s: number): number => s / FPS;
const FACE_KEYS: readonly FaceKey[] = SCENE_IDS.flatMap((id, i) =>
  FACES[id].map(([t, expression]) => ({ at: sec(SCENE_START[i] + LEAD) + t, expression })),
);

// Kaki karakter menapak di NARRATOR_FEET_Y (di atas safeBottom, lihat reelsLayout.ts "Tata letak narator aman platform").
const POSE_EASE = Easing.bezier(0.2, 0.8, 0.2, 1);

// Arah hadap kubus per scene: [detik sejak suara mulai, arah]. "depan" menghadap kamera, "kanan" dan "kiri" memutar badan (rotateY) ke
// panel di sisi itu. Berpindah mulus 0,45 dtk; karakter di kiri layar biasanya menghadap kanan (ke konten), dan sebaliknya.
type Look = "depan" | "kanan" | "kiri";
const LOOK_YAW: Readonly<Record<Look, number>> = { depan: 10, kanan: 48, kiri: -48 };
const LOOKS: Readonly<Record<SceneId, readonly (readonly [number, Look])[]>> = {
  hook: [[0, "depan"], [at("hook", "dibuat"), "kiri"], [at("hook", "dari"), "depan"]],
  relate: [[0, "depan"]],
  shift: [[0, "kiri"], [at("shift", "jadi"), "depan"]],
  urgency: [[0, "depan"]],
  install: [[0, "kanan"], [at("install", "siapkan"), "depan"]],
  pakai: [[0, "depan"]],
  closing: [[0, "depan"]],
  cta: [[0, "depan"], [at("cta", "plugin"), "kiri"], [at("cta", "konten"), "depan"]],
};
const TURN = 0.45;
const LOOK_KEYS: readonly { readonly t: number; readonly yaw: number }[] = SCENE_IDS.flatMap((id, i) => LOOKS[id].map(([t, l]) => ({ t: sec(SCENE_START[i] + LEAD) + t, yaw: LOOK_YAW[l] })));
const yawAt = (now: number): number => {
  const i = LOOK_KEYS.filter((k) => now >= k.t).length - 1;
  if (i < 0) return LOOK_KEYS[0].yaw;
  const from = i > 0 ? LOOK_KEYS[i - 1].yaw : LOOK_KEYS[0].yaw;
  const k = interpolate(now, [LOOK_KEYS[i].t, LOOK_KEYS[i].t + TURN], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: POSE_EASE });
  return from + (LOOK_KEYS[i].yaw - from) * k;
};

// Gesture badan block per scene: [detik sejak suara mulai, nama gesture]. Nama dari GESTURES (shared/gestures).
const MOVES: Readonly<Record<SceneId, readonly (readonly [number, GestureKey["gesture"]])[]>> = {
  hook: [[at("hook", "dibuat"), "tunjuk"], [at("hook", "Lemomo"), "angkatTangan"]],
  relate: [],
  shift: [[at("shift", "menulis"), "mikir"], [at("shift", "jadi"), "sorak"]],
  urgency: [],
  install: [[at("install", "tambahkan"), "tunjuk"]],
  pakai: [],
  closing: [],
  cta: [[at("cta", "Follow"), "lambai"]],
};
const MOVE_KEYS: readonly GestureKey[] = SCENE_IDS.flatMap((id, i) => MOVES[id].map(([t, gesture]) => ({ at: sec(SCENE_START[i] + LEAD) + t, gesture })));


// Pose per scene dari NARRATOR (config.ts): x = titik tengah (0-1), tinggi dari mode (normal, small, hidden = 0).
const poseOf = (id: SceneId): { readonly x: number; readonly h: number } => ({ x: NARRATOR[id].x, h: NARRATOR_MODES[NARRATOR[id].mode].h });

const Character: React.FC = () => {
  const { width } = useVideoConfig();
  const frame = useCurrentFrame();
  const idx = Math.max(0, SCENE_START.filter((s) => frame >= s).length - 1);
  const prev = poseOf(SCENE_IDS[Math.max(0, idx - 1)]);
  const cur = poseOf(SCENE_IDS[idx]);
  const k = interpolate(frame - SCENE_START[idx], [0, 15], [0, 1], { extrapolateRight: "clamp", easing: POSE_EASE });
  const x = prev.x + (cur.x - prev.x) * k;
  const h = prev.h + (cur.h - prev.h) * k;
  if (h < 8) return null;
  // ClaudeCodeBlock (kubus 3D, sama dengan Reels dialog gaya block): kotak setinggi h, kaki di dasar kotak.
  const size = claudeCodeBlockSize(h);
  return (
    <div style={{ position: "absolute", left: x * width - size.width / 2, top: NARRATOR_FEET_Y - h, filter: characterFilter("malam") }}>
      <ClaudeCodeBlock height={h} face={FACE_KEYS} gestures={MOVE_KEYS} yaw={yawAt(frame / FPS)} />
    </div>
  );
};

// Efek suara per momen: [scene, frasa SPOKEN, nama berkas di public/sfx/synth, volume]. Waktu mengikuti at() (WORDS dari audio asli
// setelah vo-words). Hemat: ketukan tuts di perintah terminal, ding saat film jadi.
const SFX: readonly (readonly [SceneId, string, string, number])[] = [
  ["shift", "jadi", "ding", 0.35],
  ["install", "tambahkan", "key1", 0.4],
  ["install", "pasang", "key2", 0.4],
  ["pakai", "Ketik", "key3", 0.4],
];

const MUSIC_VOLUME = 0.07;

const Sound: React.FC = () => (
  <>
    {SCENE_IDS.map((id, i) => {
      const file = VO[id].file;
      return file ? <Audio key={id} src={file} from={SCENE_START[i] + LEAD} volume={1} /> : null;
    })}
    {SFX.map(([id, phrase, name, volume]) => (
      <Audio key={`${id}-${phrase}`} src={staticFile(`sfx/synth/${name}.wav`)} from={SCENE_START[SCENE_IDS.indexOf(id)] + LEAD + Math.round(at(id, phrase) * FPS)} volume={volume} />
    ))}
    {SCENE_START.map((start, i) => (
      <Audio key={`whoosh-${i}`} src={staticFile("sfx/synth/whoosh.wav")} from={start} volume={0.3} />
    ))}
    <Audio
      src={staticFile(MUSIC_FILE)}
      loop
      loopVolumeCurveBehavior="extend"
      volume={(f) => MUSIC_VOLUME * interpolate(f, [0, 45, TOTAL_FRAMES - 75, TOTAL_FRAMES], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
    />
  </>
);

type Props = { readonly theme: string };

// Reels 9:16: panel penjelasan di atas, Claude Code sebagai narator di bawah, subtitle dua baris di zona aman, BrandFooter sekali di root.
export const FilmKodeVideo: React.FC<Props> = ({ theme }) => {
  const { fps } = useVideoConfig();
  return (
    <ThemeProvider name={theme}>
      <Series>
        {SCENE_IDS.map((id, i) => {
          const Scene = SCENES[id];
          return (
            <Series.Sequence key={id} name={id} durationInFrames={SCENE_FRAMES[i]} premountFor={fps}>
              <Scene />
            </Series.Sequence>
          );
        })}
      </Series>
      <Character />
      <SubtitleBand sceneStarts={SCENE_START} words={SCENE_IDS.map((id) => displayWords(WORDS[id].length > 0 ? WORDS[id] : estimateWords(id), DISPLAY_FIXES))} lead={LEAD} y={SUBTITLE_Y} />
      <BrandFooter theme={theme} handle="@ganjar_hadiatna" />
      <Sound />
    </ThemeProvider>
  );
};

export const COMPOSITION: VideoComposition = {
  id: "FilmKode-Reels",
  component: FilmKodeVideo,
  durationInFrames: TOTAL_FRAMES,
  fps: 30,
  width: 1080,
  height: 1920,
  defaultProps: { theme: "gh" },
};
