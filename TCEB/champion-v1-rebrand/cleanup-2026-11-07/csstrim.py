import json,re,sys
dead=set(json.load(open('dead.json')))
keep={'.champ-page .champ-btn.is-done','.champ-page :is(#board, #link) .champ-btn.is-done','.champ-btn.is-done','.champ-page .w-dyn-empty',
 '.champ-page .champ-faq-item[open]','.champ-page .champ-faq-item[open] .champ-faq-q::after','.champ-faq-item[open] .champ-faq-q::after',
 '.champ-page #board .champ-full-line','.champ-full-line','.champ-hub:has(.champ-opt.is-on:last-child) .champ-hub-out'}
N=lambda x: re.sub(r'\s+','',x).replace("'",'"')
DEAD={N(x) for x in dead-keep}
src=open('live-head.html').read()
a=src.index('<style>')+7; b=src.rindex('</style>')
css=src[a:b]
removed=[]
def split_sel(s):
    out=[];depth=0;cur=''
    for ch in s:
        if ch in '([': depth+=1
        if ch in ')]': depth-=1
        if ch==',' and depth==0: out.append(cur);cur=''
        else: cur+=ch
    out.append(cur); return out
def process(block):
    # returns new text for a sequence of rules/at-rules
    out=[];i=0;n=len(block);pending=''
    while i<n:
        if block.startswith('/*',i):
            j=block.index('*/',i)+2; pending+=block[i:j]; i=j; continue
        if block[i].isspace():
            j=i
            while j<n and block[j].isspace(): j+=1
            pending+=block[i:j]; i=j; continue
        # read prelude
        j=i
        while block[j] not in '{;': 
            if block.startswith('/*',j): j=block.index('*/',j)+2
            else: j+=1
        prelude=block[i:j]
        if block[j]==';': out.append(pending+block[i:j+1]); pending=''; i=j+1; continue
        # find matching brace
        d=0;k=j
        while True:
            if block.startswith('/*',k): k=block.index('*/',k)+2; continue
            if block[k]=='{': d+=1
            elif block[k]=='}':
                d-=1
                if d==0: break
            k+=1
        body=block[j+1:k]
        p=prelude.strip()
        if p.startswith('@media') or p.startswith('@supports'):
            inner=process(body)
            if re.sub(r'/\*.*?\*/','',inner,flags=re.S).strip(): out.append(pending+prelude+'{'+inner+'}')
            else: removed.append(p+' (emptied)')
        elif p.startswith('@'):
            out.append(pending+block[i:k+1])
        else:
            sels=split_sel(prelude)
            keepers=[s for s in sels if N(s) not in DEAD]
            gone=[s for s in sels if N(s) in DEAD]
            removed.extend(s.strip() for s in gone)
            if keepers:
                newpre=','.join(keepers)
                if gone: newpre=newpre.lstrip('\n')
                out.append(pending+(newpre if not gone else ' '.join(newpre.split()) if '\n' not in prelude else newpre.strip()+' ')+'{'+body+'}')
            else:
                # drop rule; keep pending comments only if they look like section headers (contain '----' or '===')
                if re.search(r'-{4}|={4}',pending): out.append(pending.rstrip()+'\n')
        pending=''
        i=k+1
    out.append(pending)
    return ''.join(out)
new=process(css)
# unused keyframes
names=re.findall(r'@keyframes\s+([\w-]+)',new)
rest=re.sub(r'@keyframes\s+[\w-]+\s*\{(?:[^{}]*\{[^{}]*\})*[^{}]*\}','',new)
foot=open('footer-clean.html').read()
for nm in names:
    if not re.search(r'\b'+re.escape(nm)+r'\b',rest) and nm not in foot:
        new=re.sub(r'@keyframes\s+'+re.escape(nm)+r'\s*\{(?:[^{}]*\{[^{}]*\})*[^{}]*\}\s*','',new); removed.append('@keyframes '+nm)
new=re.sub(r'\n{3,}','\n\n',new)
open('head-clean.html','w').write(src[:a]+new+src[b:])
open('removed-css.txt','w').write('\n'.join(removed))
print(len(removed),'removed;',len(src),'->',len(src[:a]+new+src[b:]))
