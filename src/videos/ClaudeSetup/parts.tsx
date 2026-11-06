import type React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { Backdrop } from "../../Backdrop";
import { Icon } from "../../icons";
import { useTheme } from "../../themes";
import { Enter } from "../../motion";
import { at, FPS, LEAD, SCENE_IDS, SCENE_START, WORDS, type SceneId } from "./config";

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

// Meja kerja: satu permukaan yang sama di semua scene, tempat karakter dan benda berdiri.
export const DESK_TOP = 1540;
export const Desk: React.FC = () => {
  const t = useTheme();
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: DESK_TOP, height: 260, backgroundColor: t.code.raised, borderTop: `8px solid ${t.code.line}`, boxShadow: "0 -20px 40px rgba(0,0,0,0.25)" }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 26, backgroundColor: t.code.line, opacity: 0.55 }} />
    </div>
  );
};

// Area konten di atas karakter. Karakter menempati sekitar y 1230-1740. `extras` = benda di atas meja (koordinat layar penuh),
// `bare` = tanpa wadah flex, anak diposisikan absolut sendiri (scene monitor dan rak).
export const Frame: React.FC<{
  readonly id: SceneId;
  readonly sweep?: boolean;
  readonly variant?: "ground" | "dark" | "primary";
  readonly extras?: React.ReactNode;
  readonly bare?: boolean;
  readonly children: React.ReactNode;
}> = ({ id, sweep, variant = "ground", extras, bare, children }) => {
  const index = SCENE_IDS.indexOf(id) + 1;
  const frame = useCurrentFrame();
  const fade = interpolate(frame, [0, 6], [0, 1], { extrapolateRight: "clamp" });
  return (
    <>
      <Backdrop variant={variant} label={`${String(index).padStart(2, "0")} / ${String(SCENE_IDS.length).padStart(2, "0")}`} sweep={sweep} />
      <Desk />
      {extras}
      {bare ? (
        <div style={{ position: "absolute", inset: 0, opacity: fade }}>{children}</div>
      ) : (
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
      )}
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


// ---------- Benda di meja ----------

// Cangkir dengan uap (scene hook). Kaki benda menapak di DESK_TOP.
export const Mug: React.FC<{ readonly left: number }> = ({ left }) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const wave = Math.sin(frame / 14);
  return (
    <svg width={190} height={230} viewBox="0 0 190 230" style={{ position: "absolute", left, top: DESK_TOP + 18 - 230 }}>
      {[0, 1].map((i) => (
        <path key={i} d={`M${62 + i * 34} 70 q${12 + wave * 6} -18 0 -36 q${-12 - wave * 6} -18 0 -34`} fill="none" stroke={t.colors.groundTextMuted} strokeWidth={7} strokeLinecap="round" opacity={0.6} />
      ))}
      <rect x={30} y={90} width={110} height={120} rx={14} fill={t.colors.groundChipBg} />
      <path d="M140 118 h14 a22 22 0 0 1 0 50 h-14" fill="none" stroke={t.colors.groundChipBg} strokeWidth={14} />
      <rect x={30} y={90} width={110} height={18} rx={9} fill={t.colors.primarySoft} />
    </svg>
  );
};

// Lampu meja dengan kerucut cahaya (scene konteks).
export const Lamp: React.FC<{ readonly left: number }> = ({ left }) => {
  const t = useTheme();
  return (
    <svg width={198} height={312} viewBox="0 0 330 520" style={{ position: "absolute", left, top: DESK_TOP + 18 - 312 }}>
      <polygon points="150,150 300,150 330,500 90,500" fill={t.colors.primarySoft} opacity={0.14} />
      <rect x={20} y={490} width={110} height={22} rx={11} fill={t.code.line} />
      <path d="M75 490 L75 270 L140 140" fill="none" stroke={t.code.line} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M110 120 L190 110 L205 160 L130 175 Z" fill={t.colors.groundChipBg} />
    </svg>
  );
};

// Tanaman kecil (scene cta).
export const Plant: React.FC<{ readonly left: number }> = ({ left }) => {
  const t = useTheme();
  return (
    <svg width={190} height={300} viewBox="0 0 190 300" style={{ position: "absolute", left, top: DESK_TOP + 18 - 300 }}>
      <path d="M95 190 C60 150 50 100 85 50 C110 90 115 150 95 190Z" fill={t.colors.primarySoft} />
      <path d="M95 190 C130 160 150 120 135 80 C105 110 90 150 95 190Z" fill={t.colors.primarySoft} opacity={0.75} />
      <path d="M95 190 C50 190 25 160 20 130 C60 140 90 160 95 190Z" fill={t.colors.primarySoft} opacity={0.55} />
      <path d="M45 190 h100 l-12 100 h-76 Z" fill={t.colors.groundChipBg} />
    </svg>
  );
};

// ---------- Monitor dan keyboard ----------

// Monitor: bezel gelap, layar berisi `children` (koordinat relatif layar). Berdiri di meja di belakang karakter.
export const Monitor: React.FC<{ readonly delay: number; readonly top: number; readonly height: number; readonly children: React.ReactNode }> = ({ delay, top, height, children }) => {
  const t = useTheme();
  return (
    <Enter name="Monitor" delay={delay} y={60} style={{ position: "absolute", left: 90, width: 900, top, height: height + 460 }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height, borderRadius: 40, backgroundColor: t.code.line, padding: 26, boxShadow: t.shadows.glow }}>
        <div style={{ width: "100%", height: "100%", borderRadius: 22, backgroundColor: t.code.bg, border: `2px solid ${t.code.line}`, overflow: "hidden", padding: "34px 40px" }}>{children}</div>
      </div>
      <div style={{ position: "absolute", left: 420, width: 60, top: height - 4, height: 440, backgroundColor: t.code.line }} />
      <div style={{ position: "absolute", left: 280, width: 340, top: height + 420, height: 30, borderRadius: 15, backgroundColor: t.code.line }} />
    </Enter>
  );
};

