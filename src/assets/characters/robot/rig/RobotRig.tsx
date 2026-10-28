import type React from "react";
import { useId } from "react";
import {
  ANTENNA,
  ARM,
  BODY,
  BODY_PIVOT,
  COLORS as C,
  EYE_X,
  FLOOR_Y,
  LEG,
  SCREEN,
} from "./geometry";
import type { FaceState, RobotExpression } from "./face";
import type { LegPose, RobotPose } from "./pose";

export const RIG_VIEWBOX = { x: -330, y: -270, w: 660, h: 560 } as const;

const EYE_STROKE = {
  stroke: C.blueLight,
  strokeWidth: 10,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  fill: "none",
};

// Satu mata di koordinat lokal (0,0) = pusat mata. `side` -1 kiri, +1 kanan.
const Eye: React.FC<{ readonly kind: RobotExpression; readonly side: -1 | 1 }> = ({ kind, side }) => {
  switch (kind) {
    case "normal":
    case "netral":
      return <rect x={-25} y={-27} width={50} height={54} rx={9} fill={C.blueLight} />;
    case "senang":
      return <path d="M-22 10 Q0 -22 22 10" {...EYE_STROKE} />;
    case "kaget":
      return <rect x={-17} y={-34} width={34} height={68} rx={17} fill={C.blueLight} />;
    case "malu":
      return (
        <path
          d={side === -1 ? "M-16 -22 L16 0 L-16 22" : "M16 -22 L-16 0 L16 22"}
          {...EYE_STROKE}
        />
      );
    case "sedih":
      return <rect x={-18} y={-8} width={36} height={32} rx={7} fill={C.blueLight} />;
    case "marah":
      return (
        <path
          d={
            side === -1
              ? "M-24 -8 L24 12 L24 30 Q24 34 20 34 L-20 34 Q-24 34 -24 30 Z"
              : "M24 -8 L-24 12 L-24 30 Q-24 34 -20 34 L20 34 Q24 34 24 30 Z"
          }
          fill={C.blueLight}
        />
      );
    case "bingung":
      // Kiri kecil bulat, kanan besar: satu alis terangkat.
      return side === -1 ? (
        <rect x={-14} y={-14} width={28} height={28} rx={14} fill={C.blueLight} />
      ) : (
        <rect x={-25} y={-32} width={50} height={64} rx={9} fill={C.blueLight} />
      );
    case "mikir":
      // Pil pipih di atas: melirik ke atas.
      return <rect x={-23} y={-32} width={46} height={26} rx={13} fill={C.blueLight} />;
    case "kesal":
      return (
        <path
          d={
            side === -1
              ? "M-24 -2 L24 12 L24 24 Q24 28 20 28 L-20 28 Q-24 28 -24 24 Z"
              : "M24 -2 L-24 12 L-24 24 Q-24 28 -20 28 L20 28 Q24 28 24 24 Z"
          }
          fill={C.blueLight}
        />
      );
    case "serius":
      return <rect x={-27} y={-6} width={54} height={26} rx={5} fill={C.blueLight} />;
    case "mataTertutup":
      return <path d="M-22 -6 Q0 20 22 -6" {...EYE_STROKE} />;
  }
};

const Face: React.FC<{ readonly face: FaceState; readonly glowId: string }> = ({ face, glowId }) => {
  const eyes: readonly (-1 | 1)[] = [-1, 1];
  return (
    <g transform={`translate(${face.lookX} ${face.lookY})`}>
      {eyes.map((side) => (
        <g
          key={side}
          transform={`translate(${side * EYE_X} 0) scale(1 ${Math.max(0.06, face.open)})`}
        >
          <g opacity={0.55} filter={`url(#${glowId})`}>
            <Eye kind={face.expression} side={side} />
          </g>
          <Eye kind={face.expression} side={side} />
        </g>
      ))}
    </g>
  );
};

const Antenna: React.FC<{ readonly side: -1 | 1; readonly rot: number }> = ({ side, rot }) => {
  const cx = side * ANTENNA.cx;
  const stemH = ANTENNA.baseY - ANTENNA.stemTop;
  return (
    <g transform={`rotate(${rot} ${cx} ${ANTENNA.baseY})`}>
      <rect
        x={cx - ANTENNA.w / 2}
        y={ANTENNA.stemTop}
        width={ANTENNA.w}
        height={stemH + 10}
        fill={C.cream}
        stroke={C.creamOutline}
        strokeWidth={2.5}
      />
      <rect
        x={cx - ANTENNA.tipW / 2}
        y={ANTENNA.tipTop}
        width={ANTENNA.tipW}
        height={ANTENNA.stemTop - ANTENNA.tipTop + 4}
        rx={8}
        fill={C.blue}
        stroke="#1457b8"
        strokeWidth={2.5}
      />
      <rect
        x={cx - ANTENNA.tipW / 2 + 6}
        y={ANTENNA.tipTop + 5}
        width={ANTENNA.tipW - 12}
        height={8}
        rx={4}
        fill={C.blueLight}
        opacity={0.8}
      />
    </g>
  );
};

const Arm: React.FC<{ readonly side: -1 | 1; readonly raise: number }> = ({ side, raise }) => {
  const cx = side * ARM.cx;
  const pivotY = ARM.top + ARM.pivotDy;
  // Kiri: rotasi positif = keluar. Kanan: negatif.
  const rot = -side * raise;
  return (
    <g transform={`rotate(${rot} ${cx} ${pivotY})`}>
      <rect
        x={cx - ARM.w / 2}
        y={ARM.top}
        width={ARM.w}
        height={ARM.h}
        rx={ARM.r}
        fill={C.cream}
        stroke={C.creamOutline}
        strokeWidth={3}
      />
      <rect
        x={cx - ARM.w / 2 + (side === -1 ? 8 : 34)}
        y={ARM.top + 10}
        width={18}
        height={ARM.h - 26}
        rx={9}
        fill={C.creamDark}
        opacity={0.45}
      />
    </g>
  );
};

