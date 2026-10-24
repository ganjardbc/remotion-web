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
import { Appear, SAFE_PADDING } from "../ClaudeMd/Appear";

type HookProps = {
  readonly command: string;
};

const HookInner: React.FC<HookProps> = ({ command }) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // Slow, continuous spin keeps the "loop" idea moving from frame 0.
  const spin = interpolate(frame, [0, 4 * fps], [0, 360], {
    extrapolateRight: "extend",
  });

  return (
    <>
      <Backdrop variant="ground" label="01 / 05" sweep />
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
          gap: 48,
          textAlign: "center",
          fontFamily: t.fonts.heading,
          color: t.colors.groundText,
        }}
      >
        <Interactive.Div
          name="Loop icon"
          style={{
            width: 200,
            height: 200,
            borderRadius: t.radius.large,
            backgroundColor: t.colors.groundChipBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: t.shadows.lift,
            scale: interpolate(frame, [0, 0.5 * fps], [0.7, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(...t.motion.pop),
              output: "perceptual-scale",
            }),
          }}
        >
          <div style={{ rotate: `${spin}deg`, display: "flex" }}>
            <Icon name="repeat" size={112} color={t.colors.accent} />
          </div>
        </Interactive.Div>
        <Appear
          name="Headline"
          delay={0.1 * fps}
          style={{
            fontSize: headlineSize(t, 132),
            fontWeight: t.type.headlineWeight,
            textTransform: t.type.headlineTransform,
            lineHeight: 1.05,
            letterSpacing: `${t.type.tracking}em`,
          }}
        >
          Stop ketik prompt yang{" "}
          <span style={{ color: t.colors.groundEmphasis }}>sama.</span>
        </Appear>
        <Appear
          name="Command"
          delay={1 * fps}
          style={{
            padding: "28px 48px",
            borderRadius: t.radius.card,
            backgroundColor: t.code.raised,
            border: `1px solid ${t.code.line}`,
            boxShadow: t.shadows.lift,
            fontFamily: t.fonts.mono,
            fontSize: 52,
            color: t.code.text,
          }}
        >
          <span style={{ color: t.colors.accent }}>/loop</span> {command}
        </Appear>
        <Appear
          name="Subtitle"
          delay={2 * fps}
          style={{
            fontFamily: t.fonts.body,
            fontWeight: 600,
            fontSize: 56,
            color: t.colors.groundTextMuted,
          }}
        >
          Satu command. Claude jalan terus.
        </Appear>
      </Interactive.Div>
    </>
  );
};

const hookSchema = {
  ...themeSchema,
  command: {
    type: "string",
    default: "5m cek status deploy",
    description: "Example command",
  },
} as const satisfies InteractivitySchema;

export const HookScene = Interactive.withSchema({
  Component: themed(HookInner),
  componentName: "LoopHookScene",
  schema: hookSchema,
  wrapInSequence: true,
  layout: "absolute-fill",
});
