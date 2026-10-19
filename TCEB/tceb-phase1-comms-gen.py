import sys
from urllib.parse import quote

# ---------- thumbnails (same 142x180 frame + badge geometry as the TCEB LAUNCH PHASE 1 chart) ----------
HEAD = "<svg xmlns='http://www.w3.org/2000/svg' width='142' height='180' viewBox='0 -20 142 180'>"
CART = ("<circle cx='116' cy='4' r='22' fill='#e01e5a' stroke='#fff' stroke-width='3'/>"
        "<path d='M100.6 -5.8L105.5 -5.8L109.1 8.2L122.4 8.2L126.1 -1.6L107.6 -1.6' fill='none' stroke='#fff' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'/>"
        "<circle cx='111.1' cy='13.5' r='2.4' fill='#fff'/><circle cx='122.3' cy='13.5' r='2.4' fill='#fff'/>")
LIVE = ("<rect x='6' y='-9' width='58' height='26' rx='13' fill='#17a34a' stroke='#fff' stroke-width='3'/>"
        "<circle cx='20' cy='4' r='4.5' fill='#fff'/><text x='29' y='9.5' font-family='Helvetica,Arial,sans-serif' font-size='14' font-weight='700' fill='#fff'>LIVE</text>")

def pill(text, fill, w=None):
    w = w or (24 + 17 * len(text))
    return (f"<rect x='2' y='-19' width='{w}' height='38' rx='19' fill='{fill}' stroke='#fff' stroke-width='3'/>"
            f"<text x='{2 + w/2}' y='8' text-anchor='middle' font-family='Helvetica,Arial,sans-serif' font-size='25' font-weight='800' fill='#fff'>{text}</text>")

PHONE = "<rect x='30' y='4' width='82' height='150' rx='12' fill='#fff' stroke='#222' stroke-width='3'/><rect x='38' y='22' width='66' height='118' rx='3' fill='#f4f4f4'/>"

