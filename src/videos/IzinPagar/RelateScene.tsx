import { Easing, interpolate, useCurrentFrame } from "remotion";
import { Icon } from "../../icons";
import { useTheme } from "../../themes";
import { Enter, Pop } from "../OpenCode9Router/parts";
import { makeScene } from "../OpenCode9Router/scene";
import { Overline, Stage, useSec } from "../GratisMurah/shared";
import { COPY, TIMING } from "./config";
import { Dialog, Note } from "./shared";

const RelateInner: React.FC = () => {
  const t = useTheme();
  const sec = useSec();
  const frame = useCurrentFrame();
  const T = TIMING.relate;
  const clicks = T.clicks.map((c) => sec(c));
  const ease = Easing.bezier(...t.motion.enter);

  // Cursor glides to the approve button, then stays there.
  const arrive = interpolate(frame, [clicks[0] - 24, clicks[0] - 4], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
  // 1 → 0 dip around each click (press feedback).
  const press = clicks.reduce((m, c) => {
    const d = interpolate(frame, [c - 3, c, c + 5], [0, 1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    return Math.max(m, d);
  }, 0);

  return (
    <Stage label="02 / 07" gap={48}>
      <Overline delay={sec(T.title)}>{COPY.relate.title}</Overline>
      <Enter name="Dialog" delay={sec(T.dialog)} y={60}>
        <Dialog name="Permission dialog">
          <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
            <div
              style={{
                width: 96,
                height: 96,
                flexShrink: 0,
                borderRadius: 999,
                backgroundColor: t.colors.primaryTint,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon name="shield" size={56} color={t.colors.primary} />
            </div>
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: 18,
              }}
            >
              <div
                style={{
                  height: 22,
                  width: "88%",
                  borderRadius: 999,
                  backgroundColor: t.colors.border,
                }}
              />
              <div
                style={{
                  height: 22,
                  width: "60%",
                  borderRadius: 999,
                  backgroundColor: t.colors.border,
                }}
              />
            </div>
          </div>
          <div style={{ position: "relative", display: "flex", gap: 24 }}>
            <div
              style={{
                flex: 1,
                padding: "28px 0",
                textAlign: "center",
                borderRadius: t.radius.card,
                backgroundColor: t.colors.primary,
                color: t.colors.onPrimary,
                fontFamily: t.fonts.body,
                fontWeight: 700,
                fontSize: 48,
                scale: 1 - 0.05 * press,
              }}
            >
              {COPY.relate.approve}
            </div>
            <div
              style={{
                flex: 1,
                padding: "26px 0",
                textAlign: "center",
                borderRadius: t.radius.card,
                border: `2px solid ${t.colors.line}`,
                color: t.colors.ink,
                fontFamily: t.fonts.body,
                fontWeight: 600,
                fontSize: 48,
              }}
            >
              {COPY.relate.deny}
            </div>
            <div
              style={{
                position: "absolute",
                left: 290 + (1 - arrive) * 330,
                top: 74 + (1 - arrive) * 190,
                opacity: arrive,
                scale: 1 - 0.12 * press,
                filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.35))",
              }}
            >
              <Icon
                name="mousePointerClick"
                size={84}
                color={t.colors.accent}
              />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 36,
              minHeight: 72,
            }}
          >
            {clicks.map((c, i) => (
              <Pop key={i} delay={c} damping={14}>
                <Icon
                  name="circleCheck"
                  size={72}
                  color={t.colors.success ?? t.colors.primary}
                />
              </Pop>
            ))}
          </div>
        </Dialog>
      </Enter>
      <Note name="Sub" delay={sec(T.sub)}>
        {COPY.relate.sub}
      </Note>
    </Stage>
  );
};

export const RelateScene = makeScene("IzinPagarRelateScene", RelateInner);
