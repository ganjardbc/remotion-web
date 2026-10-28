import type React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { MONO, SCREEN } from "./colors";

// Satu baris terminal. `cmd` diketik (huruf demi huruf) setelah prompt; jenis lain muncul sekaligus pada `at`.
export type TermLine = {
  // Detik (waktu lokal komponen) saat baris mulai muncul.
  readonly at: number;
  readonly text: string;
  readonly kind?: "cmd" | "out" | "ok" | "dim" | "error";
  // Huruf per detik untuk `cmd`.
  readonly speed?: number;
};

const COLOR: Record<NonNullable<TermLine["kind"]>, string> = {
  cmd: SCREEN.text,
  out: SCREEN.text,
  ok: SCREEN.vueGreen,
  dim: SCREEN.dim,
  error: SCREEN.error,
};

// Terminal dengan bilah judul. Memenuhi induknya; `fontSize` mengatur keterbacaan saat di-zoom.
export const Terminal: React.FC<{ readonly lines: readonly TermLine[]; readonly title?: string; readonly fontSize?: number }> = ({
  lines,
  title = "terminal",
  fontSize = 34,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const visible = lines
    .filter((l) => t >= l.at)
    .map((l) => {
      const kind = l.kind ?? "out";
      if (kind !== "cmd") return { ...l, kind, shown: l.text, typing: false };
      const n = Math.min(l.text.length, Math.floor((t - l.at) * (l.speed ?? 22)));
      return { ...l, kind, shown: l.text.slice(0, n), typing: n < l.text.length };
    });
  const last = visible[visible.length - 1];
  // Kursor berkedip di akhir baris cmd terakhir yang sedang diketik, atau di prompt kosong setelah semua selesai.
  const blink = Math.floor(frame / 15) % 2 === 0;
  return (
    <div style={{ width: "100%", height: "100%", background: SCREEN.bg, fontFamily: MONO, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ height: fontSize * 1.5, background: SCREEN.bar, display: "flex", alignItems: "center", gap: 10, padding: `0 ${fontSize * 0.5}px`, flexShrink: 0 }}>
        {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
          <div key={c} style={{ width: fontSize * 0.42, height: fontSize * 0.42, borderRadius: "50%", background: c }} />
        ))}
        <div style={{ marginLeft: 14, color: SCREEN.dim, fontSize: fontSize * 0.62 }}>{title}</div>
      </div>
      <div style={{ padding: fontSize * 0.7, fontSize, lineHeight: 1.5, color: SCREEN.text, whiteSpace: "pre" }}>
        {visible.map((l, i) => (
          <div key={i} style={{ color: COLOR[l.kind] }}>
            {l.kind === "cmd" && <span style={{ color: SCREEN.vueGreen }}>$ </span>}
            {l.shown}
            {last === l && l.kind === "cmd" && (l.typing || blink) && <span style={{ background: SCREEN.text, color: SCREEN.bg, opacity: l.typing ? 1 : blink ? 1 : 0 }}> </span>}
          </div>
        ))}
        {last && last.kind !== "cmd" && blink && (
          <div>
            <span style={{ color: SCREEN.vueGreen }}>$ </span>
            <span style={{ background: SCREEN.text }}> </span>
          </div>
        )}
      </div>
    </div>
  );
};
