import type React from "react";
import {
  Interactive,
  useVideoConfig,
  type InteractivitySchema,
} from "remotion";
import { Backdrop } from "../../Backdrop";
import { themed, themeSchema, useTheme } from "../../themes";
import { Appear, SAFE_PADDING } from "../ClaudeMd/Appear";
import { Headline } from "../ClaudeLoop/Headline";
import { Meter } from "./Meter";
import { Terminal } from "./Terminal";

const HookInner: React.FC<{ readonly subtitle: string }> = ({ subtitle }) => {
  const t = useTheme();
  const { fps } = useVideoConfig();

  return (
    <>
      <Backdrop variant="ground" label="01 / 05" sweep />
      <Interactive.Div
        name="Content"
        style={{
          position: "absolute",
          inset: 0,
          padding: SAFE_PADDING,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 56,
          fontFamily: t.fonts.heading,
          color: t.colors.groundText,
        }}
      >
        <Headline size={148}>
          Kuota Claude cepat{" "}
          <span style={{ color: t.colors.groundEmphasis }}>habis?</span>
        </Headline>
        <Terminal delay={0.3 * fps} title="claude — token usage">
          <Meter
            label="Kuota terpakai"
            from={8}
            to={97}
            startFrame={0.4 * fps}
            endFrame={2.4 * fps}
            scale={1.15}
          />
        </Terminal>
        <Appear
          name="Subtitle"
          delay={2.2 * fps}
          style={{
            fontFamily: t.fonts.body,
            fontWeight: 600,
            fontSize: 60,
            lineHeight: 1.3,
            color: t.colors.groundTextMuted,
          }}
        >
          {subtitle}
        </Appear>
      </Interactive.Div>
    </>
  );
};

const hookSchema = {
  ...themeSchema,
  subtitle: {
    type: "string",
    default: "3 kebiasaan kecil yang bikin hemat.",
    description: "Subtitle",
  },
} as const satisfies InteractivitySchema;

export const HookScene = Interactive.withSchema({
  Component: themed(HookInner),
  componentName: "TokenHookScene",
  schema: hookSchema,
  wrapInSequence: true,
  layout: "absolute-fill",
});
