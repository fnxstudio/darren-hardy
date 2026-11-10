#!/usr/bin/env python3
"""Builds the Team Seats mocks for the Founders board (Champion Program tab).
v1/index.html (2.8) and v1/confirmation.html (2.9) are the local pages;
this writes the board copies + SEO frames into board/project/."""
import re, os, html

HERE = os.path.dirname(os.path.abspath(__file__))
V1 = os.path.join(HERE, 'v1')
OUT = os.path.join(HERE, 'board', 'project')
os.makedirs(OUT, exist_ok=True)
CART = 'https://secure.darrenhardy.com/checkout/founders-event-team'

idx = open(os.path.join(V1, 'index.html')).read()

# ---------------------------------------------------------------- 2.8 tweak
# third-person quote: one line for the boxed half on desktop
idx = idx.replace('.quote{max-width:980px;', '.quote{max-width:1120px;')
idx = idx.replace('.quote h2{font-size:104px;', '.quote h2{font-size:96px;')
open(os.path.join(V1, 'index.html'), 'w').write(idx)

# ---------------------------------------------------------------- 2.9 local page
css = re.search(r'<style>(.*?)</style>', idx, re.S).group(1)
fan = open(os.path.join(V1, 'parts-fan.html')).read()  # 2.8 hero now holds the video; the fan lives on in 2.9
fan = fan.replace('<p class="fan-note">One seat for you. One for every leader who runs a part of the&nbsp;business.</p>', '')
stackdefs = re.search(r'(<!-- book title stack.*?</svg>)', idx, re.S).group(1)
nav = re.search(r'(<header class="cbar">.*?</header>)', idx, re.S).group(1)
nav = re.sub(r'\s*<a class="btn btn-midnight cb-btn".*?</a>', '', nav, flags=re.S)
nav = re.sub(r'<p class="cb-msg">.*?</p>', '<p class="cb-msg"><span class="lg"><b>Jordan</b>, your new Impact Points are on their way to your Champion&nbsp;Board.</span><span class="sm"><b>Jordan</b>, your points are on their way to your&nbsp;board.</span></p>', nav, flags=re.S)
foot = re.search(r'(<footer class="foot">.*?</footer>)', idx, re.S).group(1)

CHECK = '<svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true"><circle cx="11" cy="11" r="10" fill="none" stroke="#C3C8CF" stroke-width="1.4"/><path d="M6.5 11.3l3 3 6-6.6" fill="none" stroke="#F2F4F8" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>'

conf_css = '''
/* ---------- 2.9 confirmation ---------- */
.ok-line{display:inline-flex;align-items:center;gap:12px;margin-bottom:30px;font:700 12px/1 var(--sans);letter-spacing:.24em;text-transform:uppercase;color:var(--bright)}
.cf-champ .board{grid-template-columns:auto minmax(0,1fr)}
.cf-champ .board-cta{margin-top:30px}
.steps-head{text-align:center;max-width:820px;margin:0 auto 80px}
.steps-head .lede{margin-top:24px}
.steps{list-style:none;margin:0 auto;padding:0;max-width:1000px;display:grid;gap:24px}
.step{display:grid;grid-template-columns:96px 1fr;gap:6px 32px;align-items:start;padding:40px 44px 42px;background:#fff;border-radius:2px;box-shadow:0 1px 0 rgba(11,21,38,.05),0 20px 44px rgba(11,21,38,.08)}
.step-n{grid-row:1/4;font:400 88px/.8 var(--display);color:var(--midnight-2)}
.step h3{font-size:40px;line-height:.95;color:var(--ink)}
.step p{margin:6px 0 0;color:var(--grey)}
.step p b{color:var(--ink);font-weight:600}
.todo{display:inline-block;margin-top:10px;padding:8px 12px;border:1px dashed #9B1C1C;border-radius:2px;font:600 12px/1.5 var(--sans);color:#9B1C1C;background:#FBF3F3}
.more{text-align:center;margin-top:56px}
.more a{font:600 12px/1 var(--sans);letter-spacing:.14em;text-transform:uppercase;color:var(--midnight-2);text-decoration:underline;text-underline-offset:6px}
.conf-close h2{font-size:104px}
@media (max-width:991px){.cf-champ .board{grid-template-columns:1fr}}
@media (max-width:767px){
  .ok-line{font-size:10.5px;letter-spacing:.18em;margin-bottom:22px}
  .steps-head{margin-bottom:44px;text-align:left}
  .step{grid-template-columns:1fr;padding:30px 24px 32px}
  .step-n{grid-row:auto;font-size:64px;margin-bottom:10px}
  .step h3{font-size:32px}
  .conf-close h2{font-size:56px}
  .cf-champ .board-cta .btn{width:100%;justify-content:center;white-space:nowrap;padding:20px 12px;font-size:11.5px;letter-spacing:.1em}
}
'''

