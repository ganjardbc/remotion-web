import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { useTheme } from "../../themes";
import { useSpringIn } from "../OpenCode9Router/parts";
import { Mascot, type Mood } from "./Mascot";

export type ArtName =
  | "turing"
  | "dartmouth"
  | "eliza"
  | "winter"
  | "chess"
  | "network"
  | "attention"
  | "chatgpt";

export const ART_W = 920;
export const ART_H = 300;

const SOFT = "#CED7F3";
const EYE = "#9DB4F0";

// 0 → 1 spring starting `sec` seconds into the scene.
const useIn = (sec: number): number => {
  const { fps } = useVideoConfig();
  return Math.min(1, Math.max(0, useSpringIn(Math.round(sec * fps))));
};

type P = { readonly t: ReturnType<typeof useTheme> };

const Bubble: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
  readonly fill: string;
  readonly stroke?: string;
  readonly p: number;
  readonly children?: React.ReactNode;
}> = ({ x, y, w, h, fill, stroke, p, children }) => (
  <g
    style={{
      transformBox: "fill-box",
      transformOrigin: "center",
      transform: `scale(${0.7 + 0.3 * p})`,
      opacity: p,
    }}
  >
    <rect
      x={x}
      y={y}
      width={w}
      height={h}
      rx={h / 2.6}
      fill={fill}
      stroke={stroke}
      strokeWidth={4}
    />
    {children}
  </g>
);

const Turing: React.FC<P> = ({ t }) => {
  const frame = useCurrentFrame();
  const a = useIn(0.9);
  const b = useIn(2.4);
  return (
    <>
      <Bubble x={30} y={30} w={600} h={90} fill="#F2F3F7" p={a}>
        <text
          x={62}
          y={88}
          fontSize={38}
          fontWeight={600}
          fill={t.colors.ink}
          fontFamily={t.fonts.body}
        >
          Kamu manusia atau mesin?
        </text>
      </Bubble>
      <Bubble
        x={200}
        y={160}
        w={300}
        h={90}
        fill={t.code.raised}
        stroke={t.colors.accent}
        p={b}
      >
        {[0, 1, 2].map((i) => (
          <circle
            key={i}
            cx={290 + i * 50}
            cy={205 - Math.max(0, Math.sin((frame - i * 5) / 5)) * 12}
            r={11}
            fill={t.colors.accent}
          />
        ))}
      </Bubble>
    </>
  );
};

const Dartmouth: React.FC<P> = ({ t }) => {
  const frame = useCurrentFrame();
  const board = useIn(0.9);
  const ai = useIn(2.2);
  const stars = [
    [70, 60],
    [560, 50],
    [590, 220],
    [90, 230],
    [330, 36],
  ];
  return (
    <>
      <g style={{ opacity: board }}>
        <rect
          x={30}
          y={20}
          width={620}
          height={260}
          rx={22}
          fill="#10281F"
          stroke="#7A5A3A"
          strokeWidth={10}
        />
        <text
          x={60}
          y={62}
          fontSize={26}
          fill={SOFT}
          opacity={0.7}
          fontFamily={t.fonts.mono}
        >
          Dartmouth · musim panas 1956
        </text>
      </g>
      <g
        style={{
          transformBox: "fill-box",
          transformOrigin: "center",
          transform: `scale(${0.6 + 0.4 * ai})`,
          opacity: ai,
        }}
      >
        <text
          x={340}
          y={218}
          fontSize={170}
          fontWeight={800}
          textAnchor="middle"
          fill={t.colors.accent}
          fontFamily={t.fonts.heading}
        >
          AI
        </text>
      </g>
      {stars.map(([x, y], i) => {
        const s = 0.6 + 0.4 * Math.sin((frame + i * 17) / 9);
        return (
          <path
            key={i}
            d="M0 -14 L4 -4 L14 0 L4 4 L0 14 L-4 4 L-14 0 L-4 -4 Z"
            transform={`translate(${x} ${y}) scale(${s * ai})`}
            fill="#F2F3F7"
          />
        );
      })}
    </>
  );
};

const Eliza: React.FC<P> = ({ t }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const win = useIn(0.9);
  const u = useIn(2.2);
  const e = useIn(3.6);
  const reply = "Ceritakan lebih banyak…";
  const chars = Math.max(0, Math.floor((frame - 3.8 * fps) * 0.9));
  return (
    <>
      <g style={{ opacity: win }}>
        <rect
          x={30}
          y={14}
          width={640}
          height={272}
          rx={20}
          fill={t.code.raised}
          stroke={t.code.line}
          strokeWidth={3}
        />
        <rect x={30} y={14} width={640} height={50} rx={20} fill="#1E2740" />
        {[0, 1, 2].map((i) => (
          <circle
            key={i}
            cx={66 + i * 30}
            cy={39}
            r={9}
            fill={[t.colors.accent, EYE, SOFT][i]}
          />
        ))}
        <text
          x={620}
          y={47}
          fontSize={24}
          textAnchor="end"
          fill={SOFT}
          opacity={0.7}
          fontFamily={t.fonts.mono}
        >
          ELIZA
        </text>
      </g>
      <Bubble x={170} y={90} w={480} h={72} fill="#F2F3F7" p={u}>
        <text
          x={200}
          y={138}
          fontSize={34}
          fontWeight={600}
          fill={t.colors.ink}
          fontFamily={t.fonts.body}
        >
          Aku lagi sedih hari ini.
        </text>
      </Bubble>
      <Bubble x={60} y={190} w={540} h={72} fill={t.colors.accent} p={e}>
        <text
          x={90}
          y={238}
          fontSize={34}
          fontWeight={600}
          fill={t.colors.onAccent}
          fontFamily={t.fonts.body}
        >
          {reply.slice(0, chars)}
        </text>
      </Bubble>
    </>
  );
};

