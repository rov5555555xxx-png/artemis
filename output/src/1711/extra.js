const lerp=(a,b,p)=>a+(b-a)*p;
const SK='#F2C7A0',SKD='#D9A57C',HAIR='#1E1A17';
// ---------- person (front view) : feet at (0,0), head top ~ -520 ----------
function person(o){
 const g=o.g||'m',fat=o.fat||0,mood=o.mood||'neutral',arm=o.arm||0;
 const sw=g==='m'?84:68, ww=(g==='m'?58:44)+fat*(g==='m'?46:30), hw=g==='m'?66:(74+fat*20), bw=g==='m'?0:0;
 const top=o.shirt||(g==='m'?'#3B4F7A':'#2A2D35'), pants=o.pants||(g==='m'?'#22252B':'#1B1D22');
 let s='';
 // legs
 s+=`<path d="M${-hw+4} -230 L${-hw+14} -8 L-14 -8 L-6 -205 L6 -205 L14 -8 L${hw-14} -8 L${hw-4} -230Z" fill="${pants}"/>`;
 s+=`<ellipse cx="${-hw/2-4}" cy="-4" rx="30" ry="12" fill="#111"/><ellipse cx="${hw/2+4}" cy="-4" rx="30" ry="12" fill="#111"/>`;
 // arms (behind torso edges)
 const aL=`M${-sw+8} -392 Q${-sw-24-fat*14} -300 ${-sw-14-fat*16} -${200+arm*150}`;
 const aR=`M${sw-8} -392 Q${sw+24+fat*14} -300 ${sw+14+fat*16} -${200+arm*150}`;
 s+=`<path d="${aL}" stroke="${SK}" stroke-width="${30+fat*8}" stroke-linecap="round" fill="none"/><path d="${aR}" stroke="${SK}" stroke-width="${30+fat*8}" stroke-linecap="round" fill="none"/>`;
 // torso skin base + shirt
 const belly=fat*26;
 const torso=`M-22 -420 L${-sw} -400 Q${-sw-6} -330 ${-ww} -${300-belly*0.3} Q${-ww-belly} -262 ${-hw} -228 L${hw} -228 Q${ww+belly} -262 ${ww} -${300-belly*0.3} Q${sw+6} -330 ${sw} -400 L22 -420Z`;
 if(o.shirtless){s+=`<path d="${torso}" fill="${SK}"/>`;
  s+=`<path d="M-40 -345 Q0 ${-335+fat*14} 40 -345" stroke="${SKD}" stroke-width="4" fill="none" opacity=".7"/>`; // chest line
  s+=`<ellipse cx="0" cy="${-268+fat*6}" rx="${8+fat*4}" ry="5" fill="${SKD}"/>`; // navel
  if(fat>0.3)s+=`<path d="M${-ww+6} -250 Q0 ${-226+fat*12} ${ww-6} -250" stroke="${SKD}" stroke-width="5" fill="none" opacity=".8"/>`;
  s+=`<path d="M${-hw} -236 L${hw} -236 L${hw} -222 L${-hw} -222Z" fill="${pants}"/>`;
 } else {
  s+=`<path d="${torso}" fill="${top}"/>`;
  if(g==='f')s+=`<path d="M${-sw+10} -398 Q0 -360 ${sw-10} -398" stroke="rgba(255,255,255,.18)" stroke-width="6" fill="none"/>`;
 }
 // neck + head
 s+=`<rect x="-18" y="-448" width="36" height="40" rx="10" fill="${SKD}"/>`;
 s+=`<ellipse cx="0" cy="-492" rx="${54+fat*6}" ry="${60+fat*4}" fill="${SK}"/>`;
 if(g==='m')s+=`<path d="M-56 -500 Q-58 -560 0 -562 Q58 -560 56 -500 Q40 -532 0 -530 Q-30 -530 -56 -500Z" fill="${HAIR}"/>`;
 else s+=`<path d="M-60 -470 Q-70 -566 0 -568 Q70 -566 60 -470 Q58 -528 0 -530 Q-58 -528 -60 -470Z" fill="${HAIR}"/><path d="M40 -540 Q96 -520 84 -440 Q74 -470 52 -480Z" fill="${HAIR}"/>`;
 // face
 const ey=-494;
 if(mood==='sad'||mood==='tired'){s+=`<path d="M-30 ${ey-16} L-12 ${ey-10}M30 ${ey-16} L12 ${ey-10}" stroke="${HAIR}" stroke-width="5" stroke-linecap="round"/>`;
  s+=mood==='tired'?`<path d="M-30 ${ey} Q-20 ${ey+6} -10 ${ey}M10 ${ey} Q20 ${ey+6} 30 ${ey}" stroke="${HAIR}" stroke-width="5" fill="none" stroke-linecap="round"/>`:`<circle cx="-20" cy="${ey}" r="6" fill="${HAIR}"/><circle cx="20" cy="${ey}" r="6" fill="${HAIR}"/>`;
  s+=`<path d="M-16 ${ey+40} Q0 ${ey+28} 16 ${ey+40}" stroke="#8A3B2E" stroke-width="5" fill="none" stroke-linecap="round"/>`}
 else if(mood==='happy'){s+=`<path d="M-30 ${ey+2} Q-20 ${ey-10} -10 ${ey+2}M10 ${ey+2} Q20 ${ey-10} 30 ${ey+2}" stroke="${HAIR}" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M-20 ${ey+26} Q0 ${ey+46} 20 ${ey+26}Z" fill="#8A3B2E"/>`}
 else {s+=`<circle cx="-20" cy="${ey}" r="6" fill="${HAIR}"/><circle cx="20" cy="${ey}" r="6" fill="${HAIR}"/><path d="M-12 ${ey+32} H12" stroke="#8A3B2E" stroke-width="5" stroke-linecap="round"/>`}
 s+=`<ellipse cx="-34" cy="${ey+18}" rx="10" ry="6" fill="#F09A8A" opacity=".5"/><ellipse cx="34" cy="${ey+18}" rx="10" ry="6" fill="#F09A8A" opacity=".5"/>`;
 return `<g transform="translate(${o.x} ${o.y}) scale(${o.s||1})">${s}</g>`;
}
// ---------- small helpers ----------
const sym=(x,y,r,k,t)=>{ // gender symbol
 const c=k==='m'?'#5B9BFF':'#FF7BB0';let s=`<g transform="translate(${x} ${y})"><circle r="${r}" fill="#16171B" stroke="${c}" stroke-width="${r*0.12}"/>`;
 const q=r*0.32;
 if(k==='m')s+=`<circle cx="${-q*0.4}" cy="${q*0.4}" r="${q}" fill="none" stroke="${c}" stroke-width="${r*0.12}"/><path d="M${q*0.3} ${-q*0.3}L${q*1.4} ${-q*1.4}M${q*0.5} ${-q*1.4}H${q*1.4}V${-q*0.5}" stroke="${c}" stroke-width="${r*0.12}" fill="none" stroke-linecap="round"/>`;
 else s+=`<circle cy="${-q*0.4}" r="${q}" fill="none" stroke="${c}" stroke-width="${r*0.12}"/><path d="M0 ${q*0.6}V${q*1.8}M${-q*0.6} ${q*1.25}H${q*0.6}" stroke="${c}" stroke-width="${r*0.12}" stroke-linecap="round"/>`;
 return s+'</g>'};
