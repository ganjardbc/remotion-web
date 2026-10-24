import type React from "react";
import { Interactive } from "remotion";
import { themed, themeSchema, useTheme } from "../../themes";
import { SAFE_PADDING } from "../ClaudeMd/Appear";

// Registers a scene with the theme prop so it also works as a standalone composition.
export const makeScene = (componentName: string, Inner: React.FC) =>
  Interactive.withSchema({
    Component: themed(Inner),
    componentName,
    schema: themeSchema,
    wrapInSequence: true,
    layout: "absolute-fill",
  });

export const Content: React.FC<{
  readonly gap?: number;
  readonly children: React.ReactNode;
}> = ({ gap = 32, children }) => {
  const t = useTheme();
  return (
    <Interactive.Div
      name="Content"
      style={{
        position: "absolute",
        inset: 0,
        padding: SAFE_PADDING,
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        justifyContent: "center",
        gap,
        fontFamily: t.fonts.heading,
        color: t.colors.groundText,
      }}
    >
      {children}
    </Interactive.Div>
  );
};

export const Center: React.FC<{ readonly children: React.ReactNode }> = ({
  children,
}) => (
  <div style={{ display: "flex", justifyContent: "center" }}>{children}</div>
);
