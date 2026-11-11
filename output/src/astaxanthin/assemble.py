import re,sys
T=open('/home/user/artemis/.claude/skills/thai-product-clip/templates/bright_4x3_template.html').read()
S=open('scenes.html').read()
a=T.index('<!-- S1'); b=T.index('<div id="rings">')
T=T[:a]+S+T[b:]
css='''.night{background:radial-gradient(circle at 50% 45%,#7A55B0 0%,#4A2F7A 50%,#2A1A4A 100%)}
.spot{border-radius:50%;background:radial-gradient(circle,rgba(255,236,190,.6),rgba(255,236,190,0) 65%)}
.bt{background-image:url(bottle.png)}
.sil{background-image:url(bottle.png);filter:brightness(0) drop-shadow(0 0 3px #fff) drop-shadow(0 0 22px rgba(255,220,150,.8))}
.badge{width:100%;height:100%;border-radius:50%;border:10px solid #1B2A4A;box-shadow:0 12px 0 #1B2A4A;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;line-height:.95}
.badge b{font-weight:900;-webkit-text-stroke:10px #1B2A4A;paint-order:stroke fill}.badge i{font-style:normal;font-weight:900;font-size:64px;-webkit-text-stroke:8px #1B2A4A;paint-order:stroke fill}
.logo{font-weight:900;font-size:110px;color:#FF5A6E;-webkit-text-stroke:12px #1B2A4A;paint-order:stroke fill;text-align:center;line-height:1.2;text-shadow:0 10px 0 #1B2A4A}
.med{width:210px;height:210px;border-radius:50%;border:9px solid #1B2A4A;box-shadow:0 10px 0 #1B2A4A;display:flex;align-items:center;justify-content:center}
.m0{background:#E3E6EE}.m0 b{font-size:110px;font-weight:900;color:#B0B7C6}
.m1{width:270px;height:270px;background:radial-gradient(circle at 35% 30%,#FFF6C8,#FFD23F 55%,#E0A32E)}
.cell{position:absolute;width:80px;height:68px;border-radius:14px;background:#FFF0F3;border:4px solid #F3C6D0;font-weight:800;font-size:30px;color:#C49AA6;text-align:center;line-height:60px}
.cell svg{position:absolute;left:4px;top:2px;width:64px;height:56px}
.rad{position:absolute;width:90px;height:90px;margin:-45px 0 0 -45px}
'''
T=T.replace('</style>',css+'</style>',1)
sym='''<symbol id="gel" viewBox="0 0 150 120"><ellipse cx="75" cy="62" rx="68" ry="50" fill="#9E1F2A" stroke="#1B2A4A" stroke-width="7"/><ellipse cx="75" cy="62" rx="54" ry="38" fill="#C8323E"/><ellipse cx="52" cy="40" rx="24" ry="11" fill="#fff" opacity=".75" transform="rotate(-18 52 40)"/></symbol>
<symbol id="coin" viewBox="0 0 100 100"><circle cx="50" cy="50" r="44" fill="#FFD23F" stroke="#1B2A4A" stroke-width="7"/><circle cx="50" cy="50" r="30" fill="none" stroke="#E0A32E" stroke-width="5"/><text x="50" y="66" text-anchor="middle" font-family="K" font-weight="900" font-size="44" fill="#1B2A4A">฿</text></symbol>
<symbol id="sun" viewBox="0 0 200 200"><g stroke="#1B2A4A" stroke-width="6" fill="#FFB020"><path d="M100 4l12 30h-24zM100 196l12-30H88zM4 100l30-12v24zM196 100l-30-12v24zM32 32l30 12-17 17zM168 168l-30-12 17-17zM168 32l-12 30-17-17zM32 168l12-30 17 17z"/></g><circle cx="100" cy="100" r="56" fill="#FFD23F" stroke="#1B2A4A" stroke-width="7"/><circle cx="82" cy="94" r="7" fill="#1B2A4A"/><circle cx="118" cy="94" r="7" fill="#1B2A4A"/><path d="M80 116q20 18 40 0" stroke="#1B2A4A" stroke-width="6" fill="none" stroke-linecap="round"/></symbol>
<symbol id="factory" viewBox="0 0 460 420"><path d="M30 390V190l110-70v70l110-70v70l110-70V390z" fill="#fff" stroke="#1B2A4A" stroke-width="9" stroke-linejoin="round"/><rect x="370" y="60" width="50" height="330" fill="#FF8FB1" stroke="#1B2A4A" stroke-width="9"/><g fill="#7FD3FF" stroke="#1B2A4A" stroke-width="6"><rect x="70" y="250" width="60" height="50" rx="6"/><rect x="170" y="250" width="60" height="50" rx="6"/><rect x="270" y="250" width="60" height="50" rx="6"/></g><rect x="160" y="320" width="80" height="70" fill="#FFD23F" stroke="#1B2A4A" stroke-width="6"/><path d="M10 392H450" stroke="#1B2A4A" stroke-width="10" stroke-linecap="round"/><circle cx="410" cy="30" r="22" fill="#fff" opacity=".9"/><circle cx="440" cy="10" r="14" fill="#fff" opacity=".8"/></symbol>
<symbol id="check" viewBox="0 0 100 100"><circle cx="50" cy="50" r="44" fill="#3DDC97" stroke="#1B2A4A" stroke-width="7"/><path d="M28 52l15 15 30-32" stroke="#fff" stroke-width="11" fill="none" stroke-linecap="round" stroke-linejoin="round"/></symbol>
<symbol id="shield" viewBox="0 0 360 420"><path d="M180 14l150 50v120c0 110-70 180-150 220C100 364 30 294 30 184V64z" fill="#7FD3FF" stroke="#1B2A4A" stroke-width="10" stroke-linejoin="round"/><path d="M180 50l114 38v96c0 88-52 144-114 178-62-34-114-90-114-178V88z" fill="#BFE8FF"/><g transform="translate(105 150)"><use href="#gel" width="150" height="120"/></g></symbol>
<symbol id="spark" viewBox="0 0 100 100"><path d="M50 2q7 41 48 48-41 7-48 48-7-41-48-48 41-7 48-48z" fill="#FFF6B0" stroke="#1B2A4A" stroke-width="5" stroke-linejoin="round"/></symbol>
<symbol id="cart" viewBox="0 0 230 200"><path d="M10 30h40l30 110h110l25-80H64" fill="none" stroke="#1B2A4A" stroke-width="22" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 30h40l30 110h110l25-80H64" fill="none" stroke="#FF5A6E" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/><path d="M80 70h125l-18 58H96z" fill="#FFD23F" stroke="#1B2A4A" stroke-width="7" stroke-linejoin="round"/><circle cx="95" cy="176" r="18" fill="#fff" stroke="#1B2A4A" stroke-width="8"/><circle cx="180" cy="176" r="18" fill="#fff" stroke="#1B2A4A" stroke-width="8"/></symbol>
<symbol id="pin" viewBox="0 0 170 230"><path d="M85 222C40 160 12 120 12 82a73 73 0 01146 0c0 38-28 78-73 140z" fill="#FF5A6E" stroke="#1B2A4A" stroke-width="10" stroke-linejoin="round"/><circle cx="85" cy="82" r="30" fill="#fff" stroke="#1B2A4A" stroke-width="8"/></symbol>
</defs>'''
T=T.replace('</defs></svg>\n</div>',sym+'</svg>\n</div>',1) if '</defs></svg>\n</div>' in T else T.replace('</defs>',sym,1)
T=re.sub(r'const ringDefs=\[.*?\];','const ringDefs=[[5.6,720,520],[10.2,1120,410],[14.12,720,465],[21.4,720,790],[30.3,415,585],[37.7,1030,410],[47.82,1075,420],[51.78,720,790]];',T)
T=T.replace("const d=t-50.0-c.dl","const d=t-51.78-c.dl")
T=T.replace("  else if(k.fx==='drop')","  else if(k.fx==='instant'){const p=cl(lt/0.35);tr=`scale(${1.1-0.1*eOB(p)})`}\n  else if(k.fx==='drop')",1)
init='''
const XC=[];{const g=$('crowd3');if(g){const cols=['#FF8FB1','#7FD3FF','#3DDC97','#FFD23F','#FFB36B','#B8B0C8'];let i=0;for(let r=0;r<2;r++)for(let c=0;c<22;c++){const e=document.createElementNS(NS,'g');const x=30+c*53+(r%2)*26,y=36+r*52;
 e.innerHTML=`<path d="M-20 26a20 20 0 0140 0z" fill="${cols[(i*7)%6]}" stroke="${INK}" stroke-width="3"/><circle r="15" fill="#FFD7B5" stroke="${INK}" stroke-width="3"/><circle cx="-5" cy="-2" r="2.4" fill="${INK}"/><circle cx="5" cy="-2" r="2.4" fill="${INK}"/><path d="M-5 6q5 4 10 0" stroke="${INK}" stroke-width="2.4" fill="none"/>`;g.appendChild(e);XC.push({e,x,y,t:15.95+i*0.018});i++}}}
const CAL=[];{const c=$('cal10');for(let i=0;i<30;i++){const d=document.createElement('div');d.className='cell';d.style.left=(14+(i%6)*88)+'px';d.style.top=(12+Math.floor(i/6)*80)+'px';d.innerHTML=`${i+1}<svg viewBox="0 0 150 120" style="opacity:0"><use href="#gel"/></svg>`;c.appendChild(d);CAL.push({g:d.querySelector('svg'),t:50.3+i*0.055})}}
const RAD=[];{const w=$('rad7');for(let i=0;i<6;i++){const d=document.createElement('div');d.className='rad';d.style.left='0px';d.style.top='0px';
 d.innerHTML=`<svg viewBox="-50 -50 100 100" width="90" height="90"><path d="M0-44l10 22 24-10-8 24 24 10-24 8 8 24-24-8-10 22-10-22-24 8 8-24-24-8 24-10-8-24 24 10z" fill="#8E5BD6" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><circle cx="-9" cy="-4" r="5" fill="${INK}"/><circle cx="9" cy="-4" r="5" fill="${INK}"/><path d="M-10 12q10-8 20 0" stroke="${INK}" stroke-width="4" fill="none"/></svg>`;w.appendChild(d);RAD.push({d,t0:37.85+i*0.22,y:260+((i*137)%300),s:i%2?1:-1})}}
scenes.forEach(sc=>sc.items=[...sc.el.querySelectorAll('.a')]);
'''
T=T.replace('const ringDefs=',init+'const ringDefs=',1)
rend='''
 if(t<6.4&&$('box1')){const k=Math.min(1,t/5.4);$('box1').style.transform=`rotate(${Math.sin(t*(14+10*k))*(2+4*k)}deg) translateY(${-Math.abs(Math.sin(t*7))*(6+14*k)}px)`;
  const d=t-5.35;$('lid1').style.transform=d>0?`translate(${d*300}px,${-d*1400+d*d*900}px) rotate(${d*260}deg)`:'';}
 if(t<6.5&&$('mag1'))$('mag1').style.transform=`translate(${-230+Math.sin(t*2.2)*150}px,${Math.cos(t*3.1)*45}px)`;
 if(t>=6.3&&t<9.2)$('cnt2').textContent=Math.round(60*eOC(cl((t-8.35)/0.8)));
 if(t>=12.5&&t<17.4){const k=t>14.5?1+0.05*Math.sin((t-14.5)*7):1;$('gold3').style.transform=`scale(${k})`;XC.forEach(c=>{const k=cl((t-c.t)/0.3);c.e.setAttribute('transform',`translate(${c.x} ${c.y+Math.sin(t*6+c.x)*3}) scale(${k?eOB(k):0})`)})}
 if(t>=22&&t<24.6){const h=190*eOC(cl((t-22.95)/1.1));$('therm4').setAttribute('y',230-h);$('therm4').setAttribute('height',h+20*(h>0))}
 if(t>=24&&t<31){const ha=150*eOC(cl((t-24.9)/0.7)),hb=330*eOB(cl((t-25.8)/0.9));$('bar5a').setAttribute('y',460-ha);$('bar5a').setAttribute('height',ha);$('bar5b').setAttribute('y',460-hb);$('bar5b').setAttribute('height',Math.max(0,hb));
  $('arr5').setAttribute('opacity',t>26.5?1:0);$('arr5').setAttribute('transform',`translate(0 ${-Math.abs(Math.sin(t*4))*14})`)}
 if(t>=33&&t<35.5)$('wind6').style.transform=`translateX(${Math.sin(t*3)*18}px)`;
 if(t>=35&&t<39.8)for(const r of RAD){const d=t-r.t0;if(d<0||d>1.4){r.d.style.opacity=0;continue}let x,y;if(d<0.35){x=1360-330*(d/0.35);y=r.y+(410-r.y)*0.3*(d/0.35)}else{const e=d-0.35;x=1030+e*700;y=r.y+(410-r.y)*0.3+r.s*e*520}
  r.d.style.opacity=cl((1.4-d)/0.3);r.d.style.transform=`translate(${x}px,${y}px) rotate(${d*400*r.s}deg)`}
 if(t>=49.9)CAL.forEach(c=>{const k=cl((t-c.t)/0.25);c.g.style.opacity=k?1:0;c.g.style.transform=`scale(${k?eOB(k):0})`;c.g.style.transformOrigin='50% 50%'});
'''
T=T.replace(" CROWD.forEach(",rend+" CROWD.forEach(",1)
open('page.html','w').write(T)
print(len(T))
