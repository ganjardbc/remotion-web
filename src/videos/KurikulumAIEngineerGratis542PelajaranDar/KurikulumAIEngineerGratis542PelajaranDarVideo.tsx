import type React from "react";
import { Audio } from "@remotion/media";
import { interpolate, Series, staticFile, useVideoConfig } from "remotion";
import { BrandFooter } from "../../BrandFooter";
import { ClaudeCode, CLAUDE_CODE_VIEWBOX, claudeCodeSize } from "../../assets/characters";
import { armGesture, surprise, type PlacedClip } from "../../assets/characters/robot/rig/clips";
import type { FaceKey } from "../../assets/characters/robot/rig/face";
import { ThemeProvider } from "../../themes";
import { FPS, LEAD, MUSIC_FILE, SCENE_FRAMES, SCENE_IDS, SCENE_START, TOTAL_FRAMES, VO, when, type SceneId } from "./config";
import { CaraScene, CtaScene, HookScene, KuisScene, KurikulumScene, ProyekScene, RepoScene } from "./visuals";

export const KURIKULUM_AIENGINEER_GRATIS542_PELAJARAN_DAR_FRAMES = TOTAL_FRAMES;

const SCENES: Readonly<Record<SceneId, React.FC>> = {
  hook: HookScene,
  repo: RepoScene,
  kurikulum: KurikulumScene,
  kuis: KuisScene,
  cara: CaraScene,
  proyek: ProyekScene,
  cta: CtaScene,
};

// Ekspresi Claude Code per scene: [detik sejak suara mulai, ekspresi].
const FACES: Readonly<Record<SceneId, readonly (readonly [number, FaceKey["expression"]])[]>> = {
  hook: [[0, "bingung"], [when("hook", "takut"), "kaget"], [when("hook", "Coba cek"), "senang"]],
  repo: [[0, "senang"]],
  kurikulum: [[0, "serius"], [when("kurikulum", "dua puluh fase"), "senang"]],
  kuis: [[0, "senang"]],
  cara: [[0, "netral"], [when("cara", "Pilih yang"), "senang"]],
  proyek: [[0, "senang"], [when("proyek", "Belajar tidak"), "serius"]],
  cta: [[0, "senang"]],
};

const sec = (s: number): number => s / FPS;
const FACE_KEYS: readonly FaceKey[] = SCENE_IDS.flatMap((id, i) =>
  FACES[id].map(([at, expression]) => ({ at: sec(SCENE_START[i] + LEAD) + at, expression })),
);

const CLIPS: readonly PlacedClip[] = [
  { clip: surprise, start: SCENE_START[0] + LEAD + Math.round(when("hook", "takut") * FPS), dur: 24 },
  { clip: armGesture("R", 60, 130, 14), start: SCENE_START[1] + LEAD, dur: 60 },
  { clip: armGesture("L", 60, 130, 14), start: SCENE_START[3] + LEAD + Math.round(when("kuis", "langsung tahu") * FPS), dur: 60 },
  { clip: armGesture("R", 60, 130, 14), start: SCENE_START[6] + LEAD, dur: 60 },
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

// Reels 9:16: panel penjelasan di atas, Claude Code sebagai narator di bawah, voiceover tetap dari draft.
export const KurikulumAIEngineerGratis542PelajaranDarVideo: React.FC<Props> = ({ theme }) => {
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
