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

## Review cards on phones

The marquee cards were 280px on a 375px screen, so barely one and a quarter
showed and the row read as a single card rather than something that scrolls.

They are now **172px with an 11px gap** below 560px: `172 + 11 + 172 = 355`,
which leaves a **20px sliver** of the third card at 375px. The sliver is the
point - two cards that exactly fill the screen look like a static pair.

Text and image cards share one width (`.ddod-rv` and `.ddod-rvi` both 172px) so
the rhythm holds regardless of which type lands where; every third tile is an
image card, so a mismatch would be visible constantly.

Padding and type come down with the width, because the text column is only
142px: 18/14/16 padding, 14px title, 12.5px body at 1.5, and smaller stars,
name and source. The row grows from 382px to 412px tall, which is the cost of
the narrower column and is worth it.

The 560-760px band also came down, from 300/240 to a uniform 230px, so tablets
show two full cards plus a wide sliver rather than one and a half.
