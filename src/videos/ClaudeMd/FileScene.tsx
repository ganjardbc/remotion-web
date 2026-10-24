import type React from "react";
import {
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Backdrop } from "../../Backdrop";
import { headlineSize, themed, themeSchema, useTheme } from "../../themes";
import { Appear, SAFE_PADDING } from "./Appear";

// One typed template: lines reveal character by character.
const LINES = [
  "# Project: toko-online",
  "",
  "## Commands",
  "- pnpm dev",
  "- pnpm test",
  "",
  "## Rules",
  "- TypeScript strict",
  "- Jangan edit /dist",
  "- Commit: conventional",
];
const TOTAL_CHARS = LINES.reduce((sum, line) => sum + line.length, 0);

const FileInner: React.FC = () => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const typed = interpolate(frame, [1.2 * fps, 6.2 * fps], [0, TOTAL_CHARS], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const caretOn = Math.floor(frame / (0.4 * fps)) % 2 === 0;
  let remaining = Math.floor(typed);
  let caretLine = -1;
  const visible = LINES.map((line, i) => {
    const shown = Math.max(0, Math.min(line.length, remaining));
    if (remaining >= 0 && remaining <= line.length && caretLine < 0) {
      caretLine = i;
    }
    remaining -= line.length;
    return line.slice(0, shown);
  });

  return (
    <>
      <Backdrop label="03 / 05" />
      <Interactive.Div
        name="Content"
        style={{
          position: "absolute",
          inset: 0,
          padding: SAFE_PADDING,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 48,
          fontFamily: t.fonts.heading,
          color: t.colors.ink,
        }}
      >
        <Appear
          name="Headline"
          delay={0}
          style={{
            fontSize: headlineSize(t, 104),
            fontWeight: t.type.headlineWeight,
            textTransform: t.type.headlineTransform,
            lineHeight: 1.1,
            letterSpacing: `${t.type.tracking}em`,
          }}
        >
          Tulis sekali di{" "}
          <span style={{ color: t.colors.accent }}>CLAUDE.md</span>
        </Appear>
        <Appear
          name="Code card"
          delay={0.4 * fps}
          style={{
            backgroundColor: t.code.bg,
            borderRadius: t.radius.card,
            boxShadow: t.shadows.lift,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "24px 40px",
              borderBottom: `1px solid ${t.code.line}`,
              fontFamily: t.fonts.mono,
              fontSize: 36,
              color: t.code.muted,
            }}
          >
            CLAUDE.md
          </div>
          <div
            style={{
              padding: "40px",
              fontFamily: t.fonts.mono,
              fontSize: 40,
              lineHeight: 1.6,
              color: t.code.text,
              whiteSpace: "pre",
              minHeight: LINES.length * 64 + 80,
            }}
          >
            {visible.map((line, i) => (
              <div
                key={i}
                style={{
                  color: line.startsWith("#") ? t.colors.accent : undefined,
                  minHeight: 64,
                }}
              >
                {line}
                {i === caretLine && caretOn && frame < 6.8 * fps ? "▌" : ""}
              </div>
            ))}
          </div>
        </Appear>
        <Appear
          name="Caption"
          delay={6.2 * fps}
          style={{
            fontFamily: t.fonts.body,
            fontWeight: 500,
            fontSize: 52,
            color: t.colors.muted,
          }}
        >
          Simpan di root project. Selesai.
        </Appear>
      </Interactive.Div>
    </>
  );
};

export const FileScene = Interactive.withSchema({
  Component: themed(FileInner),
  componentName: "FileScene",
  schema: { ...themeSchema },
  wrapInSequence: true,
  layout: "absolute-fill",
});
