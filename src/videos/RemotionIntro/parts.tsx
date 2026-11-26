import type React from "react";
import { Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
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
const CAM_START = [-30, 40, -50, 30, -40, 50, -20, 40] as const;
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

// ---------- Komponen visual scene ----------

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const BLUE = "#5272D6";

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

// Jendela gelap dengan tiga titik di kepala (terminal, editor, Studio).
export const Window: React.FC<{ readonly delay: number; readonly title: string; readonly name?: string; readonly children: React.ReactNode }> = ({ delay, title, name = "Jendela", children }) => {
  const t = useTheme();
  return (
    <Enter name={name} delay={delay} y={50} style={{ borderRadius: t.radius.large, backgroundColor: t.code.raised, border: `2px solid ${t.code.line}`, overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 26px", borderBottom: `2px solid ${t.code.line}` }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ width: 16, height: 16, borderRadius: 999, backgroundColor: t.code.line }} />
        ))}
        <div style={{ marginLeft: 12, fontFamily: t.fonts.mono, fontSize: 24, color: t.code.muted }}>{title}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14, padding: 26, fontFamily: t.fonts.mono, fontSize: 32, color: t.code.text }}>{children}</div>
    </Enter>
  );
};

// Baris di dalam Window yang muncul pada frame lokal `show`.
export const Line: React.FC<{ readonly show: number; readonly children: React.ReactNode }> = ({ show, children }) => {
  const frame = useCurrentFrame();
  const k = interpolate(frame, [show, show + 8], [0, 1], { ...clamp, easing: EASE });
  return <div style={{ opacity: k, translate: `0 ${(1 - k) * 12}px`, display: "flex", alignItems: "center", gap: 14 }}>{children}</div>;
};

// Pil coret: hal yang dibantah naskah (mis. "editor video"), dicoret pada `strikeAt`.
export const StrikeChip: React.FC<{ readonly delay: number; readonly strikeAt: number; readonly children: React.ReactNode }> = ({ delay, strikeAt, children }) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const k = interpolate(frame, [strikeAt, strikeAt + 12], [0, 1], { ...clamp, easing: EASE });
  return (
    <Enter name="Dicoret" delay={delay} y={30} style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 16, padding: "14px 30px", borderRadius: 999, backgroundColor: t.code.raised, border: `2px solid ${t.code.line}`, fontFamily: t.fonts.body, fontWeight: 600, fontSize: 36, color: t.code.text }}>
        <Icon name="circleX" size={40} color={t.colors.danger ?? BLUE} />
        <span style={{ opacity: 1 - 0.4 * k }}>{children}</span>
        <div style={{ position: "absolute", left: 84, top: "50%", height: 5, width: `calc(${k * 100}% - 110px)`, borderRadius: 3, backgroundColor: t.colors.danger ?? BLUE }} />
      </div>
    </Enter>
  );
};

// Kartu repo GitHub: nama, deskripsi, bintang.
export const RepoCard: React.FC<{ readonly delay: number }> = ({ delay }) => {
  const t = useTheme();
  return (
    <Enter name="Repo" delay={delay} y={60} style={{ display: "flex", flexDirection: "column", gap: 16, padding: "30px 34px", borderRadius: t.radius.large, backgroundColor: t.code.raised, border: `2px solid ${t.code.line}`, boxShadow: t.shadows.lift }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <GithubMark size={52} color={t.code.text} />
        <div style={{ fontFamily: t.fonts.mono, fontWeight: 700, fontSize: 36, color: t.code.text }}>remotion-dev/remotion</div>
      </div>
      <div style={{ fontFamily: t.fonts.body, fontWeight: 500, fontSize: 32, color: t.code.muted }}>Make videos programmatically with React</div>
      <div style={{ display: "flex", gap: 28, fontFamily: t.fonts.body, fontWeight: 600, fontSize: 30, color: t.code.text }}>
        <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Icon name="star" size={34} color={t.code.text} /> 75,8k
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Icon name="code" size={34} color={t.code.text} /> TypeScript
        </span>
      </div>
    </Enter>
  );
};

// Strip film: kotak frame 0..n, kotak aktif berjalan sesuai frame video.
export const FilmStrip: React.FC<{ readonly delay: number; readonly count?: number; readonly big?: boolean }> = ({ delay, count = 5, big }) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const active = Math.floor(Math.max(0, frame - delay) / 8) % count;
  return (
    <Enter name="Strip film" delay={delay} x={-60} y={0} style={{ display: "flex", gap: 14, justifyContent: "center" }}>
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          style={{
            width: big ? 140 : 120,
            height: big ? 120 : 96,
            borderRadius: t.radius.card,
            border: `3px solid ${i === active ? BLUE : t.code.line}`,
            backgroundColor: i === active ? t.colors.primaryDark : t.code.raised,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: t.fonts.mono,
            fontWeight: 700,
            fontSize: big ? 40 : 30,
            color: t.code.text,
          }}
        >
          {i}
        </div>
      ))}
    </Enter>
  );
};

