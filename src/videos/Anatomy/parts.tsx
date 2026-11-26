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
// Jarak naik gerak masuk judul (px), bukan posisi layar.
const RISE = 44;

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
  readonly x?: number;
  readonly y?: number;
  readonly children: React.ReactNode;
}> = ({ delay, size = 104, muted, name = "Headline", x = 0, y = RISE, children }) => {
  const t = useTheme();
  return (
    <Enter
      name={name}
      delay={delay}
      x={x}
      y={y}
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


export const GithubMark: React.FC<{ readonly size: number; readonly color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

// ---------- Komponen khusus Anatomy (sebagian disalin dari Ponytail) ----------

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

// Gembok pin-tumbler 2D tampak depan: jendela potong di badan berisi empat pin yang naik ke garis geser mulai `alignAt`,
// lubang kunci berputar 90 derajat di `turnAt`, lalu gagang terangkat di `openAt`. Datar, tanpa proyeksi 3D.
export const Padlock: React.FC<{ readonly delay: number; readonly alignAt: number; readonly turnAt: number; readonly openAt: number; readonly height?: number }> = ({ delay, alignAt, turnAt, openAt, height = 440 }) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const lift = 46 * ramp(frame, openAt, 14);
  const turn = 90 * ramp(frame, turnAt, 12);
  const k = ramp(frame, alignAt, 18);
  const SHEAR = 300;
  const BOTTOM = 346;
  const TOP = 254;
  // Tinggi puncak pin bawah sebelum kunci masuk (y layar); semua naik ke SHEAR saat kunci masuk.
  const starts = [322, 308, 330, 314];
  const green = t.colors.success ?? t.colors.primary;
  return (
    <Enter name="Gembok" delay={delay} y={40} style={{ display: "flex", justifyContent: "center" }}>
      <svg viewBox="0 0 400 480" height={height}>
        <path d="M128,230 V150 A72,72 0 0 1 272,150 V230" transform={`translate(0 ${-lift})`} fill="none" stroke={t.colors.groundTextMuted} strokeWidth={30} strokeLinecap="round" />
        <rect x={60} y={210} width={280} height={240} rx={36} fill={t.colors.primary} />
        <rect x={60} y={210} width={280} height={24} rx={12} fill={t.colors.groundText} opacity={0.16} />
        <rect x={92} y={244} width={216} height={112} rx={14} fill={t.code.bg} />
        <line x1={100} x2={300} y1={SHEAR} y2={SHEAR} stroke={t.colors.groundTextMuted} strokeWidth={2} strokeDasharray="6 6" />
        {starts.map((s, i) => {
          const x = 112 + i * 48;
          const top = s + (SHEAR - s) * k;
          return (
            <g key={i}>
              <rect x={x} y={TOP} width={28} height={Math.max(0, top - 4 - TOP)} rx={6} fill={t.code.muted} />
              <rect x={x} y={top} width={28} height={BOTTOM - top} rx={6} fill={k >= 1 ? green : t.colors.groundText} />
            </g>
          );
        })}
        <g transform={`translate(200 398) rotate(${turn})`}>
          <circle r={17} fill={t.code.bg} />
          <rect x={-7} y={0} width={14} height={32} rx={5} fill={t.code.bg} />
        </g>
      </svg>
    </Enter>
  );
};

// Diagram kotak-panah yang kusut (relate): kotak muncul, panah saling silang digambar satu per satu, lalu tanda tanya.
const BOXES = [
  { label: "Client", x: 40, y: 40 },
  { label: "Cache", x: 440, y: 20 },
  { label: "TTL", x: 250, y: 220 },
  { label: "DB", x: 470, y: 400 },
  { label: "Key", x: 30, y: 420 },
] as const;
const LINKS = [[0, 3], [1, 4], [0, 2], [2, 1], [4, 1], [3, 0], [2, 4], [1, 3]] as const;
export const TangledBoxes: React.FC<{ readonly delay: number; readonly drawAt: number; readonly askAt: number }> = ({ delay, drawAt, askAt }) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const bw = 200;
  const bh = 90;
  const c = (i: number): readonly [number, number] => [BOXES[i].x + bw / 2, BOXES[i].y + bh / 2];
  return (
    <Enter name="Diagram kusut" delay={delay} y={40} style={{ display: "flex", justifyContent: "center" }}>
      <svg viewBox="0 0 700 540" width="100%">
        {LINKS.map(([a, b], i) => {
          const [x1, y1] = c(a);
          const [x2, y2] = c(b);
          const len = Math.hypot(x2 - x1, y2 - y1);
          const k = ramp(frame, drawAt + i * 5, 12);
          const bend = (i % 2 ? 1 : -1) * 90;
          const mx = (x1 + x2) / 2 + ((y2 - y1) / len) * bend;
          const my = (y1 + y2) / 2 - ((x2 - x1) / len) * bend;
          return <path key={i} d={`M${x1},${y1} Q${mx},${my} ${x2},${y2}`} fill="none" stroke={t.colors.groundTextMuted} strokeWidth={4} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - k} />;
        })}
        {BOXES.map((b) => (
          <g key={b.label}>
            <rect x={b.x} y={b.y} width={bw} height={bh} rx={16} fill={t.code.raised} stroke={t.code.line} strokeWidth={2} />
            <text x={b.x + bw / 2} y={b.y + bh / 2 + 12} textAnchor="middle" fontFamily={t.fonts.mono} fontWeight={700} fontSize={34} fill={t.code.text}>
              {b.label}
            </text>
          </g>
        ))}
        {[[330, 120], [150, 300], [560, 290]].map(([x, y], i) => {
          const k = ramp(frame, askAt + i * 6, 10);
          return (
            <text key={i} x={x} y={y} textAnchor="middle" fontFamily={t.fonts.heading} fontWeight={800} fontSize={96} fill={t.colors.groundText} opacity={k} transform={`translate(0 ${(1 - k) * 20})`}>
              ?
            </text>
          );
        })}
      </svg>
    </Enter>
  );
};

