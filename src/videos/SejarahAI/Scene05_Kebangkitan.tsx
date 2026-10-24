import type React from "react";
import {
  Interactive,
  useVideoConfig,
  type InteractivitySchema,
} from "remotion";
import { Backdrop } from "../../Backdrop";
import { headlineSize, themed, themeSchema, useTheme } from "../../themes";
import { Appear, SAFE_PADDING } from "./Appear";

const MilestoneItem: React.FC<{
  readonly year: string;
  readonly text: string;
  readonly delay: number;
}> = ({ year, text, delay }) => {
  const t = useTheme();

  return (
    <Appear
      name={`Milestone ${year}`}
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
          backgroundColor: t.colors.groundChipBg,
          fontFamily: t.fonts.mono,
          fontWeight: 600,
          fontSize: 36,
          color: t.colors.groundChipText,
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
          color: t.colors.groundText,
        }}
      >
        {text}
      </div>
    </Appear>
  );
};

const Scene05Inner: React.FC = () => {
  const t = useTheme();
  const { fps } = useVideoConfig();

  return (
    <>
      <Backdrop variant="ground" label="05 / 08" />
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
          color: t.colors.groundText,
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
          Sampai komputer jadi{" "}
          <span style={{ color: t.colors.groundEmphasis }}>lebih kencang.</span>
        </Appear>
        <MilestoneItem
          year="1997"
          text="Deep Blue ngalahin juara catur dunia, Garry Kasparov."
          delay={1 * fps}
        />
        <MilestoneItem
          year="2011"
          text="Watson menang di kuis Jeopardy melawan juara manusia."
          delay={2 * fps}
        />
        <MilestoneItem
          year="2016"
          text="AlphaGo ngalahin Lee Sedol, juara Go dunia."
          delay={3 * fps}
        />
        <Appear
          name="Penutup"
          delay={4.2 * fps}
          style={{
            fontFamily: t.fonts.body,
            fontWeight: 600,
            fontSize: 54,
            lineHeight: 1.4,
            color: t.colors.groundEmphasis,
            marginTop: 8,
          }}
        >
          Satu per satu, AI melewati batasan yang kita kira nggak mungkin.
        </Appear>
      </Interactive.Div>
    </>
  );
};

const schema = {
  ...themeSchema,
} as const satisfies InteractivitySchema;

export const Scene05_Kebangkitan = Interactive.withSchema({
  Component: themed(Scene05Inner),
  componentName: "Scene05_Kebangkitan",
  schema,
  wrapInSequence: true,
  layout: "absolute-fill",
});