conf_body = f'''
{nav}

<main id="top">

<!-- 1 · HERO -->
<section class="s hero">
  <div class="wrap">
    <div>
      <span class="ok-line">{CHECK}Team Seats&nbsp;confirmed</span>
      <h1 class="h-hero">Your team <span class="sweep">is&nbsp;in.</span></h1>
      <p class="lede">They won&rsquo;t hear about it from you on Monday. <b>They&rsquo;ll hear it from <span class="nb">Darren Hardy</span>, right beside you, April&nbsp;26&ndash;27,&nbsp;2027.</b></p>
      <p class="hero-sub">Two full days, live and virtual, from anywhere. Every Team Seat includes a full year inside <img class="coll" src="assets/the-collective-white.webp" width="600" height="104" alt="THE COLLECTIVE">, so what your team starts together keeps&nbsp;compounding.</p>
    </div>
    {fan}
  </div>
</section>

<!-- 2 · STEEL · Champion Board -->
<section class="steel cf-champ" aria-label="Your Champion Board">
  <div class="steel-in">
    <div class="wrap">
      <div class="board">
        <div class="board-n">+1<small>Impact Point<br>per seat</small></div>
        <div>
          <h2>Your board just <span class="block">moved.</span></h2>
          <p>Every seat you added counts as an Impact Point on your Champion Board. The board updates every&nbsp;hour.</p>
          <div class="board-cta"><a class="btn btn-midnight" href="https://thecompoundeffect.com/champion">See your Champion Board <span class="arr">→</span></a></div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- 3 · LIGHT · 3 quick steps -->
<section class="s is-light">
  <div class="wrap">
    <div class="steps-head">
      <h2 class="h-section">Get your team <span class="block">ready.</span></h2>
      <p class="lede">Three quick steps so everyone walks in on April 26 ready to&nbsp;work.</p>
    </div>
    <ol class="steps">
      <li class="step"><span class="step-n">1</span><h3>Put it on every&nbsp;calendar.</h3><p><b>April 26&ndash;27, 2027.</b> Live with <span class="nb">Darren Hardy</span>. Join from anywhere.</p><p>Block Wednesday, April 28 too. That&rsquo;s the day you and your team turn 2 days into your plan, while it&rsquo;s still&nbsp;fresh.</p></li>
      <li class="step"><span class="step-n">2</span><h3>Tell us who&rsquo;s&nbsp;coming.</h3><p>Each seat gets its own access to the event and to&nbsp;<img class="coll" src="assets/the-collective-midnight.webp" width="600" height="104" alt="THE COLLECTIVE">.</p><span class="todo">[CONFIRM: how attendees are named and how each one receives their access]</span></li>
      <li class="step"><span class="step-n">3</span><h3>Save Darren&rsquo;s email&nbsp;address.</h3><p>Event access links and Founders-only updates come from <b>darren@darrenhardy.com</b>. Have your team add it to their contacts so nothing lands in&nbsp;spam.</p></li>
    </ol>
    <p class="more"><a href="{CART}">Someone missing? Add another Team&nbsp;Seat&nbsp;→</a></p>
  </div>
</section>

<!-- 4 · CLOSE -->
<section class="close conf-close">
  <div class="wrap">
    <h2>See you all <span class="sweep">in&nbsp;April.</span></h2>
    <p class="lede">Millions will read <span class="nb">The Compound Effect In Business</span>. Your team will be able to say they were there when it all&nbsp;began.</p>
  </div>
</section>

</main>

{foot}
'''

