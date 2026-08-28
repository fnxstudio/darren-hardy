# DarrenDaily On-Demand · podcast site

`darrendaily-on-demand.html` — a single self-contained page that replaces
[darrenhardy.com/darrendaily-on-demand](https://darrenhardy.com/darrendaily-on-demand/).

Built on the DarrenDaily light/warm system already in this folder (white +
cool greys, brand red `#a72632`, deep-maroon feature bands, Inter 900, 4px
radius). It shares the tokens in `webflow-handoff/final/darrendaily.css`, so
it sits next to the DD home / welcome / expired pages without a reskin.

## The one job

Get a visitor listening inside ten seconds, then ask for the daily-mentoring
opt-in once they have heard what the show is.

- The hero **is** a player. Newest episode already loaded, one tap to play.
- A **sticky bottom player** follows them down the page, so browsing never
  interrupts listening. Back 15 / forward 30, speed toggle, scrubber,
  keyboard (space, left, right).
- **Autoplay-next** at the end of an episode, straight down the feed.
- **Resume where you stopped** on the next visit (localStorage).
- The episode feed is the second section, not buried at the bottom.

## Where the data comes from

Everything on the page is real. Nothing is invented.

| Claim | Source |
|---|---|
| 1,519 episodes | live count from the Libsyn RSS feed |
| 4.9 stars, 1,709 ratings | Apple Podcasts aggregate rating |
| 10M+ listens, 350,000 people | the current live page and the feed's own show description |
| Every review quote | a real verbatim 5-star Apple Podcasts review |

Episodes: the 30 most recent are baked into the page so it renders and plays
with no network round trip. **Open The Full Archive** fetches the live RSS
(CORS is open) and loads all 1,519 into the search. If that request ever
fails the button turns into a link to Apple Podcasts, so it is never a dead
end.

### Refreshing

```bash
python3 DarrenDaily/refresh-ddod-data.py
```

Re-bakes the newest 30 episodes and updates the episode counts in the copy.
Monthly is plenty; the live-archive button covers the gap in between.

Add `--reviews` to re-pull the Apple review set. Left off by default because
the shipped 30 were hand-picked for length and variety, and a blind re-pull
would replace that curation. If you do re-pull, re-check the 4.9 / 1,709
figures on the Apple page at the same time.

## Two things to settle before launch

**1. Reviewer avatars are placeholders.** They render as monogram chips on a
brand-tone circle. They are deliberately not photographs: the quotes belong
to real, named Apple reviewers, so pairing them with a stock or generated
face would misrepresent a real person. To drop in real listener headshots,
add a fourth item to any `REVIEWS` row:

```js
["Justin Woodbury", "Simply Life Changing", "If you aren't listening…", "hc-members/Dan-Page-studio-blue.webp"],
```

The renderer swaps the chip for the photo automatically, same size and crop.

**2. The HubSpot opt-in is wired and working, but note which form.** The join
section embeds portal `2518645`, form `41958dbb-3c3a-439b-b747-bb96acf50680`,
which is the opt-in actually running on darrendaily.com/join today: First
Name, Email, Role, plus hidden `dd_id` / `mrt` / UTM fields that ride along.
Verified rendering and styled to match the card.

It is deliberately **not** `e74fd54c-8940-43db-99e5-6f016b6dfc8a`, the guid
that `webflow-handoff/dd-optin-modal.js` and `dd-optin-upgrade.js` still point
at. That form now returns `404 resource not found` from HubSpot:

```
https://forms.hsforms.com/embed/v3/form/2518645/e74fd54c-8940-43db-99e5-6f016b6dfc8a/json
-> {"status":"error","message":"resource not found"}
```

**Those two scripts therefore render no form at all wherever they are still
running.** Worth checking the DD home, welcome and expired pages against the
live site. Not fixed here, since it is outside this page.

If HubSpot is ever blocked or slow, this page reveals a styled fallback form
after six seconds that hands the visitor to `darrendaily.com/join`. No
personal data ever goes into a URL.

## Notes

- `meta robots noindex, nofollow` is set, per the standing rule for pages in
  this repo.
- No em dashes anywhere, including inside the episode blurbs and the review
  quotes (the refresh script normalises them on the way in).
- `#NeverMiss` is written as the hashtag, never as prose.
- `ddod-artwork.webp` is the real show cover, pulled from Apple at 900px.
- Assets used: `dd-logo-color.svg`, `dd-logo-white.png`, `dd-chair.webp`,
  `ddod-artwork.webp`, `media-logos/*`, `fonts/inter-*.woff2`,
  `favicon-dd.png`, `apple-touch-icon.png`.
