// Aset karakter project, dikelompokkan per karakter. Impor dari sini, bukan dari subfolder.

// Ganjar
export { Ganjar, GANJAR_EXPRESSIONS, ganjarSize, type GanjarProps } from "./ganjar/Ganjar";
export { GanjarBlock, GANJAR_BLOCK_EXPRESSIONS, ganjarBlockSize, type GanjarBlockProps, type GanjarBlockExpression } from "./ganjar/block/GanjarBlock";
export type { FaceKey as GanjarFaceKey, GanjarExpression, PlacedClip as GanjarClip } from "./ganjar/rig";
export { headTurn, point, startle } from "./ganjar/rig";

// Robot
export { Robot, ROBOT_EXPRESSIONS, robotSize, type RobotProps } from "./robot/Robot";
export { RobotBlock, ROBOT_BLOCK_EXPRESSIONS, robotBlockSize, type RobotBlockProps } from "./robot/block/RobotBlock";
export { RobotStickman, ROBOT_STICKMAN_EXPRESSIONS, robotStickmanSize, type RobotStickmanProps } from "./robot/stickman/RobotStickman";
export type { FaceKey as RobotFaceKey, RobotExpression } from "./robot/rig";
export type { PlacedClip as RobotClip } from "./robot/rig/clips";
export { armGesture, surprise, walk } from "./robot/rig";

// Stickman
export { Stickman, STICKMAN_EXPRESSIONS, GESTURES, stickmanSize, type StickmanProps, type StickmanExpression, type Gesture } from "./stickman/Stickman";

// Gabungan dan referensi
export { Duo, duoSize, type DuoProps } from "./Duo";
export { CharacterSheet } from "./CharacterSheet";
export type { LookKey } from "./shared/look";
