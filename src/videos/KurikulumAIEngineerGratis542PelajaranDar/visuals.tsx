import type React from "react";
import { Interactive } from "remotion";
import { Icon } from "../../icons";
import { useTheme } from "../../themes";
import { Enter, Pop, shakeX } from "../OpenCode9Router/parts";
import { when } from "./config";
import { Accent, Bar, Card, Frame, GithubMark, Headline, PhaseGrid, PointTag, cue, useCue } from "./parts";

// Semua waktu cue dalam detik sejak suara mulai di scene itu, diperkirakan dari posisi frasa di teks ucapan (when()).

const bob = (frame: number, phase: number, amp: number): number => Math.sin(frame / 12 + phase) * amp;

// ---------- 1. Hook ----------

const TABS = ["Tutorial", "Roadmap", "Kursus berbayar", "Thread viral", "Video 10 jam"] as const;
const QUESTIONS = [
  { left: "2%", top: -34, size: 96, phase: 0 },
  { left: "88%", top: 10, size: 120, phase: 2 },
  { left: "0%", top: 200, size: 72, phase: 4 },
] as const;

export const HookScene: React.FC = () => {
  const t = useTheme();
  const { frame, p } = useCue();
  const worry = when("hook", "bingung");
  const cost = when("hook", "takut keluar biaya besar");
  const look = when("hook", "Coba cek");
  const shake = shakeX(frame, cue(cost + 0.1), 14);
  return (
    <Frame id="hook" sweep>
      <Enter name="Tag" delay={cue(0.1)} y={30} style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ padding: "12px 36px", borderRadius: 999, backgroundColor: t.colors.groundChipBg, color: t.colors.groundChipText, fontFamily: t.fonts.mono, fontWeight: 700, fontSize: 40 }}>
          Dari nol
        </div>
      </Enter>
      <Headline delay={cue(0.2)} size={104}>
        Mau jadi <Accent>AI Engineer</Accent>, tapi bingung?
      </Headline>
      <div style={{ position: "relative", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 18, padding: "20px 0 40px" }}>
        {TABS.map((tab, i) => (
          <Enter
            key={tab}
            name={`Tab ${tab}`}
            delay={cue(Math.max(0.2, worry - 1.3 + i * 0.28))}
            y={50}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "16px 26px",
              borderRadius: t.radius.card,
              backgroundColor: t.code.raised,
              border: `2px solid ${t.code.line}`,
              color: t.code.text,
              fontFamily: t.fonts.body,
              fontWeight: 600,
              fontSize: 36,
              rotate: `${(i % 2 ? 1 : -1) * (2 + i)}deg`,
              translate: `0 ${bob(frame, i, 5)}px`,
            }}
          >
            <Icon name="globe" size={34} color={t.colors.groundEmphasis} />
            {tab}
          </Enter>
        ))}
        {QUESTIONS.map((q, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: q.left,
              top: q.top + bob(frame, q.phase, 10),
              fontFamily: t.fonts.heading,
              fontWeight: 800,
              fontSize: q.size,
              lineHeight: 1,
              color: t.colors.groundEmphasis,
              opacity: p(worry + i * 0.35, 0.4),
              scale: 0.6 + 0.4 * p(worry + i * 0.35, 0.4),
            }}
          >
            ?
          </div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Enter
          name="Biaya besar"
          delay={cue(cost)}
          y={40}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 22,
            padding: "18px 40px 18px 18px",
            borderRadius: 999,
            backgroundColor: t.code.raised,
            border: `2px solid ${t.colors.danger}`,
            translate: `${shake}px 0`,
          }}
        >
          <div style={{ width: 72, height: 72, borderRadius: 999, backgroundColor: t.colors.danger, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: t.fonts.mono, fontWeight: 800, fontSize: 36, color: "#fff" }}>
            $$$
          </div>
          <span style={{ fontFamily: t.fonts.heading, fontWeight: 700, fontSize: 46, color: t.code.text }}>Takut biaya besar</span>
        </Enter>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Enter
          name="GitHub"
          delay={cue(look)}
          y={40}
          style={{ display: "flex", alignItems: "center", gap: 20, padding: "16px 44px 16px 24px", borderRadius: 999, backgroundColor: t.colors.accent, boxShadow: t.shadows.glow, scale: 1 + 0.03 * Math.sin(frame / 6) }}
        >
          <GithubMark size={64} color={t.colors.onAccent} />
          <span style={{ fontFamily: t.fonts.heading, fontWeight: 800, fontSize: 48, color: t.colors.onAccent }}>Cek repo ini dulu</span>
        </Enter>
      </div>
    </Frame>
  );
};

