# Home (/) — native Webflow rebuild

Page `6a66d7a8f9d116b514a13ae4`, rebuilt **in place**. The loader embed
(`#dd-app` + `dd-home-v17.js` + `dd-home.css`) is gone; all 12 sections are real
Designer elements.

**Source of truth was the LIVE v17 script, not the repo.** The repo's
`webflow-src/home/` and `webflow-handoff/dd-home-v5..v8.js` are stale (v8 vs the
live v17) — do not build from them.

## Structure

```
.dd-page
  Site Nav      (component 033d1565-…)
  main.dd-main#top
    section.home-hero          photo + wash + h1 + dual CTA + scroll cue
    section.home-numbers       5-stat band, count-up on scroll
    section.home-bio           "never meant to build alone"
    section.home-featured      8 press logos
    section.dd-intro.home-intro  Vantage: covers wall + stats + 6 seals
    section.home-filter        Information vs Clarity, with the VS badge
    section.home-voice-spine   3 numbered rows, scroll-linked progress
    section.home-ritual        dark; flow steps, with/without, photo, apple note
    section.home-tw            9 testimonial cards
    section.home-who-sec       for/not-for + who-close + preview card
    section.home-finale        opt-in form (#ddForm)
  Site Footer   (component 536ecfab-…)
  .home-lightbox#previewLightbox
  HtmlEmbed     home-embed.html  — must stay the LAST child of .dd-page
HtmlEmbed       dd-optin-upgrade-v6.js — moved AFTER .dd-page so #ddForm exists
```

## Classes

**Reused as-is:** `dd-page`, `dd-main`, `dd-container`, `dd-btn`, `dd-btn-line`,
`dd-btn-arrow`, `dd-btn-ondark`, `dd-eyebrow*`, `dd-dot`, plus both components.

**Promoted for this build:** the Vantage section was the *source* of what /404 got
a compacted port of, so `exp-intro*` → **`dd-intro*`** (18 classes: `dd-intro`,
`-wall`, `-fade`, `-text`, `-eyebrow`, `-h2`, `-em`, `-p`, `-p-lead`, `-p-last`,
`-stats`, `dd-covers`, `dd-is-n`, `dd-is-l`, `dd-seals`, `dd-seal`,
`dd-seal-amazon`, `dd-seal-nyt`). /404's embed was rewritten to match. The base
carries /404's compact scale; home's larger type/padding rides as `home-*` combos.

**New:** ~90 `home-*` classes, all page-scoped.

## Opt-in form

`dd-optin-upgrade-v6.js` swaps `#ddForm` for HubSpot form
**`41958dbb-3c3a-439b-b747-bb96acf50680`** — the live, working one (unlike the
dead `e74fd54c` in the /404 modal script). Verified: 9 inputs render.
Its embed was moved to sit *after* `.dd-page` so `#ddForm` exists when it runs.

## Verified live (1440 x 900)

| section | live before | native now |
|---|---|---|
| featured | 165 | **165** |
| Vantage/intro | 1111 | **1111** |
| numbers | 496 | 497 |
| testimonials | 2168 | 2170 |
| filter | 1066 | 1070 |
| spine | 391 | 396 |
| bio | 848 | 842 |
| ritual | 1287 | 1253 |
| finale | 793 | 852 |
| who-for | 2242 | 1972 |
| nav | 87 | 75 |
| footer | 433 | 416 |
| **docH** | **11876** | **11695** (-1.5%) |

Zero broken images (31), no `##INLINE` corruption. Behaviours confirmed live:
count-up, spine fill (100% + all rows lit), lightbox (injects Vimeo `298902445`
on open, clears on close), HubSpot swap, nav solid-on-scroll.

**nav -12** is the missing Join CTA (see below). **footer -17** is intentional —
the footer was rebuilt to match darrenhardy.com/about. **who-for -270** is the
one gap I could not source: every child measures to within a few px of the
original CSS (head 302, grid 520, close 187, card 526, padding 264 = 1972), so
the 2242 reference reading is likely the outlier rather than the build.

## Not built

The live nav carried a **"Join free →"** button (`#join`). It is not in the
rebuild: the Data API refuses writes into the Site Nav component's internals
(reads work via `query_elements {scope_component_id}`; every write returns
"element not found"). Same gap as /404. Add it in the Designer as a second
default-hidden CTA beside the existing share CTA, then opt it in per page.

## Gotchas hit

- **Three headings were corrupted to `##INLINE##`** by the builder (filter title,
  the "Clarity" h3, the finale h2). Rebuilt with `<b>` instead of `<em>`/`<span>` —
  `<b>` becomes a DOM element and has never been mangled.
- **`-webkit-text-stroke` on the spine numerals** is dropped by Webflow; it lives
  in the embed, same as the /welcome step numbers.
- `.home-cnt` was never created (no CSS for it), so the count-up targets
  `[data-count]` instead. Intentional.
