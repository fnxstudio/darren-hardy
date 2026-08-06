# Recreate the "Daily Sessions" CMS system in a new Webflow site

**Hand this whole file to a fresh Claude Code (or Cowork) chat that has the Webflow Data API
MCP connected to the TARGET site.** It rebuilds the *functionality* of the DarrenDaily Sessions
system — brand-neutral. None of Darren Hardy's copy, logo, colors, or decorative sections are
required; a "Brand-strip checklist" at the end says what to drop or swap.

Reference implementation (copy + adapt): `DarrenDaily/webflow-handoff/dd-sessions.js` and the SOP
files in the same folder. This doc is self-contained on the spec, architecture, and gotchas so you
can rebuild even without those files.

---

## 0. What this system does (the functionality to reproduce)

A **self-rotating daily video series**, CMS-driven:

- Each post is one **Session** CMS item = a video + caption on its own page at `/sessions/{slug}`.
- A post **reveals itself on its Published date** and **drops out of all the cross-page feeds 72
  hours later** — automatically, with **no re-publishing**. The rotation is driven purely by two
  CMS date fields (`published`, `expire`) and a small client-side filter. No paid plugin required
  for the feed rotation (a plugin is only needed to 404 the post's own page — see §7).
- Cross-page "Latest / Expiring Soon" strips (on the template itself and on other pages like a
  Welcome or Expired page) all read one hidden feed page and show only the currently-live posts.
- The video is a **click-to-load facade** (poster image up front, real Vimeo iframe built on
  click) so the page stays fast.

The moving parts:

1. A **Sessions** CMS collection (fields in §2).
2. A hidden **`/sessions-feed`** page — a Collection List that exposes each session's fields as
   `[data-sf]` attributes. This is the machine-readable feed every filter reads (§3).
3. A **Sessions Template** page — the single-column layout the CMS renders per item (§4).
4. One **behaviors bundle** (`sessions.js`) — self-contained vanilla JS, hosted as a **site-wide
   registered footer script**, guarded to run only on session pages (§5).
5. The **cross-page feed snippet** for any other page that shows a "latest/expiring" strip (§6).

---

## 1. Prerequisites & hard-won API facts (read before building)

- **Webflow Data API MCP** connected to the target site. Grab `site_id` via `list_sites`.
- **Paid Webflow plan** is needed for custom code (registered scripts / freeform). On a free site,
  page- and site-level custom code calls return **404**.
- **You cannot write a `<script>` into PAGE-level freeform code** — the API returns **406**. Writing
  non-script content (CSS, comments) into page freeform is fine. This is *why* the behaviors live in
  a **site-wide registered script**, not page code.
- **Page-level registered scripts 404** on non-Enterprise plans — so the one bundle is applied
  **site-wide** and **guarded** by a marker class (it no-ops on non-session pages).
- **Registered scripts cannot be deferred** (the `attributes` map only accepts `data-*` keys) and
  **cannot be deleted** via the API (returns **400**) — they linger unapplied but harmless. Plan
  versions carefully; you re-register a new version each deploy.
- **CMS `create_collection_items` takes `fieldData` as an ARRAY** of item objects (not a single
  object). Easy to get wrong.
- **CMS image fields** are set as `{ "fileId": "<assetId>", "url": "<https cdn url>" }`.
- **All CMS datetimes are UTC.**
- **Asset upload is a 2-step flow:** `create_asset` returns a presigned S3 form; then POST the bytes
  (multipart, `key` first, `file` last) to the returned `uploadUrl`. A **201** = success. A ready
  helper script lives in the reference repo (`webflow-src/tools/s3-upload.sh`).

---

## 2. Step 1 — Create the `Sessions` collection

`data_cms_tool → create_collection` (displayName "Sessions", singularName "Session", slug
"sessions"), then add these fields with `create_collection_static_field`. Two required fields
(`name`, `slug`) are created automatically by Webflow — don't re-add them.

| Field (slug) | Type | Required | Purpose |
|---|---|---|---|
| `published` | DateTime | no | **Reveal date.** Shown as the page date; sorts feeds; drives rotation. |
| `expire` | DateTime | no | **Published + 72h.** When it drops from feeds (and 404s the page, via §7). Not shown. |
| `vimeo-id` | PlainText | no | Numeric Vimeo id only, e.g. `355893131`. |
| `thumbnail` | Image | no | 1280×720. Video poster **and** the feed/listing card image. Store as WebP (§8). |
| `thumbnail-alt` | PlainText | no | Alt text; default to the title. |
| `caption` | RichText | no | Short line under the video. `**bold**` lead-ins allowed. |
| `secondary-caption` | RichText | no | Optional continuation / secondary CTA copy. |
| `inline-banner-image` | Image | no | Optional in-content banner (≈1720×464). WebP. |
| `inline-banner-url` | Link | no | Where the inline banner clicks to. |
| `inline-banner-alt` | PlainText | no | Alt for the inline banner. |
| `sticky-banner-image` | Image | no | Optional pinned strip (≈1600×200). |
| `sticky-url` | Link | no | Where the sticky strip + its button go. |
| `sticky-button-copy` | PlainText | no | Sticky button label, e.g. "Save Your Seat". |
| `sticky-button-color` | Color | no | Hex for the sticky button. |
| `seo-title` | PlainText | no | `<title>`; default to the name. |
| `meta-description` | PlainText | no | ~155 chars. |
| `social-share-image` | Image | no | 1200×630 OG image. **Keep PNG/JPG** (see §8). |
| `share-tweet-copy` | PlainText | no | Optional custom share text; default to the title. |
| `name` | PlainText | **yes** | (auto) The title. |
| `slug` | PlainText | **yes** | (auto) URL slug = `/sessions/{slug}`. |

**Optional martech fields (skip unless you use HubSpot):** the original had
`secondary-caption-smart-cta`, `inline-banner-smart-cta`, `sticky-smart-cta` (PlainText) that took a
HubSpot CTA UUID and swapped the corresponding slot for a HubSpot Smart CTA. Omit these for a generic
build; the banners work fine as plain image+link without them.

> The original also once had `moneyline-quote`, `moneyline-attribution`, `featured-cta-id`, and a
> `sidebar-cards` multi-reference (a right-column promo system). **That whole right column was
> removed** — the current, simpler system is single-column. Do **not** recreate those unless you
> specifically want a right rail.

---

## 3. Step 2 — The hidden `/sessions-feed` page (the machine feed)

This is the crux of the auto-rotation. Create a normal page (slug `sessions-feed`, keep it out of
nav; it's ugly on purpose) containing **one Collection List** bound to `Sessions`:

- **Sort:** `published` DESC. **Limit:** ~40 (enough to cover any batch window).
- No date filter on the list itself — filtering happens client-side so the same feed serves every
  consumer.
- Expose each field the filters need via **custom attributes** on the item and its children, so the
  HTML is parseable:
  - On each **Collection Item**: attribute `data-sf="row"`.
  - Inside it, a text element bound to Slug with `data-sf="slug"`; Title → `data-sf="title"`;
    Published → `data-sf="pub"`; Expire → `data-sf="exp"`; and the thumbnail `<img>` (bound to
    `thumbnail`).
- That's all it needs to render — it's a data source, not a designed page.

Every filter below does `fetch('/sessions-feed')`, parses `[data-sf="row"]`, reads the child
`[data-sf="…"]` fields, and filters by date. **Because it's same-origin, no CORS issues.**

---

## 4. Step 3 — The Sessions Template page (single column)

Create the CMS **Template page** for the Sessions collection. Bind fields to elements; the layout is
one column (max ≈1130px, the video width). Structure, top to bottom:

- **Hero:** logo, the **date** (bind to `published`), and a **video frame** containing:
  - a text/`div` holding the **`vimeo-id`** value (class `vf-vid`, kept but hidden), and
  - the **poster** `<img>` bound to `thumbnail` (class `video-poster`).
  The bundle turns this into a click-to-play Vimeo facade (§5).
- **Share bar** — static share buttons (Facebook/X/LinkedIn/email/copy). The bundle wires them.
- **Caption** (bind `caption`) + **Secondary caption** (bind `secondary-caption`).
- **Inline banner** (optional) — image bound to `inline-banner-image`, linked to `inline-banner-url`.
- **Comments** — a container the bundle lazy-mounts a comments widget into (optional).
- **"Expiring Soon" strip** — a **Collection List bound to Sessions** (this is the on-template feed).
  Give its list wrapper a hook the bundle can find (e.g. `.xsoon-row` with the items in a
  `[role=list]`). The bundle re-renders it from `/sessions-feed` filtered to live posts (§5, item 6).
- **Sticky CTA** (optional) — a pinned strip bound to `sticky-banner-image`/`sticky-url` +
  `sticky-button-copy`/`sticky-button-color`.
- Footer.

Add a **marker class on the page body/wrapper** (the original uses `.post-layout`) — the bundle uses
its presence to know it's on a session page.

**Brand decoration to add or skip:** the original also has a "wall of magazine covers" parallax and
a founder-bio block — these are pure DH branding. Replace with your own hero art or omit.

---

## 5. Step 4 — The behaviors bundle (`sessions.js`)

One self-contained **vanilla JS** file (no jQuery/Webflow-IX dependency). Start from the reference
`dd-sessions.js` and strip brand bits. Structure:

```js
(function () {
  if (window.__sessInit) return;
  if (!document.querySelector('.post-layout')) return;   // guard: session pages only
  window.__sessInit = true;
  // ... sections below ...
})();
```

Behaviors to include (each is a small IIFE):

1. **LCP hint** — set the poster `<img>` to `fetchpriority="high"` + `loading="eager"`.
2. **Reveal on scroll** — add a class to hero/content blocks; IntersectionObserver adds an `in`
   class. (Keep the selector list tight — only elements that exist.)
3. **Video facade** — on click of the video frame, read the `vimeo-id`, build
   `<iframe src="https://player.vimeo.com/video/{id}?autoplay=1">`, and replace the poster. Set
   `cursor:pointer` on the whole frame so it reads as clickable before load (inject via CSS).
4. **Share bar** — wire each button to the correct share URL for the current page.
5. **Sticky CTA** anti-flash (only if you use a beacon/CTA image) — hide until loaded.
6. **"Expiring Soon" feed** — `fetch('/sessions-feed')`, parse `[data-sf]`, keep rows where
   `pub ≤ now < exp` and `slug !== current`, sort by `pub` DESC, render the newest 1–2 as cards into
   the strip. **Empty-state matters** (see the lesson in §6): if nothing is live, fall back to
   showing the most-recent post(s) rather than leaving dead placeholders.
7. **Masthead date** — reformat the bound date to "Weekday, Month D, YYYY" (compute the weekday from
   the date so it's always right).
8. **Comments** — lazy-mount a third-party comments embed on first user engagement
   (scroll/tap/key) or when it scrolls into view — keeps third-party JS off the initial load.

**Masonry lesson (if you build a tiled image wall):** use CSS grid with `grid-auto-flow: dense`, and
make sure enough tiles stay 1×1 "standard" so `dense` can backfill the holes that tall/wide tiles
create. A fixed count of special tiles breaks on small (mobile) tile counts — **scale the number of
special tiles to the pool size** (≈60% special / 40% standard).

---

## 6. Step 5 — Cross-page "latest/expiring" strips (Welcome/Expired/etc.)

Any *other* page that shows a sessions strip uses the same feed with a tiny footer script. Because
you can't write `<script>` to page freeform via the API (406), either (a) put this in that page's
**Designer footer custom code**, or (b) fold it into the site-wide bundle guarded to that page.

```html
<script>
(function () {
  if (window.__feedSynced) return; window.__feedSynced = true;
  var M = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  function pd(s){ if(!s) return null; var d=new Date(String(s).trim()); return isNaN(d)?null:d; }
  function fmt(d){ return d ? (M[d.getMonth()]+' '+d.getDate()+' · '+d.getFullYear()) : ''; }
  function esc(s){ return String(s==null?'':s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
  function card(s){ return '<a class="xp-session" href="/sessions/'+encodeURIComponent(s.slug)+'"><img src="'+esc(s.thumb)+'" alt="'+esc(s.title)+'" loading="lazy"><span class="xp-session-date">'+fmt(s.pub)+'</span></a>'; }
  fetch('/sessions-feed',{credentials:'same-origin'}).then(function(r){return r.ok?r.text():Promise.reject();}).then(function(html){
    var doc=new DOMParser().parseFromString(html,'text/html');
    var all=[].slice.call(doc.querySelectorAll('[data-sf="row"]')).map(function(r){
      function t(n){var e=r.querySelector('[data-sf="'+n+'"]');return e?e.textContent.trim():'';}
      var img=r.querySelector('img');
      return {slug:t('slug'), title:t('title'), thumb:img?img.getAttribute('src'):'', pub:pd(t('pub')), exp:pd(t('exp'))};
    }).filter(function(s){return s.slug && s.thumb;});
    all.sort(function(a,b){return (b.pub?b.pub:0)-(a.pub?a.pub:0);});
    var now=Date.now();
    var live=all.filter(function(s){return (!s.pub||s.pub<=now)&&(!s.exp||s.exp>now);});
    // EMPTY-STATE LESSON: if nothing is currently live (a gap in publishing), fall back to the
    // most-recent posts instead of leaving stale/hidden placeholder cards. Do NOT just `if(live.length)`.
    var show = live.length ? live : all.slice(0, 2);
    var box = document.querySelector('[data-xp-list]');   // your strip container
    if (box && show.length) box.innerHTML = show.slice(0,2).map(card).join('');
  }).catch(function(){});
})();
</script>
```

**This empty-state handling is the one real bug we hit:** the original cross-page feed used
`if (live.length) {…}` and, during a multi-day gap with no new posts (everything expired), it left
the hardcoded placeholder cards showing — looking broken — while the on-template strip still showed
recent posts. The `show = live.length ? live : all.slice(0,2)` fallback fixes that. Decide per strip
whether "expiring soon" should ever show already-expired posts; if not, keep it strict and instead
render a graceful "no live sessions right now" message.

---

## 7. Step 6 — 72-hour page expiry (optional plugin)

The date filter above only controls the **feeds/lists**. To make the session's **own**
`/sessions/{slug}` page 404 (redirect to an "expired" page) after 72h, you need a plugin such as
**JetBoost** ("archive item on date") pointed at the `expire` field. Purchase + connect + configure
it, or skip it if you only need the feeds to rotate.

---

## 8. Step 7 — Deploy the behaviors bundle (exact flow)

1. Build `sessions.js`. Validate: `node --check sessions.js`.
2. `data_assets_tool → create_asset` `{ site_id, file_name: "sessions-v1.js", file_hash: <md5> }`.
3. POST the bytes to the returned presigned S3 form (multipart; `key` first, `file` last) → expect
   **HTTP 201**. Use the repo's `s3-upload.sh` helper.
4. Compute SRI: `sha384-` + base64 of `openssl dgst -sha384 -binary sessions.js`.
5. `data_scripts_tool → register_hosted_script` `{ display_name:"sessions", version:"1.0.0",
   hosted_location:<cdn url>, integrity_hash:<sri> }`. (Re-registering the same `display_name` with a
   bumped semver adds a version; that's how you update.)
6. `data_scripts_tool → set_site_scripts` `{ scripts:[{ id:"sessions", location:"footer",
   version:"1.0.0" }] }` — applied **site-wide**; the guard in §5 no-ops it elsewhere.
7. `data_sites_tool → publish_site` `{ publishToWebflowSubdomain:true }`. Verify on staging.

**To update later:** edit → new asset (`sessions-vN.js`) → register bumped version → `set_site_scripts`
to that version → publish.

---

## 9. Step 8 — Adding a session (intake)

1. Gather: name/title, `vimeo-id`, `caption`, `meta-description`, a 1280×720 poster, and a 1200×630
   social image. (If migrating from an existing source page, scrape those from it.)
2. Dates: pick a fixed reveal time — the original uses **13:00 UTC** on the post's label date
   (≈6am PT / 9am ET). `expire` = `published` + 72h. All UTC.
3. **Images — the WebP rule:** every image that renders **on the page** (thumbnail/poster, banners)
   → upload, then `data_assets_tool → compress_assets` to **webp**, poll `get_compression_task`, and
   re-point the CMS image field to the compressed copy. The **social-share (OG) image stays PNG/JPG**
   (a WebP OG can blank-preview on some link scrapers).
4. `create_collection_items` (remember: **`fieldData` is an ARRAY**), as a draft or live.
5. `publish_collection_items`, then a **full-site publish** so brand-new pages and the cross-page
   feeds refresh.
6. **Batch window:** you can safely load up to ~30 days ahead in one batch; each post reveals on its
   day and drops after 72h with no further clicks. Keep batches ≤ ~30 days so the earliest upcoming
   post isn't pushed out of the feed's ~40-item limit.
7. **Publishing cadence matters:** if no new post has been live within the last 72h, every feed is
   legitimately empty — that's not a bug (see §6). Keep the cadence, or rely on the empty-state
   fallback.

---

## 10. Brand-strip checklist (what's DH-specific vs. reusable)

**Keep (the functionality):** the Sessions collection + fields (§2); the `/sessions-feed` page (§3);
the single-column template shape (§4); the behaviors bundle's video facade / share / date /
expiring-soon / comments logic (§5); the cross-page feed snippet + empty-state (§6); the deploy flow
(§8); the intake rules (§9); every "hard-won API fact" (§1).

**Replace or drop (DH branding):**
- Logo, fonts, colors, and all copy.
- The "wall of SUCCESS magazine covers" parallax and the founder-bio ("The Vantage") block.
- Any Journal / product plug injected into the share bar.
- The HubSpot Smart-CTA fields and beacon anti-flash (unless you use HubSpot).
- The "72h / No exceptions" framing copy — the 72h mechanic is reusable, the wording is brand voice.

---

### TL;DR for the executing chat
Build the collection (§2) → the hidden feed page (§3) → the template (§4) → the behaviors bundle and
deploy it site-wide-but-guarded (§5, §8) → add the cross-page strips with the empty-state fallback
(§6) → optionally JetBoost for real page expiry (§7). Then add sessions per §9. Mind every item in
§1 — the 406/404/400 quirks and the "fieldData is an array" / WebP rules are where time gets lost.
