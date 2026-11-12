# Original cinematic / trailer-style bed for the "grand" style: dark drone, pulsing synth bass,
# ticking percussion, big low hits (braams) and risers at the given hit times.
# usage: python3 -I music_epic.py out.wav <duration_s> [hit times comma-separated]
import numpy as np, wave, sys
from scipy.signal import butter, sosfilt
SR=44100; BPM=100; BEAT=60/BPM
DUR=float(sys.argv[2]); HITS=[float(x) for x in sys.argv[3].split(',')] if len(sys.argv)>3 else []
N=int((DUR+3)*SR); L=np.zeros(N); R=np.zeros(N); rng=np.random.default_rng(9)
def m2f(m): return 440*2**((m-69)/12)
def T(d): return np.arange(int(d*SR))/SR
def lp(x,f): return sosfilt(butter(2,f,btype='low',fs=SR,output='sos'),x)
def hp(x,f): return sosfilt(butter(2,f,btype='high',fs=SR,output='sos'),x)
def add(sig,t0,pan=0.0,g=1.0):
    i=int(t0*SR); e=min(N,i+len(sig))
    if e<=i: return
    s=sig[:e-i]*g; L[i:e]+=s*np.sqrt((1-pan)/2); R[i:e]+=s*np.sqrt((1+pan)/2)
def saw(f,t): return 2*((f*t)%1)-1
def drone(ms,d):
    t=T(d); y=sum(saw(m2f(m)*(1+det),t) for m in ms for det in (-0.004,0,0.005))
    return lp(y,900)*np.minimum(1,t/1.5)*np.minimum(1,(d-t)/1.5)
def pulse(m,d):
    t=T(d); y=saw(m2f(m),t)+0.5*np.sin(2*np.pi*m2f(m)/2*t); return lp(y,650)*np.exp(-t*7)
def tick():
    t=T(0.05); return hp(rng.standard_normal(len(t)),4000)*np.exp(-t*90)
def braam(m=31,d=2.6):
    t=T(d); y=sum(saw(m2f(mm)*(1+0.003*np.sin(2*np.pi*0.7*t)),t) for mm in (m,m+7,m+12))
    sub=np.sin(2*np.pi*m2f(m-12)*t)*1.5; env=np.minimum(1,t/0.03)*np.exp(-t*1.1)
    return (lp(y,700)+sub)*env
def boom():
    t=T(1.8); f=40+60*np.exp(-t*8); return np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-t*2.2)+0.3*lp(rng.standard_normal(len(t)),300)*np.exp(-t*6)
def riser(d=1.6):
    t=T(d); n=hp(rng.standard_normal(len(t)),800); f=200*(10**(t/d)); s=0.4*np.sin(2*np.pi*np.cumsum(f)/SR)
    return (lp(n,6000)*0.6+s)*(t/d)**2.2
chords=[[38,45,50,53],[34,41,46,50],[36,43,48,52],[33,40,45,49]]  # Dm Bb C A (dark minor)
roots=[26,22,24,21]; BAR=4*BEAT
nb=int(DUR/BAR)+2
for b in range(nb):
    t0=b*BAR; add(drone(chords[b%4],BAR+1.5),t0,0,0.05)
    for k in range(8): add(pulse(roots[b%4]+12,0.3),t0+k*BEAT/2,0,0.22 if k%2==0 else 0.14)
    for k in range(16): add(tick(),t0+k*BEAT/4,0.5 if k%2 else -0.5,0.05 if k%4 else 0.09)
for h in HITS:
    if h>1.6: add(riser(1.5),h-1.5,0,0.18)
    add(boom(),h,0,0.6); add(braam(31 if int(h)%2 else 29),h,0,0.22)
mix=np.stack([L,R],1); end=int(DUR*SR); fade=int(1.6*SR)
mix[end-fade:end]*=np.linspace(1,0,fade)[:,None]; mix=mix[:end]
mix/=np.sqrt((mix**2).mean())+1e-9; mix*=10**(-19/20); mix=np.tanh(mix*1.3)/1.3
o=wave.open(sys.argv[1],'w');o.setnchannels(2);o.setsampwidth(2);o.setframerate(SR)
o.writeframes((np.clip(mix,-1,1)*32767).astype(np.int16).tobytes());o.close()
print('epic music ok',DUR,'peak',float(np.abs(mix).max()))
