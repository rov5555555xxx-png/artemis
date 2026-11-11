# SFX for the 10/11/26 clip, two palettes: 'uk' (paper, wood, seals, bells) and 'deco' (switches, bulbs, brass, bells).
# usage: python3 -I sfx_1011.py uk|deco voice.wav music.wav out_full.wav out_novoice.wav
import numpy as np, wave, sys
from scipy.signal import lfilter, butter, sosfilt
from scipy.ndimage import maximum_filter1d
SR=44100; rng=np.random.default_rng(101)
T=lambda d:np.arange(int(d*SR))/SR
bp=lambda x,lo,hi:sosfilt(butter(2,[lo,hi],btype='band',fs=SR,output='sos'),x)
lp=lambda x,f:sosfilt(butter(2,f,fs=SR,output='sos'),x)
m2f=lambda m:440*2**((m-69)/12)
nz=lambda d:rng.standard_normal(int(d*SR))
# ---- ukiyo palette
def seal():   # low thump + tacky peel
    t=T(0.45); th=np.sin(2*np.pi*np.cumsum(90*(0.6+np.exp(-t*30)))/SR)*np.exp(-t*16)
    peel=bp(nz(0.45),1500,5000)*np.exp(-np.maximum(t-0.12,0)*30)*(t>0.12)*0.35
    return th+0.3*lp(nz(0.45),700)*np.exp(-t*40)+peel
def baren(d=0.4):  # paper rub
    t=T(d); n=bp(nz(d),400,3000); return n*(0.5+0.5*np.sin(2*np.pi*7*t))*np.sin(np.pi*t/d)
def swish(d=0.55): t=T(d); fc=np.linspace(3000,600,len(t)); return bp(nz(d),500,4000)*np.sin(np.pi*t/d)**1.5
def clack(): t=T(0.12); return (np.sin(2*np.pi*1850*t)+0.6*np.sin(2*np.pi*2730*t))*np.exp(-t*55)
def rin(m=93):
    t=T(2.0); f=m2f(m); return sum(a*np.sin(2*np.pi*f*r*t)*np.exp(-t*k) for a,r,k in ((1,1,1.5),(.5,2.76,3),(.3,5.4,5)))*np.minimum(1,t/0.002)
def koto_gl(ms,gap=0.045):
    y=np.zeros(int((len(ms)*gap+1)*SR))
    for i,m in enumerate(ms):
        t=T(0.9); f=m2f(m); s=(np.sin(2*np.pi*f*t)+0.4*np.sin(4*np.pi*f*t)+0.2*np.sin(6*np.pi*f*t))*np.exp(-t*4)*np.minimum(1,t/0.002); j=int(i*gap*SR); y[j:j+len(s)]+=s
    return y
def furin():
    y=np.zeros(int(1.6*SR))
    for st,m in ((0,98),(0.18,101),(0.33,96)):
        s=rin(m)[:int(1.2*SR)]; j=int(st*SR); y[j:j+len(s)]+=s
    return y
def taiko(f=62):
    t=T(0.7); return np.sin(2*np.pi*np.cumsum(f*(1+0.6*np.exp(-t*30)))/SR)*np.exp(-t*5)+0.25*lp(nz(0.7),400)*np.exp(-t*25)
def tsuzumi(): t=T(0.3); return np.sin(2*np.pi*np.cumsum(300*(1+0.5*np.exp(-t*20)))/SR)*np.exp(-t*14)
def rattle(d=0.5):
    y=np.zeros(int(d*SR))
    for k in range(int(d/0.05)):
        s=clack()[:int(0.05*SR)]*(0.5+0.5*k/(d/0.05)); j=int(k*0.05*SR); y[j:j+len(s)]+=s
    return y
def drop_pebble(): t=T(0.18); return np.sin(2*np.pi*np.cumsum(1200*np.exp(-t*12)+300)/SR)*np.exp(-t*30)
def boo():  # shakuhachi falling 'no way'
    t=T(0.8); f=m2f(69)*2**(-3*t/0.8/12*4); y=np.sin(2*np.pi*np.cumsum(f)/SR)+0.4*bp(nz(0.8),300,1500)
    return y*np.minimum(1,t/0.05)*np.minimum(1,(0.8-t)/0.2)
# ---- deco palette
def chunk():  # knife switch + relay
    t=T(0.25); return lp(nz(0.25),2500)*np.exp(-t*45)+0.6*np.sin(2*np.pi*120*t)*np.exp(-t*25)
def hum(d=0.5): t=T(d); return (np.sin(2*np.pi*120*t)+0.3*np.sin(2*np.pi*240*t))*np.minimum(1,t/0.05)*np.exp(-t*3)
def ding(m=88):
    t=T(1.6); f=m2f(m); return (np.sin(2*np.pi*f*t)+0.35*np.sin(2*np.pi*f*2.4*t)*np.exp(-t*4))*np.exp(-t*2)*np.minimum(1,t/0.002)
