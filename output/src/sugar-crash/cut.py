import json,subprocess,sys
sil=[(0,0.393),(2.2163,0.7039),(3.3447,0.3174),(6.1241,0.3157),(6.9149,0.3718),(14.0806,0.3155),(16.515,0.4249),(17.3188,0.4244),(21.6227,0.476),(23.1774,0.5073),(24.5359,0.5023),(25.4454,0.4532),(29.1556,0.4559),(31.1911,0.5482),(32.9918,0.7613),(34.5461,0.4029),(35.4542,0.6779),(39.5737,0.3226)]
END=46.62; PAD=0.07
keep=[]; cur=0.0
for s,d in sil:
    a=s+PAD if s>0 else s; b=s+d-PAD
    if s==0: a=0; b=s+d-0.05
    if b-a>0.05:
        if a>cur: keep.append((cur,a))
        cur=b
keep.append((cur,END))
tot=sum(b-a for a,b in keep)
json.dump(keep,open('/tmp/w5/keep.json','w'))
print(len(keep),'segments, new duration %.2f'%tot)
sel='+'.join(f'between(t,{a:.3f},{b:.3f})' for a,b in keep)
vf=f"select='{sel}',setpts=N/FRAME_RATE/TB"
af=f"aselect='{sel}',asetpts=N/SR/TB"
subprocess.run(['ffmpeg','-v','error','-y','-i','/tmp/w5/raw.mp4','-vf',vf,'-af',af,'-c:v','libx264','-crf','16','-preset','fast','-c:a','pcm_s16le','/tmp/w5/cut.mov'],check=True)
