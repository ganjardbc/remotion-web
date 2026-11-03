import type React from "react";
import { Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { useTheme } from "../themes";
import type { DraftInsert, InsertKind } from "./types";

// Selipan (cutaway) Reels dialog fullscreen: latar menutup seluruh layar, di atas panggung dan teks layar, di bawah chat dan footer.
// Semua gerak ease-out [0.2, 0.8, 0.2, 1], tanpa bounce, spring, atau shake. Warna dan huruf dari tema.

const EASE = Easing.bezier(0.2, 0.8, 0.2, 1);
const IN = 0.35;
const OUT = 0.25;
// Latar selipan menutup seluruh layar (teks layar dan panggung tertutup). Isi di zona atas, di atas garis lantai;
// chat dan footer tetap tampil di atasnya.
const TOP = 130;
const HEIGHT = 1160;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
// Progres 0..1 dari detik `a` sampai `b` (lokal terhadap selipan), dengan ease-out.
const prog = (local: number, a: number, b: number): number => EASE(interpolate(local, [a, b], [0, 1], clamp));

type Theme = ReturnType<typeof useTheme>;

const Window: React.FC<{ readonly t: Theme; readonly title: string; readonly children: React.ReactNode; readonly tone?: "dark" | "danger" }> = ({ t, title, children, tone = "dark" }) => (
  <div
    style={{
      width: "100%",
      height: "100%",
      borderRadius: t.radius.large,
      overflow: "hidden",
      backgroundColor: t.code.bg,
      border: `2px solid ${tone === "danger" ? t.colors.danger : t.code.line}`,
      boxShadow: t.shadows.lift,
      display: "flex",
      flexDirection: "column",
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "20px 28px", backgroundColor: t.code.raised, borderBottom: `2px solid ${t.code.line}` }}>
      {[t.colors.danger, t.colors.accent, t.colors.success].map((c) => (
        <div key={c} style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: c }} />
      ))}
      <div style={{ marginLeft: 12, fontFamily: t.fonts.mono, fontSize: 28, color: t.code.muted }}>{title}</div>
    </div>
    <div style={{ flex: 1, padding: "40px 44px", display: "flex", flexDirection: "column", justifyContent: "center", fontFamily: t.fonts.mono, fontSize: 44, lineHeight: 1.55, color: t.code.text }}>{children}</div>
  </div>
);

const Line: React.FC<{ readonly local: number; readonly at: number; readonly children: React.ReactNode; readonly color?: string }> = ({ local, at, children, color }) => {
  const p = prog(local, at, at + 0.25);
  return <div style={{ opacity: p, transform: `translateX(${(1 - p) * -24}px)`, color, whiteSpace: "pre" }}>{children}</div>;
};

// ---------- promptKode ----------
const PROMPT = "bikin aplikasi kasir sederhana";
const CODE = ["const total = items", "  .reduce((a, i) => a + i.harga, 0);", "", "export function Kasir() {", "  return <Bayar total={total} />;", "}"];

const ITEMS: readonly (readonly [string, string])[] = [
  ["Kopi susu", "18.000"],
  ["Roti bakar", "22.000"],
  ["Teh manis", "8.000"],
];

const PromptKode: React.FC<{ readonly t: Theme; readonly local: number }> = ({ t, local }) => {
  const typed = Math.floor(interpolate(local, [0.3, 1.1], [0, PROMPT.length], clamp));
  const cursor = Math.floor(local * 2) % 2 === 0;
  const app = prog(local, 2.0, 2.5);
  return (
    <Window t={t} title="claude-code">
      <div style={{ color: t.colors.primarySoft }}>
        {"> "}
        {PROMPT.slice(0, typed)}
        <span style={{ opacity: typed < PROMPT.length || cursor ? 1 : 0 }}>▌</span>
      </div>
      <div style={{ marginTop: 28, fontSize: 38 }}>
        {CODE.map((l, i) => (
          <Line key={i} local={local} at={1.2 + i * 0.12}>
            {l || " "}
          </Line>
        ))}
      </div>
      <Line local={local} at={2.0} color={t.colors.success}>
        {"\n✓ aplikasi jalan"}
      </Line>
      <div
        style={{
          marginTop: 28,
          padding: "28px 36px",
          borderRadius: t.radius.card,
          backgroundColor: t.colors.surface,
          color: t.colors.ink,
          fontFamily: t.fonts.body,
          opacity: app,
          transform: `translateY(${(1 - app) * 30}px)`,
        }}
      >
        <div style={{ fontWeight: 800, fontSize: 40, marginBottom: 12 }}>Kasir Kopi</div>
        {ITEMS.map(([n, h]) => (
          <div key={n} style={{ display: "flex", justifyContent: "space-between", fontWeight: 500, fontSize: 34, lineHeight: 1.6 }}>
            <span>{n}</span>
            <span>Rp {h}</span>
          </div>
        ))}
        <div style={{ marginTop: 12, padding: "14px 0", textAlign: "center", borderRadius: t.radius.card, backgroundColor: t.colors.primary, color: t.colors.onPrimary, fontWeight: 700, fontSize: 36 }}>Bayar</div>
      </div>
    </Window>
  );
};

