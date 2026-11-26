import type React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { Backdrop } from "../../Backdrop";
import { DESK_TOP, H, Layer, Lighting, SETS, W } from "../../block-reels";
import { Icon } from "../../icons";
import { useTheme } from "../../themes";
import { Enter } from "../../motion";
import { NARRATOR_MODES, SAFE_RIGHT, ZONES } from "../../reelsLayout";
import { at, FPS, LEAD, NARRATOR, SCENE_IDS, WORLD, type SceneId } from "./config";

type IconName = React.ComponentProps<typeof Icon>["name"];

const EASE = Easing.bezier(0.2, 0.8, 0.2, 1);

// Waktu cue ditulis dalam detik sejak suara mulai; LEAD menggeser ke frame lokal scene.
export const cue = (s: number): number => Math.round(s * FPS) + LEAD;

// `when(frasa)` = detik saat frasa diucapkan di scene ini, `p(detik, durasi)` = progres 0..1 dengan ease-out.
export const useCue = (
  id: SceneId,
): { readonly frame: number; readonly when: (phrase: string) => number; readonly p: (start: number, dur?: number) => number } => {
  const frame = useCurrentFrame();
  const p = (start: number, dur = 0.6): number =>
    interpolate(frame, [cue(start), cue(start + dur)], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE,
    });
  return { frame, when: (phrase) => at(id, phrase), p };
};

// Latar dunia: kantor malam dari Reels block (SETS.kantor: menara berjendela menyala, papan dinding redup) di dua lapisan paralaks,
// dengan lantai kantor di bawah garis FLOOR_TOP tempat karakter berdiri. Kamera bergeser sangat pelan, dan titik awalnya berbeda
// per scene supaya komposisi latar tidak persis sama di scene berurutan.
const OFFICE = SETS.kantor;
// Garis depan lantai (permukaan meja) diturunkan 100 px dari DESK_TOP bawaan set kantor.
const FLOOR_TOP = DESK_TOP + 100;
const CAM_START = [-30, 40, -50, 30, -40, 50, -20, 40] as const;
const World: React.FC<{ readonly id: SceneId }> = ({ id }) => {
  const frame = useCurrentFrame();
  const world = WORLD[id];
  if (world !== "kantor") return <Backdrop variant={world.flat} label={`${String(SCENE_IDS.indexOf(id) + 1).padStart(2, "0")} / ${String(SCENE_IDS.length).padStart(2, "0")}`} />;
  const dir = SCENE_IDS.indexOf(id) % 2 === 0 ? 1 : -1;
  const cam = { tx: CAM_START[SCENE_IDS.indexOf(id)] + dir * frame * 0.12, ty: 0, z: 1.04 };
  return (
    <>
      <div style={{ position: "absolute", inset: 0, backgroundColor: OFFICE.bg }} />
      <Layer cam={cam} p={0.28}>
        <OFFICE.Far />
      </Layer>
      <Layer cam={cam} p={0.6}>
        <OFFICE.Mid />
      </Layer>
      {/* Peredup di atas garis lantai: jendela menyala tetap terlihat samar, tapi judul dan kartu tetap terbaca (kontras teks). */}
      <div style={{ position: "absolute", left: 0, top: 0, width: W, height: FLOOR_TOP, background: "linear-gradient(rgba(5,9,20,0.82), rgba(5,9,20,0.62))" }} />
      <div style={{ position: "absolute", left: 0, top: FLOOR_TOP, width: W, height: H - FLOOR_TOP, background: `linear-gradient(${OFFICE.deskTop}, ${OFFICE.deskFront} 55%)`, borderTop: `6px solid ${OFFICE.deskEdge}`, boxSizing: "border-box" }} />
      <Lighting set="kantor" />
    </>
  );
};

// Area konten: dari ZONES.contentTop sampai batas bawah mode narator scene ini (NARRATOR di config.ts); subtitle dan karakter di bawahnya.
export const Frame: React.FC<{ readonly id: SceneId; readonly children: React.ReactNode }> = ({ id, children }) => {
  const frame = useCurrentFrame();
  const fade = interpolate(frame, [0, 6], [0, 1], { extrapolateRight: "clamp" });
  const bottom = NARRATOR_MODES[NARRATOR[id].mode].contentBottom;
  // Semua scene memakai lebar konten yang sama (margin SAFE_RIGHT di kiri dan kanan, sama dengan subtitle): konten simetris di tengah
  // dan tidak tertutup kolom tombol platform (kanan, mulai sekitar y 1100). Jangan ubah per mode atau per scene.
  const side = SAFE_RIGHT;
  return (
    <>
      <World id={id} />
      <div
        style={{
          position: "absolute",
          left: side,
          right: side,
          top: ZONES.contentTop,
          height: bottom - ZONES.contentTop,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "stretch",
          gap: 36,
          opacity: fade,
        }}
      >
        {children}
      </div>
    </>
  );
};

