import type React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { Icon } from "../../icons";
import { useTheme } from "../../themes";
import { Enter } from "../../motion";
import { Accent, Chip, Frame, Headline, cue, useCue } from "./parts";

// Cue ditulis sebagai frasa dari SPOKEN (config.ts): `const { when, p } = useCue("<id>")`, lalu `cue(when("frasa"))`.
// Hero tiap scene: hook grafik biaya naik, relate coretan 62% + dua kolom, hasil dua baris perbandingan (bar terisi),
// shift langkah bernomor dengan penghubung, urgency cincin progres 1/2, closing grid 692 titik, cta kotak komentar.
// Elemen dibuat besar agar mengisi area konten (y 170-1210) tanpa ruang kosong.

const EASE = Easing.bezier(0.2, 0.8, 0.2, 1);

// Ukuran judul seragam di semua scene: TITLE untuk judul utama, SUB untuk judul pendukung (muted).
const TITLE = 92;
const SUB = 58;

// ---------- 1. Hook ----------

// Grafik garis biaya yang naik, digambar dari kiri ke kanan.
const CostChart: React.FC<{ readonly start: number }> = ({ start }) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const W = 936;
  const H = 330;
  const pts: readonly (readonly [number, number])[] = [[30, 280], [220, 250], [400, 232], [560, 160], [740, 110], [900, 40]];
  const path = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`).join(" ");
  const len = pts.reduce((a, [x, y], i) => (i === 0 ? 0 : a + Math.hypot(x - pts[i - 1][0], y - pts[i - 1][1])), 0);
  const draw = interpolate(frame, [start, start + 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  const dot = interpolate(frame, [start + 34, start + 46], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  return (
    <Enter name="Grafik biaya" delay={start - 8} y={50} style={{ padding: "28px 0 12px", borderRadius: t.radius.large, backgroundColor: t.code.raised, border: `2px solid ${t.code.line}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", padding: "0 36px 8px", fontFamily: t.fonts.mono, fontWeight: 600, fontSize: 34, color: t.code.muted }}>
        <span>biaya per pertanyaan</span>
        <span>↑</span>
      </div>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: "block" }}>
        {[80, 160, 240].map((y) => (
          <line key={y} x1={30} x2={W - 30} y1={y} y2={y} stroke={t.code.line} strokeWidth={2} strokeDasharray="6 10" />
        ))}
        <path d={path} fill="none" stroke={t.colors.primarySoft} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={len} strokeDashoffset={len * (1 - draw)} />
        <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r={20 * dot} fill={t.colors.groundText} />
      </svg>
    </Enter>
  );
};

export const HookScene: React.FC = () => (
  <Frame id="hook" sweep>
    <Chip name="Tag" delay={cue(0.1)}>
      CodeGraph
    </Chip>
    <Headline delay={cue(0.2)} size={TITLE}>
      Aku tes. Malah lebih <Accent>mahal</Accent>
    </Headline>
    <CostChart start={cue(1.0)} />
  </Frame>
);

// ---------- 2. Relate ----------

// Tiga titik run: terisi satu per satu.
const Runs: React.FC<{ readonly start: number }> = ({ start }) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", gap: 16 }}>
      {[0, 1, 2].map((i) => {
        const on = interpolate(frame, [start + i * 8, start + i * 8 + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
        return <div key={i} style={{ width: 30, height: 30, borderRadius: 999, border: `3px solid ${t.colors.primarySoft}`, backgroundColor: on > 0.5 ? t.colors.primarySoft : "transparent" }} />;
      })}
    </div>
  );
};

const Col: React.FC<{ readonly delay: number; readonly name: string; readonly title: string; readonly icon: "route" | "search" }> = ({ delay, name, title, icon }) => {
  const t = useTheme();
  return (
    <Enter
      name={name}
      delay={delay}
      y={60}
      style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 18, padding: "36px 20px", borderRadius: t.radius.large, backgroundColor: t.code.raised, border: `2px solid ${t.code.line}` }}
    >
      <div style={{ width: 108, height: 108, borderRadius: 999, backgroundColor: t.code.line, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon name={icon} size={66} color={t.colors.groundEmphasis} />
      </div>
      <div style={{ fontFamily: t.fonts.heading, fontWeight: 700, fontSize: 54, lineHeight: 1.15, color: t.code.text, textAlign: "center" }}>{title}</div>
      <Runs start={delay + 10} />
      <div style={{ fontFamily: t.fonts.mono, fontWeight: 600, fontSize: 36, color: t.code.muted }}>3 kali</div>
    </Enter>
  );
};

