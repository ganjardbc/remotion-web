import type React from "react";
import { Interactive, useVideoConfig } from "remotion";
import { Backdrop } from "../../Backdrop";
import { headlineSize, themed, themeSchema, useTheme } from "../../themes";
import { Appear, SAFE_PADDING } from "./Appear";

const Bubble: React.FC<{
  readonly children: React.ReactNode;
  readonly delay: number;
}> = ({ children, delay }) => {
  const t = useTheme();

  return (
    <Appear
      name="Pesan"
      delay={delay}
      style={{
        alignSelf: "flex-end",
        padding: "28px 44px",
        borderRadius: t.radius.card,
        backgroundColor: t.colors.groundChipBg,
        color: t.colors.ink,
        fontFamily: t.fonts.body,
        fontWeight: 500,
        fontSize: 48,
        boxShadow: t.shadows.lift,
      }}
    >
      {children}
    </Appear>
  );
};

const ProblemInner: React.FC = () => {
  const t = useTheme();
  const { fps } = useVideoConfig();

  return (
    <>
      <Backdrop variant="ground" label="02 / 05" />
      <Interactive.Div
        name="Content"
        style={{
          position: "absolute",
          inset: 0,
          padding: SAFE_PADDING,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 36,
          fontFamily: t.fonts.heading,
          color: t.colors.groundText,
        }}
      >
        <Appear
          name="Headline"
          delay={0}
          style={{
            fontSize: headlineSize(t, 104),
            fontWeight: t.type.headlineWeight,
            textTransform: t.type.headlineTransform,
            lineHeight: 1.1,
            letterSpacing: `${t.type.tracking}em`,
            marginBottom: 24,
          }}
        >
          Sesi baru, Claude{" "}
          <span style={{ color: t.colors.groundEmphasis }}>lupa.</span>
        </Appear>
        <Bubble delay={1 * fps}>Pakai TypeScript ya.</Bubble>
        <Bubble delay={1.8 * fps}>Test-nya pakai pnpm test.</Bubble>
        <Bubble delay={2.6 * fps}>Jangan edit folder /dist.</Bubble>
        <Appear
          name="Keluhan"
          delay={3.8 * fps}
          style={{
            marginTop: 24,
            fontFamily: t.fonts.body,
            fontWeight: 600,
            fontSize: 60,
            color: t.colors.groundTextMuted,
          }}
        >
          ...diulang tiap sesi. Capek, kan?
        </Appear>
      </Interactive.Div>
    </>
  );
};

export const ProblemScene = Interactive.withSchema({
  Component: themed(ProblemInner),
  componentName: "ProblemScene",
  schema: { ...themeSchema },
  wrapInSequence: true,
  layout: "absolute-fill",
});
