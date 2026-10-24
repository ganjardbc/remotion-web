import type React from "react";
import { useTheme } from "../../themes";
import { Appear } from "../ClaudeMd/Appear";

// Raised dark card used on the black ground for commands and meters.
export const Terminal: React.FC<{
  readonly delay: number;
  readonly title: string;
  readonly children: React.ReactNode;
}> = ({ delay, title, children }) => {
  const t = useTheme();

  return (
    <Appear
      name="Terminal"
      delay={delay}
      style={{
        borderRadius: t.radius.card,
        backgroundColor: t.code.raised,
        border: `1px solid ${t.code.line}`,
        boxShadow: t.shadows.lift,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "22px 36px",
          borderBottom: `1px solid ${t.code.line}`,
          fontFamily: t.fonts.mono,
          fontSize: 32,
          color: t.code.muted,
        }}
      >
        {title}
      </div>
      <div
        style={{
          padding: 40,
          display: "flex",
          flexDirection: "column",
          gap: 40,
        }}
      >
        {children}
      </div>
    </Appear>
  );
};
