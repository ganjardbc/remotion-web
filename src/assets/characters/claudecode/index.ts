// Karakter Claude Code: rig 2D, block 3D, dan stickman. Impor dari barrel characters/, bukan dari subfolder.
export { ClaudeCode, CLAUDE_CODE_EXPRESSIONS, claudeCodeSize, type ClaudeCodeProps } from "./rig/ClaudeCode";
export { RIG_VIEWBOX as CLAUDE_CODE_VIEWBOX } from "./rig/ClaudeCodeRig";
export { ClaudeCodeBlock, CLAUDE_CODE_BLOCK_EXPRESSIONS, claudeCodeBlockSize, type ClaudeCodeBlockProps } from "./block/ClaudeCodeBlock";
export {
  ClaudeCodeStickman,
  CLAUDE_CODE_STICKMAN_EXPRESSIONS,
  claudeCodeStickmanSize,
  type ClaudeCodeStickmanProps,
} from "./stickman/ClaudeCodeStickman";
export { CLAUDE_CODE_COLORS } from "./palette";
