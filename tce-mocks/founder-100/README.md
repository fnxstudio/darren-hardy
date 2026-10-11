# The Founder 100 · page mock

Live mock: https://fnxstudio.github.io/darren-hardy/tce-mocks/founder-100/

A Founder 100 member is anyone who reserves the $995 FOUNDER 100 tier on the pre-print checkout.
That purchase is their membership. The class closes at 100.

## Review controls (mock only)

The bar in the bottom corner switches:

- **Look:** DH brief (ivory, obsidian, champagne, serif) or the TCEB brand guide (white, black, red, Bebas).
- **Roster:** Live (the real roster, empty for now) or Specimen (37 blank layout cards to show a part-filled hall).
  The specimen cards have no names, faces or companies.

The state is kept in the link, so a link you send opens the same way, for example `?look=guide&roster=specimen`.
Delete the bar before the Webflow port.

## Adding a Founder

Everything lives in `roster.js`. Nothing else needs to change.

1. When a FOUNDER 100 order comes in, add an entry with `publicationApproved: false`.
   It counts toward the 100 straight away but stays off the page.
2. Collect the name to print, the company, an optional title and short bio, and a headshot
   (4:5, at least 960x1200). Save the headshot in `portraits/first-last.webp`.
3. Send the Founder exactly what will be shown. When they approve it, set `publicationApproved: true`.
4. Set `publicProfileEnabled: true` if they should have their own shareable page.
5. Commit and push. The page updates on its own.

If orders run ahead of the entries in the file, set `positionsTaken` to the number of orders.

## Placeholders that still need real assets

- **The open book spread** is drawn in CSS to show the idea. Replace it with the book designer's real spread.
- **The share image** is the 3D book for now. A 1200x630 Founder 100 card is still needed.
- **The letter from Darren** is a draft and needs his approval.
- **Specimen roster** is for layout review only.

## Open items

- Spiffy has no field for the name to print or the headshot, so someone has to own collecting them.
- The checkout opens with `?tceb_hardcover=100`, but preselecting a tier by link is unproven on the live checkout.
- Nothing in Spiffy stops a 101st order. The cap needs an inventory limit on that tier.
- On the real site each profile lives at `/founder-100/first-last` (a Webflow CMS collection). In this mock it is `?founder=first-last`.
