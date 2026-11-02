import type React from "react";
import { Interactive } from "remotion";
import { Icon } from "../../icons";
import { useTheme } from "../../themes";
import { Enter } from "../OpenCode9Router/parts";
import { REPO_URL } from "./config";
import { Accent, Bar, Card, Chip, Frame, GithubMark, Grow, Headline, PointTag, cue, useCue } from "./parts";

// Cue ditulis sebagai frasa dari SPOKEN (config.ts); `when` mengubahnya ke detik sejak suara mulai.

// ---------- 1. Hook + masalah ----------

const REPEATS = [
  { icon: "folder", label: "Struktur proyek", phrase: "mengulang" },
  { icon: "route", label: "Keputusan kemarin", phrase: "dari awal" },
] as const;

export const HookScene: React.FC = () => {
  const t = useTheme();
  const { when, p } = useCue("hook");
  const reset = p(when("Tiap sesi"), 0.8);
  const stamp = p(when("lupa semuanya"), 0.35);
  return (
    <Frame id="hook" sweep>
      <Chip name="Tag" delay={cue(0.1)}>
        Claude Code
      </Chip>
      <Headline delay={cue(0.2)} size={112}>
        Pintar, tapi <Accent>pelupa</Accent>
      </Headline>
      <Enter name="Ingatan" delay={cue(when("Tiap sesi"))} y={40} style={{ display: "flex", flexDirection: "column", gap: 18, margin: "0 30px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: t.fonts.mono, fontSize: 38, color: t.colors.groundTextMuted }}>
          <span>ingatan</span>
          <span>{Math.round(100 * (1 - reset))}%</span>
        </div>
        <Bar value={1 - reset} color={t.colors.primarySoft} height={48} />
      </Enter>
      <Interactive.Div
        name="Stamp"
        style={{
          alignSelf: "center",
          marginTop: 8,
          padding: "10px 40px",
          borderRadius: t.radius.card,
          border: `8px solid ${t.colors.groundEmphasis}`,
          color: t.colors.groundEmphasis,
          fontFamily: t.fonts.mono,
          fontWeight: 700,
          fontSize: 64,
          letterSpacing: "0.04em",
          rotate: "-5deg",
          scale: 1.9 - 0.9 * stamp,
          opacity: Math.min(1, stamp * 3),
        }}
      >
        SESI BARU = NOL
      </Interactive.Div>
      <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 8 }}>
        {REPEATS.map((r) => (
          <Enter
            key={r.label}
            name={r.label}
            delay={cue(when(r.phrase))}
            y={30}
            style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 26px", borderRadius: 999, backgroundColor: t.code.raised, border: `2px solid ${t.code.line}`, fontFamily: t.fonts.body, fontWeight: 600, fontSize: 34, color: t.code.text }}
          >
            <Icon name={r.icon} size={38} color={t.colors.groundEmphasis} />
            {r.label}
          </Enter>
        ))}
      </div>
    </Frame>
  );
};

// ---------- 2. Repositori GitHub ----------

export const RepoScene: React.FC = () => {
  const t = useTheme();
  const { when, p } = useCue("repo");
  const stars = Math.round(110 * p(when("lebih dari seratus"), 1.4));
  return (
    <Frame id="repo">
      <Headline delay={cue(0.1)} size={70} muted>
        Repositori GitHub
      </Headline>
      <Enter
        name="Kartu repo"
        delay={cue(when("Namanya") + 0.3)}
        y={60}
        style={{ padding: "40px 40px 44px", borderRadius: t.radius.large, backgroundColor: t.code.raised, border: `2px solid ${t.code.line}`, display: "flex", flexDirection: "column", gap: 28 }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <GithubMark size={76} color={t.code.text} />
          <div style={{ flex: 1, fontFamily: t.fonts.mono, fontWeight: 700, fontSize: 52, lineHeight: 1.2, color: t.code.text }}>claude-mem</div>
          <div style={{ padding: "6px 22px", borderRadius: 999, border: `2px solid ${t.code.line}`, fontFamily: t.fonts.body, fontWeight: 600, fontSize: 28, color: t.code.muted }}>Public</div>
        </div>
        <div style={{ height: 2, backgroundColor: t.code.line }} />
        <div style={{ fontFamily: t.fonts.mono, fontWeight: 600, fontSize: 36, color: t.colors.groundEmphasis, wordBreak: "break-all" }}>{REPO_URL}</div>
      </Enter>
      <Enter name="Bintang" delay={cue(when("lebih dari seratus") - 0.3)} y={40} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 28 }}>
        <Icon name="star" size={110} color={t.colors.groundEmphasis} />
        <span style={{ fontFamily: t.fonts.heading, fontWeight: 800, fontSize: 180, lineHeight: 1, letterSpacing: "-0.04em", color: t.colors.groundText }}>{stars}k+</span>
      </Enter>
      <div style={{ display: "flex", justifyContent: "center", gap: 18 }}>
        <Enter name="Kode terbuka" delay={cue(when("Kode terbuka"))} y={30}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 30px", borderRadius: 999, backgroundColor: t.colors.groundChipBg, color: t.colors.groundChipText, fontFamily: t.fonts.heading, fontWeight: 800, fontSize: 40 }}>
            <Icon name="code" size={40} color={t.colors.groundChipText} />
            Kode terbuka
          </div>
        </Enter>
        <Enter name="Gratis" delay={cue(when("gratis"))} y={30}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 30px", borderRadius: 999, backgroundColor: t.colors.accentDark ?? t.colors.accent, color: "#FFFFFF", fontFamily: t.fonts.heading, fontWeight: 800, fontSize: 40 }}>
            <Icon name="circleCheck" size={40} color="#FFFFFF" />
            Gratis
          </div>
        </Enter>
      </div>
    </Frame>
  );
};

