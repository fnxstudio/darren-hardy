#!/usr/bin/env python3
"""Hero options for 2.8 (user, 11/09: name in the headline, a second line of copy, much smaller SAVE $6,000).
Writes v1/hero-a.html, hero-b.html, hero-c.html (the 2.8 page cut to bar + hero) and the board frames
board/project/Champion-Hero-{A,B,C}.dc.html (+ -Mobile).
Run: python3 heroes.py dA= mA= dB= mB= dC= mC=   (frame heights; measure with h.js on the v1 files)"""
import re, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
V1 = os.path.join(HERE, 'v1')
OUT = os.path.join(HERE, 'board', 'project')
CART = 'https://secure.darrenhardy.com/checkout/founders-event-team'
H = dict(a.split('=') for a in sys.argv[1:])

src = open(os.path.join(HERE, 'build.py')).read()
ns = {'re': re, 'os': os, 'V1': V1, 'html': __import__('html')}
exec(src[src.index('def to_dc('):src.index('def mobile(')], ns)
exec(src[src.index('def mobile('):src.index('SEO_HELMET')], ns)
to_dc, mobile = ns['to_dc'], ns['mobile']

idx = open(os.path.join(V1, 'index.html')).read()
hs = idx.index('<!-- 1 · HERO -->'); he = idx.index('<!-- 2 · STEEL')
hero = idx[hs:he]
VIDEO = re.search(r'(<figure class="hero-vid">.*?</figure>)', hero, re.S).group(1)
FAN = hero[hero.index('<div class="fan fan-stack"'):hero.index('<figure class="hero-vid">')].strip()
assert FAN.endswith('</div>')
BTN = f'<a class="btn btn-silver" href="{CART}">Invest in My Team <span class="arr">→</span></a>'
SAVE = '<span class="save-tag">Save <span class="nb">$6,000</span> per&nbsp;seat</span>'
LEDE = '<p class="lede">Two days live with <span class="nb">Darren Hardy</span>, side by side with&nbsp;you.</p>'
SUB = '<p class="hero-sub">The leaders who run your business hear the standard from the same voice at the same time, and come back ready to run with&nbsp;it.</p>'

COMMON = '''
.save-tag{display:inline-block;align-self:center;padding:9px 14px;border-radius:2px;background:var(--steel);color:var(--ink);font:800 11px/1 var(--sans);letter-spacing:.18em;text-transform:uppercase;white-space:nowrap;box-shadow:0 1px 0 rgba(255,255,255,.8) inset}
.hero .hero-sub{max-width:520px;margin:0 0 40px;font-size:17px;line-height:1.65;color:var(--soft)}
.hero .lede{margin-bottom:12px}
'''

A = {
 'title': '2.8 Hero A · Split, name-led',
 'html': f'''<!-- 1 · HERO · option A -->
<section class="s hero hA">
  <div class="wrap">
    <div>
      <h1 class="h-hero">Jordan, raise<br>your team to<br><span class="sweep">your standard.</span></h1>
      {LEDE}
      {SUB}
      <div class="hero-acts">{BTN}{SAVE}</div>
    </div>
    <div class="hero-media">
      {FAN}
      {VIDEO}
    </div>
  </div>
</section>
''',
 'css': '''
.hA .h-hero{font-size:94px}
.hA .hero-acts{gap:22px}
@media (max-width:1199px){.hA .h-hero{font-size:clamp(70px,7.6vw,94px)}}
@media (max-width:767px){.hA .h-hero{font-size:56px}.hA .hero-acts{align-items:center}.hA .save-tag{align-self:center}}
'''}

B = {
 'title': '2.8 Hero B · Centered stage',
 'html': f'''<!-- 1 · HERO · option B -->
<section class="s hero hB">
  <div class="wrap">
    <div class="hB-copy">
      <h1 class="h-hero">Jordan, raise your&nbsp;team<br><span class="sweep">to your standard.</span></h1>
      {LEDE}
      {SUB}
      <div class="hero-acts">{BTN}{SAVE}</div>
    </div>
    <div class="hero-media">
      {FAN}
      {VIDEO}
    </div>
  </div>
</section>
''',
 'css': '''
.hB{padding:120px 0 150px;text-align:center}
.hB .wrap{display:block}
.hB .h-hero{font-size:104px;margin-bottom:30px}
.hB .lede,.hB .hero-sub{margin-left:auto;margin-right:auto;max-width:640px}
.hB .hero-acts{justify-content:center;gap:22px}
.hB .hero-media{max-width:860px;margin:96px auto 0;padding-top:128px}
.hB .fan-stack .tpf4{--t:translateX(-300px) translateY(40px) rotate(-12deg) scale(.78)}
.hB .fan-stack .tpf3{--t:translateX(-100px) translateY(8px) rotate(-4deg) scale(.78)}
.hB .fan-stack .tpf2{--t:translateX(100px) translateY(8px) rotate(4deg) scale(.78)}
.hB .fan-stack .tpf1{--t:translateX(300px) translateY(40px) rotate(12deg) scale(.78)}
.hB .vplay{left:34px;bottom:30px}
.hB .vdisc{width:88px;height:88px}
.hB .vtxt b{font-size:48px}
@media (max-width:1199px){.hB .h-hero{font-size:clamp(64px,8.4vw,104px)}}
@media (max-width:767px){.hB{padding:56px 0 96px}.hB .h-hero{font-size:54px}.hB .hero-media{order:0;margin-top:56px;padding-top:72px}
.hB .fan-stack .tpf4{--t:translateX(-114px) translateY(24px) rotate(-13deg) scale(.42)}
.hB .fan-stack .tpf3{--t:translateX(-38px) translateY(6px) rotate(-4.5deg) scale(.42)}
.hB .fan-stack .tpf2{--t:translateX(38px) translateY(6px) rotate(4.5deg) scale(.42)}
.hB .fan-stack .tpf1{--t:translateX(114px) translateY(24px) rotate(13deg) scale(.42)}
.hB .vplay{left:16px;bottom:16px}.hB .vdisc{width:56px;height:56px}.hB .vtxt b{font-size:28px}}
'''}

