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

`ddod-player-v10.js` is uploaded as a **site asset** and loaded with `defer`:

```
https://cdn.prod.website-files.com/6a66d7a6f9d116b514a13ae1/6a9cc606af8f1544fe1862b8_ddod-player-v10.js
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
| `ddod-player-v10.js` | 19.6 KB | |

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

## Play glyphs are SVG, not characters

`\u25B6` BLACK RIGHT-POINTING TRIANGLE carries an emoji presentation, and iOS renders
it as the colour emoji everywhere it appears. All eight play buttons (hero, six
playlist cards, sticky bar) and the pause state now use inline SVG injected by the
script. `font-size:0` on the glyph containers hides the raw character until the
script runs, so there is no emoji flash on first paint.

Audited the rest of the page for the same trap. `\u2605` BLACK STAR (96 of them),
`\u2715`, `\u2192` and `\u2197` are all text-presentation by default and safe;
`\u2B50` is the emoji star and is not used. The only other risky glyph is the `\u00A9`
in the shared Site Footer, which renders as text unqualified and is left alone since
it is site-wide.

## Fifth revision

- **Episode rows carry the full record**: cover, date, title, the episode's own blurb,
  the exact runtime and a round red play button, with a tinted active state. The
  descriptions were in the source data all along; the first build dropped them, so the
  script data grew from 6.9 KB to 11.7 KB to carry them back.
  Runtimes stay **exact** (`5:19`), not rounded to "5 min".
- **Stats band is three up**: episodes, 12M+ listens in the middle, 4.9/5. The
  350,000 figure came out; it still appears in the playlists lead and the closing copy.
- **The hero rating is an overlay card** on the cover art rather than a caption under
  it. Placed at 46% height hanging off the left edge, which is measured to clear the
  artwork's own lockup: the ON-DEMAND mark occupies y=8-28% and the DARRENDAILY banner
  y=70-92%, leaving y=32-68% free. It reverts to a centred card under the cover when
  the hero stacks, since a 280px cover has no room for an overhang.
- **Subscribe row** reads "Subscribe on", centred, with larger chips.
- **Review wall** leads with gold stars instead of the eyebrow pip, and the headline is
  "What listeners like you are saying".
- **The drawer leaves a 52px sliver** of the page visible rather than covering the
  screen, and the overlay carries a 7px backdrop blur. Done with
  `max-width: calc(100vw - 52px)` on the base class, so it needs no breakpoint rule and
  the existing `width:100%` mobile rule resolves against it correctly.

## Sixth revision

- **Full player transport**: previous, back 15, play, forward 30, next, and a playback
  speed control cycling 1x / 1.25x / 1.5x / 2x. The skip icons are circular arrows with
  the number inside, drawn as SVG (rendered and eyeballed before shipping rather than
  written blind). Previous restarts the current episode if more than 3 seconds in,
  which is how every podcast app behaves; next greys out at the end of a playlist.
- **Close moved to the bar's top right corner**, out of the control row.
- **The whole transport stays on mobile.** The bar wraps to two lines below 700px, art
  and title on the first, controls centred on the second. Verified 6/6 buttons visible
  and no overflow at 980 / 760 / 560 / 390.
- **Hero cover fills its column**: 380px cap removed, now 490px on desktop and 440px
  stacked (was 280).
- **Host photo is half the section** and back on the full-width `dh-covers.webp`
  source rather than the portrait crop, so the magazine wall shows on both sides.
  Height unchanged.

**Resolution note:** the host photo is now a 720x739 box fed by a 1200x750 source, so
it is upscaled slightly on the vertical. A taller original would fix it; this is the
same undersized-source issue flagged in the first image audit.

## Still open
- The episode and playlist data is baked into the script. `DarrenDaily/refresh-ddod-data.py`
  checks the source page's copy of it against the live feed; it has not been pointed
  at this build.
- **"Get started with the most popular playlists"** is the wording on the hero cue,
  set 2026-09-05 at the
  client's instruction. Worth knowing that the six playlists were **hand-curated**, not
  chosen by play count, and no play-count data was available to this build. If real
  numbers exist, the claim is safe; if not, "curated" is the defensible word.
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

## Episode rows show episode numbers, not dates (v11)

The eyebrow line above each episode title used to be the air date (`MAR 19, 2026`).
It now reads `Episode 1582`. The number is not scraped from anywhere at runtime: it
is a **sixth field on each `EPS` row**, derived once from the mp3 filename
(`DDOD_Episode1582_mixdown.mp3`) and cross-checked against the source page's own id
field. All 49 curated episodes have one, they range 684-2027, and no filename and id
disagreed.

`EPS` rows are now `[title, date, seconds, file, description, episodeNumber]`. The
date field is deliberately **kept** even though nothing renders it - it is what
`refresh-ddod-data.py` matches on, and it is the only record of when an episode
aired.

`prettyDate()` and the `MONTHS` array were removed with the date line. The class is
still called `.ddod-ep-date`; renaming it would have meant re-pointing every row the
player renders for no visual gain.

## Featured episode card

The hero's featured episode uses the **same layout as the playlist cards**: a black
category tab overhanging the top-left corner, the show cover, then title,
description and a red uppercase meta line, with the round red play button at the
right edge. The scrub bar is a 3px hairline pinned to the card's bottom edge rather
than a bar in the flow, so the card keeps the playlist card's proportions.

The cover is `ddod-artwork-116.webp` - the same file the playlist cards use, so it
costs nothing extra on the wire. It renders into a 76px box (62px on small), so it
is ~1.5x, not 2x. The 760px artwork was not used: a 760px decode into a 76px box is
wasted CPU on the LCP screen for detail nobody can see at that size.

`.ddod-player-row` is gone - the card is now a flex row itself. The player script was
not touched by this change: it only ever addressed `#heroPlay`, `#heroBar` and
`#heroFill` by id, never by structure.

## Cleanup audit, 2026-09-06

Run after the edit rounds above. Method: fetch every published page (all 8 plus
one Sessions CMS detail page), extract every class in the markup, and diff that
against all 578 site styles - then re-check each miss against the page embeds
and the hosted player, so classes that only ever exist at runtime are not
mistaken for orphans.

**Deleted, 7 classes**, each verified at zero occurrences across every page and
the player script:

| class | what it was |
|---|---|
| `ddod-facts`, `ddod-fact`, `ddod-fact-n`, `ddod-fact-l` | the original hero facts strip, replaced by the stats band |
| `ddod-pl-cat-pip` | a red pip from an early category-callout design |
| `ddod-pl-link` | a text link on the playlist cards, replaced by the whole card being clickable |
| `ddod-sk-x` | superseded by the sticky player's close button class |

