import type { Expression } from "./shared/expressions";
import type { CharacterProps, PropDrivenProps } from "./shared/props";
import type {
  ClaudeCodeBlockProps,
  ClaudeCodeProps,
  ClaudeCodeStickmanProps,
  GanjarBlockExpression,
  GanjarBlockProps,
  GanjarExpression,
  GanjarProps,
  GanjarStickmanExpression,
  GanjarStickmanProps,
  RobotBlockProps,
  RobotExpression,
  RobotProps,
  RobotStickmanProps,
} from "./index";

// Cek tipe saja (tanpa runtime): kompilasi gagal bila ada varian yang belum menerima semua ekspresi kanonis.
type Covers<Variant> = Expression extends Variant ? true : never;

export const EXPRESSION_CONTRACT: [
  Covers<GanjarExpression>,
  Covers<GanjarBlockExpression>,
  Covers<GanjarStickmanExpression>,
  Covers<RobotExpression>,
] = [true, true, true, true];

// Props bersama: semua varian harus menerima `CharacterProps`, dan block/stickman juga `PropDrivenProps`.
type Accepts<Props, Shared> = Shared extends Props ? true : never;

export const PROPS_CONTRACT: [
  Accepts<GanjarProps, CharacterProps<GanjarExpression>>,
  Accepts<RobotProps, CharacterProps<RobotExpression>>,
  Accepts<ClaudeCodeProps, CharacterProps<RobotExpression>>,
  Accepts<GanjarBlockProps, PropDrivenProps<GanjarBlockExpression>>,
  Accepts<RobotBlockProps, PropDrivenProps<RobotExpression>>,
  Accepts<ClaudeCodeBlockProps, PropDrivenProps<RobotExpression>>,
  Accepts<GanjarStickmanProps, PropDrivenProps<GanjarStickmanExpression>>,
  Accepts<RobotStickmanProps, PropDrivenProps<RobotExpression>>,
  Accepts<ClaudeCodeStickmanProps, PropDrivenProps<RobotExpression>>,
] = [true, true, true, true, true, true, true, true, true];