def doors(d=0.5): t=T(d); return bp(nz(d),200,1800)*np.sin(np.pi*t/d)**2+0.4*np.sin(2*np.pi*55*t)*np.sin(np.pi*t/d)
def brass_click(): t=T(0.08); return bp(nz(0.08),3000,9000)*np.exp(-t*90)+0.4*np.sin(2*np.pi*3200*t)*np.exp(-t*80)
def xylo(ms,gap=0.05):
    y=np.zeros(int((len(ms)*gap+0.6)*SR))
    for i,m in enumerate(ms):
        t=T(0.4); f=m2f(m); s=(np.sin(2*np.pi*f*t)+0.5*np.sin(2*np.pi*f*3.9*t)*np.exp(-t*30))*np.exp(-t*12); j=int(i*gap*SR); y[j:j+len(s)]+=s
    return y
def cymbal(d=1.2): t=T(d); return bp(nz(d),4000,12000)*np.minimum(1,t/(d*0.8))**2*np.exp(-np.maximum(t-d*0.8,0)*12)
def stab(ms,d=0.3):
    t=T(d); y=sum(((m2f(m)*t)%1*2-1) for m in ms)/len(ms); return bp(y,600,3000)*np.minimum(1,t/0.01)*np.exp(-t*6)
def cork():
    t=T(1.2); pop=np.sin(2*np.pi*np.cumsum(500+900*np.exp(-t*60))/SR)*np.exp(-t*40); fiz=bp(nz(1.2),3000,10000)*np.exp(-t*2.5)*0.3
    return pop+fiz
def trombone_down():
    t=T(0.7); f=m2f(50)*2**(-5*t/0.7/12); ph=2*np.pi*np.cumsum(f)/SR; return lp(np.sign(np.sin(ph))*0.5+0.5*np.sin(2*ph),1200)*np.minimum(1,t/0.03)*np.minimum(1,(0.7-t)/0.1)
def tick(): t=T(0.04); return bp(nz(0.04),2000,6000)*np.exp(-t*120)

S=[6.8,12.3,16.4,22.5,26.0,31.2,33.9,40.8,44.3]
mode=sys.argv[1]
if mode=='uk':
    cues=[(0.02,taiko(58),.45,0),(0.05,clack(),.25,0)]
    cues+=[(s-0.05,swish(),.30,.3) for s in S]
    cues+=[(2.7,seal(),.45,0),(4.0,baren(),.18,-.4),(4.95,baren(),.18,.4),(5.85,koto_gl([74,77,79,81,86]),.24,0),
     (6.95,clack(),.2,-.3),(7.5,clack(),.18,.3),(8.3,tsuzumi(),.28,0),(9.95,taiko(66),.45,0),(9.97,rin(93),.22,0),(10.6,baren(0.5),.16,0),
     (12.5,koto_gl([62,65,67,69],0.09),.18,-.3),(14.2,seal(),.38,.3),(15.35,swish(0.4),.2,.3),(15.9,clack(),.18,.3)]
    cues+=[(t,seal(),.30,p) for t,p in ((16.9,-.4),(17.55,0),(18.25,.4),(18.9,-.4),(19.9,0),(21.2,.4))]
    cues+=[(t,rin(m),.13,p) for t,m,p in ((16.92,86,-.4),(17.57,89,0),(18.27,91,.4),(18.92,93,-.4),(19.92,96,0),(21.22,98,.4))]
    cues+=[(22.6,seal(),.35,0),(23.95,tsuzumi(),.28,-.3),(25.0,tsuzumi(),.28,.3),(25.02,furin(),.15,.3),
     (26.1,baren(0.6),.16,0),(26.55,seal(),.5,0),(26.6,taiko(55),.35,0),(28.4,swish(0.5),.15,0),(29.3,rin(96),.2,.3),(30.2,clack(),.22,0),(30.45,clack(),.22,0),
     (31.3,rattle(1.2),.22,0),(32.4,taiko(60),.35,0),(32.45,koto_gl([62,65,67,69,74,77,79],0.06),.2,0),
     (34.0,baren(),.15,-.3),(34.6,koto_gl([69,67,65,62],0.12),.15,.3),(36.95,seal(),.35,0)]
    cues+=[(t,drop_pebble(),.25,(i-2)*.2) for i,t in enumerate((38.65,38.71,38.77,39.0,39.35))]
    cues+=[(39.95,boo(),.25,.3),(40.85,taiko(52),.5,0),(40.9,furin(),.2,0),(42.3,seal(),.45,.3),(42.32,rin(91),.2,.3),(43.25,baren(),.15,-.3),
     (44.5,koto_gl([74,77,79],0.08),.18,-.3),(45.4,seal(),.35,-.2),(47.5,baren(0.5),.15,.3),(49.45,seal(),.35,.3),(49.5,clack(),.2,.3),
     (50.05,koto_gl([62,65,67,69,74,77,79,81,86],0.05),.24,0),(51.0,seal(),.45,0),(51.02,taiko(58),.4,0),(51.05,rin(98),.22,0)]
