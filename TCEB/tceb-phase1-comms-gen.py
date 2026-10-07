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

PHONE = "<rect x='30' y='4' width='82' height='150' rx='12' fill='#fff' stroke='#222' stroke-width='3'/><rect x='58' y='12' width='26' height='4' rx='2' fill='#222'/><rect x='38' y='22' width='66' height='118' rx='3' fill='#f4f4f4'/>"

ART = {
 # envelope with body lines + CTA button
 "email": "<path d='M4 30h134v104H4z' fill='#fff' stroke='#222' stroke-width='3'/><path d='M4 30l67 50 67-50' fill='#ddd' stroke='#222' stroke-width='3' stroke-linejoin='round'/><rect x='92' y='106' width='34' height='14' rx='3' fill='#222'/>",
 # personal DH video: black 16:9 frame + play, "DH" tag
 "video": "<rect x='4' y='34' width='134' height='84' rx='6' fill='#1f1f1f' stroke='#222' stroke-width='3'/><circle cx='71' cy='76' r='18' fill='#fff' opacity='.92'/><path d='M64 66v20l16-10z' fill='#1f1f1f'/><rect x='12' y='42' width='30' height='16' rx='3' fill='#c9a227'/><text x='27' y='54' text-anchor='middle' font-family='Helvetica,Arial,sans-serif' font-size='12' font-weight='700' fill='#fff'>DH</text>",
 # phone + chat bubbles
 "sms": PHONE + "<rect x='44' y='32' width='44' height='18' rx='9' fill='#ccc'/><rect x='54' y='58' width='44' height='18' rx='9' fill='#17a34a'/><rect x='44' y='84' width='36' height='18' rx='9' fill='#ccc'/><rect x='60' y='110' width='38' height='18' rx='9' fill='#17a34a'/>",
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
cols = [("c21","Wed","Oct 21"),("c22","Thu","Oct 22"),("c23","Fri","Oct 23"),("c24","Sat","Oct 24"),
        ("c25","Sun","Oct 25"),("c26","Mon","Oct 26"),("c27","Tue","Oct 27"),("c28","Wed","Oct 28"),
        ("c29","Thu","Oct 29"),("c30","Fri","Oct 30"),("c31","Sat","Oct 31"),("c01","Sun","Nov 1")]
REST = {"c24"}
DSHORT = {c[0]: c[2].replace("Oct ", "10/").replace("Nov ", "11/") for c in cols}
DFULL = {c[0]: f"{c[1]} {DSHORT[c[0]]}" for c in cols}

# rows: id, prefix, title, open col, open extras, closing extras, callout, track fill, track stroke
BIG = {"B": "BMC45<br/>ATTENDEES", "E": "WAVE&nbsp;1<br/>ELITES", "A": "WAVE&nbsp;2<br/>BMC&nbsp;ALUMNI",
       "M": "WAVE&nbsp;3<br/>MEMBERS", "D": "WAVE&nbsp;4<br/>FULL<br/>DATABASE"}
COLOR = {"B": "#7b2d8e"}
SPIFFY_URL = "https://secure.darrenhardy.com/checkout/bmc45-love-form"
PAGE_URL = {"B": "https://www.hardybmc.com/love",
            "E": None, "A": None, "M": None, "D": None}   # pre-print /preorder: fill in when live
rows = [
 ("E","EL","WAVE 1 · ELITES (not at BMC45)","c22",["sms","vm"],["sms","vm"],"Elite","#fff8e1","#c9a227"),
 ("A","AL","WAVE 2 · BMC ALUMNI (excl. BMC45 attendees)","c23",["sms"],["sms"],"Alumni","#e8f1fc","#1f5fa8"),
 ("M","MB","WAVE 3 · MEMBERS: RIV · HJ · IPL · JST · eFP + HARDY CLUB","c26",["sms","hc"],["sms","hc"],"Member","#e6f4f1","#00796b"),
 ("D","DB","WAVE 4 · FULL DATABASE + DARRENDAILY SUBSCRIBERS","c27",["social","dd","ddod"],["sms","ddod","social"],"Public","#fdeeee","#b00020"),
]

W, H = 62, 79
L = ["---", ("title: TCEB LAUNCH PHASE 1 · Pre-print comms" + (" · KEY · gold envelope = opening day · red envelope = closedown" if len(sys.argv) > 3 and sys.argv[3] == "inline" else "")), "config:", "  layout: dagre", "  look: classic", "  theme: default", "  flowchart:", "    wrappingWidth: 420", "  themeVariables:", "    primaryColor: '#ffffff00'", "    primaryBorderColor: '#ffffff00'", "    mainBkg: '#ffffff00'", "    nodeBorder: '#ffffff00'", "---",     "flowchart LR"]
cls = {"hdr":[], "rest":[], "sp":[], "pg":[], "cell":[], "hrest":[], "dst":[], "cc":[]}

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
L.append('        H_c21["<small>WED</small><br/><b>OCT 21</b>"]')
L.append("        HL ~~~ H_c21")
# a top row of spacers over the dates; Oct 31 holds the pumpkin, Nov 1 the DST note
tprev = "HL"
for cid, _, _ in cols:
    tid = "T" + cid[1:]
    if cid == "c31": node(tid, "pumpkin", " ", w=190, h=175)
    elif cid == "c01":
        L.append(f'        {tid}["<b>Daylight saving ends</b><br/>2am · clocks fall back 1 hr"]'); cls["dst"].append(tid)
    else:
        L.append(f'        {tid}[" "]'); cls["sp"].append(tid)
    L.append(f"        {tprev} ~~~ {tid}")
    if cid == "c01":
        L.append('        CC["<b>CART CLOSES</b><br/>11:59pm PT · Sun Nov 1"]'); cls["cc"].append("CC")
        L.append(f"        {tprev} ~~~ CC")
    tprev = tid
prev = "H_c21"; cls["hdr"].append("H_c21")
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

mark()
# BMC45 track
L.append('    subgraph T_B [" "]')
L.append('        direction LR')
L.append(f'        BL["<b>{BIG["B"]}</b><br/><small><small>kept off pre-print<br/>love-form track only</small></small>"]')
prev = "BL"
for cid,_,_ in cols:
    nid = "B_"+cid
    if cid == "c21":
        node(nid, "stage", "<b>On stage</b><br/>Gold/Silver/Elite<br/>name in book")
    elif cid == "c22":
        node(nid, "email", "<b>Love-form closedown</b><br/>own schedule")
    else:
        L.append(f'        {nid}[" "]'); cls["sp"].append(nid)
    if prev: L.append(f"        {prev} {'-->' if cid=='c22' else '~~~'} {nid}")
    prev = nid
node("BP", "loveform", "<b>BMC45 Love Form</b><br/>hardybmc.com/love", w=172, h=218)
L.append(f"        {prev} ~~~~~ BP")
L.append("        B_c22 ~~~ BP")
node("BS", "spiffylive", "<b>Spiffy checkout</b><br/>BMC45 Love Form cart", w=172, h=218)
L.append(f"        {prev} ~~~~~ BS")
L.append("        B_c22 ~~~ BS")
L.append(f'    click BS href "{SPIFFY_URL}" _blank')
if PAGE_URL["B"]: L.append(f'    click BP href "{PAGE_URL["B"]}" _blank')
L.append("    end")
L.append("    HL ~~~ B_c21")
L.append("")

MAIN_FIRST = True
GRID = []
for rid, pfx, title, opencol, openx, closex, callout, fill, stroke in rows:
    mark()
    COLOR[rid] = stroke
    sub = {"E": "not at BMC45", "A": "excl. BMC45<br/>attendees", "M": "RIV · HJ · IPL<br/>JST · eFP<br/>+ Hardy Club", "D": "+ DarrenDaily<br/>subscribers"}[rid]
    L.append(f'    subgraph T_{rid} [" "]')
    L.append('        direction LR')
    L.append(f'        {rid}L["<b>{BIG[rid]}</b><br/><small><small>{sub}</small></small>"]')
    links = []
    prev = rid+"L"; n = 0; started = False; xi = 0; lane = {}; closing = []; tail = None
    for cid,_,_ in cols:
        nid = f"{rid}_{cid}"
        gid = f"{rid}{cid[1:]}"
        GRID.append(gid)
        L.append(f'        subgraph {gid} [" "]')
        if cid == opencol: started = True
        extras = []
        newtail = None
        snap = dict(lane)
        mark_main = len(L)
        if not started:
            L.append(f'        {nid}[" "]'); cls["sp"].append(nid)
        elif cid in REST:
            L.append(f'        {nid}["{"no email" if rid == "D" else "no send"}"]'); cls["rest"].append(nid)
        elif cid == opencol:
            n += 1; node(nid, "email", f"<b>{pfx}-{n}</b><br/>open", OPEN); extras = [(k, None, "") for k in openx]
        elif cid == "c30":
            n += 1; node(nid, "email", f"<b>{pfx}-{n}</b><br/>48 hrs left", CLOSE)
        elif cid == "c31":
            n += 1; node(nid, "email", f"<b>{pfx}-{n}</b><br/>24 hrs left", CLOSE)
        elif cid == "c01":
            n += 1; node(nid, "email", f"<b>{pfx}-{n}</b><br/>AM last day", CLOSE)
            n += 1; extras = [("email", CLOSE, f"<b>{pfx}-{n}</b><br/>PM final hours")] + [(k, None, "") for k in closex]
        else:
            n += 1; node(nid, "email", f"<b>{pfx}-{n}</b>")
        if rid == "M" and cid == "c01":
            extras = extras + [("hc", None, "Hardy Club post<br/><b>SUNDAY SERMON</b>")]
        if rid == "D" and started and cid not in ("c01", opencol):
            extras = extras + [("social", None, "")] + ([] if cid in ("c24", "c25", "c31") else [("dd", None, "")])  # DarrenDaily Mon-Fri only
        main_lines = L[mark_main:]; del L[mark_main:]
        main_link = f"    {prev} {'-->' if started and cid != opencol and not prev.endswith('L') else '~~~'} {nid}"
        if not MAIN_FIRST: links.append(main_link)
        for kind, badge, lab in extras:
            xi += 1; xid = f"{rid}x{xi}"
            node(xid, kind, lab or NAME[kind], badge)
            if cid == "c01": closing.append(xid)
            key = kind + ("2" if lab else "")
            if kind == "email": src = prev
            elif "SERMON" in lab: src = snap.get("hc", prev)
            else: src = snap.get(key) or tail or prev
            links.append(f"    {src} ~~~ {xid}")
            lane[key] = xid
            if kind != "email": newtail = xid
        if MAIN_FIRST: links.append(main_link)
        # emails are defined after the other channels so Mermaid stacks them on top
        L.extend(main_lines)
        L.append("        end")
        tail = newtail
        prev = nid
    pid = rid+"P"
    node(pid, "salespagelive" if PAGE_URL[rid] else "salespage", f"<b>Pre-print page</b><br/>/preorder<br/>+ {callout} callout", w=172, h=218)
    if PAGE_URL[rid]: links.append(f'    click {pid} href "{PAGE_URL[rid]}" _blank')
    # one visible arrow; invisible ties from every closing-day item centre the page on the track
    links.append(f"    {prev} ~~~~~ {pid}")
    for c in closing: links.append(f"    {c} ~~~~~ {pid}")
    L.append("    end")
    L.extend(links)
    L.append(f"    HL ~~~ {rid}_c21")
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
    keys = ["email","video","sms","vm","dd","ddod","social","hc","stage","salespage"]
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
L.append("    style T_B fill:#f5eef8,stroke:#7b2d8e,stroke-width:2px,color:#7b2d8e")
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
 "    classDef dst fill:#fff,stroke:#7b2d8e,stroke-dasharray:4 3,color:#333,font-size:22px",
 "    linkStyle default stroke:#888",
]
open(sys.argv[1],"w").write("\n".join(L)+"\n")
