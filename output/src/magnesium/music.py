import numpy as np, wave, sys
SR=44100; BPM=92; BEAT=60/BPM; BAR=4*BEAT
DUR=float(sys.argv[2]) if len(sys.argv)>2 else 34.0
N=int((DUR+3)*SR); L=np.zeros(N); R=np.zeros(N)
rng=np.random.default_rng(11)
def m2f(m): return 440*2**((m-69)/12)
def add(sig,t0,pan=0.0,g=1.0):
    i=int(t0*SR); e=min(N,i+len(sig)); 
    if e<=i: return
    s=sig[:e-i]*g; L[i:e]+=s*np.sqrt((1-pan)/2); R[i:e]+=s*np.sqrt((1+pan)/2)
def T(d): return np.arange(int(d*SR))/SR
def lp(x,a):
    # simple one-pole lowpass via cumulative (vectorized approx using lfilter-like loop on chunks)
    from scipy.signal import lfilter
    return lfilter([a],[1,a-1],x)
def hp(x,a): return x-lp(x,a)
def ep(m,d,vel=1):
    t=T(d+1.2); f=m2f(m)
    y=np.sin(2*np.pi*f*t)+0.35*np.sin(2*np.pi*2*f*t)*np.exp(-t*4)+0.1*np.sin(2*np.pi*3*f*t)*np.exp(-t*8)
    env=np.minimum(1,t/0.006)*np.exp(-t*1.1); rel=np.clip((d+1.2-t)/1.2,0,1)
    return y*env*rel*(1+0.12*np.sin(2*np.pi*4.5*t))*vel
def pad(ms,d):
    t=T(d); y=np.zeros_like(t)
    for m in ms:
        f=m2f(m)
        for det in (-0.12,0,0.11):
            ff=f*2**(det/12)
            for h in range(1,6): y+=np.sin(2*np.pi*ff*h*t+rng.uniform(0,6))/h
    env=np.minimum(1,t/0.8)*np.minimum(1,(d-t)/0.8)
    return lp(y,0.08)*env
def bass(m,d):
    t=T(d); f=m2f(m); y=np.sin(2*np.pi*f*t)+0.25*np.sin(2*np.pi*2*f*t)
    return y*np.minimum(1,t/0.01)*np.exp(-t*2.2)*np.clip((d-t)/0.05,0,1)
def kick():
    t=T(0.4); f=45+80*np.exp(-t*30); return np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-t*9)
def snap():
    t=T(0.18); n=rng.standard_normal(len(t)); y=hp(lp(n,0.5),0.15)*np.exp(-t*38)+0.25*np.sin(2*np.pi*1900*t)*np.exp(-t*60)
    return y
def shaker(acc):
    t=T(0.08); n=hp(rng.standard_normal(len(t)),0.6); return n*np.exp(-t*(55 if acc else 80))*(1 if acc else .55)
def mallet(m,d=0.9):
    t=T(d); f=m2f(m); y=np.sin(2*np.pi*f*t)*np.exp(-t*5)+0.4*np.sin(2*np.pi*4*f*t)*np.exp(-t*22)+0.15*np.sin(2*np.pi*10*f*t)*np.exp(-t*40)
    return y*np.minimum(1,t/0.002)
def bell(m,d=2.0):
    t=T(d); f=m2f(m); y=sum(a*np.sin(2*np.pi*f*r*t)*np.exp(-t*k) for a,r,k in [(1,1,1.6),(.5,2.0,2.5),(.3,3.01,4),(.2,4.2,6)])
    return y*np.minimum(1,t/0.003)

# F major: Fmaj7, Am7, Dm7, Bbmaj7
chords=[[53,57,60,64],[57,60,64,67],[50,53,57,60],[46,50,53,57]]
roots=[41,45,38,46-12+12]  # F2 A2 D2 Bb2
roots=[41,45,38,46]
nbars=int(np.ceil((DUR+1)/BAR))
for b in range(nbars):
    t0=b*BAR; c=chords[b%4]; r=roots[b%4]
    last = (t0>=30.0)
    # pad always
    add(pad([x+12 for x in c],BAR+0.9),t0,0,0.035 if b>0 else 0.045)
    # mallet arpeggio (8ths) all bars, softer in bar0
    arp=[c[0]+24,c[1]+24,c[2]+24,c[3]+24,c[2]+24,c[1]+24,c[3]+12,c[2]+24]
    if not last:
        for k,m in enumerate(arp):
            add(mallet(m),t0+k*BEAT/2,0.35 if k%2 else -0.35,(0.10 if b>0 else 0.07)*(1 if k%2==0 else .8))
    if b>=1:
        # EP chord stabs: beat1 and the "and" of 2
        for st,du in ((0,1.4*BEAT),(1.5*BEAT,1.2*BEAT),(3*BEAT,0.9*BEAT)):
            if last and st>0: continue
            for j,m in enumerate(c): add(ep(m+12,du),t0+st,(j-1.5)*0.2,0.07)
        # bass
        if not last:
            for st,du in ((0,1.4*BEAT),(1.5*BEAT,BEAT),(2.5*BEAT,1.4*BEAT)):
                add(bass(r if st!=2.5*BEAT else r+7,du),t0+st,0,0.28)
        else: add(bass(r,3.0),t0,0,0.28)
    if b>=2 and not last:
        for bt in range(4):
            if bt in (0,2): add(kick(),t0+bt*BEAT,0,0.42)
            if bt in (1,3): add(snap(),t0+bt*BEAT,0.1,0.10)
        for k in range(8): add(shaker(k%2==1),t0+k*BEAT/2,0.5,0.05)
        if b%4==3: add(kick(),t0+3.5*BEAT,0,0.25)
    # bell melody in later bars
    if b in (4,5,8,9):
        mel=[72,76,74,69] if b%2==0 else [77,76,72,74]
        for k,m in enumerate(mel): add(bell(m),t0+k*BEAT,0.2*(-1)**k,0.035)
# final chord ring
fin=30.0+ (BAR - (30.0%BAR))%BAR
# risers (noise swells) before 5.2 and 26.1
def swell(d):
    t=T(d); x=rng.standard_normal(len(t)); y=np.zeros_like(x); a=np.linspace(0.01,0.25,len(t)); s=0.0
    for i in range(len(x)): s+=a[i]*(x[i]-s); y[i]=s
    return y*(t/d)**2
add(swell(1.6),2*BAR-1.6,0,0.025)
# fade out end
mix=np.stack([L,R],1)
end=int(DUR*SR); fade=int(1.6*SR)
mix[end-fade:end]*=np.linspace(1,0,fade)[:,None]; mix=mix[:end]
mix/= np.sqrt((mix**2).mean())+1e-9; mix*=10**(-20/20)
mix=np.tanh(mix*1.2)/1.2
o=wave.open(sys.argv[1],'w');o.setnchannels(2);o.setsampwidth(2);o.setframerate(SR)
o.writeframes((np.clip(mix,-1,1)*32767).astype(np.int16).tobytes());o.close()
print('music ok',mix.shape[0]/SR,'peak',np.abs(mix).max())
