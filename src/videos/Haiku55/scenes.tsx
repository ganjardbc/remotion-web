import type React from "react";
import { Interactive, interpolate } from "remotion";
import { Icon } from "../../icons";
import { useTheme } from "../../themes";
import { Enter, Pop } from "../OpenCode9Router/parts";
import { Accent, Bar, Card, Frame, Headline, PointTag, cue, useCue } from "./parts";

// Semua waktu cue dalam detik sejak suara mulai di scene itu (dari transkrip kata voiceover).

// ---------- 1. Hook ----------

export const HookScene: React.FC = () => {
  const t = useTheme();
  const { p } = useCue();
  const strike = p(3.0, 0.4);
  const stamp = p(4.7, 0.35);
  return (
    <Frame id="hook" sweep>
      <Enter name="Tag" delay={cue(0.1)} y={30} style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ padding: "12px 36px", borderRadius: 999, backgroundColor: t.colors.groundChipBg, color: t.colors.groundChipText, fontFamily: t.fonts.mono, fontWeight: 700, fontSize: 40 }}>
          Claude Haiku 5.5
        </div>
      </Enter>
      <Headline delay={cue(0.2)} size={118}>
        Haiku itu model{" "}
        <span style={{ position: "relative", display: "inline-block", color: t.colors.groundEmphasis }}>
          kelas dua
          <span
            style={{
              position: "absolute",
              left: -8,
              top: "54%",
              height: 12,
              width: `${strike * 104}%`,
              borderRadius: 6,
              backgroundColor: t.colors.danger ?? "#E5484D",
            }}
          />
        </span>
        ?
      </Headline>
      <Interactive.Div
        name="Stamp"
        style={{
          alignSelf: "center",
          marginTop: 24,
          padding: "10px 40px",
          borderRadius: t.radius.card,
          border: `8px solid ${t.colors.groundEmphasis}`,
          color: t.colors.groundEmphasis,
          fontFamily: t.fonts.mono,
          fontWeight: 700,
          fontSize: 72,
          letterSpacing: "0.06em",
          rotate: "-6deg",
          scale: 1.9 - 0.9 * stamp,
          opacity: Math.min(1, stamp * 3),
        }}
      >
        SALAH BESAR
      </Interactive.Div>
    </Frame>
  );
};

// ---------- 2. Relate ----------

const ModelRow: React.FC<{
  readonly name: string;
  readonly delay: number;
  readonly label: string;
  readonly bill: number;
  readonly result: number;
  readonly hot?: boolean;
}> = ({ name, delay, label, bill, result, hot }) => {
  const t = useTheme();
  return (
    <Enter
      name={name}
      delay={delay}
      y={50}
      style={{
        padding: "32px 40px",
        borderRadius: t.radius.large,
        backgroundColor: t.code.raised,
        border: `2px solid ${t.code.line}`,
        display: "flex",
        flexDirection: "column",
        gap: 22,
        fontFamily: t.fonts.body,
        color: t.code.text,
      }}
    >
      <div style={{ fontWeight: 700, fontSize: 48 }}>{label}</div>
      <div style={{ display: "grid", gridTemplateColumns: "230px 1fr", alignItems: "center", gap: 22, fontSize: 36, color: t.code.muted }}>
        <span>Tagihan</span>
        <Bar value={bill} color={hot ? (t.colors.danger ?? "#E5484D") : (t.colors.success ?? "#1A9C6B")} />
        <span>Hasil</span>
        <Bar value={result} color={t.colors.primarySoft} />
      </div>
    </Enter>
  );
};

export const RelateScene: React.FC = () => {
  const t = useTheme();
  const { p } = useCue();
  // Tagihan naik saat "tagihannya naik" (5.1 dtk); hasil sejajar saat "tidak jauh beda" (7.8 dtk).
  const bill = p(5.0, 0.7);
  const result = p(7.4, 0.7);
  return (
    <Frame id="relate">
      <Headline delay={cue(0.1)} size={84}>
        Rilis baru, refleks pakai <Accent>yang paling pintar</Accent>
      </Headline>
      <ModelRow name="Model paling pintar" delay={cue(2.9)} label="Model paling pintar" bill={bill} result={interpolate(result, [0, 1], [0, 0.92])} hot />
      <ModelRow name="Model pas" delay={cue(3.6)} label="Model yang pas" bill={bill * 0.24} result={interpolate(result, [0, 1], [0, 0.88])} />
      <Enter name="Catatan" delay={cue(7.6)} y={20} style={{ textAlign: "center", fontFamily: t.fonts.mono, fontSize: 32, color: t.colors.groundTextMuted }}>
        ilustrasi, tugas kecil
      </Enter>
    </Frame>
  );
};

