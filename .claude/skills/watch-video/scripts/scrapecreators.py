"""Optional ScrapeCreators (https://scrapecreators.com) backend for watch_video.py.

Used when the env var SCRAPECREATORS_API_KEY is set. Gets metadata, a transcript
and a direct video URL from the ScrapeCreators API, so it works even when
yt-dlp's scraping of the platform fails.

Endpoints/field names were written without access to the API docs, so parsing
is deliberately defensive (searches the JSON for likely fields). Override the
base URL with SCRAPECREATORS_BASE_URL if needed.
"""
from __future__ import annotations

import json
import os
import re
from pathlib import Path

BASE = os.environ.get("SCRAPECREATORS_BASE_URL", "https://api.scrapecreators.com").rstrip("/")


def _platform(url: str) -> str | None:
    u = url.lower()
    for key, pat in (("tiktok", "tiktok.com"), ("youtube", "youtu"), ("instagram", "instagram.com"),
                     ("facebook", "facebook.com"), ("facebook", "fb.watch"), ("twitter", "twitter.com"),
                     ("twitter", "x.com/")):
        if pat in u:
            return key
    return None


# candidate endpoints per platform: (path, extra params)
ENDPOINTS = {
    "tiktok": [("/v2/tiktok/video", {"get_transcript": "true"}), ("/v1/tiktok/video", {})],
    "youtube": [("/v1/youtube/video", {"get_transcript": "true"})],
    "instagram": [("/v1/instagram/post", {})],
    "facebook": [("/v1/facebook/post", {})],
    "twitter": [("/v1/twitter/tweet", {})],
}
TRANSCRIPT_ENDPOINTS = {
    "tiktok": "/v1/tiktok/video/transcript",
    "youtube": "/v1/youtube/video/transcript",
    "instagram": "/v2/instagram/media/transcript",
    "facebook": "/v1/facebook/post/transcript",
}


def _walk(obj, path=""):
    if isinstance(obj, dict):
        for k, v in obj.items():
            yield from _walk(v, f"{path}.{k}" if path else k)
    elif isinstance(obj, list):
        for i, v in enumerate(obj):
            yield from _walk(v, f"{path}[{i}]")
    else:
        yield path, obj


def _find(data, *keys):
    """First non-empty scalar whose path ends with one of keys."""
    for p, v in _walk(data):
        last = re.split(r"[.\[]", p)[-1].rstrip("]")
        if last in keys and v not in (None, "", 0):
            return v
    return None


def _video_urls(data) -> list[str]:
    urls = []
    for p, v in _walk(data):
        if not (isinstance(v, str) and v.startswith("http")):
            continue
        pl = p.lower()
        if any(x in pl for x in ("cover", "avatar", "thumb", "music", "image", "author", "share_url", "web_url")):
            continue
        if any(x in pl for x in ("play_addr", "download_addr", "video_url", "playable_url", "hdplay", ".play",
                                  "download_url", "browser_native", "video_versions", "variants", "mp4")) \
                or ".mp4" in v.lower():
            urls.append(v)
    # prefer no-watermark play_addr first
    urls.sort(key=lambda u: 0 if "play_addr" in u or "nwm" in u else 1)
    seen, uniq = set(), []
    for u in urls:
        if u not in seen:
            seen.add(u)
            uniq.append(u)
    return uniq


def _vtt_to_text(t: str) -> str:
    if "-->" not in t:
        return t.strip()
    lines, last, ts = [], None, None
    for line in t.splitlines():
        line = line.strip()
        if not line or line == "WEBVTT" or line.isdigit():
            continue
        m = re.match(r"(?:(\d+):)?(\d\d):(\d\d)[.,]\d+\s*-->", line)
        if m:
            ts = f"[{int(m.group(1) or 0):02d}:{m.group(2)}:{m.group(3)}]"
            continue
        if line != last:
            lines.append(f"{ts} {line}" if ts else line)
            last = line
    return "\n".join(lines)


def fetch(url: str, out: Path) -> dict | None:
    """Return {'info', 'transcript', 'video_urls', 'cover', 'error'} or None if no key/platform."""
    key = os.environ.get("SCRAPECREATORS_API_KEY")
    plat = _platform(url)
    if not key or not plat:
        return None
    import requests  # noqa: PLC0415

    h = {"x-api-key": key}
    res = {"info": {}, "transcript": None, "video_urls": [], "cover": None, "error": None}
    data = None
    for path, extra in ENDPOINTS.get(plat, []):
        try:
            r = requests.get(BASE + path, headers=h, params={"url": url, **extra}, timeout=60)
        except requests.RequestException as e:
            res["error"] = f"{path}: {e}"
            continue
        if r.status_code == 200:
            data = r.json()
            break
        res["error"] = f"{path}: HTTP {r.status_code} {r.text[:200]}"
    if data is not None:
        (out / "scrapecreators.json").write_text(json.dumps(data, ensure_ascii=False, indent=1))
        dur = _find(data, "duration", "lengthSeconds", "video_duration")
        if isinstance(dur, (int, float)) and dur > 1000:  # TikTok reports ms
            dur = dur / 1000
        res["info"] = {
            "title": _find(data, "title", "desc", "description", "caption", "text"),
            "uploader": _find(data, "nickname", "unique_id", "username", "channel", "name"),
            "duration": dur,
            "description": _find(data, "desc", "description", "caption", "text"),
            "webpage_url": url,
        }
        res["video_urls"] = _video_urls(data)
        res["cover"] = _find(data, "origin_cover", "cover", "thumbnail", "display_url")
        tr = _find(data, "transcript", "transcript_only_text", "subtitles")
        if isinstance(tr, str) and tr.strip():
            res["transcript"] = _vtt_to_text(tr)
        res["error"] = None
    if not res["transcript"] and plat in TRANSCRIPT_ENDPOINTS:
        try:
            r = requests.get(BASE + TRANSCRIPT_ENDPOINTS[plat], headers=h, params={"url": url}, timeout=120)
            if r.status_code == 200:
                tr = _find(r.json(), "transcript", "transcript_only_text", "text")
                if isinstance(tr, str) and tr.strip():
                    res["transcript"] = _vtt_to_text(tr)
        except (requests.RequestException, ValueError):
            pass
    return res


def download_file(url: str, dest: Path) -> bool:
    import requests  # noqa: PLC0415

    try:
        with requests.get(url, stream=True, timeout=120,
                          headers={"User-Agent": "Mozilla/5.0", "Referer": "https://www.tiktok.com/"}) as r:
            if r.status_code != 200:
                return False
            with dest.open("wb") as fh:
                for chunk in r.iter_content(1 << 16):
                    fh.write(chunk)
        return dest.stat().st_size > 10_000
    except requests.RequestException:
        return False
