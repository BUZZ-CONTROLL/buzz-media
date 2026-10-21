"""Original, royalty-free 15 s track for the SlotMagie reel.
120 BPM (1 beat = 0.5 s = 15 video frames), A minor, synced to the video cuts.
"""
import numpy as np
from scipy.signal import butter, lfilter, fftconvolve
from scipy.io import wavfile

SR = 44100
DUR = 15.0
BEAT = 0.5
N = int(SR * DUR)
rng = np.random.default_rng(7)

L = np.zeros(N)
R = np.zeros(N)
send = np.zeros(N)  # reverb send (mono)


def t_arr(d):
    return np.arange(int(SR * d)) / SR


def add(sig, at, gain=1.0, pan=0.0, rev=0.0):
    i = int(at * SR)
    if i >= N:
        return
    sig = sig[: N - i]
    gl = gain * np.cos((pan + 1) * np.pi / 4)
    gr = gain * np.sin((pan + 1) * np.pi / 4)
    L[i : i + len(sig)] += sig * gl
    R[i : i + len(sig)] += sig * gr
    if rev:
        send[i : i + len(sig)] += sig * gain * rev


def filt(x, f, kind="low", order=2):
    b, a = butter(order, np.clip(np.array(f) / (SR / 2), 1e-4, 0.999), btype=kind)
    return lfilter(b, a, x)


def env(n, a=0.002, d=0.2, curve=1.0):
    t = np.arange(n) / SR
    e = np.minimum(1, t / max(a, 1e-5)) * np.exp(-t / d) ** curve
    return e


def saw(freq, d):
    t = t_arr(d)
    return 2 * ((t * freq) % 1) - 1


def sq(freq, d, duty=0.5):
    t = t_arr(d)
    return np.where((t * freq) % 1 < duty, 1.0, -1.0)


def note(n):  # midi -> Hz
    return 440 * 2 ** ((n - 69) / 12)


# ---------------- instruments ----------------
def kick(big=False):
    d = 0.45 if not big else 0.9
    t = t_arr(d)
    f = 45 + 110 * np.exp(-t * 28)
    ph = 2 * np.pi * np.cumsum(f) / SR
    s = np.sin(ph) * np.exp(-t * (7 if not big else 3.5))
    click = filt(rng.standard_normal(len(t)), 3000, "high") * np.exp(-t * 300) * 0.4
    return np.tanh((s + click) * 1.6)


def clap():
    d = 0.25
    n = rng.standard_normal(int(SR * d))
    e = np.zeros_like(n)
    for k, off in enumerate([0, 0.01, 0.02]):
        i = int(off * SR)
        e[i:] += np.exp(-np.arange(len(n) - i) / SR / (0.012 if k < 2 else 0.09))
    return filt(n * e, [900, 5000], "band") * 1.4


def hat(open_=False):
    d = 0.25 if open_ else 0.05
    n = rng.standard_normal(int(SR * d))
    return filt(n, 7000, "high") * env(len(n), 0.001, 0.08 if open_ else 0.012)


def crash():
    d = 2.2
    n = rng.standard_normal(int(SR * d))
    return filt(n, 4500, "high") * env(len(n), 0.001, 0.7) * 0.8


def impact():
    d = 1.6
    t = t_arr(d)
    boom = np.sin(2 * np.pi * np.cumsum(38 + 80 * np.exp(-t * 9)) / SR) * np.exp(-t * 2.2)
    noise = filt(rng.standard_normal(len(t)), 1200, "low") * np.exp(-t * 4) * 0.6
    return np.tanh((boom + noise) * 2.0)


def coin(base=1568.0):
    # bright two-tone "ding"
    out = np.zeros(int(SR * 0.9))
    for k, (f0, at) in enumerate([(base, 0.0), (base * 1.5, 0.07)]):
        t = t_arr(0.9 - at)
        s = (np.sin(2 * np.pi * f0 * t) + 0.4 * np.sin(2 * np.pi * f0 * 2.76 * t)) * np.exp(-t * 6)
        i = int(at * SR)
        out[i : i + len(s)] += s
    return out * 0.5


