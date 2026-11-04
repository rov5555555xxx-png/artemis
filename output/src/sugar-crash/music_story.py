# Story-arc score: hook suspense -> curious explainer -> tension (problem) -> bright resolution
import numpy as np, wave, sys, json
from scipy.signal import butter, sosfilt
SR=44100; rng=np.random.default_rng(7)
KEEP=json.load(open(sys.argv[2])); DUR=float(sys.argv[3])
def M(t):
    acc=0
    for a,b in KEEP:
        if t<a: return acc
        if t<=b: return acc+t-a
        acc+=b-a
    return acc
HOOK_END=M(3.15); TENSE=M(11.72); RESOLVE=M(39.82)
BPM=104; B=60/BPM; BAR=4*B
N=int((DUR+3)*SR); L=np.zeros(N); R=np.zeros(N)
def T(d): return np.arange(int(d*SR))/SR
def lpf(x,f): return sosfilt(butter(2,f,btype='low',fs=SR,output='sos'),x)
def hpf(x,f): return sosfilt(butter(2,f,btype='high',fs=SR,output='sos'),x)
def m2f(m): return 440*2**((m-69)/12)
def add(s,t0,g=1,pan=0):
    i=int(t0*SR); e=min(N,i+len(s))
    if e<=i or i<0: return
    s=s[:e-i]*g; L[i:e]+=s*np.sqrt((1-pan)/2); R[i:e]+=s*np.sqrt((1+pan)/2)
def pizz(m,d=0.35):
    t=T(d); f=m2f(m); y=sum(np.sin(2*np.pi*f*h*t)/h**1.3*np.exp(-t*(10+h*6)) for h in range(1,7))
    return y*np.minimum(1,t/0.003)
def mallet(m,d=0.6):
    t=T(d); f=m2f(m); return (np.sin(2*np.pi*f*t)*np.exp(-t*7)+0.35*np.sin(2*np.pi*4*f*t)*np.exp(-t*30))*np.minimum(1,t/0.002)
def bassp(m,d=0.45):
    t=T(d); f=m2f(m); return (np.sin(2*np.pi*f*t)+0.3*np.sin(4*np.pi*f*t))*np.minimum(1,t/0.008)*np.exp(-t*4)
def sub(m,d):
    t=T(d); f=m2f(m); return np.sin(2*np.pi*f*t)*np.minimum(1,t/0.02)*np.minimum(1,(d-t)/0.05)
def kick():
    t=T(0.35); f=45+90*np.exp(-t*32); return np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-t*10)
def snap():
    t=T(0.15); return hpf(lpf(rng.standard_normal(len(t)),6000),900)*np.exp(-t*40)
def hat():
    t=T(0.05); return hpf(rng.standard_normal(len(t)),7000)*np.exp(-t*90)
def tick():
    t=T(0.03); return np.sin(2*np.pi*2400*t)*np.exp(-t*200)
def pad(ms,d,bright=0.08):
    t=T(d); y=np.zeros_like(t)
    for m in ms:
        for det in (-0.1,0.1):
            f=m2f(m)*2**(det/12)
            for h in range(1,6): y+=np.sin(2*np.pi*f*h*t+rng.uniform(0,6))/h
    return lpf(y,1800)*np.minimum(1,t/0.5)*np.minimum(1,(d-t)/0.5)*bright
def bell(m,d=1.6):
    t=T(d); f=m2f(m); return sum(a*np.sin(2*np.pi*f*r*t)*np.exp(-t*k) for a,r,k in [(1,1,2),(.4,2,3),(.2,3,5)])*np.minimum(1,t/0.003)
def swell(d):
    t=T(d); n=lpf(rng.standard_normal(len(t)),3000); return n*(t/d)**2.5
