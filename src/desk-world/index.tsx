import type React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Icon } from "../icons";
import { Enter } from "../motion";
import { SAFE_RIGHT, SUBTITLE_HEIGHT, ZONES } from "../reelsLayout";
import { useTheme } from "../themes";

// Dunia meja untuk Reels 9:16 (asal: ClaudeSetup): satu meja yang sama di semua scene, benda di atasnya, monitor dan keyboard
// untuk scene perintah, rak laci untuk scene daftar, dan caption karaoke di tepi depan meja. Posisi vertikal dari
// src/reelsLayout.ts (ZONES). Semua komponen bergantung pada frame lokal scene (useCurrentFrame), tanpa impor dari folder
// video; waktu diberikan lewat props dalam frame, jadi video mana pun bisa memakainya.
// Dokumentasi: docs/struktur-video.md, bagian "Variasi visual antar scene".

type IconName = React.ComponentProps<typeof Icon>["name"];
const EASE = Easing.bezier(0.2, 0.8, 0.2, 1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// ---------- Meja dan benda ----------

export const Desk: React.FC = () => {
  const t = useTheme();
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: ZONES.deskTop, height: ZONES.deskHeight, backgroundColor: t.code.raised, borderTop: `8px solid ${t.code.line}`, boxShadow: "0 -20px 40px rgba(0,0,0,0.25)" }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 26, backgroundColor: t.code.line, opacity: 0.55 }} />
    </div>
  );
};

const standOnDesk = (height: number): number => ZONES.deskTop + 18 - height;

// Cangkir dengan uap.
export const Mug: React.FC<{ readonly left: number }> = ({ left }) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const wave = Math.sin(frame / 14);
  return (
    <svg width={190} height={230} viewBox="0 0 190 230" style={{ position: "absolute", left, top: standOnDesk(230) }}>
      {[0, 1].map((i) => (
        <path key={i} d={`M${62 + i * 34} 70 q${12 + wave * 6} -18 0 -36 q${-12 - wave * 6} -18 0 -34`} fill="none" stroke={t.colors.groundTextMuted} strokeWidth={7} strokeLinecap="round" opacity={0.6} />
      ))}
      <rect x={30} y={90} width={110} height={120} rx={14} fill={t.colors.groundChipBg} />
      <path d="M140 118 h14 a22 22 0 0 1 0 50 h-14" fill="none" stroke={t.colors.groundChipBg} strokeWidth={14} />
      <rect x={30} y={90} width={110} height={18} rx={9} fill={t.colors.primarySoft} />
    </svg>
  );
};

// Lampu meja dengan kerucut cahaya.
export const Lamp: React.FC<{ readonly left: number }> = ({ left }) => {
  const t = useTheme();
  return (
    <svg width={198} height={312} viewBox="0 0 330 520" style={{ position: "absolute", left, top: standOnDesk(312) }}>
      <polygon points="150,150 300,150 330,500 90,500" fill={t.colors.primarySoft} opacity={0.14} />
      <rect x={20} y={490} width={110} height={22} rx={11} fill={t.code.line} />
      <path d="M75 490 L75 270 L140 140" fill="none" stroke={t.code.line} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M110 120 L190 110 L205 160 L130 175 Z" fill={t.colors.groundChipBg} />
    </svg>
  );
};

// Tanaman kecil.
export const Plant: React.FC<{ readonly left: number }> = ({ left }) => {
  const t = useTheme();
  return (
    <svg width={190} height={300} viewBox="0 0 190 300" style={{ position: "absolute", left, top: standOnDesk(300) }}>
      <path d="M95 190 C60 150 50 100 85 50 C110 90 115 150 95 190Z" fill={t.colors.primarySoft} />
      <path d="M95 190 C130 160 150 120 135 80 C105 110 90 150 95 190Z" fill={t.colors.primarySoft} opacity={0.75} />
      <path d="M95 190 C50 190 25 160 20 130 C60 140 90 160 95 190Z" fill={t.colors.primarySoft} opacity={0.55} />
      <path d="M45 190 h100 l-12 100 h-76 Z" fill={t.colors.groundChipBg} />
    </svg>
  );
};

// ---------- Monitor dan keyboard ----------

// Monitor: bezel gelap, layar berisi `children`. Berdiri di meja di belakang karakter; tinggi layar `height`, leher dan alas
// menyusul sepanjang 450 px di bawahnya.
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

