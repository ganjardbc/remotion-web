import type React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Backdrop } from "../../Backdrop";
import { Ganjar, Robot, robotSize } from "../../assets/characters";
import { ThemeProvider, useTheme, type Theme } from "../../themes";
import { buildGanjar, buildRobot, type GazeOptions } from "../SejarahAIStory/BeatScene";
import { BEATS, timeBeat, type Beat, type TimedLine } from "../SejarahAIStory/config";
import type { Era } from "../SejarahAIStory/design";
import { EraProvider } from "../SejarahAIStory/design";
import { VISUALS } from "../SejarahAIStory/visuals";

const W = 1080;
const H = 1920;
// Panel karakter di bawah: dinding terang, meja, lalu footer di badan meja.
const PANEL_TOP = 1120;
const DESK_TOP = 1760;

const GANJAR_X = 400;
const GANJAR_WIDTH = 600;
const GANJAR_SCALE = GANJAR_WIDTH / 840;
// Titik rig yang sejajar dengan permukaan meja (dada bawah).
const SEAT_RIG_Y = 650;
const GANJAR_HEAD_TOP = DESK_TOP - (SEAT_RIG_Y - 5) * GANJAR_SCALE;

const LAPTOP_X = 580;
const ROBOT_X = 920;
const ROBOT_WIDTH = 340;
const ROBOT_HEAD_TOP = DESK_TOP - 485 * (ROBOT_WIDTH / 660);

const PAD = 60;
// Ilustrasi dirancang di kotak 620x330, diperbesar mengisi lebar layar.
const VISUAL_SCALE = 1.25;

// Menghadap penonton; menunjuk ke atas, ke arah bahan penjelasan.
const GAZE: GazeOptions = { idle: 0.1, speaking: 0.05, listening: 0.6, pointAngle: 135 };

// Era "gh": diturunkan dari token GH design system supaya ilustrasi bersama bisa dipakai ulang.
const ghEra = (t: Theme): Era => ({
  name: "gh",
  fontHeading: t.fonts.heading,
  fontMono: t.fonts.mono,
  bg: t.colors.ground,
  shape: t.code.raised,
  ink: t.colors.groundText,
  muted: t.colors.groundTextMuted,
  accent: t.colors.accent,
  onAccent: t.colors.onAccent,
  panel: t.colors.groundChipBg,
  panelInk: t.colors.ink,
  spot: t.colors.primarySoft,
  spotOpacity: 0.9,
  ground: t.code.bg,
  groundLine: t.colors.accent,
  pattern: "none",
});

const fr = (seconds: number, fps: number): number => Math.round(seconds * fps);

// ---------- karakter ----------

const Entering: React.FC<{
  readonly kind: "rise" | "drop";
  readonly delay: number;
  readonly children: React.ReactNode;
  readonly style: React.CSSProperties;
}> = ({ kind, delay, children, style }) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const k = interpolate(frame, [fr(delay, fps), fr(delay + 0.7, fps)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...t.motion.enter),
  });
  const offset = (1 - k) * (kind === "drop" ? -420 : 140);
  return <div style={{ ...style, opacity: Math.min(1, k * 2), translate: `0 ${offset}px` }}>{children}</div>;
};

const Cast: React.FC<{ readonly lines: readonly TimedLine[]; readonly active: TimedLine | undefined }> = ({
  lines,
  active,
}) => {
  const r = robotSize(ROBOT_WIDTH);
  const gk = buildGanjar(lines, GAZE);
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
        delay={0.35}
        style={{ position: "absolute", left: ROBOT_X - ROBOT_WIDTH / 2, bottom: H - DESK_TOP - r.floorGap - 4 }}
      >
        <Robot width={ROBOT_WIDTH} face={rk.face} clips={rk.clips} look={rk.look} />
      </Entering>
    </>
  );
};

// ---------- ruang kerja ----------