const KEY_ROWS = [13, 13, 12, 9] as const;
const KEY_COUNT = KEY_ROWS.reduce((a, b) => a + b, 0);

// Keyboard miring seperti dilihat dari depan; tuts menyala saat huruf diketik (cue dalam detik sejak suara mulai).
export const Keyboard: React.FC<{ readonly delay: number; readonly top: number; readonly typeStart: number; readonly typeDur: number; readonly chars: number }> = ({ delay, top, typeStart, typeDur, chars }) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const step = (typeDur * FPS) / chars;
  const first = cue(typeStart);
  const current = Math.floor((frame - first) / step);
  const lit = new Map<number, number>();
  for (let i = Math.max(0, current - 4); i <= Math.min(chars - 1, current); i += 1) {
    const age = frame - (first + i * step);
    if (age >= 0 && age < 9) lit.set((i * 7 + 3) % KEY_COUNT, 1 - age / 9);
  }
  let n = 0;
  return (
    <Enter name="Keyboard" delay={delay} y={60} style={{ position: "absolute", left: 70, width: 940, top, height: 300, perspective: 900 }}>
      <div style={{ width: "100%", height: "100%", transform: "rotateX(52deg)", transformOrigin: "50% 100%", borderRadius: 30, backgroundColor: t.code.line, padding: 22, display: "flex", flexDirection: "column", gap: 10, boxShadow: "0 30px 0 rgba(0,0,0,0.35)" }}>
        {KEY_ROWS.map((cols, r) => (
          <div key={r} style={{ flex: 1, display: "flex", gap: 10, justifyContent: "center" }}>
            {Array.from({ length: cols }, () => {
              const k = n;
              n += 1;
              const glow = lit.get(k) ?? 0;
              return <div key={k} style={{ flex: 1, borderRadius: 10, backgroundColor: glow > 0 ? t.colors.primarySoft : t.code.raised, opacity: glow > 0 ? 0.5 + glow * 0.5 : 1 }} />;
            })}
          </div>
        ))}
      </div>
    </Enter>
  );
};

// ---------- Rak laci ----------

export type DrawerSpec = { readonly icon: IconName; readonly label: string; readonly open: number; readonly close: number | null };

