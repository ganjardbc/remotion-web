import type React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { Backdrop } from "../../Backdrop";
import { Icon } from "../../icons";
import { useTheme } from "../../themes";
import { Enter } from "../../motion";
import { at, FPS, LEAD, SCENE_IDS, type SceneId } from "./config";

type IconName = React.ComponentProps<typeof Icon>["name"];

const EASE = Easing.bezier(0.2, 0.8, 0.2, 1);

// Waktu cue ditulis dalam detik sejak suara mulai; LEAD menggeser ke frame lokal scene.
export const cue = (s: number): number => Math.round(s * FPS) + LEAD;

// `when(frasa)` = detik saat frasa diucapkan di scene ini, `p(detik, durasi)` = progres 0..1 dengan ease-out.
export const useCue = (
  id: SceneId,
): { readonly frame: number; readonly when: (phrase: string) => number; readonly p: (start: number, dur?: number) => number } => {
  const frame = useCurrentFrame();
  const p = (start: number, dur = 0.6): number =>
    interpolate(frame, [cue(start), cue(start + dur)], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE,
    });
  return { frame, when: (phrase) => at(id, phrase), p };
};

// Area konten di atas karakter. Karakter menempati sekitar y 1230-1740.
export const Frame: React.FC<{ readonly id: SceneId; readonly sweep?: boolean; readonly variant?: "ground" | "dark" | "primary"; readonly children: React.ReactNode }> = ({ id, sweep, variant = "ground", children }) => {
  const index = SCENE_IDS.indexOf(id) + 1;
  const frame = useCurrentFrame();
  const fade = interpolate(frame, [0, 6], [0, 1], { extrapolateRight: "clamp" });
  return (
    <>
      <Backdrop variant={variant} label={`${String(index).padStart(2, "0")} / ${String(SCENE_IDS.length).padStart(2, "0")}`} sweep={sweep} />
      <div
        style={{
          position: "absolute",
          left: 72,
          right: 72,
          top: 170,
          height: 1040,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "stretch",
          gap: 36,
          opacity: fade,
        }}
      >
        {children}
      </div>
    </>
  );
};

export const Headline: React.FC<{
  readonly delay: number;
  readonly size?: number;
  readonly muted?: boolean;
  readonly name?: string;
  readonly children: React.ReactNode;
}> = ({ delay, size = 104, muted, name = "Headline", children }) => {
  const t = useTheme();
  return (
    <Enter
      name={name}
      delay={delay}
      y={44}
      style={{
        textAlign: "center",
        textWrap: "balance",
        fontFamily: t.fonts.heading,
        fontWeight: muted ? 600 : t.type.headlineWeight,
        fontSize: Math.round(size * t.type.scale),
        lineHeight: 1.12,
        letterSpacing: `${t.type.tracking}em`,
        color: muted ? t.colors.groundTextMuted : t.colors.groundText,
      }}
    >
      {children}
    </Enter>
  );
};

export const Accent: React.FC<{ readonly children: React.ReactNode }> = ({ children }) => {
  const t = useTheme();
  return <span style={{ color: t.colors.groundEmphasis }}>{children}</span>;
};

// Membesar dari 0 dengan ease-out, tanpa pantulan.
export const Grow: React.FC<{ readonly delay: number; readonly children: React.ReactNode }> = ({ delay, children }) => {
  const frame = useCurrentFrame();
  const s = interpolate(frame, [delay, delay + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  return <div style={{ display: "flex", justifyContent: "center", scale: s, opacity: Math.min(1, s * 2) }}>{children}</div>;
};

// Pil kecil berhuruf mono, mis. nama produk atau perintah.
export const Chip: React.FC<{ readonly delay: number; readonly name: string; readonly children: React.ReactNode }> = ({ delay, name, children }) => {
  const t = useTheme();
  return (
    <Enter name={name} delay={delay} y={30} style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ padding: "12px 36px", borderRadius: 999, backgroundColor: t.colors.groundChipBg, color: t.colors.groundChipText, fontFamily: t.fonts.mono, fontWeight: 700, fontSize: 40 }}>
        {children}
      </div>
    </Enter>
  );
};

