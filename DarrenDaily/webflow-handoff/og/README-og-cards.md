# DarrenDaily social cards

`og-dd-home-1200.jpg` (94 KB) and `og-ddod-1200.jpg` (74 KB), both **1200x630**.
Live as the `og:image` on `/` and `/darrendaily-on-demand`.

## Why they exist

Home's `og:image` was the **361 KB hero photo at 2311px** - the full-resolution
garden shot doing social-card duty. That is where the 4.33 MB across 12
requests in the asset bandwidth report came from: scrapers refetching it. The
DDOD page had **no `og:image` at all**, so sharing it produced a preview with
no picture.

## The layout

They follow the page's own visual language rather than the older
`og-image.jpg` (which is the Darren Hardy corporate card: dark ground, gold
rules, "BE THE EXCEPTION"). These are DarrenDaily: the morning/light ground
`#f3f5f8`, Inter Display Black uppercase headline in `#14171c` with the last
line in `#a72632`, the short red eyebrow rule, the DD logo bottom-left, and the
photograph bleeding off the right edge from x=690.

| | home | on-demand |
|---|---|---|
| eyebrow | DAILY MENTORING WITH DARREN HARDY | THE DARRENDAILY PODCAST |
| headline | START EVERY DAY / WITH AN / **ADVANTAGE.** | YOUR 5-MINUTE / STRATEGIC / ADVANTAGE. / **ON-DEMAND.** |
| photo | `hero-garden.webp` cropped right | `DH_pod_room.webp` (hardybmc.com) |

Both headlines are the pages' own H1s, so the card matches what you land on.

## Rebuilding them

The generator auto-fits the headline: it steps the size down from 64px until
every line clears the 598px text column. The first DDOD attempt was built at a
fixed 62px and "STRATEGIC ADVANTAGE." ran under the photo, which is what the
fitter exists to prevent. **If you change the copy, re-run rather than nudging
the size by hand.**

Fonts are Inter Display Black + Inter SemiBold from the rsms/inter v4.0
release; Google's CDN only serves woff2, which PIL cannot read.

Photography is real and cropped only. Nothing here is generated.
