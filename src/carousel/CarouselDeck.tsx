import type React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { ClaudeCode, ClaudeCodeStickman, Ganjar, GanjarStickman, Robot, RobotStickman, type Gesture } from "../assets/characters";
import type { CarouselSlide, CarouselSpec, SlideImage } from "../content/types";
import { Icon } from "../icons";
import { ThemeProvider, useTheme, type Theme } from "../themes";
import { ganjarClip, HEIGHT, robotClip, size } from "../dialog-reels/Stage";
import type { CastCue, VisualStyle } from "../dialog-reels/types";

// Carousel 4:5 (Format B dan C), satu frame = satu slide (fps 1). Semua ukuran diukur per piksel dari sample
// "Model Murah Bisa Menjebak" (1080x1350). Header: logo + judul seri + nomor. Hook dan shift di latar biru primary,
// sisanya putih (bisa diubah per slide lewat `tone`). Isi di tengah vertikal antara header dan footer. Judul Title
// Case dari tema, sorotan berupa teks oranye. Pemeran digambar sebagai stiker (outline putih, miring) di bawah,
// di luar alur isi. Semua warna dan huruf dari tema.

export const CAROUSEL_WIDTH = 1080;
export const CAROUSEL_HEIGHT = 1350;
const PAD = 88;
const CONTENT_W = CAROUSEL_WIDTH - 2 * PAD;
const GAP = 32;

// Ukuran per peran (px, sudah final, tidak dikali skala tema). Judul ExtraBold, line-height 1, tracking -0.04em.
const TITLE_PX: Readonly<Record<CarouselSlide["role"], number>> = { hook: 106, relate: 96, shift: 100, detail: 88, step: 76, closing: 104 };
const TITLE_WITH_STAT = 76;
const TITLE_TRACKING = -0.04;
// Isi Regular, line-height 1.45 (closing 1.5).
const BODY_PX: Readonly<Record<CarouselSlide["role"], number>> = { hook: 38, relate: 34, shift: 34, detail: 34, step: 31, closing: 38 };
const BODY_WITH_STAT = 31;
const BODY_WITH_CODE = 31;

// Pose diam: klip rig ditahan di tengah geraknya, stickman memakai gesture-nya.
const Pose: React.FC<{ readonly cue: CastCue; readonly style: VisualStyle; readonly h: number; readonly toward: number }> = ({ cue, style, h, toward }) => {
  const expression = cue.expression as never;
  const who = cue.character;
  if (style === "stickman") {
    const gesture = (cue.motion ?? "netral") as Gesture;
    if (who === "ganjar") return <GanjarStickman height={h} expression={expression} gesture={gesture} hair headphones={false} strokeWidth={5} />;
    if (who === "robot") return <RobotStickman height={h} expression={expression} gesture={gesture} strokeWidth={5} />;
    return <ClaudeCodeStickman height={h} expression={expression} gesture={gesture} strokeWidth={5} />;
  }
  if (who === "ganjar") {
    const c = ganjarClip(cue.motion, toward);
    return <Ganjar height={h} expression={expression} clips={c ? [{ clip: c.clip, start: -Math.round(c.dur / 2), dur: c.dur }] : []} />;
  }
  const c = robotClip(cue.motion);
  const clips = c ? [{ clip: c.clip, start: -Math.round(c.dur / 2), dur: c.dur }] : [];
  return who === "robot" ? <Robot height={h} expression={expression} clips={clips} /> : <ClaudeCode height={h} expression={expression} clips={clips} />;
};

type Look = {
  readonly bg: string;
  readonly ink: string;
  readonly body: string;
  readonly muted: string;
  readonly label: string;
  readonly rule: string;
  readonly cardBg: string;
  readonly cardInk: string;
  readonly cardIcon: string;
  readonly onBlue: boolean;
};

const ON_BLUE_LINE = "rgba(255, 255, 255, 0.22)";

const lookOf = (t: Theme, onBlue: boolean): Look =>
  onBlue
    ? {
        bg: t.colors.primary,
        ink: t.colors.onPrimary,
        body: t.colors.onPrimary,
        muted: t.colors.groundTextMuted,
        label: t.colors.onPrimary,
        rule: ON_BLUE_LINE,
        cardBg: "rgba(255, 255, 255, 0.12)",
        cardInk: t.colors.onPrimary,
        cardIcon: t.colors.onPrimary,
        onBlue,
      }
    : {
        bg: t.colors.canvas,
        ink: t.colors.ink,
        body: t.colors.ink,
        muted: t.colors.muted,
        label: t.colors.primaryDark,
        rule: t.colors.border,
        cardBg: t.colors.primaryTint,
        cardInk: t.colors.primaryInk,
        cardIcon: t.colors.primaryDark,
        onBlue,
      };

