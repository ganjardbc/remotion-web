import type React from "react";
import { Easing, interpolate, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { Enter } from "../motion";
import { useTheme } from "../themes";
import { screenSegments, withHighlight } from "./screenText";
import type { DraftScene } from "./types";

// Papan tulis latar kelas: di belakang karakter, berisi teks layar scene (`onScreenText` dan `screenText` per baris),
// satu kalimat per layar, dengan sorotan `*frasa*`. Teks biasa gelap di papan putih; sorotan oranye gelap (kontras >= 4,5:1).

const EASE = Easing.bezier(0.2, 0.8, 0.2, 1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Teks papan dengan lebih dari satu baris (dipisah `\n`) tampil sebagai daftar: baris pertama = judul, baris yang diawali `>`
// = kutipan di bawah, baris lainnya = butir dengan centang yang muncul bergantian. Teks satu baris tampil di tengah papan.
// Baris `$murid|teks` dan `$ganjar|teks` = bubble percakapan di papan (murid di kanan, Ganjar di kiri biru); satu dengan `@detik`
// di akhir (mis. `$ganjar|Coba Tanya Claude@4.2`) muncul pada detik itu sejak segmen mulai, bila tidak, bergantian tiap 1,2 dtk.
const BoardChat: React.FC<{ readonly lines: readonly string[] }> = ({ lines }) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const now = frame / fps;
  const [title, ...rest] = lines;
  const bubbles = rest.filter((l) => l.startsWith("$")).map((l, i) => {
    const [who, raw] = l.slice(1).split("|");
    const [text, at] = raw.split("@");
    return { who, text, at: at ? Number(at) : 0.5 + i * 1.2 };
  });
  return (
    <div style={{ width: "100%", padding: "0 20px", fontFamily: t.fonts.body, display: "flex", flexDirection: "column", gap: 22 }}>
      <div style={{ fontFamily: t.fonts.heading, fontWeight: t.type.headlineWeight, fontSize: 56, lineHeight: 1.1, textTransform: t.type.headlineTransform, color: t.colors.ink }}>{title}</div>
      {bubbles.map((b) => {
        const r = EASE(interpolate(now, [b.at, b.at + 0.35], [0, 1], clamp));
        const murid = b.who === "murid";
        return (
          <div key={b.text} style={{ alignSelf: murid ? "flex-end" : "flex-start", opacity: r, transform: `translateX(${(1 - r) * (murid ? 80 : -40)}px)`, maxWidth: "86%" }}>
            <div style={{ marginBottom: 4, padding: "0 10px", textAlign: murid ? "right" : "left", fontWeight: 600, fontSize: 26, color: t.colors.muted }}>{murid ? "Murid" : "Ganjar"}</div>
            <div
              style={{
                padding: "16px 30px",
                borderRadius: t.radius.large,
                backgroundColor: murid ? t.colors.primaryTint : t.colors.primary,
                color: murid ? t.colors.ink : t.colors.onPrimary,
                border: murid ? `2px solid ${t.colors.border}` : "none",
                fontWeight: 700,
                fontSize: 44,
                lineHeight: 1.2,
              }}
            >
              {b.text}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Baris `&alur|A|B|C` = diagram alur: kotak berurutan dengan panah yang digambar satu per satu (kotak terakhir hijau); `#teks` = bilah info.
const BoardFlow: React.FC<{ readonly lines: readonly string[]; readonly instant?: boolean }> = ({ lines, instant }) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const now = frame / fps;
  const reveal = (at: number, len = 0.35): number => (instant ? 1 : EASE(interpolate(now, [at, at + len], [0, 1], clamp)));
  const [title, ...rest] = lines;
  const steps = (rest.find((l) => l.startsWith("&alur|")) ?? "").split("|").slice(1);
  const info = rest.find((l) => l.startsWith("#"))?.slice(1);
  return (
    <div style={{ width: "100%", height: "100%", padding: "26px 16px 22px", boxSizing: "border-box", fontFamily: t.fonts.body, color: t.colors.ink, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ fontFamily: t.fonts.heading, fontWeight: t.type.headlineWeight, fontSize: 56, lineHeight: 1.1, textTransform: t.type.headlineTransform, textAlign: "center", opacity: reveal(0.1), transform: `translateY(${(1 - reveal(0.1)) * 20}px)` }}>{title}</div>
      <div style={{ display: "flex", alignItems: "center", width: "100%", justifyContent: "center" }}>
        {steps.map((x, i) => {
          const last = i === steps.length - 1;
          const r = reveal(0.4 + i * 0.7);
          const arrow = reveal(0.4 + i * 0.7 + 0.4, 0.3);
          return (
            <div key={x} style={{ display: "flex", alignItems: "center" }}>
              <div style={{ minWidth: 190, padding: "26px 18px", borderRadius: t.radius.card, textAlign: "center", fontWeight: 800, fontSize: 36, backgroundColor: last ? t.colors.success : t.colors.primaryTint, color: last ? t.colors.onPrimary : t.colors.primaryInk, border: `3px solid ${last ? t.colors.success : t.colors.primarySoft}`, opacity: r, transform: `translateY(${(1 - r) * 20}px)` }}>{last ? `${x} ✓` : x}</div>
              {last ? null : (
                <svg width="64" height="30" viewBox="0 0 64 30" style={{ margin: "0 4px" }}>
                  <path d="M4 15 H52 M42 6 L54 15 L42 24" fill="none" stroke={t.colors.primaryDark} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - arrow} />
                </svg>
              )}
            </div>
          );
        })}
      </div>
      {info ? <div style={{ padding: "10px 28px", borderRadius: 999, backgroundColor: t.colors.primaryTint, fontWeight: 600, fontSize: 30, color: t.colors.primaryInk, opacity: reveal(2.1) }}>{info}</div> : null}
    </div>
  );
};

// Baris `&garis|Awal|Titik jatuh|Akhir` = garis waktu jatuh dan bangun: garis naik, turun tajam di titik jatuh (titik merah),
// lalu naik lagi; garis digambar bertahap, label di tiap titik. Judul boleh memuat satu sorotan `*frasa*`.
const BoardTimeline: React.FC<{ readonly lines: readonly string[]; readonly instant?: boolean }> = ({ lines, instant }) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const now = frame / fps;
  const reveal = (at: number, len = 0.35): number => (instant ? 1 : EASE(interpolate(now, [at, at + len], [0, 1], clamp)));
  const [title, ...rest] = lines;
  const [start = "", fall = "", end = ""] = (rest.find((l) => l.startsWith("&garis|")) ?? "").split("|").slice(1);
  const draw = reveal(0.5, 2.2);
  const mark = t.colors.accentDark ?? t.colors.accent;
  return (
    <div style={{ width: "100%", height: "100%", padding: "22px 16px 16px", boxSizing: "border-box", fontFamily: t.fonts.body, color: t.colors.ink, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ fontFamily: t.fonts.heading, fontWeight: t.type.headlineWeight, fontSize: 46, lineHeight: 1.1, textTransform: t.type.headlineTransform, textAlign: "center", opacity: reveal(0.1), transform: `translateY(${(1 - reveal(0.1)) * 20}px)` }}>{withHighlight(title, mark)}</div>
      <svg width="760" height="270" viewBox="0 0 760 270" style={{ overflow: "visible" }}>
        <line x1="10" y1="240" x2="750" y2="240" stroke={t.colors.border} strokeWidth="3" />
        <path d="M20 205 C110 200 170 150 240 110 S340 60 410 52 L452 222 C520 226 610 150 740 46" fill="none" stroke={t.colors.primary} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
        <g opacity={reveal(0.4)}>
          <circle cx="20" cy="205" r="12" fill={t.colors.primary} />
          <text x="20" y="262" fontFamily={t.fonts.body} fontWeight={600} fontSize="26" fill={t.colors.ink} textAnchor="start">{start}</text>
        </g>
        <g opacity={reveal(1.55)}>
          <circle cx="452" cy="222" r="16" fill={t.colors.danger} />
          <text x="452" y="262" fontFamily={t.fonts.body} fontWeight={700} fontSize="26" fill={t.colors.ink} textAnchor="middle">{fall}</text>
        </g>
        <g opacity={reveal(2.5)}>
          <circle cx="740" cy="46" r="14" fill={t.colors.success} />
          <text x="740" y="24" fontFamily={t.fonts.body} fontWeight={700} fontSize="26" fill={t.colors.ink} textAnchor="end">{end}</text>
        </g>
      </svg>
    </div>
  );
};

// Baris `||Judul|tanda|keterangan` = kartu kolom (kartu berurutan tampil berdampingan): lencana tanda di atas (`ok` = centang hijau,
// `?` = tanda tanya oranye gelap, `...` = menunggu abu-abu), judul satu baris, dan keterangan kecil (opsional);
// baris `#teks` = bilah info di dasar papan (angka "Rp ..." ditebalkan).
const BoardColumns: React.FC<{ readonly lines: readonly string[]; readonly instant?: boolean }> = ({ lines, instant }) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const now = frame / fps;
  const reveal = (at: number): number => (instant ? 1 : EASE(interpolate(now, [at, at + 0.35], [0, 1], clamp)));
  const [title, ...rest] = lines;
  const cols = rest.filter((l) => l.startsWith("||")).map((l) => l.slice(2).split("|"));
  const info = rest.find((l) => l.startsWith("#"))?.slice(1);
  const warn = t.colors.accentDark ?? t.colors.accent;
  return (
    <div style={{ width: "100%", height: "100%", padding: "26px 16px 22px", boxSizing: "border-box", fontFamily: t.fonts.body, color: t.colors.ink, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: info ? "space-between" : "space-evenly" }}>
      <div style={{ fontFamily: t.fonts.heading, fontWeight: t.type.headlineWeight, fontSize: 58, lineHeight: 1.1, textTransform: t.type.headlineTransform, textAlign: "center", opacity: reveal(0.1), transform: `translateY(${(1 - reveal(0.1)) * 20}px)` }}>{title}</div>
      <div style={{ display: "flex", gap: 22, width: "100%", alignItems: "stretch" }}>
        {cols.map(([label, mark, note], i) => {
          const r = reveal(0.5 + i * 0.4);
          const q = mark === "?";
          const pending = mark === "...";
          const accent = q ? warn : pending ? t.colors.muted : t.colors.success;
          return (
            <div key={label} style={{ flex: "1 1 0", minWidth: 0, padding: "22px 12px 20px", borderRadius: t.radius.card, backgroundColor: t.colors.primaryTint, border: `3px solid ${pending ? t.colors.line : accent}`, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 10, opacity: r, transform: `translateY(${(1 - r) * 24}px)` }}>
              <div style={{ width: 76, height: 76, borderRadius: 38, backgroundColor: pending ? t.colors.line : accent, color: t.colors.onPrimary, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 48, lineHeight: 1 }}>
                {mark === "ok" ? "✓" : mark === "..." ? "…" : mark}
              </div>
              <div style={{ fontWeight: 800, fontSize: 33, lineHeight: 1.15, whiteSpace: "nowrap" }}>{label}</div>
              {note ? <div style={{ fontWeight: 500, fontSize: 26, lineHeight: 1.25, color: t.colors.muted }}>{note}</div> : null}
            </div>
          );
        })}
      </div>
      {info ? (
        <div style={{ padding: "10px 28px", borderRadius: 999, backgroundColor: t.colors.primaryTint, fontWeight: 600, fontSize: 28, color: t.colors.primaryInk, opacity: reveal(1.3) }}>
          {info.split(/(Rp [\d.]+)/).map((part, i) => (/^Rp /.test(part) ? <span key={i} style={{ fontWeight: 800 }}>{part}</span> : part))}
        </div>
      ) : null}
    </div>
  );
};

const BoardList: React.FC<{ readonly lines: readonly string[]; readonly instant?: boolean }> = ({ lines, instant }) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const now = frame / fps;
  const mark = t.colors.accentDark ?? t.colors.accent;
  const reveal = (at: number): number => (instant ? 1 : EASE(interpolate(now, [at, at + 0.35], [0, 1], clamp)));
  const [title, ...rest] = lines;
  const items = rest.filter((l) => !l.startsWith(">"));
  const quote = rest.find((l) => l.startsWith(">"));
  // Tanpa kutipan, daftar lebih ringkas dan huruf dibesarkan supaya papan tetap terisi.
  const k = quote ? 1 : 1.06;
  return (
    <div style={{ width: "100%", padding: "0 20px", fontFamily: t.fonts.body, color: t.colors.ink, display: "flex", flexDirection: "column", gap: 14 * k }}>
      <div style={{ fontFamily: t.fonts.heading, fontWeight: t.type.headlineWeight, fontSize: 62 * k, lineHeight: 1.1, textTransform: t.type.headlineTransform, opacity: reveal(0.1), transform: `translateY(${(1 - reveal(0.1)) * 20}px)` }}>
        {withHighlight(title, mark)}
      </div>
      {items.map((x, i) => {
        const r = reveal(0.5 + i * 0.4);
        return (
          <div key={x} style={{ display: "flex", alignItems: "center", gap: 20, fontWeight: 600, fontSize: 46 * k, opacity: r, transform: `translateX(${(1 - r) * -30}px)` }}>
            <div style={{ width: 40, height: 40, borderRadius: 9, backgroundColor: t.colors.success, color: t.colors.onPrimary, fontSize: 30, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>✓</div>
            {withHighlight(x, mark)}
          </div>
        );
      })}
      {quote ? (
        <div style={{ marginTop: 10, paddingTop: 16, borderTop: `3px solid ${t.colors.border}`, fontWeight: 700, fontSize: 38, lineHeight: 1.25, opacity: reveal(0.5 + items.length * 0.4 + 0.2) }}>
          {withHighlight(quote.slice(1), mark)}
        </div>
      ) : null}
    </div>
  );
};

export const BOARD = { left: 90, top: 160, width: 900, height: 540 } as const;

export const Board: React.FC<{ readonly scene: DraftScene }> = ({ scene }) => {
  const t = useTheme();
  const { fps } = useVideoConfig();
  const segs = screenSegments(scene);
  return (
    <div style={{ position: "absolute", left: BOARD.left, top: BOARD.top, width: BOARD.width, height: BOARD.height }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: t.radius.large,
          backgroundColor: t.colors.surface,
          border: `14px solid ${t.colors.primaryDeep}`,
          boxShadow: t.shadows.lift,
          boxSizing: "border-box",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 56px",
        }}
      >
        {segs.map((seg, i) => {
          if (!seg.text) return null;
          const start = Math.round(seg.from * fps);
          const end = i + 1 < segs.length ? Math.round(segs[i + 1].from * fps) : undefined;
          return (
            <Sequence key={`${i}-${seg.text}`} from={start} durationInFrames={end === undefined ? Infinity : end - start} layout="none">
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 56px" }}>
                {seg.text.includes("\n&alur|") ? (
                  <BoardFlow lines={seg.text.split("\n")} instant={i > 0} />
                ) : seg.text.includes("\n&garis|") ? (
                  <BoardTimeline lines={seg.text.split("\n")} instant={i > 0} />
                ) : seg.text.includes("\n$") ? (
                  <BoardChat lines={seg.text.split("\n")} />
                ) : seg.text.includes("\n||") ? (
                  <BoardColumns lines={seg.text.split("\n")} instant={i > 0} />
                ) : seg.text.includes("\n") ? (
                  <BoardList lines={seg.text.split("\n")} instant={i > 0} />
                ) : (
                <Enter
                  name="Papan tulis"
                  delay={i === 0 ? 4 : 0}
                  y={30}
                  style={{
                    textAlign: "center",
                    textWrap: "balance",
                    fontFamily: t.fonts.heading,
                    fontWeight: t.type.headlineWeight,
                    fontSize: 78,
                    lineHeight: 1.15,
                    letterSpacing: `${t.type.tracking}em`,
                    textTransform: t.type.headlineTransform,
                    color: t.colors.ink,
                  }}
                >
                  {withHighlight(seg.text, t.colors.accentDark ?? t.colors.accent)}
                </Enter>
                )}
              </div>
            </Sequence>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 40, right: 40, bottom: -28, height: 18, borderRadius: 9, backgroundColor: t.colors.primaryDeep }} />
    </div>
  );
};
