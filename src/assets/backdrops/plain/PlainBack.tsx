import type React from "react";
import { AbsoluteFill } from "remotion";
import { blendTimes, type TimeOfDay } from "../shared";
import { PLAIN_DAY, PLAIN_MALAM, PLAIN_SORE, type PlainPalette } from "./palette";

// Jangkar latar kosong: garis lantai (kaki karakter) dan sumbu tengah kolam cahaya, dalam piksel kanvas.
export type PlainAnchors = { readonly floorY: number; readonly spotX: number };

// Kanvas tegak 1080x1920.
export const PORTRAIT_PLAIN_ANCHORS: PlainAnchors = { floorY: 1400, spotX: 540 };

export const PLAIN_TIMES: Record<TimeOfDay, PlainPalette> = { siang: PLAIN_DAY, sore: PLAIN_SORE, malam: PLAIN_MALAM };
export const plainPalette = (time: TimeOfDay | number): PlainPalette => blendTimes(PLAIN_TIMES, time);

export type PlainProps = {
  readonly anchors?: PlainAnchors;
  // Waktu hari: nama, atau angka 0..1 (siang 0, sore 0.5, malam 1). Bawaan siang.
  readonly time?: TimeOfDay | number;
  readonly palette?: PlainPalette;
};

// Dinding polos, lantai, dan kolam cahaya di bawah karakter. Gambar paling belakang; karakter berdiri di `floorY`.
export const PlainBack: React.FC<PlainProps> = ({ anchors: a = PORTRAIT_PLAIN_ANCHORS, time = "siang", palette }) => {
  const p = palette ?? plainPalette(time);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(${p.wallTop}, ${p.wallBottom})` }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: a.floorY, bottom: 0, backgroundColor: p.floor, borderTop: `6px solid ${p.floorEdge}`, boxSizing: "border-box" }} />
      <div
        style={{
          position: "absolute",
          left: a.spotX - 420,
          top: a.floorY - 90,
          width: 840,
          height: 240,
          borderRadius: "50%",
          background: `radial-gradient(closest-side, ${p.spot}, transparent)`,
          opacity: p.spotOpacity,
        }}
      />
    </AbsoluteFill>
  );
};
