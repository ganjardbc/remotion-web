import type React from "react";
import {
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { useTheme } from "../../themes";

// Fade + rise in at `delay` frames; the one entrance used across the video.
export const Appear: React.FC<{
  readonly name: string;
  readonly delay: number;
  readonly children: React.ReactNode;
  readonly style?: React.CSSProperties;
}> = ({ name, delay, children, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = useTheme();

  return (
    <Interactive.Div
      name={name}
      style={{
        ...style,
        opacity: interpolate(frame, [delay, delay + 0.4 * fps], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
        translate: interpolate(
          frame,
          [delay, delay + 0.6 * fps],
          ["0px 40px", "0px 0px"],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(...t.motion.enter),
          },
        ),
      }}
    >
      {children}
    </Interactive.Div>
  );
};

// Reels UI covers the top and bottom; keep content inside this safe area.
export const SAFE_PADDING = "200px 80px 280px";
