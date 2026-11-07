import type React from "react";
import { AbsoluteFill, Series } from "remotion";
import { LineCaption } from "../dialog-reels/Caption";
import { ThemeProvider } from "../themes";
import { Stage } from "./Stage";
import type { BlockMeta, BlockScene } from "./types";

// Reels block 9:16: dialog karakter block di dunia diorama, ganti shot kamera per baris, caption di atas.
// Sengaja tanpa BrandFooter dan tanpa watermark (jenis folder ini dikecualikan dari aturan footer).

export const FPS = 30;
// Jeda setelah baris terakhir sebelum scene berganti.
const TAIL = 0.6;
// Kotak caption: di bawah zona aman atas antarmuka aplikasi (±250 px) dan di atas karakter. Komponen caption sama dengan Reels dialog
// (src/dialog-reels/Caption.tsx): karaoke satu baris dengan penanda pembicara.
const CAPTION_BOX = { top: 250, bottom: 1920 - 490 } as const;

export const sceneFrames = (scenes: readonly BlockScene[]): number[] =>
  scenes.map((s) => Math.ceil(Math.max(s.seconds, ...s.lines.map((l) => l.from + l.dur + TAIL)) * FPS));
export const totalFrames = (scenes: readonly BlockScene[]): number => sceneFrames(scenes).reduce((a, b) => a + b, 0);

export const BlockReels: React.FC<{ readonly theme: string; readonly meta: BlockMeta; readonly scenes: readonly BlockScene[] }> = ({ theme, scenes }) => {
  const frames = sceneFrames(scenes);
  return (
    <ThemeProvider name={theme}>
      <AbsoluteFill style={{ backgroundColor: "#05070f" }}>
        <Series>
          {scenes.map((s, i) => (
            <Series.Sequence key={s.id} name={s.id} durationInFrames={frames[i]} premountFor={FPS}>
              <Stage scene={s} />
              {/* Gradasi gelap lembut di atas supaya caption tetap terbaca di atas lampu jendela yang terang. */}
              <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 640, background: "linear-gradient(180deg, rgba(3,6,16,0.62) 0%, rgba(3,6,16,0.4) 55%, rgba(3,6,16,0) 100%)" }} />
              <LineCaption lines={s.lines} motion="karaoke" box={CAPTION_BOX} />
            </Series.Sequence>
          ))}
        </Series>
      </AbsoluteFill>
    </ThemeProvider>
  );
};
