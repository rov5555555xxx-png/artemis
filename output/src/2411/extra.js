function priceTag2(x,y,txt,p,big){if(p<=0)return '';const k=eOB(cl(p));const w=big?260:220,h=big?110:90;return `<g transform="translate(${x} ${y}) scale(${k}) rotate(${big?-6:4})"><path d="M${-w/2} ${-h/2} H${w/2-30} L${w/2} 0 L${w/2-30} ${h/2} H${-w/2}Z" fill="${big?'#F3D9A4':'#16171B'}" stroke="${big?'#7A5B2E':'#D9B98A'}" stroke-width="6" stroke-linejoin="round"/><circle cx="${w/2-34}" cy="0" r="9" fill="${big?'#7A5B2E':'#D9B98A'}"/><text x="-14" y="${big?22:18}" text-anchor="middle" font-family="K" font-weight="900" font-size="${big?66:54}" fill="${big?'#16171B':'#F3D9A4'}">${txt}</text></g>`}
function calM(x,y,m,p){if(p<=0)return '';const k=eOB(cl(p));return `<g transform="translate(${x} ${y}) scale(${k})"><rect x="-120" y="-115" width="240" height="235" rx="26" fill="#16171B" stroke="#D9B98A" stroke-width="6"/><rect x="-120" y="-115" width="240" height="64" rx="26" fill="#D9B98A"/><text y="-70" text-anchor="middle" font-family="K" font-weight="900" font-size="34" fill="#16171B">เดือนที่ ${m}</text><text y="70" text-anchor="middle" font-family="K" font-weight="900" font-size="100" fill="#fff">30</text></g>`}
window.extra=function(t){
 const on=(a,b)=>t>=a-0.05&&t<b+0.45;
 // S1 30 vs 60 price (big, flat, different colours)
 if(on(0,3.6)){const lt=t;let s='';
  const price=(x,y,n,p,col,bg,fs,show)=>{if(show<=0)return '';const k=eOB(cl(show));const w=fs*3.3;return `<g transform="translate(${x} ${y}) scale(${k})"><rect x="${-w/2}" y="${-fs*0.95}" width="${w}" height="${fs*1.9}" rx="24" fill="${bg}" stroke="${col}" stroke-width="6"/><text y="${-fs*0.18}" text-anchor="middle" font-family="K" font-weight="900" font-size="${fs*0.42}" fill="${col}">${n}</text><text y="${fs*0.62}" text-anchor="middle" font-family="K" font-weight="900" font-size="${fs*0.82}" fill="${col}">${p}</text></g>`};
  s+=jarAt('box30.png',330,520,300)+price(330,650,'30 เม็ด','฿159','#C9D6EA','#1E2633',90,1);
  const a=cl((lt-0.3)/0.4);s+=`<g opacity="${a}"><path d="M520 340 H${520+230*eOC(a)}" stroke="#E8C26A" stroke-width="26" stroke-linecap="round"/><path d="M745 290 L820 340 L745 390Z" fill="#FFE08A" stroke="#B8862F" stroke-width="6"/></g>`;
  s+=pill(670,250,'+20 บาท',cl((lt-0.6)/0.3),'#E5484D','#fff',54);
  s+=`<circle cx="1050" cy="330" r="270" fill="url(#g1)"/><defs><radialGradient id="g1"><stop offset="0" stop-color="#FFECC8" stop-opacity=".5"/><stop offset="1" stop-color="#D9B98A" stop-opacity="0"/></radialGradient></defs>`;
  s+=jarAt('box60.png',1050,520,420)+price(1050,650,'60 เม็ด','฿179','#FFD36E','#2A2210',110,cl((lt-0.9)/0.35));
  $('v1').innerHTML=s}
 // S2 readable price comparison
 if(on(3.6,4.9)){const lt=t-3.6;let s='';
  const card=(x,img,n,price,col,d,big)=>{const p=cl((lt-d)/0.3);if(p<=0)return '';return `<g opacity="${p}"><rect x="${x-250}" y="100" width="500" height="580" rx="34" fill="rgba(22,23,27,.9)" stroke="${col}" stroke-width="6"/>${jarAt(img,x,400,big?290:250)}<text x="${x}" y="490" text-anchor="middle" font-family="K" font-weight="900" font-size="56" fill="#fff">${n}</text><text x="${x}" y="610" text-anchor="middle" font-family="K" font-weight="900" font-size="${big?110:92}" fill="${col}">${price}</text></g>`};
  s+=card(450,'box30.png','30 เม็ด','฿159','#C9CED8',0,false)+card(990,'box60.png','60 เม็ด','฿179','#F3D9A4',0.1,true);
  s+=`<g transform="translate(720 300) scale(${eOB(cl((lt-0.3)/0.3))})"><circle r="66" fill="#E5484D" stroke="#fff" stroke-width="6"/><text y="-2" text-anchor="middle" font-family="K" font-weight="900" font-size="40" fill="#fff">+20</text><text y="36" text-anchor="middle" font-family="K" font-weight="900" font-size="28" fill="#fff">บาท</text></g>`;
  s+=`<rect x="735" y="95" width="510" height="590" rx="38" fill="none" stroke="#F3D9A4" stroke-width="${4+4*Math.sin(t*8)}" opacity="${cl((lt-0.5)/0.3)}"/>`+pill(990,720,'ได้เพิ่มอีก 30 เม็ด!',cl((lt-0.6)/0.3),'#F3D9A4','#16171B',42);
  $('v2').innerHTML=s}
 // S3 who benefits: hormone, skin, hair, nails, acne
 if(on(4.9,10.3)){const lt=t-4.9;let s='';
  const HAIR2=`<g><path d="M-30 -48 Q-56 -20 -50 30 Q-46 56 -60 70 L60 70 Q46 56 50 30 Q56 -20 30 -48 Q0 -66 -30 -48Z" fill="#1E1A17"/><ellipse cx="0" cy="-4" rx="30" ry="36" fill="${SK}"/><path d="M-32 -30 Q0 -62 32 -30 Q20 -44 0 -44 Q-20 -44 -32 -30Z" fill="#1E1A17"/><path d="M-44 0 Q-40 30 -50 56 M44 0 Q40 30 50 56" stroke="#5A4A3A" stroke-width="4" fill="none"/><path d="M-38 -10 Q-34 20 -42 44" stroke="#fff" stroke-width="4" fill="none" opacity=".6" stroke-linecap="round"/></g>`;
  const it=[['ฮอร์โมน',0.1,SCALE(0,30,t).replace('<g transform="translate(0 30)">','<g transform="translate(0 30) scale(.4)">')],['ผิว',2.1,IC.skin],['ผม',2.5,HAIR2],['เล็บ',2.9,IC.nail],['สิว / ผิวมัน',3.9,IC.acne]];
  const xs=[240,480,720,960,1200];
  const fade=lt>4.6?1-cl((lt-4.6)/0.3):1;
  it.forEach(([l,d,ic],i)=>{s+=`<g opacity="${fade}" transform="translate(${xs[i]} 330) scale(1.15) translate(${-xs[i]} -330)">`+icoTile(xs[i],330,cl((lt-d)/0.35),l,ic)+`</g>`});
  if(lt>4.6){const k=eOB(cl((lt-4.7)/0.4));s+=`<g transform="translate(720 360) scale(${k})">${jarAt('jar.png',0,250,480)}</g>`}
  $('v3').innerHTML=s}
 // S4 pellet slow release
 if(on(10.3,14.6)){const lt=t-10.3;const hr=6*cl((lt-1.2)/3.0);const L=[0,1,2,3,4].map(i=>{const g=eOC(cl((lt-0.1-i*0.12)/0.3));const st=(4-i)*1.3;return Math.min(g,1-cl((hr-st)/1.3))});
  let s=pellet(560,370,230,L,t,'4');
  let k=9;const rr=()=>{k=(k*16807)%2147483647;return (k-1)/2147483646};
  for(let i=0;i<26;i++){const st=rr()*6,p=cl((hr-st)/1.4);if(p<=0||p>=1)continue;const a=rr()*6.28;s+=zdot(560+Math.cos(a)*(240+p*280),370+Math.sin(a)*(200+p*160),12,false,1-p).replace('#7FA8E0','#D5DAE2').replace('#2E4E7A','#7C838F')}
  s+=`<g transform="translate(1110 340)"><circle r="120" fill="#16171B" stroke="#D9B98A" stroke-width="6"/><text y="-20" text-anchor="middle" font-family="K" font-weight="800" font-size="30" fill="#C9CED8">ชั่วโมงที่</text><text y="56" text-anchor="middle" font-family="K" font-weight="900" font-size="90" fill="#F3D9A4">${hr.toFixed(0)}</text></g>`+pill(1110,520,'ปล่อยทีละชั้น',cl((lt-1.6)/0.3),'#F3D9A4','#16171B',34);
  $('v4').innerHTML=s}
 // S5 ordinary 2 h: centred chart
 if(on(14.6,18.0)){const lt=t-14.6;let s=miniChart(330,640,780,430,eIO(cl((lt-0.1)/1.6)),0,[2,'#7FA8E0','2 ชม.',cl((lt-0.9)/0.3)]);
  s+=`<g transform="translate(1010 270)">${lock(0,0,0.5,lt>1.4,'#7FA8E0')}</g>`;
  if(lt>1.6)s+=`<g opacity="${cl((lt-1.6)/0.3)}">${toilet(1030,560,0.42,t,true)}</g>`+pill(860,520,'ขับทิ้ง',cl((lt-1.8)/0.3),'#E5484D','#fff',32);
  $('v5').innerHTML=s}
 // S6 iCAP 6 h: centred chart
 if(on(18.0,22.5)){const lt=t-18.0;let s=miniChart(330,640,780,430,1,eIO(cl((lt-0.2)/1.6)),[6,'#F3D9A4','6 ชม.',cl((lt-1.6)/0.3)]);
  s+=`<g transform="translate(1040 285)">${lock(0,0,0.45,false)}</g>`;
  s+=focus(6,800,330,340,190,(lt-3.0)/0.3);
  $('v6').innerHTML=s}
 // S7 body reservoir, used any time
 if(on(22.5,25.3)){const lt=t-22.5;let s=`<circle cx="720" cy="440" r="${210+10*Math.sin(t*3)}" fill="#F3D9A4" opacity=".14"/>`+bodyS(720,'#F3D9A4',0.55);
  for(let i=0;i<12;i++){const x=670+(i%4)*35+Math.sin(t*2+i)*5,y=380+Math.floor(i/4)*50;s+=zdot(x,y,12,true)}
  const tg=[[360,260,'ผิว',IC.skin],[1080,260,'ผม',IC.hair],[360,560,'ฮอร์โมน',SCALE(0,30,t).replace('<g transform="translate(0 30)">','<g transform="translate(0 30) scale(.4)">')],[1080,560,'ภูมิคุ้มกัน',IC.shield]];
  tg.forEach(([x,y,l,ic],i)=>{const p=cl((lt-0.4-i*0.3)/0.3);if(p<=0)return;const ph=((t*1.2+i*0.25)%1);s+=`<circle cx="${lerp(720,x,ph)}" cy="${lerp(430,y,ph)}" r="10" fill="#F3D9A4" opacity="${p*(1-ph)}"/>`+icoTile(x,y,p,l,ic).replace('scale(','scale(0.8*')});
  s+=`<g transform="translate(720 150)"><circle r="46" fill="#16171B" stroke="#D9B98A" stroke-width="5"/><path d="M0 0 V-28" stroke="#F3D9A4" stroke-width="6" stroke-linecap="round" transform="rotate(${t*180})"/><path d="M0 0 H18" stroke="#fff" stroke-width="6" stroke-linecap="round" transform="rotate(${t*15})"/></g>`;
  $('v7').innerHTML=s.replace(/scale\(0\.8\*([0-9.e-]+)\)/g,(m,a)=>`scale(${0.8*parseFloat(a)})`)}
 // S8 price may change
 if(on(25.3,29.0)){const lt=t-25.3;let s='';
  const flip=Math.floor(lt*5)%3;const vals=['฿179','฿???','฿199'];
  s+=priceTag2(720,330,lt<1.5?'฿179':vals[flip],cl(lt/0.35),true).replace('scale(','scale(1.6*').replace(/scale\(1\.6\*([0-9.e-]+)\)/,(m,a)=>`scale(${1.6*parseFloat(a)})`);
  s+=`<g transform="translate(1080 300)" opacity="${cl((lt-0.8)/0.3)}"><rect x="-110" y="-100" width="220" height="210" rx="24" fill="#16171B" stroke="#9AA0AC" stroke-width="5"/><rect x="-110" y="-100" width="220" height="56" rx="24" fill="#9AA0AC"/><text y="-60" text-anchor="middle" font-family="K" font-weight="900" font-size="30" fill="#16171B">อนาคต</text><text y="70" text-anchor="middle" font-family="K" font-weight="900" font-size="110" fill="#F3D9A4">?</text></g>`;
  s+=bigQ(380,260,0.9,t,cl((lt-1.2)/0.3));
  $('v8').innerHTML=s}
 // S9 upsize now
 if(on(29.0,35.5)){const lt=t-29.0;let s='';
  if(lt<5.0){const sh=cl((lt-0.4)/0.5);s+=`<g opacity="${1-0.6*sh}">${jarAt('box30.png',380,560,300)}</g>`;
   s+=pill(640,300,'+20 บาท',cl((lt-0.6)/0.3),'#E5484D','#fff',48);
   const g=eOB(cl((lt-1.0)/0.5));s+=`<g transform="translate(1000 600) scale(${g})">${jarAt('box60.png',0,0,500)}</g>`;
   {const sh=cl((lt-3.45)/0.3);if(sh>0){const k=eOB(sh);s+=`<g transform="translate(1180 560) scale(${k})"><rect x="-170" y="-70" width="340" height="140" rx="24" fill="#2A2210" stroke="#FFD36E" stroke-width="6"/><text y="36" text-anchor="middle" font-family="K" font-weight="900" font-size="100" fill="#FFD36E">฿179</text></g>`}}
   s+=`<g transform="translate(1000 120) scale(${eOB(cl((lt-1.6)/0.35))})"><path d="M-75 50 L-63 -30 L-33 10 L0 -45 L33 10 L63 -30 L75 50Z" fill="#F3D9A4" stroke="#7A5B2E" stroke-width="6" stroke-linejoin="round"/></g>`}
  if(lt>4.9){const k=cl((lt-4.9)/0.3);s+=`<g opacity="${k}">${jarAt('box60.png',380,560,330)}</g>`+calM(860,340,1,cl((lt-5.0)/0.35))+calM(1150,340,2,cl((lt-5.3)/0.35))+pill(1005,560,'60 เม็ด = 2 เดือน',cl((lt-5.5)/0.3),'#F3D9A4','#16171B',40)}
  $('v9').innerHTML=s}
 // S10 promo
 if(on(35.5,99)){const lt=t-35.5;const k=eOB(cl((lt-0.3)/0.35));
  $('v10').innerHTML=`<g transform="translate(1040 190) scale(${k}) rotate(${Math.sin(t*4)*6})"><polygon points="${[...Array(24)].map((_,i)=>{const a=i/24*6.283,r=i%2?0.78:1;return (Math.cos(a)*150*r).toFixed(0)+','+(Math.sin(a)*100*r).toFixed(0)}).join(' ')}" fill="#E5484D" stroke="#fff" stroke-width="7"/><text y="-4" text-anchor="middle" font-family="K" font-weight="900" font-size="44" fill="#fff">โปรเปิดตัว</text><text y="44" text-anchor="middle" font-family="K" font-weight="900" font-size="40" fill="#FFE08A">฿179</text></g>`+sparkle(420,200,1.3,(lt%1)/0.5)+sparkle(1080,520,1.1,((lt+0.4)%1)/0.5)+sparkle(380,520,1,((lt+0.7)%1)/0.5)}
};
