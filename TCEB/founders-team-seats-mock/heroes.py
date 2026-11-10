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
SAVE = '<span class="save-line"><b>Save <span class="nb">$6,000</span></b><span>per seat</span></span>'
LEDE = '<p class="lede">Two days live with <span class="nb">Darren Hardy</span>, side by side with&nbsp;you.</p>'
SUB = '<p class="hero-sub">The leaders who run your business hear the standard from the same voice at the same time, and come back ready to run with&nbsp;it.</p>'

COMMON = '''
.save-line{display:inline-flex;align-items:baseline;gap:10px;align-self:center;white-space:nowrap}
.save-line b{font:400 34px/1 var(--display);letter-spacing:.01em;background:var(--steel);-webkit-background-clip:text;background-clip:text;color:transparent}
.save-line>span{font:700 11px/1 var(--sans);letter-spacing:.22em;text-transform:uppercase;color:var(--soft)}
.hero .hero-sub{max-width:520px;margin:0 0 40px;font-size:17px;line-height:1.65;color:var(--soft)}
.hero .lede{margin-bottom:12px}
'''

DECKA = FAN.replace('class="fan fan-stack"', 'class="fan fan-stack hA-deck"', 1)
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
    <div class="hero-media hA-media">
      {VIDEO}
      {DECKA}
    </div>
  </div>
</section>
''',
 'css': '''
.hA .h-hero{font-size:94px}
.hA .hero-acts{gap:26px}
.hA .hero-media.hA-media{padding-top:0;margin-bottom:150px}
.hA .hero-media .fan-stack.hA-deck{z-index:3;top:auto;bottom:-232px;left:auto;right:-78px;width:230px;height:300px}
.hA-deck .tpf{left:auto;right:0;margin:0;transform-origin:100% 0}
.hA-deck .tpf4{--t:translateX(-96px) translateY(28px) rotate(-16deg) scale(.56)}
.hA-deck .tpf3{--t:translateX(-64px) translateY(12px) rotate(-8deg) scale(.56)}
.hA-deck .tpf2{--t:translateX(-32px) translateY(3px) rotate(0deg) scale(.56)}
.hA-deck .tpf1{--t:translateX(0) translateY(0) rotate(8deg) scale(.56)}
@media (max-width:1199px){.hA .h-hero{font-size:clamp(70px,7.6vw,94px)}}
@media (max-width:767px){.hA .h-hero{font-size:56px}.hA .hero-acts{align-items:center}.hA .hero-media.hA-media{margin-bottom:205px}
.hA .hero-media .fan-stack.hA-deck{bottom:-196px;right:-4px;width:150px;height:210px}
.hA-deck .tpf4{--t:translateX(-66px) translateY(20px) rotate(-16deg) scale(.38)}
.hA-deck .tpf3{--t:translateX(-44px) translateY(8px) rotate(-8deg) scale(.38)}
.hA-deck .tpf2{--t:translateX(-22px) translateY(2px) rotate(0deg) scale(.38)}
.hA-deck .tpf1{--t:translateX(0) translateY(0) rotate(8deg) scale(.38)}}
'''}

FANB = FAN.replace('class="fan fan-stack"', 'class="fan hB-fan"', 1)
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
    <div class="hero-media hB-media">
      {FANB}
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
.hB .hero-acts{justify-content:center;gap:26px}
.hB .hero-media.hB-media{display:grid;grid-template-columns:400px minmax(0,1fr);gap:48px;align-items:center;max-width:1180px;margin:96px auto 0;padding-top:0}
.hB .hB-fan{position:relative;height:330px;margin:0;align-self:center}
.hB-fan .tpf{left:-40px;top:0;bottom:auto;transform-origin:50% 0}
.hB-fan .tpf4{--t:translateX(0) rotate(-12deg) scale(.6)}
.hB-fan .tpf3{--t:translateX(70px) rotate(-4deg) scale(.6)}
.hB-fan .tpf2{--t:translateX(140px) rotate(4deg) scale(.6)}
.hB-fan .tpf1{--t:translateX(210px) rotate(12deg) scale(.6)}
.hB .vplay{left:30px;bottom:28px}
@media (max-width:1199px){.hB .h-hero{font-size:clamp(64px,8.4vw,104px)}}
@media (max-width:991px){.hB .hero-media.hB-media{grid-template-columns:1fr}}
@media (max-width:767px){.hB{padding:56px 0 96px}.hB .h-hero{font-size:54px}.hB .hero-media.hB-media{gap:20px;margin-top:56px}
.hB .hB-fan{height:230px;width:300px;margin:0 auto}
.hB-fan .tpf{left:-60px;top:0}
.hB-fan .tpf4{--t:translateX(0) rotate(-12deg) scale(.42)}
.hB-fan .tpf3{--t:translateX(50px) rotate(-4deg) scale(.42)}
.hB-fan .tpf2{--t:translateX(100px) rotate(4deg) scale(.42)}
.hB-fan .tpf1{--t:translateX(150px) rotate(12deg) scale(.42)}
.hB .vplay{left:16px;bottom:16px}}
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
