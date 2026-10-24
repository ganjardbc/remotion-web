import {
  Interactive,
  interpolate,
  interpolateColors,
  useCurrentFrame,
} from "remotion";
import { useTheme } from "../../themes";
import { headlineStyle, Stage, useSec } from "../GratisMurah/shared";
import { Enter } from "../OpenCode9Router/parts";
import { makeScene } from "../OpenCode9Router/scene";
import { COPY, TIMING } from "./config";

const ClosingInner: React.FC = () => {
  const t = useTheme();
  const sec = useSec();
  const frame = useCurrentFrame();
  const T = TIMING.closing;
  // Sentence 2 follows sentence 1 after a short pause.
  const second = T.line1 + T.gap + 1;
  const accentAt = sec(second + T.accentAfter);
  const accent = interpolateColors(
    interpolate(frame, [accentAt, accentAt + 10], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
    [0, 1],
    [t.colors.groundText, t.colors.groundEmphasis],
  );

  return (
    <Stage label="05 / 06" gap={0}>
      <Interactive.Div
        name="Quote card"
        style={{
          padding: "64px 48px",
          borderRadius: t.radius.large,
          backgroundColor: t.code.raised,
          border: `2px solid ${t.code.line}`,
          boxShadow: t.shadows.lift,
          display: "flex",
          flexDirection: "column",
          gap: 40,
        }}
      >
        <Enter
          name="Line 1"
          delay={sec(T.line1)}
          y={40}
          style={{ ...headlineStyle(t, 54), textAlign: "left" }}
        >
          {COPY.closing.line1}
        </Enter>
        <Enter
          name="Line 2"
          delay={sec(second)}
          y={40}
          style={{ ...headlineStyle(t, 54), textAlign: "left" }}
        >
          {COPY.closing.line2Before}
          <span style={{ color: accent }}>{COPY.closing.line2Accent}</span>
          {COPY.closing.line2After}
        </Enter>
      </Interactive.Div>
    </Stage>
  );
};

export const ClosingScene = makeScene("PenulisUIClosingScene", ClosingInner);
