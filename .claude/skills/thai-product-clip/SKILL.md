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
   - **Preferred engine now: `templates/bright_v2_4x3_template.html`** (the CoQ10 clip, 19/11/26). Same bright look, plus: camera keys `data-cam="t:scale:x:y:rot:tiltX"` with `.cam{transform-origin:0 0}` (zooms land exactly on x,y; `rot` = dutch tilt, `tiltX` = low-angle perspective), tracked red annotations (`ANNS` list, see feedback log), scene backgrounds as classes. Replace its scenes, `box.png`, the scene JS block and `ANNS`/`ringDefs`.
5. **Check:** render stills with `#safe` at many times (`VW=1440 VH=1080 NODE_PATH=$(npm root -g) node scripts/render.js "/abs/page.html#safe" stills outdir t1 t2 …`), tile them, look, fix overlaps / edge crowding / empty frames / script errors (check `pageerror` with a tiny playwright snippet if stills fail).
   - Stills that jump straight to a time can show stale state (annotations, counters). Check with `scripts/render_seq.js page.html outdir t1 t2 …` (renders frames in order and saves the asked times) or grab frames from the final mp4 with ffmpeg.
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

- Zinc iCAP boxes (black/silver box, 30 and 60 capsules; 60 launched 15/11/26): `assets/products/inzent_zinc_icap_box30.png`, `..._box60.png`. The boxes look identical apart from the small count — always pair them with a '30 เม็ด/60 เม็ด' pill.

- **Probio-H (CEO Factory) probiotic for H.pylori, green/white bottle** — photo `assets/products/ceo_probio_h_photo.jpg` (from footage; no clean cutout). Whisper hears it as 'ไบโอเฮส/โปรเบลติ'. User wanted it in the dark/gold zinc style too (16/11/26); source `output/src/1611-probio`. Footage has a burned-in title around y 640–720 of the 1080×1918 frame — crop photo panels above it.

- **Dr.Aum Lutein+ (beige foil pouch, yellow LUTEIN+ label, marigold)** — cutout `assets/products/lutein_draum_pouch.png`. Label: Lutein (20%) 80 mg, Zeaxanthin (5%) 80 mg, MCT Oil Powder 50 mg, 30 capsules, 1 a day after a meal. Clip source `output/src/lutein-draum`.

- **Dr.Aum Ubiquinol Coenzyme Q10 (beige box, red label)** — cutout `assets/products/coq10_draum_box.png`. Ubiquinol (83%) 36.14 mg = CoQ10 30 mg, 30 capsules, 1 after breakfast. rembg only keeps the label on this box: crop the rectangle from the white-background photo instead (rounded corners 8 px). Clip source `output/src/coq10-draum`.

