import type React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import {
  isBlinking,
  PALETTE as C,
  type CharacterExpression,
  type CharacterView,
  type HairStyle,
} from "./palette";

export type CharacterProps = {
  readonly expression?: CharacterExpression;
  readonly view?: CharacterView;
  // Hanya kepala + bahu. Tangan di dagu (mikir/bingung) hanya tampil di mode ini.
  readonly bust?: boolean;
  // Napas, kedip, dan bicara mengikuti frame.
  readonly animated?: boolean;
  readonly talking?: boolean;
  readonly hair?: HairStyle;
  readonly width?: number;
  readonly style?: React.CSSProperties;
};

const stroke = {
  stroke: C.ink,
  strokeWidth: 3.2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  fill: "none",
  vectorEffect: "non-scaling-stroke" as const,
};

type FaceProps = {
  readonly expression: CharacterExpression;
  readonly blink: boolean;
  readonly mouthOpen: number | null;
  readonly hideLeft?: boolean;
};

const Eye: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly kind: "open" | "wide" | "happy" | "closed" | "narrow";
  readonly blink: boolean;
}> = ({ x, y, kind, blink }) => {
  if (kind === "happy") {
    return <path d={`M${x - 7} ${y + 3} Q${x} ${y - 9} ${x + 7} ${y + 3}`} {...stroke} />;
  }
  if (kind === "closed" || blink) {
    return <path d={`M${x - 7} ${y} Q${x} ${y + 6} ${x + 7} ${y}`} {...stroke} />;
  }
  const dims = {
    open: [5.5, 7.5],
    wide: [6.2, 9.5],
    narrow: [5.5, 4.2],
  }[kind];
  return <ellipse cx={x} cy={y} rx={dims[0]} ry={dims[1]} fill={C.ink} />;
};

const EYE_KIND: Record<CharacterExpression, "open" | "wide" | "happy" | "closed" | "narrow"> = {
  senang: "open",
  bingung: "open",
  kaget: "wide",
  senyumSantai: "closed",
  serius: "open",
  kesal: "narrow",
  mikir: "open",
  mataTertutup: "happy",
};

const BROWS: Record<CharacterExpression, readonly [string, string]> = {
  senang: ["M66 93 Q76 88 88 92", "M112 92 Q124 88 134 93"],
  bingung: ["M66 94 Q76 86 88 91", "M112 98 L134 96"],
  kaget: ["M67 88 Q77 80 89 86", "M111 86 Q123 80 133 88"],
  senyumSantai: ["M68 95 Q77 91 87 94", "M113 94 Q123 91 132 95"],
  serius: ["M66 95 L88 98", "M112 98 L134 95"],
  kesal: ["M65 91 L89 101", "M111 101 L135 91"],
  mikir: ["M66 96 L88 97", "M112 90 Q122 85 134 90"],
  mataTertutup: ["M66 92 Q76 87 88 91", "M112 91 Q124 87 134 92"],
};

const Mouth: React.FC<{
  readonly expression: CharacterExpression;
  readonly open: number | null;
}> = ({ expression, open }) => {
  // Mode bicara: bukaan mulut 0..1 menimpa ekspresi.
  if (open !== null) {
    return <ellipse cx={100} cy={131} rx={6} ry={1.5 + open * 5.5} fill={C.ink} />;
  }
  switch (expression) {
    case "senang":
    case "mataTertutup":
      return (
        <>
          <path d="M85 124 Q100 148 115 124 Z" fill={C.ink} stroke={C.ink} strokeWidth={2.4} strokeLinejoin="round" />
          <path d="M92 137 Q100 132 108 137 Q100 143 92 137 Z" fill={C.mouth} />
        </>
      );
    case "bingung":
      return <path d="M91 133 Q96 128 101 133 Q106 137 110 131" {...stroke} />;
    case "kaget":
      return <ellipse cx={100} cy={133} rx={4.5} ry={6} fill={C.ink} />;
    case "senyumSantai":
      return <path d="M90 128 Q100 138 110 128" {...stroke} />;
    case "serius":
      return <path d="M92 132 L108 132" {...stroke} />;
    case "kesal":
      return <path d="M90 136 Q100 126 110 136" {...stroke} />;
    case "mikir":
      return <path d="M93 132 Q101 130 108 131" {...stroke} />;
  }
};

