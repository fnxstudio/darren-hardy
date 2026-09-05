# Welcome — native Webflow rebuild

Native (Designer-editable) rebuild of `/welcome`, built on the `dd-` class system
(see `DESIGN-SYSTEM.md`). The live loader-embed page is untouched.

- **Native page:** https://darrendaily.webflow.io/welcome-native — page `6a9c5419ca7d99ea081c8328`
- **Live original:** https://darrendaily.webflow.io/welcome — page `6a66d8230844a5c2cd424b8c`
- Source of truth was the **live bundle** `dd-welcome-v10.js` + `dd-welcome-v2.css`, not the
  repo copies — the repo stops at v8 and is stale.

## Structure

Nav and footer are **component instances**. Everything between them is native `wel-*` elements:

| Section | Class | Notes |
|---|---|---|
| Hero | `wel-hero` | bg image, scrim, h1, lead, video facade, scroll cue |
| What happens next | `wel-next` | 3-step timeline + rail + `wel-wn` whitelist card |
| Expiring sessions | `wel-sessions` | two `wel-ep-card`s |
| Member wall | `wel-proof` | 6 `wel-tile`s in 3 parallax `wel-wall-col`s |
| Close band | `wel-close` | dark CTA, `dd-btn` + `dd-btn-line` |

**Pseudo-elements became real elements**, since Webflow classes cannot express them:
`wel-hero-scrim`, `wel-video-scrim`, `wel-tile-scrim`, `wel-step-dot`, `wel-steps-rail-fill`,
`wel-proof-glow`.

## The nav learned two page-level options

Welcome sits on a dark hero and wants the share CTA; the champion pages do neither. So the
Site Nav component now carries **both** logos and the CTA, all hidden by default — the
champion pages are unchanged. Welcome's own embed opts in (`.dd-nav .dd-nav-logo-white`,
`.dd-nav .dd-nav-cta`). Because a page embed's CSS only loads on that page, the embed *is*
the scoping — no site-wide change and no data attributes were needed (attribute writes 409
on this site, same as `set_dom_id`).

## What is in the embed, and why

Only what a Designer class genuinely cannot hold: `@keyframes` (hero entrance, play-button
pulse and ring, cue bob), the `::after` pulse ring, parent-state selectors
(`.wel-video.playing`, `.wel-steps.in`, `:hover` on a child), the nav opt-in above, the exact
900 / 860 / 760 / 720 / 560 breakpoints, and the behaviour script (Vimeo facade, scroll
reveal, wall parallax, share). All entrance animation is gated on `.dd-js`, so nothing is
hidden if JS fails.

## Parity vs. the live page (measured)

| Viewport | Live | Native |
|---|---|---|
| 1440px | 5399 | 5405 |
| 375px | 6081 | 6085 |

Per section at 1440: nav 87/87, hero 1067/1067, member wall 1406/1406, close band 556/556 —
exact. Three known deltas:

- **footer +10** — intended. The footer now uses the ported CMS BMC tag (13px, 180px, natural
  wrap), which runs one line deeper than the live page's older `<br>` version.
- **sessions −10** — `wel-ep-head` renders 169 vs 179. Not yet explained; ~1% of the section.
- **next +6 / −4** — sub-line-height rounding in the whitelist card.

## Corrected during the build

The live section headings end in a **plain** period; only the hero uses the accent
`<span class="dot">`. Three `dd-dot` spans were added by mistake and removed —
`.dd-dot` should appear exactly once on this page.

## NOT built yet

The **exit-intent popup** (`xp-modal`) and the **toast** are not rebuilt. The live page has
both. Everything else on the page is complete.

Also still hardcoded, exactly as on the live page: the two session cards point at
**July 2026** sessions and link to `dd.darrenhardy.com`, not the Webflow Sessions CMS. Those
are months past the 72-hour window they advertise. The original markup carries a note asking
for this to become a Collection List; that was deliberately not done here because it would
change where the cards link.
