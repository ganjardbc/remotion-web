import type React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import {
  isBlinking,
  PALETTE as C,
  type CharacterView,
  type RobotExpression,
} from "./palette";

export type RobotProps = {
  readonly expression?: RobotExpression;
  readonly view?: CharacterView;
  // Melayang pelan + kedip mengikuti frame.
  readonly animated?: boolean;
  readonly width?: number;
  readonly style?: React.CSSProperties;
};

const blue = { fill: C.blue };
const line = {
  stroke: C.blue,
  strokeWidth: 5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  fill: "none",
};

// Layar 88 x 68 berpusat di (100, 105).
const ScreenFace: React.FC<{
  readonly expression: RobotExpression;
  readonly blink: boolean;
}> = ({ expression, blink }) => {
  if (blink && (expression === "normal" || expression === "sedih")) {
    return (
      <>
        <rect x={72} y={108} width={14} height={3} rx={1.5} {...blue} />
        <rect x={114} y={108} width={14} height={3} rx={1.5} {...blue} />
      </>
    );
  }
  switch (expression) {
    case "normal":
      return (
        <>
          <rect x={72} y={98} width={14} height={14} rx={2} {...blue} />
          <rect x={114} y={98} width={14} height={14} rx={2} {...blue} />
        </>
      );
    case "senang":
      return (
        <>
          <path d="M70 110 L79 100 L88 110" {...line} />
          <path d="M112 110 L121 100 L130 110" {...line} />
        </>
      );
    case "kaget":
      return (
        <>
          <rect x={72} y={90} width={14} height={28} rx={7} {...blue} />
          <rect x={114} y={90} width={14} height={28} rx={7} {...blue} />
        </>
      );
    case "malu":
      return (
        <>
          <path d="M70 94 L88 104 L70 114" {...line} />
          <path d="M130 94 L112 104 L130 114" {...line} />
        </>
      );
    case "sedih":
      return (
        <>
          <rect x={72} y={106} width={14} height={11} rx={2} {...blue} />
          <rect x={114} y={106} width={14} height={11} rx={2} {...blue} />
        </>
      );
    case "marah":
      return (
        <>
          <path d="M68 92 L90 99" {...line} />
          <path d="M132 92 L110 99" {...line} />
          <path d="M72 108 L86 112 M128 108 L114 112" {...line} strokeWidth={6} />
        </>
      );
  }
};

const Antennas: React.FC<{ readonly xs: readonly number[] }> = ({ xs }) => (
  <>
    {xs.map((x) => (
      <g key={x}>
        <rect x={x - 5} y={30} width={10} height={24} rx={2} fill={C.blue} />
        <rect x={x - 5} y={44} width={10} height={14} fill={C.orange} />
      </g>
    ))}
  </>
);

const Legs: React.FC<{ readonly xs: readonly number[] }> = ({ xs }) => (
  <>
    {xs.map((x) => (
      <g key={x}>
        <rect x={x - 11} y={156} width={22} height={22} fill={C.orange} />
        <rect x={x - 13} y={176} width={26} height={12} rx={3} fill={C.cream} />
        <rect x={x - 11} y={156} width={22} height={5} fill={C.orangeDark} opacity={0.5} />
      </g>
    ))}
  </>
);

const Ear: React.FC<{ readonly x: number; readonly w?: number }> = ({ x, w = 24 }) => (
  <rect x={x} y={78} width={w} height={54} rx={8} fill={C.cream} stroke={C.skinShade} strokeWidth={1.5} />
);

const Front: React.FC<{ readonly expression: RobotExpression; readonly blink: boolean }> = (p) => (
  <g>
    <Antennas xs={[74, 126]} />
    <Legs xs={[78, 122]} />
    <Ear x={22} />
    <Ear x={154} />
    <rect x={42} y={56} width={116} height={106} rx={14} fill={C.orange} />
    <rect x={42} y={150} width={116} height={12} rx={6} fill={C.orangeDark} opacity={0.45} />
    <rect x={56} y={70} width={88} height={68} rx={8} fill={C.ink} />
    <ScreenFace {...p} />
  </g>
);

const ThreeQuarter: React.FC<{ readonly expression: RobotExpression; readonly blink: boolean }> = (p) => (
  <g>
    <Antennas xs={[70, 120]} />
    <Legs xs={[76, 118]} />
    <Ear x={20} w={22} />
    <rect x={40} y={56} width={110} height={106} rx={14} fill={C.orange} />
    <rect x={40} y={150} width={110} height={12} rx={6} fill={C.orangeDark} opacity={0.45} />
    <g transform="translate(14 0) translate(100 0) scale(0.86 1) translate(-100 0)">
      <rect x={56} y={70} width={88} height={68} rx={8} fill={C.ink} />
      <ScreenFace {...p} />
    </g>
    <rect x={150} y={70} width={30} height={66} rx={8} fill={C.cream} stroke={C.skinShade} strokeWidth={1.5} />
  </g>
);

const Side: React.FC<{ readonly blink: boolean }> = ({ blink }) => (
  <g>
    <Antennas xs={[84, 116]} />
    <Legs xs={[92, 112]} />
    <rect x={64} y={56} width={72} height={106} rx={12} fill={C.orange} />
    <rect x={64} y={150} width={72} height={12} rx={6} fill={C.orangeDark} opacity={0.45} />
    <rect x={64} y={72} width={22} height={62} rx={6} fill={C.ink} />
    <rect x={69} y={blink ? 102 : 94} width={4} height={blink ? 2 : 16} fill={C.blue} />
    <rect x={77} y={blink ? 102 : 94} width={4} height={blink ? 2 : 16} fill={C.blue} />
    <rect x={106} y={74} width={36} height={60} rx={10} fill={C.cream} stroke={C.skinShade} strokeWidth={1.5} />
  </g>
);

const Back: React.FC = () => (
  <g>
    <Antennas xs={[74, 126]} />
    <Legs xs={[78, 122]} />
    <Ear x={22} />
    <Ear x={154} />
    <rect x={42} y={56} width={116} height={106} rx={14} fill={C.orange} />
    <rect x={42} y={150} width={116} height={12} rx={6} fill={C.orangeDark} opacity={0.45} />
  </g>
);

export const Robot: React.FC<RobotProps> = ({
  expression = "normal",
  view = "front",
  animated = false,
  width = 200,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const blink = animated && isBlinking(frame, fps);
  const bob = animated ? Math.sin(t * 2.6) * 3 : 0;

  return (
    <svg
      viewBox="0 20 200 190"
      width={width}
      height={(width * 190) / 200}
      style={{ overflow: "visible", ...style }}
    >
      <ellipse cx={100} cy={190} rx={52} ry={5} fill={C.ink} opacity={0.14} />
      <g transform={`translate(0 ${bob})`}>
        {view === "front" && <Front expression={expression} blink={blink} />}
        {view === "threeQuarter" && <ThreeQuarter expression={expression} blink={blink} />}
        {view === "side" && <Side blink={blink} />}
        {view === "back" && <Back />}
      </g>
    </svg>
  );
};
