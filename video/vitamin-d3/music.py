import numpy as np, wave, sys
sr=44100; dur=float(sys.argv[2]); n=int(sr*dur); t=np.arange(n)/sr
out=np.zeros(n)
f=lambda m:440*2**((m-69)/12)
prog=[[57,60,64],[53,57,60],[48,52,55],[55,59,62]]  # Am F C G
bar=4.0
for bi in range(int(dur/bar)+1):
    ch=prog[bi%4]; s=int(bi*bar*sr); e=min(n,int((bi+1)*bar*sr+sr*1.5))
    if s>=n: break
    tt=np.arange(e-s)/sr
    env=np.minimum(tt/1.2,1)*np.exp(-np.maximum(tt-bar,0)*2.5)
    for m in ch:
        for det in (-0.12,0.12):
            out[s:e]+=0.05*env*np.sin(2*np.pi*(f(m-12)+det)*tt)
    # music-box arpeggio
    arp=[ch[0]+12,ch[1]+12,ch[2]+12,ch[1]+12,ch[0]+24,ch[2]+12,ch[1]+12,ch[2]+12]
    for k,m in enumerate(arp):
        if (bi*8+k)%3==2: continue
        s2=int((bi*bar+k*0.5)*sr); e2=min(n,s2+int(sr*1.6))
        if s2>=n: break
        tt=np.arange(e2-s2)/sr; a=np.exp(-tt*3.2)*np.minimum(tt/0.004,1)
        out[s2:e2]+=0.045*a*(np.sin(2*np.pi*f(m)*tt)+0.25*np.sin(2*np.pi*2*f(m)*tt))
# simple echo
d=int(0.33*sr); y=out.copy(); y[d:]+=0.3*out[:-d]; y[2*d:]+=0.12*out[:-2*d]
fade=np.ones(n); fi=int(sr*1.5); fo=int(sr*3); fade[:fi]=np.linspace(0,1,fi); fade[-fo:]=np.linspace(1,0,fo)
y=y*fade; y=y/np.max(np.abs(y))*0.5
pcm=(y*32767).astype(np.int16); st=np.repeat(pcm[:,None],2,1)
w=wave.open(sys.argv[1],'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(sr); w.writeframes(st.tobytes()); w.close()