// Penanda nomor poin: angka di lingkaran oranye lalu judul kecil.
export const PointTag: React.FC<{ readonly delay: number; readonly n: number; readonly children: React.ReactNode }> = ({ delay, n, children }) => {
  const t = useTheme();
  return (
    <Enter name={`Poin ${n}`} delay={delay} y={30} style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "12px 36px 12px 14px", borderRadius: 999, backgroundColor: t.colors.groundChipBg }}>
        <div
          style={{
            width: 68,
            height: 68,
            borderRadius: 999,
            backgroundColor: t.colors.accent,
            color: t.colors.onAccent,
            fontFamily: t.fonts.heading,
            fontWeight: 800,
            fontSize: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {n}
        </div>
        <div style={{ fontFamily: t.fonts.heading, fontWeight: 700, fontSize: 42, color: t.colors.groundChipText }}>{children}</div>
      </div>
    </Enter>
  );
};

// Kartu gelap dengan ikon bulat di kiri; `sub` = baris kedua yang lebih kecil.
export const Card: React.FC<{
  readonly delay: number;
  readonly name: string;
  readonly icon: IconName;
  readonly sub?: React.ReactNode;
  readonly highlight?: boolean;
  readonly dim?: boolean;
  readonly x?: number;
  readonly children: React.ReactNode;
}> = ({ delay, name, icon, sub, highlight, dim, x = 0, children }) => {
  const t = useTheme();
  const dark = t.colors.accentDark ?? t.colors.accent;
  return (
    <Enter
      name={name}
      delay={delay}
      x={x}
      y={x ? 0 : 50}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 28,
        padding: "28px 36px",
        borderRadius: t.radius.large,
        backgroundColor: highlight ? dark : t.code.raised,
        border: `2px solid ${highlight ? dark : t.code.line}`,
        boxShadow: highlight ? t.shadows.glow : "none",
        opacity: dim ? 0.55 : 1,
        fontFamily: t.fonts.body,
        fontWeight: 600,
        fontSize: 46,
        lineHeight: 1.2,
        color: highlight ? "#FFFFFF" : t.code.text,
      }}
    >
      <div
        style={{
          width: 88,
          height: 88,
          flexShrink: 0,
          borderRadius: 999,
          backgroundColor: highlight ? "rgba(255,255,255,0.22)" : t.code.line,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon name={icon} size={52} color={highlight ? "#FFFFFF" : t.colors.groundTextMuted} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <div>{children}</div>
        {sub ? <div style={{ fontFamily: t.fonts.mono, fontWeight: 500, fontSize: 32, color: highlight ? "rgba(255,255,255,0.88)" : t.code.muted }}>{sub}</div> : null}
      </div>
    </Enter>
  );
};

// Batang horizontal yang mengisi dari kiri; value 0..1 dari lebar penuh.
export const Bar: React.FC<{ readonly value: number; readonly color: string; readonly height?: number }> = ({ value, color, height = 44 }) => {
  const t = useTheme();
  return (
    <div style={{ height, borderRadius: height / 2, backgroundColor: t.code.line, overflow: "hidden" }}>
      <div style={{ width: `${Math.max(0, value) * 100}%`, height: "100%", borderRadius: height / 2, backgroundColor: color }} />
    </div>
  );
};

export const GithubMark: React.FC<{ readonly size: number; readonly color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

// ---------- Komponen visual scene ----------

const BLUE = "#5272D6";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Teks mengetik huruf demi huruf (start dan dur dalam detik sejak suara mulai).
export const Typed: React.FC<{ readonly start: number; readonly dur: number; readonly text: string }> = ({ start, dur, text }) => {
  const frame = useCurrentFrame();
  const k = interpolate(frame, [cue(start), cue(start + dur)], [0, 1], clamp);
  const blink = Math.floor(frame / 15) % 2 === 0;
  return (
    <span>
      {text.slice(0, Math.round(k * text.length))}
      <span style={{ opacity: k < 1 || blink ? 1 : 0 }}>▌</span>
    </span>
  );
};

// Jendela terminal gelap dengan tiga titik di kepala.
export const TerminalWindow: React.FC<{ readonly delay: number; readonly title: string; readonly children: React.ReactNode }> = ({ delay, title, children }) => {
  const t = useTheme();
  return (
    <Enter name="Terminal" delay={delay} y={50} style={{ borderRadius: t.radius.large, backgroundColor: t.code.raised, border: `2px solid ${t.code.line}`, overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "18px 28px", borderBottom: `2px solid ${t.code.line}` }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ width: 18, height: 18, borderRadius: 999, backgroundColor: t.code.line }} />
        ))}
        <div style={{ marginLeft: 12, fontFamily: t.fonts.mono, fontSize: 26, color: t.code.muted }}>{title}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14, padding: 28 }}>{children}</div>
    </Enter>
  );
};

