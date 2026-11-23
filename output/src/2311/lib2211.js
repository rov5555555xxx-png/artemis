
function bigQ(x,y,s,t,p){if(p<=0)return '';return `<g transform="translate(${x} ${y}) scale(${eOB(cl(p))*s}) rotate(${Math.sin(t*4)*8})"><circle r="70" fill="#F3D9A4" stroke="#7A5B2E" stroke-width="6"/><text y="34" text-anchor="middle" font-family="K" font-weight="900" font-size="100" fill="#16171B">?</text></g>`}
function pellet(cx,cy,R,layers,t,lid){let s=`<defs><radialGradient id="pc${lid}" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#C9CED8"/></radialGradient></defs>`;
 const cols=['#F3D9A4','#E8C88E','#D9B98A','#C9A673','#B8925C'];
 for(let i=cols.length-1;i>=0;i--){const v=layers[i];if(v<=0)continue;const r=R*(0.45+0.11*(i+1));s+=`<circle cx="${cx}" cy="${cy}" r="${r*Math.min(1,v)}" fill="${cols[i]}" stroke="#7A5B2E" stroke-width="3" opacity="${Math.min(1,v)}"/>`}
 s+=`<circle cx="${cx}" cy="${cy}" r="${R*0.45}" fill="url(#pc${lid})" stroke="#7C838F" stroke-width="4"/><text x="${cx}" y="${cy+R*0.15}" text-anchor="middle" font-family="Arial" font-weight="700" font-size="${R*0.38}" fill="#3A3F47">Zn</text>`;
 return s}
function chartZ(lt,blueP,goldP,mark){let s='';const X0=230,Y0=640,W=980,H=420,HM=8;s+=axes(X0,Y0,W,H,HM,'ซิงค์ในร่างกาย',2);
 const N=150;const fast=h=>0.7*Math.pow(h/2,2)*Math.exp(2*(1-h/2)),slow=h=>0.6*(1-Math.exp(-h*1.1))*(h<6?1:Math.exp(-(h-6)*0.3));
 const path=(fn,pr)=>{const n=Math.max(2,Math.floor(N*pr));let d='';for(let i=0;i<=n;i++){const h=HM*i/N;d+=(i?'L':'M')+(X0+W*h/HM).toFixed(1)+' '+(Y0-H*fn(h)).toFixed(1)}return [d,X0+W*n/N]};
 if(blueP>0){const [d]=path(fast,blueP);s+=`<path d="${d}" stroke="#7FA8E0" stroke-width="9" fill="none" stroke-linecap="round"/>`}
 if(goldP>0){const [d,xe]=path(slow,goldP);s+=`<path d="${d} L${xe} ${Y0} L${X0} ${Y0}Z" fill="#F3D9A4" opacity=".18"/><path d="${d}" stroke="#F3D9A4" stroke-width="12" fill="none" stroke-linecap="round"/>`}
 s+=`<text x="1290" y="300" text-anchor="middle" font-family="K" font-weight="900" font-size="26" fill="#7FA8E0">บิสไกลซิเนต</text><text x="1290" y="332" text-anchor="middle" font-family="K" font-weight="900" font-size="26" fill="#7FA8E0">ทั่วไป</text><rect x="1220" y="346" width="140" height="8" rx="4" fill="#7FA8E0"/>`;
 if(goldP>0)s+=jarAt('jar.png',1290,220,100)+`<rect x="1220" y="232" width="140" height="8" rx="4" fill="#F3D9A4"/>`;
 return s}