- INZENT D3+K2 two-bottle footage frame (clean at t≈10 s of the 19/11/26 voiceover) also cuts cleanly; voiceover facts: 2 capsules = D3 1200 IU, below 2,000 IU no test needed, 4,000–5,000 IU needs a test, 2 a day after the first meal. Clip source `output/src/vitd3k2`.

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
- Dark/gold premium style (`templates/dark_premium_4x3_template.html`) is also approved for the zinc iCAP: user liked it (06/11 clip) and asked for it again on 15/11. Use `new_bottle.png` = `assets/products/inzent_zinc_icap.png`; the split capsule with pellets is `CAPSVG` in the template; small matching capsules `CAPSM` in `output/src/1511`. For 'absorbed normally' use the gut-wall → blood diagram with separate Zn/Cu channels (1511 S4). Gradient ids inside a hidden scene don't render in other scenes — give each SVG its own ids.
- 16/11/26 Probio-H was rejected ('ภาพกาก วงเล็บไม่ตรง'): footage crops were low-res/blurry and red circles missed their targets. Next time: only use footage frames that stay sharp at the panel size (upscale/sharpen or pick a sharper frame, never enlarge a 480p-looking crop to 860px), and verify every red mark at full resolution by cropping the rendered still around it before rendering the video.
- Cartoon storybook style (new on 16/11/26, astaxanthin 8 s): one cute character at centre acts out the story (green algae cell sweats in the sun, raises a red shield, morphs green→red), the whole background gradient changes colour with the story beat (dark red title → cool green pond → orange heat → red sunset), white pill captions with one coloured keyword. Standalone SVG page, source `output/src/1611-asta`.
- Keep video files under ~45 MB (re-encode crf 21) so GitHub doesn't warn.
- **Red annotations (18/11/26 — the user complained they were off-target, not round, covering text):** never hard-code circle coordinates. Use the tracked system in `bright_v2`: each `ANNS` entry names an element id; every frame it reads the element's real box, draws a smooth ellipse around it (`kx/ky/pad` so it encloses, not crosses, the target) with a thin white under-stroke and a short arrow from a free side (`ang`). It hides as soon as its scene ends or the target fades out (no leftover circles over the next scene). Circle the thing itself (e.g. the retina where the molecules sit, the winning bar), not a label next to it. Don't circle the opening title. Max 2 on screen.
- When a keyword is spoken (e.g. "ดวงตา" in a list of body-part signs), move that item to the centre and enlarge it (~2×, glow) and dim the others, instead of circling it at the edge.
- Opening line: write the full spoken question (e.g. "วิตามินตัวนี้ รู้ได้ยังไง / ว่าต้องวิ่งไปที่ดวงตา?") in 2 big lines, plus a picture of the idea (product → dotted path → eye), readable on frame 0.
- Show every substance the voice names (lutein AND zeaxanthin = two characters), and explain organ mechanisms inside the organ (eye cross-section with retina at the back, blue light entering through the pupil and absorbed by the pigment layer).
- Each beat gets its own matching background (beach+sun for vitamin D, lab grid for a dose gauge, clinic for "must test", night city for "not enough sun", breakfast kitchen for "after the first meal"…) and the camera keeps changing angle: close-up → pull back, low angle (tiltX), dutch tilt for tension, drone fly-in, peeking past foreground leaves/rocks, close-up hand pointing/tapping, zoom onto the key number.
- **Covers (19/11/26):** keep everything inside the central ~780×780 box (x 330–1110, y 150–930) — the app crops covers and things near edges get cut. The busy comic-burst cover was rejected ("วุ่นวาย อ่านยาก ตัวแดงมองไม่ออก, สินค้าเล็ก"). Approved direction: `templates/cover_clean_4x3_template.html` — dark navy background with a soft glow, small hook line ("ติดจอทั้งวัน?") + one HUGE yellow benefit word ("ดูแลดวงตา"), big product in the middle with a small benefit icon badge, one yellow pill with the key claim. Render with `scripts/shot.js page.html out.png 2`.
- **Dusk silhouette style (13/11/26, asked from a reference reel):** `templates/dusk_silhouette_4x3_template.html` — black silhouettes on a sunset gradient, minimal cream text, product revealed from silhouette to colour, multi-angle shots (drone top-down with long shadows, low angle at grass level, peeking past rocks, close-up hand pinching a pellet/tapping the basket). Audio `scripts/music_dusk.py` (soft piano/pad) + `scripts/sfx_dusk.py`. Renders ≈ 5.5 min for 48 s.
- **No-music version (19/11/26):** when they ask for effects only ("ขอแค่เสียงเอฟเฟ็ค ไม่ต้องเอาเพลง"), run the SFX mixer with a silent music wav (`ffmpeg -f lavfi -i anullsrc=r=44100:cl=stereo -t <dur> silent.wav`) and deliver `<name>-4x3-voice-sfx-nomusic.mp4` and `<name>-4x3-sfx-only.mp4`.

## Gotchas

- Emoji don't render; draw SVG icons.
- `.kt` uses `-webkit-text-stroke` + `paint-order:stroke fill` for thick outlines.
- When templating `heroSvg` text, don't blanket-replace `>Mg</text>` (jar labels use it too).
- Define `$` before any init code that uses it.
- faster-whisper + this PyAV: pass float32 numpy (transcribe.py does).
- Rendering ≈ 0.15 s/frame at 2880×2160.
- Whisper mishearings seen: "ฟรรม/ฝอม" = ฟอร์ม, "อากู" = Google (draw a generic search bar, no logo), "ตวด" = ตรวจ, "แท้นได้คลิส 2" = แถมได้ K2, "บูสเตอร์นเกียงให้เซียว" = บูสต์พลังงานให้เซลล์, "รูทีน/ซี่สันทีน" = ลูทีน/ซีแซนทีน, "จอปฏาตา" = จอประสาทตา. If the footage has burned-in text with the number, trust the text over Whisper (e.g. 4,000–5,000 IU).
- A `.sbg` with negative inset on a static cover page can scroll the stage by 60 px — use `inset:0` on covers.
- Product cutouts: crop WIDE around the product (never clip its edges), try `birefnet-general`; keep the largest component and fill only interior holes — do NOT convex-hull a bottle (it adds background triangles at the shoulders). Check on green AND cream; the user spots leftover background and half-cut bottles immediately.
- If the user says to use the bottle "from the clip", take a clean frame without overlay text (product on a table) and cut it; warm the colour slightly if the room light is blue.
- Mystery opening that worked: title on frame 0 + black silhouette of the real bottle (made from the clean cutout, so cap/neck/shoulders read as a jar, not a spray can) with a "?", revealed with rays on the "this one" line.
