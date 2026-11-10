#!/usr/bin/env python3
"""Builds the 2.8S / 2.8SM cart frames (board) and the two intended-result pair images (Sara's NOTES tab)
from the production-order swap test screenshots in spiffy/shots/ (t4-*)."""
from PIL import Image
import io, base64, os
H = os.path.dirname(os.path.abspath(__file__)); S = os.path.join(H, 'shots') + '/'
OUT = os.path.join(H, '..', 'board', 'project'); REV = os.path.join(H, '..', '..', 'spiffy-review-2026-11-09')
def uri(p, w):
    im = Image.open(S + p).convert('RGB'); im = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
    b = io.BytesIO(); im.save(b, 'WEBP', quality=80, method=6); return 'data:image/webp;base64,' + base64.b64encode(b.getvalue()).decode(), im.height
def frame(title, label, big, cols, w, h):
    colhtml = ''.join(f'<figure style="margin:0;display:flex;flex-direction:column;gap:12px"><figcaption style="font-size:11px;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:#C3C8CF">{c}</figcaption><img src="{u}" width="{cw}" height="{ch}" alt="{c}" style="display:block;width:{cw}px;height:{ch}px;box-shadow:0 0 0 1px #24375C"></figure>' for c, u, cw, ch in cols)
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
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&amp;family=Inter:wght@400;600;700&amp;display=swap" rel="stylesheet">
<style>body{{margin:0}}</style>
</helmet>
<div style="width:{w}px;height:{h}px;box-sizing:border-box;background:#0B1526;font-family:Inter,sans-serif;color:#C8CACE;padding:36px 40px">
<div style="display:flex;flex-direction:column;gap:4px;margin-bottom:28px"><span style="font-size:10px;font-weight:700;letter-spacing:.24em;color:#9A9DA3">{label}</span><span style="font-family:'Bebas Neue',sans-serif;font-size:{big}px;line-height:1;color:#F4F5F6">Invest in My Team · Champion Team Seats</span></div>
<div style="display:flex;gap:40px;align-items:flex-start">{colhtml}</div>
</div>
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{{"$preview":{{"width":{w},"height":{h}}}}}'>
class Component extends DCLogic {{ renderVals() {{ return {{}}; }} }}
</script>
</body>
</html>
'''
dm, hdm = uri('t4-desktop-monthly.jpg', 660); ds, hds = uri('t4-desktop-single.jpg', 660)
pm, hpm = uri('t4-phone-monthly.jpg', 390); ps, hps = uri('t4-phone-single.jpg', 390)
cap = 'Tested live · 2 team seats + 1 VIP'
H1 = 36 + 56 + 28 + 26 + max(hdm, hds) + 40; H2 = 36 + 56 + 28 + 26 + max(hpm, hps) + 40
open(os.path.join(OUT, 'Spiffy-ChampionTeam-Checkout.dc.html'), 'w').write(frame('2.8S Spiffy cart', '2.8S · SPIFFY CART · FOUNDERS-EVENT-TEAM · DESKTOP', 48, [('Monthly Installments · ' + cap, dm, 660, hdm), ('Single Installment · ' + cap, ds, 660, hds)], 1440, H1))
open(os.path.join(OUT, 'Spiffy-ChampionTeam-Checkout-Mobile.dc.html'), 'w').write(frame('2.8SM Spiffy cart mobile', '2.8S · SPIFFY CART · PHONE', 30, [('Monthly Installments', pm, 390, hpm), ('Single Installment', ps, 390, hps)], 900, H2))
def pair(a, b, out, w):
    A = Image.open(S + a); B = Image.open(S + b); h = max(A.height, B.height)
    c = Image.new('RGB', (A.width + B.width + 24, h), (255, 255, 255)); c.paste(A, (0, 0)); c.paste(B, (A.width + 24, 0))
    c = c.resize((w, round(h * w / c.width)), Image.LANCZOS); c.save(os.path.join(REV, out), quality=82); return c.size
print('frames', H1, H2, pair('t4-desktop-monthly.jpg', 't4-desktop-single.jpg', 'team-doc-intended-desktop.jpg', 1400), pair('t4-phone-monthly.jpg', 't4-phone-single.jpg', 'team-doc-intended-phone.jpg', 804))
