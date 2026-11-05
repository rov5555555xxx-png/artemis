---
name: thai-product-clip
description: Make or edit Thai TikTok clips in the user's established style — (a) product explainer/ad clips (supplements, brand INZENT) built from a voiceover plus product images, and (b) 9:16 talking-head edits of the user's own camera footage (cut silences, zoom punches, motion graphics). Keyword-only captions, scenario illustrations, user photos, original background music, varied quiet SFX, TikTok-safe margins. Use when the user sends a voiceover/raw clip (upload or Google Drive) and asks for a clip ("ทำคลิป", "เอาเสียงนี้ไปทำคลิป", "ตัดต่อให้หน่อย", "ตัดช่วงเงียบ", "ทำแบบคราวที่แล้ว").
---

# Thai product explainer clip

The user sells supplements (brand INZENT) on TikTok. They send: a voiceover video (often a static screenshot + Thai voice), product photos, sometimes reference tables or lifestyle photos. You build the whole clip yourself and deliver MP4s. Reply to the user in Thai, casually and concisely.

Finished examples live in `output/` (vitamin D3+K2, magnesium); `output/src/magnesium/mg.html` is the most recent, approved layout.

## Defaults the user has already chosen (do not ask again)

- **Format:** 1:1, rendered **2160×2160** (page is 1080×1080 CSS, DPR 2), 30 fps, length = voiceover length. Only use another ratio if they ask.
- **Safe zone (very important):** equal **130px margin on all four sides** (of 1080). Every text, product, card, photo and icon stays inside the 820×820 centre box. Nothing in corners or near edges, including decorative bubbles, stars and confetti (fade them out before the margin). No camera tilt; only gentle zoom (≤2%).
- **Text position:** never at the top. Visual (photo / illustration / bottle) sits in the upper half of the safe box (y≈150–620), and the text sits under it in the middle-lower area (y≈600–900).
- **Captions:** keywords only, 1–2 short phrases per beat, synced to the spoken word; highlight sweep on the key word. No full subtitles. No on-screen presenter.
- **Visuals:** every beat gets a "สถานการณ์จำลอง" (simulated situation) so viewers can picture it: flat SVG illustrations (the `person()` / `headSvg()` helpers in the template) or the user's own photos when they fit. Use supplied photos where suitable (Ken Burns zoom + crossfade, white rounded frame); skip photos that are too low-res for 2160 or duplicate a scene, and tell the user which you skipped.
- **Product:** cut the bottle out of the product images with rembg and make it the hero (float, sway, light shine sweep). Use the product colours for the theme (D3 = orange/yellow, magnesium = blue/navy + gold).
- **Motion:** pop/stamp/slam entrances, varied scene transitions (swipe, iris, slide, zoom, flash — don't repeat the same one back to back), rings on big hits, counters for numbers, bars/charts for comparisons.
- **Audio:**
  - Original background music generated with `scripts/music.py` (adapt tempo/chords to the mood), ducked under the voice.
  - SFX: many different sounds that match the scene (clock tick, birds, water, alarm, glass, chimes...). Don't reuse the same sound within a few seconds; vary pitch. Keep SFX quiet (~20 dB under voice peaks); music ~13 dB under the voice.
  - You cannot listen: say so and give the measured levels.
- **Deliver two files:** `output/<name>-1x1-2160.mp4` (voice + music + SFX) and `output/<name>-1x1-2160-music-sfx-only.mp4` (no voice). Send both with SendUserFile, copy sources to `output/src/<name>/`, commit and push to the session branch.
- **Facts:** take numbers and claims from the user's voiceover and images only; flag anything you inferred (e.g. a promo shown in an image but not spoken, unclear words in the transcript).

## Workflow

1. **Setup** (once per session): `bash .claude/skills/thai-product-clip/scripts/setup.sh`
   (installs faster-whisper, rembg, scipy; fetches the Whisper-small model from npm and the rembg model from GitHub, because Hugging Face is blocked). ElevenLabs in this environment has no speech-to-text or sound-generation permission, so don't rely on it.
2. **Inspect & transcribe:** use ffprobe to get the duration, make a 1-fps contact sheet to see any on-screen text, then `ffmpeg -i in.mp4 -vn -ac 1 -ar 44100 audio.wav` and `... -ar 16000 -f f32le a16.raw`, then
   `python3 -I scripts/transcribe.py /tmp/whisper-small a16.raw "<product vocab>"`.
   Thai output is rough: fix words from context and the images, re-run unclear spans with a start/end and a better vocab prompt, and check silent gaps (they may hide speech).
3. **Assets:** put uploads in their own folder. Run `python3 -I scripts/cut.py <img> x0,y0,x1,y1 bottle.png` (crop box in the image's real pixels; screenshots are often 1080×2340), then composite the result on green to check it. Convert photos to JPG at ≤1600 px wide.
4. **Page:** copy `templates/square_template.html` plus `assets/fonts/*` and the images into a build folder. Rewrite the scenes for the new script: each `.scene` has `data-s`/`data-e` (seconds), `data-bg` (night/day/morning/blue/grey or add your own), `data-tr` (transition), and elements with `data-at` + `data-an`. Keep the engine (`window.render(t)`) as is.
5. **Check:** render stills with the `#safe` URL hash (this shows the 130px guide box) at several times, tile them with ffmpeg into one image, look at it, and fix overlaps, edge crowding and low-res images. Then render the video in the background with `DPR=2` (about 4–6 minutes) and use Monitor or the background notification; don't poll with sleep.
6. **Audio:** `python3 -I scripts/music.py music.wav <dur>`; edit the `cues` list in `scripts/mix_sfx.py` to the new timings, then run it to get both mixes. Check the waveform and RMS.
7. **Mux:** `ffmpeg -i video.mp4 -i mix.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart out.mp4` for each version. Make a 1–2 fps contact sheet of the final video and look at it before sending.

## Getting big files (Google Drive)

Chat uploads stop at about 30 MB. For bigger files, the user uploads to Google Drive and shares the file as **"ทุกคนที่มีลิงก์" with the "ผู้มีสิทธิ์อ่าน" (viewer) role**. If they pick Editor, tell them to switch to viewer. The environment allowlists `drive.google.com`, `drive.usercontent.google.com` and `*.googleusercontent.com`.
- Find the file: use the Google Drive connector (`search_files`, e.g. `title contains '<folder>'` with the folder mimeType, then `parentId = '<id>'`) to get the file id and size. The connector's own download is capped at 10 MB, so don't use it for video.
- Download into its own new folder: `curl -L -o clip.mp4 "https://drive.usercontent.google.com/download?id=<ID>&export=download&confirm=t"`, then check that the size matches and `file` says it is an MP4. If you get an HTML sign-in page instead, the file isn't shared publicly yet.
- If Drive is blocked (proxy 403), the user has to add those domains under Network access on the environment this session uses. You cannot change it yourself.
- Instagram, TikTok, Dropbox and similar sites are blocked. Ask for a screen recording or the downloaded file instead.

## 9:16 talking-head edit (user's own camera footage)

Template: `templates/talking_head_9x16_template.html` (from the approved "sugar crash" v1, `output/sugar-crash-9x16.mp4`).
1. Transcribe the raw clip (as in step 2 above) and fix the Thai from context.
2. **Cut silences, tight jump-cut style:** `python3 -I scripts/cut_silence.py raw.mp4 cut.mov keep.json` (silences ≥0.3 s at −35 dB, keeps 0.07 s on each side). Expect about 10–15% shorter.
3. Extract frames: `ffmpeg -i cut.mov -vf fps=30 -q:v 3 build/frames/%05d.jpg`. The page swaps an `<img>` per frame, and `render(t)` is async and awaits `img.decode()`.
4. Fill the template: replace `__KEEP__` with the keep.json contents and `__NF__` with the frame count. Write every time in the page as an **original** video time; the page maps it through `M()` to the cut timeline.
5. **Zoom:** alternate the base scale per sentence (1.0 ↔ 1.06–1.18) so each jump cut reads as a camera change. Add quick punch-ins (+0.08–0.16) with a small shake/flash on emphasis words (e.g. "กระชาก", "เฮ้ย", "ดูนี่นะ"), and end with a slow zoom-out. Set the zoom origin above the face so the face stays in frame.
6. **Motion graphics:** find where the face sits with a gridded frame, then put a white rounded card (about 760×380) with an animated SVG explanation in the empty wall area above the head, inside TikTok-safe space (x 140–940, y ≥ 260; nothing in the bottom ~320 px caption zone or the right-side button column). Put a keyword pill under the card, synced to the spoken word. Build one card per idea, with animated diagrams (fill levels, graphs drawing with dashoffset, objects moving along a path, counters).
7. **Audio:** the user's phone recordings are quiet, so normalise the voice to about −16 dBFS RMS first. Generate music with `scripts/music.py`, keep it about 12 dB under the voice, and use the varied SFX palette (`scripts/mix_talking_head_example.py` shows cues in original times mapped through keep.json).
8. Render at 1080×1920 (`VW=1080 VH=1920`, DPR 1). It takes about 5 minutes for 40 s. Mux with AAC, and re-encode at crf 21 if the file is over about 40 MB.

## Gotchas

- Emoji don't render (no emoji font); use SVG icons.
- Thai fonts: Kanit is bundled; the template's `@font-face` uses unicode-range to split Thai and Latin.
- faster-whisper + this PyAV: pass a float32 numpy array, not a file path.
- Rendering a 2160² frame takes ~0.2 s; ~1000 frames is about 4 minutes.
