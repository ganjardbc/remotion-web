import type React from "react";
import { Audio } from "@remotion/media";
import { Easing, interpolate, Sequence, Series, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { BrandFooter } from "../../BrandFooter";
import { ClaudeCode, CLAUDE_CODE_VIEWBOX, claudeCodeSize } from "../../assets/characters";
import { armGesture, type Clip, type PlacedClip } from "../../assets/characters/robot/rig/clips";
import { envelope, kf } from "../../assets/characters/shared/motion";
import type { FaceKey } from "../../assets/characters/robot/rig/face";
import type { VideoComposition } from "../../compositions";
import { ThemeProvider } from "../../themes";
import { Caption } from "./parts";
import { at, FPS, LEAD, MUSIC_FILE, SCENE_FRAMES, SCENE_IDS, SCENE_START, TOTAL_FRAMES, VO, type SceneId } from "./config";
import { KATEGORI } from "./scenes";
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

// Ekspresi Claude Code per scene: [detik sejak suara mulai, ekspresi]. Bereaksi ke isi kalimat.
const FACES: Readonly<Record<SceneId, readonly (readonly [number, FaceKey["expression"]])[]>> = {
  hook: [[0, "bingung"], [at("hook", "Ada plugin resmi"), "kaget"], [at("hook", "membaca proyekmu"), "senang"]],
  konteks: [[0, "mikir"], [at("konteks", "Cuma membaca"), "serius"], [at("konteks", "tidak mengubah"), "senang"]],
  install: [[0, "serius"], [at("install", "di Claude Code"), "mikir"]],
  pakai: [[0, "mikir"], [at("pakai", "merekomendasikan"), "serius"], [at("pakai", "untuk proyekmu"), "senang"]],
  hasil: [[0, "senang"], [at("hasil", "hook"), "kaget"], [at("hasil", "slash"), "senang"]],
  cta: [[0, "senang"], [at("cta", "hook yang"), "mataTertutup"]],
};

const sec = (s: number): number => s / FPS;
const FACE_KEYS: readonly FaceKey[] = SCENE_IDS.flatMap((id, i) =>
  FACES[id].map(([t, expression]) => ({ at: sec(SCENE_START[i] + LEAD) + t, expression })),
);

// Injakan keyboard: kaki kiri dan kanan bergantian terangkat lalu menghentak turun (naik pelan, turun cepat), badan menekan saat mendarat.
const stomp =
  (dur: number): Clip =>
  (f) => {
    const amp = envelope(f, dur, 6);
    const L = kf(f % 10, [[0, 0], [3.5, 14], [5, 0], [10, 0]]);
    const R = kf((f + 5) % 10, [[0, 0], [3.5, 14], [5, 0], [10, 0]]);
    const dip = kf(f % 10, [[0, 0], [4, 0], [5, 4], [7, 0], [10, 0]]) + kf((f + 5) % 10, [[0, 0], [4, 0], [5, 4], [7, 0], [10, 0]]);
    return {
      body: { y: dip * amp, rot: (L - R) * 0.12 * amp },
      legL: { lift: L * amp },
      legR: { lift: R * amp },
      armL: 10 * amp,
      armR: 10 * amp,
    };
  };

const sceneFrame = (id: SceneId, seconds: number): number => SCENE_START[SCENE_IDS.indexOf(id)] + LEAD + Math.round(seconds * FPS);
const TYPE_FRAMES = Math.round(1.6 * FPS);
const INSTALL_TYPE = sceneFrame("install", at("install", "di Claude Code") - 0.4);
const PAKAI_TYPE = sceneFrame("pakai", at("pakai", "merekomendasikan") - 0.8);

// Gerakan sesaat karakter: injakan saat mengetik di scene install dan pakai, lengan menarik laci di scene hasil.
const CLIPS: readonly PlacedClip[] = [
  { clip: stomp(TYPE_FRAMES), start: INSTALL_TYPE, dur: TYPE_FRAMES },
  { clip: stomp(TYPE_FRAMES), start: PAKAI_TYPE, dur: TYPE_FRAMES },
  ...KATEGORI.map((k) => ({ clip: armGesture("L", 24, 50, 5), start: sceneFrame("hasil", at("hasil", k.phrase) - 0.1), dur: 24 })),
];

// Pose karakter per scene: posisi tengah horizontal (0..1 dari lebar) dan tinggi. Kaki tetap menapak di atas footer.
// Berpindah antar pose 0,5 dtk dengan ease-out di awal scene, tanpa pantulan.
const POSES: Readonly<Record<SceneId, { readonly x: number; readonly h: number; readonly y: number }>> = {
  hook: { x: 0.5, h: 540, y: 1640 },
  konteks: { x: 0.68, h: 440, y: 1640 },
  install: { x: 0.5, h: 440, y: 1485 },
  pakai: { x: 0.5, h: 440, y: 1485 },
  hasil: { x: 0.76, h: 400, y: 1640 },
  cta: { x: 0.5, h: 560, y: 1640 },
};
// Posisi atas caption per scene: di bawah kaki karakter, di tepi depan meja, di atas footer.
const CAPTION_Y: Readonly<Record<SceneId, number>> = { hook: 1655, konteks: 1655, install: 1655, pakai: 1655, hasil: 1655, cta: 1655 };
const MOVE_FRAMES = 15;
const EASE = Easing.bezier(0.2, 0.8, 0.2, 1);

const Character: React.FC = () => {
  const { width } = useVideoConfig();
  const frame = useCurrentFrame();
  const i = SCENE_START.reduce((acc, start, idx) => (start <= frame ? idx : acc), 0);
  const to = POSES[SCENE_IDS[i]];
  const from = POSES[SCENE_IDS[Math.max(0, i - 1)]];
  const k = interpolate(frame - SCENE_START[i], [0, MOVE_FRAMES], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  const x = from.x + (to.x - from.x) * k;
  const height = from.h + (to.h - from.h) * k;
  const feet = from.y + (to.y - from.y) * k;
  const size = claudeCodeSize(height);
  return (
    <div style={{ position: "absolute", left: x * width - size.width / 2, top: feet + CLAUDE_CODE_VIEWBOX.y * (height / CLAUDE_CODE_VIEWBOX.h) }}>
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
    {[INSTALL_TYPE, PAKAI_TYPE].map((start) => (
      <Sequence key={`type-${start}`} from={start} durationInFrames={TYPE_FRAMES}>
        <Audio src={staticFile("sfx/synth/typing_bed.wav")} volume={0.5} />
      </Sequence>
    ))}
    {KATEGORI.map((k) => (
      <Audio key={k.phrase} src={staticFile("sfx/synth/pop_claude.wav")} from={sceneFrame("hasil", at("hasil", k.phrase))} volume={0.35} />
    ))}
    <Audio src={staticFile("sfx/synth/ding.wav")} from={sceneFrame("cta", at("cta", "hook yang") + 0.6)} volume={0.4} />
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
      <Caption y={CAPTION_Y} />
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
