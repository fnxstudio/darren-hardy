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

Verified by rendering the **original** page (its real CSS + v17 markup, pulled from
the CDN) in an iframe beside the live rebuild and diffing computed styles and
section heights. Nine of eleven sections match **exactly**:

| section | original | native | diff |
|---|---|---|---|
| hero | 876 | 876 | 0 |
| numbers | 496 | 496 | 0 |
| bio | 848 | 848 | 0 |
| featured | 165 | 165 | 0 |
| Vantage/intro | 1111 | 1111 | 0 |
| filter | 1066 | 1066 | 0 |
| voice spine | 391 | 391 | 0 |
| ritual | 1287 | 1287 | 0 |
| testimonials | 2168 | 2168 | 0 |
| who-for | 2255 | 1986 | -269 (see below) |
| finale | 818 | 870 | +52 (form, see below) |

The computed-style diff across 30 element pairs (font size/weight/line-height/
letter-spacing/colour/padding/margin/text-align/max-width) returns **empty**.

### What the first pass got wrong, and why

1. **`h1,h2,h3 { font-weight:900 }`** — the original's global heading rule. I set it
   on every heading class except the hero h1, which fell back to Webflow's 700.
2. **`line-height:1.0`** — the same global rule. I had used 1.02 on eight headings.
3. **Webflow's own heading/paragraph margins.** The original page *also* ran inside
   Webflow, so `h1,h2,h3 { margin:20px 0 10px }` and `p { margin-bottom:10px }`
   (specificity 0,0,1) beat its own `*{margin:0}` reset (0,0,0). My build zeroed
   them. Restored on eleven elements.
4. **The builder DROPS classes off `<br>` elements.** The original's responsive line
   breaks (`eb-br`, `hbr`) are `display:none` above 980px — but with no class to
   target, they rendered, giving the hero headline two extra lines and the eyebrow
   one. Now hidden structurally from the embed. This alone was the whole +75 hero gap.
5. **`dd-optin-upgrade-v6.js` replaces `#ddForm` wholesale**, re-creating the urgency
   and micro copy as its own `.dd-urgency` / `.dd-micro`. Those were styled by
   `dd-home.css`, which this rebuild retired, so they lost their centering. Restyled
   in the embed.
6. **Combo-class ordering:** `home-intro-p` is a later combo than `dd-intro-p-last`,
   so it re-asserted the bottom margin that `-last` exists to remove.

### The two remaining deltas

**who-for -269 is a deliberate deviation.** The original's preview card markup carries
`height="789"` on the `<img>`. That presentational hint defeats the stylesheet's own
`aspect-ratio: 21/9`, so the shipped card rendered ~16:9 (791px) instead of the
cinematic 21:9 band (526px) the CSS asks for. The rebuild honours the CSS. Content
inside the card is 268px, so nothing is clipped at the shorter height. **If you want
the original's taller card, say so** — but matching it means hardcoding a pixel height
that would also defeat the 3/4 ratio the design switches to under 760px.

**finale +52 is not a real gap** — the iframe original shows the *native* form (no JS),
the live rebuild shows the swapped-in HubSpot form. The earlier 793 reading from the
live original was almost certainly captured before HubSpot finished rendering.

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

## Hero headline line breaks (deliberate change from the original)

The original let the desktop headline wrap naturally inside `max-width: 11ch`, which
orphaned the last word: "AN" sat alone on its own line. Measured at 1440, the widest
intended line ("AN ADVANTAGE.") needs **516px** and the box was **495px** — 21px short.

Widening alone does not fix it: at ~540px "DAY WITH AN" fits, so the orphan just moves
to "ADVANTAGE." instead. The markup already authors the correct break points (the `hbr`
breaks the original only shows below 980px), so those are now honoured at **every**
width, and `max-width` went to **12ch** so no line wraps further.

`ch` is font-relative, so the box scales with the clamped font-size. Verified 5 clean
lines at 1024 / 1200 / 1440 / 1600 / 1920. Hero height is now 818-821 (was 876) — one
fewer line, which is the point.
