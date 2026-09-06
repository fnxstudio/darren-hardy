# The Compound Effect audiobook offer — ARCHIVED, not live

Pulled from `/darrendaily-on-demand` on 2026-09-06 on Darren's note. Everything
needed to rebuild it elsewhere is here. **Nothing in this folder is on any live
page.**

## Why it was pulled

Darren's edit: **people do not "join" DarrenDaily On-Demand by email — they
subscribe to it on their podcast platform of choice.** The audiobook was framed
as a gift *for joining*, so once the join framing came off the podcast page the
gift had nothing to attach to.

## What is here

| file | what |
|---|---|
| `gift-section.html` | the whole dark maroon `#join` section, as published |
| `gift-panel-drawer-and-popup.html` | the shared `.ddod-ab-strip` panel that both the opt-in drawer and the exit popup borrowed |
| `tce-styles.css` | all 25 `.ddod-ab-*`, `.ddod-jn-by-*` and `.ddod-join-*` rules, as compiled by Webflow |
| `assets/tce-audiobook-phone-buds.webp` | the phone mock **with earbuds** (900x1194) — the finished one |
| `assets/tce-audiobook-phone.webp` | the earlier mock, no earbuds |
| `assets/ce-front-cover-source.webp` | the real jacket used to build the mock |
| `assets/dh-pod-mic-200.webp` | mirrored studio mic portrait from the credibility row |
| `ddod-player-v22-parked-audiobook-form.js` | the build wired to the TCE audiobook HubSpot form |

## The copy, in full

**Eyebrow** Limited time gift
**Headline** Join today. **Get the bestseller, free.**
**Credibility row** One more way Darren gets you #BetterEveryDay. / The whole
method, in his voice, whenever you want more.
**Lead** What you do on an ordinary Tuesday is what decides the year. Darren
wrote the book on the concept and the complete unabridged audiobook is yours
the moment you join DarrenDaily.
**Bullets**
- The **complete, unabridged audiobook**, read by Darren himself.
- Yours the **moment you join**. Free, and nothing to return.
- A **companion** to the five-minute session that lands every weekday morning.

**Proof line** 2 million copies sold · New York Times bestseller · 4.7 stars
from 21,000+ ratings
**Button** Join + the audiobook, free
**Fine print** Free forever. No ads, no sponsors, no reselling your address.

**Gift panel (drawer + exit popup)** LIMITED TIME GIFT / **The Compound Effect
complete audiobook.** Two million copies sold. Yours to start listening to
today, free.

## Things learned building it, worth keeping

- **The audiobook HubSpot form `83c40a17-…` renders as a cross-origin iframe**,
  so none of the drawer's form CSS reaches it. That is why v22 is parked rather
  than live. The DarrenDaily opt-in `41958dbb-…` renders inline and is
  styleable. If this offer is rebuilt, use the DD form or accept an unstyled
  iframe.
- **TCE is not the source of DarrenDaily** and copy may never imply it is. The
  only honest bridge is that it is another thing from Darren. An earlier draft
  claiming the playlists traced back to the book was rejected outright.
- **The jacket in the mock reads "OVER 1 MILLION COPIES SOLD"** while the copy
  says two million. That is the real 10th anniversary jacket and the client
  accepted it deliberately. Do not raise it again.
- The proof line's claims are joined with **non-breaking spaces** so a wrap can
  only ever land on a ` · ` separator and no single word can orphan.
