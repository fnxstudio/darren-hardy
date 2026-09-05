# DarrenDaily On-Demand · podcast site

`darrendaily-on-demand.html` — a single self-contained page that replaces
[darrenhardy.com/darrendaily-on-demand](https://darrenhardy.com/darrendaily-on-demand/).

Built on the DarrenDaily light/warm system already in this folder (white +
cool greys, brand red `#a72632`, deep-maroon feature bands, Inter 900, 4px
radius). It shares the tokens in `webflow-handoff/final/darrendaily.css`, so
it sits next to the DD home / welcome / expired pages without a reskin.

## Nothing on this page expires

That is the design constraint everything else follows from. There is **no
"latest episodes" feed and no live RSS fetch**, so the page never needs a
daily push and can sit untouched for a year without going stale.

What it carries instead:

1. **One featured episode**, hand-picked and evergreen. Currently *The
   Procrastination Kill Switch* (5:19) — universal, curiosity-led, and short
   enough to back the five-minute promise. It is `EPISODES[0]`; to feature a
   different one, move that row to the top of the array.
2. **Six curated runs**, hand-picked out of the full 1,500-plus archive.
   Tapping one plays it straight through: the run becomes the queue, so
   autoplay walks it, and its episodes expand in place under the cards.
3. **Podcast app links** for anyone who wants the daily drop. That is the
   whole subscribe path — Apple, Spotify, YouTube, iHeart, Amazon Music, RSS,
   each with its real brand mark in its real brand colour.

The main CTA is, and stays, the DarrenDaily opt-in.

### The runs

| Run | For |
|---|---|
| Leading People | anyone with a team |
| Building The Business | founders and owners |
| Getting It Done | focus, procrastination, time |
| When It's Hard | fear, failure, setbacks |
| The Inner Game | beliefs, confidence, ceilings |
| Winning People Over | influence, trust, presence |

Eight episodes each, none over 11 minutes, no episode used twice, 43–54
minutes per run.

## Where the data comes from

Everything on the page is real. Nothing is invented.

| Claim | Source |
|---|---|
| 1,519 episodes | the Libsyn RSS feed (now 1,524 and climbing, which is the point) |
| 4.9 stars, 1,709 ratings | Apple Podcasts aggregate rating |
| 10M+ listens, 350,000 people | the current live page and the feed's own show description |
| Every review quote | a real verbatim 5-star Apple Podcasts review |

### Checking it still resolves

```bash
python3 DarrenDaily/refresh-ddod-data.py
```

Nothing here needs refreshing on a schedule. What the script catches is
upstream breakage: a curated episode pulled from the feed, retitled, or
re-uploaded under a new filename, leaving the page pointed at a dead mp3. Add
`--fix` to write back changed titles and durations. It will never add, remove
or reorder episodes — the curation is a human decision.

Worth running before any big push to the page, and if a play button ever
fails.

## Faces

Three different kinds, kept deliberately separate:

- **Darren** — `dh-face.webp`, cropped from `dd-chair.webp`, at the top of the
  opt-in so his face is on the ask. Plus `dd-chair.webp` full in the About band.
- **The Room** — nine real, named members from `hc-members/`, squared and
  sized to 300px in `faces/`. **This band deliberately carries no quotes.**
  The review wall's words belong to named Apple reviewers; pairing one
  person's face with another person's words would be a fabrication. Faces
  here, words there.
- **Review avatars** — monogram chips, still placeholders. They are not
  photographs on purpose, for the same reason. To drop in a real listener
  headshot, add a **fifth** item to a `REVIEWS` row:

```js
["Justin Woodbury", "Simply Life Changing", "If you aren't listening…", "the highlighted phrase", "faces/Someone.webp"],
```

`REVIEWS` rows are `[reviewer, title, body, highlight, photo?]`. The 4th item
is the phrase given the marker-pen highlight, and it is stored as an **exact
slice of the body**, so a highlight can never reword or misquote a review.

## The HubSpot opt-in

Portal `2518645`, form `41958dbb-3c3a-439b-b747-bb96acf50680` — the opt-in
actually running on darrendaily.com/join: First Name, Email, Role, plus hidden
`dd_id` / `mrt` / UTM fields.

It is deliberately **not** `e74fd54c-8940-43db-99e5-6f016b6dfc8a`, which
`webflow-handoff/dd-optin-modal.js` and `dd-optin-upgrade.js` still point at.
That guid returns `404 resource not found`, so **those two scripts render no
form at all wherever they still run.** Worth checking the DD home, welcome and
expired pages. Not fixed here; outside this page.

If HubSpot is ever blocked or slow, a styled fallback form appears after six
seconds and hands the visitor to `darrendaily.com/join`. No personal data ever
goes into a URL.

## Notes

- `meta robots noindex, nofollow` is set, per the standing rule for this repo.
- No em dashes anywhere, including inside episode blurbs and review quotes.
- `#NeverMiss` is written as the hashtag, never as prose.
- The stats band counts up on scroll, once, 900ms, eased out. Each number
  keeps its finished value in the markup, so it reads correctly with no JS and
  under `prefers-reduced-motion`.
- Audio is hosted by Libsyn and streams from `traffic.libsyn.com`, which 302s
  to a signed CloudFront URL. The `traffic` URL is the stable permalink, so
  baking the filename is safe. Range requests are what make the scrubber work.
  No audio is stored in this repo and none is served from Webflow.
