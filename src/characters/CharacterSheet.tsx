import type React from "react";
import { AbsoluteFill } from "remotion";
import { Character } from "./Character";
import { Duo } from "./Duo";
import {
  CHARACTER_EXPRESSIONS,
  HAIR_STYLES,
  PALETTE as C,
  ROBOT_EXPRESSIONS,
  VIEWS,
} from "./palette";
import { Robot } from "./Robot";

const LABEL: Record<string, string> = {
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
  front: "Depan",
  side: "Samping",
  back: "Belakang",
  threeQuarter: "3/4",
  acak: "Acak",
  klasik: "Klasik",
  poni: "Poni",
  mohawk: "Mohawk",
  cepol: "Cepol",
};

const heading: React.CSSProperties = {
  fontFamily: "monospace",
  fontWeight: 700,
  letterSpacing: 2,
  fontSize: 22,
  color: C.ink,
  margin: "0 0 16px",
  textTransform: "uppercase",
};

const Cell: React.FC<{
  readonly label: string;
  readonly dark?: boolean;
  readonly children: React.ReactNode;
}> = ({ label, dark, children }) => (
  <div style={{ textAlign: "center", fontFamily: "sans-serif", fontSize: 18, color: C.ink }}>
    <div
      style={{
        background: dark ? C.ink : "#ece9e3",
        borderRadius: 10,
        padding: 8,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: 160,
        overflow: "hidden",
      }}
    >
      {children}
    </div>
    <div style={{ marginTop: 6 }}>{label}</div>
  </div>
);

// Halaman referensi: semua ekspresi dan tampilan. Buka di Studio untuk memilih aset.
export const CharacterSheet: React.FC = () => (
  <AbsoluteFill style={{ background: "#f8f6f1", padding: 48, flexDirection: "row", gap: 48 }}>
    <div style={{ width: 380, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <div style={{ background: "#bcd8ff", borderRadius: 12, padding: 24, display: "flex", justifyContent: "center" }}>
        <Duo width={250} expression="senyumSantai" animated />
      </div>
      <div>
        <h3 style={heading}>Gaya Rambut</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
          {HAIR_STYLES.map((h) => (
            <Cell key={h} label={LABEL[h]}>
              <Character bust hair={h} expression="senang" width={96} style={{ marginTop: 10 }} />
            </Cell>
          ))}
        </div>
      </div>
      <div>
        <h3 style={heading}>Palet Warna</h3>
        <div style={{ display: "flex", gap: 12 }}>
          {[C.ink, C.gray, C.cream, C.yellow, C.orange, C.blue].map((c) => (
            <div key={c} style={{ width: 44, height: 44, borderRadius: 22, background: c }} />
          ))}
        </div>
      </div>
    </div>

    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 28 }}>
      <div>
        <h3 style={heading}>Ekspresi Karakter</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
          {CHARACTER_EXPRESSIONS.map((e) => (
            <Cell key={e} label={LABEL[e]}>
              <Character bust expression={e} width={128} style={{ marginTop: 14 }} />
            </Cell>
          ))}
        </div>
      </div>

      <div>
        <h3 style={heading}>Ekspresi Robot</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 14 }}>
          {ROBOT_EXPRESSIONS.map((e) => (
            <Cell key={e} label={LABEL[e]} dark>
              <Robot expression={e} width={130} />
            </Cell>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: 40 }}>
        <div style={{ flex: 1 }}>
          <h3 style={heading}>Tampilan Karakter</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
            {VIEWS.map((v) => (
              <Cell key={v} label={LABEL[v]}>
                <Character view={v} expression="serius" width={86} />
              </Cell>
            ))}
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={heading}>Tampilan Robot</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
            {VIEWS.map((v) => (
              <Cell key={v} label={LABEL[v]}>
                <Robot view={v} width={96} />
              </Cell>
            ))}
          </div>
        </div>
      </div>
    </div>
  </AbsoluteFill>
);
