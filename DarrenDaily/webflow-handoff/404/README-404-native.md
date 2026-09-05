# /404 — native Webflow rebuild

Page `6a66de9ace5d93878f95f7d5`, rebuilt **in place**. The loader embed
(`#dd-app` + `dd-expired-v8.js` + `dd-expired.css`) is gone; every section is now
a real Designer element.

## Structure

```
.dd-page
  Site Nav          (component 033d1565-317d-9443-72c2-3a51e1dc0940)
  main.dd-main
    section.dd-hero            hero image, scrim, eyebrow, h1, lead, video facade, cue
    section.exp-manifesto      the "subtle stealer of dreams" pull quote
    section.dd-sessions        head + 2 session cards
    section.dd-close           #NeverMiss close band, CTA carries data-open-form
    section.exp-intro          covers wall + vantage copy + stats + 6 seals
  Site Footer       (component 536ecfab-8245-b46e-1146-06542f759ebc)
  .dd-toast         #toast
  .dd-exit          #exitPopup
  .dd-modal         #joinModal (contains #joinForm)
  HtmlEmbed         404-embed.html — must stay the LAST child
```

## Classes

Shared `dd-*` systems reused as-is from /welcome: `dd-page`, `dd-main`,
`dd-container`, `dd-hero*`, `dd-video*`, `dd-cue*`, `dd-sessions`, `dd-ep-*`,
`dd-close*`, `dd-btn*`, `dd-eyebrow*`, `dd-key`, `dd-dot`, `dd-toast`.

**Promoted during this build:** the exit popup was byte-identical to /welcome's,
so `wel-exit*` → `dd-exit*` (12 classes). /welcome's embed was rewritten to match.

**New shared:** `dd-modal*` (join modal chrome).

**Page-scoped `exp-*`:** `exp-eyebrow`, `exp-dotpip`, `exp-hero-em`,
`exp-lead-wide`, `exp-cue-wide`, `exp-manifesto*`, `exp-quote*`, `exp-cite`,
`exp-ep-head-wide`, `exp-ep-lead*`, `exp-close-h2`, `exp-cb-*`, `exp-intro*`,
`exp-covers`, `exp-is-*`, `exp-seal*`.

## What lives in the embed and why

Only what Webflow cannot express natively: `@keyframes`, `::after`
pseudo-elements, parent-state selectors (`.dd-video.playing`, `.dd-exit.open`),
and the **exact original breakpoints** — 900 / 760 / 720 / 520 / 480. Webflow's
are fixed at 991 / 767 / 479, so these are pinned as paired min/max queries
scoped to `.dd-page` (specificity 0,2,0) to beat the native rules.

The embed must remain the last child of `.dd-page`: inline embed scripts run at
parse time, so anything it queries has to already exist in the DOM above it.

## Video

Facade pattern — the poster is a normal image and the Vimeo iframe is only
mounted on click. **Vimeo id `298896900`** ("why 72 hours"), distinct from
/welcome's `298901870`.

## Opt-in modal — interim

`dd-optin-modal-v3.js` is still loaded from the embed. It requires `#joinModal`,
`#joinForm`, and `[data-open-form]`, and it **strips the href** off every
`[data-open-form]` link, so without the modal markup the close-band CTA would be
a dead button. The native `.dd-modal` markup exists purely to keep that working
until the drawer system replaces it.

Two things to know when the drawer lands:

1. The whole `.dd-modal` block and the `<script src>` line can be deleted; keep
   `data-open-form` on the close-band CTA as the trigger hook, or repoint it.
2. `dd-optin-modal-v3.js` creates its HubSpot form with formId
   **`e74fd54c-8940-43db-99e5-6f016b6dfc8a`**, which is dead — the live DD opt-in
   is `41958dbb-…`. The modal currently renders an empty form body. The drawer
   should use the live id.

## Not built

The live page's nav carries a "Join DarrenDaily →" button (`data-open-form`).
It is **not** in the rebuild: writes into the Site Nav component's internals are
rejected by the Data API from this context (reads work via
`query_elements { scope_component_id }`, writes return "element not found"), and
the drawer build will own that trigger anyway. Add it in the Designer, or with
the drawer, as a second default-hidden CTA next to the existing share CTA.

## Still hardcoded

Both session cards (`dd-ep-card`) and both exit-popup sessions point at **July
2026** sessions on `dd.darrenhardy.com`, carried over verbatim from the live
page. They are long past the 72-hour window they advertise. The original markup
asks for these to become a Collection List bound to Sessions; that was not done
because it would change where the cards link.

`CAP_ENABLED = false` in the exit popup, carried over verbatim — the original
flags it "SET TO true BEFORE LAUNCH". It currently shows on every trigger.
`window.ddExitOpen()` is exposed as a QA trigger.

## Reference measurements (live loader version, 1440px)

docH 4587 · nav 87 · hero 1129 · manifesto 579 · sessions 826 · close 672 ·
intro 949 · footer 433
