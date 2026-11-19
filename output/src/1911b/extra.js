
function chart2(lt,sp){let s='';const X0=230,Y0=640,W=980,H=420,HM=8;s+=axes(X0,Y0,W,H,HM,'ซิงค์ในร่างกาย',2);
 const pr=cl((lt-0.1)/sp),N=150,n=Math.max(2,Math.floor(N*pr));
 const old=h=>0.66*Math.pow(h/2.4,2)*Math.exp(2*(1-h/2.4)),ic=h=>0.62*(1-Math.exp(-h*1.1))*(h<6?1:Math.exp(-(h-6)*0.3));
 const path=fn=>{let d='';for(let i=0;i<=n;i++){const h=HM*i/N;d+=(i?'L':'M')+(X0+W*h/HM).toFixed(1)+' '+(Y0-H*fn(h)).toFixed(1)}return d};
 const xe=X0+W*n/N,di=path(ic);
 s+=`<path d="${di} L${xe} ${Y0} L${X0} ${Y0}Z" fill="#F3D9A4" opacity=".18"/><path d="${path(old)}" stroke="#7FA8E0" stroke-width="8" fill="none" stroke-linecap="round"/><path d="${di}" stroke="#F3D9A4" stroke-width="12" fill="none" stroke-linecap="round"/>`;
 const k=cl((lt-sp*0.8)/0.3);if(k>0){const x=X0+W*6/HM,y=Y0-H*0.62;s+=`<path d="M${x} ${y-30} V${Y0}" stroke="#F3D9A4" stroke-width="4" stroke-dasharray="10 8" opacity="${k}"/>`+pill(x,y-70,'6 ชม.',k,'#F3D9A4','#16171B',40)}
 s+=jarAt('jar.png',1310,250,120)+`<rect x="1250" y="262" width="120" height="8" rx="4" fill="#F3D9A4"/>`+jarAt('biotin.png',1310,420,120)+`<rect x="1250" y="432" width="120" height="8" rx="4" fill="#7FA8E0"/>`;
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
 // S3 absorption into the body
 if(on(6.0,7.55)){const lt=t-6.0;let s='';
  const body=(cx,good,lab)=>{let g='';const col=good?'#F3D9A4':'#7FA8E0';
   const sil=`M${cx} 150 a55 55 0 1 1 0.1 0 M${cx-110} 290 Q${cx} 240 ${cx+110} 290 L${cx+130} 470 Q${cx+120} 500 ${cx+90} 500 L${cx+80} 640 H${cx-80} L${cx-90} 500 Q${cx-120} 500 ${cx-130} 470Z`;
   g+=`<path d="M${cx-110} 290 Q${cx} 240 ${cx+110} 290 L${cx+130} 470 Q${cx+120} 500 ${cx+90} 500 L${cx+80} 640 H${cx-80} L${cx-90} 500 Q${cx-120} 500 ${cx-130} 470Z" fill="rgba(255,255,255,.06)" stroke="rgba(255,255,255,.35)" stroke-width="5"/><circle cx="${cx}" cy="205" r="55" fill="rgba(255,255,255,.06)" stroke="rgba(255,255,255,.35)" stroke-width="5"/>`;
   let k=good?41:7;const rr=()=>{k=(k*16807)%2147483647;return (k-1)/2147483646};let kept=0;
   for(let i=0;i<18;i++){const d=rr()*0.5,p=cl((lt-0.15-d)/0.6),x=cx+(rr()-.5)*150,ty=320+rr()*150,stay=good?rr()<0.85:rr()<0.35;if(p<=0)continue;
    let y,o=1,c=col;if(stay){y=lerp(60,ty,eOC(p));if(p>=1)kept++}else{y=lerp(60,720,p);c='#6B7280';o=1-cl((p-0.7)/0.3)}
    g+=`<circle cx="${x}" cy="${y}" r="13" fill="${c}" stroke="#fff" stroke-width="2" opacity="${o}"/>`}
   const fill=(good?0.85:0.35)*eOC(cl((lt-0.5)/0.6));
   g+=`<rect x="${cx-150}" y="680" width="300" height="34" rx="17" fill="rgba(255,255,255,.1)"/><rect x="${cx-146}" y="684" width="${292*fill}" height="26" rx="13" fill="${col}"/>`;
   g+=jarAt(good?'jar.png':'biotin.png',cx+200,250,150)+`<text x="${cx+200}" y="290" text-anchor="middle" font-family="K" font-weight="900" font-size="34" fill="${col}">${lab}</text>`;
   return g};
  s+=body(400,false,'สูตรเดิม')+body(1040,true,'iCAP');
  s+=`<text x="720" y="700" text-anchor="middle" font-family="K" font-weight="800" font-size="26" fill="#C9CED8">ซิงค์ที่ร่างกายได้รับ</text>`;
  s+=focus(3,1090,430,300,310,(lt-1.0)/0.3);
  $('v3').innerHTML=s}
 // S4 chart (option 2) vs blue Zinc Biotin
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
 // S7 zinc builds many hormones (each with what it does)
 if(on(14.2,16.8)){const lt=t-14.2;let s=ZG;
  s+=`<g transform="translate(720 360) scale(${eOB(cl(lt/0.4))})">${znCoin(0,0,100)}</g>`;
  const IC2=[
   `${sym(-30,-10,34,'m')}<g transform="translate(26 18) scale(.42)">${bicep(0,0,1,0.9,SK)}</g>`,
   `<path d="M0 -6 C-14 -34 -58 -40 -56 -4 C-54 26 -18 30 0 10 C18 30 54 26 56 -4 C58 -40 14 -34 0 -6Z" fill="#E8907E" stroke="#B5574A" stroke-width="4"/><path d="M-10 40 Q0 18 10 40 Q14 54 0 60 Q-14 54 -10 40Z" fill="#FFB347"/>`,
   `<path d="M-18 -46 Q-44 -10 -44 10 A44 44 0 0 0 44 10 Q44 -10 18 -46Z" transform="translate(-14 0) scale(.6)" fill="#E5484D"/><rect x="8" y="-30" width="34" height="34" rx="5" fill="#fff" stroke="#C9CED8" stroke-width="3"/><rect x="18" y="8" width="34" height="34" rx="5" fill="#fff" stroke="#C9CED8" stroke-width="3"/>`,
   `<circle cx="-28" r="12" fill="#F3D9A4"/><circle r="12" fill="#F3D9A4"/><circle cx="28" r="12" fill="#F3D9A4"/>`];
  const hs=[[290,210,'เทสโทสเตอโรน','ฮอร์โมนเพศชาย กล้าม'],[1150,210,'ไทรอยด์','ระบบเผาผลาญ'],[290,540,'อินซูลิน','คุมน้ำตาลในเลือด'],[1150,540,'อื่นๆ อีกหลายตัว','']];
  hs.forEach(([x,y,l,sub],i)=>{const p=cl((lt-0.5-i*0.28)/0.35);if(p<=0)return;
   s+=`<path d="M${720+(x-720)*0.22} ${360+(y-360)*0.22} L${720+(x-720)*0.72} ${360+(y-360)*0.72}" stroke="#D9B98A" stroke-width="6" stroke-dasharray="14 10" stroke-dashoffset="${-t*60}" opacity="${p}"/>`;
   const k=eOB(p);s+=`<g transform="translate(${x} ${y}) scale(${k})"><circle r="82" fill="#16171B" stroke="#F3D9A4" stroke-width="6"/><g transform="scale(1.15)">${IC2[i]}</g></g>`+pill(x,y+118,l,p,'#F3D9A4','#16171B',34);
   if(sub)s+=`<text x="${x}" y="${y+180}" text-anchor="middle" font-family="K" font-weight="800" font-size="28" fill="#C9CED8" opacity="${p}">${sub}</text>`});
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
