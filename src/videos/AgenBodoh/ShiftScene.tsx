import { Interactive } from "remotion";
import { Icon } from "../../icons";
import { useTheme } from "../../themes";
import { Enter, Typed, useSpringIn } from "../OpenCode9Router/parts";
import { makeScene } from "../OpenCode9Router/scene";
import { headlineStyle, Overline, Stage, useSec } from "../GratisMurah/shared";
import { COPY, TIMING } from "./config";

const ShiftInner: React.FC = () => {
  const t = useTheme();
  const sec = useSec();
  const T = TIMING.shift;
  const stamp = useSpringIn(sec(T.stamp), 9);

  return (
    <Stage label="03 / 06" gap={44}>
      <Overline delay={sec(T.title)}>{COPY.shift.title}</Overline>
      <Enter
        name="Main"
        delay={sec(T.main)}
        y={40}
        style={headlineStyle(t, 96)}
      >
        {COPY.shift.main}
      </Enter>
      <Enter
        name="Document"
        delay={sec(T.card)}
        y={60}
        style={{
          position: "relative",
          marginTop: 24,
          padding: "44px 48px",
          borderRadius: t.radius.large,
          backgroundColor: t.code.raised,
          border: `2px solid ${t.code.line}`,
          boxShadow: t.shadows.lift,
          display: "flex",
          flexDirection: "column",
          gap: 36,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            paddingBottom: 32,
            borderBottom: `2px solid ${t.code.line}`,
            fontFamily: t.fonts.mono,
            fontSize: 40,
            color: t.code.muted,
          }}
        >
          <Icon name="fileText" size={48} color={t.code.muted} />
          {COPY.shift.fileName}
        </div>
        {COPY.shift.rows.map((row, i) => {
          const start = sec(T.firstRow + i * T.rowGap);
          return (
            <Enter
              key={row.text}
              name={`Row ${i + 1}`}
              delay={start}
              x={-60}
              y={0}
              style={{ display: "flex", alignItems: "center", gap: 28 }}
            >
              <Icon name={row.icon} size={56} color={t.colors.groundEmphasis} />
              <div
                style={{
                  fontFamily: t.fonts.body,
                  fontWeight: 600,
                  fontSize: 54,
                  color: t.code.text,
                }}
              >
                <Typed
                  parts={[{ text: row.text }]}
                  start={start}
                  cps={0.9}
                />
              </div>
            </Enter>
          );
        })}
        <Interactive.Div
          name="Stamp"
          style={{
            position: "absolute",
            top: -44,
            right: -20,
            padding: "8px 28px",
            borderRadius: t.radius.card,
            border: `6px solid ${t.colors.groundEmphasis}`,
            backgroundColor: t.colors.ground,
            color: t.colors.groundEmphasis,
            fontFamily: t.fonts.mono,
            fontWeight: 700,
            fontSize: 46,
            letterSpacing: "0.08em",
            rotate: "-10deg",
            scale: interpolateStamp(stamp),
            opacity: Math.min(1, stamp * 3),
          }}
        >
          {COPY.shift.stamp}
        </Interactive.Div>
      </Enter>
    </Stage>
  );
};

// Stamp lands from large to normal size.
const interpolateStamp = (p: number): number => 1.8 - 0.8 * Math.max(0, p);

export const ShiftScene = makeScene("AgenBodohShiftScene", ShiftInner);