function vmeter(x,y,h,lv,col,lab){ // vertical hormone tube, lv 0..1
 let s=`<g transform="translate(${x} ${y})"><rect x="-34" y="0" width="68" height="${h}" rx="34" fill="rgba(255,255,255,.08)" stroke="rgba(255,255,255,.35)" stroke-width="4"/>`;
 const fh=(h-12)*lv;s+=`<rect x="-28" y="${h-6-fh}" width="56" height="${fh}" rx="28" fill="${col}"/>`;
 s+=`<rect x="-20" y="12" width="10" height="${h-24}" rx="5" fill="#fff" opacity=".18"/>`;
 if(lab)s+=`<text x="0" y="${h+50}" text-anchor="middle" font-family="K" font-weight="900" font-size="34" fill="#F3D9A4">${lab}</text>`;
 return s+'</g>'};
function bicep(x,y,sc,size,col){ // flexed arm: upper arm horizontal, forearm up, fist on top
 const b=18+size*62;
 return `<g transform="translate(${x} ${y}) scale(${sc})"><path d="M-150 64 L40 64 Q84 64 84 22 L74 -78 Q94 -96 86 -128 Q68 -162 24 -154 Q-6 -146 -2 -114 Q6 -96 22 -90 L26 -22 Q-8 ${-22-b} -62 ${-22-b*0.85} Q-124 ${-22-b*0.55} -150 -24 Z" fill="${col||SK}" stroke="#7A4E2E" stroke-width="6" stroke-linejoin="round"/><path d="M-110 ${-14-b*0.45} Q-60 ${-14-b*0.85} -12 -26" stroke="#fff" stroke-width="6" fill="none" opacity=".35" stroke-linecap="round"/><path d="M12 -126 Q30 -134 50 -128" stroke="#7A4E2E" stroke-width="5" fill="none" opacity=".6"/></g>`};
function fatBlob(x,y,r,p,ph){ if(p<=0)return '';const k=eOB(cl(p));
 return `<g transform="translate(${x} ${y}) scale(${k})"><ellipse rx="${r}" ry="${r*0.8}" fill="#FFD36E" stroke="#C99A2E" stroke-width="4" opacity=".92"/><ellipse cx="${-r*0.3}" cy="${-r*0.3}" rx="${r*0.3}" ry="${r*0.2}" fill="#fff" opacity=".5"/></g>`};
