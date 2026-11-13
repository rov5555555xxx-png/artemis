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

// ---------- animated landscapes behind each scene (soft, slow: focus stays centre)
const LS={};
function cloud(x,y,s,o=1){return `<g class="cl" data-x="${x}" data-s="${s}" transform="translate(${x} ${y}) scale(${s})" opacity="${o}"><ellipse cx="0" cy="0" rx="90" ry="40" fill="#fff"/><circle cx="-40" cy="-20" r="40" fill="#fff"/><circle cx="20" cy="-36" r="52" fill="#fff"/><circle cx="70" cy="-12" r="34" fill="#fff"/></g>`}
function city(base,col,lit,seed0){let s='';let x=-20,k=seed0;const r=()=>{k=(k*9301+49297)%233280;return k/233280};while(x<1460){const w=70+r()*90,h=140+r()*300;s+=`<rect x="${x}" y="${base-h}" width="${w}" height="${h+200}" fill="${col}"/>`;for(let wy=base-h+20;wy<base-20;wy+=34)for(let wx=x+12;wx<x+w-16;wx+=26){s+=`<rect class="win" data-p="${r()}" x="${wx}" y="${wy}" width="12" height="16" rx="2" fill="${lit}" opacity="${r()<0.5?0.9:0.15}"/>`}x+=w+6}return s}
function mountains(cols,base){return `<path d="M-20 ${base}L180 ${base-260}L330 ${base-140}L520 ${base-330}L700 ${base-160}L880 ${base-300}L1080 ${base-120}L1260 ${base-280}L1460 ${base-90}V1100H-20Z" fill="${cols[0]}"/><path d="M-20 ${base+80}L240 ${base-120}L470 ${base+20}L760 ${base-160}L1010 ${base+30}L1240 ${base-110}L1460 ${base+40}V1100H-20Z" fill="${cols[1]}"/><path d="M-20 ${base+190}Q360 ${base+90} 720 ${base+170}T1460 ${base+150}V1100H-20Z" fill="${cols[2]}"/>`}
function buildLand(type){let s='';const sky=(a,b)=>`<defs><linearGradient id="g_${type}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="1440" height="1080" fill="url(#g_${type})"/>`;
 if(type==='city-day'){s=sky('#8FD3FF','#E9F7FF')+cloud(200,160,1)+cloud(900,120,.8)+cloud(1300,230,.9)+city(1080,'#B9C7DA','#FFFFFF',3)+city(1080,'#93A5BF','#FFF6C8',7).replace(/height="(\d+)"/g,(m,h)=>m)}
 else if(type==='sunset'){s=sky('#FF7A59','#FFD29A')+`<circle class="sunbg" cx="720" cy="640" r="140" fill="#FFE07A" opacity=".9"/>`+cloud(260,200,.9,.7)+cloud(1150,160,1,.7)+mountains(['#C2577A','#8E3B66','#5B2A55'],760)}
 else if(type==='clouds'){s=sky('#A8DCFF','#F2FAFF')+cloud(150,250,1.6)+cloud(700,170,1.3)+cloud(1250,280,1.7)+cloud(450,820,1.8,.9)+cloud(1100,880,1.6,.9)}
 else if(type==='meadow'){s=sky('#9FDBFF','#EAF9FF')+cloud(300,150,1)+cloud(1100,200,1.1)+`<path d="M-20 760Q360 640 720 720T1460 700V1100H-20Z" fill="#9BD67A"/><path d="M-20 860Q420 780 820 860T1460 840V1100H-20Z" fill="#6FBF5A"/>`+[...Array(14)].map((_,i)=>`<g class="fl" transform="translate(${80+i*100} ${900+(i%3)*30})"><path d="M0 0v-24" stroke="#3F8F3A" stroke-width="4"/><circle cy="-28" r="9" fill="${['#FF8FB1','#FFD23F','#fff'][i%3]}"/></g>`).join('')}
 else if(type==='sunny'){s=sky('#6EC8FF','#E6F7FF')+cloud(220,260,1)+cloud(1220,220,1.1)+mountains(['#9CC9E8','#79B3D6','#8FD07A'],820)}
 else if(type==='city-dusk'){s=sky('#5A4E9A','#FF9E7A')+cloud(300,180,1,.5)+cloud(1100,140,.9,.5)+city(1080,'#4C4672','#FFD98A',11)}
 else if(type==='city-night'){s=sky('#141B45','#3A3F7A')+[...Array(60)].map((_,i)=>`<circle class="st" data-p="${(i*37%100)/100}" cx="${(i*233)%1440}" cy="${(i*97)%560}" r="${1.5+(i%3)}" fill="#fff"/>`).join('')+`<g transform="translate(1180 170)"><circle r="60" fill="#FFF3B0"/><circle cx="24" cy="-14" r="52" fill="#141B45"/></g>`+city(1080,'#232A5C','#FFD98A',5)}
 else if(type==='mountain-morning'){s=sky('#FFC9A8','#FFF3E0')+`<circle cx="720" cy="560" r="120" fill="#FFE3A0"/>`+cloud(250,220,1,.85)+cloud(1180,180,1.1,.85)+mountains(['#A7B8E0','#7F95C9','#7FBF8F'],760)}
 else if(type==='beach'){s=sky('#7FD3FF','#E8F8FF')+cloud(250,170,1)+cloud(1150,140,1.1)+`<rect y="700" width="1440" height="400" fill="#4FB3E8"/><g class="wv"><path d="M-80 720q60 -20 120 0t120 0t120 0t120 0t120 0t120 0t120 0t120 0t120 0t120 0t120 0t120 0t120 0t120 0" fill="none" stroke="#fff" stroke-width="6" opacity=".7"/><path d="M-80 800q60 -20 120 0t120 0t120 0t120 0t120 0t120 0t120 0t120 0t120 0t120 0t120 0t120 0t120 0t120 0" fill="none" stroke="#fff" stroke-width="6" opacity=".5"/></g><path d="M-20 930Q720 860 1460 930V1100H-20Z" fill="#FFE2A8"/>`}
 return s}
