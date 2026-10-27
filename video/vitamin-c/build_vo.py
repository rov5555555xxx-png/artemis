"""Synthesize narration, build timeline.js and voice.wav.

Engine: ElevenLabs when ELEVEN_VOICE_UNCLE and ELEVEN_VOICE_NEPHEW are set
(API key from ELEVENLABS_API_KEY), otherwise the offline MMS Thai model.
"""
import json, os, subprocess, sys, urllib.request
import numpy as np, soundfile as sf
V=os.path.dirname(os.path.abspath(__file__))
os.makedirs(f'{V}/vo',exist_ok=True)
LINES=[('n','ลุงครับ ผมเป็นหวัด เลยกินวิตามินซีวันละพันมิลลิกรัม'),('n','แบบนี้หายไวแน่'),
('u','รู้ไหม กว่าโลกจะรู้จักวิตามินซี'),('u','คนต้องตายกลางทะเล เป็นล้านคน'),
('u','ยุคเรือใบ ออกทะเลทีละหลายเดือน กินแต่ขนมปังแข็งกับเนื้อเค็ม'),('u','เหงือกบวม เลือดออก แผลไม่หาย คือโรคลักปิดลักเปิด'),
('u','ประมาณกันว่า ลูกเรือตายด้วยโรคนี้ กว่าสองล้านคน'),
('u','ปีหนึ่งพันเจ็ดร้อยสี่สิบเจ็ด หมอเรือชื่อเจมส์ ลินด์ แบ่งลูกเรือป่วยสิบสองคน เป็นหกคู่'),
('u','แต่ละคู่ได้ของต่างกัน ไซเดอร์ น้ำส้มสายชู น้ำทะเล'),('u','คู่ที่ได้ส้มกับเลมอน หายจนกลับไปทำงานได้ ในไม่กี่วัน'),
('n','งั้นก็ จบแล้วสิครับ'),('u','ยังหรอก กองทัพเรืออังกฤษ ใช้เวลาอีกเกือบห้าสิบปี กว่าจะแจกน้ำเลมอน'),
('u','ต่อมาเปลี่ยนเป็นมะนาวไลม์ เพราะถูกกว่า ทหารเรืออังกฤษ เลยถูกเรียกว่า ไลมีย์'),('u','แต่มะนาวพวกนั้น มีวิตามินซีน้อยกว่ามาก'),
('u','ปีหนึ่งพันแปดร้อยเจ็ดสิบห้า คณะสำรวจขั้วโลก ดื่มน้ำมะนาวทุกวัน แต่โรคก็กลับมา'),
('u','ปีหนึ่งพันเก้าร้อยเจ็ด นักวิจัยนอร์เวย์ บังเอิญพบว่า หนูตะเภาก็เป็นโรคนี้'),('u','เพราะมันสร้างวิตามินซีเองไม่ได้ เหมือนคน'),
('n','เดี๋ยวนะ สัตว์อื่นสร้างเองได้เหรอครับ'),('u','หมา แมว สร้างเองได้หมด แต่ยีนตัวนั้นในคนเรา พังไปนานแล้ว'),
('u','ปีหนึ่งพันเก้าร้อยยี่สิบแปด เซนต์ เจอร์จี สกัดสารลึกลับจากต่อมหมวกไต แต่ได้นิดเดียว'),
('u','วันหนึ่ง เขาไม่อยากกินพริกปาปริก้าที่ภรรยาทำ เลยหอบเข้าแล็บ'),('u','ปรากฏว่า พริกมีสารนี้เพียบ ได้เป็นกิโล'),
('u','มันคือวิตามินซี ชื่อกรดแอสคอร์บิก แปลว่า ต้านลักปิดลักเปิด'),('u','ได้รางวัลโนเบล ปีหนึ่งพันเก้าร้อยสามสิบเจ็ด'),
('u','ไม่นาน ก็สังเคราะห์ได้ในโรงงาน ใครก็ซื้อกินได้'),
('u','ปีหนึ่งพันเก้าร้อยเจ็ดสิบ ไลนัส พอลลิง เจ้าของโนเบลสองรางวัล เขียนหนังสือ'),('u','บอกให้กินวันละหลายพันมิลลิกรัม เพื่อกันหวัด คนทั้งโลกเชื่อตาม'),
('n','แล้วมันกันหวัดได้จริงไหมครับ'),
('u','งานวิจัยรวมหลายสิบชิ้นพบว่า กินทุกวัน ก็ไม่ได้เป็นหวัดน้อยลง'),('u','แค่หายเร็วขึ้นนิดหน่อย ถ้าเพิ่งเริ่มกินตอนป่วย ผลก็ไม่ชัดเจน'),
('u','ผู้ใหญ่ต้องการแค่วันละ เจ็ดสิบห้าถึงเก้าสิบมิลลิกรัม'),('u','ฝรั่งหนึ่งร้อยกรัม มีตั้งสองร้อยกว่ามิลลิกรัม มากกว่าส้มราวสี่เท่า'),
('n','แล้วที่ผมกินไปพันนึงล่ะครับ'),('u','ร่างกายดูดซึมไม่หมด ส่วนเกินก็ออกไปกับปัสสาวะ'),
('u','วิตามินซี ไม่ใช่ยาวิเศษ'),('u','กินผักผลไม้ทุกวัน ป่วยก็พักผ่อน ไม่ต้องกินเกินขนาด')]
SR=44100;clips=[]
VOICES={'u':os.environ.get('ELEVEN_VOICE_UNCLE'),'n':os.environ.get('ELEVEN_VOICE_NEPHEW')}
ELEVEN=all(VOICES.values())