function ring(x,y,rx,ry,p,col){ if(p<=0)return '';const L=Math.PI*(rx+ry)*1.1;
 return `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="none" stroke="${col||'#FF3B3F'}" stroke-width="7" stroke-linecap="round" stroke-dasharray="${L}" stroke-dashoffset="${L*(1-eOC(cl(p)))}" transform="rotate(-8 ${x} ${y})"/>`};
function tag(x,y,txt,p,bg,fg){ if(p<=0)return '';const k=eOB(cl(p)),w=txt.length*30+60;
 return `<g transform="translate(${x} ${y}) scale(${k})"><rect x="${-w/2}" y="-36" width="${w}" height="72" rx="36" fill="${bg||'#FF3B3F'}" stroke="#fff" stroke-width="4"/><text y="16" text-anchor="middle" font-family="K" font-weight="900" font-size="42" fill="${fg||'#fff'}">${txt}</text></g>`};
function arrowV(x,y,len,up,col,p){ if(p<=0)return '';const L=len*eOC(cl(p)),d=up?-1:1;
 return `<g transform="translate(${x} ${y})"><path d="M0 0 V${d*L}" stroke="${col}" stroke-width="30" stroke-linecap="round"/><path d="M-44 ${d*(L-10)} L0 ${d*(L+44)} L44 ${d*(L-10)}Z" fill="${col}" stroke="${col}" stroke-width="8" stroke-linejoin="round"/></g>`};
function check(x,y,r,p){if(p<=0)return '';const k=eOB(cl(p));return `<g transform="translate(${x} ${y}) scale(${k})"><circle r="${r}" fill="#2EC4B6" stroke="#fff" stroke-width="6"/><path d="M${-r*0.45} ${r*0.05}l${r*0.3} ${r*0.3}l${r*0.6} ${-r*0.62}" fill="none" stroke="#fff" stroke-width="${r*0.22}" stroke-linecap="round" stroke-linejoin="round"/></g>`};
function cross(x,y,r,p){if(p<=0)return '';const k=eOB(cl(p));return `<g transform="translate(${x} ${y}) scale(${k}) rotate(${-8*(1-cl(p))})"><circle r="${r}" fill="#E5484D" stroke="#fff" stroke-width="6"/><path d="M${-r*0.4} ${-r*0.4}L${r*0.4} ${r*0.4}M${r*0.4} ${-r*0.4}L${-r*0.4} ${r*0.4}" stroke="#fff" stroke-width="${r*0.22}" stroke-linecap="round"/></g>`};
function heart(x,y,sc,col){return `<g transform="translate(${x} ${y}) scale(${sc})"><path d="M0 40 C-70 -10 -60 -70 -20 -70 C0 -70 0 -50 0 -46 C0 -50 0 -70 20 -70 C60 -70 70 -10 0 40Z" fill="${col}" stroke="#fff" stroke-width="5"/></g>`};
function gauge(cx,cy,R,val,t,lowLab,id){id=id||'h'; // semicircle: red low 0-.33, gold normal .33-.72, hatched over-normal .72-1
 const arc=(a0,a1,col,w)=>{const p0=[cx-R*Math.cos(Math.PI*a0),cy-R*Math.sin(Math.PI*a0)],p1=[cx-R*Math.cos(Math.PI*a1),cy-R*Math.sin(Math.PI*a1)];return `<path d="M${p0[0]} ${p0[1]} A${R} ${R} 0 0 1 ${p1[0]} ${p1[1]}" stroke="${col}" stroke-width="${w}" fill="none"/>`};
 let s=`<defs><pattern id="hatch${id}" width="18" height="18" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="18" height="18" fill="#3A3D44"/><rect width="8" height="18" fill="#5A5E68"/></pattern></defs>`;
 s+=arc(0,0.33,'#E5484D',70)+arc(0.33,0.72,'#D9B98A',70)+arc(0.72,1,`url(#hatch${id})`,70);
 const lab=(a,txt,col)=>{const r=R+(a>0.9?120:86);return `<text x="${cx-r*Math.cos(Math.PI*a)}" y="${cy-r*Math.sin(Math.PI*a)+14}" text-anchor="middle" font-family="K" font-weight="900" font-size="38" fill="${col}">${txt}</text>`};
 s+=lab(0.13,lowLab||'ต่ำ','#FF7B7F')+lab(0.525,'ปกติ','#F3D9A4')+lab(0.93,'สูงเกิน','#9AA0AC');
 const a=Math.PI*val,nx=cx-(R-20)*Math.cos(a),ny=cy-(R-20)*Math.sin(a);
 s+=`<path d="M${cx} ${cy} L${nx} ${ny}" stroke="#fff" stroke-width="16" stroke-linecap="round"/><circle cx="${cx}" cy="${cy}" r="30" fill="#16171B" stroke="#fff" stroke-width="8"/>`;
 return s};
