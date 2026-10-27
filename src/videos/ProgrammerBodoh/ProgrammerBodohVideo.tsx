import type React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolateColors,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BrandFooter } from "../../BrandFooter";
import { RobotStickman, GanjarStickman, robotStickmanSize, ganjarStickmanSize } from "../../assets/characters";
import { ThemeProvider, useTheme } from "../../themes";
import { Sfx, type SfxSet } from "./Sfx";
import { Chair, DESK_TOP, Desk, Laptop, Mug, RoomBack, SEAT_X } from "./Room";
import { CTA, CTA_START, FPS, HOOK, HOOK_SECONDS, LINES, LINE_START, TOTAL_FRAMES, type Speaker } from "./config";

export { TOTAL_FRAMES };

const GANJAR_HEIGHT = 760;
// Meja memotong badan GanjarStickman di sekitar perut: bagian bawah tersembunyi di balik meja.
const GANJAR_TOP = DESK_TOP - 0.62 * GANJAR_HEIGHT;
const ROBOT_HEIGHT = 300;
const ROBOT_CENTER_X = 810;
// Kaki robot sedikit di bawah kotak viewBox: dikoreksi supaya telapak menapak di atas meja.
const ROBOT_FEET_GAP = (25 * ROBOT_HEIGHT) / 400;

const clamp01 = (n: number): number => Math.min(1, Math.max(0, n));
const ease = Easing.bezier(0.2, 0.8, 0.2, 1);

const lineIndexAt = (frame: number): number => {
  let idx = -1;
  LINE_START.forEach((s, i) => {
    if (s <= frame) idx = i;
  });
  return idx;
};

// "teks *sorot* teks" jadi huruf-huruf bertanda sorot, supaya bisa diketik per huruf.
const toChars = (text: string): readonly { readonly ch: string; readonly hl: boolean }[] => {
  const out: { ch: string; hl: boolean }[] = [];
  let hl = false;
  for (const ch of text) {
    if (ch === "*") hl = !hl;
    else out.push({ ch, hl });
  }
  return out;
};

const rankFor = (skill: number): string =>
  skill >= 85 ? "Senior Engineer" : skill >= 65 ? "Mid Engineer" : skill >= 45 ? "Junior" : skill >= 25 ? "Magang" : skill >= 10 ? "Operator Copy-Paste" : "Penonton Layar";

// Nilai meter: bergerak mulus ke target tiap kalimat.
const meterValue = (frame: number, key: "skill" | "reliance"): number => {
  const start = key === "skill" ? 100 : 10;
  const idx = lineIndexAt(frame);
  if (idx < 0) return start;
  const prev = idx === 0 ? start : LINES[idx - 1][key];
  const t = ease(clamp01((frame - LINE_START[idx]) / 24));
  return prev + (LINES[idx][key] - prev) * t;
};

const Meter: React.FC<{
  readonly label: string;
  readonly value: number;
  readonly from: string;
  readonly to: string;
  readonly invert?: boolean;
}> = ({ label, value, from, to, invert }) => {
  const t = useTheme();
  const color = interpolateColors(invert ? 100 - value : value, [0, 100], [to, from]);
  return (
    <div style={{ flex: 1 }}>
      <div style={{ fontFamily: t.fonts.body, fontSize: 24, fontWeight: 600, letterSpacing: "0.06em", color: t.colors.muted, textTransform: "uppercase" }}>
        {label}
      </div>
      <div style={{ fontFamily: t.fonts.heading, fontSize: 104, fontWeight: 800, lineHeight: 1.05, color, letterSpacing: "-0.03em" }}>
        {Math.round(value)}%
      </div>
      <div style={{ height: 18, borderRadius: 9, backgroundColor: "rgba(20,20,31,0.1)", overflow: "hidden" }}>
        <div style={{ width: `${value}%`, height: "100%", borderRadius: 9, backgroundColor: color }} />
      </div>
    </div>
  );
};

const Meters: React.FC = () => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const skill = meterValue(frame, "skill");
  const reliance = meterValue(frame, "reliance");
  const intro = ease(clamp01((frame - 8) / 18));
  return (
    <div
      style={{
        position: "absolute",
        left: 60,
        right: 60,
        top: 120,
        padding: "30px 36px 28px",
        borderRadius: t.radius.large,
        backgroundColor: t.colors.primaryTint,
        border: `1px solid ${t.colors.primarySoft}`,
        boxShadow: t.shadows.lift,
        opacity: intro,
        transform: `translateY(${(1 - intro) * -30}px)`,
      }}
    >
      <div style={{ display: "flex", gap: 44 }}>
        <Meter label="Skill ngoding" value={skill} from="#1A9C6B" to="#E5484D" />
        <Meter label="Kegantungan Claude" value={reliance} from="#FFB067" to="#E8590C" invert />
      </div>
      <div style={{ marginTop: 22, fontFamily: t.fonts.mono, fontSize: 28, color: t.colors.muted }}>
        pangkat: <span style={{ color: t.colors.accent, fontWeight: 700 }}>{rankFor(skill)}</span>
      </div>
    </div>
  );
};

