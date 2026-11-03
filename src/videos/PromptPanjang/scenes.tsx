import type React from "react";
import { Icon } from "../../icons";
import { useTheme } from "../../themes";
import { Enter } from "../../motion";
import { Accent, Bar, Card, Chip, Frame, Grow, Headline, cue, useCue } from "./parts";

// Cue ditulis sebagai frasa dari SPOKEN (config.ts); `when` mengubahnya ke detik sejak suara mulai.
// Teks di layar memakai "AI"; yang diucapkan ("Ei Ai") hanya ada di SPOKEN.

// ---------- 1. Hook ----------

const LINE_WIDTHS = [1, 0.92, 1, 0.8, 0.96, 1, 0.7] as const;

export const HookScene: React.FC = () => {
  const t = useTheme();
  const { when, p } = useCue("hook");
  const grow = p(when("lima ratus"), 1.4);
  return (
    <Frame id="hook" sweep>
      <Chip name="Tag" delay={cue(0.1)}>
        Prompt
      </Chip>
      <Headline delay={cue(0.2)} size={108}>
        Prompt 500 kata, <Accent>bukan skill</Accent>
      </Headline>
      <Enter
        name="Dinding teks"
        delay={cue(when("lima ratus") - 0.2)}
        y={50}
        style={{ padding: "34px 40px", borderRadius: t.radius.large, backgroundColor: t.code.raised, border: `2px solid ${t.code.line}`, display: "flex", flexDirection: "column", gap: 20 }}
      >
        {LINE_WIDTHS.map((w, i) => (
          <div key={i} style={{ width: `${w * 100}%`, height: 18, borderRadius: 9, backgroundColor: t.code.line, opacity: p(when("lima ratus") + i * 0.12, 0.3) }} />
        ))}
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "flex-end", gap: 16 }}>
          <span style={{ fontFamily: t.fonts.heading, fontWeight: 800, fontSize: 120, lineHeight: 1, letterSpacing: "-0.04em", color: t.code.text }}>{Math.round(500 * grow)}</span>
          <span style={{ fontFamily: t.fonts.mono, fontWeight: 600, fontSize: 40, color: t.code.muted }}>kata</span>
        </div>
      </Enter>
      <Card name="Malas" delay={cue(when("Itu tanda"))} icon="batteryLow" sub="kamu belum selesai berpikir" highlight>
        Tanda malas berpikir
      </Card>
    </Frame>
  );
};

// ---------- 2. Relate ----------

export const RelateScene: React.FC = () => {
  const { when } = useCue("relate");
  return (
    <Frame id="relate">
      <Headline delay={cue(0.1)} size={86} muted>
        Pernah <Accent>begini</Accent>?
      </Headline>
      <Card name="Prompt panjang" delay={cue(when("Kamu tulis"))} icon="fileText" sub="hasilnya melenceng">
        Tulis prompt panjang
      </Card>
      <Card name="Tambah aturan" delay={cue(when("Kamu tambah"))} icon="repeat" sub="tetap melenceng">
        Tambah aturan lagi
      </Card>
      <Card name="Salahkan AI" delay={cue(when("Lalu kamu"))} icon="triangleAlert" sub="padahal yang kabur bukan AI" highlight>
        Lalu menyalahkan AI
      </Card>
    </Frame>
  );
};

// ---------- 3. Shift ----------

export const ShiftScene: React.FC = () => {
  const { when } = useCue("shift");
  return (
    <Frame id="shift">
      <Headline delay={cue(0.1)} size={92}>
        Panjang menutupi <Accent>pikiran yang kabur</Accent>
      </Headline>
      <Card name="Prompt rapi" delay={cue(when("Prompt panjang"))} icon="fileText" sub="terlihat rapi dan lengkap">
        Prompt 500 kata
      </Card>
      <Card name="Pikiran kabur" delay={cue(when("menyembunyikan"))} icon="eyeOff" sub="tersembunyi di dalamnya" highlight>
        Pikiran belum jernih
      </Card>
      <Card name="AI menebak" delay={cue(when("tidak bisa menebak"))} icon="bot" sub="yang belum kamu tahu" dim>
        AI cuma menebak
      </Card>
    </Frame>
  );
};

// ---------- 4. Urgency ----------

export const UrgencyScene: React.FC = () => {
  const t = useTheme();
  const { when, p } = useCue("urgency");
  const fill = 0.5 + 0.5 * p(when("Bagian kedua"), 0.8);
  return (
    <Frame id="urgency">
      <Headline delay={cue(0.1)} size={104}>
        Ini baru <Accent>bagian pertama</Accent>
      </Headline>
      <Enter name="Progres" delay={cue(0.4)} y={40} style={{ display: "flex", flexDirection: "column", gap: 18, margin: "0 30px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: t.fonts.mono, fontSize: 38, color: t.colors.groundTextMuted }}>
          <span>bagian</span>
          <span>{fill < 0.99 ? "1 / 2" : "2 / 2"}</span>
        </div>
        <Bar value={fill} color={t.colors.primarySoft} height={48} />
      </Enter>
      <Card name="Bagian kedua" delay={cue(when("Bagian kedua"))} icon="sparkles" sub="pendek tapi tajam" highlight>
        Bagian kedua: prompt pendek
      </Card>
    </Frame>
  );
};

// ---------- 5. Cara: bagian kedua ----------

export const CaraScene: React.FC = () => {
  const { when } = useCue("cara");
  return (
    <Frame id="cara">
      <Headline delay={cue(0.1)} size={92}>
        Tulis masalahnya dalam <Accent>2 kalimat</Accent>
      </Headline>
      <Card name="Kalimat 1" delay={cue(when("apa yang kamu mau"))} icon="circleCheck" sub="hasil yang kamu inginkan">
        1. Apa yang kamu mau
      </Card>
      <Card name="Kalimat 2" delay={cue(when("apa yang tidak"))} icon="ban" sub="batas yang tidak boleh dilanggar">
        2. Yang tidak boleh terjadi
      </Card>
      <Card name="Sulit menulis" delay={cue(when("Kalau sulit"))} icon="search" sub="masalahnya yang belum jelas, bukan promptnya" highlight>
        Sulit menulisnya?
      </Card>
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
        <Icon name="sparkles" size={110} color={t.colors.groundEmphasis} />
      </Grow>
      <Headline delay={cue(0.1)} size={88} muted name="Bukan panjang">
        Prompt yang bagus bukan yang paling panjang,
      </Headline>
      <Headline delay={cue(when("tapi yang"))} size={104} name="Jelas">
        tapi yang paling <Accent>jelas</Accent>.
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
    <Frame id="cta">
      <Headline delay={cue(0.1)} size={84} muted name="Cara berpikir">
        Berpikir jernih sebelum menyentuh AI
      </Headline>
      <Headline delay={cue(when("Follow"))} size={104}>
        Follow untuk <Accent>cara berpikirnya</Accent>
      </Headline>
      <Grow delay={cue(when("Follow") + 0.3)}>
        <div style={{ width: 130, height: 130, borderRadius: 999, backgroundColor: t.colors.groundChipBg, display: "flex", alignItems: "center", justifyContent: "center", scale: pulse }}>
          <Icon name="userPlus" size={76} color={t.colors.groundChipText} />
        </div>
      </Grow>
    </Frame>
  );
};
