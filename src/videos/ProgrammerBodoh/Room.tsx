import type React from "react";
import {
  Chair as BaseChair,
  Desk as BaseDesk,
  Laptop as BaseLaptop,
  Mug as BaseMug,
  PORTRAIT_ANCHORS,
  RoomBack as BaseRoomBack,
  WORKSPACE_DAY,
  type WorkspacePalette,
} from "../../assets/backdrops/workspace";
import { useTheme } from "../../themes";

// Kamar kerja Ganjar. Urutan gambar (belakang ke depan): RoomBack, Chair, karakter duduk, Desk, Laptop, Mug.
// Gambar dan jangkar ada di assets/backdrops/workspace; di sini hanya warna tema video yang disambungkan.

export const DESK_TOP = PORTRAIT_ANCHORS.deskTop;
export const SEAT_X = PORTRAIT_ANCHORS.seatX;
export const LAPTOP_W = PORTRAIT_ANCHORS.laptopW;
export const LAPTOP_LID_H = PORTRAIT_ANCHORS.laptopLidH;

const useRoomPalette = (): WorkspacePalette => {
  const t = useTheme();
  return { ...WORKSPACE_DAY, clockInk: t.colors.ink, clockAccent: t.colors.accent, laptopLogo: t.colors.primary };
};

export const RoomBack: React.FC = () => <BaseRoomBack palette={useRoomPalette()} />;
export const Chair: React.FC = () => <BaseChair palette={useRoomPalette()} />;
export const Desk: React.FC = () => <BaseDesk palette={useRoomPalette()} />;
export const Laptop: React.FC = () => <BaseLaptop palette={useRoomPalette()} />;
export const Mug: React.FC = () => <BaseMug />;