**Deleted, 13 assets**: `ddod-player-v1` through `v10` plus `v12` and `v13`
(v11 is live), and `dh-covers-600.webp`, which was uploaded for the host section
and then abandoned when the full-height photo replaced it.

Result: published body markup **byte-identical**, site stylesheet **968 bytes
smaller**, no JS errors, playlists/player/drawer all verified working.

### Two traps in this audit

1. **Thirteen embed CSS selectors look dead and are not.** `.ddod-ep*`,
   `.ddod-ico`, `.ddod-pl-head*`, `.ddod-pl-close` and `.ddod-sub-ico` never
   appear in page markup because the player injects them at runtime. Always
   check the script before deleting a class that the embed styles.
2. **Unreferenced does not mean unused, for assets.** The audit also flags ~45
   non-DDOD assets, and the `dd-31xx-*` banner images among them are almost
   certainly live CMS content reached from collection item fields, not page
   markup. They were left alone. Only assets whose whole lifecycle is known
   should be deleted on this evidence.

### Left alone, and why

- 12 site-wide orphan classes (`ondark`, `dd-sec-lead-ondark`,
  `home-sec-head-filter`, `f-footer-col-a-hover`, `dd-footer-*-hover`,
  `Utility Page Wrap/Content`, `_w-input`, `post-caption-secondary`,
  `ss-card-img`, `ss-date`). Not this page. The `Utility Page *` and `_w-input`
  entries are Webflow system styles and are not deletable anyway.
- 18 superseded `ddsessions` registered-script versions and the dormant
  `sidebarcardtypes`. Registered scripts only load where applied, so these cost
  nothing at runtime.
- ~45 non-DDOD assets: old `dd-home-v9..v17`, `dd-welcome`, `dd-expired` and
  champion loader bundles from the pre-native era, plus the CMS images above.

The DDOD page itself carries **no registered scripts and no freeform page
custom code** - everything is the single embed plus the hosted player.

## The nav: bar always, button on scroll

`Site Nav DDOD` paints from the first frame so the hero never looks headless.
Only the **CTA** is held back: it rests hidden on `.ddod-nav-cta` (a Designer
class, so the state is visible there) and reveals when the script puts `.is-on`
on the nav past **24px** of scroll, the same threshold the rest of the site uses
to flip `.dd-nav` solid.

It got there the long way. The whole bar was hidden on scroll first, which made
the hero read as broken; then the button was removed entirely, which left no
opt-in above the fold. Bar always, button on scroll is the version that holds.

`visibility` is toggled with `opacity` so the hidden button is out of the tab
order, and there is **no `requestAnimationFrame` throttle** on the scroll
handler: a rAF that never fires (a background tab) would latch the queued flag
and kill the toggle for the session.

**No second nav component.** `Site Nav DDOD` is used on this page only.

## The playlist panel is a real tab

Clicking a card opens its panel inside the card grid, spanning every column,
directly under the row that was clicked, so the other playlists stay in view and
clicking another switches the panel.

The **connection** is the fiddly part and should not be "tidied":

- the grid puts 20px of row-gap between the cards and the panel, so the panel
  cancels it with `margin-top:-20px` and lands flush against the card row;
- the active card drops its bottom radii, paints its bottom border white and
  pulls down `margin-bottom:-1px`, so it sits ON the panel's top border and the
  two shapes read as one tab.

Episode rows are a divided list **inside** the panel, not cards of their own -
bordered cards inside a bordered panel is what made this read as a dropped list.
The close control is a bordered pill with a `U+00D7` glyph (text-presentation,
so no iOS emoji swap), not a bare word.

## The transport arrives late, and primed

The sticky player stays off screen until the listener has **chosen** something,
or has **scrolled past the playlists** without choosing - at which point it
primes itself with the featured episode, paused, so there is a one-tap way back
in. Closing it with the X opts out until the next real selection
(`stickyDismissed`).

Revealing is deliberately tied to intent, not to loading: the
resume-where-you-stopped path calls `load(file,false)` and stays hidden.

## The closing section sits on the home hero

`.ddod-final` carries the home page's `hero-garden` photo under a **90% white
wash** (a flat `linear-gradient` layered over the image, so no extra element and
no z-index fight), cropped `70% top` at the same section height as before, which
keeps Darren's head in frame - at cover scale his head lands 45px down of an
804px render, so a centred crop would have taken it off. The 820w file is
swapped in below 767px.

**Gotcha:** writing a `breakpoint_id` variant of a style silently dropped
`background-position` from the base. Re-read the style after any breakpoint
write and restore what vanished.

## Copy changes

- playlists headline -> **"The playlists you actually need"**, red on the payoff
  phrase, matching the hero and reviews headlines. 31 characters; 25 is the
  one-line ceiling at 82px in this container, so it wraps to two like the
  reviews headline does.
- hero cue -> "Get started with these popular playlists". This also retires the
  unverified "most popular" claim: the playlists are hand-curated, not
  play-count ranked.

## Only one thing on this page pulses

The featured episode's play button uses the hardybmc.com VSL treatment - a
gentle scale on the button plus an expanding ring behind it - in DD red, with
the ring scaled for a 52px target rather than 108px. Hover switches to a glow
because a transform would fight the scale animation.

It is scoped to `.ddod-play`, which exists exactly once. The playlist cards'
`.ddod-pl-play` and the episode rows' `.ddod-ep-play` are deliberately left
alone: a page that pulses in fourteen places pulses nowhere.

## Verifying any of this in a hidden browser pane

The pane freezes more than it looks like. In a hidden pane
(`document.visibilityState === 'hidden'`):

- `window.scrollTo()` fires **no scroll event** - dispatch `new Event('scroll')`;
- `requestAnimationFrame` **never fires**;
- CSS transitions are frozen at `currentTime: 0`, so any **transitioned**
  property reads its start value forever. This one cost real time: `.ddod-pl`
  has `transition: border-color`, so the active card's border read grey no
  matter what, while `margin-bottom` and `border-radius` from the same rule read
  correctly. An inline style did not move it either. Call
  `el.getAnimations().forEach(a => a.finish())` before reading;
- screenshots come back blank.

When a computed value contradicts a rule you can see in `document.styleSheets`,
check whether the property is transitioned before hunting for a cascade bug.

## Hero: the rating sits above the cover

The 4.9/5 was a floating white card overhanging the cover's bottom-left corner.
It never sat comfortably against the artwork, so it is now **plain centred type
directly above the cover**: stars, `4.9/5`, then the ratings count. No card, no
shadow, no absolute positioning - `.ddod-rate` is a static block with
`text-align:center` and a 26px bottom margin.