// ---------- terminalError ----------
const TerminalError: React.FC<{ readonly t: Theme; readonly local: number }> = ({ t, local }) => (
  <Window t={t} title="terminal" tone="danger">
    <Line local={local} at={0.2} color={t.code.muted}>
      {"$ npm run start"}
    </Line>
    <Line local={local} at={0.4} color={t.colors.accent}>
      {"warn  deprecated: kasir@1.0.0"}
    </Line>
    <Line local={local} at={0.6} color={t.colors.danger}>
      {"\nTypeError: Cannot read properties"}
    </Line>
    <Line local={local} at={0.8} color={t.colors.danger}>
      {"of undefined (reading 'harga')"}
    </Line>
    <div style={{ fontSize: 36, marginTop: 20, color: t.code.muted }}>
      <Line local={local} at={1.0}>{"  at hitungTotal (kasir.ts:42)"}</Line>
      <Line local={local} at={1.15}>{"  at Kasir (kasir.tsx:17)"}</Line>
      <Line local={local} at={1.3}>{"  at render (app.tsx:9)"}</Line>
    </div>
    <Line local={local} at={1.5} color={t.colors.danger}>
      {"\nFAIL  3 errors, 0 passed"}
    </Line>
    <div style={{ marginTop: 36, display: "flex", alignItems: "center", gap: 18, opacity: prog(local, 1.7, 2.1), fontFamily: t.fonts.body, fontWeight: 700, fontSize: 48 }}>
      <svg width="76" height="76" viewBox="0 0 24 24" fill="none" stroke={t.colors.danger} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="8" y="9" width="8" height="11" rx="4" />
        <path d="M9 9a3 3 0 0 1 6 0M4 13h4M16 13h4M5 7l3 2M19 7l-3 2M5 19l3-2M19 19l-3-2" />
      </svg>
      <span>
        Siapa yang <span style={{ color: t.colors.groundEmphasis }}>debug</span>?
      </span>
    </div>
  </Window>
);

// ---------- muridBertanya ----------
const Bubble: React.FC<{ readonly t: Theme; readonly p: number; readonly from: "kanan" | "kiri"; readonly name: string; readonly text: string; readonly primary?: boolean }> = ({
  t,
  p,
  from,
  name,
  text,
  primary,
}) => (
  <div style={{ alignSelf: from === "kanan" ? "flex-end" : "flex-start", maxWidth: "82%", opacity: p, transform: `translateX(${(1 - p) * (from === "kanan" ? 120 : -40)}px)` }}>
    <div style={{ marginBottom: 6, padding: "0 12px", textAlign: from === "kanan" ? "right" : "left", fontFamily: t.fonts.body, fontWeight: 600, fontSize: 28, color: t.colors.muted }}>{name}</div>
    <div
      style={{
        padding: "24px 36px",
        borderRadius: t.radius.large,
        backgroundColor: primary ? t.colors.primary : t.colors.surface,
        color: primary ? t.colors.onPrimary : t.colors.ink,
        border: primary ? "none" : `2px solid ${t.colors.border}`,
        boxShadow: t.shadows.md,
        fontFamily: t.fonts.body,
        fontWeight: 700,
        fontSize: 48,
        lineHeight: 1.25,
      }}
    >
      {text}
    </div>
  </div>
);

const TOPICS = ["Cara nulis prompt", "Template prompt", "Tips hemat token"];

