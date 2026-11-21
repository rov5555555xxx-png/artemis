// helpers (lib1711 + lib1911 prepended)
function mcoin(x,y,r,kind,id){const zn=kind==='zn';const g=zn?['#FFFFFF','#C9CED8','#7C838F']:['#FFE0C8','#E08A55','#8E4A22'];
 return `<defs><radialGradient id="mc${id}" cx=".35" cy=".3" r=".85"><stop offset="0" stop-color="${g[0]}"/><stop offset=".55" stop-color="${g[1]}"/><stop offset="1" stop-color="${g[2]}"/></radialGradient></defs><g transform="translate(${x} ${y})"><circle r="${r}" fill="url(#mc${id})" stroke="${zn?'#5B616B':'#6B3418'}" stroke-width="${Math.max(2,r*0.06)}"/><text y="${r*0.33}" text-anchor="middle" font-family="Arial" font-weight="700" font-size="${r*0.9}" fill="${zn?'#3A3F47':'#4A230E'}">${zn?'Zn':'Cu'}</text></g>`};
function dot(x,y,r,kind,o){return `<circle cx="${x}" cy="${y}" r="${r}" fill="${kind==='zn'?'#D5DAE2':'#E08A55'}" stroke="${kind==='zn'?'#7C838F':'#8E4A22'}" stroke-width="3" opacity="${o==null?1:o}"/>`};
function capsule(x,y,s,rot){return `<g transform="translate(${x} ${y}) rotate(${rot||-25}) scale(${s})"><path d="M0 -40 H-60 A40 40 0 0 0 -60 40 H0Z" fill="rgba(255,255,255,.2)" stroke="#fff" stroke-width="4"/><path d="M-2 -42 H60 A42 42 0 0 1 60 42 H-2Z" fill="#F4EFE4" stroke="#B9AF9B" stroke-width="4"/><text x="30" y="12" text-anchor="middle" font-family="Arial" font-weight="700" font-size="28" fill="#4A4A4A">Zn</text></g>`};
function calendar(x,y,n,shown,p){if(p<=0)return '';const k=eOB(cl(p));let s=`<g transform="translate(${x} ${y}) scale(${k})"><rect x="-230" y="-200" width="460" height="400" rx="30" fill="#16171B" stroke="#D9B98A" stroke-width="6"/><rect x="-230" y="-200" width="460" height="70" rx="30" fill="#D9B98A"/>`;
 for(let i=0;i<28;i++){const c=i%7,r=Math.floor(i/7);const cx=-195+c*65,cy=-90+r*72;s+=`<rect x="${cx-26}" y="${cy-26}" width="52" height="52" rx="10" fill="rgba(255,255,255,.07)"/>`;if(i<shown)s+=`<path d="M${cx-13} ${cy}l9 10l18 -20" stroke="#2EC4B6" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`}
 return s+`<text y="-152" text-anchor="middle" font-family="K" font-weight="900" font-size="38" fill="#16171B">${n}</text></g>`};
function gate(lt,excess,id,x0){x0=x0||200;const W=1040;let s=`<rect x="${x0}" y="120" width="${W}" height="540" rx="34" fill="rgba(22,23,27,.85)" stroke="rgba(255,255,255,.2)" stroke-width="4"/>`;
 s+=`<text x="${x0+30}" y="170" font-family="K" font-weight="800" font-size="28" fill="#C9CED8">ลำไส้</text>`;
 s+=`<rect x="${x0+20}" y="390" width="${W-40}" height="60" fill="#E8907E"/>`;
 const gates=[0.17,0.39,0.61,0.83].map(f=>x0+W*f);
 gates.forEach(gx=>{s+=`<rect x="${gx-34}" y="386" width="68" height="68" rx="12" fill="#2A2D35" stroke="#F3D9A4" stroke-width="4"/>`});
 s+=`<rect x="${x0+20}" y="500" width="${W-40}" height="130" rx="22" fill="#8E1A1D"/><text x="${x0+40}" y="610" font-family="K" font-weight="800" font-size="28" fill="#FFD0C8">กระแสเลือด</text>`;
 let k=excess?77:13;const rr=()=>{k=(k*16807)%2147483647;return (k-1)/2147483646};
 const n=excess?34:14;let cuBlocked=0;
 for(let i=0;i<n;i++){const kind=excess?(i%5==0?'cu':'zn'):(i%2?'cu':'zn');const gi=Math.floor(rr()*4),d=rr()*1.0,p=cl((lt-0.15-d)/0.8);if(p<=0)continue;
  const gx=gates[gi]+(rr()-.5)*30,sx=gx+(rr()-.5)*120;let x,y,o=1;
  const pass=excess?(kind==='zn'?rr()<0.5:false):true;
  if(pass){if(p<0.5){x=lerp(sx,gx,p/0.5);y=lerp(200,420,p/0.5)}else{x=gx+(p-0.5)*(rr()-.5)*200;y=lerp(420,570,(p-0.5)/0.5)}}
  else if(kind==='zn'){x=lerp(sx,gx+(rr()-.5)*80,eOC(p));y=lerp(200,355-rr()*40,eOC(p))}
  else{if(p<0.5){x=lerp(sx,gx,p/0.5);y=lerp(200,350,p/0.5)}else{x=gx+(p-0.5)*160*(gi%2?1:-1);y=lerp(350,230,(p-0.5)/0.5)}cuBlocked++}
  s+=dot(x,y,15,kind,o)}
 if(excess){gates.forEach((gx,i)=>{const q=cl((lt-0.9-i*0.1)/0.3);if(q>0)s+=`<g opacity="${q}"><circle cx="${gx}" cy="420" r="40" fill="none" stroke="#FF3B3F" stroke-width="7"/></g>`})}
 return s};
