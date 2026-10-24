import { Interactive, interpolate, useCurrentFrame } from "remotion";
import { Icon } from "../../icons";
import { useTheme } from "../../themes";
import { Enter, Pop, useSpringIn } from "../OpenCode9Router/parts";
import { makeScene } from "../OpenCode9Router/scene";
import { COPY, TIMING } from "./config";
import { headlineStyle, Stage, useSec } from "./shared";

const HookInner: React.FC = () => {
  const t = useTheme();
  const sec = useSec();
  const frame = useCurrentFrame();
  const [before, rp0, after] = COPY.hook.main;
  // Fast scale-up with a slight overshoot.
  const pop = useSpringIn(sec(TIMING.hook.rp0), 9);
  const follow = useSpringIn(sec(TIMING.hook.follow));

  return (
    <Stage label="01 / 07" sweep gap={64}>
      <Enter
        name="Main"
        delay={sec(TIMING.hook.main)}
        y={40}
        style={{ ...headlineStyle(t, 98), whiteSpace: "nowrap" }}
      >
        {before}
        <br />
        <Interactive.Div
          name="Rp0"
          style={{
            position: "relative",
            display: "inline-block",
            marginRight: 56,
            fontSize: "1.25em",
            color: t.colors.groundEmphasis,
            scale: interpolate(pop, [0, 1], [0.3, 1]),
            opacity: Math.min(1, pop * 3),
          }}
        >
          {rp0}
          <div
            style={{
              position: "absolute",
              top: -8,
              right: -52,
              opacity: interpolate(
                frame,
                [sec(TIMING.hook.star), sec(TIMING.hook.star) + 1],
                [0, 1],
                {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                },
              ),
            }}
          >
            <Pop delay={sec(TIMING.hook.star)}>
              <Icon name="star" size={56} color={t.colors.groundEmphasis} />
            </Pop>
          </div>
        </Interactive.Div>
        {after}
      </Enter>
      <Interactive.Div
        name="Follow"
        style={{
          ...headlineStyle(t, 84),
          color: t.colors.groundEmphasis,
          opacity: follow,
          translate: `0 ${(1 - follow) * 60}px`,
        }}
      >
        {COPY.hook.follow}
      </Interactive.Div>
    </Stage>
  );
};

export const HookScene = makeScene("GratisMurahHookScene", HookInner);
