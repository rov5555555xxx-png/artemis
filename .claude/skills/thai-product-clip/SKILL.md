---
name: thai-product-clip
description: Make Thai product explainer / ad clips (supplements: zinc, magnesium, probiotics...) from the user's voiceover video (upload, Google Drive file name, or link) in the user's approved styles — default is the bright cartoon style with big bouncy Thai captions, 4:3 landscape, original ukulele music and cartoon SFX; also makes cover images. Use when the user sends a voiceover/clip or a Drive file name and asks for a clip ("ทำคลิป", "ทำอันนี้ให้หน่อย", "ทำแบบที่ชอบ", "สไตล์สดใส", "ขอหน้าปก").
---

# Thai product clip

The user (Thai, casual, writes on a phone) sells supplements on TikTok. They send a voiceover video (often a CapCut export with a presenter in a green fish mask) and want a motion-graphics clip that matches the narration. They place our clip on the top half of their 9:16 edit. Reply in Thai, casual and short. Don't ask about things already decided below; just build and deliver.

## Defaults the user already chose (don't ask again)

- **Style = "bright" (the one they said they love):** pastel backgrounds (peach / sky / mint / sun / lilac / pink), flat cartoon kids with navy outlines (`kid()` helper), sticker pills (`.stk`), stars/confetti, pop/bounce/drop/jelly animations, gentle camera zoom-in/out per scene. Never "grand"/dark unless asked.
- **Format = 4:3 landscape**, page 1440×1080 CSS, render DPR 2 → 2880×2160, 30 fps. (1:1 2160² only if they ask; `templates/bright_1x1_template.html`.)
- **Safe zone:** keep every text, product and important visual inside 130 px margins (box 130–1310 × 130–950). Camera zooms ≤ ~1.06 so things don't leave it.
- **Captions:** few words, BIG, playful kinetic text (`.kt` with `data-fx` bounce | drop | jelly | shake), split into Thai grapheme clusters with `Intl.Segmenter`. 1 short phrase per beat, synced to the spoken word. No full subtitles. Stickers for lists/claims.
- **Every beat gets a picture that acts out the line** (glass filling 4%→70%, balance scale tipping, battery %, race where the product overtakes, magnifier, graph with a smiling rider, molecule, crowd of people, checklist cards, crown...). If a beat looks static for >1 s, add motion (counter, arrows, sparkles, dancing kid, extra caption) — the user complains about "ค้าง".
- **Comparisons with other products:** never show another brand. Use an unbranded white jar (`jarSvg(label,cap)`) for "old/ordinary" products.
- **When told not to use their images:** draw everything; use an icon (glossy element ball `heroSvg('Mg','MAGNESIUM')` / `heroSvg('Zn','ZINC')`) instead of a bottle.
- **When they allow footage images:** cut products from frames with `scripts/cut.py` (rembg) — then remove stray blobs (keep largest alpha component) and check on green; crop photos/charts from frames as `.photo` panels. Never use the masked presenter.
- **Product box on dark backgrounds** must be a full rectangle (check corners!) — build the mask from a low threshold + convex hull, add a thin white rim.
- **Audio:** original music `scripts/music_bright.py` (ukulele strum, bass, claps, whistle/glock hook — vary key/BPM/hook per clip if they ask for something new), SFX from the cartoon palette in `scripts/sfx_bright.py` (pop, boing, slide whistle, squeak, bike bell, party horn, tada, drum roll, sad trombone, plinks…). Don't reuse the exact same sound within a few seconds. Mix: music ≈ 13–14 dB under voice, SFX quieter. You can't listen — say so and give the measured RMS.
- **Deliver:** `output/<name>-4x3.mp4` (voice+music+SFX) and `output/<name>-4x3-music-sfx-only.mp4`, send both with SendUserFile, plus a short Thai table of scenes. Make a cover (`templates/cover_4x3_template.html`, big readable title + product/icon, PNG 2880×2160) when asked or when frame 0 is empty. Copy sources to `output/src/<name>/`, commit and push to the session branch.
- **Openings:** the title/topic must be readable on frame 0 (no slow build-up — viewers swipe away). Start with everything already on screen and animate it (slam/pulse), not fade in from nothing.
- **Facts:** numbers/claims only from the voiceover or their images; list words Whisper got unclear and ask them to check (don't put uncertain claims on screen).

## Getting the voiceover

- **Upload:** use the path given.
- **Google Drive by name:** find it with the Google Drive `search_files` tool (`title contains '9/11/26'`), then download directly (works for link-shared files, no size limit):
  `curl -sSL -o in.mp4 "https://drive.google.com/uc?export=download&id=<FILE_ID>"` (put downloads in their own folder). Don't use `download_file_content` for big videos.
- **TikTok/IG links:** need network access to those hosts; IG often needs login — ask for the file instead.

## Workflow

1. **Setup** (skip if `/tmp/whisper-small/model.bin` exists): `bash .claude/skills/thai-product-clip/scripts/setup.sh` (or `~/.claude/skills/thai-product-clip/...` when installed at user level).
2. **Inspect & transcribe:** ffprobe; 0.5-fps contact sheet; `ffmpeg -i in.mp4 -vn -ac 1 -ar 44100 audio.wav` and `-ar 16000 -f f32le a16.raw`; `python3 -I scripts/transcribe.py /tmp/whisper-small a16.raw ""` (use an EMPTY prompt first — a vocab prompt can make Whisper loop; re-run unclear spans with `start end`, optionally with a short phrase prompt). Print word times grouped every ~0.45 s to place beats.
3. **Plan scenes** from the transcript (one picture per beat, text only on emphasis words).
4. **Build** from `templates/bright_4x3_template.html` (engine: scenes with `data-s/data-e/data-bg/data-tr/data-cam`, items `.a` with `data-at/data-an/data-out/data-float/data-bob/data-spin`, kinetic `.kt`, helpers `kid()`, `jarSvg()`, `heroSvg()`, rings, confetti, stripe/iris/zoom/slideup transitions; scene-specific JS goes in `window.render`). Replace the template's scenes and its product images (`p17.png`, `ph.png`, photos) with the new clip's. Keep `window.render(t)`.
5. **Check:** render stills with `#safe` at many times (`VW=1440 VH=1080 NODE_PATH=$(npm root -g) node scripts/render.js "/abs/page.html#safe" stills outdir t1 t2 …`), tile them, look, fix overlaps / edge crowding / empty frames / script errors (check `pageerror` with a tiny playwright snippet if stills fail).
6. **Render** in the foreground (≈2–3 min for 50 s): `VW=1440 VH=1080 DPR=2 NODE_PATH=$(npm root -g) node scripts/render.js /abs/page.html video video.mp4 <dur>`. Background renders can be killed by container restarts.
7. **Audio:** `python3 -I scripts/music_bright.py music.wav <dur>`; copy `scripts/sfx_bright.py`, rewrite its `cues` list for the new timings, run `python3 -I sfx.py audio.wav music.wav mix_full.wav mix_novoice.wav`.
8. **Mux** each mix: `ffmpeg -i video.mp4 -i mix.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart out.mp4`; contact-sheet the final, then deliver.

Grand / cinematic style — the user tried it and did NOT like it (slow ~25-30 min renders, result judged poor). Stick to the bright style; only use this if they explicitly ask again, and warn about render time first: `templates/grand_cinematic_4x3_template.html` (dark void, aurora, perspective grid floor, glowing orbs, holographic HUD tags, metallic kinetic text `cine`/`slam`, flash/glitch/zoomblur transitions, shockwaves, light streaks) with `scripts/music_epic.py out.wav <dur> <hit times>` and `scripts/sfx_epic.py`. It renders slowly (blur/glow): render in 3 parallel parts with `scripts/render_part.js page.html partN.mp4 f0 f1` (each as its own background process) and concat; never one background render (30-min limit). AI stills: ElevenLabs `creative_generate_image` (gpt-image-2.6-sunburst, ~190 credits) works on the free plan but is often 'busy' (only one attempt per turn); AI video needs a paid plan. Download results from elevenlabsusercontent.com.

Other templates: `templates/dark_premium_4x3_template.html` (dark/gold comparison style, only if asked), `templates/square_template.html` (original 1:1 keyword style).

## Attention boosters the user adds in their own edit (do these by default)

From their re-edit of the 11/12 zinc clip — they layered these on top of our clip, so build them in next time:
- **Red hand-drawn annotations on the key number/word**, popping in on the spoken word: thick red (#E8231F) circle or rounded box around it + a short red arrow pointing down at it (slight wobble/draw-on, ~0.25 s), or a red dashed box around a sticker. Used on: the opening title, the peak point of a graph ("2 ชม."), the "แค่ 2 ชม." sticker, the old bar in a before/after chart. 1 annotation per beat, never more than 2 on screen.
- **Real-photo proof inserts for trust claims** (Thai-owned, Thai factory, อย.): use their footage frames/screenshots as a photo panel (rounded, white border) over a blurred, enlarged copy of the same photo filling the background, with a big caption label ("ของคนไทย", "โรงงานไทย", "มี อย.") at the bottom. For the อย. screenshot keep the product registration visible but blur unrelated personal data. Prefer these over drawn icon cards when footage has them.
- **Opening title**: big red text with navy stroke on a yellow comic burst ("ถ้าคุณ... กินซิงค์ปกติ"), pulsing, readable on frame 0.

## Known products (don't ask again)

- **INZENT Zinc Bisglycinate iCAP (Pellet Technology), black/brown jar, silver cap, "6 hrs"** — the user's zinc. Whisper hears "iCAP" as "ไอ้แข็บ/ไอแคป". Clean cutout: `assets/products/inzent_zinc_icap.png` (add white rim drop-shadow on light backgrounds). Use it whenever the voiceover says "ตัวนี้"/the product name, unless told to draw everything.

- **INZENT Magnesium Bisglycinate (iFLOW), brown jar, blue hex label, 800 mg/tablet, 30 tablets** — cutout `assets/products/inzent_magnesium.png`. The user wants the product shown at the start and again on the "ผลิตที่ไทย โรงงานไทย" line.


- **INZENT Vitamin D3+K2 (orange/yellow label, brown jar, 30 capsules)** — cutout `assets/products/inzent_d3k2.png`; 1 capsule = 15 mcg = 600 IU (from the user's footage).

## User feedback log (apply by default)

- "ตากาสายล้าง" in Whisper = **ตะกร้าสีเหลือง** (yellow basket), not orange. Yellow basket on a non-yellow background.
- Put the opening product/title group dead centre (product centred on the x axis, extra icons to the side).
- Never show another colour for the hero element ball than its real one: Mg ball = blue (like the product's Mg badge), not grey (grey reads as oxide). Zn = silver is fine.
- Red annotation circle goes on the thing being praised (e.g. the Bisglycinate bar), not on the competitor.
- Motion must be smooth: constant speeds in races/chases, no slow-then-sudden jumps.
- Real-photo inserts: hide anything that shows whose hands they are (painted/long nails, rings). Remove fingers on the background by inpainting the tile/floor; rebuild the bottle silhouette along its true edge line; recolour remaining nails to a natural tone. Keep annotation positions exactly.
- Label/ingredient photos: use the widest version that shows the whole panel; zoom the camera in on the circled number instead of cropping it tight.
- Dose line on screen: just "1–2 เม็ด" (big text), no tablet diagrams.
- Cover: one product on the right, plain jar crossed out on the left, arrow, number badge (small form note under it if asked, e.g. "BISGLYCINATE (20%)"), red headline on yellow comic burst.
- Highlight caption style (asked for in 14/11/26): words rise in one by one, key words get a yellow (or pink for warnings) marker swipe behind them; see `output/src/1411` (`.hl` captions, `hlRender`). Pair with moving simulations (dose gauge, body tank filling, day/night office, calendar ticks).
- Single-focus style (user preferred over the busy highlight version, 14/11/26): everything happens at screen centre in one spot (object ~y 380, caption right under it ~y 700), static calm background with a soft vignette, no moving patterns/particles/side stickers, centred zoom transitions, only the essential word coloured red and slightly larger. Too many simultaneous motions = viewer doesn't know where to look. Source: `output/src/1411-focus`. Note: set `.cam{transform-origin:0 0}` so camera zooms land on the intended point.
- Backgrounds: the user wants each scene on a gently animated landscape that fits the mood (city day/dusk/night with twinkling windows, sunset mountains, cloud sky, meadow, sunny mountains, beach waves) with a soft white spotlight at centre so focus stays on the middle. Builders `buildLand()`/`landRender()` in `output/src/1411-focus/extra.js`. Not a static plain background.
- For 'how much vitamin you get' use a progress ring around a character's face filling up (sun fills part, capsule completes it) — the user rejected the body-shaped liquid tank.
- CSS gotchas: class `.ring` is taken by the template (opacity 0) and `data-kid` is parsed as kid JSON — use other names.
- Keep video files under ~45 MB (re-encode crf 21) so GitHub doesn't warn.

## Gotchas

- Emoji don't render; draw SVG icons.
- `.kt` uses `-webkit-text-stroke` + `paint-order:stroke fill` for thick outlines.
- When templating `heroSvg` text, don't blanket-replace `>Mg</text>` (jar labels use it too).
- Define `$` before any init code that uses it.
- faster-whisper + this PyAV: pass float32 numpy (transcribe.py does).
- Rendering ≈ 0.15 s/frame at 2880×2160.
- Product cutouts: crop WIDE around the product (never clip its edges), try `birefnet-general`; keep the largest component and fill only interior holes — do NOT convex-hull a bottle (it adds background triangles at the shoulders). Check on green AND cream; the user spots leftover background and half-cut bottles immediately.
- If the user says to use the bottle "from the clip", take a clean frame without overlay text (product on a table) and cut it; warm the colour slightly if the room light is blue.
- Mystery opening that worked: title on frame 0 + black silhouette of the real bottle (made from the clean cutout, so cap/neck/shoulders read as a jar, not a spray can) with a "?", revealed with rays on the "this one" line.
