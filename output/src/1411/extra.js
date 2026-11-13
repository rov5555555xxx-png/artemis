const lerp=(a,b,p)=>a+(b-a)*p;
// ---------- highlight captions: words rise in one by one, key words get a marker swipe
const HL=[...document.querySelectorAll('.hl')].map(el=>{const parts=el.textContent.split('|');el.textContent='';const ws=[];
 parts.forEach(p=>{let k=0;if(/^\*.*\*$/.test(p)){k=1;p=p.slice(1,-1)}else if(/^!.*!$/.test(p)){k=2;p=p.slice(1,-1)}
  const w=document.createElement('span');w.className='w'+(k?' key k'+k:'');if(k){const m=document.createElement('i');m.className='mk2';w.appendChild(m)}
  const tx=document.createElement('b');tx.textContent=p;w.appendChild(tx);el.appendChild(w);ws.push({w,k,m:w.querySelector('.mk2')})});
 return{el,ws,at:+el.dataset.at,st:el.dataset.st!==undefined?+el.dataset.st:0.14,out:el.dataset.out?+el.dataset.out:null}});
function hlRender(t){for(const h of HL){const vis=t>=h.at-0.05;const ok=h.out!==null?cl((t-h.out)/0.22):0;h.el.style.opacity=vis?1-ok:0;if(!vis||ok>=1)continue;
 h.el.style.transform=ok>0?`translateY(${-24*ok}px)`:'';
 h.ws.forEach((x,i)=>{const lt=t-h.at-i*h.st;const p=cl(lt/0.28);x.w.style.opacity=p>0?Math.min(1,p*2):0;
  let tf=`translateY(${(1-eOC(p))*36}px)`;
  if(x.k){const mp=eIO(cl((lt-0.18)/0.32));x.m.style.transform=`skewX(-8deg) scaleX(${mp})`;if(mp>=1)tf+=` scale(${1+0.03*Math.sin(t*6+i)})`;x.w.classList.toggle('on',mp>0.5)}
  x.w.style.transform=tf})}}
