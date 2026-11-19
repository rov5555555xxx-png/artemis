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
function focus(id,cx,cy,rx,ry,p){if(p<=0)return '';const k=eOC(cl(p)),L=Math.PI*(rx+ry)*1.12;
 return `<defs><mask id="fm${id}"><rect x="-200" y="-200" width="1840" height="1480" fill="#fff"/><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#000"/></mask></defs><rect x="-200" y="-200" width="1840" height="1480" fill="#0B0C0F" opacity="${0.62*k}" mask="url(#fm${id})"/>`+
 `<ellipse cx="${cx}" cy="${cy}" rx="${rx+14}" ry="${ry+14}" fill="none" stroke="#FF3B3F" stroke-width="9" stroke-linecap="round" stroke-dasharray="${L}" stroke-dashoffset="${L*(1-k)}" transform="rotate(-6 ${cx} ${cy})"/>`};
