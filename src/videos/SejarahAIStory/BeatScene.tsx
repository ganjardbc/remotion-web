import type React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import {
  Ganjar,
  Robot,
  armGesture,
  point,
  robotSize,
  startle,
  surprise,
  type GanjarClip,
  type GanjarFaceKey,
  type LookKey,
  type RobotClip,
  type RobotFaceKey,
} from "../../assets/characters";
import { BEATS, FPS, timeBeat, type Beat, type TimedLine } from "./config";
import { ERAS, EraProvider, FONTS, useEra, type Era } from "./design";
import { VISUALS } from "./visuals";

const W = 1920;
const H = 1080;
// Panel kiri = penjelasan, panel kanan = ruang kerja Ganjar dan Robot.
const SPLIT = 1040;
const DESK_TOP = 830;

const GANJAR_X = 1290;
const GANJAR_WIDTH = 554;
const GANJAR_SCALE = GANJAR_WIDTH / 840;
// Titik pada tubuh Ganjar (unit rig) yang sejajar dengan permukaan meja: dada bawah.
const SEAT_RIG_Y = 650;
const GANJAR_HEAD_TOP = DESK_TOP - (SEAT_RIG_Y - 5) * GANJAR_SCALE;

const ROBOT_X = 1785;
// Laptop di meja, di sisi kanan Ganjar, agar tubuhnya tidak tertutup.
const LAPTOP_X = 1480;
const ROBOT_WIDTH = 300;
const ROBOT_HEAD_TOP = DESK_TOP - 485 * (ROBOT_WIDTH / 660);

const BUBBLE_PANEL = { left: SPLIT + 24, right: W - 30 };

const fr = (seconds: number): number => Math.round(seconds * FPS);
const mix = (color: string, pct: number): string => `color-mix(in srgb, ${color} ${pct}%, transparent)`;

// ---------- latar ----------

const patternStyle = (e: Era, drift: number): React.CSSProperties => {
  const c = mix(e.ink, 10);
  switch (e.pattern) {
    case "dots":
      return {
        backgroundImage: `radial-gradient(${c} 3px, transparent 3px)`,
        backgroundSize: "44px 44px",
        backgroundPosition: `${drift}px ${drift}px`,
      };
    case "grid":
      return {
        backgroundImage: `linear-gradient(${c} 2px, transparent 2px), linear-gradient(90deg, ${c} 2px, transparent 2px)`,
        backgroundSize: "72px 72px",
        backgroundPosition: `${drift}px ${drift}px`,
      };
    case "stripes":
      return {
        backgroundImage: `repeating-linear-gradient(135deg, ${c} 0 4px, transparent 4px 40px)`,
        backgroundPosition: `${drift}px 0`,
      };
    case "rings":
      return {
        backgroundImage: `repeating-radial-gradient(circle at 40% 30%, ${c} 0 3px, transparent 3px 56px)`,
      };
    default:
      return {};
  }
};

// Panel kiri: bidang era dengan pola dan bentuk besar.
const ExplainerBackdrop: React.FC = () => {
  const e = useEra();
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, background: e.bg, overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, ...patternStyle(e, frame * 0.25) }} />
      <div
        style={{
          position: "absolute",
          width: 700,
          height: 700,
          borderRadius: "50%",
          background: e.shape,
          left: -280,
          top: -320,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 420,
          height: 420,
          background: e.shape,
          transform: `rotate(${18 + Math.sin(frame / 90) * 3}deg)`,
          right: -140,
          bottom: -120,
        }}
      />
    </div>
  );
};

// ---------- ruang kerja ----------

const Room: React.FC = () => {
  const e = useEra();
  return (
    <>
      {/* bingkai papan era di dinding */}
      <div
        style={{
          position: "absolute",
          left: W - 220,
          top: 70,
          width: 160,
          height: 110,
          border: `6px solid ${e.groundLine}`,
          borderRadius: 14,
          background: mix(e.ink, 8),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: FONTS.mono,
          fontWeight: 700,
          fontSize: 34,
          color: e.accent,
        }}
      >
        AI
      </div>
      {/* sandaran kursi */}
      <div
        style={{
          position: "absolute",
          left: GANJAR_X - 135,
          top: DESK_TOP - 230,
          width: 270,
          height: 260,
          borderRadius: "46px 46px 0 0",
          background: e.ground,
          border: `5px solid ${e.groundLine}`,
          borderBottom: "none",
        }}
      />
    </>
  );
};

// Warna kayu tetap (perabot), tidak ikut palet era.
const WOOD = {
  top: "#D7A06A",
  topLight: "#E8BB8A",
  topEdge: "#9C6A3A",
  body: "#B77D48",
  drawerEdge: "#8F5E32",
  plinth: "#7A4F2A",
} as const;

