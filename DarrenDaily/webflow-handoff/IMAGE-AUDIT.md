# DarrenDaily image / bandwidth audit — 2026-09-05

Covers **/404, /welcome, /champion-25-gift, /champion-100-gift**. Home deliberately
excluded (shared assets were optimised anyway, per instruction).

## The finding that mattered

Not format — **`sizes`**. Webflow writes each image's `sizes` attribute from the
*asset's intrinsic width*, not its CSS box. A 394px testimonial tile shipped
`sizes="(max-width:1000px) 100vw, 1000px"`, so the browser bought the 1000w variant
(**105.7 KB**) when the 500w (**18.3 KB**) was the correct pick. Six tiles on /welcome.

Verified with cache-busted srcset resolution in a real browser:

| | Webflow default | corrected |
|---|---|---|
| desktop 1x, 403px box | 1000w base (105.7 KB) | `-p-500` (18.3 KB) |
| mobile 390 @2x, 390px need | 1000w base (105.7 KB) | `-p-500` (18.3 KB) |

`sizes` is **not authorable** — the Designer doesn't expose it and the Data API
rejects it (`set_attributes` errors on `sizes` specifically while accepting any other
attribute). Since every one of these images is `loading="lazy"`, the page embed
corrects `sizes` from the end of the body, which still lands before the fetch.

## Changes made

| asset | before | after | how |
|---|---|---|---|
| BMC logo | 34.7 KB PNG | 17.4 KB WebP | `compress_assets` (in place, keeps asset id, so it reached the footer **component**) |
| DD white logo | 24.8 KB PNG | 12.1 KB WebP | same |
| 6 award seals | 131.8 KB @220px tall | 49.9 KB @2x render height | resized + re-uploaded + rebound on /404 |
| welcome tiles ×6 | 634 KB | 110 KB | `sizes` correction |
| welcome poster | 137.5 KB (1600w) | 53.1 KB (800w) | `sizes` correction |
| 404 poster | 111.8 KB (1600w) | 73.1 KB (1080w) | `sizes` correction |
| 404 covers wall | 99.5 KB (1200w) | 91.8 KB (1080w) | `sizes` correction |

**Per-page image payload, 1440px @1x:**
- /welcome **909 KB → 270 KB (−70%)**
- /404 **481 KB → 322 KB (−33%)**
- champion ×2 **37 KB → 24 KB** (logos only)

## AVIF: measured, and recommended against for now

Webflow's `compress_assets` does support `format: "avif"`. But the CDN does **no
content negotiation** — no `Vary: Accept`, and requesting AVIF returns the stored
WebP. Converting an asset therefore serves `.avif` to *everyone*, from a plain
`<img>` with no `<picture>` fallback, so the ~4-5% of browsers without AVIF get a
broken image.

Measured gain if we did it anyway:

| | current | AVIF q60 |
|---|---|---|
| 3 large photos | 341 KB | 263 KB (−23%) |
| 6 seals (already resized) | 47.8 KB | 34.8 KB |

~50 KB per page. The dimension fixes above already took 33-70%, so AVIF's marginal
gain does not justify a broken hero for one visitor in twenty. It is a single API
call if that calculus changes (support is climbing, and it is reversible by
re-uploading).

## Left alone deliberately

- **`hero-chair.webp` (640w, 28 KB)** — full-bleed but `filter: blur(20px)`. Already
  ideal; a larger asset would be pure waste.
- **Existing WebP assets were not re-compressed.** Re-encoding lossy WebP causes
  generation loss. Only the two PNGs were converted, and the seals were resized from
  source dimensions.
- **`sizes` on the nav/footer logos** — those images live inside the Site Nav and
  Site Footer components, whose internals the Data API will not write. They are only
  12 KB now, and shared/cached across every page, so the remaining waste is small.

## Known quality issue (pre-existing, not introduced)

`dd-ep-card-img` assets are **440x244 rendering into a 505x280 box** — upscaled, and
4x under on a retina screen. This matches the old loader page exactly, so it is not a
regression, but the session card thumbnails are soft. Fixing it needs higher-resolution
source images; the CDN copies are the only ones available.
