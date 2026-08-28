#!/usr/bin/env python3
"""Refresh the baked-in data inside darrendaily-on-demand.html.

The page ships with the 30 most recent episodes and a set of real Apple
Podcasts reviews inlined, so it renders and plays with zero network calls.
The full 1,519-episode archive is still fetched live when a visitor taps
"Open the full archive", so the page never goes stale, but the top of the
feed should be re-baked whenever it drifts (monthly is plenty).

    python3 refresh-ddod-data.py            # episodes only
    python3 refresh-ddod-data.py --reviews  # episodes + re-pull reviews

Reviews are only refreshed on request: the shipped set was hand-picked for
length and variety, and a blind re-pull would replace that curation.
"""
import json, re, sys, urllib.request, datetime
import xml.etree.ElementTree as ET
from pathlib import Path

PAGE = Path(__file__).with_name("darrendaily-on-demand.html")
RSS = "https://darrendailyondemand.libsyn.com/rss"
REVIEWS_URL = ("https://itunes.apple.com/us/rss/customerreviews/page={}"
               "/id=1449270369/sortby=mosthelpful/json")
PRE = "https://traffic.libsyn.com/secure/darrendailyondemand/"
ITU = {"itunes": "http://www.itunes.com/dtds/podcast-1.0.dtd"}
COUNT = 30


def get(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    return urllib.request.urlopen(req, timeout=60).read()


def dedash(s):
    """House style: no em dashes anywhere in DH copy."""
    s = re.sub(r"\s*[—–]\s*", ". ", s)
    return re.sub(r"(\. )([a-z])", lambda m: m.group(1) + m.group(2).upper(), s)


def blurb(desc):
    d = re.sub(r"\s*Get more personal mentoring from Darren.*$", "", desc).strip()
    d = re.sub(r"In this episode of DarrenDaily On-Demand,\s*", "", d)
    d = re.sub(r"^Darren Hardy ", "Darren ", d)
    d, out = dedash(d), ""
    for part in re.split(r"(?<=[.!?]) ", d):
        if len(out) + len(part) > 215 and out:
            break
        out = (out + " " + part).strip()
    return out


def strip_tags(s):
    import html
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", s or ""))).strip()


def episodes():
    ch = ET.fromstring(get(RSS)).find("channel")
    rows, total = [], len(ch.findall("item"))
    for it in ch.findall("item")[:COUNT]:
        enc = it.find("enclosure")
        url = (enc.get("url") if enc is not None else "").split("?")[0]
        if not url.startswith(PRE):
            continue
        file = url[len(PRE):]
        # The mp3 filename is authoritative. itunes:episode is missing on some
        # items in this feed and wrong on at least one (28 Jul 2026).
        m = re.search(r"Episode[_-](\d+)", file)
        num = int(m.group(1)) if m else int(it.findtext("itunes:episode", "0", ITU) or 0)
        dt = datetime.datetime.strptime(it.findtext("pubDate")[:16].strip(), "%a, %d %b %Y")
        rows.append([num, dedash(strip_tags(it.findtext("title"))), dt.strftime("%Y-%m-%d"),
                     it.findtext("itunes:duration", "", ITU),
                     file, blurb(strip_tags(it.findtext("itunes:summary", "", ITU)
                                            or it.findtext("description")))])
    nums = [r[0] for r in rows]
    if len(set(nums)) != len(nums):
        sys.exit("duplicate episode numbers in the feed: " + str(nums))
    return rows, total


def reviews():
    seen, out = set(), []
    for page in range(1, 7):
        try:
            data = json.loads(get(REVIEWS_URL.format(page)))
        except Exception:
            break
        for x in data["feed"].get("entry", []):
            if "im:rating" not in x or x["id"]["label"] in seen:
                continue
            seen.add(x["id"]["label"])
            if int(x["im:rating"]["label"]) != 5:
                continue
            body = re.sub(r"\s+", " ", x["content"]["label"]).strip()
            body = re.sub(r"\s*[—–]\s*", ", ", body).replace(" - ", ", ")
            if not 70 < len(body) < 300:
                continue
            out.append([x["author"]["name"]["label"], x["title"]["label"], body])
    return out[:30]


def swap(src, name, rows):
    block = ("const %s = [\n" % name +
             "".join("  " + json.dumps(r, ensure_ascii=False) + ",\n" for r in rows) + "];")
    new, n = re.subn(r"const %s = \[\n(?:.*?\n)*?\];" % name, block, src, count=1)
    if n != 1:
        sys.exit("could not find the %s block in the page" % name)
    return new


src = PAGE.read_text(encoding="utf-8")
eps, total = episodes()
src = swap(src, "EPISODES", eps)
src = re.sub(r"Search [\d,]+ episodes", "Search {:,} episodes".format(total), src)
src = re.sub(r"(Open The Full )[\d,]+( Episode Archive)", r"\g<1>{:,}\g<2>".format(total), src)
src = re.sub(r"([>\"])[\d,]+( episodes in the archive| Episodes)", r"\g<1>{:,}\g<2>".format(total), src, flags=re.I)
print("episodes: %d baked, %d in the archive (latest %d)" % (len(eps), total, eps[0][0]))

if "--reviews" in sys.argv:
    revs = reviews()
    src = swap(src, "REVIEWS", revs)
    print("reviews: %d re-pulled" % len(revs))
    print("NOTE: check every quote reads well before shipping, and re-check the")
    print("      4.9 / 1,709 ratings figures on the Apple Podcasts page.")

PAGE.write_text(src, encoding="utf-8")
print("wrote", PAGE.name)
