import {
  Img,
  Interactive,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { Backdrop } from "../../Backdrop";
import { Icon } from "../../icons";
import { useTheme } from "../../themes";
import { Enter, Hl, PURPLE_DEEP } from "./parts";
import { makeScene } from "./scene";

const chips = [
  { n: "1", label: "Model", delay: 50 },
  { n: "2", label: "403", delay: 62 },
  { n: "3", label: "400", delay: 74 },
];

const ClosingInner: React.FC<{ readonly handle?: string }> = () => {
  const t = useTheme();
  const frame = useCurrentFrame();
  // Chevrons nudge right every 20 frames once the CTA is on screen.
  const nudge =
    frame < 110 ? 0 : interpolate((frame - 110) % 20, [0, 10, 20], [0, 16, 0]);

  return (
    <>
      <Backdrop variant="ground" label="06 / 06" />
      <Interactive.Div
        name="Main sentence"
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          top: 250,
          fontFamily: t.fonts.heading,
          color: t.colors.groundText,
        }}
      >
        <Enter
          name="Sentence"
          delay={0}
          style={{
            textAlign: "center",
            fontWeight: 800,
            fontSize: 84,
            lineHeight: 1.12,
            letterSpacing: `${t.type.tracking}em`,
          }}
        >
          Fallback cuma menyelamatkanmu kalau ada <Hl>model sehat</Hl> di
          bawahnya.
        </Enter>
      </Interactive.Div>
      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          top: 790,
          display: "flex",
          justifyContent: "center",
          gap: 20,
        }}
      >
        {chips.map((c) => (
          <Enter
            key={c.n}
            name={`Chip ${c.n}`}
            delay={c.delay}
            damping={12}
            y={30}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "16px 32px 16px 20px",
              borderRadius: 999,
              backgroundColor: t.colors.groundChipBg,
              color: t.colors.groundChipText,
              fontFamily: t.fonts.heading,
              fontWeight: 700,
              fontSize: 48,
            }}
          >
            <span
              style={{
                width: 60,
                height: 60,
                borderRadius: 999,
                backgroundColor: PURPLE_DEEP,
                color: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 36,
              }}
            >
              {c.n}
            </span>
            {c.label}
          </Enter>
        ))}
      </div>
      <Enter
        name="CTA card"
        delay={110}
        y={500}
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          top: 1090,
          padding: "44px 48px",
          borderRadius: t.radius.large,
          backgroundColor: t.colors.accent,
          color: "#000000",
          boxShadow: t.shadows.lift,
          fontFamily: t.fonts.heading,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <Img
            src={staticFile(t.logo.src)}
            style={{ width: 112, height: 112, borderRadius: 999 }}
          />
          <div style={{ fontWeight: 800, fontSize: 44 }}>@ganjar_hadiatna</div>
          <div style={{ marginLeft: "auto", translate: `${nudge}px 0` }}>
            <Icon name="chevronsRight" size={72} color={PURPLE_DEEP} />
          </div>
        </div>
        <div
          style={{
            marginTop: 32,
            fontWeight: 800,
            fontSize: 60,
            lineHeight: 1.12,
            letterSpacing: `${t.type.tracking}em`,
          }}
        >
          Follow buat lanjutan seri OpenCode + 9Router
        </div>
      </Enter>
    </>
  );
};

export const ClosingScene = makeScene("OpenCodeClosingScene", ClosingInner);