// Panah ke bawah yang tergambar mulai `at` (frame lokal).
export const DownArrow: React.FC<{ readonly at: number }> = ({ at }) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const k = interpolate(frame, [at, at + 10], [0, 1], { ...clamp, easing: EASE });
  return (
    <div style={{ display: "flex", justifyContent: "center", opacity: k, translate: `0 ${(k - 1) * 16}px` }}>
      <Icon name="arrowDown" size={52} color={t.colors.groundTextMuted} />
    </div>
  );
};

// Simpul komponen React, berbingkai oranye (satu sorotan di scene konteks).
export const ComponentNode: React.FC<{ readonly delay: number; readonly children: React.ReactNode }> = ({ delay, children }) => {
  const t = useTheme();
  return (
    <Enter name="Komponen" delay={delay} y={40} style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ padding: "22px 40px", borderRadius: t.radius.large, backgroundColor: t.code.raised, border: `4px solid ${t.colors.accent}`, fontFamily: t.fonts.mono, fontWeight: 700, fontSize: 52, color: t.code.text }}>
        {children}
      </div>
    </Enter>
  );
};

// Pil kecil berikon di atas latar gelap.
export const Tag: React.FC<{ readonly delay: number; readonly icon: IconName; readonly big?: boolean; readonly children: React.ReactNode }> = ({ delay, icon, big, children }) => {
  const t = useTheme();
  return (
    <Enter name={`Tag ${String(children)}`} delay={delay} y={30}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: big ? "18px 32px" : "14px 26px", borderRadius: 999, backgroundColor: t.code.raised, border: `2px solid ${t.code.line}`, fontFamily: t.fonts.body, fontWeight: 600, fontSize: big ? 40 : 32, color: t.code.text }}>
        <Icon name={icon} size={big ? 44 : 36} color={t.colors.groundTextMuted} />
        {children}
      </div>
    </Enter>
  );
};

// Baris kode dengan penanda aktif oranye di kiri pada rentang [on, off) frame lokal.
export const CodeLine: React.FC<{ readonly on?: number; readonly off?: number; readonly children: React.ReactNode }> = ({ on, off = Infinity, children }) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const lit = on !== undefined && frame >= on && frame < off;
  return (
    <div style={{ display: "flex", whiteSpace: "pre", borderRadius: 8, backgroundColor: lit ? "rgba(255,145,77,0.14)" : "transparent", boxShadow: lit ? `inset 6px 0 0 ${t.colors.accent}` : "none", padding: "2px 0 2px 16px", color: lit ? t.code.text : t.code.muted }}>
      {children}
    </div>
  );
};

// Penghitung frame yang berjalan, dipakai di scene kode.
export const FrameCounter: React.FC<{ readonly delay: number }> = ({ delay }) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  return (
    <Enter name="Frame" delay={delay} y={20} style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ padding: "10px 28px", borderRadius: 999, backgroundColor: t.colors.groundChipBg, color: t.colors.groundChipText, fontFamily: t.fonts.mono, fontWeight: 700, fontSize: 34 }}>
        frame = {Math.max(0, frame - delay)}
      </div>
    </Enter>
  );
};

