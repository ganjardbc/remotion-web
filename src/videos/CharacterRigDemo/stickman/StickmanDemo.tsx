import type React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { Stickman, type StickmanExpression } from "../../../assets/characters/stickman/Stickman";

export const STICKMAN_DEMO_FRAMES = 300;

const EXPRESSIONS: readonly StickmanExpression[] = ["senyum", "kaget", "netral", "sedih", "marah", "mataTertutup", "senyum"];

// Diam, jalan di tempat, lalu melambai. Ekspresi berganti tiap 1,5 detik.
export const StickmanDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const expression = EXPRESSIONS[Math.min(EXPRESSIONS.length - 1, Math.floor(t / 1.4))];
  return (
    <AbsoluteFill style={{ background: "#ffffff", justifyContent: "center", alignItems: "center" }}>
      <Stickman height={1400} expression={expression} walk={t >= 2 && t < 6} wave={t >= 6} />
    </AbsoluteFill>
  );
};

export const StickmanStill: React.FC<{ readonly expression?: StickmanExpression }> = ({ expression = "senyum" }) => (
  <AbsoluteFill style={{ background: "#ffffff", justifyContent: "center", alignItems: "center" }}>
    <Stickman height={1400} expression={expression} hair />
  </AbsoluteFill>
);

export const StickmanHair: React.FC<{ readonly expression?: StickmanExpression }> = ({ expression = "senyum" }) => (
  <AbsoluteFill style={{ background: "#ffffff", justifyContent: "center", alignItems: "center" }}>
    <Stickman height={1400} expression={expression} headphones={false} hair />
  </AbsoluteFill>
);

// Varian polos: hanya garis, tanpa hoodie dan celana.
export const StickmanPlain: React.FC<{ readonly expression?: StickmanExpression }> = ({ expression = "senyum" }) => (
  <AbsoluteFill style={{ background: "#ffffff", justifyContent: "center", alignItems: "center" }}>
    <Stickman height={1400} expression={expression} headphones={false} outfit={false} />
  </AbsoluteFill>
);
