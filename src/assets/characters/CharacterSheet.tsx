import type React from "react";
import { AbsoluteFill } from "remotion";
import { Ganjar, GANJAR_EXPRESSIONS } from "./ganjar/rig/Ganjar";
import { ROBOT_EXPRESSIONS, Robot } from "./robot/rig/Robot";
import { ClaudeCode, CLAUDE_CODE_EXPRESSIONS } from "./claudecode/rig/ClaudeCode";

const INK = "#17171b";
const PALETTE = [INK, "#6b6b70", "#f5e9d8", "#fbd34d", "#f6932a", "#1d78f0", "#D97757"];

const LABEL: Record<string, string> = {
  netral: "Netral",
  senang: "Senang",
  bingung: "Bingung",
  kaget: "Kaget",
  senyumSantai: "Senyum Santai",
  serius: "Serius",
  kesal: "Kesal",
  mikir: "Mikir",
  mataTertutup: "Mata Tertutup",
  normal: "Normal",
  malu: "Malu",
  sedih: "Sedih",
  marah: "Marah",
};

const heading: React.CSSProperties = {
  fontFamily: "monospace",
  fontWeight: 700,
  letterSpacing: 2,
  fontSize: 22,
  color: INK,
  margin: "0 0 16px",
  textTransform: "uppercase",
};

const Cell: React.FC<{
  readonly label: string;
  readonly dark?: boolean;
  readonly cellHeight?: number;
  readonly children: React.ReactNode;
}> = ({ label, dark, cellHeight = 180, children }) => (
  <div style={{ textAlign: "center", fontFamily: "sans-serif", fontSize: 18, color: INK }}>
    <div
      style={{
        background: dark ? INK : "#ece9e3",
        borderRadius: 10,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: cellHeight,
        overflow: "hidden",
      }}
    >
      {children}
    </div>
    <div style={{ marginTop: 6 }}>{label}</div>
  </div>
);

// Halaman referensi: semua ekspresi. Buka di Studio untuk memilih aset.
export const CharacterSheet: React.FC = () => (
  <AbsoluteFill style={{ background: "#f8f6f1", padding: 48, flexDirection: "row", gap: 48 }}>
    <div style={{ width: 460, display: "flex", flexDirection: "column", gap: 28 }}>
      <div>
        <h3 style={heading}>Palet Warna</h3>
        <div style={{ display: "flex", gap: 12 }}>
          {PALETTE.map((c) => (
            <div key={c} style={{ width: 44, height: 44, borderRadius: 22, background: c }} />
          ))}
        </div>
      </div>

      <div>
        <h3 style={heading}>Ekspresi Claude Code</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 14 }}>
          {CLAUDE_CODE_EXPRESSIONS.map((e) => (
            <Cell key={e} label={LABEL[e]} cellHeight={120}>
              <ClaudeCode expression={e} height={95} />
            </Cell>
          ))}
        </div>
      </div>
    </div>

    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 28 }}>
      <div>
        <h3 style={heading}>Ekspresi Ganjar</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 14 }}>
          {GANJAR_EXPRESSIONS.map((e) => (
            <Cell key={e} label={LABEL[e]}>
              <Ganjar bust expression={e} height={(190 * 460) / 500} />
            </Cell>
          ))}
        </div>
      </div>

      <div>
        <h3 style={heading}>Ekspresi Robot</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 14 }}>
          {ROBOT_EXPRESSIONS.map((e) => (
            <Cell key={e} label={LABEL[e]} dark>
              <Robot expression={e} height={(170 * 560) / 660} />
            </Cell>
          ))}
        </div>
      </div>
    </div>
  </AbsoluteFill>
);
