import json,urllib.request,concurrent.futures as cf,sys
paths=sys.argv[1:]
UA={'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/130 Safari/537.36'}
def get(p):
    u='https://www.thecompoundeffect.com'+p
    try:
        r=urllib.request.urlopen(urllib.request.Request(u,headers=UA),timeout=30); h=r.read().decode('utf8','replace')
        open('pages/'+(p.strip('/').replace('/','__') or 'home')+'.html','w').write(h); return p,r.status,len(h)
    except Exception as e: return p,str(e)[:60],0
with cf.ThreadPoolExecutor(8) as ex:
    for r in ex.map(get,paths): print(*r)
