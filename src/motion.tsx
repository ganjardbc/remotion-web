import type React from "react";
import { Interactive, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

// Gerak bersama untuk semua video (Enter, Pop, useSpringIn, shakeX).

export const useSpringIn = (delay: number, damping = 200): number => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame, fps, delay, config: { damping } });
};

// Horizontal shake: frames [0, 25%, 50%, 75%, 100%] of `duration`.
export const shakeX = (frame: number, start: number, duration = 12): number =>
  interpolate(
    frame - start,
    [0, 0.25, 0.5, 0.75, 1].map((r) => r * duration),
    [0, -8, 8, -4, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

// Spring entrance: fade + slide from (x, y) offset.
export const Enter: React.FC<{
  readonly name: string;
  readonly delay: number;
  readonly damping?: number;
  readonly x?: number;
  readonly y?: number;
  readonly style?: React.CSSProperties;
  readonly children: React.ReactNode;
}> = ({ name, delay, damping = 200, x = 0, y = 40, style, children }) => {
  const p = useSpringIn(delay, damping);
  return (
    <Interactive.Div
      name={name}
      style={{
        ...style,
        opacity: Math.min(1, Math.max(0, p)),
        translate: `${(1 - p) * x}px ${(1 - p) * y}px`,
      }}
    >
      {children}
    </Interactive.Div>
  );
};

// Icon that scales 0 → 1 with a bounce.
export const Pop: React.FC<{
  readonly delay: number;
  readonly damping?: number;
  readonly children: React.ReactNode;
}> = ({ delay, damping = 8, children }) => {
  const p = useSpringIn(delay, damping);
  return (
    <div style={{ display: "flex", scale: Math.max(0, p) }}>{children}</div>
  );
};
