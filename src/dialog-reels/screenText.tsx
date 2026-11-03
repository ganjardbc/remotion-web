import type React from "react";
import type { DraftScene } from "./types";

// Teks layar: `*frasa*` jadi sorotan oranye (satu per layar).
export const withHighlight = (text: string, color: string): React.ReactNode =>
  text.split("*").map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} style={{ color }}>
        {part}
      </span>
    ) : (
      part
    ),
  );

export type Segment = { readonly text: string; readonly from: number };

// Teks layar per waktu: awal scene memakai `onScreenText`, lalu berganti di baris yang punya `screenText`.
export const screenSegments = (scene: DraftScene): readonly Segment[] => {
  const out: Segment[] = [{ text: scene.onScreenText, from: 0 }];
  for (const l of scene.lines) {
    const text = l.screenText;
    if (text !== undefined && text !== out[out.length - 1].text) out.push({ text, from: l.from });
  }
  return out;
};