// Wajah dari depan, koordinat kepala 200 x 200, pusat (100, 100).
const Face: React.FC<FaceProps> = ({ expression, blink, mouthOpen, hideLeft }) => {
  const kind = EYE_KIND[expression];
  const [browL, browR] = BROWS[expression];
  return (
    <g>
      {!hideLeft && <path d={browL} {...stroke} strokeWidth={3} />}
      <path d={browR} {...stroke} strokeWidth={3} />
      {!hideLeft && <Eye x={78} y={110} kind={kind} blink={blink} />}
      <Eye x={122} y={110} kind={kind} blink={blink} />
      <Mouth expression={expression} open={mouthOpen} />
      {(expression === "senang" || expression === "mataTertutup") && (
        <>
          <ellipse cx={70} cy={124} rx={7} ry={4} fill={C.mouth} opacity={0.18} />
          <ellipse cx={130} cy={124} rx={7} ry={4} fill={C.mouth} opacity={0.18} />
        </>
      )}
    </g>
  );
};

// Tanda kecil di samping kepala (tanda tanya, urat marah, kilau).
const Mark: React.FC<{ readonly expression: CharacterExpression }> = ({ expression }) => {
  switch (expression) {
    case "bingung":
      return (
        <text x={150} y={52} fontSize={44} fontWeight={700} fill={C.ink} fontFamily="sans-serif" transform="rotate(12 150 40)">
          ?
        </text>
      );
    case "kesal":
      return (
        <g {...stroke} strokeWidth={3} stroke={C.ink}>
          <path d="M146 40 Q152 46 146 52 M146 40 Q140 46 146 52" />
          <path d="M160 36 L156 42 M164 48 L158 48 M160 60 L156 55 M132 36 L136 42" />
        </g>
      );
    case "kaget":
    case "senang":
    case "mataTertutup":
      return (
        <g stroke={C.yellow} strokeWidth={3.6} strokeLinecap="round" fill="none">
          <path d="M160 92 L172 86" />
          <path d="M162 106 L176 106" />
          <path d="M160 120 L172 126" />
        </g>
      );
    case "senyumSantai":
      return (
        <g stroke={C.yellow} strokeWidth={3.6} strokeLinecap="round" fill="none">
          <path d="M162 100 L174 96" />
          <path d="M162 112 L174 114" />
        </g>
      );
    default:
      return null;
  }
};

// Kulit ala minifigure LEGO: kuning, dengan sedikit gradasi silinder.
const LEGO_SKIN = "#f7c53a";
const LEGO_SHADE = "#d9a21c";

const LegoDefs: React.FC = () => (
  <defs>
    <linearGradient id="lego-skin" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0" stopColor={LEGO_SKIN} />
      <stop offset="0.7" stopColor={LEGO_SKIN} />
      <stop offset="1" stopColor={LEGO_SHADE} />
    </linearGradient>
  </defs>
);

const HAIR_FRONT: Record<HairStyle, string> = {
  klasik: "M54 114 C46 70 66 48 100 48 C134 48 154 70 146 114 L140 100 L138 82 C122 86 96 82 84 72 C78 82 68 86 62 90 L60 102 Z",
  poni: "M52 118 C44 72 62 46 100 46 C138 46 156 72 148 118 L142 104 L140 90 L130 84 L120 92 L108 82 L96 92 L82 84 L70 92 L60 104 Z",
  mohawk: "M60 86 C66 64 84 58 100 58 C116 58 134 64 140 86 Q120 74 100 74 Q80 74 60 86 Z M88 64 L92 26 Q100 18 108 26 L112 64 Z",
  acak: "M56 124 L52 100 L44 94 L54 84 L40 70 L58 68 L52 50 L72 56 L72 36 L88 48 L96 26 L108 46 L124 30 L124 52 L142 42 L138 62 L158 62 L146 78 L160 90 L146 98 L144 124 L138 104 L132 88 L122 92 L112 80 L100 90 L88 80 L78 92 L68 86 L62 100 Z",
  cepol: "M54 114 C46 70 66 48 100 48 C134 48 154 70 146 114 L140 100 L138 82 C122 86 96 82 84 72 C78 82 68 86 62 90 L60 102 Z M84 36 A16 16 0 1 1 116 36 A16 16 0 1 1 84 36 Z M92 46 L108 46 L106 56 L94 56 Z",
};

