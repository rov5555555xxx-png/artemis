"""Remove silences from a talking-head video (tight jump-cut style, v1).
usage: python3 -I cut_silence.py in.mp4 out.mov keep.json [noise_db=-35] [min_sil=0.3] [pad=0.07]
Writes keep.json = list of [start,end] kept ranges in ORIGINAL seconds (use it to map transcript times)."""
import sys, json, re, subprocess
src, out, kj = sys.argv[1:4]
noise = sys.argv[4] if len(sys.argv) > 4 else "-35"
mind = float(sys.argv[5]) if len(sys.argv) > 5 else 0.3
pad = float(sys.argv[6]) if len(sys.argv) > 6 else 0.07
dur = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", src]))
log = subprocess.run(["ffmpeg", "-i", src, "-af", f"silencedetect=noise={noise}dB:d={mind}", "-f", "null", "-"], capture_output=True, text=True).stderr
starts = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", log)]
ends = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", log)]
if len(ends) < len(starts): ends.append(dur)
keep, cur = [], 0.0
for s, e in zip(starts, ends):
    a = 0 if s < 0.01 else s + pad
    b = e - pad if e < dur - 0.01 else dur
    if b - a > 0.05:
        if a > cur: keep.append((cur, a))
        cur = b
if cur < dur - 0.05: keep.append((cur, dur))
json.dump(keep, open(kj, "w"))
print(len(keep), "segments, %.2fs -> %.2fs" % (dur, sum(b - a for a, b in keep)))
sel = "+".join(f"between(t,{a:.3f},{b:.3f})" for a, b in keep)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", src, "-vf", f"select='{sel}',setpts=N/FRAME_RATE/TB",
                "-af", f"aselect='{sel}',asetpts=N/SR/TB", "-c:v", "libx264", "-crf", "16", "-preset", "fast",
                "-c:a", "pcm_s16le", out], check=True)
