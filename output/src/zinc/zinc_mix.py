# Per-clip SFX + music + voice mixer. EDIT the `cues` list for every new clip (times come from the transcript).
# usage: python3 -I mix_sfx.py voice.wav music.wav out_full.wav out_novoice.wav
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

cues=[
 (0.0, air_whoosh(0.6,200,2500), .5, 0),
 (0.38, paper_swish(0.25), .3, 0),
 (0.55, soft_thud(95), .5, 0),
 (1.12, air_whoosh(0.35,600,4500), .3, -.5),
 (1.18, wood(950), .35, 0),
 (2.18, air_whoosh(0.45,300,3500), .45, 0),
 (2.45, air_whoosh(0.3,800,5000), .25, -.5),
 (2.55, air_whoosh(0.3,800,5000), .25, .5),
 (2.62, bubble(560,0.18,2.0), .35, -.4),
 (2.72, bubble(700,0.18,2.0), .35, .4),
 (3.3, chimes([76,83],0.08,lambda m: kalimba(m,1.0)), .4, -.4),
 (4.0, air_whoosh(0.5,250,2500), .3, .3),
 (4.4, power_up(), .4, .4),
 (4.47, soft_thud(120,0.3), .45, 0),
 (5.12, air_whoosh(0.5,200,2000,False), .42, 0),
 (5.6, rise_tone(260,520,0.9), .25, -.2),
 (6.0, muted_down(), .35, .3),
 (6.52, nope(64,59), .45, .3),
 (6.94, paper_swish(0.3), .35, 0),
 (7.0, rise_tone(300,700,1.4), .3, .2),
 (8.4, shimmer_rise(0.8), .22, 0),
 (8.55, chimes([72,76,79,84],0.06,lambda m: bell(m,1.5,2.2)), .45, 0),
 (8.57, sparkle(0.9,12), .3, 0),
 (9.45, air_whoosh(0.4,300,3000,False), .4, 0),
 (9.55, soft_thud(100), .4, 0),
 (9.62, paper_swish(0.28), .32, .4),
 (9.9, kalimba(72,1.0), .38, .3),
 (10.62, paper_swish(0.28), .32, .4),
 (10.9, kalimba(79,1.0), .38, .3),
 (11.42, bubble(640,0.18,2.0), .35, 0),
 (12.12, air_whoosh(0.45,300,3500), .45, 0),
 (13.0, glass_ting(88), .25, .4),
 (13.3, paper_swish(0.25), .3, .3),
 (14.08, bubble(520,0.2,1.8), .35, .3),
 (15.95, low_bell(48), .4, 0),
 (16.0, sparkle(1.0,12), .28, 0),
 (17.5, soft_thud(110,0.35), .45, 0),
 (17.56, chimes([79,83,86],0.06,lambda m: bell(m,1.4,2.4)), .38, 0),
 (18.22, air_whoosh(0.45,300,3500), .45, 0),
 (18.72, power_up(), .4, .3),
 (19.44, air_whoosh(0.35,400,3000,False), .38, 0),
 (19.92, wood(700), .35, .3),
 (20.0, boing_soft(), .22, .3),
 (20.74, shimmer_rise(0.35)[::-1].copy(), .3, 0),
 (20.85, soft_thud(90), .45, 0),
 (21.12, paper_swish(0.25), .28, 0),
 (22.12, bubble(620,0.18,2.0), .35, -.4),
 (22.9, bubble(820,0.18,2.0), .35, .4),
 (23.88, air_whoosh(0.35,600,4500), .3, 0),
 (24.3, soft_thud(85), .5, 0),
 (24.3, chimes([79,83,86,91],0.07,lambda m: bell(m,1.6,2.0)), .45, 0),
 (24.32, sparkle(1.0,16), .32, 0),
]
voice_path, music_path, out_full, out_novo = sys.argv[1:5]
def rd(p):
    w=wave.open(p); x=np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).astype(np.float32)/32768
    return x.reshape(-1,w.getnchannels())
v=rd(voice_path).mean(1); mu=rd(music_path); N=len(v)
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
SFX_G=0.30; MUS_G=0.72
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