const HAIR_SIDE: Record<HairStyle, string> = {
  klasik: "M54 124 C44 76 60 46 100 46 C134 46 150 60 146 84 Q126 88 112 78 Q96 94 90 104 L88 128 Z",
  poni: "M54 124 C44 76 60 46 100 46 C134 46 150 60 148 92 L138 90 L130 80 Q112 86 100 80 Q94 94 90 104 L88 128 Z",
  mohawk: "M70 88 C76 68 90 62 104 62 C118 62 126 70 128 82 Q110 76 96 82 Q80 84 70 88 Z M86 66 L92 26 Q100 18 108 26 L116 66 Z",
  acak: "M54 126 L48 104 L40 96 L52 88 L40 72 L58 70 L54 52 L74 58 L76 38 L92 50 L102 28 L114 48 L128 34 L128 56 L146 50 L142 70 L150 84 L138 90 L128 80 L116 90 L104 82 L96 100 L88 130 Z",
  cepol: "M54 124 C44 76 60 46 100 46 C134 46 150 60 146 84 Q126 88 112 78 Q96 94 90 104 L88 128 Z M62 48 A16 16 0 1 1 94 48 A16 16 0 1 1 62 48 Z",
};

const Hair: React.FC<{ readonly d: string; readonly transform?: string }> = ({ d, transform }) => (
  <path d={d} transform={transform} fill={C.ink} />
);

