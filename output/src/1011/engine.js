// Shared scene engine for the 10/11/26 clip (ukiyo-e + art deco versions).
// Scenes: .scene[data-s,data-e,data-tr(scroll|split|wash|cut),data-cam "t:s:fx:fy;..."]
// Items:  .a[data-at,data-an,data-out,data-float,data-bob,data-spin,data-step]
// Text:   .kt[data-at,data-out,data-st,data-fx]  (plate animates, then grapheme clusters)
const W=1440,H=1080;
const cl=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const eOC=p=>1-Math.pow(1-p,3);
const eOB=p=>{const c1=1.9,c3=c1+1;return 1+c3*Math.pow(p-1,3)+c1*Math.pow(p-1,2)};
const eIO=p=>p<.5?2*p*p:1-Math.pow(-2*p+2,2)/2;
const lerp=(a,b,p)=>a+(b-a)*p;
let seed=11;const rnd=()=>{seed=(seed*16807)%2147483647;return (seed-1)/2147483646};
const $=id=>document.getElementById(id);
const NS='http://www.w3.org/2000/svg';
const STEP=window.STEP_FPS||0; // stepped motion for figures/nature (0 = smooth)
const qt=(t,f)=>f?Math.floor(t*f)/f:t;

function initEngine(){
 if(location.hash==='#safe'&&$('safe'))$('safe').style.display='block';
 const seg=new Intl.Segmenter('th',{granularity:'grapheme'});
 window.KTS=[...document.querySelectorAll('.kt')].map(el=>{
  const inner=el.querySelector('.tx')||el;const txt=inner.textContent;inner.textContent='';const gs=[];
  for(const {segment} of seg.segment(txt)){const s=document.createElement('span');s.className='g';s.textContent=segment===' '?'\u00A0':segment;inner.appendChild(s);gs.push(s)}
  return{el,gs,at:+el.dataset.at,st:+(el.dataset.st||0.045),fx:el.dataset.fx||'pop',out:el.dataset.out?+el.dataset.out:null}});
 window.SCENES=[...document.querySelectorAll('.scene')].map(el=>{
  const cam=(el.dataset.cam||'').split(';').filter(Boolean).map(k=>k.split(':').map(Number));
  return{el,s:+el.dataset.s,e:+el.dataset.e,tr:el.dataset.tr||'cut',cam,camEl:el.querySelector('.cam'),items:[...el.querySelectorAll('.a')]}});
}
function camAt(keys,t){if(!keys.length)return[1,720,540];if(t<=keys[0][0])return keys[0].slice(1);
 for(let i=0;i<keys.length-1;i++){const a=keys[i],b=keys[i+1];if(t<=b[0]){const p=eIO(cl((t-a[0])/(b[0]-a[0])));return[1,2,3].map(j=>a[j]+(b[j]-a[j])*p)}}
 return keys[keys.length-1].slice(1)}
function animT(an,p,el){switch(an){
 case'fade':return[eOC(p),'',null];
 case'pop':return[cl(p*4),`scale(${p<=0?0:eOB(p)})`,null];
 case'seal':{const e=eOC(p);return[cl(p*6),`scale(${1.35-0.35*e}) rotate(${-4*(1-e)}deg)`,null]}
 case'print':{const e=eOC(p);const k=-30+e*160; // diagonal baren sweep
   return[1,`translate(${6*(1-e)}px,${-4*(1-e)}px)`,`polygon(0% 0%,${k}% 0%,${k-30}% 100%,0% 100%)`]}
 case'drop':{const e=eOC(p);return[cl(p*2.5),`translateY(${-40*(1-e)}px)`,null]}
 case'up':{const e=eOB(p);return[cl(p*3),`translateY(${90*(1-e)}px)`,null]}
 case'rise':{const e=eOC(p);return[cl(p*2),`translateY(${60*(1-e)}px)`,null]}
 case'left':{const e=eOB(p);return[cl(p*3),`translateX(${-300*(1-e)}px)`,null]}
 case'right':{const e=eOB(p);return[cl(p*3),`translateX(${300*(1-e)}px)`,null]}
 case'unfold':{const e=eIO(p);return[cl(p*4),`scaleX(${Math.max(0.002,e)})`,null]}
 case'unfoldY':{const e=eIO(p);return[cl(p*4),`scaleY(${Math.max(0.002,e)})`,null]}
 case'ignite':{const f=p<1?(p<0.35?p/0.35*1.6:1.6-0.6*eOC((p-0.35)/0.65)):1;return[cl(p*8),`scale(${0.9+0.1*cl(p*3)})`,null,f]}
 } return[1,'',null]}
const DUR={fade:.35,pop:.42,seal:.22,print:.45,drop:.4,up:.45,rise:.5,left:.5,right:.5,unfold:.45,unfoldY:.45,ignite:.4};
const TR={scroll:.6,split:.5,wash:.5,cut:0};

