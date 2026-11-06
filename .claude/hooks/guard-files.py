#!/usr/bin/env python3
"""PreToolUse (Edit|Write): jaga file yang dikelola skrip, rahasia, atau sudah final.

- .env.local: ditolak (API key ElevenLabs).
- voiceover.json, voiceover-files.ts, voiceover/*.mp3: dikelola scripts/vo-process.mjs, minta konfirmasi.
- src/assets/characters/ganjar/: tampilan Ganjar final, minta konfirmasi (CLAUDE.md).
"""
import json
import sys

path = json.load(sys.stdin).get("tool_input", {}).get("file_path", "") or ""

DENY = [(".env.local", "berisi API key; jangan diubah lewat Claude")]
ASK = [
    ("/voiceover.json", "dikelola scripts/vo-process.mjs, jangan diubah tangan"),
    ("/voiceover-files.ts", "dikelola scripts/vo-process.mjs, jangan diubah tangan"),
    ("/voiceover/", "klip suara hasil olahan vo-process; olah ulang lewat skrip"),
    ("/assets/characters/ganjar/", "tampilan Ganjar sudah final; ubah hanya dengan persetujuan Ganjar"),
]

for needle, why in DENY:
    if path.endswith(needle) or needle in path.split("/")[-1]:
        print(f"Diblokir: {path} ({why}).", file=sys.stderr)
        sys.exit(2)

for needle, why in ASK:
    if needle in path:
        print(
            json.dumps(
                {
                    "hookSpecificOutput": {
                        "hookEventName": "PreToolUse",
                        "permissionDecision": "ask",
                        "permissionDecisionReason": f"{path}: {why}.",
                    }
                }
            )
        )
        sys.exit(0)
sys.exit(0)
