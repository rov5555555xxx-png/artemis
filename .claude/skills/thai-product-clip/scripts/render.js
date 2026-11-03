// Frame-accurate renderer: page must expose window.render(t).
// stills: VW=1080 VH=1080 NODE_PATH=$(npm root -g) node render.js "/abs/page.html#safe" stills <outdir> t1 t2 ...
// video:  VW=1080 VH=1080 DPR=2 NODE_PATH=$(npm root -g) node render.js /abs/page.html video out.mp4 <duration_s>
const {chromium}=require('playwright');const {spawn}=require('child_process');
(async()=>{
 const [,,html,mode,out,...rest]=process.argv;
 const VW=+(process.env.VW||1440),VH=+(process.env.VH||1080),DPR=+(process.env.DPR||1);const b=await chromium.launch();const p=await b.newPage({viewport:{width:VW,height:VH},deviceScaleFactor:DPR});
 await p.goto('file://'+html);await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(300);
 if(mode==='stills'){let i=0;for(const t of rest){await p.evaluate(t=>render(t),+t);await p.screenshot({path:`${out}/s${String(i++).padStart(2,'0')}.jpg`,type:'jpeg',quality:85});}}
 else{const dur=+rest[0],fps=30,n=Math.ceil(dur*fps);
  const ff=spawn('ffmpeg',['-v','error','-y','-f','image2pipe','-framerate',''+fps,'-c:v','mjpeg','-i','-','-c:v','libx264','-pix_fmt','yuv420p','-crf','18','-preset','medium',out],{stdio:['pipe','inherit','inherit']});
  for(let i=0;i<n;i++){await p.evaluate(t=>render(t),i/fps);const buf=await p.screenshot({type:'jpeg',quality:95});if(!ff.stdin.write(buf))await new Promise(r=>ff.stdin.once('drain',r));if(i%150==0)console.log('frame',i,'/',n);}
  ff.stdin.end();await new Promise(r=>ff.on('close',r));}
 await b.close();
})();
