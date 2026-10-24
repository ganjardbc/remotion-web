import type React from "react";
import {
  Interactive,
  useVideoConfig,
  type InteractivitySchema,
} from "remotion";
import { Backdrop } from "../../Backdrop";
import { headlineSize, themed, themeSchema, useTheme } from "../../themes";
import { Appear, SAFE_PADDING } from "./Appear";

const Scene03Inner: React.FC = () => {
  const t = useTheme();
  const { fps } = useVideoConfig();

  return (
    <>
      <Backdrop variant="ground" label="03 / 08" />
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
          color: t.colors.groundText,
        }}
      >
        <Appear
          name="Tahun"
          delay={0}
          style={{
            fontFamily: t.fonts.mono,
            fontWeight: 400,
            fontSize: 40,
            letterSpacing: "0.12em",
            color: t.colors.groundEmphasis,
          }}
        >
          1950
        </Appear>
        <Appear
          name="Headline"
          delay={0.4 * fps}
          style={{
            fontSize: headlineSize(t, 104),
            fontWeight: t.type.headlineWeight,
            lineHeight: 1.1,
            letterSpacing: `${t.type.tracking}em`,
          }}
        >
          Alan Turing bikin satu pertanyaan.
        </Appear>
        <Appear
          name="Pertanyaan"
          delay={1.4 * fps}
          style={{
            fontFamily: t.fonts.body,
            fontWeight: 700,
            fontSize: 80,
            lineHeight: 1.3,
            color: t.colors.groundEmphasis,
            borderLeft: `6px solid ${t.colors.groundEmphasis}`,
            paddingLeft: 32,
            marginTop: 8,
            marginBottom: 8,
          }}
        >
          "Bisakah mesin berpikir?"
        </Appear>
        <Appear
          name="Baris 1"
          delay={2.6 * fps}
          style={{
            fontFamily: t.fonts.body,
            fontWeight: 400,
            fontSize: 52,
            lineHeight: 1.5,
            color: t.colors.groundTextMuted,
          }}
        >
          Pertanyaan itu mengubah segalanya.
        </Appear>
        <Appear
          name="Baris 2"
          delay={3.4 * fps}
          style={{
            fontFamily: t.fonts.body,
            fontWeight: 500,
            fontSize: 52,
            lineHeight: 1.5,
            color: t.colors.groundTextMuted,
          }}
        >
          Turing Test lahir — cara ngetes apakah mesin bisa pura-pura jadi
          manusia dalam percakapan teks.
        </Appear>
      </Interactive.Div>
    </>
  );
};

const schema = {
  ...themeSchema,
} as const satisfies InteractivitySchema;

export const Scene03_AlanTuring = Interactive.withSchema({
  Component: themed(Scene03Inner),
  componentName: "Scene03_AlanTuring",
  schema,
  wrapInSequence: true,
  layout: "absolute-fill",
});