function znCoin(x,y,r){return `<g transform="translate(${x} ${y})"><circle r="${r}" fill="url(#zg)" stroke="#7A5B2E" stroke-width="5"/><text y="${r*0.33}" text-anchor="middle" font-family="Arial" font-weight="700" font-size="${r*0.9}" fill="#4A3A1E">Zn</text></g>`};
const ZG=`<defs><radialGradient id="zg" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#FFF4D6"/><stop offset=".6" stop-color="#E6C68A"/><stop offset="1" stop-color="#B08A4C"/></radialGradient></defs>`;
function battery(x,y,lv,col){return `<g transform="translate(${x} ${y})"><rect x="-80" y="-44" width="160" height="88" rx="16" fill="#16171B" stroke="#fff" stroke-width="6"/><rect x="82" y="-18" width="14" height="36" rx="4" fill="#fff"/><rect x="-70" y="-34" width="${140*lv}" height="68" rx="9" fill="${col}"/></g>`};
function bed(x,y,sc){return `<g transform="translate(${x} ${y}) scale(${sc})"><rect x="-300" y="-170" width="40" height="230" rx="12" fill="#6B4A2E"/><rect x="-300" y="-30" width="600" height="70" rx="16" fill="#8A6240"/><rect x="-280" y="-80" width="580" height="60" rx="26" fill="#ECE6DA"/><rect x="-250" y="-120" width="150" height="56" rx="26" fill="#fff"/><path d="M-80 -86 Q120 -130 300 -84 L300 -30 L-80 -30Z" fill="#3B4F7A"/><rect x="-290" y="40" width="20" height="40" fill="#5A3E26"/><rect x="270" y="40" width="20" height="40" fill="#5A3E26"/></g>`};
function icoTile(x,y,p,label,draw){ if(p<=0)return '';const k=eOB(cl(p));
 return `<g transform="translate(${x} ${y}) scale(${k})"><circle r="88" fill="#16171B" stroke="#D9B98A" stroke-width="6"/>${draw}<text y="140" text-anchor="middle" font-family="K" font-weight="900" font-size="40" fill="#fff">${label}</text></g>`};
const IC={
 sperm:`<g fill="#F3D9A4" stroke="#F3D9A4"><ellipse cx="-14" cy="-6" rx="22" ry="16"/><path d="M6 -2 Q30 10 44 -10 Q56 -28 70 -14" stroke-width="7" fill="none" stroke-linecap="round"/><ellipse cx="-34" cy="30" rx="12" ry="9"/><path d="M-24 34 Q-10 40 0 30" stroke-width="4" fill="none"/></g>`,
 skin:`<g><circle cx="0" cy="-6" r="44" fill="${SK}"/><circle cx="-16" cy="-12" r="5" fill="${HAIR}"/><circle cx="16" cy="-12" r="5" fill="${HAIR}"/><path d="M-14 12 Q0 22 14 12" stroke="#8A3B2E" stroke-width="5" fill="none"/><path d="M32 -46 l6 12 12 6 -12 6 -6 12 -6 -12 -12 -6 12 -6z" fill="#FFF3C4"/></g>`,
 hair:`<g><circle cx="0" cy="10" r="40" fill="${SK}"/><path d="M-46 14 Q-56 -50 0 -52 Q56 -50 46 14 Q40 -20 0 -22 Q-36 -20 -46 14Z" fill="${HAIR}"/><path d="M-20 -40 Q-6 -46 10 -40" stroke="#fff" stroke-width="5" fill="none" opacity=".6"/></g>`,
 nail:`<g><rect x="-26" y="-50" width="52" height="96" rx="26" fill="${SK}"/><rect x="-18" y="-46" width="36" height="40" rx="16" fill="#FFE3E0" stroke="#fff" stroke-width="3"/><path d="M-8 -40 Q0 -44 8 -40" stroke="#fff" stroke-width="4"/></g>`,
 shield:`<g><path d="M0 -54 L44 -36 V4 Q44 40 0 58 Q-44 40 -44 4 V-36Z" fill="#2EC4B6" stroke="#fff" stroke-width="5"/><path d="M-18 2 l12 12 24 -26" stroke="#fff" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>`,
 mood:`<g><circle r="48" fill="#FFD36E"/><circle cx="-16" cy="-12" r="6" fill="#16171B"/><circle cx="16" cy="-12" r="6" fill="#16171B"/><path d="M-22 10 Q0 34 22 10" stroke="#16171B" stroke-width="6" fill="none" stroke-linecap="round"/></g>`,
 acne:`<g><circle cx="0" cy="0" r="46" fill="${SK}"/><circle cx="-16" cy="-12" r="5" fill="${HAIR}"/><circle cx="16" cy="-12" r="5" fill="${HAIR}"/><path d="M-12 18 Q0 12 12 18" stroke="#8A3B2E" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="-26" cy="8" r="7" fill="#E5484D"/><circle cx="24" cy="4" r="6" fill="#E5484D"/><circle cx="-6" cy="-32" r="5" fill="#E5484D"/><circle cx="30" cy="22" r="5" fill="#E5484D"/></g>`,
};
const SCALE=(x,y,t)=>{ // balance scale icon, gentle tilt
 const a=Math.sin(t*2)*4;return `<g transform="translate(${x} ${y})"><rect x="-8" y="-120" width="16" height="190" fill="#D9B98A"/><rect x="-80" y="64" width="160" height="22" rx="10" fill="#D9B98A"/><g transform="rotate(${a} 0 -110)"><rect x="-150" y="-118" width="300" height="14" rx="7" fill="#F3D9A4"/><path d="M-130 -104 L-170 -20 H-90Z M130 -104 L90 -20 H170Z" fill="none" stroke="#F3D9A4" stroke-width="4"/><path d="M-176 -20 H-84 Q-90 10 -130 10 Q-170 10 -176 -20Z M84 -20 H176 Q170 10 130 10 Q90 10 84 -20Z" fill="#D9B98A"/>${sym(-130,-46,24,'m')}${sym(130,-46,24,'f')}</g><circle cy="-120" r="16" fill="#F3D9A4"/></g>`};