// Meja, laptop, dan tanaman; digambar di depan karakter agar tubuh bagian bawah tertutup.
const Desk: React.FC = () => {
  const e = useEra();
  const frame = useCurrentFrame();
  const glow = 0.75 + Math.sin(frame / 18) * 0.25;
  const X0 = SPLIT;
  const WIDTH = W - SPLIT;
  const TOP_H = 36;
  const BODY_TOP = DESK_TOP + TOP_H;
  const PLINTH_TOP = H - 70;
  return (
    <>
      {/* badan meja */}
      <div style={{ position: "absolute", left: X0 + 18, top: BODY_TOP, width: WIDTH, height: PLINTH_TOP - BODY_TOP, background: WOOD.body }} />
      <div
        style={{
          position: "absolute",
          left: X0 + 18,
          top: BODY_TOP,
          width: WIDTH,
          height: 34,
          background: "linear-gradient(rgba(0,0,0,0.28), rgba(0,0,0,0))",
        }}
      />
      <div style={{ position: "absolute", left: X0 + 18, top: PLINTH_TOP, width: WIDTH, height: H - PLINTH_TOP, background: WOOD.plinth }} />
      {/* papan atas: menjorok sedikit di sisi kiri */}
      <div
        style={{
          position: "absolute",
          left: X0,
          top: DESK_TOP,
          width: WIDTH,
          height: TOP_H,
          background: WOOD.top,
          borderTop: `6px solid ${WOOD.topLight}`,
          borderBottom: `6px solid ${WOOD.topEdge}`,
          borderRadius: "10px 0 0 0",
        }}
      />
      {/* tanaman kecil */}
      <div style={{ position: "absolute", left: X0 + 568, top: DESK_TOP - 120, width: 80, height: 120 }}>
        {[-26, 0, 26].map((rot, i) => (
          <div
            key={rot}
            style={{
              position: "absolute",
              left: 40 - 14,
              top: i === 1 ? 0 : 18,
              width: 28,
              height: 70,
              borderRadius: "50% 50% 50% 50% / 70% 70% 30% 30%",
              background: i === 1 ? "#3E9B5A" : "#2F7F49",
              transform: `rotate(${rot}deg)`,
              transformOrigin: "50% 100%",
            }}
          />
        ))}
        <div
          style={{
            position: "absolute",
            left: 12,
            top: 74,
            width: 56,
            height: 48,
            borderRadius: "4px 4px 12px 12px",
            background: e.accent,
            border: `5px solid ${WOOD.drawerEdge}`,
          }}
        />
      </div>
      {/* laptop kecil di sisi kanan Ganjar, tampak dari belakang (punggung layar menghadap penonton) */}
      <div
        style={{
          position: "absolute",
          left: LAPTOP_X - 110,
          top: DESK_TOP - 11,
          width: 220,
          height: 12,
          borderRadius: "3px 3px 6px 6px",
          background: "#16171b",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: LAPTOP_X - 96,
          top: DESK_TOP - 148,
          width: 192,
          height: 138,
          borderRadius: 10,
          background: "#2b2d33",
          border: "4px solid #16171b",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 96 - 4 - 18,
            top: 69 - 4 - 18,
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: e.accent,
            opacity: glow,
            boxShadow: `0 0 18px ${e.accent}`,
          }}
        />
      </div>
    </>
  );
};

// ---------- karakter ----------