With the rating in the flow, the art column went back to being **vertically
centred** in the hero row (28px of space above and below at 1440), so the
`align-self:start` that used to line the cover up with the eyebrow is gone.

Removing the card also retired its `@media (max-width:980px)` override, which
existed only to un-float it when stacked and would otherwise have re-added a
shadow to something that is no longer a card.

The `/5` is a `<b>` sized in `em` so it tracks the number, at 42% like
`.ddod-bstat-of` in the stats band, but in a grey rather than the band's white.

## Tab depth

The playlist category tabs overhang the top-left corner of their card. They used
to sit **68% inside** it, which left 3px between the tab and the title and read
as crowding. They now sit **35% inside** - the bottom third, 12px of a 34px tab -
for a 15px gap to the title.

Note the featured episode card's `FEATURED EPISODE` label is still at the old
`top:-12px` / 68% geometry. It has not been flagged as a problem, but the two
tabs no longer match, so match them if that ever looks wrong.

## Later round of fixes

- **Rating order** is now number, stars, attribution.
- **Both tabs sit at one third.** `.ddod-player-label` was still at the old
  `top:-12px` / 68% while `.ddod-pl-cat` had moved; they now match at `-23px`.
- **Hero bottom padding** 104px -> 56px (84 -> 48 below 980), which was the
  entire gap between the scroll cue and the stats band.
- **Opening a tab no longer scrolls the page.** `openPlaylist` ended with
  `plList.scrollIntoView({block:'nearest'})`, which fired on every card click
  and read as a glitch - the panel already appears directly under the card you
  clicked. The `scroll` parameter went with it.
- **The panel head no longer repeats the playlist name.** The connected tab
  above already says it; the head is now just the close pill, pushed right with
  `justify-content:flex-end`. `.ddod-pl-head-t` was runtime-only, so it needed
  no style deletion, only removal from the embed CSS.

## Pushing the host right in the closing section

`background-position` could not do this. At any viewport wider than about
1.79x the section height, `cover` scales the photo by **width**, so there is
zero horizontal slack and position-x is inert - which is also why the original
`70% top` had been doing nothing on desktop all along.

The options were to zoom past `cover` (which breaks coverage at other widths,
since a percentage `background-size` is relative to width while the section's
height varies) or to change the source. **The source was re-cropped**: the
1600x893 photo trimmed to **1400x893** from the right edge, which moves his
face from 71% to 81% of the section without inventing a single pixel. Plain
`cover` still works at every width. `ddod-closer-1400.webp` (109KB) and
`ddod-closer-m.webp` (48KB) replaced the two `hero-garden` files.

**The `background-position` drop is reproducible.** Every `update_style` write
on `.ddod-final` dropped `background-position` from the base, not just the
breakpoint writes. Set it last, in its own call, and re-read.

## Mobile centring, measured

Checked after a report that the hero looked off-centre on a phone. Swept 390,
414, 430, 480, 497, 560, 640, 760, 860, 980 and 1024: the art column's left and
right gaps are **equal at every width**, the rating block is centred on the
cover at every width, and `document.scrollWidth` equals the viewport, so there
is no horizontal overflow. Nothing was changed.

### The empty panel bar

`closePlaylist()` empties `plList.innerHTML` but leaves the element in the
grid. Once the panel gained a border, a background and padding, that empty
element rendered as a thin red bar under the row.

Fixed with `.ddod-pl-list:empty { display: none }` - written as a **Designer
pseudo-state** (`data_style_tool` accepts `pseudo: "empty"`), not embed CSS, so
it stays visible and editable in the Designer and needed no script change. It
also kills the flash of an empty bordered bar between first paint and the
deferred script filling the panel on load.

### The card control was promising the wrong thing

A playlist card's round red button looked exactly like the transport buttons
elsewhere on the page, but clicking a card **opens a panel; it never starts
audio**. Two changes made it honest:

- The card's control is now an **outlined disclosure chevron** that rotates 180
  degrees and fills red when its tab is open. Hover tints it instead of
  scaling, because a scale would fight the rotation.
- **Play all** is a real, labelled control in the panel head, next to Close. It
  sets the playlist as the queue and starts episode one. The head had room for
  it because the redundant playlist title came out.

`.ddod-play` in the hero is now the only round red play button on the page, and
it is the only one that starts audio on click. That is the rule to keep.

One gotcha: `.ddod-ico { fill: currentColor }` is set for the filled triangles,
and CSS beats the SVG's own `fill="none"` attribute, so a stroked chevron
renders as a filled blob. `.ddod-pl-play-icon .ddod-ico` opts back out with
`fill: none`.

## The script moved out of the embed

The player `<script src>` now lives in the page's **footer custom code**, not in
the HTML embed. The embed is styles only. Bumping the player version used to
mean rewriting the whole 16KB CSS block; now it is a two-line edit in one small
field. Read/write it with `data_scripts_tool`'s
`get_page_freeform_code` / `set_page_freeform_code` (location `footer`).

Verified after the move that the published page carries **exactly one** script
tag - the danger being a stale tag left in the embed loading the player twice.

## Panel anchoring on resize

The panel's row anchor was computed once inside `openPlaylist` and never again,
so a panel opened at three columns stayed pinned to a row that no longer existed
at two: the tab seam stranded against the wrong card, with the active card's
white bottom edge left hanging over grey. Fresh loads at any width were always
correct; only a reflow broke it.

`placePanel()` is now its own function, called on open and again on a debounced
`resize`.

## The featured episode's next button

The featured episode belongs to no playlist, so `queue=[featured]` left next
disabled and autoplay with nothing to follow. `featuredQueue()` now puts it
ahead of the whole first playlist, so next goes to the first episode on the
page and autoplay carries into Leading People. `queueFor()` does the same
service for the resume path, restoring whichever playlist the saved episode
belongs to instead of a queue of one.

## Rating lockup

Score and stars share one baseline-aligned flex line (`4.9/5 ★★★★★`) with the
attribution forced to its own line by `flex-basis:100%`.

## A third hidden-pane trap

Already documented: no scroll events, no rAF, frozen transitions, blank
screenshots. Add **no `resize` events**. Emulating a viewport size reflows the
page but fires no `resize`, so a resize handler looks broken when it is fine.
Dispatch `new Event('resize')` by hand after changing the size.

Also worth knowing: setting `document.documentElement.style.width` does **not**
re-evaluate media queries, so it cannot be used to test breakpoint behaviour at
all. Only a real viewport change reflows the grid.

