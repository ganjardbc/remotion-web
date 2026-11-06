import type React from "react";
import { Icon } from "../../icons";
import { useTheme } from "../../themes";
import { Enter } from "../../motion";
import { REPO_URL } from "./config";
import { Accent, Card, Chip, Frame, Grow, Headline, cue, useCue } from "./parts";

// Cue ditulis sebagai frasa dari SPOKEN (config.ts); `when` mengubahnya ke detik sejak suara mulai.
// Teks di layar memakai "AI"; yang diucapkan ("Ei Ai", "Desain Em Di") hanya ada di SPOKEN.
// Hero per scene: hook kartu kembar, relate terminal, shift diagram titik, urgency kartu file, cara langkah + terminal, closing perbandingan, cta ajakan follow.

// ---------- 1. Hook ----------

const MockPage: React.FC<{ readonly delay: number; readonly name: string; readonly x: number }> = ({ delay, name, x }) => {
  const t = useTheme();
  const line = t.code.line;
  return (
    <Enter
      name={name}
      delay={delay}
      x={x}
      y={50}
      style={{ flex: 1, padding: 22, borderRadius: t.radius.large, backgroundColor: t.code.raised, border: `2px solid ${line}`, display: "flex", flexDirection: "column", gap: 16 }}
    >
      <div style={{ height: 14, width: "45%", borderRadius: 7, backgroundColor: line }} />
      <div style={{ height: 150, borderRadius: 16, background: `linear-gradient(135deg, ${t.colors.accent2}, ${t.colors.primary})` }} />
      <div style={{ height: 14, width: "90%", borderRadius: 7, backgroundColor: line }} />
      <div style={{ height: 14, width: "70%", borderRadius: 7, backgroundColor: line }} />
      <div style={{ height: 40, width: "60%", borderRadius: 999, backgroundColor: t.colors.primary }} />
    </Enter>
  );
};

export const HookScene: React.FC = () => {
  const { when } = useCue("hook");
  return (
    <Frame id="hook" variant="ground" sweep>
      <Headline delay={cue(0.1)} size={112}>
        UI buatan AI <Accent>mirip semua</Accent>
      </Headline>
      <div style={{ display: "flex", gap: 22 }}>
        <MockPage name="Halaman 1" delay={cue(0.3)} x={-80} />
        <MockPage name="Halaman 2" delay={cue(0.5)} x={0} />
        <MockPage name="Halaman 3" delay={cue(0.7)} x={80} />
      </div>
      <Headline delay={cue(when("bukan salah modelnya") - 0.1)} size={64} muted name="Bukan salah model">
        Dan bukan salah modelnya
      </Headline>
    </Frame>
  );
};

// ---------- 2. Relate ----------

export const RelateScene: React.FC = () => {
  const t = useTheme();
  const { when, p } = useCue("relate");
  const prompt = "bikin landing page yang bagus";
  const typed = prompt.slice(0, Math.round(prompt.length * p(when("sudah minta"), 1.2)));
  return (
    <Frame id="relate" variant="primary">
      <Headline delay={cue(0.1)} size={84} muted>
        Pernah <Accent>begini</Accent>?
      </Headline>
      <Enter
        name="Terminal"
        delay={cue(when("sudah minta"))}
        y={50}
        style={{ padding: "34px 40px", borderRadius: t.radius.large, backgroundColor: t.code.raised, border: `2px solid ${t.code.line}`, fontFamily: t.fonts.mono, fontSize: 40, color: t.code.text, minHeight: 130 }}
      >
        <span style={{ color: t.code.muted }}>$ </span>
        {typed}
      </Enter>
      <Card name="Gradien" delay={cue(when("gradien ungu"))} icon="palette" sub="selalu itu lagi">
        Gradien ungu
      </Card>
      <Card name="Kartu bulat" delay={cue(when("kartu bulat"))} icon="layoutTemplate" sub="sudah terlalu sering lihat">
        Kartu bulat
      </Card>
    </Frame>
  );
};

// ---------- 3. Shift ----------

// Titik awal tersebar, lalu merapat ke tengah (rata-rata).
const DOTS = [
  [-300, -150],
  [250, -190],
  [-180, 130],
  [320, 90],
  [-30, -210],
  [120, 180],
  [-340, 20],
  [60, -60],
  [-100, -50],
] as const;

export const ShiftScene: React.FC = () => {
  const t = useTheme();
  const { when, p } = useCue("shift");
  const k = p(when("memilih rata-rata"), 1.4);
  return (
    <Frame id="shift">
      <Headline delay={cue(0.1)} size={78} muted>
        Tanpa referensi, model memilih rata-rata
      </Headline>
      <Enter name="Diagram" delay={cue(0.5)} y={40} style={{ height: 360, borderRadius: t.radius.large, backgroundColor: t.code.raised, border: `2px solid ${t.code.line}`, position: "relative", overflow: "hidden" }}>
        {DOTS.map(([dx, dy], i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `calc(50% + ${dx * (1 - k)}px - 18px)`,
              top: `calc(50% + ${dy * 0.7 * (1 - k)}px - 18px)`,
              width: 36,
              height: 36,
              borderRadius: 999,
              backgroundColor: k > 0.98 ? t.colors.primarySoft : t.code.muted,
              opacity: 0.55 + 0.45 * k,
            }}
          />
        ))}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 22, textAlign: "center", fontFamily: t.fonts.mono, fontSize: 34, color: t.code.muted, opacity: k }}>rata-rata</div>
      </Enter>
      <Card name="Kemampuan" delay={cue(when("AI tidak kekurangan"))} icon="circleCheck" sub="modelnya sudah cukup mampu">
        Kemampuan: cukup
      </Card>
      <Headline delay={cue(when("Ia kekurangan referensi") - 0.1)} size={96} name="Referensi">
        Ia kekurangan <Accent>referensi</Accent>
      </Headline>
    </Frame>
  );
};