// ---------- 3. Rilis ----------

export const IntroScene: React.FC = () => {
  const t = useTheme();
  const { p } = useCue();
  const swap = p(3.0, 0.5);
  return (
    <Frame id="intro">
      <Headline delay={cue(0.1)} size={92}>
        Rilis <Accent>7 Oktober</Accent>
      </Headline>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 36 }}>
        <Enter
          name="Haiku 4.5"
          delay={cue(0.6)}
          x={-80}
          y={0}
          style={{
            padding: "30px 44px",
            borderRadius: t.radius.large,
            backgroundColor: t.code.raised,
            border: `2px solid ${t.code.line}`,
            fontFamily: t.fonts.heading,
            fontWeight: 700,
            fontSize: 58,
            color: t.code.muted,
            opacity: interpolate(swap, [0, 1], [1, 0.45]),
            textDecoration: swap > 0.5 ? "line-through" : "none",
          }}
        >
          Haiku 4.5
        </Enter>
        <div style={{ opacity: p(2.8, 0.3) }}>
          <Icon name="arrowRight" size={76} color={t.colors.groundEmphasis} />
        </div>
        <Enter
          name="Haiku 5.5"
          delay={cue(1.2)}
          x={80}
          y={0}
          style={{
            padding: "30px 44px",
            borderRadius: t.radius.large,
            backgroundColor: t.colors.accent,
            boxShadow: t.shadows.glow,
            fontFamily: t.fonts.heading,
            fontWeight: 800,
            fontSize: 58,
            color: t.colors.onAccent,
            scale: 1 + 0.08 * swap,
          }}
        >
          Haiku 5.5
        </Enter>
      </div>
      <Enter name="Pengganti" delay={cue(3.0)} y={30} style={{ textAlign: "center", fontFamily: t.fonts.body, fontWeight: 600, fontSize: 50, color: t.colors.groundTextMuted }}>
        menggantikan Haiku 4.5
      </Enter>
    </Frame>
  );
};

// ---------- 4. Paling cepat ----------

export const FastScene: React.FC = () => {
  const t = useTheme();
  const { p } = useCue();
  // Angka naik selama "dua ratus tiga puluh tujuh" (5.6 sampai 7.6 dtk).
  const count = Math.round(237 * p(5.6, 2.0));
  const race = p(8.4, 0.9);
  return (
    <Frame id="fast">
      <PointTag delay={cue(0.1)} n={1}>
        Paling cepat
      </PointTag>
      <Headline delay={cue(2.1)} size={74} muted>
        di keluarga Claude 5.5
      </Headline>
      <Enter name="Kecepatan" delay={cue(5.4)} y={40} style={{ textAlign: "center" }}>
        <div style={{ fontFamily: t.fonts.heading, fontWeight: 800, fontSize: 250, lineHeight: 1, letterSpacing: "-0.04em", color: t.colors.groundEmphasis }}>
          {count}
        </div>
        <div style={{ fontFamily: t.fonts.mono, fontSize: 50, color: t.colors.groundTextMuted }}>token / detik</div>
      </Enter>
      <Enter name="Perbandingan" delay={cue(8.3)} y={40} style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 20 }}>
        <div style={{ display: "grid", gridTemplateColumns: "250px 1fr", alignItems: "center", gap: 22, fontFamily: t.fonts.body, fontWeight: 600, fontSize: 38, color: t.code.text }}>
          <span>Haiku 5.5</span>
          <Bar value={race} color={t.colors.accent} height={52} />
          <span style={{ color: t.code.muted }}>Sonnet 5.5</span>
          <Bar value={race * 0.52} color={t.colors.primarySoft} height={52} />
        </div>
      </Enter>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Pop delay={cue(9.2)}>
          <div style={{ padding: "8px 40px", borderRadius: 999, backgroundColor: t.colors.groundChipBg, color: t.colors.groundChipText, fontFamily: t.fonts.heading, fontWeight: 800, fontSize: 56 }}>
            hampir 2x lebih cepat
          </div>
        </Pop>
      </div>
    </Frame>
  );
};

