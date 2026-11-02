import type React from "react";
import { Interactive } from "remotion";
import { Icon } from "../../icons";
import { useTheme } from "../../themes";
import { Enter } from "../OpenCode9Router/parts";
import { Accent, Card, Chip, Frame, Grow, Headline, cue, useCue } from "./parts";

// Cue ditulis sebagai frasa dari SPOKEN (config.ts); `when` mengubahnya ke detik sejak suara mulai.
// Teks di layar memakai "AI"; yang diucapkan ("Ei Ai") hanya ada di SPOKEN.

// ---------- 1. Hook ----------

const TESTS = ["login berhasil", "keranjang terhitung", "pembayaran tersimpan"] as const;

export const HookScene: React.FC = () => {
  const t = useTheme();
  const { when, p } = useCue("hook");
  const ok = t.colors.success ?? t.colors.groundEmphasis;
  const verdict = p(when("Kamu percaya"), 0.5);
  return (
    <Frame id="hook" sweep>
      <Chip name="Tag" delay={cue(0.1)}>
        Kode dari AI
      </Chip>
      <Headline delay={cue(0.2)} size={112}>
        Tes hijau, kodenya <Accent>benar?</Accent>
      </Headline>
      <Enter
        name="Hasil tes"
        delay={cue(when("semua tes hijau"))}
        y={50}
        style={{ padding: "34px 40px", borderRadius: t.radius.large, backgroundColor: t.code.raised, border: `2px solid ${t.code.line}`, display: "flex", flexDirection: "column", gap: 22 }}
      >
        {TESTS.map((name, i) => (
          <div key={name} style={{ display: "flex", alignItems: "center", gap: 22, fontFamily: t.fonts.mono, fontWeight: 600, fontSize: 40, color: t.code.text, opacity: p(when("semua tes hijau") + 0.15 + i * 0.25, 0.3) }}>
            <Icon name="circleCheck" size={52} color={ok} />
            {name}
          </div>
        ))}
        <div style={{ height: 2, backgroundColor: t.code.line }} />
        <div style={{ fontFamily: t.fonts.mono, fontWeight: 700, fontSize: 44, color: ok }}>3 passed, 0 failed</div>
      </Enter>
      <Interactive.Div
        name="Tanya"
        style={{ textAlign: "center", fontFamily: t.fonts.heading, fontWeight: 800, fontSize: 96, color: t.colors.groundText, opacity: verdict, scale: 1.3 - 0.3 * verdict }}
      >
        Percaya?
      </Interactive.Div>
    </Frame>
  );
};

// ---------- 2. Relate ----------

export const RelateScene: React.FC = () => {
  const { when } = useCue("relate");
  return (
    <Frame id="relate">
      <Headline delay={cue(0.1)} size={86} muted>
        Rasanya <Accent>aman</Accent>
      </Headline>
      <Card name="Minta fitur" delay={cue(when("Kamu minta"))} icon="bot" sub="AI menulis fiturnya">
        Kamu minta, AI mengerjakan
      </Card>
      <Card name="Tes lolos" delay={cue(when("Tesnya lolos"))} icon="circleCheck" sub="semua tes hijau">
        Tesnya lolos semua
      </Card>
      <Card name="Merge" delay={cue(when("langsung merge"))} icon="arrowRight" sub="tanpa dibaca ulang">
        Kamu langsung merge
      </Card>
      <Card name="Bug" delay={cue(when("Seminggu kemudian"))} icon="triangleAlert" sub="bug muncul di produksi" highlight>
        Seminggu kemudian
      </Card>
    </Frame>
  );
};

// ---------- 3. Shift ----------

