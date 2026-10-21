"""Three alternative, original 15 s tracks for the SlotMagie spot.
All at 120 BPM (beat = 0.5 s), A minor, with the same sync points as the video:
 0.0 start | 0.73/1.0 digits land | 2.5 cut | 6.0 cut, reel stops 7.0/7.5/8.0 | 9.5 drop/CTA
Usage: python3 styles.py  -> style_A_trap.wav, style_B_swing.wav, style_C_trailer.wav
"""
import numpy as np
from scipy.signal import butter, lfilter, fftconvolve
from scipy.io import wavfile

SR = 44100
DUR = 15.0
BEAT = 0.5
N = int(SR * DUR)
DROP = 9.5
STOPS = [7.0, 7.5, 8.0]


def note(n):
    return 440 * 2 ** ((n - 69) / 12)


def t_arr(d):
    return np.arange(max(1, int(SR * d))) / SR


def filt(x, f, kind="low", order=2):
    b, a = butter(order, np.clip(np.array(f) / (SR / 2), 1e-4, 0.999), btype=kind)
    return lfilter(b, a, x)


def env(n, a=0.002, d=0.2):
    t = np.arange(n) / SR
    return np.minimum(1, t / max(a, 1e-5)) * np.exp(-t / d)


class Mix:
    def __init__(self, seed):
        self.L = np.zeros(N)
        self.R = np.zeros(N)
        self.send = np.zeros(N)
        self.rng = np.random.default_rng(seed)

    def add(self, sig, at, gain=1.0, pan=0.0, rev=0.0):
        i = int(at * SR)
        if i >= N or i < 0:
            return
        sig = sig[: N - i]
        gl = gain * np.cos((pan + 1) * np.pi / 4)
        gr = gain * np.sin((pan + 1) * np.pi / 4)
        self.L[i : i + len(sig)] += sig * gl
        self.R[i : i + len(sig)] += sig * gr
        if rev:
            self.send[i : i + len(sig)] += sig * gain * rev

    def noise(self, d):
        return self.rng.standard_normal(int(SR * d))

    def render(self, path, rev_len=1.6, rev_amt=0.35):
        it = t_arr(rev_len)
        ir = self.rng.standard_normal(len(it)) * np.exp(-it * (5.5 / rev_len))
        ir = filt(ir, 5000)
        ir /= np.sqrt(np.sum(ir**2))
        wet = fftconvolve(self.send, ir)[:N] * rev_amt
        L = self.L + wet
        R = self.R + np.roll(wet, int(0.013 * SR))
        mix = np.stack([L, R], 1)
        fn = int(0.35 * SR)
        mix[-fn:] *= np.linspace(1, 0, fn)[:, None]
        mix = np.tanh(mix * 1.1)
        mix /= np.max(np.abs(mix)) + 1e-9
        wavfile.write(path, SR, (mix * 0.89 * 32767).astype(np.int16))
        print("wrote", path)


# ---------------- shared instruments ----------------
def saw(f, d):
    t = t_arr(d)
    return 2 * ((t * f) % 1) - 1


def sq(f, d, duty=0.5):
    t = t_arr(d)
    return np.where((t * f) % 1 < duty, 1.0, -1.0)


def sine(f, d):
    return np.sin(2 * np.pi * f * t_arr(d))


def kick(m, d=0.45, punch=110, low=45, decay=7):
    t = t_arr(d)
    f = low + punch * np.exp(-t * 28)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * decay)
    click = filt(m.noise(d), 3000, "high") * np.exp(-t * 300) * 0.4
    return np.tanh((s + click) * 1.6)


def snare(m, d=0.3, tone=200):
    t = t_arr(d)
    n = filt(m.noise(d), [1200, 8000], "band") * np.exp(-t * 18)
    b = np.sin(2 * np.pi * tone * t) * np.exp(-t * 30)
    return np.tanh((n * 1.3 + b * 0.7) * 1.4)


def clap(m):
    n = m.noise(0.25)
    e = np.zeros_like(n)
    for k, off in enumerate([0, 0.01, 0.02]):
        i = int(off * SR)
        e[i:] += np.exp(-np.arange(len(n) - i) / SR / (0.012 if k < 2 else 0.09))
    return filt(n * e, [900, 5000], "band") * 1.4


