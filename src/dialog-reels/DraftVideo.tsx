import type React from "react";
import { Audio } from "@remotion/media";
import { Easing, Img, interpolate, Sequence, Series, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { BrandFooter } from "../BrandFooter";
import { getTheme, ThemeProvider, useTheme } from "../themes";
import { Enter } from "../motion";
import { Camera } from "./Camera";
import { Decor } from "./Decor";
import { Inserts } from "./Inserts";
import { screenSegments, withHighlight } from "./screenText";
import { floorOf, Stage } from "./Stage";
import { ClaudeCode, claudeCodeSize, Ganjar, ganjarSize, Robot, robotSize } from "../assets/characters";
import type { CharacterId, DraftLine, DraftMeta, DraftScene, SceneTransition } from "./types";
import { sceneFrames } from "./voiceover";

// Reels 9:16 dari data (Reels dialog): tiap scene = latar dan pemeran (Stage), teks layar di atas, subtitle baris
// yang sedang diucapkan di bawah lantai, lalu footer, voice over, whoosh antar scene, dan musik latar.

export const FPS = 30;
export const MUSIC_FILE = "music/vue_bed.mp3";
const MUSIC_VOLUME = 0.07;
// Batas atas footer (BrandFooter tegak setinggi 128 px).
const FOOTER_TOP = 1792;

// Profil di dalam kartu teks atas: logo, handle, dan tombol Follow yang berubah jadi "Following" 1,6 dtk setelah kartu muncul.
const ProfilFollow: React.FC<{ readonly fg: string; readonly bg: string }> = ({ fg, bg }) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const press = EASE(interpolate(frame / fps, [1.6, 1.9], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const done = press > 0.5;
  return (
    <div style={{ marginTop: 22, display: "flex", alignItems: "center", justifyContent: "center", gap: 18, fontFamily: t.fonts.body }}>
      <Img src={staticFile(t.logo.src)} style={{ width: 72, height: 72, borderRadius: 36, border: `4px solid ${fg}` }} />
      <span style={{ fontWeight: 700, fontSize: 36, color: fg, textTransform: "none", letterSpacing: 0 }}>{t.handle}</span>
      <span
        style={{
          padding: "10px 32px",
          borderRadius: 999,
          fontWeight: 800,
          fontSize: 32,
          textTransform: "none",
          letterSpacing: 0,
          backgroundColor: done ? t.colors.primaryDeep : fg,
          color: done ? t.colors.onPrimary : bg,
          border: `3px solid ${fg}`,
        }}
      >
        {done ? "Following" : "Follow"}
      </span>
    </div>
  );
};

// Info kelas di dalam kartu teks atas: nama kelas, harga, dan tombol Daftar (muncul 0,5 dtk setelah kartu).
const InfoKelas: React.FC<{ readonly fg: string; readonly bg: string }> = ({ fg, bg }) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = EASE(interpolate(frame / fps, [0.5, 0.9], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  return (
    <div style={{ marginTop: 22, display: "flex", flexDirection: "column", alignItems: "center", gap: 14, fontFamily: t.fonts.body, textTransform: "none", letterSpacing: 0, opacity: p, transform: `translateY(${(1 - p) * 16}px)` }}>
      <div style={{ fontWeight: 600, fontSize: 34, color: fg }}>Kelas Bikin Aplikasi Dengan AI</div>
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <span style={{ fontWeight: 800, fontSize: 40, color: fg }}>Rp 499.000</span>
        <span style={{ padding: "10px 32px", borderRadius: 999, backgroundColor: fg, color: bg, fontWeight: 800, fontSize: 30 }}>Daftar Sekarang</span>
      </div>
    </div>
  );
};

// Log error di dalam kartu teks atas (potongan terminal: perintah, TypeError merah, dan baris stack); muncul 0,5 dtk setelah kartu.
const LogError: React.FC = () => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = EASE(interpolate(frame / fps, [0.4, 0.8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  return (
    <div
      style={{
        marginTop: 20,
        padding: "16px 22px",
        borderRadius: t.radius.card,
        backgroundColor: t.code.bg,
        border: `2px solid ${t.colors.danger}`,
        textAlign: "left",
        fontFamily: t.fonts.mono,
        fontWeight: 400,
        fontSize: 26,
        lineHeight: 1.45,
        textTransform: "none",
        letterSpacing: 0,
        color: t.code.text,
        opacity: p,
        transform: `translateY(${(1 - p) * 14}px)`,
      }}
    >
      <div style={{ color: t.code.muted }}>$ npm run start</div>
      <div style={{ color: t.colors.danger }}>TypeError: Cannot read properties of undefined</div>
      <div style={{ color: t.code.muted }}>  at hitungTotal (kasir.ts:42)</div>
    </div>
  );
};

// Prompt dan kode di dalam kartu teks atas: prompt diketik, dua baris kode muncul, lalu "aplikasi jalan".
const KodePrompt: React.FC = () => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const now = frame / fps;
  const PROMPT = "bikin aplikasi kasir sederhana";
  const clampOpts = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  const p = EASE(interpolate(now, [0.3, 0.7], [0, 1], clampOpts));
  const typed = Math.floor(interpolate(now, [0.5, 1.4], [0, PROMPT.length], clampOpts));
  const line = (at: number): number => EASE(interpolate(now, [at, at + 0.3], [0, 1], clampOpts));
  return (
    <div
      style={{
        marginTop: 20,
        padding: "16px 22px",
        borderRadius: t.radius.card,
        backgroundColor: t.code.bg,
        border: `2px solid ${t.code.line}`,
        textAlign: "left",
        fontFamily: t.fonts.mono,
        fontWeight: 400,
        fontSize: 26,
        lineHeight: 1.5,
        textTransform: "none",
        letterSpacing: 0,
        color: t.code.text,
        opacity: p,
        transform: `translateY(${(1 - p) * 14}px)`,
      }}
    >
      <div style={{ color: t.colors.primarySoft }}>
        {"> "}
        {PROMPT.slice(0, typed)}
        <span style={{ opacity: typed < PROMPT.length || Math.floor(now * 2) % 2 === 0 ? 1 : 0 }}>▌</span>
      </div>
      <div style={{ opacity: line(1.6) }}>const total = hitung(items);</div>
      <div style={{ opacity: line(1.8) }}>{"export function Kasir() { ... }"}</div>
      <div style={{ opacity: line(2.1), color: t.colors.success }}>✓ aplikasi jalan</div>
    </div>
  );
};

// Teks kartu kata demi kata: tiap kata fade dan naik 14 px berurutan (0,1 dtk), dimulai 0,15 dtk setelah kartu muncul. `*frasa*` = sorotan.
const KineticText: React.FC<{ readonly text: string; readonly mark: string }> = ({ text, mark }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const now = frame / fps;
  const words = text.split("*").flatMap((part, pi) => part.split(" ").filter(Boolean).map((w) => ({ w, hl: pi % 2 === 1 })));
  return (
    <>
      {words.map((x, i) => {
        const p = EASE(interpolate(now, [0.15 + i * 0.1, 0.15 + i * 0.1 + 0.3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
        return (
          <span key={i} style={{ display: "inline-block", opacity: p, transform: `translateY(${(1 - p) * 14}px)`, color: x.hl ? mark : undefined, marginRight: i < words.length - 1 ? "0.28em" : 0 }}>
            {x.w}
          </span>
        );
      })}
    </>
  );
};

// Transisi masuk scene: `geser` (isi meluncur dari kanan), `wipe` (panel biru menyapu ke kanan), `flash` (kilat putih). Footer ada di luar.
const SceneTransitionIn: React.FC<{ readonly kind?: SceneTransition; readonly children: React.ReactNode }> = ({ kind, children }) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (!kind || kind === "potong") return <>{children}</>;
  const sec = kind === "flash" ? 0.3 : 0.45;
  const p = EASE(interpolate(frame / fps, [0, sec], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  if (kind === "geser") return <div style={{ position: "absolute", inset: 0, transform: `translateX(${(1 - p) * 140}px)`, opacity: 0.35 + 0.65 * p }}>{children}</div>;
  if (kind === "wipe")
    return (
      <>
        {children}
        {p < 1 ? <div style={{ position: "absolute", top: 0, bottom: 0, left: `${p * 100}%`, width: "100%", backgroundColor: t.colors.primary }} /> : null}
      </>
    );
  return (
    <>
      {children}
      {p < 1 ? <div style={{ position: "absolute", inset: 0, backgroundColor: "#FFFFFF", opacity: 1 - p }} /> : null}
    </>
  );
};

const OnScreenText: React.FC<{ readonly scene: DraftScene }> = ({ scene }) => {
  const t = useTheme();
  const { fps } = useVideoConfig();
  const tone = scene.tone ?? "terang";
  const dark = tone !== "terang";
  const bg = tone === "biru" ? t.colors.primary : tone === "gelap" ? t.code.raised : t.colors.surface;
  const fg = dark ? t.colors.onPrimary : t.colors.ink;
  const mark = dark ? (t.colors.groundEmphasis ?? t.colors.accent) : (t.colors.accentDark ?? t.colors.accent);
  const segs = screenSegments(scene);
  // Di latar kelas teks layar tampil di papan tulis (Board), bukan di kartu atas.
  if (scene.backdrop === "kelas") return null;
  return (
    <>
      {segs.map((seg, i) => {
        if (!seg.text) return null;
        const start = Math.round(seg.from * fps);
        const end = i + 1 < segs.length ? Math.round(segs[i + 1].from * fps) : undefined;
        return (
          <Sequence key={`${i}-${seg.text}`} from={start} durationInFrames={end === undefined ? Infinity : end - start} layout="none">
            <div style={{ position: "absolute", left: 72, right: 72, top: 150, display: "flex", justifyContent: scene.cardAlign === "kiri" ? "flex-start" : scene.cardAlign === "kanan" ? "flex-end" : "center" }}>
              <Enter
                name="Teks layar"
                delay={i === 0 ? 4 : 0}
                y={40}
                style={{
                  padding: "28px 44px",
                  borderRadius: t.radius.large,
                  backgroundColor: bg,
                  boxShadow: t.shadows.md,
                  textAlign: "center",
                  textWrap: "balance",
                  fontFamily: t.fonts.heading,
                  fontWeight: t.type.headlineWeight,
                  fontSize: Math.round(68 * t.type.scale),
                  lineHeight: 1.15,
                  letterSpacing: `${t.type.tracking}em`,
                  textTransform: t.type.headlineTransform,
                  color: fg,
                  maxWidth: scene.cardAlign && scene.cardAlign !== "tengah" ? 820 : undefined,
                  rotate: scene.cardTilt ? `${scene.cardTilt}deg` : undefined,
                }}
              >
                {scene.cardMotion === "kata" ? <KineticText text={seg.text.split("\n").filter((l) => !l.startsWith("@")).join(" ")} mark={mark} /> : withHighlight(seg.text.split("\n").filter((l) => !l.startsWith("@")).join(" "), mark)}
                {seg.text.split("\n").includes("@logError") ? <LogError /> : null}
                {seg.text.split("\n").includes("@kodePrompt") ? <KodePrompt /> : null}
                {scene.screenExtra === "profilFollow" ? <ProfilFollow fg={fg} bg={bg} /> : null}
                {scene.screenExtra === "infoKelas" ? <InfoKelas fg={fg} bg={bg} /> : null}
              </Enter>
            </div>
          </Sequence>
        );
      })}
    </>
  );
};

// Lampu sorot: tepi layar digelapkan, kerucut cahaya hangat dari atas tengah jatuh ke papan dan karakter. Menyala 0,6 dtk di awal scene.
const Spotlight: React.FC<{ readonly on?: boolean }> = ({ on }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (!on) return null;
  const p = EASE(interpolate(frame / fps, [0, 0.6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  return (
    <div style={{ position: "absolute", inset: 0, opacity: p, pointerEvents: "none" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 62% 48% at 50% 38%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 100%)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 1400, clipPath: "polygon(38% 0, 62% 0, 96% 100%, 4% 100%)", background: "linear-gradient(to bottom, rgba(255,236,190,0.15), rgba(255,236,190,0.03))" }} />
    </div>
  );
};

// Wash biru primary untuk scene bernada "biru": dikalikan di atas panggung supaya dinding dan karakter ikut kebiruan.
const Tint: React.FC<{ readonly tone: DraftScene["tone"] }> = ({ tone }) => {
  const t = useTheme();
  if (tone !== "biru") return null;
  return <div style={{ position: "absolute", inset: 0, backgroundColor: t.colors.primarySoft, mixBlendMode: "multiply", opacity: 0.7 }} />;
};

const ENTER_SEC = 0.3;
const EASE = Easing.bezier(0.2, 0.8, 0.2, 1);

const AVATAR = 76;
// Kotak avatar per karakter: tinggi render penuh dan titik (0..1) pada badan yang jadi pusat lingkaran.
const AVATAR_FRAME: Readonly<Record<CharacterId, { readonly h: number; readonly cx: number; readonly cy: number }>> = {
  ganjar: { h: 272, cx: 0.5, cy: 0.2 },
  robot: { h: 96, cx: 0.5, cy: 0.37 },
  claudecode: { h: 96, cx: 0.5, cy: 0.37 },
};

// Wajah karakter dalam lingkaran, ekspresinya mengikuti ekspresi karakter itu di scene.
const Avatar: React.FC<{ readonly who: CharacterId; readonly expression: string }> = ({ who, expression }) => {
  const t = useTheme();
  const f = AVATAR_FRAME[who];
  const s = who === "ganjar" ? ganjarSize(f.h) : who === "robot" ? robotSize(f.h) : claudeCodeSize(f.h);
  const e = expression as never;
  return (
    <div
      style={{
        position: "relative",
        flex: "none",
        width: AVATAR,
        height: AVATAR,
        borderRadius: "50%",
        overflow: "hidden",
        backgroundColor: t.colors.primaryTint,
        border: `3px solid ${t.colors.surface}`,
        boxShadow: t.shadows.md,
      }}
    >
      <div style={{ position: "absolute", left: AVATAR / 2 - s.width * f.cx, top: AVATAR / 2 - f.h * f.cy }}>
        {who === "ganjar" ? <Ganjar height={f.h} expression={e} /> : who === "robot" ? <Robot height={f.h} expression={e} /> : <ClaudeCode height={f.h} expression={e} />}
      </div>
    </div>
  );
};

// Subtitle berbentuk chat: tiap baris ucapan jadi bubble dan tetap ada sebagai riwayat, juga saat scene berganti.
// Ganjar di kiri (biru primary), karakter lain di kanan (putih). Bila ruang habis, bubble paling atas memudar.
type ChatItem = { readonly key: string; readonly who: CharacterId; readonly text: string; readonly expression: string; readonly from: number };

// Baris scene jadi item chat; ekspresi avatar = ekspresi karakter itu saat baris diucapkan.
const chatItems = (scene: DraftScene): readonly ChatItem[] =>
  scene.lines.map((l, i) => {
    let expression = scene.cast.find((c) => c.character === l.who)?.expression ?? "netral";
    for (const prev of scene.lines.slice(0, i + 1)) expression = prev.expressions?.[l.who] ?? expression;
    return { key: `${scene.id}-${i}`, who: l.who, text: l.text, expression, from: l.from };
  });

const Subtitle: React.FC<{ readonly scene: DraftScene; readonly history: readonly ChatItem[] }> = ({ scene, history }) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const now = frame / fps;
  const shown = [...history, ...chatItems(scene).filter((l) => now >= l.from)];
  if (!shown.length) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 60,
        right: 60,
        top: floorOf(scene) + 40,
        bottom: 1920 - FOOTER_TOP,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        gap: 12,
        overflow: "hidden",
        WebkitMaskImage: "linear-gradient(to bottom, transparent 0, black 64px)",
        maskImage: "linear-gradient(to bottom, transparent 0, black 64px)",
      }}
    >
      {shown.map((l, i) => {
        const p = EASE(interpolate(now - l.from, [0, ENTER_SEC], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
        // Bubble lama meredup dan memburam saat baris berikutnya masuk; riwayat dari scene sebelumnya sudah penuh redup.
        const next = shown[i + 1];
        const d = next ? EASE(interpolate(now - next.from, [0, ENTER_SEC], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })) : 0;
        const left = l.who === "ganjar";
        return (
          <div
            key={l.key}
            style={{
              display: "flex",
              flexDirection: left ? "row" : "row-reverse",
              alignItems: "flex-end",
              gap: 14,
              alignSelf: left ? "flex-start" : "flex-end",
              maxWidth: "100%",
              opacity: p * (1 - 0.55 * d),
              filter: d > 0 ? `blur(${(d * 2.5).toFixed(2)}px)` : undefined,
              transformOrigin: left ? "left bottom" : "right bottom",
              transform: `translateY(${(1 - p) * 28}px) scale(${1 - 0.04 * d})`,
            }}
          >
            <Avatar who={l.who} expression={l.expression} />
            <div style={{ maxWidth: 800 }}>
              <div
                style={{
                  padding: "14px 28px",
                  borderRadius: t.radius.large,
                  borderBottomLeftRadius: left ? 4 : t.radius.large,
                  borderBottomRightRadius: left ? t.radius.large : 4,
                  backgroundColor: left ? t.colors.primary : t.colors.surface,
                  color: left ? t.colors.onPrimary : t.colors.ink,
                  border: left ? "none" : `2px solid ${t.colors.border}`,
                  boxShadow: d < 1 ? t.shadows.lift : t.shadows.md,
                  fontFamily: t.fonts.body,
                  fontWeight: 600,
                  fontSize: 36,
                  lineHeight: 1.3,
                }}
              >
                {l.text}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Waktu mulai tiap kata (detik sejak baris mulai). Dari `wordTimes` bila lengkap, bila tidak diperkirakan dari panjang huruf
// dengan jeda kecil setelah tanda baca.
const wordStarts = (line: DraftLine, words: readonly string[]): readonly number[] => {
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

const SPEAKER: Readonly<Record<CharacterId, { readonly name: string; readonly fill: "primary" | "surface" }>> = {
  ganjar: { name: "Ganjar", fill: "primary" },
  robot: { name: "Robot", fill: "surface" },
  claudecode: { name: "Claude Code", fill: "surface" },
};

// Subtitle berbentuk caption: satu baris yang sedang diucapkan, rata tengah (horizontal dan vertikal) di area bawah lantai.
// Mode karaoke: kata yang sedang diucapkan putih penuh, yang sudah lewat agak redup, yang belum redup; penanda pembicara
// (titik berwarna per karakter dan nama kecil) di atas teks.
const Caption: React.FC<{ readonly scene: DraftScene; readonly motion: "karaoke" | "none" }> = ({ scene, motion }) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const now = frame / fps;
  const line = scene.lines.find((l) => now >= l.from && now < l.from + l.dur);
  if (!line) return null;
  const local = now - line.from;
  const clampOpts = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  const opacity = EASE(interpolate(local, [0, 0.2], [0, 1], clampOpts)) * interpolate(local, [line.dur - 0.15, line.dur], [1, 0], clampOpts);
  const words = line.text.split(" ");
  const starts = wordStarts(line, words);
  const karaoke = motion === "karaoke";
  const sp = SPEAKER[line.who];
  // Latar kelas siang atau sore: lantai terang, jadi caption gelap tanpa bayangan; yang lain putih dengan bayangan tipis.
  // Saat cutaway aktif, latar layar gelap penuh, jadi caption kembali putih.
  const inCutaway = (scene.inserts ?? []).some((x) => now >= x.from && now < x.from + x.dur);
  const onLight = scene.backdrop === "kelas" && scene.time !== "malam" && !inCutaway;
  const white = onLight ? t.colors.ink : (t.colors.groundText ?? t.colors.onPrimary);
  return (
    <div
      style={{
        position: "absolute",
        left: 80,
        right: 80,
        top: floorOf(scene) + 40,
        bottom: 1920 - FOOTER_TOP,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 18,
        opacity,
      }}
    >
      {karaoke ? (
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
          fontFamily: t.fonts.body,
          fontWeight: 700,
          fontSize: 54,
          lineHeight: 1.3,
          color: white,
          textShadow: onLight ? "none" : "0 2px 12px rgba(0, 0, 0, 0.55)",
        }}
      >
        {words.map((w, i) => {
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

const SFX_VOLUME = 0.5;
const RAMP = 18;

// Pengali volume musik per frame: tiap scene punya `music` (bawaan 1), berpindah halus (RAMP frame) di awal scene berikutnya.
const musicLevel = (scenes: readonly DraftScene[], starts: readonly number[], total: number): ((f: number) => number) => {
  const xs: number[] = [];
  const ys: number[] = [];
  scenes.forEach((s, i) => {
    const level = s.music ?? 1;
    xs.push(i === 0 ? 0 : starts[i] + RAMP, i + 1 < scenes.length ? starts[i + 1] : total);
    ys.push(level, level);
  });
  return (f) => interpolate(f, xs, ys, { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
};

const Sound: React.FC<{ readonly scenes: readonly DraftScene[]; readonly starts: readonly number[]; readonly total: number; readonly meta: DraftMeta }> = ({ scenes, starts, total, meta }) => {
  const level = musicLevel(scenes, starts, total);
  return (
    <>
      {scenes.flatMap((s, i) =>
        s.lines.flatMap((l) => (l.vo ? [<Audio key={l.id} src={l.vo} from={starts[i] + Math.round(l.from * FPS)} volume={1} />] : [])),
      )}
      {meta.speakerPop
        ? scenes.flatMap((s, i) =>
            s.lines.map((l, k) => (
              <Audio key={`pop-${i}-${k}`} src={staticFile(`sfx/synth/${l.who === "ganjar" ? "pop_ganjar" : "pop_claude"}.wav`)} from={Math.max(0, starts[i] + Math.round(l.from * FPS) - 3)} volume={0.22} />
            )),
          )
        : null}
      {scenes.flatMap((s, i) =>
        s.lines.flatMap((l, k) =>
          (l.sfx ?? []).map((x, n) => <Audio key={`sfx-${i}-${k}-${n}`} src={staticFile(`sfx/synth/${x.name}.wav`)} from={starts[i] + Math.round((l.from + (x.at ?? 0)) * FPS)} volume={x.volume ?? SFX_VOLUME} />),
        ),
      )}
      {(meta.sceneSfx !== false ? starts : []).map((start, i) => {
        const low = meta.whooshVariants && i > 0 && scenes[i].backdrop !== scenes[i - 1].backdrop;
        return <Audio key={`whoosh-${i}`} src={staticFile("sfx/synth/whoosh.wav")} from={start} volume={low ? 0.38 : 0.3} playbackRate={low ? 0.75 : 1} />;
      })}
      <Audio
        src={staticFile(MUSIC_FILE)}
        loop
        loopVolumeCurveBehavior="extend"
        volume={(f) => MUSIC_VOLUME * level(f) * interpolate(f, [0, 45, total - 75, total], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
      />
    </>
  );
};

export const totalFrames = (scenes: readonly DraftScene[]): number => sceneFrames(scenes, FPS).reduce((a, b) => a + b, 0);

export const DraftVideo: React.FC<{ readonly theme: string; readonly meta: DraftMeta; readonly scenes: readonly DraftScene[] }> = ({ theme, meta, scenes }) => {
  const frames = sceneFrames(scenes, FPS);
  const starts = frames.map((_, i) => frames.slice(0, i).reduce((a, b) => a + b, 0));
  return (
    <ThemeProvider name={theme}>
      <Series>
        {scenes.map((s, i) => (
          <Series.Sequence key={s.id} name={s.id} durationInFrames={frames[i]} premountFor={FPS}>
            <SceneTransitionIn kind={s.transisi}>
              <Camera scene={s} mode={meta.camera ?? "diam"}>
                <Stage scene={s} style={meta.style} idle={meta.idleMotion} />
              </Camera>
              <Spotlight on={s.spotlight} />
              <Tint tone={s.tone} />
              <Decor decor={s.decor ?? []} />
              <OnScreenText scene={s} />
              <Inserts inserts={s.inserts ?? []} />
              {meta.subtitle === "caption" ? <Caption scene={s} motion={meta.captionMotion ?? "karaoke"} /> : <Subtitle scene={s} history={scenes.slice(0, i).flatMap((x) => chatItems(x).map((c) => ({ ...c, from: -ENTER_SEC })))} />}
            </SceneTransitionIn>
          </Series.Sequence>
        ))}
      </Series>
      <BrandFooter theme={theme} handle={getTheme(theme).handle} />
      <Sound scenes={scenes} starts={starts} total={totalFrames(scenes)} meta={meta} />
    </ThemeProvider>
  );
};
