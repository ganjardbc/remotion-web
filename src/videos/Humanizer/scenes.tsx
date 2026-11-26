import type React from "react";
import { Accent, AiTextCard, BeforeAfter, BigNumber, Card, Chip, FileTile, FollowPill, Frame, Headline, Locks, PatternList, QuoteCard, SourceChip, Stamp, Terminal, cue, useCue } from "./parts";

// Cue ditulis sebagai frasa dari SPOKEN (config.ts): `cue(when("frasa"))`.
// Teks di layar memakai "AI" dan "Humanizer"; yang diucapkan ("Ei Ai", "Hiuman Aizer") hanya ada di SPOKEN.
// Hero visual: hook angka besar + chip sumber, relate kartu teks AI bertanda, shift daftar pola dipindai, urgency kartu perintah,
// install terminal, pakai terminal + tiga kartu cara, hasil sebelum/sesudah, closing kutipan + stempel, cta tombol + ubin.

// ---------- 1. Hook ----------

export const HookScene: React.FC = () => {
  const { when } = useCue("hook");
  return (
    <Frame id="hook">
      <SourceChip delay={cue(when("Editor"))}>blader/humanizer</SourceChip>
      <Headline delay={cue(0.05)} size={80}>
        Tulisan AI Yang Terdengar Manusia
      </Headline>
      <BigNumber delay={cue(when("daftar"))} to={26} accent name="26 pola" size={240} />
      <Headline delay={cue(when("daftar") + 0.3)} size={46} muted name="Pola">
        pola tulisan AI dari Wikipedia
      </Headline>
    </Frame>
  );
};

// ---------- 2. Relate ----------

export const RelateScene: React.FC = () => {
  const { when } = useCue("relate");
  return (
    <Frame id="relate">
      <Headline delay={cue(0.1)} size={76}>
        Rapi, Tapi <Accent>Langsung Ketahuan</Accent>
      </Headline>
      <AiTextCard delay={cue(when("hasilnya"))} flagAt={cue(when("penuh"))} />
      <Card delay={cue(when("pembaca"))} name="Pembaca" icon="eye" sub="pembaca langsung sadar" dim>
        Pembaca curiga
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
        Cek <Accent>26 Pola</Accent>, Tulis Ulang
      </Headline>
      <PatternList delay={cue(when("mengecek"))} scanAt={cue(when("pola"))} />
      <Locks delay={cue(when("tanpa"))} labels={["Isi tetap", "Fakta tetap"]} />
    </Frame>
  );
};

// ---------- 4. Urgency ----------

export const UrgencyScene: React.FC = () => {
  const { when } = useCue("urgency");
  return (
    <Frame id="urgency">
      <Headline delay={cue(0.1)} size={76}>
        <Accent>Dua Perintah</Accent>, Langsung Coba
      </Headline>
      <Card delay={cue(when("dua"))} name="Perintah 1" icon="plug" sub="plugin marketplace add" x={-60}>
        Tambah marketplace
      </Card>
      <Card delay={cue(when("dua")) + 8} name="Perintah 2" icon="terminal" sub="plugin install" x={60}>
        Pasang Humanizer
      </Card>
      <Card delay={cue(when("mencobanya"))} name="Tulisanmu" icon="sparkles" sub="tulisanmu sendiri">
        Coba di tulisanmu
      </Card>
    </Frame>
  );
};

// ---------- 5. Install ----------

export const InstallScene: React.FC = () => {
  const { when } = useCue("install");
  return (
    <Frame id="install">
      <Headline delay={cue(0.1)} size={80}>
        Pasang Di <Accent>Claude Code</Accent>
      </Headline>
      <Terminal
        lines={[
          { text: "/plugin marketplace add blader/humanizer", at: cue(when("jalankan")) },
          { text: "/plugin install humanizer@humanizer", at: cue(when("plugin install")) },
          { text: "Humanizer aktif", at: cue(when("selesai")), ok: true },
        ]}
      />
    </Frame>
  );
};

// ---------- 6. Pakai ----------

export const PakaiScene: React.FC = () => {
  const { when } = useCue("pakai");
  return (
    <Frame id="pakai">
      <Headline delay={cue(0.1)} size={64} muted name="Cara pakai">
        Cara Pakai
      </Headline>
      <Chip delay={cue(when("Ketik"))} name="Perintah">
        /humanizer
      </Chip>
      <Card delay={cue(when("tempel"))} name="Tempel teks" icon="fileText" sub="tempel tulisanmu">
        Tempel tulisan
      </Card>
      <Card delay={cue(when("sebut"))} name="Sebut file" icon="folder" sub="docs/postingan.md">
        Atau sebut nama file
      </Card>
      <Card delay={cue(when("contoh"))} name="Contoh gaya" icon="sparkles" sub="2-3 paragraf tulisanmu" highlight>
        Kasih contoh gayamu
      </Card>
    </Frame>
  );
};

// ---------- 7. Hasil ----------

export const HasilScene: React.FC = () => {
  const { when } = useCue("hasil");
  return (
    <Frame id="hasil">
      <Headline delay={cue(0.1)} size={68}>
        Isi Tetap, <Accent>Terdengar Manusia</Accent>
      </Headline>
      <BeforeAfter
        delay={cue(0.4)}
        afterAt={cue(when("Kalimatnya"))}
        before="Ini bukan sekadar fitur, ini cara baru berkolaborasi. Dan yang terbaik? Gratis. Renungkan itu."
        after="Draf bersama sudah rilis. Dua orang bisa mengedit dokumen yang sama sekaligus. Gratis di semua paket."
      />
      <Chip delay={cue(when("bukan"))} name="Bukan pengakal detektor">
        untuk pembaca, bukan detektor
      </Chip>
    </Frame>
  );
};

// ---------- 8. Closing ----------

export const ClosingScene: React.FC = () => {
  const { when } = useCue("closing");
  return (
    <Frame id="closing">
      <QuoteCard delay={cue(0.1)}>
        Tulisan yang enak dibaca terdengar <Accent>seperti kamu</Accent>
      </QuoteCard>
      <Stamp delay={cue(when("lolos"))}>Bukan yang lolos detektor</Stamp>
    </Frame>
  );
};

// ---------- 9. Cta ----------

export const CtaScene: React.FC = () => {
  const { when } = useCue("cta");
  return (
    <Frame id="cta">
      <Headline delay={cue(0.1)} size={76}>
        Skill <Accent>AI</Accent> Lainnya
      </Headline>
      <FollowPill delay={cue(when("Follow"))} />
      <div style={{ display: "flex", gap: 20 }}>
        <FileTile delay={cue(when("skill"))}>Skill</FileTile>
        <FileTile delay={cue(when("skill")) + 6}>Tulisan</FileTile>
        <FileTile delay={cue(when("skill")) + 12}>Kerja</FileTile>
      </div>
    </Frame>
  );
};
