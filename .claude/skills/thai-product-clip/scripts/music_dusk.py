# Warm sunset ambient: felt-piano arpeggios, soft pad, sub pulse. B minor, 84 BPM, Bm-G-D-A.
# usage: python3 -I music_dusk.py out.wav <duration_s>
import numpy as np, wave, sys
from scipy.signal import butter, sosfilt
SR=44100; BPM=84; BEAT=60/BPM; BAR=4*BEAT
DUR=float(sys.argv[2]); N=int((DUR+3)*SR); L=np.zeros(N); R=np.zeros(N); rng=np.random.default_rng(3)
m2f=lambda m:440*2**((m-69)/12)
def add(sig,t0,pan=0.0,g=1.0):
    i=int(t0*SR); e=min(N,i+len(sig))
    if e<=i: return
    s=sig[:e-i]*g; L[i:e]+=s*np.sqrt((1-pan)/2); R[i:e]+=s*np.sqrt((1+pan)/2)
def piano(m,d=2.4):
    t=np.arange(int(d*SR))/SR; f=m2f(m)
    y=sum(a*np.sin(2*np.pi*f*k*t*(1+0.0004*k*k))*np.exp(-t*(1.6+k*0.9)) for k,a in ((1,1),(2,.45),(3,.18),(4,.08)))
    return sosfilt(butter(2,2600,fs=SR,output='sos'),y)*np.minimum(1,t/0.006)
def pad(ms,d):
    t=np.arange(int(d*SR))/SR; y=np.zeros_like(t)
    for m in ms:
        for det in (-0.12,0.12): y+=np.sin(2*np.pi*m2f(m+det)*t+rng.uniform(0,6))
    y=sosfilt(butter(2,1200,fs=SR,output='sos'),y)
    return y*np.minimum(1,t/1.2)*np.minimum(1,(d-t)/1.2)
def sub(m,d):
    t=np.arange(int(d*SR))/SR; return np.sin(2*np.pi*m2f(m)*t)*np.minimum(1,t/0.05)*np.exp(-t*1.2)
def tick():
    t=np.arange(int(0.05*SR))/SR; return sosfilt(butter(2,[2500,7000],btype='band',fs=SR,output='sos'),rng.standard_normal(len(t)))*np.exp(-t*90)
chords=[[59,62,66],[55,59,62],[50,54,57],[57,61,64]]; roots=[35,31,38,33]
arp=[0,1,2,1,2,3,2,1]
mel=[(0,74),(1.5,73),(2,71),(4,69),(6,71),(7,73)]
nb=int(DUR/BAR)+2
for b in range(nb):
    t0=b*BAR; ch=chords[b%4]; rt=roots[b%4]
    add(pad([c-12 for c in ch]+[ch[0]],BAR+1.2),t0,0,0.05)
    add(sub(rt,BAR),t0,0,0.30); add(sub(rt,BEAT*2),t0+2*BEAT,0,0.16)
    notes=ch+[ch[0]+12]
    for k,j in enumerate(arp): add(piano(notes[j],1.8),t0+k*BEAT/2,(-0.35 if k%2 else 0.35),0.11)
    if b>=1:
        for k in range(8): add(tick(),t0+k*BEAT/2,0.3,0.05 if k%2 else 0.08)
    if b>=2 and b%2==0:
        for bt,m in mel: add(piano(m,2.6),t0+bt*BEAT,0,0.13)
mix=np.stack([L,R],1)
# simple stereo echo for space
d=int(0.31*SR); mix[d:,0]+=0.25*mix[:-d,1]; mix[d:,1]+=0.25*mix[:-d,0]
end=int(DUR*SR); fade=int(1.5*SR); mix[:int(0.05*SR)]*=np.linspace(0,1,int(0.05*SR))[:,None]
mix[end-fade:end]*=np.linspace(1,0,fade)[:,None]; mix=mix[:end]
mix/=np.sqrt((mix**2).mean())+1e-9; mix*=10**(-20/20); mix=np.tanh(mix*1.2)/1.2
o=wave.open(sys.argv[1],'w');o.setnchannels(2);o.setsampwidth(2);o.setframerate(SR)
o.writeframes((np.clip(mix,-1,1)*32767).astype(np.int16).tobytes());o.close(); print('music ok')
