import { Interactive, interpolate } from "remotion";
import { useTheme } from "../../themes";
import { useSpringIn } from "../OpenCode9Router/parts";
import { makeScene } from "../OpenCode9Router/scene";
import { headlineStyle, Stage, useSec } from "../GratisMurah/shared";
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
          ...headlineStyle(t, 112),
          opacity: main,
          scale: interpolate(main, [0, 1], [0.92, 1]),
        }}
      >
        {COPY.hook.main}
      </Interactive.Div>
      <Interactive.Div
        name="Follow"
        style={{
          ...headlineStyle(t, 68),
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
      </Interactive.Div>
    </Stage>
  );
};

export const HookScene = makeScene("AgenBodohHookScene", HookInner);
