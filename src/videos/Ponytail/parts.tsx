import type React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { Backdrop } from "../../Backdrop";
import { DESK_TOP, H, Layer, Lighting, SETS, W } from "../../block-reels";
import { Icon } from "../../icons";
import { useTheme } from "../../themes";
import { Enter } from "../../motion";
import { NARRATOR_MODES, SAFE_RIGHT, ZONES } from "../../reelsLayout";
import { at, FPS, LEAD, NARRATOR, SCENE_IDS, WORLD, type SceneId } from "./config";

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

// Latar dunia: kantor malam dari Reels block (SETS.kantor: menara berjendela menyala, papan dinding redup) di dua lapisan paralaks,
// dengan lantai kantor di bawah garis FLOOR_TOP tempat karakter berdiri. Kamera bergeser sangat pelan, dan titik awalnya berbeda
// per scene supaya komposisi latar tidak persis sama di scene berurutan.
const OFFICE = SETS.kantor;
// Garis depan lantai (permukaan meja) diturunkan 100 px dari DESK_TOP bawaan set kantor.
const FLOOR_TOP = DESK_TOP + 100;
const CAM_START = [-30, 40, -50, 30, -40, 50, -20, 40, -30] as const;
const World: React.FC<{ readonly id: SceneId }> = ({ id }) => {
  const frame = useCurrentFrame();
  const world = WORLD[id];
  if (world !== "kantor") return <Backdrop variant={world.flat} label={`${String(SCENE_IDS.indexOf(id) + 1).padStart(2, "0")} / ${String(SCENE_IDS.length).padStart(2, "0")}`} />;
  const dir = SCENE_IDS.indexOf(id) % 2 === 0 ? 1 : -1;
  const cam = { tx: CAM_START[SCENE_IDS.indexOf(id)] + dir * frame * 0.12, ty: 0, z: 1.04 };
  return (
    <>
      <div style={{ position: "absolute", inset: 0, backgroundColor: OFFICE.bg }} />
      <Layer cam={cam} p={0.28}>
        <OFFICE.Far />
      </Layer>
      <Layer cam={cam} p={0.6}>
        <OFFICE.Mid />
      </Layer>
      {/* Peredup di atas garis lantai: jendela menyala tetap terlihat samar, tapi judul dan kartu tetap terbaca (kontras teks). */}
      <div style={{ position: "absolute", left: 0, top: 0, width: W, height: FLOOR_TOP, background: "linear-gradient(rgba(5,9,20,0.82), rgba(5,9,20,0.62))" }} />
      <div style={{ position: "absolute", left: 0, top: FLOOR_TOP, width: W, height: H - FLOOR_TOP, background: `linear-gradient(${OFFICE.deskTop}, ${OFFICE.deskFront} 55%)`, borderTop: `6px solid ${OFFICE.deskEdge}`, boxSizing: "border-box" }} />
      <Lighting set="kantor" />
    </>
  );
};

// Area konten: dari ZONES.contentTop sampai batas bawah mode narator scene ini (NARRATOR di config.ts); subtitle dan karakter di bawahnya.
export const Frame: React.FC<{ readonly id: SceneId; readonly children: React.ReactNode }> = ({ id, children }) => {
  const frame = useCurrentFrame();
  const fade = interpolate(frame, [0, 6], [0, 1], { extrapolateRight: "clamp" });
  const bottom = NARRATOR_MODES[NARRATOR[id].mode].contentBottom;
  // Semua scene memakai lebar konten yang sama (margin SAFE_RIGHT di kiri dan kanan, sama dengan subtitle): konten simetris di tengah
  // dan tidak tertutup kolom tombol platform (kanan, mulai sekitar y 1100). Jangan ubah per mode atau per scene.
  const side = SAFE_RIGHT;
  return (
    <>
      <World id={id} />
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

// ---------- Komponen khusus Ponytail ----------

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ramp = (frame: number, start: number, dur: number): number => interpolate(frame, [start, start + dur], [0, 1], { ...clamp, easing: EASE });

// Chip sumber (hook): repo yang dijelaskan.
export const SourceChip: React.FC<{ readonly delay: number; readonly children: React.ReactNode }> = ({ delay, children }) => {
  const t = useTheme();
  return (
    <Enter name="Sumber" delay={delay} y={24} style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "12px 26px", borderRadius: 999, backgroundColor: t.code.raised, border: `2px solid ${t.code.line}`, fontFamily: t.fonts.mono, fontWeight: 600, fontSize: 26, color: t.code.text }}>
        <GithubMark size={32} color={t.colors.groundTextMuted} />
        {children}
      </div>
    </Enter>
  );
};

