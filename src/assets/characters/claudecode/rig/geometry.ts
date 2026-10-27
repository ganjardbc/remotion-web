// Geometri Claude Code mengikuti design-references/characters/claude-code.svg (viewBox 24x24).
// Semua nilai dalam unit grid SVG itu; rig memakai skala S px per unit dengan lantai di y = 0.
export const COLORS = {
  orange: "#D97757",
  orangeLight: "#E8937A",
  orangeDark: "#B85C41",
  eye: "#1b1715",
  background: "#f8f6f1",
} as const;

export const S = 20;
export const BODY = { x: 3, y: 5, w: 18, h: 12.079 } as const;
export const ARM = { w: 3, h: 3.102, y: 10.949 } as const;
export const LEG = { w: 1.513, top: 17.079, bottom: 20 } as const;
// Kiri ke kanan: luar kiri, dalam kiri, dalam kanan, luar kanan.
export const LEG_X = [4.487, 7.488, 15, 18] as const;
export const EYE = { dx: 5.256, y: 9.526, w: 1.5, h: 2.85 } as const;
export const CENTER_X = 12;
export const FLOOR = 20;
