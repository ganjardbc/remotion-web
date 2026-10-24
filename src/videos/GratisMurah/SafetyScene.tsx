import { Interactive } from "remotion";
import { Icon } from "../../icons";
import { useTheme } from "../../themes";
import { Enter, Pop } from "../OpenCode9Router/parts";
import { makeScene } from "../OpenCode9Router/scene";
import { COPY, TIMING } from "./config";
import { headlineStyle, Overline, Stage, useSec } from "./shared";

const ToolWindow: React.FC<{
  readonly delay: number;
  readonly resultDelay: number;
  readonly label: string;
  readonly result: string;
  readonly ok: boolean;
}> = ({ delay, resultDelay, label, result, ok }) => {
  const t = useTheme();
  const color = ok
    ? (t.colors.success ?? t.colors.primary)
    : (t.colors.danger ?? t.colors.accent);

  return (
    <Enter
      name={label}
      delay={delay}
      y={50}
      style={{
        borderRadius: t.radius.large,
        backgroundColor: t.code.raised,
        border: `2px solid ${t.code.line}`,
        boxShadow: t.shadows.lift,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "22px 40px",
          borderBottom: `2px solid ${t.code.line}`,
          fontFamily: t.fonts.mono,
          fontSize: 38,
          color: t.code.muted,
        }}
      >
        <span style={{ color: t.code.text }}>{label}</span>
        <span>{COPY.safety.sameModel}</span>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 28,
          padding: "44px 40px",
          minHeight: 150,
        }}
      >
        <Pop delay={resultDelay}>
          <div
            style={{
              width: 88,
              height: 88,
              borderRadius: 999,
              backgroundColor: color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon
              name={ok ? "check" : "x"}
              size={56}
              color={t.colors.onPrimary}
            />
          </div>
        </Pop>
        <Enter
          name="Result"
          delay={resultDelay}
          y={20}
          style={{
            fontFamily: t.fonts.mono,
            fontSize: 56,
            color,
          }}
        >
          {result}
        </Enter>
      </div>
    </Enter>
  );
};

const SafetyInner: React.FC = () => {
  const t = useTheme();
  const sec = useSec();
  const T = TIMING.safety;

  return (
    <Stage label="05 / 07" gap={48}>
      <Overline delay={sec(T.title)}>{COPY.safety.title}</Overline>
      <ToolWindow
        delay={sec(T.toolA)}
        resultDelay={sec(T.resultA)}
        label={COPY.safety.toolA.label}
        result={COPY.safety.toolA.result}
        ok
      />
      <ToolWindow
        delay={sec(T.toolB)}
        resultDelay={sec(T.resultB)}
        label={COPY.safety.toolB.label}
        result={COPY.safety.toolB.result}
        ok={false}
      />
      <Interactive.Div name="Footer text">
        <Enter
          name="Footer"
          delay={sec(T.footer)}
          y={40}
          style={{ ...headlineStyle(t, 72) }}
        >
          {COPY.safety.footer}
        </Enter>
      </Interactive.Div>
    </Stage>
  );
};

export const SafetyScene = makeScene("GratisMurahSafetyScene", SafetyInner);
