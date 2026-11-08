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
 (0.0, boing(180,0.45), .35, 0),
 (0.45, pop(800), .3, .3),
 (1.2, drip(900), .3, .4),
 *[(1.44+i*0.06, pop(600-i*30,0.08), .22, 0) for i in range(10)],
 (1.6, sad_trombone(), .22, .2),
 (2.55, plink(91), .3, -.1), (2.8, plink(88), .3, 0), (3.05, plink(93), .3, .1),
 *[(2.94+i*0.05, pop(900+i*60,0.07), .22, 0) for i in range(9)],
 (3.9, zip_sweep(True), .32, 0),
 (4.3, fill_gliss(1.3), .22, .3),
 (5.58, tada(), .36, 0), (5.6, crackle(0.8), .22, 0),
 (6.86, wobble_bubble(0.4), .3, 0),
 (6.95, thump(120), .42, 0),
 *[(7.36+i*0.045, pop(1000+i*40,0.06), .2, 0) for i in range(12)],
 (9.0, plink(76), .25, -.2), (9.2, slide_whistle(500,1500,0.6), .28, .3),
 (9.7, bike_bell(), .22, .4),
 (10.48, zip_sweep(False,0.3), .3, 0),
 *[(10.9+i*0.12, plink(72+i*2), .2, -.4) for i in range(5)],
 *[(11.15+i*0.12, plink(79+i*2), .2, .4) for i in range(5)],
 (11.42, party_horn(0.5), .28, 0),
 (13.76, zip_sweep(True), .32, 0),
 (13.85, squeak(1000), .28, 0),
 (14.28, tada(), .3, 0),
 (14.3, plink(95), .25, -.4), (14.45, plink(91), .25, .4),
 (15.88, wobble_bubble(0.4), .3, 0),
 (15.95, pop(700), .3, -.5), (16.1, pop(850), .3, 0), (16.25, pop(1000), .3, .5),
 (16.38, clap1(), .3, 0),
 *[(16.92+i*0.15, squeak(1100+i*200), .2, (-.5+i*.5)) for i in range(3)],
 (17.96, zip_sweep(True,0.3), .32, 0),
 (18.1, drum_roll(1.2), .18, 0),
 (18.46, clap1(), .3, 0),
 (19.6, slide_whistle(600,1800,0.7), .3, .3),
 (20.1, party_horn(0.6), .32, 0),
 (20.12, crackle(0.8), .25, 0),
 (21.44, wobble_bubble(0.45), .3, 0),
 (21.5, thump(110), .4, 0),
 (21.55, tri_gliss([86,90,93,98],0.05), .26, 0),
 (23.28, zip_sweep(True), .32, 0),
 (23.4, boing(220,0.4), .3, 0),
 *[(24.6+k*0.52, pop(600,0.08), .18, 0) for k in range(3)],
 (25.38, wobble_bubble(0.4), .28, 0),
 (25.42, plink(79), .3, .3), (25.98, plink(83), .3, .3), (27.08, plink(86), .3, .3),
 (27.1, clap1(), .3, .3),
 (28.3, zip_sweep(True), .32, 0),
 (28.4, bike_bell(), .2, .4),
 (28.78, snap(), .3, 0),
 (29.84, thump(100), .45, 0),
 (29.9, tada(), .38, 0), (29.92, crackle(1.0), .25, 0),
 (30.3, tri_gliss([91,95,98,103],0.05), .25, 0),
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
