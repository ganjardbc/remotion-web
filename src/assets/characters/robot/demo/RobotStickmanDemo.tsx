import type React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { RobotStickman } from "../stickman/RobotStickman";
import type { RobotExpression } from "../rig/face";
import { ROBOT_EXPRESSIONS } from "../rig/Robot";

export const ROBOT_STICKMAN_DEMO_FRAMES = 300;

const EXPRESSIONS: readonly RobotExpression[] = [...ROBOT_EXPRESSIONS, "normal"];

// Diam, jalan di tempat, lalu melambai. Ekspresi berganti tiap 0,8 detik.
export const RobotStickmanDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const expression = EXPRESSIONS[Math.min(EXPRESSIONS.length - 1, Math.floor(t / 0.8))];
  return (
    <AbsoluteFill style={{ background: "#ffffff", justifyContent: "center", alignItems: "center" }}>
      <RobotStickman height={900} expression={expression} walk={t >= 2 && t < 6} wave={t >= 6} />
    </AbsoluteFill>
  );
};

export const RobotStickmanStill: React.FC<{ readonly expression?: RobotExpression }> = ({ expression = "normal" }) => (
  <AbsoluteFill style={{ background: "#ffffff", justifyContent: "center", alignItems: "center" }}>
    <RobotStickman height={900} expression={expression} />
  </AbsoluteFill>
);
