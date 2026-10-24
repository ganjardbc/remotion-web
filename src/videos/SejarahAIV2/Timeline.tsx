import { Interactive } from "remotion";
import { useTheme } from "../../themes";
import { ERAS } from "./config";

// Row of dots, one per era. Past eras are filled, the current one is orange.
export const Timeline: React.FC<{ readonly active: number }> = ({ active }) => {
  const t = useTheme();
  return (
    <Interactive.Div
      name="Timeline"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "relative",
        padding: "0 12px",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 24,
          right: 24,
          top: "50%",
          height: 3,
          backgroundColor: t.code.line,
        }}
      />
      {ERAS.map((era, i) => {
        const current = i === active;
        const past = i < active;
        return (
          <div
            key={era.year}
            style={{
              position: "relative",
              width: current ? 36 : 22,
              height: current ? 36 : 22,
              borderRadius: 999,
              backgroundColor: current
                ? t.colors.groundEmphasis
                : past
                  ? t.colors.groundTextMuted
                  : t.colors.ground,
              border: `3px solid ${current ? t.colors.groundEmphasis : t.code.muted}`,
            }}
          />
        );
      })}
    </Interactive.Div>
  );
};
