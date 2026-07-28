# DarrenDaily Sessions — Claude Bulk-Build Instructions

**Give this file to Claude together with your filled-in `Sessions-Intake-Template.csv`.**
Claude will turn each row of the spreadsheet into a live `/sessions/{slug}` page in Webflow.

Works in **Claude Code** or in **Claude desktop/web (Cowork)** — as long as the **Webflow connector** is
connected to the *Darren Hardy LLC* site. Nothing here needs the Webflow Designer to be open.

---

## What Claude needs before starting

1. **Webflow connector authenticated** to the Darren Hardy LLC Workspace (the site that hosts `darrendaily`).
2. **This file** + the **filled `Sessions-Intake-Template.csv`** (one row per session).
3. Confirm the target collection is **Sessions** — `collection_id: 6a681903f2f9b0d13a2b5794`
   (site_id: `6a66d7a6f9d116b514a13ae1`). If the id ever changes, re-discover it with
   `data_cms_tool → get_collection_list`, and confirm field slugs with `get_collection_details`.

If the connector is not connected, STOP and tell the user how to connect it (Claude settings →
Connectors → Webflow → authorize the Darren Hardy LLC site). Do not guess or fabricate.

---

## Golden rules (do not break these)

- **NO em dashes** anywhere in copy. **NO pink.** **NO fabricated content** — if a field is missing and
  can't be pulled from the Source URL, leave it blank; never invent quotes or captions.
- **On-page images become WebP; the social-share image stays PNG/JPG.** (See "Images" below.)
- **One row = one session.** Process each row independently; if one row fails, keep going and report it.
- **Never touch other pages, other collections, or site settings.** Only create/update Sessions items.
- Work in **drafts first**, show the user a summary, then publish once they confirm (unless they say
  "publish as you go").

---

## The fastest path (what most rows will be)

If a row has a **Source URL** (a live `dd.darrenhardy.com/...` page) and a **Published Date**, pull
everything else from that page: Name/title, Vimeo ID, caption, secondary caption, moneyline quote +
attribution, meta description, and the poster image. Only use the other columns when they are filled in —
a filled column is an **override** of what's on the source page.

If there is no Source URL, use the columns the team filled in.

## Batch window & scheduling (important)

You can safely load **up to ~30 days of sessions ahead** in a single batch. Each session **reveals
itself on its Published date and expires 72 hours later, automatically** — after a single site Publish,
the pages rotate day by day with no further clicks. This is driven entirely by the `published` and
`expire` CMS dates (no plugin, no scheduled publishing).

- **Do:** load a batch, Publish once, and leave it — the site self-rotates for the whole window.
- **Keep each batch within ~30 days.** The "latest sessions" window holds ~30 days of posts; loading
  further ahead than that can push the earliest still-upcoming post out of the window.
- Future-dated posts stay hidden from all the feeds/exit-pops until their day arrives; expired ones drop
  off on their own. You do **not** re-publish to reveal or expire — only to add a new batch.

---

## Step-by-step, per row

