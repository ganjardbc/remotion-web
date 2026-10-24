import { interpolate, useCurrentFrame } from "remotion";
import { Icon } from "../../icons";
import { useTheme } from "../../themes";
import {
  headlineStyle,
  Overline,
  Stage,
  useProgress,
  useSec,
} from "../GratisMurah/shared";
import { Enter } from "../OpenCode9Router/parts";
import { makeScene } from "../OpenCode9Router/scene";
import { COPY, TIMING } from "./config";
import { Wireframe, WIRE_W } from "./Wireframe";

type IconName = React.ComponentProps<typeof Icon>["name"];

const MESSY_SKEW = 22;

const Panel: React.FC<{
  readonly name: string;
  readonly delay: number;
  readonly x: number;
  readonly icon: IconName;
  readonly label: string;
  readonly highlight: boolean;
  readonly children: React.ReactNode;
}> = ({ name, delay, x, icon, label, highlight, children }) => {
  const t = useTheme();
  return (
    <Enter
      name={name}
      delay={delay}
      x={x}
      y={0}
      style={{
        width: WIRE_W,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 28,
      }}
    >
      <div
        style={{
          height: 150,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: 12,
          textAlign: "center",
          fontFamily: t.fonts.body,
          fontWeight: 700,
          fontSize: 34,
          lineHeight: 1.15,
          color: highlight ? t.colors.groundEmphasis : t.colors.groundText,
        }}
      >
        <Icon
          name={icon}
          size={52}
          color={highlight ? t.colors.groundEmphasis : t.colors.groundText}
        />
        {label}
      </div>
      {children}
    </Enter>
  );
};

const ShiftInner: React.FC = () => {
  const t = useTheme();
  const sec = useSec();
  const frame = useCurrentFrame();
  const T = TIMING.shift;
  // Right panel lands messy, then tidies: palette, radius, gaps and alignment.
  const tidy = useProgress(frame, T.tidy, T.tidyDuration);
  const ease = interpolate(tidy, [0, 1], [0, 1]);

  return (
    <Stage label="03 / 06" gap={48}>
      <Overline delay={sec(T.title)}>{COPY.shift.title}</Overline>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <Panel
          name="Left panel"
          delay={sec(T.left)}
          x={-120}
          icon={COPY.shift.left.icon}
          label={COPY.shift.left.label}
          highlight={false}
        >
          <Wireframe brand={0} messy={1} skew={MESSY_SKEW} />
        </Panel>
        <Panel
          name="Right panel"
          delay={sec(T.right)}
          x={120}
          icon={COPY.shift.right.icon}
          label={COPY.shift.right.label}
          highlight
        >
          <Wireframe
            brand={ease}
            messy={1 - ease}
            skew={MESSY_SKEW * (1 - ease)}
          />
        </Panel>
      </div>
      <Enter
        name="Bottom"
        delay={sec(T.bottom)}
        y={30}
        style={{
          ...headlineStyle(t, 50),
          fontFamily: t.fonts.body,
          fontWeight: 700,
          letterSpacing: "0em",
          lineHeight: 1.25,
        }}
      >
        {COPY.shift.bottom}
      </Enter>
    </Stage>
  );
};

export const ShiftScene = makeScene("PenulisUIShiftScene", ShiftInner);
