# Light, curious explainer music for the chalkboard style: marimba chords + hook, pizzicato bass,
# finger snaps on 2 & 4, soft kick, shaker. D major, 104 BPM, D-Bm-G-A (bridge Em-A every 4th bar).
# usage: python3 -I music_marimba.py out.wav <duration_s>
import numpy as np, wave, sys
from scipy.signal import butter, sosfilt
SR=44100; BPM=104; BEAT=60/BPM; BAR=4*BEAT
DUR=float(sys.argv[2]); N=int((DUR+2)*SR); L=np.zeros(N); R=np.zeros(N)
rng=np.random.default_rng(11)
def m2f(m): return 440*2**((m-69)/12)
def T(d): return np.arange(int(d*SR))/SR
def add(sig,t0,pan=0.0,g=1.0):
    i=int(t0*SR); e=min(N,i+len(sig))
    if e<=i or i<0: return
    s=sig[:e-i]*g; L[i:e]+=s*np.sqrt((1-pan)/2); R[i:e]+=s*np.sqrt((1+pan)/2)
cache={}
def marimba(m,d=0.7):
    if (m,d) in cache: return cache[(m,d)]
    t=T(d); f=m2f(m)
    y=np.sin(2*np.pi*f*t)*np.exp(-t*5.5)+0.35*np.sin(2*np.pi*f*4*t)*np.exp(-t*22)+0.12*np.sin(2*np.pi*f*9.8*t)*np.exp(-t*40)
    y*=np.minimum(1,t/0.002); cache[(m,d)]=y; return y
def pizz(m,d=0.45):
    t=T(d); f=m2f(m); y=np.sin(2*np.pi*f*t)+0.4*np.sin(4*np.pi*f*t)+0.15*np.sin(6*np.pi*f*t)
    return y*np.minimum(1,t/0.004)*np.exp(-t*7)
def bp(x,lo,hi): return sosfilt(butter(2,[lo,hi],btype='band',fs=SR,output='sos'),x)
def snap():
    t=T(0.08); return bp(rng.standard_normal(len(t)),1800,6000)*np.exp(-t*90)
def kick():
    t=T(0.25); fr=55+90*np.exp(-t*35); return np.sin(2*np.pi*np.cumsum(fr)/SR)*np.exp(-t*12)
def shaker():
    t=T(0.06); return bp(rng.standard_normal(len(t)),5000,11000)*np.sin(np.pi*t/0.06)
CH={'D':[62,66,69],'Bm':[59,62,66],'G':[55,59,62],'A':[57,61,64],'Em':[52,55,59]}
ROOT={'D':38,'Bm':35,'G':31,'A':33,'Em':40}
PROG=['D','Bm','G','A','D','Bm','Em','A']
# hook (beat offsets within 2 bars, midi)
HOOK=[(0,74),(0.5,76),(1,78),(2,76),(2.5,74),(3,71),(4,73),(4.5,74),(5,76),(6.5,74),(7,69)]
nb=int(DUR/BAR)+2
for b in range(nb):
    t0=b*BAR; c=PROG[b%len(PROG)]; ch=CH[c]
    # marimba comping: off-beat chord stabs + broken arpeggio
    for k,beat in enumerate([0,1.5,2,3.5]):
        for j,m in enumerate(ch): add(marimba(m+12,0.6),t0+beat*BEAT+j*0.012,pan=-0.25+0.25*j,g=0.16)
    for k,beat in enumerate([0.5,1,2.5,3]):
        add(marimba(ch[k%3]+24,0.4),t0+beat*BEAT,pan=0.35,g=0.10)
    # pizz bass
    r=ROOT[c]
    for beat,m in ((0,r),(1.5,r+7),(2,r+12),(3,r+7)): add(pizz(m),t0+beat*BEAT,g=0.42)
    # drums
    for beat in (0,2.5): add(kick(),t0+beat*BEAT,g=0.5)
    for beat in (1,3): add(snap(),t0+beat*BEAT,pan=0.15,g=0.32)
    for e in range(8): add(shaker(),t0+e*BEAT/2,pan=-0.4,g=0.09 if e%2 else 0.05)
    # hook on bars 2-3, 6-7 of every 8 (leave space at the start for the opening line)
    if b%8 in (2,6) and b>0:
        for beat,m in HOOK: add(marimba(m+12,0.5),t0+beat*BEAT,pan=0.1,g=0.13)
y=np.stack([L,R],1)[:int(DUR*SR)]
fade=int(1.2*SR); y[-fade:]*=np.linspace(1,0,fade)[:,None]; y[:int(0.02*SR)]*=np.linspace(0,1,int(0.02*SR))[:,None]
y=np.tanh(y*1.4)/np.tanh(1.4); y*=0.5/np.abs(y).max()
o=wave.open(sys.argv[1],'w');o.setnchannels(2);o.setsampwidth(2);o.setframerate(SR)
o.writeframes((y*32767).astype(np.int16).tobytes());o.close();print('music ok',DUR)
