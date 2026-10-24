import { Interactive, interpolate, useCurrentFrame } from "remotion";
import { Icon } from "../../icons";
import { useTheme } from "../../themes";
import { Enter, shakeX } from "../OpenCode9Router/parts";
import { makeScene } from "../OpenCode9Router/scene";
import { headlineStyle, Stage, useSec } from "../GratisMurah/shared";
import { COPY, TIMING } from "./config";

const Layer: React.FC<{
  readonly index: number;
  readonly delay: number;
  readonly label: string;
  readonly locked: boolean;
  readonly shake: number;
}> = ({ index, delay, label, locked, shake }) => {
  const t = useTheme();
  return (
    <Enter
      name={`Layer ${index + 1}`}
      delay={delay}
      y={80}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 32,
        padding: "34px 44px",
        // Wider at the bottom so the layers read as a stack.
        marginInline: index * 28,
        borderRadius: t.radius.large,
        backgroundColor: locked ? t.code.raised : t.colors.groundChipBg,
        border: `2px solid ${locked ? t.code.line : "transparent"}`,
        boxShadow: t.shadows.lift,
        opacity: locked ? 0.7 : 1,
      }}
    >
      <div
        style={{
          width: 96,
          height: 96,
          flexShrink: 0,
          borderRadius: 999,
          backgroundColor: locked ? t.code.bg : t.colors.accent,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `translateX(${locked ? shake : 0}px)`,
        }}
      >
        <Icon
          name={locked ? "lock" : "check"}
          size={52}
          color={locked ? t.colors.groundText : t.colors.onAccent}
        />
      </div>
      <div
        style={{
          fontFamily: t.fonts.mono,
          fontWeight: 700,
          fontSize: 52,
          color: locked ? t.colors.groundText : t.colors.ink,
        }}
      >
        {label}
      </div>
      <div
        style={{
          flex: 1,
          height: 22,
          borderRadius: 999,
          backgroundColor: locked ? t.code.line : t.colors.primary,
          filter: locked ? "blur(6px)" : undefined,
        }}
      />
    </Enter>
  );
};

const UrgencyInner: React.FC = () => {
  const t = useTheme();
  const sec = useSec();
  const frame = useCurrentFrame();
  const T = TIMING.urgency;
  const sub = interpolate(frame, [sec(T.sub), sec(T.sub) + 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const main = interpolate(frame, [sec(T.main), sec(T.main) + 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const shake = shakeX(frame, sec(T.lockShake), 15);
  // Built bottom-up: Lapis 1 sits at the bottom of the stack and lands first.
  const layers = COPY.urgency.layers.map((label, i) => ({ label, i }));

  return (
    <Stage label="04 / 06" gap={72}>
      <Interactive.Div
        name="Main"
        style={{ ...headlineStyle(t, 104), opacity: main }}
      >
        {COPY.urgency.main}
      </Interactive.Div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {[...layers].reverse().map(({ label, i }) => (
          <Layer
            key={label}
            index={i}
            delay={sec(T.firstLayer + i * T.layerGap)}
            label={label}
            locked={i > 0}
            shake={shake}
          />
        ))}
      </div>
      <Interactive.Div
        name="Sub"
        style={{
          ...headlineStyle(t, 54),
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

export const UrgencyScene = makeScene("AgenBodohUrgencyScene", UrgencyInner);
