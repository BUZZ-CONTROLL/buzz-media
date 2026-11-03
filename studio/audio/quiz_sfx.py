"""Countdown-Ticks + Auflösungs-Ding für das Quiz-Format (CrazyInteractive). 18.87 s, 48 kHz Stereo.
Usage: python3 quiz_sfx.py <out.wav>"""
import sys
import numpy as np
from scipy.io import wavfile
SR = 48000
N = int(SR * 18.87)
x = np.zeros(N)
def add(t, sig):
    i = int(t * SR); x[i:i + len(sig)] += sig[: N - i]
tt = np.arange(int(0.08 * SR)) / SR
tick = np.sin(2 * np.pi * 1800 * tt) * np.exp(-tt * 60) * 0.5
for k in range(5):
    add(2.5 + k, tick * (1 + 0.15 * k))
td = np.arange(int(0.9 * SR)) / SR
ding = (np.sin(2 * np.pi * 1318.5 * td) + 0.6 * np.sin(2 * np.pi * 1975.5 * td) + 0.3 * np.sin(2 * np.pi * 2637 * td)) * np.exp(-td * 5) * 0.35
add(7.5, ding)
wavfile.write(sys.argv[1], SR, (np.stack([x, x], 1) * 32767).clip(-32767, 32767).astype(np.int16))
