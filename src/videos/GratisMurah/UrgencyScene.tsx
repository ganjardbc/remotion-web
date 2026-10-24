import { Interactive, interpolate, useCurrentFrame } from "remotion";
import { Icon } from "../../icons";
import { useTheme } from "../../themes";
import { Enter, Pop, shakeX } from "../OpenCode9Router/parts";
import { makeScene } from "../OpenCode9Router/scene";
import { COPY, TIMING } from "./config";
import { headlineStyle, Stage, useProgress, useSec } from "./shared";

const DOT = 120;

const Dot: React.FC<{
  readonly filled: boolean;
  readonly children: React.ReactNode;
}> = ({ filled, children }) => {
  const t = useTheme();
  return (
    <div
      style={{
        width: DOT,
        height: DOT,
        flexShrink: 0,
        borderRadius: 999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: filled ? t.colors.groundEmphasis : t.code.raised,
        border: filled ? "none" : `3px solid ${t.code.line}`,
      }}
    >
      {children}
    </div>
  );
};

const UrgencyInner: React.FC = () => {
  const t = useTheme();
  const sec = useSec();
  const frame = useCurrentFrame();
  const T = TIMING.urgency;
  const fill = useProgress(frame, T.fill, 0.8);
  const sub = interpolate(frame, [sec(T.sub), sec(T.sub) + 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const main = interpolate(frame, [sec(T.main), sec(T.main) + 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <Stage label="04 / 07" gap={88}>
      <Interactive.Div
        name="Main"
        style={{ ...headlineStyle(t, 116), opacity: main }}
      >
        {COPY.urgency.main}
      </Interactive.Div>
      <Enter name="Steps" delay={sec(T.steps)} y={30}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Dot filled>
            <Icon name="check" size={64} color={t.colors.onAccent} />
          </Dot>
          <div
            style={{
              position: "relative",
              width: 260,
              height: 14,
              borderRadius: 999,
              backgroundColor: t.code.line,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                width: `${fill * 100}%`,
                backgroundColor: t.colors.groundEmphasis,
              }}
            />
          </div>
          <Dot filled={false}>
            <Pop delay={sec(T.steps + 0.3)}>
              <Interactive.Div
                name="Lock"
                style={{
                  display: "flex",
                  transform: `translateX(${shakeX(frame, sec(T.lockShake), 15)}px)`,
                }}
              >
                <Icon name="lock" size={64} color={t.colors.groundText} />
              </Interactive.Div>
            </Pop>
          </Dot>
        </div>
      </Enter>
      <Interactive.Div
        name="Sub"
        style={{
          ...headlineStyle(t, 56),
          fontFamily: t.fonts.body,
          fontWeight: 500,
          lineHeight: 1.25,
          letterSpacing: "0em",
          color: t.colors.groundTextMuted,
          opacity: sub,
          translate: `0 ${(1 - sub) * 24}px`,
        }}
      >
        {COPY.urgency.sub}
      </Interactive.Div>
    </Stage>
  );
};

export const UrgencyScene = makeScene("GratisMurahUrgencyScene", UrgencyInner);
