import type React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { evalCamera, type Shot } from "./camera";

// Kamera virtual untuk satu adegan. Dunia (`children`, dan `background` yang bisa diblur untuk rack focus) digambar
// sekali pada ukuran `world` (bawaan = ukuran video) dan terus berjalan; kamera hanya berpindah antar `shots`.
// Pindah bidikan = potong langsung (waktu adegan tidak terputus), kecuali bila bidikan memilih whip atau punch.
// `width` x `height` = ukuran layar kamera (bawaan = video); ubah untuk menanam kamera di panel (split screen, PiP).
export type ShotCameraProps = {
  readonly shots: readonly Shot[];
  readonly children: React.ReactNode;
  readonly background?: React.ReactNode;
  readonly world?: { readonly width: number; readonly height: number };
  readonly width?: number;
  readonly height?: number;
};

export const ShotCamera: React.FC<ShotCameraProps> = ({ shots, children, background, world, width, height }) => {
  const frame = useCurrentFrame();
  const cfg = useVideoConfig();
  const W = width ?? cfg.width;
  const H = height ?? cfg.height;
  const ww = world?.width ?? cfg.width;
  const wh = world?.height ?? cfg.height;
  const c = evalCamera(shots, frame, cfg.fps, W);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: ww,
          height: wh,
          transformOrigin: "0 0",
          transform: `translate(${W / 2 + c.dx}px, ${H / 2 + c.dy}px) rotate(${c.rotate}deg) scale(${c.zoom}) translate(${-c.x}px, ${-c.y}px)`,
          filter: c.blur > 0.1 ? `blur(${c.blur}px)` : undefined,
        }}
      >
        {background && <div style={{ position: "absolute", inset: 0, filter: c.blurBg > 0.1 ? `blur(${c.blurBg}px)` : undefined }}>{background}</div>}
        {children}
      </div>
    </div>
  );
};
