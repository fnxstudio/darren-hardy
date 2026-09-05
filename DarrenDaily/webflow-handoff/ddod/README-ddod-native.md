# /darrendaily-on-demand — native Webflow rebuild

Live: https://darrendaily.webflow.io/darrendaily-on-demand — page `6a9c8ddf22df5cbebec33467`

A **redo**, not a port. The source was `DarrenDaily/darrendaily-on-demand.html`
(a standalone page, 40 KB CSS + 47 KB JS). Nothing was copied pixel-for-pixel:
the page was rebuilt on the site's own design system, and the copy and section
lineup were re-judged.

## What changed from the source page

| Decision | Why |
|---|---|
| **"The Room" band cut** | Nine member faces with no quotes, sitting next to the Apple review wall. The wall says the same thing with words attached to names, which is stronger. |
| **"Why It Works" folded into the hero** | Its 5 min / 5 a week / 0 ads trio restated the hero's own promise. It is now three facts under the hero lead, and the page lost a full scroll. |
| **Review wall trimmed 30 -> 12** | The "4.9 across 1,709 ratings" line carries the volume; 30 cards was scroll for its own sake. The 12 kept were chosen for variety of voice and use case. |
| **Nav is new** | DD colour logo + an "On-Demand" tag + one CTA. No section links, so there is a single conversion path and no mobile nav to maintain. |
| **"Runs" renamed "Playlists"** | User-facing copy and the class system both. `ddod-run*` -> `ddod-pl*`. The only "run" left on the page is "You run a team", which is ordinary English, not the feature name. |
| **Each playlist carries a category chip** | Leadership, Business, Productivity, Resilience, Mindset, Influence. |
| **Footer is the shared Site Footer component** | Per instruction. The source page had its own footer; that is gone. |

## Built on the shared system

Reused as-is: `dd-page`, `dd-main`, `dd-container`, `dd-eyebrow` (+ `-dark`,
`-center`, `-pip`, `-pip-bright`), `dd-key-b`, `dd-btn` (+ `-ondark`, `-arrow`),
`dd-btn-line`, `dd-sec-head`, `dd-sec-title`, `dd-sec-lead`.

**Three classes were promoted** from `home-*` to `dd-*` during this build, per the
convention in `DESIGN-SYSTEM.md` ("promote the moment a second page needs one"):
`home-sec-head` -> `dd-sec-head`, `home-sec-title` -> `dd-sec-title`,
`home-sec-lead` -> `dd-sec-lead`, plus the combo `home-sec-head-filter` ->
`dd-sec-head-tight`. All five home elements followed the rename; home was
re-verified afterwards.

**Two new shared combos:** `dd-sec-title-ondark`, `dd-sec-lead-ondark`.

Everything else is `ddod-*`. The one deliberate exception is the drawer, built as
**`dd-drawer-*`** rather than `ddod-*` — see below.

## The opt-in drawer is shared on purpose

`dd-drawer`, `dd-drawer-overlay`, `-close`, `-head`, `-title`, `-from`, `-face`,
`-from-p`, `-from-b`, `-body`, `-form`, `-fine`, `-fine-link`.

It is named `dd-` because it is meant to replace the **dead join modal** on /404
(`dd-optin-modal-v3.js` points at HubSpot form `e74fd54c-…`, which 404s and renders
nothing). This drawer uses the **live** form `41958dbb-3c3a-439b-b747-bb96acf50680`
— verified rendering with firstname, email, company_role and the hidden
`dd_id` / `mrt` / UTM fields.

HubSpot's script is **not loaded on page load**. It is fetched the first time
someone opens the drawer, once, no matter how many times it is reopened.

Any element with `data-open-drawer` opens it. Escape and overlay-click close it,
focus is moved in and handed back, Tab is trapped, and body scroll is locked.

## The player

Sections are native Webflow elements; only the behaviour is scripted.

- **Featured episode** plays inline from the hero, with its own progress bar.
- **Six curated playlists**, 8 episodes each, 43 to 53 minutes. Tapping a card
  expands its episode list and makes that playlist the queue, so it plays straight
  through. **Every episode row carries the show cover**, the way a podcast app lists
  them; it is the same file the hero already loaded, so each row after the first is a
  cache hit and costs nothing on the wire.
