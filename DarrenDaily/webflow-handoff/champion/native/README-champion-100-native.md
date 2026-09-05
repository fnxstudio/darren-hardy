# champion-100-gift — NATIVE Webflow rebuild

Native rebuild of `/champion-100-gift`, built exactly like the $25 page. **Read
`README-champion-25-native.md` first** — the architecture, class list, breakpoint handling,
custom-code caveat and parser gotchas are all documented there and apply identically here.

**PROMOTED 2026-09-05** — now served at the canonical slug; the old loader-embed page was renamed
to `champion-100-gift-legacy`, set to draft, and is awaiting deletion in the Designer.

- **Live page:** https://darrendaily.webflow.io/champion-100-gift — page id `6a9c48148dd513bfc47da627`
- **Retired loader-embed page:** slug `champion-100-gift-legacy`, draft — page id `6a6a78950fc7ccd49a1c98f3`
- Embed element `dbcf0cf2-6a47-afd7-45c9-60a7fa42f4b8`; source is `champion-100-embed.html` here.

## What this build reused

**Zero new CSS classes.** The $25 build had already created every class this page needs
(`.dd-container .champ-hero .champ-glow .champ-inner .champ-badge .champ-star .champ-h1
.champ-line .champ-sub .champ-sub-b .gift .gift-card .gift-badge .gift-h2 .gift-body
.gift-body-b .hs-form-embed .dd-micro`), so the whole page went in as markup only.

Nav and footer are **instances of the global components** (`Site Nav`, `Site Footer`) rather
than copied markup — the first page to consume them that way.

## What differs from the $25 page

| | $25 (mug) | $100 (shirt + hat) |
|---|---|---|
| Hero badge | `25+ Championed` | `100+ Championed` |
| Card badge | Drink Up | Rockstar Status |
| Card heading | Your *DarrenDaily* mug awaits. | Your *Be The Exception* gear awaits. |
| HubSpot form | `1aebadef-303a-4398-9834-a6f4f15c5274` | `38bbadfe-2497-4c36-9edf-692578b40e0b` |
| Fields | 8 | 10 — adds `shirt_style` + `shirt_size` selects, 2-up at `span 3` |

The two extra grid rules (`.hs_shirt_style`, `.hs_shirt_size`) are the only CSS difference
between the two embeds; everything else in them is byte-identical.

## Footer

This page uses the **Site Footer Slim** component (swapped 2026-09-05), not the full footer —
see `README-champion-25-native.md`. The parity table below was measured *before* that swap, when
the page still carried the full footer; it is the record that the rebuild itself is faithful.
With slim in place the document height at 1440px is **1592** rather than 1952, the 360px the full
footer used to take. Everything above the footer is unchanged.

## Parity vs. the live page (measured, with the full footer)

| Viewport | Live doc height | Native doc height |
|---|---|---|
| 1440px | 1952 | **1952** |
| 700px | 2097 | **2097** |
| 500px | 2533 | **2533** |
| 375px | 2608 | **2608** |

Hero 593, card 812, footer 433 at desktop — all matching. All 10 fields present with the
right grid spans and in-field placeholders; the shirt selects carry the same option lists
(`Shirt Style / Men's / Women's`, `Shirt Size / XSmall / S / M / L / X-Large / 2X-Large /
3X-Large`) and the same grey placeholder state. `?firstname=` personalization verified.

## Note on verifying the scroll reveal

The reveal is gated on a JS-added `.dd-js` class, so content is never hidden without JS.
When checking this page through an automated browser whose pane is **hidden**, both
IntersectionObserver and CSS transitions are suspended by the browser, so `.champ-inner`
and `.gift-card` will report `opacity: 0` even though the winning rule declares `opacity: 1`.
That is the harness, not the page — confirm with a visible viewport before chasing it.

## The slug swap (done 2026-09-05)

Order that works: rename the old pages to `-legacy` **and** set `draft: true` (this frees the
canonical slug — two pages cannot share one), then rename the native pages onto the canonical
slugs, then publish. Verified afterwards: `/champion-25-gift` and `/champion-100-gift` both 200
and serve the native markup (no `#dd-app` loader div); `-legacy`, `-native` and the component
preview all 404.

**`bulk_update_pages` silently ignores the `draft` flag** — it returned `draft: false` for both
pages. `update_page_settings`, one page per action, applies it correctly. Use that.

Still to do by hand: the Data API has no delete-page action, so deleting the two `-legacy` pages
and the component preview is a Designer step. All three are marked draft so they are easy to find.
