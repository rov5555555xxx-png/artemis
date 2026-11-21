
function bigQ(x,y,s,t,p){if(p<=0)return '';return `<g transform="translate(${x} ${y}) scale(${eOB(cl(p))*s}) rotate(${Math.sin(t*4)*8})"><circle r="70" fill="#F3D9A4" stroke="#7A5B2E" stroke-width="6"/><text y="34" text-anchor="middle" font-family="K" font-weight="900" font-size="100" fill="#16171B">?</text></g>`}
function pellet(cx,cy,R,layers,t,lid){let s=`<defs><radialGradient id="pc${lid}" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#C9CED8"/></radialGradient></defs>`;
 const cols=['#F3D9A4','#E8C88E','#D9B98A','#C9A673','#B8925C'];
 for(let i=cols.length-1;i>=0;i--){const v=layers[i];if(v<=0)continue;const r=R*(0.45+0.11*(i+1));s+=`<circle cx="${cx}" cy="${cy}" r="${r*Math.min(1,v)}" fill="${cols[i]}" stroke="#7A5B2E" stroke-width="3" opacity="${Math.min(1,v)}"/>`}
 s+=`<circle cx="${cx}" cy="${cy}" r="${R*0.45}" fill="url(#pc${lid})" stroke="#7C838F" stroke-width="4"/><text x="${cx}" y="${cy+R*0.15}" text-anchor="middle" font-family="Arial" font-weight="700" font-size="${R*0.38}" fill="#3A3F47">Zn</text>`;
 return s}
function chartZ(lt,blueP,goldP,mark){let s='';const X0=230,Y0=640,W=980,H=420,HM=8;s+=axes(X0,Y0,W,H,HM,'ซิงค์ในร่างกาย',2);
 const N=150;const fast=h=>0.7*Math.pow(h/2,2)*Math.exp(2*(1-h/2)),slow=h=>0.6*(1-Math.exp(-h*1.1))*(h<6?1:Math.exp(-(h-6)*0.3));
 const path=(fn,pr)=>{const n=Math.max(2,Math.floor(N*pr));let d='';for(let i=0;i<=n;i++){const h=HM*i/N;d+=(i?'L':'M')+(X0+W*h/HM).toFixed(1)+' '+(Y0-H*fn(h)).toFixed(1)}return [d,X0+W*n/N]};
 if(blueP>0){const [d]=path(fast,blueP);s+=`<path d="${d}" stroke="#7FA8E0" stroke-width="9" fill="none" stroke-linecap="round"/>`}
 if(goldP>0){const [d,xe]=path(slow,goldP);s+=`<path d="${d} L${xe} ${Y0} L${X0} ${Y0}Z" fill="#F3D9A4" opacity=".18"/><path d="${d}" stroke="#F3D9A4" stroke-width="12" fill="none" stroke-linecap="round"/>`}
 s+=`<text x="1290" y="300" text-anchor="middle" font-family="K" font-weight="900" font-size="26" fill="#7FA8E0">บิสไกลซิเนต</text><text x="1290" y="332" text-anchor="middle" font-family="K" font-weight="900" font-size="26" fill="#7FA8E0">ทั่วไป</text><rect x="1220" y="346" width="140" height="8" rx="4" fill="#7FA8E0"/>`;
 if(goldP>0)s+=jarAt('jar.png',1290,220,100)+`<rect x="1220" y="232" width="140" height="8" rx="4" fill="#F3D9A4"/>`;
 return s}