def tick():
    n = rng.standard_normal(int(SR * 0.012))
    return filt(n, [2500, 6000], "band") * env(len(n), 0.0005, 0.003) * 2.5


def clunk():
    t = t_arr(0.25)
    s = np.sin(2 * np.pi * 160 * t) * np.exp(-t * 30)
    n = filt(rng.standard_normal(len(t)), 1800, "low") * np.exp(-t * 60)
    return np.tanh((s + n) * 2.2)


def whoosh(d, up=True):
    n = rng.standard_normal(int(SR * d))
    t = np.linspace(0, 1, len(n))
    out = np.zeros_like(n)
    # sweep a band filter in chunks
    chunks = 40
    for c in range(chunks):
        a, b = c * len(n) // chunks, (c + 1) * len(n) // chunks
        frac = c / chunks if up else 1 - c / chunks
        fc = 300 + 6000 * frac**2
        out[a:b] = filt(n[a:b], [fc * 0.7, min(fc * 1.4, 18000)], "band")
    e = (t if up else 1 - t) ** 1.5
    return out * e


def pluck(freq, d=0.22):
    s = saw(freq, d) * 0.6 + sq(freq * 2, d, 0.3) * 0.25
    s = filt(s, 2600, "low")
    return s * env(len(s), 0.002, 0.09)


def bass_note(freq, d):
    s = saw(freq, d) + 0.5 * sq(freq / 2, d)
    s = filt(s, 420, "low", 3)
    e = np.minimum(1, np.arange(len(s)) / (0.004 * SR)) * np.exp(-np.arange(len(s)) / SR / 0.18)
    return np.tanh(s * e * 1.4)


def pad(freqs, d):
    s = sum(saw(f * (1 + det), d) for f in freqs for det in (-0.004, 0.004))
    s = filt(s / (len(freqs) * 2), 1400, "low")
    t = np.arange(len(s)) / SR
    e = np.minimum(1, t / 0.3) * np.minimum(1, (d - t) / 0.3)
    return s * e


# ---------------- arrangement ----------------
# chord per bar (2 s): Am F C G | Am F C G ...
CHORDS = [(57, 60, 64), (53, 57, 60), (48, 52, 55), (55, 59, 62)]
ROOTS = [45, 41, 48, 43]

DROP = 9.5  # CTA cut (frame 285)

for bar in range(8):
    t0 = bar * 2.0
    if t0 >= DUR:
        break
    ch = CHORDS[bar % 4]
    # pad throughout (quieter in the build)
    padg = 0.16 if t0 < DROP else 0.22
    add(pad([note(n) for n in ch], 2.0), t0, padg, 0, rev=0.4)

    for b in range(4):
        tb = t0 + b * BEAT
        if tb >= DUR - 0.05:
            continue
        in_build = 8.0 <= tb < DROP
        # kick 4 on the floor (drops out during last half of build)
        if not (8.5 <= tb < DROP):
            add(kick(), tb, 0.9)
        # clap on 2 and 4
        if b in (1, 3) and not in_build:
            add(clap(), tb, 0.45, 0, rev=0.25)
        # open hat offbeat
        add(hat(True), tb + BEAT / 2, 0.16, 0.3)
        # 16th closed hats from first cut
        if tb >= 2.5:
            for k in range(4):
                add(hat(), tb + k * BEAT / 4, 0.12 if k % 2 else 0.07, -0.3)
        # pumping off-beat bass (8ths, sidechained feel)
        root = note(ROOTS[bar % 4] - 12 + 12)
        for k in (1, 3):
            if not (8.5 <= tb < DROP):
                add(bass_note(root, 0.2), tb + k * BEAT / 4, 0.55)
        # arp lead from 2.5 s, 16ths over chord tones
        if tb >= 2.5:
            seq = [ch[0] + 12, ch[1] + 12, ch[2] + 12, ch[1] + 24]
            for k in range(4):
                n_ = seq[(b * 4 + k) % 4]
                add(pluck(note(n_)), tb + k * BEAT / 4, 0.17, 0.25 if k % 2 else -0.25, rev=0.3)

