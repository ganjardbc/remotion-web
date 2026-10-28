import type React from "react";
import { Composition, Folder } from "remotion";
import { BackdropCycle, BackdropsMatrix } from "../../assets/backdrops";
import { SHOT_REEL_FRAMES, ShotReel, WORKSPACE_TOUR_FRAMES, WorkspaceTour } from "../../assets/camera";
import { LAPTOP_BEHIND_FRAMES, LaptopBehindDemo, SCREENS_DEMO_FRAMES, ScreensDemo } from "../../assets/screens";
import { WorkspaceCycle, WorkspaceTimes, WorkspaceTyping } from "../../assets/backdrops/workspace";
import { CharacterSheet } from "../../assets/characters";
import { GANJAR_DEMO_FRAMES, GanjarDemo } from "../../assets/characters/ganjar/demo/GanjarDemo";
import { GANJAR_BLOCK_DEMO_FRAMES, GanjarBlockDemo, GanjarBlockStill } from "../../assets/characters/ganjar/demo/GanjarBlockDemo";
import { GanjarStill } from "../../assets/characters/ganjar/demo/GanjarStill";
import {
  GANJAR_STICKMAN_DEMO_FRAMES,
  GanjarStickmanDemo,
  GanjarStickmanExpressions,
  GanjarStickmanGestures,
  GanjarStickmanHair,
  GanjarStickmanPlain,
  GanjarStickmanStill,
  GanjarStickmanTalking,
  RobotStickmanGestures,
} from "../../assets/characters/ganjar/demo/GanjarStickmanDemo";
import { ROBOT_BLOCK_DEMO_FRAMES, RobotBlockDemo, RobotBlockStill } from "../../assets/characters/robot/demo/RobotBlockDemo";
import { ROBOT_DEMO_FRAMES, RobotDemo } from "../../assets/characters/robot/demo/RobotDemo";
import { ROBOT_STICKMAN_DEMO_FRAMES, RobotStickmanDemo, RobotStickmanStill } from "../../assets/characters/robot/demo/RobotStickmanDemo";

import {
  CLAUDE_CODE_DEMO_FRAMES,
  CLAUDE_CODE_VARIANT_DEMO_FRAMES,
  ClaudeCodeBlockDemo,
  ClaudeCodeBlockStill,
  ClaudeCodeDemo,
  ClaudeCodeStickmanDemo,
  ClaudeCodeStickmanStill,
  ClaudeCodeStill,
} from "../../assets/characters/claudecode/demo/ClaudeCodeDemo";

// Semua demo berukuran vertikal 1080x1920, 30 fps. `frames` = 1 berarti gambar diam.
const Clip: React.FC<{ readonly id: string; readonly component: React.FC; readonly frames?: number }> = ({
  id,
  component,
  frames = 1,
}) => <Composition id={id} component={component} durationInFrames={frames} fps={30} width={1080} height={1920} />;

