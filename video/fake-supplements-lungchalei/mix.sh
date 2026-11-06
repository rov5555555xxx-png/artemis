#!/usr/bin/env bash
# Mix music (ducked under voice) + voice + SFX into mix.wav.
set -euo pipefail
D="$(cd "$(dirname "$0")" && pwd)"
DUR=$(python3 -c "import json;print(json.load(open('$D/timeline.json'))['dur'])")
python3 "$D/music.py" "$D/music.wav" "$DUR"
ffmpeg -v error -y -i "$D/music.wav" -i "$D/voice.wav" -i "$D/sfx.wav" -filter_complex \
  "[1]aformat=channel_layouts=stereo,asplit=2[v1][v2];[2]aformat=channel_layouts=stereo,volume=0.8[fx];[0]volume=0.5[m];[m][v1]sidechaincompress=threshold=0.03:ratio=5:attack=30:release=400[d];[d][v2][fx]amix=inputs=3:duration=first:normalize=0,alimiter=limit=0.95" \
  -ar 44100 "$D/mix.wav"
