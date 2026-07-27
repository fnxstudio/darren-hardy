# DarrenDaily — Webflow CMS Post Template: Build Runbook

Goal: rebuild `post.html` (the double-column daily session page) as a **Webflow CMS
"Sessions" blog template**, so the team creates each weekday post by filling in fields.
Source of truth for the design = `DarrenDaily/post.html` in this repo.

Build method: Claude drives the Webflow Designer via computer takeover on your machine
(you logged in), in sittings. This runbook is the checklist we work through and check off.

---

## The core sequencing rule (design vs. CMS vs. population)

**Schema first, then design against real data, then bulk-populate.** You bind design
elements to fields, so the fields must exist before you can wire them — and Webflow's
Designer shows *live* CMS data on the template, so you want a couple of real items to
design against.

Order:
1. **Global setup** (fonts, color variables, base classes) — no CMS needed.
2. **CMS schema** — create the collections + all fields.
3. **Seed 2–3 real items** — fully populated, so the template has real content to design
   against and the "Expiring Soon" list has something to show.
4. **Design the Collection Page template** — static shell first, then bind fields.
5. **Custom code + integrations** (HubSpot, tracking, embeds).
6. **Responsive + QA** against the seed items.
7. **Domain + publish.**
8. **Bulk-populate** the rest of the posts + turn on the automations.

Population happens in **two waves**: a few seed items early (to design/test against),
the full backfill after the template is done.

---

## Phase 0 — Pre-flight (accounts, access, assets)

