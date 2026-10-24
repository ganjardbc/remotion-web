import type React from "react";
import { Interactive, useVideoConfig } from "remotion";
import { Backdrop } from "../../Backdrop";
import { themed, themeSchema, useTheme } from "../../themes";
import { Appear, SAFE_PADDING } from "../ClaudeMd/Appear";
import { Headline } from "./Headline";

const Part: React.FC<{
  readonly token: string;
  readonly meaning: string;
  readonly delay: number;
  readonly color: string;
}> = ({ token, meaning, delay, color }) => {
  const t = useTheme();

  return (
    <Appear
      name={token}
      delay={delay}
      style={{ display: "flex", alignItems: "center", gap: 32 }}
    >
      <div
        style={{
          flexShrink: 0,
          minWidth: 260,
          padding: "20px 28px",
          borderRadius: t.radius.card,
          backgroundColor: t.colors.primaryTint,
          fontFamily: t.fonts.mono,
          fontWeight: 700,
          fontSize: 44,
          textAlign: "center",
          color,
        }}
      >
        {token}
      </div>
      <div
        style={{
          fontFamily: t.fonts.body,
          fontWeight: 600,
          fontSize: 48,
          lineHeight: 1.25,
          color: t.colors.ink,
        }}
      >
        {meaning}
      </div>
    </Appear>
  );
};

const WhatInner: React.FC = () => {
  const t = useTheme();
  const { fps } = useVideoConfig();

  return (
    <>
      <Backdrop label="02 / 05" />
      <Interactive.Div
        name="Content"
        style={{
          position: "absolute",
          inset: 0,
          padding: SAFE_PADDING,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 48,
          fontFamily: t.fonts.heading,
          color: t.colors.ink,
        }}
      >
        <Headline size={104}>
          <span style={{ color: t.colors.accent }}>/loop</span> = prompt yang
          jalan sendiri.
        </Headline>
        <Appear
          name="Code card"
          delay={0.5 * fps}
          style={{
            padding: "40px",
            borderRadius: t.radius.card,
            backgroundColor: t.code.bg,
            boxShadow: t.shadows.lift,
            fontFamily: t.fonts.mono,
            fontSize: 44,
            color: t.code.text,
          }}
        >
          <span style={{ color: t.colors.accent }}>/loop</span> 5m cek status
          deploy
        </Appear>
        <Part
          token="/loop"
          meaning="Command-nya"
          delay={1.4 * fps}
          color={t.colors.primaryDark}
        />
        <Part
          token="5m"
          meaning="Ulangi tiap 5 menit"
          delay={2.4 * fps}
          color={t.colors.primaryDark}
        />
        <Part
          token="cek status deploy"
          meaning="Prompt yang dijalankan"
          delay={3.4 * fps}
          color={t.colors.primaryDark}
        />
      </Interactive.Div>
    </>
  );
};

export const WhatScene = Interactive.withSchema({
  Component: themed(WhatInner),
  componentName: "LoopWhatScene",
  schema: { ...themeSchema },
  wrapInSequence: true,
  layout: "absolute-fill",
});
