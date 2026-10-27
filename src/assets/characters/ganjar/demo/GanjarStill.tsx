import type React from "react";
import { AbsoluteFill } from "remotion";
import { GANJAR_VIEWBOX, GanjarRig } from "../rig/GanjarRig";
import { COLORS } from "../rig/geometry";
import { EXPRESSIONS, type GanjarExpression } from "../rig/face";
import { NEUTRAL_POSE } from "../rig/pose";

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
