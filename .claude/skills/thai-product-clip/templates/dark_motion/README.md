# Dark-gold motion kit (zinc iCAP clips, 17–24/11/26)

Files (copy all into the work dir with the fonts + product PNGs):
- head.html / eng.html: page head (CSS) and the scene engine (scenes, camera, wipe/iris/flash/zoom transitions, `.a` items with data-at/data-an/data-out, `.hl` highlight swipes).
- lib1711.js: person(), bicep(), fatBlob(), ring(), tag(), arrowV(), check(), cross(), heart(), gauge(), znCoin()+ZG, battery(), bed(), icoTile()+IC (acne, skin, hair, nail, shield, mood, sperm), SCALE() hormone scale.
- lib1911.js: IMG/jarAt (product images by height), pill(), coin(), sparkle(), axes()/lineChart()/chart() (CHARTV=2 = the chart the user picked), silverCoin(), focus(id,cx,cy,rx,ry,p) = dim everything else + red ring (USE IN EVERY COMPARISON).
- lib2211.js: bigQ() question badge, pellet() layered pellet that can dissolve, chartZ().
- lib2311.js: zdot(), lock(), clockTag(), vessel(), toilet(), bodyS() body silhouette, miniChart() (centred chart panel).
- build.py: concatenates head + scenes.html + eng + libs + extra.js -> index.html. Edit ringDefs times.
- sfx.py: mixer; rewrite the `cues=[...]` list per clip. Music: `scripts/music_epic.py music.wav <dur> 0.05 <hit> <hit>`.
- example_2411/: a full clip (scenes.html + extra.js) to copy patterns from.

Workflow: transcribe in 6.4 s windows (loop must break when end>=dur), write scenes.html (captions top ~790–800px, wrap .red/.gold spans; NEVER name a class `.cu` — head.html uses it), write extra.js drawing each scene into an <svg id="vN">, `node --check` the concatenated JS, build, render stills, storyboard sheet, then music + sfx + render video in the background.
