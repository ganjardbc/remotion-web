import type React from "react";
import { useTheme } from "../../themes";
import {
  Accent,
  CheckRow,
  CodeLine,
  ComponentNode,
  cue,
  DownArrow,
  FilmStrip,
  FollowPill,
  Frame,
  FrameCounter,
  Headline,
  Line,
  PreviewBox,
  RenderRow,
  RepoCard,
  StrikeChip,
  StudioShot,
  Tag,
  Typed,
  useCue,
  Window,
} from "./parts";

// Cue ditulis sebagai frasa dari SPOKEN (config.ts): `when("frasa")` = detik, `cue(detik)` = frame lokal.
// Satu sorotan oranye per layar (lihat storyboard di README).

// ---------- 1. Hook: kartu repo ----------

export const HookScene: React.FC = () => {
  const { when } = useCue("hook");
  return (
    <Frame id="hook">
      <Headline delay={cue(0)} size={100}>
        Video Ini Ditulis <Accent>Pakai React</Accent>
      </Headline>
      <StrikeChip delay={cue(when("tidak diedit"))} strikeAt={cue(when("tapi"))}>
        Editor video
      </StrikeChip>
      <RepoCard delay={cue(when("ditulis"))} />
    </Frame>
  );
};

// ---------- 2. Konteks: diagram frame → komponen → kode ----------

export const KonteksScene: React.FC = () => {
  const { when } = useCue("konteks");
  const comp = cue(when("komponen"));
  return (
    <Frame id="konteks">
      <Headline delay={cue(0)} size={84}>
        Tiap Frame Adalah Komponen
      </Headline>
      <FilmStrip delay={cue(when("tiap frame"))} big />
      <DownArrow at={comp - 6} />
      <ComponentNode delay={comp}>{"<Video frame={n} />"}</ComponentNode>
      <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
        <Tag big delay={cue(when("animasi,"))} icon="sparkles">
          Animasi
        </Tag>
        <Tag big delay={cue(when("teks,"))} icon="fileText">
          Teks
        </Tag>
        <Tag big delay={cue(when("data"))} icon="database">
          Data
        </Tag>
      </div>
    </Frame>
  );
};

// ---------- 3. Install: terminal ----------

export const InstallScene: React.FC = () => {
  const t = useTheme();
  const { when } = useCue("install");
  const cmd = when("en pe eks");
  const pick = cue(when("pilih template"));
  return (
    <Frame id="install">
      <Headline delay={cue(0)} size={60} muted>
        Install Satu Perintah
      </Headline>
      <Window delay={cue(0.1)} title="terminal" name="Terminal">
        <Line show={cue(when("Node Ji Es"))}>
          <span style={{ color: t.colors.success ?? t.code.text }}>✓</span> Node.js terpasang
        </Line>
        <Line show={cue(cmd) - 4}>
          <span style={{ color: t.code.muted }}>$</span>
          <Typed start={cmd} dur={1.4} text="npx create-video@latest" />
        </Line>
        <Line show={pick}>
          <span style={{ color: t.code.muted }}>? Pilih template</span>
        </Line>
        <Line show={pick + 4}>
          <span style={{ padding: "4px 18px", borderRadius: 8, backgroundColor: t.colors.accent, color: t.colors.onAccent, fontWeight: 700 }}>› Hello World</span>
        </Line>
        <Line show={pick + 8}>
          <span style={{ paddingLeft: 18, color: t.code.muted }}>Blank</span>
        </Line>
        <Line show={cue(when("siap"))}>
          <span style={{ color: t.colors.success ?? t.code.text }}>✓</span> Proyek siap
        </Line>
      </Window>
    </Frame>
  );
};

// ---------- 4. Kode: code block + pratinjau ----------

export const KodeScene: React.FC = () => {
  const t = useTheme();
  const { when } = useCue("kode");
  const use = cue(when("use Current"));
  const interp = cue(when("interpolate"));
  return (
    <Frame id="kode">
      <Headline delay={cue(0)} size={76} muted>
        Animasi Dari Nomor Frame
      </Headline>
      <Window delay={cue(0.1)} title="Judul.tsx" name="Kode">
        <div style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 28, color: t.code.muted }}>
          <CodeLine>{"const Judul = () => {"}</CodeLine>
          <CodeLine on={use} off={interp}>
            {"  const frame = useCurrentFrame();"}
          </CodeLine>
          <CodeLine on={interp}>{"  const opacity = interpolate("}</CodeLine>
          <CodeLine on={interp}>{"    frame, [0, 30], [0, 1],"}</CodeLine>
          <CodeLine on={interp}>{"  );"}</CodeLine>
          <CodeLine>{"  return <h1 style={{ opacity }}>"}</CodeLine>
          <CodeLine>{"    Halo"}</CodeLine>
          <CodeLine>{"  </h1>;"}</CodeLine>
          <CodeLine>{"};"}</CodeLine>
        </div>
      </Window>
      <FrameCounter delay={use} />
      <PreviewBox delay={interp} start={cue(when("posisi"))} />
    </Frame>
  );
};

// ---------- 5. Render: Studio lalu bar progres ----------

export const RenderScene: React.FC = () => {
  const { when } = useCue("render");
  const render = cue(when("en pe eks"));
  return (
    <Frame id="render">
      <StudioShot delay={cue(0)} quietAt={render} />
      <RenderRow delay={render} fileAt={cue(when("file"))} />
    </Frame>
  );
};

// ---------- 6. Agen: daftar skill ----------

export const AgenScene: React.FC = () => {
  const t = useTheme();
  const { when } = useCue("agen");
  const cmd = when("en pe eks");
  const list = cue(when("supaya"));
  return (
    <Frame id="agen">
      <Headline delay={cue(0)} size={64}>
        Agen Ikut Paham Remotion
      </Headline>
      <Window delay={cue(cmd) - 6} title="terminal" name="Terminal skill">
        <Line show={cue(cmd) - 4}>
          <span style={{ color: t.code.muted }}>$</span>
          <Typed start={cmd} dur={1.2} text="npx remotion skills add" />
        </Line>
      </Window>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <CheckRow delay={list} hot>
          remotion-best-practices
        </CheckRow>
        <CheckRow delay={list + 6}>remotion-create</CheckRow>
        <CheckRow delay={list + 12}>remotion-markup</CheckRow>
        <CheckRow delay={list + 18}>remotion-render</CheckRow>
      </div>
    </Frame>
  );
};

// ---------- 7. Closing: kutipan ----------

export const ClosingScene: React.FC = () => {
  const { when } = useCue("closing");
  return (
    <Frame id="closing">
      <Headline delay={cue(0)} size={92}>
        Begitu Video <Accent>Jadi Kode</Accent>, Bisa Direview Dan Diulang
      </Headline>
      <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
        <Tag big delay={cue(when("mereview"))} icon="eye">
          Direview
        </Tag>
        <Tag big delay={cue(when("mengulangnya"))} icon="refreshCw">
          Diulang
        </Tag>
      </div>
    </Frame>
  );
};

// ---------- 8. CTA ----------

export const CtaScene: React.FC = () => {
  const { when } = useCue("cta");
  return (
    <Frame id="cta">
      <FollowPill delay={cue(0)} />
      <Headline delay={cue(when("bikin video"))} size={84}>
        Bikin Video <Accent>Lewat Kode</Accent>, Bukan Lewat Editor
      </Headline>
    </Frame>
  );
};