scenes.forEach(sc=>{const ty=sc.el.dataset.land;if(!ty)return;const sv=document.createElementNS(NS,'svg');sv.setAttribute('class','land');sv.setAttribute('viewBox','0 0 1440 1080');sv.style.cssText='position:absolute;left:-40px;top:-30px;width:1520px;height:1140px';sv.innerHTML=buildLand(ty);sc.el.insertBefore(sv,sc.el.children[1]);
 const sp=document.createElement('div');sp.className='spot';sc.el.insertBefore(sp,sv.nextSibling);
 sc.land={sv,cl:[...sv.querySelectorAll('.cl')].map(c=>({c,x:+c.dataset.x,s:+c.dataset.s,y:+c.getAttribute('transform').match(/translate\([\d.-]+ ([\d.-]+)/)[1]})),win:[...sv.querySelectorAll('.win')],st:[...sv.querySelectorAll('.st')],wv:sv.querySelector('.wv'),fl:[...sv.querySelectorAll('.fl')],sun:sv.querySelector('.sunbg')}});
function landRender(t){scenes.forEach(sc=>{if(!sc.land||sc.el.style.display==='none')return;const L=sc.land;const lt=t-sc.s;
 L.cl.forEach((c,i)=>{const x=((c.x+lt*(14+i*5)+200)%1840)-200;c.c.setAttribute('transform',`translate(${x} ${c.y}) scale(${c.s})`)});
 L.win.forEach((w,i)=>{if(i%7===0){const p=+w.dataset.p;w.setAttribute('opacity',Math.sin(t*1.3+p*20)>0.6?0.95:0.2)}});
 L.st.forEach(s=>{const p=+s.dataset.p;s.setAttribute('opacity',0.4+0.6*Math.abs(Math.sin(t*2+p*30)))});
 if(L.wv)L.wv.setAttribute('transform',`translate(${(t*40)%120} ${Math.sin(t*2)*4})`);
 L.fl.forEach((f,i)=>{const tr=f.getAttribute('transform').replace(/ rotate\([^)]*\)/,'');f.setAttribute('transform',tr+` rotate(${Math.sin(t*2+i)*8})`)});
 if(L.sun)L.sun.setAttribute('cy',640+lt*12);
 L.sv.style.transform=`translate(${Math.sin(t*0.3)*8}px,0) scale(${1+lt*0.004})`})}