const ROW = 150;
// Slot 0 = pesan terbaru di dasar panel chat; pesan lama naik ke atas dan memudar.
const CHAT_BOTTOM_TOP = 1630;

const ChatMessage: React.FC<{ readonly index: number; readonly current: number }> = ({ index, current }) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const line = LINES[index];
  const start = LINE_START[index];
  const robot = line.who === "robot";

  const shift = ease(clamp01((frame - LINE_START[current]) / 9));
  // Pesan baru muncul dari bawah slot 0; yang lama bergeser naik satu slot.
  const slot = current - index - (1 - shift);
  const gone = clamp01((frame - CTA_START) / 10);
  const opacity = clamp01(1 - 0.3 * slot) * clamp01(slot + 1) * clamp01((2.7 - slot) / 0.7) * (1 - gone);

  const chars = toChars(line.text);
  const typed = clamp01((frame - start) / (line.seconds * FPS * 0.6));
  const shown = Math.ceil(chars.length * typed);

  const avatar = (
    <div
      style={{
        flex: "none",
        width: 76,
        height: 76,
        borderRadius: "50%",
        backgroundColor: robot ? t.colors.accent : "#FFFFFF",
        color: robot ? t.colors.onAccent : t.colors.ink,
        fontFamily: t.fonts.heading,
        fontWeight: 800,
        fontSize: 38,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {robot ? "C" : "G"}
    </div>
  );

  return (
    <div
      style={{
        position: "absolute",
        left: 60,
        right: 60,
        top: CHAT_BOTTOM_TOP - slot * ROW,
        height: ROW - 14,
        display: "flex",
        alignItems: "center",
        flexDirection: robot ? "row-reverse" : "row",
        gap: 20,
        opacity,
      }}
    >
      {avatar}
      <div
        style={{
          maxWidth: 740,
          padding: "16px 28px 18px",
          borderRadius: 30,
          [robot ? "borderTopRightRadius" : "borderTopLeftRadius"]: 8,
          backgroundColor: robot ? t.colors.accent : t.colors.primary,
          color: robot ? t.colors.onAccent : t.colors.onPrimary,
          fontFamily: t.fonts.heading,
          fontSize: 38,
          fontWeight: 600,
          lineHeight: 1.28,
          letterSpacing: "-0.01em",
        }}
      >
        {chars.map((c, i) => (
          <span
            key={i}
            style={{
              opacity: i < shown ? 1 : 0,
              fontWeight: c.hl ? 800 : 600,
              color: c.hl ? (robot ? "#FFFFFF" : t.colors.accent) : undefined,
            }}
          >
            {c.ch}
          </span>
        ))}
      </div>
    </div>
  );
};

// Chat di panel bawah: tiga pesan terakhir.
const ChatFeed: React.FC = () => {
  const frame = useCurrentFrame();
  const current = lineIndexAt(frame);
  if (current < 0) return null;
  return (
    <>
      {LINES.map((_, i) => (i <= current && i >= current - 3 ? <ChatMessage key={i} index={i} current={current} /> : null))}
    </>
  );
};

const Hook: React.FC = () => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const out = 1 - clamp01((frame - (HOOK_SECONDS * FPS - 8)) / 8);
  const line = (i: number): { opacity: number; transform: string } => {
    const p = ease(clamp01((frame - 10 - i * 6) / 14));
    return { opacity: p, transform: `translateY(${(1 - p) * 40}px)` };
  };
  const big = { fontFamily: t.fonts.heading, fontWeight: 800, fontSize: 74, lineHeight: 1.05, letterSpacing: "-0.03em" } as const;
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: 1330, textAlign: "center", opacity: out }}>
      <div style={{ ...big, color: "#FFFFFF", ...line(0) }}>{HOOK.title}</div>
      <div style={{ ...big, fontSize: 128, color: t.colors.accent, ...line(1) }}>{HOOK.accent}</div>
      <div style={{ ...big, color: "#FFFFFF", ...line(2) }}>{HOOK.tail}</div>
      <div style={{ marginTop: 22, fontFamily: t.fonts.mono, fontSize: 32, color: t.colors.groundTextMuted, ...line(3) }}>{HOOK.sub}</div>
    </div>
  );
};

