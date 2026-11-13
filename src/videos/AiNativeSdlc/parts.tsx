import type React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { Backdrop } from "../../Backdrop";
import { Icon } from "../../icons";
import { useTheme } from "../../themes";
import { Enter } from "../../motion";
import { NARRATOR_MODES, SAFE_RIGHT, ZONES } from "../../reelsLayout";
import { at, FPS, LEAD, NARRATOR, SCENE_IDS, type SceneId } from "./config";

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

// Area konten: dari ZONES.contentTop sampai batas bawah mode narator scene ini (NARRATOR di config.ts); subtitle dan karakter di bawahnya.
export const Frame: React.FC<{ readonly id: SceneId; readonly sweep?: boolean; readonly variant?: "ground" | "dark" | "primary"; readonly children: React.ReactNode }> = ({ id, sweep, variant = "ground", children }) => {
  const index = SCENE_IDS.indexOf(id) + 1;
  const frame = useCurrentFrame();
  const fade = interpolate(frame, [0, 6], [0, 1], { extrapolateRight: "clamp" });
  const bottom = NARRATOR_MODES[NARRATOR[id].mode].contentBottom;
  // Semua scene memakai lebar konten yang sama (margin SAFE_RIGHT di kiri dan kanan, sama dengan subtitle): konten simetris di tengah
  // dan tidak tertutup kolom tombol platform (kanan, mulai sekitar y 1100). Jangan ubah per mode atau per scene.
  const side = SAFE_RIGHT;
  return (
    <>
      <Backdrop variant={variant} label={`${String(index).padStart(2, "0")} / ${String(SCENE_IDS.length).padStart(2, "0")}`} sweep={sweep} />
      <div
        style={{
          position: "absolute",
          left: side,
          right: side,
          top: ZONES.contentTop,
          height: bottom - ZONES.contentTop,
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

// ---------- Komponen visual scene ----------

const BLUE = "#5272D6";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Chip sumber (hook): ikon buku dan nama sumber, huruf mono kecil.
export const SourceChip: React.FC<{ readonly delay: number; readonly children: React.ReactNode }> = ({ delay, children }) => {
  const t = useTheme();
  return (
    <Enter name="Sumber" delay={delay} y={24} style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "12px 26px", borderRadius: 999, backgroundColor: t.code.raised, border: `2px solid ${t.code.line}`, fontFamily: t.fonts.mono, fontWeight: 600, fontSize: 26, color: t.code.text }}>
        <Icon name="bookOpenCheck" size={32} color={t.colors.groundTextMuted} />
        {children}
      </div>
    </Enter>
  );
};

// Klaim: "no" dicoret merah mulai `strikeAt`, "yes" bercentang hijau.
export const Claim: React.FC<{ readonly delay: number; readonly strikeAt?: number; readonly tone: "no" | "yes"; readonly name: string; readonly children: React.ReactNode }> = ({ delay, strikeAt, tone, name, children }) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const k = strikeAt === undefined ? 0 : interpolate(frame, [strikeAt, strikeAt + 12], [0, 1], { ...clamp, easing: EASE });
  const color = (tone === "no" ? t.colors.danger : t.colors.success) ?? BLUE;
  return (
    <Enter name={name} delay={delay} y={40} style={{ position: "relative", display: "flex", alignItems: "center", gap: 20, padding: "24px 28px", borderRadius: t.radius.large, backgroundColor: t.code.raised, border: `2px solid ${tone === "yes" ? color : t.code.line}`, fontFamily: t.fonts.body, fontWeight: 600, fontSize: 36, color: t.code.text }}>
      <Icon name={tone === "no" ? "circleX" : "circleCheck"} size={48} color={color} />
      <div style={{ opacity: 1 - 0.4 * k }}>{children}</div>
      {tone === "no" ? <div style={{ position: "absolute", left: 88, top: "50%", height: 6, width: `calc(${k * 100}% - 116px)`, borderRadius: 3, backgroundColor: color }} /> : null}
    </Enter>
  );
};

// Baris durasi tahap: label, keterangan, dan batang yang terisi mulai `fillAt`.
export const Stage: React.FC<{ readonly delay: number; readonly fillAt: number; readonly value: number; readonly name: string; readonly tag: string; readonly tone: "fast" | "slow"; readonly children: React.ReactNode }> = ({ delay, fillAt, value, name, tag, tone, children }) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const k = interpolate(frame, [fillAt, fillAt + 28], [0, 1], { ...clamp, easing: EASE });
  return (
    <Enter name={name} delay={delay} y={36} style={{ display: "flex", flexDirection: "column", gap: 10, padding: "16px 28px", borderRadius: t.radius.large, backgroundColor: t.code.raised, border: `2px solid ${t.code.line}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div style={{ fontFamily: t.fonts.body, fontWeight: 700, fontSize: 38, color: t.code.text }}>{children}</div>
        <div style={{ fontFamily: t.fonts.mono, fontSize: 30, color: t.code.muted }}>{tag}</div>
      </div>
      <Bar value={value * k} color={tone === "fast" ? (t.colors.success ?? BLUE) : BLUE} height={24} />
    </Enter>
  );
};

const FLOW_LABELS = ["Rencana", "Desain", "Build", "Tes", "Rilis"] as const;

// Lima tahap: tersusun lurus ke bawah, lalu bergeser membentuk lingkaran (loop) mulai `loopAt`; panah menunjukkan arah, satu titik
// berputar di loop setelah terbentuk, `fileAt` memunculkan label file Git di tengah. `showAt` = waktu muncul tiap tahap.
export const LineToLoop: React.FC<{ readonly delay: number; readonly showAt: readonly number[]; readonly loopAt: number; readonly fileAt: number }> = ({ delay, showAt, loopAt, fileAt }) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const k = interpolate(frame, [loopAt, loopAt + 24], [0, 1], { ...clamp, easing: EASE });
  const file = interpolate(frame, [fileAt, fileAt + 12], [0, 1], { ...clamp, easing: EASE });
  const shown = showAt.map((a) => interpolate(frame, [a, a + 10], [0, 1], { ...clamp, easing: EASE }));
  const R = 232;
  const CX = 390;
  const CY = 312;
  const pts = FLOW_LABELS.map((_, i) => {
    const angle = ((-90 + i * 72) * Math.PI) / 180;
    return { x: CX + (R * Math.cos(angle)) * k, y: 70 + i * 115 + (CY + R * Math.sin(angle) - (70 + i * 115)) * k };
  });
  const w = 340 - 150 * k; // lebar pil: lebar saat lurus, ramping saat melingkar
  const edges = pts.map((a, i) => ({ a, b: pts[(i + 1) % 5], op: i === 4 ? k : shown[i + 1] }));
  const u = Math.max(0, frame - (loopAt + 24)) * 0.05;
  const seg = Math.floor(u) % 5;
  const f = u - Math.floor(u);
  const dot = { x: pts[seg].x + (pts[(seg + 1) % 5].x - pts[seg].x) * f, y: pts[seg].y + (pts[(seg + 1) % 5].y - pts[seg].y) * f };
  return (
    <Enter name="Alur" delay={delay} y={40}>
      <svg width="100%" viewBox="0 0 780 600" fill="none">
        {edges.map(({ a, b, op }, i) => {
          const mx = (a.x + b.x) / 2;
          const my = (a.y + b.y) / 2;
          const deg = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
          return (
            <g key={i} opacity={op}>
              <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={BLUE} strokeWidth="7" strokeLinecap="round" />
              <path d="M-11 -13 L13 0 L-11 13 Z" fill={BLUE} transform={`translate(${mx} ${my}) rotate(${deg})`} />
            </g>
          );
        })}
        <circle cx={dot.x} cy={dot.y} r="13" fill="#FFFFFF" opacity={k > 0.99 ? 1 : 0} />
        {pts.map((pt, i) => (
          <g key={FLOW_LABELS[i]} opacity={shown[i]}>
            <rect x={pt.x - w / 2} y={pt.y - 42} width={w} height="84" rx="22" fill={t.code.raised} stroke={k > 0.5 ? BLUE : t.code.line} strokeWidth="4" />
            <text x={pt.x} y={pt.y + 14} textAnchor="middle" fontFamily={t.fonts.heading} fontWeight="700" fontSize="40" fill={t.code.text}>
              {FLOW_LABELS[i]}
            </text>
          </g>
        ))}
        <text x={CX} y={CY - 6} textAnchor="middle" fontFamily={t.fonts.mono} fontWeight="700" fontSize="42" fill={t.code.text} opacity={file}>
          satu file
        </text>
        <text x={CX} y={CY + 44} textAnchor="middle" fontFamily={t.fonts.mono} fontWeight="700" fontSize="42" fill={t.code.text} opacity={file}>
          di Git
        </text>
      </svg>
    </Enter>
  );
};

// Kartu file markdown: nama mono, isi "???" sampai disorot pada `lit`.
export const FileCard: React.FC<{ readonly delay: number; readonly lit: number; readonly name: string; readonly sub: string; readonly children: React.ReactNode }> = ({ delay, lit, name, sub, children }) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const on = interpolate(frame, [lit, lit + 10], [0, 1], { ...clamp, easing: EASE });
  return (
    <Enter name={name} delay={delay} y={44} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: "22px 14px", borderRadius: t.radius.large, backgroundColor: t.code.raised, border: `2px solid ${on > 0.5 ? BLUE : t.code.line}`, boxShadow: on > 0.5 ? t.shadows.glow : "none", textAlign: "center" }}>
      <Icon name="fileText" size={60} color={on > 0.5 ? BLUE : t.colors.groundTextMuted} />
      <div style={{ fontFamily: t.fonts.mono, fontWeight: 700, fontSize: 36, color: t.code.text }}>{children}</div>
      <div style={{ fontFamily: t.fonts.body, fontSize: 28, color: t.code.muted }}>{sub}</div>
      <div style={{ padding: "4px 26px", borderRadius: 999, backgroundColor: t.code.line, fontFamily: t.fonts.mono, fontWeight: 700, fontSize: 34, color: t.code.text, opacity: 1 - on }}>???</div>
    </Enter>
  );
};

// Tahap loop: menyala biru pada `lit`, redup lagi pada `off` (opsional).
export const LoopStep: React.FC<{ readonly delay: number; readonly lit: number; readonly off?: number; readonly n: number; readonly name: string; readonly sub: string; readonly children: React.ReactNode }> = ({ delay, lit, off, n, name, sub, children }) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const on = interpolate(frame, [lit, lit + 10], [0, 1], { ...clamp, easing: EASE });
  const gone = off === undefined ? 0 : interpolate(frame, [off, off + 10], [0, 1], { ...clamp, easing: EASE });
  const active = on > 0.5 && gone < 0.5;
  return (
    <Enter name={name} delay={delay} y={34} style={{ display: "flex", alignItems: "center", gap: 24, padding: "20px 30px", borderRadius: t.radius.large, backgroundColor: active ? t.colors.primary : t.code.raised, border: `2px solid ${on > 0.5 ? BLUE : t.code.line}`, boxShadow: active ? t.shadows.glow : "none", opacity: 0.6 + 0.4 * on }}>
      <div style={{ width: 60, height: 60, flexShrink: 0, borderRadius: 999, backgroundColor: active ? "rgba(255,255,255,0.22)" : t.code.line, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: t.fonts.heading, fontWeight: 800, fontSize: 34, color: "#FFFFFF" }}>{n}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <div style={{ fontFamily: t.fonts.mono, fontWeight: 700, fontSize: 40, color: active ? "#FFFFFF" : t.code.text }}>{children}</div>
        <div style={{ fontFamily: t.fonts.body, fontSize: 30, color: active ? "rgba(255,255,255,0.9)" : t.code.muted }}>{sub}</div>
      </div>
    </Enter>
  );
};

// Panah balik: masalah produksi masuk lagi jadi intent baru.
export const ReturnLink: React.FC<{ readonly delay: number }> = ({ delay }) => {
  const t = useTheme();
  return (
    <Enter name="Kembali" delay={delay} y={30} style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "14px 34px", borderRadius: 999, backgroundColor: t.colors.groundChipBg, color: t.colors.groundChipText, fontFamily: t.fonts.heading, fontWeight: 700, fontSize: 31 }}>
        <Icon name="refreshCw" size={36} color={t.colors.groundChipText} />
        Masalah produksi jadi intent baru
      </div>
    </Enter>
  );
};

// Gerbang keputusan manusia di atas cincin loop yang berputar.
export const GateLoop: React.FC<{ readonly delay: number; readonly gateAt: number }> = ({ delay, gateAt }) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const g = interpolate(frame, [gateAt, gateAt + 12], [0, 1], { ...clamp, easing: EASE });
  const spin = frame * 2.4;
  return (
    <Enter name="Gerbang dan loop" delay={delay} y={40} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "18px 36px", borderRadius: 999, whiteSpace: "nowrap", backgroundColor: t.code.raised, border: `3px solid ${g > 0.5 ? BLUE : t.code.line}`, boxShadow: g > 0.5 ? t.shadows.glow : "none", fontFamily: t.fonts.heading, fontWeight: 700, fontSize: 32, color: t.code.text }}>
        <Icon name="userCheck" size={46} color={g > 0.5 ? BLUE : t.colors.groundTextMuted} />
        Manusia memutuskan di gerbang
      </div>
      <Icon name="arrowDown" size={48} color={t.colors.groundTextMuted} />
      <svg width="420" height="420" viewBox="0 0 420 420" fill="none">
        <circle cx="210" cy="210" r="150" stroke={t.code.line} strokeWidth="10" />
        {[0, 90, 180, 270].map((a) => {
          const r = ((a + spin) * Math.PI) / 180;
          return <circle key={a} cx={210 + 150 * Math.cos(r)} cy={210 + 150 * Math.sin(r)} r="20" fill={BLUE} />;
        })}
        <text x="210" y="206" textAnchor="middle" fontFamily={t.fonts.heading} fontWeight="800" fontSize="44" fill={t.code.text}>
          Loop agen
        </text>
        <text x="210" y="252" textAnchor="middle" fontFamily={t.fonts.mono} fontWeight="600" fontSize="28" fill={t.code.muted}>
          terus berjalan
        </text>
      </svg>
    </Enter>
  );
};

// Tombol Follow putih (kontras di latar biru) dan ubin file kecil untuk CTA.
export const FollowPill: React.FC<{ readonly delay: number }> = ({ delay }) => {
  const t = useTheme();
  return (
    <Enter name="Follow" delay={delay} y={40} style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "20px 36px", borderRadius: 999, whiteSpace: "nowrap", backgroundColor: t.colors.groundChipBg, color: t.colors.groundChipText, fontFamily: t.fonts.heading, fontWeight: 800, fontSize: 36, boxShadow: t.shadows.lift }}>
        <Icon name="userPlus" size={44} color={t.colors.groundChipText} />
        Follow @ganjar_hadiatna
      </div>
    </Enter>
  );
};

export const FileTile: React.FC<{ readonly delay: number; readonly children: React.ReactNode }> = ({ delay, children }) => {
  const t = useTheme();
  return (
    <Enter name={String(children)} delay={delay} y={40} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: "24px 8px", borderRadius: t.radius.large, backgroundColor: t.code.raised, border: `2px solid ${t.code.line}` }}>
      <Icon name="fileText" size={52} color={t.colors.groundTextMuted} />
      <div style={{ fontFamily: t.fonts.mono, fontWeight: 700, fontSize: 28, color: t.code.text }}>{children}</div>
    </Enter>
  );
};