const Leg: React.FC<{ readonly side: -1 | 1; readonly leg: LegPose }> = ({ side, leg }) => {
  const cx = side * LEG.cx;
  const tw = LEG.topW / 2;
  const bw = LEG.bottomW / 2;
  const footX = cx - LEG.footW / 2;
  return (
    <g transform={`translate(0 ${-leg.lift}) rotate(${leg.swing} ${cx} ${LEG.hipY})`}>
      <path
        d={`M${cx - tw} ${LEG.top} L${cx + tw} ${LEG.top} L${cx + bw} ${LEG.bottom} L${cx - bw} ${LEG.bottom} Z`}
        fill={C.orange}
        stroke={C.outline}
        strokeWidth={3}
        strokeLinejoin="round"
      />
      <path
        d={`M${cx - tw + 8} ${LEG.top + 2} L${cx - tw + 26} ${LEG.top + 2} L${cx - bw + 22} ${LEG.bottom - 2} L${cx - bw + 8} ${LEG.bottom - 2} Z`}
        fill={C.orangeLight}
        opacity={0.5}
      />
      <g transform={`rotate(${leg.foot} ${cx} ${LEG.bottom})`}>
        <rect
          x={footX}
          y={LEG.footTop}
          width={LEG.footW}
          height={LEG.footH}
          rx={11}
          fill={C.cream}
          stroke={C.creamOutline}
          strokeWidth={3}
        />
        <rect
          x={footX + 6}
          y={LEG.footTop + LEG.footH - 11}
          width={LEG.footW - 12}
          height={7}
          rx={3.5}
          fill={C.creamDark}
          opacity={0.7}
        />
      </g>
    </g>
  );
};

export type RobotRigProps = {
  readonly pose: RobotPose;
  readonly face: FaceState;
};

export const RobotRig: React.FC<RobotRigProps> = ({ pose, face }) => {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const clipId = `rb-body-${uid}`;
  const glowId = `rb-glow-${uid}`;
  const { root, body } = pose;
  const bodyTransform = [
    `translate(0 ${body.y})`,
    `rotate(${body.rot} ${BODY_PIVOT.x} ${BODY_PIVOT.y})`,
    `translate(${BODY_PIVOT.x} ${BODY_PIVOT.y}) scale(${body.sx} ${body.sy}) translate(${-BODY_PIVOT.x} ${-BODY_PIVOT.y})`,
  ].join(" ");
  // Bayangan mengecil saat badan terangkat.
  const lifted = Math.max(0, -(root.y + body.y));
  const shadowScale = 1 - Math.min(0.35, lifted / 200);

  return (
    <g data-part="robot" transform={`translate(${root.x} ${root.y}) rotate(${root.rot} 0 ${FLOOR_Y})`}>
      <defs>
        <clipPath id={clipId}>
          <rect x={BODY.x} y={BODY.y} width={BODY.w} height={BODY.h} rx={BODY.r} />
        </clipPath>
        <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={7} />
        </filter>
      </defs>

      <ellipse
        data-part="shadow"
        cx={0}
        cy={FLOOR_Y + 4}
        rx={175 * shadowScale}
        ry={13 * shadowScale}
        fill="#000"
        opacity={0.1 * shadowScale}
      />

      <g data-part="legs">
        <Leg side={-1} leg={pose.legL} />
        <Leg side={1} leg={pose.legR} />
      </g>

      <g data-part="body-group" transform={bodyTransform}>
        <g data-part="antennas">
          <Antenna side={-1} rot={pose.antL} />
          <Antenna side={1} rot={pose.antR} />
        </g>
        <g data-part="arms">
          <Arm side={-1} raise={pose.armL} />
          <Arm side={1} raise={pose.armR} />
        </g>
        <g data-part="body">
          <rect
            x={BODY.x}
            y={BODY.y}
            width={BODY.w}
            height={BODY.h}
            rx={BODY.r}
            fill={C.orange}
          />
          <g clipPath={`url(#${clipId})`}>
            <rect x={BODY.x} y={BODY.y} width={BODY.w} height={16} fill={C.orangeLight} opacity={0.65} />
            <rect x={BODY.x} y={BODY.y + BODY.h - 22} width={BODY.w} height={22} fill={C.orangeDark} />
            <rect x={BODY.x} y={BODY.y} width={14} height={BODY.h} fill={C.orangeDark} opacity={0.35} />
          </g>
          <rect
            x={BODY.x}
            y={BODY.y}
            width={BODY.w}
            height={BODY.h}
            rx={BODY.r}
            fill="none"
            stroke={C.outline}
            strokeWidth={3.5}
          />
        </g>
        <g data-part="screen">
          <rect
            x={SCREEN.x}
            y={SCREEN.y}
            width={SCREEN.w}
            height={SCREEN.h}
            rx={SCREEN.r}
            fill={C.screen}
            stroke={C.screenEdge}
            strokeWidth={4}
          />
          <rect
            x={SCREEN.x + 10}
            y={SCREEN.y + 8}
            width={SCREEN.w - 20}
            height={10}
            rx={5}
            fill="#fff"
            opacity={0.05}
          />
          <g clipPath={undefined}>
            <Face face={face} glowId={glowId} />
          </g>
        </g>
      </g>
    </g>
  );
};
