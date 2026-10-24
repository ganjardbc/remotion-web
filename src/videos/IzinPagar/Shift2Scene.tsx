import { Easing, Interactive, interpolate, useCurrentFrame } from "remotion";
import { Icon } from "../../icons";
import { useTheme } from "../../themes";
import { CodeCard, Enter, Typed } from "../OpenCode9Router/parts";
import { makeScene } from "../OpenCode9Router/scene";
import { Overline, Stage, useSec } from "../GratisMurah/shared";
import { COPY, TIMING } from "./config";
import { Note } from "./shared";

const Shift2Inner: React.FC = () => {
  const t = useTheme();
  const sec = useSec();
  const frame = useCurrentFrame();
  const T = TIMING.shift2;
  // Accent border lights up left → right.
  const glow = interpolate(
    frame,
    [sec(T.glow), sec(T.glow) + sec(T.glowDur)],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(...t.motion.enter),
    },
  );

  return (
    <Stage label="05 / 07" gap={32}>
      <Overline delay={sec(T.title)}>{COPY.shift2.title}</Overline>
      <CodeCard
        name="Code card"
        delay={sec(T.code)}
        y={50}
        icon={<Icon name="shield" size={52} color={t.colors.accent} />}
        style={{ fontSize: 48, padding: "30px 40px" }}
      >
        <Typed
          parts={[{ text: COPY.shift2.code }]}
          start={sec(T.type)}
          cps={0.5}
        />
      </CodeCard>
      <Enter name="Layers" delay={sec(T.layers)} y={50}>
        <div style={{ position: "relative" }}>
          <Layer
            label={COPY.shift2.outer}
            borderColor={t.code.line}
            inner={COPY.shift2.inner}
          />
          {/* Accent outline, revealed left → right over the base border. */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              clipPath: `inset(-80px calc(${(1 - glow) * 100}% - ${80 * glow}px) -80px -80px)`,
            }}
          >
            <Layer
              label={COPY.shift2.outer}
              borderColor={t.colors.accent}
              inner={COPY.shift2.inner}
              glow
              hideContent
            />
          </div>
        </div>
      </Enter>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 20,
          alignItems: "center",
        }}
      >
        {COPY.shift2.chips.map((chip, i) => (
          <Enter
            key={chip.text}
            name={`Chip ${i + 1}`}
            delay={sec(T.chip1 + i * T.chipGap)}
            y={30}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              padding: "16px 36px 16px 26px",
              borderRadius: 999,
              backgroundColor: t.code.raised,
              border: `2px solid ${t.code.line}`,
              boxShadow: t.shadows.md,
              fontFamily: t.fonts.mono,
              fontSize: 38,
              color: t.code.text,
            }}
          >
            <Icon name={chip.icon} size={48} color={t.colors.accent} />
            {chip.text}
          </Enter>
        ))}
      </div>
      <Note name="Note" delay={sec(T.note)}>
        {COPY.shift2.note}
      </Note>
      <Note name="Note dim" delay={sec(T.noteDim)} dim>
        {COPY.shift2.noteDim}
      </Note>
    </Stage>
  );
};

const Layer: React.FC<{
  readonly label: string;
  readonly inner: string;
  readonly borderColor: string;
  readonly glow?: boolean;
  readonly hideContent?: boolean;
}> = ({ label, inner, borderColor, glow = false, hideContent = false }) => {
  const t = useTheme();
  return (
    <div
      style={{
        padding: "28px 36px 44px",
        borderRadius: t.radius.large,
        border: `${glow ? 5 : 3}px solid ${borderColor}`,
        boxShadow: glow ? `0 0 36px ${borderColor}` : undefined,
        backgroundColor: hideContent ? "transparent" : t.code.bg,
        display: "flex",
        flexDirection: "column",
        gap: 24,
        visibility: "visible",
      }}
    >
      <div
        style={{
          fontFamily: t.fonts.mono,
          fontSize: 36,
          color: hideContent ? "transparent" : t.colors.groundTextMuted,
        }}
      >
        {label}
      </div>
      <Interactive.Div
        name={hideContent ? "Inner (glow)" : "Inner layer"}
        style={{
          padding: "36px 32px",
          borderRadius: t.radius.card,
          border: `2px solid ${hideContent ? "transparent" : t.colors.primarySoft}`,
          backgroundColor: hideContent ? "transparent" : t.code.raised,
          fontFamily: t.fonts.mono,
          fontWeight: 700,
          fontSize: 40,
          textAlign: "center",
          color: hideContent ? "transparent" : t.colors.groundText,
        }}
      >
        {inner}
      </Interactive.Div>
    </div>
  );
};

export const Shift2Scene = makeScene("IzinPagarShift2Scene", Shift2Inner);
