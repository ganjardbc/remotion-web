import { interpolate, interpolateColors, useCurrentFrame } from "remotion";
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

// Layout of the file → agent diagram, in px inside a 920px-wide box.
const CARD_W = 620;
const CARD_GAP = 24;
const CARD_H = [220, 276, 220] as const;
const AGENT = { cx: 830, r: 80 } as const;
const ARROW_END_X = AGENT.cx - AGENT.r - 8;

const tops = CARD_H.map((_, i) =>
  CARD_H.slice(0, i).reduce((n, h) => n + h + CARD_GAP, 0),
);
const DIAGRAM_H = tops[2] + CARD_H[2];
const AGENT_Y = DIAGRAM_H / 2;

const Bar: React.FC<{ readonly width: string; readonly color: string }> = ({
  width,
  color,
}) => (
  <div
    style={{ height: 16, width, borderRadius: 999, backgroundColor: color }}
  />
);

const FileCard: React.FC<{
  readonly index: number;
  readonly flagged: boolean;
}> = ({ index, flagged }) => {
  const t = useTheme();
  const sec = useSec();
  const frame = useCurrentFrame();
  const T = TIMING.shift;
  const file = COPY.shift.files[index];
  const mark = interpolate(
    frame,
    [sec(T.highlight), sec(T.highlight) + 12],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const barColor = flagged
    ? interpolateColors(mark, [0, 1], [t.code.line, t.colors.accent])
    : t.code.line;

  return (
    <Enter
      name={`File ${index + 1}`}
      delay={sec(T.firstCard + index * T.cardGap)}
      x={-140}
      y={0}
      style={{
        position: "absolute",
        left: 0,
        top: tops[index],
        width: CARD_W,
        height: CARD_H[index],
        boxSizing: "border-box",
        padding: "24px 32px",
        borderRadius: t.radius.large,
        backgroundColor: t.code.raised,
        border: `2px solid ${flagged ? barColor : t.code.line}`,
        boxShadow: t.shadows.lift,
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <Icon name={file.icon} size={52} color={t.code.muted} />
        <div
          style={{
            fontFamily: t.fonts.mono,
            fontWeight: 700,
            fontSize: 40,
            color: t.code.text,
          }}
        >
          {file.name}
        </div>
      </div>
      <div
        style={{
          alignSelf: "flex-start",
          padding: "2px 16px",
          borderRadius: 999,
          border: `2px solid ${t.code.line}`,
          fontFamily: t.fonts.mono,
          fontSize: 26,
          color: t.code.muted,
        }}
      >
        {COPY.shift.source}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          marginTop: 4,
        }}
      >
        <Bar width="88%" color={t.code.line} />
        <Bar width={flagged ? "100%" : "64%"} color={barColor} />
      </div>
      {flagged ? (
        <Enter
          name="Flag label"
          delay={sec(T.flaggedLabel)}
          y={16}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontFamily: t.fonts.body,
            fontWeight: 600,
            fontSize: 26,
            whiteSpace: "nowrap",
            color: t.colors.groundEmphasis,
          }}
        >
          <Icon name="eyeOff" size={36} color={t.colors.groundEmphasis} />
          {COPY.shift.flaggedLabel}
        </Enter>
      ) : null}
    </Enter>
  );
};

const Arrow: React.FC<{
  readonly index: number;
  readonly flagged: boolean;
}> = ({ index, flagged }) => {
  const t = useTheme();
  const T = TIMING.shift;
  const p = useProgress(
    useCurrentFrame(),
    T.firstArrow + index * T.arrowGap,
    T.arrowDuration,
  );
  const y = tops[index] + CARD_H[index] / 2;
  const color = flagged ? t.colors.groundEmphasis : t.colors.groundTextMuted;
  const headOpacity = interpolate(p, [0.85, 1], [0, 1], {
    extrapolateLeft: "clamp",
  });

  return (
    <>
      <path
        d={`M${CARD_W} ${y} C ${CARD_W + 80} ${y} ${ARROW_END_X - 80} ${AGENT_Y} ${ARROW_END_X} ${AGENT_Y}`}
        fill="none"
        stroke={color}
        strokeWidth={5}
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - p}
        opacity={Math.min(1, p * 10)}
      />
      <path
        d={`M${ARROW_END_X - 16} ${AGENT_Y - 16} L${ARROW_END_X} ${AGENT_Y} L${ARROW_END_X - 16} ${AGENT_Y + 16}`}
        fill="none"
        stroke={color}
        strokeWidth={5}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={headOpacity}
      />
    </>
  );
};

const ShiftInner: React.FC = () => {
  const t = useTheme();
  const sec = useSec();
  const frame = useCurrentFrame();
  const T = TIMING.shift;
  // Agent glows once the last arrow has arrived.
  const litAt = sec(T.firstArrow + 2 * T.arrowGap + T.arrowDuration - 0.2);
  const lit = interpolate(frame, [litAt, litAt + 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <Stage label="03 / 06" gap={44}>
      <Overline delay={sec(T.title)}>{COPY.shift.title}</Overline>
      <div style={{ position: "relative", height: DIAGRAM_H }}>
        {COPY.shift.files.map((f, i) => (
          <FileCard
            key={f.name}
            index={i}
            flagged={i === COPY.shift.flaggedFile}
          />
        ))}
        <svg
          width={920}
          height={DIAGRAM_H}
          style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}
        >
          {COPY.shift.files.map((f, i) => (
            <Arrow
              key={f.name}
              index={i}
              flagged={i === COPY.shift.flaggedFile}
            />
          ))}
        </svg>
        <Enter
          name="Agent"
          delay={sec(T.agent)}
          y={0}
          style={{
            position: "absolute",
            left: AGENT.cx - AGENT.r,
            top: AGENT_Y - AGENT.r,
            width: AGENT.r * 2,
            height: AGENT.r * 2,
            borderRadius: 999,
            backgroundColor: t.colors.groundChipBg,
            boxShadow: `0 0 ${60 * lit}px color-mix(in srgb, ${t.colors.primary} ${Math.round(70 * lit)}%, transparent)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon name="bot" size={96} color={t.colors.groundChipText} />
        </Enter>
      </div>
      <Enter
        name="Line 1"
        delay={sec(T.line1)}
        y={30}
        style={{
          ...headlineStyle(t, 50),
          fontFamily: t.fonts.body,
          fontWeight: 600,
          letterSpacing: "0em",
          lineHeight: 1.25,
          color: t.colors.groundTextMuted,
        }}
      >
        {COPY.shift.line1}
      </Enter>
      <Enter
        name="Line 2"
        delay={sec(T.line2)}
        y={30}
        style={{
          ...headlineStyle(t, 56),
          whiteSpace: "nowrap",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 24,
        }}
      >
        <Icon name="shield" size={72} color={t.colors.groundText} />
        {COPY.shift.line2}
      </Enter>
    </Stage>
  );
};

export const ShiftScene = makeScene("FileDibajakShiftScene", ShiftInner);