# ---------------- sync FX (frame/30 = seconds) ----------------
add(impact(), 0.0, 0.7)
add(crash(), 0.0, 0.35, 0, rev=0.3)
add(whoosh(0.95, True), 0.0, 0.35)
# digit reel ticks 0–1.0 s, slowing down
tt = 0.02
while tt < 0.98:
    add(tick(), tt, 0.35, rng.uniform(-0.4, 0.4))
    tt += 0.025 + 0.09 * (tt / 1.0) ** 2
add(clunk(), 22 / 30, 0.7)            # "5" lands
add(clunk(), 30 / 30, 0.8)            # "0" lands
add(impact(), 30 / 30, 0.8)           # big hit on 50
add(crash(), 30 / 30, 0.45, 0, rev=0.4)
add(coin(1568), 30 / 30, 0.35, 0, rev=0.4)
add(coin(2093), 45 / 30, 0.3, 0.2, rev=0.4)   # OHNE EINZAHLUNG

# cut 1 -> steps (2.5 s)
add(crash(), 2.5, 0.35, 0, rev=0.3)
add(whoosh(0.35, False), 2.5, 0.3)
for i in range(3):
    s = 2.5 + (12 + i * 15) / 30
    add(whoosh(0.18, True), s - 0.12, 0.2, -0.3 + i * 0.3)
    add(coin(1760 + i * 220), s + 7 / 30, 0.22, 0.2, rev=0.3)

# cut 2 -> reels (6.0 s)
add(crash(), 6.0, 0.3, 0, rev=0.3)
add(whoosh(0.3, False), 6.0, 0.25)
stops = [6.0 + 30 / 30, 6.0 + 45 / 30, 6.0 + 60 / 30]
tt = 6.07
while tt < stops[-1]:
    active = sum(1 for s in stops if tt < s)
    add(tick(), tt, 0.18 + 0.08 * active, rng.uniform(-0.5, 0.5))
    tt += 0.045
for k, s in enumerate(stops):
    add(clunk(), s, 0.75, -0.4 + k * 0.4)
add(coin(2349), 6.0 + 62 / 30, 0.35, 0, rev=0.4)  # 0,10 €

# build: riser + snare roll into the drop
add(whoosh(DROP - 8.0, True), 8.0, 0.55)
roll_t = 8.0
while roll_t < DROP - 0.02:
    gap = 0.25 if roll_t < 8.75 else (0.125 if roll_t < 9.15 else 0.0625)
    add(clap(), roll_t, 0.12 + 0.35 * (roll_t - 8.0) / (DROP - 8.0), 0, rev=0.2)
    roll_t += gap

# drop -> CTA (9.5 s)
add(impact(), DROP, 1.0)
add(kick(big=True), DROP, 0.9)
add(crash(), DROP, 0.5, 0, rev=0.4)
add(coin(1568), DROP + 15 / 30, 0.3, 0, rev=0.4)  # button
add(coin(2093), DROP + 24 / 30, 0.22, 0, rev=0.4)  # url

# ---------------- reverb + master ----------------
ir_t = t_arr(1.4)
ir = rng.standard_normal(len(ir_t)) * np.exp(-ir_t * 4.0)
ir = filt(ir, 5000, "low")
ir /= np.sqrt(np.sum(ir**2))
wet = fftconvolve(send, ir)[:N] * 0.35
L += wet
R += np.roll(wet, int(0.011 * SR))

mix = np.stack([L, R], axis=1)
# gentle fade at very end
fade = np.ones(N)
fn = int(0.35 * SR)
fade[-fn:] = np.linspace(1, 0, fn)
mix *= fade[:, None]
mix = np.tanh(mix * 1.1)  # soft clip glue
mix /= np.max(np.abs(mix)) + 1e-9
mix *= 0.89
wavfile.write("music_raw.wav", SR, (mix * 32767).astype(np.int16))
print("ok", mix.shape)
