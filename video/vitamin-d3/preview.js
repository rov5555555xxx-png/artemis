const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()=='error')errs.push(m.text())});
await p.goto('file://'+__dirname+'/index.html');await p.evaluate(()=>document.fonts.ready);
const out=process.argv[2];const ts=process.argv.slice(3).map(Number);
for(const [i,t] of ts.entries()){await p.evaluate(t=>seek(t),t);await p.screenshot({path:`${out}/f${String(i).padStart(2,'0')}.jpg`,type:'jpeg',quality:70});}
console.log(errs.join('\n')||'no errors');await b.close();})();
