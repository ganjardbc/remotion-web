import { Icon } from "../../icons";
import { useTheme } from "../../themes";
import { Enter } from "../OpenCode9Router/parts";
import { makeScene } from "../OpenCode9Router/scene";
import { headlineStyle, Stage, useSec } from "../GratisMurah/shared";
import { ERAS, eraTiming } from "./config";
import { Art } from "./Art";
import { Timeline } from "./Timeline";

const TOTAL_LABEL = String(ERAS.length + 3).padStart(2, "0");

const makeEraInner = (index: number): React.FC => {
  const era = ERAS[index];
  const { lineStarts } = eraTiming(era);
  const Inner: React.FC = () => {
    const t = useTheme();
    const sec = useSec();
    return (
      <Stage
        label={`${String(index + 2).padStart(2, "0")} / ${TOTAL_LABEL}`}
        gap={40}
      >
        <Enter name="Timeline wrap" delay={0} y={20}>
          <Timeline active={index} />
        </Enter>
        <Enter
          name="Year"
          delay={sec(0.2)}
          y={40}
          style={{
            ...headlineStyle(t, 124),
            color: t.colors.groundEmphasis,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {era.year}
        </Enter>
        <Enter
          name="Title"
          delay={sec(0.6)}
          y={40}
          style={headlineStyle(t, 76)}
        >
          {era.title}
        </Enter>
        <Enter
          name="Illustration"
          delay={sec(0.8)}
          y={40}
          style={{
            position: "relative",
            padding: "20px 20px 36px",
            borderRadius: t.radius.large,
            border: `2px solid ${t.code.line}`,
            backgroundColor: "rgba(21, 28, 44, 0.55)",
          }}
        >
          <Art name={era.art} mood={era.mood} />
        </Enter>
        <Enter
          name="Story card"
          delay={sec(1.0)}
          y={40}
          style={{
            marginTop: 8,
            padding: "40px 44px",
            borderRadius: t.radius.large,
            backgroundColor: t.code.raised,
            border: `2px solid ${t.code.line}`,
            boxShadow: t.shadows.lift,
            display: "flex",
            flexDirection: "column",
            gap: 32,
          }}
        >
          {era.lines.map((line, i) => (
            <Enter
              key={line}
              name={`Line ${i + 1}`}
              delay={sec(lineStarts[i])}
              y={36}
              style={{
                fontFamily: t.fonts.body,
                fontWeight: 600,
                fontSize: 42,
                lineHeight: 1.33,
                color: t.code.text,
              }}
            >
              {line}
            </Enter>
          ))}
        </Enter>
        <Enter
          name="Fact chip"
          delay={sec(1.1)}
          y={30}
          style={{ display: "flex", justifyContent: "center" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              padding: "16px 40px 16px 28px",
              borderRadius: 999,
              backgroundColor: t.colors.groundChipBg,
              color: t.colors.groundChipText,
              fontFamily: t.fonts.heading,
              fontWeight: 700,
              fontSize: 46,
            }}
          >
            <Icon name={era.icon} size={52} color={t.colors.groundChipText} />
            {era.fact}
          </div>
        </Enter>
      </Stage>
    );
  };
  return Inner;
};

export const eraScenes = ERAS.map((era, i) =>
  makeScene(`SejarahAIEra${era.short}Scene`, makeEraInner(i)),
);