function mgBar(lt,val,x0,y0){const W=980,MAX=60;let s=`<rect x="${x0}" y="${y0}" width="${W}" height="70" rx="35" fill="rgba(255,255,255,.08)" stroke="rgba(255,255,255,.3)" stroke-width="4"/>`;
 const x40=x0+W*40/MAX;s+=`<rect x="${x40}" y="${y0+4}" width="${x0+W-x40-4}" height="62" rx="0" fill="url(#hz)" opacity=".7"/><defs><pattern id="hz" width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="20" height="20" fill="#4A1416"/><rect width="9" height="20" fill="#8E1A1D"/></pattern></defs>`;
 const w=(W-8)*Math.min(val,MAX)/MAX;s+=`<rect x="${x0+4}" y="${y0+4}" width="${w}" height="62" rx="31" fill="${val>40?'#E5484D':'#D9B98A'}"/>`;
 s+=`<path d="M${x40} ${y0-26} V${y0+96}" stroke="#FF3B3F" stroke-width="6" stroke-dasharray="12 8"/><text x="${x40}" y="${y0-38}" text-anchor="middle" font-family="K" font-weight="900" font-size="34" fill="#FF6B6E">40 mg</text>`;
 s+=`<text x="${x0+4+w-16}" y="${y0+48}" text-anchor="end" font-family="K" font-weight="900" font-size="38" fill="#16171B">${Math.round(val)} mg</text>`;
 return s};