function ktRender(t){for(const k of KTS){
 const vis=t>=k.at-0.12;const outk=k.out!==null?cl((t-k.out)/0.25):0;
 k.el.style.opacity=vis?1-outk:0;if(!vis||outk>=1){continue}
 const pp=cl((t-k.at+0.12)/0.3); // plate
 const plate=k.el.dataset.plate||'print';
 let tr='',clip='none';
 if(plate==='print'){const e=eOC(pp);const kk=-30+e*160;clip=pp<1?`polygon(0% 0%,${kk}% 0%,${kk-30}% 100%,0% 100%)`:'none';tr=`translate(${5*(1-e)}px,${-3*(1-e)}px)`}
 else if(plate==='unfold'){tr=`scaleX(${Math.max(0.002,eIO(pp))})`}
 else if(plate==='none'){}
 if(outk>0)tr+=` translateY(${-30*eIO(outk)}px)`;
 k.el.style.transform=tr;k.el.style.clipPath=clip;
 k.gs.forEach((g,i)=>{const n=k.gs.length;let idx=i;
  if(k.fx==='center')idx=Math.abs(i-(n-1)/2); // unfold from centre
  const lt=t-k.at-idx*k.st;if(lt<0){g.style.opacity=0;return}
  let o=1,tf='';
  if(k.fx==='brush'){const p=cl(lt/0.22);o=cl(p*3);tf=`scale(${1.35-0.35*eOC(p)})`}
  else if(k.fx==='center'||k.fx==='rise'){const p=cl(lt/0.35);o=cl(p*2.5);tf=`translateY(${50*(1-eOC(p))}px)`}
  else if(k.fx==='pop'){const p=cl(lt/0.35);o=cl(p*4);tf=`scale(${p<=0?0:eOB(p)})`}
  else if(k.fx==='slam'){const p=cl(lt/0.25);o=cl(p*4);tf=`scale(${2.2-1.2*eOC(p)})`}
  if(lt>0.5&&k.el.dataset.wave!=='0')tf+=` translateY(${Math.sin(qt(t,STEP||30)*4+i*.6)*3}px)`;
  g.style.opacity=o;g.style.transform=tf})}}

function engineRender(t){
 SCENES.forEach((sc,i)=>{const nx=SCENES[i+1];const tail=nx?TR[nx.tr]:0;
  const on=t>=sc.s-0.0001&&t<sc.e+tail;sc.el.style.display=on?'block':'none';if(!on)return;
  let tf='',clip='none',op=1;
  const q=TR[sc.tr]?cl((t-sc.s)/TR[sc.tr]):1;
  if(sc.tr==='scroll'&&q<1){tf=`translateX(${(1-eIO(q))*(W+90)}px)`}
  if(nx&&nx.tr==='scroll'&&t>=nx.s){const p=eIO(cl((t-nx.s)/TR.scroll));tf=`translateX(${-p*(W+90)}px)`}
  if(sc.tr==='split'&&q<1){const e=eIO(q);clip=`inset(0 ${50*(1-e)}% 0 ${50*(1-e)}%)`}
  if(sc.tr==='wash'&&q<1){op=eOC(q)}
  sc.el.style.transform=tf;sc.el.style.clipPath=clip;sc.el.style.opacity=op;sc.el.style.zIndex=i+1;
  const[s,fx,fy]=camAt(sc.cam,t);if(sc.camEl)sc.camEl.style.transform=`translate(720px,540px) scale(${s}) translate(${-fx}px,${-fy}px)`;
  for(const el of sc.items){const at=+el.dataset.at,an=el.dataset.an||'fade',p=cl((t-at)/DUR[an]);
   let[o,tr,clipI,glow]=t<at?[0,'',null]:animT(an,p,el);const ts=el.dataset.step?qt(t,+el.dataset.step):t;
   if(el.dataset.out){const k=cl((t-+el.dataset.out)/0.3);if(k>0){o*=1-k;tr+=` translateY(${-eIO(k)*30}px)`}}
   if(el.dataset.float){const ph=+el.dataset.float;tr+=` translateY(${Math.sin(ts*2.2+ph)*9}px)`}
   if(el.dataset.bob){const ph=+el.dataset.bob;tr+=` translateY(${Math.sin(ts*3.4+ph)*7}px) rotate(${Math.sin(ts*2.6+ph)*3}deg)`}
   if(el.dataset.spin)tr+=` rotate(${ts*el.dataset.spin}deg)`;
   if(el.dataset.drift)tr+=` translateX(${(ts-sc.s)*el.dataset.drift}px)`;
   if(el.dataset.breathe){const ph=+el.dataset.breathe;tr+=` scale(${1+Math.sin(ts*3+ph)*0.025})`}
   el.style.opacity=o;el.style.transform=tr;if(clipI!==null)el.style.clipPath=(p<1&&clipI)?clipI:'none';
   if(glow!==undefined)el.style.filter=glow>1.01?`brightness(${glow})`:'none'}});
 ktRender(t);
}
