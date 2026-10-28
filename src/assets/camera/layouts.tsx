import type React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

// Tata letak di luar kamera: panel berdampingan, gelembung kecil, sisipan layar penuh, dan hiasan sinematik.

// Dua panel berdampingan. Isi tiap panel biasanya `ShotCamera` dengan `width` dan `height` sebesar panel.
export const SplitScreen: React.FC<{
  readonly left: React.ReactNode;
  readonly right: React.ReactNode;
  readonly width: number;
  readonly height: number;
  // Lebar panel kiri sebagai pecahan 0..1.
  readonly ratio?: number;
  readonly gap?: number;
}> = ({ left, right, width, height, ratio = 0.5, gap = 8 }) => {
  const lw = Math.round((width - gap) * ratio);
  const rw = width - gap - lw;
  return (
    <AbsoluteFill style={{ background: "#0f1020" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: lw, height, overflow: "hidden" }}>{left}</div>
      <div style={{ position: "absolute", left: lw + gap, top: 0, width: rw, height, overflow: "hidden" }}>{right}</div>
    </AbsoluteFill>
  );
};

export type Corner = "topLeft" | "topRight" | "bottomLeft" | "bottomRight";

// Gelembung bidikan kedua (reaksi) di sudut layar, di atas bidikan utama.
export const PictureInPicture: React.FC<{
  readonly pip: React.ReactNode;
  readonly width: number;
  readonly height: number;
  readonly pipWidth?: number;
  readonly pipHeight?: number;
  readonly corner?: Corner;
  readonly margin?: number;
  readonly children: React.ReactNode;
}> = ({ pip, width, height, pipWidth = 520, pipHeight = 520, corner = "bottomRight", margin = 48, children }) => {
  const frame = useCurrentFrame();
  const pop = interpolate(frame, [0, 8], [0.85, 1], { extrapolateRight: "clamp" });
  const left = corner.endsWith("Left") ? margin : width - pipWidth - margin;
  const top = corner.startsWith("top") ? margin : height - pipHeight - margin;
  return (
    <AbsoluteFill>
      {children}
      <div
        style={{
          position: "absolute",
          left,
          top,
          width: pipWidth,
          height: pipHeight,
          borderRadius: 28,
          overflow: "hidden",
          border: "8px solid #ffffff",
          boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
          transform: `scale(${pop})`,
          opacity: interpolate(frame, [0, 6], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        {pip}
      </div>
    </AbsoluteFill>
  );
};

// Sisipan layar penuh (terminal, kode, browser): muncul membesar dari sedikit lebih kecil dengan bayangan.
// Pasang di dalam `Sequence` supaya animasi masuk mulai dari frame 0-nya.
export const InsertCard: React.FC<{ readonly children: React.ReactNode; readonly inset?: number }> = ({ children, inset = 0 }) => {
  const frame = useCurrentFrame();
  const k = interpolate(frame, [0, 7], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: k }}>
      <div style={{ position: "absolute", inset, transform: `scale(${0.94 + 0.06 * k})`, borderRadius: inset ? 24 : 0, overflow: "hidden", boxShadow: inset ? "0 20px 60px rgba(0,0,0,0.45)" : undefined }}>
        {children}
      </div>
    </AbsoluteFill>
  );
};

// Gelap di tepi layar, memusatkan perhatian.
export const Vignette: React.FC<{ readonly strength?: number }> = ({ strength = 0.35 }) => (
  <AbsoluteFill style={{ pointerEvents: "none", background: `radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,${strength}) 100%)` }} />
);

// Garis hitam atas dan bawah ala film (rasio lebih lebar).
export const Letterbox: React.FC<{ readonly bar?: number }> = ({ bar = 90 }) => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: bar, background: "#000" }} />
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: bar, background: "#000" }} />
  </AbsoluteFill>
);
