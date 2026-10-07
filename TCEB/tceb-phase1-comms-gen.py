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
 "hc": "<rect x='4' y='4' width='134' height='150' rx='6' fill='#fff' stroke='#222' stroke-width='3'/><rect x='4' y='4' width='134' height='26' rx='6' fill='#8b1a1a'/><text x='71' y='22' text-anchor='middle' font-family='Helvetica,Arial,sans-serif' font-size='13' font-weight='700' fill='#fff'>HARDY CLUB</text><circle cx='22' cy='48' r='9' fill='#8b1a1a'/><path d='M38 44h80M38 52h56' stroke='#bbb' stroke-width='4' stroke-linecap='round'/><rect x='16' y='66' width='110' height='40' rx='3' fill='#f4f4f4'/><path d='M24 78h90M24 88h70' stroke='#ccc' stroke-width='4' stroke-linecap='round'/><path d='M16 122h60M16 134h44' stroke='#bbb' stroke-width='4' stroke-linecap='round'/>",
 # on stage: mic on stand + spotlight
 "stage": "<path d='M40 4h62l30 150H10z' fill='#fff4d6' stroke='none'/><rect x='56' y='22' width='30' height='52' rx='15' fill='#222'/><path d='M46 60c0 22 50 22 50 0' fill='none' stroke='#222' stroke-width='5' stroke-linecap='round'/><path d='M71 82v46M50 130h42' stroke='#222' stroke-width='6' stroke-linecap='round'/><rect x='4' y='138' width='134' height='16' fill='#222'/>",
 # pages (exact art from the existing chart)
 "salespage": "<path d='M4 4h96l16 16v136H4z' fill='#fff' stroke='#222' stroke-width='3'/><path d='M100 4v16h16' fill='#ddd' stroke='#222' stroke-width='3'/><rect x='14' y='16' width='70' height='6' rx='2' fill='#222'/><rect x='14' y='28' width='56' height='5' rx='2' fill='#222'/><rect x='28' y='138' width='64' height='12' rx='3' fill='#222'/>" + CART + "<path d='M14 42h92M14 49h88M14 56h90M14 63h70M14 77h92M14 84h86M14 91h90M14 98h92M14 105h64M14 119h90M14 126h84M14 133h58' stroke='#bbb' stroke-width='4' stroke-linecap='round'/>",
 "salespagelive": None,
 "loveform": "<path d='M4 4h96l16 16v136H4z' fill='#fff' stroke='#1f5fa8' stroke-width='3'/><path d='M100 4v16h16' fill='#e3eefb' stroke='#1f5fa8' stroke-width='3'/><rect x='14' y='16' width='70' height='6' rx='2' fill='#1f5fa8'/><rect x='14' y='30' width='60' height='5' rx='2' fill='#1f5fa8'/><rect x='14' y='44' width='40' height='3' rx='1.5' fill='#bbb'/><rect x='14' y='50' width='92' height='10' rx='2' fill='none' stroke='#bbb' stroke-width='1.5'/><rect x='14' y='64' width='40' height='3' rx='1.5' fill='#bbb'/><rect x='14' y='70' width='92' height='10' rx='2' fill='none' stroke='#bbb' stroke-width='1.5'/><rect x='14' y='84' width='40' height='3' rx='1.5' fill='#bbb'/><rect x='14' y='90' width='92' height='10' rx='2' fill='none' stroke='#bbb' stroke-width='1.5'/><rect x='14' y='104' width='40' height='3' rx='1.5' fill='#bbb'/><rect x='14' y='110' width='92' height='10' rx='2' fill='none' stroke='#bbb' stroke-width='1.5'/><rect x='20' y='132' width='80' height='16' rx='3' fill='#1f5fa8'/>" + LIVE,
}
ART["salespagelive"] = ART["salespage"] + LIVE
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
    svg = HEAD + art + ("" if INLINE else (badge or "")) + "</svg>"
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
REST = {"c25"}
DSHORT = {c[0]: c[2].replace("Oct ", "10/").replace("Nov ", "11/") for c in cols}
DFULL = {c[0]: f"{c[1]} {DSHORT[c[0]]}" for c in cols}

# rows: id, prefix, title, open col, open extras, closing extras, callout, track fill, track stroke
BIG = {"B": "BMC45<br/>ATTENDEES", "E": "WAVE&nbsp;1<br/>ELITES", "A": "WAVE&nbsp;2<br/>BMC&nbsp;ALUMNI",
       "M": "WAVE&nbsp;3<br/>MEMBERS", "D": "WAVE&nbsp;4<br/>FULL<br/>DATABASE"}
COLOR = {"B": "#7b2d8e"}
PAGE_URL = {"B": "https://www.hardybmc.com/love",
            "E": None, "A": None, "M": None, "D": None}   # pre-print /preorder: fill in when live
rows = [
 ("E","EL","WAVE 1 · ELITES (not at BMC45)","c22",["video","sms","vm"],["sms","vm"],"Elite","#fff8e1","#c9a227"),
 ("A","AL","WAVE 2 · BMC ALUMNI (excl. BMC45 attendees)","c23",["sms"],["sms"],"Alumni","#e8f1fc","#1f5fa8"),
 ("M","MB","WAVE 3 · MEMBERS: RIV · HJ · IPL · JST · eFP + HARDY CLUB","c26",["sms","hc"],["sms","hc"],"Member","#e6f4f1","#00796b"),
 ("D","DB","WAVE 4 · FULL DATABASE + DARRENDAILY SUBSCRIBERS","c27",["dd","ddod","social"],["sms","ddod","social"],"Public","#fdeeee","#b00020"),
]

