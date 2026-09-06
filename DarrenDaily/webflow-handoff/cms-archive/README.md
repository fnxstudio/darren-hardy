# CMS-dependent blocks on /welcome and /404 — archived 2026-09-06

The Webflow CMS is no longer being used, so anything that read the Sessions
collection stops working. This folder is the record of what was on those two
pages before that content was removed, so it can be rebuilt from static data or
another source later.

## What was CMS-driven, and how

A page-footer script fetched **`/sessions-feed`** (a hidden native Collection
List, Published DESC, Limit 40), read each row by `[data-sf]` attribute, filtered
to sessions that are **published and not yet expired**, and injected them into
two targets:

| target | what it received |
|---|---|
| `.ep-grid` | up to 2 currently-live sessions |
| `[data-xp-list]` | the single newest live session |

Because the filter ran client-side against Published / Expires dates, sessions
revealed themselves on their day and dropped off at 72 hours with no republish.
That whole mechanism dies with the CMS. The script is preserved in
`sessions-feed-script.js`.

Note the script lived **only in the /404 page footer**. /welcome had an empty
footer block, so its blocks were being populated by the sitewide/loader path,
not by its own copy of this script.

## The four blocks

| file | page | what it is |
|---|---|---|
| `404-exit-popup.html` | /404 | exit popup, "Don't miss the latest" |
| `welcome-exit-popup.html` | /welcome | exit popup, same shape |
| `404-sessions-section.html` | /404 | **"What To Do Instead"** section |
| `welcome-sessions-section.html` | /welcome | **"Expiring Soon"** section |

Each is the published HTML exactly as it rendered, including the fallback cards
that were hardcoded in the markup for when the fetch failed. Those fallbacks are
real session slugs and thumbnails and are the most reusable part of this archive:
they are what the page showed with no CMS at all.

## Status: all removed, 2026-09-06

Everything listed above is off both pages. Also removed, because they only made
sense alongside the sessions:

- **Both hero cues** (`hero-cues.html`). Each was an `href="#sessions"` link
  whose copy promised the content: "Good news: the latest sessions are still
  live. Watch them below." on /404 and "Bonus: Watch the latest sessions now
  before they expire." on /welcome. Left in place they would have been dead
  anchors promising something no longer on the page.
- **The feed script**, from the /404 page footer. With `.ep-grid` and
  `[data-xp-list]` both gone it had nothing to write to and was fetching
  `/sessions-feed` on every visit for nothing.

Section order is now:

| page | sections |
|---|---|
| /404 | `dd-hero`, `exp-manifesto`, `dd-close`, `dd-intro` |
| /welcome | `dd-hero`, `wel-next`, `wel-proof`, `dd-close` |

### Deliberately kept

**`dd-close` on /404 still reads "#NeverMiss / Don't let the next one slip by."**
That is the closing opt-in CTA, not a sessions block. It never touched the CMS
and still works, so it stayed.

### Left behind, harmless

Orphaned `.dd-sessions` / `.ep-card` / `.ep-grid` CSS is still in both page
embeds, and both pages' reveal-animation scripts still list `.ep-grid` among
their selectors. Neither matches anything now, so nothing renders or errors.
Worth sweeping next time those embeds are opened.

### Still live, and now unused

The **`/sessions-feed` page** (titled "DO NOT DELETE | Sessions Feed") and the
Sessions CMS collection behind it are untouched. Nothing reads the feed any
more. Deleting them is a separate decision, and the Sessions template at
`/sessions/{slug}` may still depend on that collection.
