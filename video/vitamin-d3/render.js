const {chromium}=require('playwright');const {spawn}=require('child_process');
(async()=>{const dir=__dirname,FPS=30;const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
await p.goto('file://'+dir+'/index.html');await p.evaluate(()=>document.fonts.ready);
const DUR=await p.evaluate(()=>DUR);const N=Math.round(DUR*FPS);
const ff=spawn('ffmpeg',['-v','error','-y','-f','image2pipe','-framerate',String(FPS),'-c:v','mjpeg','-i','-','-i',dir+'/mix.wav',
 '-c:v','libx264','-preset','medium','-crf','20','-pix_fmt','yuv420p','-c:a','aac','-b:a','160k','-shortest','-movflags','+faststart',dir+'/vitamin-d3-lungchalei-voice.mp4'],{stdio:['pipe','inherit','inherit']});
for(let i=0;i<N;i++){await p.evaluate(t=>seek(t),i/FPS);const buf=await p.screenshot({type:'jpeg',quality:92});
 if(!ff.stdin.write(buf))await new Promise(r=>ff.stdin.once('drain',r));if(i%300==0)console.log(i,'/',N);}
ff.stdin.end();await new Promise(r=>ff.on('close',r));await b.close();console.log('done');})();
