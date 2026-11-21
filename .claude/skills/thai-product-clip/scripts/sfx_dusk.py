# Soft cinematic SFX palette for the dusk/silhouette style + mixer.
# usage: python3 -I sfx_dusk.py voice.wav music.wav out_full.wav out_novoice.wav
import numpy as np, wave, sys
from scipy.signal import lfilter, butter, sosfilt
SR=44100; rng=np.random.default_rng(91)
def T(d): return np.arange(int(d*SR))/SR
def bp(x,lo,hi): return sosfilt(butter(2,[lo,hi],btype='band',fs=SR,output='sos'),x)
def lpf(x,f): return sosfilt(butter(2,f,btype='low',fs=SR,output='sos'),x)
def m2f(m): return 440*2**((m-69)/12)
def whoosh(d=0.6,lo=300,hi=3000):
    t=T(d); n=rng.standard_normal(len(t)); fc=lo+(hi-lo)*np.sin(np.pi*t/d)
    y=sum(bp(n,f*0.8,f*1.25)*np.exp(-((fc-f)/(f*0.5))**2) for f in np.geomspace(lo,hi,8)); return y*np.sin(np.pi*t/d)**2
def boom(f=55,d=1.4):
    t=T(d); fr=f*(1+1.5*np.exp(-t*8)); return np.sin(2*np.pi*np.cumsum(fr)/SR)*np.exp(-t*2.5)*np.minimum(1,t/0.01)+0.2*lpf(rng.standard_normal(len(t)),300)*np.exp(-t*6)
def chime(m,d=2.0):
    t=T(d); f=m2f(m); return sum(a*np.sin(2*np.pi*f*r*t)*np.exp(-t*k) for a,r,k in ((1,1,2.2),(.5,2.76,4),(.25,5.4,7)))*np.minimum(1,t/0.003)
def chimes(ms,gap=0.09): 
    y=np.zeros(int((len(ms)*gap+2)*SR))
    for i,m in enumerate(ms): s=chime(m,1.8); j=int(i*gap*SR); y[j:j+len(s)]+=s*(0.9**i)
    return y
def soft_click(f=1800):
    t=T(0.06); return np.sin(2*np.pi*f*t)*np.exp(-t*70)+0.3*bp(rng.standard_normal(len(t)),2000,6000)*np.exp(-t*120)
def tick_tock(n=6,gap=0.5):
    y=np.zeros(int((n*gap+0.2)*SR))
    for i in range(n):
        f=2200 if i%2==0 else 1600; t=T(0.05); s=np.sin(2*np.pi*f*t)*np.exp(-t*90)+0.4*bp(rng.standard_normal(len(t)),3000,8000)*np.exp(-t*150); j=int(i*gap*SR); y[j:j+len(s)]+=s
    return y
def sand(d=3.5):
    t=T(d); n=bp(rng.standard_normal(len(t)),3000,9000); g=(rng.random(len(t))<0.02)*1.0; g=lfilter([1],[1,-0.97],g)*0.05
    return (n*0.25+bp(rng.standard_normal(len(t)),4000,10000)*g)*np.minimum(1,t/0.4)*np.minimum(1,(d-t)/0.5)
def riser(d=1.0):
    t=T(d); n=rng.standard_normal(len(t)); y=bp(n,800,6000)*(t/d)**2; fr=200*(4**(t/d)); return y*0.6+0.4*np.sin(2*np.pi*np.cumsum(fr)/SR)*(t/d)**2
def swell(m,d=1.6):
    t=T(d); y=sum(np.sin(2*np.pi*m2f(mm)*t) for mm in (m,m+7,m+12)); return lpf(y,1800)*np.sin(np.pi*t/d)**2
def thud(f=90):
    t=T(0.35); fr=f*(1+np.exp(-t*30)); return np.sin(2*np.pi*np.cumsum(fr)/SR)*np.exp(-t*12)
def tap():
    t=T(0.08); return np.sin(2*np.pi*900*t)*np.exp(-t*60)
def footsteps(t0,t1,step=0.35,f=180):
    out=[];t=t0
    while t<t1:
        s=lpf(rng.standard_normal(int(0.07*SR)),900)*np.exp(-T(0.07)*50); out.append((t,s,.10,0)); t+=step
    return out
def wind(d):
    t=T(d); n=lpf(rng.standard_normal(len(t)),700)*(0.6+0.4*np.sin(2*np.pi*0.3*t)); return n*np.minimum(1,t/1)*np.minimum(1,(d-t)/1)