# ---------- 1) HOOK: suspense (A minor), ticking clock + low pulse + riser
for k in range(int(HOOK_END/(B/2))+1): add(tick(),k*B/2,0.05 if k%2 else 0.08,0.3)
add(sub(33,HOOK_END+0.2),0,0.16)
add(pad([57,60,64],HOOK_END+0.4,0.05),0)
add(swell(1.0),HOOK_END-1.0,0.05)
# ---------- 2) EXPLAINER: curious pizzicato groove (Am - F - C - G)
prog_curious=[(57,[57,60,64]),(53,[53,57,60]),(48,[52,55,60]),(55,[55,59,62])]
prog_tense=[(57,[57,60,64]),(53,[53,57,60]),(50,[50,53,57]),(52,[52,56,59])]   # Am F Dm E
prog_bright=[(48,[48,52,55]),(55,[55,59,62]),(57,[57,60,64]),(53,[53,57,60])]  # C G Am F
t0=HOOK_END; b=0
while t0<DUR:
    sec='cur' if t0<TENSE else ('ten' if t0<RESOLVE else 'bri')
    prog={'cur':prog_curious,'ten':prog_tense,'bri':prog_bright}[sec]
    root,ch=prog[b%4]
    if sec=='cur':
        pat=[0,2,1,2, 0,2,1,3]
        for k,ix in enumerate(pat): add(pizz(ch[ix%3]+12 if ix<3 else ch[0]+24),t0+k*B/2,0.10,(k%2)*.5-.25)
        add(bassp(root-12),t0,0.22); add(bassp(root-12+7),t0+2*B,0.16)
        for k in range(4):
            if k in(1,3): add(snap(),t0+k*B,0.06,0.2)
        if b%2==1: add(mallet(ch[2]+12),t0+3.5*B,0.05,0.3)
    elif sec=='ten':
        for k in range(8): add(pizz(ch[(k*2)%3]+12),t0+k*B/2,0.09,(k%2)*.5-.25)
        for k in range(4): add(bassp(root-12),t0+k*B,0.2)          # driving quarter-note bass
        for k in range(4): add(kick(),t0+k*B,0.22 if k%2==0 else 0.12)
        for k in range(8): add(hat(),t0+k*B/2,0.03,0.4)
        add(pad([x+12 for x in ch],BAR+0.3,0.035),t0)
    else:
        arp=[ch[0]+12,ch[1]+12,ch[2]+12,ch[1]+24,ch[2]+12,ch[1]+12,ch[0]+24,ch[2]+12]
        for k,m in enumerate(arp): add(mallet(m),t0+k*B/2,0.08,(k%2)*.6-.3)
        add(pad([x+12 for x in ch],BAR+0.4,0.06),t0)
        add(bassp(root-12),t0,0.22); add(bassp(root-12),t0+1.5*B,0.15); add(bassp(root-12+7),t0+2.5*B,0.15)
        for k in range(4):
            if k in(0,2): add(kick(),t0+k*B,0.18)
            if k in(1,3): add(snap(),t0+k*B,0.06)
        mel=[72,76,79,76] if b%2==0 else [74,72,71,72]
        for k,m in enumerate(mel): add(bell(m),t0+k*B,0.03,0.2)
    t0+=BAR; b+=1
# transitions: swell into tension and into resolution
add(swell(1.2),TENSE-1.2,0.035); add(swell(1.4),RESOLVE-1.4,0.045)
mix=np.stack([L,R],1)[:int(DUR*SR)]
f=int(1.5*SR); mix[-f:]*=np.linspace(1,0,f)[:,None]
mix/=np.sqrt((mix**2).mean())+1e-9; mix*=10**(-20/20); mix=np.tanh(mix*1.2)/1.2
o=wave.open(sys.argv[1],'w');o.setnchannels(2);o.setsampwidth(2);o.setframerate(SR);o.writeframes((np.clip(mix,-1,1)*32767).astype(np.int16).tobytes());o.close()
print('sections (cut s): hook->%.2f tense@%.2f resolve@%.2f'%(HOOK_END,TENSE,RESOLVE))
