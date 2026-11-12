// render frames [f0,f1) of page to mp4: node render_part.js page.html out.mp4 f0 f1
const {chromium}=require('playwright');const {spawn}=require('child_process');
(async()=>{const [,,html,out,a,b]=process.argv;const f0=+a,f1=+b,fps=30;
 const br=await chromium.launch();const p=await br.newPage({viewport:{width:1440,height:1080},deviceScaleFactor:2});
 await p.goto('file://'+html);await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(300);
 const ff=spawn('ffmpeg',['-v','error','-y','-f','image2pipe','-framerate',''+fps,'-c:v','mjpeg','-i','-','-c:v','libx264','-pix_fmt','yuv420p','-crf','18','-preset','veryfast',out],{stdio:['pipe','inherit','inherit']});
 for(let i=f0;i<f1;i++){await p.evaluate(t=>render(t),i/fps);const buf=await p.screenshot({type:'jpeg',quality:93});if(!ff.stdin.write(buf))await new Promise(r=>ff.stdin.once('drain',r));if(i%100==0)console.log('frame',i);}
 ff.stdin.end();await new Promise(r=>ff.on('close',r));await br.close();console.log('done',out)})();
