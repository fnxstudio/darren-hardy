# DarrenDaily — Sessions Intake Sheet (how to use)

Fill in **one row per session** in `Sessions-Intake-Template.csv` (open in Excel or import to
Google Sheets), then send it over and it gets auto-loaded into the Webflow Sessions CMS —
each row becomes a live `/sessions/{slug}` page.

The two example rows at the top are real, already-published sessions — leave them as reference
or delete them before sending.

---

## Fastest path (recommended): 2 columns

If the session already has a page on **dd.darrenhardy.com**, you usually only need:

| Column | Example |
|---|---|
| **Source URL (shortcut)** | `https://dd.darrenhardy.com/the-hidden-danger-of-success-that-no-one-warns-you-about` |
| **Published Date** | `2026-07-28` |

Everything else — title, Vimeo ID, caption, secondary caption, moneyline, meta description,
thumbnail, and social-share image — is pulled from that page automatically. Fill any other
column only when you want to **override** what's on the source page.

No source page (brand-new session)? Then fill the columns marked *required* below.

---

## Columns

**Required (if no Source URL):**
- **Name** — the session title, exactly as it should read. e.g. `The Hidden Danger of Success that No One Warns You About`
- **Published Date** — `YYYY-MM-DD` (e.g. `2026-07-28`). Add a time as `YYYY-MM-DD HH:MM` if it matters; otherwise it defaults to the morning send. Drives the date shown on the page, sort order, and the 72-hour expiry.
- **Vimeo ID** — the numeric ID only, e.g. `1210284296` (from `vimeo.com/1210284296`).

**Content (fill what applies):**
- **Caption** — the comment prompt under the video. Wrap the lead-in in `**double asterisks**` for bold, e.g. `**Drop in the comments below** the pressure you will manufacture today…`
- **Secondary Caption** — the follow-up / CTA copy that sits right under the caption (e.g. the "Refer an A-Player / DarrenHardy.com/Careers" block).
- **Moneyline Quote** — the key pull-quote for the right column.
- **Moneyline Attribution** — who said it, e.g. `Darren Hardy` or `Jim Rohn`.
- **Meta Description** — ~155 characters for search + social preview.

**Optional per-post banners** (leave blank to use the site defaults):
- **Inline Banner Image URL** / **Inline Banner Link** / **Inline Banner Alt** — an in-content banner under the video.
- **Sticky Banner Image URL** / **Sticky Banner Link** / **Sticky Button Copy** / **Sticky Button Color (hex)** — the pinned top strip.
- **Share Tweet Copy** — custom text for the X/Twitter share button only (LinkedIn/Facebook build their own preview from the page).

**AUTO — leave blank** (filled for you; only enter a value to override):
- **Slug** — from the Name.
- **Thumbnail URL** — the Vimeo video poster, from the Vimeo ID.
- **Social Share Image URL** — the OG/social image; defaults to the thumbnail.
- **SEO Title** — `Name · DarrenDaily`.
- **Expire Date** — Published + 72 hours.

---

## Notes
- **Images** can be pasted as any public URL (a dd.darrenhardy.com/hubfs link, a Vimeo poster, etc.) — they get uploaded into Webflow automatically. You don't need to attach files.
- **The Featured "Refer an A-Player" card** in the right column is a site-wide HubSpot CTA — it's the same on every session and is **not** set per row here.
- **Bold in captions:** `**like this**`. Line breaks in a caption are fine (write them in the cell).
- One row = one session. Send the sheet whenever it's ready; new rows can be added anytime.
