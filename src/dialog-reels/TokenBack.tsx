import type React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { useTheme } from "../themes";
import type { DraftScene, TokenBackMood } from "./types";

// Latar "token" (Reels dialog, tema limit AI): lapisan datar samar di atas latar polos dan di belakang karakter.
// Tiga lapis: warna mood (gradasi), meter token (bar terkuras atau terisi), dan baris kode (mengalir, lalu membeku dengan pesan
// rate limit). Semua datar (HTML), jadi ikut terskala bersama latar saat kamera zoom, dan tanpa 3D. Sengaja redup supaya tidak
// bersaing dengan teks layar dan caption; tanpa oranye (oranye = satu sorotan per layar). Gerak ease-out, tanpa bounce.

const W = 1080;
const EASE = Easing.bezier(0.2, 0.8, 0.2, 1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

type Box = { readonly x: number; readonly y: number; readonly w: number; readonly h: number };
// Posisi lapisan. `wash` = kotak tempat warna mood (bawaan seluruh kanvas); `radius` = sudut kotak itu.
export type TokenLayout = { readonly meter: Box; readonly code: { readonly x: number; readonly top: number; readonly w: number; readonly rows: number }; readonly wash?: Box; readonly radius?: number };
export const FULL_LAYOUT: TokenLayout = { meter: { x: 160, y: 470, w: 760, h: 56 }, code: { x: 160, top: 700, w: 760, rows: 14 } };
const PITCH = 40;
const ROW_H = 16;
const SCROLL_ROWS_PER_SEC = 0.9;

// Lebar baris kode semu (0,25-0,9 dari 760) dari indeks baris, supaya tetap sama tiap frame.
const rowWidth = (i: number): number => 0.25 + 0.65 * Math.abs(Math.sin(i * 12.9898) * 0.5 + Math.sin(i * 4.1414) * 0.5);

const wash = (mood: TokenBackMood, primary: string, deep: string, danger: string): string => {
  switch (mood) {
    case "alarm":
      return `radial-gradient(120% 70% at 50% 18%, ${danger}47 0%, ${danger}00 70%)`;
    case "gelap":
      return "linear-gradient(180deg, rgba(11,15,26,0.40), rgba(11,15,26,0.15))";
    case "tenang":
      return `radial-gradient(120% 70% at 50% 25%, ${deep}59 0%, ${deep}00 75%)`;
    case "terang":
      return `radial-gradient(120% 80% at 50% 30%, ${primary}59 0%, ${primary}00 75%)`;
    case "brand":
      return `linear-gradient(180deg, ${primary}66 0%, ${deep}59 100%)`;
  }
};

export const TokenBack: React.FC<{ readonly scene: DraftScene; readonly layout?: TokenLayout }> = ({ scene, layout = FULL_LAYOUT }) => {
  const METER = layout.meter;
  const CODE = { ...layout.code, pitch: PITCH, h: ROW_H };
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = useTheme();
  const tb = scene.tokenBack;
  if (!tb) return null;
  const now = frame / fps;
  const danger = t.colors.danger ?? "#E5484D";

  // Mood masuk 0,6 dtk.
  const moodIn = EASE(interpolate(now, [0, 0.6], [0, 1], clamp));

  // Meter: level berubah dari tb.level[0] ke tb.level[1] mulai `at` selama `sec`.
  const at = tb.at ?? 0.3;
  const sec = tb.sec ?? 1.5;
  const p = EASE(interpolate(now, [at, at + sec], [0, 1], clamp));
  const level = tb.level[0] + (tb.level[1] - tb.level[0]) * p;
  const low = level < 0.25;
  const pulse = tb.blink ? 0.7 + 0.3 * Math.sin(now * 5) : 1;
  const fillColor = low ? danger : "#FFFFFF";
  const fillAlpha = low ? 0.4 : 0.22;
  const pct = Math.round(level * 100);

  // Kode: mengalir ke atas; membeku di `freezeAt` (detik) bila ada, atau sejak awal bila mode "beku".
  const code = tb.code ?? "mengalir";
  const freezeAt = code === "beku" ? 0 : tb.freezeAt;
  const flowT = freezeAt === undefined ? now : Math.min(now, freezeAt);
  const rowsScrolled = flowT * SCROLL_ROWS_PER_SEC;
  const base = Math.floor(rowsScrolled);
  const frac = rowsScrolled - base;
  const frozen = freezeAt !== undefined && now >= freezeAt;
  const msgIn = frozen ? EASE(interpolate(now, [freezeAt ?? 0, (freezeAt ?? 0) + 0.5], [0, 1], clamp)) : 0;
  const rows = Array.from({ length: CODE.rows + 1 }, (_, i) => i);
  const washBox = layout.wash;
  const MSG_ROW = 6;

  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: W, height: 1920, pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          ...(washBox ? { left: washBox.x, top: washBox.y, width: washBox.w, height: washBox.h, borderRadius: layout.radius ?? 0 } : { inset: 0 }),
          background: wash(tb.mood, t.colors.primary, t.colors.primaryDeep, danger),
          opacity: moodIn,
        }}
      />

      <div style={{ position: "absolute", left: METER.x, top: METER.y - 46, fontFamily: t.fonts.body, fontWeight: 600, fontSize: 28, letterSpacing: 2, color: "rgba(255,255,255,0.30)", opacity: pulse }}>
        TOKEN {pct}%
      </div>
      <div
        style={{
          position: "absolute",
          left: METER.x,
          top: METER.y,
          width: METER.w,
          height: METER.h,
          borderRadius: METER.h / 2,
          background: "rgba(255,255,255,0.08)",
          border: "3px solid rgba(255,255,255,0.16)",
          boxSizing: "border-box",
          overflow: "hidden",
          opacity: pulse,
        }}
      >
        <div style={{ width: `${level * 100}%`, height: "100%", borderRadius: METER.h / 2, background: fillColor, opacity: fillAlpha }} />
      </div>
      {tb.label ? (
        <div style={{ position: "absolute", left: METER.x, top: METER.y + METER.h + 18, fontFamily: t.fonts.body, fontWeight: 500, fontSize: 26, color: "rgba(255,255,255,0.30)" }}>{tb.label}</div>
      ) : null}

      <div
        style={{
          position: "absolute",
          left: CODE.x,
          top: CODE.top,
          width: CODE.w,
          height: CODE.rows * CODE.pitch,
          overflow: "hidden",
          WebkitMaskImage: "linear-gradient(transparent, #000 22%, #000 78%, transparent)",
          maskImage: "linear-gradient(transparent, #000 22%, #000 78%, transparent)",
        }}
      >
        {rows.map((i) => {
          const idx = base + i;
          const y = (i - frac) * CODE.pitch;
          const isMsg = frozen && i === MSG_ROW;
          return (
            <div key={i} style={{ position: "absolute", left: 0, top: y, width: "100%", height: CODE.h }}>
              {isMsg ? (
                <div style={{ fontFamily: t.fonts.mono, fontSize: 24, lineHeight: `${CODE.h}px`, whiteSpace: "nowrap", color: danger, opacity: 0.45 * msgIn }}>rate limit exceeded</div>
              ) : (
                <div
                  style={{
                    width: `${rowWidth(idx) * 100}%`,
                    height: CODE.h,
                    borderRadius: CODE.h / 2,
                    marginLeft: (idx % 3) * 36,
                    background: "#FFFFFF",
                    opacity: frozen ? 0.05 : 0.09,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
