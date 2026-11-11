# Original 1930s-flavoured symphonic-jazz bed: stride piano, walking pizz bass, brushes, clarinet melody,
# muted-trumpet stabs, celesta sparkle. F major I-vi-ii-V, 124 BPM swing.
import numpy as np, wave, sys
from scipy.signal import butter, sosfilt
SR=44100; BPM=124; BEAT=60/BPM; BAR=4*BEAT; SW=0.64
DUR=float(sys.argv[2]); N=int((DUR+3)*SR); L=np.zeros(N); R=np.zeros(N); rng=np.random.default_rng(9)
m2f=lambda m:440*2**((m-69)/12)
def add(s,t0,pan=0,g=1):
    i=int(t0*SR); e=min(N,i+len(s))
    if e<=i: return
    s=s[:e-i]*g; L[i:e]+=s*np.sqrt((1-pan)/2); R[i:e]+=s*np.sqrt((1+pan)/2)
T=lambda d:np.arange(int(d*SR))/SR
lp=lambda x,f:sosfilt(butter(2,f,fs=SR,output='sos'),x)
def piano(m,d=0.9):
    t=T(d); f=m2f(m); y=sum(a*np.sin(2*np.pi*f*h*t*(1+0.0004*h))*np.exp(-t*(2.5+h*1.2)) for h,a in ((1,1),(2,.5),(3,.25),(4,.12),(5,.06)))
    return y*np.minimum(1,t/0.003)
def chord(ms,d=0.5): return sum(piano(m,d) for m in ms)/len(ms)*1.6
def pizz(m):
    t=T(0.5); f=m2f(m); return (np.sin(2*np.pi*f*t)+0.4*np.sin(4*np.pi*f*t))*np.exp(-t*7)*np.minimum(1,t/0.005)
def clar(m,d):
    t=T(d); f=m2f(m)*(1+0.005*np.sin(2*np.pi*5.5*t)*np.minimum(1,t/0.3)); ph=2*np.pi*np.cumsum(f)/SR
    y=np.sin(ph)+0.45*np.sin(3*ph)+0.2*np.sin(5*ph)+0.08*np.sin(7*ph)
    return lp(y,3200)*np.minimum(1,t/0.04)*np.minimum(1,(d-t)/0.06)
def trumpet(ms,d=0.22):
    t=T(d); y=sum(((m2f(m)*t)%1*2-1) for m in ms)/len(ms); wah=900+1400*np.sin(np.pi*np.minimum(t/d,1))
    return sosfilt(butter(2,[700,2600],btype='band',fs=SR,output='sos'),y)*np.minimum(1,t/0.01)*np.minimum(1,(d-t)/0.04)
def brush(d=0.25):
    t=T(d); return sosfilt(butter(2,[2500,9000],btype='band',fs=SR,output='sos'),rng.standard_normal(len(t)))*np.sin(np.pi*t/d)**2
def snare():
    t=T(0.14); return sosfilt(butter(2,[1500,7000],btype='band',fs=SR,output='sos'),rng.standard_normal(len(t)))*np.exp(-t*35)
def kick():
    t=T(0.25); return np.sin(2*np.pi*np.cumsum(55+60*np.exp(-t*30))/SR)*np.exp(-t*14)
def cele(m):
    t=T(1.0); return (np.sin(2*np.pi*m2f(m)*t)+0.3*np.sin(2*np.pi*m2f(m)*4*t)*np.exp(-t*8))*np.exp(-t*3.5)
prog=[(41,[57,60,64,65]),(38,[57,60,62,65]),(43,[58,62,65,67]),(36,[58,60,64,67])]  # Fmaj7 Dm7 Gm7 C7
walk=[[41,45,48,50],[38,41,45,46],[43,46,50,49],[36,40,43,40]]
mel=[[(0,72,1),(1,74,.5),(1.5,72,.5),(2,69,1.5)],[(0,77,1),(1,76,.5),(1.5,74,.5),(2,72,1.5)],[(0,70,.5),(.5,72,.5),(1,74,1),(2,77,1),(3,76,.9)],[(0,74,1.5),(1.5,72,.5),(2,70,.5),(2.5,69,1.4)]]
sw=lambda b:(int(b)+(SW if b%1 else 0)) if True else b
nb=int(DUR/BAR)+2
for b in range(nb):
    t0=b*BAR; root,ch=prog[b%4]
    add(piano(root-12,0.6)*0.9,t0,-0.2,0.30); add(piano(root-5,0.6)*0.9,t0+2*BEAT,-0.2,0.26)
    for k in (1,3): add(chord(ch,0.35),t0+k*BEAT,-0.15,0.26)
    for k,m in enumerate(walk[b%4]): add(pizz(m-12),t0+k*BEAT,0.1,0.42)
    for k in range(4): add(brush(0.22),t0+k*BEAT,0.35,0.07); add(brush(0.1),t0+(k+SW)*BEAT,0.35,0.05)
    for k in (1,3): add(snare(),t0+k*BEAT,0.2,0.10)
    add(kick(),t0,0,0.35)
    if b>=1:
        for bt,m,ln in mel[b%4] if (b//4)%2==0 else [(x,m+(5 if i%2 else 0),ln) for i,(x,m,ln) in enumerate(mel[b%4])]:
            bb=int(bt)+(SW if bt%1 else 0); add(clar(m,ln*BEAT*0.95),t0+bb*BEAT,-0.25,0.15)
    if b%2==1: add(trumpet([m+12 for m in ch[:3]],0.18),t0+(3+SW)*BEAT,0.3,0.10)
    if b%4==3: [add(cele(m),t0+3*BEAT+j*0.07,0.4,0.06) for j,m in enumerate([84,88,91,96])]
mix=np.stack([L,R],1)
for dl,g in ((0.023,.2),(0.041,.15),(0.067,.1)):
    k=int(dl*SR); mix[k:]+=mix[:-k][:, ::-1]*g
end=int(DUR*SR); fade=int(1.5*SR); mix=mix[:end]; mix[-fade:]*=np.linspace(1,0,fade)[:,None]
mix/=np.sqrt((mix**2).mean())+1e-9; mix*=10**(-20/20); mix=np.tanh(mix*1.2)/1.2
o=wave.open(sys.argv[1],'w');o.setnchannels(2);o.setsampwidth(2);o.setframerate(SR);o.writeframes((np.clip(mix,-1,1)*32767).astype(np.int16).tobytes());o.close()
print('ok')
