import numpy as np, wave, sys
from scipy.signal import lfilter, butter, sosfilt
SR=44100; rng=np.random.default_rng(21)
def T(d): return np.arange(int(d*SR))/SR
def bp(x,lo,hi): return sosfilt(butter(2,[lo,hi],btype='band',fs=SR,output='sos'),x)
def lpf(x,f): return sosfilt(butter(2,f,btype='low',fs=SR,output='sos'),x)
def hpf(x,f): return sosfilt(butter(2,f,btype='high',fs=SR,output='sos'),x)
def env(t,a,dk): return np.minimum(1,t/max(a,1e-4))*np.exp(-t*dk)
def m2f(m): return 440*2**((m-69)/12)
# ---- palette ----
def air_whoosh(d=0.5,lo=300,hi=3000,up=True):
    t=T(d); n=rng.standard_normal(len(t)); y=np.zeros_like(n)
    # sweep via 3 overlapping bands
    k=np.sin(np.pi*t/d)**2
    a=bp(n,lo,hi)
    cut=np.linspace(0.2,1,len(t)) if up else np.linspace(1,0.2,len(t))
    y=lpf(a,hi)*k*cut
    return y
def bubble(f=600,d=0.18,rise=2.2):
    t=T(d); fr=f*(1+(rise-1)*(1-np.exp(-t*25))); return np.sin(2*np.pi*np.cumsum(fr)/SR)*env(t,0.003,22)
def mallet(m,d=0.8,bright=1.0):
    t=T(d); f=m2f(m); return (np.sin(2*np.pi*f*t)*np.exp(-t*6)+0.35*bright*np.sin(2*np.pi*4*f*t)*np.exp(-t*25))*np.minimum(1,t/0.002)
def kalimba(m,d=1.0):
    t=T(d); f=m2f(m); return (np.sin(2*np.pi*f*t)+0.2*np.sin(2*np.pi*5.4*f*t)*np.exp(-t*30))*env(t,0.002,4.5)
def bell(m,d=2.0,k=1.6):
    t=T(d); f=m2f(m); return sum(a*np.sin(2*np.pi*f*r*t)*np.exp(-t*k*q) for a,r,q in [(1,1,1),(.45,2.01,1.6),(.25,3.0,2.5),(.15,4.17,3.5)])*np.minimum(1,t/0.003)
def chimes(notes,gap=0.07,fn=None):
    fn=fn or (lambda m: bell(m,1.6,2.2))
    parts=[(i*gap,fn(m)) for i,m in enumerate(notes)]; L=int((parts[-1][0]+2)*SR); y=np.zeros(L)
    for st,s in parts: i=int(st*SR); y[i:i+len(s)]+=s[:L-i]
    return y
def sparkle(d=0.9,n=10,lo=3000,hi=7000):
    y=np.zeros(int(d*SR))
    for i in range(n):
        st=int(rng.uniform(0,d*0.65)*SR); f=rng.uniform(lo,hi); t=T(0.2); s=np.sin(2*np.pi*f*t)*np.exp(-t*25)*rng.uniform(.4,1)
        e=min(len(y),st+len(s)); y[st:e]+=s[:e-st]
    return y
def tick(f=3200,d=0.03):
    t=T(d); return (np.sin(2*np.pi*f*t)+0.5*hpf(rng.standard_normal(len(t)),2000))*np.exp(-t*220)
def tock(): return tick(1900)
def soft_thud(f0=110,d=0.4):
    t=T(d); f=f0*0.5+f0*np.exp(-t*25); return np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-t*10)+0.3*lpf(rng.standard_normal(len(t)),400)*np.exp(-t*30)
def nope(m1=64,m2=59):
    a=mallet(m1,0.3,0.4); b=mallet(m2,0.5,0.4); y=np.zeros(int(0.7*SR)); y[:len(a)]+=a; i=int(0.13*SR); y[i:i+len(b)]+=b[:len(y)-i]; return y
def muted_down():
    t=T(0.5); f=420*np.exp(-t*1.6); y=np.sin(2*np.pi*np.cumsum(f)/SR); return lpf(np.tanh(y*1.5),1200)*env(t,0.01,4)
def switch_click():
    t=T(0.06); return bp(rng.standard_normal(len(t)),1500,5000)*np.exp(-t*120)+0.4*np.sin(2*np.pi*900*t)*np.exp(-t*90)
def harp_gliss(start=60,n=9,gap=0.045):
    sc=[0,2,4,7,9,12,14,16,19,21,24]; return chimes([start+sc[i] for i in range(n)],gap,lambda m: kalimba(m,1.2))
