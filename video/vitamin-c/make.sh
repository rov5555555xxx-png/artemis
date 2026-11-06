#!/usr/bin/env bash
# Build the voiced video: narration -> music -> mix -> render.
set -euo pipefail
D="$(cd "$(dirname "$0")" && pwd)"
pip install -q soundfile numpy
if [ -z "${ELEVEN_VOICE_UNCLE:-}" ] && [ ! -f "$D/models/vits-mms-tha/model.onnx" ]; then
  pip install -q sherpa-onnx
  mkdir -p "$D/models"
  curl -sSL https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/vits-mms-tha.tar.bz2 | tar xj -C "$D/models"
fi
python3 "$D/build_vo.py"
DUR=$(python3 -c "import json;print(json.load(open('$D/timeline.json'))['dur'])")
python3 "$D/music.py" "$D/music.wav" "$DUR"
ffmpeg -v error -y -i "$D/music.wav" -i "$D/voice.wav" -filter_complex \
  "[1]aformat=channel_layouts=stereo,asplit=2[v1][v2];[0]volume=0.55[m];[m][v1]sidechaincompress=threshold=0.03:ratio=6:attack=40:release=500[d];[d][v2]amix=inputs=2:duration=first:normalize=0,alimiter=limit=0.95" \
  -ar 44100 "$D/mix.wav"
node "$D/render.js"
echo "Output: $D/vitamin-c-lungchalei.mp4"
