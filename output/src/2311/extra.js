function zdot(x,y,r,gold,o){return `<circle cx="${x}" cy="${y}" r="${r}" fill="${gold?'#F3D9A4':'#7FA8E0'}" stroke="${gold?'#7A5B2E':'#2E4E7A'}" stroke-width="3" opacity="${o==null?1:o}"/>`}
function lock(x,y,s,open,col){const sh=open?-38:0;return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-38 -10 V-50 A38 38 0 0 1 38 -50 V${-10+sh}" transform="translate(${open?30:0} ${sh})" fill="none" stroke="${col||'#F3D9A4'}" stroke-width="16"/><rect x="-62" y="-14" width="124" height="104" rx="18" fill="${col||'#F3D9A4'}" stroke="#7A5B2E" stroke-width="5"/><circle cy="30" r="13" fill="#16171B"/><rect x="-5" y="34" width="10" height="28" fill="#16171B"/></g>`}
function clockTag(x,y,txt,col){return `<g transform="translate(${x} ${y})"><circle r="56" fill="#16171B" stroke="${col}" stroke-width="6"/><path d="M0 0 V-32 M0 0 H24" stroke="${col}" stroke-width="7" stroke-linecap="round"/></g>`+pill(x,y+90,txt,1,col,'#16171B',38)}
function vessel(y,h){return `<rect x="150" y="${y}" width="1140" height="${h}" rx="${h/2}" fill="#8E1A1D" stroke="#B5323A" stroke-width="6"/><rect x="170" y="${y+14}" width="1100" height="14" rx="7" fill="#fff" opacity=".12"/>`}
function toilet(x,y,s,t,swirl){let g=`<g transform="translate(${x} ${y}) scale(${s})"><rect x="40" y="-150" width="90" height="120" rx="14" fill="#E7E9EE" stroke="#9AA0AC" stroke-width="5"/><path d="M-110 -40 H130 Q130 40 60 70 L50 130 H-40 L-50 70 Q-110 40 -110 -40Z" fill="#F4F5F8" stroke="#9AA0AC" stroke-width="5"/><ellipse cx="10" cy="-40" rx="120" ry="30" fill="#DDE1E8" stroke="#9AA0AC" stroke-width="5"/><ellipse cx="10" cy="-38" rx="86" ry="18" fill="#7FB7E8"/>`;
 if(swirl)g+=`<path d="M10 -38 m-60 0 a60 14 0 1 0 120 0 a40 10 0 1 0 -80 0 a20 5 0 1 0 40 0" fill="none" stroke="#fff" stroke-width="5" transform="rotate(${t*200} 10 -38)" opacity=".8"/>`;
 return g+'</g>'}
function bodyS(cx,col,fill){return `<path d="M${cx-110} 330 Q${cx} 280 ${cx+110} 330 L${cx+130} 510 Q${cx+120} 540 ${cx+90} 540 L${cx+80} 660 H${cx-80} L${cx-90} 540 Q${cx-120} 540 ${cx-130} 510Z" fill="${col}" fill-opacity="${fill}" stroke="${col}" stroke-width="5"/><circle cx="${cx}" cy="245" r="55" fill="${col}" fill-opacity="${fill}" stroke="${col}" stroke-width="5"/>`}
window.extra=function(t){
 const on=(a,b)=>t>=a-0.05&&t<b+0.45;
 // S1 locked in blood 6 h
 if(on(0,2.4)){const lt=t;let s=vessel(300,240);
  for(let i=0;i<16;i++){const x=200+((i*73+lt*90)%1040),y=340+(i*37%160);s+=zdot(x,y,16,true)}
  s+=lock(720,260,1.3,false)+clockTag(1150,170,'6 ชม.','#F3D9A4');
  $('v1').innerHTML=s}
 // S2 others: 2 h then flushed
 if(on(2.4,5.0)){const lt=t-2.4;let s=vessel(240,200);
  s+=lock(520,210,1.0,lt>0.8,'#7FA8E0')+clockTag(250,140,'2 ชม.','#7FA8E0');
  for(let i=0;i<12;i++){const p=cl((lt-0.9-i*0.07)/1.1);const x0=260+i*70,y0=290+(i*29%110);let x=x0,y=y0,o=1;if(p>0){x=lerp(x0,1080,eIO(p));y=lerp(y0,560,eIO(p));o=1-cl((p-0.85)/0.15)}s+=zdot(x,y,15,false,o)}
  s+=toilet(1100,560,0.95,t,lt>1.4);
  s+=pill(1100,760-60,'ขับทิ้ง!',cl((lt-1.6)/0.3),'#E5484D','#fff',40);
  $('v2').innerHTML=s}
 // S4 ordinary zinc timeline
 if(on(6.16,11.6)){const lt=t-6.16;let s='';const hr=Math.min(4,4*cl((lt-0.3)/3.6));
  s+=`<g transform="translate(720 120)"><rect x="-140" y="-46" width="280" height="92" rx="46" fill="#16171B" stroke="#7FA8E0" stroke-width="5"/><text y="18" text-anchor="middle" font-family="K" font-weight="900" font-size="50" fill="#9CC0FF">${hr.toFixed(0)} ชม.</text></g>`;
  const lv=hr<2?1:Math.max(0,1-(hr-2)/1.5);s+=bodyS(450,'#7FA8E0',0.12+0.55*lv);
  for(let i=0;i<10;i++){const out=hr>2&&i<10*(1-lv);const x0=400+(i%4)*35,y0=380+Math.floor(i/4)*50;let x=x0,y=y0,o=1;if(out){const p=cl((hr-2-i*0.08)/0.8);x=lerp(x0,820,p);y=lerp(y0,560,p);o=1-p}s+=zdot(x,y,13,false,o)}
  if(hr>2)s+=toilet(950,600,0.6,t,true);
  const use=cl((lt-3.8)/0.4);if(use>0){s+=`<g opacity="${use}"><text x="1130" y="300" text-anchor="middle" font-family="K" font-weight="800" font-size="30" fill="#C9CED8">ร่างกายใช้ได้</text><rect x="1000" y="320" width="260" height="44" rx="22" fill="rgba(255,255,255,.1)"/><rect x="1004" y="324" width="${252*0.3}" height="36" rx="18" fill="#E5484D"/></g>`+pill(1130,420,'ยังไม่คุ้ม!',use,'#E5484D','#fff',36)}
  $('v4').innerHTML=s}
 // S5 iCAP chart + lock
 if(on(11.6,17.4)){const lt=t-11.6;let s=chartZ(lt,1,eIO(cl((lt-0.3)/1.8))).replace('>บิสไกลซิเนต</text>','>ซิงค์</text>');
  s+=`<g transform="translate(560 200) scale(${eOB(cl((lt-1.4)/0.35))*0.6})">${lock(0,0,1,false)}</g>`;
  if(lt>1.8){const k=cl((lt-1.8)/0.3);const x=230+980*6/8,y=640-420*0.6;s+=`<path d="M${x} ${y-30} V640" stroke="#F3D9A4" stroke-width="5" stroke-dasharray="12 9" opacity="${k}"/>`+pill(x,y-70,'6 ชม.',k,'#F3D9A4','#16171B',44)}
  if(lt>3.6){const k=cl((lt-3.6)/0.3);const y=640-420*0.6-26;s+=`<path d="M${230+980*1.6/8} ${y} H${230+980*6/8}" stroke="#2EC4B6" stroke-width="8" opacity="${k}"/>`+pill(230+980*3.9/8,y-46,'แทบไม่ลด',k,'#2EC4B6','#0B2240',34)}
  s+=focus(5,700,350,330,110,(lt-4.6)/0.3);
  $('v5').innerHTML=s}
 // S6 body uses it longer, not flushed
 if(on(17.4,21.95)){const lt=t-17.4;let s='';const g=0.6+0.1*Math.sin(t*4);
  s+=`<circle cx="450" cy="440" r="${200+10*Math.sin(t*3)}" fill="#F3D9A4" opacity=".15"/>`+bodyS(450,'#F3D9A4',g);
  for(let i=0;i<10;i++){const x=400+(i%4)*35+Math.sin(t*2+i)*6,y=380+Math.floor(i/4)*50;s+=zdot(x,y,13,true)}
  s+=`<g transform="translate(450 180) scale(${eOB(cl((lt-0.3)/0.35))*0.55})">${lock(0,0,1,false)}</g>`;
  const p=cl((lt-2.2)/0.35);if(p>0){s+=`<g opacity="${p}">${toilet(1050,420,0.7,t,false)}</g>`+cross(1050,380,80,cl((lt-2.5)/0.3))+pill(1050,600,'ไม่ถูกขับทิ้งเร็ว',p,'#16171B','#F3D9A4',34)}
  else s+=pill(1000,400,'ใช้ได้นานขึ้น',cl((lt-0.6)/0.3),'#F3D9A4','#16171B',44);
  $('v6').innerHTML=s}
 // S7 switch: ordinary tablet -> iCAP
 if(on(21.95,25.6)){const lt=t-21.95;let s='';
  s+=`<g opacity="${1-0.6*cl((lt-0.8)/0.4)}"><ellipse cx="380" cy="380" rx="110" ry="60" fill="#E7E9EE" stroke="#9AA0AC" stroke-width="6"/><path d="M380 330 V430" stroke="#9AA0AC" stroke-width="6"/><text x="380" y="520" text-anchor="middle" font-family="K" font-weight="900" font-size="38" fill="#C9CED8">ซิงค์ทั่วไป</text></g>`;
  const a=cl((lt-0.5)/0.5);s+=`<path d="M530 380 H${530+260*eOC(a)}" stroke="#F3D9A4" stroke-width="18" stroke-linecap="round"/>`+(a>0.8?`<path d="M790 340 L850 380 L790 420Z" fill="#F3D9A4"/>`:'');
  const k=eOB(cl((lt-0.9)/0.4));s+=`<g transform="translate(1050 400) scale(${k})">${jarAt('jar.png',0,200,400)}</g>`;
  s+=pill(1050,650,'ดูดซึมดีกว่า',cl((lt-1.8)/0.3),'#2EC4B6','#0B2240',36)+pill(1050,580,'อยู่ได้นานกว่า',cl((lt-2.3)/0.3),'#F3D9A4','#16171B',36);
  $('v7').innerHTML=s}
 // S9 better price + basket
 if(on(28.5,99)){const lt=t-28.5;let s='';
  s+=pill(1000,230,'คุ้มกว่า!',cl((lt-0.3)/0.3),'#F3D9A4','#16171B',60);
  const n=cl((lt-0.5)/0.3);if(n>0)s+=`<g transform="translate(1000 330) scale(${eOB(n)})">${coin(-50,0,38)}${coin(0,-22,38)}${coin(50,0,38)}</g>`;
  const p=cl((lt-1.5)/0.35);if(p>0){const b=Math.sin(t*6)*8;s+=`<g transform="translate(1000 ${480+b}) scale(${eOB(p)})"><path d="M-110 -50 H110 L85 75 H-85Z" fill="#FFD23F" stroke="#16171B" stroke-width="8" stroke-linejoin="round"/><path d="M-66 -50 Q-66 -125 0 -125 Q66 -125 66 -50" fill="none" stroke="#16171B" stroke-width="10"/><path d="M-50 -15 V50 M0 -15 V50 M50 -15 V50" stroke="#16171B" stroke-width="6"/></g><g transform="translate(1000 ${640+Math.abs(Math.sin(t*5))*16})"><path d="M-30 -30 H30 V0 H52 L0 52 L-52 0 H-30Z" fill="#F3D9A4" stroke="#7A5B2E" stroke-width="5"/></g>`}
  $('v9').innerHTML=s}
};