def hat(m, open_=False):
    d = 0.25 if open_ else 0.045
    n = m.noise(d)
    return filt(n, 7000, "high") * env(len(n), 0.001, 0.08 if open_ else 0.011)


def crash(m, d=2.2):
    return filt(m.noise(d), 4500, "high") * env(int(SR * d), 0.001, 0.7) * 0.8


def impact(m, d=1.6, low=38):
    t = t_arr(d)
    boom = np.sin(2 * np.pi * np.cumsum(low + 80 * np.exp(-t * 9)) / SR) * np.exp(-t * 2.2)
    nz = filt(m.noise(d), 1200) * np.exp(-t * 4) * 0.6
    return np.tanh((boom + nz) * 2.0)


def coin(base=1568.0):
    out = np.zeros(int(SR * 0.9))
    for f0, at in [(base, 0.0), (base * 1.5, 0.07)]:
        t = t_arr(0.9 - at)
        s = (np.sin(2 * np.pi * f0 * t) + 0.4 * np.sin(2 * np.pi * f0 * 2.76 * t)) * np.exp(-t * 6)
        i = int(at * SR)
        out[i : i + len(s)] += s
    return out * 0.5


def tick(m):
    n = m.noise(0.012)
    return filt(n, [2500, 6000], "band") * env(len(n), 0.0005, 0.003) * 2.5


def clunk(m):
    t = t_arr(0.25)
    s = np.sin(2 * np.pi * 160 * t) * np.exp(-t * 30)
    n = filt(m.noise(0.25), 1800) * np.exp(-t * 60)
    return np.tanh((s + n) * 2.2)


def whoosh(m, d, up=True):
    n = m.noise(d)
    out = np.zeros_like(n)
    chunks = 40
    for c in range(chunks):
        a, b = c * len(n) // chunks, (c + 1) * len(n) // chunks
        frac = c / chunks if up else 1 - c / chunks
        fc = 300 + 6000 * frac**2
        out[a:b] = filt(n[a:b], [fc * 0.7, min(fc * 1.4, 18000)], "band")
    t = np.linspace(0, 1, len(n))
    return out * ((t if up else 1 - t) ** 1.5)


def sync_fx(m, level=1.0):
    """Slot sounds locked to the picture (same for every style)."""
    g = level
    tt = 0.02
    while tt < 0.98:
        m.add(tick(m), tt, 0.3 * g, m.rng.uniform(-0.4, 0.4))
        tt += 0.025 + 0.09 * tt**2
    m.add(clunk(m), 22 / 30, 0.6 * g)
    m.add(clunk(m), 1.0, 0.7 * g)
    m.add(coin(1568), 1.0, 0.3 * g, 0, rev=0.4)
    m.add(coin(2093), 1.5, 0.25 * g, 0.2, rev=0.4)
    for i in range(3):
        m.add(coin(1760 + i * 220), 2.5 + (19 + i * 15) / 30, 0.18 * g, 0.2, rev=0.3)
    tt = 6.07
    while tt < STOPS[-1]:
        active = sum(1 for s in STOPS if tt < s)
        m.add(tick(m), tt, (0.14 + 0.06 * active) * g, m.rng.uniform(-0.5, 0.5))
        tt += 0.045
    for k, s in enumerate(STOPS):
        m.add(clunk(m), s, 0.65 * g, -0.4 + k * 0.4)
    m.add(coin(2349), 8.07, 0.3 * g, 0, rev=0.4)
    m.add(coin(1568), DROP + 0.5, 0.25 * g, 0, rev=0.4)


CH = [(57, 60, 64), (53, 57, 60), (48, 52, 55), (52, 56, 59)]  # Am F C E
ROOT = [45, 41, 48, 40]