ART = {
 # envelope with body lines + CTA button
 "email": "<path d='M4 30h134v104H4z' fill='#fff' stroke='#222' stroke-width='3'/><path d='M4 30l67 50 67-50' fill='#ddd' stroke='#222' stroke-width='3' stroke-linejoin='round'/><rect x='92' y='106' width='34' height='14' rx='3' fill='#222'/>",
 # personal DH video: black 16:9 frame + play, "DH" tag
 "video": "<rect x='4' y='34' width='134' height='84' rx='6' fill='#1f1f1f' stroke='#222' stroke-width='3'/><circle cx='71' cy='76' r='18' fill='#fff' opacity='.92'/><path d='M64 66v20l16-10z' fill='#1f1f1f'/><rect x='12' y='42' width='30' height='16' rx='3' fill='#c9a227'/><text x='27' y='54' text-anchor='middle' font-family='Helvetica,Arial,sans-serif' font-size='12' font-weight='700' fill='#fff'>DH</text>",
 # phone + chat bubbles
 "sms": PHONE + "<rect x='44' y='36' width='44' height='20' rx='10' fill='#ccc'/><rect x='54' y='68' width='44' height='20' rx='10' fill='#17a34a'/><rect x='44' y='100' width='38' height='20' rx='10' fill='#ccc'/>",
 # phone + voicemail glyph
 "vm": PHONE + "<circle cx='55' cy='72' r='11' fill='none' stroke='#7b2d8e' stroke-width='5'/><circle cx='87' cy='72' r='11' fill='none' stroke='#7b2d8e' stroke-width='5'/><path d='M55 83h32' stroke='#7b2d8e' stroke-width='5'/><path d='M46 108h50M50 118h42' stroke='#bbb' stroke-width='4' stroke-linecap='round'/>",
 # DarrenDaily: phone with black video + sun-yellow DD tag
 "dd": PHONE + "<rect x='38' y='22' width='66' height='70' fill='#1f1f1f'/><path d='M64 47v20l16-10z' fill='#fff'/><rect x='42' y='100' width='58' height='30' rx='4' fill='#f2b705'/><text x='71' y='122' text-anchor='middle' font-family='Arial' font-size='20' font-weight='700' fill='#1f1f1f'>DD</text>",
 # DDOD: player page, video + playlist rows
 "ddod": "<path d='M4 4h96l16 16v136H4z' fill='#fff' stroke='#222' stroke-width='3'/><path d='M100 4v16h16' fill='#ddd' stroke='#222' stroke-width='3'/><rect x='14' y='26' width='92' height='50' rx='3' fill='#1f1f1f'/><circle cx='60' cy='51' r='12' fill='#fff' opacity='.92'/><path d='M56 44v14l11-7z' fill='#1f1f1f'/><rect x='14' y='86' width='16' height='12' rx='2' fill='#f2b705'/><rect x='14' y='106' width='16' height='12' rx='2' fill='#f2b705'/><rect x='14' y='126' width='16' height='12' rx='2' fill='#f2b705'/><path d='M38 92h64M38 112h58M38 132h62' stroke='#bbb' stroke-width='4' stroke-linecap='round'/><text x='60' y='22' text-anchor='middle' font-family='Helvetica,Arial,sans-serif' font-size='11' font-weight='700' fill='#222'>ON DEMAND</text>",
 # social post: avatar, image, heart
 "social": "<rect x='10' y='4' width='122' height='150' rx='8' fill='#fff' stroke='#222' stroke-width='3'/><circle cx='28' cy='22' r='9' fill='#1f5fa8'/><path d='M44 18h50M44 26h30' stroke='#bbb' stroke-width='4' stroke-linecap='round'/><rect x='18' y='38' width='106' height='78' rx='3' fill='#e3eefb'/><path d='M18 116l34-38 24 26 16-14 32 26z' fill='#1f5fa8' opacity='.55'/><path d='M30 132c-6-6-14 2-6 9l6 6 6-6c8-7 0-15-6-9z' fill='#e01e5a'/><path d='M50 138h40' stroke='#bbb' stroke-width='4' stroke-linecap='round'/>",
 # Hardy Club community post: HC badge + thread
 "hc": "<rect x='4' y='4' width='134' height='150' rx='6' fill='#fff' stroke='#222'/><rect x='4' y='4' width='134' height='30' rx='6' fill='#8b1a1a'/><text x='71' y='25' text-anchor='middle' font-family='Arial' font-size='15' font-weight='700' fill='#fff'>HARDY CLUB</text><rect x='16' y='48' width='110' height='56' rx='3' fill='#f4f4f4'/><path d='M16 122h90M16 136h60' stroke='#bbb' stroke-width='5'/>",
 # on stage: mic on stand + spotlight
 "stage": "<path d='M40 4h62l30 150H10z' fill='#fff4d6' stroke='none'/><rect x='56' y='22' width='30' height='52' rx='15' fill='#222'/><path d='M46 60c0 22 50 22 50 0' fill='none' stroke='#222' stroke-width='5' stroke-linecap='round'/><path d='M71 82v46M50 130h42' stroke='#222' stroke-width='6' stroke-linecap='round'/><rect x='4' y='138' width='134' height='16' fill='#222'/>",
 # pages (exact art from the existing chart)
 "salespage": "<path d='M4 4h96l16 16v136H4z' fill='#fff' stroke='#222' stroke-width='3'/><path d='M100 4v16h16' fill='#ddd' stroke='#222' stroke-width='3'/><rect x='14' y='16' width='70' height='6' rx='2' fill='#222'/><rect x='14' y='28' width='56' height='5' rx='2' fill='#222'/><rect x='28' y='138' width='64' height='12' rx='3' fill='#222'/>" + CART + "<path d='M14 42h92M14 49h88M14 56h90M14 63h70M14 77h92M14 84h86M14 91h90M14 98h92M14 105h64M14 119h90M14 126h84M14 133h58' stroke='#bbb' stroke-width='4' stroke-linecap='round'/>",
 "salespagelive": None,
 "loveform": "<path d='M4 4h96l16 16v136H4z' fill='#fff' stroke='#1f5fa8' stroke-width='3'/><path d='M100 4v16h16' fill='#e3eefb' stroke='#1f5fa8' stroke-width='3'/><rect x='14' y='16' width='70' height='6' rx='2' fill='#1f5fa8'/><rect x='14' y='30' width='60' height='5' rx='2' fill='#1f5fa8'/><rect x='14' y='44' width='40' height='3' rx='1.5' fill='#bbb'/><rect x='14' y='50' width='92' height='10' rx='2' fill='none' stroke='#bbb' stroke-width='1.5'/><rect x='14' y='64' width='40' height='3' rx='1.5' fill='#bbb'/><rect x='14' y='70' width='92' height='10' rx='2' fill='none' stroke='#bbb' stroke-width='1.5'/><rect x='14' y='84' width='40' height='3' rx='1.5' fill='#bbb'/><rect x='14' y='90' width='92' height='10' rx='2' fill='none' stroke='#bbb' stroke-width='1.5'/><rect x='20' y='132' width='80' height='16' rx='3' fill='#1f5fa8'/>" + LIVE,
}
ART["salespagelive"] = ART["salespage"] + LIVE
ART["blank"] = ""   # invisible filler: keeps every day in a row the same height so the email line stays straight
ART["spiffylive"] = ART["loveform"].replace("#1f5fa8", "#222").replace("#e3eefb", "#ddd").replace(LIVE, "") + CART + LIVE
ART["pumpkin"] = ("<path d='M50 22c0-9 5-16 12-19' stroke='#4d6b1f' stroke-width='7' fill='none'/>"
    "<ellipse cx='28' cy='58' rx='25' ry='32' fill='#d9661a'/><ellipse cx='72' cy='58' rx='25' ry='32' fill='#d9661a'/>"
    "<ellipse cx='50' cy='58' rx='24' ry='34' fill='#f28a2e'/>"
    "<path d='M27 50l9-11 9 11zM55 50l9-11 9 11zM44 62l6-7 6 7zM26 70q24 18 48 0l-7 3-5 6-6-5-6 5-6-5-6 5-5-6z' fill='#3b2208'/>")