conf = f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Your Team Is In | Founders Event Team Seats</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Bodoni+Moda:opsz,wght@6..96,600&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>{css}{conf_css}</style>
</head>
<body>
{conf_body}
{stackdefs}
</body>
</html>
'''
open(os.path.join(V1, 'confirmation.html'), 'w').write(conf)


# ---------------------------------------------------------------- board conversion
def to_dc(src, title, height):
    d = src
    stack = re.search(r'<g id="stack"[^>]*>(.*?)</g>', d, re.S).group(1).strip()
    n = [0]
    def rep(m):
        n[0] += 1
        i = f'{title[:3].replace(".","")}{n[0]}'
        return ('<svg class="tF-stack" viewBox="40 36 720 482" aria-hidden="true"><defs><linearGradient id="g-TS%s" x1="0" y1="0" x2="0" y2="1">'
                '<stop offset="0" stop-color="#ffffff"></stop><stop offset="0.38" stop-color="#b9bcc0"></stop><stop offset="0.52" stop-color="#f2f3f4"></stop>'
                '<stop offset="0.8" stop-color="#83878c"></stop><stop offset="1" stop-color="#d9dbde"></stop></linearGradient></defs>'
                '<g fill="url(#g-TS%s)" style="font-family:\'Bebas Neue\',Impact,sans-serif">%s</g></svg>') % (i, i, stack)
    d = re.sub(r'<svg class="tF-stack"[^>]*><use href="#stack"/></svg>', rep, d)
    c = re.search(r'<style>(.*?)</style>', d, re.S).group(1)
    c = c.replace(':root{', '.ts8{', 1)
    c = c.replace('*{box-sizing:border-box}', '.ts8 *{box-sizing:border-box}')
    c = c.replace('html{scroll-behavior:smooth}\n', '')
    c = c.replace('body{margin:0;background:var(--midnight);color:var(--soft);font:400 17px/1.7 var(--sans);-webkit-font-smoothing:antialiased}',
                  'body{margin:0;background:#0B1526}\n.ts8{background:var(--midnight);color:var(--soft);font:400 17px/1.7 var(--sans);-webkit-font-smoothing:antialiased}')
    c = c.replace('  :root{--gut:32px}', '  .ts8{--gut:32px}').replace('  :root{--gut:24px}', '  .ts8{--gut:24px}')
    c = c.replace('  body{font-size:16px}', '  .ts8{font-size:16px}')
    c = c.replace('.rv{opacity:0;transform:translateY(22px);transition:opacity .9s ease,transform .9s cubic-bezier(.2,.8,.2,1)}\n.rv.in{opacity:1;transform:none}\n', '')
    body = d[d.find('<body>') + 6:d.find('<!-- book title stack')]
    import base64
    body = re.sub(r'src="(assets/[^"]+)"', lambda m: 'src="data:image/webp;base64,%s"' % base64.b64encode(open(os.path.join(V1, m.group(1)), 'rb').read()).decode(), body)
    body = body.replace('<!-- one destination for every button -->\n', '')
    assert '<script' not in body and 'use href' not in body
    return f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>{title}</title>
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&amp;family=Bodoni+Moda:opsz,wght@6..96,600&amp;family=Inter:wght@400;500;600;700;800&amp;display=swap" rel="stylesheet">
<style>{c}</style>
</helmet>
<div class="ts8">
{body.strip()}
</div>
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{{"$preview":{{"width":1440,"height":{height}}}}}'>
class Component extends DCLogic {{ renderVals() {{ return {{}}; }} }}
</script>
</body>
</html>
'''


