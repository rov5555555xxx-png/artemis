
function chart2(lt,sp){let s='';const X0=230,Y0=640,W=980,H=420,HM=8;s+=axes(X0,Y0,W,H,HM,'ซิงค์ในร่างกาย',2);
 const pr=cl((lt-0.1)/sp),N=150,n=Math.max(2,Math.floor(N*pr));
 const old=h=>0.66*Math.pow(h/2.4,2)*Math.exp(2*(1-h/2.4)),ic=h=>0.62*(1-Math.exp(-h*1.1))*(h<6?1:Math.exp(-(h-6)*0.3));
 const path=fn=>{let d='';for(let i=0;i<=n;i++){const h=HM*i/N;d+=(i?'L':'M')+(X0+W*h/HM).toFixed(1)+' '+(Y0-H*fn(h)).toFixed(1)}return d};
 const xe=X0+W*n/N,di=path(ic);
 s+=`<path d="${di} L${xe} ${Y0} L${X0} ${Y0}Z" fill="#F3D9A4" opacity=".18"/><path d="${path(old)}" stroke="#7FA8E0" stroke-width="8" fill="none" stroke-linecap="round"/><path d="${di}" stroke="#F3D9A4" stroke-width="12" fill="none" stroke-linecap="round"/>`;
 const k=cl((lt-sp*0.8)/0.3);if(k>0){const x=X0+W*6/HM,y=Y0-H*0.62;s+=`<path d="M${x} ${y-30} V${Y0}" stroke="#F3D9A4" stroke-width="4" stroke-dasharray="10 8" opacity="${k}"/>`+pill(x,y-70,'6 ชม.',k,'#F3D9A4','#16171B',40)}
 s+=jarAt('jar.png',1310,250,120)+`<rect x="1250" y="262" width="120" height="8" rx="4" fill="#F3D9A4"/><text x="1310" y="320" text-anchor="middle" font-family="K" font-weight="900" font-size="30" fill="#7FA8E0">สูตรเดิม</text><rect x="1250" y="334" width="120" height="8" rx="4" fill="#7FA8E0"/>`;
 return s}