// Angka besar yang naik dari 0 ke `to` (hook, tanda minus ditempel di depan).
export const BigNumber: React.FC<{ readonly delay: number; readonly to: number; readonly suffix?: string; readonly prefix?: string; readonly size?: number; readonly accent?: boolean; readonly name: string }> = ({ delay, to, suffix = "", prefix = "", size = 260, accent, name }) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const v = Math.round(to * ramp(frame, delay, 24));
  return (
    <Enter name={name} delay={delay} y={50} style={{ textAlign: "center", fontFamily: t.fonts.heading, fontWeight: 800, fontSize: size, lineHeight: 1, letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums", color: accent ? t.colors.groundEmphasis : t.colors.groundText }}>
      {prefix}
      {v}
      {suffix}
    </Enter>
  );
};

// Tumpukan baris kode yang membengkak: batang tipis muncul satu per satu, penghitung baris naik ke `lines`.
export const CodeGrowth: React.FC<{ readonly delay: number; readonly lines: number }> = ({ delay, lines }) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const k = ramp(frame, delay, 60);
  const rows = 16;
  const widths = [0.55, 0.8, 0.4, 0.9, 0.65, 0.3, 0.75, 0.85, 0.5, 0.7, 0.35, 0.95, 0.6, 0.45, 0.8, 0.55];
  return (
    <Enter name="Tumpukan kode" delay={delay} y={40} style={{ display: "flex", flexDirection: "column", gap: 14, padding: "26px 30px", borderRadius: t.radius.large, backgroundColor: t.code.raised, border: `2px solid ${t.code.line}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", fontFamily: t.fonts.mono, color: t.code.muted, fontSize: 28 }}>
        <span>fitur-kecil.ts</span>
        <span style={{ fontWeight: 700, fontSize: 40, color: t.code.text }}>{Math.round(lines * k)} baris</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {Array.from({ length: rows }, (_, i) => {
          const shown = ramp(frame, delay + (i / rows) * 60, 8);
          return <div key={i} style={{ height: 14, width: `${widths[i] * 100}%`, borderRadius: 7, backgroundColor: t.code.line, opacity: shown, transform: `scaleX(${0.4 + 0.6 * shown})`, transformOrigin: "left" }} />;
        })}
      </div>
    </Enter>
  );
};

// Lima dari tujuh anak tangga README (tangga lengkap lebih kecil dan sulit dibaca di layar HP); yang dipilih = yang paling mudah dipahami.
const RUNGS = ["Perlu ada?", "Sudah ada di codebase?", "Bisa dari stdlib?", "Bisa satu baris?", "Tulis yang minimum"] as const;

// Tangga keputusan: penanda turun per anak tangga mulai `scanAt`, berhenti di `stopAt` (indeks 0-based); sisanya meredup.
export const Ladder: React.FC<{ readonly delay: number; readonly scanAt: number; readonly stopAt: number }> = ({ delay, scanAt, stopAt }) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const pos = Math.min(stopAt, Math.max(0, (frame - scanAt) / 9));
  const settled = frame >= scanAt + stopAt * 9;
  return (
    <Enter name="Tangga" delay={delay} y={40} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {RUNGS.map((r, i) => {
        const lit = frame >= scanAt && Math.round(pos) === i && !settled;
        const hit = settled && i === stopAt;
        const dim = settled && i > stopAt;
        const green = t.colors.success ?? t.colors.primary;
        return (
          <div key={r} style={{ display: "flex", alignItems: "center", gap: 18, padding: "12px 24px", borderRadius: 16, backgroundColor: hit ? green : t.code.raised, border: `2px solid ${hit ? green : lit ? t.colors.groundTextMuted : t.code.line}`, opacity: dim ? 0.4 : 1, fontFamily: t.fonts.body, fontWeight: 600, fontSize: 40, color: hit ? "#FFFFFF" : t.code.text }}>
            <span style={{ fontFamily: t.fonts.mono, fontSize: 32, opacity: 0.7, width: 28 }}>{i + 1}</span>
            <span style={{ flex: 1 }}>{r}</span>
            {hit ? <Icon name="circleCheck" size={40} color="#FFFFFF" /> : null}
          </div>
        );
      })}
    </Enter>
  );
};

// Dua gembok kecil: hal yang tetap dijaga.
export const Locks: React.FC<{ readonly delay: number }> = ({ delay }) => {
  const t = useTheme();
  return (
    <div style={{ display: "flex", gap: 20 }}>
      {["Validasi", "Keamanan"].map((l, i) => (
        <Enter key={l} name={l} delay={delay + i * 6} y={30} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 14, padding: "16px 12px", borderRadius: 999, backgroundColor: t.colors.groundChipBg, color: t.colors.groundChipText, fontFamily: t.fonts.heading, fontWeight: 800, fontSize: 34 }}>
          <Icon name="lock" size={36} color={t.colors.groundChipText} />
          {l}
        </Enter>
      ))}
    </div>
  );
};

// Blok terminal: baris diketik mulai waktu tiap baris; baris terakhir (ok) hijau.
export const Terminal: React.FC<{ readonly lines: readonly { readonly text: string; readonly at: number; readonly ok?: boolean }[] }> = ({ lines }) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22, padding: "28px 30px 36px", borderRadius: t.radius.large, backgroundColor: t.code.bg, border: `2px solid ${t.code.line}`, boxShadow: t.shadows.lift }}>
      <div style={{ display: "flex", gap: 10 }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ width: 18, height: 18, borderRadius: 999, backgroundColor: t.code.line }} />
        ))}
      </div>
      {lines.map((l) => {
        const n = Math.round(l.text.length * ramp(frame, l.at, Math.max(10, l.text.length * 0.5)));
        const color = l.ok ? (t.colors.success ?? t.code.text) : t.code.text;
        return (
          <div key={l.text} style={{ minHeight: 76, fontFamily: t.fonts.mono, fontWeight: 600, fontSize: 32, lineHeight: 1.35, color, overflowWrap: "anywhere", opacity: n > 0 ? 1 : 0 }}>
            {l.ok ? "" : "$ "}
            {l.text.slice(0, n)}
          </div>
        );
      })}
    </div>
  );
};

// Satu kolom batang vertikal: tinggi proporsional ke `value` (maks `max`), angka naik di atasnya.
export const BarColumn: React.FC<{ readonly delay: number; readonly label: string; readonly value: number; readonly max: number; readonly color: string; readonly accent?: boolean; readonly unit: string; readonly name: string }> = ({ delay, label, value, max, color, accent, unit, name }) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const k = ramp(frame, delay, 30);
  const full = 360;
  const h = Math.max(10, (value / max) * full) * k;
  return (
    <Enter name={name} delay={delay} y={30} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", gap: 14, padding: "22px 12px", borderRadius: t.radius.large, backgroundColor: t.code.raised, border: `2px solid ${t.code.line}`, height: full + 220 }}>
      <div style={{ fontFamily: t.fonts.heading, fontWeight: 800, fontSize: 84, lineHeight: 1, color: accent ? t.colors.groundEmphasis : t.code.text, fontVariantNumeric: "tabular-nums" }}>{Math.round(value * k)}</div>
      <div style={{ fontFamily: t.fonts.mono, fontSize: 28, color: t.code.muted }}>{unit}</div>
      <div style={{ width: "58%", height: h, borderRadius: 10, backgroundColor: color }} />
      <div style={{ fontFamily: t.fonts.body, fontWeight: 700, fontSize: 34, color: t.code.text }}>{label}</div>
    </Enter>
  );
};

// Ubin angka kecil (manfaat): angka besar dan label.
export const StatTile: React.FC<{ readonly delay: number; readonly value: string; readonly label: string }> = ({ delay, value, label }) => {
  const t = useTheme();
  return (
    <Enter name={label} delay={delay} y={36} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "30px 8px", borderRadius: t.radius.large, backgroundColor: t.code.raised, border: `2px solid ${t.code.line}` }}>
      <div style={{ fontFamily: t.fonts.heading, fontWeight: 800, fontSize: 76, lineHeight: 1, color: t.code.text }}>{value}</div>
      <div style={{ fontFamily: t.fonts.body, fontWeight: 600, fontSize: 32, color: t.code.muted }}>{label}</div>
    </Enter>
  );
};

// Perbandingan tes: dua batang horizontal (tanpa skill vs Ponytail); batang kedua terisi mulai `fillAt`.
export const TestCompare: React.FC<{ readonly delay: number; readonly fillAt: number }> = ({ delay, fillAt }) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const k = ramp(frame, fillAt, 30);
  const green = t.colors.success ?? t.colors.primary;
  return (
    <Enter name="Tes" delay={delay} y={36} style={{ display: "flex", flexDirection: "column", gap: 18, padding: "26px 30px", borderRadius: t.radius.large, backgroundColor: t.code.raised, border: `2px solid ${t.code.line}` }}>
      <div style={{ fontFamily: t.fonts.body, fontWeight: 700, fontSize: 34, color: t.code.text }}>Logika berisiko yang punya tes</div>
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <div style={{ width: 150, fontFamily: t.fonts.mono, fontSize: 28, color: t.code.muted }}>tanpa</div>
        <div style={{ flex: 1 }}>
          <Bar value={0.68} color={t.code.muted} height={34} />
        </div>
        <div style={{ width: 90, textAlign: "right", fontFamily: t.fonts.heading, fontWeight: 800, fontSize: 40, color: t.code.text }}>68%</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <div style={{ width: 150, fontFamily: t.fonts.mono, fontSize: 28, color: t.code.muted }}>Ponytail</div>
        <div style={{ flex: 1 }}>
          <Bar value={0.98 * k} color={green} height={34} />
        </div>
        <div style={{ width: 90, textAlign: "right", fontFamily: t.fonts.heading, fontWeight: 800, fontSize: 40, color: t.colors.groundEmphasis }}>{Math.round(68 + 30 * k)}%</div>
      </div>
    </Enter>
  );
};

// Kartu kutipan (closing): garis kiri, kalimat besar.
export const QuoteCard: React.FC<{ readonly delay: number; readonly children: React.ReactNode }> = ({ delay, children }) => {
  const t = useTheme();
  return (
    <Enter name="Kutipan" delay={delay} y={44} style={{ display: "flex", gap: 28, padding: "40px 36px", borderRadius: t.radius.large, backgroundColor: t.code.raised, border: `2px solid ${t.code.line}` }}>
      <div style={{ width: 10, borderRadius: 5, backgroundColor: t.colors.primary, flexShrink: 0 }} />
      <div style={{ fontFamily: t.fonts.heading, fontWeight: 800, fontSize: 62, lineHeight: 1.18, letterSpacing: "-0.01em", color: t.code.text }}>{children}</div>
    </Enter>
  );
};

// Stempel hasil (closing): lencana centang dengan satu kalimat.
export const Stamp: React.FC<{ readonly delay: number; readonly children: React.ReactNode }> = ({ delay, children }) => {
  const t = useTheme();
  const green = t.colors.success ?? t.colors.primary;
  return (
    <Enter name="Stempel" delay={delay} y={30} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 18, padding: "20px 28px", borderRadius: 999, border: `3px solid ${green}`, fontFamily: t.fonts.body, fontWeight: 700, fontSize: 38, color: t.colors.groundText }}>
      <Icon name="circleCheck" size={48} color={green} />
      {children}
    </Enter>
  );
};

// Tombol Follow putih dan ubin file (CTA).
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