const Workspace: React.FC = () => {
  const t = useTheme();
  return (
    <>
      {/* dinding terang untuk panel karakter */}
      <div style={{ position: "absolute", left: 0, top: PANEL_TOP, width: W, height: H - PANEL_TOP, background: t.colors.primaryTint }} />
      <div
        style={{
          position: "absolute",
          left: 0,
          top: PANEL_TOP,
          width: W,
          height: 6,
          background: t.colors.accent,
        }}
      />
      {/* sandaran kursi */}
      <div
        style={{
          position: "absolute",
          left: GANJAR_X - 150,
          top: DESK_TOP - 250,
          width: 300,
          height: 280,
          borderRadius: "44px 44px 0 0",
          background: t.colors.primarySoft,
          border: `5px solid ${t.colors.primary}`,
          borderBottom: "none",
        }}
      />
    </>
  );
};

// Meja di depan karakter; badan meja gelap supaya footer GH terbaca.
const Desk: React.FC = () => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const glow = 0.75 + Math.sin(frame / 18) * 0.25;
  const TOP_H = 30;
  return (
    <>
      <div style={{ position: "absolute", left: 0, top: DESK_TOP, width: W, height: H - DESK_TOP, background: t.code.raised }} />
      <div
        style={{
          position: "absolute",
          left: 0,
          top: DESK_TOP,
          width: W,
          height: TOP_H,
          background: t.colors.primary,
          borderTop: `6px solid ${t.colors.primarySoft}`,
        }}
      />
      <div style={{ position: "absolute", left: 0, top: DESK_TOP + TOP_H, width: W, height: 36, background: "linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0))" }} />
      {/* tanaman kecil di kiri */}
      <div style={{ position: "absolute", left: 40, top: DESK_TOP - 120, width: 80, height: 120 }}>
        {[-26, 0, 26].map((rot, i) => (
          <div
            key={rot}
            style={{
              position: "absolute",
              left: 26,
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
            background: t.colors.accent,
            border: `5px solid ${t.colors.primaryDeep}`,
          }}
        />
      </div>
      {/* laptop kecil tampak dari belakang */}
      <div style={{ position: "absolute", left: LAPTOP_X - 110, top: DESK_TOP - 11, width: 220, height: 12, borderRadius: "4px 4px 8px 8px", background: "#16171b" }} />
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
            background: t.colors.accent,
            opacity: glow,
            boxShadow: `0 0 18px ${t.colors.accent}`,
          }}
        />
      </div>
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

// Balon bicara di atas kepala pembicara; ekor menunjuk ke kepalanya.
const Bubble: React.FC<{ readonly line: TimedLine; readonly local: number }> = ({ line, local }) => {
  const t = useTheme();
  const k = interpolate(local, [0, 9], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(...t.motion.enter),
  });
  const robot = line.who === "robot";
  const width = robot ? 440 : 680;
  const cx = robot ? ROBOT_X : GANJAR_X;
  const top = robot ? ROBOT_HEAD_TOP : GANJAR_HEAD_TOP;
  const left = Math.min(W - 24 - width, Math.max(24, cx - width / 2));
  const tailX = Math.min(width - 90, Math.max(50, cx - left - 20));
  const bg = robot ? t.colors.accent : t.colors.groundChipBg;
  const fg = robot ? t.colors.onAccent : t.colors.ink;
  return (
    <div
      style={{
        position: "absolute",
        left,
        width,
        bottom: H - top + 36,
        opacity: k,
        translate: `0 ${(1 - k) * 18}px`,
      }}
    >
      <div
        style={{
          background: bg,
          color: fg,
          border: `4px solid ${t.colors.ink}`,
          borderRadius: 26,
          padding: "20px 28px",
          fontFamily: t.fonts.body,
          fontWeight: 600,
          fontSize: 34,
          lineHeight: 1.3,
          boxShadow: t.shadows.lift,
          position: "relative",
        }}
      >
        <Rich
          text={line.text}
          bg={robot ? t.colors.onAccent : t.colors.accent}
          fg={robot ? t.colors.accent : t.colors.onAccent}
        />
        <div
          style={{
            position: "absolute",
            bottom: -16,
            left: tailX,
            width: 26,
            height: 26,
            background: bg,
            borderRight: `4px solid ${t.colors.ink}`,
            borderBottom: `4px solid ${t.colors.ink}`,
            transform: "rotate(45deg)",
          }}
        />
      </div>
    </div>
  );
};

// ---------- panel penjelasan ----------

const Header: React.FC<{ readonly beat: Beat }> = ({ beat }) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const k = interpolate(frame, [4, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...t.motion.enter),
  });
  return (
    <div style={{ position: "absolute", left: PAD, top: 234, width: W - PAD * 2, opacity: k, translate: `${(1 - k) * -30}px 0` }}>
      <span
        style={{
          display: "inline-block",
          background: t.colors.accent,
          color: t.colors.onAccent,
          fontFamily: t.fonts.mono,
          fontWeight: 700,
          fontSize: 34,
          padding: "2px 20px",
          borderRadius: 12,
          letterSpacing: "0.04em",
        }}
      >
        {beat.year}
      </span>
      <div
        style={{
          fontFamily: t.fonts.heading,
          fontWeight: t.type.headlineWeight,
          fontSize: 74,
          whiteSpace: "nowrap",
          lineHeight: 1.08,
          letterSpacing: `${t.type.tracking}em`,
          color: t.colors.groundText,
          marginTop: 14,
        }}
      >
        {beat.title}
      </div>
    </div>
  );
};