// Pratinjau mini: "Halo" masuk dari kiri dan memudar masuk mulai `start` (frame lokal), mengikuti kode di atasnya.
export const PreviewBox: React.FC<{ readonly delay: number; readonly start: number }> = ({ delay, start }) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const k = interpolate(frame, [start, start + 30], [0, 1], clamp);
  return (
    <Enter name="Preview" delay={delay} y={40} style={{ height: 200, borderRadius: t.radius.large, backgroundColor: t.colors.primary, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
      <div style={{ opacity: k, translate: `${(1 - k) * -200}px 0`, fontFamily: t.fonts.heading, fontWeight: 800, fontSize: 88, color: t.colors.onPrimary }}>Halo</div>
    </Enter>
  );
};

// Screenshot Remotion Studio asli (public/reels/RemotionIntro/studio.jpg, toolbar browser sudah dipotong) di bingkai jendela. Zoom pelan
// ke panel preview dengan cincin oranye sampai `quietAt` (saat render mulai), lalu cincin hilang dan gambar meredup.
// Posisi panel preview di gambar (persen) diukur dari berkas 1600x1002: x 613-919, y 75-620.
const PREVIEW = { x: 38.3, y: 7.5, w: 19.1, h: 54.4 } as const;
export const StudioShot: React.FC<{ readonly delay: number; readonly quietAt: number }> = ({ delay, quietAt }) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [delay + 10, quietAt], [1, 1.45], { ...clamp, easing: EASE });
  const ring = interpolate(frame, [delay + 18, delay + 28], [0, 1], clamp) * interpolate(frame, [quietAt, quietAt + 8], [1, 0], clamp);
  const dim = interpolate(frame, [quietAt, quietAt + 12], [0, 1], { ...clamp, easing: EASE });
  return (
    <Enter name="Studio" delay={delay} y={50} style={{ borderRadius: t.radius.large, backgroundColor: t.code.raised, border: `2px solid ${t.code.line}`, overflow: "hidden", boxShadow: t.shadows.lift }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 24px", borderBottom: `2px solid ${t.code.line}` }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ width: 16, height: 16, borderRadius: 999, backgroundColor: t.code.line }} />
        ))}
        <div style={{ marginLeft: 12, fontFamily: t.fonts.mono, fontSize: 24, color: t.code.muted }}>Remotion Studio · npm run dev</div>
      </div>
      <div style={{ position: "relative", aspectRatio: "1600 / 1002", overflow: "hidden", filter: `brightness(${1 - 0.4 * dim})` }}>
        <div style={{ position: "absolute", inset: 0, scale: zoom, transformOrigin: "48% 33%" }}>
          <Img src={staticFile("reels/RemotionIntro/studio.jpg")} style={{ width: "100%", height: "100%", display: "block" }} />
          <div style={{ position: "absolute", left: `${PREVIEW.x}%`, top: `${PREVIEW.y}%`, width: `${PREVIEW.w}%`, height: `${PREVIEW.h}%`, borderRadius: 6, boxShadow: `0 0 0 4px ${t.colors.accent}`, opacity: ring }} />
        </div>
      </div>
    </Enter>
  );
};

// Baris render: perintah, bar progres, lalu file hasil.
export const RenderRow: React.FC<{ readonly delay: number; readonly fileAt: number }> = ({ delay, fileAt }) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const v = interpolate(frame, [delay + 8, fileAt], [0, 1], { ...clamp, easing: EASE });
  return (
    <Enter name="Render" delay={delay} y={40} style={{ display: "flex", flexDirection: "column", gap: 14, padding: "20px 28px", borderRadius: t.radius.large, backgroundColor: t.code.raised, border: `2px solid ${t.code.line}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: t.fonts.mono, fontSize: 30, color: t.code.text }}>
        <span>$ npx remotion render</span>
        <span style={{ color: t.code.muted }}>{Math.round(v * 100)}%</span>
      </div>
      <Bar value={v} color={t.colors.accent} height={24} />
      <Line show={fileAt}>
        <Icon name="circleCheck" size={36} color={t.colors.success ?? BLUE} />
        <span style={{ fontFamily: t.fonts.mono, fontSize: 30, color: t.code.text }}>out/HelloWorld.mp4</span>
      </Line>
    </Enter>
  );
};

// Baris daftar bercentang; `hot` = satu sorotan oranye.
export const CheckRow: React.FC<{ readonly delay: number; readonly hot?: boolean; readonly children: React.ReactNode }> = ({ delay, hot, children }) => {
  const t = useTheme();
  return (
    <Enter name={`Skill ${String(children)}`} delay={delay} x={60} y={0} style={{ display: "flex", alignItems: "center", gap: 18, padding: "16px 24px", borderRadius: t.radius.card, backgroundColor: t.code.raised, border: `2px solid ${hot ? t.colors.accent : t.code.line}`, fontFamily: t.fonts.mono, fontWeight: 600, fontSize: 32, color: t.code.text }}>
      <Icon name="circleCheck" size={38} color={t.colors.success ?? BLUE} />
      {children}
    </Enter>
  );
};

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