// Baris diff: hijau = diminta, merah = tidak diminta.
export const DiffRow: React.FC<{ readonly delay: number; readonly name: string; readonly tone: "ok" | "bad"; readonly tag: string; readonly children: React.ReactNode }> = ({ delay, name, tone, tag, children }) => {
  const t = useTheme();
  const color = tone === "ok" ? t.colors.success : t.colors.danger;
  return (
    <Enter
      name={name}
      delay={delay}
      x={-60}
      y={0}
      style={{ display: "flex", alignItems: "center", gap: 20, padding: "16px 24px", borderRadius: t.radius.card, backgroundColor: t.code.bg, borderLeft: `8px solid ${color}`, fontFamily: t.fonts.mono, fontSize: 36, fontWeight: 700, color: t.code.text }}
    >
      <span style={{ color }}>+</span>
      <span style={{ flex: 1 }}>{children}</span>
      <span style={{ padding: "6px 18px", borderRadius: 999, backgroundColor: color, color: "#FFFFFF", fontFamily: t.fonts.body, fontSize: 26, fontWeight: 700 }}>{tag}</span>
    </Enter>
  );
};

// Pil penuh lebar untuk ringkasan di bawah daftar.
export const Badge: React.FC<{ readonly delay: number; readonly name: string; readonly tone: "bad" | "ok"; readonly children: React.ReactNode }> = ({ delay, name, tone, children }) => {
  const t = useTheme();
  return (
    <Enter name={name} delay={delay} y={30} style={{ display: "flex", justifyContent: "center", paddingTop: 6 }}>
      <div style={{ padding: "12px 40px", borderRadius: 999, backgroundColor: tone === "bad" ? t.colors.danger : t.colors.success, color: "#FFFFFF", fontFamily: t.fonts.heading, fontWeight: 800, fontSize: 40 }}>{children}</div>
    </Enter>
  );
};

// Kotak satu kalimat prompt dengan kursor.
export const PromptBox: React.FC<{ readonly delay: number; readonly children: React.ReactNode }> = ({ delay, children }) => {
  const t = useTheme();
  return (
    <Enter name="Prompt" delay={delay} y={40} style={{ display: "flex", alignItems: "center", gap: 20, padding: "26px 36px", borderRadius: t.radius.large, backgroundColor: t.code.bg, border: `2px solid ${t.code.line}`, fontFamily: t.fonts.mono, fontSize: 42, fontWeight: 700, color: t.code.text }}>
      <Icon name="terminal" size={48} color={t.colors.groundTextMuted} />
      <span>{children}</span>
    </Enter>
  );
};

