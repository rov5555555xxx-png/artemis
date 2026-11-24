h=open('head.html').read(); e=open('eng.html').read()
e=e.replace('const ringDefs=[[0.1,720,800],[23.3,720,780]];','const ringDefs=[[9.6,720,400],[35.55,720,350]];')
open('index.html','w').write(h+open('scenes.html').read()+e+'</script><script>\n'+''.join(open(f).read()+'\n' for f in ['lib1711.js','lib1911.js','lib2211.js','lib2311.js','extra.js'])+'</script>\n</body></html>')
