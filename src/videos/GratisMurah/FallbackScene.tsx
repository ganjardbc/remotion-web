import {
  Interactive,
  interpolate,
  interpolateColors,
  useCurrentFrame,
} from "remotion";
import { Icon } from "../../icons";
import { useTheme } from "../../themes";
import { Enter, Pop } from "../OpenCode9Router/parts";
import { makeScene } from "../OpenCode9Router/scene";
import { COPY, TIMING } from "./config";
import { headlineStyle, Overline, Stage, useProgress, useSec } from "./shared";

const BOX = 190;
const GAP = 53;

// Arrow whose accent fill sweeps left → right as the request flows through.
const FlowArrow: React.FC<{ readonly start: number }> = ({ start }) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const p = useProgress(frame, start, TIMING.fallback.flowDuration);
  return (
    <div
      style={{ position: "relative", width: GAP, height: 48, flexShrink: 0 }}
    >
      <div style={{ position: "absolute", inset: 0, opacity: 0.5 }}>
        <Icon name="arrowRight" size={GAP} color={t.colors.groundTextMuted} />
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: p,
          clipPath: `inset(0 ${(1 - p) * 100}% 0 0)`,
        }}
      >
        <Icon name="arrowRight" size={GAP} color={t.colors.groundEmphasis} />
      </div>
    </div>
  );
};

type NodeState = "idle" | "fail" | "pass" | "done";

const Node: React.FC<{
  readonly index: number;
  readonly label: string;
  readonly state: NodeState;
  readonly changeAt: number;
  readonly note?: string;
}> = ({ index, label, state, changeAt, note }) => {
  const t = useTheme();
  const sec = useSec();
  const frame = useCurrentFrame();
  const p = useProgress(frame, changeAt, 0.3);
  const danger = t.colors.danger ?? t.colors.accent;
  const success = t.colors.success ?? t.colors.primary;
  const target =
    state === "fail" ? danger : state === "pass" ? success : t.colors.primary;
  const changed = state !== "idle";
  const bg = changed
    ? interpolateColors(p, [0, 1], [t.colors.groundChipBg, target])
    : t.colors.groundChipBg;
  const fg = changed
    ? interpolateColors(p, [0, 1], [t.colors.ink, t.colors.onPrimary])
    : t.colors.ink;
  const mark = state === "fail" ? "x" : "check";

  return (
    <Enter
      name={`Node ${label}`}
      delay={sec(TIMING.fallback.nodesIn + index * TIMING.fallback.nodeGap)}
      y={40}
      style={{
        position: "relative",
        width: BOX,
        height: BOX,
        flexShrink: 0,
        borderRadius: t.radius.large,
        backgroundColor: bg,
        color: fg,
        boxShadow: t.shadows.lift,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        fontFamily: t.fonts.body,
        fontWeight: 600,
        fontSize: 34,
      }}
    >
      <div style={{ height: 56, display: "flex", alignItems: "center" }}>
        {changed && state !== "done" ? (
          <Pop delay={sec(changeAt)}>
            <Icon name={mark} size={56} color={t.colors.onPrimary} />
          </Pop>
        ) : null}
        {state === "done" && p > 0 ? (
          <Pop delay={sec(changeAt)}>
            <Icon name="check" size={56} color={t.colors.onPrimary} />
          </Pop>
        ) : null}
      </div>
      <div>{label}</div>
      {note ? (
        <div
          style={{
            position: "absolute",
            bottom: -56,
            fontFamily: t.fonts.mono,
            fontWeight: 400,
            fontSize: 34,
            color: danger,
            opacity: p,
          }}
        >
          {note}
        </div>
      ) : null}
    </Enter>
  );
};

const FallbackInner: React.FC = () => {
  const t = useTheme();
  const sec = useSec();
  const frame = useCurrentFrame();
  const T = TIMING.fallback;
  const [request, a, b, result] = COPY.fallback.nodes;
  const at = (s: number) => frame >= sec(s);

  const aState: NodeState = at(T.aFails) ? "fail" : "idle";
  const bState: NodeState = at(T.bPasses) ? "pass" : "idle";
  const rState: NodeState = at(T.resultLights) ? "done" : "idle";
  const footer = interpolate(
    frame,
    [sec(T.footer), sec(T.footer) + 12],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  return (
    <Stage label="03 / 07" gap={110}>
      <Overline delay={sec(T.title)}>{COPY.fallback.title}</Overline>
      <Interactive.Div
        name="Diagram"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 0,
        }}
      >
        <Node index={0} label={request} state="idle" changeAt={0} />
        <FlowArrow start={T.flowRequestToA} />
        <Node
          index={1}
          label={a}
          state={aState}
          changeAt={T.aFails}
          note={COPY.fallback.limitLabel}
        />
        <FlowArrow start={T.flowAToB} />
        <Node index={2} label={b} state={bState} changeAt={T.bPasses} />
        <FlowArrow start={T.flowBToResult} />
        <Node
          index={3}
          label={result}
          state={rState}
          changeAt={T.resultLights}
        />
      </Interactive.Div>
      <Interactive.Div
        name="Footer text"
        style={{
          ...headlineStyle(t, 84),
          opacity: footer,
          translate: `0 ${(1 - footer) * 40}px`,
        }}
      >
        {COPY.fallback.footer}
      </Interactive.Div>
    </Stage>
  );
};

export const FallbackScene = makeScene(
  "GratisMurahFallbackScene",
  FallbackInner,
);
