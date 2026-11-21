# Product cutout with rembg. usage: python3 -I cut.py <image> <x0,y0,x1,y1 crop box in pixels> <out.png>
import sys
from PIL import Image
from rembg import remove, new_session
s=new_session("isnet-general-use")
src,box,out=sys.argv[1],tuple(map(int,sys.argv[2].split(','))),sys.argv[3]
im=Image.open(src).convert("RGB").crop(box)
r=remove(im,session=s,post_process_mask=True)
r=r.crop(r.getbbox()); r.save(out); print(out,r.size)
