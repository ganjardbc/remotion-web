import type React from "react";
import { Accent, Claim, FileCard, FileTile, FollowPill, Frame, GateLoop, Headline, LineToLoop, LoopStep, ReturnLink, SourceChip, Stage, cue, useCue } from "./parts";

// Cue ditulis sebagai frasa dari SPOKEN (config.ts): `cue(when("frasa"))`.
// Teks di layar memakai "AI" dan "SDLC"; yang diucapkan ("Ei Ai", "Es Di El Si") hanya ada di SPOKEN.
// Hero visual: hook klaim coret, relate bar durasi, shift garis jadi lingkaran, urgency kartu file,
// cara langkah loop, closing gerbang + loop, cta tombol + ubin file.

// ---------- 1. Hook ----------

export const HookScene: React.FC = () => {
  const { when } = useCue("hook");
  return (
    <Frame id="hook" variant="dark" sweep>
      <Headline delay={cue(0.1)} size={104}>
        AI-Native <Accent>SDLC</Accent>
      </Headline>
      <SourceChip delay={cue(when("Anthropic"))}>Anthropic · The AI-native SDLC playbook</SourceChip>
      <Headline delay={cue(when("istilah baru"))} size={52} muted name="Istilah baru">
        Istilah baru untuk developer
      </Headline>
      <Claim delay={cue(when("Artinya"))} strikeAt={cue(when("bukan"))} tone="no" name="Bukan">
        Agen yang menulis kode
      </Claim>
      <Claim delay={cue(when("tapi cara"))} tone="yes" name="Tapi">
        Cara kerja yang dirancang ulang
      </Claim>
    </Frame>
  );
};

// ---------- 2. Relate ----------

export const RelateScene: React.FC = () => {
  const { when } = useCue("relate");
  return (
    <Frame id="relate" variant="primary">
      <Headline delay={cue(0.1)} size={88}>
        Kodenya Cepat, <Accent>Prosesnya Tidak</Accent>
      </Headline>
      <Stage delay={cue(when("menulis"))} fillAt={cue(when("menulis"))} value={0.12} tone="fast" tag="sejam" name="Tulis kode">
        Agen menulis kode
      </Stage>
      <Stage delay={cue(when("review,"))} fillAt={cue(when("review,"))} value={0.62} tone="slow" tag="menunggu" name="Review">
        Review
      </Stage>
      <Stage delay={cue(when("persetujuan,"))} fillAt={cue(when("persetujuan,"))} value={0.78} tone="slow" tag="menunggu" name="Persetujuan">
        Persetujuan
      </Stage>
      <Stage delay={cue(when("rilis"))} fillAt={cue(when("rilis"))} value={0.94} tone="slow" tag="menunggu" name="Rilis">
        Rilis
      </Stage>
    </Frame>
  );
};

// ---------- 3. Shift ----------

export const ShiftScene: React.FC = () => {
  const { when } = useCue("shift");
  return (
    <Frame id="shift" variant="ground">
      <Headline delay={cue(0.1)} size={90}>
        Garis Lurus Jadi <Accent>Loop</Accent>
      </Headline>
      <LineToLoop delay={cue(0.4)} showAt={["garis lurus", "desain,", "build,", "tes,", "rilis."].map((w) => cue(when(w)))} loopAt={cue(when("jadi loop"))} fileAt={cue(when("satu file"))} />
    </Frame>
  );
};

// ---------- 4. Urgency ----------

export const UrgencyScene: React.FC = () => {
  const { when } = useCue("urgency");
  return (
    <Frame id="urgency" variant="dark">
      <Headline delay={cue(0.1)} size={76}>
        Yang Menentukan: <Accent>Isi Filenya</Accent>
      </Headline>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <FileCard delay={cue(when("loop saja"))} lit={cue(when("Yang bikin"))} name="intent" sub="apa yang diminta">
          intent.md
        </FileCard>
        <FileCard delay={cue(when("loop saja") + 0.3)} lit={cue(when("jalan adalah"))} name="spec" sub="apa yang harus benar">
          spec.md
        </FileCard>
        <FileCard delay={cue(when("loop saja") + 0.6)} lit={cue(when("tiap file"))} name="plan" sub="langkah disetujui">
          plan.md
        </FileCard>
        <FileCard delay={cue(when("loop saja") + 0.9)} lit={cue(when("dilewatkan"))} name="diff" sub="kode dan tes">
          diff + tes
        </FileCard>
      </div>
    </Frame>
  );
};

// ---------- 5. Cara ----------

export const CaraScene: React.FC = () => {
  const { when } = useCue("cara");
  const intent = cue(when("intent:"));
  const spec = cue(when("spec:"));
  const plan = cue(when("plan:"));
  const code = cue(when("kode dan tes"));
  const back = cue(when("masalah dari"));
  return (
    <Frame id="cara" variant="primary">
      <Headline delay={cue(0.1)} size={82}>
        Satu Loop, <Accent>Empat Tahap</Accent>
      </Headline>
      <LoopStep delay={cue(0.4)} lit={intent} off={spec} n={1} name="Intent" sub="apa yang diminta dan kenapa">
        intent.md
      </LoopStep>
      <LoopStep delay={cue(0.6)} lit={spec} off={plan} n={2} name="Spec" sub="apa yang harus benar">
        spec.md
      </LoopStep>
      <LoopStep delay={cue(0.8)} lit={plan} off={code} n={3} name="Plan" sub="langkah disetujui sebelum kode">
        plan.md
      </LoopStep>
      <LoopStep delay={cue(1)} lit={code} off={back} n={4} name="Kode" sub="diff dan tes">
        kode + tes
      </LoopStep>
      <ReturnLink delay={back} />
    </Frame>
  );
};

// ---------- 6. Closing ----------

export const ClosingScene: React.FC = () => {
  const { when } = useCue("closing");
  return (
    <Frame id="closing" variant="ground">
      <Headline delay={cue(0.1)} size={88}>
        Manusia Tetap <Accent>Di Atas</Accent> Loop
      </Headline>
      <GateLoop delay={cue(0.4)} gateAt={cue(when("manusia memegang"))} />
    </Frame>
  );
};

// ---------- 7. CTA ----------

export const CtaScene: React.FC = () => {
  const { when } = useCue("cta");
  const files = cue(when("alurnya"));
  return (
    <Frame id="cta" variant="primary">
      <Headline delay={cue(0.1)} size={88}>
        Pahami <Accent>Alurnya</Accent>, Bukan Cuma Tools
      </Headline>
      <FollowPill delay={cue(when("Follow"))} />
      <div style={{ display: "flex", gap: 16 }}>
        <FileTile delay={files}>intent.md</FileTile>
        <FileTile delay={files + 5}>spec.md</FileTile>
        <FileTile delay={files + 10}>plan.md</FileTile>
        <FileTile delay={files + 15}>diff</FileTile>
      </div>
    </Frame>
  );
};