NAME = {"email":"Email","video":"DH video","sms":"SMS","vm":"DropCowboy","dd":"DarrenDaily","ddod":"DDOD",
        "social":"Social","hc":"Hardy Club post","stage":"On stage"}

import os, re
def mini(v):
    v = v.replace(" width='142' height='180'", "")
    v = v.replace(" stroke-width='3'", "").replace("<svg xmlns='http://www.w3.org/2000/svg'", "<svg xmlns='http://www.w3.org/2000/svg' stroke-width='3'")
    v = v.replace("font-family='Helvetica,Arial,sans-serif'", "font-family='Arial'")
    v = v.replace(" stroke-linecap='round'", "").replace(" stroke-linejoin='round'", "")
    v = re.sub(r"(\d)\.0\b", r"\1", v)
    v = v.replace("fill='#ffffff'", "fill='#fff'")
    return v
OUTDIR = sys.argv[2]
INLINE = len(sys.argv) > 3 and sys.argv[3] == "inline"
BASE = "https://fnxstudio.github.io/darren-hardy/TCEB/img/comms/"
def img(kind, badge=None):
    suffix = "" if not badge else ("-open" if badge == OPEN else "-close")
    name = f"{kind}{suffix}.svg"
    art = ART[kind]
    if kind == "email" and badge:
        c, t = ("#c9a227", "#fff4d6") if badge == OPEN else ("#b00020", "#fdecec")
        art = art.replace("#222", c).replace("#ddd", t).replace("fill='#fff'", f"fill='{t}'", 1)
    head = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 92'>" if kind == "pumpkin" else HEAD
    svg = head + art + ("" if INLINE else (badge or "")) + "</svg>"
    open(os.path.join(OUTDIR, name), "w").write(svg.replace("'", '"'))
    if INLINE:
        svg = mini(svg)
        return "data:image/svg+xml," + svg.replace("%", "%25").replace("#", "%23").replace("<", "%3C").replace(">", "%3E")
    return BASE + name

