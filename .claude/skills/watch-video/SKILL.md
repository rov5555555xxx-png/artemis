---
name: watch-video
description: Watch and understand a video from a link (YouTube, TikTok, Facebook, X/Twitter, Vimeo, direct .mp4 URL, etc.) or a local video file. Use whenever the user sends a video link or file and asks to watch, summarize, describe, explain, or answer questions about it ("ดูคลิปนี้ให้หน่อย", "สรุปวีดีโอนี้", "in this video what happens...").
---

# Watch Video

You cannot stream video directly, so "watching" = download the video, look at
sampled frames (images), and read what is said (subtitles or speech-to-text).

## Steps

1. Run the helper (auto-installs `yt-dlp` if missing; needs `ffmpeg`):

   ```bash
   python3 .claude/skills/watch-video/scripts/watch_video.py "<URL or file path>"
   ```

   Options: `--frames N` (more frames for long/fast videos, default auto 8–24),
   `--out DIR` (default `/tmp/watch-video/<name>`), `--no-transcribe`.

2. Read the printed `summary.md`. Then **look at the images with the Read tool**:
   - `contact_sheet.jpg` first — a numbered grid of all frames for an overview.
   - Then individual `frames/frame_XXXX_tMMmSSs.jpg` (timestamp is in the
     filename) where you need detail (text on screen, faces, products, code...).
3. Read `transcript.txt` if it exists (subtitles are preferred; otherwise
   ElevenLabs speech-to-text is tried). Lines are prefixed with timestamps.
4. Answer the user by combining visuals + speech, citing timestamps.
   Reply in the user's language.

## Zooming in on a moment

For a specific moment or fast action, grab extra frames around it:

```bash
ffmpeg -loglevel error -ss 00:01:20 -i <video> -t 4 -vf fps=2,scale=960:-2 /tmp/watch-video/zoom_%02d.jpg
```

## Troubleshooting

- `Tunnel connection failed: 403` / `connect_rejected`: the cloud environment's
  network policy blocks that site. Tell the user to add the domain (e.g.
  `youtube.com`, `googlevideo.com`, `ytimg.com` for YouTube; `tiktok.com`,
  `tiktokcdn.com` for TikTok) under the environment's allowed network domains, or
  to upload the video file directly instead.
- `Sign in to confirm you're not a bot` / private videos: yt-dlp needs cookies
  (`--cookies cookies.txt`); ask the user to upload the file instead.
- Transcript `unavailable: ... missing the permission speech_to_text`: the
  ElevenLabs key lacks Speech-to-Text permission. Work from frames only and say
  so, or ask the user to enable the permission on the key.
- Never invent content for parts you could not see or hear — say what was missing.
