import type React from "react";
import { AbsoluteFill, interpolate, Series, useCurrentFrame, useVideoConfig } from "remotion";
import { gh } from "../themes/gh";
import { Stage } from "./Stage";
import type { BlockLine, BlockMeta, BlockScene } from "./types";

// Reels block 9:16: dialog karakter block di dunia diorama, ganti shot kamera per baris, caption di atas.
// Sengaja tanpa BrandFooter dan tanpa watermark (jenis folder ini dikecualikan dari aturan footer).

export const FPS = 30;
// Jeda setelah baris terakhir sebelum scene berganti.
const TAIL = 0.6;
// Caption bertahan sebentar setelah baris selesai supaya tidak berkedip di jeda antar baris.
const HOLD = 0.35;
// Batas atas caption: di bawah zona aman atas antarmuka aplikasi (±250 px) dan di atas karakter.
const CAPTION_TOP = 250;

export const sceneFrames = (scenes: readonly BlockScene[]): number[] =>
  scenes.map((s) => Math.ceil(Math.max(s.seconds, ...s.lines.map((l) => l.from + l.dur + TAIL)) * FPS));
export const totalFrames = (scenes: readonly BlockScene[]): number => sceneFrames(scenes).reduce((a, b) => a + b, 0);

// Baris yang tampil pada detik t: yang terakhir mulai, selama masih dalam durasi + HOLD.
const activeLine = (lines: readonly BlockLine[], t: number): BlockLine | null => {
  let cur: BlockLine | null = null;
  for (const l of lines) if (l.from <= t) cur = l;
  return cur && t < cur.from + cur.dur + HOLD ? cur : null;
};

// Satu atau dua baris di dalam pil gelap; kata yang sudah diucapkan putih penuh, sisanya redup (waktu kata diperkirakan dari huruf).
const Caption: React.FC<{ readonly scene: BlockScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const line = activeLine(scene.lines, t);
  if (!line) return null;
  const words = line.text.split(" ");
  const total = words.reduce((n, w) => n + w.length + 1, 0);
  const progress = Math.min(1, Math.max(0, (t - line.from) / Math.max(0.1, line.dur - 0.15)));
  let seen = 0;
  const enter = interpolate(t - line.from, [0, 0.14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: CAPTION_TOP, display: "flex", justifyContent: "center", opacity: enter, transform: `translateY(${(1 - enter) * 10}px)` }}>
      <div
        style={{
          maxWidth: 860,
          padding: "20px 40px",
          borderRadius: 30,
          backgroundColor: "rgba(6,9,22,0.46)",
          fontFamily: gh.fonts.body,
          fontWeight: 700,
          fontSize: 58,
          lineHeight: 1.22,
          textAlign: "center",
          letterSpacing: "-0.01em",
        }}
      >
        {words.map((w, i) => {
          const start = seen / total;
          seen += w.length + 1;
          return (
            <span key={i} style={{ color: progress >= start ? "#FFFFFF" : "rgba(255,255,255,0.5)" }}>
              {w}
              {i < words.length - 1 ? " " : ""}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export const BlockReels: React.FC<{ readonly meta: BlockMeta; readonly scenes: readonly BlockScene[] }> = ({ scenes }) => {
  const frames = sceneFrames(scenes);
  return (
    <AbsoluteFill style={{ backgroundColor: "#05070f" }}>
      <Series>
        {scenes.map((s, i) => (
          <Series.Sequence key={s.id} name={s.id} durationInFrames={frames[i]} premountFor={FPS}>
            <Stage scene={s} />
            <Caption scene={s} />
          </Series.Sequence>
        ))}
      </Series>
    </AbsoluteFill>
  );
};
