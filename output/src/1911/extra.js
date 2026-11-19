// ---- local helpers (lib1711.js is prepended: person, check, cross, tag, znCoin, ZG ...) ----
const IMG=(f,x,y,w,h,extra)=>`<image href="${f}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid meet" ${extra||''}/>`;
const JR={'biotin.png':0.537,'bisplus.png':0.533,'jar.png':0.536,'box30.png':0.63,'box60.png':0.63};
const jarAt=(f,cx,by,h,extra)=>{const w=h*JR[f];return IMG(f,cx-w/2,by-h,w,h,extra)};
function pill(x,y,txt,p,bg,fg,fs){if(p<=0)return '';const k=eOB(cl(p));fs=fs||44;const w=txt.length*fs*0.6+60;return `<g transform="translate(${x} ${y}) scale(${k})"><rect x="${-w/2}" y="${-fs*0.85}" width="${w}" height="${fs*1.7}" rx="${fs*0.85}" fill="${bg}" stroke="#fff" stroke-width="4"/><text y="${fs*0.36}" text-anchor="middle" font-family="K" font-weight="900" font-size="${fs}" fill="${fg}">${txt}</text></g>`};
function coin(x,y,r){return `<g transform="translate(${x} ${y})"><ellipse rx="${r}" ry="${r*0.36}" cy="${r*0.14}" fill="#8A6731"/><ellipse rx="${r}" ry="${r*0.36}" fill="#F3D9A4" stroke="#B8862F" stroke-width="3"/><text y="${r*0.16}" text-anchor="middle" font-family="K" font-weight="900" font-size="${r*0.5}" fill="#7A5B2E">฿</text></g>`};
function sparkle(x,y,s,p){if(p<=0)return '';const k=Math.sin(Math.PI*cl(p));return `<path transform="translate(${x} ${y}) scale(${s*k})" d="M0 -30 L7 -7 L30 0 L7 7 L0 30 L-7 7 L-30 0 L-7 -7Z" fill="#FFF3C4"/>`};
function cup(x,y,s,prem){let g=`<g transform="translate(${x} ${y}) scale(${s})">`;
 g+=`<ellipse cx="0" cy="96" rx="130" ry="20" fill="rgba(0,0,0,.35)"/><path d="M-100 -60 L-84 80 Q-80 96 -60 96 L60 96 Q80 96 84 80 L100 -60Z" fill="${prem?'#F3D9A4':'#E7E3DA'}" stroke="${prem?'#7A5B2E':'#9AA0AC'}" stroke-width="6"/>`;
 g+=`<path d="M98 -30 Q150 -28 146 16 Q142 56 90 50" fill="none" stroke="${prem?'#7A5B2E':'#9AA0AC'}" stroke-width="12"/><ellipse cx="0" cy="-60" rx="100" ry="22" fill="#5A3A22" stroke="${prem?'#7A5B2E':'#9AA0AC'}" stroke-width="6"/>`;
 if(prem)g+=`<path d="M0 -72 C-30 -86 -40 -56 0 -46 C40 -56 30 -86 0 -72Z" fill="#F7E7CF"/><path d="M-60 -120 Q-50 -150 -60 -170 M0 -125 Q10 -155 0 -180 M60 -120 Q70 -150 60 -170" stroke="#F3D9A4" stroke-width="6" fill="none" opacity=".6"/>`;
 return g+'</g>'};
function puzzle(x,y,s,col,stroke){return `<path transform="translate(${x} ${y}) scale(${s})" d="M-100 -100 H-30 A30 30 0 1 1 30 -100 H100 V-30 A30 30 0 1 1 100 30 V100 H30 A30 30 0 1 0 -30 100 H-100 V30 A30 30 0 1 0 -100 -30Z" fill="${col}" stroke="${stroke||'#16171B'}" stroke-width="6"/>`};