# ================= A · TRAP / HIP-HOP =================
def style_trap():
    m = Mix(11)

    def k808(f0, d, glide_from=None):
        t = t_arr(d)
        f = np.full_like(t, f0)
        if glide_from:
            f = f0 + (glide_from - f0) * np.exp(-t * 18)
        s = np.sin(2 * np.pi * np.cumsum(f) / SR)
        e = np.minimum(1, t / 0.003) * np.exp(-t * 1.6)
        return np.tanh(s * e * 2.6) * 0.9

    def bell(f, d=0.9):
        t = t_arr(d)
        s = sine(f, d) + 0.5 * sine(f * 2.01, d) * np.exp(-t * 5) + 0.25 * sine(f * 3.98, d) * np.exp(-t * 9)
        return s * np.exp(-t * 3.5) * 0.5

    for bar in range(8):
        t0 = bar * 2.0
        if t0 >= DUR:
            break
        r = ROOT[bar % 4]
        build = 8.0 <= t0 < DROP
        # 808 on 1 and the "and" of 2, glide into bar
        if not (8.5 <= t0 < DROP):
            m.add(k808(note(r - 12), 1.0, note(r) if bar % 2 else None), t0, 0.75)
            m.add(k808(note(r - 12), 0.45), t0 + 1.25, 0.6)
            m.add(kick(m, 0.4, 90, 50, 9), t0, 0.55)
        # halftime snare on beat 3
        if not build:
            m.add(snare(m), t0 + 1.0, 0.6, 0, rev=0.25)
            m.add(clap(m), t0 + 1.0, 0.3, 0, rev=0.3)
        # trap hats: 8ths + triplet/32nd rolls
        for b in range(4):
            tb = t0 + b * BEAT
            if tb >= DUR - 0.05:
                continue
            if b == 3 and bar % 2 == 1:
                for k in range(6):
                    m.add(hat(m), tb + k * BEAT / 6, 0.12, 0.25)
            elif b == 1 and t0 >= 2.5:
                for k in range(4):
                    m.add(hat(m), tb + k * BEAT / 4, 0.11, 0.25)
            else:
                m.add(hat(m), tb, 0.12, 0.25)
                m.add(hat(m), tb + BEAT / 2, 0.09, 0.25)
        # dark bell melody
        if t0 >= 2.0:
            ch = CH[bar % 4]
            mel = [ch[2] + 12, ch[1] + 12, ch[0] + 12, ch[1] + 12]
            for k, n_ in enumerate(mel):
                m.add(bell(note(n_)), t0 + k * 0.5 + (0.25 if k % 2 else 0), 0.22, -0.3 + 0.2 * k, rev=0.5)
        # low pad
        pad = sum(saw(note(n_ - 12) * (1 + d), 2.0) for n_ in CH[bar % 4] for d in (-0.003, 0.003))
        pad = filt(pad / 6, 700) * np.minimum(1, t_arr(2.0) / 0.4) * np.minimum(1, (2.0 - t_arr(2.0)) / 0.3)
        m.add(pad, t0, 0.18, 0, rev=0.4)

    m.add(impact(m), 0.0, 0.7)
    m.add(impact(m), 1.0, 0.8)
    m.add(crash(m), 2.5, 0.25, 0, rev=0.3)
    m.add(crash(m), 6.0, 0.25, 0, rev=0.3)
    m.add(whoosh(m, DROP - 8.0), 8.0, 0.5)
    # vocal-chop-ish riser: pitched saw sweep
    t = t_arr(1.5)
    sw = np.sin(2 * np.pi * np.cumsum(200 + 600 * (t / 1.5) ** 2) / SR) * (t / 1.5) ** 2
    m.add(filt(sw, 3000), 8.0, 0.2)
    m.add(impact(m, 2.0, 30), DROP, 1.0)
    m.add(k808(note(33), 1.6, note(45)), DROP, 0.9)
    m.add(crash(m), DROP, 0.4, 0, rev=0.4)
    sync_fx(m)
    m.render("style_A_trap.wav", 1.8, 0.4)


