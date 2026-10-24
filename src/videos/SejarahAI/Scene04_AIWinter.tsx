import type React from "react";
import {
  Interactive,
  useVideoConfig,
  type InteractivitySchema,
} from "remotion";
import { Backdrop } from "../../Backdrop";
import { headlineSize, themed, themeSchema, useTheme } from "../../themes";
import { Appear, SAFE_PADDING } from "./Appear";

const TimelineItem: React.FC<{
  readonly year: string;
  readonly text: string;
  readonly delay: number;
}> = ({ year, text, delay }) => {
  const t = useTheme();

  return (
    <Appear
      name={`Timeline ${year}`}
      delay={delay}
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 24,
      }}
    >
      <div
        style={{
          flexShrink: 0,
          paddingTop: 6,
          paddingBottom: 6,
          paddingLeft: 20,
          paddingRight: 20,
          borderRadius: 8,
          backgroundColor: t.colors.primaryTint,
          fontFamily: t.fonts.mono,
          fontWeight: 600,
          fontSize: 36,
          color: t.colors.primaryDark,
          lineHeight: 1.4,
        }}
      >
        {year}
      </div>
      <div
        style={{
          fontFamily: t.fonts.body,
          fontWeight: 500,
          fontSize: 52,
          lineHeight: 1.4,
          color: t.colors.ink,
        }}
      >
        {text}
      </div>
    </Appear>
  );
};

const Scene04Inner: React.FC = () => {
  const t = useTheme();
  const { fps } = useVideoConfig();

  return (
    <>
      <Backdrop variant="canvas" label="04 / 08" />
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
            lineHeight: 1.1,
            letterSpacing: `${t.type.tracking}em`,
            marginBottom: 8,
          }}
        >
          Tapi jalan{" "}
          <span style={{ color: t.colors.accent }}>nggak selalu mulus.</span>
        </Appear>
        <TimelineItem
          year="1956"
          text={'Kata "Artificial Intelligence" pertama kali dipakai.'}
          delay={1 * fps}
        />
        <TimelineItem
          year="1970"
          text="AI Winter. Dana cekak, harapan jeblok."
          delay={2 * fps}
        />
        <TimelineItem
          year="1980"
          text="Kebangkitan singkat, lalu winter lagi."
          delay={3 * fps}
        />
        <Appear
          name="Penutup"
          delay={4.2 * fps}
          style={{
            fontFamily: t.fonts.body,
            fontWeight: 500,
            fontSize: 52,
            lineHeight: 1.5,
            color: t.colors.muted,
            marginTop: 8,
          }}
        >
          Dua kali AI hampir ditinggalkan. Tapi risetnya terus jalan
          pelan-pelan.
        </Appear>
      </Interactive.Div>
    </>
  );
};

const schema = {
  ...themeSchema,
} as const satisfies InteractivitySchema;

export const Scene04_AIWinter = Interactive.withSchema({
  Component: themed(Scene04Inner),
  componentName: "Scene04_AIWinter",
  schema,
  wrapInSequence: true,
  layout: "absolute-fill",
});
