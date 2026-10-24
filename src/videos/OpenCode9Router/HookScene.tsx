import { Easing, Interactive, interpolate, useCurrentFrame } from "remotion";
import { Backdrop } from "../../Backdrop";
import { Icon } from "../../icons";
import { useTheme } from "../../themes";
import {
  Enter,
  OFF_WHITE,
  LIGHT_BLUE,
  Pop,
  shakeX,
  useSpringIn,
} from "./parts";
import { Center, Content, makeScene } from "./scene";

const SIZE = 112;

const HookInner: React.FC = () => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const pill = useSpringIn(60);

  const row: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
    fontWeight: 800,
    fontSize: SIZE,
    lineHeight: 1.05,
    letterSpacing: `${t.type.tracking}em`,
  };

  return (
    <>
      <Backdrop variant="ground" label="01 / 06" sweep />
      <Content gap={56}>
        <Enter name="Line 1" delay={6} y={60} style={row}>
          <Pop delay={10}>
            <Icon name="circleCheck" size={SIZE * 0.85} color={LIGHT_BLUE} />
          </Pop>
          <span>Tes sukses.</span>
        </Enter>
        <Enter
          name="Line 2"
          delay={30}
          damping={12}
          y={60}
          style={{ ...row, color: t.colors.accent }}
        >
          <Interactive.Div
            name="Shake"
            style={{
              ...row,
              transform: `translateX(${shakeX(frame, 40, 12)}px)`,
            }}
          >
            <Pop delay={34}>
              <Icon name="circleX" size={SIZE * 0.85} color={t.colors.accent} />
            </Pop>
            <span>Agent error.</span>
          </Interactive.Div>
        </Enter>
        <Center>
          <Interactive.Div
            name="Pill"
            style={{
              maxWidth: 920,
              padding: "24px 48px",
              borderRadius: 64,
              backgroundColor: OFF_WHITE,
              color: t.colors.primary,
              fontFamily: t.fonts.body,
              fontWeight: 600,
              fontSize: 52,
              lineHeight: 1.2,
              textAlign: "center",
              textWrap: "balance",
              opacity: interpolate(pill, [0, 1], [0, 1], {
                easing: Easing.out(Easing.quad),
              }),
              scale: 0.9 + 0.1 * pill,
            }}
          >
            OpenCode + 9Router: 3 penyebabnya
          </Interactive.Div>
        </Center>
      </Content>
    </>
  );
};

export const HookScene = makeScene("OpenCodeHookScene", HookInner);
