---
name: thai-product-clip
description: Make a Thai product explainer / ad clip (supplements, health products) from the user's voiceover video plus product images, in the user's established style — keyword-only captions, flat scenario illustrations, user photos, original background music, varied quiet SFX, TikTok-safe margins. Use when the user sends a voiceover (mp4/audio) with product pictures and asks for a clip ("ทำคลิป", "เอาเสียงนี้ไปทำคลิป", "ทำแบบคราวที่แล้ว").
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

## Gotchas

- Emoji don't render (no emoji font); use SVG icons.
- Thai fonts: Kanit is bundled; the template's `@font-face` uses unicode-range to split Thai and Latin.
- faster-whisper + this PyAV: pass a float32 numpy array, not a file path.
- Rendering a 2160² frame takes ~0.2 s; ~1000 frames is about 4 minutes.
