import type React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { Backdrop } from "../../Backdrop";
import { Icon } from "../../icons";
import { useTheme } from "../../themes";
import { Enter } from "../OpenCode9Router/parts";
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
export const Frame: React.FC<{ readonly id: SceneId; readonly sweep?: boolean; readonly children: React.ReactNode }> = ({ id, sweep, children }) => {
  const index = SCENE_IDS.indexOf(id) + 1;
  const frame = useCurrentFrame();
  const fade = interpolate(frame, [0, 6], [0, 1], { extrapolateRight: "clamp" });
  return (
    <>
      <Backdrop variant="ground" label={`${String(index).padStart(2, "0")} / ${String(SCENE_IDS.length).padStart(2, "0")}`} sweep={sweep} />
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
        <Icon name={icon} size={52} color={highlight ? "#FFFFFF" : t.colors.groundEmphasis} />
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
