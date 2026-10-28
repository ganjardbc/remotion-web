import type { SkyPalette } from "../shared";

// Latar luar ruang: langit, deretan gedung dengan jendela menyala, dan jalan.
// Palet hanya hex 6 digit dan angka (bisa diinterpolasi antar waktu).
export type OutdoorPalette = SkyPalette & {
  // Lapisan gedung jauh (lebih pucat) di belakang deretan gedung utama.
  readonly buildingFar: string;
  readonly building: string;
  readonly windowLit: string;
  // Seberapa banyak jendela gedung menyala: 0 di siang, hampir penuh di malam.
  readonly windowOpacity: number;
  readonly ground: string;
  readonly groundLine: string;
  readonly curb: string;
  readonly shadowOpacity: number;
};

export const OUTDOOR_DAY: OutdoorPalette = {
  sky: "#8CCBF2",
  skyLow: "#E3F4FE",
  cloud: "#FFFFFF",
  cloudOpacity: 0.9,
  celestial: "#FFE27A",
  celestialX: 0.76,
  celestialY: 0.16,
  celestialSize: 0.14,
  stars: 0,
  buildingFar: "#DDE4EF",
  building: "#C9CFDD",
  windowLit: "#FFE9A8",
  windowOpacity: 0,
  ground: "#6F7480",
  groundLine: "#F1EFE8",
  curb: "#B8BBC6",
  shadowOpacity: 0.26,
};

export const OUTDOOR_SORE: OutdoorPalette = {
  sky: "#6E5CA8",
  skyLow: "#FFB085",
  cloud: "#FFC9A8",
  cloudOpacity: 0.85,
  celestial: "#FF8A3D",
  celestialX: 0.3,
  celestialY: 0.86,
  celestialSize: 0.22,
  stars: 0,
  buildingFar: "#75669A",
  building: "#4C3F6B",
  windowLit: "#FFD27A",
  windowOpacity: 0.35,
  ground: "#4A4358",
  groundLine: "#D9C7B8",
  curb: "#7A6E8A",
  shadowOpacity: 0.3,
};

export const OUTDOOR_MALAM: OutdoorPalette = {
  sky: "#0A0F2A",
  skyLow: "#232C58",
  cloud: "#4A5380",
  cloudOpacity: 0.3,
  celestial: "#F4F1DE",
  celestialX: 0.72,
  celestialY: 0.16,
  celestialSize: 0.1,
  stars: 1,
  buildingFar: "#1A2240",
  building: "#0F1428",
  windowLit: "#FFD87A",
  windowOpacity: 0.95,
  ground: "#1A1C2B",
  groundLine: "#5C6080",
  curb: "#2B2E45",
  shadowOpacity: 0.4,
};
