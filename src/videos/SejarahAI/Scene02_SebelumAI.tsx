import type React from "react";
import {
  Interactive,
  useVideoConfig,
  type InteractivitySchema,
} from "remotion";
import { Backdrop } from "../../Backdrop";
import { headlineSize, themed, themeSchema, useTheme } from "../../themes";
import { Appear, SAFE_PADDING } from "./Appear";

const Scene02Inner: React.FC = () => {
  const t = useTheme();
  const { fps } = useVideoConfig();

  return (
    <>
      <Backdrop variant="canvas" label="02 / 08" />
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
          color: t.colors.ink,
        }}
      >
        <Appear
          name="Headline"
          delay={0}
          style={{
            fontSize: headlineSize(t, 100),
            fontWeight: t.type.headlineWeight,
            lineHeight: 1.1,
            letterSpacing: `${t.type.tracking}em`,
            marginBottom: 16,
          }}
        >
          Sebelum ada istilah{" "}
          <span style={{ color: t.colors.primary }}>'AI'...</span>
        </Appear>
        <Appear
          name="Baris 1"
          delay={1 * fps}
          style={{
            fontFamily: t.fonts.body,
            fontWeight: 500,
            fontSize: 56,
            lineHeight: 1.5,
            color: t.colors.ink,
          }}
        >
          Manusia udah lama mimpi punya mesin yang bisa berpikir.
        </Appear>
        <Appear
          name="Baris 2"
          delay={2.2 * fps}
          style={{
            fontFamily: t.fonts.body,
            fontWeight: 400,
            fontSize: 52,
            lineHeight: 1.5,
            color: t.colors.muted,
          }}
        >
          Dari patung Galatea di mitologi Yunani — yang konon hidup karena cinta
          penciptanya...
        </Appear>
        <Appear
          name="Baris 3"
          delay={3.6 * fps}
          style={{
            fontFamily: t.fonts.body,
            fontWeight: 400,
            fontSize: 52,
            lineHeight: 1.5,
            color: t.colors.muted,
          }}
        >
          ...sampai automata mekanik abad ke-18 yang bisa nulis dan main musik.
        </Appear>
        <Appear
          name="Penutup"
          delay={4.8 * fps}
          style={{
            fontFamily: t.fonts.body,
            fontWeight: 600,
            fontSize: 54,
            lineHeight: 1.4,
            color: t.colors.primary,
          }}
        >
          Impian itu akhirnya dapat nama: Artificial Intelligence.
        </Appear>
      </Interactive.Div>
    </>
  );
};

const schema = {
  ...themeSchema,
} as const satisfies InteractivitySchema;

export const Scene02_SebelumAI = Interactive.withSchema({
  Component: themed(Scene02Inner),
  componentName: "Scene02_SebelumAI",
  schema,
  wrapInSequence: true,
  layout: "absolute-fill",
});