var CHARTV=(typeof CHARTV!=='undefined')?CHARTV:2;
function axes(X0,Y0,W,H,HM,yl,step){let s=`<path d="M${X0} ${Y0-H-20} V${Y0} H${X0+W+30}" stroke="#9AA0AC" stroke-width="5" fill="none"/>`;
 for(let h=0;h<=HM;h+=step)s+=`<text x="${X0+W*h/HM}" y="${Y0+44}" text-anchor="middle" font-family="K" font-weight="800" font-size="30" fill="#9AA0AC">${h}</text>`;
 return s+`<text x="${X0+W}" y="${Y0+90}" text-anchor="end" font-family="K" font-weight="800" font-size="28" fill="#9AA0AC">ชั่วโมง</text><text x="${X0-20}" y="${Y0-H-34}" font-family="K" font-weight="800" font-size="28" fill="#9AA0AC">${yl}</text>`}
function legend(){return jarAt('jar.png',1300,300,140)+jarAt('biotin.png',1260,440,90)+jarAt('bisplus.png',1340,440,90)+`<rect x="1240" y="312" width="120" height="8" rx="4" fill="#F3D9A4"/><rect x="1225" y="452" width="70" height="6" rx="3" fill="#3A5FA0"/><rect x="1305" y="452" width="70" height="6" rx="3" fill="#2EC4B6"/>`}
function lineChart(lt,sp,HM,fns,mark,yl){let s='';const X0=230,Y0=640,W=980,H=420;s+=axes(X0,Y0,W,H,HM,yl||'ซิงค์ในร่างกาย',2);
 const pr=cl((lt-0.15)/sp),N=150;
 fns.forEach(([fn,col,wid,area])=>{let d='';const n=Math.max(2,Math.floor(N*pr));for(let i=0;i<=n;i++){const h=HM*i/N,x=X0+W*h/HM,y=Y0-H*fn(h);d+=(i?'L':'M')+x.toFixed(1)+' '+y.toFixed(1)}
  if(area){const xe=X0+W*n/N;s+=`<path d="${d} L${xe} ${Y0} L${X0} ${Y0}Z" fill="${col}" opacity=".18"/>`}
  s+=`<path d="${d}" stroke="${col}" stroke-width="${wid}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`});
 if(mark){const k=cl((lt-sp*0.8)/0.3);if(k>0){const [mh,mv,lab]=mark,x=X0+W*mh/HM,y=Y0-H*mv;s+=`<path d="M${x} ${y-30} V${Y0}" stroke="#F3D9A4" stroke-width="4" stroke-dasharray="10 8" opacity="${k}"/>`+pill(x,y-70,lab,k,'#F3D9A4','#16171B',40)}}
 return s+legend()}