const MuridBertanya: React.FC<{ readonly t: Theme; readonly local: number }> = ({ t, local }) => (
  <div
    style={{
      width: "100%",
      height: "100%",
      borderRadius: t.radius.large,
      backgroundColor: t.colors.primaryTint,
      boxShadow: t.shadows.lift,
      padding: 48,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      gap: 36,
    }}
  >
    <div style={{ opacity: prog(local, 0, 0.3) }}>
      <div style={{ fontFamily: t.fonts.heading, fontWeight: t.type.headlineWeight, fontSize: 56, color: t.colors.primaryInk, marginBottom: 20 }}>Kelas Prompt</div>
      {TOPICS.map((x, i) => (
        <div key={x} style={{ display: "flex", alignItems: "center", gap: 18, fontFamily: t.fonts.body, fontWeight: 600, fontSize: 42, lineHeight: 1.7, color: t.colors.primaryInk, opacity: prog(local, 0.1 + i * 0.12, 0.4 + i * 0.12) }}>
          <div style={{ width: 34, height: 34, borderRadius: 8, backgroundColor: t.colors.success, color: t.colors.onPrimary, fontSize: 26, display: "flex", alignItems: "center", justifyContent: "center" }}>✓</div>
          {x}
        </div>
      ))}
    </div>
    <Bubble t={t} p={prog(local, 0.8, 1.3)} from="kanan" name="Murid" text="Kenapa Ini Error?" />
    <Bubble t={t} p={prog(local, 2.4, 2.9)} from="kiri" name="Ganjar" text="Coba Tanya Claude" primary />
  </div>
);

// ---------- alarmProduction ----------
const ERRORS = ["POST /bayar  500", "GET /stok  500", "POST /login  500", "GET /laporan  500", "POST /bayar  500"];

const BARS = [8, 12, 10, 18, 35, 60, 82, 98];

const AlarmProduction: React.FC<{ readonly t: Theme; readonly local: number }> = ({ t, local }) => {
  const rate = Math.round(interpolate(local, [0.3, 1.6], [2, 98], clamp));
  const red = prog(local, 0.3, 1.0);
  return (
    <Window t={t} title="dashboard" tone="danger">
      <div style={{ display: "flex", alignItems: "center", gap: 20, fontFamily: t.fonts.body, fontWeight: 800, fontSize: 60 }}>
        <div style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: red > 0.5 ? t.colors.danger : t.colors.success }} />
        <span style={{ color: t.colors.groundEmphasis }}>Production</span>
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 40, marginTop: 20 }}>
        <div>
          <div style={{ fontFamily: t.fonts.body, fontWeight: 800, fontSize: 150, lineHeight: 1.1, color: red > 0.5 ? t.colors.danger : t.code.text }}>{rate}%</div>
          <div style={{ fontFamily: t.fonts.body, fontWeight: 500, fontSize: 30, color: t.code.muted }}>error rate</div>
        </div>
        <div style={{ flex: 1, display: "flex", alignItems: "flex-end", gap: 10, height: 190 }}>
          {BARS.map((h, i) => (
            <div key={i} style={{ flex: 1, height: `${h * prog(local, 0.2 + i * 0.12, 0.7 + i * 0.12)}%`, backgroundColor: h > 30 ? t.colors.danger : t.code.line, borderRadius: 6 }} />
          ))}
        </div>
      </div>
      <div style={{ marginTop: 28, fontSize: 40 }}>
        {ERRORS.map((e, i) => (
          <Line key={i} local={local} at={0.8 + i * 0.3} color={t.colors.danger}>
            {"✕ " + e}
          </Line>
        ))}
      </div>
      <div style={{ marginTop: 24, padding: "18px 28px", borderRadius: t.radius.card, backgroundColor: t.code.raised, border: `2px solid ${t.colors.danger}`, fontFamily: t.fonts.body, fontWeight: 600, fontSize: 34, color: t.code.text, opacity: prog(local, 2.0, 2.4) }}>
        Alert: pelanggan tidak bisa bayar
      </div>
    </Window>
  );
};

// ---------- kartuFollow ----------
const KartuFollow: React.FC<{ readonly t: Theme; readonly local: number }> = ({ t, local }) => {
  const press = prog(local, 1.5, 1.8);
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        borderRadius: t.radius.large,
        backgroundColor: t.colors.primary,
        boxShadow: t.shadows.lift,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 36,
        color: t.colors.onPrimary,
        fontFamily: t.fonts.body,
      }}
    >
      <Img src={staticFile(t.logo.src)} style={{ width: 220, height: 220, borderRadius: 110, border: `6px solid ${t.colors.surface}`, opacity: prog(local, 0.1, 0.5) }} />
      <div style={{ fontWeight: 800, fontSize: 60, opacity: prog(local, 0.3, 0.7) }}>{t.handle}</div>
      <div style={{ fontWeight: 500, fontSize: 38, opacity: prog(local, 0.5, 0.9), textAlign: "center", padding: "0 80px" }}>Jualan ilmu yang aku paham</div>
      <div style={{ display: "flex", gap: 16, opacity: prog(local, 0.7, 1.1) }}>
        {["Reels", "Carousel", "Tips AI"].map((c) => (
          <div key={c} style={{ padding: "10px 26px", borderRadius: 999, backgroundColor: t.colors.primaryDark, color: t.colors.onPrimary, fontWeight: 600, fontSize: 32 }}>
            {c}
          </div>
        ))}
      </div>
      <div
        style={{
          marginTop: 12,
          padding: "22px 80px",
          borderRadius: 999,
          backgroundColor: press > 0.5 ? t.colors.primaryDeep : t.colors.surface,
          color: press > 0.5 ? t.colors.onPrimary : t.colors.primary,
          border: `3px solid ${t.colors.surface}`,
          fontWeight: 800,
          fontSize: 46,
          opacity: prog(local, 0.9, 1.3),
        }}
      >
        {press > 0.5 ? "Following" : "Follow"}
      </div>
    </div>
  );
};

