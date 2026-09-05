# DarrenDaily — bandwidth + class hygiene pass, 2026-09-05

## Bandwidth

Home had never been audited (it was still the loader page during the first pass).
It was **2238 KB of images**. One file was more than half of it.

| asset | was | now |
|---|---|---|
| ritual photo (`DDJ_5.jpg`, **6000x3376 JPG**) | 1276 KB | **118 KB** (1800px WebP) |
| hero garden | 352 KB (2311px) | **117 KB** (1600px) |
| 9 testimonial portraits | 372 KB | **177 KB** (800px) |
| **home total** | **2238 KB** | **697 KB (-69%)** |

Earlier passes had already taken /welcome from 909 -> 270 KB and /404 from 481 -> 322 KB.

### Why home needed re-uploads rather than `sizes` fixes

Images inserted through the Data API get **no srcset variants at all** — Webflow only
generates `-p-500` etc. for Designer uploads. So on home there is one size for every
device and it has to be right. Each replacement is sized to ~2x its largest measured
render box.

### Still oversized, but blocked

`BMC_Logo` (17 KB at 236px for a 56px box) and the two DD logos live inside the Site
Nav / Site Footer **components**, whose internals the Data API will not write, so their
images cannot be rebound. ~25 KB per page left on the table. Fix in the Designer.

### Undersized (quality, not bandwidth)

`dh-covers.webp` is 1200x750 rendering into an 835x1111 cover box — upscaled ~1.5x, so
the covers wall is soft. Needs a taller source; no size fix can help.

## Classes

Audited all 458 site styles against every class used across all pages plus the
components, and against classes referenced only from embed CSS/JS.

- **26 orphans deleted** — `f-*` flattener leftovers (`f-stagger`, `f-video-frame-*`,
  `f-*-eyebrow`), bare modifiers (`accent`, `center`, `on-dark`, `ondark`, `hd`),
  superseded promotions (`exp-intro-eyebrow`, `exp-seal-*`, `exp-intro-p-*`,
  `wel-hero-inner`), and classes for elements the builder mangled
  (`home-eb-br`, `home-hbr`, `home-br-m`, `home-finale-em`, `home-fbox-h3-em`).
- **3 renamed** to the `dd-` convention: `f-footer-bottom-a-hover`,
  `f-footer-col-a-hover`, `f-socials-a-hover`.
- **4 could not be deleted** (`hs-form-embed`, `post-caption-secondary`, `ss-card-img`,
  `ss-date`) — the API errors on them; they belong to the Sessions/post CMS area.
- **52 styles are used only by the Sessions CMS template.** Left in place. If that
  template is abandoned, they can all go: the `post-*`, `bio-*`, `quote-*`, `share-*`,
  `xsoon-*`, `xcta-*`, `cta-banner*`, `cta-sticky*`, `comments-*`, `c-tile/c-large/
  c-tall/c-wide`, `ss-card`, `video-frame-1-2`, `vf-vid`, `video-poster`.

### Two live bugs the audit caught

1. **/404's Amazon seal and intro paragraphs carried stale class names.** The promotion
   renamed the styles but three elements kept pointing at the old names
   (`exp-seal-amazon`, `exp-intro-p-lead`, `exp-intro-p-last`), so the Amazon seal was
   rendering at full height instead of its 82% override and the intro's lead/last
   paragraph modifiers were dead. Repointed to `dd-*`.
2. **`dd-hero-inner` was missing `width:100%`.** The original hero container is
   `width:100%; max-width:1720px`; the rebuild had only the `position/z-index` added
   during the scrim fix. As a flex item under `align-items:center` it shrink-wrapped,
   squeezing the Welcome video from its designed **940x529 down to 600x338**. Fixed —
   and this also resolved the /404 hero height, which now measures **1129, exactly the
   original reference** that had been unexplained.

## Naming, as it stands

- `dd-*` — shared primitives and chrome (nav, footer, container, buttons, eyebrows,
  hero, video facade, cue, sessions cards, close band, Vantage/intro, seals, exit
  popup, toast, modal). Safe to reuse on any new page.
- `home-*`, `wel-*`, `exp-*`, `champ-*`, `gift-*` — page-scoped. Promote to `dd-*` the
  moment a second page needs one.
- Promotion checklist, learned the hard way: rename the style **and** re-point every
  element that used it, **and** rewrite any page embed that references the old name.


## Second bandwidth pass (hero + page payload)

### Hero: real responsive srcset

Webflow's **Image element rejects both `srcset` and `sizes`** via the API ("Use
set_image_asset instead"), which is why API-built pages serve one size to every
device. The way round it: build the hero as a **DOM element with `tag: img`** — not a
managed Image — which accepts every attribute natively.

The home hero is now a plain `<img>` with:
- `srcset` = 820w (53 KB) + 1600w (117 KB), `sizes="100vw"`
- `loading="eager"` + `fetchpriority="high"`

Two wins. **Mobile now pulls 53 KB instead of 117 KB (-64 KB)**, and the hero is no
longer `loading="lazy"` — it is the LCP element, and lazy-loading it was delaying the
largest paint on every visit. The 820w mobile asset already existed (it was the
original page's mobile hero) so no new upload was needed.

Verified: mobile@2x resolves to the 820w file, desktop to 1600w.

Trade-off: a DOM `img` is not a Webflow Image, so the Designer's image picker will not
target it — swap the photo by editing the `src`/`srcset` attributes. Worth it for the
hero; the other images stay as normal Image elements.

### Class collision fixed

The site-head custom CSS defines `.dd-covers` as the Sessions template's **covers
grid** (`display:grid; repeat(5,1fr)`), and the rebuild had also used `dd-covers` for
the Vantage **image** on home and /404. Two unrelated things, one name, one of them in
custom code where nothing would flag it. The image class is now **`dd-covers-img`**.

While fixing it, the covers `sizes` override was removed from both embeds: that image
is *undersized* for its box already (1200px into 835x1111), so capping it to a smaller
variant was working against sharpness for ~8 KB.

### Fonts: already optimal, nothing to do

Inter loads via preconnect + preload + `media="print" onload` with a `<noscript>`
fallback — the correct non-blocking pattern. All six weights (400/500/600/700/800/900)
are genuinely used across the site, so none can be dropped without a design change.

### Left on the table (needs your call)

These are all real, but each removes something currently live:

| item | cost per page load | note |
|---|---|---|
| Sessions-only CSS in the site `<head>` | ~4 KB | `.post-*`, `.xsoon-*`, `.quote-*`, `.share-bar`, `.bio-*`, `.c-tile`, `.cta-*`, `.comments-*` — loads on every page, used only by the CMS template |
| `ddsessions` script (site-wide) | 8.1 KB | Sessions template only |
| `ddsharefix` + `ddjournalfix` + `ddvimeocolorfix` | ~0.9 KB + 3 requests | loader-era patches, likely obsolete |
| `ddchampionpopup` | 1.1 KB | champion pages only |
| `.video-poster` preload script in `<head>` | tiny | runs a MutationObserver on every page for a CMS-only element |

Together roughly **14 KB and 5 requests on every page**, including home. They all
attach site-wide today. Scoping or removing them is safe once the Sessions/post CMS
area is retired — which is the same sweep as the 52 CMS-only classes above.

Not touched, unchanged from the first pass: the BMC and DD logos are still oversized
but live inside components the Data API cannot write.
