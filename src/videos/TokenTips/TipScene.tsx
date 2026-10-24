import type React from "react";
import {
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  type InteractivitySchema,
} from "remotion";
import { Backdrop } from "../../Backdrop";
import { themed, themeSchema, useTheme } from "../../themes";
import { Appear, SAFE_PADDING } from "../ClaudeMd/Appear";
import { Headline } from "../ClaudeLoop/Headline";
import { Meter } from "./Meter";
import { Terminal } from "./Terminal";

type TipKind = "clear" | "compact" | "file";

type TipProps = {
  readonly kind: TipKind;
  readonly index: number;
};

const COPY: Record<
  TipKind,
  { readonly lead: string; readonly accent: string; readonly caption: string }
> = {
  clear: {
    lead: "tiap ganti topik",
    accent: "/clear",
    caption:
      "Riwayat lama ikut terkirim di tiap pesan. Topik baru? Mulai bersih.",
  },
  compact: {
    lead: "sebelum konteks penuh",
    accent: "/compact",
    caption: "Chat panjang diringkas. Hal penting tetap diingat.",
  },
  file: {
    lead: "Sebut file-nya langsung",
    accent: "@file",
    caption: "Prompt spesifik = Claude baca lebih sedikit.",
  },
};

const TypedCommand: React.FC<{
  readonly command: string;
  readonly start: number;
  readonly end: number;
}> = ({ command, start, end }) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const shown = Math.floor(
    interpolate(frame, [start, end], [0, command.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );
  const caretOn = Math.floor(frame / (0.4 * fps)) % 2 === 0;

  return (
    <div
      style={{
        fontFamily: t.fonts.mono,
        fontSize: 56,
        color: t.code.text,
      }}
    >
      <span style={{ color: t.code.muted }}>{"> "}</span>
      <span style={{ color: t.colors.accent }}>{command.slice(0, shown)}</span>
      {caretOn && frame < end + 1.2 * fps ? "▌" : ""}
    </div>
  );
};

const Compare: React.FC<{
  readonly tone: "bad" | "good";
  readonly prompt: string;
  readonly result: string;
  readonly delay: number;
}> = ({ tone, prompt, result, delay }) => {
  const t = useTheme();
  const good = tone === "good";

  return (
    <Appear
      name={good ? "Hemat" : "Boros"}
      delay={delay}
      style={{
        padding: "32px 36px",
        borderRadius: t.radius.card,
        border: `2px solid ${good ? t.colors.accent : t.code.line}`,
        backgroundColor: good ? "rgba(255, 145, 77, 0.08)" : "transparent",
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      <div
        style={{
          fontFamily: t.fonts.mono,
          fontSize: 32,
          color: good ? t.colors.accent : t.code.muted,
        }}
      >
        {good ? "hemat" : "boros"}
      </div>
      <div
        style={{
          fontFamily: t.fonts.mono,
          fontSize: 42,
          color: t.code.text,
          lineHeight: 1.3,
        }}
      >
        {prompt}
      </div>
      <div
        style={{
          fontFamily: t.fonts.body,
          fontWeight: 600,
          fontSize: 44,
          color: good ? t.colors.groundText : t.colors.groundTextMuted,
        }}
      >
        {result}
      </div>
    </Appear>
  );
};

const TipInner: React.FC<TipProps> = ({ kind, index }) => {
  const t = useTheme();
  const { fps } = useVideoConfig();
  const copy = COPY[kind];

  return (
    <>
      <Backdrop
        variant={index === 2 ? "dark" : "ground"}
        label={`0${index + 1} / 05`}
      />
      <Interactive.Div
        name="Content"
        style={{
          position: "absolute",
          inset: 0,
          padding: SAFE_PADDING,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 44,
          fontFamily: t.fonts.heading,
          color: t.colors.groundText,
        }}
      >
        <Appear
          name="Tip number"
          delay={0}
          style={{
            alignSelf: "flex-start",
            padding: "12px 28px",
            borderRadius: t.radius.card,
            backgroundColor: t.colors.accent,
            color: t.colors.onAccent,
            fontFamily: t.fonts.mono,
            fontWeight: 700,
            fontSize: 44,
          }}
        >
          Tip {index}
        </Appear>
        <Headline delay={0.15 * fps} size={112}>
          {kind === "file" ? (
            <>
              Sebut <span style={{ color: t.colors.groundEmphasis }}>file</span>
              -nya langsung
            </>
          ) : (
            <>
              <span style={{ color: t.colors.groundEmphasis }}>
                {copy.accent}
              </span>{" "}
              {copy.lead}
            </>
          )}
        </Headline>
        {kind === "file" ? (
          <>
            <Compare
              tone="bad"
              prompt={'"cari bug di login"'}
              result="Claude telusuri banyak file"
              delay={0.8 * fps}
            />
            <Compare
              tone="good"
              prompt={'"cek bug di @src/auth.ts"'}
              result="Langsung ke 1 file"
              delay={2 * fps}
            />
          </>
        ) : (
          <Terminal delay={0.6 * fps} title="claude">
            <TypedCommand
              command={copy.accent}
              start={1.2 * fps}
              end={2 * fps}
            />
            <Meter
              label="Konteks terpakai"
              from={kind === "clear" ? 88 : 92}
              to={kind === "clear" ? 4 : 28}
              startFrame={2.3 * fps}
              endFrame={3.2 * fps}
            />
          </Terminal>
        )}
        <Appear
          name="Caption"
          delay={(kind === "file" ? 3.2 : 3.4) * fps}
          style={{
            fontFamily: t.fonts.body,
            fontWeight: 600,
            fontSize: 52,
            lineHeight: 1.35,
            color: t.colors.groundTextMuted,
          }}
        >
          {copy.caption}
        </Appear>
      </Interactive.Div>
    </>
  );
};

const tipSchema = {
  ...themeSchema,
  kind: {
    type: "string",
    default: "clear",
    description: "Tip: clear, compact or file",
  },
  index: {
    type: "number",
    default: 1,
    description: "Tip number (1-3)",
    hiddenFromList: false,
  },
} as const satisfies InteractivitySchema;

export const TipScene = Interactive.withSchema({
  Component: themed(TipInner as React.FC<{ kind: string; index: number }>),
  componentName: "TokenTipScene",
  schema: tipSchema,
  wrapInSequence: true,
  layout: "absolute-fill",
});
