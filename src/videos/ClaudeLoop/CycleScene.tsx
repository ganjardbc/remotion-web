import type React from "react";
import {
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Backdrop } from "../../Backdrop";
import { Icon } from "../../icons";
import { themed, themeSchema, useTheme } from "../../themes";
import { Appear, SAFE_PADDING } from "../ClaudeMd/Appear";
import { Headline } from "./Headline";

const STEPS = [
  { icon: "play", label: "Jalankan prompt" },
  { icon: "eye", label: "Claude kerja & lapor hasil" },
  { icon: "clock", label: "Tunggu sampai jeda habis" },
  { icon: "repeat", label: "Ulangi dari awal" },
] as const;

const STEP_FRAMES = 40;

const CycleInner: React.FC = () => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Continuous position on the 4-step ring; card i peaks when phase === i.
  const phase = (Math.max(0, frame - 1.2 * fps) / STEP_FRAMES) % STEPS.length;

  return (
    <>
      <Backdrop variant="dark" label="03 / 05" />
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
        <Headline size={104}>
          Cara kerja:{" "}
          <span style={{ color: t.colors.groundEmphasis }}>berputar.</span>
        </Headline>
        {STEPS.map((step, i) => {
          const raw = Math.abs(phase - i);
          const d = Math.min(raw, STEPS.length - raw);
          const a = interpolate(d, [0, 0.7], [1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <Appear
              key={step.label}
              name={`Step ${i + 1}`}
              delay={(0.3 + i * 0.2) * fps}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 36,
                  padding: "36px 44px",
                  borderRadius: t.radius.card,
                  backgroundColor:
                    a > 0.5 ? t.colors.groundChipBg : "transparent",
                  border: `3px solid ${t.colors.groundTextMuted}`,
                  opacity: interpolate(a, [0, 1], [0.6, 1]),
                  scale: interpolate(a, [0, 1], [0.97, 1.03]),
                  boxShadow: a > 0.5 ? t.shadows.lift : "none",
                  color:
                    a > 0.5 ? t.colors.groundChipText : t.colors.groundText,
                }}
              >
                <Icon
                  name={step.icon}
                  size={72}
                  color={a > 0.5 ? t.colors.primary : t.colors.groundText}
                />
                <div
                  style={{
                    fontFamily: t.fonts.body,
                    fontWeight: 700,
                    fontSize: 52,
                    lineHeight: 1.2,
                  }}
                >
                  {step.label}
                </div>
              </div>
            </Appear>
          );
        })}
        <Appear
          name="Caption"
          delay={3.6 * fps}
          style={{
            fontFamily: t.fonts.body,
            fontWeight: 600,
            fontSize: 52,
            color: t.colors.groundTextMuted,
          }}
        >
          Terus sampai kamu stop.
        </Appear>
      </Interactive.Div>
    </>
  );
};

export const CycleScene = Interactive.withSchema({
  Component: themed(CycleInner),
  componentName: "LoopCycleScene",
  schema: { ...themeSchema },
  wrapInSequence: true,
  layout: "absolute-fill",
});
