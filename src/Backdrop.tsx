import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { useTheme } from "./themes";

type BackdropProps = {
  // "ground" is the primary-colour field, "dark" the tech/terminal context.
  readonly variant?: "canvas" | "ground" | "dark";
  // Mono scene marker shown top-left, e.g. "02 / 05".
  readonly label?: string;
  // One accent line sweeping down the frame on entry (use on hooks).
  readonly sweep?: boolean;
};

const mix = (color: string, percent: number): string =>
  `color-mix(in srgb, ${color} ${percent}%, transparent)`;

const Corner: React.FC<{
  readonly x: "left" | "right";
  readonly y: "top" | "bottom";
  readonly size: number;
  readonly color: string;
  readonly offset: { top: number; bottom: number; side: number };
}> = ({ x, y, size, color, offset }) => (
  <div
    style={{
      position: "absolute",
      [x]: offset.side,
      [y]: y === "top" ? offset.top : offset.bottom,
      width: size,
      height: size,
      borderColor: color,
      borderStyle: "solid",
      borderWidth: 0,
      [`border${y === "top" ? "Top" : "Bottom"}Width`]: 3,
      [`border${x === "left" ? "Left" : "Right"}Width`]: 3,
    }}
  />
);

// Layered tech field: faint drifting grid (or dots on the colour ground),
// soft glows, corner brackets and a mono scene marker. Deterministic per frame.
export const Backdrop: React.FC<BackdropProps> = ({
  variant = "canvas",
  label,
  sweep = false,
}) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const unit = width / 1080;
  const portrait = height > width;

  const isGround = variant === "ground";
  const isDark = variant === "dark";
  const base = isDark
    ? t.code.bg
    : isGround
      ? t.colors.ground
      : t.colors.canvas;
  const line = isDark || isGround ? "#FFFFFF" : t.colors.ink;
  const lineAlpha = isDark ? 7 : isGround ? 10 : 6;
  const chrome = isDark || isGround ? t.colors.groundTextMuted : t.colors.muted;
  const glowA = t.colors.primary;
  const glowB = t.colors.accent;

  const cell = 72 * unit;
  const drift = frame * 0.5 * unit;
  const lineColor = mix(line, lineAlpha);
  const grid = isGround
    ? {
        backgroundImage: `radial-gradient(${mix(line, 22)} ${2 * unit}px, transparent ${2 * unit}px)`,
        backgroundSize: `${cell / 2}px ${cell / 2}px`,
      }
    : {
        backgroundImage: `linear-gradient(${lineColor} 1px, transparent 1px), linear-gradient(90deg, ${lineColor} 1px, transparent 1px)`,
        backgroundSize: `${cell}px ${cell}px`,
      };

  const sway = Math.sin(frame / (fps * 2));
  const intro = interpolate(frame, [0, 0.5 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...t.motion.enter),
  });
  const offset = portrait
    ? { top: 130 * unit, bottom: 230 * unit, side: 48 * unit }
    : { top: 48, bottom: 48, side: 48 };
  const sweepY = interpolate(frame, [0, 0.9 * fps], [-4, height + 4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...t.motion.enter),
  });

  return (
    <AbsoluteFill style={{ backgroundColor: base, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          ...grid,
          backgroundPosition: `${drift}px ${drift}px`,
          maskImage:
            "radial-gradient(ellipse 75% 60% at 50% 45%, black 25%, transparent 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: width * 1.1,
          height: width * 1.1,
          right: -width * 0.55 + sway * 30 * unit,
          top: -width * 0.45,
          borderRadius: "50%",
          background: `radial-gradient(closest-side, ${mix(glowA, isGround ? 40 : 30)}, transparent)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: width * 0.9,
          height: width * 0.9,
          left: -width * 0.45 - sway * 30 * unit,
          bottom: -width * 0.35,
          borderRadius: "50%",
          background: `radial-gradient(closest-side, ${mix(glowB, isGround ? 26 : 18)}, transparent)`,
        }}
      />
      <AbsoluteFill style={{ opacity: intro }}>
        {(["top", "bottom"] as const).flatMap((y) =>
          (["left", "right"] as const).map((x) => (
            <Corner
              key={`${y}-${x}`}
              x={x}
              y={y}
              size={44 * unit}
              color={chrome}
              offset={offset}
            />
          )),
        )}
        {label ? (
          <div
            style={{
              position: "absolute",
              left: offset.side + 68 * unit,
              top: offset.top + 2 * unit,
              fontFamily: t.fonts.mono,
              fontSize: 30 * unit,
              letterSpacing: "0.04em",
              color: chrome,
            }}
          >
            {label}
          </div>
        ) : null}
      </AbsoluteFill>
      {sweep ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: sweepY,
            height: 3,
            backgroundColor: glowB,
            boxShadow: `0 0 ${24 * unit}px ${glowB}`,
            opacity: interpolate(frame, [0, 0.9 * fps], [1, 0], {
              extrapolateRight: "clamp",
            }),
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};