// ---------- gitBlame ----------
const BLAME: readonly (readonly [string, string])[] = [
  ["a41f9c2", "const items = keranjang;"],
  ["a41f9c2", "const total = hitung(items);"],
  ["7be03d1", ""],
  ["7be03d1", "export function Kasir() {"],
  ["c9d2a58", "  return <Bayar total={total} />;"],
  ["e10b6f4", "}"],
];

const GitBlame: React.FC<{ readonly t: Theme; readonly local: number }> = ({ t, local }) => (
  <Window t={t} title="git blame kasir.tsx">
    <div style={{ fontSize: 26 }}>
      {BLAME.map(([h, code], i) => (
        <Line key={i} local={local} at={0.1 + i * 0.1}>
          <span style={{ color: t.code.muted }}>{h}</span>
          <span style={{ color: t.colors.primarySoft }}>{"  Claude Code  "}</span>
          {code}
        </Line>
      ))}
    </div>
    <div style={{ marginTop: 40, opacity: prog(local, 0.9, 1.3), fontFamily: t.fonts.body }}>
      <div style={{ fontWeight: 700, fontSize: 40, color: t.code.muted }}>Penulis baris kode</div>
      <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 14, fontWeight: 800, fontSize: 56 }}>
        <span style={{ color: t.colors.groundEmphasis }}>Claude Code</span>
        <div style={{ flex: 1, height: 22, borderRadius: 11, backgroundColor: t.colors.primary, transform: `scaleX(${prog(local, 1.0, 1.6)})`, transformOrigin: "left" }} />
        <span>100%</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 14, fontWeight: 600, fontSize: 44, color: t.code.muted }}>
        <span>Ganjar</span>
        <div style={{ flex: 1, height: 22, borderRadius: 11, backgroundColor: t.code.line }} />
        <span>0%</span>
      </div>
    </div>
  </Window>
);

// ---------- landingKelas ----------
const LandingKelas: React.FC<{ readonly t: Theme; readonly local: number }> = ({ t, local }) => (
  <div style={{ width: "100%", height: "100%", borderRadius: t.radius.large, overflow: "hidden", backgroundColor: t.colors.surface, boxShadow: t.shadows.lift, display: "flex", flexDirection: "column" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "20px 28px", backgroundColor: t.colors.primaryTint, borderBottom: `2px solid ${t.colors.border}` }}>
      {[t.colors.danger, t.colors.accent, t.colors.success].map((c) => (
        <div key={c} style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: c }} />
      ))}
      <div style={{ marginLeft: 12, flex: 1, padding: "8px 22px", borderRadius: 999, backgroundColor: t.colors.surface, fontFamily: t.fonts.mono, fontSize: 28, color: t.colors.muted }}>kelasganjar.id</div>
    </div>
    <div style={{ flex: 1, padding: "0 60px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", gap: 30, fontFamily: t.fonts.body, color: t.colors.ink }}>
      <div style={{ padding: "10px 28px", borderRadius: 999, backgroundColor: t.colors.primaryTint, color: t.colors.primaryDark, fontWeight: 700, fontSize: 32, opacity: prog(local, 0.1, 0.5) }}>Pendaftaran dibuka</div>
      <div style={{ fontFamily: t.fonts.heading, fontWeight: t.type.headlineWeight, fontSize: 82, lineHeight: 1.1, textWrap: "balance", opacity: prog(local, 0.2, 0.7), transform: `translateY(${(1 - prog(local, 0.2, 0.7)) * 24}px)` }}>Kelas Bikin Aplikasi Dengan AI</div>
      <div style={{ fontWeight: 500, fontSize: 44, color: t.colors.muted, opacity: prog(local, 0.5, 0.9) }}>Tinggal prompt, aplikasi jadi.</div>
      <div style={{ fontWeight: 800, fontSize: 76, color: t.colors.primary, opacity: prog(local, 0.8, 1.2) }}>Rp 499.000</div>
      <div style={{ padding: "26px 90px", borderRadius: 999, backgroundColor: t.colors.primary, color: t.colors.onPrimary, fontWeight: 800, fontSize: 48, opacity: prog(local, 1.1, 1.5) }}>Daftar Sekarang</div>
      <div style={{ fontWeight: 600, fontSize: 32, color: t.colors.muted, opacity: prog(local, 1.4, 1.8) }}>Sisa 12 dari 50 kursi</div>
    </div>
  </div>
);

