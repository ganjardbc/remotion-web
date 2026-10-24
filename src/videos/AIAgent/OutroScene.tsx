import type React from "react";
import {
  CanvasImage,
  Easing,
  Interactive,
  staticFile,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  type InteractivitySchema,
} from "remotion";
import { Backdrop } from "../../Backdrop";
import { headlineSize, themed, themeSchema, useTheme } from "../../themes";

type OutroProps = {
  readonly tagline: string;
};

const OutroInner: React.FC<OutroProps> = ({ tagline }) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

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
          gap: 12,
          fontFamily: t.fonts.heading,
          fontWeight: 700,
          color: t.colors.ink,
          opacity: interpolate(
            frame,
            [durationInFrames - 0.8 * fps, durationInFrames],
            [1, 0],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            },
          ),
        }}
      >
        <Interactive.Div
          name="From"
          style={{
            fontSize: headlineSize(t, 96),
            fontWeight: t.type.headlineWeight,
            textTransform: t.type.headlineTransform,
            color: t.colors.muted,
            opacity: interpolate(frame, [0, 0.5 * fps], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          Dari menjawab
        </Interactive.Div>
        <Interactive.Div
          name="To"
          style={{
            fontSize: headlineSize(t, 160),
            fontWeight: t.type.headlineWeight,
            textTransform: t.type.headlineTransform,
            letterSpacing: `${t.type.tracking}em`,
            color: t.colors.accent,
            opacity: interpolate(frame, [0.8 * fps, 1.3 * fps], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            translate: interpolate(
              frame,
              [0.8 * fps, 1.6 * fps],
              ["0px 40px", "0px 0px"],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(...t.motion.enter),
              },
            ),
          }}
        >
          ke mengerjakan.
        </Interactive.Div>
        <Interactive.Div
          name="Tagline"
          style={{
            marginTop: 60,
            fontFamily: t.fonts.body,
            fontWeight: 500,
            fontSize: 48,
            color: t.colors.ink,
            opacity: interpolate(frame, [2.2 * fps, 2.8 * fps], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          {tagline}
        </Interactive.Div>
        <CanvasImage
          name="Insell logo"
          src={staticFile(t.logo.src)}
          premountFor={fps}
          style={{
            marginTop: 70,
            width: t.logo.width,
            height: t.logo.height,
            borderRadius: t.logo.round ? 999 : 0,
            opacity: interpolate(frame, [3 * fps, 3.6 * fps], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        />
      </Interactive.Div>
    </>
  );
};

const outroSchema = {
  ...themeSchema,
  tagline: {
    type: "string",
    default: "AI Agent, rekan kerja digital Anda.",
    description: "Tagline",
  },
} as const satisfies InteractivitySchema;

export const OutroScene = Interactive.withSchema({
  Component: themed(OutroInner),
  componentName: "OutroScene",
  schema: outroSchema,
  wrapInSequence: true,
  layout: "absolute-fill",
});
