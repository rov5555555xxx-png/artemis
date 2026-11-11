# Original Edo-flavoured bed: shamisen ostinato (with sawari buzz), koto arpeggios, shakuhachi phrases,
# taiko + shime-daiko pulse, hyoshigi clappers. Miyako-bushi scale on D, 100 BPM.
import numpy as np, wave, sys
from scipy.signal import lfilter, butter, sosfilt
SR=44100; BPM=100; BEAT=60/BPM; BAR=4*BEAT
DUR=float(sys.argv[2]); N=int((DUR+3)*SR); L=np.zeros(N); R=np.zeros(N); rng=np.random.default_rng(21)
m2f=lambda m:440*2**((m-69)/12)
def add(s,t0,pan=0,g=1):
    i=int(t0*SR); e=min(N,i+len(s))
    if e<=i: return
    s=s[:e-i]*g; L[i:e]+=s*np.sqrt((1-pan)/2); R[i:e]+=s*np.sqrt((1+pan)/2)
def ks(f,d,decay=0.996,bright=0.7,buzz=0.0):
    n=int(d*SR); p=max(2,int(SR/f)); b=lfilter([bright],[1,bright-1],rng.uniform(-1,1,p)); out=np.zeros(n)
    for i in range(n):
        out[i]=b[i%p]; b[i%p]=decay*0.5*(b[i%p]+b[(i+1)%p])
    if buzz: out=np.tanh(out*(1+buzz*6))/(1+buzz)+buzz*0.3*np.sign(out)*np.abs(out)**0.5*np.exp(-np.arange(n)/SR*6)
    return out
C={}
def sham(m): 
    if ('s',m) not in C: C[('s',m)]=ks(m2f(m),0.6,0.993,0.9,0.5)*np.exp(-np.arange(int(0.6*SR))/SR*5)
    return C[('s',m)]
def koto(m):
    if ('k',m) not in C: C[('k',m)]=ks(m2f(m),1.6,0.998,0.6)*np.exp(-np.arange(int(1.6*SR))/SR*1.6)
    return C[('k',m)]
def shaku(m,d,slide=-1):
    t=np.arange(int(d*SR))/SR; f=m2f(m)*(2**((slide*np.exp(-t*10))/12))*(1+0.008*np.sin(2*np.pi*5*t)*np.minimum(1,t/0.4))
    y=np.sin(2*np.pi*np.cumsum(f)/SR)+0.15*np.sin(4*np.pi*np.cumsum(f)/SR)
    br=sosfilt(butter(2,[m2f(m)*0.8,m2f(m)*3],btype='band',fs=SR,output='sos'),rng.standard_normal(len(t)))*0.35
    return (y+br)*np.minimum(1,t/0.12)*np.minimum(1,(d-t)/0.25)
def taiko(f=62):
    t=np.arange(int(0.6*SR))/SR; fr=f*(1+0.6*np.exp(-t*30)); y=np.sin(2*np.pi*np.cumsum(fr)/SR)*np.exp(-t*6)
    return y+0.25*sosfilt(butter(2,400,fs=SR,output='sos'),rng.standard_normal(len(t)))*np.exp(-t*25)
def shime():
    t=np.arange(int(0.08*SR))/SR; return (np.sin(2*np.pi*520*t)*0.6+sosfilt(butter(2,[1500,5000],btype='band',fs=SR,output='sos'),rng.standard_normal(len(t))))*np.exp(-t*60)
def hyoshigi():
    t=np.arange(int(0.12*SR))/SR; return (np.sin(2*np.pi*1850*t)+0.6*np.sin(2*np.pi*2730*t))*np.exp(-t*55)
D=62; sc=[0,1,5,7,8]  # D Eb G A Bb
def deg(i): o,k=divmod(i,5); return D+12*o+sc[k]
ost=[[0,3,4,3,2,3,5,3],[0,3,4,5,4,3,2,1],[2,4,5,4,3,4,6,4],[0,3,4,3,2,1,0,-2]]
shak=[(0,[(7,2,-1),(6,1,0),(5,1,-1)]),(4,[(8,1.5,-1),(7,0.5,0),(5,2,-1)]),(8,[(5,1,0),(6,1,0),(7,2,-1)]),(12,[(6,1,0),(5,1,0),(4,2,-2)])]
nb=int(DUR/BAR)+2
for b in range(nb):
    t0=b*BAR; o=ost[b%4]
    for k,d in enumerate(o): add(sham(deg(d)-12),t0+k*BEAT/2,-0.25,0.30 if k%2==0 else 0.22)
    add(taiko(58),t0,0,0.55); add(taiko(58),t0+2.5*BEAT,0,0.35)
    if b%2==1: add(taiko(70),t0+3*BEAT,0,0.35); add(taiko(70),t0+3.5*BEAT,0,0.3)
    for k in range(8): add(shime(),t0+k*BEAT/2,0.35,0.09 if k%2 else 0.13)
    if b%2==0:
        for j,d in enumerate([5,6,7,8,10,8]): add(koto(deg(d)),t0+j*BEAT/3+2*BEAT,0.3,0.15)
    if b%8==0: add(hyoshigi(),t0,0,0.25); add(hyoshigi(),t0+BEAT/2,0,0.2)
    if b>=2:
        ph=(b-2)%16
        for start,notes in shak:
            if ph==start:
                tt=t0
                for d,ln,sl in notes: add(shaku(deg(d),ln*BEAT*0.98,sl),tt,0.1,0.13); tt+=ln*BEAT
mix=np.stack([L,R],1)
# small room
for dl,g in ((0.031,.22),(0.047,.17),(0.071,.12)):
    k=int(dl*SR); mix[k:]+=mix[:-k][:, ::-1]*g
end=int(DUR*SR); fade=int(1.5*SR); mix=mix[:end]; mix[-fade:]*=np.linspace(1,0,fade)[:,None]
mix/=np.sqrt((mix**2).mean())+1e-9; mix*=10**(-20/20); mix=np.tanh(mix*1.2)/1.2
o=wave.open(sys.argv[1],'w');o.setnchannels(2);o.setsampwidth(2);o.setframerate(SR);o.writeframes((np.clip(mix,-1,1)*32767).astype(np.int16).tobytes());o.close()
print('ok')