// ---------- silabusBaru ----------
const SILABUS = ["Kenapa aplikasinya jalan", "Kenapa bisa error", "Cara debug sendiri"];

const SilabusBaru: React.FC<{ readonly t: Theme; readonly local: number }> = ({ t, local }) => (
  <div style={{ width: "100%", height: "100%", borderRadius: t.radius.large, backgroundColor: t.colors.primaryTint, boxShadow: t.shadows.lift, padding: 56, display: "flex", flexDirection: "column", justifyContent: "center", gap: 36, fontFamily: t.fonts.body, color: t.colors.primaryInk }}>
    <div style={{ fontFamily: t.fonts.heading, fontWeight: t.type.headlineWeight, fontSize: 64, lineHeight: 1.1, opacity: prog(local, 0, 0.4) }}>Silabus Kelas Baru</div>
    <div>
      {SILABUS.map((x, i) => (
        <div key={x} style={{ display: "flex", alignItems: "center", gap: 22, padding: "18px 0", fontWeight: 600, fontSize: 50, opacity: prog(local, 0.4 + i * 0.35, 0.8 + i * 0.35), transform: `translateX(${(1 - prog(local, 0.4 + i * 0.35, 0.8 + i * 0.35)) * -30}px)` }}>
          <div style={{ width: 46, height: 46, borderRadius: 10, backgroundColor: t.colors.success, color: t.colors.onPrimary, fontSize: 34, display: "flex", alignItems: "center", justifyContent: "center" }}>✓</div>
          {x}
        </div>
      ))}
    </div>
    <div style={{ padding: "26px 34px", borderRadius: t.radius.card, backgroundColor: t.colors.surface, border: `2px solid ${t.colors.border}`, fontWeight: 700, fontSize: 46, lineHeight: 1.25, opacity: prog(local, 1.7, 2.2) }}>
      Ajarin yang <span style={{ color: t.colors.accentDark ?? t.colors.accent }}>kamu paham</span>, bukan yang aku kerjain.
    </div>
  </div>
);

const BODY: Readonly<Record<InsertKind, React.FC<{ readonly t: Theme; readonly local: number }>>> = {
  promptKode: PromptKode,
  terminalError: TerminalError,
  muridBertanya: MuridBertanya,
  alarmProduction: AlarmProduction,
  kartuFollow: KartuFollow,
  gitBlame: GitBlame,
  landingKelas: LandingKelas,
  silabusBaru: SilabusBaru,
};

const BACKDROP: Readonly<Record<InsertKind, (t: Theme) => string>> = {
  promptKode: (t) => t.colors.ground,
  terminalError: (t) => t.colors.ground,
  muridBertanya: (t) => t.colors.ground,
  alarmProduction: (t) => t.colors.ground,
  kartuFollow: (t) => t.colors.ground,
  gitBlame: (t) => t.colors.ground,
  landingKelas: (t) => t.colors.ground,
  silabusBaru: (t) => t.colors.ground,
};

export const Inserts: React.FC<{ readonly inserts: readonly DraftInsert[] }> = ({ inserts }) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const now = frame / fps;
  const active = inserts.find((x) => now >= x.from && now < x.from + x.dur);
  if (!active) return null;
  const local = now - active.from;
  const enter = EASE(interpolate(local, [0, IN], [0, 1], clamp));
  const exit = interpolate(local, [active.dur - OUT, active.dur], [1, 0], clamp);
  const Body = BODY[active.kind];
  return (
    <div style={{ position: "absolute", inset: 0, backgroundColor: BACKDROP[active.kind](t), opacity: enter * exit }}>
      <div style={{ position: "absolute", left: 60, right: 60, top: TOP, height: HEIGHT, transform: `translateY(${(1 - enter) * 40}px)` }}>
        <Body t={t} local={local} />
      </div>
    </div>
  );
};
