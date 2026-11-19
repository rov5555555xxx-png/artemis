h=open('head.html').read(); e=open('eng.html').read()
e=e.replace('const ringDefs=[[0.1,720,800],[23.3,720,780]];','const ringDefs=[[17.95,720,350],[22.4,720,380]];')
open('index.html','w').write(h+open('scenes.html').read()+e+'</script><script>\n'+open('lib1711.js').read()+'\n'+open('extra.js').read()+'\n</script>\n</body></html>')