// Menu Studio per karakter: Ganjar, Robot; di dalamnya per varian.
// Terdaftar di src/Root.tsx (folder Characters), atau lewat entry sendiri: index.ts.
export const RigDemoRoot: React.FC = () => (
  <>
    <Composition id="CharacterSheet" component={CharacterSheet} durationInFrames={90} fps={30} width={1920} height={1080} />
    <Folder name="Kamera">
      <Composition id="WorkspaceTour" component={WorkspaceTour} durationInFrames={WORKSPACE_TOUR_FRAMES} fps={30} width={1920} height={1080} />
      <Composition id="ShotReel" component={ShotReel} durationInFrames={SHOT_REEL_FRAMES} fps={30} width={1920} height={1080} />
    </Folder>
    <Folder name="Layar">
      <Composition id="ScreensDemo" component={ScreensDemo} durationInFrames={SCREENS_DEMO_FRAMES} fps={30} width={1920} height={1080} />
      <Composition id="LaptopBehindDemo" component={LaptopBehindDemo} durationInFrames={LAPTOP_BEHIND_FRAMES} fps={30} width={1920} height={1080} />
    </Folder>
    <Folder name="Latar">
      <Composition id="BackdropsMatrix" component={BackdropsMatrix} durationInFrames={90} fps={30} width={1920} height={1080} />
      <Composition id="BackdropCycle" component={BackdropCycle} durationInFrames={150} fps={30} width={1080} height={1920} />
      <Composition id="BackdropCycleSketsa" component={BackdropCycle} durationInFrames={150} fps={30} width={1080} height={1920} defaultProps={{ style: "sketsa" as const }} />
      <Composition id="WorkspaceTimes" component={WorkspaceTimes} durationInFrames={90} fps={30} width={1920} height={1080} />
      <Composition id="WorkspaceTyping" component={WorkspaceTyping} durationInFrames={90} fps={30} width={1080} height={1920} />
      <Composition id="WorkspaceCycle" component={WorkspaceCycle} durationInFrames={150} fps={30} width={1080} height={1920} />
    </Folder>
    <Folder name="Ganjar">
      <Folder name="Rig-2D">
        <Clip id="GanjarStill" component={GanjarStill} />
        <Clip id="GanjarRig" component={GanjarDemo} frames={GANJAR_DEMO_FRAMES} />
      </Folder>
      <Folder name="Block">
        <Clip id="GanjarBlockStill" component={GanjarBlockStill} />
        <Clip id="GanjarBlock" component={GanjarBlockDemo} frames={GANJAR_BLOCK_DEMO_FRAMES} />
      </Folder>
      <Folder name="Stickman">
        <Clip id="GanjarStickmanExpressions" component={GanjarStickmanExpressions} />
        <Clip id="GanjarStickmanGestures" component={GanjarStickmanGestures} />
        <Clip id="GanjarStickmanTalking" component={GanjarStickmanTalking} frames={60} />
        <Clip id="GanjarStickmanStill" component={GanjarStickmanStill} />
        <Clip id="GanjarStickmanHair" component={GanjarStickmanHair} />
        <Clip id="GanjarStickmanPlain" component={GanjarStickmanPlain} />
        <Clip id="GanjarStickman" component={GanjarStickmanDemo} frames={GANJAR_STICKMAN_DEMO_FRAMES} />
      </Folder>
    </Folder>
    <Folder name="Robot">
      <Folder name="Rig-2D">
        <Clip id="RobotRig" component={RobotDemo} frames={ROBOT_DEMO_FRAMES} />
      </Folder>
      <Folder name="Block">
        <Clip id="RobotBlockStill" component={RobotBlockStill} />
        <Clip id="RobotBlock" component={RobotBlockDemo} frames={ROBOT_BLOCK_DEMO_FRAMES} />
      </Folder>
      <Folder name="Stickman">
        <Clip id="RobotStickmanGestures" component={RobotStickmanGestures} />
        <Clip id="RobotStickmanStill" component={RobotStickmanStill} />
        <Clip id="RobotStickman" component={RobotStickmanDemo} frames={ROBOT_STICKMAN_DEMO_FRAMES} />
      </Folder>
    </Folder>
    <Folder name="ClaudeCode">
      <Folder name="Rig-2D">
        <Clip id="ClaudeCodeStill" component={ClaudeCodeStill} />
        <Clip id="ClaudeCodeRig" component={ClaudeCodeDemo} frames={CLAUDE_CODE_DEMO_FRAMES} />
      </Folder>
      <Folder name="Block">
        <Clip id="ClaudeCodeBlockStill" component={ClaudeCodeBlockStill} />
        <Clip id="ClaudeCodeBlock" component={ClaudeCodeBlockDemo} frames={CLAUDE_CODE_VARIANT_DEMO_FRAMES} />
      </Folder>
      <Folder name="Stickman">
        <Clip id="ClaudeCodeStickmanStill" component={ClaudeCodeStickmanStill} />
        <Clip id="ClaudeCodeStickman" component={ClaudeCodeStickmanDemo} frames={CLAUDE_CODE_VARIANT_DEMO_FRAMES} />
      </Folder>
    </Folder>
  </>
);
