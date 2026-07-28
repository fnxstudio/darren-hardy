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
- **Featured CTA ID** — HubSpot CTA UUID for the right-column featured "Refer an A-Player" card (see Notes). Blank = the default CTA.

**AUTO — leave blank** (filled for you; only enter a value to override):
- **Slug** — from the Name.
- **Thumbnail URL** — the Vimeo video poster, from the Vimeo ID.
- **Social Share Image URL** — the OG/social image; defaults to the thumbnail.
- **SEO Title** — `Name · DarrenDaily`.
- **Expire Date** — Published + 72 hours.

---

## Notes
- **Images** can be pasted as any public URL (a dd.darrenhardy.com/hubfs link, a Vimeo poster, etc.) — they get uploaded into Webflow automatically. You don't need to attach files.
- **All images are served as WebP.** Every image that renders *on the page* (thumbnail/poster, inline banner, sticky banner) is converted to optimized WebP on upload — you don't do anything, it's automatic. Paste whatever URL you have (JPG, PNG, whatever) and it comes out WebP. The one exception is the **Social Share Image** (the OG/social-preview image), which stays PNG/JPG on purpose — some LinkedIn/Facebook link scrapers show a blank preview for WebP OG images.
- **The Featured "Refer an A-Player" card** in the right column is a HubSpot CTA, set **per session** in the **Featured CTA ID** column. Paste just the HubSpot CTA UUID (e.g. `c31dd636-fbcf-4f96-96d5-2f5a936f0822`) — you can grab it from the matching page on `dd.darrenhardy.com` (it's the id in that page's `hbspt.cta.load(2518645, '…')` call) or from HubSpot. Leave it blank to fall back to the default Refer-an-A-Player CTA. The image and click-through are pulled live from HubSpot, so editing the creative there updates every session automatically — no re-upload.
- **Bold in captions:** `**like this**`. Line breaks in a caption are fine (write them in the cell).
- One row = one session. Send the sheet whenever it's ready; new rows can be added anytime.

---

## For the automation (whoever runs the Claude Code bulk upload)

When loading rows from this sheet into the Sessions CMS, **every on-page image must end up as WebP**. Do this per image:

1. Upload the source image to Webflow (any format is fine as the source).
2. Convert it to WebP **in place** with the Webflow Data API — `data_assets_tool → compress_assets` with `format: "webp"` (batch up to 100 asset IDs per call), then poll `get_compression_task` until `completed`.
3. **Re-bind the CMS image field to the WebP copy.** Compression converts the *site asset* but the CMS field keeps its own JPEG/PNG copy, so it will still serve the old format until you re-point it. Update the item's image field to `{ fileId: <compressed asset id>, url: <compressed .webp CDN url> }` via `update_collection_items`, then `publish_collection_items`.
4. **Skip the Social Share Image** — leave that one PNG/JPG (WebP OG images break some social scrapers).

Rule of thumb: if it renders on the page, it's WebP; if it's only the social-preview image, it stays PNG/JPG.