const Winter: React.FC<P> = ({ t }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const draw = interpolate(frame, [0.8 * fps, 4.2 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const len = 640;
  return (
    <>
      <text
        x={40}
        y={44}
        fontSize={26}
        fill={SOFT}
        opacity={0.75}
        fontFamily={t.fonts.mono}
      >
        dana riset AI
      </text>
      <line
        x1={40}
        y1={260}
        x2={640}
        y2={260}
        stroke={t.code.line}
        strokeWidth={4}
      />
      <path
        d="M40 70 C160 60 220 80 300 150 S520 240 640 250"
        fill="none"
        stroke={EYE}
        strokeWidth={10}
        strokeLinecap="round"
        strokeDasharray={len}
        strokeDashoffset={len * (1 - draw)}
        pathLength={len}
      />
      {Array.from({ length: 16 }, (_, i) => {
        const x = 40 + ((i * 97) % 620);
        const speed = 1.2 + (i % 4) * 0.5;
        const y = ((frame * speed + i * 53) % 330) - 15;
        return (
          <circle
            key={i}
            cx={x + Math.sin((frame + i * 9) / 18) * 12}
            cy={y}
            r={4 + (i % 3) * 2}
            fill="#F2F3F7"
            opacity={0.75}
          />
        );
      })}
    </>
  );
};

const King: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly fill: string;
}> = ({ x, y, fill }) => (
  <g transform={`translate(${x} ${y})`} fill={fill}>
    <rect x={-3} y={-60} width={6} height={22} rx={2} />
    <rect x={-11} y={-52} width={22} height={6} rx={2} />
    <circle cx={0} cy={-26} r={16} />
    <path d="M-18 24 L-10 -12 L10 -12 L18 24 Z" />
    <rect x={-24} y={22} width={48} height={12} rx={5} />
  </g>
);

const Chess: React.FC<P> = ({ t }) => {
  const frame = useCurrentFrame();
  const board = useIn(0.9);
  const s1 = useIn(2.6);
  const s2 = useIn(3.3);
  const slide = interpolate(frame % 90, [0, 45, 90], [0, 1, 0]);
  return (
    <>
      <g style={{ opacity: board }}>
        {Array.from({ length: 64 }, (_, i) => {
          const c = i % 8;
          const r = Math.floor(i / 8);
          return (
            <rect
              key={i}
              x={30 + c * 34}
              y={14 + r * 34}
              width={34}
              height={34}
              fill={(c + r) % 2 ? "#3051B8" : "#CED7F3"}
            />
          );
        })}
        <King
          x={30 + 3 * 34 + 17 + slide * 34}
          y={14 + 5 * 34 + 20}
          fill="#FFFFFF"
        />
        <King
          x={30 + 5 * 34 + 17}
          y={14 + 2 * 34 + 20}
          fill={t.colors.ground}
        />
      </g>
      <Bubble x={340} y={40} w={310} h={90} fill="#F2F3F7" p={s1}>
        <text
          x={366}
          y={100}
          fontSize={34}
          fontWeight={700}
          fill={t.colors.ink}
          fontFamily={t.fonts.heading}
        >
          Deep Blue 3½
        </text>
      </Bubble>
      <Bubble
        x={340}
        y={160}
        w={310}
        h={90}
        fill={t.code.raised}
        stroke={t.code.line}
        p={s2}
      >
        <text
          x={366}
          y={220}
          fontSize={34}
          fontWeight={700}
          fill={t.code.text}
          fontFamily={t.fonts.heading}
        >
          Kasparov 2½
        </text>
      </Bubble>
    </>
  );
};

const Network: React.FC<P> = ({ t }) => {
  const frame = useCurrentFrame();
  const reveal = useIn(0.9);
  const layers = [3, 5, 5, 3];
  const xs = [90, 270, 450, 630];
  const pos = layers.map((n, li) =>
    Array.from({ length: n }, (_, i) => ({
      x: xs[li],
      y: 150 + (i - (n - 1) / 2) * 52,
    })),
  );
  const wave = (frame / 18) % (layers.length + 1);
  return (
    <g style={{ opacity: reveal }}>
      {pos
        .slice(0, -1)
        .flatMap((from, li) =>
          from.flatMap((a, i) =>
            pos[li + 1].map((b, j) => (
              <line
                key={`${li}-${i}-${j}`}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke={SOFT}
                strokeOpacity={0.22}
                strokeWidth={2}
              />
            )),
          ),
        )}
      {pos.flatMap((layer, li) =>
        layer.map((n, i) => {
          const lit = Math.max(0, 1 - Math.abs(wave - li - 0.4));
          return (
            <circle
              key={`${li}-${i}`}
              cx={n.x}
              cy={n.y}
              r={16 + lit * 4}
              fill={lit > 0.3 ? t.colors.accent : "#1E2740"}
              stroke={lit > 0.3 ? t.colors.accent : EYE}
              strokeWidth={4}
            />
          );
        }),
      )}
    </g>
  );
};

const WORDS: readonly (readonly [string, number, number])[] = [
  ["Attention", 40, 170],
  ["Is", 230, 70],
  ["All", 320, 78],
  ["You", 418, 88],
  ["Need", 526, 108],
];

const Attention: React.FC<P> = ({ t }) => {
  const reveal = useIn(0.9);
  const draw = useIn(2.4);
  const from = WORDS[0][1] + WORDS[0][2] / 2;
  return (
    <>
      {WORDS.slice(1).map(([w, x, width], i) => {
        const to = x + width / 2;
        const lift = 60 + (to - from) / 4;
        return (
          <path
            key={w}
            d={`M${from} 205 C${from} ${205 - lift} ${to} ${205 - lift} ${to} 205`}
            fill="none"
            stroke={t.colors.accent}
            strokeWidth={8 - i * 1.5}
            strokeLinecap="round"
            strokeOpacity={1 - i * 0.18}
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - draw}
          />
        );
      })}
      {WORDS.map(([w, x, width], i) => (
        <g key={w} style={{ opacity: reveal }}>
          <rect
            x={x}
            y={210}
            width={width + (i === 0 ? 0 : 0)}
            height={64}
            rx={18}
            fill={i === 0 ? t.colors.accent : "#F2F3F7"}
          />
          <text
            x={x + width / 2}
            y={253}
            fontSize={30}
            fontWeight={700}
            textAnchor="middle"
            fill={i === 0 ? t.colors.onAccent : t.colors.ink}
            fontFamily={t.fonts.heading}
          >
            {w}
          </text>
        </g>
      ))}
    </>
  );
};

