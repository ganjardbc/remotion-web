import type React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { RobotStickman, robotStickmanSize } from "../../robot/stickman/RobotStickman";
import { GESTURES, GANJAR_STICKMAN_EXPRESSIONS, GanjarStickman, ganjarStickmanSize, type GanjarStickmanExpression } from "../stickman/GanjarStickman";

export const GANJAR_STICKMAN_DEMO_FRAMES = GANJAR_STICKMAN_EXPRESSIONS.length * 30;

// Tiap ekspresi tampil 1 detik: setengah pertama diam, setengah kedua bicara.
export const GanjarStickmanDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const expression = GANJAR_STICKMAN_EXPRESSIONS[Math.min(GANJAR_STICKMAN_EXPRESSIONS.length - 1, Math.floor(t))];
  return (
    <AbsoluteFill style={{ background: "#ffffff", justifyContent: "center", alignItems: "center" }}>
      <GanjarStickman height={1400} expression={expression} talking={t % 1 >= 0.5} />
    </AbsoluteFill>
  );
};

const LABEL = (e: string): string => e.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());

// Lembar semua ekspresi, hanya bagian kepala. `talking` = mulut bergerak di semua sel.
export const GanjarStickmanExpressions: React.FC<{ readonly talking?: boolean }> = ({ talking = false }) => (
  <AbsoluteFill style={{ background: "#ffffff", padding: 20, display: "grid", gridTemplateColumns: "1fr 1fr", gridAutoRows: 245, gap: 14, alignContent: "center" }}>
    {GANJAR_STICKMAN_EXPRESSIONS.map((e) => (
      <div key={e} style={{ position: "relative", overflow: "hidden", background: "#ece9e3", borderRadius: 14 }}>
        <div style={{ position: "absolute", left: -91, top: -69 }}>
          <GanjarStickman height={700} expression={e} talking={talking} />
        </div>
        <div style={{ position: "absolute", left: 14, bottom: 10, fontFamily: "monospace", fontWeight: 700, fontSize: 24, color: "#17171b" }}>{LABEL(e)}</div>
      </div>
    ))}
  </AbsoluteFill>
);

export const GanjarStickmanTalking: React.FC = () => <GanjarStickmanExpressions talking />;

export const GanjarStickmanStill: React.FC<{ readonly expression?: GanjarStickmanExpression }> = ({ expression = "senyum" }) => (
  <AbsoluteFill style={{ background: "#ffffff", justifyContent: "center", alignItems: "center" }}>
    <GanjarStickman height={1400} expression={expression} hair />
  </AbsoluteFill>
);

export const GanjarStickmanHair: React.FC<{ readonly expression?: GanjarStickmanExpression }> = ({ expression = "senyum" }) => (
  <AbsoluteFill style={{ background: "#ffffff", justifyContent: "center", alignItems: "center" }}>
    <GanjarStickman height={1400} expression={expression} headphones={false} hair />
  </AbsoluteFill>
);

// Varian polos: hanya garis, tanpa hoodie dan celana.
export const GanjarStickmanPlain: React.FC<{ readonly expression?: GanjarStickmanExpression }> = ({ expression = "senyum" }) => (
  <AbsoluteFill style={{ background: "#ffffff", justifyContent: "center", alignItems: "center" }}>
    <GanjarStickman height={1400} expression={expression} headphones={false} outfit={false} />
  </AbsoluteFill>
);

// Lembar semua gerak tangan, badan atas saja. `robot` = RobotStickman. `frame` tetap 0 (pose diam).
// Tiga kolom; tinggi sel dihitung dari jumlah gerak supaya semua baris muat di kanvas 1920.
const SHEET = { width: 1080, height: 1920, pad: 20, gap: 14, cols: 3 } as const;
const CELL_W = (SHEET.width - SHEET.pad * 2 - SHEET.gap * (SHEET.cols - 1)) / SHEET.cols;
const ROWS = Math.ceil(GESTURES.length / SHEET.cols);
const CELL_H = Math.floor((SHEET.height - SHEET.pad * 2 - SHEET.gap * (ROWS - 1)) / ROWS);

export const GanjarStickmanGestures: React.FC<{ readonly robot?: boolean }> = ({ robot = false }) => {
  const figureH = robot ? CELL_H * 0.77 : CELL_H * 1.12;
  const figureW = (robot ? robotStickmanSize(figureH) : ganjarStickmanSize(figureH)).width;
  return (
    <AbsoluteFill style={{ background: "#ffffff", padding: SHEET.pad, display: "grid", gridTemplateColumns: `repeat(${SHEET.cols}, 1fr)`, gridAutoRows: CELL_H, gap: SHEET.gap, alignContent: "center" }}>
      {GESTURES.map((g) => (
        <div key={g} style={{ position: "relative", overflow: "hidden", background: "#ece9e3", borderRadius: 14 }}>
          <div style={{ position: "absolute", left: (CELL_W - figureW) / 2, top: robot ? CELL_H * 0.12 : CELL_H * 0.02 }}>
            {robot ? <RobotStickman height={figureH} gesture={g} /> : <GanjarStickman height={figureH} gesture={g} hair headphones={false} />}
          </div>
          <div style={{ position: "absolute", left: 14, bottom: 10, fontFamily: "monospace", fontWeight: 700, fontSize: 24, color: "#17171b" }}>{g}</div>
        </div>
      ))}
    </AbsoluteFill>
  );
};

export const RobotStickmanGestures: React.FC = () => <GanjarStickmanGestures robot />;
