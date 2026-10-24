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
import { Icon } from "../../icons";
import { headlineSize, themed, themeSchema, useTheme } from "../../themes";
import { Appear, SAFE_PADDING } from "./Appear";

type HookProps = {
  readonly title: string;
  readonly subtitle: string;
};

const HookInner: React.FC<HookProps> = ({ title, subtitle }) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dot = title.indexOf(".");

  return (
    <>
      <Backdrop label="01 / 05" sweep />
      <Interactive.Div
        name="Content"
        style={{
          position: "absolute",
          inset: 0,
          padding: SAFE_PADDING,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 40,
          textAlign: "center",
          fontFamily: t.fonts.heading,
          color: t.colors.ink,
        }}
      >
        <Interactive.Div
          name="File icon"
          style={{
            width: 240,
            height: 240,
            borderRadius: t.radius.large,
            backgroundColor: t.colors.primaryTint,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: t.shadows.md,
            scale: interpolate(frame, [0, 0.8 * fps], [0.6, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(...t.motion.pop),
              output: "perceptual-scale",
            }),
          }}
        >
          <Icon name="fileText" size={128} color={t.colors.primaryDark} />
        </Interactive.Div>
        <Appear
          name="Kicker"
          delay={0.4 * fps}
          style={{
            fontFamily: t.fonts.body,
            fontWeight: 600,
            fontSize: 44,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: t.colors.primaryDark,
          }}
        >
          Contoh penggunaan
        </Appear>
        <Appear
          name="Title"
          delay={0.7 * fps}
          style={{
            fontSize: headlineSize(t, 168),
            fontWeight: t.type.headlineWeight,
            textTransform: t.type.headlineTransform,
            lineHeight: 1.05,
            letterSpacing: `${t.type.tracking}em`,
          }}
        >
          {dot < 0 ? title : title.slice(0, dot)}
          <span style={{ color: t.colors.accent }}>
            {dot < 0 ? "" : title.slice(dot)}
          </span>
        </Appear>
        <Appear
          name="Subtitle"
          delay={1.6 * fps}
          style={{
            fontFamily: t.fonts.body,
            fontWeight: 500,
            fontSize: 56,
            lineHeight: 1.35,
            color: t.colors.muted,
          }}
        >
          {subtitle}
        </Appear>
      </Interactive.Div>
    </>
  );
};

const hookSchema = {
  ...themeSchema,
  title: { type: "string", default: "CLAUDE.md", description: "Title" },
  subtitle: {
    type: "string",
    default: "Ingatan permanen untuk project kamu.",
    description: "Subtitle",
  },
} as const satisfies InteractivitySchema;

export const HookScene = Interactive.withSchema({
  Component: themed(HookInner),
  componentName: "HookScene",
  schema: hookSchema,
  wrapInSequence: true,
  layout: "absolute-fill",
});