// Panah turun kecil (shift: kartu "cache key" -> gembok).
export const DownArrow: React.FC<{ readonly delay: number }> = ({ delay }) => {
  const t = useTheme();
  return (
    <Enter name="Panah" delay={delay} y={-20} style={{ display: "flex", justifyContent: "center" }}>
      <Icon name="arrowDown" size={64} color={t.colors.groundTextMuted} />
    </Enter>
  );
};

// Ubin angka besar (urgency): "1" dan label di bawahnya; `accent` = satu-satunya sorotan oranye layar.
export const OneTile: React.FC<{ readonly delay: number; readonly label: string; readonly icon: IconName; readonly accent?: boolean }> = ({ delay, label, icon, accent }) => {
  const t = useTheme();
  return (
    <Enter name={label} delay={delay} y={50} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 18, padding: "40px 12px", borderRadius: t.radius.large, backgroundColor: t.code.raised, border: `2px solid ${t.code.line}` }}>
      <Icon name={icon} size={64} color={t.colors.groundTextMuted} />
      <div style={{ fontFamily: t.fonts.heading, fontWeight: 800, fontSize: 220, lineHeight: 1, color: accent ? t.colors.groundEmphasis : t.code.text }}>1</div>
      <div style={{ fontFamily: t.fonts.body, fontWeight: 700, fontSize: 44, color: t.code.text }}>{label}</div>
    </Enter>
  );
};