const Facts: React.FC<{ readonly beat: Beat; readonly lines: readonly TimedLine[] }> = ({ beat, lines }) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ position: "absolute", left: PAD, top: 835, width: W - PAD * 2, display: "flex", flexDirection: "column", gap: 10 }}>
      {beat.facts.map((fact, i) => {
        const start = (lines[Math.min(i, lines.length - 1)]?.at ?? 0) * fps;
        const k = interpolate(frame, [start, start + 12], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(...t.motion.enter),
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
              fontFamily: t.fonts.body,
              fontWeight: 600,
              fontSize: 28,
              color: t.colors.groundText,
            }}
          >
            <span style={{ width: 14, height: 14, borderRadius: 4, background: t.colors.accent, flex: "none" }} />
            {fact}
          </div>
        );
      })}
    </div>
  );
};

// ---------- scene ----------

const SceneInner: React.FC<{ readonly index: number }> = ({ index }) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const beat = BEATS[index];
  const { lines } = timeBeat(beat);
  const seconds = frame / fps;
  const active = lines.find((l) => seconds >= l.at && seconds < l.at + l.dur);
  const Visual = VISUALS[beat.visual];
  return (
    <EraProvider value={ghEra(t)}>
      <Backdrop
        variant="ground"
        label={`${String(index + 1).padStart(2, "0")} / ${String(BEATS.length).padStart(2, "0")}`}
        sweep={index === 0}
      />
      <Header beat={beat} />
      <div
        style={{
          position: "absolute",
          left: (W - 620 * VISUAL_SCALE) / 2,
          top: 390,
          width: 620,
          height: 330,
          transform: `scale(${VISUAL_SCALE})`,
          transformOrigin: "0 0",
        }}
      >
        <Visual />
      </div>
      <Facts beat={beat} lines={lines} />
      <Workspace />
      <Cast lines={lines} active={active} />
      <Desk />
      {active ? <Bubble key={active.at} line={active} local={frame - active.at * fps} /> : null}
    </EraProvider>
  );
};

export const ReelsScene: React.FC<{ readonly index: number; readonly theme: string }> = ({ index, theme }) => (
  <ThemeProvider name={theme}>
    <SceneInner index={index} />
  </ThemeProvider>
);
