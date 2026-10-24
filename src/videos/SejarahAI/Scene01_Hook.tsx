import type React from "react";
import {
  Interactive,
  useVideoConfig,
  type InteractivitySchema,
} from "remotion";
import { Backdrop } from "../../Backdrop";
import { headlineSize, themed, themeSchema, useTheme } from "../../themes";
import { Appear, SAFE_PADDING } from "./Appear";

const HookInner: React.FC = () => {
  const t = useTheme();
  const { fps } = useVideoConfig();

  return (
    <>
      <Backdrop variant="ground" label="01 / 08" sweep />
      <Interactive.Div
        name="Content"
        style={{
          position: "absolute",
          inset: 0,
          padding: SAFE_PADDING,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 32,
          fontFamily: t.fonts.heading,
          color: t.colors.groundText,
        }}
      >
        <Appear
          name="Kicker"
          delay={0}
          style={{
            fontFamily: t.fonts.mono,
            fontWeight: 400,
            fontSize: 36,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: t.colors.groundTextMuted,
          }}
        >
          Sejarah AI
        </Appear>
        <Appear
          name="Headline"
          delay={0.5 * fps}
          style={{
            fontSize: headlineSize(t, 112),
            fontWeight: t.type.headlineWeight,
            lineHeight: 1.1,
            letterSpacing: `${t.type.tracking}em`,
          }}
        >
          Kamu pikir AI muncul{" "}
          <span style={{ color: t.colors.groundEmphasis }}>tiba-tiba?</span>
        </Appear>
        <Appear
          name="Subheadline"
          delay={1.8 * fps}
          style={{
            fontFamily: t.fonts.body,
            fontWeight: 500,
            fontSize: 60,
            lineHeight: 1.4,
            color: t.colors.groundTextMuted,
          }}
        >
          Padahal ceritanya panjang banget.
        </Appear>
        <Appear
          name="Teaser"
          delay={2.8 * fps}
          style={{
            fontFamily: t.fonts.body,
            fontWeight: 400,
            fontSize: 48,
            lineHeight: 1.5,
            color: t.colors.groundTextMuted,
          }}
        >
          Yuk, kita flashback dari awal.
        </Appear>
      </Interactive.Div>
    </>
  );
};

const schema = {
  ...themeSchema,
} as const satisfies InteractivitySchema;

export const Scene01_Hook = Interactive.withSchema({
  Component: themed(HookInner),
  componentName: "Scene01_Hook",
  schema,
  wrapInSequence: true,
  layout: "absolute-fill",
});