# ================= B · CASINO / ELECTRO SWING =================
def style_swing():
    m = Mix(22)
    SW = 0.62  # swing ratio for 8ths

    def sw8(tb, k):  # k=0 on-beat, k=1 swung off-beat
        return tb + (SW * BEAT if k else 0)

    def upright(f, d=0.45):
        t = t_arr(d)
        s = sine(f, d) + 0.35 * sine(2 * f, d) + 0.12 * saw(f, d)
        return np.tanh(filt(s, 900) * np.minimum(1, t / 0.004) * np.exp(-t * 6) * 1.6)

    def brass(fs, d=0.22):
        t = t_arr(d)
        s = sum(saw(f * (1 + det), d) for f in fs for det in (-0.004, 0.004)) / (2 * len(fs))
        # filter "blat": open then close
        out = np.zeros_like(s)
        chunks = 12
        for c in range(chunks):
            a, b = c * len(s) // chunks, (c + 1) * len(s) // chunks
            fc = 800 + 3500 * np.exp(-c / 4)
            out[a:b] = filt(s[a:b], fc)
        return out * np.minimum(1, t / 0.01) * np.exp(-t * 7) * 1.6

    def piano(fs, d=0.4):
        t = t_arr(d)
        s = sum(sine(f, d) + 0.3 * sine(2 * f, d) * np.exp(-t * 8) for f in fs) / len(fs)
        return s * np.exp(-t * 6)

    walk = [[45, 48, 52, 50], [41, 45, 48, 47], [48, 52, 55, 53], [40, 44, 47, 45]]
    for bar in range(8):
        t0 = bar * 2.0
        if t0 >= DUR:
            break
        ch = CH[bar % 4]
        build = 8.5 <= t0 < DROP
        for b in range(4):
            tb = t0 + b * BEAT
            if tb >= DUR - 0.05:
                continue
            if not build:
                m.add(kick(m, 0.35, 80, 55, 10), tb, 0.6)
                m.add(upright(note(walk[bar % 4][b] - 12)), tb, 0.6)
            if b in (1, 3) and not (8.0 <= tb < DROP):
                m.add(clap(m), tb, 0.45, 0, rev=0.3)
                m.add(snare(m, 0.2, 230), tb, 0.2, 0, rev=0.2)
            # swung hats / ride
            m.add(hat(m, open_=(b % 2 == 1)), sw8(tb, 0), 0.08, 0.3)
            m.add(hat(m), sw8(tb, 1), 0.12, 0.3)
            # piano off-beat stabs
            if tb >= 2.5 and not build:
                m.add(piano([note(n_ + 12) for n_ in ch]), sw8(tb, 1), 0.28, -0.25, rev=0.3)
        # brass hits: bar riff
        if t0 >= 2.5 and not build:
            hi = [note(n_ + 12) for n_ in ch]
            m.add(brass(hi), t0, 0.35, 0.2, rev=0.3)
            m.add(brass(hi, 0.15), t0 + 0.75 + (SW - 0.5) * BEAT, 0.3, 0.2, rev=0.3)
            m.add(brass([note(ch[2] + 12), note(ch[0] + 24)], 0.35), t0 + 1.5, 0.32, 0.2, rev=0.3)

    m.add(brass([note(57), note(64), note(69)], 0.5), 0.0, 0.45, 0, rev=0.4)
    m.add(brass([note(57), note(64), note(69), note(72)], 0.7), 1.0, 0.55, 0, rev=0.4)
    m.add(crash(m, 1.5), 1.0, 0.3, 0, rev=0.3)
    m.add(crash(m, 1.5), 2.5, 0.25, 0, rev=0.3)
    m.add(crash(m, 1.5), 6.0, 0.25, 0, rev=0.3)
    # build: brass rising chromatic
    for k, n_ in enumerate([64, 65, 66, 67, 68, 69, 70, 71]):
        m.add(brass([note(n_), note(n_ + 4)], 0.16), 8.5 + k * 0.125, 0.18 + k * 0.03, 0, rev=0.3)
    m.add(whoosh(m, DROP - 8.5), 8.5, 0.35)
    m.add(brass([note(45), note(57), note(64), note(69), note(72)], 1.0), DROP, 0.75, 0, rev=0.5)
    m.add(impact(m, 1.2, 45), DROP, 0.7)
    m.add(crash(m), DROP, 0.4, 0, rev=0.4)
    sync_fx(m)
    m.render("style_B_swing.wav", 1.2, 0.3)


