"""List ElevenLabs voices and models available to the API key."""
import json, os, urllib.request

def get(path):
    h={'Accept':'application/json'}
    if os.environ.get('ELEVENLABS_API_KEY'):h['xi-api-key']=os.environ['ELEVENLABS_API_KEY']
    with urllib.request.urlopen(urllib.request.Request('https://api.elevenlabs.io'+path,headers=h),timeout=60) as r:return json.load(r)

for m in get('/v1/models'):
    print('model',m['model_id'],'|',m.get('name'),'| th' if any(l.get('language_id')=='th' for l in m.get('languages',[])) else '')
for v in get('/v1/voices')['voices']:
    l=v.get('labels') or {}
    print('voice',v['voice_id'],'|',v['name'],'|',l.get('gender',''),l.get('age',''),l.get('accent',''))
