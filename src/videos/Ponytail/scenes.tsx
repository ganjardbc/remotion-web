import type React from "react";
import { Accent, BarColumn, BigNumber, Card, Chip, CodeGrowth, FileTile, FollowPill, Frame, Headline, Ladder, Locks, QuoteCard, SourceChip, Stamp, StatTile, Terminal, TestCompare, cue, useCue } from "./parts";
import { useTheme } from "../../themes";

// Cue ditulis sebagai frasa dari SPOKEN (config.ts): `cue(when("frasa"))`.
// Teks di layar memakai "AI" dan "Ponytail"; yang diucapkan ("Ei Ai", "Poni Teil") hanya ada di SPOKEN.
// Hero visual: hook angka besar, relate tumpukan kode, shift tangga keputusan, urgency kartu perintah,
// cara terminal, case batang vertikal dua kolom, manfaat grid angka, closing kutipan + stempel, cta tombol + ubin file.

// ---------- 1. Hook ----------

export const HookScene: React.FC = () => {
  const { when } = useCue("hook");
  return (
    <Frame id="hook">
      <SourceChip delay={cue(when("Dietrich"))}>DietrichGebert/ponytail</SourceChip>
      <Headline delay={cue(0.05)} size={84}>
        Agen AI Yang Malas
      </Headline>
      <BigNumber delay={cue(0.2)} to={53} prefix="-" suffix="%" accent name="Kode turun" />
      <Headline delay={cue(0.45)} size={50} muted name="Kode">
        kode di benchmark-nya
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
        Minta Kecil, Dapat <Accent>Ratusan Baris</Accent>
      </Headline>
      <CodeGrowth delay={cue(when("menulis"))} lines={335} />
      <Card delay={cue(when("capek"))} name="Review" icon="eye" sub="menunggu kamu" dim>
        Review menumpuk
      </Card>
    </Frame>
  );
};

// ---------- 3. Shift ----------

export const ShiftScene: React.FC = () => {
  const { when } = useCue("shift");
  return (
    <Frame id="shift">
      <Headline delay={cue(0.1)} size={64}>
        Berhenti Di Anak Tangga <Accent>Pertama</Accent>
      </Headline>
      <Ladder delay={cue(when("Poni"))} scanAt={cue(when("berhenti"))} stopAt={1} />
      <Locks delay={cue(when("tanpa"))} />
    </Frame>
  );
};

// ---------- 4. Urgency ----------

export const UrgencyScene: React.FC = () => {
  const { when } = useCue("urgency");
  return (
    <Frame id="urgency">
      <Headline delay={cue(0.1)} size={76}>
        <Accent>Dua Perintah</Accent>, Satu Contoh
      </Headline>
      <Card delay={cue(when("dua"))} name="Perintah 1" icon="plug" sub="plugin marketplace add" x={-60}>
        Tambah marketplace
      </Card>
      <Card delay={cue(when("dua")) + 8} name="Perintah 2" icon="terminal" sub="plugin install" x={60}>
        Pasang Ponytail
      </Card>
      <Card delay={cue(when("contoh"))} name="Contoh nyata" icon="sparkles" sub="date picker" highlight>
        Contoh nyata
      </Card>
    </Frame>
  );
};

// ---------- 5. Cara ----------

export const CaraScene: React.FC = () => {
  const { when } = useCue("cara");
  return (
    <Frame id="cara">
      <Headline delay={cue(0.1)} size={80}>
        Pasang Di <Accent>Claude Code</Accent>
      </Headline>
      <Terminal
        lines={[
          { text: "/plugin marketplace add DietrichGebert/ponytail", at: cue(when("jalankan")) },
          { text: "/plugin install ponytail@ponytail", at: cue(when("plugin install")) },
          { text: "Ponytail aktif", at: cue(when("selesai")), ok: true },
        ]}
      />
    </Frame>
  );
};

// ---------- 6. Case ----------

export const CaseScene: React.FC = () => {
  const { when } = useCue("case");
  const t = useTheme();
  return (
    <Frame id="case">
      <Headline delay={cue(0.1)} size={64} muted name="Permintaan">
        Minta: tambah date picker
      </Headline>
      <div style={{ display: "flex", gap: 24 }}>
        <BarColumn delay={cue(when("tanpa"))} label="Tanpa skill" value={335} max={335} color={t.colors.danger ?? t.code.muted} unit="baris" name="Tanpa skill" />
        <BarColumn delay={cue(when("dengan"))} label="Ponytail" value={10} max={335} color={t.colors.success ?? t.colors.primary} accent unit="baris" name="Ponytail" />
      </div>
      <Chip delay={cue(when("karena"))} name="Input date">
        {'<Input type="date" />'}
      </Chip>
    </Frame>
  );
};

// ---------- 7. Manfaat ----------

export const ManfaatScene: React.FC = () => {
  const { when } = useCue("manfaat");
  return (
    <Frame id="manfaat">
      <Headline delay={cue(0.1)} size={72}>
        Lebih Sedikit, Lebih Aman
      </Headline>
      <div style={{ display: "flex", gap: 20 }}>
        <StatTile delay={cue(when("kode"))} value="-53%" label="kode" />
        <StatTile delay={cue(when("waktu"))} value="-41%" label="waktu" />
        <StatTile delay={cue(when("waktu")) + 14} value="-45%" label="token" />
      </div>
      <TestCompare delay={cue(when("tes"))} fillAt={cue(when("naik"))} />
      <Headline delay={cue(when("tes"))} size={30} muted name="Sumber benchmark">
        39 task · Opus 5.5 · dari README repo
      </Headline>
    </Frame>
  );
};

// ---------- 8. Closing ----------

export const ClosingScene: React.FC = () => {
  const { when } = useCue("closing");
  return (
    <Frame id="closing">
      <QuoteCard delay={cue(0.1)}>
        Kode paling aman adalah yang <Accent>tidak perlu ditulis</Accent>
      </QuoteCard>
      <Stamp delay={cue(when("agen"))}>Agen terbaik tahu kapan berhenti</Stamp>
    </Frame>
  );
};

// ---------- 9. Cta ----------

export const CtaScene: React.FC = () => {
  const { when } = useCue("cta");
  return (
    <Frame id="cta">
      <Headline delay={cue(0.1)} size={76}>
        Info <Accent>AI Tools</Accent> Lainnya
      </Headline>
      <FollowPill delay={cue(when("Follow"))} />
      <div style={{ display: "flex", gap: 20 }}>
        <FileTile delay={cue(when("tools"))}>Skill</FileTile>
        <FileTile delay={cue(when("tools")) + 6}>MCP</FileTile>
        <FileTile delay={cue(when("tools")) + 12}>Plugin</FileTile>
      </div>
    </Frame>
  );
};
