import type { DraftMeta, VoEntry, VoSettings } from "../../dialog-reels";
import manifest from "./voiceover.json";

// Jago Dikit, Buka Kelas. Reels dialog 9:16, 30 fps, pemeran: ganjar, claudecode. Data scene dan baris ucapan ada di scenes.ts.
// Voiceover per baris ucapan (id baris = id scene + nomor urut, mis. hook-01), suara per karakter dari
// src/dialog-reels/voices.json. Selama voiceover.json kosong, durasi scene mengikuti perkiraan di scenes.ts.

export const META: DraftMeta = {
  title: "Jago Dikit, Buka Kelas",
  delivery: "dialog",
  style: "rig",
  subtitle: "caption",
  // Variasi: pop pendek tiap giliran bicara ganti, whoosh lebih rendah saat latar berganti, dan gerak diam halus pada karakter.
  speakerPop: true,
  whooshVariants: true,
  idleMotion: true,
};

// Voiceover dialog: eleven_v4 membaca tag emosi `[tag]` per baris (lihat scenes.ts); speed bawaan model, tidak dipercepat.
export const VO_SETTINGS: VoSettings = { model: "eleven_v4", speed: null };

export const CAPTION = "Bisa bikin pakai AI itu satu hal. Bisa ngajarin orang itu hal lain. Kamu di posisi yang mana?";
export const HASHTAGS = ["#DeveloperIndonesia", "#AIForDeveloper", "#CareerDeveloper", "#ProgrammerIndonesia", "#TechMindset"] as const;

export const VO_MANIFEST: Readonly<Record<string, VoEntry>> = (manifest as { lines: Record<string, VoEntry> }).lines;
