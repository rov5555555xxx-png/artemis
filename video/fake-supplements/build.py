"""Build narration, SFX and timeline for the fake-supplement true-crime clip.

Writes vo/*.wav, sfx/*.wav, timeline.js, timeline.json and mix.wav.
Voice: ElevenLabs when ELEVEN_VOICE is set (key via ELEVENLABS_API_KEY or a network
secret), otherwise the offline MMS Thai model (draft quality).
SFX: ElevenLabs sound-generation when ELEVEN_SFX=1, otherwise synthesized.
"""
import json, os, subprocess, sys, urllib.request
import numpy as np, soundfile as sf

V = os.path.dirname(os.path.abspath(__file__))
SR = 44100
for d in ('vo', 'sfx'):
    os.makedirs(f'{V}/{d}', exist_ok=True)

LINES = [
    'เธอกดสั่งจากร้านออนไลน์',
    'อาหารเสริมลดน้ำหนัก ราคาถูก ส่งไว',
    'หลังจากนั้น เธอเสียชีวิต',
    'ในนั้น มีสารที่หลายประเทศทั่วโลก สั่งแบน',
    'นี่คือเส้นทางของอาหารเสริมเถื่อน',
    'จากด่านสนามบิน',
    'สู่โกดังล้านชิ้น',
    'ผ่านเลข อย. ที่ขโมยมา',
    'จนถึงมือคุณ',
    'และหลายคดี มีทุนจีนอยู่เบื้องหลัง',
    'แค่ครึ่งปี ด่านสนามบินและไปรษณีย์ สกัดของเถื่อนได้เกือบสี่พันรายการ มูลค่ากว่าห้าสิบเอ็ดล้านบาท',
    'ทั้งปากกาลดน้ำหนัก ฟิลเลอร์ อาหารเสริมเพิ่มสมรรถภาพ',
    'ไปจนถึง เฟนทานิล',
    'เทคนิคของพวกมัน คือนำเข้าทีละน้อย แต่ถี่',
    'วันที่สามสิบเอ็ดตุลาคม ชายชาวจีนคนหนึ่ง ถูกจับที่สุวรรณภูมิ',
    'ในกระเป๋า มีปากกาลดน้ำหนักเถื่อน แปดพันเก้าร้อยด้าม',
    'แต่ของบางส่วน ไม่ได้มาทางอากาศ',
    'มันมาทางบก ผ่านภาคอีสาน เข้ากรุงเทพ',
    'โกดังย่านหนองแขม ซุกอาหารเสริมแบรนด์ดังปลอม กว่าสองหมื่นหกพันชิ้น',
    'ตำรวจระบุว่า เจ้าของเป็นชายชาวจีน',
    'แต่ที่บางบ่อ สมุทรปราการ ใหญ่กว่านั้นมาก',
    'หนึ่งล้านเจ็ดหมื่นกว่าชิ้น',
    'กาแฟ มัทฉะ อาหารเสริมผิว ขายว่อนออนไลน์',
    'ทำไมคนถึงเชื่อ เพราะบนฉลาก มีเลข อย.',
    'แต่เป็นเลขของสินค้าอื่น ที่ถูกเอามาแปะ',
    'โกดังที่ลาดกระบัง ขายได้วันละสามพันชิ้น นานกว่าหนึ่งปี',
    'บางที มันก็วางอยู่บนชั้น ในซูเปอร์มาร์เก็ตกลางเมือง',
    'ตรวจร้านนำเข้าจากจีน สี่สิบเจ็ดแห่ง ยึดได้เกือบเก้าหมื่นห้าพันชิ้น',
    'แล้วในแคปซูล มีอะไร',
    'ไซบูทรามีน ยาลดน้ำหนัก ที่ถูกถอนออกจากตลาด ตั้งแต่ปีสองพันสิบ',
    'เพราะเพิ่มความเสี่ยง หัวใจวาย และเส้นเลือดในสมอง',
    'ในไทย มันคือวัตถุออกฤทธิ์ ประเภทหนึ่ง',
    'คดีของเธอ ตำรวจตามรอยจากกล่องพัสดุที่ถูกตีกลับ ในสกลนคร',
    'ค้นสี่จุด ยึดได้สิบแปดกระปุก',
    'แต่อย่าคิดว่า มีแค่ทุนต่างชาติ',
    'อาหารเสริมผสมไซบูทรามีน ยี่ห้อดังของไทยเอง ก็เคยถูกยึด มูลค่ากว่าสิบหกล้านบาท',
    'ความโลภ ไม่มีสัญชาติ',
    'ก่อนกดสั่ง ตรวจเลข อย. ในแอป หรือโทร หนึ่งห้าห้าหก',
    'ถูกเกินจริง เห็นผลไวเกินจริง คือสัญญาณอันตราย',
    'เลข อย. ตรวจได้ในสิบวินาที',
    'แต่ชีวิต ย้อนคืนไม่ได้',
]

