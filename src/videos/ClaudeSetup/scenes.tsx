import type React from "react";
import { Interactive } from "remotion";
import { Icon } from "../../icons";
import { useTheme } from "../../themes";
import { Enter } from "../../motion";
import { INSTALL_CMD, PROMPT_TEXT } from "./config";
import { Accent, Bar, Frame, Headline, PointTag, cue, useCue } from "./parts";

// Cue ditulis sebagai frasa dari SPOKEN (config.ts); `when` mengubahnya ke detik sejak suara mulai.
// Hero visual per scene (docs/struktur-video.md, "Variasi visual"): hook perbandingan dua kolom, konteks stempel + angka,
// install terminal berketik, pakai kolom prompt + bar pindai, hasil grid dua kolom, cta kartu profil.

// ---------- 1. Hook: perbandingan dua kolom ----------

export const HookScene: React.FC = () => {
  const t = useTheme();
  const { when } = useCue("hook");
  const col = { flex: "1 1 0", minWidth: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 22, padding: "44px 20px", borderRadius: t.radius.large, textAlign: "center", fontFamily: t.fonts.heading, fontWeight: 800, fontSize: 52, lineHeight: 1.15 } as const;
  return (
    <Frame id="hook" sweep>
      <Headline delay={cue(0.1)} size={104}>
        Setup tanpa menebak
      </Headline>
      <div style={{ display: "flex", gap: 24 }}>
        <Enter name="Menebak" delay={cue(0.5)} x={-80} y={0} style={{ ...col, backgroundColor: t.code.raised, border: `2px solid ${t.code.line}`, color: t.code.muted }}>
          <Icon name="circleX" size={96} color={t.code.muted} />
          Menebak
        </Enter>
        <Enter name="Membaca" delay={cue(when("membaca proyekmu"))} x={80} y={0} style={{ ...col, backgroundColor: t.colors.accentDark ?? t.colors.accent, border: `2px solid ${t.colors.accentDark ?? t.colors.accent}`, color: "#FFFFFF", boxShadow: t.shadows.glow }}>
          <Icon name="circleCheck" size={96} color="#FFFFFF" />
          Membaca dulu
        </Enter>
      </div>
    </Frame>
  );
};

// ---------- 2. Konteks: stempel dan angka besar ----------

export const KonteksScene: React.FC = () => {
  const t = useTheme();
  const { when, p } = useCue("konteks");
  const stamp = p(when("Cuma membaca"), 0.35);
  return (
    <Frame id="konteks" variant="primary">
      <Headline delay={cue(when("Namanya"))} size={76} muted>
        Claude Code Setup
      </Headline>
      <Interactive.Div
        name="Stempel"
        style={{
          alignSelf: "center",
          padding: "16px 48px",
          borderRadius: t.radius.card,
          border: `10px solid ${t.colors.groundEmphasis}`,
          color: t.colors.groundEmphasis,
          fontFamily: t.fonts.mono,
          fontWeight: 700,
          fontSize: 88,
          letterSpacing: "0.04em",
          rotate: "-4deg",
          scale: 1.9 - 0.9 * stamp,
          opacity: Math.min(1, stamp * 3),
        }}
      >
        READ-ONLY
      </Interactive.Div>
      <Enter name="Angka" delay={cue(when("tidak mengubah"))} y={50} style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 28 }}>
        <span style={{ fontFamily: t.fonts.heading, fontWeight: 800, fontSize: 260, lineHeight: 1, letterSpacing: "-0.04em", color: t.colors.groundText }}>0</span>
        <span style={{ fontFamily: t.fonts.body, fontWeight: 600, fontSize: 52, color: t.colors.groundTextMuted }}>file berubah</span>
      </Enter>
    </Frame>
  );
};

// ---------- 3. Install: terminal dengan ketikan ----------

export const InstallScene: React.FC = () => {
  const t = useTheme();
  const { when, p } = useCue("install");
  const typed = INSTALL_CMD.slice(0, Math.round(INSTALL_CMD.length * p(when("di Claude Code") - 0.4, 1.6)));
  const [head, tail = ""] = typed.split("@");
  return (
    <Frame id="install" variant="dark">
      <PointTag delay={cue(0.1)} n={1}>
        Pasang
      </PointTag>
      <Enter name="Terminal" delay={cue(when("satu perintah"))} y={60} style={{ borderRadius: t.radius.large, backgroundColor: t.code.raised, border: `2px solid ${t.code.line}`, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "22px 28px", borderBottom: `2px solid ${t.code.line}` }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ width: 22, height: 22, borderRadius: 999, backgroundColor: t.code.line }} />
          ))}
          <span style={{ marginLeft: 16, fontFamily: t.fonts.mono, fontSize: 30, color: t.code.muted }}>claude</span>
        </div>
        <div style={{ minHeight: 230, padding: "36px 36px 44px", fontFamily: t.fonts.mono, fontWeight: 600, fontSize: 38, lineHeight: 1.4, color: t.code.text }}>
          <span style={{ color: t.colors.groundEmphasis }}>&gt; </span>
          {head}
          {typed.includes("@") ? (
            <>
              <br />@{tail}
            </>
          ) : null}
          <span style={{ color: t.colors.groundEmphasis }}>_</span>
        </div>
      </Enter>
    </Frame>
  );
};

