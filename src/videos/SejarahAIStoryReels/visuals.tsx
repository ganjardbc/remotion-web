import type React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { useTheme } from "../../themes";
import type { TimedLine, VisualKind } from "./config";

// Satu gagasan per scene, digambar besar. Kemunculan mengikuti waktu kalimat, bukan detik tetap, supaya sinkron dengan suara.
type VisualProps = { readonly lines: readonly TimedLine[] };

const useReveal = (): ((start: number, dur?: number) => number) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (start, dur = 0.5) =>
    interpolate(frame, [start * fps, (start + dur) * fps], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(...t.motion.enter),
    });
};

const Stack: React.FC<{ readonly children: React.ReactNode; readonly gap?: number }> = ({ children, gap = 36 }) => (
  <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap, position: "relative" }}>
    {children}
  </div>
);

const Pill: React.FC<{
  readonly children: React.ReactNode;
  readonly show: number;
  readonly accent?: boolean;
  readonly size?: number;
}> = ({ children, show, accent = false, size = 44 }) => {
  const t = useTheme();
  return (
    <div
      style={{
        background: accent ? t.colors.accent : t.colors.groundChipBg,
        color: accent ? t.colors.onAccent : t.colors.ink,
        borderRadius: 20,
        padding: "14px 34px",
        fontFamily: t.fonts.heading,
        fontWeight: 700,
        fontSize: size,
        whiteSpace: "nowrap",
        opacity: show,
        translate: `0 ${(1 - show) * 24}px`,
      }}
    >
      {children}
    </div>
  );
};

// Papan skor dua sisi; sisi kiri selalu pemenang (mesin).
const Score: React.FC<{
  readonly left: string;
  readonly right: string;
  readonly leftScore: string;
  readonly rightScore: string;
  readonly show: number;
}> = ({ left, right, leftScore, rightScore, show }) => {
  const t = useTheme();
  const side = (name: string, score: string, win: boolean) => (
    <div
      style={{
        width: 420,
        padding: "30px 0",
        borderRadius: 28,
        textAlign: "center",
        background: win ? t.colors.accent : t.code.raised,
        color: win ? t.colors.onAccent : t.colors.groundText,
      }}
    >
      <div style={{ fontFamily: t.fonts.heading, fontWeight: 800, fontSize: 120, lineHeight: 1.05 }}>{score}</div>
      <div style={{ fontFamily: t.fonts.body, fontWeight: 700, fontSize: 40 }}>{name}</div>
    </div>
  );
  return (
    <div style={{ display: "flex", gap: 40, opacity: show, scale: String(0.9 + show * 0.1) }}>
      {side(left, leftScore, true)}
      {side(right, rightScore, false)}
    </div>
  );
};

const Title: React.FC<VisualProps> = ({ lines }) => {
  const reveal = useReveal();
  const t = useTheme();
  const a = reveal(0.1, 0.6);
  return (
    <Stack gap={16}>
      <div
        style={{
          fontFamily: t.fonts.heading,
          fontWeight: 800,
          fontSize: 340,
          lineHeight: 1,
          letterSpacing: "-0.04em",
          color: t.colors.accent,
          opacity: a,
          scale: String(0.85 + a * 0.15),
        }}
      >
        AI
      </div>
      <Pill show={reveal(lines[0].at)}>Lahir kapan?</Pill>
    </Stack>
  );
};

const Turing: React.FC<VisualProps> = ({ lines }) => {
  const reveal = useReveal();
  const t = useTheme();
  const test = reveal(lines[2].at);
  const card: React.CSSProperties = {
    width: 340,
    height: 340,
    borderRadius: 32,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    opacity: test,
    scale: String(0.9 + test * 0.1),
  };
  return (
    <Stack>
      <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
        <div style={{ ...card, background: t.colors.groundChipBg }}>
          <svg width={200} height={220} viewBox="0 0 200 220">
            <circle cx={100} cy={64} r={56} fill={t.colors.ink} />
            <path d="M12 220 C12 140 188 140 188 220 Z" fill={t.colors.ink} />
          </svg>
        </div>
        <div style={{ display: "flex", gap: 14, opacity: test }}>
          {[0, 1, 2].map((i) => (
            <span key={i} style={{ width: 22, height: 22, borderRadius: "50%", background: t.colors.groundText }} />
          ))}
        </div>
        <div style={{ ...card, background: t.colors.accent, color: t.colors.onAccent, fontFamily: t.fonts.heading, fontWeight: 800, fontSize: 220 }}>?</div>
      </div>
      <Pill show={reveal(lines[2].at + 1.2)}>Manusia atau mesin?</Pill>
      <Pill show={reveal(lines[3].at)} accent size={40}>
        Turing Test
      </Pill>
    </Stack>
  );
};

const Dartmouth: React.FC<VisualProps> = ({ lines }) => {
  const reveal = useReveal();
  const t = useTheme();
  const typed = reveal(lines[1].at + 0.6, 1.6);
  const word = "Artificial Intelligence";
  const shown = word.slice(0, Math.round(typed * word.length));
  return (
    <Stack>
      <Pill show={reveal(0.3)}>Dartmouth, 1956</Pill>
      <div
        style={{
          fontFamily: t.fonts.heading,
          fontWeight: 800,
          fontSize: 124,
          lineHeight: 1.1,
          textAlign: "center",
          whiteSpace: "pre-line",
          color: t.colors.accent,
          minHeight: 280,
        }}
      >
        {shown.replace(" ", "\n")}
      </div>
    </Stack>
  );
};

