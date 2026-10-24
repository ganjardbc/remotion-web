import { Interactive, useCurrentFrame } from "remotion";
import { Icon } from "../../icons";
import { useTheme } from "../../themes";
import {
  headlineStyle,
  Stage,
  useProgress,
  useSec,
} from "../GratisMurah/shared";
import { shakeX } from "../OpenCode9Router/parts";
import { makeScene } from "../OpenCode9Router/scene";
import { COPY, TIMING } from "./config";

const SIZE = 480;
const STROKE = 44;
const R = (SIZE - STROKE) / 2;
const C = SIZE / 2;
const BADGE = 136;

const Badge: React.FC<{
  readonly x: number;
  readonly bg: string;
  readonly opacity: number;
  readonly children: React.ReactNode;
}> = ({ x, bg, opacity, children }) => (
  <div
    style={{
      position: "absolute",
      left: C + x - BADGE / 2,
      top: C - BADGE / 2,
      width: BADGE,
      height: BADGE,
      borderRadius: 999,
      backgroundColor: bg,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      opacity,
    }}
  >
    {children}
  </div>
);

const UrgencyInner: React.FC = () => {
  const t = useTheme();
  const sec = useSec();
  const frame = useCurrentFrame();
  const T = TIMING.urgency;
  const main = useProgress(frame, T.main, 0.5);
  const sub = useProgress(frame, T.sub, 0.5);
  const fill = useProgress(frame, T.ring, T.ringDuration);
  // Badges appear as the ring sweeps through their half.
  const checkIn = useProgress(frame, T.ring + T.ringDuration * 0.7, 0.4);
  const lockIn = useProgress(frame, T.ring + T.ringDuration, 0.4);
  const shake = shakeX(frame, sec(T.lockShake), 15);

  return (
    <Stage label="04 / 06" gap={72}>
      <Interactive.Div
        name="Main"
        style={{
          ...headlineStyle(t, 84),
          opacity: main,
          translate: `0 ${(1 - main) * 30}px`,
        }}
      >
        {COPY.urgency.main}
      </Interactive.Div>
      <Interactive.Div
        name="Ring"
        style={{
          position: "relative",
          alignSelf: "center",
          width: SIZE,
          height: SIZE,
        }}
      >
        <svg width={SIZE} height={SIZE} style={{ position: "absolute" }}>
          {/* Locked half: left side, blurred. */}
          <path
            d={`M${C} ${C + R} A${R} ${R} 0 0 1 ${C} ${C - R}`}
            fill="none"
            stroke={t.code.line}
            strokeWidth={STROKE}
            strokeLinecap="round"
            style={{ filter: "blur(7px)" }}
            opacity={Math.min(1, fill * 4)}
          />
          {/* Done half: right side, fills clockwise from the top. */}
          <path
            d={`M${C} ${C - R} A${R} ${R} 0 0 1 ${C} ${C + R}`}
            fill="none"
            stroke={t.colors.accent}
            strokeWidth={STROKE}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - fill}
          />
        </svg>
        <Badge x={R * 0.5} bg={t.colors.primary} opacity={checkIn}>
          <Icon name="check" size={84} color={t.colors.onPrimary} />
        </Badge>
        <Badge x={-R * 0.5 + shake} bg={t.code.bg} opacity={lockIn * 0.9}>
          <Icon name="lock" size={72} color={t.colors.groundText} />
        </Badge>
      </Interactive.Div>
      <Interactive.Div
        name="Sub"
        style={{
          ...headlineStyle(t, 44),
          fontFamily: t.fonts.body,
          fontWeight: 500,
          lineHeight: 1.3,
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

export const UrgencyScene = makeScene("PenulisUIUrgencyScene", UrgencyInner);
