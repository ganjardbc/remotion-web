#!/usr/bin/env python3
"""Membuat musik latar lo-fi untuk video VueTutorial: public/music/vue_bed.mp3.

Dibuat murni dari sintesis (sinus, derau) dengan numpy, jadi bebas lisensi. Loop 16 birama (±44 dtk, 88 BPM) dengan
progresi Am9 - Fmaj9 - Cmaj7 - G6/9, bass, kick, snare, hat berayun, dan melodi pentatonik jarang. Ekor suara
dilipat ke awal supaya loop mulus. Jalankan: python3 scripts/make-vue-bed.py (butuh numpy dan ffmpeg).
"""
import subprocess
import tempfile
import wave
from pathlib import Path

import numpy as np

SR = 32000
BPM = 88
BEAT = 60 / BPM
BAR = BEAT * 4
BARS = 16
TOTAL = BAR * BARS
rng = np.random.default_rng(7)

buf = np.zeros(int((TOTAL + 3) * SR))


def hz(midi: float) -> float:
    return 440.0 * 2 ** ((midi - 69) / 12)


def add(start: float, sig: np.ndarray, gain: float = 1.0) -> None:
    i = int(start * SR)
    j = min(len(buf), i + len(sig))
    buf[i:j] += sig[: j - i] * gain


def env(n: int, attack: float, release: float) -> np.ndarray:
    e = np.ones(n)
    a = max(1, int(attack * SR))
    r = max(1, int(release * SR))
    e[:a] = np.linspace(0, 1, a)
    e[-r:] *= np.linspace(1, 0, r)
    return e


def tone(freq: float, dur: float, harm=(1.0, 0.28, 0.1)) -> np.ndarray:
    t = np.arange(int(dur * SR)) / SR
    return sum(w * np.sin(2 * np.pi * freq * (k + 1) * t) for k, w in enumerate(harm))


# Akor per birama (nada MIDI) dan bass akar.
CHORDS = [
    ([57, 60, 64, 67, 71], 45),  # Am9
    ([53, 57, 60, 64, 67], 41),  # Fmaj9
    ([60, 64, 67, 71], 48),  # Cmaj7
    ([55, 59, 62, 64, 69], 43),  # G6/9
]

for bar in range(BARS):
    notes, root = CHORDS[bar % 4]
    t0 = bar * BAR
    # Pad: tiap nada sedikit disetel berbeda, naik pelan dan turun panjang.
    for n in notes:
        for detune in (-0.04, 0.04):
            sig = tone(hz(n + detune), BAR + 0.9) * env(int((BAR + 0.9) * SR), 0.5, 1.0)
            add(t0, sig, 0.045)
    # Bass pada ketukan 1 dan 3.
    for b in (0, 2):
        d = BEAT * 1.8
        sig = tone(hz(root), d, (1.0, 0.2)) * env(int(d * SR), 0.01, 0.5)
        add(t0 + b * BEAT, sig, 0.22)
    for beat in range(4):
        tb = t0 + beat * BEAT
        if beat in (0, 2):  # kick
            n = int(0.28 * SR)
            f = np.linspace(130, 45, n)
            k = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-np.arange(n) / (0.07 * SR))
            add(tb, k, 0.5)
        if beat in (1, 3):  # snare lembut
            n = int(0.16 * SR)
            s = rng.standard_normal(n) * np.exp(-np.arange(n) / (0.035 * SR))
            s = np.convolve(s, [1, -1], mode="same")
            add(tb, s, 0.12)
        for half in (0, 1):  # hat 8 berayun
            off = tb + half * BEAT / 2 + (0.05 * BEAT if half else 0)
            n = int(0.05 * SR)
            h = np.convolve(rng.standard_normal(n), [1, -1], mode="same") * np.exp(-np.arange(n) / (0.012 * SR))
            add(off, h, 0.05 if half else 0.035)

# Melodi pentatonik A minor, jarang, pola tetap dari rng berbenih.
PENTA = [69, 72, 74, 76, 79]
for bar in range(BARS):
    if bar % 4 == 3 and bar != BARS - 1:
        continue
    for slot in (1.5, 3.0):
        if rng.random() < 0.55:
            n = PENTA[rng.integers(0, len(PENTA))]
            d = BEAT * 0.9
            sig = tone(hz(n), d, (1.0, 0.15)) * np.exp(-np.arange(int(d * SR)) / (0.22 * SR))
            add(bar * BAR + slot * BEAT, sig, 0.07)

# Lipat ekor ke awal agar loop mulus, lalu normalkan.
n_loop = int(TOTAL * SR)
out = buf[:n_loop].copy()
tail = buf[n_loop:]
out[: len(tail)] += tail
out /= np.max(np.abs(out)) / 0.55

dst = Path(__file__).resolve().parent.parent / "public" / "music" / "vue_bed.mp3"
dst.parent.mkdir(parents=True, exist_ok=True)
with tempfile.TemporaryDirectory() as d:
    wav = Path(d) / "bed.wav"
    with wave.open(str(wav), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((out * 32767).astype(np.int16).tobytes())
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(wav), "-codec:a", "libmp3lame", "-b:a", "96k", str(dst)], check=True)
print(f"ok: {dst} ({TOTAL:.1f} dtk)")