def eleven(tx,sp,out):
    q=json.dumps({'text':tx,'model_id':os.environ.get('ELEVEN_MODEL','eleven_v4'),'language_code':'th',
        'voice_settings':{'stability':0.5,'similarity_boost':0.75}}).encode()
    h={'Content-Type':'application/json','Accept':'audio/mpeg'}
    if os.environ.get('ELEVENLABS_API_KEY'):h['xi-api-key']=os.environ['ELEVENLABS_API_KEY']
    url=f'https://api.elevenlabs.io/v1/text-to-speech/{VOICES[sp]}?output_format=mp3_44100_128'
    with urllib.request.urlopen(urllib.request.Request(url,q,h),timeout=120) as r:open(out,'wb').write(r.read())

if not ELEVEN:
    import sherpa_onnx
    M=os.environ.get('MMS_MODEL',f'{V}/models/vits-mms-tha')
    tts=sherpa_onnx.OfflineTts(sherpa_onnx.OfflineTtsConfig(model=sherpa_onnx.OfflineTtsModelConfig(vits=sherpa_onnx.OfflineTtsVitsModelConfig(model=M+'/model.onnx',tokens=M+'/tokens.txt'),num_threads=4)))
trim='silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse'
for i,(sp,tx) in enumerate(LINES):
    out=f'{V}/vo/l{i:02d}.wav'
    if ELEVEN:
        raw=f'{V}/vo/raw{i:02d}.mp3';eleven(tx,sp,raw);flt=f'aresample={SR},{trim}'
    else:
        a=tts.generate(tx.replace('ำ','ํา'),sid=0,speed=0.92 if sp=='u' else 1.0)
        raw=f'{V}/vo/raw{i:02d}.wav';sf.write(raw,a.samples,a.sample_rate)
        k=0.92 if sp=='u' else 1.1
        flt=f'aresample={SR},rubberband=pitch={k}:formant=preserved:pitchq=quality,highpass=f=70,{trim}'
    subprocess.run(['ffmpeg','-v','error','-y','-i',raw,'-af',flt,'-ac','1',out],check=True)
    x,_=sf.read(out,dtype='float32');x=x/max(1e-4,np.abs(x).max())*0.9;clips.append(x)
    print(i,sp,round(len(x)/SR,2))
SC=[('room',[0,1,2,3],{'cams':[[0,'nephew'],[2,'uncle']],'pose':'pill'}),('ship',[4,5,6]),('lind',[7,8,9]),
('room',[10,11],{'cams':[[10,'nephew'],[11,'uncle']],'pose':'scratch'}),('lime',[12,13]),('arctic',[14]),('gpig',[15,16]),
('room',[17],{'cams':[[17,'nephew']],'pose':'scratch'}),('gene',[18]),('paprika',[19,20,21]),('nobel',[22,23]),('factory',[24]),
('pauling',[25,26]),('room',[27],{'cams':[[27,'nephewClose']],'pose':'shock'}),('cochrane',[28,29]),('guava',[30,31]),
('room',[32,33],{'cams':[[32,'nephew'],[33,'uncle']],'pose':'pill'}),('tip',[34,35]),('next',[],3.5),('end',[],4.5)]
t=0.0;subs=[None]*len(LINES);tl=[];prev=None
for sc in SC:
    name,idx=sc[0],sc[1];a=t
    if not idx:
        b=a+sc[2];tl.append([name,round(a,3),round(b,3),{}]);t=b;continue
    t+=0.5
    for i in idx:
        sp=LINES[i][0]
        if prev and prev!=sp:t+=0.25
        d=len(clips[i])/SR;s=t;e=s+max(d,1.4);subs[i]=[round(s,3),round(e+0.35,3),round(d,3)];t=e+0.4;prev=sp
    b=t+0.3;opt=dict(sc[2]) if len(sc)>2 else {}
    if 'cams' in opt:opt['cams']=[[max(a,subs[c][0]-0.5) if j else a,n] for j,(c,n) in enumerate(opt['cams'])]
    tl.append([name,round(a,3),round(b,3),opt]);t=b
DUR=round(t,3)
json.dump({'subs':subs,'tl':tl,'dur':DUR},open(f'{V}/timeline.json','w'))
open(f'{V}/timeline.js','w').write('window.TLD='+json.dumps({'subs':subs,'tl':tl,'dur':DUR})+';')
vo=np.zeros(int((DUR+1)*SR),dtype=np.float32)
for i,x in enumerate(clips):s=int(subs[i][0]*SR);vo[s:s+len(x)]+=x
sf.write(f'{V}/voice.wav',vo,SR);print('DUR',DUR)