// ---------- 5. Konteks ----------

const Stat: React.FC<{
  readonly name: string;
  readonly delay: number;
  readonly big: string;
  readonly label: string;
  readonly share: number;
  readonly fill: number;
  readonly color: string;
}> = ({ name, delay, big, label, share, fill, color }) => {
  const t = useTheme();
  return (
    <Enter
      name={name}
      delay={delay}
      y={50}
      style={{ padding: "36px 44px", borderRadius: t.radius.large, backgroundColor: t.code.raised, border: `2px solid ${t.code.line}`, display: "flex", flexDirection: "column", gap: 24 }}
    >
      <div style={{ display: "flex", alignItems: "baseline", gap: 24, fontFamily: t.fonts.heading }}>
        <span style={{ fontWeight: 800, fontSize: 124, lineHeight: 1, letterSpacing: "-0.04em", whiteSpace: "nowrap", color }}>{big}</span>
        <span style={{ fontWeight: 600, fontSize: 50, color: t.code.text }}>{label}</span>
      </div>
      <div style={{ height: 36, borderRadius: 18, backgroundColor: t.code.line, overflow: "hidden" }}>
        <div style={{ width: `${share * fill * 100}%`, height: "100%", borderRadius: 18, backgroundColor: color }} />
      </div>
    </Enter>
  );
};

export const ContextScene: React.FC = () => {
  const t = useTheme();
  const { p } = useCue();
  return (
    <Frame id="context">
      <PointTag delay={cue(0.1)} n={2}>
        Konteks besar
      </PointTag>
      <Stat name="Input" delay={cue(2.0)} big="1 juta" label="token input" share={1} fill={p(2.3, 0.9)} color={t.colors.groundEmphasis} />
      <Stat name="Output" delay={cue(4.0)} big="128 ribu" label="token output" share={0.128} fill={p(4.7, 0.9)} color={t.colors.primarySoft} />
      <Headline delay={cue(7.6)} size={68} name="Penutup">
        Bukan model kecil yang <Accent>kepepet</Accent>
      </Headline>
    </Frame>
  );
};

// ---------- 6. Volume tinggi ----------

const TASKS = [
  { icon: "layers", label: "Klasifikasi", at: 4.6 },
  { icon: "fileText", label: "Ringkasan singkat", at: 5.85 },
  { icon: "shield", label: "Validasi input", at: 7.1 },
  { icon: "route", label: "Routing request", at: 8.35 },
] as const;

