"""Dark, tense underscore: low drone, pulsing sub, ticking clock. Usage: music.py out.wav seconds"""
import sys, wave
import numpy as np

sr = 44100
dur = float(sys.argv[2])
n = int(sr * dur)
t = np.arange(n) / sr
f = lambda m: 440 * 2 ** ((m - 69) / 12)
rng = np.random.default_rng(3)

# drone: D minor cluster with slow beating, swelling every 8 s
out = np.zeros(n)
for m, g in ((38, .5), (45, .35), (50, .25), (53, .18)):
    for det in (-0.15, 0.15):
        out += g * .06 * np.sin(2 * np.pi * (f(m) + det) * t)
out *= 0.75 + 0.25 * np.sin(2 * np.pi * t / 8)

# pulse: sub thump on every beat at 96 bpm, plus off-beat tick
beat = 60 / 96
for s in np.arange(0, dur, beat):
    i = int(s * sr)
    m = min(n - i, int(.35 * sr))
    tt = np.arange(m) / sr
    out[i:i + m] += .22 * np.sin(2 * np.pi * (48 * np.exp(-tt * 4) + 32) * tt) * np.exp(-tt / .12)
    j = int((s + beat / 2) * sr)
    if j < n - 300:
        out[j:j + 300] += .05 * rng.standard_normal(300) * np.exp(-np.arange(300) / 40)

# high tension string-like tone fading in and out
out += .025 * np.sin(2 * np.pi * f(74) * t + 2 * np.sin(2 * np.pi * 5 * t) * .02) * (0.5 + 0.5 * np.sin(2 * np.pi * t / 13)) ** 2

fade = np.ones(n)
fi, fo = int(sr * 1.0), int(sr * 3)
fade[:fi] = np.linspace(0, 1, fi)
fade[-fo:] = np.linspace(1, 0, fo)
y = out * fade
y = y / np.max(np.abs(y)) * 0.5
pcm = (y * 32767).astype(np.int16)
w = wave.open(sys.argv[1], 'wb')
w.setnchannels(2); w.setsampwidth(2); w.setframerate(sr)
w.writeframes(np.repeat(pcm[:, None], 2, 1).tobytes())
w.close()
