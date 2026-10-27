import type React from "react";
import type { RobotExpression } from "../../robot/rig/face";
import { COLORS as C } from "./geometry";

// Satu mata di unit grid, pusat (0,0). Normalnya persis lubang mata logo (1,5 x 2,85).
// `side` -1 kiri, +1 kanan. Semua bentuk bersudut tegas, seperti piksel logonya.
const line = (d: string, w = 0.55): React.ReactNode => (
  <path d={d} fill="none" stroke={C.eye} strokeWidth={w} strokeLinecap="square" strokeLinejoin="miter" />
);

export const eyeShape = (kind: RobotExpression, side: -1 | 1): React.ReactNode => {
  const fill = C.eye;
  const m = side;
  switch (kind) {
    case "senang":
      return line("M-1 0.8 L0 -0.5 L1 0.8");
    case "kaget":
      return <rect x={-0.95} y={-2.1} width={1.9} height={4.2} fill={fill} />;
    case "malu":
      return line(`M${-0.7 * m} -1.1 L${0.7 * m} 0 L${-0.7 * m} 1.1`);
    case "sedih":
      return <rect x={-0.75} y={-0.4} width={1.5} height={1.9} fill={fill} />;
    case "marah":
      return <polygon points={`${-1 * m},-0.9 ${1 * m},0.1 ${1 * m},1.4 ${-1 * m},1.4`} fill={fill} />;
    case "bingung":
      return side === -1 ? (
        <rect x={-0.6} y={-0.6} width={1.2} height={1.2} fill={fill} />
      ) : (
        <rect x={-0.95} y={-1.7} width={1.9} height={3.4} fill={fill} />
      );
    case "mikir":
      return <rect x={-0.8} y={-1.7} width={1.6} height={1.1} fill={fill} />;
    case "kesal":
      return <polygon points={`${-1 * m},-0.3 ${1 * m},0.5 ${1 * m},1.3 ${-1 * m},1.3`} fill={fill} />;
    case "serius":
      return <rect x={-1} y={-0.4} width={2} height={0.9} fill={fill} />;
    case "mataTertutup":
      return <rect x={-1} y={-0.2} width={2} height={0.55} fill={fill} />;
    default:
      return <rect x={-0.75} y={-1.425} width={1.5} height={2.85} fill={fill} />;
  }
};
