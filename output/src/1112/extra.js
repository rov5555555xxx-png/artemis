// ---- scene builders
const ZB=(x,y,r=26,txt=true)=>`<g transform="translate(${x} ${y})"><circle r="${r}" fill="#C9D2E3" stroke="${INK}" stroke-width="5"/><ellipse cx="${-r*.3}" cy="${-r*.35}" rx="${r*.38}" ry="${r*.22}" fill="#fff" opacity=".9"/>${txt?`<text y="${r*.36}" text-anchor="middle" font-family="K" font-weight="900" font-size="${r*.95}" fill="#4A5468">Zn</text>`:''}</g>`;
document.querySelectorAll('.clock').forEach(sv=>{const id=sv.dataset.id;let s=`<circle r="96" fill="#fff" stroke="${INK}" stroke-width="8"/>`;for(let i=0;i<12;i++){const a=i/12*Math.PI*2;s+=`<path d="M${Math.sin(a)*78} ${-Math.cos(a)*78}L${Math.sin(a)*88} ${-Math.cos(a)*88}" stroke="${INK}" stroke-width="${i%3?4:7}" stroke-linecap="round"/>`}
 s+=`<path id="${id}w" d="" fill="#FFD23F" opacity=".85"/><path id="${id}h" d="M0 0V-62" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><circle r="9" fill="#FF6B6B" stroke="${INK}" stroke-width="4"/><text id="${id}t" y="58" text-anchor="middle" font-family="K" font-weight="900" font-size="30" fill="${INK}"></text>`;sv.innerHTML=s});
// graph (values from the user's chart: % of peak vs hours)
const GV=[0,70,100,80,55,35,20,10,3];const GX=h=>110+h*115,GY=v=>440-v*3.6;
(function(){let s=`<path d="M110 60V440H1060" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>`;
 for(let h=0;h<=8;h+=2)s+=`<text x="${GX(h)}" y="482" text-anchor="middle" font-family="K" font-weight="800" font-size="30" fill="${INK}">${h} ชม.</text><path d="M${GX(h)} 440v12" stroke="${INK}" stroke-width="5"/>`;
 for(const v of [50,100])s+=`<path d="M110 ${GY(v)}H1060" stroke="#C9D2E3" stroke-width="3" stroke-dasharray="10 10"/><text x="96" y="${GY(v)+10}" text-anchor="end" font-family="K" font-weight="800" font-size="26" fill="${INK}">${v}%</text>`;
 let d='';GV.forEach((v,h)=>d+=(h?'L':'M')+GX(h)+' '+GY(v));
 s+=`<path id="garea" d="${d}V440H110Z" fill="#7FD3FF" opacity=".35"/><path id="gline" d="${d}" fill="none" stroke="#FF6B6B" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>`;
 s+=`<g id="gpeak" opacity="0"><circle cx="${GX(2)}" cy="${GY(100)}" r="14" fill="#FFD23F" stroke="${INK}" stroke-width="5"/><text x="${GX(2)}" y="${GY(100)-26}" text-anchor="middle" font-family="K" font-weight="900" font-size="34" fill="${INK}">2 ชม.</text></g>`;
 s+=`<g id="grider"><circle r="30" fill="#FFD7B5" stroke="${INK}" stroke-width="5"/><g id="grH"><circle cx="-10" cy="-4" r="4.5" fill="${INK}"/><circle cx="10" cy="-4" r="4.5" fill="${INK}"/><path d="M-11 9q11 9 22 0" stroke="${INK}" stroke-width="4" fill="none" stroke-linecap="round"/></g><g id="grS" opacity="0"><circle cx="-10" cy="-4" r="4.5" fill="${INK}"/><circle cx="10" cy="-4" r="4.5" fill="${INK}"/><path d="M-11 14q11 -9 22 0" stroke="${INK}" stroke-width="4" fill="none" stroke-linecap="round"/></g><path d="M-30 -10Q-28 -40 0 -40Q28 -40 30 -10Q14 -26 0 -24Q-14 -26 -30 -10z" fill="#3A2A1E"/></g>`;
 $('graph2').innerHTML=s;window.GLEN=$('gline').getTotalLength()})();
