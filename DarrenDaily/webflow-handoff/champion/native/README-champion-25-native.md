# champion-25-gift — NATIVE Webflow rebuild

Native (Designer-editable) rebuild of `/champion-25-gift`. The live loader-embed page is
untouched; this is a parallel page pending sign-off, then a slug swap.

- **Native page:** https://darrendaily.webflow.io/champion-25-gift-native — page id `6a9c3ecca80c51e1c14c78d2`
- **Live original (unchanged):** https://darrendaily.webflow.io/champion-25-gift — page id `6a6a78974ff16085509d80dc`
- Site `6a66d7a6f9d116b514a13ae1`. Built headlessly via the Data API (no Designer session).

## What is native vs. embedded

Everything is a real Designer element with real classes — nav, hero, gift card, footer.
**One** HTML Embed remains, appended at the end of `.dd-page`, because two things cannot be native:

1. The HubSpot form markup (mounted by HubSpot's own script).
2. The `.gift-card .hs-*` rules — Webflow's native style engine accepts **single-class selectors only**,
   so descendant selectors have nowhere else to live.

That embed also carries the page behaviour (nav solid-toggle, `?firstname=` personalization, scroll reveal).
Source of truth for it: `champion-25-embed.html` in this folder.

The HubSpot form target is the native `.hs-form-embed` div, addressed **by class**, not by DOM id
(`set_dom_id` lowercases ids, which would break `#hsFormChampion25`, and it 409s on this site).
Form GUID `1aebadef-303a-4398-9834-a6f4f15c5274`, portal `2518645`, region `na1` — unchanged.

## Global components (new — first components on this site)

| Component | Group | Id |
|---|---|---|
| Site Nav | Global | `033d1565-317d-9443-72c2-3a51e1dc0940` |
| Site Footer | Global | `536ecfab-8245-b46e-1146-06542f759ebc` |
| Site Footer Slim | Global | `2a7f26af-7b55-2597-099b-da6c2165d855` |

All three were made with `transform_element_to_component` and are ready to drop onto the other
pages. Edit once, changes everywhere they are instanced.

**Site Footer Slim** is the legal-bar-only footer (hairline rule, copyright left, Terms and
Privacy right; 73px tall at desktop), for post-conversion, checkout and utility pages where the
full footer is a distraction — the same full/slim pair Unbreakable Sole uses. It reuses
`.dd-container`, `.f-footer-bottom-legal-links` and `.f-footer-bottom-a`; its own classes are
`.site-footer-slim`, `.footer-bottom-slim` and `.footer-slim-copy`. Live preview:
https://darrendaily.webflow.io/component-preview-slim-footer (page `6a9c4721f1b18939623d9a00`
— a throwaway preview, safe to delete once the component is placed for real).

The champion page still uses the **full** footer, to keep its parity with the live page.

## Classes

**Reused from the existing site** (welcome-native built them; they matched the champion CSS exactly):
`.dd-page .top .top.solid .nav-brand .site-footer .footer-grid .foot-brand .f-foot-brand-fb-logo
.socials .f-socials-a .f-socials-svg .footer-col .f-footer-col-h3 .f-footer-col-ul .f-footer-col-li
.f-footer-col-a .bmc-corner .f-bmc-corner-img .bmc-corner-text/-title/-tag/-cta .footer-bottom
.f-footer-bottom-legal-links .f-footer-bottom-a .key .dot`

**New:** `.dd-container .champ-logo .dd-main .champ-hero .champ-glow .champ-inner .champ-badge
.champ-star .champ-h1 .champ-line .champ-sub .champ-sub-b .gift .gift-card .gift-badge .gift-h2
.gift-body .gift-body-b .hs-form-embed .dd-micro .champ-foot-tag`

`.champ-foot-tag` exists instead of reusing `.f-foot-brand-tag` because that one is `max-width:479px`
(welcome's value); the champion footer blurb is `max-width:320px`.

## Gotchas hit (worth remembering)

- **`<br>` immediately followed by an inline element breaks `data_whtml_builder`.** `Congratulations,<br><em>…</em><span>.</span>`
  came back as the literal text `##INLINE4####INLINE1##`. The same `<em>`/`<span>` pair with no `<br>`
  converted fine. Fixed by dropping the `<br>` for `<span class="champ-line">` at `display:block`.
- **Webflow has no `*{margin:0}` reset.** Shorthand `margin:24px auto 0` must be written out with an
  explicit `margin-bottom:0`, or Webflow's default `p`/heading `margin-bottom:10px` survives. That was
  a +10px hero height until fixed on `.champ-sub` and `.gift-body`.
- **Headings need an explicit `line-height`.** `.f-footer-col-h3` had none, so it rendered 30px tall
  instead of 10px (+20px of footer). Setting `line-height:1` fixed it here *and* corrected
  `/welcome-native`, which had silently carried the same drift.
- clamp(), radial/linear gradients, `transform: translate(-50%,-50%)`, flex `gap` and inline `<svg>`
  all survive the parser intact. Images do **not** — insert, then `set_image_asset` with the asset id
  (the 24-hex prefix of the hosted filename).
- Two style/element writes fired in the same message can 409 ("could not be applied to the component
  map"). Send them sequentially.

## Parity vs. the live page (measured, not eyeballed)

Verified **identical** at every breakpoint band, comparing computed styles and box
geometry on both pages:

| Viewport | Live doc height | Native doc height | Band being tested |
|---|---|---|---|
| 1440px | 1885 | 1885 | desktop |
| 900px | 2020 | 2020 | 4-col footer (861-991 band) |
| 700px | 2030 | 2030 | 2-col footer + mobile nav |
| 500px | 2375 | 2375 | card padding (480-520 band) |
| 375px | 2450 | 2450 | full mobile |

Hero, card, badges, headline metrics, footer grid tracks (down to the fractional
column widths), form grid, button, nav solid state, images and colours all match.

### How the breakpoints are handled

Webflow's breakpoints are **fixed at 991 / 767 / 479** and the original CSS breaks at
**860 / 720 / 520**. Mapping one onto the other left visible drift bands -- at 500px the
card kept desktop padding, so the heading wrapped onto two lines instead of one; at 700px
the footer collapsed to a single column while the original was still two.

So the Designer breakpoint variants were removed and this page's responsive steps are
pinned in the embed's `<style>`, scoped to `.dd-page` (specificity 0,2,0) so they always
outrank the plain class rules Webflow emits. **Desktop/base values still live on the
classes in the Designer** -- only the mobile steps are in the embed. If you change a base
value on canvas, check whether its mobile step in the embed needs the same change.

## The site's custom code also styles the footer

Site Settings > Custom Code carries a second, structural footer stylesheet that overrides
the classes -- e.g. `.foot-brand > div:last-child a` (the social icon boxes),
`.foot-brand p { color: #b0a8a6 !important }`. It applies to **every** DarrenDaily page.

The social icon boxes were removed for this page by overriding it in the embed. To drop
them site-wide, delete that border rule from the custom code -- that changes the live
pages too, so it is a deliberate call, not a side effect.

## To promote this page over the live one

Swap the slugs (`champion-25-gift-native` -> `champion-25-gift`, old page renamed/archived) so the
printed/emailed URL keeps working, then publish. Do the same rebuild for `/champion-100-gift`
(identical except: shirt+hat copy, "Rockstar Status" badge, and the extra `hs_shirt_style` /
`hs_shirt_size` span-3 fields).
