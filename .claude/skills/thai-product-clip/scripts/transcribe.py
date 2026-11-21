"""Thai transcription with word timestamps.
usage: python3 -I transcribe.py <whisper_dir> <audio_16k_f32.raw> "<vocab prompt>" [start end]
make the raw file: ffmpeg -i in.mp4 -vn -ac 1 -ar 16000 -f f32le a16.raw
(raw float input avoids a PyAV version bug in faster-whisper's decoder)"""
import sys, numpy as np
from faster_whisper import WhisperModel
m = WhisperModel(sys.argv[1], device="cpu", compute_type="int8")
aud = np.fromfile(sys.argv[2], dtype=np.float32)
prompt = sys.argv[3] if len(sys.argv) > 3 else None
a, b = (float(sys.argv[4]), float(sys.argv[5])) if len(sys.argv) > 5 else (0, len(aud) / 16000)
seg = aud[int(a * 16000):int(b * 16000)]
s, _ = m.transcribe(seg, language="th", beam_size=5, temperature=0, word_timestamps=True,
                    condition_on_previous_text=False, initial_prompt=prompt)
for x in s:
    print(f"[{x.start+a:.2f}-{x.end+a:.2f}] {x.text}")
    print("   " + " ".join(f"{w.word.strip()}@{w.start+a:.2f}" for w in x.words), flush=True)
