import type React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { useTheme } from "../themes";
import type { CharacterId, DraftLine } from "./types";

// Caption karaoke satu baris dengan penanda pembicara. Dipakai Reels dialog (DraftVideo, di bawah lantai) dan Reels block
// (src/block-reels, di atas karakter); yang beda hanya kotak posisi (`box`) dan `onLight`.

const EASE = Easing.bezier(0.2, 0.8, 0.2, 1);

export type CaptionLine = Pick<DraftLine, "who" | "from" | "dur" | "text" | "wordTimes">;

// Waktu mulai tiap kata (detik sejak baris mulai). Dari `wordTimes` bila lengkap, bila tidak diperkirakan dari panjang huruf
// dengan jeda kecil setelah tanda baca.
const wordStarts = (line: CaptionLine, words: readonly string[]): readonly number[] => {
  if (line.wordTimes && line.wordTimes.length === words.length) return line.wordTimes;
  const weights = words.map((w) => w.length + 1 + (/[.?!]$/.test(w) ? 3 : /[,:;]$/.test(w) ? 1.5 : 0));
  const total = weights.reduce((a, b) => a + b, 0);
  const span = line.dur * 0.92;
  let acc = 0;
  return weights.map((w) => {
    const at = (acc / total) * span;
    acc += w;
    return at;
  });
};

// Mode `baris`: ucapan dipecah jadi baris pendek yang tampil satu per satu (maks `ROW_MAX` huruf per baris). Pecah di tanda baca
// (koma, titik dua, titik, tanda tanya, seru), klausa pendek yang bersebelahan digabung selama muat, klausa yang terlalu panjang
// dibagi rata menurut kata (tidak digabung lagi dengan klausa lain). Tiap baris tampil dari kata pertamanya diucapkan sampai baris berikutnya mulai.
const ROW_MAX = 31;
type Row = { readonly text: string; readonly first: number; readonly count: number };

const splitRows = (words: readonly string[]): readonly Row[] => {
  // Klausa: kelompok kata yang berakhir di tanda baca.
  const clauses: { words: string[]; first: number }[] = [];
  words.forEach((w, i) => {
    if (!clauses.length || /[,:;.?!]$/.test(words[i - 1] ?? "")) clauses.push({ words: [], first: i });
    clauses[clauses.length - 1].words.push(w);
  });
  // Klausa yang terlalu panjang dibagi rata menurut kata.
  const parts: { words: string[]; first: number; hard: boolean; split: boolean }[] = [];
  for (const c of clauses) {
    const len = c.words.join(" ").length;
    const n = Math.ceil(len / ROW_MAX);
    const hard = /[.?!]$/.test(c.words[c.words.length - 1]);
    if (n <= 1) {
      parts.push({ ...c, hard, split: false });
      continue;
    }
    // Bagi jadi n baris dengan selisih panjang sekecil mungkin (jumlah kuadrat panjang minimum), supaya tidak ada kata yatim.
    const w = c.words;
    const seg = (a: number, b: number): number => w.slice(a, b).join(" ").length;
    const best: number[][] = Array.from({ length: n + 1 }, () => Array<number>(w.length + 1).fill(Infinity));
    const cut: number[][] = Array.from({ length: n + 1 }, () => Array<number>(w.length + 1).fill(0));
    best[0][0] = 0;
    for (let k = 1; k <= n; k++)
      for (let e = k; e <= w.length; e++)
        for (let b = k - 1; b < e; b++) {
          const cost = best[k - 1][b] + seg(b, e) ** 2;
          if (cost < best[k][e]) {
            best[k][e] = cost;
            cut[k][e] = b;
          }
        }
    const bounds: number[] = [];
    for (let k = n, e = w.length; k > 0; e = cut[k][e], k--) bounds.unshift(e);
    let from = 0;
    bounds.forEach((e, k) => {
      parts.push({ words: w.slice(from, e), first: c.first + from, hard: k === bounds.length - 1 && hard, split: true });
      from = e;
    });
  }
  // Gabung bagian pendek yang bersebelahan selama muat, tanpa melintasi akhir kalimat.
  const rows: { words: string[]; first: number }[] = [];
  let prevHard = true;
  let prevSplit = false;
  for (const part of parts) {
    const prev = rows[rows.length - 1];
    if (prev && !prevHard && !prevSplit && !part.split && prev.words.join(" ").length + 1 + part.words.join(" ").length <= ROW_MAX) prev.words.push(...part.words);
    else rows.push({ words: [...part.words], first: part.first });
    prevHard = part.hard;
    prevSplit = part.split;
  }
  return rows.map((r) => ({ text: r.words.join(" "), first: r.first, count: r.words.length }));
};

