// Geometri robot (front view). Origin = pusat badan. Satuan = unit SVG.
// Proporsi diukur dari tampilan "Depan" di character sheet 2D, bukan dari render clay.
export const COLORS = {
  orange: "#f6932a",
  orangeLight: "#ffac52",
  orangeDark: "#e07b12",
  outline: "#b8620d",
  cream: "#f5e9d8",
  creamDark: "#e3cfb0",
  creamOutline: "#c9b08a",
  screen: "#1f2125",
  screenEdge: "#14151a",
  blue: "#1d78f0",
  blueLight: "#4aa0ff",
  background: "#f8f6f1",
} as const;

export const BODY = { x: -171, y: -147, w: 342, h: 295, r: 26 } as const;
export const SCREEN = { x: -124, y: -90, w: 248, h: 180, r: 14 } as const;
export const EYE_X = 54;

export const ARM = { w: 60, h: 184, r: 14, cx: 197, top: -84, pivotDy: 28 } as const;
export const ANTENNA = { cx: 103, baseY: -140, stemTop: -190, tipTop: -230, w: 46, tipW: 48 } as const;
export const LEG = {
  cx: 72,
  // Ujung atas sengaja masuk jauh ke bawah badan supaya tidak ada celah saat badan melompat.
  top: 70,
  bottom: 218,
  topW: 86,
  bottomW: 78,
  hipY: 130,
  footW: 96,
  footH: 36,
  footTop: 216,
} as const;

export const FLOOR_Y = LEG.footTop + LEG.footH;
export const BODY_PIVOT = { x: 0, y: BODY.y + BODY.h } as const;