export const RelateScene: React.FC = () => {
  const t = useTheme();
  const { when, p } = useCue("relate");
  const strike = p(when("Aku nggak"), 0.5);
  return (
    <Frame id="relate" variant="dark">
      <Enter name="Klaim" delay={cue(0.1)} y={44} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
        <div style={{ fontFamily: t.fonts.heading, fontWeight: 600, fontSize: 46, color: t.colors.groundTextMuted }}>Katanya hemat</div>
        <div style={{ position: "relative", fontFamily: t.fonts.heading, fontWeight: 800, fontSize: 240, lineHeight: 1, letterSpacing: "-0.04em", color: t.colors.groundText }}>
          62%
          <div style={{ position: "absolute", left: -24, top: "54%", height: 16, width: `calc(${strike * 100}% + 48px)`, borderRadius: 10, backgroundColor: t.colors.groundEmphasis }} />
        </div>
        <div style={{ fontFamily: t.fonts.mono, fontWeight: 600, fontSize: 40, color: t.colors.groundTextMuted }}>token</div>
      </Enter>
      <div style={{ display: "flex", gap: 28 }}>
        <Col delay={cue(when("Satu pakai"))} name="Dengan" title="Pakai CodeGraph" icon="route" />
        <Col delay={cue(when("satu nggak"))} name="Tanpa" title="Tanpa CodeGraph" icon="search" />
      </div>
      <Enter
        name="Tengah"
        delay={cue(when("ambil tengahnya"))}
        y={40}
        style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20, padding: "22px 36px", borderRadius: t.radius.large, backgroundColor: t.code.raised, border: `2px solid ${t.code.line}` }}
      >
        <Icon name="circleCheck" size={56} color={t.colors.groundEmphasis} />
        <div style={{ fontFamily: t.fonts.body, fontWeight: 700, fontSize: 52, color: t.code.text }}>Ambil tengahnya</div>
      </Enter>
    </Frame>
  );
};

// ---------- 3. Hasil ----------

// Satu baris hasil: label dan token di kiri, harga besar di kanan, bar yang terisi di bawah.
const Result: React.FC<{
  readonly delay: number;
  readonly name: string;
  readonly label: string;
  readonly price: string;
  readonly tokens: string;
  readonly bar: number;
}> = ({ delay, name, label, price, tokens, bar }) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const fill = interpolate(frame, [delay + 8, delay + 34], [0, bar], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  return (
    <Enter name={name} delay={delay} y={60} style={{ display: "flex", flexDirection: "column", gap: 26, padding: "40px 44px", borderRadius: t.radius.large, backgroundColor: t.code.raised, border: `2px solid ${t.code.line}` }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ fontFamily: t.fonts.mono, fontWeight: 600, fontSize: 34, color: t.code.muted, whiteSpace: "nowrap" }}>{label}</div>
          <div style={{ fontFamily: t.fonts.body, fontWeight: 700, fontSize: 46, color: t.code.text, whiteSpace: "nowrap" }}>{tokens}</div>
        </div>
        <div style={{ fontFamily: t.fonts.heading, fontWeight: 800, fontSize: 150, lineHeight: 1, letterSpacing: "-0.04em", color: t.code.text }}>{price}</div>
      </div>
      <div style={{ height: 40, borderRadius: 20, backgroundColor: t.code.line, overflow: "hidden" }}>
        <div style={{ width: `${fill * 100}%`, height: "100%", borderRadius: 20, backgroundColor: t.colors.primarySoft }} />
      </div>
    </Enter>
  );
};

export const HasilScene: React.FC = () => {
  const { when } = useCue("hasil");
  return (
    <Frame id="hasil" variant="primary">
      <Headline delay={cue(0.1)} size={SUB} muted>
        Median tiga kali jalan
      </Headline>
      <Result delay={cue(when("Pakai CodeGraph"))} name="Dengan" label="pakai CodeGraph" price="$0,29" tokens="385 ribu token" bar={1} />
      <Result delay={cue(when("Tanpa CodeGraph:"))} name="Tanpa" label="tanpa CodeGraph" price="$0,19" tokens="206 ribu token" bar={206 / 385} />
    </Frame>
  );
};

// ---------- 4. Shift ----------

