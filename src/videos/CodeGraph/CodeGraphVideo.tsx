import type React from "react";
import { Audio } from "@remotion/media";
import { Easing, interpolate, Series, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { BrandFooter } from "../../BrandFooter";
import { Caption } from "../../desk-world";
import { ClaudeCode, CLAUDE_CODE_VIEWBOX, claudeCodeSize } from "../../assets/characters";
import { armGesture, surprise, type PlacedClip } from "../../assets/characters/robot/rig/clips";
import type { FaceKey } from "../../assets/characters/robot/rig/face";
import type { VideoComposition } from "../../compositions";
import { ThemeProvider } from "../../themes";
import { at, FPS, LEAD, MUSIC_FILE, SCENE_FRAMES, SCENE_IDS, SCENE_START, TOTAL_FRAMES, VO, WORDS, type SceneId } from "./config";
import { HookScene, RelateScene, HasilScene, ShiftScene, UrgencyScene, ClosingScene, CtaScene } from "./scenes";

export { TOTAL_FRAMES };

const SCENES: Readonly<Record<SceneId, React.FC>> = {
  hook: HookScene,
  relate: RelateScene,
  hasil: HasilScene,
  shift: ShiftScene,
  urgency: UrgencyScene,
  closing: ClosingScene,
  cta: CtaScene,
};

// Ekspresi Claude Code per scene: [detik sejak suara mulai, ekspresi].
const FACES: Readonly<Record<SceneId, readonly (readonly [number, FaceKey["expression"]])[]>> = {
  hook: [[0, "kesal"], [at("hook", "Malah"), "kaget"]],
  relate: [[0, "bingung"], [at("relate", "Pertanyaan yang sama"), "serius"]],
  hasil: [[0, "serius"], [at("hasil", "Tanpa CodeGraph:"), "bingung"]],
  shift: [[0, "mikir"], [at("shift", "Tool-nya jalan"), "serius"], [at("shift", "Hasilnya besar"), "bingung"]],
  urgency: [[0, "serius"]],
  closing: [[0, "netral"], [at("closing", "Jadi bukan vonis"), "senang"]],
  cta: [[0, "senang"]],
};

const sec = (s: number): number => s / FPS;
const FACE_KEYS: readonly FaceKey[] = SCENE_IDS.flatMap((id, i) =>
  FACES[id].map(([t, expression]) => ({ at: sec(SCENE_START[i] + LEAD) + t, expression })),
);

const sceneFrame = (id: SceneId, phrase: string): number => SCENE_START[SCENE_IDS.indexOf(id)] + LEAD + Math.round(at(id, phrase) * FPS);

const CLIPS: readonly PlacedClip[] = [
  { clip: surprise, start: sceneFrame("hook", "Malah"), dur: 24 },
  { clip: armGesture("R", 60, 70, 0), start: sceneFrame("hasil", "Pakai CodeGraph"), dur: 60 },
  { clip: armGesture("L", 60, 70, 0), start: sceneFrame("hasil", "Tanpa CodeGraph:"), dur: 60 },
];

// Kaki karakter menapak di atas pita caption (acuan: SeleraDesain).
const CHAR_FEET_Y = 1610;

// Pose per scene: x = titik tengah (0-1 lebar layar), h = tinggi karakter. Pindah 0,5 dtk ease-out di awal scene.
// Tengah (besar) untuk hook, urgency, dan CTA; kiri atau kanan (kecil) untuk scene padat.
const POSES: Readonly<Record<SceneId, { readonly x: number; readonly h: number }>> = {
  hook: { x: 0.5, h: 500 },
  relate: { x: 0.32, h: 440 },
  hasil: { x: 0.68, h: 440 },
  shift: { x: 0.32, h: 440 },
  urgency: { x: 0.5, h: 480 },
  closing: { x: 0.68, h: 440 },
  cta: { x: 0.5, h: 500 },
};
// Subtitle di bawah karakter, di atas BrandFooter (footer mulai y 1825).
const CAPTION_Y = 1660;
const POSE_EASE = Easing.bezier(0.2, 0.8, 0.2, 1);

const Character: React.FC = () => {
  const { width } = useVideoConfig();
  const frame = useCurrentFrame();
  const idx = Math.max(0, SCENE_START.filter((s) => frame >= s).length - 1);
  const prev = POSES[SCENE_IDS[Math.max(0, idx - 1)]];
  const cur = POSES[SCENE_IDS[idx]];
  const k = interpolate(frame - SCENE_START[idx], [0, 15], [0, 1], { extrapolateRight: "clamp", easing: POSE_EASE });
  const x = prev.x + (cur.x - prev.x) * k;
  const h = prev.h + (cur.h - prev.h) * k;
  const size = claudeCodeSize(h);
  return (
    <div style={{ position: "absolute", left: x * width - size.width / 2, top: CHAR_FEET_Y + CLAUDE_CODE_VIEWBOX.y * (h / CLAUDE_CODE_VIEWBOX.h) }}>
      <ClaudeCode height={h} face={FACE_KEYS} clips={CLIPS} />
    </div>
  );
};

const MUSIC_VOLUME = 0.07;

const Sound: React.FC = () => (
  <>
    {SCENE_IDS.map((id, i) => {
      const file = VO[id].file;
      return file ? <Audio key={id} src={file} from={SCENE_START[i] + LEAD} volume={1} /> : null;
    })}
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

// Reels 9:16: panel penjelasan di atas, Claude Code sebagai narator di bawah, BrandFooter sekali di root.
export const CodeGraphVideo: React.FC<Props> = ({ theme }) => {
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
      <Caption sceneStarts={SCENE_START} words={SCENE_IDS.map((id) => WORDS[id])} lead={LEAD} y={CAPTION_Y} />
      <BrandFooter theme={theme} handle="@ganjar_hadiatna" />
      <Sound />
    </ThemeProvider>
  );
};

export const COMPOSITION: VideoComposition = {
  id: "CodeGraph-Reels",
  component: CodeGraphVideo,
  durationInFrames: TOTAL_FRAMES,
  fps: 30,
  width: 1080,
  height: 1920,
  defaultProps: { theme: "gh" },
};
