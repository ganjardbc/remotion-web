import type React from "react";
import { Icon } from "../../icons";
import { useTheme } from "../../themes";
import { Accent, CheckRow, Chip, cue, Flow, FollowPill, Frame, Headline, HtmlToFilm, Line, PreviewWindow, RenderRow, RepoCard, Stamp, Terminal, Typed, useCue, Window } from "./parts";

// Cue ditulis sebagai frasa dari SPOKEN (config.ts): `const { when } = useCue("<id>")`, lalu `cue(when("frasa"))`.
// Teks di layar memakai ejaan asli ("npx", "MP4"); ejaan fonetis hanya ada di SPOKEN.
// Satu sorotan oranye per layar: Accent di judul, atau simpul `hot` di Flow (konteks).

// ---------- 1. Hook ----------

export const HookScene: React.FC = () => {
  const { when } = useCue("hook");
  return (
    <Frame id="hook">
      <Headline delay={cue(0)} size={96}>
        HTML Biasa Jadi <Accent>Video MP4</Accent>
      </Headline>
      <RepoCard delay={cue(when("Hei"))} />
      <HtmlToFilm delay={cue(when("mengubah"))} />
    </Frame>
  );
};

// ---------- 2. Konteks ----------

export const KonteksScene: React.FC = () => {
  const { when } = useCue("konteks");
  return (
    <Frame id="konteks">
      <Headline delay={cue(0)} size={64} muted>
        Cara Kerjanya
      </Headline>
      <Flow
        delays={[cue(when("tulis")), cue(when("Chrome")), cue(when("Ef")), cue(when("video."))]}
        items={[
          ["code", "HTML"],
          ["globe", "Chrome"],
          ["layers", "FFmpeg"],
          ["play", "MP4"],
        ]}
        hot={2}
      />
    </Frame>
  );
};

// ---------- 3. Syarat ----------

export const SyaratScene: React.FC = () => {
  const { when } = useCue("syarat");
  return (
    <Frame id="syarat">
      <Headline delay={cue(0)} size={104}>
        Syaratnya Cuma <Accent>Dua</Accent>
      </Headline>
      <CheckRow delay={cue(when("Node"))} sub="Node.js versi 22 ke atas">
        Node 22+
      </CheckRow>
      <CheckRow delay={cue(when("Ef"))} sub="menyatukan frame jadi video">
        FFmpeg
      </CheckRow>
      <Stamp delay={cue(when("lisensinya"))} icon="shield">
        Lisensi Apache 2.0
      </Stamp>
    </Frame>
  );
};

// ---------- 4. Install ----------

export const InstallScene: React.FC = () => {
  const { when } = useCue("install");
  return (
    <Frame id="install">
      <Headline delay={cue(0)} size={68}>
        Pasang Skill untuk <Accent>Agen</Accent>
      </Headline>
      <Terminal
        delay={cue(0.2)}
        lines={[
          { text: "npx skills add heygen-com/hyperframes", at: cue(when("jalankan")) },
          { text: "pilih: Core Skills", at: cue(when("Core")), ok: true },
        ]}
      />
    </Frame>
  );
};

// ---------- 5. Init ----------

export const InitScene: React.FC = () => {
  const { when } = useCue("init");
  const t = useTheme();
  return (
    <Frame id="init">
      <Headline delay={cue(0)} size={84}>
        Atau Mulai <Accent>Manual</Accent>
      </Headline>
      <Chip delay={cue(when("Jalankan"))} name="Perintah init">
        npx hyperframes init my-video
      </Chip>
      <Window delay={cue(when("folder") - 0.3)} title="hasilnya" name="Pohon folder" x={60}>
        <Line show={cue(when("folder"))}>
          <Icon name="folder" size={64} color={t.code.text} /> <span style={{ fontSize: 44, fontWeight: 700 }}>my-video/</span>
        </Line>
        <Line show={cue(when("langsung"))} indent={1}>
          <Icon name="fileText" size={56} color={t.code.muted} /> <span style={{ fontSize: 40 }}>index.html</span>
        </Line>
      </Window>
    </Frame>
  );
};

// ---------- 6. Pakai ----------

export const PakaiScene: React.FC = () => {
  const { when } = useCue("pakai");
  return (
    <Frame id="pakai">
      <Headline delay={cue(0)} size={64} muted>
        Preview, Lalu <Accent>Render</Accent>
      </Headline>
      <PreviewWindow delay={cue(when("preview"))} start={cue(when("tampilan"))} />
      <RenderRow delay={cue(when("render"))} fileAt={cue(when("file"))} />
    </Frame>
  );
};

// ---------- 7. Agen ----------

export const AgenScene: React.FC = () => {
  const { when } = useCue("agen");
  const t = useTheme();
  const start = when("pakai");
  return (
    <Frame id="agen">
      <Headline delay={cue(0)} size={76}>
        Atau Cukup Minta <Accent>Agen</Accent>
      </Headline>
      <Window delay={cue(0.3)} title="Claude Code" name="Prompt">
        <div style={{ fontFamily: t.fonts.body, fontWeight: 600, fontSize: 36, lineHeight: 1.35 }}>
          <Typed start={start} dur={when("musik") - start + 0.6} text="/hyperframes buat intro produk 10 detik, judul fade in, musik latar" />
        </div>
      </Window>
      <Stamp delay={cue(when("fade"))} icon="sparkles">
        Agen menulis HTML, lalu render
      </Stamp>
    </Frame>
  );
};

// ---------- 8. Cta ----------

export const CtaScene: React.FC = () => {
  const { when } = useCue("cta");
  return (
    <Frame id="cta">
      <Headline delay={cue(0)} size={88}>
        Tools AI yang Bikin Kerja <Accent>Lebih Ringan</Accent>
      </Headline>
      <FollowPill delay={cue(when("Follow") + 0.3)} />
    </Frame>
  );
};
