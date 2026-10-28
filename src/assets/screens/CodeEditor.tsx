import type React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { MONO, SCREEN } from "./colors";

// Pewarna sintaks ringan untuk Vue (template, script setup, style): cukup untuk contoh, bukan parser sungguhan.
const TOKEN =
  /(<!--.*?-->|\/\/.*)|(<\/?[A-Za-z][\w-]*|\/?>)|((?:[:@]|v-)[\w.-]+|[\w-]+(?==))|('[^']*'|"[^"]*"|`[^`]*`)|(\{\{|\}\})|(\b(?:import|from|const|let|export|default|return|function|new)\b)|(\b(?:ref|computed|reactive|defineProps|onMounted|createApp|defineEmits)\b)|(\b\d+\b)/g;
const GROUP_COLOR = [SCREEN.comment, SCREEN.tag, SCREEN.attr, SCREEN.string, SCREEN.vueGreen, SCREEN.keyword, SCREEN.fn, SCREEN.number] as const;

const highlightLine = (line: string): React.ReactNode[] => {
  const out: React.ReactNode[] = [];
  let last = 0;
  for (const m of line.matchAll(TOKEN)) {
    const at = m.index ?? 0;
    if (at > last) out.push(line.slice(last, at));
    const g = m.slice(1).findIndex((x) => x !== undefined);
    out.push(
      <span key={at} style={{ color: GROUP_COLOR[g] }}>
        {m[0]}
      </span>,
    );
    last = at + m[0].length;
  }
  if (last < line.length) out.push(line.slice(last));
  return out;
};

// Sorotan baris (1-based, dari `from` sampai `to`) yang muncul pada detik `at`.
export type LineHighlight = { readonly from: number; readonly to: number; readonly at: number; readonly until?: number };

// Editor kode dengan tab file dan nomor baris. `typeCps` mengetik kode huruf demi huruf (huruf per detik); tanpa itu semua tampil.
export const CodeEditor: React.FC<{
  readonly code: string;
  readonly file?: string;
  readonly fontSize?: number;
  readonly typeCps?: number;
  readonly typeStart?: number;
  readonly highlights?: readonly LineHighlight[];
}> = ({ code, file = "App.vue", fontSize = 34, typeCps, typeStart = 0, highlights = [] }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const shown = typeCps === undefined ? code : code.slice(0, Math.max(0, Math.floor((t - typeStart) * typeCps)));
  const lines = shown.split("\n");
  // Kursor di ujung teks: tetap menyala selama mengetik, berkedip setelah selesai (hanya bila editor mengetik).
  const caretOn = typeCps !== undefined && (shown.length < code.length || Math.floor(frame / 15) % 2 === 0);
  const lh = fontSize * 1.55;
  return (
    <div style={{ width: "100%", height: "100%", background: SCREEN.bg, fontFamily: MONO, overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ height: fontSize * 1.5, background: SCREEN.bar, display: "flex", alignItems: "flex-end", flexShrink: 0 }}>
        <div style={{ padding: `0 ${fontSize * 0.8}px`, height: "78%", display: "flex", alignItems: "center", background: SCREEN.bg, borderTop: `3px solid ${SCREEN.vueGreen}`, color: SCREEN.text, fontSize: fontSize * 0.62 }}>
          {file}
        </div>
      </div>
      <div style={{ position: "relative", flex: 1, padding: `${fontSize * 0.5}px 0` }}>
        {highlights.map((h) => {
          const on = t >= h.at && (h.until === undefined || t < h.until);
          return (
            <div
              key={`${h.from}-${h.at}`}
              style={{ position: "absolute", left: 0, right: 0, top: fontSize * 0.5 + (h.from - 1) * lh, height: (h.to - h.from + 1) * lh, background: SCREEN.highlight, borderLeft: `6px solid ${SCREEN.vueGreen}`, opacity: on ? 1 : 0 }}
            />
          );
        })}
        {lines.map((l, i) => (
          <div key={i} style={{ position: "relative", display: "flex", height: lh, fontSize, lineHeight: `${lh}px`, whiteSpace: "pre" }}>
            <div style={{ width: fontSize * 2.4, textAlign: "right", paddingRight: fontSize * 0.7, color: SCREEN.line, flexShrink: 0 }}>{i + 1}</div>
            <div style={{ color: SCREEN.text }}>
              {highlightLine(l)}
              {typeCps !== undefined && i === lines.length - 1 && <span style={{ background: SCREEN.text, opacity: caretOn ? 0.9 : 0 }}> </span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
