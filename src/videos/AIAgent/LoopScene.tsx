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

const CX = 960;
const CY = 620;
const RX = 520;
const RY = 290;
// Ramanujan approximation of the ellipse perimeter.
const CIRCUMFERENCE =
  Math.PI * (3 * (RX + RY) - Math.sqrt((3 * RX + RY) * (RX + 3 * RY)));

const LoopNode: React.FC<{
  readonly label: string;
  readonly step: number;
  readonly angle: number;
  readonly delay: number;
  readonly dotAngle: number;
}> = ({ label, step, angle, delay, dotAngle }) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rad = (angle * Math.PI) / 180;
  // Distance between traveling dot and this node, wrapped to [0, 180].
  const diff = Math.abs(((dotAngle - angle + 540) % 360) - 180);
  const active = interpolate(diff, [0, 40], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <Interactive.Div
      name={label}
      style={{
        position: "absolute",
        left: CX + Math.cos(rad) * RX,
        top: CY + Math.sin(rad) * RY,
        translate: "-50% -50%",
        display: "flex",
        alignItems: "center",
        gap: 18,
        padding: "18px 36px 18px 22px",
        borderRadius: t.radius.card,
        backgroundColor: t.colors.surface,
        border: `2px solid ${active > 0.5 ? t.colors.primary : t.colors.border}`,
        boxShadow: active > 0.5 ? t.shadows.glow : t.shadows.md,
        fontFamily: t.fonts.heading,
        fontWeight: 700,
        fontSize: 52,
        color: t.colors.ink,
        opacity: interpolate(frame, [delay, delay + 0.4 * fps], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
        scale: interpolate(
          frame,
          [delay, delay + 0.6 * fps],
          [0.5, 1 + active * 0.12],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(...t.motion.pop),
            output: "perceptual-scale",
          },
        ),
      }}
    >
      <span
        style={{
          width: 56,
          height: 56,
          borderRadius: 999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: t.fonts.body,
          fontWeight: 600,
          fontSize: 30,
          backgroundColor:
            active > 0.5 ? t.colors.primary : t.colors.primaryTint,
          color: active > 0.5 ? t.colors.onPrimary : t.colors.primaryDeep,
        }}
      >
        {step}
      </span>
      {label}
    </Interactive.Div>
  );
};

const LoopInner: React.FC = () => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dotAngle = interpolate(frame, [2.5 * fps, 8.5 * fps], [-90, 630], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const dotRad = (dotAngle * Math.PI) / 180;

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
        Cara kerjanya:{" "}
        <span style={{ color: t.colors.accent }}>sebuah loop</span>
      </Interactive.Div>
      <Interactive.Svg
        name="Ring"
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", inset: 0 }}
      >
        <ellipse
          cx={CX}
          cy={CY}
          rx={RX}
          ry={RY}
          fill="none"
          stroke={t.colors.primarySoft}
          strokeWidth={4}
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={interpolate(
            frame,
            [0.3 * fps, 2 * fps],
            [CIRCUMFERENCE, 0],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.inOut(Easing.cubic),
            },
          )}
        />
        <circle
          cx={CX + Math.cos(dotRad) * RX}
          cy={CY + Math.sin(dotRad) * RY}
          r={16}
          fill={t.colors.primary}
          opacity={interpolate(frame, [2.3 * fps, 2.6 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })}
        />
      </Interactive.Svg>
      <Interactive.Div
        name="Core"
        style={{
          position: "absolute",
          left: CX,
          top: CY,
          translate: "-50% -50%",
          width: 240,
          height: 240,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: t.colors.primary,
          boxShadow: t.shadows.glow,
          fontFamily: t.fonts.heading,
          fontWeight: 700,
          fontSize: 44,
          letterSpacing: 2,
          color: t.colors.onPrimary,
          scale: interpolate(frame, [0, 0.8 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(...t.motion.pop),
            output: "perceptual-scale",
          }),
        }}
      >
        AGENT
      </Interactive.Div>
      <LoopNode
        label="Amati"
        step={1}
        angle={-90}
        delay={1 * fps}
        dotAngle={dotAngle}
      />
      <LoopNode
        label="Rencanakan"
        step={2}
        angle={0}
        delay={1.3 * fps}
        dotAngle={dotAngle}
      />
      <LoopNode
        label="Bertindak"
        step={3}
        angle={90}
        delay={1.6 * fps}
        dotAngle={dotAngle}
      />
      <LoopNode
        label="Evaluasi"
        step={4}
        angle={180}
        delay={1.9 * fps}
        dotAngle={dotAngle}
      />
    </>
  );
};

export const LoopScene = Interactive.withSchema({
  Component: themed(LoopInner),
  componentName: "LoopScene",
  schema: { ...themeSchema },
  wrapInSequence: true,
  layout: "absolute-fill",
});
