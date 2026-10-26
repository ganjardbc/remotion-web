import type React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { useEra, type Era } from "./design";
import type { VisualKind } from "./config";

// Ilustrasi sederhana di tengah layar. Semua animasi murni dari frame lokal scene.
const useRevealer = (): ((start: number, dur?: number) => number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (start, dur = 0.6) =>
    interpolate(frame, [start * fps, (start + dur) * fps], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.2, 0.8, 0.2, 1),
    });
};

const line = (e: Era): string => `color-mix(in srgb, ${e.ink} 30%, transparent)`;

const Box: React.FC<{ readonly children: React.ReactNode; readonly style?: React.CSSProperties }> = ({
  children,
  style,
}) => (
  <div
    style={{
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      ...style,
    }}
  >
    {children}
  </div>
);

const Chip: React.FC<{
  readonly children: React.ReactNode;
  readonly show: number;
  readonly tone?: "light" | "dark" | "accent";
  readonly style?: React.CSSProperties;
}> = ({ children, show, tone = "dark", style }) => {
  const e = useEra();
  const bg = tone === "light" ? e.panel : tone === "accent" ? e.accent : `color-mix(in srgb, ${e.ink} 14%, transparent)`;
  const fg = tone === "light" ? e.panelInk : tone === "accent" ? e.onAccent : e.ink;
  return (
    <div
      style={{
        background: bg,
        color: fg,
        borderRadius: 18,
        padding: "14px 28px",
        fontFamily: e.fontHeading,
        fontWeight: 700,
        fontSize: 34,
        border: `2px solid ${tone === "light" ? "transparent" : line(e)}`,
        opacity: show,
        translate: `0 ${(1 - show) * 24}px`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

const Title: React.FC = () => {
  const reveal = useRevealer();
  const e = useEra();
  const frame = useCurrentFrame();
  const a = reveal(0.2, 0.8);
  const years = ["1950", "1956", "1997", "2012", "2017", "2022"];
  return (
    <Box>
      {[165, 120, 78].map((size, i) => (
        <div
          key={size}
          style={{
            position: "absolute",
            width: size * 2,
            height: size * 2,
            borderRadius: "50%",
            border: `2px dashed ${line(e)}`,
            transform: `rotate(${frame * (i % 2 ? -0.3 : 0.3)}deg) scale(${0.8 + a * 0.2})`,
            opacity: a,
          }}
        />
      ))}
      <div
        style={{
          fontFamily: e.fontHeading,
          fontWeight: 800,
          fontSize: 150,
          letterSpacing: "-0.04em",
          color: e.accent,
          opacity: a,
          scale: String(0.85 + a * 0.15),
        }}
      >
        AI
      </div>
      <div style={{ position: "absolute", bottom: 16, display: "flex", gap: 12 }}>
        {years.map((y, i) => (
          <Chip key={y} show={reveal(1 + i * 0.25)} style={{ fontSize: 24, padding: "8px 16px", fontFamily: e.fontMono }}>
            {y}
          </Chip>
        ))}
      </div>
    </Box>
  );
};

const Turing: React.FC = () => {
  const reveal = useRevealer();
  const q = reveal(0.4);
  const a = reveal(1.6);
  const verdict = reveal(3.6);
  return (
    <Box style={{ flexDirection: "column", gap: 18, alignItems: "stretch", padding: "0 40px" }}>
      <Chip show={q} tone="light" style={{ alignSelf: "flex-start", whiteSpace: "nowrap" }}>
        Apakah kamu manusia?
      </Chip>
      <Chip show={a} style={{ alignSelf: "flex-end", whiteSpace: "nowrap" }}>
        Tentu saja. Kamu sendiri?
      </Chip>
      <Chip show={verdict} tone="accent" style={{ alignSelf: "center" }}>
        Manusia atau mesin?
      </Chip>
    </Box>
  );
};

const Dartmouth: React.FC = () => {
  const reveal = useRevealer();
  const e = useEra();
  const card = reveal(0.3);
  const typed = reveal(2.2, 2.2);
  const word = "Artificial Intelligence";
  const shown = word.slice(0, Math.round(typed * word.length));
  return (
    <Box style={{ flexDirection: "column", gap: 14 }}>
      <Chip show={card} tone="light" style={{ fontFamily: e.fontMono, fontSize: 24, padding: "8px 22px" }}>
        Proyek Dartmouth, 1956
      </Chip>
      <div
        style={{
          fontFamily: e.fontHeading,
          fontWeight: 800,
          fontSize: 60,
          lineHeight: 1.1,
          textAlign: "center",
          whiteSpace: "pre-line",
          color: e.ink,
          minHeight: 132,
          opacity: interpolate(typed, [0, 0.05], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        {shown.replace(" ", "\n")}
        <span style={{ color: e.accent }}>|</span>
      </div>
      <Chip show={reveal(4.8)} tone="accent" style={{ fontSize: 28, padding: "8px 24px" }}>
        John McCarthy
      </Chip>
    </Box>
  );
};

const Winter: React.FC = () => {
  const reveal = useRevealer();
  const e = useEra();
  const frame = useCurrentFrame();
  const draw = reveal(0.6, 3.2);
  const W = 640;
  const H = 190;
  const pts: readonly (readonly [number, number])[] = [
    [0, 140], [100, 60], [200, 24], [300, 46], [400, 116], [500, 160], [640, 176],
  ];
  const d = pts.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join(" ");
  const flakes = Array.from({ length: 16 }, (_, i) => i);
  return (
    <Box style={{ flexDirection: "column", gap: 12 }}>
      {flakes.map((i) => {
        const x = ((i * 137) % 100) * 0.01 * 760;
        const speed = 1.2 + (i % 5) * 0.4;
        const y = ((frame * speed + i * 61) % 330) - 40;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              fontSize: 26 + (i % 3) * 8,
              color: "#cfe3ff",
              opacity: 0.45 * draw,
            }}
          >
            ❄
          </div>
        );
      })}
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ overflow: "visible" }}>
        <path d={`M0 ${H} L${W} ${H}`} stroke={line(e)} strokeWidth={3} />
        <path
          d={d}
          fill="none"
          stroke={e.accent}
          strokeWidth={8}
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - draw}
        />
      </svg>
      <div style={{ fontFamily: e.fontMono, fontSize: 28, color: e.muted }}>
        dana dan minat riset AI
      </div>
    </Box>
  );
};

const PIECES = ["♜", "♞", "♝", "♛", "♚", "♝", "♞", "♜"];
const PAWN = "♟";

const Chess: React.FC = () => {
  const reveal = useRevealer();
  const board = reveal(0.3);
  const score = reveal(4);
  const size = 64;
  return (
    <Box style={{ flexDirection: "column", gap: 24 }}>
      <div style={{ opacity: board, scale: String(0.9 + board * 0.1) }}>
        {[0, 1, 2].map((row) => (
          <div key={row} style={{ display: "flex" }}>
            {PIECES.map((p, col) => {
              const dark = (row + col) % 2 === 1;
              return (
                <div
                  key={col}
                  style={{
                    width: size,
                    height: size,
                    background: dark ? "#7d8fd0" : "#e8ecf8",
                    color: "#111",
                    fontSize: 44,
                    lineHeight: `${size}px`,
                    textAlign: "center",
                  }}
                >
                  {row === 0 ? p : row === 1 ? PAWN : ""}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 20, alignItems: "center", opacity: score }}>
        <Chip show={1} tone="accent" style={{ fontSize: 34 }}>
          Deep Blue 3,5
        </Chip>
        <Chip show={1} style={{ fontSize: 34 }}>
          Kasparov 2,5
        </Chip>
      </div>
    </Box>
  );
};

const Go: React.FC = () => {
  const reveal = useRevealer();
  const board = reveal(0.3);
  const n = 5;
  const gap = 44;
  const stones: readonly (readonly [number, number, boolean])[] = [[1, 1, true], [2, 2, false], [3, 1, true], [2, 3, true], [1, 3, false], [3, 3, false], [2, 1, false], [0, 2, true]];
  const side = gap * (n - 1);
  return (
    <Box style={{ flexDirection: "column", gap: 24 }}>
      <svg width={side + 60} height={side + 60} viewBox={`-30 -30 ${side + 60} ${side + 60}`} style={{ opacity: board }}>
        <rect x={-30} y={-30} width={side + 60} height={side + 60} rx={14} fill="#c8944f" />
        {Array.from({ length: n }, (_, i) => (
          <g key={i} stroke="#6b4a1f" strokeWidth={2}>
            <path d={`M${i * gap} 0 L${i * gap} ${side}`} />
            <path d={`M0 ${i * gap} L${side} ${i * gap}`} />
          </g>
        ))}
        {stones.map(([x, y, black], i) => {
          const s = reveal(1.2 + i * 0.4, 0.4);
          return (
            <circle
              key={i}
              cx={x * gap}
              cy={y * gap}
              r={gap * 0.42 * s}
              fill={black ? "#111" : "#f4f1ea"}
              stroke="#111"
              strokeWidth={2}
            />
          );
        })}
      </svg>
      <Chip show={reveal(4.8)} tone="accent" style={{ fontSize: 32 }}>
        AlphaGo 4 - 1 Lee Sedol
      </Chip>
    </Box>
  );
};

const Transformer: React.FC = () => {
  const reveal = useRevealer();
  const e = useEra();
  const tokens = ["AI", "belajar", "dari", "kata", "dan", "konteks"];
  const links: readonly (readonly [number, number])[] = [[0, 1], [1, 3], [3, 5], [0, 5], [2, 4], [1, 5]];
  const w = 90;
  const gap = 12;
  const total = tokens.length * w + (tokens.length - 1) * gap;
  const chat = reveal(5);
  return (
    <Box style={{ flexDirection: "column", gap: 20 }}>
      <svg width={total} height={120} viewBox={`0 0 ${total} 120`} style={{ overflow: "visible" }}>
        {links.map(([a, b], i) => {
          const ax = a * (w + gap) + w / 2;
          const bx = b * (w + gap) + w / 2;
          const p = reveal(0.8 + i * 0.4, 0.6);
          const mid = (ax + bx) / 2;
          const lift = 30 + Math.abs(bx - ax) * 0.18;
          return (
            <path
              key={i}
              d={`M${ax} 116 Q${mid} ${116 - lift * 1.5} ${bx} 116`}
              fill="none"
              stroke={e.accent}
              strokeWidth={4}
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - p}
              opacity={0.85}
            />
          );
        })}
      </svg>
      <div style={{ display: "flex", gap }}>
        {tokens.map((tok, i) => (
          <Chip key={tok} show={reveal(0.2 + i * 0.12, 0.4)} style={{ width: w, textAlign: "center", fontSize: 18, padding: "10px 0", fontFamily: e.fontMono }}>
            {tok}
          </Chip>
        ))}
      </div>
      <Chip show={chat} tone="light" style={{ marginTop: 6, fontSize: 30 }}>
        ChatGPT, November 2022
      </Chip>
    </Box>
  );
};

const MILESTONES: readonly (readonly [string, string])[] = [
  ["1950", "Turing Test"],
  ["1956", "Nama AI"],
  ["1997", "Deep Blue"],
  ["2016", "AlphaGo"],
  ["2022", "ChatGPT"],
];

const Timeline: React.FC = () => {
  const reveal = useRevealer();
  const e = useEra();
  const progress = reveal(0.4, 3.6);
  return (
    <Box style={{ flexDirection: "column", alignItems: "stretch", padding: "0 80px" }}>
      <div style={{ position: "relative", height: 8, background: line(e), borderRadius: 4 }}>
        <div style={{ position: "absolute", inset: 0, width: `${progress * 100}%`, background: e.accent, borderRadius: 4 }} />
        {MILESTONES.map(([year, label], i) => {
          const p = reveal(0.6 + i * 0.7, 0.5);
          const left = (i / (MILESTONES.length - 1)) * 100;
          return (
            <div key={year} style={{ position: "absolute", left: `${left}%`, top: -14, width: 0, opacity: p }}>
              <div style={{ width: 36, height: 36, marginLeft: -18, borderRadius: "50%", background: e.ink, border: `6px solid ${e.accent}` }} />
              <div style={{ position: "absolute", top: i % 2 ? -92 : 56, left: 0, transform: "translateX(-50%)", textAlign: "center", whiteSpace: "nowrap" }}>
                <div style={{ fontFamily: e.fontMono, fontSize: 30, color: e.accent, fontWeight: 700 }}>{year}</div>
                <div style={{ fontFamily: e.fontHeading, fontSize: 28, color: e.ink, fontWeight: 600 }}>{label}</div>
              </div>
            </div>
          );
        })}
      </div>
    </Box>
  );
};

export const VISUALS: Record<VisualKind, React.FC> = {
  title: Title,
  turing: Turing,
  dartmouth: Dartmouth,
  winter: Winter,
  chess: Chess,
  go: Go,
  transformer: Transformer,
  timeline: Timeline,
};
