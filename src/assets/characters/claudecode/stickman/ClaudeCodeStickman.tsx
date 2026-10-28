import type React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { expressionAt, type PropDrivenProps } from "../../shared/props";
import type { RobotExpression } from "../../robot/rig/face";
import { HAND, poseAt, reach, type ArmPose, type LegPose } from "../../ganjar/stickman/GanjarStickman";
import { CLAUDE_CODE_EXPRESSIONS } from "../rig/ClaudeCode";
import { eyeShape } from "../rig/eyes";
import { COLORS as C } from "../rig/geometry";

// Claude Code gaya stickman: garis tipis tampak depan seperti RobotStickman. Satu kotak oranye (kepala
// dan badan sekaligus) dengan mata hitam, lengan pendek berujung kotak kecil, dan empat kaki berupa garis tipis berujung kotak kecil.
// Gerak memakai pose yang sama dengan GanjarStickman.

export const CLAUDE_CODE_STICKMAN_EXPRESSIONS = CLAUDE_CODE_EXPRESSIONS;

const VIEWBOX = { w: 400, h: 240 } as const;
// Kotak 10 px per unit grid logo (18 x 12,08).
const BOX = { x: 110, y: 50, w: 180, h: 120.8, r: 4 } as const;
const BONE = { upperArm: 18, foreArm: 16, leg: 44 } as const;
const BOX_BOTTOM = BOX.y + BOX.h;
const SHOULDER = { dx: 90, y: 112 } as const;
const MITT = { w: 20, h: 22, r: 3 } as const;
const FOOT = { w: 22, h: 10, r: 3 } as const;
// Pangkal kaki dari tengah: luar dan dalam.
const HIPS = [-67.4, -37.4, 37.4, 67.4] as const;

export type ClaudeCodeStickmanProps = PropDrivenProps<RobotExpression> & {
  readonly color?: string;
  // Tebal garis dalam unit viewBox (400 lebar).
  readonly strokeWidth?: number;
};

export const claudeCodeStickmanSize = (height: number): { width: number; height: number } => ({
  width: (height * VIEWBOX.w) / VIEWBOX.h,
  height,
});

export const ClaudeCodeStickman: React.FC<ClaudeCodeStickmanProps> = ({
  height = 640,
  expression: expressionProp = "netral",
  face,
  walk = false,
  wave = false,
  gesture,
  color = "#232540",
  strokeWidth = 5,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const expression = expressionAt(face, expressionProp, frame, fps);
  const pose = poseAt(frame / fps, walk, wave, gesture, true);
  const line = { stroke: color, strokeWidth, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  const open = { ...line, fill: "none" } as const;

  const arm = (side: 1 | -1, a: ArmPose, front: boolean): React.ReactNode => {
    if (Boolean(a.front) !== front) return null;
    const from = { x: 200 + side * SHOULDER.dx, y: SHOULDER.y };
    const elbow = reach(from, BONE.upperArm, a.shoulder, side);
    const dir = a.shoulder + a.elbow;
    const hand = reach(elbow, BONE.foreArm, dir, side);
    const rad = (dir * Math.PI) / 180;
    const c = { x: hand.x + side * Math.sin(rad) * HAND.ry, y: hand.y + Math.cos(rad) * HAND.ry };
    return (
      <g key={side}>
        <path d={`M${from.x} ${from.y} Q${elbow.x} ${elbow.y} ${hand.x} ${hand.y}`} {...open} />
        <rect
          x={c.x - MITT.w / 2}
          y={c.y - MITT.h / 2}
          width={MITT.w}
          height={MITT.h}
          rx={MITT.r}
          transform={`rotate(${-side * dir} ${c.x} ${c.y})`}
          fill={C.orange}
          {...line}
        />
      </g>
    );
  };

  const leg = (hipDx: number, l: LegPose): React.ReactNode => {
    const side = hipDx < 0 ? -1 : 1;
    const hip = { x: 200 + hipDx, y: BOX_BOTTOM - 2 };
    const len = BONE.leg - l.lift;
    const knee = reach(hip, len * 0.5, l.out * 0.4, side);
    const foot = reach(hip, len, l.out, side);
    return (
      <g key={hipDx}>
        <path d={`M${hip.x} ${hip.y} Q${knee.x} ${knee.y} ${foot.x} ${foot.y}`} {...open} />
        <rect
          x={foot.x - FOOT.w / 2}
          y={foot.y - FOOT.h / 2 + 2}
          width={FOOT.w}
          height={FOOT.h}
          rx={FOOT.r}
          fill={C.orange}
          {...line}
        />
      </g>
    );
  };

  return (
    <svg
      width={claudeCodeStickmanSize(height).width}
      height={height}
      viewBox={`0 0 ${VIEWBOX.w} ${VIEWBOX.h}`}
      style={{ overflow: "visible", display: "block", ...style }}
    >
      <g transform={`translate(0 ${pose.bobY})`}>
        {HIPS.map((dx) => leg(dx, pose.legs[dx < 0 ? 0 : 1]))}
        <g transform={`rotate(${pose.sway + pose.headTilt * 0.5} 200 ${BOX_BOTTOM})`}>
          {arm(-1, pose.arms[0], false)}
          {arm(1, pose.arms[1], false)}
          <rect x={BOX.x} y={BOX.y} width={BOX.w} height={BOX.h} rx={BOX.r} fill={C.orange} {...line} />
          {([-1, 1] as const).map((side) => (
            <g key={side} transform={`translate(${200 + side * 52.6} ${BOX.y + 45.3}) scale(10)`}>
              {eyeShape(expression, side)}
            </g>
          ))}
          {/* lengan yang melintas di depan kotak (facepalm, mikir, tepuk, ...) */}
          {arm(-1, pose.arms[0], true)}
          {arm(1, pose.arms[1], true)}
        </g>
      </g>
    </svg>
  );
};
