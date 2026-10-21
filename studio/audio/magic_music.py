"""'Wähl deine Magie' — 15 s, 120 BPM, D minor. Magical bells + punchy beat.
Sync: taps 0.73/1.23 | cut 2.5 | cards rise 2.77/3.1 | flips 3.67/4.17 | 'oder' 4.7
| cut 8.0 | steps 8.47/8.97/9.47 | +50 badge 9.93 | build 10–11 | drop/CTA 11.0 | button 11.47
"""
import numpy as np
import styles as S
from styles import Mix, filt, saw, sine, t_arr, note, SR

m = Mix(91)
BEAT = 0.5
DUR = 15.0


def bell(f, d=1.4, bright=1.0):
    t = t_arr(d)
    s = sine(f, d) + 0.45 * bright * sine(f * 2.0, d) * np.exp(-t * 4) + 0.2 * bright * sine(f * 3.01, d) * np.exp(-t * 7)
    return s * np.exp(-t * 2.4) * np.minimum(1, t / 0.002) * 0.4


def pluck_bass(f, d=0.3):
    t = t_arr(d)
    s = saw(f, d) * 0.6 + sine(f / 2, d) * 0.8
    return np.tanh(filt(s, 500) * np.exp(-t * 9) * np.minimum(1, t / 0.003) * 2.0)


def shimmer(d):
    """rising glittery noise + fast bell gliss"""
    n = m.noise(d)
    t = np.linspace(0, 1, len(n))
    return filt(n, 6000, "high") * t**1.5 * 0.3


def gliss(start, steps=10, up=True, gap=0.03, base=76):
    scale = [0, 2, 3, 5, 7, 8, 10]
    for k in range(steps):
        idx = k if up else steps - 1 - k
        n = base + 12 * (idx // 7) + scale[idx % 7]
        m.add(bell(note(n), 0.9), start + k * gap, 0.16, -0.5 + k / steps, rev=0.6)


def shing():
    t = t_arr(0.8)
    f = 2000 + 3000 * t / 0.8
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 5) * 0.3
    return s + filt(m.noise(0.8), 7000, "high") * np.exp(-t * 6) * 0.4


CH = [(62, 65, 69), (58, 62, 65), (60, 64, 67), (57, 61, 64)]  # Dm Bb C A
ROOT = [38, 34, 36, 33]

for bar in range(8):
    t0 = bar * 2.0
    if t0 >= DUR:
        break
    ch = CH[bar % 4]
    beat = t0 >= 2.0  # drums come in on the first cut (2.5) — bar starting 2.0
    for b in range(4):
        tb = t0 + b * BEAT
        if tb >= DUR - 0.05:
            continue
        in_build = 10.0 <= tb < 11.0
        if tb >= 2.5 and not (10.5 <= tb < 11.0):
            m.add(S.kick(m, 0.4, 120, 48, 8), tb, 0.75)
            if b in (1, 3) and not in_build:
                m.add(S.clap(m), tb, 0.4, 0, rev=0.3)
                m.add(S.snare(m, 0.2, 210), tb, 0.18, 0, rev=0.2)
            for k in range(2):
                m.add(S.hat(m, open_=(k == 1)), tb + k * BEAT / 2, 0.1, 0.3)
            if not (10.5 <= tb < 11.0):
                m.add(pluck_bass(note(ROOT[bar % 4] - 12 + 12)), tb + BEAT / 2, 0.5)
        # magic bell arpeggio (8ths) throughout
        arp = [ch[0] + 12, ch[1] + 12, ch[2] + 12, ch[1] + 24]
        for k in range(2):
            n = arp[(b * 2 + k) % 4]
            m.add(bell(note(n), 0.8), tb + k * BEAT / 2, 0.13 if tb < 2.5 else 0.11, -0.3 if k else 0.3, rev=0.55)
    pad = sum(saw(note(n - 12) * (1 + d), 2.0) for n in ch for d in (-0.004, 0.004)) / 6
    pad = filt(pad, 1000) * np.minimum(1, t_arr(2.0) / 0.4) * np.minimum(1, (2.0 - t_arr(2.0)) / 0.3)
    m.add(pad, t0, 0.15, 0, rev=0.6)

# --- sync FX ---
m.add(shimmer(0.7), 0.0, 0.5)
m.add(S.impact(m, 1.0, 50), 0.0, 0.4)
gliss(0.73, 8, True)                          # wand tap 1
gliss(1.23, 12, True, 0.025, 79)              # wand tap 2 (bigger)
m.add(S.crash(m, 1.6), 1.23, 0.25, 0, rev=0.5)
m.add(S.impact(m, 1.4, 40), 2.5, 0.75)         # cut -> beat in
m.add(S.crash(m, 1.5), 2.5, 0.3, 0, rev=0.4)
for s in [2.77, 3.1]:
    m.add(S.whoosh(m, 0.35, True), s - 0.1, 0.35)   # cards rise
for s in [3.67, 4.17]:
    m.add(shing(), s, 0.55, 0, rev=0.5)             # card flips
    m.add(S.impact(m, 0.6, 60), s, 0.4)
m.add(S.coin(2093), 4.7, 0.3, 0, rev=0.4)           # 'oder'
m.add(S.impact(m, 1.0, 45), 8.0, 0.55)              # cut
m.add(S.crash(m, 1.2), 8.0, 0.22, 0, rev=0.4)
for i, s in enumerate([8.47, 8.97, 9.47]):
    m.add(bell(note([81, 84, 88][i]), 1.0), s, 0.28, 0, rev=0.5)
m.add(S.coin(1568), 9.93, 0.35, 0, rev=0.5)         # +50 badge
# build into CTA
m.add(shimmer(1.0), 10.0, 0.6)
m.add(S.whoosh(m, 1.0, True), 10.0, 0.45)
r = 10.0
while r < 10.98:
    gap = 0.125 if r < 10.5 else 0.0625
    m.add(S.snare(m, 0.15, 220), r, 0.1 + 0.3 * (r - 10.0), 0, rev=0.2)
    r += gap
m.add(S.impact(m, 2.0, 32), 11.0, 1.0)
gliss(11.0, 14, True, 0.02, 74)
m.add(S.crash(m, 2.5), 11.0, 0.4, 0, rev=0.5)
m.add(S.coin(1760), 11.47, 0.3, 0, rev=0.4)         # button
m.add(S.coin(2349), 11.8, 0.22, 0, rev=0.4)         # url

m.render("magic_music.wav", 2.0, 0.45)