// ---------- generic bits
document.querySelectorAll('svg.cart').forEach(s=>s.innerHTML=`<path d="M110 140Q120 40 200 40Q280 40 290 140" fill="none" stroke="${INK}" stroke-width="30" stroke-linecap="round"/><path d="M110 140Q120 40 200 40Q280 40 290 140" fill="none" stroke="#FFD23F" stroke-width="16" stroke-linecap="round"/><path d="M40 130H360L330 320Q326 340 306 340H94Q74 340 70 320Z" fill="#FFD23F" stroke="${INK}" stroke-width="10" stroke-linejoin="round"/><path d="M120 180V300M200 180V300M280 180V300" stroke="#fff" stroke-width="14" stroke-linecap="round" opacity=".8"/><path d="M40 130H360" stroke="${INK}" stroke-width="10"/>`);
document.querySelectorAll('svg.hand').forEach(s=>s.innerHTML=`<path d="M60 20q16-8 24 8v80q14-10 26 0q12-8 24 4q12-6 22 6v60q0 50-50 56h-30q-40-4-56-50l-16-46q-4-16 10-20q12-2 20 12l14 30V28q0-6 12-8z" fill="#FFD7B5" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/>`);
const CAPS=(x,y,r=0,s=1)=>`<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})"><rect x="-46" y="-20" width="92" height="40" rx="20" fill="#fff" stroke="${INK}" stroke-width="5"/><path d="M0 -20V20" stroke="${INK}" stroke-width="4"/><rect x="-46" y="-20" width="46" height="40" rx="20" fill="#FFB300" stroke="${INK}" stroke-width="5"/><ellipse cx="-24" cy="-8" rx="12" ry="4" fill="#fff" opacity=".7"/></g>`;
// calendar flipping
function calSvg(day){return `<rect x="10" y="40" width="280" height="280" rx="26" fill="#fff" stroke="${INK}" stroke-width="9"/><rect x="10" y="40" width="280" height="80" rx="26" fill="#FF6B6B" stroke="${INK}" stroke-width="9"/><rect x="70" y="14" width="22" height="56" rx="10" fill="${INK}"/><rect x="208" y="14" width="22" height="56" rx="10" fill="${INK}"/><text x="150" y="250" text-anchor="middle" font-family="K" font-weight="900" font-size="130" fill="${INK}">${day}</text>`}
// gauge
function gaugeSvg(id){let s='';const cx=350,cy=380,R=290;const arc=(a0,a1,col)=>{const p=a=>[cx+Math.cos(Math.PI*(1+a))*R,cy+Math.sin(Math.PI*(1+a))*R];const [x0,y0]=p(a0),[x1,y1]=p(a1);return `<path d="M${x0} ${y0}A${R} ${R} 0 0 1 ${x1} ${y1}" fill="none" stroke="${col}" stroke-width="70"/>`};
 s+=`<path d="M${cx-R-45} ${cy}A${R+45} ${R+45} 0 0 1 ${cx+R+45} ${cy}" fill="none" stroke="${INK}" stroke-width="10"/><path d="M${cx-R+45} ${cy}A${R-45} ${R-45} 0 0 1 ${cx+R-45} ${cy}" fill="none" stroke="${INK}" stroke-width="10"/>`+arc(0,0.45,'#3DDC97')+arc(0.45,0.7,'#FFD23F')+arc(0.7,1,'#FF4D4D');
 s+=`<text x="${cx-205}" y="${cy-150}" text-anchor="middle" font-family="K" font-weight="900" font-size="40" fill="#fff" stroke="${INK}" stroke-width="7" paint-order="stroke fill" transform="rotate(-50 ${cx-205} ${cy-150})">ปลอดภัย</text><text x="${cx+215}" y="${cy-150}" text-anchor="middle" font-family="K" font-weight="900" font-size="40" fill="#fff" stroke="${INK}" stroke-width="7" paint-order="stroke fill" transform="rotate(50 ${cx+215} ${cy-150})">โดสสูง</text>`;
 s+=`<g id="${id}n"><path d="M${cx-14} ${cy}L${cx} ${cy-250}L${cx+14} ${cy}Z" fill="${INK}"/></g><circle cx="${cx}" cy="${cy}" r="30" fill="#FFD23F" stroke="${INK}" stroke-width="8"/><text id="${id}t" x="${cx}" y="${cy+75}" text-anchor="middle" font-family="K" font-weight="900" font-size="52" fill="${INK}" stroke="#fff" stroke-width="8" paint-order="stroke fill"></text>`;return s}
function setGauge(id,v,label){const n=$(id+'n');if(!n)return;n.setAttribute('transform',`rotate(${-90+180*v} 350 380)`);$(id+'t').textContent=label||''}
$('gauge2').innerHTML=gaugeSvg('g2');$('gauge4').innerHTML=gaugeSvg('g4');
// week
(function(){let s='';const d=['จ','อ','พ','พฤ','ศ','ส','อา'];for(let i=0;i<7;i++){const x=20+(i%4)*135,y=30+Math.floor(i/4)*190;s+=`<g transform="translate(${x} ${y})"><rect width="115" height="160" rx="20" fill="#fff" stroke="${INK}" stroke-width="7"/><text x="57" y="62" text-anchor="middle" font-family="K" font-weight="900" font-size="44" fill="${INK}">${d[i]}</text><g id="wk${i}" opacity="0">${CAPS(57,118,-12,0.75)}</g></g>`}$('week4').innerHTML=s})();
// tanks: body silhouette filling with vitamin D
document.querySelectorAll('svg.tank').forEach(sv=>{const id=sv.dataset.id;const body='M150 20a60 60 0 1 1 -0.1 0zM70 150h160a50 50 0 0 1 50 50v170a30 30 0 0 1 -30 30h-190a30 30 0 0 1 -30 -30v-170a50 50 0 0 1 50 -50z';
 sv.innerHTML=`<defs><clipPath id="${id}c"><path d="${body}"/></clipPath></defs><path d="${body}" fill="#fff"/><g clip-path="url(#${id}c)"><path id="${id}w" d="" fill="#FFD23F"/><path id="${id}w2" d="" fill="#FFB300" opacity=".55"/></g><path d="${body}" fill="none" stroke="${INK}" stroke-width="10"/><text id="${id}p" x="150" y="320" text-anchor="middle" font-family="K" font-weight="900" font-size="64" fill="${INK}" stroke="#fff" stroke-width="10" paint-order="stroke fill"></text><text x="150" y="250" text-anchor="middle" font-family="K" font-weight="900" font-size="40" fill="${INK}" opacity=".6">วิตามินดี</text>`});
