#!/usr/bin/env python3
"""Mengolah satu klip voice over hasil ElevenLabs menjadi berkas siap pakai dan mencatatnya di manifest.

    python3 scripts/vo-process.py <id-baris> <berkas-mentah.mp3> --hash <hash> [--video VueTutorial]

Langkah: potong senyap di awal dan akhir (ambang -45 dB, sisakan 60 ms), samakan kenyaringan (loudnorm -16 LUFS,
puncak -1,5 dB), simpan sebagai mp3 mono ke src/videos/<video>/voiceover/<id>.mp3, ukur durasi, tulis
src/videos/<video>/voiceover.json, lalu buat ulang src/videos/<video>/voiceover-files.ts (impor tiap mp3, dipakai
voiceover.ts). Aset ada di folder video, bukan public/, jadi ikut dibundel Remotion. <hash> dari `node scripts/vo-lines.mjs` (kolom hash baris itu).
Butuh ffmpeg dan ffprobe.
"""
import argparse
import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

ap = argparse.ArgumentParser()
ap.add_argument("id")
ap.add_argument("raw")
ap.add_argument("--hash", required=True)
ap.add_argument("--video", default="VueTutorial", help="nama folder di src/videos")
a = ap.parse_args()

VIDEO = ROOT / "src/videos" / a.video
MANIFEST = VIDEO / "voiceover.json"

raw = Path(a.raw)
if not raw.is_file():
    sys.exit(f"berkas tidak ada: {raw}")
dst = VIDEO / "voiceover" / f"{a.id}.mp3"
dst.parent.mkdir(parents=True, exist_ok=True)

# silenceremove dua kali (awal, lalu balik untuk akhir) agar ujung bersih; ambang -45 dB.
trim = "silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.06,areverse,silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.06,areverse"
chain = f"{trim},loudnorm=I=-16:TP=-1.5:LRA=11"
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(raw), "-af", chain, "-ac", "1", "-ar", "44100", "-codec:a", "libmp3lame", "-b:a", "128k", str(dst)], check=True)
dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(dst)], check=True, capture_output=True, text=True).stdout.strip())

data = json.loads(MANIFEST.read_text()) if MANIFEST.exists() else {"lines": {}}
data["lines"][a.id] = {"hash": a.hash, "file": f"voiceover/{a.id}.mp3", "duration": round(dur, 2)}
data["lines"] = dict(sorted(data["lines"].items()))
MANIFEST.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n")

# Impor statis tiap mp3 agar bundler Remotion memberi URL-nya (dibaca voiceover.ts lewat VO_FILES).
ids = sorted(data["lines"])
names = {i: "f" + str(n) for n, i in enumerate(ids)}
lines = ["// Dibuat otomatis oleh scripts/vo-process.py. Jangan diubah tangan."]
lines += [f'import {names[i]} from "./voiceover/{i}.mp3";' for i in ids]
lines += ["", "export const VO_FILES: Readonly<Record<string, string>> = {"]
lines += [f'  "{i}": {names[i]},' for i in ids]
lines += ["};", ""]
(VIDEO / "voiceover-files.ts").write_text("\n".join(lines))
print(f"ok {a.id}: {dur:.2f} dtk -> {dst.relative_to(ROOT)}")
