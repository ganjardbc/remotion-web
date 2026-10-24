import { Easing, Interactive, interpolate, useCurrentFrame } from "remotion";
import { Icon } from "../../icons";
import { useTheme } from "../../themes";
import { shakeX } from "../OpenCode9Router/parts";
import { makeScene } from "../OpenCode9Router/scene";
import { headlineStyle, Stage, useSec } from "../GratisMurah/shared";
import { COPY, TIMING } from "./config";
import { Note } from "./shared";

const SIZE = 440;
const STROKE = 36;
const R = (SIZE - STROKE) / 2;
const C = 2 * Math.PI * R;

const UrgencyInner: React.FC = () => {
  const t = useTheme();
  const sec = useSec();
  const frame = useCurrentFrame();
  const T = TIMING.urgency;
  const main = interpolate(frame, [sec(T.main), sec(T.main) + 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ring = interpolate(frame, [sec(T.ring), sec(T.ring) + 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...t.motion.enter),
  });
  const shake = shakeX(frame, sec(T.lockShake), 15);

  return (
    <Stage label="04 / 07" gap={72}>
      <Interactive.Div
        name="Main"
        style={{ ...headlineStyle(t, 80), opacity: main }}
      >
        {COPY.urgency.main}
      </Interactive.Div>
      <Interactive.Div
        name="Progress ring"
        style={{
          alignSelf: "center",
          position: "relative",
          width: SIZE,
          height: SIZE,
          opacity: Math.min(1, ring * 4),
        }}
      >
        <svg
          width={SIZE}
          height={SIZE}
          style={{ position: "absolute", inset: 0, rotate: "-90deg" }}
        >
          {/* Unfilled half: blurred, dimmed. */}
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={R}
            fill="none"
            stroke={t.code.line}
            strokeWidth={STROKE}
            strokeDasharray={`${C / 2} ${C}`}
            strokeDashoffset={-C / 2}
            style={{ filter: "blur(5px)" }}
          />
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={R}
            fill="none"
            stroke={t.colors.primarySoft}
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={`${(C / 2) * ring} ${C}`}
          />
        </svg>
        <div
          style={{
            position: "absolute",
            top: STROKE * 2,
            bottom: STROKE * 2,
            left: STROKE * 2,
            right: STROKE * 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 24,
          }}
        >
          <div
            style={{
              opacity: 0.55,
              filter: "blur(3px)",
              translate: `${shake}px 0`,
            }}
          >
            <Icon name="lock" size={84} color={t.colors.groundText} />
          </div>
          <div style={{ opacity: ring }}>
            <Icon name="check" size={84} color={t.colors.primarySoft} />
          </div>
        </div>
      </Interactive.Div>
      <Note name="Sub" delay={sec(T.sub)}>
        {COPY.urgency.sub}
      </Note>
    </Stage>
  );
};

export const UrgencyScene = makeScene("IzinPagarUrgencyScene", UrgencyInner);