# (layer, line indices, options); a scene without lines takes a fixed duration
SC = [('open', [0, 1, 2, 3]), ('montage', [4, 5, 6, 7, 8]), ('title', [9]),
      ('chapter', [], 1.3, {'num': '01', 'title': 'ด่าน'}), ('airport', [10, 11, 12]), ('trick', [13]), ('suitcase', [14, 15]),
      ('chapter', [], 1.3, {'num': '02', 'title': 'โกดัง'}), ('route', [16, 17]), ('wh1', [18, 19]), ('wh2', [20, 21, 22]),
      ('chapter', [], 1.3, {'num': '03', 'title': 'เลข อย.'}), ('fda', [23, 24, 25]), ('market', [26, 27]),
      ('chapter', [], 1.3, {'num': '04', 'title': 'ในแคปซูล'}), ('capsule', [28, 29, 30, 31]), ('case', [32, 33]),
      ('twist', [34, 35, 36]), ('protect', [37, 38, 39, 40]), ('end', [], 5.0)]

# SFX cues: (line index, offset seconds from line start, name, gain)
CUES = [(0, 0.9, 'tap', .8), (1, 0.2, 'parcel', .9), (2, -1.6, 'heartbeat', .9), (2, 0.5, 'flatline', .55), (3, 0.0, 'boom', 1),
        (5, 0, 'hit', .8), (6, 0, 'hit', .8), (7, 0, 'hit', .8), (8, 0, 'hit', .8), (9, -0.4, 'glitch', .8), (9, 0, 'boom_big', 1),
        (10, 0.3, 'beep', .6), (12, 0, 'alarm', .7), (13, 0.2, 'counter', .5), (14, 0.2, 'shutter', .8), (15, 0.6, 'stamp', .8),
        (17, 0.3, 'truck', .6), (18, 0.1, 'radio', .6), (19, 0.2, 'shutter', .7), (20, 0, 'siren', .5), (21, 0, 'counter', .7),
        (23, 0.4, 'shutter', .6), (24, 0.8, 'stamp', .9), (25, 0.2, 'typewriter', .6), (27, 0.5, 'stamp', .8),
        (29, 0, 'crack', .9), (30, 0, 'heartfast', .8), (31, 0.2, 'stamp', .9), (32, 0, 'paper', .7), (33, 0.3, 'shutter', .7),
        (34, -0.5, 'reverse', .8), (36, 0, 'boom_big', 1), (37, 0.4, 'tap', .7), (38, 0.2, 'alarm', .5), (40, 0, 'boom', 1)]
HIT_SFX = {'boom', 'boom_big', 'hit', 'stamp', 'glitch'}

SFX_PROMPTS = {
    'whoosh': ('fast cinematic whoosh transition, short and clean', 0.8),
    'boom': ('deep cinematic impact boom hit with reverb tail, trailer', 2.5),
    'boom_big': ('huge dark trailer braam impact, heavy and ominous', 3.0),
    'glitch': ('digital glitch stutter noise burst, short', 0.8),
    'hit': ('short punchy cinematic hit, tight and dry', 0.7),
    'tap': ('smartphone screen tap click', 0.5),
    'parcel': ('cardboard parcel box dropped on a doorstep, thud', 1.0),
    'heartbeat': ('slow tense heartbeat, close, cinematic', 3.0),
    'flatline': ('hospital heart monitor beeps then flatline tone', 3.0),
    'beep': ('airport x-ray scanner beep alert', 1.0),
    'alarm': ('short security alarm buzzer, two pulses', 1.2),
    'shutter': ('camera shutter click, evidence photo', 0.6),
    'truck': ('heavy truck passing on a highway at night', 2.5),
    'radio': ('police radio chatter with static burst', 1.5),
    'siren': ('police siren wail, close', 3.0),
    'counter': ('fast mechanical counter rolling and ticking', 2.0),
    'stamp': ('rubber stamp slammed hard on paper', 0.7),
    'typewriter': ('typewriter typing fast', 1.5),
    'crack': ('plastic capsule cracking open with powder spilling', 1.0),
    'heartfast': ('fast racing heartbeat, anxious', 3.0),
    'paper': ('paper document sliding across a desk', 1.0),
    'reverse': ('reverse cymbal swell riser, tense', 2.0),
}


