import { interpolateColors, useCurrentFrame } from "remotion";
import { Icon } from "../../icons";
import { useTheme } from "../../themes";
import { Overline, Stage, useProgress, useSec } from "../GratisMurah/shared";
import { Enter, Pop, useSpringIn } from "../OpenCode9Router/parts";
import { makeScene } from "../OpenCode9Router/scene";
import { COPY, TIMING } from "./config";
import { Wireframe, WIRE_H, WIRE_W } from "./Wireframe";

type IconName = React.ComponentProps<typeof Icon>["name"];

// Where each marker sits next to the wireframe, in px from its top-left.
const MARKER_W = 280;
const MARKER_POS = [
  { x: -MARKER_W + 40, y: 4 },
  { x: WIRE_W - 40, y: 160 },
  { x: -MARKER_W + 40, y: 336 },
] as const;

const Marker: React.FC<{
  readonly index: number;
  readonly delay: number;
  readonly icon: IconName;
  readonly text: string;
}> = ({ index, delay, icon, text }) => {
  const t = useTheme();
  const p = useSpringIn(delay, 14);
  return (
    <div
      style={{
        position: "absolute",
        left: MARKER_POS[index].x,
        top: MARKER_POS[index].y,
        width: MARKER_W,
        boxSizing: "border-box",
        padding: "20px 20px 24px",
        borderRadius: t.radius.large,
        backgroundColor: t.code.raised,
        border: `2px solid ${t.colors.accent}`,
        boxShadow: t.shadows.lift,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 14,
        textAlign: "center",
        fontFamily: t.fonts.body,
        fontWeight: 700,
        fontSize: 32,
        lineHeight: 1.2,
        color: t.colors.groundText,
        opacity: Math.min(1, Math.max(0, p * 2)),
        scale: 0.8 + 0.2 * Math.max(0, p),
      }}
    >
      <Pop delay={delay + 3}>
        <Icon name={icon} size={60} color={t.colors.accent} />
      </Pop>
      <div>{text}</div>
    </div>
  );
};

const RelateInner: React.FC = () => {
  const t = useTheme();
  const sec = useSec();
  const frame = useCurrentFrame();
  const T = TIMING.relate;
  const at = (i: number) => T.firstMarker + i * T.markerGap;
  const measure = useProgress(frame, at(1) + 0.2, T.measureDuration);
  const offBrand = useProgress(frame, at(2) + 0.2, T.measureDuration);
  const offBrandColor = t.colors.success ?? t.colors.danger ?? t.colors.accent;
  const button = interpolateColors(
    offBrand,
    [0, 1],
    [t.colors.line, offBrandColor],
  );

  return (
    <Stage label="02 / 06" gap={72}>
      <Overline delay={sec(T.title)}>{COPY.relate.title}</Overline>
      <div
        style={{
          position: "relative",
          alignSelf: "center",
          width: WIRE_W,
          height: WIRE_H,
        }}
      >
        <Enter name="Wireframe" delay={sec(T.wireframe)} y={60}>
          <Wireframe
            brand={0}
            messy={0}
            skew={40}
            measure={measure}
            buttonColor={button}
          />
        </Enter>
        {COPY.relate.markers.map((m, i) => (
          <Marker
            key={m.text}
            index={i}
            delay={sec(at(i))}
            icon={m.icon}
            text={m.text}
          />
        ))}
      </div>
    </Stage>
  );
};

export const RelateScene = makeScene("PenulisUIRelateScene", RelateInner);