window.extra=function(t){
 const on=(a,b)=>t>=a-0.05&&t<b+0.45;
 // S1 calendar: every day, nonstop
 if(on(0,2.9)){const lt=t;let s='';const days=Math.min(28,Math.floor(2+lt*12));
  s+=jarAt('jar.png',320,560,380)+calendar(920,360,'ทุกวัน ไม่หยุดพัก',days,1);
  for(let i=0;i<3;i++){const p=((lt*1.4+i/3)%1);s+=`<g opacity="${Math.sin(Math.PI*p)}">${capsule(lerp(420,700,p),lerp(300,330,p),0.7)}</g>`}
  $('v1').innerHTML=s}
 // S2 Zn vs Cu question, true/false
 if(on(2.9,6.0)){const lt=t-2.9;let s='';
  s+=`<g transform="translate(470 330) scale(${eOB(cl(lt/0.4))})">${mcoin(0,0,120,'zn','a2')}</g><g transform="translate(970 330) scale(${eOB(cl((lt-0.15)/0.4))})">${mcoin(0,0,120,'cu','b2')}</g>`;
  s+=`<path d="M610 330 H830" stroke="#FF6B6E" stroke-width="12" stroke-dasharray="20 14" stroke-dashoffset="${-t*80}" opacity="${cl((lt-0.4)/0.3)}"/>`;
  const q=cl((lt-0.5)/0.35);if(q>0&&lt<2.0)s+=`<text x="720" y="250" text-anchor="middle" font-family="K" font-weight="900" font-size="150" fill="#F3D9A4" transform="rotate(${Math.sin(t*5)*8} 720 200)" opacity="${q}">?</text>`;
  if(lt>2.0){s+=pill(560,590,'จริง',cl((lt-2.05)/0.3),'#F3D9A4','#16171B',54)+pill(880,590,'ไม่จริง',cl((lt-2.25)/0.3),'#E5484D','#fff',54)}
  $('v2').innerHTML=s}
 // S3 one capsule a day, long time
 if(on(6.0,9.5)){const lt=t-6.0;let s='';
  const p=cl((lt-0.3)/0.35);if(p>0)s+=`<g transform="translate(800 260) scale(${eOB(p)})">${capsule(0,0,1.3)}</g>`+pill(800,400,'1 เม็ด = 15 mg',p,'#F3D9A4','#16171B',40);
  if(lt>1.9){const d=Math.round(1+364*eIO(cl((lt-2.0)/1.3)));s+=`<g transform="translate(1110 330)"><circle r="150" fill="#16171B" stroke="#D9B98A" stroke-width="6"/><text y="-30" text-anchor="middle" font-family="K" font-weight="800" font-size="34" fill="#C9CED8">วันที่</text><text y="62" text-anchor="middle" font-family="K" font-weight="900" font-size="110" fill="#F3D9A4">${d}</text></g>`}
  $('v3').innerHTML=s}
 // S4 normal: zinc and copper both absorbed
 if(on(9.5,12.0)){const lt=t-9.5;let s=gate(lt,false,'n');
  s+=`<g transform="translate(1180 230)">${mcoin(0,0,46,'cu','c4')}</g>`+check(1235,190,30,cl((lt-1.4)/0.3));
  s+=pill(720,700,'ซิงค์ + ทองแดง ดูดซึมได้ปกติ',cl((lt-1.3)/0.3),'#F3D9A4','#16171B',36);
  $('v4').innerHTML=s}
 // S5 2 capsules 30 mg + food 10 mg
 if(on(12.0,17.75)){const lt=t-12.0;let s='';
  const c1=cl((lt-0.4)/0.35),c2=cl((lt-0.8)/0.35);
  if(c1>0)s+=`<g transform="translate(330 280) scale(${eOB(c1)})">${capsule(0,0,1.1)}</g>`;if(c2>0)s+=`<g transform="translate(520 280) scale(${eOB(c2)})">${capsule(0,0,1.1)}</g>`;
  s+=pill(425,410,'2 เม็ด = 30 mg',cl((lt-1.1)/0.3),'#E5484D','#fff',40);
  const f=cl((lt-2.4)/0.35);if(f>0){s+=`<g transform="translate(980 290) scale(${eOB(f)})"><circle r="120" fill="#16171B" stroke="#D9B98A" stroke-width="6"/><ellipse rx="80" ry="26" cy="34" fill="#F3EEE3"/><path d="M-60 24 Q-30 -40 0 10 Q30 -50 60 24Z" fill="#C9874A"/><circle cx="-20" cy="0" r="14" fill="#E5484D"/><circle cx="24" cy="4" r="12" fill="#6BBF59"/></g>`+pill(980,440,'อาหาร +10 mg',f,'#E5484D','#fff',38);
   s+=`<text x="725" y="310" text-anchor="middle" font-family="K" font-weight="900" font-size="90" fill="#F3D9A4" opacity="${f}">+</text>`}
  const v=lt<1.2?0:lt<2.5?30*eOC(cl((lt-1.2)/0.5)):30+10*eOC(cl((lt-3.0)/0.6));if(lt>1.2)s+=mgBar(lt,v,230,560);
  $('v5').innerHTML=s}
 // S6 over 40: copper blocked
 if(on(17.75,21.8)){const lt=t-17.75;let s='';
  if(lt<1.5){s+=mgBar(lt,40+6*eOC(cl(lt/0.6))+Math.sin(t*20)*0.6,230,330);const w=cl((lt-0.3)/0.3);s+=`<g opacity="${w*(0.6+0.4*Math.sin(t*12))}"><path d="M720 120 L800 260 H640Z" fill="#E5484D" stroke="#fff" stroke-width="6"/><text x="720" y="240" text-anchor="middle" font-family="K" font-weight="900" font-size="90" fill="#fff">!</text></g>`}
  else{s+=gate(lt-1.5,true,'x');s+=`<g transform="translate(1180 230)">${mcoin(0,0,46,'cu','c6')}</g>`+cross(1235,190,30,cl((lt-2.6)/0.3))+pill(720,700,'ซิงค์มากไป ทองแดงเข้าไม่ได้',cl((lt-2.5)/0.3),'#E5484D','#fff',36)}
  $('v6').innerHTML=s}
 // S7 rule: max 40 mg, risks
 if(on(21.8,27.6)){const lt=t-21.8;let s='';
  const k=cl((lt-0.1)/0.35);if(k>0)s+=`<g transform="translate(720 260) scale(${eOB(k)}) rotate(${-6*(1-k)})"><circle r="170" fill="#16171B" stroke="#E5484D" stroke-width="14"/><text y="-30" text-anchor="middle" font-family="K" font-weight="900" font-size="46" fill="#FF6B6E">ห้ามเกิน</text><text y="60" text-anchor="middle" font-family="K" font-weight="900" font-size="100" fill="#fff">40<tspan font-size="50"> mg</tspan></text><text y="110" text-anchor="middle" font-family="K" font-weight="800" font-size="34" fill="#C9CED8">ต่อวัน</text></g>`;
  const r=[[300,560,'ทองแดงต่ำ',mcoin(0,0,46,'cu','r1')+`<path d="M30 -10 V30 M14 16 L30 32 L46 16" stroke="#FF3B3F" stroke-width="8" fill="none" stroke-linecap="round"/>`],[720,600,'คลื่นไส้ ไม่สบายท้อง',`<circle r="46" fill="#9FD18B"/><path d="M-18 -10 L-6 -4 M18 -10 L6 -4" stroke="#16171B" stroke-width="5"/><path d="M-16 22 Q0 10 16 22" stroke="#16171B" stroke-width="5" fill="none"/>`],[1140,560,'ผลเสียอื่นๆ',`<path d="M0 -46 L44 32 H-44Z" fill="#E5484D" stroke="#fff" stroke-width="4"/><text y="22" text-anchor="middle" font-family="K" font-weight="900" font-size="50" fill="#fff">!</text>`]];
  r.forEach(([x,y,l,ic],i)=>{const p=cl((lt-2.3-i*0.45)/0.35);if(p<=0)return;s+=`<g transform="translate(${x} ${y-40}) scale(${eOB(p)})"><circle r="70" fill="#16171B" stroke="#E5484D" stroke-width="5"/>${ic}</g>`+pill(x,y+70,l,p,'#E5484D','#fff',30)});
  $('v7').innerHTML=s}
 // S8 1 capsule: safe zone, right amount
 if(on(27.6,33.0)){const lt=t-27.6;let s='';
  s+=mgBar(lt,15*eOC(cl((lt-0.3)/0.6)),230,330);
  s+=pill(400,200,'1 เม็ด = 15 mg',cl((lt-0.5)/0.3),'#F3D9A4','#16171B',40);
  const z=cl((lt-1.2)/0.4);if(z>0)s+=`<rect x="234" y="420" width="${(980-8)*40/60*eOC(z)}" height="16" rx="8" fill="#2EC4B6"/><text x="${234+326}" y="480" text-anchor="middle" font-family="K" font-weight="900" font-size="34" fill="#2EC4B6" opacity="${z}">โซนปลอดภัย</text>`;
  s+=focus(8,520,380,360,150,(lt-2.5)/0.3);
  if(lt>2.4)s+=`<g transform="translate(1200 560)">${mcoin(0,0,50,'cu','c8')}</g>`+check(1255,515,30,cl((lt-3.0)/0.3))+`<text x="1200" y="650" text-anchor="middle" font-family="K" font-weight="800" font-size="28" fill="#F0A070" opacity="${cl((lt-2.6)/0.3)}">ไม่กระทบทองแดง</text>`;
  $('v8').innerHTML=s}
 // S9 every day, no copper supplement needed
 if(on(33.0,36.0)){const lt=t-33.0;let s='';
  s+=calendar(450,360,'กินได้ทุกวัน',Math.min(28,Math.floor(lt*16)),cl(lt/0.35));
  const p=cl((lt-1.5)/0.35);if(p>0){const k=eOB(p);s+=`<g transform="translate(1040 360) scale(${k})"><rect x="-90" y="-130" width="180" height="250" rx="30" fill="#6B3418" stroke="#F0A070" stroke-width="6"/><rect x="-70" y="-170" width="140" height="50" rx="12" fill="#C9CED8"/>${mcoin(0,0,58,'cu','c9')}</g>`+cross(1040,360,95,cl((lt-1.8)/0.3)).replace('fill="#E5484D"','fill="rgba(229,72,77,.85)"')+pill(1040,560,'ไม่ต้องเสริมทองแดง',cl((lt-1.9)/0.3),'#16171B','#F0A070',34)}
  $('v9').innerHTML=s}
 // S10 safe: both absorbed normally
 if(on(36.0,99)){const lt=t-36.0;let s='';
  s+=`<g transform="translate(900 300) scale(${eOB(cl((lt-0.3)/0.4))})">${mcoin(0,0,90,'zn','z10')}</g><g transform="translate(1150 300) scale(${eOB(cl((lt-0.5)/0.4))})">${mcoin(0,0,90,'cu','c10')}</g>`;
  s+=check(970,230,36,cl((lt-2.1)/0.3))+check(1220,230,36,cl((lt-2.3)/0.3));
  s+=pill(1025,460,'ดูดซึมได้ตามปกติทั้งคู่',cl((lt-2.2)/0.3),'#F3D9A4','#16171B',38);
  $('v10').innerHTML=s}
};