// Keyboard miring seperti dilihat dari depan; tuts menyala saat huruf diketik. `startFrame` dan `durFrames` = jendela mengetik
// dalam frame lokal scene, `chars` = jumlah huruf yang diketik.
export const Keyboard: React.FC<{
  readonly delay: number;
  readonly top: number;
  readonly startFrame: number;
  readonly durFrames: number;
  readonly chars: number;
}> = ({ delay, top, startFrame, durFrames, chars }) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const step = durFrames / chars;
  const current = Math.floor((frame - startFrame) / step);
  const lit = new Map<number, number>();
  for (let i = Math.max(0, current - 4); i <= Math.min(chars - 1, current); i += 1) {
    const age = frame - (startFrame + i * step);
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

// openFrame dan closeFrame dalam frame lokal scene (closeFrame null = tetap terbuka).
export type DrawerSpec = { readonly icon: IconName; readonly label: string; readonly badge?: string; readonly openFrame: number; readonly closeFrame: number | null };

const SLIDE_FRAMES = 14;

// Rak laci berdiri di meja (kaki di deskTop). Tiap laci meluncur ke kanan 120 px saat openFrame dan menutup di closeFrame.
export const Cabinet: React.FC<{ readonly delay: number; readonly drawers: readonly DrawerSpec[]; readonly left?: number }> = ({ delay, drawers, left = 60 }) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const slide = (at: number): number => interpolate(frame, [at, at + SLIDE_FRAMES], [0, 1], { ...clamp, easing: EASE });
  return (
    <Enter name="Rak" delay={delay} y={60} style={{ position: "absolute", left, top: ZONES.deskTop - 890, width: 480, height: 890 }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 830, borderRadius: 26, backgroundColor: t.code.raised, border: `3px solid ${t.code.line}`, padding: 20, display: "flex", flexDirection: "column", gap: 10 }}>
        {drawers.map((d) => {
          const out = slide(d.openFrame) - (d.closeFrame === null ? 0 : slide(d.closeFrame));
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
                {d.badge ? <span style={{ fontFamily: t.fonts.mono, fontSize: 30, opacity: out }}>{d.badge}</span> : null}
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

type Word = readonly [string, number];

// Bagi kata satu scene jadi potongan pendek (satu baris): maksimal CAPTION_MAX_CHARS huruf, putus lebih awal setelah tanda baca.
const chunksOf = (words: readonly Word[]): readonly (readonly number[])[] => {
  const chunks: number[][] = [];
  let current: number[] = [];
  let len = 0;
  words.forEach(([word], i) => {
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

// Subtitle satu baris rata tengah, dirender di root video (di luar Series). `sceneStarts` = frame awal tiap scene, `words` = kata
// tiap scene sebagai [kata, detik sejak suara mulai] (dari timestamp scribe), `lead` = jeda frame sebelum suara mulai di scene.
// Kata yang diucapkan putih penuh, yang sudah lewat agak redup, yang belum redup (tanpa oranye: satu sorotan per layar).
// `y` = posisi atas, satu angka atau satu per scene; bawaan ZONES.captionTop (tepi depan meja, di atas footer).
export const Caption: React.FC<{
  readonly sceneStarts: readonly number[];
  readonly words: readonly (readonly Word[])[];
  readonly lead: number;
  readonly y?: number | readonly number[];
}> = ({ sceneStarts, words: sceneWords, lead, y = ZONES.captionTop }) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sceneIndex = sceneStarts.reduce((acc, start, idx) => (start <= frame ? idx : acc), 0);
  const now = (frame - sceneStarts[sceneIndex] - lead) / fps;
  const words = sceneWords[sceneIndex];
  const chunks = chunksOf(words);
  const chunkIndex = chunks.reduce((acc, ids, k) => (now >= words[ids[0]][1] - 0.05 ? k : acc), -1);
  if (chunkIndex < 0) return null;
  const ids = chunks[chunkIndex];
  const enter = interpolate(now, [words[ids[0]][1] - 0.05, words[ids[0]][1] + 0.12], [0, 1], { ...clamp, easing: EASE });
  return (
    <div
      style={{
        position: "absolute",
        left: 60,
        right: 60,
        top: typeof y === "number" ? y : y[sceneIndex],
        height: ZONES.captionHeight,
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
            {k < ids.length - 1 ? " " : ""}
          </span>
        );
      })}
    </div>
  );
};

// ---------- SubtitleBand (subtitle dua baris, zona aman platform) ----------

const BAND_MAX_CHARS = 46; // dua baris, sekitar 23 huruf per baris pada huruf 46 px di lebar 780 px

// Potongan lebih panjang dari Caption: sampai BAND_MAX_CHARS huruf (dua baris), putus lebih awal setelah tanda baca.
const bandChunksOf = (words: readonly Word[]): readonly (readonly number[])[] => {
  const chunks: number[][] = [];
  let current: number[] = [];
  let len = 0;
  words.forEach(([word], i) => {
    if (current.length > 0 && len + 1 + word.length > BAND_MAX_CHARS) {
      chunks.push(current);
      current = [];
      len = 0;
    }
    current.push(i);
    len += (len > 0 ? 1 : 0) + word.length;
    if (/[.?:!]$/.test(word) && len >= 16) {
      chunks.push(current);
      current = [];
      len = 0;
    }
  });
  if (current.length > 0) chunks.push(current);
  return chunks;
};

// Subtitle karaoke dua baris di pil gelap, dirender sekali di root video (di luar Series). Margin simetris SAFE_RIGHT di kiri dan
// kanan: teks tepat di tengah layar dan kolom tombol platform tidak menutupinya. `y` = posisi atas, satu angka atau satu per scene (dari NARRATOR_MODES).
// Kata yang diucapkan putih penuh, yang sudah lewat agak redup, yang belum redup (tanpa oranye).
export const SubtitleBand: React.FC<{
  readonly sceneStarts: readonly number[];
  readonly words: readonly (readonly Word[])[];
  readonly lead: number;
  readonly y: number | readonly number[];
}> = ({ sceneStarts, words: sceneWords, lead, y }) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sceneIndex = sceneStarts.reduce((acc, start, idx) => (start <= frame ? idx : acc), 0);
  const now = (frame - sceneStarts[sceneIndex] - lead) / fps;
  const words = sceneWords[sceneIndex];
  const chunks = bandChunksOf(words);
  const chunkIndex = chunks.reduce((acc, ids, k) => (now >= words[ids[0]][1] - 0.05 ? k : acc), -1);
  if (chunkIndex < 0) return null;
  const ids = chunks[chunkIndex];
  const enter = interpolate(now, [words[ids[0]][1] - 0.05, words[ids[0]][1] + 0.12], [0, 1], { ...clamp, easing: EASE });
  return (
    <div
      style={{
        position: "absolute",
        left: SAFE_RIGHT,
        right: SAFE_RIGHT,
        top: typeof y === "number" ? y : y[sceneIndex],
        height: SUBTITLE_HEIGHT,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: enter,
        translate: `0 ${(1 - enter) * 12}px`,
      }}
    >
      <div
        style={{
          padding: "14px 32px",
          borderRadius: 28,
          backgroundColor: "rgba(8, 12, 32, 0.78)",
          textAlign: "center",
          textWrap: "balance",
          fontFamily: t.fonts.body,
          fontWeight: 700,
          fontSize: 46,
          lineHeight: 1.25,
          color: t.colors.groundText,
        }}
      >
        {ids.map((wi, k) => {
          const start = words[wi][1];
          const nextStart = k + 1 < ids.length ? words[ids[k + 1]][1] : Number.POSITIVE_INFINITY;
          const on = interpolate(now, [start, start + 0.1], [0, 1], { ...clamp, easing: EASE });
          const past = Number.isFinite(nextStart) ? interpolate(now, [nextStart, nextStart + 0.1], [0, 1], { ...clamp, easing: EASE }) : 0;
          return (
            <span key={wi} style={{ opacity: 0.45 + 0.55 * on - 0.12 * past }}>
              {words[wi][0]}
              {k < ids.length - 1 ? " " : ""}
            </span>
          );
        })}
      </div>
    </div>
  );
};

// Ejaan tampilan subtitle: SPOKEN ditulis fonetis untuk suara ("Ei Ai", "Es Di El Si"), tapi layar harus menampilkan ejaan asli
// ("AI", "SDLC"). Tiap aturan = urutan kata fonetis (huruf kecil, tanpa tanda baca di ujung) dan penggantinya; waktu kata pertama
// dipertahankan dan tanda baca di ujung kata terakhir ikut dibawa. Aturan yang tidak cocok dibiarkan (mis. hasil scribe yang sudah "AI").
export type DisplayFix = { readonly match: readonly string[]; readonly to: string };

export const displayWords = (words: readonly (readonly [string, number])[], fixes: readonly DisplayFix[]): readonly (readonly [string, number])[] => {
  const core = (w: string): string => w.replace(/[.,?:;!]+$/, "").toLowerCase();
  const out: (readonly [string, number])[] = [];
  for (let i = 0; i < words.length; ) {
    const fix = fixes.find((f) => f.match.every((m, k) => i + k < words.length && core(words[i + k][0]) === m));
    if (fix) {
      const last = words[i + fix.match.length - 1][0];
      out.push([fix.to + (last.match(/[.,?:;!]+$/)?.[0] ?? ""), words[i][1]]);
      i += fix.match.length;
    } else {
      out.push(words[i]);
      i += 1;
    }
  }
  return out;
};
