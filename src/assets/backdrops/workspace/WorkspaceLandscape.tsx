import type React from "react";
import type { TimeOfDay } from "../shared";
import { Chair, Desk, Laptop, Mug, RoomBack } from "./Workspace";
import { LANDSCAPE_ANCHORS, LANDSCAPE_INNER, LANDSCAPE_SCALE } from "./anchors";

// Ruang kerja lanskap 1920x1080: ruang yang sama dengan kanvas tegak, digambar pada kanvas dalam yang lebih besar
// lalu diperkecil. `behindDesk` digambar antara kursi dan meja (karakter duduk, dipotong oleh meja); `onDesk`
// digambar paling depan (karakter yang berdiri di atas meja, gelas, dan sebagainya). Anak-anak memakai piksel
// kanvas dalam dan jangkar `LANDSCAPE_ANCHORS`. Ukuran luarnya selalu 1920x1080, jadi cocok sebagai dunia `ShotCamera`.
export const WorkspaceLandscape: React.FC<{
  readonly time?: TimeOfDay | number;
  readonly behindDesk?: React.ReactNode;
  readonly onDesk?: React.ReactNode;
}> = ({ time = "siang", behindDesk, onDesk }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, overflow: "hidden" }}>
    <div style={{ position: "absolute", left: 0, top: 0, width: LANDSCAPE_INNER.width, height: LANDSCAPE_INNER.height, transformOrigin: "0 0", transform: `scale(${LANDSCAPE_SCALE})` }}>
      <RoomBack anchors={LANDSCAPE_ANCHORS} time={time} />
      <Chair anchors={LANDSCAPE_ANCHORS} time={time} />
      {behindDesk}
      <Desk anchors={LANDSCAPE_ANCHORS} time={time} />
      <Laptop anchors={LANDSCAPE_ANCHORS} time={time} />
      <Mug anchors={LANDSCAPE_ANCHORS} />
      {onDesk}
    </div>
  </div>
);
