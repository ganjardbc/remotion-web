// Latar ruang kerja berjangkar. Impor dari sini, bukan dari file di dalamnya.
export { Chair, Clock as WorkspaceClock, Desk, Laptop, Mug, RoomBack, Window as WorkspaceWindow, type WorkspaceProps } from "./Workspace";
export { PORTRAIT_ANCHORS, type WorkspaceAnchors } from "./anchors";
export { WORKSPACE_DAY, type WorkspacePalette } from "./palette";
export { WORKSPACE_MALAM, WORKSPACE_SORE } from "./palette";
export { characterFilter, workspacePalette, WORKSPACE_TIMES, type TimeOfDay } from "./time";
export { WorkspaceCycle, WorkspaceScene, WorkspaceTimes, WorkspaceTyping } from "./WorkspaceSheet";
export { DeskPlant, GlowLaptop } from "./DeskProps";
