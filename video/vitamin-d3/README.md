# ลุงเฉลย — วิตามิน D3

Vertical (1080×1920) animated explainer: an uncle tells his nephew how vitamin D3 was discovered.
The animation is HTML/SVG (`index.html`), rendered frame by frame with Playwright and encoded with ffmpeg.

## Build

```bash
./make.sh
```

Steps: `build_vo.py` (narration → `voice.wav`, `timeline.js`) → `music.py` → ffmpeg mix → `render.js` (→ `vitamin-d3-lungchalei-voice.mp4`).
Scene and subtitle timing follow the length of each narration line.

## Voice engines

- **ElevenLabs** — used when `ELEVEN_VOICE_UNCLE` and `ELEVEN_VOICE_NEPHEW` are set.
  Needs `api.elevenlabs.io` in the environment's allowed domains and the API key as a network secret
  or `ELEVENLABS_API_KEY`. Optional `ELEVEN_MODEL` (default `eleven_v4`).
  `python3 eleven_voices.py` lists voice IDs and models.
- **MMS Thai (offline)** — fallback; downloads `vits-mms-tha` from the sherpa-onnx releases.

Narration text lives in `LINES` in `build_vo.py` (foreign names spelled in Thai for pronunciation);
on-screen subtitles live in `SUBS` in `index.html` — keep both in the same order.