function setTank(id,p,t){const top=400-380*p;let d=`M0 ${top}`,d2=`M0 ${top+6}`;for(let x=0;x<=300;x+=20){d+=`L${x} ${top+Math.sin(x/30+t*5)*7}`;d2+=`L${x} ${top+8+Math.sin(x/26-t*4)*6}`}d+='V420H0Z';d2+='V420H0Z';$(id+'w').setAttribute('d',d);$(id+'w2').setAttribute('d',d2);$(id+'p').textContent=Math.round(p*100)+'%'}
// office day/night
$('office6').innerHTML=`<defs><linearGradient id="skyg" x1="0" y1="0" x2="0" y2="1"><stop id="sk1" offset="0" stop-color="#7FD3FF"/><stop id="sk2" offset="1" stop-color="#DFF4FF"/></linearGradient><clipPath id="winc"><rect x="640" y="70" width="430" height="300" rx="14"/></clipPath></defs>
 <rect x="0" y="0" width="1140" height="500" rx="36" fill="#FFF3E0" stroke="${INK}" stroke-width="8"/><rect x="0" y="400" width="1140" height="100" rx="0" fill="#E8D5C0"/><path d="M0 400H1140" stroke="${INK}" stroke-width="6"/>
 <g clip-path="url(#winc)"><rect x="640" y="70" width="430" height="300" fill="url(#skyg)"/><g id="sunO"><circle r="44" fill="#FFD23F" stroke="${INK}" stroke-width="6"/></g><g id="moonO" opacity="0"><path d="M0 -40a40 40 0 1 0 30 66a32 32 0 1 1 -30 -66z" fill="#FFF3B0" stroke="${INK}" stroke-width="5"/></g><g id="starsO" opacity="0">${[[700,110],[760,180],[980,120],[1040,210],[880,95]].map(([x,y])=>`<path d="M${x} ${y-9}L${x+3} ${y-3}L${x+9} ${y}L${x+3} ${y+3}L${x} ${y+9}L${x-3} ${y+3}L${x-9} ${y}L${x-3} ${y-3}Z" fill="#fff"/>`).join('')}</g><path d="M640 330h430v40H640z" fill="#9FB8D0" opacity=".6"/></g>
 <rect x="640" y="70" width="430" height="300" rx="14" fill="none" stroke="${INK}" stroke-width="10"/><path d="M855 70V370M640 220H1070" stroke="${INK}" stroke-width="7"/>
 <g transform="translate(170 110)"><circle r="62" fill="#fff" stroke="${INK}" stroke-width="7"/><path id="ckh6" d="M0 0V-38" stroke="${INK}" stroke-width="8" stroke-linecap="round"/><path id="ckm6" d="M0 0V-50" stroke="#FF4D4D" stroke-width="5" stroke-linecap="round"/><circle r="7" fill="${INK}"/></g>
 <rect x="230" y="300" width="320" height="22" rx="8" fill="#B07A4F" stroke="${INK}" stroke-width="6"/><path d="M260 322V400M520 322V400" stroke="${INK}" stroke-width="10"/>
 <g transform="translate(310 300)"><path d="M0 0L30 -80H150L120 0Z" fill="#C9D2E3" stroke="${INK}" stroke-width="6"/><circle cx="90" cy="-42" r="9" fill="#fff"/></g>
 <g id="kid6" transform="translate(470 395) scale(.62)">${kid({shirt:'#7FA2FF',hair:'#2B1B12',faces:[{e:'bored'}],armL:'hold',armR:'hold'})}</g>
 <g id="bat6">${'<path d="M0 0q-20 -24 -48 -10q14 4 16 18q-12 -6 -22 4q24 -2 34 14q8 -14 20 -14q12 0 20 14q10 -16 34 -14q-10 -10 -22 -4q2 -14 16 -18q-28 -14 -48 10z" fill="#5B4B8A" stroke="#1B2A4A" stroke-width="5" stroke-linejoin="round"/><circle cx="-6" cy="4" r="3" fill="#fff"/><circle cx="6" cy="4" r="3" fill="#fff"/>'}</g>`;
