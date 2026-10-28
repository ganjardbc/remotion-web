import { blendTimes, characterFilter, type TimeOfDay } from "../shared";
import { WORKSPACE_DAY, WORKSPACE_MALAM, WORKSPACE_SORE, type WorkspacePalette } from "./palette";

export { characterFilter, type TimeOfDay };

export const WORKSPACE_TIMES: Record<TimeOfDay, WorkspacePalette> = {
  siang: WORKSPACE_DAY,
  sore: WORKSPACE_SORE,
  malam: WORKSPACE_MALAM,
};

// Nama waktu atau angka 0..1 (siang 0, sore 0.5, malam 1) menjadi palet.
export const workspacePalette = (time: TimeOfDay | number): WorkspacePalette => blendTimes(WORKSPACE_TIMES, time);
