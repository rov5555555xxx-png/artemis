import numpy as np
from PIL import Image, ImageFilter
rng=np.random.default_rng(7)
W,H=2880,2160
def noise(w,h,scale,seed):
    r=np.random.default_rng(seed); s=r.random((h//scale+2,w//scale+2))
    im=Image.fromarray((s*255).astype(np.uint8)).resize((w,h),Image.BICUBIC); return np.asarray(im)/255.
# washi
base=np.array([241,230,205],float)
n=noise(W,H,40,1)*0.6+noise(W,H,8,2)*0.4
img=np.ones((H,W,3))*base+(n[...,None]-0.5)*14
# fibres
fib=Image.new('L',(W,H),0)
from PIL import ImageDraw
d=ImageDraw.Draw(fib)
for i in range(2600):
    x,y=rng.random()*W,rng.random()*H; a=rng.random()*np.pi; L=20+rng.random()*90
    pts=[(x+np.cos(a)*t+np.sin(t*0.08)*3,y+np.sin(a)*t) for t in np.linspace(0,L,8)]
    d.line(pts,fill=int(60+rng.random()*80),width=1)
fib=np.asarray(fib.filter(ImageFilter.GaussianBlur(0.8)))/255.
img=img*(1-fib[...,None]*0.10)+np.array([255,250,236])*fib[...,None]*0.10
# specks
sp=rng.random((H,W))>0.9993
img[sp]=img[sp]*0.82
# vignette ageing
yy,xx=np.mgrid[0:H,0:W]; v=((xx/W-.5)**2+(yy/H-.5)**2)
img=img*(1-np.clip(v-0.12,0,1)[...,None]*0.35)
Image.fromarray(np.clip(img,0,255).astype(np.uint8)).save('washi.jpg',quality=92)
# woodgrain overlay (dark lines, alpha)
f=noise(W,H,220,3)*1.0+noise(W,H,60,4)*0.25
g=np.abs(np.sin((yy/H*38+f*9)*np.pi))
lines=np.clip((0.12-g)/0.12,0,1)*0.55
ba=noise(W,H,30,5); lines=lines*(0.5+ba)
a=np.clip(lines*60,0,255).astype(np.uint8)
rgba=np.zeros((H,W,4),np.uint8); rgba[...,:3]=(40,30,20); rgba[...,3]=a
Image.fromarray(rgba).save('grain.png')
# bokashi bands (top-edge gradient with wandering edge), 2880x900
def bok(col,name,h=900):
    xs=np.arange(W); wob=noise(W,1,300,9)[0]*60-30
    y=np.arange(h)[:,None]
    t=np.clip((y-0-wob[None,:]*0)/ (h*0.85+wob[None,:]*2),0,1)
    alpha=(1-t)**1.6
    alpha*= (0.85+0.15*noise(W,h,25,11))
    rg=np.zeros((h,W,4),np.uint8); rg[...,:3]=col; rg[...,3]=np.clip(alpha*255,0,255)
    Image.fromarray(rg).save(name)
bok((32,58,110),'bok_indigo.png'); bok((178,48,40),'bok_beni.png'); bok((40,36,34),'bok_sumi.png')
print('ok')
