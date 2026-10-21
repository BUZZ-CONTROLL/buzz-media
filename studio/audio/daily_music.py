"""CrazyBuzzer daily reel music — 15 s, 120 BPM, same sync grid as CrazyDaily.tsx.
Usage: python3 daily_music.py <mood: party|spooky|epic|chill> <seed:int> <out.wav>
Sync: press 1.167 | cuts 3.0 / 7.0 / 11.0 | tiles 3.53.. | rows 7.6/8.1/8.6 | build 12.5 | CTA press 13.0
"""
import sys
import numpy as np
import styles as S
from styles import Mix, filt, saw, sq, sine, t_arr, note, SR

mood = sys.argv[1] if len(sys.argv) > 1 else "party"
seed = int(sys.argv[2]) if len(sys.argv) > 2 else 1
out = sys.argv[3] if len(sys.argv) > 3 else "daily.wav"
rng = np.random.default_rng(seed)
DUR = 15.0
S.DUR = DUR
S.N = int(SR * DUR)
BEAT = 0.5
m = Mix(seed)

KEYS = {"party": 0, "epic": -3, "chill": 5, "spooky": 2}
tr = KEYS.get(mood, 0) + int(rng.integers(-2, 3))
PROG = {
    "party": [(60, 63, 67), (56, 60, 63), (63, 67, 70), (58, 62, 65)],
    "epic": [(57, 60, 64), (53, 57, 60), (48, 52, 55), (55, 59, 62)],
    "chill": [(60, 64, 67), (57, 60, 64), (53, 57, 60), (55, 59, 62)],
    "spooky": [(60, 63, 67), (56, 60, 63), (53, 56, 60), (55, 59, 62)],
}[mood]
CH = [tuple(n + tr for n in c) for c in PROG]
ROOT = [c[0] - 12 for c in CH]
scale = sorted({n % 12 for c in CH for n in c})
HOOK = [int(72 + tr + rng.choice([0, 2, 3, 5, 7, 10, 12])) for _ in range(8)]
HOOK = [h - ((h % 12 - min(scale, key=lambda s: abs(s - h % 12))) ) for h in HOOK]


def buzz(d=0.6):
    t = t_arr(d)
    s = sq(110, d, 0.3) * 0.5 + saw(220, d) * 0.3 + sq(165, d) * 0.3
    return np.tanh(filt(s, 1800) * np.minimum(1, t / 0.005) * np.exp(-t * 3) * 1.6) * 0.7


def bass(f, d=0.24):
    t = t_arr(d)
    return np.tanh(filt(saw(f, d) * 0.6 + sine(f / 2, d), 420) * np.exp(-t * 7) * np.minimum(1, t / 0.003) * 2.2)


def lead(f, d=0.2):
    t = t_arr(d)
    tone = {"chill": 1600, "epic": 3000, "spooky": 2400}.get(mood, 3500)
    return filt(sq(f, d, 0.22) * 0.5 + saw(f * 1.006, d) * 0.4, tone) * np.exp(-t * 9) * np.minimum(1, t / 0.003)


def bell(f, d=1.6):
    t = t_arr(d)
    return (sine(f, d) + 0.5 * sine(f * 2.76, d) * np.exp(-t * 2)) * np.exp(-t * 2) * 0.45


def pad(fs, d):
    t = t_arr(d)
    if mood == "spooky":
        s = sum(sine(note(n), d) + 0.5 * sine(note(n + 12), d) for n in fs) / len(fs)
    else:
        s = filt(sum(saw(note(n - 12) * (1 + dd), d) for n in fs for dd in (-0.005, 0.005)) / 6, 1400 if mood != "epic" else 2200)
    return s * np.minimum(1, t / 0.2) * np.minimum(1, (d - t) / 0.25)


def thunder(d=2.0):
    t = t_arr(d)
    n = m.noise(d)
    return np.tanh(filt(n, 3000, "high") * np.exp(-t * 18) * 0.6 + filt(n, 180) * np.exp(-t * 1.5) * 3.0)


