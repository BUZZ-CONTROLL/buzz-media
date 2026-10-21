"""Energetic tech-house track (30 s, 120 BPM, F minor) for the BUZZ24 reel.
Cuts: 3.0 7.0 12.0 17.0 21.0 26.0 | build 24.5-26.0 | drop into CTA at 26.0
"""
import numpy as np
import styles as S
from styles import Mix, filt, saw, sq, sine, t_arr, note, SR

DUR = 30.0
S.DUR = DUR
S.N = int(SR * DUR)
BEAT = 0.5
CUTS = [3.0, 7.0, 12.0, 17.0, 21.0, 26.0]
m = Mix(77)


def kick():
    t = t_arr(0.42)
    f = 50 + 140 * np.exp(-t * 35)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 7.5)
    click = filt(m.noise(0.42), 2500, "high") * np.exp(-t * 400) * 0.5
    return np.tanh((s + click) * 2.2)


def rolling_bass(f0, d=0.12):
    t = t_arr(d)
    s = saw(f0, d) * 0.7 + sq(f0 / 2, d) * 0.4
    s = filt(s, 380, order=3)
    return np.tanh(s * np.minimum(1, t / 0.003) * np.exp(-t * 14) * 2.2)


def stab(fs, d=0.22, bright=2600):
    t = t_arr(d)
    s = sum(saw(f * (1 + det), d) for f in fs for det in (-0.006, 0.006)) / (2 * len(fs))
    return filt(s, bright) * np.minimum(1, t / 0.003) * np.exp(-t * 11) * 1.6


def perc_hat(open_=False):
    return S.hat(m, open_)


def beep(f0=1760, d=0.12):
    t = t_arr(d)
    return sine(f0, d) * np.minimum(1, t / 0.002) * np.exp(-t * 18) * 0.6


def scan_sweep(d=0.67):
    t = t_arr(d)
    f = 900 + 1800 * (t / d)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.25 * (0.5 + 0.5 * np.sin(2 * np.pi * 18 * t))


def success():
    out = np.zeros(int(SR * 0.9))
    for k, n in enumerate([76, 81, 88]):
        t = t_arr(0.9 - k * 0.07)
        s = (sine(note(n), len(t) / SR) + 0.3 * sine(note(n) * 2, len(t) / SR)) * np.exp(-t * 5)
        i = int(k * 0.07 * SR)
        out[i : i + len(s)] += s * 0.4
    return out


CH = [(53, 56, 60), (49, 53, 56), (56, 60, 63), (51, 55, 58)]  # Fm Db Ab Eb
ROOT = [41, 37, 44, 39]

for bar in range(15):
    t0 = bar * 2.0
    if t0 >= DUR:
        break
    ch = CH[bar % 4]
    intro = t0 < 3.0
    build = 24.5 <= t0 + 2 and t0 < 26.0
    for b in range(4):
        tb = t0 + b * BEAT
        if tb >= DUR - 0.05:
            continue
        no_kick = 25.0 <= tb < 26.0 or tb >= 29.0
        if not no_kick:
            m.add(kick(), tb, 0.8)
        if b in (1, 3) and not (24.5 <= tb < 26.0):
            m.add(S.clap(m), tb, 0.42, 0, rev=0.25)
        # hats: offbeat open + 16th closed
        m.add(perc_hat(True), tb + BEAT / 2, 0.14 if not intro else 0.08, 0.25)
        if not intro:
            for k in (1, 3):
                m.add(perc_hat(), tb + k * BEAT / 4, 0.08, -0.25)
        # rolling bass 16ths (skip the downbeat for pump)
        if not intro and not (25.0 <= tb < 26.0):
            for k in (1, 2, 3):
                m.add(rolling_bass(note(ROOT[bar % 4] - 12)), tb + k * BEAT / 4, 0.42)
    # chord stabs on the "and" of 1 and 3 after the hook
    if t0 >= 3.0 and not (24.0 <= t0 < 26.0):
        for at in (0.25 + 0.5 * 0, 0.75, 1.25, 1.75):
            m.add(stab([note(n + 12) for n in ch]), t0 + at, 0.16, 0.2, rev=0.35)
    # pad bed
    pad = sum(saw(note(n) * (1 + d), 2.0) for n in ch for d in (-0.004, 0.004)) / 6
    pad = filt(pad, 900) * np.minimum(1, t_arr(2.0) / 0.3) * np.minimum(1, (2.0 - t_arr(2.0)) / 0.3)
    m.add(pad, t0, 0.12, 0, rev=0.5)

# lead hook melody in CTA
mel = [72, 75, 77, 80, 77, 75, 72, 70]
for i, n in enumerate(mel):
    m.add(stab([note(n + 12)], 0.3, 4000), 26.0 + i * 0.5, 0.22, 0.15 if i % 2 else -0.15, rev=0.4)

# ---------- sync FX ----------
m.add(S.whoosh(m, 0.85, True), 0.0, 0.4)            # ring spins in
m.add(S.impact(m, 1.4, 40), 0.0, 0.7)
m.add(S.impact(m, 1.2, 45), 0.6, 0.6)              # 24/7 appears
m.add(S.crash(m, 1.5), 0.87, 0.25, 0, rev=0.3)
for c in CUTS:
    m.add(S.whoosh(m, 0.3, False), c, 0.28)
    m.add(S.crash(m, 1.4), c, 0.18, 0, rev=0.3)
for s in [3.27, 4.27, 5.27]:                       # access steps
    m.add(beep(1568), s, 0.35)
m.add(scan_sweep(), 5.4, 0.5)                      # QR scan
m.add(success(), 6.07, 0.6, 0, rev=0.4)            # Zutritt frei
for i, s in enumerate([7.87, 8.37, 8.87, 9.37]):   # hygiene checks
    m.add(beep(1760 + i * 220, 0.15), s, 0.3, -0.2 + 0.13 * i, rev=0.3)
for i, s in enumerate([12.53, 12.83, 13.13, 13.43, 13.73]):  # equipment tiles pop
    m.add(S.impact(m, 0.35, 70 + i * 6), s, 0.25)
for s in [17.6, 18.0]:
    m.add(S.whoosh(m, 0.25, True), s - 0.2, 0.2)
tt = 21.53                                          # price count-up ticks
while tt < 22.9:
    m.add(S.tick(m), tt, 0.3)
    tt += 0.05
m.add(beep(2093, 0.2), 22.27, 0.35)
m.add(beep(2349, 0.2), 22.87, 0.35)
# build into CTA
m.add(S.whoosh(m, 1.5, True), 24.5, 0.55)
roll = 24.5
while roll < 25.98:
    gap = 0.25 if roll < 25.0 else (0.125 if roll < 25.5 else 0.0625)
    m.add(S.snare(m, 0.18, 220), roll, 0.12 + 0.3 * (roll - 24.5) / 1.5, 0, rev=0.2)
    roll += gap
m.add(S.impact(m, 2.0, 32), 26.0, 1.0)
m.add(S.whoosh(m, 1.0, True), 26.0, 0.3)          # logo ring spin
m.add(success(), 27.2, 0.4, 0, rev=0.4)            # button

m.render("buzz24_music.wav", 1.4, 0.3)
