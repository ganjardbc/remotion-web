import type React from "react";
import { useTheme } from "../../themes";
import { Accent, Ask, Badge, DiffRow, FlowLink, FlowNode, FollowPill, Frame, GithubMark, Headline, Lane, PathLane, PromptBox, Shortcut, Stamp, StepTile, TerminalWindow, Typed, cue, useCue } from "./parts";

// ---------- 1. Hook ----------

export const HookScene: React.FC = () => {
  const t = useTheme();
  const { when } = useCue("hook");
  const build = when("lalu membangun");
  return (
    <Frame id="hook" variant="dark" sweep>
      <Headline delay={cue(0.1)} size={94}>
        AI Menulis Kode, <Accent>Fiturnya Salah</Accent>
      </Headline>
      <TerminalWindow delay={cue(0.15)} title="claude code">
        <div style={{ fontFamily: t.fonts.mono, fontSize: 38, fontWeight: 700, color: t.code.text }}>
          <span style={{ color: t.code.muted }}>&gt; </span>
          <Typed start={0.3} dur={1} text="Buat fitur login" />
        </div>
        <DiffRow delay={cue(when("menulis kode"))} name="Diminta" tone="ok" tag="diminta">Form login</DiffRow>
        <DiffRow delay={cue(build)} name="Tambahan 1" tone="bad" tag="tidak diminta">Dashboard admin</DiffRow>
        <DiffRow delay={cue(build + 0.45)} name="Tambahan 2" tone="bad" tag="tidak diminta">Sistem notifikasi</DiffRow>
        <DiffRow delay={cue(build + 0.9)} name="Tambahan 3" tone="bad" tag="tidak diminta">Halaman profil</DiffRow>
        <Badge delay={cue(when("bukan kamu minta"))} name="Ringkasan" tone="bad">3 fitur yang tidak kamu minta</Badge>
      </TerminalWindow>
    </Frame>
  );
};

// ---------- 2. Relate ----------

export const RelateScene: React.FC = () => {
  const { when } = useCue("relate");
  return (
    <Frame id="relate" variant="primary">
      <Headline delay={cue(0.1)} size={88}>
        Satu Kalimat, <Accent>Empat Asumsi</Accent>
      </Headline>
      <PromptBox delay={cue(when("satu kalimat"))}>Buat fitur login</PromptBox>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 }}>
        <Ask delay={cue(when("konteks"))} name="Konteks" sub="stack apa, kode yang ada?">Konteks</Ask>
        <Ask delay={cue(when("batasan"))} name="Batasan" sub="apa yang tidak boleh diubah?">Batasan</Ask>
        <Ask delay={cue(when("definisi selesai"))} name="Definisi selesai" sub="kapan dianggap selesai?">Definisi selesai</Ask>
        <Ask delay={cue(when("sekaligus"))} name="Agent menebak" sub="sisanya hanya ditebak">Agent paham?</Ask>
      </div>
    </Frame>
  );
};

// ---------- 3. Shift ----------

export const ShiftScene: React.FC = () => {
  const { when } = useCue("shift");
  const steps = [
    { label: "Kebutuhan", sub: "apa dan kenapa", lit: cue(when("jelaskan")) },
    { label: "Spesifikasi", sub: "perilaku fitur", lit: cue(when("spesifikasi")) },
    { label: "Rencana", sub: "pilihan teknis", lit: cue(when("rencana")) },
    { label: "Tugas", sub: "langkah kecil", lit: cue(when("tugas")) },
    { label: "Kode", sub: "implementasi", lit: cue(when("implementasi")) },
  ];
  return (
    <Frame id="shift" variant="ground">
      <Headline delay={cue(0.1)} size={88}>
        Spec Kit Mengubah <Accent>Urutannya</Accent>
      </Headline>
      <Shortcut delay={cue(0.35)} strikeAt={cue(when("membalik"))} />
      <div style={{ display: "flex", flexDirection: "column" }}>
        {steps.map((s, i) => (
          <div key={s.label} style={{ display: "flex", flexDirection: "column" }}>
            {i > 0 ? <FlowLink at={s.lit} /> : null}
            <FlowNode show={cue(0.6) + i * 4} lit={s.lit} n={i + 1} sub={s.sub} final={i === steps.length - 1}>
              {s.label}
            </FlowNode>
          </div>
        ))}
      </div>
    </Frame>
  );
};

// ---------- 4. Urgency ----------

export const UrgencyScene: React.FC = () => {
  const { when } = useCue("urgency");
  return (
    <Frame id="urgency" variant="dark">
      <Headline delay={cue(0.1)} size={92}>
        Bukan Ritual <Accent>Wajib</Accent>
      </Headline>
      <Lane delay={cue(when("ritual wajib"))} fillAt={cue(when("wajib"))} name="Fitur baru" icon="layers" sub="alur penuh, lima tahap" steps={5}>
        Fitur baru
      </Lane>
      <Lane delay={cue(when("alur terpisah"))} fillAt={cue(when("memperbaiki"))} name="Bug" icon="triangleAlert" sub="alur terpisah, lebih ringkas" steps={2}>
        Perbaiki bug
      </Lane>
      <Lane delay={cue(when("memperbaiki"))} fillAt={cue(when("menilai"))} name="Ide" icon="eye" sub="alur terpisah, hanya menilai" steps={1}>
        Nilai sebuah ide
      </Lane>
    </Frame>
  );
};

// ---------- 5. Closing ----------

export const ClosingScene: React.FC = () => {
  const { when } = useCue("closing");
  return (
    <Frame id="closing" variant="ground">
      <Headline delay={cue(0.1)} size={92}>
        Agent Cepat Tetap Butuh <Accent>Arah</Accent>
      </Headline>
      <PathLane delay={cue(0.3)} drawAt={cue(0.8)} kind="wander" label="Tanpa spesifikasi" result="Meleset" />
      <PathLane delay={cue(when("Spesifikasi"))} drawAt={cue(when("Spesifikasi") + 0.3)} kind="straight" label="Dengan spesifikasi" result="Terarah" />
      <Stamp delay={cue(when("bukan menjamin"))}>Bukan jaminan kode sempurna</Stamp>
    </Frame>
  );
};

// ---------- 6. CTA ----------

export const CtaScene: React.FC = () => {
  const t = useTheme();
  const { when } = useCue("cta");
  const steps = cue(when("terstruktur,"));
  return (
    <Frame id="cta" variant="primary">
      <Headline delay={cue(0.1)} size={92}>
        Coding Agent, <Accent>Lebih Terstruktur</Accent>
      </Headline>
      <FollowPill delay={cue(when("Follow"))} />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24, padding: "28px 42px", borderRadius: t.radius.large, backgroundColor: t.code.raised, border: `2px solid ${t.code.line}`, color: t.code.text, fontFamily: t.fonts.mono, fontSize: 38, fontWeight: 700 }}>
          <GithubMark size={64} color={t.code.text} />
          github / spec-kit
        </div>
      </div>
      <div style={{ display: "flex", gap: 22 }}>
        <StepTile delay={steps} name="Spesifikasi" icon="fileText">Spesifikasi</StepTile>
        <StepTile delay={steps + 5} name="Rencana" icon="route">Rencana</StepTile>
        <StepTile delay={steps + 10} name="Tugas" icon="circleCheck">Tugas</StepTile>
      </div>
    </Frame>
  );
};
