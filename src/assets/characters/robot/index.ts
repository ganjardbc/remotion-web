// Karakter Robot: rig 2D, block 3D, dan stickman. Impor dari barrel characters/, bukan dari subfolder.
export { Robot, ROBOT_EXPRESSIONS, robotSize, type RobotProps } from "./rig/Robot";
export { RIG_VIEWBOX as ROBOT_VIEWBOX } from "./rig/RobotRig";
export { RobotBlock, ROBOT_BLOCK_EXPRESSIONS, robotBlockSize, type RobotBlockProps } from "./block/RobotBlock";
export { RobotStickman, ROBOT_STICKMAN_EXPRESSIONS, robotStickmanSize, type RobotStickmanProps } from "./stickman/RobotStickman";
export type { FaceKey as RobotFaceKey, RobotExpression } from "./rig";
export type { PlacedClip as RobotClip } from "./rig/clips";
export { armGesture, surprise, walk } from "./rig";
