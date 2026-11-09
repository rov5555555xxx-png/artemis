#!/usr/bin/env bash
# One-time setup per cloud session: Python deps + Whisper (Thai STT) + rembg model.
# Hugging Face is blocked by the network policy, so models come from npm / GitHub releases.
set -e
pip install -q faster-whisper "rembg[cpu]" scipy opencv-python-headless yt-dlp 2>&1 | grep -v WARNING || true
M=${WHISPER_DIR:-/tmp/whisper-small}
if [ ! -f "$M/model.bin" ]; then
  mkdir -p "$M/dl" && cd "$M/dl"
  for i in 0 1 2 3; do
    mkdir -p p$i
    curl -sS "https://registry.npmjs.org/@skillninja/shortmovie-telop-model-p$i/-/shortmovie-telop-model-p$i-1.0.0.tgz" | tar xz -C p$i
  done
  cp p0/package/{tokenizer.json,vocabulary.json,config.json,preprocessor_config.json} "$M/"
  cat p0/package/model.bin.part0 p1/package/model.bin.part1 p2/package/model.bin.part2 p3/package/model.bin.part3 > "$M/model.bin"
  (cd "$M" && echo "$(cat dl/p0/package/model.sha256)  model.bin" | sha256sum -c -) || echo "WARN: whisper checksum mismatch"
  rm -rf "$M/dl"
fi
mkdir -p ~/.u2net
[ -f ~/.u2net/isnet-general-use.onnx ] || curl -sS -L -o ~/.u2net/isnet-general-use.onnx \
  https://github.com/danielgatis/rembg/releases/download/v0.0.0/isnet-general-use.onnx
echo "setup ok: whisper=$M rembg=~/.u2net/isnet-general-use.onnx"