const CtaCard: React.FC = () => {
  const t = useTheme();
  const frame = useCurrentFrame() - CTA_START;
  const p = ease(clamp01((frame - 6) / 14));
  const p2 = ease(clamp01((frame - 18) / 14));
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: 1350, textAlign: "center", opacity: p, transform: `translateY(${(1 - p) * 30}px)` }}>
      <div style={{ fontFamily: t.fonts.heading, fontWeight: 800, fontSize: 66, lineHeight: 1.1, letterSpacing: "-0.025em", color: "#FFFFFF" }}>
        {CTA.main}
      </div>
      <div style={{ marginTop: 18, fontFamily: t.fonts.heading, fontWeight: 800, fontSize: 66, lineHeight: 1.1, letterSpacing: "-0.025em", color: t.colors.accent }}>
        {CTA.accent}
      </div>
      <div
        style={{
          display: "inline-block",
          marginTop: 36,
          padding: "14px 30px",
          borderRadius: 999,
          backgroundColor: t.colors.primary,
          color: t.colors.onPrimary,
          fontFamily: t.fonts.body,
          fontWeight: 700,
          fontSize: 30,
          opacity: p2,
          transform: `translateY(${(1 - p2) * 20}px)`,
        }}
      >
        {CTA.sub}
      </div>
    </div>
  );
};

const Stage: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const idx = lineIndexAt(frame);
  const inCta = frame >= CTA_START;
  const line = idx >= 0 && !inCta ? LINES[idx] : null;
  const speaking = (who: Speaker): boolean =>
    line !== null && line.who === who && frame - LINE_START[idx] < line.seconds * fps - 8;

  const robotExpression = inCta ? "senang" : line?.robot ?? "normal";
  const talkBounce = speaking("robot") ? Math.abs(Math.sin((frame / fps) * 12)) * 7 : 0;
  const shake = idx === 7 && frame - LINE_START[7] < 24 ? Math.sin(frame * 1.6) * 3 : 0;

  const r = robotStickmanSize(ROBOT_HEIGHT);
  const s = ganjarStickmanSize(GANJAR_HEIGHT);
  const ganjarExpression = inCta ? "senang" : line?.ganjar ?? "senyum";
  const ganjarBounce = speaking("ganjar") ? Math.abs(Math.sin((frame / fps) * 12)) * 7 : 0;
  const ganjarShake = idx === 7 && frame - LINE_START[7] < 24 ? Math.sin(frame * 1.6) * 3 : 0;

  return (
    <>
      <Chair />
      {/* potong di balik meja: kaki GanjarStickman tidak boleh muncul di bawah panel depan */}
      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: DESK_TOP + 60, overflow: "hidden" }}>
        <div
          style={{
            position: "absolute",
            left: SEAT_X - s.width / 2,
            top: GANJAR_TOP - ganjarBounce,
            transform: `rotate(${ganjarShake}deg)`,
            transformOrigin: "50% 62%",
          }}
        >
          <GanjarStickman height={GANJAR_HEIGHT} expression={ganjarExpression} talking={speaking("ganjar")} gesture={inCta ? "lambai" : line?.handGanjar ?? "netral"} hair headphones={false} strokeWidth={5} />
        </div>
      </div>
      <Desk />
      <Laptop />
      <Mug />
      <div
        style={{
          position: "absolute",
          left: ROBOT_CENTER_X - r.width / 2,
          top: DESK_TOP + ROBOT_FEET_GAP - ROBOT_HEIGHT - talkBounce,
          transform: `rotate(${shake}deg)`,
          transformOrigin: "50% 100%",
        }}
      >
        <RobotStickman height={ROBOT_HEIGHT} expression={robotExpression} gesture={inCta ? "lambai" : line?.handRobot ?? "netral"} strokeWidth={5} />
      </div>
    </>
  );
};

// `sfx`: "free" (efek CC0, sisanya jatuh ke synth) atau "synth" (semua buatan skrip).
type Props = { readonly theme: string; readonly sfx?: SfxSet };

// Reels 9:16 satir: Ganjar (stickman, duduk di depan laptop) ngobrol dengan Robot (Claude) di atas meja soal programmer yang makin lupa ngoding.
export const ProgrammerBodohVideo: React.FC<Props> = ({ theme, sfx = "free" }) => (
  <ThemeProvider name={theme}>
    <RoomBack />
    <AbsoluteFill>
      <Meters />
      <Hook />
      <Stage />
      <ChatFeed />
      <CtaCard />
    </AbsoluteFill>
    <Sfx set={sfx} />
    <BrandFooter theme={theme} handle="@ganjar_hadiatna" />
  </ThemeProvider>
);
