import { Interactive, interpolate, useCurrentFrame } from "remotion";
import { Backdrop } from "../../Backdrop";
import { Icon } from "../../icons";
import { useTheme } from "../../themes";
import { Enter, Hl, OFF_WHITE, PURPLE, useSpringIn } from "./parts";
import { Center, Content, makeScene } from "./scene";

const CARD_W = 700;
const CARD_H = 150;
const GAP = 64;
const STEP = CARD_H + GAP;

const nodes = [
  { icon: "terminal", label: "OpenCode" },
  { icon: "route", label: "9Router · :20128" },
  { icon: "cloud", label: "Provider" },
] as const;

const ContextInner: React.FC = () => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const pulse = interpolate(frame, [100, 110, 120], [1, 1.04, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Orange dot travelling down the stack: 45-frame loop between frames 45 and 100.
  const loop = ((frame - 45) % 45) / 45;
  const dotY = CARD_H / 2 + loop * 2 * STEP;
  const dotOpacity = interpolate(frame, [45, 50, 95, 105], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const note = useSpringIn(100);

  return (
    <>
      <Backdrop variant="ground" label="02 / 06" />
      <Content gap={80}>
        <Center>
          <div style={{ position: "relative", width: CARD_W }}>
            {nodes.map((n, i) => (
              <div key={n.label}>
                <Enter name={n.label} delay={i * 10} y={40}>
                  <Interactive.Div
                    name={`${n.label} card`}
                    style={{
                      height: CARD_H,
                      display: "flex",
                      alignItems: "center",
                      gap: 28,
                      padding: "0 40px",
                      borderRadius: t.radius.large,
                      backgroundColor: OFF_WHITE,
                      boxShadow: t.shadows.lift,
                      color: t.colors.ink,
                      fontFamily: t.fonts.heading,
                      fontWeight: 700,
                      fontSize: 48,
                      scale: i === 1 ? pulse : 1,
                    }}
                  >
                    <div
                      style={{
                        width: 88,
                        height: 88,
                        borderRadius: 999,
                        backgroundColor: t.colors.primaryTint,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Icon name={n.icon} size={52} color={t.colors.primary} />
                    </div>
                    {n.label}
                  </Interactive.Div>
                </Enter>
                {i < nodes.length - 1 ? (
                  <Enter name="Chevron" delay={i * 10 + 6} y={20}>
                    <div
                      style={{
                        height: GAP,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Icon name="chevronDown" size={56} color={PURPLE} />
                    </div>
                  </Enter>
                ) : null}
              </div>
            ))}
            <div
              style={{
                position: "absolute",
                right: 44,
                top: dotY - 12,
                width: 24,
                height: 24,
                borderRadius: 999,
                backgroundColor: t.colors.accent,
                boxShadow: `0 0 24px ${t.colors.accent}`,
                opacity: dotOpacity,
              }}
            />
          </div>
        </Center>
        <div
          style={{
            textAlign: "center",
            fontWeight: 800,
            fontSize: 68,
            lineHeight: 1.1,
            letterSpacing: `${t.type.tracking}em`,
            opacity: Math.min(1, note),
            translate: `0 ${(1 - note) * 30}px`,
          }}
        >
          Error bisa datang dari <Hl>3 titik.</Hl>
        </div>
      </Content>
    </>
  );
};

export const ContextScene = makeScene("OpenCodeContextScene", ContextInner);
