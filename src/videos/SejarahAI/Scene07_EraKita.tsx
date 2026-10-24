import type React from "react";
import {
  Interactive,
  useVideoConfig,
  type InteractivitySchema,
} from "remotion";
import { Backdrop } from "../../Backdrop";
import { headlineSize, themed, themeSchema, useTheme } from "../../themes";
import { Appear, SAFE_PADDING } from "./Appear";

const Scene07Inner: React.FC = () => {
  const t = useTheme();
  const { fps } = useVideoConfig();

  return (
    <>
      <Backdrop variant="ground" label="07 / 08" sweep />
      <Interactive.Div
        name="Content"
        style={{
          position: "absolute",
          inset: 0,
          padding: SAFE_PADDING,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 40,
          fontFamily: t.fonts.heading,
          color: t.colors.groundText,
        }}
      >
        <Appear
          name="Headline"
          delay={0}
          style={{
            fontSize: headlineSize(t, 112),
            fontWeight: t.type.headlineWeight,
            lineHeight: 1.1,
            letterSpacing: `${t.type.tracking}em`,
          }}
        >
          Sekarang, AI ada{" "}
          <span style={{ color: t.colors.groundEmphasis }}>di mana-mana.</span>
        </Appear>
        <Appear
          name="Baris 1"
          delay={1.2 * fps}
          style={{
            fontFamily: t.fonts.body,
            fontWeight: 400,
            fontSize: 54,
            lineHeight: 1.5,
            color: t.colors.groundTextMuted,
          }}
        >
          Dari asisten suara di HP kamu, rekomendasi Netflix, sampai tools yang
          bantu kamu nulis, ngoding, dan brainstorm.
        </Appear>
        <Appear
          name="Baris 2"
          delay={2.6 * fps}
          style={{
            fontFamily: t.fonts.body,
            fontWeight: 400,
            fontSize: 54,
            lineHeight: 1.5,
            color: t.colors.groundTextMuted,
          }}
        >
          Semua itu bukan keajaiban yang tiba-tiba ada.
        </Appear>
        <Appear
          name="Aksen"
          delay={3.6 * fps}
          style={{
            fontFamily: t.fonts.body,
            fontWeight: 700,
            fontSize: 60,
            lineHeight: 1.35,
            color: t.colors.groundEmphasis,
          }}
        >
          Kita hidup di tengah revolusi yang sedang terjadi.
        </Appear>
      </Interactive.Div>
    </>
  );
};

const schema = {
  ...themeSchema,
} as const satisfies InteractivitySchema;

export const Scene07_EraKita = Interactive.withSchema({
  Component: themed(Scene07Inner),
  componentName: "Scene07_EraKita",
  schema,
  wrapInSequence: true,
  layout: "absolute-fill",
});
