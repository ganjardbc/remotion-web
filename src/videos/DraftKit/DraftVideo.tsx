import type React from "react";
import { Audio } from "@remotion/media";
import { interpolate, Series, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { BrandFooter } from "../../BrandFooter";
import { ThemeProvider, useTheme } from "../../themes";
import { Enter } from "../OpenCode9Router/parts";
import { floorOf, Stage } from "./Stage";
import type { DraftMeta, DraftScene } from "./types";
import { sceneFrames } from "./voiceover";

// Reels 9:16 dari draft content_studio: tiap scene = latar dan pemeran (Stage), teks layar di atas, subtitle baris
// yang sedang diucapkan di bawah lantai, lalu footer, voice over, whoosh antar scene, dan musik latar.

export const FPS = 30;
export const MUSIC_FILE = "music/vue_bed.mp3";
const MUSIC_VOLUME = 0.07;
// Batas atas footer (BrandFooter tegak setinggi 128 px).
const FOOTER_TOP = 1792;

const OnScreenText: React.FC<{ readonly text: string }> = ({ text }) => {
  const t = useTheme();
  if (!text) return null;
  return (
    <div style={{ position: "absolute", left: 72, right: 72, top: 150, display: "flex", justifyContent: "center" }}>
      <Enter
        name="Teks layar"
        delay={4}
        y={40}
        style={{
          padding: "28px 44px",
          borderRadius: t.radius.large,
          backgroundColor: t.colors.surface,
          boxShadow: t.shadows.md,
          textAlign: "center",
          textWrap: "balance",
          fontFamily: t.fonts.heading,
          fontWeight: t.type.headlineWeight,
          fontSize: Math.round(68 * t.type.scale),
          lineHeight: 1.15,
          letterSpacing: `${t.type.tracking}em`,
          textTransform: t.type.headlineTransform,
          color: t.colors.ink,
        }}
      >
        {text}
      </Enter>
    </div>
  );
};

const Subtitle: React.FC<{ readonly scene: DraftScene }> = ({ scene }) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const now = frame / fps;
  const line = scene.lines.find((l) => now >= l.from && now < l.from + l.dur);
  if (!line) return null;
  const local = now - line.from;
  const opacity = interpolate(local, [0, 0.15, line.dur - 0.15, line.dur], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const top = floorOf(scene) + 40;
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top, bottom: 1920 - FOOTER_TOP, display: "flex", alignItems: "center", justifyContent: "center", opacity }}>
      <div
        style={{
          padding: "18px 32px",
          borderRadius: t.radius.card,
          backgroundColor: t.code.bg,
          border: `2px solid ${t.code.line}`,
          color: t.code.text,
          fontFamily: t.fonts.body,
          fontWeight: 600,
          fontSize: 44,
          lineHeight: 1.3,
          textAlign: "center",
          textWrap: "balance",
        }}
      >
        {line.text}
      </div>
    </div>
  );
};

const Sound: React.FC<{ readonly scenes: readonly DraftScene[]; readonly starts: readonly number[]; readonly total: number }> = ({ scenes, starts, total }) => (
  <>
    {scenes.flatMap((s, i) =>
      s.lines.flatMap((l) => (l.vo ? [<Audio key={l.id} src={l.vo} from={starts[i] + Math.round(l.from * FPS)} volume={1} />] : [])),
    )}
    {starts.map((start, i) => (
      <Audio key={`whoosh-${i}`} src={staticFile("sfx/synth/whoosh.wav")} from={start} volume={0.3} />
    ))}
    <Audio
      src={staticFile(MUSIC_FILE)}
      loop
      loopVolumeCurveBehavior="extend"
      volume={(f) => MUSIC_VOLUME * interpolate(f, [0, 45, total - 75, total], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
    />
  </>
);

export const totalFrames = (scenes: readonly DraftScene[]): number => sceneFrames(scenes, FPS).reduce((a, b) => a + b, 0);

export const DraftVideo: React.FC<{ readonly theme: string; readonly meta: DraftMeta; readonly scenes: readonly DraftScene[] }> = ({ theme, meta, scenes }) => {
  const frames = sceneFrames(scenes, FPS);
  const starts = frames.map((_, i) => frames.slice(0, i).reduce((a, b) => a + b, 0));
  return (
    <ThemeProvider name={theme}>
      <Series>
        {scenes.map((s, i) => (
          <Series.Sequence key={s.id} name={s.id} durationInFrames={frames[i]} premountFor={FPS}>
            <Stage scene={s} style={meta.style} />
            <OnScreenText text={s.onScreenText} />
            <Subtitle scene={s} />
          </Series.Sequence>
        ))}
      </Series>
      <BrandFooter theme={theme} handle="@ganjar_hadiatna" />
      <Sound scenes={scenes} starts={starts} total={totalFrames(scenes)} />
    </ThemeProvider>
  );
};
