const lerp=(a,b,p)=>a+(b-a)*p;
const RED='#E8231F';
const ZB=(x,y,r=26,t='B')=>`<g transform="translate(${x} ${y})"><circle r="${r}" fill="#FFD23F" stroke="${INK}" stroke-width="5"/><ellipse cx="${-r*.3}" cy="${-r*.35}" rx="${r*.38}" ry="${r*.22}" fill="#fff" opacity=".9"/><text y="${r*.36}" text-anchor="middle" font-family="K" font-weight="900" font-size="${r*1.0}" fill="${INK}">${t}</text></g>`;
// comic burst
document.querySelectorAll('svg.burst').forEach(sv=>{const pts=[...Array(28)].map((_,i)=>{const a=i/28*2*Math.PI,r=i%2?0.8:1;return `${(570+Math.cos(a)*560*r).toFixed(0)},${(135+Math.sin(a)*150*r).toFixed(0)}`}).join(' ');
 sv.innerHTML=`<polygon points="${pts}" fill="${INK}" transform="translate(0 14)"/><polygon points="${pts}" fill="#FFD23F" stroke="${INK}" stroke-width="10" stroke-linejoin="round"/>`});
// batteries
document.querySelectorAll('svg.batt').forEach(sv=>{const id=sv.dataset.id;sv.innerHTML=`<rect x="10" y="20" width="300" height="160" rx="30" fill="#fff" stroke="${INK}" stroke-width="12"/><rect x="314" y="70" width="34" height="60" rx="10" fill="${INK}"/><rect id="${id}f" x="30" y="40" width="0" height="120" rx="16" fill="#3DDC97"/><text id="${id}t" x="160" y="122" text-anchor="middle" font-family="K" font-weight="900" font-size="64" fill="${INK}" stroke="#fff" stroke-width="10" paint-order="stroke fill"></text>`});
function batt(id,p){const f=$(id+'f');if(!f)return;f.setAttribute('width',Math.max(0,260*p));f.setAttribute('fill',p<0.25?'#FF4D4D':p<0.6?'#FFD23F':'#3DDC97');$(id+'t').textContent=Math.round(p*100)+'%'}
// red annotation marks (draw-on)
document.querySelectorAll('.mk').forEach(e=>{const w=parseFloat(e.style.width),h=parseFloat(e.style.height),k=e.dataset.mk;let d='';
 if(k==='ellipse'){const rx=w/2-12,ry=h/2-12;d=`M${w/2+rx} ${h/2}`;for(let i=1;i<=46;i++){const a=i/40*2*Math.PI;d+=`L${w/2+Math.cos(a)*rx*(1+0.03*Math.sin(i))} ${h/2+Math.sin(a)*ry*(1+0.03*Math.cos(i*1.3))}`}}
 else if(k==='box'){d=`M20 14H${w-14}V${h-18}H16V22`}
 else if(k==='arrow'){d=`M${w*0.2} 10L${w*0.5} ${h-20}M${w*0.5} ${h-20}L${w*0.25} ${h-50}M${w*0.5} ${h-20}L${w*0.78} ${h-48}`}
 e.innerHTML=`<svg width="${w}" height="${h}" style="overflow:visible"><path d="${d}" fill="none" stroke="#fff" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" opacity=".9"/><path class="mkp" d="${d}" fill="none" stroke="${RED}" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
 e._p=[...e.querySelectorAll('path')];e._p.forEach(p=>{const L=p.getTotalLength();p.style.strokeDasharray=L;p._L=L})});
// gears
(function(){const g=(cx,cy,r,col,n,id)=>{let teeth='';for(let i=0;i<n;i++){const a=i/n*360;teeth+=`<rect x="${-r*0.16}" y="${-r-r*0.22}" width="${r*0.32}" height="${r*0.4}" rx="6" fill="${col}" stroke="${INK}" stroke-width="6" transform="rotate(${a})"/>`}
  return `<g transform="translate(${cx} ${cy})"><g id="${id}">${teeth}<circle r="${r}" fill="${col}" stroke="${INK}" stroke-width="8"/><circle r="${r*0.62}" fill="#fff" stroke="${INK}" stroke-width="6"/></g>${ZB(0,0,r*0.45)}</g>`};
 $('gears3').innerHTML=g(325,295,105,'#7FA2FF',10,'g1')+g(720,475,105,'#FF8FB1',10,'g2')+g(1080,300,90,'#FFB36B',9,'g3')+`<g id="out3" transform="translate(1180 470)"><path d="M10 -70L-40 10H0L-20 80L50 -10H10L30 -70Z" fill="#FFD23F" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/></g>`})();
// food vs tiny spark
const FOODS=[['#FFB36B','burger'],['#FFD23F','rice'],['#FF8FB1','cake']];
function foodIcon(x,y,s,k){if(k==='burger')return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-50 -6Q-50 -50 0 -50Q50 -50 50 -6Z" fill="#FFB36B" stroke="${INK}" stroke-width="6"/><rect x="-54" y="-6" width="108" height="14" rx="7" fill="#3DDC97" stroke="${INK}" stroke-width="5"/><rect x="-52" y="8" width="104" height="16" rx="8" fill="#8B4A2B" stroke="${INK}" stroke-width="5"/><path d="M-50 24H50Q50 46 0 46Q-50 46 -50 24Z" fill="#FFB36B" stroke="${INK}" stroke-width="6"/></g>`;
 if(k==='rice')return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-46 -10Q-40 -50 0 -50Q40 -50 46 -10Z" fill="#fff" stroke="${INK}" stroke-width="6"/><path d="M-56 -10H56Q50 46 0 46Q-50 46 -56 -10Z" fill="#7FA2FF" stroke="${INK}" stroke-width="6"/></g>`;
 return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-50 40V-6L50 -30V40Z" fill="#FFE3EC" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><path d="M-50 -6L50 -30L50 -14L-50 10Z" fill="#FF8FB1" stroke="${INK}" stroke-width="5"/><circle cx="20" cy="-40" r="10" fill="#FF4D4D" stroke="${INK}" stroke-width="4"/></g>`}
$('medal5').innerHTML=`<path d="M70 0L100 90H140L170 0Z" fill="#FF6B6B" stroke="${INK}" stroke-width="7"/><circle cx="120" cy="160" r="88" fill="#FFD23F" stroke="${INK}" stroke-width="9"/><circle cx="120" cy="160" r="66" fill="none" stroke="#fff" stroke-width="6" stroke-dasharray="12 9"/><text x="120" y="196" text-anchor="middle" font-family="K" font-weight="900" font-size="104" fill="#fff" stroke="${INK}" stroke-width="10" paint-order="stroke fill">1</text>`;
$('sun6').innerHTML=`<g id="sunR">${[...Array(12)].map((_,i)=>`<rect x="104" y="6" width="12" height="40" rx="6" fill="#FFB36B" stroke="${INK}" stroke-width="4" transform="rotate(${i*30} 110 110)"/>`).join('')}</g><circle cx="110" cy="110" r="58" fill="#FFD23F" stroke="${INK}" stroke-width="8"/><circle cx="92" cy="104" r="6" fill="${INK}"/><circle cx="128" cy="104" r="6" fill="${INK}"/><path d="M92 124q18 14 36 0" stroke="${INK}" stroke-width="6" fill="none" stroke-linecap="round"/>`;
document.querySelectorAll('.hero[data-sym]').forEach(e=>e.innerHTML=heroSvg(e.dataset.sym,e.dataset.name));
scenes.forEach(sc=>{['top','bot'].forEach(k=>{const d=document.createElement('div');d.className='scal '+k;sc.el.insertBefore(d,sc.el.children[2])})});
scenes.forEach(sc=>sc.parts.forEach((p,k)=>{const c=['#FFD23F','#FF8FB1','#7FA2FF','#3DDC97','#fff'][k%5];p.d.style.border='6px solid '+c}));
window.extra=function(t){
 scenes.forEach(sc=>{if(sc.el.style.display==='none')return;const bg=sc.el.querySelector('.sbg');const x=(t*26)%400,y=(t*18)%400;bg.style.backgroundPosition=`${x}px ${y}px, ${x}px ${y}px, 0 0`;sc.el.querySelectorAll('.scal').forEach((s,j)=>s.style.backgroundPosition=`${(j?-1:1)*t*30}px 0`)});
 document.querySelectorAll('.mk').forEach(e=>{const d=cl((t-+e.dataset.at)/0.3);e._p.forEach(p=>p.style.strokeDashoffset=p._L*(1-eOC(d)));if(d>=1)e.style.transform+=` rotate(${Math.sin(t*9)*1.2}deg) scale(${1+0.02*Math.sin(t*12)})`});
 // flash on the hard cut
 {const d=t-1.35;$('flash').style.opacity=(d>=0&&d<0.14)?0.55*(1-d/0.14):0}
 if(t<1.5){batt('b1',Math.floor(t*4)%2?0.1:0.04);const b=$('burst1');b.style.transform+=` scale(${1+0.035*Math.sin(t*11)}) rotate(${Math.sin(t*7)*1.2}deg)`;
  const k=$('kt1');k.style.transform=`scale(${1+0.045*Math.max(0,Math.sin(t*11+0.6))}) rotate(${Math.sin(t*6)*-1.5}deg)`;k.style.color=(Math.floor(t*6)%2)?'#FF2E3D':'#FF1744';
  let s='';for(let i=0;i<3;i++){const d=((t*1.2+i/3)%1);s+=`<path transform="translate(${560+i*30} ${170+d*120}) scale(${1-d*0.3})" d="M0 0q12 20 0 28q-12 -8 0 -28z" fill="#7FD3FF" stroke="${INK}" stroke-width="4" opacity="${1-d}"/>`}$('sweat1').innerHTML=s}
 if(t>=3.2&&t<6.6){const p=eOC(cl((t-3.6)/2.0));batt('b2',0.1+0.9*p);let s='';for(let i=0;i<5;i++){const d=((t*1.8+i/5)%1);const x=500+d*230,y=350+Math.sin(d*Math.PI*2+i)*30;s+=`<path transform="translate(${x} ${y}) scale(.55)" d="M10 -70L-40 10H0L-20 80L50 -10H10L30 -70Z" fill="#FFD23F" stroke="${INK}" stroke-width="10" stroke-linejoin="round" opacity="${Math.sin(d*Math.PI)}"/>`}$('bolt2').innerHTML=s}
 if(t>=6&&t<10.4){$('g1')&&$('g1').setAttribute('transform',`rotate(${t*60})`);$('g2').setAttribute('transform',`rotate(${-t*60+18})`);$('g3').setAttribute('transform',`rotate(${t*70})`);$('out3').setAttribute('transform',`translate(1180 470) scale(${1+0.15*Math.max(0,Math.sin(t*8))})`)}
 if(t>=9.8&&t<14){let s='';for(let i=0;i<6;i++){const at=11.3+i*0.16,d=t-at;if(d<0)continue;const k=cl(d/0.5);const x=lerp(180+(i%3)*110,640,eIO(k)),y=lerp(380+Math.floor(i/3)*120,320,eIO(k));if(k<1||d<0.7)s+=foodIcon(x,y,(1-0.5*k)*0.9,FOODS[i%3][1])}
  if(t>12.6){const d=t-12.6;s+=`<g transform="translate(1125 425) scale(${0.35+0.05*Math.sin(t*10)})"><path d="M10 -70L-40 10H0L-20 80L50 -10H10L30 -70Z" fill="#FFD23F" stroke="${INK}" stroke-width="12" stroke-linejoin="round"/></g>`}
  s+=`<path d="M900 420H1040" stroke="${INK}" stroke-width="10" stroke-dasharray="16 12" opacity="${cl((t-12.5)/0.2)}"/>`;$('food4').innerHTML=s}
 if(t>=15.4&&t<17.8){$('sunR')&&$('sunR').setAttribute('transform',`rotate(${t*30} 110 110)`)}
 if(t>=17.4){batt('b7',cl(0.6+0.4*eOC(cl((t-17.7)/0.8))))}
};