const ChatGpt: React.FC<P> = ({ t }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const q = useIn(0.9);
  const a = useIn(2.8);
  const typed = "Tentu! Bayangkan AI seperti…";
  const chars = Math.max(0, Math.floor((frame - 3 * fps) * 0.9));
  return (
    <>
      <Bubble x={170} y={24} w={480} h={80} fill="#F2F3F7" p={q}>
        <text
          x={200}
          y={76}
          fontSize={32}
          fontWeight={600}
          fill={t.colors.ink}
          fontFamily={t.fonts.body}
        >
          Jelaskan AI untuk anak SD
        </text>
      </Bubble>
      <Bubble
        x={30}
        y={130}
        w={620}
        h={80}
        fill={t.code.raised}
        stroke={t.colors.accent}
        p={a}
      >
        <path
          d="M64 156 l5 11 11 5 -11 5 -5 11 -5 -11 -11 -5 11 -5 Z"
          fill={t.colors.accent}
        />
        <text
          x={104}
          y={182}
          fontSize={32}
          fontWeight={600}
          fill={t.code.text}
          fontFamily={t.fonts.body}
        >
          {typed.slice(0, chars)}
        </text>
      </Bubble>
      <rect
        x={30}
        y={232}
        width={620}
        height={52}
        rx={26}
        fill="none"
        stroke={t.code.line}
        strokeWidth={3}
      />
      <text
        x={62}
        y={268}
        fontSize={26}
        fill={SOFT}
        opacity={0.6}
        fontFamily={t.fonts.body}
      >
        Tulis pertanyaanmu di sini
      </text>
    </>
  );
};

const arts: Record<ArtName, React.FC<P>> = {
  turing: Turing,
  dartmouth: Dartmouth,
  eliza: Eliza,
  winter: Winter,
  chess: Chess,
  network: Network,
  attention: Attention,
  chatgpt: ChatGpt,
};

export const Art: React.FC<{ readonly name: ArtName; readonly mood: Mood }> = ({
  name,
  mood,
}) => {
  const t = useTheme();
  const Scene = arts[name];
  const m = useIn(1.4);
  return (
    <svg
      width="100%"
      viewBox={`0 0 ${ART_W} ${ART_H}`}
      style={{ display: "block", overflow: "visible" }}
    >
      <Scene t={t} />
      <g style={{ opacity: m }}>
        <Mascot mood={mood} x={730} y={34} scale={1.05} />
      </g>
    </svg>
  );
};
