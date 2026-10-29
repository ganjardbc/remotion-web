import { createContext, useContext } from "react";
import type React from "react";
import { gh } from "./gh";
import { insell } from "./insell";
import type { Theme, ThemeName } from "./types";

export type { Theme, ThemeName };

const themes: Record<ThemeName, Theme> = { insell, gh };

const ThemeContext = createContext<Theme>(insell);

export const useTheme = (): Theme => useContext(ThemeContext);

// Theme by name outside a ThemeProvider; unknown names fall back to insell like ThemeProvider does.
export const getTheme = (name?: string): Theme =>
  themes[name as ThemeName] ?? insell;

export const ThemeProvider: React.FC<{
  readonly name?: string;
  readonly children: React.ReactNode;
}> = ({ name, children }) => {
  const theme = themes[name as ThemeName] ?? insell;
  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};

// Lets a scene pick its own theme so it also works as a standalone composition.
export const themed = <P extends object>(
  Component: React.ComponentType<P>,
): React.FC<P & { readonly theme?: string }> => {
  const Themed: React.FC<P & { readonly theme?: string }> = ({
    theme,
    ...rest
  }) => (
    <ThemeProvider name={theme}>
      <Component {...(rest as unknown as P)} />
    </ThemeProvider>
  );
  return Themed;
};

export const themeSchema = {
  theme: {
    type: "string",
    default: "insell",
    description: "Design system: insell or gh",
  },
} as const;

// Large headline size, scaled per design system.
export const headlineSize = (theme: Theme, size: number): number =>
  Math.round(size * theme.type.scale);