// ---------- 2. Repositori ----------

const Badge: React.FC<{ readonly name: string; readonly delay: number; readonly icon: React.ComponentProps<typeof Icon>["name"]; readonly highlight?: boolean; readonly children: React.ReactNode }> = ({ name, delay, icon, highlight, children }) => {
  const t = useTheme();
  return (
    <Enter
      name={name}
      delay={delay}
      y={30}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "12px 22px",
        borderRadius: 999,
        backgroundColor: highlight ? t.colors.accent : t.code.line,
        boxShadow: highlight ? t.shadows.glow : "none",
        color: highlight ? t.colors.onAccent : t.code.text,
        fontFamily: t.fonts.body,
        fontWeight: 700,
        fontSize: 32,
      }}
    >
      <Icon name={icon} size={32} color={highlight ? t.colors.onAccent : t.colors.groundEmphasis} />
      {children}
    </Enter>
  );
};

export const RepoScene: React.FC = () => {
  const t = useTheme();
  const { frame, p } = useCue();
  const star = p(when("repo", "berlisensi") + 1.0, 0.3);
  const free = when("repo", "gratis sepenuhnya");
  return (
    <Frame id="repo">
      <Headline delay={cue(0.1)} size={70} muted>
        Repositori GitHub
      </Headline>
      <Enter name="Kartu repo" delay={cue(when("repo", "Ada repositori") + 0.3)} y={60} style={{ padding: "40px 40px 44px", borderRadius: t.radius.large, backgroundColor: t.code.raised, border: `2px solid ${t.code.line}`, display: "flex", flexDirection: "column", gap: 30 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <GithubMark size={76} color={t.code.text} />
          <div style={{ flex: 1, fontFamily: t.fonts.mono, fontWeight: 700, fontSize: 38, lineHeight: 1.2, color: t.code.text, wordBreak: "break-word" }}>ai-engineering-from-scratch</div>
          <div style={{ padding: "6px 22px", borderRadius: 999, border: `2px solid ${t.code.line}`, fontFamily: t.fonts.body, fontWeight: 600, fontSize: 28, color: t.code.muted }}>Public</div>
        </div>
        <div style={{ height: 2, backgroundColor: t.code.line }} />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 18 }}>
          <Badge name="Open source" delay={cue(when("repo", "open source"))} icon="code">
            Open Source
          </Badge>
          <Badge name="MIT" delay={cue(when("repo", "berlisensi"))} icon="check" highlight>
            MIT License
          </Badge>
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 22px", borderRadius: 999, border: `2px solid ${t.code.line}`, fontFamily: t.fonts.body, fontWeight: 700, fontSize: 32, color: t.code.text, opacity: p(when("repo", "berlisensi") + 0.8, 0.4) }}>
            <Icon name="star" size={32} color={star > 0.5 ? t.colors.accent : t.code.muted} />
            Star
          </div>
        </div>
      </Enter>
      <Enter name="Gratis" delay={cue(free)} y={50} style={{ textAlign: "center" }}>
        <div style={{ fontFamily: t.fonts.heading, fontWeight: 800, fontSize: 230, lineHeight: 1.15, letterSpacing: "-0.04em", color: t.colors.groundEmphasis, scale: 1 + 0.03 * Math.sin(frame / 8) }}>Rp 0</div>
        <div style={{ fontFamily: t.fonts.body, fontWeight: 600, fontSize: 52, color: t.colors.groundTextMuted }}>gratis sepenuhnya</div>
      </Enter>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Pop delay={cue(when("repo", "untuk siapa saja"))}>
          <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "10px 40px", borderRadius: 999, backgroundColor: t.colors.groundChipBg, color: t.colors.groundChipText, fontFamily: t.fonts.heading, fontWeight: 800, fontSize: 52 }}>
            <Icon name="userCheck" size={52} color={t.colors.groundChipText} />
            untuk siapa saja
          </div>
        </Pop>
      </div>
    </Frame>
  );
};

// ---------- 3. Kurikulum ----------

const LANGS = [
  { label: "Python", at: "pakai Python" },
  { label: "TypeScript", at: "TypeScript" },
  { label: "+ lainnya", at: "bahasa lainnya" },
] as const;

