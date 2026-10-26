import type React from "react";
import { Ganjar, type GanjarProps, ganjarSize } from "./ganjar/Ganjar";
import { Robot, type RobotProps, robotSize } from "./robot/Robot";

// Robot dibuat sedikit lebih kecil dari Ganjar, kaki keduanya di garis lantai yang sama.
const ROBOT_RATIO = 0.69;
const GAP_RATIO = 0.02;

export type DuoProps = {
  // Lebar kotak Ganjar; robot proporsional.
  readonly width?: number;
  readonly ganjar?: Omit<GanjarProps, "width" | "bust">;
  readonly robot?: Omit<RobotProps, "width">;
};

export const duoSize = (width: number): { width: number; height: number } => {
  const g = ganjarSize(width);
  const r = robotSize(width * ROBOT_RATIO);
  return { width: g.width + r.width + width * GAP_RATIO, height: g.height };
};

// Ganjar berdiri dengan robot di sampingnya, seperti hero di character sheet.
export const Duo: React.FC<DuoProps> = ({ width = 340, ganjar, robot }) => {
  const g = ganjarSize(width);
  const r = robotSize(width * ROBOT_RATIO);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: width * GAP_RATIO }}>
      <Ganjar width={width} {...ganjar} />
      <Robot width={r.width} {...robot} style={{ marginBottom: g.floorGap - r.floorGap }} />
    </div>
  );
};
