h=open('head.html').read(); e=open('eng.html').read()
e=e.replace('const ringDefs=[[0.1,720,800],[23.3,720,780]];','const ringDefs=[[12.05,440,330],[26.45,1000,380]];')
open('index.html','w').write(h+open('scenes.html').read()+e+'</script><script>\n'+open('lib1711.js').read()+'\n'+open('lib1911.js').read()+'\n'+open('extra.js').read()+'\n</script>\n</body></html>')