export const KurikulumScene: React.FC = () => {
  const t = useTheme();
  const { p } = useCue();
  const countStart = when("kurikulum", "lima ratus");
  const count = Math.round(542 * p(countStart, 2.0));
  const phaseStart = when("kurikulum", "dua puluh fase");
  const filled = p(phaseStart, 2.4) * 20;
  const arrow = p(when("kurikulum", "dari konsep dasar"), 1.6);
  return (
    <Frame id="kurikulum">
      <Enter name="Hitungan" delay={cue(Math.max(0.2, countStart - 0.4))} y={40} style={{ textAlign: "center" }}>
        <div style={{ fontFamily: t.fonts.heading, fontWeight: 800, fontSize: 270, lineHeight: 1, letterSpacing: "-0.04em", color: t.colors.groundEmphasis }}>{count}</div>
        <div style={{ fontFamily: t.fonts.heading, fontWeight: 700, fontSize: 62, color: t.colors.groundText }}>pelajaran</div>
      </Enter>
      <Enter name="Fase" delay={cue(phaseStart - 0.2)} y={40} style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        <PointTag delay={cue(phaseStart - 0.2)} n={20}>
          Fase
        </PointTag>
        <PhaseGrid count={20} columns={10} filled={filled} cell={80} gap={12} />
      </Enter>
      <Enter name="Dasar ke nyata" delay={cue(when("kurikulum", "dari konsep dasar"))} y={30} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Bar value={arrow} color={t.colors.accent} height={24} />
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: t.fonts.body, fontWeight: 600, fontSize: 36, color: t.colors.groundTextMuted }}>
          <span>Konsep dasar</span>
          <span>Implementasi nyata</span>
        </div>
      </Enter>
      <div style={{ display: "flex", justifyContent: "center", gap: 20 }}>
        {LANGS.map((l) => (
          <Pop key={l.label} delay={cue(when("kurikulum", l.at))}>
            <div style={{ padding: "14px 34px", borderRadius: 999, backgroundColor: t.colors.groundChipBg, color: t.colors.groundChipText, fontFamily: t.fonts.mono, fontWeight: 700, fontSize: 42 }}>{l.label}</div>
          </Pop>
        ))}
      </div>
    </Frame>
  );
};

// ---------- 4. Kuis penempatan ----------

export const KuisScene: React.FC = () => {
  const t = useTheme();
  const { frame, p } = useCue();
  const answer = p(when("kuis", "Isi kuisnya"), 2.4) * 10;
  const result = when("kuis", "langsung tahu");
  const pin = p(result + 0.9, 0.5);
  return (
    <Frame id="kuis">
      <Headline delay={cue(0.1)} size={88}>
        Kuis <Accent>10 pertanyaan</Accent>
      </Headline>
      <Enter name="Kuis" delay={cue(when("kuis", "kuis penempatan"))} y={60} style={{ padding: "36px 40px 40px", borderRadius: t.radius.large, backgroundColor: t.code.raised, border: `2px solid ${t.code.line}`, display: "flex", flexDirection: "column", gap: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <Icon name="bookOpenCheck" size={60} color={t.colors.groundEmphasis} />
          <span style={{ fontFamily: t.fonts.heading, fontWeight: 700, fontSize: 48, color: t.code.text }}>Kuis penempatan</span>
          <span style={{ marginLeft: "auto", fontFamily: t.fonts.mono, fontWeight: 700, fontSize: 40, color: t.code.muted }}>{Math.min(10, Math.floor(answer))}/10</span>
        </div>
        <Bar value={answer / 10} color={t.colors.accent} height={24} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16 }}>
          {Array.from({ length: 10 }, (_, i) => {
            const on = answer > i + 0.5;
            return (
              <div
                key={i}
                style={{
                  height: 96,
                  borderRadius: 16,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: on ? t.colors.primary : t.code.line,
                  border: `2px solid ${on ? t.colors.primarySoft : t.code.line}`,
                  fontFamily: t.fonts.mono,
                  fontWeight: 700,
                  fontSize: 38,
                  color: on ? t.colors.onPrimary : t.code.muted,
                  scale: on ? 1 : 0.94,
                }}
              >
                {on ? <Icon name="check" size={44} color={t.colors.onPrimary} /> : i + 1}
              </div>
            );
          })}
        </div>
      </Enter>
      <div style={{ display: "flex", justifyContent: "center", opacity: p(result - 0.2, 0.4), translate: `0 ${bob(frame, 0, 6)}px` }}>
        <Icon name="arrowDown" size={84} color={t.colors.groundEmphasis} />
      </div>
      <Enter name="Hasil" delay={cue(result)} y={50}>
        <div style={{ padding: "30px 40px", borderRadius: t.radius.large, backgroundColor: t.code.raised, border: `2px solid ${t.colors.accent}`, boxShadow: t.shadows.glow, color: t.code.text, display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontFamily: t.fonts.heading, fontWeight: 800, fontSize: 56, textAlign: "center" }}>Mulai dari Fase ini</div>
          <div style={{ opacity: pin }}>
            <PhaseGrid count={20} columns={20} filled={20} cell={38} gap={4} mark={8} />
            <div style={{ marginTop: 10, textAlign: "center", fontFamily: t.fonts.mono, fontWeight: 700, fontSize: 30 }}>sesuai kondisimu · contoh</div>
          </div>
        </div>
      </Enter>
    </Frame>
  );
};