window.extra=function(t){
 const on=(a,b)=>t>=a-0.05&&t<b+0.45;
 if(on(0,2.6)){const lt=t;$('v1').innerHTML=bigQ(470,230,1,t,1)+bigQ(990,170,0.75,t+1,1)+bigQ(1000,470,0.6,t+2,cl((lt-0.4)/0.3))}
 // S2 bisglycinate molecule + globe
 if(on(2.6,7.0)){const lt=t-2.6;let s='';
  const k=eOB(cl(lt/0.4));s+=`<g transform="translate(470 360) scale(${k})"><circle r="80" fill="url(#zs2)" stroke="#5B616B" stroke-width="5"/><defs><radialGradient id="zs2" cx=".35" cy=".3" r=".85"><stop offset="0" stop-color="#fff"/><stop offset=".55" stop-color="#C9CED8"/><stop offset="1" stop-color="#7C838F"/></radialGradient></defs><text y="26" text-anchor="middle" font-family="Arial" font-weight="700" font-size="72" fill="#3A3F47">Zn</text>`;
  [[-210,0],[210,0]].forEach(([gx,gy],i)=>{const p=cl((lt-0.4-i*0.2)/0.35);s+=`<path d="M${gx*0.38} 0 L${gx*0.62} 0" stroke="#F3D9A4" stroke-width="10" opacity="${p}"/><g transform="translate(${gx} ${gy}) scale(${eOB(p)})"><circle r="70" fill="#2EC4B6" stroke="#fff" stroke-width="5"/><text y="14" text-anchor="middle" font-family="K" font-weight="900" font-size="34" fill="#0B2240">ไกลซีน</text></g>`});
  s+=`</g>`+pill(470,520,'Zinc Bisglycinate',cl((lt-0.9)/0.3),'#F3D9A4','#16171B',40)+check(640,250,40,cl((lt-1.6)/0.3));
  if(lt>2.9){const g=cl((lt-2.9)/0.4);s+=`<g transform="translate(1080 360) scale(${eOB(g)})"><circle r="140" fill="#1F4E79" stroke="#7FD6F0" stroke-width="6"/><path d="M-140 0 H140 M0 -140 V140" stroke="#7FD6F0" stroke-width="4" opacity=".6"/><ellipse rx="70" ry="140" fill="none" stroke="#7FD6F0" stroke-width="4" opacity=".6"/><ellipse rx="140" ry="60" fill="none" stroke="#7FD6F0" stroke-width="4" opacity=".6"/><path d="M-70 -60 q30 -20 60 0 q20 30 -10 50 q-40 10 -50 -50Z M30 20 q40 -10 60 20 q-10 40 -50 30Z" fill="#6BBF59"/></g>`+pill(1080,540,'นิยมในต่างประเทศ',g,'#16171B','#7FD6F0',34)}
  $('v2').innerHTML=s}
 // S3 coating layers grow
 if(on(7.0,9.2)){const lt=t-7.0;const L=[0,1,2,3,4].map(i=>eOC(cl((lt-0.4-i*0.25)/0.3)));
  let s=pellet(720,360,240,L,t,'3');s+=pill(1120,240,'เคลือบหลายชั้น',cl((lt-1.0)/0.3),'#F3D9A4','#16171B',38)+pill(1120,480,'ชะลอการปลดปล่อย',cl((lt-1.6)/0.3),'#16171B','#F3D9A4',34);
  $('v3').innerHTML=s}
 if(on(9.2,10.6)){$('v4').innerHTML=bigQ(720,330,2.2,t,cl((t-9.2)/0.35))}
 // S5 fast absorb chart (blue only)
 if(on(10.6,16.1)){const lt=t-10.6;let s=chartZ(lt,eIO(cl((lt-0.2)/(lt<3.8?1.5:4.5))),0);
  const pk=cl((lt-1.7)/0.3);if(pk>0){const x=230+980*2/8,y=640-420*0.7;s+=`<circle cx="${x}" cy="${y}" r="16" fill="#fff" stroke="#7FA8E0" stroke-width="6" opacity="${pk}"/>`+pill(x,y-60,'สูงสุดที่ 2 ชม.',pk,'#7FA8E0','#0B2240',34)}
  if(lt>3.8){const k=cl((lt-3.9)/0.3);s+=`<path d="M560 330 Q800 420 1100 580" stroke="#FF6B6E" stroke-width="10" fill="none" stroke-dasharray="20 14" opacity="${k}"/><path d="M1080 540 L1112 590 L1050 590Z" fill="#FF6B6E" opacity="${k}"/>`}
  $('v5').innerHTML=s}
 // S6 layers dissolve, zinc released slowly
 if(on(16.1,21.0)){const lt=t-16.1;const hr=6*cl((lt-0.4)/4.0);const L=[0,1,2,3,4].map(i=>{const st=(4-i)*1.3;return 1-cl((hr-st)/1.3)});
  let s=pellet(560,360,230,L,t,'6');
  let k=9;const rr=()=>{k=(k*16807)%2147483647;return (k-1)/2147483646};
  for(let i=0;i<26;i++){const st=rr()*6,p=cl((hr-st)/1.4);if(p<=0||p>=1)continue;const a=rr()*6.28;const x=560+Math.cos(a)*(240+p*280),y=360+Math.sin(a)*(200+p*160);s+=`<circle cx="${x}" cy="${y}" r="12" fill="#D5DAE2" stroke="#7C838F" stroke-width="3" opacity="${1-p}"/>`}
  s+=`<g transform="translate(1110 330)"><circle r="120" fill="#16171B" stroke="#D9B98A" stroke-width="6"/><text y="-20" text-anchor="middle" font-family="K" font-weight="800" font-size="30" fill="#C9CED8">ชั่วโมงที่</text><text y="56" text-anchor="middle" font-family="K" font-weight="900" font-size="90" fill="#F3D9A4">${hr.toFixed(0)}</text></g>`;
  s+=pill(1110,510,'ค่อยๆ ปล่อยทีละชั้น',cl((lt-2.6)/0.3),'#F3D9A4','#16171B',32);
  $('v6').innerHTML=s}
 // S7 chart gold steady 6 h
 if(on(21.0,31.0)){const lt=t-21.0;let s=chartZ(lt,1,eIO(cl((lt-0.2)/1.6)));
  if(lt>3.7){const k=cl((lt-3.7)/0.3);const x=230+980*6/8,y=640-420*0.6;s+=`<path d="M${x} ${y-30} V640" stroke="#F3D9A4" stroke-width="5" stroke-dasharray="12 9" opacity="${k}"/>`+pill(x,y-70,'6 ชม.',k,'#F3D9A4','#16171B',44)}
  if(lt>7.0){const k=cl((lt-7.0)/0.3);const y=640-420*0.6-26;s+=`<path d="M${230+980*1.6/8} ${y} H${230+980*6/8}" stroke="#2EC4B6" stroke-width="8" opacity="${k}"/><path d="M${230+980*1.6/8} ${y-16} V${y+16} M${230+980*6/8} ${y-16} V${y+16}" stroke="#2EC4B6" stroke-width="8" opacity="${k}"/>`+pill(230+980*3.8/8,y-46,'แทบไม่ลด',k,'#2EC4B6','#0B2240',34)}
  s+=focus(7,700,350,330,110,(lt-8.6)/0.3);
  $('v7').innerHTML=s}
 // S8 made in Thailand
 if(on(31.0,34.0)){const lt=t-31.0;let s='';const p=cl((lt-1.5)/0.35);
  if(p>0){const k=eOB(p);s+=`<g transform="translate(1000 330) scale(${k})"><path d="M-170 120 V-20 L-90 -70 V-20 L-10 -70 V-20 L70 -70 V-130 H120 V120Z" fill="#2A2D35" stroke="#D9B98A" stroke-width="6"/><rect x="-140" y="30" width="50" height="50" fill="#F3D9A4"/><rect x="-60" y="30" width="50" height="50" fill="#F3D9A4"/><rect x="20" y="30" width="50" height="50" fill="#F3D9A4"/><g transform="translate(150 -150)"><rect x="0" y="0" width="120" height="80" fill="#fff" stroke="#16171B" stroke-width="2"/><rect y="0" width="120" height="13" fill="#E5484D"/><rect y="67" width="120" height="13" fill="#E5484D"/><rect y="27" width="120" height="26" fill="#2B3A8C"/><path d="M0 0 V170" stroke="#C9CED8" stroke-width="6"/></g></g>`+pill(1000,520,'ผลิตในไทย โรงงานไทย',p,'#F3D9A4','#16171B',38)}
  if(lt<1.5)s+=sparkle(560,170,1.2,(lt%0.8)/0.4)+sparkle(380,420,1,((lt+0.3)%0.8)/0.4);
  $('v8').innerHTML=s}
 // S6 exploded capsule
 if(on(34.0,37.85)){const lt=t-34.0;let s='';const e=eOC(cl((lt-0.3)/0.6));
  const cx=1000,cy=330;
  s+=`<g transform="translate(${cx} ${cy-80-e*70}) rotate(${-20*e})"><path d="M-80 60 V-10 A80 80 0 0 1 80 -10 V60Z" fill="rgba(255,255,255,.18)" stroke="#fff" stroke-width="5"/></g>`;
  s+=`<g transform="translate(${cx} ${cy+80+e*70}) rotate(${15*e})"><path d="M-84 -60 V20 A84 84 0 0 0 84 20 V-60Z" fill="#F4EFE4" stroke="#B9AF9B" stroke-width="5"/><text y="20" text-anchor="middle" font-family="Arial" font-weight="700" font-size="36" fill="#4A4A4A">Zn</text></g>`;
  let k=5;const rr=()=>{k=(k*16807)%2147483647;return (k-1)/2147483646};
  for(let i=0;i<34;i++){const a=rr()*6.28,d=40+rr()*220*e,r=10+rr()*8;const x=cx+Math.cos(a)*d*1.3,y=cy+Math.sin(a)*d*0.7;s+=`<circle cx="${x}" cy="${y}" r="${r}" fill="url(#gPl6)" stroke="#BFB6A3" stroke-width="1.5"/>`}
  s=`<defs><radialGradient id="gPl6" cx=".35" cy=".3" r=".75"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".55" stop-color="#F3EEE3"/><stop offset="1" stop-color="#BFB6A3"/></radialGradient></defs>`+s;
  s+=pill(1000,620,'Pellet Technology',cl((lt-0.8)/0.3),'#F3D9A4','#16171B',40);
  
  $('v9').innerHTML=s}
 // S10 level up
 if(on(37.85,42.95)){const lt=t-37.85;let s='';
  const st=(x,y,w,h,col,p)=>p<=0?'':`<g opacity="${cl(p)}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" fill="${col}"/></g>`;
  s+=st(230,520,420,120,'#2A2D35',cl((lt-0.1)/0.3))+st(790,360,420,280,'#3A3D44',cl((lt-2.1)/0.3));
  s+=`<g opacity="${cl((lt-0.2)/0.3)}">${jarAt('jar.png',340,510,0.001)}</g>`;
  const p1=cl((lt-0.3)/0.35);if(p1>0)s+=`<g transform="translate(440 430) scale(${eOB(p1)})"><circle r="80" fill="#16171B" stroke="#2EC4B6" stroke-width="6"/><path d="M0 -40 V24 M-26 0 L0 28 L26 0" stroke="#2EC4B6" stroke-width="12" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>`+pill(440,580,'ดูดซึมดี',p1,'#2EC4B6','#0B2240',36);
  const a=cl((lt-1.6)/0.4);if(a>0)s+=`<path d="M560 400 Q680 260 820 280" stroke="#F3D9A4" stroke-width="14" fill="none" stroke-dasharray="${400*a} 400"/><path d="M810 250 L860 285 L805 315Z" fill="#F3D9A4" opacity="${cl((a-0.8)/0.2)}"/>`;
  const p2=cl((lt-2.2)/0.35);if(p2>0)s+=`<g transform="translate(1000 270) scale(${eOB(p2)})"><circle r="90" fill="#16171B" stroke="#F3D9A4" stroke-width="6"/><path d="M0 0 V-46 M0 0 H34" stroke="#F3D9A4" stroke-width="10" stroke-linecap="round"/><circle r="8" fill="#F3D9A4"/></g>`+pill(1000,430,'+ อยู่ได้นานขึ้น',p2,'#F3D9A4','#16171B',38)+pill(1000,520,'iCAP',p2,'#16171B','#F3D9A4',40);
  s+=focus(10,1000,400,230,230,(lt-3.3)/0.3);
  $('v10').innerHTML=s}
 // S11 basket CTA
 if(on(42.95,46.4)){const lt=t-42.95;let s='';const p=cl((lt-1.9)/0.35);
  if(p>0){const k=eOB(p),b=Math.sin(t*6)*8;s+=`<g transform="translate(1000 ${330+b}) scale(${k})"><path d="M-130 -60 H130 L100 90 H-100Z" fill="#FFD23F" stroke="#16171B" stroke-width="8" stroke-linejoin="round"/><path d="M-80 -60 Q-80 -150 0 -150 Q80 -150 80 -60" fill="none" stroke="#16171B" stroke-width="12"/><path d="M-60 -20 V60 M0 -20 V60 M60 -20 V60" stroke="#16171B" stroke-width="7"/></g>`;
   s+=`<g transform="translate(1000 ${560+Math.abs(Math.sin(t*5))*20})"><path d="M-40 -40 H40 V0 H70 L0 70 L-70 0 H-40Z" fill="#F3D9A4" stroke="#7A5B2E" stroke-width="5"/></g>`}
  else s+=sparkle(980,300,1.4,(lt%0.9)/0.45);
  $('v11').innerHTML=s}
 // S12 new
 if(on(46.4,99)){const lt=t-46.4;const k=eOB(cl((lt-0.3)/0.35));
  $('v12').innerHTML=`<g transform="translate(1000 170) scale(${k}) rotate(${Math.sin(t*4)*6})"><polygon points="${[...Array(24)].map((_,i)=>{const a=i/24*6.283,r=i%2?0.78:1;return (Math.cos(a)*130*r).toFixed(0)+','+(Math.sin(a)*90*r).toFixed(0)}).join(' ')}" fill="#E5484D" stroke="#fff" stroke-width="7"/><text y="22" text-anchor="middle" font-family="K" font-weight="900" font-size="66" fill="#fff">NEW!</text></g>`+sparkle(450,200,1.3,(lt%1)/0.5)+sparkle(1060,520,1.1,((lt+0.4)%1)/0.5)+sparkle(400,520,1,((lt+0.7)%1)/0.5)}
};
