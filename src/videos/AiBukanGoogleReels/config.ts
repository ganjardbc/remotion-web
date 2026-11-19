import type { DraftMeta, VoEntry, VoSettings } from "../../dialog-reels";
import manifest from "./voiceover.json";

// Belajar AI #1: AI Bukan Google. Reels dialog 9:16, 30 fps, pemeran: ganjar, claudecode. Data scene dan baris ucapan ada di scenes.ts.
// Voiceover per baris ucapan (id baris = id scene + nomor urut, mis. hook-01), suara per karakter dari
// src/dialog-reels/voices.json. Selama voiceover.json kosong, durasi scene mengikuti perkiraan di scenes.ts.

export const META: DraftMeta = {
  title: "Belajar AI #1: AI Bukan Google",
  delivery: "dialog",
  style: "block",
  subtitle: "caption",
  shots: "bicara",
};

// Voiceover dialog: eleven_v4 membaca tag emosi `[tag]` per baris; speed bawaan model.
export const VO_SETTINGS: VoSettings = { model: "eleven_v4", speed: null };

export const CAPTION = "Google menemukan jawaban. AI membuat jawaban. Karena itu cara kamu bertanya menentukan hasilnya. Belajar AI #1 dari 15.";
export const HASHTAGS = ["#DeveloperIndonesia", "#AIForDeveloper", "#CareerDeveloper", "#ProgrammerIndonesia", "#TechMindset"] as const;

export const VO_MANIFEST: Readonly<Record<string, VoEntry>> = (manifest as { lines: Record<string, VoEntry> }).lines;