const SPEAKER: Readonly<Record<CharacterId, { readonly name: string; readonly fill: "primary" | "surface" }>> = {
  ganjar: { name: "Ganjar", fill: "primary" },
  robot: { name: "Robot", fill: "surface" },
  claudecode: { name: "Claude Code", fill: "surface" },
};

// Subtitle berbentuk caption: satu baris yang sedang diucapkan, rata tengah (horizontal dan vertikal) di area bawah lantai.
// Mode karaoke: kata yang sedang diucapkan putih penuh, yang sudah lewat agak redup, yang belum redup; penanda pembicara
// (titik berwarna per karakter dan nama kecil) di atas teks.
export const LineCaption: React.FC<{
  readonly lines: readonly CaptionLine[];
  readonly motion: "karaoke" | "baris" | "none";
  // Latar terang: teks gelap tanpa bayangan.
  readonly onLight?: boolean;
  // Kotak (px dari tepi atas dan bawah kanvas 1920) tempat teks diratakan tengah.
  readonly box: { readonly top: number; readonly bottom: number };
}> = ({ lines, motion, onLight = false, box }) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const now = frame / fps;
  const line = lines.find((l) => now >= l.from && now < l.from + l.dur);
  if (!line) return null;
  const local = now - line.from;
  const clampOpts = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  const opacity = EASE(interpolate(local, [0, 0.2], [0, 1], clampOpts)) * interpolate(local, [line.dur - 0.15, line.dur], [1, 0], clampOpts);
  const words = line.text.split(" ");
  const starts = wordStarts(line, words);
  const karaoke = motion === "karaoke" || motion === "baris";
  const baris = motion === "baris";
  // Mode baris: hanya baris yang sedang diucapkan yang tampil.
  const rows = baris ? splitRows(words) : [];
  const rowIdx = baris ? rows.reduce((acc, r, k) => (local >= starts[r.first] ? k : acc), 0) : 0;
  const sp = SPEAKER[line.who];
  const white = onLight ? t.colors.ink : (t.colors.groundText ?? t.colors.onPrimary);
  return (
    <div
      style={{
        position: "absolute",
        left: 80,
        right: 80,
        top: box.top,
        bottom: box.bottom,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 18,
        opacity,
      }}
    >
      {karaoke || baris ? (
        <div style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: t.fonts.body, fontWeight: 600, fontSize: 28, color: onLight ? t.colors.muted : t.colors.groundTextMuted }}>
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: 11,
              backgroundColor: sp.fill === "primary" ? t.colors.primary : t.colors.surface,
              border: `3px solid ${sp.fill === "primary" ? t.colors.primarySoft : t.colors.primary}`,
            }}
          />
          {sp.name}
        </div>
      ) : null}
      <div
        style={{
          textAlign: "center",
          textWrap: "balance",
          whiteSpace: baris ? "nowrap" : undefined,
          fontFamily: t.fonts.body,
          fontWeight: 700,
          fontSize: 54,
          lineHeight: 1.3,
          color: white,
          textShadow: onLight ? "none" : "0 2px 12px rgba(0, 0, 0, 0.55)",
        }}
      >
        {words.map((w, i) => {
          // Mode baris: hanya kata di baris yang sedang diucapkan yang dirender.
          if (baris && (i < rows[rowIdx].first || i >= rows[rowIdx].first + rows[rowIdx].count)) return null;
          // 0 = belum, 1 = sedang/aktif; berpindah halus selama 0,12 detik. Kata yang sudah lewat turun ke 0,75.
          const on = karaoke ? EASE(interpolate(local, [starts[i], starts[i] + 0.12], [0, 1], clampOpts)) : 1;
          const last = i + 1 >= words.length;
          const past = karaoke && !last ? EASE(interpolate(local, [starts[i + 1], starts[i + 1] + 0.12], [0, 1], clampOpts)) : 0;
          const o = karaoke ? 0.35 + 0.65 * on - 0.25 * past : 1;
          return (
            <span key={i} style={{ opacity: o }}>
              {w}
              {i < words.length - 1 ? " " : ""}
            </span>
          );
        })}
      </div>
    </div>
  );
};