function gear(x,y,r,a,col){let d='';for(let i=0;i<8;i++)d+=`<rect x="${-r*0.18}" y="${-r*1.22}" width="${r*0.36}" height="${r*0.4}" rx="4" transform="rotate(${i*45})"/>`;return `<g transform="translate(${x} ${y}) rotate(${a})" fill="${col}">${d}<circle r="${r}"/><circle r="${r*0.4}" fill="#16171B"/></g>`}
function calSvg(x,y,m,p){if(p<=0)return '';const k=eOB(cl(p));return `<g transform="translate(${x} ${y}) scale(${k})"><rect x="-150" y="-140" width="300" height="290" rx="30" fill="#16171B" stroke="#D9B98A" stroke-width="7"/><rect x="-150" y="-140" width="300" height="80" rx="30" fill="#D9B98A"/><rect x="-90" y="-166" width="22" height="54" rx="9" fill="#F3D9A4"/><rect x="68" y="-166" width="22" height="54" rx="9" fill="#F3D9A4"/><text y="-84" text-anchor="middle" font-family="K" font-weight="900" font-size="42" fill="#16171B">เดือนที่ ${m}</text><text y="90" text-anchor="middle" font-family="K" font-weight="900" font-size="130" fill="#fff">30</text></g>`}
window.extra=function(t){
 const on=(a,b)=>t>=a-0.05&&t<b+0.45;
 // S1 30 -> x2 -> 60
 if(on(0,4.4)){const lt=t;let s='';
  s+=`<circle cx="1020" cy="330" r="280" fill="url(#gl1)"/><defs><radialGradient id="gl1"><stop offset="0" stop-color="#FFECC8" stop-opacity=".55"/><stop offset="1" stop-color="#D9B98A" stop-opacity="0"/></radialGradient></defs>`;
  s+=jarAt('box30.png',340,570,380)+pill(340,640,'30 เม็ด',1,'#fff','#16171B',56);
  const p=cl(lt/0.6),L=40+300*eOC(p);s+=`<g transform="translate(480 240)"><path d="M20 100H${L}" stroke="#E8C26A" stroke-width="30" stroke-linecap="round"/>`;
  if(p>0.6){const k=cl((p-0.6)/0.4);s+=`<g transform="translate(${L+10} 100) scale(${0.6+0.4*k+0.06*Math.sin(t*7)})"><path d="M-30 -62L50 0L-30 62Z" fill="#FFE08A" stroke="#B8862F" stroke-width="8" stroke-linejoin="round"/></g>`}
  s+=`<g transform="translate(190 30) scale(${(0.9+0.08*Math.sin(t*6)).toFixed(3)})"><circle r="52" fill="#E5484D" stroke="#fff" stroke-width="6"/><text y="20" text-anchor="middle" font-family="K" font-weight="900" font-size="58" fill="#fff">x2</text></g></g>`;
  s+=jarAt('box60.png',1020,590,520)+pill(1020,650,'60 เม็ด',1,'#F3D9A4','#16171B',80);
  const nb=`<g transform="translate(1230 110) rotate(${Math.sin(t*4)*6})"><polygon points="${[...Array(24)].map((_,i)=>{const a=i/24*6.283,r=i%2?0.78:1;return (Math.cos(a)*100*r).toFixed(0)+','+(Math.sin(a)*68*r).toFixed(0)}).join(' ')}" fill="#E5484D" stroke="#fff" stroke-width="6"/><text y="18" text-anchor="middle" font-family="K" font-weight="900" font-size="52" fill="#fff">NEW!</text></g>`;s+=nb;
  $('v1').innerHTML=s}
 // S6 exploded capsule
 if(on(4.4,6.0)){const lt=t-4.4;let s='';const e=eOC(cl((lt-0.3)/0.6));
  const cx=1000,cy=330;
  s+=`<g transform="translate(${cx} ${cy-80-e*70}) rotate(${-20*e})"><path d="M-80 60 V-10 A80 80 0 0 1 80 -10 V60Z" fill="rgba(255,255,255,.18)" stroke="#fff" stroke-width="5"/></g>`;
  s+=`<g transform="translate(${cx} ${cy+80+e*70}) rotate(${15*e})"><path d="M-84 -60 V20 A84 84 0 0 0 84 20 V-60Z" fill="#F4EFE4" stroke="#B9AF9B" stroke-width="5"/><text y="20" text-anchor="middle" font-family="Arial" font-weight="700" font-size="36" fill="#4A4A4A">Zn</text></g>`;
  let k=5;const rr=()=>{k=(k*16807)%2147483647;return (k-1)/2147483646};
  for(let i=0;i<34;i++){const a=rr()*6.28,d=40+rr()*220*e,r=10+rr()*8;const x=cx+Math.cos(a)*d*1.3,y=cy+Math.sin(a)*d*0.7;s+=`<circle cx="${x}" cy="${y}" r="${r}" fill="url(#gPl6)" stroke="#BFB6A3" stroke-width="1.5"/>`}
  s=`<defs><radialGradient id="gPl6" cx=".35" cy=".3" r=".75"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".55" stop-color="#F3EEE3"/><stop offset="1" stop-color="#BFB6A3"/></radialGradient></defs>`+s;
  s+=pill(1000,620,'Pellet Technology',cl((lt-0.8)/0.3),'#F3D9A4','#16171B',40);
  
  $('v2').innerHTML=s}
 // S8 gut simulation
 if(on(6.0,7.55)){const lt=t-6.0;let s=`<defs><linearGradient id="bl8" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B3262C"/><stop offset="1" stop-color="#7A1418"/></linearGradient></defs>`;
  const panel=(x0,lab,good,col,icon)=>{let g=`<g transform="translate(${x0} 0)"><rect x="0" y="100" width="560" height="560" rx="34" fill="rgba(22,23,27,.85)" stroke="${good?'#D9B98A':'rgba(255,255,255,.25)'}" stroke-width="5"/>`;
   g+=`<text x="280" y="160" text-anchor="middle" font-family="K" font-weight="900" font-size="38" fill="${good?'#F3D9A4':'#C9CED8'}">${lab}</text>`;
   // gut wall with villi
   let v='';for(let i=0;i<9;i++){const x=40+i*60;v+=`<path d="M${x} 470 V${400} A26 26 0 0 1 ${x+52} 400 V470" fill="#E8907E" stroke="#B5574A" stroke-width="4"/>`}
   g+=`<rect x="20" y="460" width="520" height="40" fill="#E8907E"/>`+v;
   g+=`<rect x="20" y="520" width="520" height="110" rx="20" fill="url(#bl8)"/><text x="40" y="610" font-family="K" font-weight="800" font-size="26" fill="#FFD0C8">กระแสเลือด</text>`;
   // particles
   let k=good?17:29;const rr=()=>{k=(k*16807)%2147483647;return (k-1)/2147483646};let pass=0;
   for(let i=0;i<22;i++){const st=rr()*0.9,x=50+rr()*460,ok=good?rr()<0.85:rr()<0.35;const p=cl((lt-0.2-st)/0.55);if(p<=0)continue;
    let y;if(ok){y=lerp(200,575,eIO(p));if(p>=1)pass++}else{y=p<0.6?lerp(200,385,p/0.6):lerp(385,300,(p-0.6)/0.4)}
    g+=`<circle cx="${x}" cy="${y}" r="13" fill="${col}" stroke="#fff" stroke-width="2" opacity="${ok||p<0.9?1:1-(p-0.9)*10}"/>`}
   g+=icon+`</g>`;return g};
  s+=panel(110,'สูตรเดิม',false,'#7FA8E0','')+panel(770,'iCAP',true,'#F3D9A4','');
  s+=focus(8,1050,560,300,120,(lt-0.95)/0.3);
  s+=pill(1050,720,'ซึมเข้าเลือดได้ดีกว่า',cl((lt-1.0)/0.3),'#F3D9A4','#16171B',34);
  $('v3').innerHTML=s}
 // S4 chart
 if(on(7.55,9.0)){$('v4').innerHTML=chart2(t-7.55,1.0)+focus(4,1000,400,270,120,(t-7.55-1.05)/0.3)}
 // S5 hormones swinging
 if(on(9.0,12.0)){const lt=t-9.0;const sw=lt>1.3;let s=person({x:400,y:700,s:1.0,g:'m',mood:sw?'sad':'neutral'});
  const amp=sw?16+6*Math.sin(t*3):3;const a=Math.sin(t*(sw?5:1.5))*amp;
  s+=`<g transform="translate(980 380) scale(1.3)">`+SCALE(0,0,0).replace(/rotate\([^)]*\)/,`rotate(${a} 0 -110)`)+`</g>`;
  if(sw){let w='';for(let i=0;i<=60;i++){const x=720+i*9,y=170+Math.sin(i*0.5+t*8)*30*Math.sin(i*0.13);w+=(i?'L':'M')+x+' '+y.toFixed(1)}s+=`<path d="${w}" stroke="#FF6B6E" stroke-width="6" fill="none" opacity="${cl((lt-1.3)/0.3)}"/>`;
   s+=`<path d="M560 160 L530 230 H560 L535 300" stroke="#FFD36E" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="${cl((lt-1.4)/0.2)*(0.6+0.4*Math.sin(t*20))}"/>`}
  $('v5').innerHTML=s}
 // S6 1 capsule after meal
 if(on(12.0,14.2)){const lt=t-12.0;let s='';const p=cl((lt-1.3)/0.35);
  if(p>0){const k=eOB(p);s+=`<g transform="translate(860 300) scale(${k})"><g transform="rotate(-25)"><path d="M0 -40 H-60 A40 40 0 0 0 -60 40 H0Z" fill="rgba(255,255,255,.2)" stroke="#fff" stroke-width="4"/><path d="M-2 -42 H60 A42 42 0 0 1 60 42 H-2Z" fill="#F4EFE4" stroke="#B9AF9B" stroke-width="4"/></g></g>`+pill(860,420,'1 เม็ด',p,'#F3D9A4','#16171B',50);
   const q=cl((lt-1.6)/0.35);if(q>0){const k2=eOB(q);s+=`<g transform="translate(1150 320) scale(${k2})"><circle r="110" fill="#16171B" stroke="#D9B98A" stroke-width="6"/><ellipse rx="70" ry="22" cy="30" fill="#F3EEE3"/><path d="M-50 20 Q0 -40 50 20Z" fill="#C9874A"/><path d="M-95 -50 V40 M-105 -50 V-10 M-85 -50 V-10" stroke="#C9CED8" stroke-width="7" stroke-linecap="round"/><path d="M95 -50 Q80 -10 95 0 V40" stroke="#C9CED8" stroke-width="7" fill="none" stroke-linecap="round"/></g>`+pill(1150,470,'หลังอาหาร',q,'#16171B','#F3D9A4',40)}}
  $('v6').innerHTML=s}
 // S7 zinc builds many hormones
 if(on(14.2,16.8)){const lt=t-14.2;let s=ZG;
  s+=`<g transform="translate(720 330) scale(${eOB(cl(lt/0.4))})">${znCoin(0,0,110)}</g>`;
  const hs=[[300,200,'เทสโทสเตอโรน','♂'],[1140,200,'ไทรอยด์',''],[300,520,'อินซูลิน',''],[1140,520,'อื่นๆ อีกหลายตัว','']];
  hs.forEach(([x,y,l,ic],i)=>{const p=cl((lt-0.6-i*0.3)/0.35);if(p<=0)return;
   s+=`<path d="M${720+(x-720)*0.25} ${330+(y-330)*0.25} L${720+(x-720)*0.78} ${330+(y-330)*0.78}" stroke="#D9B98A" stroke-width="6" stroke-dasharray="14 10" stroke-dashoffset="${-t*60}" opacity="${p}"/>`;
   const k=eOB(p);s+=`<g transform="translate(${x} ${y}) scale(${k})"><circle r="78" fill="#16171B" stroke="#F3D9A4" stroke-width="6"/><path d="M-24 -30 L0 -44 L24 -30 V0 L0 14 L-24 0Z M0 14 V40 M24 0 L46 12" stroke="#F3D9A4" stroke-width="7" fill="none" stroke-linejoin="round"/></g>`+pill(x,y+120,l,p,'#F3D9A4','#16171B',34)});
  $('v7').innerHTML=s}
 // S8 not enough -> gears jam, run down
 if(on(16.8,20.85)){const lt=t-16.8;let s=ZG;const slow=Math.max(0.05,1-cl((lt-1.0)/1.5));
  s+=`<rect x="140" y="110" width="700" height="540" rx="36" fill="rgba(22,23,27,.85)" stroke="rgba(255,255,255,.2)" stroke-width="4"/>`;
  const ang=60*(lt-Math.max(0,lt-1.0)*(1-slow)*0.9)*1;s+=gear(380,330,90,ang*1.0,'#9AA0AC')+gear(560,250,60,-ang*1.5,'#9AA0AC')+gear(600,460,70,-ang*1.3+15,'#9AA0AC');
  const zl=1-0.85*cl((lt-0.1)/0.7);s+=`<g transform="translate(490 580)">${battery(0,0,zl,zl<0.4?'#E5484D':'#D9B98A')}</g>`;
  if(lt>1.0)s+=`<g opacity="${cl((lt-1.0)/0.3)*(0.6+0.4*Math.sin(t*10))}"><path d="M490 120 L560 240 H420Z" fill="#E5484D" stroke="#fff" stroke-width="5"/><text x="490" y="225" text-anchor="middle" font-family="K" font-weight="900" font-size="70" fill="#fff">!</text></g>`;
  s+=person({x:1100,y:690,s:0.95,g:'m',mood:lt<3.0?'neutral':'tired'});
  if(lt>3.1){for(let i=0;i<3;i++)s+=`<path d="M${1150+i*30} ${150-((t*40+i*20)%60)} q10 -10 0 -20 q-10 -10 0 -20" stroke="#9AA0AC" stroke-width="5" fill="none" opacity=".7"/>`;s+=pill(1100,110,'หมดแรง',cl((lt-3.1)/0.3),'#E5484D','#fff',36)}
  $('v8').innerHTML=s}
 // S9 15 mg = enough per day
 if(on(20.85,24.9)){const lt=t-20.85;let s='';
  const n=Math.round(15*eOC(cl((lt-0.2)/0.8)));s+=`<text x="980" y="330" text-anchor="middle" font-family="K" font-weight="900" font-size="190" fill="#F3D9A4">${n}<tspan font-size="80" dx="10">mg</tspan></text>`;
  const p=eOC(cl((lt-2.2)/0.9));s+=`<text x="980" y="440" text-anchor="middle" font-family="K" font-weight="800" font-size="34" fill="#C9CED8" opacity="${cl((lt-2.1)/0.3)}">ความต้องการต่อวัน</text><rect x="730" y="470" width="500" height="56" rx="28" fill="rgba(255,255,255,.1)" stroke="rgba(255,255,255,.3)" stroke-width="3" opacity="${cl((lt-2.1)/0.3)}"/><rect x="736" y="476" width="${488*p}" height="44" rx="22" fill="#2EC4B6"/>`;
  s+=check(1265,498,40,cl((lt-3.0)/0.3));
  $('v9').innerHTML=s}
 // S11 recommend 60, few baht more
 if(on(26.4,30.85)){const lt=t-26.4;let s='';
  s+=`<g opacity="${1-0.5*cl((lt-0.5)/0.4)}">${jarAt('box30.png',330,600,300)}</g>`;
  s+=`<g transform="translate(1000 620) scale(${eOB(cl(lt/0.45))})">${jarAt('box60.png',0,0,500)}</g>`;
  const ck=cl((lt-0.6)/0.35);if(ck>0)s+=`<g transform="translate(1140 140) scale(${eOB(ck)}) rotate(14)"><path d="M-75 50 L-63 -30 L-33 10 L0 -45 L33 10 L63 -30 L75 50Z" fill="#F3D9A4" stroke="#7A5B2E" stroke-width="6" stroke-linejoin="round"/></g>`;
  if(lt>2.3){const k=cl((lt-2.4)/0.35);s+=`<g transform="translate(660 360) scale(${eOB(k)})">${coin(0,0,40)}${coin(0,-24,40)}</g>`+pill(660,460,'+ ไม่กี่บาท',k,'#F3D9A4','#16171B',40)}
  $('v11').innerHTML=s}
 // S12 two months
 if(on(30.85,99)){const lt=t-30.85;let s='';
  s+=calSvg(820,330,1,cl((lt-0.15)/0.35))+calSvg(1150,330,2,cl((lt-0.45)/0.35));
  s+=pill(985,560,'60 เม็ด = 2 เดือน',cl((lt-0.8)/0.3),'#F3D9A4','#16171B',44);
  $('v12').innerHTML=s}
};