// ---------- 3. Mencatat sendiri ----------

const MOMENTS = ["Sesi mulai", "Kamu kirim pesan", "Sebelum pakai alat", "Sesudah pakai alat", "Berhenti", "Sesi selesai"] as const;

export const CatatScene: React.FC = () => {
  const t = useTheme();
  const { when, p } = useCue("catat");
  const start = when("Enam momen");
  const merge = p(when("diringkas"), 0.6);
  return (
    <Frame id="catat">
      <PointTag delay={cue(0.1)} n={1}>
        Mencatat sendiri
      </PointTag>
      <Headline delay={cue(start)} size={92}>
        <Accent>6</Accent> momen direkam
      </Headline>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, opacity: 1 - 0.25 * merge }}>
        {MOMENTS.map((m, i) => (
          <Enter
            key={m}
            name={m}
            delay={cue(start + 0.3 + i * 0.28)}
            y={30}
            style={{ padding: "24px 18px", textAlign: "center", borderRadius: t.radius.card, backgroundColor: t.code.raised, border: `2px solid ${t.code.line}`, fontFamily: t.fonts.body, fontWeight: 600, fontSize: 36, color: t.code.text }}
          >
            {m}
          </Enter>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "center", opacity: p(when("diringkas") - 0.2, 0.3) }}>
        <Icon name="arrowDown" size={72} color={t.colors.groundEmphasis} />
      </div>
      <Card name="Catatan" delay={cue(when("diringkas"))} icon="fileText" highlight sub="ringkasan singkat per sesi">
        Catatan pendek
      </Card>
    </Frame>
  );
};

// ---------- 4. Disimpan di komputer sendiri ----------

export const SimpanScene: React.FC = () => {
  const t = useTheme();
  const { when } = useCue("simpan");
  return (
    <Frame id="simpan">
      <PointTag delay={cue(0.1)} n={2}>
        Tersimpan lokal
      </PointTag>
      <Headline delay={cue(when("disimpan di komputer"))} size={88}>
        Di <Accent>komputer kamu</Accent>
      </Headline>
      <Card name="Kata kunci" delay={cue(when("kata kunci"))} icon="search" sub="SQLite · cari kata yang sama" x={-70}>
        Cari lewat kata kunci
      </Card>
      <Card name="Arti" delay={cue(when("atau arti"))} icon="layers" sub="Chroma · cari yang artinya mirip" x={70}>
        Cari lewat arti
      </Card>
      <Enter name="Lokasi" delay={cue(when("komputer kamu"))} y={30} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 18, fontFamily: t.fonts.mono, fontSize: 38, color: t.colors.groundTextMuted }}>
        <Icon name="folderLock" size={52} color={t.colors.groundTextMuted} />
        ~/.claude-mem
      </Enter>
    </Frame>
  );
};

// ---------- 5. Mengingat seperlunya ----------

const LAYERS = [
  { icon: "search", tool: "search", note: "daftar ringkas, ±50-100 token", phrase: "Cari daftar ringkas" },
  { icon: "clock", tool: "timeline", note: "urutan kejadian di sekitarnya", phrase: "baru buka" },
  { icon: "fileText", tool: "get_observations", note: "detail, hanya yang dipilih", phrase: "detail yang perlu" },
] as const;

