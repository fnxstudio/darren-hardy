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

`ddod-player-v7.js` is uploaded as a **site asset** and loaded with `defer`:

```
https://cdn.prod.website-files.com/6a66d7a6f9d116b514a13ae1/6a9ca87422df5cbebecc28e1_ddod-player-v7.js
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
| `ddod-artwork-116.webp` | 4.6 KB | thumbnails: playlist cards, sticky bar, episode rows |
| `ddod-player-v7.js` | 19.6 KB | |

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

## Second revision

- **Four full-image cards in the wall**, one every third card, 300px wide and stretching
  to the row height so they always match the text cards exactly (verified 312px each).
  Photo, gradient scrim, gold stars, a 3-5 word quote, the person's name and their source.
- **Every quote on those cards is an exact slice of that person's own testimonial** on the
  DD home page, the same rule the Apple highlights follow. Nobody's face carries words
  they did not say. Their line reads "DarrenDaily member", which is true; no company or
  job title was invented for them.
- **Text cards now carry "Apple Podcasts listener"** under the handle, so an anonymous
  handle like "Crayon2" reads as what it is.
- **Category labels use the brand device** — an 18x2 red pip plus tracked caps, the same
  language as every section eyebrow. They were a bordered pill, which read as generic.
- **A round red play button on every playlist card**, matching the hero play button.
- **Thumbnails now use a 116px file** (4.6 KB) instead of reusing the 760px hero cover.
  No bandwidth change (the hero file was cached) but the playlist cards, sticky bar and
  episode rows were each decoding a 577,600-pixel image for a 48-58px slot; now 13,456.
- **The host photo fills the full height of its column** rather than floating as a fixed
  ratio card: 387x504, exactly the row height, 29% of the width.

### Copy corrections in the reviews

Brand name and clear typos were normalised, in the same spirit as the source's
"punctuation only lightly normalised" note. Every highlight was re-checked afterwards
and is still an exact slice of its own body.

| Reviewer | Was | Now |
|---|---|---|
| Justin Woodbury | "Darren Daily" | "DarrenDaily" |
| Justin Woodbury | "good enough- as" | "good enough, as" |
| Lavishlyloved | "just Day to day" | "just day to day" |
| Flor!! | "#bettereveyday" | "#BetterEveryDay" |
| jamesdean77 | "playing revelry" | "playing reveille" |
| MaxStrength Fitness | "Darren Daily" (body + highlight) | "DarrenDaily" |
| TrentJNeisen | "excellent l and" | "excellent and" |

### Why the reviews are Apple-only

Checked for a second written-review source and there is not one to pull from:
Podchaser has no reviews for this show, and Podbay returns "No reviews yet" with a
"REVIEWS VIA APPLE PODCASTS" header, which is the pattern across the aggregators
(Podbay, Chartable, Listen Notes syndicate Apple's reviews rather than hosting their
own). Spotify publishes aggregate ratings only, never review text. So a second logo
would mean either re-badging the same Apple reviews or inventing them.

The wall gets its diversity a different way instead: four of the sixteen cards are
DarrenDaily members quoting their own words, not Apple reviewers. If a genuinely
separate source is wanted, YouTube comments on the DD channel are real, public and
attributable, and could be added as a third card type.

## Third revision

Section order is now hero, stats band, review wall, playlists, join, host, close.

- **Review wall: 9 tiles per row, 6 member cards.** Eight per row broke the "every
  third tile" rhythm at the loop seam (you got four text cards in a row); nine makes
  the pattern survive the clone. A woman leads each row.
- **Member card quotes** are smaller, sentence case, in real quote marks, and the
  photo scrim is lighter so faces read.
- **Playlist callout** is a short black tab overlapping the card's top edge. It was a
  pale pill, then a wide red banner; both read as generic.
- **Round red play button** on every playlist card, and the first playlist opens on
  load (without scrolling the page) so the shelf is never empty.
- **Hero**: the 5/5/0 trio is gone so the featured player comes sooner, the player
  carries an episode teaser, and a centred bobbing scroll cue closes the section and
  links to the playlists, matching /welcome and /404.
- **Stats band**: labels bottom-aligned so they sit on one line while the gold 10M+
  grows upward; rating shows 4.9/5 with a gold star; count-up handles decimals and
  suffixes; the listens figure pulses once counted.
- **Host photo** is absolutely positioned flush to the section's left edge, full
  height, 36% wide.
- **Close** adopts the home page's "If you're still reading / You're one of us."
  Its lead was corrected: an earlier draft implied the opt-in delivers *today's
  episode*, which it does not. The email is the mentoring session itself, sent ahead
  of the feed, plus extras that never reach the podcast. The podcast is the replay.

### Two bugs from the same root cause

The builder **drops any class it has no style for**. Twice this shipped an element
with `class=""` and CSS that matched nothing:

- `ddod-nav-cta-long` was never created, so the mobile rule to hide the long label
  never applied and the button showed "Get DarrenDaily Join Free" at once.
- `dd-drawer-form` was never created, so the whole opt-in form rendered with raw
  browser styling. The embed now targets **`#ddJoinForm`** instead, since the id is
  guaranteed.