def eleven_post(path, body, out):
    h = {'Content-Type': 'application/json'}
    if os.environ.get('ELEVENLABS_API_KEY'):
        h['xi-api-key'] = os.environ['ELEVENLABS_API_KEY']
    req = urllib.request.Request('https://api.elevenlabs.io' + path, json.dumps(body).encode(), h)
    with urllib.request.urlopen(req, timeout=180) as r:
        open(out, 'wb').write(r.read())


def to_wav(src, out, flt):
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-af', flt, '-ac', '1', '-ar', str(SR), out], check=True)


# ---------- synthesized fallback SFX ----------
rng = np.random.default_rng(7)


def env(n, a, d):
    t = np.arange(n) / SR
    return np.minimum(t / max(a, 1e-4), 1) * np.exp(-t / d)


def lp(x, k):
    return np.convolve(x, np.ones(k) / k, mode='same')


def synth(name):
    dur = SFX_PROMPTS[name][1]
    n = int(dur * SR)
    t = np.arange(n) / SR
    noise = rng.standard_normal(n)
    if name == 'whoosh':
        x = lp(noise, 6) * np.sin(np.pi * t / dur) ** 2
    elif name in ('boom', 'boom_big'):
        f = 55 * np.exp(-t * 1.5) + 30
        x = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, .005, .9 if name == 'boom' else 1.3) * 1.2
        x += lp(noise, 30) * env(n, .001, .15) * .8
    elif name == 'glitch':
        x = np.sign(np.sin(2 * np.pi * 180 * t)) * (rng.random(n // 800 + 1).repeat(800)[:n] > .5) * .5 * env(n, .001, .4)
    elif name == 'hit':
        x = np.sin(2 * np.pi * 70 * t) * env(n, .002, .12) + lp(noise, 4) * env(n, .001, .05) * .6
    elif name == 'tap':
        x = lp(noise, 3) * env(n, .0005, .01)
    elif name == 'parcel':
        x = lp(noise, 60) * env(n, .002, .12) * 3 + np.sin(2 * np.pi * 90 * t) * env(n, .002, .1)
    elif name in ('heartbeat', 'heartfast'):
        per = .9 if name == 'heartbeat' else .42
        x = np.zeros(n)
        for s in np.arange(0, dur, per):
            for o, g in ((0, 1), (.16, .7)):
                i = int((s + o) * SR)
                if i < n:
                    m = min(n - i, int(.2 * SR))
                    tt = np.arange(m) / SR
                    x[i:i + m] += g * np.sin(2 * np.pi * 50 * tt) * np.exp(-tt / .05)
    elif name == 'flatline':
        x = np.sin(2 * np.pi * 1000 * t) * .25 * ((t > 1.2) | ((t % .6) < .12))
    elif name == 'beep':
        x = np.sin(2 * np.pi * 1300 * t) * .4 * ((t % .25) < .12) * (t < .6)
    elif name == 'alarm':
        x = np.sign(np.sin(2 * np.pi * 520 * t)) * .25 * ((t % .5) < .3)
    elif name == 'shutter':
        x = lp(noise, 2) * (env(n, .0005, .01) + np.roll(env(n, .0005, .015), int(.08 * SR)))
    elif name == 'truck':
        x = lp(noise, 120) * np.sin(np.pi * t / dur) ** 2 * 4
    elif name == 'radio':
        x = (lp(noise, 2) - lp(noise, 12)) * ((rng.random(n // 2000 + 1).repeat(2000)[:n]) > .4) * .4
    elif name == 'siren':
        f = 700 + 300 * np.sin(2 * np.pi * .8 * t)
        x = np.sin(2 * np.pi * np.cumsum(f) / SR) * .25
    elif name in ('counter', 'typewriter'):
        x = np.zeros(n)
        step = .045 if name == 'counter' else .09
        for s in np.arange(0, dur, step):
            i = int((s + (rng.random() * .03 if name == 'typewriter' else 0)) * SR)
            if i < n - 400:
                x[i:i + 400] += lp(rng.standard_normal(400), 2) * np.exp(-np.arange(400) / 60)
        x *= .7
    elif name == 'stamp':
        x = np.sin(2 * np.pi * 80 * t) * env(n, .001, .08) + lp(noise, 3) * env(n, .0005, .02)
    elif name == 'crack':
        x = noise * (rng.random(n) > .985) * env(n, .001, .3) + lp(noise, 8) * env(n, .2, .4) * .3
    elif name == 'paper':
        x = (noise - lp(noise, 10)) * np.sin(np.pi * t / dur) * .4
    elif name == 'reverse':
        x = lp(noise, 4) * (t / dur) ** 3 * .8
    else:
        x = np.zeros(n)
    fade = np.minimum(1, (n - np.arange(n)) / (0.03 * SR))
    return (x * fade).astype(np.float32)


def get_sfx(name):
    out = f'{V}/sfx/{name}.wav'
    if not os.path.exists(out):
        if os.environ.get('ELEVEN_SFX') == '1':
            prompt, dur = SFX_PROMPTS[name]
            mp3 = f'{V}/sfx/{name}.mp3'
            eleven_post('/v1/sound-generation', {'text': prompt, 'duration_seconds': dur, 'prompt_influence': 0.5}, mp3)
            to_wav(mp3, out, 'anull')
        else:
            sf.write(out, synth(name), SR)
    x, _ = sf.read(out, dtype='float32')
    if x.ndim > 1:
        x = x.mean(1)
    return x / max(1e-4, np.abs(x).max())


# ---------- narration ----------
VOICE = os.environ.get('ELEVEN_VOICE')
if not VOICE:
    import sherpa_onnx
    M = os.environ.get('MMS_MODEL', f'{V}/models/vits-mms-tha')
    tts = sherpa_onnx.OfflineTts(sherpa_onnx.OfflineTtsConfig(model=sherpa_onnx.OfflineTtsModelConfig(
        vits=sherpa_onnx.OfflineTtsVitsModelConfig(model=M + '/model.onnx', tokens=M + '/tokens.txt'), num_threads=4)))
trim = 'silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse'
clips = []
for i, tx in enumerate(LINES):
    out = f'{V}/vo/l{i:02d}.wav'
    if VOICE:
        raw = f'{V}/vo/raw{i:02d}.mp3'
        if not os.path.exists(raw) or os.environ.get('REDO_VO'):
            eleven_post(f'/v1/text-to-speech/{VOICE}?output_format=mp3_44100_128',
                        {'text': tx, 'model_id': os.environ.get('ELEVEN_MODEL', 'eleven_v4'), 'language_code': 'th',
                         'voice_settings': {'stability': 0.45, 'similarity_boost': 0.8, 'style': 0.35, 'speed': 1.08}}, raw)
        to_wav(raw, out, trim)
    else:
        a = tts.generate(tx.replace('ำ', 'ํา'), sid=0, speed=1.05)
        raw = f'{V}/vo/raw{i:02d}.wav'
        sf.write(raw, a.samples, a.sample_rate)
        to_wav(raw, out, f'aresample={SR},rubberband=pitch=0.9:formant=preserved:pitchq=quality,{trim}')
    x, _ = sf.read(out, dtype='float32')
    clips.append(x / max(1e-4, np.abs(x).max()) * 0.9)
    print(i, round(len(x) / SR, 2))

# ---------- timeline ----------
t = 0.0
subs = [None] * len(LINES)
tl = []
for sc in SC:
    name, idx = sc[0], sc[1]
    a = t
    if not idx:
        b = a + sc[2]
        tl.append([name, round(a, 3), round(b, 3), sc[3] if len(sc) > 3 else {}])
        t = b
        continue
    t += 0.22
    for i in idx:
        d = len(clips[i]) / SR
        subs[i] = [round(t, 3), round(t + max(d, 0.9) + 0.12, 3), round(d, 3)]
        t += max(d, 0.9) + 0.16
    b = t + 0.12
    tl.append([name, round(a, 3), round(b, 3), sc[2] if len(sc) > 2 else {}])
    t = b
DUR = round(t, 3)

# ---------- audio ----------
n = int((DUR + 1) * SR)
vo = np.zeros(n, np.float32)
for i, x in enumerate(clips):
    s = int(subs[i][0] * SR)
    vo[s:s + len(x)] += x[:n - s]
fx = np.zeros(n, np.float32)
hits = []


def place(x, at, g):
    s = int(max(0, at) * SR)
    m = min(len(x), n - s)
    fx[s:s + m] += x[:m] * g


for i, e in enumerate(tl):
    if i and e[0] != 'end':
        place(get_sfx('whoosh'), e[1] - 0.25, .35)
    if e[0] == 'chapter':
        place(get_sfx('boom'), e[1], .9)
        place(get_sfx('glitch'), e[1], .5)
        hits.append(e[1])
for li, off, name, g in CUES:
    at = subs[li][0] + off
    place(get_sfx(name), at, g)
    if name in HIT_SFX:
        hits.append(round(at, 3))
sf.write(f'{V}/voice.wav', vo, SR)
sf.write(f'{V}/sfx.wav', fx, SR)
info = {'subs': subs, 'tl': tl, 'dur': DUR, 'hits': sorted(hits)}
json.dump(info, open(f'{V}/timeline.json', 'w'))
open(f'{V}/timeline.js', 'w').write('window.TLD=' + json.dumps(info) + ';')
print('DUR', DUR)
