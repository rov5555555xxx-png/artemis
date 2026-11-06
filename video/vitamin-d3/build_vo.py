"""Synthesize narration, build timeline.js and voice.wav.

Engine: ElevenLabs when ELEVEN_VOICE_UNCLE and ELEVEN_VOICE_NEPHEW are set
(API key from ELEVENLABS_API_KEY), otherwise the offline MMS Thai model.
"""
import json, os, subprocess, sys, urllib.request
import numpy as np, soundfile as sf
V=os.path.dirname(os.path.abspath(__file__))
os.makedirs(f'{V}/vo',exist_ok=True)
LINES=[('n','ลุงครับ หมอบอกผมขาดวิตามินดี'),('n','ทั้งที่เมืองไทย แดดจัดขนาดนี้'),
('u','รู้ไหม กว่าโลกจะรู้จักเม็ดนี้'),('u','เด็กต้องขาโก่ง กันทั้งเมือง'),
('u','ยุคปฏิวัติอุตสาหกรรม ควันโรงงานบังแดดทั้งเมือง'),('u','เด็กเป็นโรคกระดูกอ่อน กันเต็มเมือง'),
('u','หมอชาวโปแลนด์ ชื่อชเนียเดตสกี้ สังเกตว่า'),('u','เด็กในเมืองป่วยเยอะ แต่เด็กบ้านนอก แทบไม่เป็น'),
('u','เขาเดาว่า เป็นเพราะแสงแดด'),('u','แต่แทบไม่มีใครเชื่อ อีกเกือบร้อยปี'),
('u','เมลแลนบี้ เลี้ยงสุนัขไว้แต่ในร่ม มันเป็นกระดูกอ่อน'),('u','พอให้น้ำมันตับปลา ก็หาย'),
('u','ปีเดียวกันที่เบอร์ลิน ฮุลด์ชินสกี้ ส่องแสงยูวีให้เด็ก'),('u','ฟิล์มเอกซเรย์ชี้ว่า กระดูกกลับมาแข็ง'),
('n','เดี๋ยวนะ น้ำมันปลา กับแสงแดด'),('n','มันเกี่ยวกันยังไงครับ'),
('u','แม็คคอลลัม ต้มน้ำมันตับปลา จนวิตามินเอพังหมด'),('u','แต่มันยังรักษาได้ แปลว่ามีอีกตัวซ่อนอยู่'),('u','วิตามินตัวที่สี่ที่ค้นพบ เลยได้ชื่อว่า ดี'),
('u','สตีนบ็อค พบว่าแค่ฉายแสงยูวีใส่อาหาร ก็เกิดวิตามินดี'),('u','ไม่นาน นมทั่วอเมริกา ก็เติมวิตามินดี'),
('u','ไม่กี่สิบปี โรคกระดูกอ่อนในเด็ก แทบหายไป'),
('u','วินเดาส์ ได้รางวัลโนเบล ปีหนึ่งพันเก้าร้อยยี่สิบแปด'),('u','และพบว่าผิวเรา มีสารที่โดนแดดแล้ว กลายเป็นดีสาม'),
('u','แต่ดีสามยังใช้ไม่ได้ทันที ต้องผ่านตับ แล้วผ่านไต'),('u','จึงกลายเป็นตัวจริง ที่ทำงานเหมือนฮอร์โมน'),
('n','แล้วดีสามในเม็ดนี้ ได้มาจากไหนครับ'),('u','ส่วนใหญ่ สกัดจากไขขนแกะ'),('n','ห๊ะ ขนแกะ'),
('u','ส่วนเรื่องแดดจัด งานวิจัยพบคนไทยเกือบครึ่ง วิตามินดีไม่พอ'),('u','คนกรุงเทพยิ่งเยอะ เพราะเราอยู่แต่ในตึก'),
('u','แดดยังเท่าเดิม แต่เราหลบแดดเอง'),('u','อย่ากินเยอะไว้ก่อน ตรวจเลือด แล้วปรึกษาหมอ')]
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
SC=[('room',[0,1,2,3],{'cams':[[0,'nephew'],[2,'uncle']],'pose':'pill'}),('london',[4,5]),('cmp',[6,7]),
('room',[8,9],{'cams':[[8,'uncle']],'pose':'down'}),('dog',[10,11]),('uv',[12,13]),('room',[14,15],{'cams':[[14,'nephew']],'pose':'scratch'}),
('mcc',[16,17,18]),('steen',[19,20]),('trend',[21]),('skin',[22,23]),('path',[24,25]),('room',[26],{'cams':[[26,'nephew']],'pose':'capsule'}),
('sheep',[27]),('room',[28],{'cams':[[28,'nephewClose']],'pose':'shock'}),('thai',[29,30]),('tip',[31,32]),('next',[],3.5),('end',[],4.5)]
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
