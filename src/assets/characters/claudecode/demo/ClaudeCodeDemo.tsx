import type React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { armGesture, surprise, walk } from "../../robot/rig/clips";
import type { PlacedClip } from "../../robot/rig/clips";
import type { FaceKey, RobotExpression } from "../../robot/rig/face";
import { ClaudeCodeBlock } from "../block/ClaudeCodeBlock";
import { ClaudeCode, CLAUDE_CODE_EXPRESSIONS } from "../rig/ClaudeCode";
import { COLORS } from "../rig/geometry";
import { ClaudeCodeStickman } from "../stickman/ClaudeCodeStickman";

const FPS = 30;
const at = (s: number): number => Math.round(s * FPS);

// ---------- Rig 2D ----------

export const CLAUDE_CODE_DEMO_FRAMES = 8 * FPS;

const CLIPS: readonly PlacedClip[] = [
  { clip: armGesture("R", at(1.0), 130, 14), start: at(3.0), dur: at(1.0) },
  { clip: armGesture("L", at(1.0), 95, 0), start: at(3.7), dur: at(1.0) },
  { clip: surprise, start: at(4.9), dur: at(1.0) },
  { clip: walk(at(1.5)), start: at(6.0), dur: at(1.5) },
];

const FACE: readonly FaceKey[] = [
  { at: 1.0, expression: "senang" },
  { at: 1.5, expression: "malu" },
  { at: 2.0, expression: "sedih" },
  { at: 2.5, expression: "marah" },
  { at: 3.0, expression: "normal" },
  { at: 4.9, expression: "kaget" },
  { at: 6.0, expression: "senang" },
  { at: 7.5, expression: "normal" },
];

export const ClaudeCodeDemo: React.FC = () => (
  <AbsoluteFill style={{ background: COLORS.background, justifyContent: "center", alignItems: "center" }}>
    <ClaudeCode height={700} clips={CLIPS} face={FACE} />
  </AbsoluteFill>
);

export const ClaudeCodeStill: React.FC<{ readonly expression?: RobotExpression }> = ({ expression = "normal" }) => (
  <AbsoluteFill style={{ background: COLORS.background, justifyContent: "center", alignItems: "center" }}>
    <ClaudeCode height={700} expression={expression} />
  </AbsoluteFill>
);

// ---------- Block dan stickman ----------

export const CLAUDE_CODE_VARIANT_DEMO_FRAMES = 300;

const EXPRESSIONS: readonly RobotExpression[] = [...CLAUDE_CODE_EXPRESSIONS, "normal"];
const expressionAt = (t: number): RobotExpression => EXPRESSIONS[Math.min(EXPRESSIONS.length - 1, Math.floor(t / 0.8))];

// Putar sampai menghadap depan, berjalan, lalu melambai. Ekspresi berganti tiap 0,8 detik.
export const ClaudeCodeBlockDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  return (
    <AbsoluteFill style={{ background: COLORS.background, justifyContent: "center", alignItems: "center" }}>
      <ClaudeCodeBlock height={600} expression={expressionAt(t)} yaw={24 + Math.max(0, 2 - t) * 180} walk={t >= 2 && t < 6} wave={t >= 6} />
    </AbsoluteFill>
  );
};

export const ClaudeCodeBlockStill: React.FC<{ readonly expression?: RobotExpression }> = ({ expression = "normal" }) => (
  <AbsoluteFill style={{ background: COLORS.background, justifyContent: "center", alignItems: "center" }}>
    <ClaudeCodeBlock height={600} expression={expression} yaw={24} />
  </AbsoluteFill>
);

export const ClaudeCodeStickmanDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  return (
    <AbsoluteFill style={{ background: "#ffffff", justifyContent: "center", alignItems: "center" }}>
      <ClaudeCodeStickman height={600} expression={expressionAt(t)} walk={t >= 2 && t < 6} wave={t >= 6} />
    </AbsoluteFill>
  );
};

export const ClaudeCodeStickmanStill: React.FC<{ readonly expression?: RobotExpression }> = ({ expression = "normal" }) => (
  <AbsoluteFill style={{ background: "#ffffff", justifyContent: "center", alignItems: "center" }}>
    <ClaudeCodeStickman height={600} expression={expression} />
  </AbsoluteFill>
);
