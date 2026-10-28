import type React from "react";
import { interpolate } from "remotion";
import { Icon } from "../../icons";
import { useTheme } from "../../themes";
import { Enter, Pop } from "../OpenCode9Router/parts";
import { Accent, Bar, Card, Frame, Headline, cue, useCue } from "./parts";

type IconName = React.ComponentProps<typeof Icon>["name"];

// Semua waktu cue dalam detik sejak suara mulai di scene itu (dari timestamp kata ElevenLabs).

// ---------- 1. Hook ----------

export const HookScene: React.FC = () => {
  const t = useTheme();
  const { p } = useCue();
  const strike = p(2.2, 0.5);
  return (
    <Frame id="hook" sweep>
      <Enter name="Tag" delay={cue(0.1)} y={30} style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ padding: "12px 36px", borderRadius: 999, backgroundColor: t.colors.groundChipBg, color: t.colors.groundChipText, fontFamily: t.fonts.mono, fontWeight: 700, fontSize: 40 }}>
          Opus · Sonnet · Haiku
        </div>
      </Enter>
      <Headline delay={cue(0.2)} size={112}>
        Jangan pakai{" "}
        <span style={{ position: "relative", display: "inline-block", color: t.colors.groundEmphasis }}>
          satu model
          <span style={{ position: "absolute", left: -8, top: "56%", height: 12, width: `${strike * 104}%`, borderRadius: 6, backgroundColor: t.colors.danger ?? "#E5484D" }} />
        </span>{" "}
        untuk semua pekerjaan
      </Headline>
      <Enter name="Akibat" delay={cue(3.2)} y={30} style={{ textAlign: "center", fontFamily: t.fonts.body, fontWeight: 700, fontSize: 56, color: t.colors.groundTextMuted }}>
        buang <Accent>uang</Accent> dan <Accent>waktu</Accent>
      </Enter>
    </Frame>
  );
};

// ---------- 2. Relate ----------

const USES: readonly { readonly icon: IconName; readonly label: string; readonly at: number }[] = [
  { icon: "layout", label: "Merancang fitur", at: 5.2 },
  { icon: "code", label: "Menulis kode", at: 7.0 },
  { icon: "fileText", label: "Merapikan teks", at: 8.6 },
];

export const RelateScene: React.FC = () => {
  const t = useTheme();
  const { p } = useCue();
  const bill = p(11.8, 1.0);
  return (
    <Frame id="relate">
      <Enter name="Model favorit" delay={cue(0.3)} y={40} style={{ alignSelf: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24, padding: "24px 44px", borderRadius: 999, backgroundColor: t.colors.accent, color: t.colors.onAccent, fontFamily: t.fonts.heading, fontWeight: 800, fontSize: 56, boxShadow: t.shadows.glow }}>
          <Icon name="sparkles" size={60} color={t.colors.onAccent} /> Satu model favorit
        </div>
      </Enter>
      {USES.map((u) => (
        <Card key={u.label} name={u.label} delay={cue(u.at)} icon={u.icon}>
          {u.label}
        </Card>
      ))}
      <Enter name="Tagihan" delay={cue(10.6)} y={40} style={{ padding: "26px 36px", borderRadius: t.radius.large, backgroundColor: t.code.raised, border: `2px solid ${t.code.line}`, display: "flex", flexDirection: "column", gap: 18, fontFamily: t.fonts.body, color: t.code.text }}>
        <div style={{ fontWeight: 700, fontSize: 44 }}>Tagihan</div>
        <Bar value={bill} color={t.colors.danger ?? "#E5484D"} />
      </Enter>
    </Frame>
  );
};

// ---------- 3. Tim ----------

const ROLES = [
  { name: "Opus", role: "Arsitek", at: 0.8 },
  { name: "Sonnet", role: "Pengembang", at: 1.7 },
  { name: "Haiku", role: "Operator", at: 2.5 },
] as const;