// ---------- vitamin-D ring around a character
document.querySelectorAll('svg.dring').forEach(sv=>{const id=sv.dataset.id,night=sv.dataset.mode==='night';const C=2*Math.PI*170;
 sv.innerHTML=`<defs><clipPath id="${id}cp"><circle r="138"/></clipPath></defs><circle r="150" fill="${night?'#2D3E8F':'#BFE8FF'}" stroke="${INK}" stroke-width="8"/>
 <g clip-path="url(#${id}cp)"><g transform="translate(0 175) scale(.62)">${kid({shirt:night?'#7FA2FF':'#3DDC97',hair:'#2B1B12',faces:[{e:night?'bored':'happy'}],armL:'down',armR:'down'})}</g></g>
 <circle r="170" fill="none" stroke="#fff" stroke-width="40"/><circle r="170" fill="none" stroke="${INK}" stroke-width="4" opacity=".25"/>
 <circle id="${id}a" r="170" fill="none" stroke="#FFC21A" stroke-width="30" stroke-linecap="round" stroke-dasharray="0 ${C}" transform="rotate(-90)"/>
 <circle r="190" fill="none" stroke="${INK}" stroke-width="6"/><circle r="150" fill="none" stroke="${INK}" stroke-width="6"/>
 <g transform="translate(0 196)"><rect x="-150" y="-32" width="300" height="64" rx="32" fill="#fff" stroke="${INK}" stroke-width="6"/><text id="${id}t" y="14" text-anchor="middle" font-family="K" font-weight="900" font-size="38" fill="${INK}">0%</text></g>
 <g id="${id}sp" opacity="0">${[...Array(10)].map((_,i)=>`<path d="M0 -205L8 -235L0 -265L-8 -235Z" fill="#FFD23F" stroke="${INK}" stroke-width="3" transform="rotate(${i*36})"/>`).join('')}</g>`;sv._C=C});
function setRing(id,p,flash){const a=$(id+'a');if(!a)return;const C=2*Math.PI*170;a.setAttribute('stroke-dasharray',`${C*p} ${C}`);a.setAttribute('stroke',p>=0.995?'#3DDC97':'#FFC21A');$(id+'t').textContent=`วิตามินดี ${Math.round(p*100)}%`;const sp=$(id+'sp');sp.setAttribute('opacity',flash);sp.setAttribute('transform',`scale(${0.9+0.25*flash}) rotate(${flash*30})`)}