const toneOf = (slide: CarouselSlide): boolean => (slide.tone ? slide.tone === "biru" : slide.role === "hook" || slide.role === "shift");

// Sorotan judul: teks oranye aksen (seperti sample), tanpa latar.
const Mark: React.FC<{ readonly children: React.ReactNode }> = ({ children }) => {
  const t = useTheme();
  return <span style={{ color: t.colors.accent }}>{children}</span>;
};

const Title: React.FC<{ readonly text: string; readonly accent?: string; readonly look: Look; readonly px: number }> = ({ text, accent, look, px }) => {
  const t = useTheme();
  const at = accent ? text.indexOf(accent) : -1;
  return (
    <div
      style={{
        color: look.ink,
        fontFamily: t.fonts.heading,
        fontWeight: 800,
        fontSize: px,
        lineHeight: 1,
        letterSpacing: `${TITLE_TRACKING}em`,
        textTransform: t.type.headlineTransform,
        maxWidth: CONTENT_W,
      }}
    >
      {at < 0 || !accent ? (
        text
      ) : (
        <>
          {text.slice(0, at)}
          <Mark>{accent}</Mark>
          {text.slice(at + accent.length)}
        </>
      )}
    </div>
  );
};

const CodeCard: React.FC<{ readonly lang: string; readonly code: string }> = ({ lang, code }) => {
  const t = useTheme();
  return (
    <div style={{ alignSelf: "stretch", borderRadius: t.radius.card, backgroundColor: t.code.bg, border: `2px solid ${t.code.line}`, padding: "22px 30px 26px" }}>
      <div style={{ color: t.code.muted, fontFamily: t.fonts.mono, fontSize: 24, marginBottom: 14, textTransform: "lowercase" }}>{lang}</div>
      <pre style={{ margin: 0, color: t.code.text, fontFamily: t.fonts.mono, fontSize: 28, lineHeight: 1.5, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{code.replace(/\s+$/, "")}</pre>
    </div>
  );
};

// Kartu CTA (sample slide 2): latar primaryTint, radius 20, ikon user 40 px, teks Medium 34 / 1.5.
const CtaCard: React.FC<{ readonly text: string; readonly look: Look }> = ({ text, look }) => {
  const t = useTheme();
  return (
    <div style={{ alignSelf: "stretch", marginTop: 8, display: "flex", gap: 28, alignItems: "flex-start", borderRadius: t.radius.large, backgroundColor: look.cardBg, padding: "38px 44px 42px" }}>
      <div style={{ flex: "none", marginTop: 6, display: "flex" }}>
        <Icon name="user" size={40} color={look.cardIcon} />
      </div>
      <div style={{ color: look.cardInk, fontWeight: 500, fontSize: 34, lineHeight: 1.5 }}>{text}</div>
    </div>
  );
};

// Kartu kutipan (sample slide 6): bingkai 1 px, radius 20, Bold 44 / 1.3. Baris baru di teks (\n) dipertahankan.
const QuoteCard: React.FC<{ readonly text: string; readonly look: Look }> = ({ text, look }) => {
  const t = useTheme();
  return (
    <div style={{ alignSelf: "stretch", marginTop: 8, borderRadius: t.radius.large, border: `1px solid ${look.rule}`, padding: "36px 43px 42px", color: look.ink, fontWeight: 700, fontSize: 44, lineHeight: 1.3, whiteSpace: "pre-line" }}>
      {text}
    </div>
  );
};

const Pic: React.FC<{ readonly image: SlideImage; readonly maxHeight?: number }> = ({ image, maxHeight }) => {
  const t = useTheme();
  return <Img src={staticFile(image.src)} alt={image.alt} style={{ display: "block", maxWidth: "100%", maxHeight, objectFit: "contain", borderRadius: t.radius.card }} />;
};

// Blok stat (sample slide 3-5): kolom 343 px; label Bold 28 kapital, angka ExtraBold 116, keterangan Regular 26.
// Gambar di sampingnya mulai x = 471 dan lebar sisa (520 px), di tengah vertikal.
const StatBlock: React.FC<{ readonly stat: NonNullable<CarouselSlide["stat"]>; readonly look: Look; readonly side?: SlideImage }> = ({ stat, look, side }) => {
  const t = useTheme();
  return (
    <div style={{ alignSelf: "stretch", display: "flex", alignItems: "center", gap: 40 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, width: side ? 343 : undefined, flex: side ? "none" : 1 }}>
        <div style={{ color: look.label, fontWeight: 700, fontSize: 28, lineHeight: 1.2, letterSpacing: "0.02em", textTransform: "uppercase" }}>{stat.label}</div>
        <div style={{ color: look.ink, fontFamily: t.fonts.heading, fontWeight: 800, fontSize: 116, lineHeight: 1, letterSpacing: "-0.03em", whiteSpace: "nowrap" }}>{stat.value}</div>
        {stat.note && <div style={{ color: look.muted, fontSize: 26, lineHeight: 1.4 }}>{stat.note}</div>}
      </div>
      {side && (
        <div style={{ flex: 1, minWidth: 0 }}>
          <Pic image={side} />
        </div>
      )}
    </div>
  );
};

// Hiasan hook (sample slide 1): dua lingkaran garis 2 px putih 22% dan tanda plus oranye 24 px.
const HookDecor: React.FC = () => {
  const t = useTheme();
  return (
    <svg width={CAROUSEL_WIDTH} height={CAROUSEL_HEIGHT} style={{ position: "absolute", left: 0, top: 0 }}>
      <circle cx={980} cy={100} r={278} fill="none" stroke={ON_BLUE_LINE} strokeWidth={2} />
      <circle cx={59} cy={1290} r={178} fill="none" stroke={ON_BLUE_LINE} strokeWidth={2} />
      <g stroke={t.colors.accent} strokeWidth={3} strokeLinecap="butt">
        <line x1={437.5} y1={1170} x2={437.5} y2={1194} />
        <line x1={426} y1={1181.5} x2={450} y2={1181.5} />
      </g>
    </svg>
  );
};

// Pemeran sebagai stiker (sample slide 1): outline putih ±7 px, bayangan lembut, miring 6 derajat, pusat badan di
// y = 1156. ClaudeCode rig setinggi 279 px (dikalibrasi dari jarak mata di sample); karakter lain diskalakan sama.
const STICKER_FILTER = [
  "drop-shadow(7px 0 0 #fff)",
  "drop-shadow(-7px 0 0 #fff)",
  "drop-shadow(0 7px 0 #fff)",
  "drop-shadow(0 -7px 0 #fff)",
  "drop-shadow(5px 5px 0 #fff)",
  "drop-shadow(-5px -5px 0 #fff)",
  "drop-shadow(2px 4px 6px rgba(11, 15, 26, 0.35))",
].join(" ");
const STICKER_SCALE = 279 / HEIGHT.rig.claudecode;
const STICKER_X = { kiri: 219, tengah: CAROUSEL_WIDTH / 2, kanan: CAROUSEL_WIDTH - 219 } as const;
const STICKER_TILT = { kiri: -6, tengah: 0, kanan: 6 } as const;
const STICKER_CY = 1156;

const Sticker: React.FC<{ readonly cue: CastCue; readonly style: VisualStyle }> = ({ cue, style }) => {
  const h = HEIGHT[style][cue.character] * STICKER_SCALE;
  const w = size(cue.character, style, h).width;
  // Pusat badan ClaudeCode rig ada di 200/420 tinggi kotak; karakter lain memakai tengah kotak.
  const cy = cue.character === "claudecode" && style === "rig" ? (200 / 420) * h : h / 2;
  const toward = cue.position === "kiri" ? 1 : cue.position === "kanan" ? -1 : 0;
  return (
    <div
      style={{
        position: "absolute",
        left: STICKER_X[cue.position] - w / 2,
        top: STICKER_CY - cy,
        width: w,
        height: h,
        transform: `rotate(${STICKER_TILT[cue.position]}deg)`,
        transformOrigin: `${w / 2}px ${cy}px`,
        filter: STICKER_FILTER,
      }}
    >
      <Pose cue={cue} style={style} h={h} toward={toward} />
    </div>
  );
};

const pad2 = (n: number): string => String(n).padStart(2, "0");

const Slide: React.FC<{ readonly slide: CarouselSlide; readonly series: string; readonly index: number; readonly total: number; readonly stepNo: number; readonly style: VisualStyle }> = ({ slide, series, index, total, stepNo, style }) => {
  const t = useTheme();
  const look = lookOf(t, toneOf(slide));
  const last = index + 1 >= total;
  const closing = slide.role === "closing";
  const { image, stat } = slide;
  const position = image ? image.position ?? (stat ? "samping" : "bawah") : undefined;
  const place = position === "samping" && !stat ? "atas" : position;
  const titlePx = stat ? TITLE_WITH_STAT : TITLE_PX[slide.role];
  const bodyPx = stat ? BODY_WITH_STAT : slide.code ? BODY_WITH_CODE : BODY_PX[slide.role];
  const cast = (slide.cast ?? []).slice(0, 3);
  return (
    <AbsoluteFill style={{ backgroundColor: look.bg, padding: PAD, display: "flex", flexDirection: "column", gap: 36, fontFamily: t.fonts.body, overflow: "hidden" }}>
      {slide.role === "hook" && look.onBlue && <HookDecor />}
      {cast.map((cue) => (
        <Sticker key={cue.character} cue={cue} style={style} />
      ))}

      {/* Header: logo 56, judul seri Bold 27, nomor SemiBold 26. */}
      <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20, minWidth: 0 }}>
          <Img src={staticFile(t.logo.src)} style={{ flex: "none", height: 56, width: t.logo.round ? 56 : (56 * t.logo.width) / t.logo.height, borderRadius: t.logo.round ? "50%" : 0, objectFit: "contain" }} />
          <span style={{ color: look.ink, fontSize: 27, fontWeight: 700, letterSpacing: "-0.01em", textTransform: t.type.headlineTransform, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{series}</span>
        </div>
        <span style={{ flex: "none", color: look.muted, fontSize: 26, fontWeight: 600 }}>
          {pad2(index + 1)} / {pad2(total)}
        </span>
      </div>

      {/* Isi: rata kiri, di tengah vertikal. */}
      <div style={{ position: "relative", flex: 1, minHeight: 0, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-start", gap: GAP }}>
        {image && place === "atas" && <Pic image={image} maxHeight={340} />}
        {stat && (
          <>
            <StatBlock stat={stat} look={look} side={place === "samping" ? image : undefined} />
            <div style={{ alignSelf: "stretch", height: 1, backgroundColor: look.rule }} />
          </>
        )}
        {slide.role === "step" && stepNo > 0 && (
          <div style={{ width: 72, height: 72, borderRadius: "50%", backgroundColor: t.colors.primary, color: t.colors.onPrimary, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: t.fonts.heading, fontWeight: 800, fontSize: 32 }}>
            {pad2(stepNo)}
          </div>
        )}
        <Title text={slide.title} accent={slide.accent} look={look} px={titlePx} />
        {slide.paragraphs.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: CONTENT_W }}>
            {slide.paragraphs.map((p, i) => (
              <div key={i} style={{ color: look.body, fontWeight: 400, fontSize: bodyPx, lineHeight: closing ? 1.5 : 1.45 }}>
                {p}
              </div>
            ))}
          </div>
        )}
        {slide.code && <CodeCard lang={slide.code.lang} code={slide.code.code} />}
        {slide.quote && <QuoteCard text={slide.quote} look={look} />}
        {slide.cta && !closing && <CtaCard text={slide.cta} look={look} />}
        {image && place === "bawah" && <Pic image={image} maxHeight={300} />}
      </div>

      {/* Footer: closing = logo 84 + ajakan Bold 28; lainnya = panah 42 (+ "Geser" Bold 27 di slide 1). */}
      {closing ? (
        <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 24 }}>
          <Img src={staticFile(t.logo.src)} style={{ flex: "none", height: 84, width: t.logo.round ? 84 : (84 * t.logo.width) / t.logo.height, borderRadius: t.logo.round ? "50%" : 0, objectFit: "contain" }} />
          <div style={{ color: look.ink, fontWeight: 700, fontSize: 28, lineHeight: 1.3 }}>{slide.cta ?? `Ikuti ${t.handle}`}</div>
        </div>
      ) : (
        <div style={{ position: "relative", height: 42, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 14 }}>
          {!last && (
            <>
              {index === 0 && <span style={{ color: look.ink, fontWeight: 700, fontSize: 27 }}>Geser</span>}
              <Icon name="arrowRight" size={42} color={look.ink} />
            </>
          )}
        </div>
      )}
    </AbsoluteFill>
  );
};

export const CarouselDeck: React.FC<{ readonly theme: string; readonly spec: CarouselSpec }> = ({ theme, spec }) => {
  const frame = useCurrentFrame();
  const index = Math.min(frame, spec.slides.length - 1);
  const stepNo = spec.slides.slice(0, index + 1).filter((s) => s.role === "step").length;
  return (
    <ThemeProvider name={theme}>
      <Slide slide={spec.slides[index]} series={spec.title} index={index} total={spec.slides.length} stepNo={stepNo} style={spec.style} />
    </ThemeProvider>
  );
};
