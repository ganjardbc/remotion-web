import type React from "react";
import {
  Interactive,
  useVideoConfig,
  type InteractivitySchema,
} from "remotion";
import { Backdrop } from "../../Backdrop";
import { Icon } from "../../icons";
import { themed, themeSchema, useTheme } from "../../themes";
import { Appear, SAFE_PADDING } from "../ClaudeMd/Appear";
import { Headline } from "./Headline";

const USES = [
  "Pantau deploy & CI",
  "Cek PR dan review",
  "Polling status job",
] as const;

const UseInner: React.FC<{ readonly cta: string }> = ({ cta }) => {
  const t = useTheme();
  const { fps } = useVideoConfig();

  return (
    <>
      <Backdrop variant="ground" label="05 / 05" />
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
        <Headline size={104}>
          Cocok untuk{" "}
          <span style={{ color: t.colors.groundEmphasis }}>apa?</span>
        </Headline>
        {USES.map((use, i) => (
          <Appear
            key={use}
            name={use}
            delay={(0.5 + i * 0.7) * fps}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 32,
              padding: "32px 40px",
              borderRadius: t.radius.card,
              backgroundColor: t.colors.groundChipBg,
              boxShadow: t.shadows.lift,
              color: t.colors.groundChipText,
              fontFamily: t.fonts.body,
              fontWeight: 700,
              fontSize: 52,
            }}
          >
            <Icon name="check" size={64} color={t.colors.primary} />
            {use}
          </Appear>
        ))}
        <Appear
          name="Stop"
          delay={3 * fps}
          style={{
            fontFamily: t.fonts.body,
            fontWeight: 600,
            fontSize: 52,
            lineHeight: 1.3,
            color: t.colors.groundTextMuted,
          }}
        >
          Stop kapan saja. Kamu yang pegang kendali.
        </Appear>
        <Appear
          name="CTA"
          delay={4.8 * fps}
          style={{
            alignSelf: "flex-start",
            padding: "28px 48px",
            borderRadius: t.radius.card,
            backgroundColor: t.colors.accent,
            color: t.colors.onAccent,
            fontFamily: t.fonts.heading,
            fontWeight: 800,
            fontSize: 56,
          }}
        >
          {cta}
        </Appear>
      </Interactive.Div>
    </>
  );
};

const useSchema = {
  ...themeSchema,
  cta: { type: "string", default: "Simpan buat nanti.", description: "CTA" },
} as const satisfies InteractivitySchema;

export const UseScene = Interactive.withSchema({
  Component: themed(UseInner),
  componentName: "LoopUseScene",
  schema: useSchema,
  wrapInSequence: true,
  layout: "absolute-fill",
});
