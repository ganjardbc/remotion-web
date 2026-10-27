import type React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { RobotBlock } from "../block/RobotBlock";
import type { RobotExpression } from "../rig/face";
import { ROBOT_EXPRESSIONS } from "../rig/Robot";

export const ROBOT_BLOCK_DEMO_FRAMES = 300;

const EXPRESSIONS: readonly RobotExpression[] = [...ROBOT_EXPRESSIONS, "normal"];

// Putar sampai menghadap depan, berjalan, lalu melambai. Ekspresi berganti tiap 0,8 detik.
export const RobotBlockDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const expression = EXPRESSIONS[Math.min(EXPRESSIONS.length - 1, Math.floor(t / 0.8))];
  return (
    <AbsoluteFill style={{ background: "#f8f6f1", justifyContent: "center", alignItems: "center" }}>
      <RobotBlock height={1000} expression={expression} yaw={24 + Math.max(0, 2 - t) * 180} walk={t >= 2 && t < 6} wave={t >= 6} />
    </AbsoluteFill>
  );
};

export const RobotBlockStill: React.FC<{ readonly expression?: RobotExpression }> = ({ expression = "normal" }) => (
  <AbsoluteFill style={{ background: "#f8f6f1", justifyContent: "center", alignItems: "center" }}>
    <RobotBlock height={1100} expression={expression} yaw={24} />
  </AbsoluteFill>
);
