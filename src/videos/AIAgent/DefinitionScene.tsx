import type React from "react";
import {
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Backdrop } from "../../Backdrop";
import { headlineSize, themed, themeSchema, useTheme } from "../../themes";

const Chip: React.FC<{
  readonly children: React.ReactNode;
  readonly delay: number;
}> = ({ children, delay }) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <Interactive.Div
      name="Chip"
      style={{
        padding: "22px 48px",
        borderRadius: 999,
        backgroundColor: t.colors.groundChipBg,
        color: t.colors.groundChipText,
        fontFamily: t.fonts.body,
        fontWeight: 600,
        fontSize: 52,
        boxShadow: t.shadows.lift,
        opacity: interpolate(frame, [delay, delay + 0.3 * fps], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
        scale: interpolate(frame, [delay, delay + 0.5 * fps], [0.85, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          // Slight spring: confirmatory state, per motion guidelines.
          easing: Easing.bezier(...t.motion.pop),
          output: "perceptual-scale",
        }),
      }}
    >
      {children}
    </Interactive.Div>
  );
};

const DefinitionInner: React.FC = () => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <>
      <Backdrop variant="ground" />
      <Interactive.Div
        name="Content"
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 36,
          fontFamily: t.fonts.heading,
          fontWeight: t.type.headlineWeight,
          textTransform: t.type.headlineTransform,
          color: t.colors.groundText,
        }}
      >
        <Interactive.Div
          name="Chatbot line"
          style={{
            fontSize: headlineSize(t, 84),
            color: t.colors.groundTextMuted,
            textDecoration: "line-through",
            textDecorationThickness: 6,
            textDecorationColor: `rgba(255, 255, 255, ${interpolate(frame, [1.2 * fps, 1.6 * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
            opacity: interpolate(frame, [0, 0.5 * fps], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          Chatbot menjawab.
        </Interactive.Div>
        <Interactive.Div
          name="Agent line"
          style={{
            fontSize: headlineSize(t, 132),
            letterSpacing: `${t.type.tracking}em`,
            opacity: interpolate(frame, [1.6 * fps, 2.2 * fps], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            translate: interpolate(
              frame,
              [1.6 * fps, 2.4 * fps],
              ["0px 40px", "0px 0px"],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(...t.motion.enter),
              },
            ),
          }}
        >
          AI Agent{" "}
          <span style={{ color: t.colors.groundEmphasis }}>bertindak.</span>
        </Interactive.Div>
        <div style={{ display: "flex", gap: 32, marginTop: 40 }}>
          <Chip delay={3 * fps}>berpikir</Chip>
          <Chip delay={3.5 * fps}>merencanakan</Chip>
          <Chip delay={4 * fps}>mengeksekusi</Chip>
        </div>
      </Interactive.Div>
    </>
  );
};

export const DefinitionScene = Interactive.withSchema({
  Component: themed(DefinitionInner),
  componentName: "DefinitionScene",
  schema: { ...themeSchema },
  wrapInSequence: true,
  layout: "absolute-fill",
});
