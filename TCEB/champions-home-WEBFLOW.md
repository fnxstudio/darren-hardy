# Champions home: Webflow port notes

**Where it goes:**

- **Now:** `thecompoundeffect.com/champion-demo`. It is noindex and kept out of the sitemap. It uses the mock's sample people and data, plus the Hardy Harvest demo.
- **Later:** once the real data and promos replace the demo pieces, the page moves to `/champion`.

**Fonts:**

- The live TCE site loads neither font at site level. `/pre-print` adds the Adobe kit with a `<link>` in its own page head, and Inter is not loaded anywhere, so visitors without Inter installed see Arial.
- **Fix once in site-wide head code:**
  - `<link rel="stylesheet" href="https://use.typekit.net/zze6zxt.css">`
  - a Google Fonts `<link>` for Inter 400–900
- Both are served from Adobe's and Google's own servers, so they cost no Webflow bandwidth.
- Do not upload the font files to Webflow.
- After the site-wide fix, remove the per-page kit link from `/pre-print`.

**Page wrapper:** everything sits inside `<div class="champ-page">`. The reset only applies inside it, so the site's own nav and footer are untouched.

Three files make the page:

- `champions-home-mock.html` is markup only.
- `champions-home.css` holds the styles, in two parts (below).
- `champions-home.js` is the page script.

The clean-up on 2026-10-08 was checked against the previous build at 12 widths (375 to 1440) and three states: signed in with the takeover open, signed out, and the level pop-up open. Element positions and styles match; the only differences are properties with no visual effect.

## Class system

- **Page classes.** Every styled element has one `champ-*` class.
- **Variants and states.** These are combo classes written the Webflow way, as `.champ-btn.is-solid`. Examples: `is-solid`, `is-gold`, `is-on`, `is-open`.
- **Script hooks.** The script only uses ids and `data-*` attributes (`data-opt`, `data-lv`, `data-copy`, `data-enroll`, `data-cd`, `data-stand-link`). Renaming a class never breaks behaviour.
- **States the script toggles.** These classes must exist on the site:
  - `is-on` on `champ-opt` and `champ-pay`
  - `is-open` on `champ-hpop`, `champ-lv` and `champ-full`
  - `is-lift` on `champ-wcard`
  - `is-done` on `champ-btn`

## What goes where

**Part A (Designer):** native classes for the static sections:

- nav
- hero copy
- Where you stand
- studio line
- playbook
- In the Studio
- season track
- Harvest block
- link hub
- quote
- FAQ
- footer

**Part B (custom code, about 33k characters including tokens):**

- **Base styles:** tokens, fonts, the element reset, and `[hidden]{display:none!important}`.
- **Animations:** the keyframes.
- **Pseudo-elements:**
  - track line
  - prize photo fade
  - quote glow
  - FAQ plus sign
  - takeover phone gradient
  - level tip numbers
  - button shine
- **Parent-hover effects:**
  - arrow nudge on buttons
  - deck fan
  - climb card shift
- **Both `<dialog>` pop-ups.**
- **Everything the script renders:**
  - hero deck and live moments
  - podium, tiles and full standings rows
  - the climb and rewards
  - walls
  - waveform
  - level pop-up content

Webflow caps each custom-code field at 50,000 characters. Part B fits in the page head. The script (27k) should go in the page footer, or be hosted on jsDelivr from GitHub if the head and footer share the cap.

## Breakpoints still to map

The page uses 1100, 960, 900, 860, 820, 760, 700, 640, 600, 560, 520 and 440. Webflow only has 991, 767 and 479. Anything not moved onto those three stays in custom code. The rules most worth mapping:

| Now | Webflow tier | What changes |
|---|---|---|
| 960 / 900 / 860 / 820 | 991 | hero stacks, prize photo on top, hub stacks, season goes vertical, takeover goes full screen, nav two rows |
| 760 / 700 / 640 / 600 | 767 | band padding, podium compact, tiles one column, forms one column |
| 560 / 520 / 440 | 479 | small type, single-column perks |
| 1100 | keep in custom code | the climb and the deck scale to fit (the script uses the same 1100 / 960 numbers) |

Moving to these tiers changes layout at in-between widths. Check every section at 991, 900, 820, 767, 600 and 375 after mapping.

## Will not build natively

- **`<dialog>`** has no native element. Build each pop-up as a DOM element with `dom_tag: dialog`, or paste it as an Embed.
- **`<button>` becomes a Link** when built through the API:
  - Promote the controls back to `<button>` at runtime, or give the links `href="#"` plus `preventDefault`. This covers: full standings, copy, the share options, play, close, Maybe later and sign in.
- **`<details>`/`<summary>`** in the FAQ: use an Embed or a DOM element.
- **Forms:**
  - The sign-in and enroll forms are mock behaviour only, and nothing is submitted.
  - Wire them to HubSpot as `hbspt.forms.create` embeds.
- **The script-rendered sections** (board, climb, walls) read from arrays at the top of `champions-home.js`. In production that data comes from HubSpot or a CMS collection.

## Launch switches (in `champions-home.js`)

- `HP_ONCE = true` shows the takeover once per visit. It is `false` while testing.
- `PROMO_LIVE` controls the nav. `true` means the promo clock plus Add a seat; `false` means Get my link.
- `REF_IN` / `REF_OUT` are the referral param names, still waiting on the real HubSpot field.
- The Hardy Harvest dates (`hvEnd`, `simStart`) pretend today is Nov 11. Remove `simStart` for live.

## Decide before launch

- **Wall badges.** On the Platinum Circle wall, the `#1`–`#12` badges sit 4px lower than their 12px offset and are hidden below 860px. Both come from an old rule and were kept as-is; decide whether they should show on phones.
- **Placeholders.** Search for `champ-ph` (yellow highlight) and `Placeholder`. These cover rewards, dates, the FAQ rule, the Champion Friday quote, legal copy and the reward images.
- **Sample people.** Real alumni faces are stand-ins with invented ranks. Swap them for real board data.