export const ShiftScene: React.FC = () => {
  const t = useTheme();
  const { when, p } = useCue("shift");
  const stamp = p(when("bukan paham masalahmu") - 0.4, 0.4);
  return (
    <Frame id="shift">
      <Headline delay={cue(0.1)} size={92}>
        Kode dan tesnya, <Accent>ditulis satu AI</Accent>
      </Headline>
      <div style={{ display: "flex", justifyContent: "center", gap: 24 }}>
        <Card name="Kode" delay={cue(when("menulis kode"))} icon="code" x={-60}>
          Kode
        </Card>
        <Card name="Tes" delay={cue(when("tesnya sekaligus"))} icon="shield" x={60}>
          Tes
        </Card>
      </div>
      <Enter name="Satu pikiran" delay={cue(when("tesnya sekaligus") + 0.4)} y={30} style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 16, fontFamily: t.fonts.mono, fontSize: 38, color: t.colors.groundTextMuted }}>
        <Icon name="repeat" size={48} color={t.colors.groundTextMuted} />
        satu asumsi yang sama
      </Enter>
      <Card name="Paham tes" delay={cue(when("Tes hijau cuma"))} icon="circleX" sub="bukan paham masalahmu" highlight>
        Hijau = paham tesnya
      </Card>
      <Interactive.Div
        name="Stempel"
        style={{
          alignSelf: "center",
          padding: "10px 40px",
          borderRadius: t.radius.card,
          border: `8px solid ${t.colors.groundEmphasis}`,
          color: t.colors.groundEmphasis,
          fontFamily: t.fonts.mono,
          fontWeight: 700,
          fontSize: 56,
          letterSpacing: "0.04em",
          rotate: "-4deg",
          scale: 1.8 - 0.8 * stamp,
          opacity: Math.min(1, stamp * 3),
        }}
      >
        MENGUJI DIRI SENDIRI
      </Interactive.Div>
    </Frame>
  );
};

// ---------- 4. Urgency ----------

export const UrgencyScene: React.FC = () => {
  const t = useTheme();
  const { when, p } = useCue("urgency");
  const lock = p(when("Ada satu pertanyaan"), 0.6);
  return (
    <Frame id="urgency">
      <Headline delay={cue(0.1)} size={104}>
        Ini baru <Accent>bagian pertama</Accent>
      </Headline>
      <Grow delay={cue(when("Ada satu pertanyaan"))}>
        <div style={{ width: 200, height: 200, borderRadius: 999, backgroundColor: t.colors.groundChipBg, display: "flex", alignItems: "center", justifyContent: "center", scale: 1 + 0.05 * Math.sin(lock * Math.PI) }}>
          <Icon name="lock" size={110} color={t.colors.groundChipText} />
        </div>
      </Grow>
      <Card name="Pertanyaan" delay={cue(when("Ada satu pertanyaan"))} icon="search" sub="sebelum menekan merge" dim>
        Satu pertanyaan tajam
      </Card>
      <Headline delay={cue(when("sebelum menekan"))} size={64} muted name="Dikunci">
        belum kubuka
      </Headline>
    </Frame>
  );
};

// ---------- 5. Closing ----------

export const ClosingScene: React.FC = () => {
  const t = useTheme();
  const { when } = useCue("closing");
  return (
    <Frame id="closing">
      <Grow delay={cue(0.1)}>
        <Icon name="eye" size={110} color={t.colors.groundEmphasis} />
      </Grow>
      <Headline delay={cue(0.1)} size={88} name="Niat">
        Review kode itu soal niat, bukan sintaks.
      </Headline>
      <Headline delay={cue(when("Tes hijau bukan"))} size={100} name="Lolos">
        Hijau bukan bukti <Accent>benar</Accent>, cuma bukti lolos.
      </Headline>
    </Frame>
  );
};

// ---------- 6. CTA ----------

export const CtaScene: React.FC = () => {
  const t = useTheme();
  const { when, p } = useCue("cta");
  const pulse = 1 + 0.07 * Math.sin(p(when("Follow"), 2.0) * Math.PI);
  return (
    <Frame id="cta">
      <Headline delay={cue(0.1)} size={84} muted name="Pertanyaan">
        Pertanyaan sebelum merge kode dari AI
      </Headline>
      <Headline delay={cue(when("Follow"))} size={104}>
        Follow untuk <Accent>jawabannya</Accent>
      </Headline>
      <Grow delay={cue(when("Follow") + 0.3)}>
        <div style={{ width: 130, height: 130, borderRadius: 999, backgroundColor: t.colors.groundChipBg, display: "flex", alignItems: "center", justifyContent: "center", scale: pulse }}>
          <Icon name="userPlus" size={76} color={t.colors.groundChipText} />
        </div>
      </Grow>
    </Frame>
  );
};