### The episode row pause icon was a lie

Clicking a row always ran `playAt()`, which re-set `audio.src` and restarted the
episode from zero - so the pause icon on the playing row did the one thing it
promised not to. A row that is already the loaded episode now toggles
play/pause and returns early.

## TCE audiobook offer: what is established

- **The audiobook form is `83c40a17-5190-48bf-b33c-23452ee4bd6e`** (portal
  2518645, region na1). Confirmed structurally, not guessed: on
  `tce.darrenhardy.com/free-audiobook` it targets
  `#hs_form_target_widget_1739784326084`, and that widget is the one rendered
  immediately below the `ACCESS THE AUDIO BOOK` heading. It redirects to
  `/resource-delivery`. The other form on that page, `1c62fd1d-...`, targets a
  different module and redirects to `/resources-invite`.
- Per the client, that form subscribes to DarrenDaily as well as delivering the
  audiobook, so it replaces the DD form on this page rather than sitting
  alongside it.
- **Cover art**: `ce-front-cover.webp`, 1100x1622, from the compound-effect
  page. Note the printed cover says "OVER 1 MILLION COPIES SOLD" (10th
  anniversary edition artwork) while the current claim everywhere else is 2M+.
  The copy uses 2M+; the artwork is what it is.
- The hardcover is deliberately NOT shown: the offer is the audio, so the mock
  is the cover on a phone.

## Review cards on phones

Sized twice, and the second size is the right one.

The first pass chased "two whole cards on a 375px screen" and landed at 172px.
That was the wrong trade: a **142px text column** ran the quotes to **412px
tall**, so the row got taller than the thing it was trying to fit.

They are now **224px with a 12px gap** below 560px - 30% wider - which gives a
**190px text column** and a **318px row**, 94px shorter. One full card plus most
of the next is still plainly a row that scrolls.

Text and image cards share one width (`.ddod-rv` and `.ddod-rvi` both 224px), so
the rhythm holds regardless of which type lands where; every third tile is an
image card, so a mismatch would be constantly visible. Padding and type stay
scaled down for the narrower column: 18/16/16 padding, 14px title, 12.5px body.

The 560-760px band is a uniform 230px, which is where the phone width was headed
anyway - the two are now within 6px of each other.

## The join section is now the audiobook offer

The whole section was replaced, not added to. The old "podcast is the replay"
headline, its lead and its four bullets are gone, along with the bordered
opt-in card. What is there now:

- **Left column**: eyebrow "Free for DarrenDaily members", headline "You've
  heard five minutes. **Take the whole book.**", two sentences, the button, the
  fine print.
- **Right column**: the phone mock, nothing else. No card, no border.

The copy leans on access and on getting *more*, because the playlists already
give visitors plenty of episodes for free. "Start tomorrow morning" is gone as
a CTA: it promised something the page already hands over.

`ddod-join-card`, `ddod-join-h3`, `ddod-join-p`, `ddod-join-list`,
`ddod-join-li` and `ddod-ab-flag` are now orphaned by this change and should go
in the next hygiene pass.

### The mock

Built rather than sourced: the real `ce-front-cover.webp` composited onto a
device drawn in PIL, with a player UI (AUDIOBOOK label, scrubber, transport).
700x1265, 39KB. `DarrenDaily/webflow-handoff/ddod/build-audiobook-mock.py` is
the generator.

**No headphones.** They were built and cut: drawn earbuds read as pale lollipops
on a stray wire and cheapened an otherwise clean asset. Add them only from a
real photo or licensed mockup.

**The cover art says "OVER 1 MILLION COPIES SOLD"** (10th anniversary printing)
while the copy claims two million, which is what the TCE page and
compound-effect.html both state. At render size the cover line is sub-pixel.

### The form is back on the DD opt-in

The audiobook form `83c40a17-...` works and does subscribe to DarrenDaily, but
it renders as a **cross-origin iframe**, so every `#ddJoinForm` rule in the
embed is dead against it and it sizes itself to about 238x150 inside the drawer.
Reverted to `41958dbb-...` at the client's direction; the backend will deliver
the audiobook instead. v22 is the parked build that mounts the audiobook form.

## The nav mark

`ON-DEMAND` is plain text with a pulsing record dot to its left, not a filled
red badge. The badge version shipped briefly and fought the red CTA button
sitting beside it: two solid red objects, one of them not clickable.

## Phone marquee speed

The review rows run 40% faster below 560px (66s / 77s against the desktop 92s /
108s). A narrow viewport shows so little of the row that the desktop pace reads
as stalled.

## Episode rows: three states, not two

`.is-current` means the row has been started. `.is-playing` means audio is
actually running. The artwork veil follows:

| state | artwork |
|---|---|
| never touched | plain cover |
| current, playing | red veil, animated equalizer |
| current, paused | red veil, white play triangle |

The eyebrow swaps `Episode NNNN` for **Now playing** on the current row and
restores the original from `data-rest` when another row takes over. Clicking the
artwork toggles, because the whole row toggles.

**Open question:** the eyebrow currently reads "Now playing" even while that row
is paused, since it keys off `.is-current`. Arguably it should revert while
paused. Left as is because the row IS the current one either way.

## Nothing is open on load

`openPlaylist(0)` on load is gone. The shelf reads as six closed tabs until a
card is picked, and `.ddod-pl-list:empty` keeps the panel out of the layout.

## Exit intent

Reuses the site-wide `dd-exit-*` system and its `.open` convention from /404, so
this popup matches every other DarrenDaily exit popup. Same rule set as
`session-exit-popup.html`:

- `sessionStorage`, `dd-exit-shown` and `dd-exit-dismissed`; once dismissed it
  stays gone for the session.
- **The corner X is the only dismiss.** No "No thanks" button, per the DD rule.
- Five triggers: pointer out through the top edge, first mobile back gesture
  (`history.pushState` + `popstate`), a fast upward flick after scrolling
  (>500px/s past 300px), 90% scroll depth, and 30s idle.
- Escape and a backdrop click also close it.

**It never fires while the opt-in drawer is open** - the visitor is already
doing the thing it would ask for. Its own CTA closes the popup and hands over to
the drawer.

**One rule deliberately not applied:** the DD popup body normally ends with
"No exceptions." That line belongs to the 72-hour expiry claim on the session
popups. This popup offers an audiobook, where the phrase would be meaningless,
so it is not forced.

## Bandwidth audit, 2026-09-06

Measured cold with curl (resource timing came back warm-cached and is not a
valid first-load figure). Same-origin assets: **545KB raw across 31 requests**,
but that counts all five favicons; a browser fetches one or two, so the real
figure is nearer **405KB**.