// S3 balls
const B3=[...Array(16)].map((_,i)=>({t:7.35+i*0.13,vx:260+rnd()*380,vy:-(380+rnd()*320),r:20+rnd()*10}));
// S4 snail
$('snail4').innerHTML=`<path d="M20 130H200q10 0 6 10H24q-10 0 -4 -10z" fill="#FFD7B5" stroke="${INK}" stroke-width="6"/><circle cx="110" cy="80" r="56" fill="#FF8FB1" stroke="${INK}" stroke-width="7"/><path d="M110 80m-12 0a12 12 0 1 1 24 0a26 26 0 1 1 -48 0a38 38 0 1 1 74 4" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round"/><path d="M190 128q14-40 0-70M196 58l-14-24M190 58l8-30" stroke="${INK}" stroke-width="6" fill="none" stroke-linecap="round"/><circle cx="182" cy="32" r="7" fill="${INK}"/><circle cx="200" cy="26" r="7" fill="${INK}"/>`;
// S5 bars
(function(){let s='';const X=h=>300+h*95;
 for(let h=0;h<=8;h+=2)s+=`<text x="${X(h)}" y="470" text-anchor="middle" font-family="K" font-weight="800" font-size="28" fill="${INK}">${h} ชม.</text><path d="M${X(h)} 70V430" stroke="#E3E8F2" stroke-width="3"/>`;
 s+=`<g transform="translate(40 100)"><text x="0" y="56" font-family="K" font-weight="900" font-size="42" fill="#8A93A6">แต่ก่อน</text></g><rect x="300" y="110" width="0" height="90" rx="45" fill="#C9D2E3" stroke="${INK}" stroke-width="6" id="bOld"/><text id="tOld" x="0" y="172" font-family="K" font-weight="900" font-size="48" fill="${INK}"></text>`;
 s+=`<g transform="translate(40 270)"><text x="0" y="56" font-family="K" font-weight="900" font-size="42" fill="#3DDC97" stroke="${INK}" stroke-width="2">ตัวนี้</text></g><rect x="300" y="280" width="0" height="90" rx="45" fill="#3DDC97" stroke="${INK}" stroke-width="6" id="bNew"/><text id="tNew" x="0" y="342" font-family="K" font-weight="900" font-size="54" fill="${INK}"></text>`;
 $('bars5').innerHTML=s;window.BX=X})();
