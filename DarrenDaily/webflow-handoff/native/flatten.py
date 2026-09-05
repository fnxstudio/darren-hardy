import re, pathlib
from bs4 import BeautifulSoup

css = pathlib.Path("webflow-handoff/native/_welcome-mechanical.css").read_text()
html = pathlib.Path("webflow-handoff/native/_welcome-src.html").read_text()
soup = BeautifulSoup(html, "html.parser")

# --- parse CSS into ordered list of (media, selector, body) ---
def parse(css):
    rules=[]; i=0; n=len(css)
    css=re.sub(r'/\*.*?\*/','',css,flags=re.S)
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
            inner=css[start:i-1]
            for _m,sel,body in parse(inner): rules.append((head,sel,body))
        else:
            depth=1; start=i
            while i<n and depth:
                if css[i]=='{':depth+=1
                elif css[i]=='}':depth-=1
                i+=1
            body=css[start:i-1].strip()
            rules.append((None,head,body))
    return rules
rules=parse(css)

DYN=re.compile(r':(hover|focus|active|focus-visible|focus-within)')
def sanitize(sel):
    return 'f-'+re.sub(r'[^a-z0-9]+','-',sel.lower()).strip('-')

flat=[]; skipped=[]; genctr=0
def needs_flatten(sel):
    base=DYN.sub('',sel)
    return (' ' in base.strip()) or ('>' in base) or ('+' in base) or ('~' in base) or ('::' in sel)

for media,selgroup,body in rules:
    outsel=[]
    for sel in [s.strip() for s in selgroup.split(',') if s.strip()]:
        if not needs_flatten(sel):
            outsel.append(sel); continue
        # pseudo-element?
        pm=re.search(r'::(after|before)',sel)
        base=re.sub(r'::(after|before)','',sel)
        # ancestor-state? dynamic/stateful class on non-final compound
        parts=re.split(r'\s+|(?=[>+~])|(?<=[>+~])',base.strip())
        parts=[p for p in parts if p and p not in '>+~']
        has_anc_state = any(DYN.search(p) for p in parts[:-1]) or any(('.in' in p or '.playing' in p or '.tapped' in p or '.visible' in p) for p in parts[:-1])
        if has_anc_state:
            skipped.append((media,sel,body)); continue
        # strip dynamic pseudo for matching
        match_sel=DYN.sub('',base).strip()
        trailing_state=''.join(DYN.findall(sel))  # e.g. hover
        trailing_state = (':'+DYN.search(sel).group(1)) if DYN.search(sel) else ''
        try:
            targets=soup.select(match_sel)
        except Exception as e:
            skipped.append((media,sel,body+f'  /* select fail {e} */')); continue
        if not targets:
            skipped.append((media,sel,body+'  /* no match */')); continue
        gen=sanitize(base)
        if pm:
            gen=gen+('-af' if pm.group(1)=='after' else '-bf')  # distinct from real descendant classes
            # insert child div for pseudo
            for t in targets:
                d=soup.new_tag('div'); d['class']=[gen]
                if pm.group(1)=='after': t.append(d)
                else: t.insert(0,d)
            body=re.sub(r'content\s*:[^;]*;','',body)
            outsel.append('.'+gen)
        else:
            for t in targets:
                cl=t.get('class',[])
                if gen not in cl: t['class']=cl+[gen]
            outsel.append('.'+gen+trailing_state)
    if outsel:
        flat.append((media,', '.join(outsel),body))

# --- Webflow StyleParser accepts ONLY class selectors. Convert the 13 tag/universal selectors. ---
# * / html / a / img resets -> dropped (Webflow normalize covers them). body typography -> .dd-page wrapper class.
# section -> .sec, h1/h2/h3 -> .hd, footer -> .site-footer (classes added to those elements below).
# tag-qualified classes lose the tag: nav.top -> .top, em.key -> .key.
DROP_SEL={'*','html','a','img'}
def rw_sel(sel):
    parts=[p.strip() for p in sel.split(',') if p.strip()]
    keep=[]
    for p in parts:
        if p in DROP_SEL: continue
        if p=='body' or p=='html': p='.dd-page'
        elif p=='section': p='.sec'
        elif p in ('h1','h2','h3'): p='.hd'
        elif p=='footer': p='.site-footer'
        else:
            p=re.sub(r'^nav\.top','.top',p); p=re.sub(r'^em\.key','.key',p)
        if p not in keep: keep.append(p)
    return ', '.join(keep) if keep else None
