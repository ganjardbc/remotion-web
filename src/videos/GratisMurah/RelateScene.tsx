import { Interactive, interpolate } from "remotion";
import { Icon } from "../../icons";
import { useTheme } from "../../themes";
import { Enter, useSpringIn } from "../OpenCode9Router/parts";
import { makeScene } from "../OpenCode9Router/scene";
import { COPY, TIMING } from "./config";
import { Overline, Stage, useSec } from "./shared";

type IconName = React.ComponentProps<typeof Icon>["name"];

const RelateCard: React.FC<{
  readonly index: number;
  readonly delay: number;
  readonly icon: IconName;
  readonly text: string;
}> = ({ index, delay, icon, text }) => {
  const t = useTheme();
  const sec = useSec();
  // Icon squashes slightly when the card lands, then settles.
  const land = useSpringIn(delay + sec(TIMING.relate.iconBounceLag), 7);

  return (
    <Enter
      name={`Card ${index + 1}`}
      delay={delay}
      x={-260}
      y={0}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 32,
        padding: "36px 44px",
        borderRadius: t.radius.large,
        backgroundColor: t.colors.groundChipBg,
        boxShadow: t.shadows.lift,
        fontFamily: t.fonts.body,
        fontWeight: 600,
        fontSize: 52,
        lineHeight: 1.2,
        color: t.colors.ink,
      }}
    >
      <Interactive.Div
        name="Icon"
        style={{
          width: 112,
          height: 112,
          flexShrink: 0,
          borderRadius: 999,
          backgroundColor: t.colors.primaryTint,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          scale: interpolate(land, [0, 1], [0.6, 1]),
        }}
      >
        <Icon name={icon} size={64} color={t.colors.primary} />
      </Interactive.Div>
      <div>{text}</div>
    </Enter>
  );
};

const RelateInner: React.FC = () => {
  const sec = useSec();
  return (
    <Stage label="02 / 07" gap={40}>
      <Overline delay={sec(TIMING.relate.title)}>{COPY.relate.title}</Overline>
      {COPY.relate.cards.map((c, i) => (
        <RelateCard
          key={c.text}
          index={i}
          delay={sec(TIMING.relate.firstCard + i * TIMING.relate.cardGap)}
          icon={c.icon}
          text={c.text}
        />
      ))}
    </Stage>
  );
};

export const RelateScene = makeScene("GratisMurahRelateScene", RelateInner);
