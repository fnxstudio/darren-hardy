#!/usr/bin/env python3
"""Verify the episodes baked into darrendaily-on-demand.html.

The page deliberately carries NO time-sensitive content: one hand-picked
evergreen featured episode plus six hand-curated runs. It therefore never
needs a daily, weekly or monthly push, and the daily drop lives on the
podcast apps the hero links to.

What can still go wrong is upstream: a curated episode gets pulled from the
feed, retitled, or re-uploaded under a new filename, and the page ends up
pointing at a dead mp3. That is what this checks.

    python3 refresh-ddod-data.py           # report only
    python3 refresh-ddod-data.py --fix     # also write back changed metadata

--fix updates titles and durations in place. It never adds, removes or
reorders episodes: the curation is a human decision, not a script's.
"""
import json, re, sys, urllib.request, datetime
import xml.etree.ElementTree as ET
from pathlib import Path

PAGE = Path(__file__).with_name("darrendaily-on-demand.html")
RSS  = "https://darrendailyondemand.libsyn.com/rss"
PRE  = "https://traffic.libsyn.com/secure/darrendailyondemand/"
ITU  = {"itunes": "http://www.itunes.com/dtds/podcast-1.0.dtd"}


def get(url):
    return urllib.request.urlopen(
        urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"}), timeout=90).read()


def clean(s):
    import html
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", s or ""))).strip()


def dedash(s):
    s = re.sub(r"\s*[—–]\s*", ". ", s)
    return re.sub(r"(\. )([a-z])", lambda m: m.group(1) + m.group(2).upper(), s)


src = PAGE.read_text(encoding="utf-8")
baked = json.loads("[" + re.search(r"const EPISODES = \[\n(.*?)\n\];", src, re.S)
                   .group(1).rstrip(",\n") + "]")
runs = json.loads("[" + re.search(r"const PLAYLISTS = \[\n(.*?)\n\];", src, re.S)
                  .group(1).rstrip(",\n") + "]")

live = {}
ch = ET.fromstring(get(RSS)).find("channel")
for it in ch.findall("item"):
    enc = it.find("enclosure")
    url = (enc.get("url") if enc is not None else "").split("?")[0]
    if url.startswith(PRE):
        live[url[len(PRE):]] = {
            "title": dedash(clean(it.findtext("title"))),
            "dur": it.findtext("itunes:duration", "", ITU),
        }

print("feed carries %d episodes; page bakes %d" % (len(live), len(baked)))

gone, drift = [], []
for e in baked:
    f = e[4]
    if f not in live:
        gone.append((e[1], f)); continue
    if live[f]["title"] != e[1]:
        drift.append(("title", f, e[1], live[f]["title"]))
    if live[f]["dur"] and live[f]["dur"] != e[3]:
        drift.append(("duration", f, e[3], live[f]["dur"]))

# every run must resolve to a baked episode, or a card renders short
index = {e[4] for e in baked}
for name, _tag, files in runs:
    missing = [f for f in files if f not in index]
    if missing:
        print("  RUN '%s' references %d episode(s) not baked: %s" % (name, len(missing), missing))

if gone:
    print("\nPULLED FROM THE FEED (these mp3s may 404, repick by hand):")
    for t, f in gone:
        print("  %s\n    %s" % (t, f))
if drift:
    print("\nMETADATA DRIFT:")
    for kind, f, was, now in drift:
        print("  %s %s\n    page: %s\n    feed: %s" % (kind, f, was, now))
if not gone and not drift:
    print("\nEverything matches. Nothing to do.")

if "--fix" in sys.argv and drift:
    for kind, f, was, now in drift:
        src = src.replace(json.dumps(was, ensure_ascii=False),
                          json.dumps(now, ensure_ascii=False))
    PAGE.write_text(src, encoding="utf-8")
    print("\nwrote %d metadata fix(es) to %s" % (len(drift), PAGE.name))
elif drift:
    print("\nrun again with --fix to write those back")
if gone:
    sys.exit(1)