**Fixed:** the host photo was the shared `dh-covers.webp`, 1200px wide and
99.5KB, rendering into a **298px** box on this page (4x). It could not simply be
shrunk - `/` and `/404` render the same asset large and would have gone soft. A
page-specific `dh-covers-ddod-640.webp` (56.5KB) is now bound here only;
verified the other two pages still use the original and its srcset variants.
**43KB saved.**

**Still open, with measurements:**

| item | measured | note |
|---|---|---|
| favicons | **142KB across 5 PNGs**, the 512x512 alone is **99.9KB** | site settings, so it hits every page; a 512 icon should be 10-15KB. Not fixable through the API - `compress_assets` only converts to webp/avif, which is wrong for a `type="image/png"` favicon |
| 6 review portraits | 800px into 224-280px boxes (**3.6x**), ~108KB | ~55KB at 560px |
| drawer audiobook thumb | reuses the 700px phone mock for a **58px** box (12x) | needs its own ~120px variant |

**The heaviest thing touching this page is not on this page.** `hs-scripts`
(HubSpot tracking) is in the head, and because the portal is shared across the
whole DH family it injects the portal's tag stack at runtime - which pulled
`fbevents.js` at **106KB transferred, 406KB decoded**. There is no Facebook
pixel in this page's own markup; grepping the published HTML for `fbevents`,
`connect.facebook.net` and `fbq(` returns nothing. It is portal configuration,
not page code.

Ignore the SVG ratios in any oversize report: natural dimensions are
meaningless for vectors and those logos are 0.6-2.3KB each.

---

## Session notes, 2026-09-06

### The nav mark on phones

`@media (max-width:560px)` in the page embed carried
`.dd-page .ddod-nav-tag{display:none}` from the original build, written when
the tag was a low-value outlined grey pill. It is now the page's identity mark
and the only thing in the bar that says "podcast", so the rule is gone and the
nav shrinks to fit it instead: logo 96px, gaps 10px, mark 9.5px, CTA 9.5px.
At 375px that totals ~286px in a 331px content box. **Do not restore the
`display:none`.**

The nav CTA now reads **Join DarrenDaily** (was "Get DarrenDaily"). The short
variant already said "Join Free", so the two were inconsistent.

### The hero headline was wrapping to four lines all along

`.ddod-hero-h1` is three `display:block` spans, but on desktop the middle one
("strategic advantage.") never fit its column and silently wrapped, so the
authored three lines rendered as four with "advantage." dangling.

The measured constraint: at this weight and tracking the line needs
**11.93px of width per 1px of font-size**. In the old 640px column that capped
the headline at ~53px, well under the 63px it was set to.

