"""Calm, premium deep-house track (30 s, 120 BPM) for the BUZZ reel.
Sync points (seconds): 3.0 promise | 7.0 steps (beat drops in) | step changes 7.6/10.13/12.67/15.2
| 17.5 extras | 22.5 CTA / logo bloom | 30.0 end
"""
import numpy as np
import styles as S
from styles import Mix, filt, saw, sine, t_arr, note, SR

DUR = 30.0
S.DUR = DUR
S.N = int(SR * DUR)
BEAT = 0.5

m = Mix(44)


def rhodes(f, d=1.8):
    t = t_arr(d)
    mod = np.sin(2 * np.pi * f * 7 * t) * 1.3 * np.exp(-t * 6)  # FM bell attack
    s = np.sin(2 * np.pi * f * t + mod) + 0.25 * np.sin(2 * np.pi * 2 * f * t)
    trem = 1 + 0.08 * np.sin(2 * np.pi * 4.5 * t)
    return s * np.exp(-t * 1.4) * np.minimum(1, t / 0.004) * trem * 0.4


def pad(fs, d):
    t = t_arr(d)
    s = sum(saw(f * (1 + det), d) for f in fs for det in (-0.005, 0.0, 0.005)) / (3 * len(fs))
    s = filt(s, 1100)
    return s * np.minimum(1, t / 0.6) * np.minimum(1, (d - t) / 0.5)


def soft_kick():
    t = t_arr(0.4)
    f = 48 + 70 * np.exp(-t * 30)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 8) * 0.9


def sub(f, d):
    t = t_arr(d)
    return np.sin(2 * np.pi * f * t) * np.minimum(1, t / 0.01) * np.exp(-t * 3.5)


def shaker():
    n = m.noise(0.07)
    return filt(n, [5000, 12000], "band") * np.exp(-t_arr(0.07) * 60) * 0.9


def chime(f):
    t = t_arr(1.6)
    s = sine(f, 1.6) + 0.35 * sine(f * 2.0, 1.6) * np.exp(-t * 3) + 0.15 * sine(f * 3.01, 1.6) * np.exp(-t * 5)
    return s * np.exp(-t * 2.2) * 0.35


def swell(d):
    n = m.noise(d)
    t = np.linspace(0, 1, len(n))
    return filt(n, 2500) * t**2 * 0.5


# Fmaj7 – Am7 – Dm9 – Cmaj7 (warm, calm)
CH = [(53, 57, 60, 64), (57, 60, 64, 67), (50, 53, 57, 60, 64), (48, 52, 55, 59)]
ROOT = [41, 45, 38, 48]

for bar in range(15):
    t0 = bar * 2.0
    if t0 >= DUR:
        break
    ch = CH[bar % 4]
    beat_on = 7.0 <= t0 < 28.0
    m.add(pad([note(n) for n in ch], 2.05), t0, 0.16 if t0 < 7 else 0.2, 0, rev=0.6)
    # rhodes chord + offbeat comp
    for k, n in enumerate(ch):
        m.add(rhodes(note(n + 12)), t0 + k * 0.012, 0.15, -0.3 + 0.15 * k, rev=0.45)
    if t0 >= 3.0:
        for at in (0.75, 1.5):
            for k, n in enumerate(ch[:3]):
                m.add(rhodes(note(n + 12), 0.9), t0 + at + k * 0.01, 0.08, 0.2, rev=0.45)
    for b in range(4):
        tb = t0 + b * BEAT
        if tb >= DUR - 0.05:
            continue
        # shaker 16ths (soft) from 3 s
        if tb >= 3.0:
            for k in range(4):
                m.add(shaker(), tb + k * BEAT / 4, 0.05 if k % 2 == 0 else 0.08, 0.35)
        if beat_on:
            m.add(soft_kick(), tb, 0.55)
            # rim/clap-ish on 2 & 4
            if b in (1, 3):
                m.add(S.clap(m), tb, 0.12, 0, rev=0.4)
            # off-beat sub bass
            m.add(sub(note(ROOT[bar % 4]), 0.4), tb + BEAT / 2, 0.45)
            # open hat from extras section
            if tb >= 17.5:
                m.add(S.hat(m, True), tb + BEAT / 2, 0.07, -0.3)

# gentle pluck melody in the extras/CTA sections
mel = [76, 74, 72, 69, 72, 74, 76, 79]
for i, n in enumerate(mel * 3):
    at = 17.5 + i * 0.5
    if at >= 28:
        break
    m.add(rhodes(note(n), 1.0), at + (0.25 if i % 2 else 0), 0.12, 0.25 if i % 2 else -0.25, rev=0.55)

# sync accents
m.add(swell(1.0), 2.0, 0.25)          # into the promise scene
m.add(chime(note(84)), 3.0, 0.3, 0, rev=0.6)
m.add(swell(1.2), 5.8, 0.35)          # beat drops in at 7.0
for i, s in enumerate([7.6, 10.13, 12.67, 15.2]):
    m.add(chime(note([79, 81, 84, 88][i])), s, 0.3, -0.2 + 0.13 * i, rev=0.6)
m.add(S.crash(m, 2.0), 17.5, 0.08, 0, rev=0.5)
m.add(swell(1.5), 21.0, 0.4)
m.add(chime(note(72)), 22.6, 0.3, -0.2, rev=0.7)  # logo icon
m.add(chime(note(79)), 23.2, 0.3, 0.2, rev=0.7)   # wordmark
m.add(chime(note(84)), 24.8, 0.25, 0, rev=0.7)    # button

m.render("buzz_reel_music.wav", 2.4, 0.45)
