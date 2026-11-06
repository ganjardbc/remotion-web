import type React from "react";
import { Audio } from "@remotion/media";
import { Easing, interpolate, Series, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { BrandFooter } from "../../BrandFooter";
import { ClaudeCode, CLAUDE_CODE_VIEWBOX, claudeCodeSize } from "../../assets/characters";
import type { PlacedClip } from "../../assets/characters/robot/rig/clips";
import type { FaceKey } from "../../assets/characters/robot/rig/face";
import type { VideoComposition } from "../../compositions";
import { ThemeProvider } from "../../themes";
import { FPS, LEAD, MUSIC_FILE, SCENE_FRAMES, SCENE_IDS, SCENE_START, TOTAL_FRAMES, VO, type SceneId } from "./config";
import { HookScene, KonteksScene, InstallScene, PakaiScene, HasilScene, CtaScene } from "./scenes";

export { TOTAL_FRAMES };

const SCENES: Readonly<Record<SceneId, React.FC>> = {
  hook: HookScene,
  konteks: KonteksScene,
  install: InstallScene,
  pakai: PakaiScene,
  hasil: HasilScene,
  cta: CtaScene,
};

// Ekspresi Claude Code per scene: [detik sejak suara mulai, ekspresi]. Tambah entri dengan at("<id>", "frasa").
const FACES: Readonly<Record<SceneId, readonly (readonly [number, FaceKey["expression"]])[]>> = {
  hook: [[0, "netral"]],
  konteks: [[0, "netral"]],
  install: [[0, "netral"]],
  pakai: [[0, "netral"]],
  hasil: [[0, "netral"]],
  cta: [[0, "netral"]],
};

const sec = (s: number): number => s / FPS;
const FACE_KEYS: readonly FaceKey[] = SCENE_IDS.flatMap((id, i) =>
  FACES[id].map(([t, expression]) => ({ at: sec(SCENE_START[i] + LEAD) + t, expression })),
);

// Gerakan sesaat karakter (mis. surprise) ditaruh di sini, lihat PromptPanjangVideo.tsx.
const CLIPS: readonly PlacedClip[] = [];

// Pose karakter per scene: posisi tengah horizontal (0..1 dari lebar) dan tinggi. Kaki tetap menapak di atas footer.
// Berpindah antar pose 0,5 dtk dengan ease-out di awal scene, tanpa pantulan.
const POSES: Readonly<Record<SceneId, { readonly x: number; readonly h: number }>> = {
  hook: { x: 0.5, h: 620 },
  konteks: { x: 0.68, h: 440 },
  install: { x: 0.32, h: 440 },
  pakai: { x: 0.5, h: 400 },
  hasil: { x: 0.68, h: 440 },
  cta: { x: 0.5, h: 660 },
};
const MOVE_FRAMES = 15;
const EASE = Easing.bezier(0.2, 0.8, 0.2, 1);
// Kaki karakter menapak di atas footer.
const CHAR_FEET_Y = 1730;

const Character: React.FC = () => {
  const { width } = useVideoConfig();
  const frame = useCurrentFrame();
  const i = SCENE_START.reduce((acc, start, idx) => (start <= frame ? idx : acc), 0);
  const to = POSES[SCENE_IDS[i]];
  const from = POSES[SCENE_IDS[Math.max(0, i - 1)]];
  const k = interpolate(frame - SCENE_START[i], [0, MOVE_FRAMES], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  const x = from.x + (to.x - from.x) * k;
  const height = from.h + (to.h - from.h) * k;
  const size = claudeCodeSize(height);
  return (
    <div style={{ position: "absolute", left: x * width - size.width / 2, top: CHAR_FEET_Y + CLAUDE_CODE_VIEWBOX.y * (height / CLAUDE_CODE_VIEWBOX.h) }}>
      <ClaudeCode height={height} face={FACE_KEYS} clips={CLIPS} />
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
export const ClaudeSetupVideo: React.FC<Props> = ({ theme }) => {
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
      <BrandFooter theme={theme} handle="@ganjar_hadiatna" />
      <Sound />
    </ThemeProvider>
  );
};

export const COMPOSITION: VideoComposition = {
  id: "ClaudeSetup-Reels",
  component: ClaudeSetupVideo,
  durationInFrames: TOTAL_FRAMES,
  fps: 30,
  width: 1080,
  height: 1920,
  defaultProps: { theme: "gh" },
};