else:
    cues=[(0.02,cymbal(0.3)[::-1].copy(),.25,0),(0.05,stab([65,69,72,76]),.3,0)]
    cues+=[(s-0.02,doors(),.28,0) for s in S]
    cues+=[(2.7,chunk(),.35,0),(2.72,hum(),.12,0),(3.0,xylo([72,76,79,84]),.18,0),(4.0,chunk(),.28,-.4),(4.95,chunk(),.28,.4),(5.85,stab([67,70,74,77]),.3,0),
     (6.95,brass_click(),.2,-.3),(7.5,brass_click(),.2,.3),(8.3,tick(),.2,0),(9.95,ding(88),.3,0),(9.97,chunk(),.3,0),(10.6,xylo([79,84,88],0.06),.16,0),
     (12.5,xylo([65,69,72,77,81],0.12),.16,-.3),(14.3,ding(84),.25,.3),(15.35,brass_click(),.22,.3),(15.9,brass_click(),.22,.3)]
    cues+=[(t,chunk(),.28,p) for t,p in ((16.9,-.4),(17.55,0),(18.25,.4),(18.9,-.4),(19.9,0),(21.2,.4))]
    cues+=[(t,ding(m),.12,p) for t,m,p in ((16.95,81,-.4),(17.6,84,0),(18.3,86,.4),(18.95,88,-.4),(19.95,91,0),(21.25,93,.4))]
    cues+=[(22.6,stab([65,69,72]),.28,0),(23.95,ding(86),.25,-.3),(25.0,ding(91),.25,.3),
     (26.55,stab([53,57,60,64],0.5),.4,0),(26.57,cymbal(0.25),.2,0),(28.4,tick(),.15,0),(29.3,ding(93),.22,.3),(30.2,stab([62,65,69]),.25,0),
     (31.3,cymbal(1.1),.25,0),(32.4,stab([65,69,72,77],0.5),.35,0),(32.42,xylo([77,81,84,89,93],0.05),.18,0),
     (34.0,brass_click(),.2,-.3),(34.6,tick(),.15,.3),(34.9,tick(),.15,.3),(35.2,tick(),.15,.3),(36.95,trombone_down(),.25,0)]
    cues+=[(t,brass_click(),.25,(i-2)*.2) for i,t in enumerate((38.65,38.71,38.77,39.0,39.35))]
    cues+=[(39.95,stab([58,61,64],0.4),.3,.3),(40.85,cymbal(0.6),.2,0),(40.9,stab([65,69,72,76],0.6),.4,0),(42.3,chunk(),.3,.3),(42.32,ding(89),.25,.3),(43.25,xylo([77,81],0.1),.16,-.3),
     (44.5,xylo([72,76,79],0.08),.16,-.3),(45.4,chunk(),.28,-.2),(45.42,ding(84),.18,-.2),(47.5,doors(0.4),.15,.3),(49.45,chunk(),.28,.3),(49.47,ding(88),.18,.3),
     (50.05,xylo([77,81,84,89,93,96],0.05),.2,0),(51.0,cork(),.35,0),(51.05,stab([65,69,72,76,79],0.9),.35,0)]
voice_path,music_path,out_full,out_novo=sys.argv[2:6]
def rd(p):
    w=wave.open(p); x=np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).astype(np.float32)/32768; return x.reshape(-1,w.getnchannels())
v=rd(voice_path).mean(1); mu=rd(music_path); N=len(v); mu=np.pad(mu,((0,max(0,N-len(mu))),(0,0)))[:N]
sfx=np.zeros((N+3*SR,2))
for t0,s,g,pan in cues:
    s=s/(np.abs(s).max()+1e-9)*g; i=int(t0*SR); e=min(len(sfx),i+len(s))
    sfx[i:e,0]+=s[:e-i]*np.sqrt((1-pan)/2)*1.414; sfx[i:e,1]+=s[:e-i]*np.sqrt((1+pan)/2)*1.414
sfx=sfx[:N]
a=np.abs(v); envv=lfilter([0.002],[1,-0.998],a); envv=maximum_filter1d(envv,int(0.25*SR)); envv=np.clip(envv/(np.percentile(envv,95)+1e-9),0,1)
duck=1-0.5*envv; SFX_G=0.30; MUS_G=0.62
full=np.stack([v,v],1)*0.92+mu*MUS_G*duck[:,None]+sfx*SFX_G*(1-0.25*envv[:,None])
novo=mu*MUS_G*1.15+sfx*SFX_G*1.3
master=lambda x:(lambda y:y*0.95/np.abs(y).max())(np.tanh(x*1.05)/np.tanh(1.05))
def wr(p,x):
    o=wave.open(p,'w');o.setnchannels(2);o.setsampwidth(2);o.setframerate(SR);o.writeframes((np.clip(x,-1,1)*32767).astype(np.int16).tobytes());o.close()
wr(out_full,master(full)); wr(out_novo,master(novo))
db=lambda x:20*np.log10(np.sqrt((x**2).mean())+1e-12)
print(mode,'voice rms %.1f  music rms(ducked) %.1f  sfx rms %.1f'%(db(v*0.92),db(mu[:,0]*MUS_G*duck),db(sfx[:,0]*SFX_G)))