export const IngatScene: React.FC = () => {
  const t = useTheme();
  const { when, p } = useCue("ingat");
  const win = p(when("sepuluh kali"), 0.8);
  return (
    <Frame id="ingat">
      <PointTag delay={cue(0.1)} n={3}>
        Paling penting
      </PointTag>
      <Headline delay={cue(when("tidak menumpahkan"))} size={78}>
        Tidak menumpahkan <Accent>semua ingatan</Accent>
      </Headline>
      {LAYERS.map((l, i) => (
        <Card key={l.tool} name={l.tool} delay={cue(when(l.phrase))} icon={l.icon} sub={l.note} highlight={i === 2}>
          <span style={{ fontFamily: t.fonts.mono, fontSize: 42 }}>
            {i + 1}. {l.tool}
          </span>
        </Card>
      ))}
      <Enter name="Hemat" delay={cue(when("Hemat token"))} y={40} style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 24 }}>
        <span style={{ fontFamily: t.fonts.heading, fontWeight: 800, fontSize: 150, lineHeight: 1, letterSpacing: "-0.04em", color: t.colors.groundEmphasis, scale: 1 + 0.06 * win }}>±10x</span>
        <span style={{ fontFamily: t.fonts.heading, fontWeight: 600, fontSize: 52, color: t.colors.groundText }}>lebih hemat token</span>
      </Enter>
    </Frame>
  );
};

// ---------- 6. Cara pasang ----------

const COMMANDS = [
  { cmd: "/plugin marketplace add thedotmack/claude-mem", phrase: "dua perintah" },
  { cmd: "/plugin install claude-mem", phrase: "di Claude Code" },
] as const;

export const PasangScene: React.FC = () => {
  const t = useTheme();
  const { when } = useCue("pasang");
  return (
    <Frame id="pasang">
      <Headline delay={cue(0.1)} size={92}>
        Pasang dalam <Accent>2 perintah</Accent>
      </Headline>
      {COMMANDS.map((c, i) => (
        <Enter
          key={c.cmd}
          name={`Perintah ${i + 1}`}
          delay={cue(when(c.phrase))}
          y={50}
          style={{ display: "flex", alignItems: "center", gap: 24, padding: "30px 34px", borderRadius: t.radius.large, backgroundColor: t.code.raised, border: `2px solid ${t.code.line}`, fontFamily: t.fonts.mono, fontWeight: 600, fontSize: 36, lineHeight: 1.3, color: t.code.text, wordBreak: "break-all" }}
        >
          <div style={{ width: 64, height: 64, flexShrink: 0, borderRadius: 999, backgroundColor: t.colors.accent, color: t.colors.onAccent, fontFamily: t.fonts.heading, fontWeight: 800, fontSize: 38, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</div>
          {c.cmd}
        </Enter>
      ))}
      <Card name="Mulai ulang" delay={cue(when("mulai ulang"))} icon="refreshCw" sub="ingatan sesi lama muncul sendiri">
        Mulai ulang Claude Code
      </Card>
    </Frame>
  );
};

// ---------- 7. Closing ----------

export const ClosingScene: React.FC = () => {
  const t = useTheme();
  const { when } = useCue("closing");
  return (
    <Frame id="closing">
      <Grow delay={cue(0.1)}>
        <Icon name="sparkles" size={110} color={t.colors.groundEmphasis} />
      </Grow>
      <Headline delay={cue(0.1)} size={88} muted name="Bukan segalanya">
        Ingatan yang bagus bukan yang menyimpan segalanya,
      </Headline>
      <Headline delay={cue(when("tapi yang tahu"))} size={104} name="Kapan">
        tapi yang tahu <Accent>kapan</Accent> harus mengingat.
      </Headline>
    </Frame>
  );
};

// ---------- 8. CTA ----------

export const CtaScene: React.FC = () => {
  const t = useTheme();
  const { when, p } = useCue("cta");
  const pulse = 1 + 0.07 * Math.sin(p(when("Follow"), 2.0) * Math.PI);
  return (
    <Frame id="cta">
      <Enter
        name="Tautan repo"
        delay={cue(0.1)}
        y={50}
        style={{ display: "flex", alignItems: "center", gap: 24, padding: "34px 36px", borderRadius: t.radius.large, backgroundColor: t.code.raised, border: `2px solid ${t.code.line}` }}
      >
        <GithubMark size={80} color={t.code.text} />
        <div style={{ fontFamily: t.fonts.mono, fontWeight: 700, fontSize: 32, lineHeight: 1.25, color: t.code.text, whiteSpace: "nowrap" }}>{REPO_URL}</div>
      </Enter>
      <Headline delay={cue(when("Follow"))} size={96}>
        Follow untuk <Accent>tools lainnya</Accent>
      </Headline>
      <Grow delay={cue(when("Follow") + 0.3)}>
        <div style={{ width: 130, height: 130, borderRadius: 999, backgroundColor: t.colors.groundChipBg, display: "flex", alignItems: "center", justifyContent: "center", scale: pulse }}>
          <Icon name="userPlus" size={76} color={t.colors.groundChipText} />
        </div>
      </Grow>
    </Frame>
  );
};
