"""CrazyBuzzer Halloween — 15 s, 120 BPM, D minor, spooky electro.
Sync: thunder 0.07 / 1.0 | buzzer press 1.167 | cut 3.0 (bell) | tiles 3.53.. | ghost 4.33 | lightning 5.0
| cut 7.0 shake | rows 7.6/8.1/8.6 | cut 11.0 | CTA press 13.0
"""
import numpy as np
import styles as S
from styles import Mix, filt, saw, sq, sine, t_arr, note, SR

DUR = 15.0
S.DUR = DUR
S.N = int(SR * DUR)
BEAT = 0.5
m = Mix(31)


def thunder(m, d=2.5):
    t = t_arr(d)
    n = m.noise(d)
    crack = filt(n, 3000, "high") * np.exp(-t * 18) * 0.6
    rumble = filt(n, 180) * (np.exp(-t * 1.5) * (1 + 0.6 * np.sin(2 * np.pi * 3 * t))) * 3.0
    return np.tanh(crack + rumble)


def bell(f, d=2.4):
    t = t_arr(d)
    s = sine(f, d) + 0.5 * sine(f * 2.76, d) * np.exp(-t * 2) + 0.3 * sine(f * 5.4, d) * np.exp(-t * 4)
    return s * np.exp(-t * 1.6) * 0.5


def musicbox(f, d=0.6):
    t = t_arr(d)
    return (sine(f, d) + 0.3 * sine(f * 3, d) * np.exp(-t * 8)) * np.exp(-t * 6) * 0.4


def theremin(f0, f1, d):
    t = t_arr(d)
    fr = np.linspace(f0, f1, len(t)) * (1 + 0.012 * np.sin(2 * np.pi * 5.5 * t))
    ph = 2 * np.pi * np.cumsum(fr) / SR
    return np.sin(ph) * np.minimum(1, t / 0.15) * np.minimum(1, (d - t) / 0.3) * 0.35


def organ(fs, d):
    t = t_arr(d)
    s = sum(sine(note(n), d) + 0.5 * sine(note(n + 12), d) + 0.25 * sine(note(n + 19), d) for n in fs) / len(fs)
    return s * np.minimum(1, t / 0.25) * np.minimum(1, (d - t) / 0.3) * 0.5


def buzz(d=0.6):
    t = t_arr(d)
    s = sq(110, d, 0.3) * 0.5 + saw(220, d) * 0.3 + sq(165, d) * 0.3
    return np.tanh(filt(s, 1800) * np.minimum(1, t / 0.005) * np.exp(-t * 3) * 1.6) * 0.7


def bass(f, d=0.24):
    t = t_arr(d)
    return np.tanh(filt(saw(f, d) * 0.6 + sine(f / 2, d), 380) * np.exp(-t * 7) * np.minimum(1, t / 0.003) * 2.2)


def lead(f, d=0.2):
    t = t_arr(d)
    return filt(sq(f, d, 0.2) * 0.5 + saw(f * 1.006, d) * 0.4, 2600) * np.exp(-t * 9) * np.minimum(1, t / 0.003)


CH = [(62, 65, 69), (58, 62, 65), (55, 58, 62), (57, 61, 64)]  # Dm Bb Gm A
ROOT = [50, 46, 43, 45]
HOOK = [74, 77, 76, 73, 74, 69, 70, 73]
MB = [74, 77, 81, 80, 77, 74, 73, 69]  # music box in hook

# --- hook (0–3 s): organ + music box + thunder, no drums
m.add(organ(CH[0], 3.0), 0.0, 0.5, 0, rev=0.6)
for i, n in enumerate(MB):
    m.add(musicbox(note(n + 12)), 0.25 + i * 0.33, 0.55, -0.3 + 0.08 * i, rev=0.6)
m.add(thunder(m), 0.07, 0.9, 0, rev=0.4)
m.add(thunder(m, 1.8), 1.0, 0.7, 0.2, rev=0.4)
m.add(buzz(), 1.167, 0.75)
m.add(S.impact(m, 1.5, 40), 1.167, 0.85)
m.add(S.crash(m, 1.8), 1.167, 0.3, 0, rev=0.4)
m.add(S.whoosh(m, 0.9, True), 2.1, 0.45)

# --- groove (3–15 s)
for bar in range(1, 8):
    t0 = 3.0 + (bar - 1) * 2.0
    if t0 >= DUR:
        break
    ch = CH[(bar - 1) % 4]
    for b in range(4):
        tb = t0 + b * BEAT
        if tb >= DUR - 0.05:
            continue
        gap = 12.5 <= tb < 13.0
        if not gap:
            m.add(S.kick(m, 0.45, 120, 42, 7), tb, 0.85)
            m.add(bass(note(ROOT[(bar - 1) % 4] - 12)), tb + BEAT / 2, 0.5)
        if b in (1, 3) and not gap:
            m.add(S.clap(m), tb, 0.4, 0, rev=0.35)
        for k in range(2):
            m.add(S.hat(m, open_=(k == 1)), tb + k * BEAT / 2, 0.09, 0.3)
        if (bar % 2 == 0 and tb < 12.5) or tb >= 13.0:
            for k in range(2):
                n = HOOK[(b * 2 + k) % 8]
                m.add(lead(note(n)), tb + k * BEAT / 2, 0.13, 0.2 if k else -0.2, rev=0.35)
    m.add(organ(ch, 2.0), t0, 0.32, 0, rev=0.5)

# --- sync FX
for c in [3.0, 7.0, 11.0]:
    m.add(bell(note(50)), c, 0.55, 0, rev=0.6)
    m.add(S.whoosh(m, 0.3, False), c, 0.3)
    m.add(S.crash(m, 1.3), c, 0.2, 0, rev=0.35)
for i in range(4):
    m.add(musicbox(note(81 + i * 2)), 3.53 + i * 0.267, 0.45, -0.3 + i * 0.2, rev=0.5)
m.add(theremin(note(69), note(81), 2.6), 4.33, 0.5, 0.3, rev=0.6)   # ghost
m.add(thunder(m, 1.6), 5.0, 0.6, -0.2, rev=0.4)
m.add(thunder(m, 1.4), 7.13, 0.5, 0.2, rev=0.4)
for i, s in enumerate([7.6, 8.1, 8.6]):
    m.add(bell(note(74 + i * 3), 1.2), s, 0.35, 0, rev=0.5)
m.add(theremin(note(74), note(62), 2.0), 9.5, 0.4, -0.3, rev=0.6)
m.add(S.whoosh(m, 0.5, True), 12.5, 0.5)
r = 12.5
while r < 12.98:
    m.add(S.snare(m, 0.15, 220), r, 0.12 + 0.6 * (r - 12.5), 0, rev=0.2)
    r += 0.0625
m.add(S.impact(m, 2.0, 32), 13.0, 1.0)
m.add(buzz(0.5), 13.0, 0.6)
m.add(S.crash(m, 2.0), 13.0, 0.45, 0, rev=0.5)
m.add(bell(note(38), 2.0), 13.0, 0.5, 0, rev=0.6)

m.render("halloween_music.wav", 1.6, 0.35)