const Entering: React.FC<{
  readonly kind: "rise" | "drop";
  readonly delay: number;
  readonly children: React.ReactNode;
  readonly style: React.CSSProperties;
}> = ({ kind, delay, children, style }) => {
  const frame = useCurrentFrame();
  const raw = interpolate(frame, [fr(delay), fr(delay + 0.8)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const k = Easing.out(Easing.back(kind === "drop" ? 1.8 : 0.9))(raw);
  const offset = (1 - k) * (kind === "drop" ? -520 : 160);
  return (
    <div style={{ ...style, opacity: Math.min(1, raw * 2.5), translate: `0 ${offset}px` }}>{children}</div>
  );
};

export type GazeOptions = {
  // Arah pandang Ganjar (-1..1) saat diam, saat bicara, dan saat Robot bicara.
  readonly idle: number;
  readonly speaking: number;
  readonly listening: number;
  // Sudut lengan saat menunjuk ke bahan penjelasan.
  readonly pointAngle: number;
};

const LANDSCAPE_GAZE: GazeOptions = { idle: 0.35, speaking: -0.45, listening: 0.9, pointAngle: 74 };

export const buildGanjar = (
  lines: readonly TimedLine[],
  gaze: GazeOptions = LANDSCAPE_GAZE,
): { face: readonly GanjarFaceKey[]; clips: readonly GanjarClip[]; look: readonly LookKey[] } => {
  const face: GanjarFaceKey[] = [{ at: -1, expression: "netral" }];
  const clips: GanjarClip[] = [];
  // Panel penjelasan ada di kiri, Robot di kanan.
  // Panel penjelasan ada di kiri, Robot di kanan.
  const look: LookKey[] = [{ at: 0.2, turn: gaze.idle }];
  // Tangan kanan terjulur ke laptop, mengetik pelan.
  clips.push({
    clip: (f) => ({ armR: { shoulder: 30 + Math.sin(f / 3) * 1.6, elbow: 9 + Math.sin(f / 4) * 1.2 } }),
    start: 0,
    dur: 100000,
  });
  for (const l of lines) {
    if (l.ganjar) {
      face.push({ at: l.at, expression: l.ganjar });
    }
    look.push(
      l.who === "ganjar"
        ? { at: l.at, turn: gaze.speaking, tilt: 1.5 }
        : { at: l.at, turn: gaze.listening, tilt: -2 },
    );
    if (l.who !== "ganjar" || !l.act) {
      continue;
    }
    if (l.act === "point") {
      const dur = Math.min(fr(l.dur - 0.3), fr(2.4));
      clips.push({ clip: point("L", dur, gaze.pointAngle), start: fr(l.at + 0.3), dur });
    } else if (l.act === "startle") {
      clips.push({ clip: startle(fr(0.9)), start: fr(l.at), dur: fr(0.9) });
    }
  }
  return { face, clips, look };
};

export const buildRobot = (
  lines: readonly TimedLine[],
): { face: readonly RobotFaceKey[]; clips: readonly RobotClip[]; look: readonly LookKey[] } => {
  const face: RobotFaceKey[] = [{ at: -1, expression: "normal" }];
  const clips: RobotClip[] = [];
  const look: LookKey[] = [{ at: 0.2, turn: -0.8 }];
  for (const l of lines) {
    if (l.robot) {
      face.push({ at: l.at, expression: l.robot });
    }
    look.push({ at: l.at, turn: l.who === "robot" ? -0.5 : -0.95 });
    if (l.who !== "robot" || !l.act) {
      continue;
    }
    if (l.act === "surprise") {
      clips.push({ clip: surprise, start: fr(l.at), dur: fr(1.1) });
    } else if (l.act === "wave") {
      const dur = fr(Math.min(l.dur, 2.2));
      clips.push({ clip: armGesture("L", dur, 70, 14), start: fr(l.at + 0.2), dur });
    }
  }
  return { face, clips, look };
};

const Cast: React.FC<{ readonly lines: readonly TimedLine[]; readonly active: TimedLine | undefined }> = ({
  lines,
  active,
}) => {
  const r = robotSize(ROBOT_WIDTH);
  const gk = buildGanjar(lines);
  const rk = buildRobot(lines);
  return (
    <>
      <Entering
        kind="rise"
        delay={0.1}
        style={{
          position: "absolute",
          left: GANJAR_X - GANJAR_WIDTH / 2,
          top: DESK_TOP - (SEAT_RIG_Y + 20) * GANJAR_SCALE,
        }}
      >
        <Ganjar width={GANJAR_WIDTH} face={gk.face} clips={gk.clips} look={gk.look} talking={active?.who === "ganjar"} />
      </Entering>
      <Entering
        kind="drop"
        delay={0.4}
        style={{ position: "absolute", left: ROBOT_X - ROBOT_WIDTH / 2, bottom: H - DESK_TOP - r.floorGap - 4 }}
      >
        <div style={{ position: "relative" }}>
          <Robot width={ROBOT_WIDTH} face={rk.face} clips={rk.clips} look={rk.look} />
        </div>
      </Entering>
    </>
  );
};

// ---------- teks ----------

const Rich: React.FC<{ readonly text: string; readonly bg: string; readonly fg: string }> = ({ text, bg, fg }) => (
  <>
    {text.split("*").map((part, i) =>
      i % 2 ? (
        <span key={i} style={{ background: bg, color: fg, padding: "0 10px", borderRadius: 10, margin: "0 -2px" }}>
          {part}
        </span>
      ) : (
        part
      ),
    )}
  </>
);

// Balon bicara selalu di atas kepala pembicara; ekor menunjuk ke kepalanya.
const Bubble: React.FC<{ readonly line: TimedLine; readonly local: number }> = ({ line, local }) => {
  const e = useEra();
  const k = interpolate(local, [0, 9], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.4)),
  });
  const robot = line.who === "robot";
  const width = robot ? 420 : 640;
  const cx = robot ? ROBOT_X : GANJAR_X;
  const top = robot ? ROBOT_HEAD_TOP : GANJAR_HEAD_TOP;
  const left = Math.min(BUBBLE_PANEL.right - width, Math.max(BUBBLE_PANEL.left, cx - width / 2));
  const tailX = Math.min(width - 90, Math.max(50, cx - left - 20));
  const bg = robot ? e.accent : e.panel;
  const fg = robot ? e.onAccent : e.panelInk;
  return (
    <div
      style={{
        position: "absolute",
        left,
        width,
        bottom: H - top + 40,
        opacity: Math.min(1, k * 1.5),
        scale: String(0.9 + 0.1 * k),
        transformOrigin: `${tailX + 20}px 100%`,
      }}
    >
      <div
        style={{
          background: bg,
          color: fg,
          border: `5px solid ${e.groundLine}`,
          borderRadius: 28,
          padding: "20px 30px",
          fontFamily: FONTS.heading,
          fontWeight: 600,
          fontSize: 32,
          lineHeight: 1.32,
          boxShadow: `8px 8px 0 ${mix(e.groundLine, 45)}`,
          position: "relative",
        }}
      >
        <Rich text={line.text} bg={robot ? e.onAccent : e.accent} fg={robot ? e.accent : e.onAccent} />
        <div
          style={{
            position: "absolute",
            bottom: -17,
            left: tailX,
            width: 28,
            height: 28,
            background: bg,
            borderRight: `5px solid ${e.groundLine}`,
            borderBottom: `5px solid ${e.groundLine}`,
            transform: "rotate(45deg)",
          }}
        />
      </div>
    </div>
  );
};

