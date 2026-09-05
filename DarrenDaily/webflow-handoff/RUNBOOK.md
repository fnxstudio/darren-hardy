# DarrenDaily → Webflow (embed method) — Runbook

Getting the 3 hand-coded pages into a **new site in the DHLLC Webflow account** as
custom-code embeds (not template/CMS builds).

## Files in this folder
- `home-embed-1-styles.html` / `home-embed-2-body-scripts.html`  → darrendaily (home)
- `welcome-embed-1-styles.html` / `welcome-embed-2-body-scripts.html`
- `expired-embed-1-styles.html` / `expired-embed-2-body-scripts.html`
- `seo-og-values.json` — machine copy of the SEO/OG table below

Each page = **two HTML Embeds** (styles, then body+scripts). Sizes are all under
Webflow's 50,000-char embed limit (largest = home at ~43.5k).

## Asset hosting decision (read this)
All images, fonts, and the JS-built covers wall now point to **absolute URLs on the
current GitHub Pages host**: `https://fnxstudio.github.io/darren-hardy/DarrenDaily/…`
(GitHub serves these over a CDN, so they're fast). That means the Webflow pages
**depend on that GitHub repo staying published**. If DHLLC wants the assets fully
inside their control, we can later re-host them (Webflow assets / a DH CDN) and I'll
regenerate the chunks with new URLs. For getting live now, GitHub Pages is fine.

---

## Step-by-step (Webflow Designer)

**1. Create the site** — In the DHLLC workspace, New Site → **Blank Site**.

**2. Site-wide settings**
   - Site Settings → General → **Favicon**: upload `favicon-dd.png`; Webclip: `apple-touch-icon.png` (both on GitHub Pages, or grab from the repo).
   - Site Settings → **Custom Code → Head**: paste pixels here (see *Pixels* below).

**3. Create the pages** (Pages panel → +):
   - `darrendaily` (or make it the Home page) — slug of your choice
   - `welcome`
   - `expired` (or `session-expired`)

**4. For EACH page, in the Designer:**
   a. Delete any default content so the canvas is **empty** (no Webflow sections — our
      code brings its own nav/sections/footer).
   b. Drag an **Embed** element onto the empty body → paste `…-embed-1-styles.html`. Save.
   c. Drag a **second Embed** directly below it → paste `…-embed-2-body-scripts.html`. Save.
   d. Leave the body at default (no padding/container) — the pages are full-bleed by design.

**5. Per-page SEO + Open Graph** (Pages panel → page gear icon):
   - Enter Title Tag + Meta Description, and Open Graph Title/Description/Image from the table.
   - **Indexing:** the originals are `noindex` (pre-launch). For each page decide: check
     "Disable indexing" to keep it hidden, or leave indexable at launch. (Welcome + expired
     are usually kept `noindex`; the main opt-in page usually indexable.)

**6. Publish** to the staging (`.webflow.io`) domain and run the QA checklist.

---

## SEO / Open Graph values (paste into each page's settings)

### home  (darrendaily)
- **Title:** `DarrenDaily · Daily Mentoring with Darren Hardy`
- **Meta description:** `One strategic idea, distilled from 35 years behind the closed doors of the world's best, handed to you every weekday morning by private video, in five minutes. Free. Never an ad.`
- **OG title:** `DarrenDaily · Daily Mentoring with Darren Hardy`
- **OG description:** `One idea from 35 years behind the closed doors of the world's best. Five minutes, every weekday morning. Free. Never an ad.`
- **OG image:** `https://fnxstudio.github.io/darren-hardy/DarrenDaily/og-image.jpg`

### welcome
- **Title:** `You're In · DarrenDaily`
- **Meta description:** `You're on the list. Watch your welcome note from Darren Hardy, then make sure your first daily mentor session always reaches you.`
- **OG title:** `You're In · DarrenDaily`
- **OG description:** `Daily mentoring with Darren Hardy. One idea, five minutes, every weekday morning. Free.`
- **OG image:** `https://fnxstudio.github.io/darren-hardy/DarrenDaily/og-image.jpg`

### expired
- **Title:** `Session Expired · DarrenDaily`
- **Meta description:** `The DarrenDaily you were looking for has expired. Every message lives 72 hours, then it is gone. See why, then watch the sessions that are still live.`
- **OG title:** `Session Expired · DarrenDaily`
- **OG description:** `Every DarrenDaily message lives 72 hours, then it is gone. See why, then watch the sessions still live.`
- **OG image:** `https://fnxstudio.github.io/darren-hardy/DarrenDaily/og-image.jpg`

> Why these live in Webflow settings, not the embed: Webflow controls the page `<head>`.
> I stripped the original `<title>`/meta/OG out of the embed so there's no duplication —
> Webflow's fields are the single source of truth for SEO + social share cards.
> Recommend a proper 1200×630 OG image per page before launch (current `og-image.jpg` is generic).

---

## Pixels / analytics
Add these as **site-wide custom code** (Site Settings → Custom Code), not in the embeds:
- **Head:** Meta Pixel base code, GA4 gtag, any verification tags.
- **Footer (before `</body>`):** anything that must load last.
This fires on all pages. If a pixel should only fire on one page, use that page's
Page Settings → Custom Code instead.
**I need from you:** the pixel/measurement IDs (Meta Pixel ID, GA4 ID, etc.) and I'll
give you the exact snippets — or set them via MCP if you connect it.

---

## Must-fix before publish
- **Internal logo link:** on **welcome** and **expired**, the nav logo links to
  `darrendaily.html`. Change that to the Webflow home page path (e.g. `/` or `/darrendaily`)
  in embed-2 before/after pasting.
- **Placeholder content still in:** testimonials are all "Michael Soler" placeholders; the
  lightbox/preview video on the home page is a placeholder Vimeo. Swap real content before a
  public launch.

## QA checklist (on the staging URL)
- [ ] Images, fonts, seals, media logos, covers wall all load (no 404s in console)
- [ ] Hero renders correctly on mobile (logo haze, headline, DH framing) and desktop
- [ ] In-page anchors scroll (Join / Why Darren / scroll cue) — should stay on the page
- [ ] Vimeo facades play on click (welcome + expired heroes, home preview lightbox)
- [ ] Exit popup fires (welcome/expired) and closes via the X
- [ ] Share buttons / forms behave
- [ ] Social preview looks right (test with a share-card debugger)

## Optional: Webflow MCP
If you connect Webflow's MCP (custom connector + API token), I can auto-apply the SEO/OG
values and inject the pixel custom code once the pages exist. It **cannot** place the embeds
— that stays manual in the Designer.
