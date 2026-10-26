import type React from "react";
import { Composition, Folder } from "remotion";
import { CharacterSheet } from "../../assets/characters";
import { DUO_DEMO_FRAMES, DuoDemo } from "./duo/DuoDemo";
import { GANJAR_DEMO_FRAMES, GanjarDemo } from "./ganjar/GanjarDemo";
import { GANJAR_BLOCK_DEMO_FRAMES, GanjarBlockDemo, GanjarBlockStill } from "./ganjar/GanjarBlockDemo";
import { GanjarStill } from "./ganjar/GanjarStill";
import { ROBOT_BLOCK_DEMO_FRAMES, RobotBlockDemo, RobotBlockStill } from "./robot/RobotBlockDemo";
import { ROBOT_DEMO_FRAMES, RobotDemo } from "./robot/RobotDemo";
import { ROBOT_STICKMAN_DEMO_FRAMES, RobotStickmanDemo, RobotStickmanStill } from "./robot/RobotStickmanDemo";
import { STICKMAN_DEMO_FRAMES, StickmanDemo, StickmanHair, StickmanPlain, StickmanStill } from "./stickman/StickmanDemo";

// Semua demo berukuran vertikal 1080x1920, 30 fps. `frames` = 1 berarti gambar diam.
const Clip: React.FC<{ readonly id: string; readonly component: React.FC; readonly frames?: number }> = ({
  id,
  component,
  frames = 1,
}) => <Composition id={id} component={component} durationInFrames={frames} fps={30} width={1080} height={1920} />;

// Menu Studio per karakter: Ganjar, Robot, Stickman, Duo; di dalamnya per varian.
// Terdaftar di src/Root.tsx (folder Characters), atau lewat entry sendiri: index.ts.
export const RigDemoRoot: React.FC = () => (
  <>
    <Composition id="CharacterSheet" component={CharacterSheet} durationInFrames={90} fps={30} width={1920} height={1080} />
    <Folder name="Ganjar">
      <Folder name="Rig-2D">
        <Clip id="GanjarStill" component={GanjarStill} />
        <Clip id="GanjarRig" component={GanjarDemo} frames={GANJAR_DEMO_FRAMES} />
      </Folder>
      <Folder name="Block">
        <Clip id="GanjarBlockStill" component={GanjarBlockStill} />
        <Clip id="GanjarBlock" component={GanjarBlockDemo} frames={GANJAR_BLOCK_DEMO_FRAMES} />
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
        <Clip id="RobotStickmanStill" component={RobotStickmanStill} />
        <Clip id="RobotStickman" component={RobotStickmanDemo} frames={ROBOT_STICKMAN_DEMO_FRAMES} />
      </Folder>
    </Folder>
    <Folder name="Stickman">
      <Clip id="StickmanStill" component={StickmanStill} />
      <Clip id="StickmanHair" component={StickmanHair} />
      <Clip id="StickmanPlain" component={StickmanPlain} />
      <Clip id="Stickman" component={StickmanDemo} frames={STICKMAN_DEMO_FRAMES} />
    </Folder>
    <Folder name="Duo">
      <Clip id="DuoRig" component={DuoDemo} frames={DUO_DEMO_FRAMES} />
    </Folder>
  </>
);