**Rule: if you reference a class from the page embed, make sure the builder was given
CSS for it, or target an id.**

### Verification note

`IntersectionObserver` never fires in the headless preview used here, even with the
element fully in view, so the count-up could not be confirmed visually. The script now
also runs on first scroll and on a 2.5s timeout, so it does not depend on the observer.

## Fourth revision

- **Playlists stay cards, not tabs.** A card carries the category, the one-line
  description, the runtime and a play button, which is what someone needs to choose a
  playlist they have never heard of; a tab reduces that to a bare title, and six
  titles this long would wrap or need horizontal scroll on mobile. The real friction
  was that the open list appeared below the *whole* grid, detached from the card that
  was clicked. It is now injected into the grid directly under the row you clicked
  (column count is read at runtime, so it follows the 3 / 2 / 1 breakpoints).
- **The hero cue no longer reuses `dd-cue-*`.** Those classes are styled for the dark
  heroes on /welcome and /404, so on this light hero they rendered as a grey filled
  circle with a text shadow. It now has its own `ddod-cue-*` classes: quiet grey caps
  and a bare red chevron that bobs, no circle, no shadow.
- **The close has one button**, "Get tomorrow's session first", since the lead now
  sells the membership rather than the episode. The play CTA was redundant with the
  hero player and the six play buttons above it.
- **The bio copy was invisible on desktop.** Anchoring the photo with
  `position:absolute` took it out of the grid flow, so the text fell into column 1
  *underneath* it. `ddod-about-text` had also been dropped (the same missing-class
  bug), so there was nothing to target. The class now exists and pins the bio to
  column 2, reverting to column 1 when the section stacks.

**That is now four elements lost to the same cause** (`ddod-nav-cta-long`,
`dd-drawer-form`, `ddod-about-text`, and suffixed duplicates on `ddod-cue`).
When rebuilding a section: pass CSS for every class in the markup, and re-query
afterwards for `-1` suffixes.

## Still open
- The episode and playlist data is baked into the script. `DarrenDaily/refresh-ddod-data.py`
  checks the source page's copy of it against the live feed; it has not been pointed
  at this build.
- **Podcast app badges: decided.** Keeping uniform chips carrying each platform's real
  brand mark in its real colour, rather than the official "Listen on" badge lockups,
  which come in six different shapes and colours and would be the only borrowed visual
  language on the page. Marks are 24px (22px under 480). The row is a
  `repeat(3, max-content)` grid, not flex-wrap, so it always breaks 3+3 and never
  orphans a single chip on its own line (flex-wrap gave 5+1 at 760px).
- **Audio costs no Webflow bandwidth.** `traffic.libsyn.com` 302s to signed CloudFront
  (`content.libsyn.com`), so Libsyn serves every byte and the listens count in Libsyn's
  stats. Nothing audio-related is stored on or served from Webflow.
- `home-nstat*` (home's dark stat band) and `ddod-bstat*` do the same job under two
  names. A later pass could fold them into one `dd-stat-*` set; not done here because
  it means re-pointing 19 live elements on home.
