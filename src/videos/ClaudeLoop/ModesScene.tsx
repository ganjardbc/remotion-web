import type React from "react";
import { Interactive, useVideoConfig } from "remotion";
import { Backdrop } from "../../Backdrop";
import { Icon } from "../../icons";
import { themed, themeSchema, useTheme } from "../../themes";
import { Appear, SAFE_PADDING } from "../ClaudeMd/Appear";
import { Headline } from "./Headline";

const Mode: React.FC<{
  readonly icon: "clock" | "repeat";
  readonly title: string;
  readonly command: string;
  readonly note: string;
  readonly delay: number;
}> = ({ icon, title, command, note, delay }) => {
  const t = useTheme();

  return (
    <Appear
      name={title}
      delay={delay}
      style={{
        padding: "44px",
        borderRadius: t.radius.card,
        backgroundColor: t.colors.surface,
        border: `3px solid ${t.colors.border}`,
        boxShadow: t.shadows.md,
        display: "flex",
        flexDirection: "column",
        gap: 28,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
        <div
          style={{
            width: 104,
            height: 104,
            borderRadius: t.radius.card,
            backgroundColor: t.colors.primaryTint,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon name={icon} size={60} color={t.colors.primaryDark} />
        </div>
        <div
          style={{
            fontFamily: t.fonts.heading,
            fontWeight: 800,
            fontSize: 60,
            color: t.colors.ink,
          }}
        >
          {title}
        </div>
      </div>
      <div
        style={{
          padding: "24px 32px",
          borderRadius: 12,
          backgroundColor: t.code.bg,
          fontFamily: t.fonts.mono,
          fontSize: 40,
          color: t.code.text,
        }}
      >
        <span style={{ color: t.colors.accent }}>/loop</span> {command}
      </div>
      <div
        style={{
          fontFamily: t.fonts.body,
          fontWeight: 500,
          fontSize: 48,
          lineHeight: 1.3,
          color: t.colors.muted,
        }}
      >
        {note}
      </div>
    </Appear>
  );
};

const ModesInner: React.FC = () => {
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
        <Headline size={104}>
          Dua cara <span style={{ color: t.colors.accent }}>pakai.</span>
        </Headline>
        <Mode
          icon="clock"
          title="Interval tetap"
          command="5m cek deploy"
          note="Jalan tiap 5 menit, tepat waktu."
          delay={0.5 * fps}
        />
        <Mode
          icon="repeat"
          title="Self-paced"
          command="cek CI sampai hijau"
          note="Tanpa interval. Claude atur jedanya sendiri."
          delay={2.6 * fps}
        />
      </Interactive.Div>
    </>
  );
};

export const ModesScene = Interactive.withSchema({
  Component: themed(ModesInner),
  componentName: "LoopModesScene",
  schema: { ...themeSchema },
  wrapInSequence: true,
  layout: "absolute-fill",
});