$('moon7').innerHTML=`<circle r="96" fill="#2D3E8F" stroke="${INK}" stroke-width="8"/><path d="M10 -50a50 50 0 1 0 38 82a40 40 0 1 1 -38 -82z" fill="#FFF3B0" stroke="${INK}" stroke-width="6"/>`;
const IC3={gauge:`<path d="M10 70a40 40 0 0 1 80 0" fill="none" stroke="#3DDC97" stroke-width="16"/><path d="M50 70L32 40" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><circle cx="50" cy="70" r="8" fill="${INK}"/>`,shield:`<path d="M50 8L86 22V48Q86 78 50 94Q14 78 14 48V22Z" fill="#7FD3FF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><path d="M32 52l12 12l24-26" stroke="#fff" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`};
document.querySelectorAll('svg.ic3').forEach(s=>s.innerHTML=IC3[s.dataset.ic]);
scenes.forEach(sc=>{['top','bot'].forEach(k=>{const d=document.createElement('div');d.className='scal '+k;sc.el.insertBefore(d,sc.el.children[2])})});
scenes.forEach(sc=>sc.parts.forEach((p,k)=>{const c=['#FFD23F','#FF8FB1','#7FA2FF','#3DDC97','#fff'][k%5];p.d.style.border='6px solid '+c}));
window.extra=function(t){
 scenes.forEach(sc=>{if(sc.el.style.display==='none')return;const bg=sc.el.querySelector('.sbg');const x=(t*26)%400,y=(t*18)%400;bg.style.backgroundPosition=`${x}px ${y}px, ${x}px ${y}px, 0 0`;sc.el.querySelectorAll('.scal').forEach((s,j)=>s.style.backgroundPosition=`${(j?-1:1)*t*30}px 0`)});
 hlRender(t);
 if(t<4){const day=1+Math.floor(t*6)%30;$('cal1').innerHTML=calSvg(day)}
 if(t>=3.6&&t<9.2){let v=0.15+0.05*Math.sin(t*3);if(t>5.8)v=lerp(v,0.92,eOC(cl((t-5.9)/1.3)))+Math.sin(t*30)*0.01*(t>7.2);setGauge('g2',v,t>6.5?'โดสสูง!':'');
  let s='';for(let i=0;i<12;i++){const d=t-5.9-i*0.11;if(d<0||d>1.1)continue;s+=CAPS(720+(i%3-1)*60,90+d*420,i*30+d*200,0.9)}$('pour2').innerHTML=s}
 if(t>=8.7&&t<12){$('hlrow3').style.transform=`scaleX(${eIO(cl((t-9.4)/0.7))})`}
 if(t>=11.5&&t<14){setGauge('g4',lerp(0.9,0.22,eOB(cl((t-11.55)/0.7))),'600 IU');for(let i=0;i<7;i++){const k=cl((t-11.8-i*0.2)/0.2);const g=$('wk'+i);g.setAttribute('opacity',k);g.setAttribute('transform',`translate(${(1-eOB(k))*0} ${-(1-k)*30})`)}}
 if(t>=13.5&&t<19.6){let s='';const sx=720,sy=120;s+=`<g transform="translate(${sx} ${sy}) rotate(${t*20})">${[...Array(12)].map((_,i)=>`<rect x="-8" y="-95" width="16" height="34" rx="8" fill="#FFB300" stroke="${INK}" stroke-width="4" transform="rotate(${i*30})"/>`).join('')}<circle r="56" fill="#FFD23F" stroke="${INK}" stroke-width="7"/></g>`;
  for(let i=0;i<6;i++){const d=((t*1.2+i/6)%1);const x=lerp(sx-40,410,d),y=lerp(sy+60,300,d);s+=`<path d="M${x-12} ${y-6}L${x+12} ${y+6}" stroke="#FFB300" stroke-width="10" stroke-linecap="round" opacity="${Math.sin(d*Math.PI)}"/>`}
  $('sun5').innerHTML=s;$('kid5').style.transform+=` translateX(${Math.sin(t*2)*16}px)`;
  let p=0.08+0.52*eOC(cl((t-14.2)/2.2));if(t>17.5)p=lerp(p,1,eOB(cl((t-17.6)/0.8)));setTank('t5',Math.min(1,p),t);
  let q='';const d=t-17.0;if(d>=0&&d<0.7){q=CAPS(1050,lerp(-40,330,eIO(d/0.7)),d*300,1.2)}$('pill5').innerHTML=q}
 if(t>=19.2&&t<25.6){const p=cl((t-19.3)/5.0);const a=Math.PI*(1-p*1.15);const sx=855+Math.cos(a)*240,sy=380-Math.sin(a)*250;$('sunO').setAttribute('transform',`translate(${sx} ${sy})`);
  const night=cl((p-0.72)/0.2);$('moonO').setAttribute('opacity',night);$('moonO').setAttribute('transform',`translate(${960} ${150})`);$('starsO').setAttribute('opacity',night);
  const c1=night>0?`rgb(${Math.round(lerp(255,30,night))},${Math.round(lerp(150,40,night))},${Math.round(lerp(90,110,night))})`:(p>0.55?`rgb(255,${Math.round(lerp(211,150,(p-0.55)/0.17))},${Math.round(lerp(255,90,(p-0.55)/0.17))})`:'#7FD3FF');
  $('sk1').setAttribute('stop-color',c1);$('sk2').setAttribute('stop-color',night>0?`rgb(${Math.round(lerp(255,60,night))},${Math.round(lerp(220,70,night))},${Math.round(lerp(180,140,night))})`:'#DFF4FF');
  const hr=9+9*p;$('ckh6').setAttribute('transform',`rotate(${hr*30})`);$('ckm6').setAttribute('transform',`rotate(${hr*360})`);
  $('bat6').setAttribute('transform',`translate(${420+Math.sin(t*1.7)*80} ${150+Math.sin(t*3.1)*25}) scale(${1+0.15*Math.sin(t*14)},1)`)}
 if(t>=25.1&&t<28.4){let p=0.18;let s='';for(let i=0;i<2;i++){const at=25.6+i*0.6,d=t-at;if(d<0)continue;if(d<0.6)s+=CAPS(720+(i?60:-60),lerp(-60,250,eIO(d/0.6)),d*400,1.2);p+=0.41*eOB(cl((d-0.5)/0.6))}$('pill7').innerHTML=s;setTank('t7',Math.min(1,p),t)}
 if(t>=31.6){const tap=Math.max(0,Math.sin((t-32.1)*9));$('hand9').style.transform+=` translate(${-tap*30}px,${-tap*20}px)`}
};
