import type React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { eyeShape } from "../block/RobotBlock";
import type { RobotExpression } from "../rig";
import { COLORS as C } from "../rig/geometry";
import { HAND, poseAt, reach, type ArmPose, type Gesture, type LegPose } from "../../stickman/Stickman";

// Robot gaya stickman: garis tipis dan tampak depan seperti Stickman. Seperti robot aslinya,
// tidak ada leher atau badan terpisah: satu kotak oranye berlayar (kepala dan badan sekaligus)
// dengan dua antena berujung biru di atas, lengan di sisi, dan kaki langsung di bawah kotak.
// Tangan dan kaki krem berbentuk kotak membulat. Gerak memakai pose yang sama dengan Stickman.

export const ROBOT_STICKMAN_EXPRESSIONS: readonly RobotExpression[] = ["normal", "senang", "kaget", "malu", "sedih", "marah"];

const VIEWBOX = { w: 400, h: 270 } as const;
// Lengan dan kaki pendek, seperti robot aslinya yang bertumpu pada satu kotak besar.
const BONE = { upperArm: 36, foreArm: 34, leg: 50 } as const;
const BOX = { x: 122, y: 56, w: 156, h: 140, r: 22 } as const;
const SCREEN = { x: 136, y: 70, w: 128, h: 96, r: 12 } as const;
const BOX_BOTTOM = BOX.y + BOX.h;
const SHOULDER = { dx: 78, y: 112 } as const;
const MITT = { w: 17, h: 24, r: 6 } as const;
const FOOT = { w: 34, h: 14, r: 6 } as const;

export type RobotStickmanProps = {
  // Tinggi kotak karakter dalam px.
  readonly height?: number;
  readonly expression?: RobotExpression;
  readonly walk?: boolean;
  readonly wave?: boolean;
  // Gerak tangan; menimpa `wave`. Lihat stickman/gestures.ts.
  readonly gesture?: Gesture;
  readonly color?: string;
  // Tebal garis dalam unit viewBox (400 lebar).
  readonly strokeWidth?: number;
  readonly style?: React.CSSProperties;
};

export const robotStickmanSize = (height: number): { width: number; height: number } => ({
  width: (height * VIEWBOX.w) / VIEWBOX.h,
  height,
});

export const RobotStickman: React.FC<RobotStickmanProps> = ({
  height = 640,
  expression = "normal",
  walk = false,
  wave = false,
  gesture,
  color = "#232540",
  strokeWidth = 5,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
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
          fill={C.cream}
          {...line}
        />
      </g>
    );
  };

  const leg = (side: 1 | -1, l: LegPose): React.ReactNode => {
    const hip = { x: 200 + side * 34, y: BOX_BOTTOM - 2 };
    const len = BONE.leg - l.lift;
    const knee = reach(hip, len * 0.5, l.out * 0.4, side);
    const foot = reach(hip, len, l.out, side);
    return (
      <g key={side}>
        <path d={`M${hip.x} ${hip.y} Q${knee.x} ${knee.y} ${foot.x} ${foot.y}`} {...open} />
        <rect
          x={foot.x + side * 11 - FOOT.w / 2}
          y={foot.y + 1 - FOOT.h / 2}
          width={FOOT.w}
          height={FOOT.h}
          rx={FOOT.r}
          transform={`rotate(${side * -6} ${foot.x} ${foot.y})`}
          fill={C.cream}
          {...line}
        />
      </g>
    );
  };

  return (
    <svg
      width={robotStickmanSize(height).width}
      height={height}
      viewBox={`0 0 ${VIEWBOX.w} ${VIEWBOX.h}`}
      style={{ overflow: "visible", display: "block", ...style }}
    >
      <g transform={`translate(0 ${pose.bobY})`}>
        {leg(-1, pose.legs[0])}
        {leg(1, pose.legs[1])}
        <g transform={`rotate(${pose.sway + pose.headTilt * 0.5} 200 ${BOX_BOTTOM})`}>
          {/* lengan di belakang kotak: pangkalnya tertutup kotak */}
          {arm(-1, pose.arms[0], false)}
          {arm(1, pose.arms[1], false)}
          {/* antena: batang tipis berujung kotak biru */}
          {([-1, 1] as const).map((side) => (
            <g key={side}>
              <path d={`M${200 + side * 40} ${BOX.y} L${200 + side * 40} 30`} {...open} />
              <rect x={200 + side * 40 - 9} y={12} width={18} height={20} rx={5} fill={C.blue} {...line} />
            </g>
          ))}
          <rect x={BOX.x} y={BOX.y} width={BOX.w} height={BOX.h} rx={BOX.r} fill={C.orange} {...line} />
          <rect x={SCREEN.x} y={SCREEN.y} width={SCREEN.w} height={SCREEN.h} rx={SCREEN.r} fill={C.screen} />
          {([-1, 1] as const).map((side) => (
            <g key={side} transform={`translate(${200 + side * 31} 118)`}>
              <g transform="scale(1.15)">{eyeShape(expression, side)}</g>
            </g>
          ))}
          {[-16, -8, 0, 8, 16].map((dx) => (
            <g key={dx}>
              <path d={`M${200 + dx} 177 L${200 + dx} 186`} stroke="#c9660f" strokeWidth={strokeWidth * 0.6} strokeLinecap="round" />
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