// ---------- 4. Pakai: kolom prompt dan bar pindai ----------

export const PakaiScene: React.FC = () => {
  const t = useTheme();
  const { when, p } = useCue("pakai");
  const typed = PROMPT_TEXT.slice(0, Math.round(PROMPT_TEXT.length * p(when("merekomendasikan") - 0.8, 1.6)));
  const scan = p(when("untuk proyekmu"), 1.8);
  return (
    <Frame id="pakai">
      <Headline delay={cue(0.1)} size={92}>
        Tinggal <Accent>minta</Accent>
      </Headline>
      <Enter name="Prompt" delay={cue(when("Lalu minta") + 0.2)} x={-60} y={0} style={{ display: "flex", alignItems: "center", gap: 22, padding: "30px 34px", borderRadius: 999, backgroundColor: t.code.raised, border: `2px solid ${t.code.line}`, fontFamily: t.fonts.mono, fontWeight: 600, fontSize: 31, color: t.code.text, minHeight: 60, whiteSpace: "nowrap" }}>
        <Icon name="messageCircle" size={48} color={t.colors.groundEmphasis} />
        <span>{typed}</span>
      </Enter>
      <Enter name="Pindai" delay={cue(when("untuk proyekmu") - 0.2)} y={40} style={{ display: "flex", flexDirection: "column", gap: 16, margin: "0 30px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: t.fonts.mono, fontSize: 36, color: t.colors.groundTextMuted }}>
          <span>memindai codebase</span>
          <span>{Math.round(100 * scan)}%</span>
        </div>
        <Bar value={scan} color={t.colors.primarySoft} height={44} />
      </Enter>
    </Frame>
  );
};

// ---------- 5. Hasil: grid dua kolom ----------

const KATEGORI = [
  { icon: "plug", label: "MCP server", phrase: "MCP" },
  { icon: "sparkles", label: "Skill", phrase: "skill" },
  { icon: "fileCog", label: "Hook", phrase: "hook" },
  { icon: "bot", label: "Subagent", phrase: "subagent" },
  { icon: "terminal", label: "Slash command", phrase: "slash" },
] as const;

export const HasilScene: React.FC = () => {
  const t = useTheme();
  const { when } = useCue("hasil");
  return (
    <Frame id="hasil" variant="primary">
      <Headline delay={cue(when("satu sampai dua"))} size={64} muted>
        Tiap kategori, <Accent>1-2</Accent> pilihan
      </Headline>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 }}>
        {KATEGORI.map((k, i) => (
          <Enter
            key={k.label}
            name={k.label}
            delay={cue(when(k.phrase))}
            x={i % 2 === 0 ? -50 : 50}
            y={20}
            style={{ gridColumn: i === 4 ? "1 / span 2" : undefined, display: "flex", flexDirection: "column", alignItems: "center", gap: 16, padding: "34px 16px", borderRadius: t.radius.card, backgroundColor: t.code.raised, border: `2px solid ${t.code.line}`, fontFamily: t.fonts.heading, fontWeight: 700, fontSize: 42, color: t.code.text }}
          >
            <Icon name={k.icon} size={72} color={t.code.text} />
            {k.label}
          </Enter>
        ))}
      </div>
    </Frame>
  );
};

// ---------- 6. Cta: kartu profil ----------

export const CtaScene: React.FC = () => {
  const t = useTheme();
  const { when, p } = useCue("cta");
  const done = p(when("hook yang") + 0.6, 0.3);
  const dark = t.colors.primary;
  return (
    <Frame id="cta">
      <Headline delay={cue(0.1)} size={80}>
        Pilih <Accent>hook</Accent> yang terpakai
      </Headline>
      <Enter name="Profil" delay={cue(when("Follow kalau"))} y={70} style={{ display: "flex", alignItems: "center", gap: 30, padding: "36px 40px", borderRadius: t.radius.large, backgroundColor: t.code.raised, border: `2px solid ${t.code.line}` }}>
        <div style={{ width: 120, height: 120, flexShrink: 0, borderRadius: 999, backgroundColor: dark, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="user" size={68} color="#FFFFFF" />
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6, fontFamily: t.fonts.body, color: t.code.text }}>
          <span style={{ fontWeight: 700, fontSize: 40 }}>@ganjar_hadiatna</span>
          <span style={{ fontWeight: 500, fontSize: 30, color: t.code.muted }}>Developer + AI</span>
        </div>
        <div style={{ padding: "16px 34px", borderRadius: 999, backgroundColor: done > 0.5 ? t.code.line : dark, color: done > 0.5 ? t.code.text : "#FFFFFF", fontFamily: t.fonts.heading, fontWeight: 800, fontSize: 36 }}>
          {done > 0.5 ? "Following" : "Follow"}
        </div>
      </Enter>
    </Frame>
  );
};