// ---------- character takes the capsule(s), then drinks water
function eater(id,t,t0,n,night,sc=1){const sv=$(id);if(!sv)return;const L=(a,b)=>cl((t-t0-a*sc)/((b-a)*sc));
 const shirt=night?'#7FA2FF':'#3DDC97',sk='#FFD7B5';
 // right hand path: rest -> show up -> mouth -> rest
 let rh=[440,430];const up=[470,150],mouth=[322,238],rest=[440,430];
 const a1=eIO(L(0,0.35)),a2=eIO(L(0.75,1.05)),a3=eIO(L(1.05,1.3));
 rh=[lerp(rest[0],up[0],a1),lerp(rest[1],up[1],a1)];if(a2>0)rh=[lerp(up[0],mouth[0],a2),lerp(up[1],mouth[1],a2)];if(a3>0)rh=[lerp(mouth[0],rest[0],a3),lerp(mouth[1],rest[1],a3)];
 if(a1>=1&&a2<=0)rh[1]+=Math.sin((t-t0)*10)*6;
 const capsVisible=(t-t0)<1.05*sc&&(t-t0)>=0;
 // left hand with glass: rest -> mouth (drink) -> rest
 const b1=eIO(L(1.05,1.35)),tilt=eIO(L(1.35,1.95)),b2=eIO(L(1.95,2.25));
 let lh=[165,420];const lm=[262,236];lh=[lerp(165,lm[0],b1),lerp(420,lm[1],b1)];if(b2>0)lh=[lerp(lm[0],165,b2),lerp(lm[1],420,b2)];
 const ang=-70*tilt*(1-b2);const water=1-0.7*tilt;
 const headTilt=-8*tilt*(1-b2);const mouthOpen=(a2>0.6&&(t-t0)<1.15*sc)||(tilt>0.05&&b2<0.5);
 const done=L(2.25,2.5);
 const arm=(sx,sy,hx,hy)=>`<path d="M${sx} ${sy}L${hx} ${hy}" stroke="${INK}" stroke-width="40" stroke-linecap="round"/><path d="M${sx} ${sy}L${hx} ${hy}" stroke="${shirt}" stroke-width="28" stroke-linecap="round"/><circle cx="${hx}" cy="${hy}" r="22" fill="${sk}" stroke="${INK}" stroke-width="6"/>`;
 let caps='';if(capsVisible){const s=n===1?[[0,-34,-20]]:[[-26,-40,-25],[26,-30,15]];caps=s.map(([dx,dy,r])=>CAPS(rh[0]+dx*(1-a2),rh[1]+dy*(1-a2),r,1.05*(1-0.5*a2))).join('')}
 const glass=`<g transform="translate(${lh[0]} ${lh[1]}) rotate(${ang})"><path d="M-30 -96H30L24 6Q22 14 14 14H-14Q-22 14 -24 6Z" fill="rgba(200,235,255,.75)" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><clipPath id="${id}gc"><path d="M-28 -94H28L22 4Q20 12 14 12H-14Q-20 12 -22 4Z"/></clipPath><g clip-path="url(#${id}gc)"><rect x="-60" y="${12-104*water}" width="120" height="140" fill="#5BC0F8" opacity=".85"/></g><path d="M-18 -80v70" stroke="#fff" stroke-width="5" opacity=".7" stroke-linecap="round"/></g>`;
 const face=mouthOpen?`<ellipse cx="0" cy="38" rx="16" ry="18" fill="${INK}"/>`:(done>0||!night?`<path d="M-26 28Q0 58 26 28z" fill="${INK}"/>`:`<path d="M-16 38q16 -8 32 0" stroke="${INK}" stroke-width="6" fill="none" stroke-linecap="round"/>`);
 const eyes=(night&&done<=0&&(t-t0)<0)?`<path d="M-44 -6h26M18 -6h26" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>`:(tilt>0.1&&b2<0.5?`<path d="M-44 -4q13 -10 26 0M18 -4q13 -10 26 0" stroke="${INK}" stroke-width="6" fill="none" stroke-linecap="round"/>`:`<circle cx="-30" cy="-6" r="9" fill="${INK}"/><circle cx="30" cy="-6" r="9" fill="${INK}"/>`);
 const head=`<g transform="translate(300 190) rotate(${headTilt})"><circle r="92" fill="${sk}" stroke="${INK}" stroke-width="7"/><path d="M-92 4C-100 -130 100 -130 92 4C84 -36 44 -56 6 -44C-18 -62 -62 -52 -92 4z" fill="#2B1B12" stroke="${INK}" stroke-width="6"/>${eyes}${face}<ellipse cx="-54" cy="22" rx="14" ry="9" fill="#FF8FA3" opacity=".7"/><ellipse cx="54" cy="22" rx="14" ry="9" fill="#FF8FA3" opacity=".7"/></g>`;
 const body=`<path d="M195 470V340a60 60 0 0 1 60 -60h90a60 60 0 0 1 60 60V470z" fill="${shirt}" stroke="${INK}" stroke-width="7"/><path d="M262 282q38 34 76 0" fill="#fff" stroke="${INK}" stroke-width="6"/>`;
 let lab='';if(done>0)lab=`<g transform="translate(300 470) scale(${eOB(done)})"><rect x="-170" y="-40" width="340" height="80" rx="40" fill="#fff" stroke="${INK}" stroke-width="7"/><text y="18" text-anchor="middle" font-family="K" font-weight="900" font-size="50" fill="#E8231F">วันละ ${n} เม็ด</text></g>`;
 let spark='';if(done>0)spark=[...Array(8)].map((_,i)=>`<path transform="translate(300 190) rotate(${i*45+t*30})" d="M0 -140L7 -160L0 -180L-7 -160Z" fill="#FFD23F" stroke="${INK}" stroke-width="3" opacity="${1-cl((t-t0-2.7*sc)/0.5)}"/>`).join('');
 sv.innerHTML=body+arm(395,320,rh[0],rh[1])+caps+head+arm(205,320,lh[0],lh[1])+glass+spark+lab}