# ================= C · EPIC TRAILER =================
def style_trailer():
    m = Mix(33)

    def tom(f0=90, d=0.8):
        t = t_arr(d)
        f = f0 * (1 + 0.6 * np.exp(-t * 25))
        s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 5)
        n = filt(m.noise(d), 600) * np.exp(-t * 20) * 0.5
        return np.tanh((s + n) * 2.0)

    def strings(fs, d, bright=1800):
        t = t_arr(d)
        s = sum(saw(f * (1 + det), d) for f in fs for det in (-0.006, 0, 0.006)) / (3 * len(fs))
        vib = 1 + 0.003 * np.sin(2 * np.pi * 5 * t)
        s = s * vib
        return filt(s, bright) * np.minimum(1, t / 0.25) * np.minimum(1, (d - t) / 0.2)

    def ostinato(f, d=0.12):
        t = t_arr(d)
        s = saw(f, d) * 0.6 + sq(f, d, 0.25) * 0.3
        return filt(s, 2500) * np.exp(-t * 18)

    def braam(d=2.5):
        t = t_arr(d)
        fs = [note(33), note(45), note(52), note(57)]
        s = sum(saw(f * (1 + det), d) for f in fs for det in (-0.008, 0.008)) / (2 * len(fs))
        s = np.tanh(filt(s, 900, order=3) * 3)
        return s * np.minimum(1, t / 0.02) * np.exp(-t * 0.9)

    for bar in range(8):
        t0 = bar * 2.0
        if t0 >= DUR:
            break
        ch = CH[bar % 4]
        build = 8.0 <= t0 < DROP
        # sustained strings, brighter after drop
        m.add(strings([note(n_) for n_ in ch] + [note(ch[0] - 12)], 2.0, 1400 if t0 < DROP else 3000), t0, 0.32, 0, rev=0.6)
        # 16th ostinato from first cut
        if t0 >= 2.5:
            pat = [ch[0] + 12, ch[0] + 12, ch[2] + 12, ch[0] + 12, ch[1] + 12, ch[0] + 12, ch[2] + 12, ch[1] + 12]
            for k in range(16):
                at = t0 + k * BEAT / 4
                if at < DUR - 0.05:
                    m.add(ostinato(note(pat[k % 8])), at, 0.15, 0.3 if k % 2 else -0.3, rev=0.3)
        # drums: big toms pattern
        for b in range(4):
            tb = t0 + b * BEAT
            if tb >= DUR - 0.05:
                continue
            if not build:
                m.add(tom(70), tb, 0.6, -0.1, rev=0.3)
                if b in (1, 3):
                    m.add(snare(m, 0.4, 180), tb, 0.45, 0, rev=0.5)
                    m.add(tom(110, 0.5), tb + BEAT / 2, 0.35, 0.2, rev=0.3)
            if t0 >= 2.5:
                m.add(hat(m), tb + BEAT / 2, 0.06, 0.3)

    m.add(braam(2.0), 0.0, 0.7, 0, rev=0.5)
    m.add(impact(m, 2.0, 32), 1.0, 0.9)
    m.add(braam(1.5), 1.0, 0.6, 0, rev=0.5)
    m.add(crash(m), 2.5, 0.3, 0, rev=0.4)
    m.add(crash(m), 6.0, 0.3, 0, rev=0.4)
    # build: accelerating toms + riser
    tt = 8.0
    while tt < DROP - 0.02:
        gap = 0.25 if tt < 8.75 else (0.125 if tt < 9.15 else 0.0625)
        m.add(tom(85, 0.4), tt, 0.25 + 0.4 * (tt - 8.0) / (DROP - 8.0), 0, rev=0.3)
        tt += gap
    m.add(whoosh(m, DROP - 8.0), 8.0, 0.55)
    m.add(braam(3.5), DROP, 1.0, 0, rev=0.6)
    m.add(impact(m, 2.4, 30), DROP, 1.0)
    m.add(crash(m, 3.0), DROP, 0.45, 0, rev=0.5)
    sync_fx(m, 0.85)
    m.render("style_C_trailer.wav", 2.6, 0.5)


if __name__ == "__main__":
    style_trap()
    style_swing()
    style_trailer()
