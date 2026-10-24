import { Easing, interpolate, useCurrentFrame } from "remotion";
import { Icon } from "../../icons";
import { useTheme } from "../../themes";
import { CodeCard, Enter, Typed } from "../OpenCode9Router/parts";
import { makeScene } from "../OpenCode9Router/scene";
import { headlineStyle, Overline, Stage, useSec } from "../GratisMurah/shared";
import { COPY, TIMING } from "./config";
import { Dialog, Note } from "./shared";

const FULL_HEIGHT = 330;
const SMALL_HEIGHT = 190;
const SMALL_SCALE = 0.58;

const Shift1Inner: React.FC = () => {
  const t = useTheme();
  const sec = useSec();
  const frame = useCurrentFrame();
  const T = TIMING.shift1;
  // 0 → 1: trust dialog shrinks upward as the code card arrives.
  const shrink = interpolate(
    frame,
    [sec(T.shrink), sec(T.shrink) + 18],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(...t.motion.enter),
    },
  );

  return (
    <Stage label="03 / 07" gap={36}>
      <Overline delay={sec(T.title)}>{COPY.shift1.title}</Overline>
      <Enter
        name="Main"
        delay={sec(T.main)}
        y={40}
        style={headlineStyle(t, 84)}
      >
        {COPY.shift1.main}
      </Enter>
      <Enter name="Trust dialog" delay={sec(T.dialog)} y={60}>
        <div
          style={{
            height: interpolate(shrink, [0, 1], [FULL_HEIGHT, SMALL_HEIGHT]),
            opacity: interpolate(shrink, [0, 1], [1, 0.72]),
          }}
        >
          <Dialog
            name="Trust dialog card"
            style={{
              transformOrigin: "top center",
              scale: interpolate(shrink, [0, 1], [1, SMALL_SCALE]),
              height: FULL_HEIGHT,
              justifyContent: "center",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
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
                <Icon name="folderLock" size={72} color={t.colors.primary} />
              </div>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 20 }}
              >
                {COPY.shift1.rows.map((row, i) => (
                  <Enter
                    key={row}
                    name={`Row ${i + 1}`}
                    delay={sec(T.rows + i * T.rowGap)}
                    x={-40}
                    y={0}
                    style={{
                      padding: "14px 28px",
                      borderRadius: t.radius.card,
                      backgroundColor: t.colors.primaryTint,
                      fontFamily: t.fonts.mono,
                      fontSize: 40,
                      color: t.colors.ink,
                    }}
                  >
                    {row}
                  </Enter>
                ))}
              </div>
            </div>
          </Dialog>
        </div>
      </Enter>
      <CodeCard
        name="Code card"
        delay={sec(T.code)}
        y={260}
        icon={<Icon name="terminal" size={44} color={t.colors.accent} />}
        style={{ fontSize: 28, gap: 24, padding: "36px 32px" }}
      >
        <Typed
          parts={[{ text: COPY.shift1.code }]}
          start={sec(T.type)}
          cps={0.9}
        />
      </CodeCard>
      <Note name="Note" delay={sec(T.note)}>
        {COPY.shift1.note}
      </Note>
      <Note name="Note dim" delay={sec(T.noteDim)} dim>
        {COPY.shift1.noteDim}
      </Note>
    </Stage>
  );
};

export const Shift1Scene = makeScene("IzinPagarShift1Scene", Shift1Inner);
