import type React from "react";
import { Accent, Chip, Clock, Cycle, DownArrow, FileTile, FollowPill, Frame, Headline, Padlock, OneTile, PromptBox, QuoteCard, SourceChip, Stamp, TangledBoxes, Terminal, cue, useCue } from "./parts";

// Cue ditulis sebagai frasa dari SPOKEN (config.ts): `cue(when("frasa"))`.
// Teks di layar memakai ejaan asli ("Anatomy", "npx", "/anatomy", "WebGL", "3D", "AI"); yang diucapkan fonetis hanya ada di SPOKEN.
// Hero visual: hook gembok 2D, relate diagram kusut, shift kartu jadi gembok, urgency dua angka, install terminal,
// pakai prompt + chip kata kunci, hasil jam + siklus, closing kutipan + stempel, cta tombol + ubin.

// ---------- 1. Hook ----------

export const HookScene: React.FC = () => {
  const { when } = useCue("hook");
  return (
    <Frame id="hook">
      <SourceChip delay={cue(0.05)}>wheresryan22/anatomy</SourceChip>
      <Headline delay={cue(0.1)} size={88}>
        Ide Jadi <Accent>Mesin</Accent>
      </Headline>
      <Padlock delay={cue(0.3)} alignAt={cue(when("mesin"))} turnAt={cue(when("putar"))} openAt={cue(when("putar")) + 14} height={440} />
    </Frame>
  );
};

// ---------- 2. Relate ----------

export const RelateScene: React.FC = () => {
  const { when } = useCue("relate");
  return (
    <Frame id="relate">
      <Headline delay={cue(0.1)} size={76} x={-60}>
        Kotak Dan Panah, <Accent>Tetap Bingung</Accent>
      </Headline>
      <TangledBoxes delay={cue(when("kesh"))} drawAt={cue(when("kotak"))} askAt={cue(when("bingung"))} />
    </Frame>
  );
};

// ---------- 3. Shift ----------

export const ShiftScene: React.FC = () => {
  const { when } = useCue("shift");
  return (
    <Frame id="shift">
      <Headline delay={cue(0.1)} size={68}>
        Jadi <Accent>Benda Nyata</Accent>
      </Headline>
      <Chip delay={cue(when("kesh"))} name="Cache key">
        cache key
      </Chip>
      <DownArrow delay={cue(when("kesh")) + 8} />
      <Padlock delay={cue(when("gembok"))} alignAt={cue(when("gembok")) + 8} turnAt={cue(when("dibuka")) - 6} openAt={cue(when("dibuka")) + 6} height={420} />
    </Frame>
  );
};

// ---------- 4. Urgency ----------

export const UrgencyScene: React.FC = () => {
  const { when } = useCue("urgency");
  return (
    <Frame id="urgency">
      <Headline delay={cue(0.1)} size={64} muted name="Cukup" y={-40}>
        Cukup Ini Saja
      </Headline>
      <div style={{ display: "flex", gap: 24 }}>
        <OneTile delay={cue(when("satu perintah"))} label="perintah" icon="terminal" accent />
        <OneTile delay={cue(when("satu kalimat"))} label="kalimat" icon="messageCircle" />
      </div>
    </Frame>
  );
};

// ---------- 5. Install ----------

export const InstallScene: React.FC = () => {
  const { when } = useCue("install");
  return (
    <Frame id="install">
      <Headline delay={cue(0.1)} size={80} x={60}>
        Pasang Lewat <Accent>Terminal</Accent>
      </Headline>
      <Chip delay={cue(when("wers"))} name="Repo">
        wheresryan22/anatomy
      </Chip>
      <Terminal
        lines={[
          { text: "npx skills add wheresryan22/anatomy -g -a claude-code", at: cue(when("jalankan")) },
          { text: "✓ anatomy terpasang", at: cue(when("selesai")), ok: true },
        ]}
      />
      <Chip delay={cue(when("selesai")) + 6} name="Node">
        Node 22+
      </Chip>
    </Frame>
  );
};

// ---------- 6. Pakai ----------

export const PakaiScene: React.FC = () => {
  const { when } = useCue("pakai");
  return (
    <Frame id="pakai">
      <Headline delay={cue(0.1)} size={72}>
        Satu Kalimat, Tiga Kata Kunci
      </Headline>
      <PromptBox
        delay={cue(0.2)}
        typeAt={cue(when("ketik"))}
        text="/anatomy explain how a token bucket rate limiter works"
        chips={[
          { label: "interactive", at: cue(when("interactive")) },
          { label: "WebGL", at: cue(when("web")) },
          { label: "3D", at: cue(when("tiga")) },
        ]}
      />
    </Frame>
  );
};

// ---------- 7. Hasil ----------

export const HasilScene: React.FC = () => {
  const { when } = useCue("hasil");
  return (
    <Frame id="hasil">
      <Headline delay={cue(0.1)} size={60} muted name="Waktu">
        Satu Figur
      </Headline>
      <Clock delay={cue(0.15)} sweepAt={cue(when("30"))} />
      <Chip delay={cue(when("anggap"))} name="Draf pertama">
        hasil pertama = draf
      </Chip>
      <Cycle at={[cue(when("draf")), cue(when("lalu")), cue(when("perbaikan"))]} />
    </Frame>
  );
};

// ---------- 8. Closing ----------

export const ClosingScene: React.FC = () => {
  const { when } = useCue("closing");
  return (
    <Frame id="closing">
      <QuoteCard delay={cue(0.1)}>
        Penjelasan terbaik adalah yang <Accent>bisa kamu pegang</Accent>
      </QuoteCard>
      <Stamp delay={cue(when("tapi"))}>Ide yang bisa dimainkan</Stamp>
    </Frame>
  );
};

// ---------- 9. Cta ----------

export const CtaScene: React.FC = () => {
  const { when } = useCue("cta");
  return (
    <Frame id="cta">
      <Headline delay={cue(0.1)} size={76}>
        Bikin <Accent>Dokumentasi Hidup</Accent>
      </Headline>
      <FollowPill delay={cue(when("Follow"))} />
      <div style={{ display: "flex", gap: 20 }}>
        <FileTile delay={cue(when("skill"))}>Skill</FileTile>
        <FileTile delay={cue(when("skill")) + 6}>AI</FileTile>
        <FileTile delay={cue(when("skill")) + 12}>Dokumentasi</FileTile>
      </div>
    </Frame>
  );
};
