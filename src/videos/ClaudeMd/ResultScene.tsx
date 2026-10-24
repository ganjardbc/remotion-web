import type React from "react";
import { Interactive, useVideoConfig } from "remotion";
import { Backdrop } from "../../Backdrop";
import { Icon } from "../../icons";
import { headlineSize, themed, themeSchema, useTheme } from "../../themes";
import { Appear, SAFE_PADDING } from "./Appear";

const Check: React.FC<{
  readonly children: React.ReactNode;
  readonly delay: number;
}> = ({ children, delay }) => {
  const t = useTheme();

  return (
    <Appear
      name="Poin"
      delay={delay}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 28,
        fontFamily: t.fonts.body,
        fontWeight: 600,
        fontSize: 48,
        color: t.colors.ink,
      }}
    >
      <div
        style={{
          width: 72,
          height: 72,
          flexShrink: 0,
          borderRadius: 999,
          backgroundColor: t.colors.primary,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon name="check" size={44} color={t.colors.onPrimary} />
      </div>
      {children}
    </Appear>
  );
};

const ResultInner: React.FC = () => {
  const t = useTheme();
  const { fps } = useVideoConfig();

  return (
    <>
      <Backdrop label="04 / 05" />
      <Interactive.Div
        name="Content"
        style={{
          position: "absolute",
          inset: 0,
          padding: SAFE_PADDING,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 44,
          fontFamily: t.fonts.heading,
          color: t.colors.ink,
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
          }}
        >
          Claude baca <span style={{ color: t.colors.accent }}>otomatis.</span>
        </Appear>
        <Appear
          name="Perintah"
          delay={0.8 * fps}
          style={{
            alignSelf: "flex-end",
            padding: "28px 44px",
            borderRadius: t.radius.card,
            backgroundColor: t.code.bg,
            color: t.code.text,
            fontFamily: t.fonts.body,
            fontWeight: 500,
            fontSize: 48,
            boxShadow: t.shadows.lift,
          }}
        >
          Tambah fitur login.
        </Appear>
        <Appear
          name="Balasan"
          delay={1.8 * fps}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 36,
            padding: 48,
            borderRadius: t.radius.card,
            backgroundColor: t.colors.surface,
            border: `2px solid ${t.colors.border}`,
            boxShadow: t.shadows.md,
          }}
        >
          <div
            style={{
              fontFamily: t.fonts.body,
              fontWeight: 500,
              fontSize: 44,
              color: t.colors.muted,
            }}
          >
            Claude sudah tahu aturannya:
          </div>
          <Check delay={2.6 * fps}>TypeScript strict</Check>
          <Check delay={3.4 * fps}>Test: pnpm test</Check>
          <Check delay={4.2 * fps}>Tidak menyentuh /dist</Check>
        </Appear>
        <Appear
          name="Penutup"
          delay={5.4 * fps}
          style={{
            fontFamily: t.fonts.body,
            fontWeight: 600,
            fontSize: 56,
            color: t.colors.primaryDark,
          }}
        >
          Tanpa diulang-ulang.
        </Appear>
      </Interactive.Div>
    </>
  );
};

export const ResultScene = Interactive.withSchema({
  Component: themed(ResultInner),
  componentName: "ResultScene",
  schema: { ...themeSchema },
  wrapInSequence: true,
  layout: "absolute-fill",
});
