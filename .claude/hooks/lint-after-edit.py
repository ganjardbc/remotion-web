#!/usr/bin/env python3
"""PostToolUse (Edit|Write): jalankan eslint pada berkas src/*.ts(x) yang baru diubah.

Cepat (satu berkas). Kesalahan ditampilkan ke Claude lewat stderr dengan kode keluar 2. tsc dan validator penuh tetap lewat
`npm run lint`.
"""
import json
import os
import subprocess
import sys

path = json.load(sys.stdin).get("tool_input", {}).get("file_path", "") or ""
root = os.environ.get("CLAUDE_PROJECT_DIR") or os.getcwd()
if not (path.endswith(".ts") or path.endswith(".tsx")) or "/src/" not in path or not os.path.isfile(path):
    sys.exit(0)

r = subprocess.run(["npx", "eslint", "--quiet", path], cwd=root, capture_output=True, text=True, timeout=120)
if r.returncode != 0:
    sys.stderr.write((r.stdout + r.stderr).strip()[:3000] + "\n")
    sys.exit(2)
sys.exit(0)