// Langkah bernomor; penghubung vertikal di antaranya digambar turun.
const Step: React.FC<{ readonly delay: number; readonly name: string; readonly n: number; readonly icon: "route" | "database" | "search"; readonly sub: string; readonly strong?: boolean; readonly children: React.ReactNode }> = ({
  delay,
  name,
  n,
  icon,
  sub,
  strong,
  children,
}) => {
  const t = useTheme();
  return (
    <Enter
      name={name}
      delay={delay}
      y={60}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 32,
        padding: "40px 40px",
        borderRadius: t.radius.large,
        backgroundColor: t.code.raised,
        border: `3px solid ${strong ? t.colors.primarySoft : t.code.line}`,
      }}
    >
      <div style={{ width: 112, height: 112, flexShrink: 0, borderRadius: 999, backgroundColor: t.code.line, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
        <Icon name={icon} size={64} color={t.colors.groundEmphasis} />
        <div
          style={{
            position: "absolute",
            top: -10,
            left: -10,
            width: 46,
            height: 46,
            borderRadius: 999,
            backgroundColor: t.colors.primarySoft,
            color: t.colors.primaryDeep,
            fontFamily: t.fonts.heading,
            fontWeight: 800,
            fontSize: 28,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {n}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ fontFamily: t.fonts.heading, fontWeight: 700, fontSize: 60, lineHeight: 1.1, color: t.code.text }}>{children}</div>
        <div style={{ fontFamily: t.fonts.mono, fontWeight: 500, fontSize: 34, color: t.code.muted }}>{sub}</div>
      </div>
    </Enter>
  );
};

const Link: React.FC<{ readonly start: number }> = ({ start }) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const h = interpolate(frame, [start, start + 10], [0, 56], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  return (
    <div style={{ display: "flex", justifyContent: "center", height: 56 }}>
      <div style={{ width: 8, height: h, borderRadius: 4, backgroundColor: t.colors.primarySoft, opacity: 0.7 }} />
    </div>
  );
};

export const ShiftScene: React.FC = () => {
  const { when } = useCue("shift");
  return (
    <Frame id="shift">
      <Headline delay={cue(0.1)} size={TITLE}>
        Tool-nya jalan, <Accent>bukan rusak</Accent>
      </Headline>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Step delay={cue(when("Tool-nya jalan"))} name="Jalan" n={1} icon="route" sub="CodeGraph dipanggil">
          Tool jalan
        </Step>
        <Link start={cue(when("Hasilnya besar") - 0.25)} />
        <Step delay={cue(when("Hasilnya besar"))} name="Besar" n={2} icon="database" sub="hasil panjang masuk konteks">
          Hasilnya besar
        </Step>
        <Link start={cue(when("tetap grep") - 0.25)} />
        <Step delay={cue(when("tetap grep"))} name="Grep" n={3} icon="search" sub="Claude mengulang sendiri" strong>
          Tetap grep sendiri
        </Step>
      </div>
    </Frame>
  );
};

// ---------- 5. Urgency ----------

// Cincin progres: terisi sampai separuh.
const Ring: React.FC<{ readonly start: number }> = ({ start }) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const R = 190;
  const C = 2 * Math.PI * R;
  const fill = 0.5 * interpolate(frame, [start, start + 28], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  return (
    <Enter name="Cincin" delay={start - 6} y={40} style={{ display: "flex", justifyContent: "center", position: "relative" }}>
      <svg width={480} height={480} viewBox="0 0 480 480">
        <circle cx={240} cy={240} r={R} fill="none" stroke={t.code.line} strokeWidth={36} />
        <circle
          cx={240}
          cy={240}
          r={R}
          fill="none"
          stroke={t.colors.primarySoft}
          strokeWidth={36}
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={C * (1 - fill)}
          transform="rotate(-90 240 240)"
        />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4 }}>
        <div style={{ fontFamily: t.fonts.heading, fontWeight: 800, fontSize: 190, lineHeight: 1, letterSpacing: "-0.04em", color: t.colors.groundText }}>1/2</div>
        <div style={{ fontFamily: t.fonts.mono, fontWeight: 600, fontSize: 40, color: t.colors.groundTextMuted }}>cerita</div>
      </div>
    </Enter>
  );
};

export const UrgencyScene: React.FC = () => {
  const { when } = useCue("urgency");
  return (
    <Frame id="urgency" variant="primary">
      <Headline delay={cue(0.1)} size={TITLE}>
        Ini baru <Accent>separuh ceritanya</Accent>
      </Headline>
      <Ring start={cue(when("baru separuh"))} />
    </Frame>
  );
};

// ---------- 6. Closing ----------

