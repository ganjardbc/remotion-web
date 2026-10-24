import { Interactive, interpolate } from "remotion";
import { useTheme } from "../../themes";
import { headlineStyle, Stage, useSec } from "../GratisMurah/shared";
import { useSpringIn } from "../OpenCode9Router/parts";
import { makeScene } from "../OpenCode9Router/scene";
import { COPY, TIMING } from "./config";

const HookInner: React.FC = () => {
  const t = useTheme();
  const sec = useSec();
  const main = useSpringIn(sec(TIMING.hook.main));
  const follow = useSpringIn(sec(TIMING.hook.follow));

  return (
    <Stage label="01 / 06" sweep gap={72}>
      <Interactive.Div
        name="Main"
        style={{
          ...headlineStyle(t, 60),
          opacity: main,
          scale: interpolate(main, [0, 1], [0.94, 1]),
        }}
      >
        {COPY.hook.main}
      </Interactive.Div>
      <Interactive.Div
        name="Follow"
        style={{
          ...headlineStyle(t, 48),
          fontFamily: t.fonts.body,
          fontWeight: 600,
          letterSpacing: "0em",
          lineHeight: 1.3,
          color: t.colors.groundTextMuted,
          opacity: follow,
          translate: `0 ${(1 - follow) * 80}px`,
        }}
      >
        {COPY.hook.followBefore}
        <span style={{ color: t.colors.groundEmphasis, fontWeight: 800 }}>
          {COPY.hook.followAccent}
        </span>
        {COPY.hook.followAfter}
      </Interactive.Div>
    </Stage>
  );
};

export const HookScene = makeScene("FileDibajakHookScene", HookInner);