const Winter: React.FC<VisualProps> = ({ lines }) => {
  const reveal = useReveal();
  const t = useTheme();
  const frame = useCurrentFrame();
  const draw = reveal(lines[0].at, lines[2].at - lines[0].at + 1);
  const W = 900;
  const H = 380;
  return (
    <Stack>
      {Array.from({ length: 8 }, (_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: 60 + i * 115,
            top: ((frame * (1.4 + (i % 3) * 0.5) + i * 83) % 560) - 20,
            fontSize: 44,
            color: t.colors.groundTextMuted,
            opacity: 0.45,
          }}
        >
          ❄
        </div>
      ))}
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ overflow: "visible" }}>
        <path d={`M0 ${H} L${W} ${H}`} stroke={t.colors.groundTextMuted} strokeWidth={4} />
        <path
          d={`M0 180 C160 20 300 20 440 120 S720 340 ${W} 350`}
          fill="none"
          stroke={t.colors.accent}
          strokeWidth={16}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - draw}
        />
      </svg>
      <Pill show={reveal(lines[2].at)}>Dana dan minat turun</Pill>
    </Stack>
  );
};

const Chess: React.FC<VisualProps> = ({ lines }) => {
  const reveal = useReveal();
  const t = useTheme();
  const king = reveal(0.3);
  return (
    <Stack>
      <div style={{ fontSize: 260, lineHeight: 1, color: t.colors.groundText, opacity: king, scale: String(0.85 + king * 0.15) }}>♚</div>
      <Score left="Deep Blue" leftScore="3,5" right="Kasparov" rightScore="2,5" show={reveal(lines[2].at)} />
    </Stack>
  );
};

const Go: React.FC<VisualProps> = ({ lines }) => {
  const reveal = useReveal();
  return (
    <Stack gap={56}>
      <Pill show={reveal(lines[0].at)}>2012: juara ImageNet</Pill>
      <Score left="AlphaGo" leftScore="4" right="Lee Sedol" rightScore="1" show={reveal(lines[1].at)} />
    </Stack>
  );
};

const WORDS = ["AI", "membaca", "seluruh", "kalimat"];
const LINKS: readonly (readonly [number, number])[] = [[0, 1], [1, 2], [2, 3], [0, 2], [1, 3], [0, 3]];

const Transformer: React.FC<VisualProps> = ({ lines }) => {
  const reveal = useReveal();
  const t = useTheme();
  const w = 225;
  const gap = 20;
  const total = WORDS.length * w + (WORDS.length - 1) * gap;
  return (
    <Stack gap={20}>
      <svg width={total} height={190} viewBox={`0 0 ${total} 190`} style={{ overflow: "visible" }}>
        {LINKS.map(([a, b], i) => {
          const ax = a * (w + gap) + w / 2;
          const bx = b * (w + gap) + w / 2;
          return (
            <path
              key={`${a}-${b}`}
              d={`M${ax} 186 Q${(ax + bx) / 2} ${186 - (bx - ax) * 0.55} ${bx} 186`}
              fill="none"
              stroke={t.colors.accent}
              strokeWidth={6}
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - reveal(lines[0].at + 0.8 + i * 0.3)}
            />
          );
        })}
      </svg>
      <div style={{ display: "flex", gap }}>
        {WORDS.map((word, i) => (
          <div key={word} style={{ width: w, display: "flex", justifyContent: "center" }}>
            <Pill show={reveal(lines[0].at + i * 0.15)} size={36}>
              {word}
            </Pill>
          </div>
        ))}
      </div>
      <div style={{ height: 40 }} />
      <Pill show={reveal(lines[2].at)} accent size={72}>
        ChatGPT
      </Pill>
    </Stack>
  );
};

const MILESTONES: readonly (readonly [string, string])[] = [
  ["1950", "Turing Test"],
  ["1956", "Nama AI"],
  ["1997", "Deep Blue"],
  ["2016", "AlphaGo"],
  ["2022", "ChatGPT"],
];

const Timeline: React.FC<VisualProps> = ({ lines }) => {
  const reveal = useReveal();
  const t = useTheme();
  return (
    <Stack gap={22}>
      {MILESTONES.map(([year, label], i) => {
        const show = reveal(lines[0].at + i * 0.5);
        return (
          <div key={year} style={{ display: "flex", alignItems: "center", gap: 36, width: 740, opacity: show, translate: `${(1 - show) * -40}px 0` }}>
            <span style={{ fontFamily: t.fonts.mono, fontWeight: 700, fontSize: 60, color: t.colors.accent }}>{year}</span>
            <span style={{ fontFamily: t.fonts.heading, fontWeight: 700, fontSize: 60, color: t.colors.groundText, whiteSpace: "nowrap" }}>{label}</span>
          </div>
        );
      })}
    </Stack>
  );
};

export const VISUALS: Record<VisualKind, React.FC<VisualProps>> = {
  title: Title,
  turing: Turing,
  dartmouth: Dartmouth,
  winter: Winter,
  chess: Chess,
  go: Go,
  transformer: Transformer,
  timeline: Timeline,
};
