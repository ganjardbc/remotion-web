import { Interactive, interpolate } from "remotion";
import { Icon } from "../../icons";
import { useTheme } from "../../themes";
import { Overline, Stage, useSec } from "../GratisMurah/shared";
import { Enter, useSpringIn } from "../OpenCode9Router/parts";
import { makeScene } from "../OpenCode9Router/scene";
import { COPY, TIMING } from "./config";

type IconName = React.ComponentProps<typeof Icon>["name"];

const Card: React.FC<{
  readonly index: number;
  readonly delay: number;
  readonly x: number;
  readonly icon: IconName;
  readonly text: string;
}> = ({ index, delay, x, icon, text }) => {
  const t = useTheme();
  return (
    <Enter
      name={`Card ${index + 1}`}
      delay={delay}
      x={x}
      y={0}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 36,
        padding: "40px 48px",
        borderRadius: t.radius.large,
        backgroundColor: t.colors.groundChipBg,
        boxShadow: t.shadows.lift,
        fontFamily: t.fonts.body,
        fontWeight: 700,
        fontSize: 54,
        lineHeight: 1.2,
        color: t.colors.ink,
      }}
    >
      <div
        style={{
          width: 120,
          height: 120,
          flexShrink: 0,
          borderRadius: 999,
          backgroundColor: t.colors.primaryTint,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon name={icon} size={68} color={t.colors.primary} />
      </div>
      <div>{text}</div>
    </Enter>
  );
};

const RelateInner: React.FC = () => {
  const t = useTheme();
  const sec = useSec();
  const T = TIMING.relate;
  // Smooth settle (no overshoot): the stamp presses down from slightly large.
  const stamp = useSpringIn(sec(T.stamp), 22);

  return (
    <Stage label="02 / 06" gap={40}>
      <Overline delay={sec(T.title)}>{COPY.relate.title}</Overline>
      {COPY.relate.cards.map((c, i) => (
        <Card
          key={c.text}
          index={i}
          delay={sec(T.firstCard + i * T.cardGap)}
          x={i === 0 ? -300 : 300}
          icon={c.icon}
          text={c.text}
        />
      ))}
      <Interactive.Div
        name="Stamp"
        style={{
          alignSelf: "center",
          marginTop: 32,
          display: "flex",
          alignItems: "center",
          gap: 20,
          padding: "20px 36px",
          borderRadius: t.radius.card,
          border: `6px solid ${t.colors.groundEmphasis}`,
          backgroundColor: t.colors.ground,
          color: t.colors.groundEmphasis,
          fontFamily: t.fonts.mono,
          fontWeight: 700,
          fontSize: 42,
          letterSpacing: "0.02em",
          rotate: "-6deg",
          scale: interpolate(stamp, [0, 1], [1.5, 1]),
          opacity: Math.min(1, Math.max(0, stamp) * 3),
        }}
      >
        <Icon
          name={COPY.relate.stamp.icon}
          size={56}
          color={t.colors.groundEmphasis}
        />
        {COPY.relate.stamp.text}
      </Interactive.Div>
    </Stage>
  );
};

export const RelateScene = makeScene("FileDibajakRelateScene", RelateInner);