// ---------- 4. Urgency ----------

export const UrgencyScene: React.FC = () => {
  const t = useTheme();
  const { when } = useCue("urgency");
  return (
    <Frame id="urgency" variant="primary">
      <Headline delay={cue(0.1)} size={92} muted>
        Obatnya tidak butuh tool baru
      </Headline>
      <Grow delay={cue(when("satu file teks"))}>
        <div style={{ display: "flex", alignItems: "center", gap: 28, padding: "30px 56px", borderRadius: t.radius.large, border: `6px solid ${t.colors.groundText}`, rotate: "-3deg" }}>
          <Icon name="fileText" size={110} color={t.colors.groundText} />
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.05 }}>
            <span style={{ fontFamily: t.fonts.heading, fontWeight: 800, fontSize: 120, color: t.colors.groundText }}>1 file</span>
            <span style={{ fontFamily: t.fonts.mono, fontWeight: 600, fontSize: 40, color: t.colors.groundTextMuted }}>DESIGN.md</span>
          </div>
        </div>
      </Grow>
      <Headline delay={cue(when("satu file teks"))} size={104} name="Satu file">
        Cuma <Accent>satu file teks</Accent>
      </Headline>
    </Frame>
  );
};

// ---------- 5. Cara ----------

const CHECKS = ["warna", "huruf", "aturan komponen"] as const;

export const CaraScene: React.FC = () => {
  const t = useTheme();
  const { when, p } = useCue("cara");
  return (
    <Frame id="cara" variant="dark">
      <Headline delay={cue(0.1)} size={84}>
        Satu file, <Accent>tiga langkah</Accent>
      </Headline>
      <Card name="Pilih" delay={cue(when("Pilih satu"))} icon="folder" sub={REPO_URL}>
        1. Pilih satu DESIGN.md
      </Card>
      <Card name="Salin" delay={cue(when("salin ke root"))} icon="fileText" sub="proyek-kamu/DESIGN.md">
        2. Salin ke root proyek
      </Card>
      <Enter
        name="Prompt agent"
        delay={cue(when("minta agent"))}
        y={50}
        style={{ padding: "30px 36px", borderRadius: t.radius.large, backgroundColor: t.code.raised, border: `2px solid ${t.code.line}`, display: "flex", flexDirection: "column", gap: 14 }}
      >
        <div style={{ fontFamily: t.fonts.mono, fontSize: 36, color: t.code.text }}>
          <span style={{ color: t.code.muted }}>3. $ </span>bangun halaman dari DESIGN.md
        </div>
        {CHECKS.map((c, i) => (
          <div key={c} style={{ display: "flex", alignItems: "center", gap: 16, fontFamily: t.fonts.body, fontWeight: 600, fontSize: 38, color: t.code.text, opacity: p(when("warna, huruf") + i * 0.5, 0.3) }}>
            <Icon name="circleCheck" size={44} color={t.colors.primarySoft} />
            {c}
          </div>
        ))}
      </Enter>
    </Frame>
  );
};

// ---------- 6. Closing ----------

export const ClosingScene: React.FC = () => {
  const t = useTheme();
  const { when } = useCue("closing");
  return (
    <Frame id="closing">
      <Grow delay={cue(0.1)}>
        <Icon name="sparkles" size={110} color={t.colors.groundText} />
      </Grow>
      <Headline delay={cue(0.1)} size={88} muted name="Prompt">
        Prompt itu perintah.
      </Headline>
      <Headline delay={cue(when("DESIGN.md itu"))} size={100} name="Selera">
        DESIGN.md itu selera yang <Accent>bisa dibaca</Accent>.
      </Headline>
    </Frame>
  );
};

// ---------- 7. CTA ----------

export const CtaScene: React.FC = () => {
  const t = useTheme();
  const { when, p } = useCue("cta");
  const pulse = 1 + 0.07 * Math.sin(p(when("Follow"), 2.0) * Math.PI);
  return (
    <Frame id="cta" variant="primary">
      <Headline delay={cue(0.1)} size={84} muted name="Sesuai seleramu">
        AI yang bekerja sesuai seleramu
      </Headline>
      <Headline delay={cue(when("bukan selera"))} size={100} name="Bukan rata-rata">
        Bukan selera <Accent>rata-ratanya</Accent>
      </Headline>
      <Grow delay={cue(when("Follow") + 0.3)}>
        <div style={{ width: 130, height: 130, borderRadius: 999, backgroundColor: t.colors.groundChipBg, display: "flex", alignItems: "center", justifyContent: "center", scale: pulse }}>
          <Icon name="userPlus" size={76} color={t.colors.groundChipText} />
        </div>
      </Grow>
      <Chip name="Handle" delay={cue(when("Follow") + 0.5)}>
        @ganjar_hadiatna
      </Chip>
    </Frame>
  );
};
