# Bright, playful original background music: plucked ukulele-style strums (Karplus-Strong),
# bouncy bass, claps, shaker and a whistle-like hook. D major, 108 BPM, vi-IV-I-V, glockenspiel hook.
# usage: python3 -I music_bright.py out.wav <duration_s>
import numpy as np, wave, sys
from scipy.signal import lfilter, butter, sosfilt
SR=44100; BPM=108; BEAT=60/BPM; BAR=4*BEAT
DUR=float(sys.argv[2]); N=int((DUR+2)*SR); L=np.zeros(N); R=np.zeros(N)
rng=np.random.default_rng(5)
def m2f(m): return 440*2**((m-69)/12)
def add(sig,t0,pan=0.0,g=1.0):
    i=int(t0*SR); e=min(N,i+len(sig))
    if e<=i: return
    s=sig[:e-i]*g; L[i:e]+=s*np.sqrt((1-pan)/2); R[i:e]+=s*np.sqrt((1+pan)/2)
def ks(f,d=0.9,bright=0.5):
    n=int(d*SR); p=max(2,int(SR/f)); buf=rng.uniform(-1,1,p); buf=lfilter([bright],[1,bright-1],buf)
    out=np.zeros(n); b=buf.copy()
    for i in range(n):
        out[i]=b[i%p]; b[i%p]=0.996*0.5*(b[i%p]+b[(i+1)%p])
    return out*np.exp(-np.arange(n)/SR*2.2)
cache={}
def pluck(m,d=0.9):
    k=(m,d)
    if k not in cache: cache[k]=ks(m2f(m),d)
    return cache[k]
def bass(m,d):
    t=np.arange(int(d*SR))/SR; f=m2f(m); y=np.sin(2*np.pi*f*t)+0.3*np.sin(4*np.pi*f*t)
    return y*np.minimum(1,t/0.01)*np.exp(-t*3.5)
def clap():
    t=np.arange(int(0.18*SR))/SR; n=rng.standard_normal(len(t))
    env=np.exp(-t*30)+0.6*np.exp(-np.maximum(t-0.012,0)*40)*(t>0.012)+0.4*np.exp(-np.maximum(t-0.024,0)*35)*(t>0.024)
    return sosfilt(butter(2,[900,3500],btype='band',fs=SR,output='sos'),n)*env
def shaker():
    t=np.arange(int(0.06*SR))/SR; return sosfilt(butter(2,6000,btype='high',fs=SR,output='sos'),rng.standard_normal(len(t)))*np.exp(-t*60)
def kick():
    t=np.arange(int(0.25*SR))/SR; f=50+90*np.exp(-t*30); return np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-t*12)
def whistle(m,d):
    t=np.arange(int(1.2*SR))/SR; f=m2f(m)
    y=sum(a*np.sin(2*np.pi*f*r*t)*np.exp(-t*k) for a,r,k in ((1,1,3),(.4,2.76,6),(.2,5.4,9)))
    return y*np.minimum(1,t/0.002)
chords=[[59,62,66,71],[55,59,62,67],[57,62,66,69],[57,61,64,69]]  # Bm G D A
roots=[47,43,38,45]
strum=[1,0,1,0,1,1,0,1]   # 8th-note pattern per bar (D . D U . U D .)
hook=[(0,78),(0.5,81),(1,83),(2,81),(3,78),(4,74),(4.5,76),(5,78),(6,76),(7,73)]  # in beats over 2 bars
nb=int(DUR/BAR)+2
for b in range(nb):
    t0=b*BAR; ch=chords[b%4]; rt=roots[b%4]
    for k,on in enumerate(strum):
        if not on: continue
        down=(k%2==0); notes=ch if down else ch[::-1]
        for j,m in enumerate(notes): add(pluck(m),t0+k*BEAT/2+j*0.012,(-0.3 if j<2 else 0.3),0.16 if down else 0.11)
    for k in (0,1.5,2,3.5): add(bass(rt,0.45),t0+k*BEAT,0,0.35)
    for k in (0,2): add(kick(),t0+k*BEAT,0,0.5)
    for k in (1,3): add(clap(),t0+k*BEAT,0.1,0.32)
    for k in range(8): add(shaker(),t0+k*BEAT/2,0.4,0.10 if k%2 else 0.06)
    if b>=1 and b%2==1:
        for bt,m in hook: add(whistle(m,0.4),t0+bt*BEAT,-0.2,0.09)
mix=np.stack([L,R],1); end=int(DUR*SR); fade=int(1.3*SR)
mix[:int(0.05*SR)]*=np.linspace(0,1,int(0.05*SR))[:,None]
mix[end-fade:end]*=np.linspace(1,0,fade)[:,None]; mix=mix[:end]
mix/=np.sqrt((mix**2).mean())+1e-9; mix*=10**(-20/20); mix=np.tanh(mix*1.2)/1.2
o=wave.open(sys.argv[1],'w');o.setnchannels(2);o.setsampwidth(2);o.setframerate(SR)
o.writeframes((np.clip(mix,-1,1)*32767).astype(np.int16).tobytes());o.close()
print('music ok',DUR,'peak',float(np.abs(mix).max()))