window.extra=function(t){
 landRender(t);
 hlRender(t);
 if(t>=3.6&&t<9.2){let v=0.15+0.04*Math.sin(t*3);if(t>5.8)v=lerp(v,0.92,eOC(cl((t-5.9)/1.3)));setGauge('g2',v,t>6.4?'2000–5000 IU':'');
  let s='';for(let i=0;i<10;i++){const d=t-5.9-i*0.13;if(d<0||d>0.9)continue;const p=d/0.9;s+=CAPS(720,lerp(40,470,eIO(p)),i*36+d*240,0.9*(1-p*0.4))}$('pour2').innerHTML=s}
 if(t>=8.5&&t<12){$('row3').style.opacity=cl((t-9.6)/0.25)}
 if(t>=11.3&&t<14){setGauge('g4',lerp(0.9,0.22,eOB(cl((t-11.55)/0.8))),'600 IU')}
 if(t>=13.3&&t<19.6){let s='';const sx=720,sy=70;s+=`<g transform="translate(${sx} ${sy}) rotate(${t*16})">${[...Array(12)].map((_,i)=>`<rect x="-7" y="-82" width="14" height="28" rx="7" fill="#FFB300" stroke="${INK}" stroke-width="4" transform="rotate(${i*30})"/>`).join('')}<circle r="48" fill="#FFD23F" stroke="${INK}" stroke-width="7"/></g>`;$('sun5').innerHTML=s;$('pill5').innerHTML='';eater('eat5',t,16.95,1,false,0.9)}
 if(t>=19.0&&t<25.6){const p=cl((t-19.3)/5.0);const a=Math.PI*(1-p*1.2);const sx=300+Math.cos(a)*200,sy=330-Math.sin(a)*240;$('sunO').setAttribute('transform',`translate(${sx} ${sy})`);
  const night=cl((p-0.72)/0.2);$('moonO').setAttribute('opacity',night);$('moonO').setAttribute('transform','translate(430 150)');$('starsO').setAttribute('opacity',night);
  const c1=night>0?`rgb(${Math.round(lerp(255,30,night))},${Math.round(lerp(150,40,night))},${Math.round(lerp(90,110,night))})`:(p>0.55?`rgb(255,${Math.round(lerp(211,150,(p-0.55)/0.17))},${Math.round(lerp(255,90,(p-0.55)/0.17))})`:'#7FD3FF');
  $('sk1').setAttribute('stop-color',c1);$('sk2').setAttribute('stop-color',night>0?`rgb(${Math.round(lerp(255,60,night))},${Math.round(lerp(220,70,night))},${Math.round(lerp(180,140,night))})`:'#DFF4FF')}
 if(t>=24.9&&t<28.4){$('pill7').innerHTML='';eater('eat7',t,25.35,2,true,0.95)}
 if(t>=31.4){const dp=eIO(cl((t-31.7)/0.6));$('drop9').style.transform+=` translateY(${dp*260}px)`;$('drop9').style.opacity=1-cl((t-32.2)/0.1);const tap=Math.max(0,Math.sin((t-32.3)*8));$('hand9').style.transform+=` translate(${-tap*26}px,${-tap*18}px)`;$('cart9').style.transform+=` scale(${1+0.04*Math.max(0,Math.sin((t-32.3)*8-0.6))})`}
};