export const TeamScene: React.FC = () => {
  const t = useTheme();
  return (
    <Frame id="team">
      <Headline delay={cue(0.1)} size={96}>
        Tiga peran, <Accent>satu tim</Accent>
      </Headline>
      <div style={{ display: "flex", gap: 24, justifyContent: "center" }}>
        {ROLES.map((r) => (
          <Enter key={r.name} name={r.name} delay={cue(r.at)} y={50} style={{ flex: 1 }}>
            <div style={{ padding: "34px 12px", textAlign: "center", borderRadius: t.radius.large, backgroundColor: t.code.raised, border: `2px solid ${t.code.line}`, fontFamily: t.fonts.heading }}>
              <div style={{ fontWeight: 800, fontSize: 50, color: t.code.text }}>{r.name}</div>
              <div style={{ marginTop: 10, fontWeight: 600, fontSize: 34, color: t.colors.groundEmphasis }}>{r.role}</div>
            </div>
          </Enter>
        ))}
      </div>
    </Frame>
  );
};

// ---------- 4-6. Satu scene per peran ----------

const RoleScene: React.FC<{
  readonly id: "opus" | "sonnet" | "haiku";
  readonly name: string;
  readonly role: string;
  readonly icon: IconName;
  readonly uses: readonly { readonly label: string; readonly at: number }[];
  readonly traits: readonly { readonly label: string; readonly value: number }[];
  readonly traitAt: number;
}> = ({ id, name, role, icon, uses, traits, traitAt }) => {
  const t = useTheme();
  const { p } = useCue();
  const fill = p(traitAt, 0.8);
  return (
    <Frame id={id}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Pop delay={cue(0.1)}>
          <div style={{ display: "flex", alignItems: "center", gap: 24, padding: "16px 48px 16px 20px", borderRadius: 999, backgroundColor: t.colors.accent, color: t.colors.onAccent, boxShadow: t.shadows.glow }}>
            <div style={{ width: 96, height: 96, borderRadius: 999, backgroundColor: "rgba(255,255,255,0.55)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name={icon} size={60} color={t.colors.onAccent} />
            </div>
            <div style={{ fontFamily: t.fonts.heading, fontWeight: 800, fontSize: 56, whiteSpace: "nowrap" }}>{name} = {role}</div>
          </div>
        </Pop>
      </div>
      {uses.map((u) => (
        <Card key={u.label} name={u.label} delay={cue(u.at)} icon="check">
          {u.label}
        </Card>
      ))}
      <Enter name="Sifat" delay={cue(traitAt)} y={40} style={{ padding: "28px 36px", borderRadius: t.radius.large, backgroundColor: t.code.raised, border: `2px solid ${t.code.line}`, display: "grid", gridTemplateColumns: "230px 1fr", alignItems: "center", gap: 22, fontFamily: t.fonts.body, fontSize: 36, color: t.code.muted }}>
        {traits.map((tr) => (
          <>
            <span key={`${tr.label}-l`}>{tr.label}</span>
            <Bar key={`${tr.label}-b`} value={tr.value * fill} color={t.colors.primarySoft} />
          </>
        ))}
      </Enter>
    </Frame>
  );
};

export const OpusScene: React.FC = () => (
  <RoleScene
    id="opus"
    name="Opus"
    role="Arsitek"
    icon="ruler"
    uses={[
      { label: "Keputusan sulit diubah", at: 2.2 },
      { label: "Salah sedikit, mahal", at: 4.3 },
    ]}
    traits={[{ label: "Ketelitian", value: 0.96 }, { label: "Biaya", value: 0.9 }]}
    traitAt={5.6}
  />
);

export const SonnetScene: React.FC = () => (
  <RoleScene
    id="sonnet"
    name="Sonnet"
    role="Pengembang"
    icon="code"
    uses={[
      { label: "Implementasi", at: 5.3 },
      { label: "Perbaikan bug", at: 6.6 },
      { label: "Iterasi harian", at: 7.6 },
    ]}
    traits={[{ label: "Kualitas", value: 0.9 }, { label: "Biaya", value: 0.55 }]}
    traitAt={2.2}
  />
);

export const HaikuScene: React.FC = () => (
  <RoleScene
    id="haiku"
    name="Haiku"
    role="Operator"
    icon="refresh"
    uses={[
      { label: "Klasifikasi", at: 3.3 },
      { label: "Ringkasan singkat", at: 4.2 },
      { label: "Tugas berulang, volume besar", at: 5.3 },
    ]}
    traits={[{ label: "Kecepatan", value: 0.95 }, { label: "Biaya", value: 0.2 }]}
    traitAt={1.6}
  />
);

// ---------- 7. Kuncinya ----------

const STEPS: readonly { readonly verb: string; readonly model: string; readonly note: string; readonly at: number }[] = [
  { verb: "Rancang", model: "Opus", note: "paling teliti", at: 2.0 },
  { verb: "Kerjakan", model: "Sonnet", note: "seimbang", at: 4.2 },
  { verb: "Jalankan rutin", model: "Haiku", note: "paling efisien", at: 6.5 },
];

export const KeyScene: React.FC = () => {
  const t = useTheme();
  return (
    <Frame id="key">
      <Headline delay={cue(0.1)} size={92}>
        Kuncinya ada di <Accent>pembagiannya</Accent>
      </Headline>
      {STEPS.map((s, i) => (
        <Enter key={s.model} name={s.model} delay={cue(s.at)} x={i % 2 ? 70 : -70} y={0} style={{ display: "flex", alignItems: "center", gap: 28, padding: "28px 36px", borderRadius: t.radius.large, backgroundColor: t.code.raised, border: `2px solid ${t.code.line}` }}>
          <div style={{ width: 80, height: 80, flexShrink: 0, borderRadius: 999, backgroundColor: t.colors.accent, color: t.colors.onAccent, fontFamily: t.fonts.heading, fontWeight: 800, fontSize: 44, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</div>
          <div style={{ fontFamily: t.fonts.body, fontSize: 40, color: t.code.muted, lineHeight: 1.2 }}>
            <div style={{ fontWeight: 800, fontSize: 52, color: t.code.text }}>{s.verb}: {s.model}</div>
            {s.note}
          </div>
        </Enter>
      ))}
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
      <Headline delay={cue(0.1)} size={92} muted name="Bukan yang mahal">
        Model terbaik bukan yang paling mahal,
      </Headline>
      <Headline delay={cue(2.5)} size={104} name="Yang tepat">
        melainkan yang <Accent>ditempatkan tepat</Accent>.
      </Headline>
    </Frame>
  );
};

// ---------- 9. CTA ----------

export const CtaScene: React.FC = () => {
  const t = useTheme();
  const { p } = useCue();
  const pulse = 1 + 0.07 * Math.sin(interpolate(p(3.8, 2.0), [0, 1], [0, 1]) * Math.PI);
  return (
    <Frame id="cta">
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Pop delay={cue(4.0)}>
          <div style={{ width: 150, height: 150, borderRadius: 999, backgroundColor: t.colors.groundChipBg, display: "flex", alignItems: "center", justifyContent: "center", scale: pulse }}>
            <Icon name="bookOpenCheck" size={88} color={t.colors.groundChipText} />
          </div>
        </Pop>
      </div>
      <Headline delay={cue(0.2)} size={92}>
        Konten terakhir seri <Accent>Haiku 5.5</Accent>
      </Headline>
      <Headline delay={cue(4.1)} size={96} name="Simpan">
        <Accent>Simpan</Accent> videonya
      </Headline>
      <Headline delay={cue(5.4)} size={52} muted name="Terapkan">
        Terapkan pembagiannya di proyekmu
      </Headline>
    </Frame>
  );
};
