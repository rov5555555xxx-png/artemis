const lerp=(a,b,p)=>a+(b-a)*p;
// ---------- highlight captions: words rise in one by one, key words get a marker swipe
const HL=[...document.querySelectorAll('.hl')].map(el=>{const parts=el.textContent.split('|');el.textContent='';const ws=[];
 parts.forEach(p=>{let k=0;if(/^\*.*\*$/.test(p)){k=1;p=p.slice(1,-1)}else if(/^!.*!$/.test(p)){k=2;p=p.slice(1,-1)}
  const w=document.createElement('span');w.className='w'+(k?' key k'+k:'');if(k){const m=document.createElement('i');m.className='mk2';w.appendChild(m)}
  const tx=document.createElement('b');tx.textContent=p;w.appendChild(tx);el.appendChild(w);ws.push({w,k,m:w.querySelector('.mk2')})});
 return{el,ws,at:+el.dataset.at,st:el.dataset.st!==undefined?+el.dataset.st:0.06,out:el.dataset.out?+el.dataset.out:null}});
function hlRender(t){for(const h of HL){const vis=t>=h.at-0.05;const ok=h.out!==null?cl((t-h.out)/0.22):0;h.el.style.opacity=vis?1-ok:0;if(!vis||ok>=1)continue;
 h.el.style.transform=ok>0?`translateY(${-24*ok}px)`:'';
 h.ws.forEach((x,i)=>{const lt=t-h.at-i*h.st;const p=cl(lt/0.28);x.w.style.opacity=p>0?Math.min(1,p*2):0;
  let tf=`translateY(${(1-eOC(p))*36}px)`;
  if(x.k){const kp=eOB(cl((lt-0.12)/0.35));tf+=` scale(${0.85+0.3*kp})`;x.w.classList.toggle('on',kp>0.3)}
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
const H$=id=>document.getElementById(id);
// tanks: body silhouette filling with vitamin D
document.querySelectorAll('svg.tank').forEach(sv=>{const id=sv.dataset.id;const body='M150 20a60 60 0 1 1 -0.1 0zM70 150h160a50 50 0 0 1 50 50v170a30 30 0 0 1 -30 30h-190a30 30 0 0 1 -30 -30v-170a50 50 0 0 1 50 -50z';
 sv.innerHTML=`<defs><clipPath id="${id}c"><path d="${body}"/></clipPath></defs><path d="${body}" fill="#fff"/><g clip-path="url(#${id}c)"><path id="${id}w" d="" fill="#FFD23F"/><path id="${id}w2" d="" fill="#FFB300" opacity=".55"/></g><path d="${body}" fill="none" stroke="${INK}" stroke-width="10"/><text id="${id}p" x="150" y="320" text-anchor="middle" font-family="K" font-weight="900" font-size="64" fill="${INK}" stroke="#fff" stroke-width="10" paint-order="stroke fill"></text><text x="150" y="250" text-anchor="middle" font-family="K" font-weight="900" font-size="40" fill="${INK}" opacity=".6">วิตามินดี</text>`});
function setTank(id,p,t){const top=400-380*p;let d=`M0 ${top}`,d2=`M0 ${top+6}`;for(let x=0;x<=300;x+=20){d+=`L${x} ${top+Math.sin(x/30+t*5)*7}`;d2+=`L${x} ${top+8+Math.sin(x/26-t*4)*6}`}d+='V420H0Z';d2+='V420H0Z';$(id+'w').setAttribute('d',d);$(id+'w2').setAttribute('d',d2);$(id+'p').textContent=Math.round(p*100)+'%'}
// window: sun sets outside
$('win6').innerHTML=`<defs><linearGradient id="skyg" x1="0" y1="0" x2="0" y2="1"><stop id="sk1" offset="0" stop-color="#7FD3FF"/><stop id="sk2" offset="1" stop-color="#DFF4FF"/></linearGradient><clipPath id="winc"><rect x="40" y="40" width="520" height="380" rx="20"/></clipPath></defs>
 <rect x="10" y="10" width="580" height="440" rx="34" fill="#FFF3E0" stroke="${INK}" stroke-width="10"/>
 <g clip-path="url(#winc)"><rect x="40" y="40" width="520" height="380" fill="url(#skyg)"/><g id="sunO"><circle r="54" fill="#FFD23F" stroke="${INK}" stroke-width="7"/></g><g id="moonO" opacity="0"><path d="M0 -48a48 48 0 1 0 36 80a38 38 0 1 1 -36 -80z" fill="#FFF3B0" stroke="${INK}" stroke-width="6"/></g><g id="starsO" opacity="0">${[[110,110],[190,190],[420,110],[490,220],[300,90]].map(([x,y])=>`<path d="M${x} ${y-10}L${x+3} ${y-3}L${x+10} ${y}L${x+3} ${y+3}L${x} ${y+10}L${x-3} ${y+3}L${x-10} ${y}L${x-3} ${y-3}Z" fill="#fff"/>`).join('')}</g><path d="M40 360h520v60H40z" fill="#8FA6BF"/><path d="M80 360v-60h60v60M170 360v-90h70v90M380 360v-70h60v70M460 360v-110h70v110" fill="#6C849E"/></g>
 <rect x="40" y="40" width="520" height="380" rx="20" fill="none" stroke="${INK}" stroke-width="10"/><path d="M300 40V420M40 230H560" stroke="${INK}" stroke-width="8"/><rect x="10" y="440" width="580" height="30" rx="12" fill="#B07A4F" stroke="${INK}" stroke-width="7"/>`;
const IC3={gauge:`<path d="M10 70a40 40 0 0 1 80 0" fill="none" stroke="#3DDC97" stroke-width="16"/><path d="M50 70L32 40" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><circle cx="50" cy="70" r="8" fill="${INK}"/>`,shield:`<path d="M50 8L86 22V48Q86 78 50 94Q14 78 14 48V22Z" fill="#7FD3FF" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><path d="M32 52l12 12l24-26" stroke="#fff" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`};
document.querySelectorAll('svg.ic3').forEach(s=>s.innerHTML=IC3[s.dataset.ic]);

scenes.forEach(sc=>sc.parts.forEach(p=>p.d.style.display='none'));
window.extra=function(t){
 hlRender(t);
 if(t>=3.6&&t<9.2){let v=0.15+0.04*Math.sin(t*3);if(t>5.8)v=lerp(v,0.92,eOC(cl((t-5.9)/1.3)));setGauge('g2',v,t>6.4?'2000–5000 IU':'');
  let s='';for(let i=0;i<10;i++){const d=t-5.9-i*0.13;if(d<0||d>0.9)continue;const p=d/0.9;s+=CAPS(720,lerp(40,470,eIO(p)),i*36+d*240,0.9*(1-p*0.4))}$('pour2').innerHTML=s}
 if(t>=8.5&&t<12){$('row3').style.opacity=cl((t-9.6)/0.25)}
 if(t>=11.3&&t<14){setGauge('g4',lerp(0.9,0.22,eOB(cl((t-11.55)/0.8))),'600 IU')}
 if(t>=13.3&&t<19.6){let s='';const sx=720,sy=95;s+=`<g transform="translate(${sx} ${sy}) rotate(${t*16})">${[...Array(12)].map((_,i)=>`<rect x="-7" y="-82" width="14" height="28" rx="7" fill="#FFB300" stroke="${INK}" stroke-width="4" transform="rotate(${i*30})"/>`).join('')}<circle r="48" fill="#FFD23F" stroke="${INK}" stroke-width="7"/></g>`;
  if(t<17)for(let i=0;i<4;i++){const d=((t*1.4+i/4)%1);s+=`<path d="M${720+(i-1.5)*34} ${160+d*60}v20" stroke="#FFB300" stroke-width="9" stroke-linecap="round" opacity="${Math.sin(d*Math.PI)}"/>`}
  $('sun5').innerHTML=s;let p=0.08+0.52*eOC(cl((t-14.2)/2.2));if(t>17.5)p=lerp(p,1,eOB(cl((t-17.6)/0.8)));setTank('t5',Math.min(1,p),t);
  let q='';const d=t-17.0;if(d>=0&&d<0.65)q=CAPS(720,lerp(60,330,eIO(d/0.65)),d*300,1.1);$('pill5').innerHTML=q}
 if(t>=19.0&&t<25.6){const p=cl((t-19.3)/5.0);const a=Math.PI*(1-p*1.2);const sx=300+Math.cos(a)*200,sy=330-Math.sin(a)*240;$('sunO').setAttribute('transform',`translate(${sx} ${sy})`);
  const night=cl((p-0.72)/0.2);$('moonO').setAttribute('opacity',night);$('moonO').setAttribute('transform','translate(430 150)');$('starsO').setAttribute('opacity',night);
  const c1=night>0?`rgb(${Math.round(lerp(255,30,night))},${Math.round(lerp(150,40,night))},${Math.round(lerp(90,110,night))})`:(p>0.55?`rgb(255,${Math.round(lerp(211,150,(p-0.55)/0.17))},${Math.round(lerp(255,90,(p-0.55)/0.17))})`:'#7FD3FF');
  $('sk1').setAttribute('stop-color',c1);$('sk2').setAttribute('stop-color',night>0?`rgb(${Math.round(lerp(255,60,night))},${Math.round(lerp(220,70,night))},${Math.round(lerp(180,140,night))})`:'#DFF4FF')}
 if(t>=24.9&&t<28.4){let p=0.18;let s='';for(let i=0;i<2;i++){const at=25.6+i*0.6,d=t-at;if(d<0)continue;if(d<0.6)s+=CAPS(720,lerp(40,300,eIO(d/0.6)),d*400,1.1);p+=0.41*eOB(cl((d-0.5)/0.6))}$('pill7').innerHTML=s;setTank('t7',Math.min(1,p),t)}
 if(t>=31.4){const dp=eIO(cl((t-31.7)/0.6));$('drop9').style.transform+=` translateY(${dp*260}px)`;$('drop9').style.opacity=1-cl((t-32.2)/0.1);const tap=Math.max(0,Math.sin((t-32.3)*8));$('hand9').style.transform+=` translate(${-tap*26}px,${-tap*18}px)`;$('cart9').style.transform+=` scale(${1+0.04*Math.max(0,Math.sin((t-32.3)*8-0.6))})`}
};