// Ubin asumsi: lingkaran "?" lalu judul dan satu baris mono.
export const Ask: React.FC<{ readonly delay: number; readonly name: string; readonly sub: string; readonly children: React.ReactNode }> = ({ delay, name, sub, children }) => {
  const t = useTheme();
  return (
    <Enter name={name} delay={delay} y={40} style={{ display: "flex", flexDirection: "column", gap: 14, padding: "26px 30px", minHeight: 190, borderRadius: t.radius.large, backgroundColor: t.code.raised, border: `2px solid ${t.code.line}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <div style={{ width: 64, height: 64, flexShrink: 0, borderRadius: 999, backgroundColor: t.code.line, color: "#FFFFFF", fontFamily: t.fonts.heading, fontWeight: 800, fontSize: 40, display: "flex", alignItems: "center", justifyContent: "center" }}>?</div>
        <div style={{ fontFamily: t.fonts.body, fontWeight: 600, fontSize: 42, lineHeight: 1.15, color: t.code.text }}>{children}</div>
      </div>
      <div style={{ fontFamily: t.fonts.mono, fontSize: 28, lineHeight: 1.3, color: t.code.muted }}>{sub}</div>
    </Enter>
  );
};

// Simpul diagram alur: muncul pada `show`, menyala pada `lit` (frame lokal).
export const FlowNode: React.FC<{ readonly show: number; readonly lit: number; readonly n: number; readonly sub: string; readonly final?: boolean; readonly children: React.ReactNode }> = ({ show, lit, n, sub, final, children }) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const appear = interpolate(frame, [show, show + 10], [0, 1], { ...clamp, easing: EASE });
  const on = interpolate(frame, [lit, lit + 10], [0, 1], { ...clamp, easing: EASE });
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 24,
        padding: "12px 28px",
        minHeight: 84,
        borderRadius: t.radius.card,
        backgroundColor: final && on > 0.5 ? t.colors.primary : t.code.raised,
        border: `2px solid ${on > 0.5 ? BLUE : t.code.line}`,
        boxShadow: on > 0.5 ? t.shadows.glow : "none",
        opacity: appear * (0.62 + 0.38 * on),
        translate: `0 ${(1 - appear) * 30}px`,
        fontFamily: t.fonts.heading,
        fontWeight: 700,
        fontSize: 38,
        color: t.colors.groundText,
      }}
    >
      <span style={{ width: 44, fontFamily: t.fonts.mono, fontSize: 28, color: t.colors.groundTextMuted }}>0{n}</span>
      <span>{children}</span>
      <span style={{ flex: 1, textAlign: "right", fontFamily: t.fonts.mono, fontWeight: 500, fontSize: 26, color: t.code.muted }}>{sub}</span>
    </div>
  );
};

// Penghubung vertikal antar simpul; terisi biru mulai `at`.
export const FlowLink: React.FC<{ readonly at: number }> = ({ at }) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const k = interpolate(frame, [at, at + 10], [0, 1], { ...clamp, easing: EASE });
  return (
    <div style={{ height: 22, width: 4, alignSelf: "center", backgroundColor: t.code.line }}>
      <div style={{ height: `${k * 100}%`, backgroundColor: BLUE }} />
    </div>
  );
};

// Jalan pintas "Prompt → Kode" yang dicoret saat Spec Kit membalik urutan.
export const Shortcut: React.FC<{ readonly delay: number; readonly strikeAt: number }> = ({ delay, strikeAt }) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const k = interpolate(frame, [strikeAt, strikeAt + 12], [0, 1], { ...clamp, easing: EASE });
  const pill: React.CSSProperties = { padding: "8px 28px", borderRadius: 999, backgroundColor: t.code.raised, border: `2px solid ${t.code.line}`, fontFamily: t.fonts.mono, fontSize: 32, fontWeight: 700, color: t.code.text };
  return (
    <Enter name="Jalan pintas" delay={delay} y={30} style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 20, opacity: 1 - 0.45 * k }}>
        <div style={pill}>Prompt</div>
        <Icon name="arrowRight" size={40} color={t.colors.groundTextMuted} />
        <div style={pill}>Kode</div>
        <div style={{ position: "absolute", left: -12, top: "50%", height: 6, width: `calc(${k * 100}% + 24px)`, borderRadius: 3, backgroundColor: t.colors.danger }} />
      </div>
    </Enter>
  );
};

// Jalur kerja: judul, keterangan mono, dan lima segmen yang terisi satu per satu.
export const Lane: React.FC<{ readonly delay: number; readonly fillAt: number; readonly name: string; readonly icon: IconName; readonly sub: string; readonly steps: number; readonly children: React.ReactNode }> = ({ delay, fillAt, name, icon, sub, steps, children }) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  return (
    <Enter name={name} delay={delay} y={44} style={{ display: "flex", flexDirection: "column", gap: 22, padding: "28px 34px", borderRadius: t.radius.large, backgroundColor: t.code.raised, border: `2px solid ${t.code.line}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
        <div style={{ width: 76, height: 76, flexShrink: 0, borderRadius: 999, backgroundColor: t.code.line, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name={icon} size={44} color={t.colors.groundTextMuted} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ fontFamily: t.fonts.body, fontWeight: 700, fontSize: 44, color: t.code.text }}>{children}</div>
          <div style={{ fontFamily: t.fonts.mono, fontSize: 28, color: t.code.muted }}>{sub}</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        {[0, 1, 2, 3, 4].map((i) => {
          const k = i < steps ? interpolate(frame, [fillAt + i * 5, fillAt + i * 5 + 8], [0, 1], { ...clamp, easing: EASE }) : 0;
          return (
            <div key={i} style={{ flex: 1, height: 24, borderRadius: 12, backgroundColor: t.code.line, overflow: "hidden" }}>
              <div style={{ width: `${k * 100}%`, height: "100%", backgroundColor: BLUE }} />
            </div>
          );
        })}
      </div>
    </Enter>
  );
};

// Jalur dari titik awal ke target: "wander" berkelok dan meleset, "straight" lurus dan tepat.
export const PathLane: React.FC<{ readonly delay: number; readonly drawAt: number; readonly kind: "wander" | "straight"; readonly label: string; readonly result: string }> = ({ delay, drawAt, kind, label, result }) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const dur = 40;
  const k = interpolate(frame, [drawAt, drawAt + dur], [0, 1], { ...clamp, easing: EASE });
  const end = interpolate(frame, [drawAt + dur, drawAt + dur + 10], [0, 1], { ...clamp, easing: EASE });
  const bad = kind === "wander";
  const color = bad ? t.colors.danger : BLUE;
  const d = bad ? "M50 100 C 150 10, 230 190, 330 100 S 500 10, 580 110 S 720 190, 790 150" : "M50 100 L 806 100";
  return (
    <Enter name={label} delay={delay} y={40} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontFamily: t.fonts.body, fontWeight: 700, fontSize: 40, color: t.colors.groundText }}>{label}</div>
        <div style={{ padding: "6px 22px", borderRadius: 999, backgroundColor: bad ? t.colors.danger : t.colors.success, color: "#FFFFFF", fontFamily: t.fonts.body, fontWeight: 700, fontSize: 28, opacity: end }}>{result}</div>
      </div>
      <svg width="936" height="200" viewBox="0 0 936 200" fill="none">
        <circle cx="850" cy="100" r="34" stroke={t.colors.groundTextMuted} strokeWidth="6" fill={bad ? "none" : t.colors.success} fillOpacity={bad ? 0 : end} />
        <circle cx="850" cy="100" r="10" fill={t.colors.groundTextMuted} opacity={bad ? 1 : 0} />
        <path d={d} pathLength={1} stroke={color} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1" strokeDashoffset={1 - k} />
        <circle cx="50" cy="100" r="14" fill="#FFFFFF" />
        {bad ? <path d="M772 132 L808 168 M808 132 L772 168" stroke={color} strokeWidth="9" strokeLinecap="round" opacity={end} /> : <path d="M834 100 l12 13 l22 -26" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" opacity={end} />}
      </svg>
    </Enter>
  );
};

