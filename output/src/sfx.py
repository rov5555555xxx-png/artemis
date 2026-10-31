import numpy as np, wave, sys
SR=44100; rng=np.random.default_rng(3)
def T(d): return np.arange(int(d*SR))/SR
def lp(x,a):
    # one-pole lowpass, a may be array
    y=np.zeros_like(x); a=np.broadcast_to(a,x.shape); s=0.0
    for i in range(len(x)): s+=a[i]*(x[i]-s); y[i]=s
    return y
def whoosh(d=0.45,up=True):
    t=T(d); n=rng.standard_normal(len(t)); env=np.sin(np.pi*t/d)**2
    sw=np.linspace(0.02,0.35,len(t)) if up else np.linspace(0.35,0.02,len(t))
    y=lp(n,sw); y=y-lp(y,0.02); return 1.6*y*env
def pop(f0=900,f1=280,d=0.12):
    t=T(d); f=f1+(f0-f1)*np.exp(-t*40); ph=2*np.pi*np.cumsum(f)/SR
    return np.sin(ph)*np.exp(-t*30)*0.9
def ding(f=1320,d=1.0):
    t=T(d); y=sum(a*np.sin(2*np.pi*f*m*t)*np.exp(-t*k) for a,m,k in [(1,1,4),(.5,2.76,7),(.25,5.4,11),(.15,2,5)])
    return 0.55*y*np.minimum(1,t*400)
def impact(d=0.7):
    t=T(d); f=38+70*np.exp(-t*12); s=np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-t*6)
    n=lp(rng.standard_normal(len(t)),0.08)*np.exp(-t*18)
    return 1.1*s+1.2*n
def stamp():
    a=impact(0.35)*0.7; t=T(0.35); c=rng.standard_normal(len(t))*np.exp(-t*90)*0.5
    return a+c
def tick(f=2600):
    t=T(0.04); return np.sin(2*np.pi*f*t)*np.exp(-t*160)*0.6
def sparkle(d=0.8,n=9):
    y=np.zeros(int(d*SR))
    for i in range(n):
        st=int(rng.uniform(0,d*0.6)*SR); f=rng.uniform(2500,6000); t=T(0.25)
        s=np.sin(2*np.pi*f*t)*np.exp(-t*22)*0.25; e=min(len(y),st+len(s)); y[st:e]+=s[:e-st]
    return y
def wah(d=0.7):
    t=T(d); f=520-260*(t/d)+12*np.sin(2*np.pi*6*t); ph=2*np.pi*np.cumsum(f)/SR
    y=np.sin(ph)+0.35*np.sin(2*ph)+0.15*np.sin(3*ph); return 0.4*y*np.minimum(1,t*30)*np.exp(-t*1.5)
def buzz():
    out=[]
    for f,d in [(415,0.16),(311,0.3)]:
        t=T(d); x=np.sign(np.sin(2*np.pi*f*t))*0.5+np.sin(2*np.pi*f*t)*0.5
        out.append(lp(x,0.25)*np.minimum(1,t*200)*np.exp(-t*4)*0.35); out.append(np.zeros(int(0.03*SR)))
    return np.concatenate(out)
def riser(d=0.7):
    t=T(d); f=200*np.exp(np.log(8)*t/d); s=np.sin(2*np.pi*np.cumsum(f)/SR)*0.25
    n=lp(rng.standard_normal(len(t)),np.linspace(0.02,0.5,len(t)))*0.7
    return (s+n)*(t/d)**2
def boing():
    t=T(0.45); f=300+250*(t/0.45)+60*np.sin(2*np.pi*14*t)*np.exp(-t*4)
    return np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-t*5)*0.5
def slide(d=1.4):
    t=T(d); f=700*np.exp(np.log(0.35)*t/d); return 0.18*np.sin(2*np.pi*np.cumsum(f)/SR)*np.minimum(1,t*20)*np.minimum(1,(d-t)*8)
def chime():
    y=np.zeros(int(1.6*SR))
    for i,f in enumerate([1047,1319,1568,2093]):
        s=ding(f,1.0)*0.6; st=int(i*0.08*SR); y[st:st+len(s)]+=s
    return y

cues=[(0.0,whoosh(),.5),(0.05,impact(),.8),(0.34,pop(),.6),(1.86,stamp(),.7),
(2.4,whoosh(.35),.4),(2.6,pop(),.55),(4.1,pop(),.55),
(5.42,whoosh(.35),.4),(5.6,pop(700,200),.6),(5.82,pop(800,240),.6),(6.6,pop(1100,500,.08),.4),
*[(6.86+i*0.05,tick(2000+i*90),.35) for i in range(11)],(7.48,stamp(),.7),(7.5,sparkle(),.6),
(7.98,whoosh(.35),.4),(8.7,pop(),.55),(9.8,pop(1200,600,.08),.35),(10.1,pop(),.55),(10.9,ding(1568),.5),
(11.3,whoosh(.5,False),.5),(11.62,wah(),.55),(12.26,stamp(),.45),(13.78,whoosh(.35),.35),(13.9,slide(),.6),(15.16,buzz(),.6),
(15.3,riser(.7),.5),(16.0,impact(),.85),(16.0,sparkle(),.6),(16.12,stamp(),.5),
(17.1,whoosh(.35),.4),(17.5,pop(),.55),(18.58,pop(),.55),(20.18,pop(),.5),
*[(20.6+i*0.14,pop(900+i*120,500+i*60,.07),.35) for i in range(7)],
(21.65,whoosh(.35),.4),(21.85,pop(),.45),(21.9,ding(1319),.45),(22.25,stamp(),.5),(22.3,sparkle(),.4),(23.98,whoosh(.35),.35),(23.16,ding(1397),.45),(24.42,ding(1568),.45),(25.48,ding(1760),.45),(25.5,sparkle(),.45),
(26.12,whoosh(.5,False),.45),(26.3,boing(),.6),(28.48,buzz(),.5),
(29.05,riser(.67),.5),(29.72,impact(),.85),(29.72,sparkle(),.5),(29.9,stamp(),.45),
(30.85,whoosh(.35),.45),(30.92,pop(),.5),(31.06,impact(),.9),(31.06,chime(),.55),(31.1,sparkle(1.0,14),.6),
(31.3,pop(),.45),(31.45,pop(),.45),(32.42,stamp(),.6),(32.9,sparkle(),.45)]

voice_path,out_path,sfx_out=sys.argv[1:4]
w=wave.open(voice_path); assert w.getframerate()==SR
v=np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).astype(np.float32)/32768
if w.getnchannels()==2: v=v.reshape(-1,2).mean(1)
sfx=np.zeros(len(v)+SR)
for t0,s,g in cues:
    st=int(t0*SR); s=s/ (np.abs(s).max()+1e-9) * g; e=min(len(sfx),st+len(s)); sfx[st:e]+=s[:e-st]
sfx=sfx[:len(v)]
SFX_GAIN=0.32
mix=v+sfx*SFX_GAIN
mix=np.tanh(mix*1.1)/np.tanh(1.1)  # soft limit
mix*=0.97/np.abs(mix).max()
def wr(p,x):
    o=wave.open(p,'w');o.setnchannels(1);o.setsampwidth(2);o.setframerate(SR);o.writeframes((np.clip(x,-1,1)*32767).astype(np.int16).tobytes());o.close()
wr(out_path,mix); so=np.tanh(sfx*1.2)/np.tanh(1.2); wr(sfx_out,so*0.9/np.abs(so).max())
print("ok",len(v)/SR, "voice peak",np.abs(v).max(),"sfx peak",np.abs(sfx*SFX_GAIN).max())