// S7 icons
$('ic_flag').innerHTML=`<rect x="8" y="20" width="84" height="60" rx="8" fill="#fff" stroke="${INK}" stroke-width="5"/><rect x="10" y="22" width="80" height="11" fill="#E8344A"/><rect x="10" y="67" width="80" height="11" fill="#E8344A"/><rect x="10" y="41" width="80" height="18" fill="#2D3E8F"/><rect x="8" y="20" width="84" height="60" rx="8" fill="none" stroke="${INK}" stroke-width="5"/>`;
$('ic_fac').innerHTML=`<path d="M10 88V48l22 14V48l22 14V48l22 14V20h14v68z" fill="#FFB36B" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><rect x="22" y="70" width="12" height="12" fill="#fff" stroke="${INK}" stroke-width="3"/><rect x="46" y="70" width="12" height="12" fill="#fff" stroke="${INK}" stroke-width="3"/><path d="M80 14q4-8 12-6" stroke="#B8B0C8" stroke-width="6" fill="none" stroke-linecap="round"/>`;
$('ic_fda').innerHTML=`<circle cx="50" cy="50" r="42" fill="#3DDC97" stroke="${INK}" stroke-width="5"/><text x="50" y="62" text-anchor="middle" font-family="K" font-weight="900" font-size="34" fill="#fff" stroke="${INK}" stroke-width="3" paint-order="stroke fill">อย.</text>`;
$('ic_safe').innerHTML=`<path d="M50 8L86 22V48Q86 78 50 94Q14 78 14 48V22Z" fill="#7FD3FF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><path d="M32 52l12 12l24-26" stroke="#fff" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M32 52l12 12l24-26" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity=".0"/>`;
// S8 orange basket + hand
$('cartsvg').innerHTML=`<path d="M110 140Q120 40 200 40Q280 40 290 140" fill="none" stroke="${INK}" stroke-width="30" stroke-linecap="round"/><path d="M110 140Q120 40 200 40Q280 40 290 140" fill="none" stroke="#FF8A3D" stroke-width="16" stroke-linecap="round"/><path d="M40 130H360L330 320Q326 340 306 340H94Q74 340 70 320Z" fill="#FF8A3D" stroke="${INK}" stroke-width="10" stroke-linejoin="round"/><path d="M120 180V300M200 180V300M280 180V300" stroke="#fff" stroke-width="14" stroke-linecap="round" opacity=".8"/><path d="M40 130H360" stroke="${INK}" stroke-width="10"/>`;
$('handsvg').innerHTML=`<path d="M60 20q16-8 24 8v80q14-10 26 0q12-8 24 4q12-6 22 6v60q0 50-50 56h-30q-40-4-56-50l-16-46q-4-16 10-20q12-2 20 12l14 30V28q0-6 12-8z" fill="#FFD7B5" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/>`;
// scallop bands on every scene
scenes.forEach(sc=>{['top','bot'].forEach(k=>{const d=document.createElement('div');d.className='scal '+k;sc.el.insertBefore(d,sc.el.children[2])})});
// particle dots -> rings
scenes.forEach(sc=>sc.parts.forEach((p,k)=>{const c=['#FFD23F','#FF8FB1','#7FA2FF','#3DDC97','#fff'][k%5];p.d.style.border='6px solid '+c}));
window.extra=function(t){
 scenes.forEach((sc,i)=>{if(sc.el.style.display==='none')return;const bg=sc.el.querySelector('.sbg');const x=(t*26)%400,y=(t*18)%400;bg.style.backgroundPosition=`${x}px ${y}px, ${x}px ${y}px, 0 0`;
  sc.el.querySelectorAll('.scal').forEach((s,j)=>s.style.backgroundPosition=`${(j?-1:1)*t*30}px 0`)});
 // clocks
 const ck=(id,h)=>{const e=$(id+'h');if(!e)return;e.setAttribute('transform',`rotate(${h*30})`);const a=h/12*Math.PI*2;$(id+'w').setAttribute('d',h>0.01?`M0 0V-80A80 80 0 ${a>Math.PI?1:0} 1 ${Math.sin(a)*80} ${-Math.cos(a)*80}Z`:'');$(id+'t').textContent=h>0.05?`${Math.round(h)} ชม.`:''};
 if(t<3.5)ck('ck1',2*eOC(cl((t-0.2)/2.0)));
 if(t>=21.8&&t<26)ck('ck6',6*eOC(cl((t-24.75)/0.6)));
 // graph draw + rider
 if(t>=3&&t<7.8){const p=cl((t-3.1)/3.6);const L=GLEN*p;$('gline').style.strokeDasharray=GLEN;$('gline').style.strokeDashoffset=GLEN-L;
  const pt=$('gline').getPointAtLength(Math.max(1,L));$('grider').setAttribute('transform',`translate(${pt.x} ${pt.y-36}) rotate(${Math.sin(t*10)*6})`);
  $('garea').setAttribute('opacity',.35*p);$('gpeak').setAttribute('opacity',cl((t-4.0)/0.2));const sad=p>0.45;$('grH').setAttribute('opacity',sad?0:1);$('grS').setAttribute('opacity',sad?1:0)}
 // S3 balls fly from jar and fall past the kid
 if(t>=7.2&&t<12){let s='';for(const b of B3){const d=t-b.t;if(d<0)continue;const x=330+b.vx*d,y=300+b.vy*d+600*d*d;if(y>1150)continue;s+=ZB(x,y,b.r)}$('balls3').innerHTML=s;
  $('jar3').style.transform+=` rotate(${Math.sin(t*30)*4}deg)`}
 // S4 layers
 if(t>=11.4&&t<18.8){let s='';const cols=['#FFD23F','#FF8FB1','#7FD3FF','#3DDC97'];for(let i=3;i>=0;i--){const at=14.5+i*0.33;const k=cl((t-at)/0.3);if(k<=0)continue;const r=(150+i*34)*(k<1?eOB(k):1);s+=`<circle cx="300" cy="300" r="${r}" fill="${cols[i]}" stroke="${INK}" stroke-width="7" opacity=".92"/>`}
  $('layers4').innerHTML=s;let dd='';for(let i=0;i<8;i++){const at=16.5+i*0.22;const d=t-at;if(d<0||d>1.6)continue;const a=-0.5+i*0.9;dd+=ZB(720+Math.cos(a)*(250+d*120),360+Math.sin(a)*(250+d*120)+d*40,14,false)}$('drip4').innerHTML=dd;
  $('snail4').style.transform=`translateX(${Math.max(0,t-16.8)*30}px)`}
 // S5 bars
 if(t>=18.2&&t<22.4){const po=eOB(cl((t-18.5)/0.8)),pn=eOC(cl((t-20.25)/1.0));const wo=BX(2*po)-300,wn=BX(6*pn)-300;
  $('bOld').setAttribute('width',Math.max(90,wo));$('tOld').setAttribute('x',300+Math.max(90,wo)+20);$('tOld').textContent=po>0.05?'2 ชม.':'';
  $('bNew').setAttribute('width',Math.max(90,wn));$('tNew').setAttribute('x',300+Math.max(90,wn)+20);$('tNew').textContent=t>20.2?`${Math.max(2,Math.round(6*pn))} ชม.`:''}
 // S6 orbiting zinc balls
 if(t>=22.8&&t<26){let s='';for(let i=0;i<6;i++){const a=t*1.6+i/6*Math.PI*2;const k=cl((t-22.9-i*0.1)/0.3);s+=ZB(720+Math.cos(a)*270,380+Math.sin(a)*120,24*(k?eOB(k):0))}$('orbit6').innerHTML=s}
 // S8 tap
 if(t>=30.1){const tap=Math.max(0,Math.sin((t-30.6)*9));$('hand8').style.transform+=` translate(${-tap*30}px,${-tap*20}px)`;$('cart8').style.transform+=` scale(${1+0.05*Math.max(0,Math.sin((t-30.6)*9-0.6))})`}
};