// Tangan LEGO berbentuk penjepit (C).
const ClawHand: React.FC<{ readonly x: number; readonly y: number; readonly flip?: boolean }> = ({ x, y, flip }) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -1 : 1} 1)`}>
    <circle r={9} fill={LEGO_SKIN} />
    <circle cx={4} cy={0} r={3.4} fill={LEGO_SHADE} />
  </g>
);

const Hand: React.FC<{ readonly x: number; readonly y: number }> = ({ x, y }) => (
  <ClawHand x={x} y={y} />
);

const HeadBase: React.FC = () => (
  <g>
    <rect x={58} y={64} width={84} height={88} rx={16} fill="url(#lego-skin)" />
    <rect x={58} y={146} width={84} height={6} rx={3} fill={LEGO_SHADE} opacity={0.35} />
  </g>
);

const HeadFront: React.FC<{ readonly handAtChin: boolean; readonly hair: HairStyle } & FaceProps> = ({ handAtChin, hair, ...face }) => (
  <g>
    <HeadBase />
    <Face {...face} />
    <Hair d={HAIR_FRONT[hair]} />
    {handAtChin && <Hand x={112} y={152} />}
  </g>
);

const HeadThreeQuarter: React.FC<{ readonly hair: HairStyle } & FaceProps> = ({ hair, ...face }) => (
  <g>
    <HeadBase />
    <g transform="translate(14 0) scale(0.88 1) translate(12 0)">
      <Face {...face} />
    </g>
    <Hair d={HAIR_FRONT[hair]} transform="translate(-4 0)" />
  </g>
);

const HeadSide: React.FC<{ readonly hair: HairStyle } & FaceProps> = ({ hair, ...face }) => (
  <g>
    <HeadBase />
    <g transform="translate(56 0) scale(0.6 1)">
      <Face {...face} hideLeft />
    </g>
    <Hair d={HAIR_SIDE[hair]} />
  </g>
);

const HeadBack: React.FC<{ readonly hair: HairStyle }> = ({ hair }) => (
  <g>
    <HeadBase />
    {hair === "mohawk" ? (
      <>
        <path d="M60 86 C66 64 84 58 100 58 C116 58 134 64 140 86 L140 96 L60 96 Z" fill={C.ink} />
        <path d="M88 64 L92 26 Q100 18 108 26 L112 64 L112 150 L88 150 Z" fill={C.ink} />
      </>
    ) : (
      <>
        <rect x={56} y={62} width={88} height={92} rx={18} fill={C.ink} />
        <path d={HAIR_FRONT[hair]} fill={C.ink} />
      </>
    )}
  </g>
);

// Badan minifigure LEGO. sx mengecilkan lebar untuk tampak samping / 3/4.
const Body: React.FC<{ readonly view: CharacterView }> = ({ view }) => {
  const sx = view === "side" ? 0.62 : view === "threeQuarter" ? 0.9 : 1;
  const shift = view === "side" ? 4 : view === "threeQuarter" ? 2 : 0;
  return (
    <g transform={`translate(${shift} 0) translate(100 0) scale(${sx} 1) translate(-100 0)`}>
      {/* leher / stud */}
      <rect x={90} y={150} width={20} height={10} rx={3} fill={LEGO_SHADE} />
      {/* kaki: dua balok hitam + sepatu putih */}
      <rect x={58} y={236} width={41} height={56} rx={3} fill={C.ink} />
      <rect x={101} y={236} width={41} height={56} rx={3} fill={C.ink} />
      <rect x={62} y={250} width={14} height={14} rx={2} fill={C.ink} stroke={C.gray} strokeWidth={1.4} />
      <rect x={124} y={250} width={14} height={14} rx={2} fill={C.ink} stroke={C.gray} strokeWidth={1.4} />
      <rect x={56} y={284} width={45} height={10} rx={3} fill={C.white} stroke={C.ink} strokeWidth={1.3} />
      <rect x={99} y={284} width={45} height={10} rx={3} fill={C.white} stroke={C.ink} strokeWidth={1.3} />
      {/* pinggul */}
      <rect x={56} y={224} width={88} height={16} rx={3} fill={C.ink} />
      <path d="M100 226 L100 238" stroke={C.gray} strokeWidth={1.5} opacity={0.5} />
      {/* lengan: lengan baju hitam + tangan penjepit */}
      <path d="M40 162 L58 162 L56 224 L38 224 Z" fill={LEGO_SKIN} />
      <path d="M142 162 L160 162 L162 224 L144 224 Z" fill={LEGO_SKIN} />
      <path d="M38 160 L58 160 L57 200 L37 200 Z" fill={C.ink} />
      <path d="M142 160 L162 160 L163 200 L143 200 Z" fill={C.ink} />
      <ClawHand x={47} y={232} />
      <ClawHand x={153} y={232} flip />
      {/* torso kaos hitam */}
      <path d="M56 158 L144 158 L142 228 L58 228 Z" fill={C.ink} />
      <path d="M82 158 Q100 172 118 158" stroke={C.gray} strokeWidth={1.6} fill="none" opacity={0.6} />
      <rect x={56} y={220} width={88} height={3} fill={C.gray} opacity={0.3} />
    </g>
  );
};

const FULL_BOX = "0 0 200 305";
const BUST_BOX = "20 0 160 210";

export const Character: React.FC<CharacterProps> = ({
  expression = "senang",
  view = "front",
  bust = false,
  animated = false,
  talking = false,
  hair = "acak",
  width = 300,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const blink = animated && isBlinking(frame, fps);
  const bob = animated ? Math.sin(t * 2.1) * 1.6 : 0;
  const mouthOpen = talking ? Math.abs(Math.sin(t * 11)) : null;
  const faceProps: FaceProps = { expression, blink, mouthOpen };
  const showHand = bust && view === "front" && (expression === "mikir" || expression === "bingung");

  const [vx, vy, vw, vh] = (bust ? BUST_BOX : FULL_BOX).split(" ").map(Number);

  return (
    <svg
      viewBox={`${vx} ${vy} ${vw} ${vh}`}
      width={width}
      height={(width * vh) / vw}
      style={{ overflow: "visible", ...style }}
    >
      <g transform={`translate(0 ${bob})`}>
        {/* bayangan tanah */}
        {!bust && <ellipse cx={100} cy={297} rx={66} ry={7} fill={C.ink} opacity={0.12} />}
        <LegoDefs />
        <Body view={view} />
        {view === "front" && <HeadFront {...faceProps} hair={hair} handAtChin={showHand} />}
        {view === "threeQuarter" && <HeadThreeQuarter {...faceProps} hair={hair} />}
        {view === "side" && <HeadSide {...faceProps} hair={hair} />}
        {view === "back" && <HeadBack hair={hair} />}
        {view === "front" && <Mark expression={expression} />}
      </g>
    </svg>
  );
};