OPEN = pill("OPEN", "#c9a227")
CLOSE = pill("CLOSE", "#b00020")

# ---------- calendar ----------
cols = [("c22","Thu","Oct 22"),("c23","Fri","Oct 23"),("c24","Sat","Oct 24"),
        ("c25","Sun","Oct 25"),("c26","Mon","Oct 26"),("c27","Tue","Oct 27"),("c28","Wed","Oct 28"),
        ("c29","Thu","Oct 29"),("c30","Fri","Oct 30"),("c31","Sat","Oct 31"),("c01","Sun","Nov 1")]
C0 = cols[0][0]
REST = {"c24"}

# ONLY what the TCEB doc states (tab "DB EMAIL COMMS" + sub-tabs, docs.google.com/document/d/15628lGSNXqxl2xQh4pL2uDGvO1i7xhiTiUNM2asodcE).
# Rows = the lists named on the To: lines. Labels = the doc's own email names, send times and subject lines.
# "W ..." = a gap or contradiction in the doc for the team to check. Nothing here is inferred.
# cells: col -> [(kind, badge, label)]; first item is the day's main send. kind "note" / "warn" = text box, not a send.
W_ = "⚠ "
BIG = {"B": "BMC45<br/>BMC44", "E": "ELITE", "A": "BMC<br/>ALUMNI", "L": "DHLLC<br/>ALUMNI",
       "R": "ACTIVE<br/>DARREN<br/>DAILY", "D": "FULL<br/>DATABASE"}