// Grid 692 titik (satu titik = satu file), terisi mengikuti hitungan.
const FileGrid: React.FC<{ readonly progress: number }> = ({ progress }) => {
  const t = useTheme();
  const COLS = 40;
  const TOTAL = 692;
  const lit = Math.floor(TOTAL * progress);
  const rows = Math.ceil(TOTAL / COLS);
  return (
    <svg width={936} height={rows * 18} viewBox={`0 0 ${COLS * 23.4} ${rows * 18}`} style={{ display: "block" }}>
      {Array.from({ length: TOTAL }, (_, i) => (
        <circle key={i} cx={(i % COLS) * 23.4 + 11.7} cy={Math.floor(i / COLS) * 18 + 9} r={6.5} fill={i < lit ? t.colors.primarySoft : t.code.line} />
      ))}
    </svg>
  );
};

export const ClosingScene: React.FC = () => {
  const t = useTheme();
  const { when, p } = useCue("closing");
  const prog = p(0.1, 1.2);
  const count = Math.round(692 * prog);
  return (
    <Frame id="closing" variant="dark">
      <Enter name="Counter" delay={cue(0.1)} y={44} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 20 }}>
          <span style={{ fontFamily: t.fonts.heading, fontWeight: 800, fontSize: 190, lineHeight: 1, letterSpacing: "-0.04em", color: t.colors.groundText }}>{count}</span>
          <span style={{ fontFamily: t.fonts.mono, fontWeight: 600, fontSize: 50, color: t.colors.groundTextMuted }}>file</span>
        </div>
        <FileGrid progress={prog} />
      </Enter>
      <Enter
        name="Grep"
        delay={cue(when("Pertanyaannya gampang"))}
        y={50}
        style={{ display: "flex", alignItems: "center", gap: 28, padding: "22px 40px", borderRadius: t.radius.large, backgroundColor: t.code.raised, border: `2px solid ${t.code.line}` }}
      >
        <div style={{ width: 84, height: 84, flexShrink: 0, borderRadius: 999, backgroundColor: t.code.line, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="search" size={56} color={t.colors.groundEmphasis} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ fontFamily: t.fonts.heading, fontWeight: 700, fontSize: 56, color: t.code.text }}>Gampang buat grep</div>
          <div style={{ fontFamily: t.fonts.mono, fontWeight: 500, fontSize: 34, color: t.code.muted }}>proyek kecil, pertanyaan sederhana</div>
        </div>
      </Enter>
      <Headline delay={cue(when("Jadi bukan"))} size={TITLE}>
        Bukan <Accent>vonis</Accent>
      </Headline>
      <Headline delay={cue(when("Satu proyek"))} size={SUB} muted name="Satu">
        Satu proyek, satu pertanyaan
      </Headline>
    </Frame>
  );
};

// ---------- 7. CTA ----------

export const CtaScene: React.FC = () => {
  const t = useTheme();
  const { when, frame } = useCue("cta");
  const caret = Math.floor(frame / 15) % 2 === 0;
  return (
    <Frame id="cta">
      <Headline delay={cue(0.1)} size={TITLE}>
        Tes sendiri <Accent>dulu</Accent>
      </Headline>
      <Enter name="Komentar" delay={cue(when("Tool apa"))} y={60} style={{ display: "flex", flexDirection: "column", gap: 26, padding: "40px 40px", borderRadius: t.radius.large, backgroundColor: t.code.raised, border: `2px solid ${t.code.line}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ width: 96, height: 96, borderRadius: 999, backgroundColor: t.colors.primarySoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="user" size={58} color={t.colors.primaryDeep} />
          </div>
          <div style={{ fontFamily: t.fonts.mono, fontWeight: 600, fontSize: 40, color: t.code.muted }}>komentar</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "34px 36px", borderRadius: t.radius.card, backgroundColor: t.code.bg, border: `2px solid ${t.code.line}` }}>
          <Icon name="messageCircle" size={64} color={t.colors.groundEmphasis} />
          <div style={{ fontFamily: t.fonts.body, fontWeight: 600, fontSize: 52, lineHeight: 1.2, color: t.code.text }}>
            Tool apa yang mau aku tes?
            <span style={{ opacity: caret ? 1 : 0, color: t.code.muted }}> |</span>
          </div>
        </div>
      </Enter>
      <Chip name="Komentar chip" delay={cue(when("Tulis di komentar"))}>
        Tulis di komentar
      </Chip>
    </Frame>
  );
};
