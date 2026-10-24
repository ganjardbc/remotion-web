import { Interactive } from "remotion";
import { useTheme } from "../../themes";
import { Enter } from "../OpenCode9Router/parts";
import { makeScene } from "../OpenCode9Router/scene";
import { headlineStyle, Stage, useSec } from "../GratisMurah/shared";
import { COPY, ERAS, TIMING } from "./config";

const CtaInner: React.FC = () => {
  const t = useTheme();
  const sec = useSec();

  return (
    <Stage label={`${ERAS.length + 3} / ${ERAS.length + 3}`} gap={64}>
      <Enter
        name="Main"
        delay={sec(TIMING.cta.main)}
        y={40}
        style={headlineStyle(t, 104)}
      >
        {COPY.cta.main}
      </Enter>
      <Enter
        name="Second"
        delay={sec(TIMING.cta.second)}
        y={40}
        style={{
          ...headlineStyle(t, 58),
          fontFamily: t.fonts.body,
          fontWeight: 600,
          letterSpacing: "0em",
          lineHeight: 1.4,
          color: t.colors.groundTextMuted,
        }}
      >
        {COPY.cta.secondBefore}
        <Interactive.Span
          name="Badge"
          style={{
            display: "inline-block",
            padding: "4px 24px",
            borderRadius: t.radius.card,
            backgroundColor: t.colors.accent,
            color: t.colors.onAccent,
            fontFamily: t.fonts.mono,
            fontWeight: 700,
            letterSpacing: "0.04em",
          }}
        >
          {COPY.cta.badge}
        </Interactive.Span>
        .
      </Enter>
    </Stage>
  );
};

export const CtaScene = makeScene("SejarahAICtaScene", CtaInner);