// ---------- 5. Tiga cara belajar ----------

const WAYS = [
  { icon: "globe", title: "Website", sub: "tanpa setup apapun", chip: "buka & belajar", at: "lewat website" },
  { icon: "bot", title: "AI Tutor", sub: "interaktif", chip: "tanya jawab", at: "pakai A-I tutor" },
  { icon: "terminal", title: "Lokal", sub: "unduh repo ke komputer", chip: "git clone", at: "unduh repositorinya" },
] as const;

export const CaraScene: React.FC = () => {
  const t = useTheme();
  const { frame, p } = useCue();
  return (
    <Frame id="cara">
      <PointTag delay={cue(0.1)} n={3}>
        Cara belajar
      </PointTag>
      <Headline delay={cue(0.3)} size={84}>
        Fleksibel, <Accent>pilih sendiri</Accent>
      </Headline>
      {WAYS.map((w, i) => {
        const at = when("cara", w.at);
        return (
          <Card key={w.title} name={w.title} delay={cue(at - 0.2)} icon={w.icon} x={i % 2 ? 70 : -70}>
            <div style={{ display: "flex", alignItems: "center", width: 730 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontFamily: t.fonts.heading, fontWeight: 800, fontSize: 54 }}>{w.title}</span>
              <span style={{ fontSize: 34, fontWeight: 500, color: t.code.muted, opacity: p(at, 0.4) }}>{w.sub}</span>
            </div>
            <div style={{ marginLeft: "auto", padding: "8px 20px", borderRadius: 999, backgroundColor: t.code.line, color: t.colors.groundEmphasis, fontFamily: t.fonts.mono, fontWeight: 700, fontSize: 28, whiteSpace: "nowrap", opacity: p(at, 0.4) }}>{w.chip}</div>
            </div>
          </Card>
        );
      })}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Pop delay={cue(when("cara", "Pilih yang"))}>
          <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "14px 44px", borderRadius: 999, backgroundColor: t.colors.accent, boxShadow: t.shadows.glow, color: t.colors.onAccent, fontFamily: t.fonts.heading, fontWeight: 800, fontSize: 50, scale: 1 + 0.03 * Math.sin(frame / 6) }}>
            <Icon name="circleCheck" size={52} color={t.colors.onAccent} />
            Pilih yang paling nyaman
          </div>
        </Pop>
      </div>
    </Frame>
  );
};

// ---------- 6. Tiga proyek ----------

const PROJECTS = [
  { icon: "search", title: "Retrieval Evaluation Lab", sub: "ukur kualitas pencarian", at: "Retrieval Evaluation Lab" },
  { icon: "route", title: "Agent Trace Debugger", sub: "telusuri langkah agent", at: "Agent Trace Debugger" },
  { icon: "shield", title: "Tool Call Firewall", sub: "tahan panggilan berbahaya", at: "Tool Call Firewall" },
] as const;