// ---------- panel penjelasan ----------

const PAD = 100;

const Header: React.FC<{ readonly beat: Beat; readonly index: number }> = ({ beat, index }) => {
  const e = useEra();
  const frame = useCurrentFrame();
  const k = interpolate(frame, [4, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return (
    <div style={{ position: "absolute", left: PAD, top: 70, width: SPLIT - PAD * 2, opacity: k, translate: `${(1 - k) * -30}px 0` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <span
          style={{
            background: e.accent,
            color: e.onAccent,
            fontFamily: FONTS.mono,
            fontWeight: 700,
            fontSize: 34,
            padding: "2px 20px",
            borderRadius: 12,
            letterSpacing: "0.04em",
          }}
        >
          {beat.year}
        </span>
        <span style={{ fontFamily: FONTS.mono, fontSize: 28, color: e.muted }}>
          {String(index + 1).padStart(2, "0")} / {String(BEATS.length).padStart(2, "0")}
        </span>
      </div>
      <div
        style={{
          fontFamily: FONTS.heading,
          fontWeight: 800,
          fontSize: 66,
          whiteSpace: "nowrap",
          lineHeight: 1.05,
          letterSpacing: "-0.03em",
          color: e.ink,
          marginTop: 16,
        }}
      >
        {beat.title}
      </div>
    </div>
  );
};

const Facts: React.FC<{ readonly beat: Beat; readonly lines: readonly TimedLine[] }> = ({ beat, lines }) => {
  const e = useEra();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ position: "absolute", left: PAD, top: 770, width: SPLIT - PAD * 2, display: "flex", flexDirection: "column", gap: 12 }}>
      {beat.facts.map((fact, i) => {
        const start = (lines[Math.min(i, lines.length - 1)]?.at ?? 0) * fps;
        const k = interpolate(frame, [start, start + 12], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic),
        });
        return (
          <div
            key={fact}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              opacity: k,
              translate: `${(1 - k) * -40}px 0`,
              fontFamily: FONTS.heading,
              fontWeight: 600,
              fontSize: 30,
              color: e.ink,
            }}
          >
            <span style={{ width: 16, height: 16, borderRadius: 4, background: e.accent, flex: "none" }} />
            {fact}
          </div>
        );
      })}
    </div>
  );
};

// Ilustrasi dirancang di kotak 620x330 lalu diperbesar mengisi panel.
const VISUAL_SCALE = 1.4;

// ---------- scene ----------

const BeatInner: React.FC<{ readonly index: number }> = ({ index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const beat = BEATS[index];
  const { lines } = timeBeat(beat);
  const seconds = frame / fps;
  const active = lines.find((l) => seconds >= l.at && seconds < l.at + l.dur);
  const Visual = VISUALS[beat.visual];
  return (
    <>
      <ExplainerBackdrop />
      <Header beat={beat} index={index} />
      <div
        style={{
          position: "absolute",
          left: PAD,
          top: 270,
          width: 620,
          height: 330,
          transform: `scale(${VISUAL_SCALE})`,
          transformOrigin: "0 0",
        }}
      >
        <Visual />
      </div>
      <Facts beat={beat} lines={lines} />
      <Room />
      <Cast lines={lines} active={active} />
      <Desk />
      {active ? <Bubble key={active.at} line={active} local={frame - active.at * fps} /> : null}
    </>
  );
};

export const BeatScene: React.FC<{ readonly index: number }> = ({ index }) => (
  <EraProvider value={ERAS[BEATS[index].era]}>
    <BeatInner index={index} />
  </EraProvider>
);
