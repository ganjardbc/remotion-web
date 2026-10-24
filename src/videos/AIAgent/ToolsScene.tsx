import type React from "react";
import {
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Backdrop } from "../../Backdrop";
import { Icon } from "../../icons";
import { headlineSize, themed, themeSchema, useTheme } from "../../themes";

const CX = 960;
const CY = 790;
const R = 400;

const Tool: React.FC<{
  readonly icon: "globe" | "code" | "mail" | "database" | "plug";
  readonly label: string;
  readonly angle: number;
  readonly delay: number;
}> = ({ icon, label, angle, delay }) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rad = (angle * Math.PI) / 180;
  const x = CX + Math.cos(rad) * R;
  const y = CY + Math.sin(rad) * R;
  const draw = interpolate(frame, [delay, delay + 0.5 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...t.motion.enter),
  });
  // Pulse travels from agent to tool once connected.
  const pulse = interpolate(
    frame,
    [delay + 0.6 * fps, delay + 1.4 * fps],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  return (
    <>
      <svg
        viewBox="0 0 1920 1080"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
        }}
      >
        <line
          x1={CX}
          y1={CY}
          x2={CX + (x - CX) * draw}
          y2={CY + (y - CY) * draw}
          stroke={t.colors.line}
          strokeWidth={3}
          strokeDasharray="10 10"
        />
        <circle
          cx={CX + (x - CX) * pulse}
          cy={CY + (y - CY) * pulse}
          r={10}
          fill={t.colors.primary}
          opacity={pulse > 0 && pulse < 1 ? 1 : 0}
        />
      </svg>
      <Interactive.Div
        name={label}
        style={{
          position: "absolute",
          left: x,
          top: y,
          translate: "-50% -50%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
          padding: "28px 40px",
          borderRadius: t.radius.card,
          backgroundColor: t.colors.surface,
          border: `2px solid ${t.colors.border}`,
          boxShadow: t.shadows.md,
          fontFamily: t.fonts.heading,
          fontWeight: 600,
          fontSize: 44,
          color: t.colors.ink,
          opacity: interpolate(
            frame,
            [delay + 0.3 * fps, delay + 0.7 * fps],
            [0, 1],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            },
          ),
          scale: interpolate(
            frame,
            [delay + 0.3 * fps, delay + 0.8 * fps],
            [0.85, 1],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(...t.motion.pop),
              output: "perceptual-scale",
            },
          ),
        }}
      >
        <div
          style={{
            width: 104,
            height: 104,
            borderRadius: 999,
            backgroundColor: t.colors.primaryTint,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon name={icon} size={56} color={t.colors.primaryDark} />
        </div>
        {label}
      </Interactive.Div>
    </>
  );
};

const ToolsInner: React.FC = () => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <>
      <Backdrop />
      <Interactive.Div
        name="Headline"
        style={{
          position: "absolute",
          top: 100,
          width: "100%",
          textAlign: "center",
          fontFamily: t.fonts.heading,
          fontWeight: 700,
          fontSize: headlineSize(t, 92),
          textTransform: t.type.headlineTransform,
          color: t.colors.ink,
          opacity: interpolate(frame, [0, 0.6 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        ...dan memakai <span style={{ color: t.colors.accent }}>alat</span>
      </Interactive.Div>
      <Tool icon="globe" label="Browser" angle={180} delay={0.8 * fps} />
      <Tool icon="code" label="Kode" angle={225} delay={1.1 * fps} />
      <Tool icon="mail" label="Email" angle={270} delay={1.4 * fps} />
      <Tool icon="database" label="Database" angle={315} delay={1.7 * fps} />
      <Tool icon="plug" label="API" angle={0} delay={2 * fps} />
      <Interactive.Div
        name="Agent core"
        style={{
          position: "absolute",
          left: CX,
          top: CY,
          translate: "-50% -50%",
          padding: "36px 64px",
          borderRadius: t.radius.large,
          backgroundColor: t.colors.primary,
          boxShadow: t.shadows.glow,
          fontFamily: t.fonts.heading,
          fontWeight: 700,
          fontSize: 56,
          color: t.colors.onPrimary,
          scale: interpolate(frame, [0.2 * fps, 0.9 * fps], [0.6, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(...t.motion.pop),
            output: "perceptual-scale",
          }),
        }}
      >
        AI Agent
      </Interactive.Div>
    </>
  );
};

export const ToolsScene = Interactive.withSchema({
  Component: themed(ToolsInner),
  componentName: "ToolsScene",
  schema: { ...themeSchema },
  wrapInSequence: true,
  layout: "absolute-fill",
});
