import type React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { MONO, SCREEN } from "./colors";

// Jendela browser tiruan: bilah alamat dan area isi. `url` ditampilkan apa adanya; `fontSize` mengatur ukuran chrome.
export const BrowserMock: React.FC<{ readonly url?: string; readonly fontSize?: number; readonly children: React.ReactNode }> = ({
  url = "localhost:5173",
  fontSize = 30,
  children,
}) => (
  <div style={{ width: "100%", height: "100%", background: "#ffffff", display: "flex", flexDirection: "column", overflow: "hidden", fontFamily: "system-ui, sans-serif" }}>
    <div style={{ height: fontSize * 2.1, background: "#e9ebf2", display: "flex", alignItems: "center", gap: 12, padding: `0 ${fontSize * 0.6}px`, flexShrink: 0 }}>
      {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
        <div key={c} style={{ width: fontSize * 0.42, height: fontSize * 0.42, borderRadius: "50%", background: c }} />
      ))}
      <div style={{ marginLeft: 12, flex: 1, height: fontSize * 1.3, borderRadius: fontSize, background: "#ffffff", display: "flex", alignItems: "center", padding: `0 ${fontSize * 0.7}px`, color: "#5b6080", fontSize: fontSize * 0.72, fontFamily: MONO }}>
        {url}
      </div>
    </div>
    <div style={{ flex: 1, position: "relative" }}>{children}</div>
  </div>
);

const Logo: React.FC<{ readonly size: number }> = ({ size }) => (
  <svg width={size} height={size * 0.87} viewBox="0 0 100 87">
    <path d="M0 0 L20 0 L50 52 L80 0 L100 0 L50 87 Z" fill={SCREEN.vueGreen} />
    <path d="M20 0 L40 0 L50 17 L60 0 L80 0 L50 52 Z" fill={SCREEN.vueDark} />
  </svg>
);

// Halaman contoh "Hello Vue" dengan tombol penghitung. `clicks` = detik (waktu lokal) saat tombol ditekan;
// hitungan naik tiap klik dan tombol sedikit menciut saat ditekan.
export const CounterApp: React.FC<{ readonly clicks?: readonly number[]; readonly scale?: number }> = ({ clicks = [], scale = 1 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const count = clicks.filter((c) => t >= c).length;
  const sinceClick = clicks.reduce((m, c) => (t >= c ? Math.min(m, t - c) : m), 99);
  const press = interpolate(sinceClick, [0, 0.08, 0.2], [0.93, 0.93, 1], { extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 28 * scale, background: "#f6f8fb" }}>
      <Logo size={150 * scale} />
      <div style={{ fontSize: 64 * scale, fontWeight: 800, color: SCREEN.vueDark }}>Hello Vue!</div>
      <div
        style={{
          fontSize: 40 * scale,
          fontWeight: 700,
          color: "#fff",
          background: SCREEN.vueGreen,
          padding: `${16 * scale}px ${42 * scale}px`,
          borderRadius: 14 * scale,
          transform: `scale(${press})`,
          boxShadow: `0 ${6 * scale}px ${0}px #2f8f66`,
        }}
      >
        count is {count}
      </div>
    </div>
  );
};
