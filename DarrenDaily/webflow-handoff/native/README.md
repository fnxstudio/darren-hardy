# Welcome page — NATIVE Webflow rebuild (code-ready, do NOT push until the upgraded page exists)

Goal: rebuild the welcome page as **native, hand-editable Webflow elements** (not an embed), deploying onto a NEW page once the site is on a paid plan. This folder holds everything needed to push it via the `whtml_builder` MCP tool.

## Hard constraints the native builder enforces (verified live on the hero test)
The `data_whtml_builder` CSS parser is strict. Everything below had to be reworked:
1. **Single-class selectors only.** No descendant selectors — `.hero-confirm h1` is rejected ("use single class selectors only"). Every styled element gets its own unique class; every contextual rule is rewritten flat.
2. **No `@keyframes` / CSS animations.** All motion is dropped by the parser → rebuilt as **Webflow Interactions** (see list below).
3. **No pseudo-elements.** `::after` overlays/scrims are dropped → each becomes a **real child `<div>`** in the markup.
4. **Breakpoints must be Webflow's** — `991 / 767 / 479` only. Our `980/860/760/720/600/560/480` are remapped (table below), which shifts some responsive tuning.
5. **Images must be Webflow library assets.** External URLs are skipped. Use the Webflow CDN URLs (all welcome images are already uploaded — see asset list) so the builder links them.
6. **Fonts:** add **Inter** to Webflow's Font Manager (or accept a system fallback). `@font-face` does not carry.

## Deliverables in this folder  ✅ BUILT & VERIFIED (rendered locally, all sections faithful)
- `welcome-native.html` — flattened body markup: **92 generated single-purpose classes**, `::after`/`::before` scrims converted to real child `<div>`s (suffixed `-af`/`-bf`), all 19 images pointing at Webflow CDN URLs. Includes the full current page (nav, hero, 01/02/03 steps, sessions, **9-tile Michael-Soler testimonial gallery**, `tw` trust-wall, close band, footer, exit popup).
- `welcome-native.css` — single-class, Webflow-parser-safe CSS. Audited: **0 descendant selectors · 0 `::` pseudo-elements · 0 `@keyframes` · 0 `var()` · 0 `@font-face` · breakpoints only 479/767/991.** Entrance/scroll-reveal states are neutralized to **visible by default** (content is never JS-dependent to be readable; motion becomes optional Interactions).
- `welcome-native-functional.js` — the **non-visual JS that stays as one custom-code embed even in a native build**: nav solid-on-scroll, Vimeo facade mount, exit-intent popup, Web-Share + clipboard/FB fallback + toast, member-wall parallax, scroll-reveal. (Native elements handle layout/style; this handles behavior.)
- `_interactions-todo.md` — the 29 rules that can't be single-classed (parent-hover→child, scroll-in state, `.playing`/`.solid`/`.open` state), grouped into "rebuild as Interaction" vs "driven by the JS" vs "minor cosmetic." **None hide content.**

## How it was generated (reproducible)
`flatten.py` is a small compiler: it parses `wf-welcome.css` → hardcodes `var()`, strips `@keyframes`/`animation`, remaps breakpoints → then uses a real DOM parser (BeautifulSoup) to, for every descendant/pseudo selector, assign a unique class to the matched elements (or insert a child div for `::after`/`::before`) and rewrite the rule flat. Re-run: `python3 webflow-handoff/native/flatten.py`. Build inputs kept alongside: `_welcome-mechanical.css`, `_welcome-src.html`. Local preview: `_preview.html` (whole page) / `_preview_tail.html` (gallery→footer); open with `file://`.

## Animations → rebuild as Webflow Interactions
| Animation (was CSS) | Trigger | Effect |
|---|---|---|
| hero H1 + lead entrance (`heroUp`) | Page load | fade + slide-up, staggered 0.1s/0.35s |
| video-frame entrance | Page load | fade + slide-up 0.6s |
| cue arrow bob (`cueBob`) | Loop | gentle up/down |
| play-button pulse | Loop | scale pulse + ring |
| `.reveal` / `.stagger` sections | Scroll into view | fade + slide-up (IntersectionObserver today) |
| steps timeline rail fill | Scroll into view | width/height grow |
| member gallery parallax (`data-speed`) | While scrolling | column translateY offset |

## Breakpoint mapping (ours → Webflow)
- `980px` → **991** (tablet)
- `860 / 760 / 720px` → **767** (mobile landscape)
- `600 / 560 / 480px` → **479** (mobile portrait)
Note: consolidating 3 custom phone breakpoints into 767/479 means a couple of spots need re-tuning by eye.

## Welcome images (already Webflow-hosted — reference these CDN URLs so the builder links them)
See `../asset-map.tsv` for the full filename → Webflow CDN URL list (dd-logo-white, dd-logo-color, hero-chair, dh-waving[-m], ep-card-2/3, Michael-Soler portrait, BMC_Logo, og-image).

## Deploy steps (when the new page is ready)
1. Create the page; get its `<body>` element id.
2. `whtml_builder` the sections from `welcome-native.html` + `welcome-native.css` (in chunks — one call per top-level section to stay under tool size limits).
3. Add the `welcome-native-functional.js` as a page/site custom-code embed (needs the plan).
4. Recreate the animations as Webflow Interactions (table above).
5. Add Inter in Font Manager; set page SEO/OG; publish.
</content>
