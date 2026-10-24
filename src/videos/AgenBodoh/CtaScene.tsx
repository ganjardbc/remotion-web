import { Interactive, interpolate, useCurrentFrame } from "remotion";
import { Icon } from "../../icons";
import { useTheme } from "../../themes";
import { Enter, Pop } from "../OpenCode9Router/parts";
import { makeScene } from "../OpenCode9Router/scene";
import { headlineStyle, Stage, useSec } from "../GratisMurah/shared";
import { COPY, TIMING } from "./config";

const CtaInner: React.FC = () => {
  const t = useTheme();
  const sec = useSec();
  const frame = useCurrentFrame();
  const T = TIMING.cta;
  const beat = (s: number) =>
    interpolate(frame, [sec(s), sec(s) + 8, sec(s) + 16], [0, 1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  const pulse = 1 + 0.08 * (beat(T.pulse1) + beat(T.pulse2));

  return (
    <Stage label="06 / 06" gap={56}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Pop delay={sec(T.main)}>
          <div
            style={{
              width: 144,
              height: 144,
              borderRadius: 999,
              backgroundColor: t.colors.groundChipBg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon name="userPlus" size={84} color={t.colors.groundChipText} />
          </div>
        </Pop>
      </div>
      <Enter
        name="Main"
        delay={sec(T.main)}
        y={40}
        style={headlineStyle(t, 88)}
      >
        {COPY.cta.main}
      </Enter>
      <Enter
        name="Second"
        delay={sec(T.second)}
        y={40}
        style={{
          ...headlineStyle(t, 56),
          fontFamily: t.fonts.body,
          fontWeight: 600,
          letterSpacing: "0em",
          lineHeight: 1.6,
        }}
      >
        {COPY.cta.secondBefore}
        <Interactive.Div
          name="Badge"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 12,
            padding: "2px 28px 2px 20px",
            borderRadius: 999,
            backgroundColor: t.colors.accent,
            color: t.colors.onAccent,
            fontFamily: t.fonts.mono,
            fontWeight: 700,
            scale: pulse,
          }}
        >
          <Icon name="messageCircle" size={44} color={t.colors.onAccent} />
          {COPY.cta.badge}
        </Interactive.Div>
        {COPY.cta.secondAfter}
      </Enter>
    </Stage>
  );
};

export const CtaScene = makeScene("AgenBodohCtaScene", CtaInner);
