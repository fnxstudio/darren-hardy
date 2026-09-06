# DarrenDaily social cards

`og-dd-home-1200.jpg` (94 KB) and `og-ddod-cover-1200.jpg` (83 KB), both **1200x630**.
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
| right | `hero-garden.webp` cropped, bleeding off the edge | the **square show artwork**, 428px, with the same soft lift it has on the page |

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

## The on-demand card carries the cover, not a photo

First build used the studio mic photo. The show artwork is the thing people
recognise in a feed, so it sits inset at 428px on the light ground with a
blurred drop shadow, matching how the cover sits in the page hero. A square
asset cannot bleed off the edge the way the home photograph does, so the two
cards differ on the right-hand side by design.

## Metadata went stale before the cards did

The on-demand page's own SEO and OG text still described the daily rather than
this archive, and the OG description opened on **"Press play"**, which is copy
the page no longer uses. Now:

- **title** DarrenDaily On-Demand · Your 5-Minute Strategic Advantage
- **description** More than 1,500 five-minute sessions from Darren Hardy, free
  and on-demand. Six hand-picked playlists to start with. No ads, no sponsors, ever.
- **og:title** Your 5-Minute Strategic Advantage. On-Demand.
- **og:description** Sharper about what actually matters, in five minutes. More
  than 1,500 sessions from Darren Hardy, free and on-demand, with six playlists to start.

**Metadata is not covered by any of the page checks.** It lives in page
settings, not markup, so nothing about editing the page surfaces that it has
drifted. Re-read it whenever the H1 or the offer changes.

## Set the share image as `imageUrl`, not `imageAssetId`

`update_page_settings` accepts either, and **both publish a correct
`og:image`** - but only `imageUrl` shows up in the Designer's SEO/Share panel.
Set as `imageAssetId` the card is live on the page yet the picker in Webflow
looks empty, so it reads as missing and **a Designer save could wipe it**.

The two fields are mutually exclusive; sending one as `null` alongside the
other is rejected with "Provide either openGraph.imageUrl or
openGraph.imageAssetId, not both." Send `imageUrl` on its own and it replaces
the asset-id form.

/welcome and /404 already stored theirs as `imageUrl`, which is why they were
visible in the Designer all along.