cues=[
 (0.0, wind(48.4), .10, 0),
 (0.02, boom(50,1.6), .45, 0),
 (0.9, chime(81,1.2), .16, -.4), (1.2, chime(84,1.2), .16, .4),
 (1.85, whoosh(0.5), .30, 0), (2.0, swell(57,1.4), .22, 0),
 (3.6, soft_click(2000), .22, .3),
 (4.3, chimes([74,78,81],0.08), .18, 0),
 (5.3, whoosh(0.6,400,2500), .26, 0), (5.6, riser(0.6)[::-1].copy(), .10, .4),
 (6.45, whoosh(0.5), .28, 0),
 *[(6.75+i*0.3, thud(110+i*15), .32, 0) for i in range(4)],
 (7.68, tick_tock(3,0.45), .18, .3),
 (9.0, whoosh(0.4,300,1800), .25, 0), (9.3, chime(76,1.0), .16, .3),
 (10.2, whoosh(0.5), .26, 0),
 *footsteps(11.2,17.0,0.35),
 (12.5, riser(0.8), .16, 0), (13.3, soft_click(1700), .26, -.2), (13.32, chime(83,1.4), .18, -.2),
 (16.12, soft_click(1500), .24, .4),
 (17.0, boom(46,1.8), .5, 0), (17.3, swell(62,2.0), .26, 0), (17.5, chimes([81,85,88,93],0.1), .2, 0),
 (18.6, whoosh(0.5), .22, 0), (18.9, sand(3.8), .22, .4), (19.0, tick_tock(7,0.52), .12, .3),
 (22.55, whoosh(0.55), .26, 0),
 *footsteps(23.4,29.6,0.4),
 (26.2, riser(1.0), .14, 0), (27.3, soft_click(1900), .24, 0), (27.32, chime(86,1.6), .2, 0),
 (28.2, swell(64,1.6), .18, 0),
 (30.85, boom(52,1.4), .4, 0), (31.0, lpf(rng.standard_normal(int(0.7*SR)),2500)*np.sin(np.pi*T(0.7)/0.7)**2, .16, 0), (30.95, chimes([86,90,93],0.08), .2, 0),
 (32.3, whoosh(1.2,200,1500), .26, 0), (33.64, thud(80), .3, -.3), (34.68, chimes([79,83,86,91],0.07), .2, .4),
 (35.85, whoosh(0.5), .24, 0), *[(36.0+i*0.04, thud(70), .2, 0) for i in range(1)],
 *footsteps(37.74,38.5,0.25), (38.5, thud(120), .28, -.2),
 *footsteps(39.7,40.6,0.25), (40.6, thud(140), .28, .2), (40.7, chime(88,1.4), .18, .3),
 (41.08, chimes([81,85,88,93],0.09), .2, 0),
 (42.78, whoosh(0.55), .26, 0), (42.86, swell(59,2.0), .22, 0),
 (44.7, soft_click(1600), .24, .4), *[(45.79+k*0.785, tap(), .2, .45) for k in range(4)],
 (46.64, boom(60,1.0), .3, 0), (46.66, chimes([86,90,93,98],0.07), .22, -.3),
]
voice_path, music_path, out_full, out_novo = sys.argv[1:5]
def rd(p):
    w=wave.open(p); x=np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).astype(np.float32)/32768
    return x.reshape(-1,w.getnchannels())
v=rd(voice_path).mean(1); mu=rd(music_path); N=len(v)
mu=np.pad(mu,((0,max(0,N-len(mu))),(0,0)))[:N]
sfx=np.zeros((N+3*SR,2))
for t0,s,g,pan in cues:
    s=s/(np.abs(s).max()+1e-9)*g; i=int(t0*SR); e=min(len(sfx),i+len(s))
    sfx[i:e,0]+=s[:e-i]*np.sqrt((1-pan)/2)*1.414; sfx[i:e,1]+=s[:e-i]*np.sqrt((1+pan)/2)*1.414
sfx=sfx[:N]
from scipy.ndimage import maximum_filter1d
a=np.abs(v); envv=lfilter([0.002],[1,-0.998],a); envv=maximum_filter1d(envv,int(0.25*SR)); envv=lfilter([0.0005],[1,-0.9995],envv)
envv=np.clip(envv/(np.percentile(envv,95)+1e-9),0,1)
db=lambda x:20*np.log10(np.sqrt((x**2).mean())+1e-12)
MUS_G=float(sys.argv[5]) if len(sys.argv)>5 else 0.5; SFX_G=0.30
duck=1-0.45*envv
full=np.stack([v,v],1)*0.92 + mu*MUS_G*duck[:,None] + sfx*SFX_G*(1-0.25*envv[:,None])
novo=mu*MUS_G*1.15 + sfx*SFX_G*1.3
def master(x): x=np.tanh(x*1.05)/np.tanh(1.05); return x*0.95/np.abs(x).max()
def wr(p,x):
    o=wave.open(p,'w');o.setnchannels(2);o.setsampwidth(2);o.setframerate(SR);o.writeframes((np.clip(x,-1,1)*32767).astype(np.int16).tobytes());o.close()
wr(out_full,master(full)); wr(out_novo,master(novo))
print('voice rms %.1f  music rms(ducked) %.1f  sfx rms %.1f'%(db(v*0.92),db(mu[:,0]*MUS_G*duck),db(sfx[:,0]*SFX_G)))