COLOR = {}
PAGE_URL = {"D": "https://www.thecompoundeffect.com/pre-print"}
rows = [
 ("B", "on Exclude lines", "#f5eef8", "#7b2d8e", {
   "c22": [("warn", None, "<b>On the Exclude line of every email</b><br/>"
            + W_ + "SMS Database Day 1 excludes neither BMC45 nor BMC44<br/>"
            + W_ + "SMS Elite / BMC Alumni / DHTV Alumni Day 1 exclude BMC45, not BMC44")]}),
 ("E", "", "#fff8e1", "#c9a227", {
   "c22": [("email", "open", "<b>ELITE #1</b> · 7am TZ<br/>[Time-sensitive] ELITE invitation<br/>To: ELITE, A-Team<br/>" + W_ + "no HubSpot link"),
           ("sms", None, "<b>SMS Elite Day 1</b> · 1pm TZ<br/>To: Elite members")],
   "c23": [("email", None, "<b>ELITE #2</b> · 1pm TZ<br/>Jeff, bumping this up!<br/>" + W_ + "no HubSpot link<br/>" + W_ + "copy: wider group tomorrow morning<br/>(Sat 10/24 has no sends)")],
   }),
 ("A", "", "#e8f1fc", "#1f5fa8", {
   "c23": [("email", "open", "<b>BMC Alumni #1</b> · 7am TZ<br/>[Time-sensitive] Alumni invitation<br/>" + W_ + "no HubSpot link"),
           ("sms", None, "<b>SMS BMC Alumni Day 1</b> · 1pm TZ")],
   "c26": [("email", None, "<b>BMC Alumni #2</b> · 1pm TZ<br/>Jeff, bumping this up!<br/>" + W_ + "no HubSpot link<br/>" + W_ + "doc also lists Fri 10/23 1pm<br/>and a 2nd subject line")],
   }),
 ("L", "", "#eef0fb", "#3f51b5", {
   "c23": [("email", "open", "<b>DHLLC Alumni #1</b> · 7am TZ<br/>[Time-sensitive] personal invitation<br/>" + W_ + "no HubSpot link"),
           ("sms", None, "<b>SMS DHTV Alumni Day 1</b> · 1pm TZ<br/>" + W_ + "To: DHTV Alumni<br/>(emails go to DHLLC Alumni)")],
   "c26": [("email", None, "<b>DHLLC Alumni #2</b> · 7am TZ<br/>Jeff, bumping this up!<br/>" + W_ + "no HubSpot link")],
   }),
 ("R", "", "#fff6d8", "#b8860b", {
   "c25": [("email", "open", "<b>DarrenDaily #1</b> · 7am TZ<br/>Quick heads up! About tomorrow…<br/>" + W_ + "no pre-print purchaser exclusion")],
   "c26": [("dd", None, "<b>Episode announcement</b><br/>promised in DarrenDaily #1<br/>" + W_ + "no script in this tab")],
   "c27": [("email", None, "<b>DarrenDaily #2</b> · 7am TZ<br/>Your name. In my new book.<br/>" + W_ + "no pre-print purchaser exclusion")],
   "c28": [("warn", None, W_ + "<b>Not on any To: line after 10/27</b><br/>Excluded by name from Database #2<br/>Are they part of Full database?")]}),
 ("D", "+ A-Team", "#fdeeee", "#b00020", {
   "c26": [("email", "open", "<b>Database #1</b> · 7am TZ<br/>[Time-sensitive] personal invitation<br/>" + W_ + "no pre-print purchaser exclusion<br/>" + W_ + "excludes HC, HJ, RIV:<br/>never on any To: line"),
           ("sms", None, "<b>SMS Database Day 1</b> · 1pm TZ<br/>" + W_ + "no BMC45 / BMC44 exclusion")],
   "c27": [("email", None, "<b>Database #2</b> · 7am TZ<br/>Jeff, bumping this up!<br/>+ BMC Alumni, DHLLC Alumni")],
   "c28": [("email", None, "<b>Database #3</b> · 7am TZ<br/>Jeff, I've never invited anyone to do this<br/>+ ELITE")],
   "c29": [("email", None, "<b>Database #4</b> · 7am TZ<br/>Can I feature you in my book, Jeff?"),
           ("sms", None, "<b>SMS 2 · Deadline Tomorrow</b><br/>1pm TZ")],
   "c30": [("email", None, "<b>Database #5</b> · 7am TZ<br/>Today's your last day, Jeff"),
           ("sms", None, "<b>SMS 3 · Last Chance</b><br/>1pm TZ"),
           ("email", "close", "<b>Closedown #1</b> · 3pm PT<br/>Still want your name in it, Jeff?"),
           ("email", "close", "<b>Closedown #2</b> (Brenda) · 4pm PT<br/>Jeff, did you get this taken care of?")],
   "c31": [("email", None, "<b>Reopening #1</b> · 7am TZ<br/>Jeff, I pulled some strings for you")],
   "c01": [("email", None, "<b>Reopening #2</b> · 7am TZ<br/>Halloween's over. This isn't, Jeff."),
           ("email", None, "<b>Reopening #3</b> (Brenda) · 7pm PT<br/>Closing at midnight, Jeff")]}),
]

# Elite / BMC Alumni / DHLLC Alumni are named on the To: line of these database sends, so they appear in those tracks too
# (short label: name + time; the subject lines sit on the Full Database track)
TO_LINE = {"E": ["Database #3", "Database #4", "SMS 2", "Database #5", "SMS 3", "Closedown #1", "Closedown #2",
                 "Reopening #1", "Reopening #2", "Reopening #3"]}
