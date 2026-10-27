import type React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { evalGanjar, headTurn, point, type PlacedClip } from "../rig/clips";
import { evalFace, type FaceKey } from "../rig/face";
import { GANJAR_VIEWBOX, GanjarRig } from "../rig/GanjarRig";
import { COLORS } from "../rig/geometry";

const FPS = 30;
const at = (s: number): number => Math.round(s * FPS);

// 8 detik @30fps: idle, 8 ekspresi, toleh/miring kepala, menunjuk, kembali ke netral.
export const GANJAR_DEMO_FRAMES = 8 * FPS;

const CLIPS: readonly PlacedClip[] = [
  { clip: headTurn(at(1.2), -1, -5), start: at(3.4), dur: at(1.2) },
  { clip: point("L", at(1.6), 84), start: at(4.4), dur: at(1.6) },
  { clip: headTurn(at(1.0), 0.8, 4), start: at(5.0), dur: at(1.0) },
];

const FACE: readonly FaceKey[] = [
  { at: 0.8, expression: "senang" },
  { at: 1.2, expression: "bingung" },
  { at: 1.6, expression: "kaget" },
  { at: 2.0, expression: "senyumSantai" },
  { at: 2.4, expression: "serius" },
  { at: 2.8, expression: "kesal" },
  { at: 3.1, expression: "mikir" },
  { at: 3.4, expression: "netral" },
  { at: 4.4, expression: "senang" },
  { at: 6.2, expression: "mataTertutup" },
  { at: 6.8, expression: "netral" },
];

export const GanjarDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const pose = evalGanjar(frame, CLIPS);
  const face = evalFace(frame, fps, FACE);
  const svgW = width * 0.85;
  const svgH = (svgW * GANJAR_VIEWBOX.h) / GANJAR_VIEWBOX.w;
  return (
    <AbsoluteFill style={{ background: COLORS.background }}>
      <svg
        width={svgW}
        height={svgH}
        viewBox={`${GANJAR_VIEWBOX.x} ${GANJAR_VIEWBOX.y} ${GANJAR_VIEWBOX.w} ${GANJAR_VIEWBOX.h}`}
        style={{ position: "absolute", left: (width - svgW) / 2, top: 260, overflow: "visible" }}
      >
        <GanjarRig pose={pose} face={face} />
      </svg>
    </AbsoluteFill>
  );
};