def low_bell(m=48): return bell(m,3.0,0.9)
def birds():
    y=np.zeros(int(1.2*SR))
    for st in (0.0,0.18,0.55,0.7):
        t=T(0.12); f=3200+900*np.sin(2*np.pi*14*t)+np.linspace(0,800,len(t)); s=np.sin(2*np.pi*np.cumsum(f)/SR)*np.sin(np.pi*t/0.12)
        i=int(st*SR); y[i:i+len(s)]+=s
    return y
def rise_tone(f0=300,f1=900,d=0.6):
    t=T(d); f=f0*(f1/f0)**(t/d); y=np.sin(2*np.pi*np.cumsum(f)/SR)+0.3*np.sin(4*np.pi*np.cumsum(f)/SR)
    return y*np.minimum(1,t/0.03)*np.minimum(1,(d-t)/0.08)*0.6
def paper_swish(d=0.28):
    t=T(d); return bp(rng.standard_normal(len(t)),2500,9000)*np.sin(np.pi*t/d)**1.5
def wood(f=900):
    t=T(0.12); return (np.sin(2*np.pi*f*t)+0.5*np.sin(2*np.pi*2.7*f*t))*np.exp(-t*45)
def water_fill(d=1.0):
    y=np.zeros(int(d*SR)); tt=0.0
    while tt<d-0.1:
        b=bubble(rng.uniform(350,900)*(1+tt/d*0.6),0.12,rng.uniform(1.6,2.6))*rng.uniform(.3,.8); i=int(tt*SR); e=min(len(y),i+len(b)); y[i:e]+=b[:e-i]; tt+=rng.uniform(0.025,0.07)
    n=lpf(rng.standard_normal(len(y)),1800)*0.25*np.sin(np.pi*np.arange(len(y))/len(y))
    return y+n
def glass_ting(m=88): return bell(m,1.2,3.5)
def alarm(d=0.9):
    t=T(d); car=np.sin(2*np.pi*2600*t)+0.5*np.sin(2*np.pi*3900*t); gate=(np.sin(2*np.pi*22*t)>0).astype(float)
    return lpf(car*gate,5000)*np.minimum(1,t/0.01)*np.minimum(1,(d-t)/0.05)*0.6
def pill_tik(f=2200):
    t=T(0.08); return (np.sin(2*np.pi*f*t)*np.exp(-t*70)+0.6*bp(rng.standard_normal(len(t)),2000,8000)*np.exp(-t*160))
def zap():
    t=T(0.25); f=1800-1400*t/0.25+300*np.sin(2*np.pi*40*t); return np.tanh(2*np.sin(2*np.pi*np.cumsum(f)/SR))*env(t,0.005,9)*0.4
def power_up():
    return chimes([67,71,74,79],0.06,lambda m: mallet(m,0.6,0.8))
def dingdong(): return chimes([79,74],0.28,lambda m: bell(m,1.6,2.0))
def boing_soft():
    t=T(0.3); f=420+180*np.sin(2*np.pi*9*t)*np.exp(-t*8); return np.sin(2*np.pi*np.cumsum(f)/SR)*env(t,0.004,10)
def shimmer_rise(d=0.8):
    t=T(d); y=np.zeros_like(t)
    for f in (1760,2217,2637,3520): y+=np.sin(2*np.pi*f*(1+0.002*np.sin(2*np.pi*5*t))*t)
    return y*(t/d)**2*0.25+lpf(rng.standard_normal(len(t)),6000)*(t/d)**3*0.15

import json
KEEP=json.load(open('/tmp/w5/keep.json'))
def M(t):
    acc=0
    for a,b in KEEP:
        if t<a: return acc
        if t<=b: return acc+t-a
        acc+=b-a
    return acc
