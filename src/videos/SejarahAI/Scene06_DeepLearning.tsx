import type React from "react";
import {
  Interactive,
  useVideoConfig,
  type InteractivitySchema,
} from "remotion";
import { Backdrop } from "../../Backdrop";
import { headlineSize, themed, themeSchema, useTheme } from "../../themes";
import { Appear, SAFE_PADDING } from "./Appear";

const Chip: React.FC<{
  readonly children: React.ReactNode;
  readonly delay: number;
}> = ({ children, delay }) => {
  const t = useTheme();

  return (
    <Appear
      name={`Chip`}
      delay={delay}
      style={{
        display: "inline-flex",
        alignSelf: "flex-start",
        paddingTop: 14,
        paddingBottom: 14,
        paddingLeft: 28,
        paddingRight: 28,
        borderRadius: 999,
        backgroundColor: t.colors.primaryTint,
        fontFamily: t.fonts.mono,
        fontWeight: 500,
        fontSize: 42,
        color: t.colors.primaryDark,
        lineHeight: 1.3,
      }}
    >
      {children}
    </Appear>
  );
};

const Scene06Inner: React.FC = () => {
  const t = useTheme();
  const { fps } = useVideoConfig();

  return (
    <>
      <Backdrop variant="canvas" label="06 / 08" />
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
        }}
      >
        <Appear
          name="Tahun"
          delay={0}
          style={{
            fontFamily: t.fonts.mono,
            fontSize: 40,
            letterSpacing: "0.12em",
            color: t.colors.accent,
          }}
        >
          2012
        </Appear>
        <Appear
          name="Headline"
          delay={0.4 * fps}
          style={{
            fontSize: headlineSize(t, 108),
            fontWeight: t.type.headlineWeight,
            lineHeight: 1.1,
            letterSpacing: `${t.type.tracking}em`,
          }}
        >
          Revolusi{" "}
          <span style={{ color: t.colors.primary }}>diam-diam.</span>
        </Appear>
        <Appear
          name="Body 1"
          delay={1.2 * fps}
          style={{
            fontFamily: t.fonts.body,
            fontWeight: 400,
            fontSize: 52,
            lineHeight: 1.5,
            color: t.colors.muted,
          }}
        >
          AlexNet muncul. Neural network dalam (deep learning) tiba-tiba jauh
          lebih pintar dari semua pendekatan sebelumnya.
        </Appear>
        <Chip delay={2.4 * fps}>ImageNet 2012 — error rate turun drastis</Chip>
        <Chip delay={3 * fps}>GPU + data besar + algoritma baru</Chip>
        <Chip delay={3.6 * fps}>Era deep learning resmi mulai</Chip>
        <Appear
          name="Penutup"
          delay={4.6 * fps}
          style={{
            fontFamily: t.fonts.body,
            fontWeight: 600,
            fontSize: 54,
            lineHeight: 1.45,
            color: t.colors.ink,
            marginTop: 8,
          }}
        >
          Setelah itu? GPT. DALL-E. Gemini. Claude.{" "}
          <span style={{ color: t.colors.accent }}>
            Semuanya lahir dari revolusi ini.
          </span>
        </Appear>
      </Interactive.Div>
    </>
  );
};

const schema = {
  ...themeSchema,
} as const satisfies InteractivitySchema;

export const Scene06_DeepLearning = Interactive.withSchema({
  Component: themed(Scene06Inner),
  componentName: "Scene06_DeepLearning",
  schema,
  wrapInSequence: true,
  layout: "absolute-fill",
});
