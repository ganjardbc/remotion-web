import type React from "react";
import {
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  type InteractivitySchema,
} from "remotion";
import { Backdrop } from "../../Backdrop";
import { Icon } from "../../icons";
import { headlineSize, themed, themeSchema, useTheme } from "../../themes";
import { Appear, SAFE_PADDING } from "./Appear";

const Place: React.FC<{
  readonly icon: "folder" | "globe" | "fileText";
  readonly title: string;
  readonly note: string;
  readonly delay: number;
}> = ({ icon, title, note, delay }) => {
  const t = useTheme();

  return (
    <Appear
      name={title}
      delay={delay}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 36,
        padding: "32px 40px",
        borderRadius: t.radius.card,
        backgroundColor: t.colors.surface,
        border: `2px solid ${t.colors.border}`,
        boxShadow: t.shadows.md,
      }}
    >
      <div
        style={{
          width: 112,
          height: 112,
          flexShrink: 0,
          borderRadius: 999,
          backgroundColor: t.colors.primaryTint,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon name={icon} size={60} color={t.colors.primaryDark} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div
          style={{
            fontFamily: t.fonts.heading,
            fontWeight: 700,
            fontSize: 48,
            color: t.colors.ink,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontFamily: t.fonts.body,
            fontWeight: 500,
            fontSize: 44,
            color: t.colors.muted,
          }}
        >
          {note}
        </div>
      </div>
    </Appear>
  );
};

type TipsProps = {
  readonly cta: string;
};

const TipsInner: React.FC<TipsProps> = ({ cta }) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  return (
    <>
      <Backdrop label="05 / 05" />
      <Interactive.Div
        name="Content"
        style={{
          position: "absolute",
          inset: 0,
          padding: SAFE_PADDING,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 36,
          fontFamily: t.fonts.heading,
          color: t.colors.ink,
          opacity: interpolate(
            frame,
            [durationInFrames - 0.6 * fps, durationInFrames],
            [1, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          ),
        }}
      >
        <Appear
          name="Headline"
          delay={0}
          style={{
            fontSize: headlineSize(t, 104),
            fontWeight: t.type.headlineWeight,
            textTransform: t.type.headlineTransform,
            lineHeight: 1.1,
            letterSpacing: `${t.type.tracking}em`,
          }}
        >
          Taruh di <span style={{ color: t.colors.accent }}>mana?</span>
        </Appear>
        <Place
          icon="folder"
          title="Root project"
          note="Aturan project ini"
          delay={0.6 * fps}
        />
        <Place
          icon="globe"
          title="~/.claude/CLAUDE.md"
          note="Preferensi pribadimu"
          delay={1.3 * fps}
        />
        <Place
          icon="fileText"
          title="Subfolder"
          note="Aturan khusus folder"
          delay={2 * fps}
        />
        <Appear
          name="Tips init"
          delay={3.2 * fps}
          style={{
            alignSelf: "flex-start",
            padding: "24px 40px",
            borderRadius: 999,
            backgroundColor: t.code.bg,
            color: t.code.text,
            fontFamily: t.fonts.mono,
            fontSize: 44,
          }}
        >
          /init <span style={{ color: t.code.muted }}>buat draf awal</span>
        </Appear>
        <Appear
          name="Ajakan"
          delay={4.4 * fps}
          style={{
            marginTop: 8,
            fontFamily: t.fonts.heading,
            fontWeight: 700,
            fontSize: 56,
            color: t.colors.ink,
          }}
        >
          {cta}
        </Appear>
      </Interactive.Div>
    </>
  );
};

const tipsSchema = {
  ...themeSchema,
  cta: { type: "string", default: "Simpan buat nanti.", description: "CTA" },
} as const satisfies InteractivitySchema;

export const TipsScene = Interactive.withSchema({
  Component: themed(TipsInner),
  componentName: "TipsScene",
  schema: tipsSchema,
  wrapInSequence: true,
  layout: "absolute-fill",
});