// Rak laci di kiri meja. Tiap laci meluncur ke kanan 120 px saat `open` (detik sejak suara mulai) dan menutup di `close`.
export const Cabinet: React.FC<{ readonly delay: number; readonly drawers: readonly DrawerSpec[] }> = ({ delay, drawers }) => {
  const t = useTheme();
  const { p } = useCue("hasil");
  return (
    <Enter name="Rak" delay={delay} y={60} style={{ position: "absolute", left: 60, top: 650, width: 480, height: 890 }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 830, borderRadius: 26, backgroundColor: t.code.raised, border: `3px solid ${t.code.line}`, padding: 20, display: "flex", flexDirection: "column", gap: 10 }}>
        {drawers.map((d) => {
          const out = p(d.open, 0.45) - (d.close === null ? 0 : p(d.close, 0.45));
          return (
            <div key={d.label} style={{ flex: 1, position: "relative" }}>
              <div style={{ position: "absolute", inset: 0, borderRadius: 14, backgroundColor: t.code.bg }} />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  translate: `${out * 120}px 0`,
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                  padding: "0 22px",
                  borderRadius: 14,
                  backgroundColor: out > 0.5 ? (t.colors.accentDark ?? t.colors.accent) : t.code.line,
                  color: "#FFFFFF",
                  fontFamily: t.fonts.heading,
                  fontWeight: 700,
                  fontSize: 30,
                  whiteSpace: "nowrap",
                  boxShadow: "6px 10px 0 rgba(0,0,0,0.25)",
                }}
              >
                <Icon name={d.icon} size={52} color="#FFFFFF" />
                <span style={{ flex: 1 }}>{d.label}</span>
                <span style={{ fontFamily: t.fonts.mono, fontSize: 30, opacity: out }}>1-2</span>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 40, width: 60, top: 828, height: 62, backgroundColor: t.code.line }} />
      <div style={{ position: "absolute", right: 40, width: 60, top: 828, height: 62, backgroundColor: t.code.line }} />
    </Enter>
  );
};

// ---------- Caption (subtitle karaoke) ----------

const CAPTION_MAX_CHARS = 28;

// Bagi kata satu scene jadi potongan pendek (satu baris): maksimal CAPTION_MAX_CHARS huruf, putus lebih awal setelah tanda baca.
const chunksOf = (id: SceneId): readonly (readonly number[])[] => {
  const chunks: number[][] = [];
  let current: number[] = [];
  let len = 0;
  WORDS[id].forEach(([word], i) => {
    if (current.length > 0 && len + 1 + word.length > CAPTION_MAX_CHARS) {
      chunks.push(current);
      current = [];
      len = 0;
    }
    current.push(i);
    len += (len > 0 ? 1 : 0) + word.length;
    if (/[.,?:!]$/.test(word) && len >= 12) {
      chunks.push(current);
      current = [];
      len = 0;
    }
  });
  if (current.length > 0) chunks.push(current);
  return chunks;
};

const CHUNKS: Readonly<Record<SceneId, readonly (readonly number[])[]>> = Object.fromEntries(SCENE_IDS.map((id) => [id, chunksOf(id)])) as Record<SceneId, readonly (readonly number[])[]>;

// Subtitle satu baris rata tengah di root video. Kata yang sedang diucapkan putih penuh, yang sudah lewat agak redup, yang belum
// redup (tanpa oranye: satu sorotan oranye per layar). `y` = posisi atas per scene (hindari zona aman bawah dan benda di scene).
export const Caption: React.FC<{ readonly y: Readonly<Record<SceneId, number>> }> = ({ y }) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const sceneIndex = SCENE_START.reduce((acc, start, idx) => (start <= frame ? idx : acc), 0);
  const id = SCENE_IDS[sceneIndex];
  const now = (frame - SCENE_START[sceneIndex] - LEAD) / FPS;
  const words = WORDS[id];
  const chunks = CHUNKS[id];
  const chunkIndex = chunks.reduce((acc, ids, k) => (now >= words[ids[0]][1] - 0.05 ? k : acc), -1);
  if (chunkIndex < 0) return null;
  const ids = chunks[chunkIndex];
  const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  const enter = interpolate(now, [words[ids[0]][1] - 0.05, words[ids[0]][1] + 0.12], [0, 1], { ...clamp, easing: EASE });
  return (
    <div
      style={{
        position: "absolute",
        left: 60,
        right: 60,
        top: y[id],
        height: 70,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        whiteSpace: "nowrap",
        opacity: enter,
        translate: `0 ${(1 - enter) * 12}px`,
        fontFamily: t.fonts.body,
        fontWeight: 700,
        fontSize: 50,
        color: t.colors.groundText,
        textShadow: "0 2px 14px rgba(0, 0, 0, 0.7)",
      }}
    >
      {ids.map((wi, k) => {
        const start = words[wi][1];
        const nextStart = k + 1 < ids.length ? words[ids[k + 1]][1] : Number.POSITIVE_INFINITY;
        const on = interpolate(now, [start, start + 0.1], [0, 1], { ...clamp, easing: EASE });
        const past = Number.isFinite(nextStart) ? interpolate(now, [nextStart, nextStart + 0.1], [0, 1], { ...clamp, easing: EASE }) : 0;
        return (
          <span key={wi} style={{ opacity: 0.4 + 0.6 * on - 0.2 * past }}>
            {words[wi][0]}
            {k < ids.length - 1 ? "\u00A0" : ""}
          </span>
        );
      })}
    </div>
  );
};