function chart(lt,sp){
 if(CHARTV==1){ // first version: others spike and drop fast, iCAP plateau to 6 h
  return lineChart(lt,sp,8,[[h=>0.78*(h/0.9)*Math.exp(1-h/0.9),'#3A5FA0',8],[h=>0.7*(h/1.1)*Math.exp(1-h/1.1),'#2EC4B6',8],[h=>0.62*(1-Math.exp(-h*1.4))*(h<6?1:Math.exp(-(h-6)*1.2)),'#F3D9A4',12,true]],[6,0.62,'6 ชม.'])}
 if(CHARTV==2){ // others peak 2-3 h then gradual; iCAP plateau then clear decline
  return lineChart(lt,sp,8,[[h=>0.68*Math.pow(h/2.4,2)*Math.exp(2*(1-h/2.4)),'#3A5FA0',8],[h=>0.6*Math.pow(h/2.8,2)*Math.exp(2*(1-h/2.8)),'#2EC4B6',8],[h=>0.62*(1-Math.exp(-h*1.1))*(h<6?1:Math.exp(-(h-6)*0.3)),'#F3D9A4',12,true]],[6,0.62,'6 ชม.'])}
 if(CHARTV==3){ // 12 h axis: iCAP plateau to 6 h, gentle tail to 12; others peak 2 h, gone by ~8 h
  return lineChart(lt,sp,12,[[h=>0.66*Math.pow(h/2,2.2)*Math.exp(2.2*(1-h/2)),'#3A5FA0',8],[h=>0.58*Math.pow(h/2.3,2.2)*Math.exp(2.2*(1-h/2.3)),'#2EC4B6',8],[h=>0.64*(1-Math.exp(-h*1.0))*(h<6?1:Math.exp(-(h-6)*0.28)),'#F3D9A4',12,true]],[6,0.63,'6 ชม.'])}
 if(CHARTV==4){ // timeline bars: how long zinc keeps working
  let s='';const X0=330,W=880;s+=axes(X0,640,W,420,12,'',2).replace(/<path[^>]*\/>/,`<path d="M${X0} 640 H${X0+W+30}" stroke="#9AA0AC" stroke-width="5"/>`);
  const rows=[['biotin.png',0.4,3.5,'#3A5FA0'],['bisplus.png',0.4,4,'#2EC4B6'],['jar.png',0.6,10,'#F3D9A4']];
  rows.forEach(([f,a,b2,c],i)=>{const y=210+i*140,p=eOC(cl((lt-0.15-i*0.15)/(0.5+b2*0.08)));const x1=X0+W*a/12,x2=X0+W*lerp(a,b2,p)/12;
   s+=jarAt(f,X0-90,y+60,i==2?140:110)+`<rect x="${X0}" y="${y-30}" width="${W}" height="60" rx="30" fill="rgba(255,255,255,.07)"/><rect x="${x1}" y="${y-26}" width="${Math.max(0,x2-x1)}" height="52" rx="26" fill="${c}"/>`;
   if(i==2){let gl='';for(let j=0;j<6;j++){const xx=x1+((lt*120+j*90)%Math.max(1,x2-x1));gl+=`<circle cx="${xx}" cy="${y}" r="7" fill="#fff" opacity=".6"/>`}s+=gl}});
  const k=cl((lt-sp*0.8)/0.3);if(k>0){const x=X0+W*6/12;s+=`<path d="M${x} 150 V640" stroke="#F3D9A4" stroke-width="4" stroke-dasharray="10 8" opacity="${k}"/>`+pill(x,130,'ปล่อยต่อเนื่อง 6 ชม.',k,'#F3D9A4','#16171B',36)}
  return s}
 // CHARTV==5: two smooth curves only, "ทั่วไป" vs iCAP, with glowing dots and labels
 let s='';const X0=230,Y0=640,W=1000,H=430,HM=12;s+=axes(X0,Y0,W,H,HM,'ซิงค์ในร่างกาย',2);
 const pr=cl((lt-0.15)/sp),N=150,n=Math.max(2,Math.floor(N*pr));
 const gen=h=>0.72*Math.pow(h/2.2,2)*Math.exp(2*(1-h/2.2)),ic=h=>0.66*(1-Math.exp(-h*0.9))*(h<6.5?1:Math.exp(-(h-6.5)*0.3));
 const path=fn=>{let d='';for(let i=0;i<=n;i++){const h=HM*i/N;d+=(i?'L':'M')+(X0+W*h/HM).toFixed(1)+' '+(Y0-H*fn(h)).toFixed(1)}return d};
 const dg=path(gen),di=path(ic),xe=X0+W*n/N;
 s+=`<path d="${dg} L${xe} ${Y0} L${X0} ${Y0}Z" fill="#7FA8E0" opacity=".12"/><path d="${di} L${xe} ${Y0} L${X0} ${Y0}Z" fill="#F3D9A4" opacity=".22"/>`;
 s+=`<path d="${dg}" stroke="#7FA8E0" stroke-width="8" fill="none" stroke-dasharray="2 14" stroke-linecap="round"/><path d="${di}" stroke="#F3D9A4" stroke-width="12" fill="none" stroke-linecap="round"/>`;
 const he=HM*n/N;s+=`<circle cx="${X0+W*he/HM}" cy="${Y0-H*ic(he)}" r="14" fill="#fff" stroke="#F3D9A4" stroke-width="6"/>`;
 const k=cl((lt-sp*0.85)/0.3);
 if(k>0)s+=pill(X0+W*2.0/HM,Y0-H*0.72-60,'สูตรทั่วไป: พุ่งแล้วหมดไว',k,'#16171B','#9CC0FF',30)+pill(X0+W*9.2/HM,Y0-H*0.66-60,'iCAP: ค่อยๆ ปล่อย อยู่นาน',k,'#F3D9A4','#16171B',30);
 return s}
