import type React from "react";
import { headlineSize, useTheme } from "../../themes";
import { Appear } from "../ClaudeMd/Appear";

export const Headline: React.FC<{
  readonly delay?: number;
  readonly size: number;
  readonly color?: string;
  readonly children: React.ReactNode;
}> = ({ delay = 0, size, color, children }) => {
  const t = useTheme();

  return (
    <Appear
      name="Headline"
      delay={delay}
      style={{
        fontSize: headlineSize(t, size),
        fontWeight: t.type.headlineWeight,
        textTransform: t.type.headlineTransform,
        lineHeight: 1.1,
        letterSpacing: `${t.type.tracking}em`,
        color,
      }}
    >
      {children}
    </Appear>
  );
};
