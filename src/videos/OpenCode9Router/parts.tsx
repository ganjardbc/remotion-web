import type React from "react";
import {
  Interactive,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Icon } from "../../icons";
import { useTheme } from "../../themes";

export const OFF_WHITE = "#F5F3EE";
export const LIGHT_BLUE = "#9DB4F0";
export const PURPLE = "#8B6CFF";
export const PURPLE_DEEP = "#6D4AE8";

type IconName = React.ComponentProps<typeof Icon>["name"];

export const useSpringIn = (delay: number, damping = 200): number => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame, fps, delay, config: { damping } });
};

// Horizontal shake: frames [0, 25%, 50%, 75%, 100%] of `duration`.
export const shakeX = (frame: number, start: number, duration = 12): number =>
  interpolate(
    frame - start,
    [0, 0.25, 0.5, 0.75, 1].map((r) => r * duration),
    [0, -8, 8, -4, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

// Spring entrance: fade + slide from (x, y) offset.
export const Enter: React.FC<{
  readonly name: string;
  readonly delay: number;
  readonly damping?: number;
  readonly x?: number;
  readonly y?: number;
  readonly style?: React.CSSProperties;
  readonly children: React.ReactNode;
}> = ({ name, delay, damping = 200, x = 0, y = 40, style, children }) => {
  const p = useSpringIn(delay, damping);
  return (
    <Interactive.Div
      name={name}
      style={{
        ...style,
        opacity: Math.min(1, Math.max(0, p)),
        translate: `${(1 - p) * x}px ${(1 - p) * y}px`,
      }}
    >
      {children}
    </Interactive.Div>
  );
};

// Icon that scales 0 → 1 with a bounce.
export const Pop: React.FC<{
  readonly delay: number;
  readonly damping?: number;
  readonly children: React.ReactNode;
}> = ({ delay, damping = 8, children }) => {
  const p = useSpringIn(delay, damping);
  return (
    <div style={{ display: "flex", scale: Math.max(0, p) }}>{children}</div>
  );
};

export const Hl: React.FC<{ readonly children: React.ReactNode }> = ({
  children,
}) => {
  const t = useTheme();
  return <span style={{ color: t.colors.accent }}>{children}</span>;
};

export const StepChip: React.FC<{ readonly label: string }> = ({ label }) => {
  const t = useTheme();
  return (
    <Enter
      name="Step chip"
      delay={0}
      y={30}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "14px 32px 14px 24px",
        borderRadius: 999,
        backgroundColor: PURPLE_DEEP,
        color: "#FFFFFF",
        fontFamily: t.fonts.heading,
        fontWeight: 700,
        fontSize: 44,
      }}
    >
      <Icon name="chevronsRight" size={48} color="#FFFFFF" />
      {label}
    </Enter>
  );
};

export const Title: React.FC<{
  readonly delay?: number;
  readonly size?: number;
  readonly children: React.ReactNode;
}> = ({ delay = 6, size = 92, children }) => {
  const t = useTheme();
  return (
    <Enter
      name="Title"
      delay={delay}
      style={{
        textAlign: "center",
        textWrap: "balance",
        color: t.colors.groundText,
        fontFamily: t.fonts.heading,
        fontWeight: 800,
        fontSize: size,
        lineHeight: 1.08,
        letterSpacing: `${t.type.tracking}em`,
      }}
    >
      {children}
    </Enter>
  );
};

// Off-white card with a round icon on the left.
export const NoteCard: React.FC<{
  readonly name: string;
  readonly delay: number;
  readonly icon: IconName;
  readonly iconColor?: string;
  readonly iconBg?: string;
  readonly bg?: string;
  readonly color?: string;
  readonly x?: number;
  readonly y?: number;
  readonly damping?: number;
  readonly children: React.ReactNode;
}> = ({
  name,
  delay,
  icon,
  iconColor,
  iconBg,
  bg = OFF_WHITE,
  color,
  x = 0,
  y = 60,
  damping = 200,
  children,
}) => {
  const t = useTheme();
  return (
    <Enter
      name={name}
      delay={delay}
      x={x}
      y={y}
      damping={damping}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 28,
        padding: "28px 36px",
        borderRadius: t.radius.large,
        backgroundColor: bg,
        boxShadow: t.shadows.lift,
        fontFamily: t.fonts.body,
        fontWeight: 600,
        fontSize: 44,
        lineHeight: 1.25,
        color: color ?? t.colors.ink,
      }}
    >
      <div
        style={{
          width: 88,
          height: 88,
          flexShrink: 0,
          borderRadius: 999,
          backgroundColor: iconBg ?? t.colors.primaryTint,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon name={icon} size={52} color={iconColor ?? t.colors.primary} />
      </div>
      <div>{children}</div>
    </Enter>
  );
};

// Bulleted step on the dark ground: bouncing icon + text, slides in from the left.
export const Step: React.FC<{
  readonly delay: number;
  readonly icon: IconName;
  readonly children: React.ReactNode;
}> = ({ delay, icon, children }) => {
  const t = useTheme();
  return (
    <Enter
      name="Step"
      delay={delay}
      x={-120}
      y={0}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 28,
        fontFamily: t.fonts.body,
        fontWeight: 600,
        fontSize: 44,
        lineHeight: 1.25,
        color: t.colors.groundText,
      }}
    >
      <Pop delay={delay + 4}>
        <Icon name={icon} size={64} color={LIGHT_BLUE} />
      </Pop>
      <div>{children}</div>
    </Enter>
  );
};

export type CodePart = {
  readonly text: string;
  readonly color?: string;
  // 0 → 1 progress of an orange underline sweep under this part.
  readonly underline?: number;
};

// Monospace text typed at `cps` characters per frame from `start`.
export const Typed: React.FC<{
  readonly parts: readonly CodePart[];
  readonly start: number;
  readonly cps?: number;
}> = ({ parts, start, cps = 1.5 }) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  let remaining = Math.max(0, Math.floor((frame - start) * cps));

  return (
    <span style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>
      {parts.map((part, i) => {
        const shown = Math.min(remaining, part.text.length);
        remaining -= shown;
        return (
          <span
            key={i}
            style={{
              position: "relative",
              display: "inline",
              color: part.color ?? t.code.text,
            }}
          >
            {part.text.slice(0, shown)}
            <span style={{ color: "transparent" }}>
              {part.text.slice(shown)}
            </span>
            {part.underline ? (
              <span
                style={{
                  position: "absolute",
                  left: 0,
                  bottom: -6,
                  height: 6,
                  borderRadius: 3,
                  width: `${part.underline * 100}%`,
                  backgroundColor: t.colors.accent,
                }}
              />
            ) : null}
          </span>
        );
      })}
    </span>
  );
};

export const CodeCard: React.FC<{
  readonly name: string;
  readonly delay: number;
  readonly y?: number;
  readonly damping?: number;
  readonly icon?: React.ReactNode;
  readonly style?: React.CSSProperties;
  readonly children: React.ReactNode;
}> = ({ name, delay, y = 60, damping = 200, icon, style, children }) => {
  const t = useTheme();
  return (
    <Enter
      name={name}
      delay={delay}
      y={y}
      damping={damping}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 28,
        padding: "36px 40px",
        borderRadius: t.radius.large,
        backgroundColor: t.code.raised,
        border: `2px solid ${t.code.line}`,
        boxShadow: t.shadows.lift,
        fontFamily: t.fonts.mono,
        fontSize: 40,
        lineHeight: 1.35,
        ...style,
      }}
    >
      {icon}
      <div style={{ minWidth: 0 }}>{children}</div>
    </Enter>
  );
};