def emit(s,b,indent=''):
    s2=rw_sel(s)
    if s2: out.append(f'{indent}{s2} {{ {b} }}')
# --- write flattened CSS (group medias) ---
out=[]; cur=None
bases=[r for r in flat if r[0] is None]
for _,s,b in bases: emit(s,b)
medias={}
for m,s,b in flat:
    if m: medias.setdefault(m,[]).append((s,b))
for m,items in medias.items():
    out.append(f'{m} {{')
    for s,b in items: emit(s,b,'  ')
    out.append('}')
# --- neutralize entrance-hidden states (native = content visible by default; motion becomes optional Interactions) ---
# scroll/load-entrance classes that must render VISIBLE without JS. Genuine JS-hidden UI (toast, exit popup) is left alone.
ENTRANCE={'.reveal','.f-stagger','.f-hero-confirm-h1','.f-hero-confirm-lead','.video-frame','.hero-cue','.nav-cta'}
def neutralize(line):
    for sel in ENTRANCE:
        if line.startswith(sel+' {') or line.startswith(sel+'{'):
            line=re.sub(r'opacity:\s*0;\s*','',line)
            line=re.sub(r'transform:\s*translateY\([^)]*\);\s*','',line)
            line=re.sub(r'pointer-events:\s*none;\s*','',line)
    return line
out=[neutralize(l) for l in out]
# Webflow WHTML parser rejects !important — strip it (flattened classes out-specify tag rules anyway)
out=[re.sub(r'\s*!important','',l) for l in out]
# Webflow only supports :hover/:focus/:active — map :focus-visible -> :focus
out=[l.replace(':focus-visible',':focus') for l in out]
# Webflow requires the exact media form: `@media screen and (max-width: Npx)`
out=[re.sub(r'@media\s*\((max-width|min-width)', r'@media screen and (\1', l) for l in out]
text='\n'.join(out)
# Webflow only allows these six media conditions — drop any other @media block whole
ALLOWED_MEDIA={'screen and (max-width: 991px)','screen and (max-width: 767px)','screen and (max-width: 479px)',
'screen and (min-width: 1280px)','screen and (min-width: 1440px)','screen and (min-width: 1920px)'}
def drop_bad_media(t):
    res=[]; i=0
    while i<len(t):
        m=re.compile(r'@media([^{]*)\{').search(t,i)
        if not m: res.append(t[i:]); break
        res.append(t[i:m.start()]); cond=m.group(1).strip(); depth=1; k=m.end()
        while depth:
            if t[k]=='{':depth+=1
            elif t[k]=='}':depth-=1
            k+=1
        if cond in ALLOWED_MEDIA: res.append(t[m.start():k])
        i=k
    return ''.join(res)
pathlib.Path("webflow-handoff/native/welcome-native.css").write_text(drop_bad_media(text)+'\n')
# add the classes that replace tag selectors
for s in soup.find_all('section'): s['class']=s.get('class',[])+['sec']
for h in soup.find_all(['h1','h2','h3']): h['class']=h.get('class',[])+['hd']
for f in soup.find_all('footer'): f['class']=f.get('class',[])+['site-footer']
# write flattened HTML body
pathlib.Path("webflow-handoff/native/welcome-native.html").write_text(str(soup))
# skipped log
log=['# Rules that could NOT be single-classed (rebuild as Webflow Interactions or manual):','']
for m,s,b in skipped: log.append(f'- `{s}` {("["+m+"]") if m else ""}')
pathlib.Path("webflow-handoff/native/_interactions-todo.md").write_text('\n'.join(log)+'\n')

print("flattened rules:", len(flat), "| skipped (interactions/manual):", len(skipped))
print("css lines:", len(out), "| generated classes:", sum(1 for _,s,_ in flat if 'f-' in s))
print("\n--- skipped (first 20) ---")
for m,s,b in skipped[:20]: print("  ", s)
