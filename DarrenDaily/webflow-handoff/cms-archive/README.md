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

## Status

- **Exit popups: removed from both pages** on 2026-09-06. They led with a live
  session, so with no feed they would have shown a stale or empty list on every
  visit.
- **"Expiring Soon" and "What To Do Instead": still on the pages** as of this
  archive. They still render their hardcoded fallback cards, so they are not
  broken, only frozen. Decide separately whether to keep them on static content,
  repoint them at another source, or remove them.
