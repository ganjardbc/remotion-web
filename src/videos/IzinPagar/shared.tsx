import type React from "react";
import { Interactive } from "remotion";
import { useTheme } from "../../themes";
import { Enter } from "../OpenCode9Router/parts";

// Generic dialog card (no tool branding): light chip surface on the dark ground.
export const Dialog: React.FC<{
  readonly name: string;
  readonly style?: React.CSSProperties;
  readonly children: React.ReactNode;
}> = ({ name, style, children }) => {
  const t = useTheme();
  return (
    <Interactive.Div
      name={name}
      style={{
        padding: "44px 48px",
        borderRadius: t.radius.large,
        backgroundColor: t.colors.groundChipBg,
        boxShadow: t.shadows.lift,
        color: t.colors.ink,
        display: "flex",
        flexDirection: "column",
        gap: 32,
        ...style,
      }}
    >
      {children}
    </Interactive.Div>
  );
};

// Small supporting line under a visual. `dim` is the quieter second note.
export const Note: React.FC<{
  readonly name: string;
  readonly delay: number;
  readonly dim?: boolean;
  readonly children: React.ReactNode;
}> = ({ name, delay, dim = false, children }) => {
  const t = useTheme();
  return (
    <Enter
      name={name}
      delay={delay}
      y={24}
      style={{
        textAlign: "center",
        textWrap: "balance",
        fontFamily: t.fonts.body,
        fontWeight: dim ? 500 : 600,
        fontSize: dim ? 38 : 44,
        lineHeight: 1.25,
        color: dim ? t.code.muted : t.colors.groundTextMuted,
      }}
    >
      {children}
    </Enter>
  );
};