# intro 0–3 s
m.add(pad(CH[0], 3.0), 0.0, 0.35, 0, rev=0.6)
for i in range(6):
    m.add(bell(note(HOOK[i] + 12), 0.6), 0.2 + i * 0.16, 0.3, -0.3 + 0.12 * i, rev=0.5)
if mood == "spooky":
    m.add(thunder(), 0.07, 0.8, 0, rev=0.4)
m.add(S.whoosh(m, 0.45, True), 0.7, 0.3)
m.add(buzz(), 1.167, 0.75)
m.add(S.impact(m, 1.5, 40), 1.167, 0.85)
m.add(S.crash(m, 1.8), 1.167, 0.3, 0, rev=0.4)
if mood != "chill":
    for b in range(3):
        m.add(S.kick(m, 0.4, 120, 45, 8), 1.5 + b * 0.5, 0.5)
m.add(S.whoosh(m, 0.9, True), 2.1, 0.45)

# groove 3–15 s
for bar in range(6):
    t0 = 3.0 + bar * 2.0
    ch = CH[bar % 4]
    for b in range(4):
        tb = t0 + b * BEAT
        if tb >= DUR - 0.05:
            continue
        gap = 12.5 <= tb < 13.0
        if not gap:
            m.add(S.kick(m, 0.42, 125, 45, 7.5), tb, 0.85 if mood != "chill" else 0.6)
            m.add(bass(note(ROOT[bar % 4] - 12)), tb + BEAT / 2, 0.5)
        if b in (1, 3) and not gap:
            m.add(S.clap(m), tb, 0.4, 0, rev=0.35)
        for k in range(2):
            m.add(S.hat(m, open_=(k == 1)), tb + k * BEAT / 2, 0.09, 0.3)
        if (bar % 2 == 1 and tb < 12.5) or tb >= 13.0:
            for k in range(2):
                m.add(lead(note(HOOK[(b * 2 + k) % 8])), tb + k * BEAT / 2, 0.13, 0.2 if k else -0.2, rev=0.35)
    m.add(pad(ch, 2.0), t0, 0.15 if mood != "spooky" else 0.3, 0, rev=0.5)
    if mood in ("party", "epic") and t0 >= 3.0:
        for at in (0.25, 0.75, 1.25, 1.75):
            stab = filt(sum(saw(note(n), 0.18) for n in ch) / 3, 2400) * np.exp(-t_arr(0.18) * 14)
            m.add(stab, t0 + at, 0.14, -0.1, rev=0.35)

# sync FX
for c in [3.0, 7.0, 11.0]:
    m.add(S.whoosh(m, 0.3, False), c, 0.3)
    m.add(S.crash(m, 1.3), c, 0.2, 0, rev=0.35)
    if mood == "spooky":
        m.add(bell(note(50), 2.0), c, 0.5, 0, rev=0.6)
for i in range(4):
    m.add(S.coin(1568 + 220 * i), 3.53 + i * 0.267, 0.25, -0.3 + i * 0.2, rev=0.4)
for i, s in enumerate([7.6, 8.1, 8.6]):
    m.add(bell(note(HOOK[i] + 12), 1.0), s, 0.35, 0, rev=0.5)
m.add(S.whoosh(m, 0.5, True), 12.5, 0.5)
r = 12.5
while r < 12.98:
    m.add(S.snare(m, 0.15, 220), r, 0.12 + 0.6 * (r - 12.5), 0, rev=0.2)
    r += 0.0625
m.add(S.impact(m, 2.0, 32), 13.0, 1.0)
m.add(buzz(0.5), 13.0, 0.6)
m.add(S.crash(m, 2.0), 13.0, 0.45, 0, rev=0.5)
for k in range(8):
    m.add(S.coin(1568 + 110 * (k % 5)), 13.07 + k * 0.08, 0.16, -0.5 + k * 0.12, rev=0.3)

m.render(out, 1.5, 0.32)