TO_LINE["A"] = TO_LINE["L"] = ["Database #2"] + TO_LINE["E"]
def short(lab):
    seg = lab.split("<br/>")
    return seg[0] if "TZ" in seg[0] or "PT" in seg[0] else seg[0] + " · " + seg[1]
D_CELLS = next(r[4] for r in rows if r[0] == "D")
for r in rows:
    if r[0] in TO_LINE:
        for cid, items in D_CELLS.items():
            got = [(k, b, short(lab)) for k, b, lab in items if lab.split("</b>")[0].replace("<b>", "").split(" ·")[0] in TO_LINE[r[0]]]
            if got: r[4][cid] = got

# click-through for each send: the HubSpot email when the doc has one, otherwise its copy in the doc tab
DOC = "https://docs.google.com/document/d/15628lGSNXqxl2xQh4pL2uDGvO1i7xhiTiUNM2asodcE/edit?tab="
HS = "https://app.hubspot.com/email/2518645/edit/{}/content"
TAB = {"E": DOC + "t.hb2basg0f79j", "A": DOC + "t.8smus8m5ntqa", "L": DOC + "t.s79c1yc88ito",
       "R": DOC + "t.24dzkch4015d", "D": DOC + "t.dnqyqufg1y5"}
HSID = {"DarrenDaily #1": "224873946746", "DarrenDaily #2": "224873978382", "Database #1": "224630243100",
        "Database #2": "224630258783", "Database #3": "224630324315", "Database #4": "224630474342",
        "Database #5": "224640335988", "Closedown #1": "224635911725", "Closedown #2": "224636060817",
        "Reopening #1": "224653094263", "Reopening #2": "224640510644", "Reopening #3": "224653107269"}
def link_for(rid, kind, label):
    if kind not in ("email", "sms"): return None
    name = label.split("</b>")[0].replace("<b>", "")
    if name in HSID: return HS.format(HSID[name])
    if name.startswith(("SMS 2", "SMS 3")): return TAB["D"]
    return TAB[rid]

W, H = 96, 122
L = ["---", ("title: TCEB LAUNCH PHASE 1 · Pre-print comms" + (" · KEY · gold envelope = list's first send · red envelope = named Closedown in the doc · ⚠ = gap in the doc to check · times as written (TZ / PT) · click any send to open it" if len(sys.argv) > 3 and sys.argv[3] == "inline" else "")), "config:", "  layout: dagre", "  look: classic", "  theme: default", "  flowchart:", "    wrappingWidth: 420", "  themeVariables:", "    primaryColor: '#ffffff00'", "    primaryBorderColor: '#ffffff00'", "    mainBkg: '#ffffff00'", "    nodeBorder: '#ffffff00'", "---",     "flowchart LR"]
cls = {"hdr":[], "rest":[], "sp":[], "pg":[], "cell":[], "hrest":[], "dst":[], "cc":[], "note":[], "warn":[]}

IMGS = []
def node(nid, kind, label, badge=None, w=None, h=None):
    IMGS.append(nid)
    L.append(f'        {nid}@{{ img: "{img(kind, badge)}", label: "{label}", w: {w or W}, h: {h or H}, constraint: "on" }}')

SECT = []
def mark(): SECT.append(len(L))
mark()
# header row (its own band)
L.append('    subgraph HDR [" "]')
L.append('        direction LR')
L.append('        HL[" "]'); cls["sp"].append("HL")
L.append(f'        H_{C0}["<small>{cols[0][1].upper()}</small><br/><b>{cols[0][2].upper()}</b>"]')
L.append(f"        HL ~~~ H_{C0}")
# a top row of spacers over the dates; Oct 31 holds the pumpkin, Nov 1 the DST note
tprev = "HL"
for cid, _, _ in cols:
    tid = "T" + cid[1:]
    if cid == "c31": node(tid, "pumpkin", " ", w=190, h=175)
    elif cid == "c30":
        L.append(f'        {tid}["<b>5pm PT deadline</b> (Database #5)<br/>Reopening #1: open through Sunday night"]'); cls["dst"].append(tid)
    else:
        L.append(f'        {tid}[" "]'); cls["sp"].append(tid)
    L.append(f"        {tprev} ~~~ {tid}")
    if cid == "c01":
        L.append('        CC["<b>CLOSES 11:59pm PT</b><br/>Sun Nov 1 (Reopening #3)"]'); cls["cc"].append("CC")
        L.append(f"        {tprev} ~~~ CC")
    tprev = tid