- **Sticky bar** with scrub, back 15, forward 30, and close. Hidden until something
  is playing — verified that a true first visit never shows it.
- **Resume** from `localStorage`, armed but never autoplaying.

Audio streams from `traffic.libsyn.com`, which 302s to signed CloudFront and
supports range requests (verified 206 + `accept-ranges: bytes`), which is what makes
the scrubber work. No audio is stored in Webflow.

## Where the code lives

`ddod-player-v2.js` is uploaded as a **site asset** and loaded with `defer`:

```
https://cdn.prod.website-files.com/6a66d7a6f9d116b514a13ae1/6a9c994f1ba891a427d5f34f_ddod-player-v2.js
```

19.6 KB, of which ~6.9 KB is the episode and playlist data and ~2.6 KB the podcast
app brand marks. Hosting it rather than
inlining keeps the page HTML at 36 KB and lets the script cache across visits.
To change it: edit the copy in this folder, upload a **new** `-v2` asset, and
repoint the `<script src>` in the page embed. Do not edit the asset in place.

The page embed holds only what a Designer class cannot express: hover states,
`.is-on` / `.is-open` state classes, the episode rows the player injects, and the
exact 980 / 760 / 560 breakpoints scoped to `.dd-page`.

## Assets added

| File | Size | Note |
|---|---|---|
| `ddod-artwork-760.webp` | 49.7 KB | was 900px/84 KB; renders 380 max |
| `dh-face-104.webp` | 3.7 KB | was 520px/37 KB; renders 52x52 |
| `dh-covers-600.webp` | 59.2 KB | 4:5 portrait crop of the covers wall, for the host section |
| `ddod-player-v2.js` | 19.6 KB | |

Everything else was already on the CDN: the eight media logos, `hero-chair.webp`,
and `dd-logo-color-286.webp`.

## Verified

Desktop 1440: hero 2-col, band 4-col, runs 3-col, wall 3-col, join and about 2-col,
**footer 416px — the pixel-matched height**. Mobile 342: everything single column.
Run expand and collapse, drawer open/close/Escape/scroll-lock, lazy HubSpot mount,
form fields, audio URLs, and first-visit sticky state all checked live.

Copy rules: no em dashes, no "buy" or "purchase", no "catch". Every review is a real
Apple Podcasts review and every highlight is an exact slice of its own body, so a
highlight cannot misquote.

## Revision, same day

- **Podcast app brand marks** are injected by the script next to each app name, so the
  row is recognisable at a glance. They are inline SVG in the script, not six more
  image requests.
- **Four subscribe URLs were wrong and are now correct.** The first build invented
  Apple, Spotify, iHeart, Amazon and RSS URLs; the real ones were sitting in the source
  page all along. All six now verified 200, and the Libsyn RSS feed parses.
- **The review wall scrolls**, matching the source: two rows, opposite directions,
  78s and 92s, paused on hover, and reduced to a normal scroll container under
  `prefers-reduced-motion`. The 12 cards stay native and editable in the Designer; the
  script clones each row once so the -50% translate loops seamlessly, and the clones
  are `aria-hidden`.
- **Your Host** now uses `dh-covers-600.webp`, a 4:5 portrait crop of Darren in front
  of the SUCCESS covers wall, at **29% of the row** rather than the half-width slab it
  was. Cropping it small also fixes the old complaint that `dh-covers.webp` was
  undersized: at 387x483 the 600x750 source is 1.55x density.
- **The credibility logos are a 4-column grid**, so they always form two equal rows of
  four with no orphan, at every width down to mobile.

## Still open
- The episode and playlist data is baked into the script. `DarrenDaily/refresh-ddod-data.py`
  checks the source page's copy of it against the live feed; it has not been pointed
  at this build.
- **Audio costs no Webflow bandwidth.** `traffic.libsyn.com` 302s to signed CloudFront
  (`content.libsyn.com`), so Libsyn serves every byte and the listens count in Libsyn's
  stats. Nothing audio-related is stored on or served from Webflow.
- `home-nstat*` (home's dark stat band) and `ddod-bstat*` do the same job under two
  names. A later pass could fold them into one `dd-stat-*` set; not done here because
  it means re-pointing 19 live elements on home.
