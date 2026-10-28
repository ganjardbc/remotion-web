import type React from "react";
import { useCurrentFrame } from "remotion";

// Perabot kecil di atas meja yang dipakai beberapa video (SejarahAIStory dan SejarahAIStoryReels).
// Keduanya bertumpu pada `deskTop` dan berwarna dari luar, jadi ikut tema atau era video yang memakainya.

// Laptop kecil tampak dari belakang (punggung layar menghadap penonton) dengan logo bulat menyala berdenyut.
export const GlowLaptop: React.FC<{ readonly x: number; readonly deskTop: number; readonly accent: string; readonly baseRadius?: string }> = ({
  x,
  deskTop,
  accent,
  baseRadius = "4px 4px 8px 8px",
}) => {
  const frame = useCurrentFrame();
  const glow = 0.75 + Math.sin(frame / 18) * 0.25;
  return (
    <>
      <div style={{ position: "absolute", left: x - 110, top: deskTop - 11, width: 220, height: 12, borderRadius: baseRadius, background: "#16171b" }} />
      <div
        style={{
          position: "absolute",
          left: x - 96,
          top: deskTop - 148,
          width: 192,
          height: 138,
          borderRadius: 10,
          background: "#2b2d33",
          border: "4px solid #16171b",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 96 - 4 - 18,
            top: 69 - 4 - 18,
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: accent,
            opacity: glow,
            boxShadow: `0 0 18px ${accent}`,
          }}
        />
      </div>
    </>
  );
};

// Tanaman kecil: tiga daun di pot berwarna. `x` = tepi kiri kotak 80 px.
export const DeskPlant: React.FC<{ readonly x: number; readonly deskTop: number; readonly pot: string; readonly potEdge: string }> = ({ x, deskTop, pot, potEdge }) => (
  <div style={{ position: "absolute", left: x, top: deskTop - 120, width: 80, height: 120 }}>
    {[-26, 0, 26].map((rot, i) => (
      <div
        key={rot}
        style={{
          position: "absolute",
          left: 40 - 14,
          top: i === 1 ? 0 : 18,
          width: 28,
          height: 70,
          borderRadius: "50% 50% 50% 50% / 70% 70% 30% 30%",
          background: i === 1 ? "#3E9B5A" : "#2F7F49",
          transform: `rotate(${rot}deg)`,
          transformOrigin: "50% 100%",
        }}
      />
    ))}
    <div
      style={{
        position: "absolute",
        left: 12,
        top: 74,
        width: 56,
        height: 48,
        borderRadius: "4px 4px 12px 12px",
        background: pot,
        border: `5px solid ${potEdge}`,
      }}
    />
  </div>
);
