import type React from "react";
import { interpolate, useVideoConfig } from "remotion";
import { Backdrop } from "../../Backdrop";
import { useTheme } from "../../themes";
import { Enter } from "../OpenCode9Router/parts";
import { Content } from "../OpenCode9Router/scene";

// Seconds → frames at the composition fps.
export const useSec = (): ((seconds: number) => number) => {
  const { fps } = useVideoConfig();
  return (seconds) => Math.round(seconds * fps);
};

// 0 → 1 over [startSec, startSec + durSec], clamped.
export const useProgress = (
  frame: number,
  startSec: number,
  durSec: number,
): number => {
  const { fps } = useVideoConfig();
  return interpolate(
    frame,
    [startSec * fps, (startSec + durSec) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
};

export const Stage: React.FC<{
  readonly label: string;
  readonly sweep?: boolean;
  readonly gap?: number;
  readonly children: React.ReactNode;
}> = ({ label, sweep, gap = 48, children }) => (
  <>
    <Backdrop variant="ground" label={label} sweep={sweep} />
    <Content gap={gap}>{children}</Content>
  </>
);

// Small mono scene title, sits above the scene's main visual.
export const Overline: React.FC<{
  readonly delay: number;
  readonly children: React.ReactNode;
}> = ({ delay, children }) => {
  const t = useTheme();
  return (
    <Enter
      name="Title"
      delay={delay}
      y={30}
      style={{
        textAlign: "center",
        textWrap: "balance",
        fontFamily: t.fonts.mono,
        fontSize: 48,
        lineHeight: 1.25,
        letterSpacing: "0.02em",
        color: t.colors.groundTextMuted,
      }}
    >
      {children}
    </Enter>
  );
};

// Large headline style shared by the scenes.
export const headlineStyle = (
  t: ReturnType<typeof useTheme>,
  size: number,
): React.CSSProperties => ({
  textAlign: "center",
  textWrap: "balance",
  fontFamily: t.fonts.heading,
  fontWeight: t.type.headlineWeight,
  fontSize: Math.round(size * t.type.scale),
  lineHeight: 1.1,
  letterSpacing: `${t.type.tracking}em`,
  textTransform: t.type.headlineTransform,
  color: t.colors.groundText,
});

// Keeps hyphenated words (e.g. "setup-ku") on one line.
export const NoBreak: React.FC<{ readonly text: string }> = ({ text }) => (
  <>
    {text.split(" ").map((word, i) => (
      <span key={i}>
        {i > 0 ? " " : ""}
        {word.includes("-") ? (
          <span style={{ whiteSpace: "nowrap" }}>{word}</span>
        ) : (
          word
        )}
      </span>
    ))}
  </>
);
