import { interpolate, interpolateColors } from "remotion";
import { useTheme } from "../../themes";

export const WIRE_W = 440;
export const WIRE_H = 460;

const PAD = 24;
const CARD_H = 196;

type Props = {
  // 0 = dull grey, 1 = design-system palette.
  readonly brand: number;
  // 0 = consistent radius/gaps/bars, 1 = uneven.
  readonly messy: number;
  // Vertical offset (px) of the second card; 0 = aligned.
  readonly skew: number;
  // Overrides the palette-driven button colour (e.g. an off-brand hue).
  readonly buttonColor?: string;
  // 0 → 1 grows a measuring line between the two card tops.
  readonly measure?: number;
};

// Generic wireframe: header, two content cards, one button. Boxes and bars only.
export const Wireframe: React.FC<Props> = ({
  brand,
  messy,
  skew,
  buttonColor,
  measure = 0,
}) => {
  const t = useTheme();
  const mix = (grey: string, brandColor: string) =>
    interpolateColors(brand, [0, 1], [grey, brandColor]);
  const lerp = (clean: number, uneven: number) =>
    interpolate(messy, [0, 1], [clean, uneven]);

  const headerBg = mix(t.colors.line, t.colors.primary);
  const cardBg = mix(t.colors.surface, t.colors.primaryTint);
  const block = mix(t.colors.line, t.colors.primarySoft);
  const bar = mix(t.colors.line, t.colors.primarySoft);
  const button = buttonColor ?? mix(t.colors.line, t.colors.accent);
  const headerInk = mix(t.colors.surface, t.colors.onPrimary);

  const gap = lerp(20, 34);
  const cardW = (WIRE_W - PAD * 2 - 20) / 2;
  const cardTop = PAD + 72 + 28;
  const buttonTop = cardTop + CARD_H + 36;

  const card = (i: 0 | 1) => (
    <div
      style={{
        position: "absolute",
        left: PAD + i * (cardW + 20),
        top: cardTop + (i === 1 ? skew : 0),
        width: cardW,
        height: CARD_H,
        boxSizing: "border-box",
        padding: 16,
        borderRadius: i === 0 ? lerp(12, 4) : lerp(12, 22),
        backgroundColor: cardBg,
        border: `2px solid ${t.colors.border}`,
        display: "flex",
        flexDirection: "column",
        gap: i === 0 ? 14 : gap - 6,
      }}
    >
      <div
        style={{
          height: 88,
          borderRadius: lerp(8, i === 0 ? 2 : 14),
          backgroundColor: block,
        }}
      />
      <div
        style={{
          height: 14,
          width: `${i === 0 ? 86 : lerp(86, 54)}%`,
          borderRadius: 999,
          backgroundColor: bar,
        }}
      />
      <div
        style={{
          height: 14,
          width: `${lerp(60, i === 0 ? 72 : 90)}%`,
          borderRadius: 999,
          backgroundColor: bar,
        }}
      />
    </div>
  );

  const lineH = measure * Math.abs(skew);

  return (
    <div
      style={{
        position: "relative",
        width: WIRE_W,
        height: WIRE_H,
        borderRadius: t.radius.large,
        backgroundColor: t.colors.groundChipBg,
        border: `2px solid ${t.colors.border}`,
        boxShadow: t.shadows.lift,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: PAD,
          right: PAD,
          top: PAD,
          height: 72,
          borderRadius: lerp(12, 28),
          backgroundColor: headerBg,
          display: "flex",
          alignItems: "center",
          gap: 16,
          padding: "0 20px",
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 999,
            backgroundColor: headerInk,
            opacity: 0.9,
          }}
        />
        <div
          style={{
            height: 14,
            width: 120,
            borderRadius: 999,
            backgroundColor: headerInk,
            opacity: 0.6,
          }}
        />
      </div>
      {card(0)}
      {card(1)}
      <div
        style={{
          position: "absolute",
          left: PAD,
          top: buttonTop,
          width: `calc(${lerp(100, 66)}% - ${PAD * 2 * (lerp(100, 66) / 100)}px)`,
          height: 60,
          borderRadius: lerp(t.radius.card, 30),
          backgroundColor: button,
        }}
      />
      {measure > 0 ? (
        <div
          style={{
            position: "absolute",
            left: PAD + cardW + 10 - 1.5,
            top: cardTop,
            width: 3,
            height: lineH,
            borderRadius: 2,
            backgroundColor: t.colors.accent,
          }}
        >
          {[0, 1].map((e) => (
            <div
              key={e}
              style={{
                position: "absolute",
                left: -9,
                width: 21,
                height: 3,
                borderRadius: 2,
                backgroundColor: t.colors.accent,
                top: e === 0 ? 0 : "calc(100% - 3px)",
              }}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
};
