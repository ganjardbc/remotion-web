import type React from "react";
import {
  Interactive,
  useVideoConfig,
  type InteractivitySchema,
} from "remotion";
import { Backdrop } from "../../Backdrop";
import { headlineSize, themed, themeSchema, useTheme } from "../../themes";
import { Appear, SAFE_PADDING } from "./Appear";

type OutroProps = {
  readonly cta: string;
};

const OutroInner: React.FC<OutroProps> = ({ cta }) => {
  const t = useTheme();
  const { fps } = useVideoConfig();

  return (
    <>
      <Backdrop variant="canvas" label="08 / 08" />
      <Interactive.Div
        name="Content"
        style={{
          position: "absolute",
          inset: 0,
          padding: SAFE_PADDING,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 36,
          textAlign: "center",
          fontFamily: t.fonts.heading,
          color: t.colors.ink,
        }}
      >
        <Appear
          name="Angka"
          delay={0}
          style={{
            fontFamily: t.fonts.mono,
            fontWeight: 700,
            fontSize: 120,
            letterSpacing: "-0.02em",
            color: t.colors.primary,
            lineHeight: 1,
          }}
        >
          70+
        </Appear>
        <Appear
          name="Headline"
          delay={0.6 * fps}
          style={{
            fontSize: headlineSize(t, 108),
            fontWeight: t.type.headlineWeight,
            lineHeight: 1.15,
            letterSpacing: `${t.type.tracking}em`,
          }}
        >
          tahun perjalanan.
        </Appear>
        <Appear
          name="Subheadline"
          delay={1.4 * fps}
          style={{
            fontFamily: t.fonts.body,
            fontWeight: 500,
            fontSize: 60,
            lineHeight: 1.4,
            color: t.colors.muted,
          }}
        >
          Dan kita baru di awal.
        </Appear>
        <Appear
          name="Divider"
          delay={2.2 * fps}
          style={{
            width: 80,
            height: 3,
            backgroundColor: t.colors.accent,
            borderRadius: 999,
          }}
        >
          {" "}
        </Appear>
        <Appear
          name="CTA"
          delay={2.8 * fps}
          style={{
            fontFamily: t.fonts.body,
            fontWeight: 600,
            fontSize: 56,
            lineHeight: 1.45,
            color: t.colors.accent,
          }}
        >
          {cta}
        </Appear>
      </Interactive.Div>
    </>
  );
};

const schema = {
  ...themeSchema,
  cta: {
    type: "string" as const,
    default: "Mau tau lebih dalam? Follow dulu.",
    description: "Call to action",
  },
} as const satisfies InteractivitySchema;

export const Scene08_Outro = Interactive.withSchema({
  Component: themed(OutroInner),
  componentName: "Scene08_Outro",
  schema,
  wrapInSequence: true,
  layout: "absolute-fill",
});