export const ProyekScene: React.FC = () => {
  const t = useTheme();
  const { p } = useCue();
  const strike = p(when("proyek", "tidak cuma teori") + 0.5, 0.4);
  return (
    <Frame id="proyek">
      <PointTag delay={cue(0.1)} n={3}>
        Proyek nyata
      </PointTag>
      {PROJECTS.map((pr, i) => (
        <Enter
          key={pr.title}
          name={pr.title}
          delay={cue(when("proyek", pr.at) - 0.3)}
          x={110}
          y={0}
          style={{ display: "flex", alignItems: "center", gap: 28, padding: "28px 36px", borderRadius: t.radius.large, backgroundColor: t.code.raised, border: `2px solid ${t.code.line}`, borderLeft: `10px solid ${t.colors.accent}` }}
        >
          <div style={{ width: 96, height: 96, flexShrink: 0, borderRadius: 999, backgroundColor: t.code.line, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name={pr.icon} size={56} color={t.colors.groundEmphasis} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, fontFamily: t.fonts.heading }}>
            <span style={{ fontWeight: 800, fontSize: 46, lineHeight: 1.15, color: t.code.text }}>{pr.title}</span>
            <span style={{ fontFamily: t.fonts.body, fontWeight: 500, fontSize: 34, color: t.code.muted }}>{pr.sub}</span>
          </div>
          <div style={{ marginLeft: "auto", fontFamily: t.fonts.mono, fontWeight: 800, fontSize: 56, color: t.colors.primarySoft }}>0{i + 1}</div>
        </Enter>
      ))}
      <Headline delay={cue(when("proyek", "Belajar tidak"))} size={80} name="Bukan teori">
        Belajar tidak cuma{" "}
        <span style={{ position: "relative", display: "inline-block", color: t.colors.groundEmphasis }}>
          teori
          <span style={{ position: "absolute", left: -8, top: "54%", height: 12, width: `${strike * 112}%`, borderRadius: 6, backgroundColor: t.colors.danger }} />
        </span>
      </Headline>
    </Frame>
  );
};

// ---------- 7. CTA ----------

const REPO = "ai-engineering-from-scratch";

export const CtaScene: React.FC = () => {
  const t = useTheme();
  const { frame, p } = useCue();
  const typeAt = when("cta", "Cari");
  const typed = Math.round(p(typeAt, 2.2) * REPO.length);
  const cursor = Math.floor(frame / 12) % 2 === 0;
  const start = when("cta", "mulai dari kuis");
  const press = p(start + 0.6, 0.25);
  const pulse = 1 + 0.07 * Math.sin(p(0.2, 2.0) * Math.PI);
  return (
    <Frame id="cta">
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Pop delay={cue(0.1)}>
          <div style={{ width: 170, height: 170, borderRadius: 999, backgroundColor: t.colors.groundChipBg, display: "flex", alignItems: "center", justifyContent: "center", scale: pulse }}>
            <GithubMark size={110} color={t.colors.groundChipText} />
          </div>
        </Pop>
      </div>
      <Headline delay={cue(0.2)} size={96}>
        Cari di <Accent>GitHub</Accent> sekarang
      </Headline>
      <Enter name="Kolom cari" delay={cue(Math.max(0.2, typeAt - 0.2))} y={40} style={{ display: "flex", alignItems: "center", gap: 20, padding: "26px 34px", borderRadius: 999, backgroundColor: t.code.raised, border: `2px solid ${t.colors.accent}`, boxShadow: t.shadows.glow }}>
        <Icon name="search" size={52} color={t.colors.groundEmphasis} />
        <div style={{ fontFamily: t.fonts.mono, fontWeight: 700, fontSize: 39, color: t.code.text, whiteSpace: "nowrap" }}>
          {REPO.slice(0, typed)}
          <span style={{ opacity: cursor ? 1 : 0, color: t.colors.groundEmphasis }}>|</span>
        </div>
      </Enter>
      <Enter name="Mulai kuis" delay={cue(start)} y={50} style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 22, padding: "30px 54px", borderRadius: t.radius.large, backgroundColor: t.colors.accent, boxShadow: t.shadows.glow, color: t.colors.onAccent, fontFamily: t.fonts.heading, fontWeight: 800, fontSize: 58, scale: 1 - 0.05 * Math.sin(press * Math.PI) }}>
          <Icon name="mousePointerClick" size={64} color={t.colors.onAccent} />
          Mulai Kuis Sekarang
        </div>
      </Enter>
      <Interactive.Div name="Catatan" style={{ textAlign: "center", fontFamily: t.fonts.mono, fontWeight: 600, fontSize: 38, color: t.colors.groundTextMuted, opacity: p(start + 0.4, 0.5) }}>
        10 pertanyaan · tahu mulai dari fase mana
      </Interactive.Div>
    </Frame>
  );
};
