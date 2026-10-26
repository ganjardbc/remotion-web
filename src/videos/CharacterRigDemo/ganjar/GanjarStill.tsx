import type React from "react";
import { AbsoluteFill } from "remotion";
import { GANJAR_VIEWBOX, GanjarRig } from "../../../assets/characters/ganjar/rig/GanjarRig";
import { COLORS } from "../../../assets/characters/ganjar/rig/geometry";
import { EXPRESSIONS, type GanjarExpression } from "../../../assets/characters/ganjar/rig/face";
import { NEUTRAL_POSE } from "../../../assets/characters/ganjar/rig/pose";

export const GanjarStill: React.FC<{ readonly expression?: GanjarExpression }> = ({
  expression = "netral",
}) => (
  <AbsoluteFill style={{ background: COLORS.background }}>
    <svg
      width={1080}
      height={1080 * (GANJAR_VIEWBOX.h / GANJAR_VIEWBOX.w)}
      viewBox={`${GANJAR_VIEWBOX.x} ${GANJAR_VIEWBOX.y} ${GANJAR_VIEWBOX.w} ${GANJAR_VIEWBOX.h}`}
    >
      <GanjarRig pose={NEUTRAL_POSE} face={EXPRESSIONS[expression]} />
    </svg>
  </AbsoluteFill>
);
