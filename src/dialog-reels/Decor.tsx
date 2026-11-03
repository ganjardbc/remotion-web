import type React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { useTheme } from "../themes";
import type { DraftDecor } from "./types";

// Dekorasi dinding Reels dialog: mengisi ruang kosong di antara kartu atas dan karakter. Gerak ease-out [0.2, 0.8, 0.2, 1],
// tanpa bounce, spring, atau shake; melayang = gelombang sinus pelan (bukan goyang). Tanpa oranye (oranye hanya untuk satu sorotan).

const EASE = Easing.bezier(0.2, 0.8, 0.2, 1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const prog = (now: number, a: number, b: number): number => EASE(interpolate(now, [a, b], [0, 1], clamp));

type Theme = ReturnType<typeof useTheme>;

// Jendela aplikasi kecil: bilah judul, kartu statistik, daftar, dan tombol; menyala bertahap.
const LaptopApp: React.FC<{ readonly t: Theme; readonly now: number }> = ({ t, now }) => {
  const p = prog(now, 0, 0.5);
  const rows = [0.45, 0.65, 0.85];
  return (
    <div style={{ position: "absolute", left: 230, top: 330, width: 420, height: 290, opacity: p, transform: `translateY(${(1 - p) * 30}px) scale(${0.94 + 0.06 * p})`, transformOrigin: "50% 100%" }}>
      <div style={{ position: "absolute", inset: "0 0 26px 0", borderRadius: 18, backgroundColor: t.colors.surface, border: `6px solid ${t.colors.primaryDeep}`, boxShadow: t.shadows.lift, overflow: "hidden", boxSizing: "border-box" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", backgroundColor: t.colors.primaryTint }}>
          {[t.colors.danger, t.colors.primarySoft, t.colors.success].map((c) => (
            <div key={c} style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: c }} />
          ))}
          <div style={{ marginLeft: 8, fontFamily: t.fonts.body, fontWeight: 700, fontSize: 18, color: t.colors.primaryInk }}>Kasir Kopi</div>
        </div>
        <div style={{ padding: "14px 18px", fontFamily: t.fonts.body, color: t.colors.ink }}>
          <div style={{ display: "flex", gap: 12, opacity: prog(now, 0.3, 0.7) }}>
            <div style={{ flex: 1, padding: "8px 12px", borderRadius: 10, backgroundColor: t.colors.primary, color: t.colors.onPrimary }}>
              <div style={{ fontSize: 13, fontWeight: 500 }}>Hari ini</div>
              <div style={{ fontSize: 26, fontWeight: 800 }}>Rp 1,2 jt</div>
            </div>
            <div style={{ flex: 1, padding: "8px 12px", borderRadius: 10, backgroundColor: t.colors.primaryTint }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: t.colors.muted }}>Pesanan</div>
              <div style={{ fontSize: 26, fontWeight: 800 }}>48</div>
            </div>
          </div>
          {["Kopi susu", "Roti bakar", "Teh manis"].map((x, i) => {
            const r = prog(now, rows[i], rows[i] + 0.3);
            return (
              <div key={x} style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 18, fontWeight: 600, opacity: r, transform: `translateX(${(1 - r) * -14}px)` }}>
                <span>{x}</span>
                <span style={{ color: t.colors.success }}>✓</span>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ position: "absolute", left: -14, right: -14, bottom: 0, height: 26, borderRadius: "0 0 18px 18px", backgroundColor: t.colors.primaryDeep, boxShadow: t.shadows.md }} />
    </div>
  );
};

const CHIPS: readonly { readonly label: string; readonly x: number; readonly y: number; readonly phase: number; readonly bg: "primary" | "surface" | "tint" }[] = [
  { label: "</>", x: 90, y: 360, phase: 0, bg: "primary" },
  { label: "Kelas", x: 720, y: 335, phase: 1.6, bg: "surface" },
  { label: "App", x: 760, y: 425, phase: 3.1, bg: "tint" },
];

// Chip kecil yang muncul berurutan lalu melayang naik turun ±6 px.
const ChipMengambang: React.FC<{ readonly t: Theme; readonly now: number }> = ({ t, now }) => (
  <>
    {CHIPS.map((c, i) => {
      const p = prog(now, i * 0.25, i * 0.25 + 0.4);
      const dy = Math.sin(now * 1.6 + c.phase) * 6;
      const bg = c.bg === "primary" ? t.colors.primary : c.bg === "surface" ? t.colors.surface : t.colors.primaryTint;
      const fg = c.bg === "primary" ? t.colors.onPrimary : t.colors.primaryInk;
      return (
        <div
          key={c.label}
          style={{
            position: "absolute",
            left: c.x,
            top: c.y + dy,
            padding: "10px 26px",
            borderRadius: 999,
            backgroundColor: bg,
            color: fg,
            border: c.bg === "primary" ? "none" : `2px solid ${t.colors.border}`,
            boxShadow: t.shadows.md,
            fontFamily: c.label === "</>" ? t.fonts.mono : t.fonts.body,
            fontWeight: 800,
            fontSize: 34,
            opacity: p,
            transform: `scale(${0.85 + 0.15 * p})`,
          }}
        >
          {c.label}
        </div>
      );
    })}
  </>
);

export const Decor: React.FC<{ readonly decor: readonly DraftDecor[] }> = ({ decor }) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const now = frame / fps;
  return (
    <>
      {decor.map((d, i) => {
        const local = now - d.at;
        if (local < 0) return null;
        return d.kind === "laptopApp" ? <LaptopApp key={i} t={t} now={local} /> : <ChipMengambang key={i} t={t} now={local} />;
      })}
    </>
  );
};
