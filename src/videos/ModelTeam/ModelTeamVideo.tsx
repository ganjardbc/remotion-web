import type React from "react";
import { Audio } from "@remotion/media";
import { interpolate, Series, staticFile, useVideoConfig } from "remotion";
import { BrandFooter } from "../../BrandFooter";
import { ClaudeCode, CLAUDE_CODE_VIEWBOX, claudeCodeSize } from "../../assets/characters";
import { armGesture, surprise, type PlacedClip } from "../../assets/characters/robot/rig/clips";
import type { FaceKey } from "../../assets/characters/robot/rig/face";
import { ThemeProvider } from "../../themes";
import { FPS, LEAD, MUSIC_FILE, SCENE_FRAMES, SCENE_IDS, SCENE_START, TOTAL_FRAMES, VO, type SceneId } from "./config";
import { ClosingScene, CtaScene, HaikuScene, HookScene, KeyScene, OpusScene, RelateScene, SonnetScene, TeamScene } from "./scenes";

export { TOTAL_FRAMES };

const SCENES: Readonly<Record<SceneId, React.FC>> = {
  hook: HookScene,
  relate: RelateScene,
  team: TeamScene,
  opus: OpusScene,
  sonnet: SonnetScene,
  haiku: HaikuScene,
  key: KeyScene,
  closing: ClosingScene,
  cta: CtaScene,
};

// Ekspresi Claude Code per scene: [detik sejak suara mulai, ekspresi].
const FACES: Readonly<Record<SceneId, readonly (readonly [number, FaceKey["expression"]])[]>> = {
  hook: [[0, "serius"], [3.0, "kesal"]],
  relate: [[0, "mikir"], [5.2, "netral"], [11.7, "bingung"]],
  team: [[0, "mikir"], [2.5, "senang"]],
  opus: [[0, "serius"], [4.4, "kaget"]],
  sonnet: [[0, "senang"]],
  haiku: [[0, "senang"], [1.6, "kaget"], [3.0, "senang"]],
  key: [[0, "serius"], [2.1, "mikir"], [6.5, "senang"]],
  closing: [[0, "netral"], [2.5, "senang"]],
  cta: [[0, "senang"]],
};

const sec = (s: number): number => s / FPS;
const FACE_KEYS: readonly FaceKey[] = SCENE_IDS.flatMap((id, i) =>
  FACES[id].map(([at, expression]) => ({ at: sec(SCENE_START[i] + LEAD) + at, expression })),
);

const CLIPS: readonly PlacedClip[] = [
  { clip: surprise, start: SCENE_START[3] + LEAD + Math.round(4.4 * FPS), dur: 24 },
  { clip: armGesture("R", 60, 130, 14), start: SCENE_START[8] + LEAD, dur: 60 },
];

const CHAR_HEIGHT = 620;
// Kaki karakter menapak di atas footer.
const CHAR_FEET_Y = 1730;

const Character: React.FC = () => {
  const { width } = useVideoConfig();
  const size = claudeCodeSize(CHAR_HEIGHT);
  return (
    <div style={{ position: "absolute", left: (width - size.width) / 2, top: CHAR_FEET_Y + CLAUDE_CODE_VIEWBOX.y * (CHAR_HEIGHT / CLAUDE_CODE_VIEWBOX.h) }}>
      <ClaudeCode height={CHAR_HEIGHT} face={FACE_KEYS} clips={CLIPS} />
    </div>
  );
};

const MUSIC_VOLUME = 0.07;

const Sound: React.FC = () => (
  <>
    {SCENE_IDS.map((id, i) => (
      <Audio key={id} src={VO[id].file} from={SCENE_START[i] + LEAD} volume={1} />
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

// Reels 9:16: tiga peran model di atas, Claude Code sebagai narator di bawah, voiceover Nilasari.
export const ModelTeamVideo: React.FC<Props> = ({ theme }) => {
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