W, H = 62, 79
L = ["---", ("title: TCEB LAUNCH PHASE 1 · Pre-print comms by audience" + (" · KEY · gold envelope = opening day · red envelope = closedown · page with cart = pre-print page" if len(sys.argv) > 3 and sys.argv[3] == "inline" else "")), "config:", "  layout: dagre", "  look: classic", "  theme: default", "  flowchart:", "    wrappingWidth: 420", "  themeVariables:", "    primaryColor: '#ffffff00'", "    primaryBorderColor: '#ffffff00'", "    mainBkg: '#ffffff00'", "    nodeBorder: '#ffffff00'", "---",     "flowchart LR"]
cls = {"hdr":[], "rest":[], "sp":[], "pg":[], "cell":[], "hrest":[]}

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
L.append('    subgraph T_B ["kept off pre-print · love-form track only"]')
L.append('        direction LR')
L.append(f'        BL["<b>{BIG["B"]}</b>"]')
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
if PAGE_URL["B"]: L.append(f'    click BP href "{PAGE_URL["B"]}" _blank')
L.append("    end")
L.append("    HL ~~~ B_c21")
L.append("")

GRID = []
for rid, pfx, title, opencol, openx, closex, callout, fill, stroke in rows:
    mark()
    COLOR[rid] = stroke
    sub = {"E": "not at BMC45", "A": "excl. BMC45 attendees", "M": "RIV · HJ · IPL · JST · eFP + Hardy Club", "D": "+ DarrenDaily subscribers"}[rid]
    L.append(f'    subgraph T_{rid} ["{sub}"]')
    L.append('        direction LR')
    L.append(f'        {rid}L["<b>{BIG[rid]}</b>"]')
    links = []
    prev = rid+"L"; n = 0; started = False; xi = 0; lane = {}; closing = []
    for cid,_,_ in cols:
        nid = f"{rid}_{cid}"
        gid = f"{rid}{cid[1:]}"
        GRID.append(gid)
        L.append(f'        subgraph {gid} [" "]')
        if cid == opencol: started = True
        extras = []
        if not started:
            L.append(f'        {nid}[" "]'); cls["sp"].append(nid)
        elif cid in REST:
            L.append(f'        {nid}["{"no email" if rid == "D" else "no send"}"]'); cls["rest"].append(nid)
        elif cid == opencol:
            n += 1; node(nid, "email", f"<b>{pfx}-{n}</b> · {DSHORT[cid]}<br/>open", OPEN); extras = [(k, None, "") for k in openx]
        elif cid == "c30":
            n += 1; node(nid, "email", f"<b>{pfx}-{n}</b> · {DSHORT[cid]}<br/>48 hrs left", CLOSE)
        elif cid == "c31":
            n += 1; node(nid, "email", f"<b>{pfx}-{n}</b> · {DSHORT[cid]}<br/>24 hrs left", CLOSE)
        elif cid == "c01":
            n += 1; node(nid, "email", f"<b>{pfx}-{n}</b> · {DSHORT[cid]}<br/>AM last day", CLOSE)
            n += 1; extras = [("email", CLOSE, f"<b>{pfx}-{n}</b> · {DSHORT[cid]}<br/>PM final hours")] + [(k, None, "") for k in closex]
        else:
            n += 1; node(nid, "email", f"<b>{pfx}-{n}</b> · {DSHORT[cid]}")
        if rid == "D" and started and cid not in ("c01", opencol):
            extras = extras + ([] if cid in ("c24", "c25", "c31") else [("dd", None, "")]) + [("social", None, "")]  # DarrenDaily Mon-Fri only
        links.append(f"    {prev} {'-->' if started and cid != opencol and not prev.endswith('L') else '~~~'} {nid}")
        for kind, badge, lab in extras:
            xi += 1; xid = f"{rid}x{xi}"
            node(xid, kind, lab or NAME[kind], badge)
            if cid == "c01": closing.append(xid)
            key = kind + ("2" if lab else "")
            links.append(f"    {lane.get(key, prev)} ~~~ {xid}")
            lane[key] = xid
        L.append("        end")
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
cls["imgn"] = IMGS
# Mermaid stacks LR subgraphs bottom-up, so emit tracks in reverse to read top-down
pre = L[:SECT[0]]; secs = [L[SECT[i]:SECT[i+1]] for i in range(len(SECT)-1)]; tail = L[SECT[-1]:]
L[:] = pre + [x for sec in reversed(secs) for x in sec] + tail
for h in cls["hdr"]:
    L.append(f"    style {h} color:#1a1a1a,font-size:36px,font-weight:800")
for h in cls["hrest"]:
    L.append(f"    style {h} color:#b5b0a5,font-size:36px")
for r, c in COLOR.items():
    L.append(f"    style {r}L fill:none,stroke:none,color:{c},font-size:44px,font-weight:900")
L.append(f"    class {','.join(GRID)} gridc")
for k,v in cls.items():
    if v: L.append(f"    class {','.join(v)} {k}")
L += [
 "    classDef hdr fill:none,stroke:none,color:#1a1a1a,font-size:22px",
 "    classDef hrest fill:none,stroke:none,color:#aaa,font-size:22px",
 "    classDef rest fill:#eee,color:#888,stroke:#ccc,stroke-dasharray:4 3",
 "    classDef sp fill:none,stroke:none,color:transparent",
 "    classDef cell fill:#ffffffaa,stroke:#bbb,stroke-dasharray:3 3,color:#999",
 "    classDef gridc fill:none,stroke:none",
 "    linkStyle default stroke:#888",
]
open(sys.argv[1],"w").write("\n".join(L)+"\n")