prev = f"H_{C0}"; cls["hdr"].append(prev)
for cid, dow, d in cols[1:]:
    nid = "H_"+cid
    if cid in REST:
        L.append(f'        {nid}["<small>{dow.upper()}</small><br/><b>{d.upper()}</b><br/><small>no sends</small>"]'); cls["hrest"].append(nid)
    else:
        L.append(f'        {nid}["<small>{dow.upper()}</small><br/><b>{d.upper()}</b>"]'); cls["hdr"].append(nid)
    L.append(f"        {prev} ~~~ {nid}"); prev = nid
L.append('        HP["<small>LINKS TO</small><br/><b>CTA PAGE</b>"]'); cls["hdr"].append("HP")
L.append(f"        {prev} ~~~~~ HP")
L.append("    end")
L.append("")
links_out = []

GRID = []
for rid, sub, fill, stroke, cells in rows:
    mark()
    COLOR[rid] = stroke
    L.append(f'    subgraph T_{rid} [" "]')
    L.append('        direction LR')
    L.append(f'        {rid}L["<b>{BIG[rid]}</b><br/><small><small>{sub}</small></small>"]')
    links = []
    prev = rid+"L"; xi = 0
    depth = max(len(c) for c in cells.values())
    lanes = [None] * depth
    ids = [c[0] for c in cols]
    first_c = min(cells, key=ids.index); last_c = max(cells, key=ids.index)
    def put(nid, k, b, lab):
        if k == "blank":
            L.append(f'        {nid}[" "]'); return   # empty filler box: far cheaper than an image under the 50K cap
        if k in ("note", "warn"):
            L.append(f'        {nid}["{lab}"]'); cls[k].append(nid)
        else:
            node(nid, k, lab, {"open": OPEN, "close": CLOSE}.get(b))
            if link_for(rid, k, lab): links.append(f'    click {nid} href "{link_for(rid, k, lab)}" _blank')
    for cid,_,_ in cols:
        nid = f"{rid}_{cid}"
        gid = f"{rid}{cid[1:]}"
        GRID.append(gid)
        L.append(f'        subgraph {gid} [" "]')
        cell = cells.get(cid)
        live = ids.index(first_c) < ids.index(cid) <= ids.index(last_c)
        items = []
        if cell:
            (k, b, lab), items = cell[0], cell[1:]
            put(nid, k, b, lab)
        elif live and cid in REST:
            L.append(f'        {nid}["no send"]'); cls["rest"].append(nid)
        else:
            L.append(f'        {nid}[" "]'); cls["sp"].append(nid)
        # timeline line runs between this list's sends; arrowhead only into a real send, never into a note box
        is_send = bool(cell) and cell[0][0] not in ("note", "warn")
        links.append(f"    {prev} {('-->' if is_send else '---' if not cell else '-.-') if live else '~~~'} {nid}")
        # each extra send sits in a lane chained from the same lane the day before, so the rows stay straight
        if cell:
            items = items + [("blank", None, " ")] * (depth - len(cell))
        for j, (k, b, lab) in enumerate(items):
            xi += 1; xid = f"{rid}x{xi}"
            put(xid, k, b, lab)
            links.append(f"    {lanes[j] or prev} ~~~ {xid}")
            lanes[j] = xid
        L.append("        end")
        prev = nid
    if rid in PAGE_URL:
        pid = rid+"P"
        node(pid, "salespagelive", "<b>Pre-print page</b><br/>/pre-print<br/>(SMS link)", w=212, h=269)
        links.append(f'    click {pid} href "{PAGE_URL[rid]}" _blank')
        links.append(f"    {prev} ~~~~~ {pid}")
    else:
        # invisible box in the CTA column: without it the layout pulls the BMC45 row down next to the database track
        L.append(f'        {rid}P[" "]'); cls["sp"].append(rid+"P")
        links.append(f"    {prev} ~~~~~ {rid}P")
    L.append("    end")
    L.extend(links)
    L.append(f"    HL ~~~ {rid}_{C0}")
    L.append(f"    style T_{rid} fill:{fill},stroke:{stroke},stroke-width:2px,color:{stroke}")
    L.append("")