// Kotak prompt Claude Code (pakai): teks diketik mulai `typeAt`, lalu tiga chip kata kunci menyala bergantian di `chips[i].at`.
// Chip terakhir yang menyala = oranye (satu sorotan per layar); yang sudah lewat tetap putih.
export const PromptBox: React.FC<{ readonly delay: number; readonly typeAt: number; readonly text: string; readonly chips: readonly { readonly label: string; readonly at: number }[] }> = ({ delay, typeAt, text, chips }) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const n = Math.round(text.length * ramp(frame, typeAt, Math.max(12, text.length * 0.6)));
  const active = chips.filter((c) => frame >= c.at).length - 1;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
      <Enter name="Prompt" delay={delay} y={40} style={{ padding: "30px 32px", borderRadius: t.radius.large, backgroundColor: t.code.bg, border: `2px solid ${t.code.line}`, boxShadow: t.shadows.lift, fontFamily: t.fonts.mono, fontWeight: 600, fontSize: 30, lineHeight: 1.4, color: t.code.text, minHeight: 130 }}>
        <span style={{ color: t.code.muted }}>{"> "}</span>
        {text.slice(0, n)}
      </Enter>
      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        {chips.map((c, i) => {
          const on = i === active;
          const seen = frame >= c.at;
          return (
            <Enter key={c.label} name={c.label} delay={c.at} y={30} style={{ textAlign: "center", padding: "30px 8px", borderRadius: t.radius.large, backgroundColor: on ? t.colors.accent : seen ? t.colors.groundChipBg : t.code.raised, color: on ? t.colors.onAccent : seen ? t.colors.groundChipText : t.code.muted, fontFamily: t.fonts.mono, fontWeight: 800, fontSize: 64 }}>
              {c.label}
            </Enter>
          );
        })}
      </div>
    </div>
  );
};

// Jam (hasil): busur 30-90 menit digambar di lingkaran satu jam setengah, angka di tengah.
export const Clock: React.FC<{ readonly delay: number; readonly sweepAt: number }> = ({ delay, sweepAt }) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const k = ramp(frame, sweepAt, 24);
  const R = 120;
  // Lingkaran penuh = 120 menit; busur dari menit 30 ke 90.
  const pt = (min: number): string => {
    const a = (min / 120) * 2 * Math.PI - Math.PI / 2;
    return `${(160 + R * Math.cos(a)).toFixed(1)},${(160 + R * Math.sin(a)).toFixed(1)}`;
  };
  const end = 30 + 60 * k;
  return (
    <Enter name="Jam" delay={delay} y={40} style={{ display: "flex", justifyContent: "center" }}>
      <svg viewBox="0 0 320 320" height={300}>
        <circle cx={160} cy={160} r={R} fill={t.code.raised} stroke={t.code.line} strokeWidth={22} />
        {k > 0 ? <path d={`M${pt(30)} A${R},${R} 0 ${end - 30 > 60 ? 1 : 0} 1 ${pt(end)}`} fill="none" stroke={t.colors.groundText} strokeWidth={22} strokeLinecap="round" /> : null}
        <text x={160} y={162} textAnchor="middle" fontFamily={t.fonts.heading} fontWeight={800} fontSize={58} fill={t.code.text}>
          30-90
        </text>
        <text x={160} y={206} textAnchor="middle" fontFamily={t.fonts.body} fontWeight={600} fontSize={30} fill={t.code.muted}>
          menit
        </text>
      </svg>
    </Enter>
  );
};

// Siklus perbaikan (hasil): Draf -> Mainkan -> Perbaiki, muncul bergantian; "Draf" oranye.
export const Cycle: React.FC<{ readonly at: readonly [number, number, number] }> = ({ at: times }) => {
  const t = useTheme();
  const steps = ["Draf", "Mainkan", "Perbaiki"] as const;
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
      {steps.map((s, i) => (
        <div key={s} style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {i > 0 ? (
            <Enter name={`Panah ${i}`} delay={times[i]} x={-16} y={0}>
              <Icon name="arrowRight" size={40} color={t.colors.groundTextMuted} />
            </Enter>
          ) : null}
          <Enter name={s} delay={times[i]} y={30} style={{ padding: "16px 24px", borderRadius: 999, backgroundColor: i === 0 ? t.colors.accent : t.colors.groundChipBg, color: i === 0 ? t.colors.onAccent : t.colors.groundChipText, fontFamily: t.fonts.heading, fontWeight: 800, fontSize: 36 }}>
            {s}
          </Enter>
        </div>
      ))}
      <Enter name="Ulang" delay={times[2] + 8} y={0} style={{ marginLeft: 6 }}>
        <Icon name="refreshCw" size={40} color={t.colors.groundTextMuted} />
      </Enter>
    </div>
  );
};
