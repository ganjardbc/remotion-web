import type React from "react";
import { Easing, Interactive, interpolate, useCurrentFrame } from "remotion";
import { useTheme } from "../../themes";

// Context meter: holds at `from`, then eases to `to` between the two frames.
export const Meter: React.FC<{
  readonly label: string;
  readonly from: number;
  readonly to: number;
  readonly startFrame: number;
  readonly endFrame: number;
  readonly scale?: number;
}> = ({ label, from, to, startFrame, endFrame, scale = 1 }) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const value = interpolate(frame, [startFrame, endFrame], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...t.motion.enter),
  });
  const low = value < 40;

  return (
    <Interactive.Div
      name="Meter"
      style={{ display: "flex", flexDirection: "column", gap: 20 * scale }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          fontFamily: t.fonts.mono,
          fontSize: 36 * scale,
          color: t.code.muted,
        }}
      >
        <span>{label}</span>
        <span
          style={{
            fontWeight: 700,
            fontSize: 56 * scale,
            color: low ? t.colors.groundText : t.colors.accent,
          }}
        >
          {Math.round(value)}%
        </span>
      </div>
      <div
        style={{
          height: 32 * scale,
          borderRadius: 999,
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${value}%`,
            height: "100%",
            borderRadius: 999,
            backgroundColor: low ? t.colors.primary : t.colors.accent,
            boxShadow: low ? t.shadows.glow : "none",
          }}
        />
      </div>
    </Interactive.Div>
  );
};
