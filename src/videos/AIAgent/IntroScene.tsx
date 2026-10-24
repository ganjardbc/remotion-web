import type React from "react";
import {
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  type InteractivitySchema,
} from "remotion";
import { Backdrop } from "../../Backdrop";
import { headlineSize, themed, themeSchema, useTheme } from "../../themes";

type IntroProps = {
  readonly title: string;
  readonly subtitle: string;
};

const IntroInner: React.FC<IntroProps> = ({ title, subtitle }) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <>
      <Backdrop />
      <Interactive.Div
        name="Content"
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 24,
          fontFamily: t.fonts.heading,
          color: t.colors.ink,
        }}
      >
        <Interactive.Div
          name="Kicker"
          style={{
            fontFamily: t.fonts.body,
            fontWeight: 600,
            fontSize: 40,
            letterSpacing: 8,
            color: t.colors.primaryDark,
            opacity: interpolate(frame, [0, 0.6 * fps], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            translate: interpolate(
              frame,
              [0, 0.8 * fps],
              ["0px 30px", "0px 0px"],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(...t.motion.enter),
              },
            ),
          }}
        >
          MENGENAL
        </Interactive.Div>
        <Interactive.Div
          name="Title"
          style={{
            fontSize: headlineSize(t, 220),
            fontWeight: t.type.headlineWeight,
            textTransform: t.type.headlineTransform,
            lineHeight: 1,
            letterSpacing: `${t.type.tracking}em`,
            opacity: interpolate(frame, [0.3 * fps, 1 * fps], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            scale: interpolate(frame, [0.3 * fps, 1.4 * fps], [0.8, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.spring({ damping: 200 }),
              output: "perceptual-scale",
            }),
          }}
        >
          {title.slice(0, title.lastIndexOf(" ") + 1)}
          <span style={{ color: t.colors.accent }}>
            {title.slice(title.lastIndexOf(" ") + 1)}
          </span>
        </Interactive.Div>
        <Interactive.Div
          name="Subtitle"
          style={{
            fontFamily: t.fonts.body,
            fontSize: 64,
            fontWeight: 500,
            color: t.colors.muted,
            opacity: interpolate(frame, [1.6 * fps, 2.3 * fps], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            translate: interpolate(
              frame,
              [1.6 * fps, 2.4 * fps],
              ["0px 30px", "0px 0px"],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(...t.motion.enter),
              },
            ),
          }}
        >
          {subtitle}
        </Interactive.Div>
      </Interactive.Div>
    </>
  );
};

const introSchema = {
  ...themeSchema,
  title: { type: "string", default: "AI Agent", description: "Title" },
  subtitle: {
    type: "string",
    default: "Bukan sekadar chatbot.",
    description: "Subtitle",
  },
} as const satisfies InteractivitySchema;

export const IntroScene = Interactive.withSchema({
  Component: themed(IntroInner),
  componentName: "IntroScene",
  schema: introSchema,
  wrapInSequence: true,
  layout: "absolute-fill",
});