export const VolumeScene: React.FC = () => {
  const t = useTheme();
  const { p } = useCue();
  const win = p(12.6, 0.6);
  return (
    <Frame id="volume">
      <PointTag delay={cue(0.1)} n={3}>
        Paling penting
      </PointTag>
      <Headline delay={cue(2.8)} size={92}>
        Dibuat untuk <Accent>volume tinggi</Accent>
      </Headline>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {TASKS.map((task) => (
          <Card key={task.label} name={task.label} delay={cue(task.at)} icon={task.icon}>
            <span style={{ fontSize: 40 }}>{task.label}</span>
          </Card>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 28, marginTop: 8 }}>
        <Enter name="Kecepatan dan biaya" delay={cue(10.6)} y={40} style={{ flex: 1.25 }}>
          <div
            style={{
              padding: "26px 28px",
              textAlign: "center",
              borderRadius: t.radius.large,
              backgroundColor: t.colors.accent,
              color: t.colors.onAccent,
              fontFamily: t.fonts.heading,
              fontWeight: 800,
              fontSize: 44,
              lineHeight: 1.15,
              scale: 1 + 0.05 * win,
              boxShadow: t.shadows.glow,
            }}
          >
            Kecepatan + biaya per panggilan
          </div>
        </Enter>
        <div style={{ opacity: p(12.5, 0.3), fontFamily: t.fonts.mono, fontWeight: 700, fontSize: 64, color: t.colors.groundText }}>{">"}</div>
        <Enter name="Kepintaran maksimal" delay={cue(13.0)} y={40} style={{ flex: 1 }}>
          <div
            style={{
              padding: "26px 24px",
              textAlign: "center",
              borderRadius: t.radius.large,
              backgroundColor: t.code.raised,
              border: `2px solid ${t.code.line}`,
              color: t.code.muted,
              fontFamily: t.fonts.heading,
              fontWeight: 600,
              fontSize: 40,
              lineHeight: 1.15,
            }}
          >
            Kepintaran maksimal
          </div>
        </Enter>
      </div>
    </Frame>
  );
};

// ---------- 7. Baru setengah cerita ----------

export const TeaserScene: React.FC = () => {
  const t = useTheme();
  const { p } = useCue();
  const half = p(1.0, 1.0);
  const focus = p(5.4, 0.6);
  return (
    <Frame id="teaser">
      <Headline delay={cue(0.1)} size={104}>
        Baru <Accent>setengah</Accent> cerita
      </Headline>
      <Enter name="Progres" delay={cue(0.9)} y={30} style={{ margin: "0 40px" }}>
        <Bar value={0.5 * half} color={t.colors.accent} height={40} />
      </Enter>
      <Card name="Skor benchmark" delay={cue(3.1)} icon="search" dim={focus > 0.4} x={-70}>
        Skor benchmark
      </Card>
      <Card name="Desain sistem" delay={cue(5.0)} icon="layers" highlight x={70}>
        Desain sistem kamu
      </Card>
      <Enter name="Catatan" delay={cue(5.9)} y={30} style={{ textAlign: "center", fontFamily: t.fonts.body, fontWeight: 600, fontSize: 46, color: t.colors.groundTextMuted }}>
        bagian yang paling <Accent>menentukan</Accent>
      </Enter>
    </Frame>
  );
};

// ---------- 8. Closing ----------

export const ClosingScene: React.FC = () => {
  const t = useTheme();
  return (
    <Frame id="closing">
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Pop delay={cue(0.1)}>
          <Icon name="sparkles" size={110} color={t.colors.groundEmphasis} />
        </Pop>
      </div>
      <Headline delay={cue(0.1)} size={92} muted name="Bukan yang pintar">
        Model terbaik bukan yang paling pintar,
      </Headline>
      <Headline delay={cue(2.4)} size={108} name="Yang pas">
        tapi yang paling <Accent>pas</Accent> dengan pekerjaannya.
      </Headline>
    </Frame>
  );
};

// ---------- 9. CTA ----------

const TIERS = [
  { name: "Opus", at: 4.2 },
  { name: "Sonnet", at: 5.1 },
  { name: "Haiku", at: 5.7 },
] as const;

export const CtaScene: React.FC = () => {
  const t = useTheme();
  const { p } = useCue();
  const pulse = 1 + 0.07 * Math.sin(p(0.3, 2.0) * Math.PI);
  return (
    <Frame id="cta">
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Pop delay={cue(0.1)}>
          <div style={{ width: 150, height: 150, borderRadius: 999, backgroundColor: t.colors.groundChipBg, display: "flex", alignItems: "center", justifyContent: "center", scale: pulse }}>
            <Icon name="userPlus" size={88} color={t.colors.groundChipText} />
          </div>
        </Pop>
      </div>
      <Headline delay={cue(0.2)} size={96}>
        Follow untuk <Accent>bagian kedua</Accent>
      </Headline>
      <Headline delay={cue(2.5)} size={52} muted name="Isi bagian kedua">
        Pembagian kerja dalam satu sistem
      </Headline>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 24, marginTop: 12 }}>
        {TIERS.map((tier, i) => (
          <div key={tier.name} style={{ display: "flex", alignItems: "center", gap: 24 }}>
            {i > 0 ? <span style={{ fontFamily: t.fonts.mono, fontWeight: 700, fontSize: 56, color: t.colors.groundEmphasis, opacity: p(tier.at, 0.3) }}>+</span> : null}
            <Enter
              name={tier.name}
              delay={cue(tier.at)}
              y={40}
              style={{
                padding: "26px 38px",
                borderRadius: t.radius.large,
                backgroundColor: tier.name === "Haiku" ? t.colors.accent : t.code.raised,
                border: `2px solid ${tier.name === "Haiku" ? t.colors.accent : t.code.line}`,
                color: tier.name === "Haiku" ? t.colors.onAccent : t.code.text,
                fontFamily: t.fonts.heading,
                fontWeight: 800,
                fontSize: 52,
              }}
            >
              {tier.name}
            </Enter>
          </div>
        ))}
      </div>
    </Frame>
  );
};