raw=[
 (0.30, air_whoosh(0.4,300,3000), .35, 0),
 (0.32, bubble(560,0.18), .35, -.2),
 (0.50, wood(900), .35, 0),
 (1.50, rise_tone(500,250,0.5), .25, .2),
 (2.76, air_whoosh(0.3,800,5000), .35, 0),
 (2.80, glass_ting(88), .3, -.2),
 (3.94, chimes([72,79],0.08,lambda m: kalimba(m,0.9)), .35, 0),
 (4.76, tick(2600,0.05), .3, 0),
 (6.60, water_fill(2.4), .22, 0),
 (8.80, bubble(700,0.18,2.0), .35, .2),
 (10.10, chimes([76,81],0.07,lambda m: bell(m,1.2,2.6)), .35, 0),
 (11.98, water_fill(1.6), .24, 0),
 (12.70, nope(64,60), .3, 0),
 (13.02, soft_thud(120,0.3), .3, 0),
 (14.30, air_whoosh(1.2,150,1800,False), .4, 0),
 (14.40, water_fill(1.6), .3, .1),
 (15.15, soft_thud(80,0.5), .5, 0),
 (16.90, paper_swish(0.25), .3, 0),
 (17.70, wood(1100), .3, -.2),
 *[(M(17.75+i*0.14)-M(17.75)+17.75, pill_tik(1800+i*120), .25, (i%2)*.4-.2) for i in range(6)],
 (20.55, zap(), .25, .2),
 (20.60, mallet(74,0.7), .35, 0),
 (21.96, air_whoosh(0.5,300,4000), .45, 0),
 (21.98, soft_thud(90,0.4), .45, 0),
 (23.66, bubble(380,0.25,1.4), .4, .3),
 (24.95, paper_swish(0.25), .3, 0),
 (25.90, rise_tone(250,700,2.3), .22, 0),
 (28.50, muted_down(), .35, 0),
 (29.45, air_whoosh(0.35,500,3500), .3, 0),
 (30.00, boing_soft(), .3, -.2),
 (30.40, boing_soft(), .22, .2),
 (31.00, soft_thud(100,0.35), .4, 0),
 (31.60, kalimba(69,0.9), .3, 0),
 (33.84, nope(67,62), .35, 0),
 (34.96, paper_swish(0.25), .3, 0),
 (35.20, rise_tone(280,900,1.3), .22, 0),
 (36.40, wood(800), .3, 0),
 (37.54, air_whoosh(0.4,300,4000), .45, 0),
 (37.56, soft_thud(85,0.4), .45, 0),
 (38.00, bubble(360,0.25,1.4), .4, .3),
 (39.85, shimmer_rise(0.5)[::-1].copy(), .25, 0),
 (40.60, chimes([72,76,79],0.07,lambda m: kalimba(m,1.1)), .35, 0),
 (44.08, mallet(79,0.8), .3, 0),
 (45.30, chimes([72,76,79,84],0.06,lambda m: bell(m,1.6,2.0)), .4, 0),
 (45.32, sparkle(1.0,10), .3, 0),
]
cues=[(M(t),s,g,p) for t,s,g,p in raw]
voice_path, music_path, out_full, out_novo = sys.argv[1:5]
def rd(p):
    w=wave.open(p); x=np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).astype(np.float32)/32768
    return x.reshape(-1,w.getnchannels())
v=rd(voice_path).mean(1); mu=rd(music_path); N=len(v)
v=v*(10**(-16/20)/(np.sqrt((v**2).mean())+1e-9)); v=np.tanh(v*1.2)/1.2
mu=np.pad(mu,((0,max(0,N-len(mu))),(0,0)))[:N]
sfx=np.zeros((N+SR,2))
for t0,s,g,pan in cues:
    if g==0: continue
    s=s/(np.abs(s).max()+1e-9)*g; i=int(t0*SR); e=min(len(sfx),i+len(s))
    sfx[i:e,0]+=s[:e-i]*np.sqrt((1-pan)/2)*1.414; sfx[i:e,1]+=s[:e-i]*np.sqrt((1+pan)/2)*1.414
sfx=sfx[:N]
# voice envelope for ducking
a=np.abs(v); envv=lfilter([0.002],[1,-0.998],a); envv=envv/(envv.max()+1e-9)
from scipy.ndimage import maximum_filter1d
envv=maximum_filter1d(envv,int(0.25*SR)); envv=lfilter([0.0005],[1,-0.9995],envv)/0.0005*0.0005; envv=np.clip(envv/ (np.percentile(envv,95)+1e-9),0,1)
SFX_G=0.24; MUS_G=0.48
duck=1-0.5*envv
full=np.stack([v,v],1)*0.92 + mu*MUS_G*duck[:,None] + sfx*SFX_G*(1-0.25*envv[:,None])
novo=mu*MUS_G*1.15 + sfx*SFX_G*1.3
def master(x):
    x=np.tanh(x*1.05)/np.tanh(1.05); return x*0.95/np.abs(x).max()
def wr(p,x):
    o=wave.open(p,'w');o.setnchannels(2);o.setsampwidth(2);o.setframerate(SR);o.writeframes((np.clip(x,-1,1)*32767).astype(np.int16).tobytes());o.close()
wr(out_full,master(full)); wr(out_novo,master(novo))
db=lambda x:20*np.log10(np.sqrt((x**2).mean())+1e-12)
print('voice rms',db(v*0.92),'music rms(ducked)',db(mu[:,0]*MUS_G*duck),'sfx rms',db(sfx[:,0]*SFX_G))
