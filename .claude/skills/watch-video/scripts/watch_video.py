#!/usr/bin/env python3
"""Prepare a video (URL or local file) so Claude can "watch" it.

Outputs into an output directory:
  video.*            the downloaded video (skipped if a local file was given)
  info.json          title / duration / uploader / description (when known)
  frames/frame_XXXX_tMMmSSs.jpg   evenly spaced frames, timestamp in the name
  contact_sheet.jpg  grid of all frames in one image (quick overview)
  transcript.txt     speech text: subtitles if available, else ElevenLabs STT
  summary.md         index of everything above

Usage:
  python3 watch_video.py <url-or-path> [--out DIR] [--frames N] [--no-transcribe]
"""
from __future__ import annotations

import argparse
import json
import os
import re
import shutil
import subprocess
import sys
from pathlib import Path


def run(cmd: list[str], check: bool = True) -> subprocess.CompletedProcess:
    return subprocess.run(cmd, check=check, capture_output=True, text=True)


def ensure_ytdlp() -> None:
    if shutil.which("yt-dlp"):
        return
    print("[watch-video] installing yt-dlp ...", file=sys.stderr)
    run([sys.executable, "-m", "pip", "install", "-q", "-U", "yt-dlp"])


def ensure_ffmpeg() -> None:
    if not (shutil.which("ffmpeg") and shutil.which("ffprobe")):
        sys.exit("ffmpeg/ffprobe not found. Install with: apt-get install -y ffmpeg")


def is_url(s: str) -> bool:
    return bool(re.match(r"^https?://", s, re.I))


def download(url: str, out: Path) -> tuple[Path, dict]:
    ensure_ytdlp()
    base = [
        "yt-dlp", "--no-playlist", "--no-progress",
        "-f", "bv*[height<=720]+ba/b[height<=720]/bv*+ba/b",
        "--merge-output-format", "mp4", "--write-info-json",
        "-o", str(out / "video.%(ext)s"),
    ]
    subs = ["--write-subs", "--write-auto-subs", "--sub-langs", "th.*,en.*",
            "--sub-format", "vtt/srt/best", "--convert-subs", "srt"]
    p = run(base + subs + [url], check=False)
    if p.returncode != 0:  # subtitle fetch errors can abort the run; retry without
        p = run(base + [url], check=False)
    if p.returncode != 0:
        msg = (p.stderr or p.stdout).strip()[-1500:]
        if "403" in msg or "Tunnel connection failed" in msg or "Unable to connect" in msg:
            msg += ("\n\nHint: the network/proxy refused this host. In a Claude Code cloud "
                    "session, add the site's domain to the environment's allowed network domains.")
        sys.exit(f"yt-dlp failed:\n{msg}")
    videos = [f for f in out.glob("video.*") if f.suffix.lower() in (".mp4", ".mkv", ".webm", ".mov", ".m4v", ".flv")]
    if not videos:
        sys.exit("yt-dlp finished but no video file was found")
    info = {}
    info_file = out / "video.info.json"
    if info_file.exists():
        raw = json.loads(info_file.read_text())
        info = {k: raw.get(k) for k in ("title", "uploader", "duration", "upload_date", "view_count", "description", "webpage_url")}
        info_file.unlink()  # very large; keep only the essentials
    return videos[0], info


def probe_duration(video: Path) -> float:
    p = run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=nw=1:nk=1", str(video)])
    try:
        return float(p.stdout.strip())
    except ValueError:
        return 0.0


def fmt_ts(sec: float) -> str:
    sec = int(sec)
    return f"{sec // 3600:02d}h{sec % 3600 // 60:02d}m{sec % 60:02d}s" if sec >= 3600 else f"{sec // 60:02d}m{sec % 60:02d}s"


def extract_frames(video: Path, out: Path, n: int, duration: float) -> list[Path]:
    fdir = out / "frames"
    fdir.mkdir(exist_ok=True)
    frames = []
    if duration <= 0:
        duration = 1.0
    n = max(1, min(n, int(duration) + 1))
    for i in range(n):
        t = duration * (i + 0.5) / n
        f = fdir / f"frame_{i + 1:04d}_t{fmt_ts(t)}.jpg"
        run(["ffmpeg", "-loglevel", "error", "-y", "-ss", f"{t:.2f}", "-i", str(video),
             "-frames:v", "1", "-vf", "scale='min(960,iw)':-2", "-q:v", "4", str(f)], check=False)
        if f.exists():
            frames.append(f)
    return frames


def contact_sheet(frames: list[Path], out: Path) -> Path | None:
    if not frames:
        return None
    cols = 4 if len(frames) > 4 else len(frames)
    rows = (len(frames) + cols - 1) // cols
    sheet = out / "contact_sheet.jpg"
    lst = out / ".frames.txt"
    lst.write_text("".join(f"file '{f.resolve()}'\n" for f in frames))
    run(["ffmpeg", "-loglevel", "error", "-y", "-f", "concat", "-safe", "0", "-i", str(lst),
         "-vf", f"scale=320:-2,drawtext=text='%{{eif\\:n+1\\:d}}':x=6:y=6:fontsize=20:fontcolor=yellow:box=1:boxcolor=black@0.6,tile={cols}x{rows}",
         "-frames:v", "1", "-q:v", "4", str(sheet)], check=False)
    if not sheet.exists():  # drawtext may be unavailable (no fontconfig) -> retry plain
        run(["ffmpeg", "-loglevel", "error", "-y", "-f", "concat", "-safe", "0", "-i", str(lst),
             "-vf", f"scale=320:-2,tile={cols}x{rows}", "-frames:v", "1", "-q:v", "4", str(sheet)], check=False)
    lst.unlink(missing_ok=True)
    return sheet if sheet.exists() else None


