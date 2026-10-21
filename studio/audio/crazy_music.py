"""CrazyBuzzer — 20 s, 120 BPM, party/electro-pop, C minor.
Sync: buzzer 0.5 | 'Dein Social Casino' 1.13 | cut 3.0 (888 count to 4.33) | tiles 4.47.. | providers 6.0
| cut 8.0 checks 8.7/9.2/9.7 | cut 12.0 shake 12.27, lid 13.0 coins | build 15–16 | drop CTA 16.0 | press 17.87
"""
import numpy as np
import styles as S
from styles import Mix, filt, saw, sq, sine, t_arr, note, SR

DUR = 20.0
S.DUR = DUR
S.N = int(SR * DUR)
BEAT = 0.5
m = Mix(123)


def buzz(d=0.6):
    t = t_arr(d)
    s = sq(110, d, 0.3) * 0.5 + saw(220, d) * 0.3 + sq(165, d) * 0.3
    return np.tanh(filt(s, 1800) * np.minimum(1, t / 0.005) * np.exp(-t * 3) * 1.6) * 0.7


def lead(f, d=0.22):
    t = t_arr(d)
    s = sq(f, d, 0.25) * 0.5 + saw(f * 1.005, d) * 0.4
    return filt(s, 3500) * np.minimum(1, t / 0.003) * np.exp(-t * 8)


def bass(f, d=0.22):
    t = t_arr(d)
    s = saw(f, d) * 0.6 + sine(f / 2, d)
    return np.tanh(filt(s, 450) * np.exp(-t * 9) * np.minimum(1, t / 0.003) * 2)


def blip(f):
    t = t_arr(0.12)
    return sine(f, 0.12) * np.exp(-t * 30) * 0.5


def chime(n):
    t = t_arr(0.8)
    return (sine(note(n), 0.8) + 0.4 * sine(note(n) * 2, 0.8) * np.exp(-t * 4)) * np.exp(-t * 4) * 0.4


CH = [(60, 63, 67), (56, 60, 63), (63, 67, 70), (58, 62, 65)]  # Cm Ab Eb Bb
ROOT = [48, 44, 51, 46]
HOOK = [72, 75, 79, 77, 75, 72, 70, 72]

for bar in range(10):
    t0 = bar * 2.0
    if t0 >= DUR:
        break
    ch = CH[bar % 4]
    for b in range(4):
        tb = t0 + b * BEAT
        if tb >= DUR - 0.05:
            continue
        gap = 15.5 <= tb < 16.0
        if tb >= 0.5 and not gap:
            m.add(S.kick(m, 0.4, 130, 50, 8), tb, 0.8)
            # offbeat bass
            m.add(bass(note(ROOT[bar % 4] - 12)), tb + BEAT / 2, 0.5)
        if b in (1, 3) and tb >= 1.0 and not (15.0 <= tb < 16.0):
            m.add(S.clap(m), tb, 0.42, 0, rev=0.3)
        if tb >= 0.5:
            for k in range(2):
                m.add(S.hat(m, open_=(k == 1)), tb + k * BEAT / 2, 0.1, 0.3)
        # catchy lead hook in 8ths (from cut 3.0, and full in CTA)
        if (3.0 <= tb < 15.0 and bar % 2 == 0) or tb >= 16.0:
            for k in range(2):
                n = HOOK[(b * 2 + k) % 8]
                m.add(lead(note(n)), tb + k * BEAT / 2, 0.14, 0.2 if k else -0.2, rev=0.3)
    pad = sum(saw(note(n - 12) * (1 + d), 2.0) for n in ch for d in (-0.005, 0.005)) / 6
    pad = filt(pad, 1300) * np.minimum(1, t_arr(2.0) / 0.2) * np.minimum(1, (2.0 - t_arr(2.0)) / 0.2)
    m.add(pad, t0, 0.13, 0, rev=0.5)
    # off-beat chord stabs (house piano feel)
    if t0 >= 3.0:
        for at in (0.25, 0.75, 1.25, 1.75):
            stab = sum(saw(note(n) * 1.0, 0.18) for n in ch) / 3
            stab = filt(stab, 2400) * np.exp(-t_arr(0.18) * 14)
            m.add(stab, t0 + at, 0.17, -0.1, rev=0.35)

# ---- sync FX ----
m.add(S.whoosh(m, 0.45, True), 0.05, 0.3)
m.add(buzz(), 0.5, 0.75)                          # BUZZER press
m.add(S.impact(m, 1.4, 42), 0.5, 0.8)
m.add(S.crash(m, 1.6), 0.5, 0.3, 0, rev=0.4)
m.add(S.impact(m, 1.0, 55), 1.13, 0.55)           # 'Dein Social Casino'
m.add(S.coin(2093), 1.13, 0.25, 0, rev=0.4)
for c in [3.0, 8.0, 12.0]:
    m.add(S.whoosh(m, 0.3, False), c, 0.3)
    m.add(S.crash(m, 1.3), c, 0.22, 0, rev=0.35)
tt = 3.13                                          # 888 counter
while tt < 4.33:
    m.add(S.tick(m), tt, 0.3)
    tt += 0.045
m.add(S.coin(2349), 4.33, 0.35, 0, rev=0.4)
for i in range(8):                                 # tiles pop
    m.add(blip(note(72 + i * 2)), 4.47 + i * 0.167, 0.35, -0.4 + i * 0.1)
for i, s in enumerate([8.7, 9.2, 9.7]):            # checks
    m.add(chime(84 + i * 3), s, 0.4, 0, rev=0.4)
tt = 12.27                                         # gift shake rattle
while tt < 13.0:
    m.add(S.tick(m), tt, 0.25, m.rng.uniform(-0.4, 0.4))
    tt += 0.07
m.add(S.impact(m, 0.9, 60), 13.0, 0.5)             # lid pops
for k in range(10):                                # coins spill
    m.add(S.coin(1568 + 110 * (k % 5)), 13.07 + k * 0.08, 0.18, -0.5 + k * 0.1, rev=0.3)
# build
m.add(S.whoosh(m, 1.0, True), 15.0, 0.55)
r = 15.0
while r < 15.98:
    gap = 0.125 if r < 15.5 else 0.0625
    m.add(S.snare(m, 0.15, 220), r, 0.12 + 0.3 * (r - 15.0), 0, rev=0.2)
    r += gap
m.add(S.impact(m, 2.0, 32), 16.0, 1.0)
m.add(buzz(0.5), 16.0, 0.5)
m.add(S.crash(m, 2.4), 16.0, 0.45, 0, rev=0.5)
m.add(buzz(0.4), 17.87, 0.55)                      # final button press
m.add(S.coin(2093), 17.87, 0.25, 0, rev=0.4)

m.render("crazy_music.wav", 1.4, 0.3)
