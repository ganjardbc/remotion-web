import type React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { ClaudeCode, ClaudeCodeStickman, Ganjar, GanjarStickman, Robot, RobotStickman, type Gesture } from "../../assets/characters";
import { ThemeProvider, useTheme, type Theme } from "../../themes";
import { ganjarClip, HEIGHT, robotClip, size } from "./Stage";
import type { CarouselMeta, CarouselSlide, CastCue, CharacterId, VisualStyle } from "./types";

// Carousel 4:5 dari draft content_studio, satu frame = satu slide (fps 1). Bentuknya mengikuti template social
// design system (insell-design-system/social): cover dan closing di bidang `ground` tema, detail di `canvas`, logo dan
// handle di atas, teks di tengah, pemeran di panel bawah, nomor slide di bawah. Semua warna dan huruf dari tema.

export const CAROUSEL_WIDTH = 1080;
export const CAROUSEL_HEIGHT = 1350;
const PAD = 72;
const PANEL_W = CAROUSEL_WIDTH - 2 * PAD;
const PANEL_H = 470;
// Pemeran lebih kecil dari di Reels supaya muat di panel; stickman lebih ramping, jadi boleh lebih besar.
const CAST_SCALE: Readonly<Record<VisualStyle, number>> = { rig: 0.55, stickman: 0.65 };
const SLOTS: Readonly<Record<number, readonly number[]>> = { 1: [PANEL_W / 2], 2: [PANEL_W * 0.3, PANEL_W * 0.7], 3: [PANEL_W * 0.2, PANEL_W / 2, PANEL_W * 0.8] };
const ORDER = { kiri: 0, tengah: 1, kanan: 2 } as const;

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

const CastPanel: React.FC<{ readonly cast: readonly CastCue[]; readonly style: VisualStyle; readonly bg: string }> = ({ cast, style, bg }) => {
  const t = useTheme();
  const sorted = [...cast].sort((a, b) => ORDER[a.position] - ORDER[b.position]).slice(0, 3);
  const xs = SLOTS[sorted.length] ?? SLOTS[3];
  const floor = PANEL_H - 36;
  return (
    <div style={{ position: "relative", width: PANEL_W, height: PANEL_H, borderRadius: t.radius.large, backgroundColor: bg, overflow: "hidden", flex: "none" }}>
      {sorted.map((cue, i) => {
        const who: CharacterId = cue.character;
        const h = HEIGHT[style][who] * CAST_SCALE[style];
        const s = size(who, style, h);
        const others = xs.filter((_, j) => j !== i);
        const toward = others.length ? Math.sign(others[0] - xs[i]) : 0;
        return (
          <div key={who} style={{ position: "absolute", left: xs[i] - s.width / 2, top: s.top(floor) }}>
            <Pose cue={cue} style={style} h={h} toward={toward} />
          </div>
        );
      })}
    </div>
  );
};

type Look = { readonly bg: string; readonly ink: string; readonly muted: string; readonly panel: string };

const lookOf = (t: Theme, onGround: boolean): Look =>
  onGround
    ? { bg: t.colors.ground, ink: t.colors.groundText, muted: t.colors.groundTextMuted, panel: t.colors.surface }
    : { bg: t.colors.canvas, ink: t.colors.ink, muted: t.colors.muted, panel: t.colors.primaryTint };

const Slide: React.FC<{ readonly slide: CarouselSlide; readonly index: number; readonly total: number; readonly style: VisualStyle }> = ({ slide, index, total, style }) => {
  const t = useTheme();
  const onGround = slide.role !== "detail";
  const look = lookOf(t, onGround);
  const detailNumber = String(index).padStart(2, "0");
  const hasCast = slide.cast.length > 0;
  const headline = slide.role === "cover" ? 76 : slide.role === "closing" ? 64 : 58;
  const logoH = 52;
  return (
    <AbsoluteFill style={{ backgroundColor: look.bg, padding: PAD, display: "flex", flexDirection: "column", gap: 36, fontFamily: t.fonts.body, overflow: "hidden" }}>
      {onGround && (
        <div
          style={{
            position: "absolute",
            width: 640,
            height: 640,
            borderRadius: "50%",
            backgroundColor: t.colors.primaryDeep,
            opacity: 0.5,
            ...(slide.role === "cover" ? { top: -200, right: -200 } : { bottom: -240, left: -180 }),
          }}
        />
      )}
      <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {/* Logo lebar (wordmark) bisa sewarna bidang ground, jadi diberi alas surface di cover dan closing. */}
          <div style={onGround && !t.logo.round ? { padding: "8px 14px", borderRadius: t.radius.card, backgroundColor: t.colors.surface, display: "flex" } : { display: "flex" }}>
            <Img
              src={staticFile(t.logo.src)}
              style={{ height: logoH, width: t.logo.round ? logoH : (logoH * t.logo.width) / t.logo.height, borderRadius: t.logo.round ? "50%" : 0, objectFit: "contain" }}
            />
          </div>
          <span style={{ color: look.ink, fontSize: 26, fontWeight: 600 }}>{t.handle}</span>
        </div>
        {slide.role === "detail" && (
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              backgroundColor: t.colors.primary,
              color: t.colors.onPrimary,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: t.fonts.heading,
              fontWeight: t.type.headlineWeight,
              fontSize: 28,
            }}
          >
            {detailNumber}
          </div>
        )}
      </div>

      <div
        style={{
          position: "relative",
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: slide.role === "closing" ? "center" : "flex-start",
          textAlign: slide.role === "closing" ? "center" : "left",
          gap: 24,
        }}
      >
        <div
          style={{
            color: look.ink,
            fontFamily: t.fonts.heading,
            fontWeight: t.type.headlineWeight,
            fontSize: Math.round(headline * t.type.scale),
            lineHeight: 1.08,
            letterSpacing: `${t.type.tracking}em`,
            textTransform: t.type.headlineTransform,
            textWrap: "balance",
            maxWidth: 920,
          }}
        >
          {slide.headline}
        </div>
        {slide.body && <div style={{ color: look.muted, fontSize: 30, lineHeight: 1.45, textWrap: "pretty", maxWidth: 860 }}>{slide.body}</div>}
        {slide.role === "closing" && (
          <div
            style={{
              marginTop: 12,
              padding: "18px 40px",
              borderRadius: t.radius.card,
              backgroundColor: t.colors.groundChipBg,
              color: t.colors.groundChipText,
              fontWeight: 700,
              fontSize: 28,
            }}
          >
            Ikuti {t.handle}
          </div>
        )}
      </div>

      {hasCast && <CastPanel cast={slide.cast} style={style} bg={look.panel} />}

      <div style={{ position: "relative", display: "flex", justifyContent: "space-between", color: look.muted, fontSize: 22 }}>
        <span>{index + 1 < total ? "Geser →" : "Simpan untuk nanti"}</span>
        <span>
          {index + 1}/{total}
        </span>
      </div>
    </AbsoluteFill>
  );
};

export const CarouselDeck: React.FC<{ readonly theme: string; readonly meta: CarouselMeta; readonly slides: readonly CarouselSlide[] }> = ({ theme, meta, slides }) => {
  const frame = useCurrentFrame();
  const index = Math.min(frame, slides.length - 1);
  return (
    <ThemeProvider name={theme}>
      <Slide slide={slides[index]} index={index} total={slides.length} style={meta.style} />
    </ThemeProvider>
  );
};