def mobile(name, title, h):
    return f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>{title}</title>
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&amp;family=Bodoni+Moda:opsz,wght@6..96,600&amp;family=Inter:wght@400;500;600;700;800&amp;display=swap" rel="stylesheet">
<style>body{{margin:0;background:#0B1526}}</style>
</helmet>
<div style="width: 390px; min-height: {h}px; background: #0B1526; overflow: hidden">
<dc-import name="{name}" hint-size="390px,{h}px"></dc-import>
</div>
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{{"$preview":{{"width":390,"height":{h}}}}}'>
class Component extends DCLogic {{ renderVals() {{ return {{}}; }} }}
</script>
</body>
</html>
'''


# ---------------------------------------------------------------- SEO frames
SEO_HELMET = open(os.path.join(HERE, 'board-read3', 'project', 'SEO-1-4.dc.html')).read()
SEO_HELMET = SEO_HELMET[SEO_HELMET.find('<helmet>'):SEO_HELMET.find('</helmet>') + 9]


def e(s):
    return html.escape(s, quote=False)


def seo(num, name, sub, url, pills, rows, serp_title, serp_desc, og_title, og_desc, og_img, schema, notes, height):
    def count(txt, lim):
        n = len(txt)
        return f'<small class="{"ok" if n <= lim else "no"}">{n} / {lim} characters</small>'
    R = []
    for k, v in rows:
        R.append(f'<div class="row"><b>{k}</b><div>{v}</div></div>')
    pill = ''.join(f'<span class="pill {c}">{t}</span>' for c, t in pills)
    li = ''.join(f'<li>{n}</li>' for n in notes)
    return f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>{num} · {name} · URL + SEO</title>
<script src="./support.js"></script>
</head>
<body>
<x-dc>
{SEO_HELMET}
<div class="seo">
<div class="bar"><span class="n">{num}</span><span class="t">{name} · URL + SEO</span><span class="s">{sub}</span></div>
<div class="in">
<div class="card url"><span class="k" style="margin:0">URL</span><code>{url}</code>{pill}</div>
<div class="card">{''.join(R)}</div>
<div class="stack"><div class="card serp"><span class="k">Search result preview</span><div class="site"><i>DH</i><div>The Compound Effect<span>{url.replace("https://", "")}</span></div></div><h4>{e(serp_title)}</h4><p>{e(serp_desc)}</p></div><div class="card"><span class="k">Share card preview</span><div class="og"><div class="img">{og_img}</div><div class="txt"><span>thecompoundeffect.com</span><b>{e(og_title)}</b><p>{e(og_desc)}</p></div></div></div></div>
<div class="card full"><span class="k">Structured data</span><p style="margin:0">{schema}</p></div>
<div class="card full"><span class="k">Build notes</span><ul class="notes">{li}</ul></div>
</div></div>
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{{"$preview":{{"width":1440,"height":{height}}}}}'>
class Component extends DCLogic {{ renderVals() {{ return {{}}; }} }}
</script>
</body>
</html>
'''


def p(t):
    return f'<p>{e(t)}</p>'


T28 = 'Bring Your Team | Founders Event Team Seats'
D28 = 'Bring your leadership team to the Founders Event with Darren Hardy, April 26–27, 2027. Each Team Seat includes a full year inside THE COLLECTIVE.'
OGT28 = 'Bring your team to the Founders Event'
OGD28 = 'They’ve heard you. They haven’t heard Darren. Team Seats for April 26–27, 2027.'
U28 = 'https://thecompoundeffect.com/champion-team-seats'
STILL = '<b style="font:inherit;color:#9B1C1C;text-transform:none;letter-spacing:0">Still needed.</b>'

seo28 = seo('2.8', 'Team Seats for Champions', 'For the build · slug from Maggie, then update every URL below', U28,
            [('no', 'Noindex')],
            [('Title tag', p(T28) + f'<small class="ok">{len(T28)} / 60 characters</small>'),
             ('Meta description', p(D28) + f'<small class="ok">{len(D28)} / 155 characters</small>'),
             ('H1', '<p>Raise your team to your standard.</p><small>The hero headline is the one H1. Section headlines are H2; role cards, beats and steps are H3.</small>'),
             ('Canonical', f'<code>{U28}</code>'),
             ('Robots', '<code>noindex, nofollow</code><small>Champion-only page, reached from the Champion Board. Confirm before launch if it should be public.</small>'),
             ('Sitemap', '<p>No</p>'),
             ('og:title', p(OGT28)),
             ('og:description', p(OGD28)),
             ('og:image / twitter:image', f'<p>1200 × 630, midnight with the four fanned Founder tickets (You, Your #2, Sales, Operations). {STILL}</p>'),
             ('twitter:card', '<code>summary_large_image</code>'),
             ('og:type', '<code>website</code>')],
            T28, D28, OGT28, OGD28, 'Share image 1200 × 630<br>still needed',
            'None. The page is noindex; the Event schema lives on /event (1.1).',
            ['No site nav (funnel page). The silver Champion bar on top greets them by first name from the Champion Board link (pass <code>?name=</code>; without it the line starts at “Every Team Seat…”). Every button goes to <code>' + CART + '</code> as “Invest in My Team”; the bar button hides on phones.',
             'Point the Champion Board’s “Enroll · Team Seat” card (/champion link hub) at /champion-team-seats.',
             'Build natively on the /event class system (<code>fe-</code>): steel bands, midnight block, silver sweep, Founder ticket. Adobe fonts, never a font link. THE COLLECTIVE is always the logo, never typed: white on dark, midnight on light.',
             'Hero: Darren Hardy video “TCEBFE_Team Seats” (Vimeo 1236615058, 2:34) with the design system play control (silver disc + “A word from Darren Hardy” + title, as on /event Nº 05); click opens the Video Popup player, never autoplay; the four Founder tickets tucked behind it. No price in the hero: SAVE $6,000 PER SEAT leads, pricing lives in Invest in Team Seats.',
             'Price copy: $308/mo leads; “$3,995 in a single installment”; plan names Monthly Installments and Single Installment; “$308 today plus 12 monthly installments of $308”.',
             'Board band: “Every seat gets you closer to earning a seat in Studio with Darren.” No “save” wording.',
             'Slim footer. Draft + noindex on staging until approved.'],
            1730)

T29 = 'Your Team Is In | Founders Event Team Seats'
D29 = 'Your Team Seats for the Founders Event with Darren Hardy are confirmed. April 26–27, 2027.'
U29 = 'https://thecompoundeffect.com/champion-team-seats-confirmation'
seo29 = seo('2.9', 'Team Seat Confirmation', 'For the build · slug ends in “confirmation”, never “thank-you”', U29,
            [('no', 'Noindex')],
            [('Title tag', p(T29) + f'<small class="ok">{len(T29)} / 60 characters</small>'),
             ('Meta description', p(D29) + f'<small class="ok">{len(D29)} / 155 characters</small>'),
             ('H1', '<p>Your team is in.</p>'),
             ('Canonical', f'<code>{U29}</code>'),
             ('Robots', '<code>noindex, nofollow</code><small>Confirmation pages are always noindex.</small>'),
             ('Sitemap', '<p>No</p>'),
             ('og:title', p('Your team is in')),
             ('og:description', p('Team Seats confirmed for the Founders Event, April 26–27, 2027.')),
             ('og:image / twitter:image', '<p>Reuse the 2.8 share image.</p>'),
             ('twitter:card', '<code>summary_large_image</code>'),
             ('og:type', '<code>website</code>')],
            T29, D29, 'Your team is in', 'Team Seats confirmed for the Founders Event, April 26–27, 2027.', 'Reuses the 2.8<br>share image',
            'None.',
            ['Set as the thank-you page on the <code>founders-event-team</code> Spiffy cart (Sara): https://thecompoundeffect.com/champion-team-seats-confirmation',
             'Step 2 is a visible placeholder: how attendees get named and how each receives event and COLLECTIVE access is not confirmed yet. Do not ship it as is.',
             '“See your Champion Board” → https://thecompoundeffect.com/champion. The sync runs hourly, so the page says the board updates every hour.',
             '“Add another Team Seat” → the same cart.',
             'Silver Champion bar with the first name, no button. Slim footer. Draft + noindex on staging until approved.'],
            1436)

open(os.path.join(OUT, 'SEO-2-8.dc.html'), 'w').write(seo28)
open(os.path.join(OUT, 'SEO-2-9.dc.html'), 'w').write(seo29)

import sys
H = dict(a.split('=') for a in sys.argv[1:])  # heights: d28= m28= d29= m29=
open(os.path.join(OUT, 'Champion-Team-Seats.dc.html'), 'w').write(to_dc(idx, '2.8 · Bring your team · Team Seats', H.get('d28', 7000)))
open(os.path.join(OUT, 'Champion-Team-Seats-Mobile.dc.html'), 'w').write(mobile('Champion-Team-Seats', '2.8 Mobile', H.get('m28', 6800)))
open(os.path.join(OUT, 'Champion-Team-Confirmation.dc.html'), 'w').write(to_dc(conf, '2.9 · Your team is in · Team Seat Confirmation', H.get('d29', 3000)))
open(os.path.join(OUT, 'Champion-Team-Confirmation-Mobile.dc.html'), 'w').write(mobile('Champion-Team-Confirmation', '2.9 Mobile', H.get('m29', 3000)))
print('built', H)