// Stempel miring di akhir scene.
export const Stamp: React.FC<{ readonly delay: number; readonly children: React.ReactNode }> = ({ delay, children }) => {
  const t = useTheme();
  return (
    <Enter name="Stempel" delay={delay} y={30} style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ rotate: "-2deg", padding: "14px 40px", borderRadius: t.radius.card, border: `4px solid ${t.colors.groundTextMuted}`, fontFamily: t.fonts.heading, fontWeight: 800, fontSize: 40, color: t.colors.groundText }}>{children}</div>
    </Enter>
  );
};

// Tombol Follow putih (kontras di latar biru) dan ubin langkah kecil untuk CTA.
export const FollowPill: React.FC<{ readonly delay: number }> = ({ delay }) => {
  const t = useTheme();
  return (
    <Enter name="Follow" delay={delay} y={40} style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "22px 48px", borderRadius: 999, backgroundColor: t.colors.groundChipBg, color: t.colors.groundChipText, fontFamily: t.fonts.heading, fontWeight: 800, fontSize: 46, boxShadow: t.shadows.lift }}>
        <Icon name="userPlus" size={54} color={t.colors.groundChipText} />
        Follow @ganjar_hadiatna
      </div>
    </Enter>
  );
};

export const StepTile: React.FC<{ readonly delay: number; readonly name: string; readonly icon: IconName; readonly children: React.ReactNode }> = ({ delay, name, icon, children }) => {
  const t = useTheme();
  return (
    <Enter name={name} delay={delay} y={40} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 14, padding: "26px 12px", borderRadius: t.radius.large, backgroundColor: t.code.raised, border: `2px solid ${t.code.line}` }}>
      <Icon name={icon} size={56} color={t.colors.groundTextMuted} />
      <div style={{ fontFamily: t.fonts.body, fontWeight: 600, fontSize: 32, color: t.code.text }}>{children}</div>
    </Enter>
  );
};
