import type React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { MONO, SCREEN } from "./colors";

export type TreeNode = {
  readonly name: string;
  readonly depth: number;
  readonly kind: "dir" | "file";
  // Detik saat baris muncul (waktu lokal).
  readonly at: number;
  // Detik saat baris disorot (opsional) dan sampai kapan.
  readonly highlightAt?: number;
  readonly highlightUntil?: number;
};

const Icon: React.FC<{ readonly kind: TreeNode["kind"]; readonly size: number }> = ({ kind, size }) =>
  kind === "dir" ? (
    <div style={{ width: size, height: size * 0.75, background: "#f6b73c", borderRadius: size * 0.12, flexShrink: 0 }} />
  ) : (
    <div style={{ width: size * 0.72, height: size, border: `${Math.max(2, size * 0.1)}px solid ${SCREEN.attr}`, borderRadius: size * 0.1, flexShrink: 0, boxSizing: "border-box" }} />
  );

// Pohon berkas proyek: baris muncul bergantian, dan baris tertentu bisa disorot (untuk ditunjuk karakter).
export const FileTree: React.FC<{ readonly nodes: readonly TreeNode[]; readonly fontSize?: number; readonly title?: string }> = ({
  nodes,
  fontSize = 36,
  title = "my-vue-app",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const rowH = fontSize * 1.6;
  return (
    <div style={{ width: "100%", height: "100%", background: SCREEN.bg, fontFamily: MONO, overflow: "hidden" }}>
      <div style={{ height: fontSize * 1.5, background: SCREEN.bar, display: "flex", alignItems: "center", padding: `0 ${fontSize * 0.7}px`, color: SCREEN.dim, fontSize: fontSize * 0.62, letterSpacing: 2, textTransform: "uppercase" }}>
        explorer
      </div>
      <div style={{ padding: `${fontSize * 0.5}px 0` }}>
        <div style={{ height: rowH, display: "flex", alignItems: "center", padding: `0 ${fontSize * 0.7}px`, color: SCREEN.text, fontSize, fontWeight: 700 }}>{title}</div>
        {nodes.map((n) => {
          const shown = t >= n.at;
          const hot = n.highlightAt !== undefined && t >= n.highlightAt && (n.highlightUntil === undefined || t < n.highlightUntil);
          return (
            <div
              key={`${n.depth}-${n.name}`}
              style={{
                height: rowH,
                display: "flex",
                alignItems: "center",
                gap: fontSize * 0.45,
                paddingLeft: fontSize * 0.7 + n.depth * fontSize * 1.1,
                fontSize,
                color: n.kind === "dir" ? SCREEN.text : "#aab1d3",
                background: hot ? SCREEN.highlight : "transparent",
                borderLeft: `6px solid ${hot ? SCREEN.vueGreen : "transparent"}`,
                opacity: shown ? 1 : 0,
                transform: `translateX(${shown ? 0 : -24}px)`,
              }}
            >
              <Icon kind={n.kind} size={fontSize * 0.7} />
              {n.name}
            </div>
          );
        })}
      </div>
    </div>
  );
};
