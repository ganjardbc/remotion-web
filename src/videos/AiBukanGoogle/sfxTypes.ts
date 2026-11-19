// Jenis efek suara dan penanda waktunya, dipakai data scene dan penyaji SFX.
export type SfxEvent = "pop_ganjar" | "pop_claude" | "typing" | "whoosh" | "scratch" | "boing" | "sad" | "rimshot" | "ding";

// `at` dalam detik waktu scene.
export type SfxCue = { readonly at: number; readonly event: SfxEvent; readonly volume?: number };
