import re, json, pathlib
from bs4 import BeautifulSoup
html=pathlib.Path("webflow-handoff/native/welcome-native.html").read_text()
css=pathlib.Path("webflow-handoff/native/welcome-native.css").read_text()
soup=BeautifulSoup(html,"html.parser")
body_kids=[c for c in soup.children if getattr(c,'name',None)]
# Build unit list: descend into <main>. Each unit: {label, html, parent:'body'|'main', tag, attrs}
units=[]
main_el=None
for c in body_kids:
    if c.name=='main':
        main_el=c
        # main shell (open/close tag with attrs, no children)
        shell=soup.new_tag('main')
        if c.get('class'): shell['class']=c.get('class')
        if c.get('id'): shell['id']=c.get('id')
        units.append({'label':'main-shell','node':shell,'parent':'body'})
        for gc in c.children:
            if getattr(gc,'name',None):
                units.append({'label':(gc.get('class') or [gc.name])[0],'node':gc,'parent':'main'})
    else:
        units.append({'label':(c.get('class') or [c.name])[0],'node':c,'parent':'body'})

def classes_in(node):
    s=set()
    if hasattr(node,'attrs') and node.get('class'): s|=set(node.get('class'))
    if hasattr(node,'find_all'):
        for d in node.find_all(True):
            if d.get('class'): s|=set(d.get('class'))
    return s
def parse(css):
    rules=[]; i=0; n=len(css); css=re.sub(r'/\*.*?\*/','',css,flags=re.S)
    while i<n:
        m=re.compile(r'\s*([^{}]+?)\s*\{').match(css,i)
        if not m: break
        head=m.group(1).strip(); i=m.end()
        if head.startswith('@media'):
            depth=1; start=i
            while i<n and depth:
                if css[i]=='{':depth+=1
                elif css[i]=='}':depth-=1
                i+=1
            rules.append((head, parse(css[start:i-1])))
        else:
            depth=1; start=i
            while i<n and depth:
                if css[i]=='{':depth+=1
                elif css[i]=='}':depth-=1
                i+=1
            rules.append((None,(head,css[start:i-1].strip())))
    return rules
flat=[]
for m,payload in parse(css):
    if m:
        for _m,(sel,body) in payload: flat.append((m,sel,body))
    else:
        sel,body=payload; flat.append((None,sel,body))
sec_classes=[classes_in(u['node']) for u in units]
def rc(sel): return set(re.findall(r'\.([A-Za-z0-9_-]+)', sel))
owner=[]
for m,sel,body in flat:
    c=rc(sel); idx=0
    for i,sc in enumerate(sec_classes):
        if c & sc: idx=i; break
    owner.append(idx)
out=[]
for i,u in enumerate(units):
    base=[]; medias={}
    for (m,sel,body),o in zip(flat,owner):
        if o!=i: continue
        if m: medias.setdefault(m,[]).append(f"{sel} {{ {body} }}")
        else: base.append(f"{sel} {{ {body} }}")
    parts=base[:]
    for mq,items in medias.items(): parts.append(f"{mq} {{ {' '.join(items)} }}")
    out.append({"label":u['label'],"parent":u['parent'],"html":str(u['node']),"css":"\n".join(parts)})
pathlib.Path("webflow-handoff/native/_chunks.json").write_text(json.dumps(out))
print(f"{len(out)} build units:")
for c in out:
    print(f"  {c['label']:<16} parent={c['parent']:<5} html={len(c['html']):>6} css={len(c['css']):>6} total={len(c['html'])+len(c['css']):>6}")
print("css distributed:", sum(len(c['css']) for c in out), "of", len(css))