mark()
# legend
if INLINE:
    # text key: picture key would push the code past Mermaid's 50K text cap
    pass
else:
    L.append('    subgraph KEY ["KEY"]')
    L.append('        direction LR')
    keys = ["email","sms","dd","stage","salespage"]
    prev = None
    for k in keys:
        kid = "K_"+k
        lab = NAME.get(k, "Pre-print page")
        node(kid, k, lab)
        if prev: L.append(f"        {prev} ~~~ {kid}")
        prev = kid
    node("K_open", "email", "Opening day", OPEN); L.append(f"        {prev} ~~~ K_open")
    node("K_close", "email", "Closedown", CLOSE); L.append("        K_open ~~~ K_close")
    L.append("    end")
    L.append("")
L.append("    style HDR fill:#f3f1ec,stroke:#d9d4c7,stroke-width:1px")
if not INLINE: L.append("    style KEY fill:#fafafa,stroke:#999,stroke-dasharray:4 3")
# (no per-image class needed: the frontmatter theme vars already make node frames transparent)
# Mermaid stacks LR subgraphs bottom-up, so emit tracks in reverse to read top-down
pre = L[:SECT[0]]; secs = [L[SECT[i]:SECT[i+1]] for i in range(len(SECT)-1)]; tail = L[SECT[-1]:]
L[:] = pre + [x for sec in reversed(secs) for x in sec] + tail
for h in cls["hdr"]:
    L.append(f"    style {h} font-size:36px")   # mermaid.ai ignores font-size in classDef
for h in cls["hrest"]:
    L.append(f"    style {h} font-size:36px")
cls["sp"] = []   # spacers are already invisible via the transparent theme vars
L.append("    style CC fill:#b00020,stroke:#7a0016,stroke-width:3px,color:#fff,font-size:30px")
for r, c in COLOR.items():
    L.append(f"    style {r}L fill:none,stroke:none,color:{c},font-size:44px,font-weight:900")
L.append(f"    class {','.join(GRID)} gridc")
for k,v in cls.items():
    if v: L.append(f"    class {','.join(v)} {k}")
L += [
 "    classDef hdr fill:none,stroke:none,color:#111,font-size:36px,font-weight:800",
 "    classDef hrest fill:none,stroke:none,color:#b5b0a5,font-size:36px",
 "    classDef rest fill:#eee,color:#888,stroke:#ccc,stroke-dasharray:4 3",
 "    classDef sp fill:none,stroke:none,color:transparent",
 "    classDef gridc fill:none,stroke:none",
 "    classDef note fill:#fff,stroke:#888,stroke-width:1px,color:#333,font-size:20px",
 "    classDef warn fill:#fff3cd,stroke:#d97706,stroke-width:2px,color:#7c2d12,font-size:20px",
 "    classDef dst fill:#fff,stroke:#7b2d8e,stroke-dasharray:4 3,color:#333,font-size:22px",
 "    linkStyle default stroke:#888",
]
open(sys.argv[1],"w").write("\n".join(L)+"\n")
