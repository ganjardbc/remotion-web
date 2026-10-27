import type React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { GanjarBlock, type GanjarBlockExpression } from "../block/GanjarBlock";

export const GANJAR_BLOCK_DEMO_FRAMES = 240;

const EXPRESSIONS: readonly GanjarBlockExpression[] = ["senyum", "kaget", "mataTertutup", "senyum"];

// Putar sampai menghadap depan, berjalan, lalu melambai. Ekspresi berganti tiap beberapa detik.
export const GanjarBlockDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const expression = EXPRESSIONS[Math.min(EXPRESSIONS.length - 1, Math.floor(t / 2))];
  return (
    <AbsoluteFill style={{ background: "#fbe28a", justifyContent: "center", alignItems: "center" }}>
      <GanjarBlock height={1100} expression={expression} yaw={24 + Math.max(0, 2 - t) * 180} walk={t >= 2 && t < 5} wave={t >= 5} />
    </AbsoluteFill>
  );
};

export const GanjarBlockStill: React.FC<{ readonly expression?: GanjarBlockExpression }> = ({ expression = "senyum" }) => (
  <AbsoluteFill style={{ background: "#fbe28a", justifyContent: "center", alignItems: "center" }}>
    <GanjarBlock height={1400} expression={expression} yaw={24} />
  </AbsoluteFill>
);