export const Headline: React.FC<{
  readonly delay: number;
  readonly size?: number;
  readonly muted?: boolean;
  readonly name?: string;
  readonly children: React.ReactNode;
}> = ({ delay, size = 104, muted, name = "Headline", children }) => {
  const t = useTheme();
  return (
    <Enter
      name={name}
      delay={delay}
      y={44}
      style={{
        textAlign: "center",
        textWrap: "balance",
        fontFamily: t.fonts.heading,
        fontWeight: muted ? 600 : t.type.headlineWeight,
        fontSize: Math.round(size * t.type.scale),
        lineHeight: 1.12,
        letterSpacing: `${t.type.tracking}em`,
        color: muted ? t.colors.groundTextMuted : t.colors.groundText,
      }}
    >
      {children}
    </Enter>
  );
};

export const Accent: React.FC<{ readonly children: React.ReactNode }> = ({ children }) => {
  const t = useTheme();
  return <span style={{ color: t.colors.groundEmphasis }}>{children}</span>;
};

// Pil kecil berhuruf mono, mis. nama produk atau perintah.
export const Chip: React.FC<{ readonly delay: number; readonly name: string; readonly children: React.ReactNode }> = ({ delay, name, children }) => {
  const t = useTheme();
  return (
    <Enter name={name} delay={delay} y={30} style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ padding: "12px 36px", borderRadius: 999, backgroundColor: t.colors.groundChipBg, color: t.colors.groundChipText, fontFamily: t.fonts.mono, fontWeight: 700, fontSize: 40 }}>
        {children}
      </div>
    </Enter>
  );
};

// Batang horizontal yang mengisi dari kiri; value 0..1 dari lebar penuh.
export const Bar: React.FC<{ readonly value: number; readonly color: string; readonly height?: number }> = ({ value, color, height = 44 }) => {
  const t = useTheme();
  return (
    <div style={{ height, borderRadius: height / 2, backgroundColor: t.code.line, overflow: "hidden" }}>
      <div style={{ width: `${Math.max(0, value) * 100}%`, height: "100%", borderRadius: height / 2, backgroundColor: color }} />
    </div>
  );
};

export const GithubMark: React.FC<{ readonly size: number; readonly color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

// ---------- Komponen visual scene ----------

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ramp = (frame: number, start: number, dur: number): number => interpolate(frame, [start, start + dur], [0, 1], { ...clamp, easing: EASE });

// Teks mengetik huruf demi huruf (start dan dur dalam detik sejak suara mulai).
export const Typed: React.FC<{ readonly start: number; readonly dur: number; readonly text: string }> = ({ start, dur, text }) => {
  const frame = useCurrentFrame();
  const k = interpolate(frame, [cue(start), cue(start + dur)], [0, 1], clamp);
  const blink = Math.floor(frame / 15) % 2 === 0;
  return (
    <span>
      {text.slice(0, Math.round(k * text.length))}
      <span style={{ opacity: k < 1 || blink ? 1 : 0 }}>▌</span>
    </span>
  );
};

// Jendela gelap dengan tiga titik di kepala (terminal, editor, browser).
export const Window: React.FC<{ readonly delay: number; readonly title: string; readonly name?: string; readonly x?: number; readonly children: React.ReactNode }> = ({ delay, title, name = "Jendela", x = 0, children }) => {
  const t = useTheme();
  return (
    <Enter name={name} delay={delay} x={x} y={x ? 0 : 50} style={{ borderRadius: t.radius.large, backgroundColor: t.code.raised, border: `2px solid ${t.code.line}`, overflow: "hidden", boxShadow: t.shadows.lift }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 26px", borderBottom: `2px solid ${t.code.line}` }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ width: 16, height: 16, borderRadius: 999, backgroundColor: t.code.line }} />
        ))}
        <div style={{ marginLeft: 12, fontFamily: t.fonts.mono, fontSize: 24, color: t.code.muted }}>{title}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14, padding: 26, fontFamily: t.fonts.mono, fontSize: 32, color: t.code.text }}>{children}</div>
    </Enter>
  );
};

