import { Interactive, interpolate, useCurrentFrame } from "remotion";
import { Icon } from "../../icons";
import { useTheme } from "../../themes";
import { Enter, useSpringIn } from "../OpenCode9Router/parts";
import { makeScene } from "../OpenCode9Router/scene";
import { Overline, Stage, useSec } from "../GratisMurah/shared";
import { COPY, TIMING } from "./config";

type IconName = React.ComponentProps<typeof Icon>["name"];

const Card: React.FC<{
  readonly index: number;
  readonly delay: number;
  readonly x: number;
  readonly icon: IconName;
  readonly label: string;
  readonly text: string;
  readonly bad: boolean;
}> = ({ index, delay, x, icon, label, text, bad }) => {
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
        color: t.colors.ink,
      }}
    >
      <div
        style={{
          width: 120,
          height: 120,
          flexShrink: 0,
          borderRadius: 999,
          backgroundColor: bad ? t.colors.accent : t.colors.primaryTint,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon
          name={icon}
          size={68}
          color={bad ? t.colors.onAccent : t.colors.primary}
        />
      </div>
      <div>
        <div
          style={{
            fontFamily: t.fonts.mono,
            fontSize: 38,
            letterSpacing: "0.04em",
            color: t.colors.muted,
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontFamily: t.fonts.body,
            fontWeight: 700,
            fontSize: 58,
            lineHeight: 1.15,
          }}
        >
          {text}
        </div>
      </div>
    </Enter>
  );
};

const RelateInner: React.FC = () => {
  const t = useTheme();
  const sec = useSec();
  const frame = useCurrentFrame();
  const T = TIMING.relate;
  const pop = useSpringIn(sec(T.bubble), 8);
  const spin = interpolate(frame - sec(T.bubble), [0, 6 * 30], [0, 360], {
    extrapolateLeft: "clamp",
  });

  return (
    <Stage label="02 / 06" gap={40}>
      <Overline delay={sec(T.title)}>{COPY.relate.title}</Overline>
      {COPY.relate.cards.map((c, i) => (
        <Card
          key={c.label}
          index={i}
          delay={sec(T.firstCard + i * T.cardGap)}
          x={i === 0 ? -300 : 300}
          icon={c.icon}
          label={c.label}
          text={c.text}
          bad={i === 1}
        />
      ))}
      <Interactive.Div
        name="Bubble"
        style={{
          alignSelf: "flex-end",
          display: "flex",
          alignItems: "center",
          gap: 20,
          padding: "22px 36px 22px 28px",
          borderRadius: 999,
          backgroundColor: t.code.raised,
          border: `2px solid ${t.code.line}`,
          boxShadow: t.shadows.lift,
          fontFamily: t.fonts.body,
          fontWeight: 600,
          fontSize: 44,
          color: t.colors.groundText,
          transformOrigin: "right center",
          scale: Math.max(0, pop),
          opacity: Math.min(1, pop * 3),
        }}
      >
        <div style={{ display: "flex", rotate: `${spin}deg` }}>
          <Icon name="refreshCw" size={48} color={t.colors.groundTextMuted} />
        </div>
        {COPY.relate.bubble}
      </Interactive.Div>
    </Stage>
  );
};

export const RelateScene = makeScene("AgenBodohRelateScene", RelateInner);