function silverCoin(x,y,r){return `<defs><radialGradient id="sg7" cx=".35" cy=".3" r=".85"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".55" stop-color="#C9CED8"/><stop offset="1" stop-color="#7C838F"/></radialGradient></defs><g transform="translate(${x} ${y})"><circle r="${r}" fill="url(#sg7)" stroke="#5B616B" stroke-width="5"/><circle r="${r*0.82}" fill="none" stroke="#fff" stroke-width="3" opacity=".6"/><text y="${r*0.33}" text-anchor="middle" font-family="Arial" font-weight="700" font-size="${r*0.9}" fill="#3A3F47">Zn</text></g>`};
window.extra=function(t){
 const on=(a,b)=>t>=a-0.05&&t<b+0.45;
 // S1 race
 if(on(0,1.55)){const lt=t;let s=ZG;
  const lanes=[['biotin.png',0.55,'#3A5FA0'],['bisplus.png',0.68,'#2EC4B6'],['jar.png',1.0,'#F3D9A4']];
  s+=`<rect x="150" y="150" width="1140" height="540" rx="30" fill="rgba(22,23,27,.75)" stroke="rgba(255,255,255,.15)" stroke-width="3"/>`;
  for(let i=0;i<16;i++)for(let j=0;j<2;j++)s+=`<rect x="${1150+j*32}" y="${160+i*32}" width="32" height="32" fill="${(i+j)%2?'#fff':'#16171B'}"/>`;
  s+=`<text x="1195" y="140" text-anchor="middle" font-family="K" font-weight="900" font-size="32" fill="#F3D9A4">ดูดซึม</text>`;
  lanes.forEach(([f,sp,c],i)=>{const y=230+i*170;s+=`<path d="M170 ${y+70} H1140" stroke="rgba(255,255,255,.18)" stroke-width="3" stroke-dasharray="20 16"/>`;
   const p=eIO(cl(lt/1.3));const x=230+870*sp*p;
   s+=`<path d="M230 ${y+30} H${x-40}" stroke="${c}" stroke-width="10" stroke-linecap="round" opacity=".55"/>`;
   const b=Math.abs(Math.sin(t*14+i))*10;s+=jarAt(f,x,y+90-b,i==2?190:160);
   if(i==2&&lt>1.15)s+=pill(x-150,y+10,'ชนะ!',cl((lt-1.15)/0.25),'#F3D9A4','#16171B',38)});
  $('v1').innerHTML=s}
 // S2 chart
 if(on(1.55,3.72)){$('v2').innerHTML=chart(t-1.55,1.5)}
 // S3 seesaw
 if(on(3.72,5.36)){const lt=t-3.72;let s='';
  const ncoin=Math.floor(cl((lt-0.3)/0.6)*3);const tilt=-(2+ncoin*1.6)+Math.sin(t*5)*0.6*Math.exp(-lt);
  s+=`<path d="M720 420 L660 600 H780Z" fill="#D9B98A" stroke="#7A5B2E" stroke-width="5"/>`;
  s+=`<g transform="rotate(${-tilt} 720 420)"><rect x="300" y="404" width="840" height="30" rx="15" fill="#F3D9A4" stroke="#7A5B2E" stroke-width="5"/>`;
  s+=jarAt('biotin.png',420,404,190)+jarAt('bisplus.png',560,404,190)+jarAt('jar.png',1000,404,230);
  for(let i=0;i<ncoin+1&&i<4;i++){const dp=cl((lt-0.3-i*0.2)/0.25);if(dp<=0)continue;const yy=lerp(60,392-i*16,eOC(dp));s+=coin(1110,yy,34)}
  s+=`</g>`;
  s+=pill(1020,690,'แพงกว่านิดเดียว',cl((lt-0.9)/0.3),'#F3D9A4','#16171B',38);
  $('v3').innerHTML=s}
 // S4 magnifier over capsule
 if(on(5.36,7.32)){const lt=t-5.36;let s='';const mx=720+Math.sin(lt*2.2)*60,my=230+Math.cos(lt*1.7)*40;
  s+=`<g transform="translate(${mx} ${my})"><circle r="120" fill="rgba(255,255,255,.08)" stroke="#D9B98A" stroke-width="16"/><path d="M85 85 L150 150" stroke="#7A5B2E" stroke-width="30" stroke-linecap="round"/><path d="M-70 -40 A80 80 0 0 1 -30 -78" stroke="#fff" stroke-width="8" fill="none" opacity=".5" stroke-linecap="round"/></g>`;
  [[560,180,0.3],[880,260,0.7],[640,420,1.0],[820,120,1.3],[900,430,1.6]].forEach(([x,y,d])=>{s+=sparkle(x,y,1.1,((lt-d)%1.2+1.2)%1.2/0.6)});
  s+=pill(1060,420,'ซิงค์คุณภาพ',cl((lt-0.9)/0.3),'#F3D9A4','#16171B',44)+check(1180,330,40,cl((lt-1.1)/0.3));
  $('v4').innerHTML=s}
 // S5 different process, different price
 if(on(7.32,9.45)){const lt=t-7.32;let s=`<defs><radialGradient id="gP5" cx=".35" cy=".3" r=".75"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".55" stop-color="#F3EEE3"/><stop offset="1" stop-color="#BFB6A3"/></radialGradient></defs>`;
  const gear=(x,y,r,a,col)=>{let d='';for(let i=0;i<8;i++){const t0=i/8*6.283;d+=`<rect x="${-r*0.18}" y="${-r*1.22}" width="${r*0.36}" height="${r*0.4}" rx="4" transform="rotate(${t0*57.3})"/>`}return `<g transform="translate(${x} ${y}) rotate(${a})" fill="${col}">${d}<circle r="${r}"/><circle r="${r*0.4}" fill="#16171B"/></g>`};
  // left panel: ordinary formula
  s+=`<rect x="130" y="110" width="520" height="540" rx="36" fill="rgba(22,23,27,.85)" stroke="rgba(255,255,255,.25)" stroke-width="4"/><text x="390" y="180" text-anchor="middle" font-family="K" font-weight="900" font-size="42" fill="#C9CED8">สูตรทั่วไป</text>`;
  s+=gear(390,290,46,t*60,'#6B7280');
  s+=`<ellipse cx="390" cy="450" rx="90" ry="46" fill="#F1EFEA" stroke="#9AA0AC" stroke-width="5"/><path d="M390 410 V490" stroke="#C9CED8" stroke-width="5"/>`;
  s+=pill(390,580,'฿',cl((lt-0.5)/0.3),'#16171B','#F3D9A4',48);
  // right panel: iCAP pellets in capsule (more steps)
  s+=`<rect x="790" y="110" width="520" height="540" rx="36" fill="rgba(22,23,27,.9)" stroke="#D9B98A" stroke-width="5"/><text x="1050" y="180" text-anchor="middle" font-family="K" font-weight="900" font-size="42" fill="#F3D9A4">iCAP</text>`;
  s+=gear(960,290,40,t*90,'#D9B98A')+gear(1050,270,30,-t*120,'#F3D9A4')+gear(1140,290,40,t*90,'#D9B98A');
  const ps=[];let k=3;const rr=()=>{k=(k*16807)%2147483647;return (k-1)/2147483646};
  let caps=`<g transform="translate(1050 450) rotate(-12)"><path d="M0 -50 H-80 A50 50 0 0 0 -80 50 H0Z" fill="rgba(255,255,255,.15)" stroke="#fff" stroke-width="4"/>`;
  for(let i=0;i<16;i++)caps+=`<circle cx="${-20-rr()*95}" cy="${(rr()-.5)*70}" r="${9+rr()*4}" fill="url(#gP5)"/>`;
  caps+=`<path d="M-4 -52 H80 A52 52 0 0 1 80 52 H-4Z" fill="#F4EFE4" stroke="#B9AF9B" stroke-width="4"/><text x="44" y="12" text-anchor="middle" font-family="Arial" font-weight="700" font-size="30" fill="#4A4A4A">Zn</text></g>`;
  s+=caps+pill(1050,580,'฿฿',cl((lt-0.7)/0.3),'#F3D9A4','#16171B',48);
  s+=pill(1050,350,'ผลิตซับซ้อนกว่า',cl((lt-0.9)/0.3),'#16171B','#F3D9A4',32);
  s+=check(1290,120,44,cl((lt-1.4)/0.3));
  $('v5').innerHTML=s}
 // S6 exploded capsule
 if(on(9.45,10.98)){const lt=t-9.45;let s='';const e=eOC(cl((lt-0.3)/0.6));
  const cx=1000,cy=330;
  s+=`<g transform="translate(${cx} ${cy-80-e*70}) rotate(${-20*e})"><path d="M-80 60 V-10 A80 80 0 0 1 80 -10 V60Z" fill="rgba(255,255,255,.18)" stroke="#fff" stroke-width="5"/></g>`;
  s+=`<g transform="translate(${cx} ${cy+80+e*70}) rotate(${15*e})"><path d="M-84 -60 V20 A84 84 0 0 0 84 20 V-60Z" fill="#F4EFE4" stroke="#B9AF9B" stroke-width="5"/><text y="20" text-anchor="middle" font-family="Arial" font-weight="700" font-size="36" fill="#4A4A4A">Zn</text></g>`;
  let k=5;const rr=()=>{k=(k*16807)%2147483647;return (k-1)/2147483646};
  for(let i=0;i<34;i++){const a=rr()*6.28,d=40+rr()*220*e,r=10+rr()*8;const x=cx+Math.cos(a)*d*1.3,y=cy+Math.sin(a)*d*0.7;s+=`<circle cx="${x}" cy="${y}" r="${r}" fill="url(#gPl6)" stroke="#BFB6A3" stroke-width="1.5"/>`}
  s=`<defs><radialGradient id="gPl6" cx=".35" cy=".3" r=".75"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".55" stop-color="#F3EEE3"/><stop offset="1" stop-color="#BFB6A3"/></radialGradient></defs>`+s;
  s+=pill(1000,620,'Pellet Technology',cl((lt-0.8)/0.3),'#F3D9A4','#16171B',40);
  
  $('v6').innerHTML=s}
 // S7 person: quality
 if(on(10.98,13.14)){const lt=t-10.98;let s=ZG;
  s+=person({x:360,y:700,s:1.0,g:'m',mood:lt>1.3?'happy':'neutral'});
  [[570,330,14],[610,270,20],[660,210,26]].forEach(([x,y,r],i)=>{s+=`<circle cx="${x}" cy="${y}" r="${r*cl((lt-0.3-i*0.1)/0.2)}" fill="#fff" opacity=".9"/>`});
  const bub=cl((lt-0.55)/0.35);if(bub>0){const k=eOB(bub);s+=`<g transform="translate(1000 300) scale(${k})"><ellipse rx="330" ry="210" fill="#fff"/></g>`}
  const p=cl((lt-0.95)/0.35);if(p>0){const k=eOB(p);s+=`<g transform="translate(1000 260) scale(${k})">${silverCoin(0,0,95)}<text y="160" text-anchor="middle" font-family="K" font-weight="900" font-size="48" fill="#16171B">ซิงค์คุณภาพ</text></g>`+check(1075,190,34,cl((lt-1.25)/0.3))+sparkle(1110,170,1,((lt-1.2)%1+1)%1/0.5)}
  $('v7').innerHTML=s}
 // S8 gut simulation
 if(on(13.14,15.66)){const lt=t-13.14;let s=`<defs><linearGradient id="bl8" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B3262C"/><stop offset="1" stop-color="#7A1418"/></linearGradient></defs>`;
  const panel=(x0,lab,good,col,icon)=>{let g=`<g transform="translate(${x0} 0)"><rect x="0" y="100" width="560" height="560" rx="34" fill="rgba(22,23,27,.85)" stroke="${good?'#D9B98A':'rgba(255,255,255,.25)'}" stroke-width="5"/>`;
   g+=`<text x="280" y="160" text-anchor="middle" font-family="K" font-weight="900" font-size="38" fill="${good?'#F3D9A4':'#C9CED8'}">${lab}</text>`;
   // gut wall with villi
   let v='';for(let i=0;i<9;i++){const x=40+i*60;v+=`<path d="M${x} 470 V${400} A26 26 0 0 1 ${x+52} 400 V470" fill="#E8907E" stroke="#B5574A" stroke-width="4"/>`}
   g+=`<rect x="20" y="460" width="520" height="40" fill="#E8907E"/>`+v;
   g+=`<rect x="20" y="520" width="520" height="110" rx="20" fill="url(#bl8)"/><text x="40" y="610" font-family="K" font-weight="800" font-size="26" fill="#FFD0C8">กระแสเลือด</text>`;
   // particles
   let k=good?17:29;const rr=()=>{k=(k*16807)%2147483647;return (k-1)/2147483646};let pass=0;
   for(let i=0;i<22;i++){const st=rr()*1.6,x=50+rr()*460,ok=good?rr()<0.85:rr()<0.35;const p=cl((lt-0.2-st)/0.9);if(p<=0)continue;
    let y;if(ok){y=lerp(200,575,eIO(p));if(p>=1)pass++}else{y=p<0.6?lerp(200,385,p/0.6):lerp(385,300,(p-0.6)/0.4)}
    g+=`<circle cx="${x}" cy="${y}" r="13" fill="${col}" stroke="#fff" stroke-width="2" opacity="${ok||p<0.9?1:1-(p-0.9)*10}"/>`}
   g+=icon+`</g>`;return g};
  s+=panel(110,'สูตรทั่วไป',false,'#7FA8E0','')+panel(770,'iCAP',true,'#F3D9A4','');
  s+=pill(1050,700,'ซึมเข้าเลือดได้ดีกว่า',cl((lt-1.6)/0.3),'#F3D9A4','#16171B',34);
  $('v8g').innerHTML=s}
 // S9 chart again
 if(on(15.66,17.55)){$('v9c').innerHTML=chart(t-15.66,1.2)}
 if(on(18.66,22.3)){const lt=t-18.66;const p=cl((lt-2.5)/0.35);let s='';
  if(p>0){const k=eOB(p);s+=`<g transform="translate(720 360) scale(${k})"><circle r="56" fill="#16171B" stroke="#D9B98A" stroke-width="6"/><text y="22" text-anchor="middle" font-family="K" font-weight="900" font-size="64" fill="#F3D9A4">≈</text></g>`}
  $('p8').innerHTML=s}
};