// Baris di dalam Window yang muncul pada frame lokal `show`.
export const Line: React.FC<{ readonly show: number; readonly indent?: number; readonly children: React.ReactNode }> = ({ show, indent = 0, children }) => {
  const frame = useCurrentFrame();
  const k = ramp(frame, show, 8);
  return <div style={{ opacity: k, translate: `0 ${(1 - k) * 12}px`, display: "flex", alignItems: "center", gap: 14, paddingLeft: indent * 44 }}>{children}</div>;
};

// Kartu repo GitHub (hook): nama repo, deskripsi, lisensi.
export const RepoCard: React.FC<{ readonly delay: number }> = ({ delay }) => {
  const t = useTheme();
  return (
    <Enter name="Repo" delay={delay} y={60} style={{ display: "flex", flexDirection: "column", gap: 16, padding: "30px 34px", borderRadius: t.radius.large, backgroundColor: t.code.raised, border: `2px solid ${t.code.line}`, boxShadow: t.shadows.lift }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <GithubMark size={52} color={t.code.text} />
        <div style={{ fontFamily: t.fonts.mono, fontWeight: 700, fontSize: 34, color: t.code.text }}>heygen-com/hyperframes</div>
      </div>
      <div style={{ fontFamily: t.fonts.body, fontWeight: 500, fontSize: 32, color: t.code.muted }}>HTML, CSS, JS jadi video MP4</div>
      <div style={{ display: "flex", gap: 28, fontFamily: t.fonts.body, fontWeight: 600, fontSize: 30, color: t.code.text }}>
        <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Icon name="code" size={34} color={t.code.text} /> Open source
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Icon name="shield" size={34} color={t.code.text} /> Apache 2.0
        </span>
      </div>
    </Enter>
  );
};

// HTML berubah jadi film: tag <html> di kiri, panah, strip frame berjalan di kanan.
export const HtmlToFilm: React.FC<{ readonly delay: number }> = ({ delay }) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const active = Math.floor(Math.max(0, frame - delay) / 8) % 4;
  return (
    <Enter name="HTML ke film" delay={delay} x={-60} y={0} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 18 }}>
      <div style={{ padding: "22px 26px", borderRadius: t.radius.large, backgroundColor: t.code.raised, border: `2px solid ${t.code.line}`, fontFamily: t.fonts.mono, fontWeight: 700, fontSize: 38, color: t.code.text }}>&lt;html&gt;</div>
      <Icon name="chevronsRight" size={52} color={t.colors.groundTextMuted} />
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} style={{ width: 92, height: 92, borderRadius: t.radius.card, border: `3px solid ${i === active ? t.colors.primarySoft : t.code.line}`, backgroundColor: i === active ? t.colors.primaryDark : t.code.raised, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="play" size={36} color={t.code.text} />
        </div>
      ))}
    </Enter>
  );
};

// Alur berpanah horizontal; tiap simpul muncul pada frame lokalnya, `hot` = indeks simpul dengan sorotan oranye.
export const Flow: React.FC<{ readonly delays: readonly number[]; readonly items: readonly (readonly [IconName, string])[]; readonly hot?: number }> = ({ delays, items, hot }) => {
  const t = useTheme();
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
      {items.map(([icon, label], i) => (
        <Enter key={label} name={label} delay={delays[i]} x={-40} y={0} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {i > 0 ? <Icon name="chevronsRight" size={32} color={t.colors.groundTextMuted} /> : null}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: 150, padding: "20px 4px", borderRadius: t.radius.large, backgroundColor: t.code.raised, border: `${i === hot ? 4 : 2}px solid ${i === hot ? t.colors.accent : t.code.line}`, fontFamily: t.fonts.body, fontWeight: 700, fontSize: 28, color: t.code.text }}>
            <Icon name={icon} size={48} color={t.code.text} />
            {label}
          </div>
        </Enter>
      ))}
    </div>
  );
};

// Baris daftar bercentang besar (syarat).
export const CheckRow: React.FC<{ readonly delay: number; readonly sub?: string; readonly children: React.ReactNode }> = ({ delay, sub, children }) => {
  const t = useTheme();
  return (
    <Enter name={`Syarat ${String(children)}`} delay={delay} x={60} y={0} style={{ display: "flex", alignItems: "center", gap: 24, padding: "26px 32px", borderRadius: t.radius.large, backgroundColor: t.code.raised, border: `2px solid ${t.code.line}` }}>
      <Icon name="circleCheck" size={60} color={t.colors.success ?? t.colors.primarySoft} />
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ fontFamily: t.fonts.heading, fontWeight: 800, fontSize: 52, color: t.code.text }}>{children}</div>
        {sub ? <div style={{ fontFamily: t.fonts.body, fontWeight: 500, fontSize: 30, color: t.code.muted }}>{sub}</div> : null}
      </div>
    </Enter>
  );
};

