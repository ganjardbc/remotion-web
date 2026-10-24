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
import { Headline } from "../ClaudeLoop/Headline";

const RECAP = [
  { cmd: "/clear", text: "ganti topik" },
  { cmd: "/compact", text: "sebelum penuh" },
  { cmd: "@file", text: "prompt spesifik" },
] as const;

const OutroInner: React.FC<{ readonly cta: string }> = ({ cta }) => {
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
          Hemat token,{" "}
          <span style={{ color: t.colors.groundEmphasis }}>tanpa ribet.</span>
        </Headline>
        {RECAP.map((item, i) => (
          <Appear
            key={item.cmd}
            name={item.cmd}
            delay={(0.5 + i * 0.6) * fps}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 28,
              padding: "28px 36px",
              borderRadius: t.radius.card,
              backgroundColor: t.code.raised,
              border: `1px solid ${t.code.line}`,
            }}
          >
            <Icon name="check" size={56} color={t.colors.accent} />
            <span
              style={{
                fontFamily: t.fonts.mono,
                fontWeight: 700,
                fontSize: 48,
                color: t.colors.accent,
              }}
            >
              {item.cmd}
            </span>
            <span
              style={{
                fontFamily: t.fonts.body,
                fontWeight: 600,
                fontSize: 48,
                color: t.colors.groundText,
              }}
            >
              {item.text}
            </span>
          </Appear>
        ))}
        <Appear
          name="CTA"
          delay={3 * fps}
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
        <Appear
          name="Share"
          delay={3.8 * fps}
          style={{
            fontFamily: t.fonts.body,
            fontWeight: 600,
            fontSize: 48,
            lineHeight: 1.3,
            color: t.colors.groundTextMuted,
          }}
        >
          Bagikan ke temanmu yang kuotanya cepat habis.
        </Appear>
      </Interactive.Div>
    </>
  );
};

const outroSchema = {
  ...themeSchema,
  cta: { type: "string", default: "Simpan buat nanti.", description: "CTA" },
} as const satisfies InteractivitySchema;

export const OutroScene = Interactive.withSchema({
  Component: themed(OutroInner),
  componentName: "TokenOutroScene",
  schema: outroSchema,
  wrapInSequence: true,
  layout: "absolute-fill",
});
