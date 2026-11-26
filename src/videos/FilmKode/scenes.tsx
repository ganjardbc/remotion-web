import type React from "react";
import { Accent, BigNumber, Card, Flow, FollowPill, Frame, Headline, PillRow, QuoteCard, SourceChip, Stamp, Terminal, cue, useCue } from "./parts";

// Cue ditulis sebagai frasa dari SPOKEN (config.ts): `cue(when("frasa"))`.
// Teks di layar memakai "Lemo Opuscar"; ejaan fonetis ("Lemo Opuskar") hanya ada di SPOKEN.
// Hero visual: hook angka besar, relate dua kartu keluhan, shift diagram alur, urgency kartu perintah,
// install terminal + pil syarat, pakai kartu prompt + pil rumus, closing kutipan + stempel, cta tombol follow + kartu repo.

// ---------- 1. Hook ----------

export const HookScene: React.FC = () => {
  const { when } = useCue("hook");
  return (
    <Frame id="hook">
      <SourceChip delay={cue(when("Lemomo"))}>lemomo-ai/lemo-opuscar</SourceChip>
      <BigNumber delay={0} to={99} accent name="99 gaya" />
      <Headline delay={cue(when("plugin"))} size={76}>
        Gaya Film Dari Claude Code
      </Headline>
      <Headline delay={cue(when("tanpa"))} size={44} muted name="Tanpa model video">
        tanpa model video sama sekali
      </Headline>
    </Frame>
  );
};

// ---------- 2. Relate ----------

export const RelateScene: React.FC = () => {
  const { when } = useCue("relate");
  return (
    <Frame id="relate">
      <Headline delay={cue(0.1)} size={80}>
        Edit Manual Atau Hasil <Accent>Acak</Accent>
      </Headline>
      <Card delay={cue(when("edit"))} name="Edit manual" icon="clock" sub="berjam-jam di timeline" x={-60}>
        Edit manual
      </Card>
      <Card delay={cue(when("bayar"))} name="Generator video" icon="triangleAlert" sub="bayar, hasilnya acak" x={60}>
        Generator video
      </Card>
    </Frame>
  );
};

// ---------- 3. Shift ----------

export const ShiftScene: React.FC = () => {
  const { when } = useCue("shift");
  return (
    <Frame id="shift">
      <Headline delay={cue(0.1)} size={60}>
        Filmnya Murni <Accent>Hasil Kode</Accent>
      </Headline>
      <Flow codeAt={cue(when("menulis"))} partsAt={[cue(when("menggambar")), cue(when("menyusun")), cue(when("membacakan"))]} filmAt={cue(when("jadi"))} />
    </Frame>
  );
};

// ---------- 4. Urgency ----------

export const UrgencyScene: React.FC = () => {
  const { when } = useCue("urgency");
  return (
    <Frame id="urgency">
      <Headline delay={cue(0.1)} size={76}>
        <Accent>Dua Perintah</Accent>, Lalu Minta
      </Headline>
      <Card delay={cue(when("dua"))} name="Perintah" icon="plug" sub="pasang sekali, selesai" x={-60}>
        Dua perintah
      </Card>
      <Card delay={cue(when("cara"))} name="Cara meminta" icon="messageCircle" sub="yang menentukan hasil">
        Cara kamu meminta
      </Card>
    </Frame>
  );
};

// ---------- 5. Install ----------

export const InstallScene: React.FC = () => {
  const { when } = useCue("install");
  return (
    <Frame id="install">
      <Headline delay={cue(0.1)} size={64}>
        Pasang Lewat <Accent>Terminal</Accent>
      </Headline>
      <Terminal
        lines={[
          { text: "claude plugin marketplace add lemomo-ai/lemo-opuscar", at: cue(when("tambahkan")) },
          { text: "claude plugin install lemo-opuscar@lemolab", at: cue(when("pasang")) },
        ]}
      />
      <PillRow delay={cue(when("siapkan"))} items={["Node 20+", "ffmpeg 7+", "Python 3.11+"]} />
    </Frame>
  );
};

// ---------- 6. Pakai ----------

export const PakaiScene: React.FC = () => {
  const { when } = useCue("pakai");
  return (
    <Frame id="pakai">
      <Headline delay={cue(0.1)} size={72}>
        Minta Dengan <Accent>Rumus</Accent>
      </Headline>
      <Card delay={cue(when("Ketik"))} name="Prompt contoh" icon="messageCircle" sub="/lemo-opuscar:lemo-opuscar">
        "Make a 45-second film in the watercolor style about the coffee farm my family runs."
      </Card>
      <PillRow delay={cue(when("gaya,"))} items={["gaya", "topik", "durasi"]} />
      <PillRow delay={cue(when("misalnya"))} items={["satu film 30-60 menit"]} />
    </Frame>
  );
};

// ---------- 7. Closing ----------

export const ClosingScene: React.FC = () => {
  const { when } = useCue("closing");
  return (
    <Frame id="closing">
      <QuoteCard delay={cue(0.1)}>
        Film tidak harus lahir dari model video, cukup dari agen yang <Accent>menggambar lewat kode</Accent>
      </QuoteCard>
      <Stamp delay={cue(when("kadang"))}>99 gaya siap pakai</Stamp>
    </Frame>
  );
};

// ---------- 8. Cta ----------

export const CtaScene: React.FC = () => {
  const { when } = useCue("cta");
  return (
    <Frame id="cta">
      <Headline delay={cue(0.1)} size={72}>
        Plugin <Accent>Claude Code</Accent> Lainnya
      </Headline>
      <FollowPill delay={cue(when("Follow"))} />
      <SourceChip delay={cue(when("Follow")) + 10}>github.com/lemomo-ai/lemo-opuscar</SourceChip>
    </Frame>
  );
};
