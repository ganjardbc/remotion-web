import { interpolate, useCurrentFrame } from "remotion";
import { useTheme } from "../../themes";

export type Mood = "curious" | "happy" | "cold" | "wow";

const SOFT = "#CED7F3";
const EYE = "#9DB4F0";

// Small robot mascot, drawn in a 170×230 box. Bobs gently and blinks.
export const Mascot: React.FC<{
  readonly mood: Mood;
  readonly x: number;
  readonly y: number;
  readonly scale?: number;
}> = ({ mood, x, y, scale = 1 }) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const bob = Math.sin(frame / 12) * 6;
  const phase = frame % 100;
  const blink = interpolate(phase, [0, 3, 6], [1, 0.1, 1], {
    extrapolateRight: "clamp",
  });
  const pulse = 10 + Math.sin(frame / 8) * 2.5;
  const stroke = {
    stroke: EYE,
    strokeWidth: 8,
    strokeLinecap: "round" as const,
    fill: "none",
  };

  const eyes = (() => {
    switch (mood) {
      case "happy":
        return (
          <>
            <path d="M48 98 Q62 80 76 98" {...stroke} />
            <path d="M94 98 Q108 80 122 98" {...stroke} />
          </>
        );
      case "cold":
        return (
          <>
            <circle cx="62" cy="92" r="12" fill={EYE} />
            <circle cx="108" cy="92" r="12" fill={EYE} />
            <rect x="46" y="76" width="32" height="14" fill="#0B0F1A" />
            <rect x="92" y="76" width="32" height="14" fill="#0B0F1A" />
          </>
        );
      case "wow":
        return (
          <>
            <circle cx="62" cy="90" r="17" fill={EYE} />
            <circle cx="108" cy="90" r="17" fill={EYE} />
            <circle cx="62" cy="90" r="6" fill="#0B0F1A" />
            <circle cx="108" cy="90" r="6" fill="#0B0F1A" />
          </>
        );
      default:
        return (
          <g transform={`translate(0 ${90 * (1 - blink)})`}>
            <ellipse cx="62" cy="90" rx="13" ry={13 * blink} fill={EYE} />
            <ellipse cx="108" cy="88" rx="9" ry={9 * blink} fill={EYE} />
            <path d="M92 70 L124 66" {...stroke} strokeWidth={5} />
          </g>
        );
    }
  })();

  const mouth =
    mood === "happy" ? (
      <path d="M70 112 Q85 126 100 112" {...stroke} strokeWidth={6} />
    ) : mood === "wow" ? (
      <ellipse cx="85" cy="116" rx="7" ry="9" fill={EYE} />
    ) : mood === "cold" ? (
      <path d="M66 116 q6 -7 12 0 t12 0 t12 0" {...stroke} strokeWidth={5} />
    ) : (
      <path d="M74 115 L98 115" {...stroke} strokeWidth={6} />
    );

  const armUp = mood === "wow";

  return (
    <g transform={`translate(${x} ${y + bob}) scale(${scale})`}>
      <line x1="85" y1="12" x2="85" y2="38" stroke={SOFT} strokeWidth="6" />
      <circle cx="85" cy="10" r="10" fill={t.colors.accent} />
      <rect x="0" y="76" width="18" height="34" rx="9" fill={SOFT} />
      <rect x="152" y="76" width="18" height="34" rx="9" fill={SOFT} />
      <rect x="15" y="36" width="140" height="116" rx="34" fill="#F2F3F7" />
      <rect x="32" y="56" width="106" height="78" rx="26" fill="#0B0F1A" />
      {eyes}
      {mouth}
      <rect x="40" y="154" width="90" height="70" rx="26" fill={SOFT} />
      <circle cx="85" cy="190" r={pulse} fill={t.colors.accent} />
      <line
        x1="42"
        y1="170"
        x2={armUp ? 8 : 14}
        y2={armUp ? 128 : 200}
        stroke={SOFT}
        strokeWidth="14"
        strokeLinecap="round"
      />
      <line
        x1="128"
        y1="170"
        x2={armUp ? 162 : 156}
        y2={armUp ? 128 : 200}
        stroke={SOFT}
        strokeWidth="14"
        strokeLinecap="round"
      />
      {mood === "cold" ? (
        <>
          <rect
            x="30"
            y="146"
            width="110"
            height="20"
            rx="10"
            fill={t.colors.accent}
          />
          <rect
            x="100"
            y="156"
            width="22"
            height="46"
            rx="10"
            fill={t.colors.accent}
          />
        </>
      ) : null}
    </g>
  );
};
