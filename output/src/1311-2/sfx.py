# Bright clip SFX palette (new sounds, none reused from earlier clips) + mixer.
# usage: python3 -I sfx_bright.py voice.wav music.wav out_full.wav out_novoice.wav
import numpy as np, wave, sys
from scipy.signal import lfilter, butter, sosfilt
SR=44100; rng=np.random.default_rng(77)
def T(d): return np.arange(int(d*SR))/SR
def bp(x,lo,hi): return sosfilt(butter(2,[lo,hi],btype='band',fs=SR,output='sos'),x)
def lpf(x,f): return sosfilt(butter(2,f,btype='low',fs=SR,output='sos'),x)
def m2f(m): return 440*2**((m-69)/12)
def tri(ph): return 2/np.pi*np.arcsin(np.sin(ph))
def pop(f=900,d=0.09):
    t=T(d); fr=f*np.exp(-t*30)+f*0.4; return np.sin(2*np.pi*np.cumsum(fr)/SR)*np.exp(-t*45)
def drip(f=1400):
    t=T(0.16); fr=f*(0.55+0.45*np.exp(-t*40)); return np.sin(2*np.pi*np.cumsum(fr)/SR)*np.exp(-t*28)
def slide_whistle(f0,f1,d=0.5):
    t=T(d); fr=f0*(f1/f0)**(t/d)*(1+0.01*np.sin(2*np.pi*6*t)); y=np.sin(2*np.pi*np.cumsum(fr)/SR)
    return (y+0.05*bp(rng.standard_normal(len(t)),min(f0,f1),max(f0,f1)*1.2))*np.minimum(1,t/0.03)*np.minimum(1,(d-t)/0.05)
def poof():
    t=T(0.35); return lpf(rng.standard_normal(len(t)),1800)*np.sin(np.pi*np.minimum(t/0.35,1))**2*np.exp(-t*4)
def zip_sweep(up=True,d=0.28):
    t=T(d); y=np.zeros_like(t); fc=np.linspace(800,6000,len(t)) if up else np.linspace(6000,800,len(t))
    n=rng.standard_normal(len(t)); return sum(bp(n,f*0.9,f*1.1)*((np.abs(fc-f)<600).astype(float)) for f in range(1000,6000,500))*np.sin(np.pi*t/d)
def thump(f=140):
    t=T(0.3); fr=f*(0.5+np.exp(-t*25)); return np.sin(2*np.pi*np.cumsum(fr)/SR)*np.exp(-t*14)+0.15*lpf(rng.standard_normal(len(t)),900)*np.exp(-t*40)
def tweet():
    y=np.zeros(int(0.5*SR))
    for st,f in ((0,2600),(0.14,3000),(0.26,3400)):
        t=T(0.1); fr=f+np.linspace(-400,500,len(t)); s=np.sin(2*np.pi*np.cumsum(fr)/SR)*np.sin(np.pi*t/0.1); i=int(st*SR); y[i:i+len(s)]+=s
    return y
def bike_bell(f=2350):
    t=T(1.0); y=sum(a*np.sin(2*np.pi*f*r*t)*np.exp(-t*k) for a,r,k in ((1,1,4),(.6,1.52,6),(.35,2.43,9)))
    y2=np.roll(y,int(0.11*SR)); y2[:int(0.11*SR)]=0; return (y+0.8*y2)*np.minimum(1,t/0.002)
def cuckoo():
    y=np.zeros(int(0.7*SR))
    for st,m in ((0,79),(0.22,75)):
        t=T(0.3); s=tri(2*np.pi*m2f(m)*t)*np.minimum(1,t/0.01)*np.exp(-t*6); i=int(st*SR); y[i:i+len(s)]+=s
    return y
def party_horn(d=0.6):
    t=T(d); fr=420+260*np.minimum(1,t/0.15); ph=2*np.pi*np.cumsum(fr)/SR; y=np.sign(np.sin(ph))*0.5+0.5*np.sin(2*ph)
    return lpf(y,2800)*np.minimum(1,t/0.02)*np.minimum(1,(d-t)/0.08)*(1+0.2*np.sin(2*np.pi*18*t))
def crackle(d=0.9):
    y=np.zeros(int(d*SR))
    for _ in range(40):
        i=int(rng.uniform(0,d*0.9)*SR); n=int(0.006*SR); y[i:i+n]+=rng.standard_normal(n)*rng.uniform(.3,1)
    return bp(y,2000,9000)
def wobble_bubble(d=0.45):
    t=T(d); fr=300+900*t/d+120*np.sin(2*np.pi*14*t); return np.sin(2*np.pi*np.cumsum(fr)/SR)*np.sin(np.pi*t/d)
def plink(m):
    t=T(0.5); return (tri(2*np.pi*m2f(m)*t)+0.3*np.sin(2*np.pi*m2f(m)*3*t)*np.exp(-t*20))*np.minimum(1,t/0.003)*np.exp(-t*7)
def boing(f=220,d=0.4):
    t=T(d); fr=f*(1+0.5*np.sin(2*np.pi*11*t)*np.exp(-t*7)); return np.sin(2*np.pi*np.cumsum(fr)/SR)*np.exp(-t*8)*np.minimum(1,t/0.004)
def tri_gliss(ms,gap=0.04):
    y=np.zeros(int((len(ms)*gap+0.5)*SR))
    for i,m in enumerate(ms):
        s=plink(m)[:int(0.4*SR)]; j=int(i*gap*SR); y[j:j+len(s)]+=s
    return y