# C: a tight deck of tickets on the video's top-right corner; the front stub carries the saving
DECK = FAN.replace('class="fan fan-stack"', 'class="fan fan-stack hC-deck"', 1)
DECK = re.sub(r'(<div class="tpf tpf1">.*?<span class="ft">)[^<]*(</span><i class="bar"></i><span class="no">)[^<]*(</span>)',
              r'\1Save $6,000\2Per seat\3', DECK, flags=re.S)
assert 'Save $6,000' in DECK
C = {
 'title': '2.8 Hero C · Personal greeting',
 'html': f'''<!-- 1 · HERO · option C -->
<section class="s hero hC">
  <div class="wrap">
    <div>
      <h1 class="h-hero"><span class="hC-name">Jordan,</span> raise your team to <span class="sweep">your&nbsp;standard.</span></h1>
      {LEDE}
      {SUB}
      <div class="hero-acts">{BTN}<a class="link-quiet" href="#who">Who should be there?</a></div>
    </div>
    <div class="hero-media hC-media">
      {VIDEO}
      {DECK}
    </div>
  </div>
</section>
''',
 'css': '''
.hC .h-hero{font-size:100px}
.hC-name{display:block;margin-bottom:10px;font:italic 600 64px/1 var(--serif);letter-spacing:.01em;text-transform:none;background:var(--steel);-webkit-background-clip:text;background-clip:text;color:transparent}
.hC .hero-media.hC-media{padding-top:0;margin-top:40px}
.hC .hero-media .fan-stack.hC-deck{z-index:3;top:-150px;left:auto;right:-58px;width:200px;height:320px}
.hC-deck .tpf{left:auto;right:0;margin:0;transform-origin:50% 0}
.hC-deck .tpf4{--t:translateX(-30px) translateY(10px) rotate(-6deg) scale(.56)}
.hC-deck .tpf3{--t:translateX(-20px) translateY(6px) rotate(-1deg) scale(.56)}
.hC-deck .tpf2{--t:translateX(-10px) translateY(3px) rotate(4deg) scale(.56)}
.hC-deck .tpf1{--t:translateX(0) translateY(0) rotate(9deg) scale(.56)}
.hC-deck .tpf1 .tF-stub .ft{font-size:12px;letter-spacing:.12em;color:var(--midnight-2)}
.hC-deck .tpf1 .tF-stub .no{font-size:14px;letter-spacing:.2em;text-transform:uppercase}
@media (max-width:1199px){.hC .h-hero{font-size:clamp(70px,8vw,100px)}.hC-name{font-size:clamp(44px,5.2vw,64px)}}
@media (max-width:991px){.hC .hero-media.hC-media{order:0}}
@media (max-width:767px){.hC .h-hero{font-size:58px}.hC-name{font-size:40px}.hC .hero-media.hC-media{margin-top:150px}
.hC .hero-media .fan-stack.hC-deck{top:-128px;right:2px;width:110px;height:200px}
.hC-deck .tpf{transform-origin:100% 0}
.hC-deck .tpf4{--t:translateX(-18px) translateY(6px) rotate(-6deg) scale(.32)}
.hC-deck .tpf3{--t:translateX(-12px) translateY(4px) rotate(-1deg) scale(.32)}
.hC-deck .tpf2{--t:translateX(-6px) translateY(2px) rotate(4deg) scale(.32)}
.hC-deck .tpf1{--t:translateX(0) translateY(0) rotate(9deg) scale(.32)}}
'''}

tail_start = idx.index('<!-- 2 · STEEL'); tail_end = idx.index('</main>')
foot = re.search(r'<footer class="foot">.*?</footer>\s*', idx, re.S).group(0)
for key, o in (('a', A), ('b', B), ('c', C)):
    page = idx[:hs] + o['html'] + idx[tail_end:]
    page = page.replace(foot, '')
    page = page.replace('</style>', COMMON + o['css'] + '</style>', 1)
    page = re.sub(r'<title>.*?</title>', '<title>' + o['title'] + '</title>', page, 1)
    open(os.path.join(V1, f'hero-{key}.html'), 'w').write(page)
    K = key.upper()
    if H.get('d' + K):
        open(os.path.join(OUT, f'Champion-Hero-{K}.dc.html'), 'w').write(to_dc(page, o['title'], H['d' + K]))
        open(os.path.join(OUT, f'Champion-Hero-{K}-Mobile.dc.html'), 'w').write(mobile(f'Champion-Hero-{K}', o['title'] + ' · mobile', H['m' + K]))
print('ok', sorted(H))
