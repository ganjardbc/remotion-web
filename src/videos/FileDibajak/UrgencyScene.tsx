import {
  Interactive,
  interpolate,
  interpolateColors,
  useCurrentFrame,
} from "remotion";
import { Icon } from "../../icons";
import { useTheme } from "../../themes";
import {
  headlineStyle,
  Stage,
  useProgress,
  useSec,
} from "../GratisMurah/shared";
import { Enter, shakeX } from "../OpenCode9Router/parts";
import { makeScene } from "../OpenCode9Router/scene";
import { COPY, TIMING } from "./config";

const Step: React.FC<{
  readonly index: number;
  readonly delay: number;
  readonly locked: boolean;
  readonly shake: number;
}> = ({ index, delay, locked, shake }) => {
  const t = useTheme();
  const T = TIMING.urgency;
  const frame = useCurrentFrame();
  // Step 1 starts closed like the others, then opens and fills in.
  const open = useProgress(frame, T.open, 0.5);
  const check = useProgress(frame, T.check, 0.4);
  const closed = locked ? 1 : 1 - open;

  return (
    <Enter
      name={`Step ${index + 1}`}
      delay={delay}
      y={80}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 32,
        minHeight: 168,
        padding: "34px 44px",
        // Wider at the bottom so the steps read as a stack.
        marginInline: index * 28,
        borderRadius: t.radius.large,
        backgroundColor: locked
          ? t.code.raised
          : interpolateColors(
              open,
              [0, 1],
              [t.code.raised, t.colors.groundChipBg],
            ),
        border: `2px solid ${locked ? t.code.line : "transparent"}`,
        boxShadow: t.shadows.lift,
        opacity: locked ? 0.7 : interpolate(open, [0, 1], [0.7, 1]),
      }}
    >
      <div
        style={{
          position: "relative",
          width: 96,
          height: 96,
          flexShrink: 0,
          borderRadius: 999,
          backgroundColor: locked
            ? t.code.bg
            : interpolateColors(open, [0, 1], [t.code.bg, t.colors.accent]),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `translateX(${locked ? shake : 0}px)`,
        }}
      >
        <div style={{ position: "absolute", display: "flex", opacity: closed }}>
          <Icon name="lock" size={52} color={t.colors.groundText} />
        </div>
        {locked ? null : (
          <div style={{ position: "absolute", display: "flex", opacity: open }}>
            <Icon
              name={COPY.urgency.step.icon}
              size={56}
              color={t.colors.onAccent}
            />
          </div>
        )}
      </div>
      <div style={{ position: "relative", flex: 1 }}>
        <div
          style={{
            height: 22,
            borderRadius: 999,
            backgroundColor: t.code.line,
            filter: "blur(6px)",
            opacity: closed,
          }}
        />
        {locked ? null : (
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: "50%",
              translate: "0 -50%",
              opacity: open,
              fontFamily: t.fonts.body,
              fontWeight: 700,
              fontSize: 48,
              lineHeight: 1.15,
              color: t.colors.ink,
            }}
          >
            {COPY.urgency.step.text}
          </div>
        )}
      </div>
      {locked ? null : (
        <div
          style={{
            width: 72,
            height: 72,
            flexShrink: 0,
            borderRadius: 999,
            backgroundColor: t.colors.primary,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: open,
          }}
        >
          <svg width={44} height={44} viewBox="0 0 24 24" fill="none">
            <path
              d="M20 6 9 17l-5-5"
              stroke={t.colors.onPrimary}
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - check}
            />
          </svg>
        </div>
      )}
    </Enter>
  );
};

const UrgencyInner: React.FC = () => {
  const t = useTheme();
  const sec = useSec();
  const frame = useCurrentFrame();
  const T = TIMING.urgency;
  const main = useProgress(frame, T.main, 0.5);
  const sub = useProgress(frame, T.sub, 0.5);
  const shake = shakeX(frame, sec(T.lockShake), 15);
  const total = 1 + COPY.urgency.lockedSteps;

  return (
    <Stage label="04 / 06" gap={64}>
      <Interactive.Div
        name="Main"
        style={{ ...headlineStyle(t, 50), opacity: main }}
      >
        {COPY.urgency.main}
      </Interactive.Div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {Array.from({ length: total }, (_, i) => (
          <Step
            key={i}
            index={i}
            delay={sec(T.firstStep + i * T.stepGap)}
            locked={i > 0}
            shake={shake}
          />
        ))}
      </div>
      <Interactive.Div
        name="Sub"
        style={{
          ...headlineStyle(t, 40),
          fontFamily: t.fonts.body,
          fontWeight: 500,
          lineHeight: 1.25,
          letterSpacing: "0em",
          color: t.colors.groundTextMuted,
          opacity: sub,
          translate: `0 ${(1 - sub) * 24}px`,
        }}
      >
        {COPY.urgency.sub}
      </Interactive.Div>
    </Stage>
  );
};

export const UrgencyScene = makeScene("FileDibajakUrgencyScene", UrgencyInner);