Rather than shrink the artwork to buy that width, the wrap is now **accepted
deliberately** (the client's call): the headline breaks
`YOUR 5-MINUTE / STRATEGIC / ADVANTAGE. / ON-DEMAND.` and is sized to the
longest unbreakable unit, `YOUR 5-MINUTE`, which costs 7.66px per font-px.

    .ddod-hero-inner  grid-template-columns: minmax(0,1fr) clamp(300px,34vw,470px)
    .ddod-hero-h1     font-size: clamp(38px,5.4vw,78px); letter-spacing: -0.045em

78px at 1440 against 82px section titles, with the cover back at 470px. The
same rule holds on phones: at 375px the min 38px needs 291px for
`YOUR 5-MINUTE` in a 331px column.

**If the headline copy ever changes, re-measure.** The per-font-px ratios above
are the whole design; a longer first line breaks the layout silently.

### Mobile hero leads with the copy

`order:-1` is off `.ddod-hero-art` at <=980px. Stacked, the order is eyebrow,
headline, featured player, subscribe links, then the artwork. The featured
episode's play button now lands at ~474px on a 375px phone instead of ~866px.
The artwork is capped at 270px under 560px so it closes the hero rather than
re-creating the scroll it was reordered to remove.

### The audiobook section

It read as bolted on because it used the page's full-width section-title size
(82px) inside a half-width column, so the headline ran four lines, and the
button carried `width:100%`, making it 630px when every other button on the
page sizes to its label.

- headline: `clamp(32px,4vw,58px)` on the combo, matching `.ddod-about-h2`,
  which is the page's other two-column band
- button: `width:auto`, now 381px against the closing section's 393px
- credibility line: each claim is joined with **non-breaking spaces**, so a
  wrap can only ever land on a ` · ` separator and no single word can orphan
- grid `1.25fr 0.75fr`, padding 112/116 (was 132/136)

Section height went 978px to 785px.

### The phone mock has real earbuds

`tce-audiobook-phone-buds.webp`. The EarPods and cable are **lifted from the
real Unbreakable Sole artwork** (`book-phone-sm.webp` on that site, 1100x734,
transparent background so it is a crop and not a key), scaled by the measured
ratio between the two phone bodies (559/206 = 2.71) and composited behind the
phone so the cable tucks under its right edge. Nothing is drawn or generated.
`.ddod-ab-mock` max-width 310px -> 420px so the phone keeps its size.

The cover in the mock reads "OVER 1 MILLION COPIES SOLD" while the section
copy claims two million. That is the real 10th anniversary jacket and the
client has explicitly accepted it, so **do not raise it again or retouch it**.
The two million figure is current sales; the jacket is a historical artifact.

### Member card swap

Pallavi Nakra's "The boss of me." did not read well out of context. Her quote
is genuinely hers, so the whole card was swapped rather than re-pairing a face
with someone else's words: **Dennis Brown, "Incomplete if I miss a day."**,
both taken together from /welcome. New portrait `t-dennis-560.webp` (21KB,
560px for a 224-280px box) rather than reusing the 1000px 105KB welcome file.

### Favicons

The live set is **five PNGs totalling 139KB**, the 512 alone 99KB, all
generated by Webflow from one upload. The only true source in the repo is
`favicon-dd.png` at **64x64**, so the 512 is an 8x upscale: soft and, because
upscaling turns hard edges into gradients, expensive to encode.

`webflow-handoff/ddod/favicons/` holds a rebuilt set at **18.7KB total**
(512 goes 99KB -> 7.5KB). Built by snapping every pixel to the two real brand
colours (grey #58585A, red #BF1E2E) at 2048px, then downsampling so the
antialiasing is rebuilt at the target size instead of inherited blurry.

Upload `dd-favicon-32.png` and `dd-webclip-256.png` in Site Settings; Webflow
derives the rest. **A genuinely sharp large icon needs the vector logo** -
note that `DarrenDaily/dd-logo-color.svg` is not vector, it is a PNG wrapped
in an `<svg>` tag.

### Other copy

- hero eyebrow: "The DarrenDaily On-Demand Podcast" -> "The DarrenDaily Podcast"
- playlists lead: dropped "Never listened before? Start here." and
  "Tap one and it plays straight through."
- closing section lead: rewritten from delivery mechanics (inbox, sunrise,
  podcast app, feed) to outcomes, which is what belongs in a final CTA
- `.dd-drawer-face`: circle -> 4px radius, matching the covers

### The tracking on this page is not ours

`//js.hs-scripts.com/2518645.js` is the only third-party tag in the markup.
At runtime it injects a **Meta pixel (1490399231274221)**, **Google Ads
(AW-852119677)**, a **LinkedIn Insight tag** and HubSpot's own ads pixel, and
sets `_fbp` and `_gcl_au`. None of it is installed on this site. It is
inherited from the shared HubSpot portal, so grepping the published HTML for
`fbevents` finds nothing. Turning it off is a portal-level decision.

### Both closing buttons carry one offer

The audiobook section and the closing section now use the identical label
**"Join + get the audiobook, free"** (stored sentence case; `.dd-btn` uppercases
it). Both render 398x64. The closing button previously said "Get tomorrow's
session first".

The exit popup's `.ddod-xp-btn` still reads "Get the audiobook free" at 330px
and was deliberately left alone, since that is a different moment.

### The Role field's missing chevron was a shorthand, not a browser quirk

`.dd-page #ddJoinForm select` carried the chevron and `padding-right:42px`, and
the rule shipped intact, but the field computed `background-image: none` and
`padding-right: 16px`.

Cause: the shared input rule ends in `.dd-page #ddJoinForm .hs-input`, which is
**one class more specific** than the bare `select` rule, and it set the
`background` **shorthand** — which resets `background-image` to `none`. Its
`padding` shorthand beat the select's `padding-right` the same way.

Two fixes, both in the embed:

- `background:#fff` -> `background-color:#fff`, so the shorthand stops wiping
  the image
- the select rule is now `select.hs-input, select`, so it out-ranks `.hs-input`
  on padding

**Do not put a `background` or `padding` shorthand back into that input rule.**

### Player v26

`onFormReady` relabels the Role select's placeholder option to **"Your Role*"**.
HubSpot ships it as a bare "Role" while the two fields above read "First Name*"
and "Email*"; the placeholder is field config on HubSpot's side, so it is
corrected on render. It runs three times (immediately, 400ms, 1500ms) because
HubSpot re-renders the field group when validation attaches.

### Drawer strip

Now carries a **"Limited time gift"** eyebrow above the copy, which meant
wrapping the paragraph in `.ddod-ab-strip-body` (a flex column) so the eyebrow
could sit above it rather than beside it. Copy is
**"Two million copies sold. Yours to start listening to today, free."**

It shows the same earbud mock as the section. That is a 900px asset in a 74px
box, which normally breaks the sizing rule, but the section above already
loaded it, so reusing it costs **zero extra bytes** where a dedicated small
variant would cost a whole request. `.ddod-ab-strip-img` went 58px -> 74px so
the phone inside the wider artwork still renders at its previous size.

### Final offer copy

- eyebrow: **"Limited time gift"**
- headline: **"Join today. Get the bestseller, free."**
- both closing buttons: **"Join + the audiobook, free"**, 359px each

The exit popup's `.ddod-xp-btn` still reads "Get the audiobook free" at 330px
and was left alone deliberately: different moment, different ask.

### The drawer pitches DarrenDaily, not "tomorrow morning"

The drawer head is now a summary of the **live darrendaily.com hero**, which is
the canonical pitch. "Start tomorrow morning" is gone from the page entirely.

| slot | copy |
|---|---|
| eyebrow | Daily mentoring with Darren Hardy |
| title | Start every day with an advantage |
| beside Darren's face | One strategic idea every weekday morning, distilled from 35 years behind closed doors with the world's best. Small enough to install before the day gets going. **Free, and never a single ad.** |

The gift box names the product, which it previously did not:
**"The Compound Effect, complete audiobook."** followed by "Two million copies
sold. Yours to start listening to today, free."

Verified the drawer still works on a short phone: at 375x667 the head plus the
form is 906px against a 667px viewport, `.dd-drawer` is `overflow-y:auto`, and
the submit button is reachable at the bottom of the scroll. **Adding anything
else to the drawer head needs that check re-run** - the head is now 461px on
desktop and the form needs roughly 280px under it.

Closing paragraph names the brand rather than the page: "...350,000+ people
start their morning on DarrenDaily. Yours can start with us tomorrow."

### The drawer stays light. This was tried both ways.

A dark maroon drawer (matching the audiobook section) was built and rejected:
**DarrenDaily is a morning brand and the panel should not go dark.** Everything
is back on white. The embed's drawer block carries a note saying so; do not
"unify" it with the dark section later.

What survived from that pass, because it was right either way:

- **the divider is gone** - `.dd-drawer-head` border-bottom is 0, padding-bottom 6px
- **the portrait is gone** - the small square face beside the pitch read as odd
- **no pink** - `.ddod-ab-strip` went from `#fdf4f4` to the page's neutral
  `#f3f5f8`. Pink was the specific complaint, not the lightness.
- **"every day" is emphasised** in the title, in `#a72632`, and carries
  `white-space:nowrap` so the two words can never split across lines
- **an action line above the form**: "Where should Darren send it?"

**Watch the builder with leading spaces.** `<b> with an advantage</b>` inserted
via `data_whtml_builder` came back with the leading space stripped, rendering
"EVERY DAYWITH". `set_text` preserves spaces where the builder does not, so fix
it in a second call rather than trusting the insert.

### Drawer testimonials

Two, under the form, both lifted from **darrendaily.com** so they are real and
already client-approved:

- Cindy Santos Mendoza: "DarrenDaily is my morning mindset anchor. **Darren
  helps me quiet the noise and focus on one thing that truly matters** that day."
- Mark McInnes: "DarrenDaily provided me with **a clear path to becoming a
  better version of myself**."

Chosen against two constraints: general about Darren rather than about a
product (the brief explicitly ruled out naming TCE or anything else), and
already attached to a real name. **No photographs** - darrendaily.com pairs
these quotes with generic placeholder SVGs, so there is no real headshot to
use, and inventing one would break the rule that a face never carries another
person's words.

The tce.darrenhardy.com/bundle page was checked too. Most of its quotes name a
product ("the Weekly Rhythm Register Assessment"); the two that do not
(Douglas Philipstein on his marriage, David Watson on sales force performance)
are off-topic for this drawer. Left unused, but they are there if needed.

### The dark card reference was for the GIFT section, not the drawer

Worth writing down because it was misread once: the dark maroon card from the
GitHub page is the target for **`.ddod-join`, the TCE gift section**, which was
already `#2a1015`. The drawer stays white. Two changes brought the gift section
to the reference:

- **`.dd-key-b-light` went `#f0777f` -> `#cf3a45`.** That salmon pink was the
  "pinkish color" complaint. Checked first: the class is used on **this page
  only** (2 occurrences, both the gift headline), so changing it globally was
  safe. Home, /welcome and /404 do not use it.
- **A narrator row above the eyebrow**, matching the reference's "Darren
  records every one of them himself" line: a 52px square tile with the
  **mirrored** BMC stage shot, then "Darren reads the whole book himself." /
  "Not a voice actor. The same voice you hear every morning."

`dh-mic-bubble-128.webp` is cropped from `dh-bmc-stage-v2.avif` on dhbmc.com
(the only DH shot there; he is holding a clicker, not a mic) and **mirrored**,
so he faces into the copy instead of off the edge. Composited onto `#3a181e`, a
step up from the section ground so the tile reads as its own object.

**The narration claim is sourced, not assumed.** tce.darrenhardy.com/bundle
says "the EXTENDED edition audiobook read by Darren Hardy".

### Playlists headline

"The playlists you actually need" was called weak. Now
**"1,500 episodes. These six first."** - the archive's size is the tension and
the six picks are the resolution, so the headline does the work the lead used
to. The lead lost its duplicated numbers as a result: "Hand-picked from the
show 350,000 people wake up to and 12 million listens deep."

### Testimonial headshots

`tm-cindy-160.webp` and `tm-mark-160.webp`, cropped from the client's Air
library to 160px for a 34px circle. Both Air share links are publicly readable,
so the originals can be re-pulled without an account.

**Mark's source is not a headshot** despite the filename: a low-resolution
office snapshot, unsmiling, framed wide. A swap to another male member is
pending. Candidates already on darrendaily.com, all real name-and-quote pairs:

| who | quote |
|---|---|
| Jay Irwin | "Darren helped me see that I needed to take a risk to have no regrets." |
| Michael Rutowski | "Can't start my day without DarrenDaily! Puts me in the right mindset!" |
| Shane Reid | "My whole team takes advantage of DarrenDaily!..." |

Jay is the closest fit: it opens "Darren helped me see", which mirrors Cindy's
"Darren helps me quiet the noise" and is squarely about Darren giving clarity.
The trim above is an **exact leading clause** of his real quote, not a reword.

**One wording change to flag:** Mark's line on darrendaily.com is "**DarrenDaily**
provided me with a clear path"; the page now reads "**Darren** provided me". That
is the client's edit to a real member's words. Fine as their call, but it is an
edit, not a quote.

### The mic shot is DH_pod_room, not the stage shot

First attempt used `dh-bmc-stage-v2.avif` from **dhbmc.com** (the new
BMC|COLLECTIVE port). Wrong image: he is holding a clicker there. The one asked
for is `DH_pod_room.webp` on **hardybmc.com** (served from
darrenhardy.com/wp-content/.../dh-bmc-images/) - Darren at the gold studio mic,
black polo, THE EXCEPTION mug.

`dh-pod-mic-128.webp` is a 380px square around his head, **mirrored**, so he
faces into the copy instead of off the edge of the card. 52px box, 4px radius.

### What the gift section actually argues

Two rewrites came from the same note: **the pitch is results, not applause.**

- The old lead led on "two million people have read it and raved about it".
  Now: "What you do on an ordinary Tuesday is what decides the year. That is the
  argument of Darren's bestseller, and the complete unabridged audiobook is
  yours the moment you join."
- The narrator row led on "Darren reads the whole book himself / not a voice
  actor", which nobody is buying for. Now it connects the book to the daily
  practice: **"One more way Darren gets you #BetterEveryDay."** / "Five minutes
  each weekday morning here. The whole method in his voice whenever you want
  more."

**The linkage rule still holds.** TCE is not the source of DarrenDaily and
nothing may imply it is. It is *another thing from Darren*, and that is the
only bridge the copy is allowed to build. The exit popup was still breaking
this ("the book underneath them") and has been fixed.

Bullets are back, reusing the `.ddod-join-list` / `.ddod-join-li` classes that
were already defined (the red dash `:before` lives in the embed), so no new CSS.

### Exit popup carries the drawer offer

Title "Join, and take the whole book with you.", the same two-part offer as the
drawer, and its button now matches the other two at 359px. The X remains the
only dismiss, per the DD popup rule.

### The exit popup mirrors the drawer, form included

It used to be a button that opened the drawer. It now carries the whole offer:
title, pitch, the audiobook gift panel, "Where should we send it?", **the form
itself**, and the fine print. Its own CTA button is gone, since the form's
submit is the action.

**ONE HubSpot form, two homes.** Two `hbspt.forms.create` calls for one formId
on one page collide (duplicate field ids; the second render can blank the
first). So there is still exactly one `#ddJoinForm` node, and **v27 moves it**
into whichever panel is opening:

    #ddFormHome      <- inside .dd-drawer-body
    #ddFormHomeExit  <- inside .dd-exit-card

`hostForm(slotId)` does the move on open. `appendChild` relocates a live node
without re-rendering, and HubSpot's listeners are bound to the node, so a
part-filled form survives the trip. Verified: popup opens with the form in it,
closing and opening the drawer hands it back, and
`document.querySelectorAll('#ddJoinForm form').length` stays at **1**.

**Never add a second forms.create for 41958dbb-.** If the popup ever renders
empty, the cause is almost certainly that someone did.

`.dd-exit-card` already had `max-height:calc(100vh - 48px)` and `overflow-y:auto`,
so the taller content needed no new CSS. At 950px viewport the card is 763px
and does not scroll.

### The portrait needed the microphone in it

First crop was tight on his face and the gold mic was outside the frame, which
was the whole point of choosing that photo. `dh-pod-mic-200.webp` is a wider
530px box (x 250..780, y 150..680) that holds the mic, mirrored, displayed at
**76px** rather than 52px so it actually reads.

### Both panels open on the same promise

The exit popup's headline is now the drawer's: **"Start every day with an
advantage"**, with "every day" on `.dd-drawer-key` rather than `.dd-key-b`.
That class carries the same `#a72632` **plus `white-space:nowrap`**, so the two
words cannot split in the narrower card either. `.dd-key-b` was left alone
because it is shared with the playlists headline, where a global nowrap could
overflow.

`.ddod-ab-strip` gained `margin-bottom:22px` and gave back 4px of its top
margin, so the gift panel has air under it before "Where should we send it?".
In the drawer the strip is the last thing in `.dd-drawer-head`, so this reads
as 58px before the form block, which is right.

---

## Optimisation sweep, 2026-09-06

**First view went 517 KB -> 229 KB across 12 requests** (cold, desktop, measured
with curl; resource timing lies because it reads warm).

| | KB |
|---|---|
| HTML (gzip) | 19.8 |
| Webflow CSS | 22.2 |
| jQuery + Webflow JS | 44.0 |
| DDOD player v28 | 15.2 |
| Inter (variable, one file) | 47.9 |
| images that actually load (6) | 78.4 |
| favicon | 1.3 |
| **page total** | **229** |

Add the HubSpot loader and the portal's injected pixel stack for roughly
**347 KB** all-in. That stack is not ours (see the tracking note above).

### The font was more than half the page

`family=Inter:wght@400;500;600;700;800;900` makes Google serve **six separate
static files at 47.3 KB each = 284 KB**. `wght@400..900` serves the **variable
font: one 47.3 KB file** covering the whole range. Same family, same weights,
**236 KB saved on every page of the site.**

An earlier audit recorded "Fonts: already optimal, nothing to do". That was
wrong: it checked the *loading pattern* (preconnect, preload, non-blocking) and
never checked what was being loaded. The pattern was fine; the payload was six
times bigger than it needed to be.

### Images that were loading for no reason

- The hero cover was `loading="lazy"` while being the first thing painted on
  desktop. Now `eager` + `fetchpriority="high"`.
- The 52 KB phone mock was **eager in three places**, two of which are hidden
  panels. The exit popup no longer has its own copy at all.

### Two shared nodes, not two copies

The exit popup mirrors the drawer, so v28 moves both the form **and** the gift
panel between them rather than duplicating them:

    #ddJoinForm     -> #ddFormHome / #ddFormHomeExit
    .ddod-ab-strip  -> #ddGiftHome / #ddGiftHomeExit

Besides keeping the 52 KB artwork off the first view, this means the gift copy
only ever has to be edited once.

### Three API limits worth knowing

1. **`set_attributes` conflicts on elements created by `data_whtml_builder`**
   in the same session: "[Conflict] The operation could not be applied to the
   component map". `set_image_asset` on the same element works fine. Publishing
   and waiting does not clear it.
2. **The builder DROPS `loading`** from `<img>` markup, so rebuilding the
   element with `loading="lazy"` inline does not work around (1).
3. **`id` is not a generic attribute** - `set_attributes` with `name:"id"`
   fails with an internal error. The builder CAN create an element with an id,
   which is how the four slots above exist.

Net effect: `dh-pod-mic-200`, `tm-cindy-160` and `tm-mark-160` (**14.9 KB**
combined) still load eagerly and cannot be deferred through the API. **This is
a three-click fix in the Designer:** select each image, Settings, Loading ->
Lazy.

### 14 orphan classes removed

`dd-drawer-face`, `dd-drawer-fine-link`, `ddod-xp-btn`, `ddod-ab-flag`,
`ddod-join-card`, `ddod-join-h3`, `ddod-join-p`, `ddod-hero-lead`,
`ddod-h1-tag`, `ddod-bstat-star`, `ddod-sk-x`, `dd-sec-lead-ondark`, `ondark`,
`home-sec-head-filter`.

Checked against **all seven published pages plus the player**, not just this
one. `_w-input` looked orphaned too but is Webflow's own and was left alone.
The `post-*`, `bio-*`, `xsoon-*`, `share-*`, `cta-*`, `ss-*`, `champ-*` and
`gift-*` families also look orphaned from those seven pages and are **not** -
they belong to the Sessions CMS template.

### Superseded assets, NOT deleted

Deleting assets is irreversible and they cost nothing but storage, so these are
listed rather than removed. Confirm before clearing:

`ddod-player-v25/v26/v27.js`, `dh-mic-bubble-128.webp`, `dh-pod-mic-128.webp`,
`tce-audiobook-phone.webp` (superseded by `-buds`), `dh-face-social-200.webp`
(the drawer portrait that was cut). Keep `ddod-player-v22` - it is the parked
audiobook-form build.

### Favicons: better, one file still fat

The uploaded set is live and the total went **139 KB -> 73.5 KB**. But Webflow
regenerated the 512 as **49.4 KB RGBA** from the 256 upload, where the supplied
flattened file was 3.9 KB. In practice a browser fetches one icon (the 32, at
1.3 KB), so this is not first-view cost - but the 512 is still heavier than it
needs to be if anything ever requests it.

### Reading the Webflow asset bandwidth report

That report shows **historical** bandwidth and **max file size**, not what the
site serves today. Checked every heavy row against all seven live pages:

| asset | status |
|---|---|
| `DDJ_5 (1) (1).jpg` 1.31 MB | **already replaced** by `rd-photo-1800.webp` (118 KB, full variant set). Zero references. |
| `hero-garden.webp` 361 KB | **already replaced** in the page by `hero-garden-m` (820w) + `hero-garden-1600`. Still referenced as home's **og:image** - see below. |
| `Wall-DH-blue.webp` 242 KB | zero references |
| `Wall-DH.webp` 121 KB | zero references |
| `SM_12_01_DOWNEY.webp` 113 KB | zero references |
| `rd-photo-1800` / `dh-waving` / `dh-expired` | fine - full p-500/800/1080/1600 sets, browser picks small |

So the heavy rows are **orphaned originals plus historical traffic**, not live
page weight. They cost storage, not bandwidth.

**Two real findings the report surfaced:**

1. **Home's `og:image` is the 361 KB hero photo.** Social scrapers refetch it,
   which is where that 4.33 MB across 12 requests comes from. /welcome and /404
   use a 167 KB `og-image.jpg` instead. A purpose-cut 1200x630 would be ~60 KB.
2. **The DDOD page has no `og:image` at all**, so sharing it produces a preview
   with no picture.

One cosmetic flaw, not worth a fix: `dh-waving.webp` (166 KB) and
`dh-waving-p-1600.webp` (141 KB) both carry the **same 1600w descriptor**,
because the original is itself 1600px. The browser may take the heavier of the
two. Webflow generates that srcset itself and the API cannot author srcset on
an Image element, so it is not addressable headlessly.
