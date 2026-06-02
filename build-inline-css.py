#!/usr/bin/env python3
"""
build-inline-css.py — page-speed build step for bmc.html.

bmc.css stays the clean, documented SOURCE OF TRUTH. This script minifies it
(strip comments + indentation, safe — never touches token structure, so calc()
etc. survive) and inlines it into bmc.html as <style id="bmc-css">…</style>,
which eliminates the render-blocking CSS request.

WORKFLOW: edit bmc.css → run `python3 build-inline-css.py` → commit.
Re-runs are idempotent (it replaces the existing <style id="bmc-css"> block).
"""
import re, sys, pathlib

root = pathlib.Path(__file__).parent
css = (root / "bmc.css").read_text(encoding="utf-8")

# Safe minify: drop /* */ comments + per-line indentation + blank lines.
# (We deliberately KEEP newlines and intra-value spaces so calc(), multi-stop
#  gradients, transitions, etc. are never corrupted.)
css = re.sub(r"/\*.*?\*/", "", css, flags=re.DOTALL)
css = "\n".join(l.strip() for l in css.split("\n") if l.strip())

html_path = root / "bmc.html"
html = html_path.read_text(encoding="utf-8")
block = '<style id="bmc-css">' + css + "</style>"

if '<style id="bmc-css">' in html:
    html = re.sub(r'<style id="bmc-css">.*?</style>', lambda m: block, html, flags=re.DOTALL)
elif re.search(r'<link rel="stylesheet" href="bmc\.css\?v=\d+">', html):
    html = re.sub(r'<link rel="stylesheet" href="bmc\.css\?v=\d+">', lambda m: block, html)
else:
    sys.exit("ERROR: found neither the bmc.css <link> nor an existing <style id=bmc-css> in bmc.html")

html_path.write_text(html, encoding="utf-8")

src_kb = len((root / "bmc.css").read_text(encoding="utf-8")) / 1024
min_kb = len(css) / 1024
print(f"inlined bmc.css: {src_kb:.0f}KB source -> {min_kb:.0f}KB minified, embedded in bmc.html")
print(f"CSS braces in inlined block: open {css.count('{')} / close {css.count('}')}")