window.extra=function(t){
 const on=(a,b)=>t>=a-0.05&&t<b+0.45;
 if(on(0,3.76)){$('male1').innerHTML=sym(0,0,96,'m')}
 if(on(3.76,6.84)){const lt=t-3.76;let s='';
  s+=person({x:480,y:640,s:1.0,g:'m',mood:'happy'})+person({x:1000,y:640,s:0.95,g:'f',mood:'neutral'});
  s+=vmeter(260,170,420,0.85*eOC(cl((lt-0.3)/0.8)),'#5B9BFF','')+vmeter(1210,170,420,0.28*eOC(cl((lt-0.6)/0.8)),'#FF7BB0','');
  s+=sym(260,120,44,'m')+sym(1210,120,44,'f');
  s+=tag(1210,660,'น้อยกว่า',cl((lt-2.1)/0.35),'#E5484D');
  $('fig2').innerHTML=s}
 if(on(6.84,9.88)){const lt=t-6.84;let s=person({x:420,y:650,s:1.0,g:'f',mood:lt<1.8?'tired':'sad'});
  // panel: muscle slow
  const pA=1-cl((lt-1.65)/0.3);
  if(pA>0){s+=`<g opacity="${pA}"><rect x="700" y="150" width="600" height="440" rx="34" fill="rgba(22,23,27,.85)" stroke="#D9B98A" stroke-width="5"/>`+bicep(900,390,1.0,0.15+0.1*cl((lt-0.3)/1.4),SK);
   const pr=0.12+0.16*cl((lt-0.3)/1.4);s+=`<rect x="980" y="330" width="270" height="44" rx="22" fill="rgba(255,255,255,.12)"/><rect x="980" y="330" width="${270*pr}" height="44" rx="22" fill="#E5484D"/><text x="1115" y="300" text-anchor="middle" font-family="K" font-weight="900" font-size="38" fill="#fff">กล้ามเนื้อ</text><text x="1115" y="440" text-anchor="middle" font-family="K" font-weight="900" font-size="40" fill="#FF7B7F">ขึ้นช้า…</text></g>`}
  // fat blobs on hips/belly/thighs
  const f=(d)=>cl((lt-1.9-d)/0.35);
  s+=fatBlob(420-66,650-262,30,f(0))+fatBlob(420+66,650-262,30,f(0.15))+fatBlob(420-60,650-200,34,f(0.3))+fatBlob(420+60,650-200,34,f(0.45))+fatBlob(420,650-280,26,f(0.6));
  if(lt>1.9){s+=`<g opacity="${cl((lt-1.9)/0.3)}"><rect x="700" y="200" width="600" height="300" rx="34" fill="rgba(22,23,27,.85)" stroke="#FFD36E" stroke-width="5"/>`+fatBlob(820,350,60,1)+`<text x="1060" y="330" text-anchor="middle" font-family="K" font-weight="900" font-size="52" fill="#FFD36E">ไขมัน</text><text x="1060" y="400" text-anchor="middle" font-family="K" font-weight="900" font-size="44" fill="#fff">สะสมง่าย</text></g>`+arrowV(1240,420,90,true,'#FFD36E',cl((lt-2.3)/0.4))}
  $('fig3').innerHTML=s}
 if(on(9.88,11.3)){const lt=t-9.88;const X=600,Y=740,S=1.18;
  const fig=person({x:0,y:0,s:1,g:'f',mood:'neutral'});
  const body=`<g transform="translate(${X} ${Y}) scale(${S})">${fig}</g>`;
  let s=body;
  // fat cells for the zoomed view (local person coords)
  const cells=(cx,cy,n,sp)=>{let r='';let k=11+cx;const rr=()=>{k=(k*16807)%2147483647;return (k-1)/2147483646};for(let i=0;i<n;i++){const a=rr()*6.28,d=rr()*sp;r+=`<ellipse cx="${(cx+Math.cos(a)*d).toFixed(1)}" cy="${(cy+Math.sin(a)*d*0.8).toFixed(1)}" rx="${(7+rr()*5).toFixed(1)}" ry="${(6+rr()*4).toFixed(1)}" fill="#FFD36E" stroke="#C99A2E" stroke-width="1.5"/>`}return r};
  const spots=[ // [local x,y, lens x,y, label, delay, cells]
   [0,-352,  1010,170, 'หน้าอก', 0.08, cells(-20,-352,8,13)+cells(20,-352,8,13)],
   [-92,-318, 250,300, 'ต้นแขน', 0.33, cells(-92,-318,10,16)],
   [44,-150, 1030,540, 'สะโพก-ต้นขา', 0.58, cells(44,-160,12,20)+cells(-44,-160,6,16)],
  ];
  spots.forEach(([lx,ly,mx,my,lab,d,cl_],i)=>{const p=cl((lt-d)/0.32);if(p<=0)return;const k=eOB(p);
   const sx=X+lx*S,sy=Y+ly*S,R=130,Z=2.6;
   // target ring on body + leader line
   s+=`<circle cx="${sx}" cy="${sy}" r="${34*k}" fill="none" stroke="#FFD36E" stroke-width="5"/>`;
   const ang=Math.atan2(sy-my,sx-mx),ex=mx+Math.cos(ang)*R*k,ey=my+Math.sin(ang)*R*k;
   s+=`<path d="M${sx-Math.cos(ang)*34} ${sy-Math.sin(ang)*34} L${ex} ${ey}" stroke="#FFD36E" stroke-width="4" stroke-dasharray="10 8" opacity="${p}"/>`;
   const fc=cl((lt-d-0.15)/0.3);
   s+=`<defs><clipPath id="lens${i}"><circle cx="${mx}" cy="${my}" r="${R*k}"/></clipPath></defs>`;
   s+=`<g clip-path="url(#lens${i})"><rect x="${mx-R}" y="${my-R}" width="${2*R}" height="${2*R}" fill="#2A2D35"/><g transform="translate(${mx} ${my}) scale(${Z*S}) translate(${-lx} ${-ly})">${fig}<g opacity="${fc}">${cl_}</g></g></g>`;
   // glass rim + handle + glare
   s+=`<g transform="translate(${mx} ${my}) scale(${k})"><circle r="${R}" fill="none" stroke="#D9B98A" stroke-width="16"/><circle r="${R-8}" fill="none" stroke="#fff" stroke-width="3" opacity=".5"/><path d="M${-R*0.55} ${-R*0.35} A${R*0.7} ${R*0.7} 0 0 1 ${-R*0.2} ${-R*0.62}" stroke="#fff" stroke-width="8" stroke-linecap="round" opacity=".45" fill="none"/><path d="M${R*0.72} ${R*0.72} L${R*1.15} ${R*1.15}" stroke="#7A5B2E" stroke-width="30" stroke-linecap="round"/></g>`;
   s+=tag(mx,my+R+50,lab,cl((lt-d-0.1)/0.3),'#FFD36E','#16171B');
  });
  $('fig3b').innerHTML=s}
 if(on(11.3,13.4)){const lt=t-11.3;let s='';
  const ages=[[300,'อายุ 25',0.95],[720,'อายุ 45',0.55],[1140,'อายุ 65',0.08]];
  ages.forEach(([x,l,m],i)=>{const p=cl((lt-0.15-i*0.55)/0.35);if(p<=0)return;const k=eOB(p);
   s+=`<g transform="translate(${x} 380) scale(${k})"><circle r="190" fill="rgba(22,23,27,.85)" stroke="${i==2?'#E5484D':'#D9B98A'}" stroke-width="6"/>${bicep(30,50,1.05,m,i==2?'#E8C3A6':SK)}</g><text x="${x}" y="640" text-anchor="middle" font-family="K" font-weight="900" font-size="46" fill="${i==2?'#FF7B7F':'#F3D9A4'}" opacity="${p}">${l}</text>`});
  const ap=cl((lt-0.8)/0.6);if(ap>0){s+=`<path d="M470 210 Q720 140 960 250" stroke="#E5484D" stroke-width="14" fill="none" stroke-dasharray="20 14" opacity="${ap}"/>`}
  s+=tag(1140,150,'สลาย!',cl((lt-1.5)/0.35),'#E5484D');
  $('fig4').innerHTML=s}
 if(on(13.4,16.56)){const lt=t-13.4;let s=ZG+person({x:720,y:680,s:1.05,g:'m',mood:lt<1.6?'neutral':'tired'});
  const zl=1-0.85*cl((lt-0.4)/1.1);s+=`<g transform="translate(260 300)">${znCoin(0,-130,60)}${battery(0,0,zl,zl<0.4?'#E5484D':'#D9B98A')}<text y="110" text-anchor="middle" font-family="K" font-weight="900" font-size="40" fill="#fff">ซิงค์</text></g>`;
  const hl=0.82-0.62*cl((lt-1.7)/1.0);s+=vmeter(1180,160,420,hl,hl<0.4?'#E5484D':'#5B9BFF','')+sym(1180,110,44,'m');
  s+=arrowV(1060,250,170,false,'#E5484D',cl((lt-1.8)/0.6));
  $('fig5').innerHTML=s}
 if(on(16.56,18.2)){const lt=t-16.56;let s=`<rect x="320" y="140" width="800" height="460" rx="40" fill="rgba(22,23,27,.85)" stroke="#D9B98A" stroke-width="5"/>`;
  s+=bicep(590,420,1.3,0.35,SK);const pr=0.62*eOC(cl(lt/0.6))+0.04*cl((lt-0.6)/1.0);
  s+=`<text x="860" y="300" text-anchor="middle" font-family="K" font-weight="900" font-size="44" fill="#fff">กล้ามเนื้อ</text><rect x="700" y="340" width="330" height="54" rx="27" fill="rgba(255,255,255,.12)"/><rect x="700" y="340" width="${330*pr}" height="54" rx="27" fill="#D9B98A"/>`;
  const sn=cl((lt-0.5)/0.4);if(sn>0)s+=`<g opacity="${sn}" transform="translate(${880+lt*20} 470)"><ellipse cx="0" cy="10" rx="52" ry="14" fill="#9AA0AC"/><circle cx="-6" cy="-18" r="34" fill="none" stroke="#C9A06A" stroke-width="14"/><circle cx="-6" cy="-18" r="12" fill="#C9A06A"/><path d="M40 4 L52 -30 M48 4 L64 -26" stroke="#9AA0AC" stroke-width="6" stroke-linecap="round"/></g><text x="${1000+lt*20}" y="490" font-family="K" font-weight="900" font-size="34" fill="#9AA0AC" opacity="${sn}">ช้า…</text>`;
  $('fig6a').innerHTML=s}
 if(on(18.2,20.48)){const lt=t-18.2;const X=720,Y=740,S=1.12;let s=person({x:X,y:Y,s:S,g:'m',fat:0.9,shirtless:true,mood:'sad'});
  const P=(lx,ly)=>[X+lx*S,Y+ly*S];
  const sp=[[0,-258,58,40,'พุง',0.35,[0,-258]],[-106,-262,26,48,'ข้างเอว',0.75,[-330,-262]],[106,-262,26,48,'',0.8,null],[0,-356,74,28,'หน้าอก',1.15,[330,-380]]];
  sp.forEach(([lx,ly,rx,ry,lab,d,tp])=>{const [x,y]=P(lx,ly);const p=cl((lt-d)/0.4);s+=ring(x,y,rx*S,ry*S,p);
   if(lab&&tp){const [tx,ty]=P(tp[0],tp[1]);const q=cl((lt-d-0.15)/0.35);if(lab==='พุง')s+=tag(x,y+ry*S+56,lab,q);else{s+=`<path d="M${x+(tx<x?-rx*S:rx*S)} ${y} L${tx+(tx<x?110:-110)} ${ty}" stroke="#FF3B3F" stroke-width="6" opacity="${q}"/>`+tag(tx,ty,lab,q)}}});
  $('fig6b').innerHTML=s}
 if(on(20.48,24.08)){const lt=t-20.48;let s=bed(560,560,1.05);
  s+=person({x:330,y:640,s:0.82,g:'m',mood:lt<1.9?'neutral':'sad'});
  const hp=cl((lt-0.5)/0.4);if(hp>0){const k=eOB(hp),pulse=1+0.06*Math.sin(t*8);s+=`<g transform="translate(1100 300) scale(${k*pulse})">${heart(0,0,2.2,'#E5484D')}</g>`;
   const bl=lt<1.9?0.8:0.8-0.65*cl((lt-1.9)/0.8);s+=`<g transform="translate(1100 470) scale(${k})">${battery(0,0,bl,bl<0.35?'#E5484D':'#2EC4B6')}</g>`;
   if(lt>2.6)s+=tag(1100,580,'ไม่ไหว!',cl((lt-2.6)/0.3),'#E5484D')}
  $('fig7').innerHTML=s}
 if(on(26.8,31.12)){const lt=t-26.8;
  // rise to normal -> push into the over-normal zone (needle turns red) -> big X on that zone -> snap back to normal
  let v=0.6*eOC(cl((lt-0.2)/0.8)),over=0;
  if(lt>1.2&&lt<3.0){const k=eIO(cl((lt-1.2)/0.7));v=lerp(0.6,0.87,k)+0.012*Math.sin(t*30)*k;over=k}
  if(lt>=3.0){const w=lt-3.0;const k=eOB(cl(w/0.5));v=lerp(0.87,0.6,k);over=1-cl(w/0.25)}
  let s=gauge(720,560,330,v,t,'','9');
  if(over>0.05){const a=Math.PI*v,nx=720-310*Math.cos(a),ny=560-310*Math.sin(a);s+=`<path d="M720 560 L${nx} ${ny}" stroke="#FF3B3F" stroke-width="16" stroke-linecap="round" opacity="${over}"/>`}
  const xa=Math.PI*0.86,xx=720-330*Math.cos(xa),xy=560-330*Math.sin(xa);
  s+=cross(xx,xy,62,cl((lt-2.7)/0.3));
  s+=tag(720,690,'ไม่เกินปกติ',cl((lt-3.4)/0.35),'#D9B98A','#16171B');
  $('g9').innerHTML=s}
 if(on(31.12,37.76)){const lt=t-31.12;let v=0.12+0.02*Math.sin(t*6);
  if(lt>2.0)v=0.12+0.42*eOC(cl((lt-2.0)/1.4));
  let s=ZG+gauge(720,560,330,v,t,'ขาด','10');
  const dz=cl((lt-1.3)/0.7);if(dz>0&&lt<2.4){const y=lerp(80,400,eOC(dz));s+=`<g opacity="${1-cl((lt-2.1)/0.3)}">${znCoin(720,y,64)}</g>`}
  s+=arrowV(250,520,200,true,'#2EC4B6',cl((lt-2.2)/0.6))+check(1150,270,70,cl((lt-3.6)/0.35));
  if(lt<2.0)s+=tag(300,250,'คนที่ขาด',cl((lt-0.2)/0.35),'#E5484D');
  $('g10').innerHTML=s}
 if(on(37.76,43.6)){const lt=t-37.76;let s='';
  let lv=0.18;if(lt>2.8)lv=0.18+0.6*eOC(cl((lt-2.8)/1.2));
  s+=vmeter(1050,140,450,lv,lv<0.4?'#E5484D':'#5B9BFF','')+sym(1050,90,44,'m');
  s+=arrowV(830,560,330,true,'#F3D9A4',cl((lt-2.8)/0.7));
  if(lt>2.9)s+=tag(830,170,'BOOST!',cl((lt-3.5)/0.3),'#D9B98A','#16171B');
  s+=`<path d="M1110 ${140+450*(1-0.78)} H1180" stroke="#2EC4B6" stroke-width="6" stroke-dasharray="10 8" opacity="${cl((lt-4.0)/0.3)}"/><text x="1190" y="${150+450*(1-0.78)}" font-family="K" font-weight="900" font-size="34" fill="#2EC4B6" opacity="${cl((lt-4.0)/0.3)}">ระดับที่ควรเป็น</text>`;
  $('g11').innerHTML=s}
 if(on(43.6,45.95)){const lt=t-43.6;let s='';
  const items=[[330,0.3,'บนเตียง',heart(0,-6,1.1,'#E5484D')],[720,1.0,'ไขมัน',fatBlob(0,0,40,1)+`<path d="M-50 50 L50 -50" stroke="#E5484D" stroke-width="12" stroke-linecap="round"/>`],[1110,1.75,'กล้ามเนื้อ',bicep(10,30,0.62,0.9,SK)]];
  items.forEach(([x,d,l,dr])=>{const p=cl((lt-d)/0.4);if(p<=0)return;const k=eOB(p);s+=`<g transform="translate(${x} 380) scale(${k})"><rect x="-170" y="-200" width="340" height="400" rx="40" fill="rgba(22,23,27,.9)" stroke="#D9B98A" stroke-width="6"/><g transform="translate(0 -40) scale(1.5)">${dr}</g><text y="140" text-anchor="middle" font-family="K" font-weight="900" font-size="52" fill="#F3D9A4">${l}</text></g>`+check(x+140,220,40,cl((lt-d-0.3)/0.3))});
  $('g11b').innerHTML=s}
 if(on(45.95,99)){const lt=t-45.95;let s='';
  const cen=lt<3.3?SCALE(720,380,t):'';
  if(lt<3.3)s+=`<g opacity="${1-cl((lt-3.0)/0.3)}">${cen}</g>`;
  if(lt>3.1){const k=eOB(cl((lt-3.2)/0.5));s+=`<g transform="translate(720 390) scale(${k})"><image href="jar.png" x="-150" y="-175" width="300" height="350"/></g>`}
  const ic=[['acne','สิว',0.93],['skin','ผิว',1.35],['hair','ผม',1.67],['nail','เล็บ',1.97],['shield','ภูมิคุ้มกัน',2.2],['mood','อารมณ์',2.95]];
  const pos=[[260,200],[1180,200],[200,470],[1240,470],[480,600],[960,600]];
  const sx=lt>3.2?eIO(cl((lt-3.2)/0.6)):0;
  ic.forEach(([k,l,d],i)=>{let [x,y]=pos[i];const tx=[[350,180],[1090,180],[230,430],[1210,430],[400,610],[1040,610]][i];x=lerp(x,tx[0],sx);y=lerp(y,tx[1],sx);s+=icoTile(x,y,cl((lt-d)/0.35),l,IC[k])});
  $('g12').innerHTML=s}
};
