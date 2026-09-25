#!/usr/bin/env python3
"""Rebuild TCE-Brand-Package from the live page.

The package must open with no network, so every external reference in the
live page becomes a data URI here: the stylesheet, its seven font faces,
and any <img> the document uses. Run this after changing tce-design.html
rather than hand-editing the package copy.
"""
import re, base64, os, subprocess, mimetypes
D = os.path.dirname(os.path.abspath(__file__))
P = os.path.join(D, 'TCE-Brand-Package')

def datauri(relpath, default='application/octet-stream'):
    fp = os.path.normpath(os.path.join(D, relpath.split('?')[0]))
    if not os.path.exists(fp):
        print('  MISSING:', relpath); return None
    mime = mimetypes.guess_type(fp)[0] or default
    return 'data:%s;base64,%s' % (mime, base64.b64encode(open(fp,'rb').read()).decode())

css = open(os.path.join(D,'tceb.css')).read()
n = 0
def sub_font(m):
    global n
    v = m.group(1).strip('\'"')
    if v.startswith('data:'): return m.group(0)
    u = datauri(v, 'font/woff2')
    if not u: return 'url()'
    n += 1
    return 'url(%s)' % u
css = re.sub(r'url\(([^)]+)\)', sub_font, css)

page = open(os.path.join(D,'tce-design.html')).read()
page = re.sub(r'<link rel="stylesheet" href="tceb\.css[^"]*">',
              '<style>\n/* tceb.css, inlined with fonts embedded so this file opens anywhere */\n'
              + css + '\n</style>', page, count=1)

imgs = 0
import urllib.request
_remote = {}
def fetch(url):
    """Remote images have to come inline too, or the package stops being
    offline the moment it borrows a logo from a CDN."""
    if url in _remote: return _remote[url]
    try:
        with urllib.request.urlopen(url, timeout=20) as r:
            data = r.read(); ct = r.headers.get('Content-Type','image/webp').split(';')[0]
        _remote[url] = 'data:%s;base64,%s' % (ct, base64.b64encode(data).decode())
    except Exception as e:
        print('  remote fetch failed:', url[:60], e); _remote[url] = None
    return _remote[url]

def sub_img(m):
    global imgs
    v = m.group(1)
    if v.startswith('data:'): return m.group(0)
    if v.startswith('http'):
        u = fetch(v)
        if u: imgs += 1; return 'src="%s"' % u
        return m.group(0)
    u = datauri(v)
    if not u: return m.group(0)
    imgs += 1
    return 'src="%s"' % u
page = re.sub(r'src="([^"]+)"', sub_img, page)
# the font download links are written relative to the repo root for the
# live page; inside the package they sit one level nearer
page = page.replace('href="TCE-Brand-Package/fonts/', 'href="fonts/')
page = page.replace('Internal &middot; Not for distribution', 'Portable package copy &middot; Internal')

open(os.path.join(P,'brand-guide.html'),'w').write(page)
subprocess.run(['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome','--headless=new',
    '--disable-gpu','--no-pdf-header-footer','--print-to-pdf='+os.path.join(P,'brand-guide.pdf'),
    '--virtual-time-budget=16000','file://'+os.path.join(P,'brand-guide.html')], stderr=subprocess.DEVNULL)

left = re.findall(r'src="(?!data:)[^"]+"', re.sub(r'/\*.*?\*/','',page,flags=re.S))
pdf = open(os.path.join(P,'brand-guide.pdf'),'rb').read()
print('fonts inlined: %d | images inlined: %d' % (n, imgs))
print('html %d KB | pdf %d KB | %d pages' % (len(page)//1024, len(pdf)//1024,
      len(re.findall(rb'/Type\s*/Page[^s]', pdf))))
print('external IMAGE refs left:', left or 'none  (href links are expected)')