- [ ] **Webflow site plan = Premium** (~**$25/mo** annual / **$39/mo** monthly — the May-2026 merge of the old CMS + Business plans; top standard tier, ample for 30K+/week). Site already EXISTS (Site ID `6a66d7a6f9d116b514a13ae1`, **darrendaily.com**) → this is an **upgrade**, not a new project.
- [ ] Workspace can stay **Free/Starter** (only one Designer builder). Team = content-editor seats (included).
- [ ] Confirm Claude has Designer access via computer takeover (you signed in, Designer open).
- [ ] **DNS access** ready for the domain step (registrar / DNS host for darrenhardy.com).
- [ ] **HubSpot**: portal **2518645**, admin access to build Smart CTAs + grab the tracking code.
- [ ] **Tracking IDs gathered** (see Phase 5): GA4 Measurement ID, Meta Pixel ID, any others DH uses today. *(Confirm which are actually in the current stack — don't assume.)*
- [ ] **Assets ready to upload**: Inter web fonts, logos (white + color), video posters, listing cards, banners, `dd-reward-mug.webp`, the 64 SUCCESS covers + Darren cutout, seals, favicon/OG defaults.
- [ ] **Code embeds staged** (copy straight from `post.html`): covers-wall JS, reveal, video-facade, share, sticky, exit-intent + client-side expiry gate, Hyvor, OG/Twitter/schema snippets.
- [ ] **Decisions locked** (see "Open decisions" at the bottom): card model (A vs B), banner/featured/sticky = CMS vs HubSpot.

---

## Billing & scaling note (site plans vs. workspace; when to consider Enterprise)

Webflow bills on **two separate axes** — they don't substitute for each other:
- **Site plans** = *per site*. Cover hosting, CMS, bandwidth, custom code (Basic / Premium / Enterprise).
- **Workspace plans** = the *team/org* layer. Cover Designer seats, staging, code export — **not hosting.**

So **upgrading the workspace does NOT lower per-site hosting cost.** Each published site needs its
own site plan; three sites on standard plans = **three Premium plans**. Upgrade the *workspace* only
if multiple people need to build in the Designer at once (a build-team cost, separate from hosting).

**When to talk to Webflow sales about Enterprise:** if/when the other DH properties
(**DarrenHardy.com**, **HardyBMC.com**) are brought into Webflow — especially given **heavy, spiky
promo traffic** — get an **Enterprise** quote. Enterprise is the multi-site consolidation play:
- **Custom / burst bandwidth** — standard Premium has a fixed allotment; a big promo push can blow
  past it and trigger overages or throttling. Enterprise sizes bandwidth to your promo *peaks*.
- **Multiple sites + billing under one contract** (instead of stacking separate plans, each with its
  own cap), plus SSO, security, guaranteed uptime, support.
- Custom-quoted (no public price). If DarrenDaily is already on Premium, Webflow typically folds it in.

**Flag:** migrating DarrenHardy.com (currently WordPress) + HardyBMC.com into Webflow is a substantial
*build/migration* project on its own — scope it separately from the billing decision.

For now: DarrenDaily stays on **Premium**; revisit Enterprise only when consolidating the other sites.

---

## Phase 1 — Global setup (Designer)

- [ ] Upload **Inter** web fonts (or use Webflow's Google Fonts) — weights 400–900.
- [ ] Define **color variables / swatches**: `--paper #fff`, `--mist #f3f5f8`, `--ink #14171c`, `--muted`, `--soft`, `--accent #a72632`, `--accent-deep`, `--accent-bright #cf3a45`, `--dark #2a1015`, `--dark-2 #1c0a0e`, `--gold`, line colors.
- [ ] Set **radius token = 4px** everywhere (brand standard: content 4px, modals square).
- [ ] Build **reusable classes/symbols**: `.btn` (+ ondark/small), `.eyebrow` (+ accent/on-dark/center), `.container`.
- [ ] Base typography (h1–h3 weight 900, letter-spacing; Inter-only). **No em dashes. No pink.**

---

## Phase 2 — CMS schema

### Collection: **Sessions** (one item = one daily post)
Per-post fields (≈23; under Webflow's ~30-field ceiling):

| Field | Type | Notes |
|---|---|---|
| Name (=Title) | Plain text | Webflow default; H1/SEO/share |
| Slug | Plain text | Webflow default; URL |
| Published | Date/Time | dateline + Expiring sort |
| **Expire** | Date/Time | powers JetBoost auto-archive + client gate |
| Vimeo ID | Plain text | video embed |
| Video Thumbnail | Image (1280×720) | player poster **and** blurred hero bg |
| Thumbnail Alt | Plain text | defaults to Title |
| Listing Card Image | Image (640×360) | this post in *others'* Expiring Soon |
| Caption | Rich text | short, under the video |
| Inline Banner Image | Image (1720×464) | optional |
| Inline Banner URL | Link | optional |
| Inline Banner Alt | Plain text | optional |
| Sticky Banner Image | Image (1600×200) | optional |
| Sticky Banner URL | Link | optional |
| Sticky Button Copy | Plain text | e.g. "Save Your Seat" |
| Sticky Button URL | Link | optional |
| Sticky Button Color | Plain text | hex; default KIMI blue |
| Moneyline Quote | Plain text | optional (per-post) |
| Moneyline Attribution | Plain text | optional |
| SEO Title | Plain text | defaults to Title |
| Meta Description | Plain text | ~155 char |
| Social Share Image | Image (1200×630) | OG; defaults to Video Thumbnail |
| Share / Tweet Copy | Plain text | optional |

### Collection: **Sidebar Cards** (global, reorderable — approach A)
Evergreen cards edited once and reused on every post; drag/reorder anytime.

| Field | Type | Notes |
|---|---|---|
| Name | Plain text | card label, e.g. "Store — Journal" |
| Card Type | Option | Featured / Store / (Champion later) |
| Order | Number | sort order in the column |
| Active | Switch | show/hide this card |
| Image | Image | Featured 770×1016 / Store ~800×500 |
| Title | Plain text | Store |
| Body | Plain text | Store |
| Button Copy | Plain text | Store |
| Button URL | Link | Featured + Store |

> **Moneyline stays on the Session** (per-post quote). Featured/Store live here so the
> column is edited/reordered globally without touching every post. **Champion = paused**
> (reserved Card Type; add when there's bandwidth).

- [ ] Create **Sessions** collection + fields above.
- [ ] Create **Sidebar Cards** collection + fields above.

---

## Phase 3 — Seed items

- [ ] Add **2–3 fully-populated Sessions** using real content (e.g. the Saturday session) so the template has live data to design against and the Expiring list has ≥2 items.
- [ ] Add the **Sidebar Cards** (Featured CTA, Store/DDJ) as active items with Order set.

---

## Phase 4 — Design the Collection Page template

Build the static shell first, then bind fields.

**Static shell (structure + styles, no CMS yet):**
- [ ] Hero: blurred background image layer, dark overlay, masthead (white logo left, date right), video frame (16:9, 4px radius, soft drop shadow — **no white ring**, box-shadow not border), share row ("Share this edge", right-justified, no dividers).
- [ ] Framed content card (left 2/3) overlapping the hero by -64px; grid 2fr/1fr, ~25px inset from the video width.
- [ ] Right column (1/3) container, sticky.
- [ ] Expiring Soon strip (centered, #NeverMiss eyebrow, 476px cards).
- [ ] The Vantage bio (covers wall + Darren cutout), Footer, Sticky CTA (top-level), Exit-intent modal.

**Bind CMS fields:**
- [ ] Video `data-vimeo-id` + poster ← Vimeo ID / Video Thumbnail; hero bg ← Video Thumbnail.
- [ ] Dateline ← Published; H1 (sr-only) ← Title; Caption ← Caption (rich text).
- [ ] Inline banner (image/link/alt) ← fields; **conditional visibility** = "Banner Image is set".
- [ ] Sticky strip + button ← Sticky fields (or HubSpot — see decisions); conditional visibility.
- [ ] Moneyline card ← Quote/Attribution; conditional visibility = "Quote is set".
- [ ] Sidebar cards = **nested Collection List** → Sidebar Cards, filter Active = true, sort by Order.
- [ ] Expiring Soon = **Collection List** → Sessions, sort Published desc, limit 2, **filter out the current item**, card image ← Listing Card Image, date ← Published.

---

## Phase 5 — Custom code + integrations

**Site-wide head** (Site Settings → Custom Code → Head):
- [ ] **HubSpot** tracking: `<script id="hs-script-loader" async defer src="//js.hs-scripts.com/2518645.js"></script>`
- [ ] **GA4**: gtag snippet (confirm Measurement ID).
- [ ] **Meta Pixel** (confirm ID) + any other pixels DH runs.
- [ ] **Twitter card** default: `<meta name="twitter:card" content="summary_large_image">`
- [ ] Consent/cookie banner = **HubSpot native "Notify" banner** (configured in HubSpot, served by the tracking code above — no separate tool). Add a CMP only if strict GDPR opt-in gating is required.

**Collection Page SEO/OG** (native, bind to fields):
- [ ] SEO tab: Title ← SEO Title (fallback Title), Description ← Meta Description.
- [ ] Open Graph tab: OG Title ← Title, OG Description ← Meta Description, OG Image ← Social Share Image.

**Embeds** (paste from `post.html` into Embed elements / page code):
- [ ] Hyvor comments (`website-id="13897"`, page-id empty) + loader. **Add the Webflow staging URL (`*.webflow.io`) AND `darrendaily.com` to Hyvor's allowed domains** (Hyvor console → website 13897 → Settings → Domains) — otherwise comments show "domain not trusted".
- [ ] JS: covers-wall parallax, scroll/on-load reveal, video facade, share buttons, sticky CTA (mid-screen trigger), exit-intent opt-in, **client-side expiry gate** (redirect past-Expire → 404/expired page).
- [ ] Article JSON-LD (optional, CMS-bound values).

**HubSpot Smart CTAs** (if using — Option A, list-personalized; same "DarrenDaily audience" list):
- [ ] Featured slot (770×1016), Inline banner (1720×464), Exit-intent opt-in — swap the CMS element for the Smart CTA embed where chosen.

---

## Phase 6 — Responsive + QA

- [ ] Tablet + mobile breakpoints (columns stack ≤980px; hero/type scale; sticky height 64px ≤640px).
- [ ] QA against seed items: video plays, share works, conditional blocks hide when empty, Expiring list excludes current + pulls right thumbnails, comments load, sticky triggers mid-screen, exit-intent + expiry gate fire.
- [ ] **Bandwidth hygiene**: covers wall stays lazy + small; posters/banners compressed webp.

---

## Phase 7 — Domain + publish

- [ ] Add custom domain in Webflow (Site Settings → Publishing): **darrendaily.com** (root) + **www.darrendaily.com**.
- [ ] DNS (root domain): **A records** for `darrendaily.com` → the exact IPs Webflow shows, plus a **CNAME** for `www` → `proxy-ssl.webflow.com`. Enter exactly what Webflow displays. **SSL is free + automatic** — nothing to buy or install.
- [ ] Update the pages' **canonical** from `dd.darrenhardy.com` → `darrendaily.com` before go-live.
- [ ] Set default domain (recommend www) + enable auto-redirect + Default to HTTPS; verify SSL green; publish.

---

## Phase 8 — Populate + automations

- [ ] **Backfill** existing sessions (Editor, CSV import, or Webflow API/MCP once the connector is live on Claude's side).
- [ ] Ongoing intake = the fields spreadsheet → Editor (team) or API.
- [ ] **JetBoost auto-archive** on the **Expire** field (backend/API, no page script). Confirm it triggers a publish + its check cadence.
- [ ] Expired page already set as the **404** ✅ — archived post URLs land there.
- [ ] Verify a full lifecycle: publish → live → past Expire → gate + JetBoost pull it → 404/expired.

---

## Open decisions (confirm before Phase 2)

1. **Sidebar card model** — **A (recommended):** global Sidebar Cards collection (edit/reorder once, applies to all posts) + Moneyline per-post. **B:** all cards per-post (max flexibility, more daily entry). *This runbook assumes A.*
2. **Banner / Featured / Sticky** — CMS images (team uploads) **or** HubSpot Smart CTAs (set-once, audience-personalized). *Runbook lists both; pick per slot.*
3. **Tracking stack** — confirm exactly which of GA4 / Meta Pixel / others are in use.
4. **Consent banner** — ✅ **HubSpot's native banner ("Notify" type)**, served by the site-wide HubSpot tracking code (no separate tool). Caveat: it governs HubSpot's own cookies; it does **not** auto-gate GA4/Meta before they fire — right for a notify/opt-out (US) posture. Add a dedicated CMP (Cookiebot/CookieYes) only if strict GDPR opt-in gating of the non-HubSpot pixels is required.

---

## Reference

- Design source: `DarrenDaily/post.html` (live: fnxstudio.github.io/darren-hardy/DarrenDaily/post.html)
- Archived v1: `DarrenDaily/archive/darrendaily-post.html`
- Webflow Site ID: `6a66d7a6f9d116b514a13ae1` · production domain: **darrendaily.com** (site already exists)
- HubSpot portal: **2518645** · Hyvor website-id: **13897**
- Vimeo IDs (funnel): home/who-for 277017410 · welcome 298901870 · expired 298896900 · sample session 355893131