def srt_to_text(srt: Path) -> str:
    lines, last = [], None
    ts = None
    for line in srt.read_text(errors="ignore").splitlines():
        line = line.strip()
        if not line or line.isdigit():
            continue
        m = re.match(r"(\d\d):(\d\d):(\d\d)[,.]\d+\s*-->", line)
        if m:
            ts = f"[{m.group(1)}:{m.group(2)}:{m.group(3)}]"
            continue
        line = re.sub(r"<[^>]+>", "", line)
        if line and line != last:
            lines.append(f"{ts} {line}" if ts else line)
            last = line
    return "\n".join(lines)


def has_audio(video: Path) -> bool:
    p = run(["ffprobe", "-v", "error", "-select_streams", "a", "-show_entries", "stream=index", "-of", "csv=p=0", str(video)], check=False)
    return bool(p.stdout.strip())


def transcribe_elevenlabs(video: Path, out: Path) -> tuple[str | None, str]:
    try:
        import requests  # noqa: PLC0415
    except ImportError:
        return None, "python 'requests' not installed"
    audio = out / "audio.mp3"
    run(["ffmpeg", "-loglevel", "error", "-y", "-i", str(video), "-vn", "-ac", "1", "-ar", "16000", "-b:a", "48k", str(audio)], check=False)
    if not audio.exists():
        return None, "could not extract audio"
    key = os.environ.get("ELEVENLABS_API_KEY", "proxy-injected")
    with audio.open("rb") as fh:
        r = requests.post("https://api.elevenlabs.io/v1/speech-to-text",
                          headers={"xi-api-key": key},
                          data={"model_id": "scribe_v1", "timestamps_granularity": "word"},
                          files={"file": ("audio.mp3", fh, "audio/mpeg")}, timeout=600)
    if r.status_code != 200:
        return None, f"ElevenLabs STT HTTP {r.status_code}: {r.text[:300]}"
    data = r.json()
    words = data.get("words") or []
    # group into ~10s lines with timestamps
    lines, cur, start = [], [], None
    for w in words:
        if w.get("type") == "spacing":
            continue
        if start is None:
            start = w.get("start", 0)
        cur.append(w.get("text", ""))
        if w.get("end", 0) - start >= 10:
            lines.append(f"[{fmt_ts(start)}] " + " ".join(cur))
            cur, start = [], None
    if cur:
        lines.append(f"[{fmt_ts(start or 0)}] " + " ".join(cur))
    text = "\n".join(lines) or data.get("text", "")
    return text, f"ElevenLabs scribe_v1 (language: {data.get('language_code', '?')})"


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("source", help="video URL or local file path")
    ap.add_argument("--out", default=None, help="output dir (default /tmp/watch-video/<name>)")
    ap.add_argument("--frames", type=int, default=0, help="number of frames (default: auto by duration)")
    ap.add_argument("--no-transcribe", action="store_true")
    a = ap.parse_args()

    ensure_ffmpeg()
    name = re.sub(r"[^A-Za-z0-9_-]+", "_", a.source.split("?")[0].rstrip("/").split("/")[-1])[:40] or "video"
    out = Path(a.out or f"/tmp/watch-video/{name}").resolve()
    out.mkdir(parents=True, exist_ok=True)

    if is_url(a.source):
        video, info = download(a.source, out)
    else:
        video, info = Path(a.source).resolve(), {"title": Path(a.source).name}
        if not video.exists():
            sys.exit(f"file not found: {video}")

    duration = probe_duration(video)
    info["duration"] = info.get("duration") or round(duration, 1)
    (out / "info.json").write_text(json.dumps(info, ensure_ascii=False, indent=2))

    n = a.frames or (8 if duration <= 30 else 12 if duration <= 120 else 16 if duration <= 600 else 24)
    frames = extract_frames(video, out, n, duration)
    sheet = contact_sheet(frames, out)

    transcript, source = None, "none"
    subs = sorted(out.glob("video*.srt"))
    if subs:
        thai = [s for s in subs if ".th" in s.name]
        pick = (thai or subs)[0]
        transcript, source = srt_to_text(pick), f"subtitles ({pick.name})"
    elif a.no_transcribe:
        source = "skipped (--no-transcribe)"
    elif not has_audio(video):
        source = "video has no audio track"
    else:
        transcript, source = transcribe_elevenlabs(video, out)
        if transcript is None:
            source = f"unavailable: {source}"
    if transcript:
        (out / "transcript.txt").write_text(transcript)

    md = [f"# {info.get('title') or name}", "",
          f"- source: {a.source}", f"- duration: {duration:.1f}s", f"- video file: {video}",
          f"- transcript: {source}" + (f" -> {out / 'transcript.txt'}" if transcript else ""),
          f"- contact sheet: {sheet}" if sheet else "- contact sheet: (failed)", "", "## Frames"]
    md += [f"- {f}" for f in frames]
    if info.get("description"):
        md += ["", "## Description", str(info["description"])[:2000]]
    (out / "summary.md").write_text("\n".join(md))
    print("\n".join(md))
    print(f"\n[watch-video] done. Output dir: {out}")


if __name__ == "__main__":
    main()