1. **Gather the fields** (from the Source URL and/or the row's columns).
2. **Derive the AUTO fields**:
   - `slug` = the Name, lowercased, spaces → hyphens, punctuation stripped.
   - `expire` = `published` + 72 hours.
   - `seo-title` = Name + ` · DarrenDaily` (unless a SEO Title override is given).
   - `thumbnail` = the Vimeo poster for the Vimeo ID, unless a Thumbnail URL is given.
   - `social-share-image` = defaults to the thumbnail unless a Social Share Image URL is given.
3. **Handle images** (see below) → get a Webflow asset `{fileId, url}` for each image field.
4. **Create the item** as a draft with `data_cms_tool → create_collection_items`
   (fieldData keyed by the slugs in the mapping table).
5. After all rows: **publish** the items with `publish_collection_items`, then tell the user to do a
   **full site Publish** in Webflow so the cross-page "latest sessions" feed refreshes.
6. **Report** a table: session name, slug, live URL, and anything that needed a fallback or failed.

---

## Field mapping (CSV column → CMS field slug)

| CSV column | CMS slug | Type | Notes |
|---|---|---|---|
| Name (required) | `name` | text | required |
| — (derived) | `slug` | text | required; from Name |
| Published Date (required) | `published` | date | drives the on-page date, sort order, and expiry |
| — (derived) | `expire` | date | Published + 72h |
| Vimeo ID | `vimeo-id` | text | numeric id only |
| Caption | `caption` | rich text | `**bold**` lead-ins allowed |
| Secondary Caption | `secondary-caption` | rich text | the follow-up / CTA copy |
| Secondary Caption Smart CTA | `secondary-caption-smart-cta` | text | HubSpot CTA UUID (portrait CTA) — optional |
| Moneyline Quote | `moneyline-quote` | text | right-column pull quote |
| Moneyline Attribution | `moneyline-attribution` | text | e.g. Darren Hardy |
| Meta Description | `meta-description` | text | ~155 chars |
| Inline Banner Image URL | `inline-banner-image` | image | **WebP** |
| Inline Banner Link | `inline-banner-url` | link | |
| Inline Banner Alt | `inline-banner-alt` | text | |
| Inline Banner Smart CTA | `inline-banner-smart-cta` | text | HubSpot CTA UUID (landscape CTA) — optional |
| Sticky Banner Image URL | `sticky-banner-image` | image | **WebP** |
| Sticky Banner Link | `sticky-url` | link | |
| Sticky Button Copy | `sticky-button-copy` | text | |
| Sticky Button Color (hex) | `sticky-button-color` | color | |
| Sticky Smart CTA | `sticky-smart-cta` | text | HubSpot CTA UUID (wide CTA) — optional |
| Featured CTA ID | `featured-cta-id` | text | HubSpot CTA UUID for the right-column card; blank = default |
| Share Tweet Copy | `share-tweet-copy` | text | X/Twitter only |
| Thumbnail URL (AUTO) | `thumbnail` | image | **WebP**; from Vimeo poster if blank |
| Social Share Image URL (AUTO) | `social-share-image` | image | **keep PNG/JPG** (see below) |
| Thumbnail Alt | `thumbnail-alt` | text | defaults to Name |
| SEO Title (AUTO) | `seo-title` | text | Name + ` · DarrenDaily` |

CMS image fields are set as `{ "fileId": "<assetId>", "url": "<https CDN url>" }`.

---

## Images — the WebP rule

**Every image that renders ON the page becomes WebP. The social-share (OG) image stays PNG/JPG.**
(A WebP OG image shows a blank preview on some LinkedIn/Facebook link scrapers.)

For each **on-page** image (thumbnail/poster, inline banner, sticky banner):
1. Upload the source image to Webflow (any format is fine as the source).
2. Convert it to WebP **in place** with `data_assets_tool → compress_assets`, `format: "webp"`
   (batch up to 100 asset ids), then poll `get_compression_task` until `completed`.
3. **Re-point the CMS image field to the compressed WebP copy.** Compression converts the *site asset*
   but the CMS field keeps its own copy of the old format, so it will keep serving the old file until you
   re-point it: set the field to `{ fileId: <compressed asset id>, url: <compressed .webp CDN url> }`,
   then publish.
4. **Social Share Image only:** skip steps 2–3 — leave it PNG/JPG.

Rule of thumb: renders on the page → WebP. Social-preview image only → PNG/JPG.

---

## HubSpot CTAs (optional per row)

All CTA fields take a **HubSpot CTA UUID** (portal 2518645), not an embed. You can find a CTA's id in the
`hbspt.cta.load(2518645, '<uuid>')` call on the matching `dd.darrenhardy.com` page, or in HubSpot.
- `featured-cta-id` → the right-column "Refer an A-Player" card (portrait CTA). Blank = site default.
- `inline-banner-smart-cta` / `sticky-smart-cta` / `secondary-caption-smart-cta` → optional overrides for
  those slots. Match the CTA's shape to the slot (landscape / wide / portrait).

The template renders these itself — you only set the UUID text; do not paste embed code.

---

## After the run

- Publish the created items (`publish_collection_items`).
- Tell the user: **do a full site Publish in Webflow** so the "latest sessions" feed and any brand-new
  pages go live.
- Report back a table of what was created (name, slug, `/sessions/{slug}` URL) and flag any row that used
  a fallback or failed, with the reason.

---

## What NOT to do

- Do not edit the Sessions **template**, the site **custom code**, other **collections**, or **settings**.
- Do not create HubSpot CTAs or change HubSpot — only reference existing CTA ids.
- Do not invent copy, quotes, dates, or images.
- Do not publish the whole site without telling the user (item-publish is fine; a full site publish is the
  user's call).
