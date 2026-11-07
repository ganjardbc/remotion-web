import type React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { useTheme } from "../themes";
import type { CharacterId, DraftLine } from "./types";

// Caption karaoke satu baris dengan penanda pembicara. Dipakai Reels dialog (DraftVideo, di bawah lantai) dan Reels block
// (src/block-reels, di atas karakter); yang beda hanya kotak posisi (`box`) dan `onLight`.

const EASE = Easing.bezier(0.2, 0.8, 0.2, 1);

export type CaptionLine = Pick<DraftLine, "who" | "from" | "dur" | "text" | "wordTimes">;

// Waktu mulai tiap kata (detik sejak baris mulai). Dari `wordTimes` bila lengkap, bila tidak diperkirakan dari panjang huruf
// dengan jeda kecil setelah tanda baca.
const wordStarts = (line: CaptionLine, words: readonly string[]): readonly number[] => {
  if (line.wordTimes && line.wordTimes.length === words.length) return line.wordTimes;
  const weights = words.map((w) => w.length + 1 + (/[.?!]$/.test(w) ? 3 : /[,:;]$/.test(w) ? 1.5 : 0));
  const total = weights.reduce((a, b) => a + b, 0);
  const span = line.dur * 0.92;
  let acc = 0;
  return weights.map((w) => {
    const at = (acc / total) * span;
    acc += w;
    return at;
  });
};

const SPEAKER: Readonly<Record<CharacterId, { readonly name: string; readonly fill: "primary" | "surface" }>> = {
  ganjar: { name: "Ganjar", fill: "primary" },
  robot: { name: "Robot", fill: "surface" },
  claudecode: { name: "Claude Code", fill: "surface" },
};

// Subtitle berbentuk caption: satu baris yang sedang diucapkan, rata tengah (horizontal dan vertikal) di area bawah lantai.
// Mode karaoke: kata yang sedang diucapkan putih penuh, yang sudah lewat agak redup, yang belum redup; penanda pembicara
// (titik berwarna per karakter dan nama kecil) di atas teks.
export const LineCaption: React.FC<{
  readonly lines: readonly CaptionLine[];
  readonly motion: "karaoke" | "none";
  // Latar terang: teks gelap tanpa bayangan.
  readonly onLight?: boolean;
  // Kotak (px dari tepi atas dan bawah kanvas 1920) tempat teks diratakan tengah.
  readonly box: { readonly top: number; readonly bottom: number };
}> = ({ lines, motion, onLight = false, box }) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const now = frame / fps;
  const line = lines.find((l) => now >= l.from && now < l.from + l.dur);
  if (!line) return null;
  const local = now - line.from;
  const clampOpts = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  const opacity = EASE(interpolate(local, [0, 0.2], [0, 1], clampOpts)) * interpolate(local, [line.dur - 0.15, line.dur], [1, 0], clampOpts);
  const words = line.text.split(" ");
  const starts = wordStarts(line, words);
  const karaoke = motion === "karaoke";
  const sp = SPEAKER[line.who];
  const white = onLight ? t.colors.ink : (t.colors.groundText ?? t.colors.onPrimary);
  return (
    <div
      style={{
        position: "absolute",
        left: 80,
        right: 80,
        top: box.top,
        bottom: box.bottom,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 18,
        opacity,
      }}
    >
      {karaoke ? (
        <div style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: t.fonts.body, fontWeight: 600, fontSize: 28, color: onLight ? t.colors.muted : t.colors.groundTextMuted }}>
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: 11,
              backgroundColor: sp.fill === "primary" ? t.colors.primary : t.colors.surface,
              border: `3px solid ${sp.fill === "primary" ? t.colors.primarySoft : t.colors.primary}`,
            }}
          />
          {sp.name}
        </div>
      ) : null}
      <div
        style={{
          textAlign: "center",
          textWrap: "balance",
          fontFamily: t.fonts.body,
          fontWeight: 700,
          fontSize: 54,
          lineHeight: 1.3,
          color: white,
          textShadow: onLight ? "none" : "0 2px 12px rgba(0, 0, 0, 0.55)",
        }}
      >
        {words.map((w, i) => {
          // 0 = belum, 1 = sedang/aktif; berpindah halus selama 0,12 detik. Kata yang sudah lewat turun ke 0,75.
          const on = karaoke ? EASE(interpolate(local, [starts[i], starts[i] + 0.12], [0, 1], clampOpts)) : 1;
          const last = i + 1 >= words.length;
          const past = karaoke && !last ? EASE(interpolate(local, [starts[i + 1], starts[i + 1] + 0.12], [0, 1], clampOpts)) : 0;
          const o = karaoke ? 0.35 + 0.65 * on - 0.25 * past : 1;
          return (
            <span key={i} style={{ opacity: o }}>
              {w}
              {i < words.length - 1 ? " " : ""}
            </span>
          );
        })}
      </div>
    </div>
  );
};