// Stempel (lisensi, hasil): lencana bergaris dengan satu kalimat.
export const Stamp: React.FC<{ readonly delay: number; readonly icon?: IconName; readonly children: React.ReactNode }> = ({ delay, icon = "circleCheck", children }) => {
  const t = useTheme();
  const green = t.colors.success ?? t.colors.primary;
  return (
    <Enter name="Stempel" delay={delay} y={30} style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "18px 30px", borderRadius: 999, border: `3px solid ${green}`, fontFamily: t.fonts.body, fontWeight: 700, fontSize: 38, color: t.colors.groundText }}>
        <Icon name={icon} size={46} color={green} />
        {children}
      </div>
    </Enter>
  );
};

// Blok terminal: baris diketik mulai frame lokal tiap baris; baris ok (tanpa "$") hijau.
export const Terminal: React.FC<{ readonly delay: number; readonly lines: readonly { readonly text: string; readonly at: number; readonly ok?: boolean }[] }> = ({ delay, lines }) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  return (
    <Enter name="Terminal" delay={delay} y={50} style={{ display: "flex", flexDirection: "column", gap: 22, padding: "28px 30px 36px", borderRadius: t.radius.large, backgroundColor: t.code.bg, border: `2px solid ${t.code.line}`, boxShadow: t.shadows.lift }}>
      <div style={{ display: "flex", gap: 10 }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ width: 18, height: 18, borderRadius: 999, backgroundColor: t.code.line }} />
        ))}
      </div>
      {lines.map((l) => {
        const n = Math.round(l.text.length * ramp(frame, l.at, Math.max(10, l.text.length * 0.5)));
        return (
          <div key={l.text} style={{ minHeight: 44, fontFamily: t.fonts.mono, fontWeight: 600, fontSize: 28, lineHeight: 1.35, color: l.ok ? (t.colors.success ?? t.code.text) : t.code.text, overflowWrap: "anywhere", opacity: n > 0 ? 1 : 0 }}>
            {l.ok ? "✓ " : "$ "}
            {l.text.slice(0, n)}
          </div>
        );
      })}
    </Enter>
  );
};

// Pratinjau browser: layar biru dengan judul yang meluncur masuk mulai `start` (frame lokal), berulang.
export const PreviewWindow: React.FC<{ readonly delay: number; readonly start: number }> = ({ delay, start }) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const k = ramp(frame, start, 24);
  return (
    <Window delay={delay} title="$ npx hyperframes preview" name="Preview" x={-60}>
      <div style={{ height: 210, borderRadius: t.radius.card, backgroundColor: t.colors.primary, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        <div style={{ opacity: k, translate: `${(1 - k) * -160}px 0`, fontFamily: t.fonts.heading, fontWeight: 800, fontSize: 72, color: t.colors.onPrimary }}>Halo</div>
      </div>
    </Window>
  );
};

// Baris render: perintah, bar progres, lalu file hasil.
export const RenderRow: React.FC<{ readonly delay: number; readonly fileAt: number }> = ({ delay, fileAt }) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const v = interpolate(frame, [delay + 8, fileAt], [0, 1], { ...clamp, easing: EASE });
  return (
    <Enter name="Render" delay={delay} x={60} y={0} style={{ display: "flex", flexDirection: "column", gap: 18, padding: "24px 28px", borderRadius: t.radius.large, backgroundColor: t.code.raised, border: `2px solid ${t.code.line}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: t.fonts.mono, fontSize: 30, color: t.code.text }}>
        <span>$ npx hyperframes render</span>
        <span style={{ color: t.code.muted }}>{Math.round(v * 100)}%</span>
      </div>
      <Bar value={v} color={t.colors.primarySoft} height={24} />
      <Line show={fileAt}>
        <Icon name="circleCheck" size={36} color={t.colors.success ?? t.colors.primarySoft} />
        <span style={{ fontFamily: t.fonts.mono, fontSize: 30, color: t.code.text }}>video.mp4</span>
      </Line>
    </Enter>
  );
};

export const FollowPill: React.FC<{ readonly delay: number }> = ({ delay }) => {
  const t = useTheme();
  return (
    <Enter name="Follow" delay={delay} y={40} style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "20px 36px", borderRadius: 999, whiteSpace: "nowrap", backgroundColor: t.colors.groundChipBg, color: t.colors.groundChipText, fontFamily: t.fonts.heading, fontWeight: 800, fontSize: 36, boxShadow: t.shadows.lift }}>
        <Icon name="userPlus" size={44} color={t.colors.groundChipText} />
        Follow @ganjar_hadiatna
      </div>
    </Enter>
  );
};