def fill_gliss(d=0.6):
    t=T(d); fr=400*(3**(t/d)); return tri(2*np.pi*np.cumsum(fr)/SR)*np.minimum(1,t/0.03)*np.minimum(1,(d-t)/0.05)*0.7
def drum_roll(d=0.5):
    y=np.zeros(int((d+0.06)*SR)); k=0
    while k*0.035<d-0.03:
        i=int(k*0.035*SR); n=int(0.05*SR); tt=np.arange(n)/SR; y[i:i+n]+=bp(rng.standard_normal(n),180,5000)*np.exp(-tt*60)*(0.4+0.6*k*0.035/d); k+=1
    return y
def tada():
    t=T(1.1); y=np.zeros_like(t)
    for m in (67,71,74,79):
        ph=2*np.pi*m2f(m)*t; y+=(2*((ph/(2*np.pi))%1)-1)
    st=int(0.12*SR); y[:st]*=0.6; return lpf(y,2400)*np.minimum(1,t/0.02)*np.exp(-t*1.8)
def sad_trombone():
    y=np.zeros(int(1.6*SR))
    for i,(m,d) in enumerate(((62,0.28),(61,0.28),(60,0.28),(59,0.6))):
        t=T(d); f=m2f(m-12)*(1+(0.02*np.sin(2*np.pi*6*t) if i==3 else 0)); ph=2*np.pi*np.cumsum(f*np.ones_like(t))/SR
        s=lpf(np.sign(np.sin(ph))*0.6+np.sin(2*ph)*0.4,1400)*np.minimum(1,t/0.03)*np.minimum(1,(d-t)/0.05); j=int(sum(x[1] for x in ((62,0.28),(61,0.28),(60,0.28),(59,0.6))[:i])*SR); y[j:j+len(s)]+=s
    return y
def buzzer():
    y=np.zeros(int(0.5*SR))
    for st in (0,0.2):
        t=T(0.15); s=lpf(np.sign(np.sin(2*np.pi*170*t)),1500)*np.minimum(1,t/0.01); i=int(st*SR); y[i:i+len(s)]+=s
    return y
def squeak(f=1200):
    t=T(0.22); fr=f*(1+0.6*np.sin(np.pi*t/0.22)); return np.sin(2*np.pi*np.cumsum(fr)/SR)*np.sin(np.pi*t/0.22)
def clap1():
    t=T(0.15); return bp(rng.standard_normal(len(t)),900,3500)*(np.exp(-t*35)+0.5*np.exp(-np.maximum(t-0.01,0)*40)*(t>0.01))
def snap():
    t=T(0.05); return bp(rng.standard_normal(len(t)),2500,8000)*np.exp(-t*150)

cues=[
 (0.02, thump(110), .5, 0), (0.03, crackle(0.5), .2, 0), (0.05, boing(240,0.4), .2, .3),
 (1.95, zip_sweep(True), .3, 0), (2.1, pop(800), .22, -.4), (2.9, squeak(1200), .18, -.4), (4.5, thump(140), .38, 0), (5.0, squeak(1300), .18, .2), (5.45, plink(84), .2, .4),
 (6.45, wobble_bubble(0.4), .26, 0), *[(6.7+i*0.2, plink(76+i*3), .18, 0) for i in range(4)], (7.7, slide_whistle(900,500,0.8), .16, -.3),
 (9.05, zip_sweep(True), .3, 0), (9.2, boing(220,0.4), .22, .3), (10.3, buzzer(), .14, 0), *[(10.35+i*0.14, zip_sweep(True,0.12), .08, (i%3-1)*.4) for i in range(10)],
 (12.65, wobble_bubble(0.4), .26, 0), (13.6, squeak(1100), .2, -.3), (15.3, slide_whistle(1200,500,0.7), .18, .2), (16.2, thump(130), .34, .4),
 (17.05, zip_sweep(True), .3, 0), *[(17.1+i*0.2, plink(76+i*3), .14, 0) for i in range(4)], *[(18.8+i*0.28, drip(1100+i*40), .1, .2) for i in range(14)],
 (22.55, wobble_bubble(0.4), .26, 0), *[(22.8+i*0.1, plink(79+i*2), .12, 0) for i in range(6)], (24.6, cuckoo(), .18, .4),
 (26.15, zip_sweep(True), .3, 0), (26.3, drum_roll(0.9), .12, 0), (27.2, thump(140), .36, 0), (27.6, squeak(1200), .18, .3), (28.3, plink(86), .18, 0),
 (30.85, wobble_bubble(0.4), .26, 0), (31.3, squeak(1300), .18, -.2),
 (32.35, wobble_bubble(0.4), .26, 0), (32.45, tada(), .28, 0), (32.6, pop(800), .22, -.4), (33.75, pop(900), .22, .4), (35.5, pop(1000), .22, -.4), (35.95, plink(88), .18, 0),
 (37.65, zip_sweep(True), .3, 0), (37.95, boing(260,0.3), .2, -.3), (39.9, slide_whistle(600,1200,0.6), .2, .3), (40.6, bike_bell(), .18, .4),
 (42.75, wobble_bubble(0.4), .26, 0), (42.85, thump(130), .38, 0), (44.7, party_horn(0.5), .24, 0), (45.1, snap(), .2, .4), (45.45, snap(), .18, .4), (45.8, snap(), .18, .4),
 (46.65, tada(), .3, 0), (46.67, crackle(0.8), .2, 0), (46.75, tri_gliss([91,95,98,103],0.05), .2, 0),
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
SFX_G=0.30; MUS_G=0.70
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
