import type React from "react";
import {
  Chair as BaseChair,
  Desk as BaseDesk,
  Laptop as BaseLaptop,
  Mug as BaseMug,
  PORTRAIT_ANCHORS,
  RoomBack as BaseRoomBack,
  WORKSPACE_DAY,
  type WorkspaceAnchors,
  type WorkspacePalette,
} from "../../assets/backdrops/workspace";
import { useTheme } from "../../themes";

// Kamar kerja Ganjar. Urutan gambar (belakang ke depan): RoomBack, Chair, karakter duduk, Desk, Laptop, Mug.
// Gambar dan jangkar ada di assets/backdrops/workspace; di sini hanya warna tema video yang disambungkan.

// Posisi kursi, laptop, dan gelas khusus video ini.
const ANCHORS: WorkspaceAnchors = { ...PORTRAIT_ANCHORS, seatX: 250, laptopX: 340, mugX: 572 };

// Kursi lebih rendah dari jangkar meja, mengikuti posisi duduk Ganjar. Hanya kursi yang bergeser.
const CHAIR_DROP = 76;

export const DESK_TOP = ANCHORS.deskTop;
export const FLOOR_Y = ANCHORS.floorY;
export const SEAT_X = ANCHORS.seatX;

const useRoomPalette = (): WorkspacePalette => {
  const t = useTheme();
  return { ...WORKSPACE_DAY, clockInk: t.colors.ink, clockAccent: t.colors.accent, laptopLogo: t.colors.primary };
};

export const RoomBack: React.FC = () => <BaseRoomBack anchors={ANCHORS} palette={useRoomPalette()} />;
export const Chair: React.FC = () => <BaseChair anchors={{ ...ANCHORS, deskTop: ANCHORS.deskTop + CHAIR_DROP }} palette={useRoomPalette()} />;
export const Desk: React.FC = () => <BaseDesk anchors={ANCHORS} palette={useRoomPalette()} />;
export const Laptop: React.FC = () => <BaseLaptop anchors={ANCHORS} palette={useRoomPalette()} />;
export const Mug: React.FC = () => <BaseMug anchors={ANCHORS} />;
