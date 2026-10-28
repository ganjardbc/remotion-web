import type React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { BrowserMock, MONO, SCREEN } from "../../assets/screens";
import type { Line } from "./world";

const FONT = "system-ui, -apple-system, 'Segoe UI', sans-serif";
export const GANJAR_COLOR = "#2f7cf6";
export const ROBOT_COLOR = "#f6932a";
const NAMES: Record<Line["who"], string> = { ganjar: "Ganjar", robot: "Claude" };

// Kartu butir: judul dan daftar yang muncul satu per satu pada detik `at` (waktu lokal). `check` = tanda centang.
export const InfoCard: React.FC<{ readonly title: string; readonly items: readonly { readonly text: string; readonly at: number }[]; readonly check?: boolean; readonly fontSize?: number }> = ({
  title,
  items,
  check,
  fontSize = 44,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  return (
    <div style={{ width: "100%", height: "100%", background: `linear-gradient(160deg, ${SCREEN.vueDark}, #1f2f3f)`, padding: fontSize * 1.2, boxSizing: "border-box", fontFamily: FONT, color: "#fff" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: fontSize * 0.9 }}>
        <svg width={fontSize * 1.4} height={fontSize * 1.2} viewBox="0 0 100 87">
          <path d="M0 0 L20 0 L50 52 L80 0 L100 0 L50 87 Z" fill={SCREEN.vueGreen} />
          <path d="M20 0 L40 0 L50 17 L60 0 L80 0 L50 52 Z" fill="#fff" />
        </svg>
        <div style={{ fontSize: fontSize * 1.25, fontWeight: 800 }}>{title}</div>
      </div>
      {items.map((it) => {
        const k = interpolate(t - it.at, [0, 0.3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <div key={it.text} style={{ display: "flex", alignItems: "center", gap: 20, fontSize, lineHeight: 1.3, marginBottom: fontSize * 0.55, opacity: k, transform: `translateX(${(1 - k) * 40}px)` }}>
            <div style={{ width: fontSize * 0.85, height: fontSize * 0.85, borderRadius: check ? fontSize * 0.2 : "50%", background: SCREEN.vueGreen, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: fontSize * 0.6, fontWeight: 800, flexShrink: 0 }}>
              {check ? "✓" : ""}
            </div>
            {it.text}
          </div>
        );
      })}
    </div>
  );
};

// Kartu judul penuh layar (penutup).
export const TitleCard: React.FC<{ readonly title: string; readonly subtitle: string }> = ({ title, subtitle }) => (
  <div style={{ width: "100%", height: "100%", background: `linear-gradient(160deg, ${SCREEN.vueDark}, #14202c)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 28, fontFamily: FONT, color: "#fff" }}>
    <svg width={190} height={165} viewBox="0 0 100 87">
      <path d="M0 0 L20 0 L50 52 L80 0 L100 0 L50 87 Z" fill={SCREEN.vueGreen} />
      <path d="M20 0 L40 0 L50 17 L60 0 L80 0 L50 52 Z" fill="#fff" />
    </svg>
    <div style={{ fontSize: 96, fontWeight: 800 }}>{title}</div>
    <div style={{ fontSize: 44, color: "#bcd" }}>{subtitle}</div>
  </div>
);

// Halaman browser dengan lapisan galat merah ala Vite (untuk adegan error).
export const ErrorPage: React.FC<{ readonly message: string; readonly detail: string }> = ({ message, detail }) => (
  <BrowserMock fontSize={30}>
    <div style={{ position: "absolute", inset: 0, background: "rgba(20,10,14,0.92)", padding: 60, boxSizing: "border-box", fontFamily: MONO, color: "#ffd9de" }}>
      <div style={{ fontSize: 44, fontWeight: 800, color: SCREEN.error, marginBottom: 24 }}>[plugin:vite:vue] Terjadi galat</div>
      <div style={{ fontSize: 38, marginBottom: 28 }}>{message}</div>
      <div style={{ fontSize: 30, color: "#b98a92", whiteSpace: "pre" }}>{detail}</div>
    </div>
  </BrowserMock>
);

// Keterangan dialog di bawah layar: nama pembicara berwarna dan teks.
export const Caption: React.FC<{ readonly line: Line | null }> = ({ line }) => {
  if (!line) return null;
  const color = line.who === "ganjar" ? GANJAR_COLOR : ROBOT_COLOR;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 44, display: "flex", justifyContent: "center", fontFamily: FONT }}>
      <div style={{ maxWidth: 1500, display: "flex", alignItems: "center", gap: 20, background: "rgba(15,16,32,0.82)", padding: "16px 30px", borderRadius: 18 }}>
        <div style={{ background: color, color: "#fff", fontWeight: 800, fontSize: 30, padding: "4px 16px", borderRadius: 10, flexShrink: 0 }}>{NAMES[line.who]}</div>
        <div style={{ color: "#fff", fontSize: 40, fontWeight: 600, lineHeight: 1.25 }}>{line.text}</div>
      </div>
    </div>
  );
};

// Penanda bab di pojok kiri atas pada awal scene.
export const ChapterBadge: React.FC<{ readonly index: number; readonly title: string }> = ({ index, title }) => {
  const frame = useCurrentFrame();
  const k = interpolate(frame, [0, 10, 62, 74], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: 40, top: 36, opacity: k, transform: `translateX(${(1 - k) * -30}px)`, fontFamily: FONT, display: "flex", alignItems: "center", gap: 14 }}>
      <div style={{ width: 62, height: 62, borderRadius: 16, background: SCREEN.vueGreen, color: "#fff", fontWeight: 800, fontSize: 36, display: "flex", alignItems: "center", justifyContent: "center" }}>{index}</div>
      <div style={{ background: "rgba(15,16,32,0.82)", color: "#fff", fontWeight: 700, fontSize: 36, padding: "10px 22px", borderRadius: 14 }}>{title}</div>
    </div>
  );
};

// Halaman contoh untuk komponen dengan props: satu komponen tombol dipakai tiga kali dengan label berbeda,
// muncul satu per satu pada detik `at` (waktu lokal).
export const ButtonsApp: React.FC<{ readonly labels: readonly { readonly text: string; readonly at: number }[]; readonly scale?: number }> = ({ labels, scale = 1 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const colors = [SCREEN.vueGreen, "#3d7bf0", "#e5484d"];
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 26 * scale, background: "#f6f8fb", fontFamily: FONT }}>
      <div style={{ fontSize: 52 * scale, fontWeight: 800, color: SCREEN.vueDark }}>CounterButton</div>
      <div style={{ display: "flex", gap: 22 * scale }}>
        {labels.map((l, i) => {
          const k = interpolate(t - l.at, [0, 0.25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <div key={l.text} style={{ fontSize: 40 * scale, fontWeight: 700, color: "#fff", background: colors[i % colors.length], padding: `${14 * scale}px ${34 * scale}px`, borderRadius: 14 * scale, opacity: k, transform: `scale(${0.7 + 0.3 * k})` }}>
              {l.text}
            </div>
          );
        })}
      </div>
    </div>
  );
};
