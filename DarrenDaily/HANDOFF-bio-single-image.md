# RUNBOOK: replace the SUCCESS-covers bio wall with ONE image (Sessions Template)

**This file is written to be executed by Claude Code with the Webflow MCP connected.**
Drop this file and `dh-covers.webp` (they travel together) into a Claude Code session that has
Webflow access, and say: *"Run this runbook."*

**Claude: read the whole file before doing anything.** Phase 0 is read-only. Change nothing until a
human has approved the outline you present at the end of Phase 0.

**Prefer to just do it by hand?** Appendix A is the plain Designer version. Both paths are supported.

---

## What this change does

On the DarrenDaily **Sessions Template**, the bio section ("Behind the covers. Behind closed doors.")
currently builds a wall of **37 separate cover images** in JavaScript, layers a Darren cutout on top,
and runs a scroll parallax. This replaces all of it with **one pre-composited image** — same look
(Darren in colour, covers in high-quality B&W), dropping that section from **~2.5 MB to ~100 KB on
every session page**.

The layout does not change. **No JavaScript needs to be edited** — see Step 4.

**The image:** `dh-covers.webp`, one 1200×750 WebP, ~100 KB, provided alongside this document. Open it
directly to see the target: Darren in full colour against the SUCCESS covers in high-quality B&W,
with a subtle vignette so he pops. It's centred on Darren, so it crops cleanly to both the tall
mobile shape and the wide desktop one.

---

## Read this before you start: it must be a real Image element

**Place the image as a native Webflow Image element — not a CSS background, and not an `<img>`
built in JavaScript.**

That's what makes Webflow emit a responsive `srcset`, so each device pulls a right-sized variant
rather than the full file. Per-view weight lands around **30 KB phones / 60 KB tablets / 88 KB
laptops**, with only large retina desktops pulling the full ~100 KB. (The old covers wall pulled
~2.5 MB every view, on every device.)

This is about **element type, not upload method** — Webflow generates the size variants for uploaded
assets either way, Designer or API. What loses you the `srcset` is a background image or a
JS-created `<img>`. (That's exactly why the current covers wall has no responsive sizing: those 37
tiles are built in JavaScript.)

**Claude: do not re-export, re-compress, or resize the image** — it's already at its size budget.
Uploading it through the API is fine.

---

## Known-good facts (verified — use these, don't rediscover them)

| Thing | Value |
|---|---|
| Site ID | `6a66d7a6f9d116b514a13ae1` |
| Sessions Template page ID | `6a681903f2f9b0d13a2b57a7` |
| Session behavior script | hosted `dd-sessions.js`, loaded site-wide as registered script `ddsessions` |

**Current DOM inside the bio section** (confirmed against a live session page):

```html
<div class="bio-wall">
  <div class="dd-covers"></div>                       <!-- empty; JS fills it with 37 tiles -->
  <img class="bio-cutout" src="…Wall-DH-blue2.webp">  <!-- the Darren cutout -->
</div>
```

**Why no script edit is needed:** in `dd-sessions.js`, the covers routine opens with

```js
var grid = document.querySelector('.dd-covers'); if (!grid) return;
var wall = document.querySelector('.bio-wall');  if (!wall) return;
```

Delete `.dd-covers` and the whole routine returns immediately — **the covers build and the scroll
parallax both stop on their own.** The leftover code is inert, not broken.

> Claude, tool names are given in base form (`data_element_tool`, `data_pages_tool`, …); your session
> may prefix them with an MCP server id. Call `webflow_guide_tool` once before any other Webflow tool.

---

## Phase 0 — Inspect, then STOP and ask (read-only)

1. Read the Sessions Template page and locate `.bio-wall`.
2. **Confirm the three classes above exist as described.** If the structure differs from this
   document, **stop and report the difference** — do not improvise around it.
3. **Check whether the bio section is a Component** (green badge / component instance). It should be
   plain template elements. **If it is a Component, stop and ask** — editing inside a Component
   changes every instance sitewide.
4. **Check whether `dh-covers.webp` is already in Assets** (`data_assets_tool`), so you don't upload
   a duplicate. If it isn't there, you'll upload it in Phase 1.
5. **Confirm your element tools respond before promising the edits.** This runs **headless** —
   `data_element_tool` (query / remove elements) and `data_element_builder` / `data_whtml_builder`
   (create elements) operate server-side via the Data API; **no open Webflow Designer is required.** A
   quick `get_all_elements` / `query_elements` on this page confirms access. Only if those calls
   actually fail (e.g. the token lacks write scope) do you fall back to **Appendix A** rather than
   half-executing.
6. **Confirm `dh-covers.webp` is actually on disk** in your working directory (you need the real file
   to upload it). If you can't find it, stop and ask — don't substitute or regenerate an image.
7. **Check for other unpublished changes on the site.** Publishing pushes **everything** that's
   pending sitewide, not just your edit — including anyone else's half-finished Designer work. If
   there are pending changes you didn't make, **say so in your outline and ask** before publishing.

Then **stop** and present an outline roughly like this:

> **Here's what I'm about to do to the live DarrenDaily site:**
> - Page: **Sessions Template** — affects every session detail page
> - Upload `dh-covers.webp` to Assets *(or: already present, reusing it)*
> - **Delete** `<div class="dd-covers">` and `<img class="bio-cutout">` inside `.bio-wall`
> - **Add** one image element, new class `bio-single`, pointing at `dh-covers.webp`
> - **Publish** to *(list the exact domains you're about to publish to, and confirm they're the right
>   ones)* — note: this also publishes any other pending changes on the site
>
> This goes live and public on publish. Rollback = Webflow Designer → Backups.
> **Do you want me to proceed?**

**Wait for an explicit yes.** "Looks good" on the outline is not approval to publish — if it's
ambiguous, ask again. If the answer is no, stop and change nothing.

**Before proceeding, ask the human to make a restore point:** Webflow Designer → **Backups** → create
a manual backup. That's the rollback path and it takes ten seconds.

---

## Phase 1 — Execute (only after an explicit yes)

**Step 1 — Upload the image** (skip if Phase 0 found it already in Assets).
`data_assets_tool create_asset` needs **both** `file_name` and `file_hash`, where the hash is the
file's **md5** (`md5 -q dh-covers.webp` on macOS). It then returns a presigned S3 form — POST the file
bytes to it with the fields in order (`key`, `acl`, `bucket`, `X-Amz-*`, `Policy`, `X-Amz-Signature`,
`success_action_status`, `Content-Type`, `Cache-Control`) and the **file last**.

> Handy: an asset's ID is the **24-hex prefix of its hosted filename**
> (`6a685822561969af09aa0023_Wall-DH-blue2.webp` → id `6a685822561969af09aa0023`).

**Step 2 — Delete the two old elements.** Inside `.bio-wall`, delete `<div class="dd-covers">` and
`<img class="bio-cutout">`.

**Step 3 — Add the single image.** Add one **Image** element as a child of `.bio-wall`, source it to
the `dh-covers.webp` asset, and give it the **new** class `bio-single`.

```css
.bio-single { position: absolute; inset: 0; width: 100%; height: 100%;
              object-fit: cover; object-position: 50% 38%; display: block; }
```

`object-position: 50% 38%` gives Darren a little headroom; plain centre also works.

**Lazy loading is not a "setting" on the Data API** — `get_settings` on an Image element returns only
domId/assetId/altText/visibility, with no `loading` field. Set the HTML attributes directly with
`set_attributes`: `loading: lazy`, `decoding: async`. They render correctly in published output.

Alt text (via `set_settings` → `altText`):
`Darren Hardy in front of the wall of SUCCESS magazine covers he published`

**Step 4 — No script change.** Confirmed above. Don't touch `dd-sessions.js` or the `ddsessions`
registered script.

**Step 5 — Publish.** `data_sites_tool publish_site` requires you to name the publish targets — it
does not "just publish everywhere."

**Do not assume the target.** Read the site's configured domains (`data_sites_tool`), show the human
the list, and **confirm which to publish to** before you publish. Publishing to the `.webflow.io`
staging subdomain alone is a quiet failure mode — everything looks right on staging while the real
site is unchanged — and publishing somewhere unintended is worse. Ask.

---

## Phase 2 — Verify, then report

1. Load a real published session page: the bio image renders, it's the composited version (colour
   Darren, B&W covers), and it fills `.bio-wall` cleanly.
2. The old grid is gone — no 37 cover requests in the network panel, no console errors.
3. **Confirm the responsive variants are being served** — the image should carry a Webflow `srcset`
   with `-p-500` / `-p-800` / `-p-1080` sizes. Webflow generates these **asynchronously** after
   upload, so if they aren't there the instant you check, wait ~30–60s (or republish) and re-check
   before treating it as a problem. If they still never appear, the likely cause is that the image
   didn't land as a **native Image element** (a CSS background or a JS-built `<img>` gets no srcset) —
   flag it, because the bandwidth win is much smaller without it. (Verified on this site: API-uploaded
   images wider than 500px do get the full variant set; images narrower than 500px legitimately get
   none, since there's nothing to downscale.)
4. Check desktop **and** mobile widths. The image is centred on Darren and crops cleanly to both.
5. Report what changed, what you verified, and anything you couldn't verify.

**Rollback:** Webflow Designer → Backups → restore the point made in Phase 0.

---

## Scope & safety — this stays on the Sessions Template only

Done as written, this touches **only the Sessions Template** (every session detail page — which is
the point). It **cannot** reach Home, Welcome, Expired, Champion, or any other page. Two rules keep
it that way:

1. **Only delete instances and add a NEW class.** Deleting elements, and adding an element with a
   brand-new class (`bio-single`), are both scoped to this template — neither propagates.
2. **Do NOT edit the style of an existing shared class, and do NOT edit inside a Component.** Those
   are the only two things in Webflow that change every page at once. (Phase 0 step 3 checks for the
   Component case.)

**Claude: do not extend this task.** No tidying neighbouring elements, no "improving" other pages, no
deleting old assets or dead code as a bonus — the optional list below is explicitly *not* part of
this job.

**After it's live and verified:** ask the team whether they want the same single-image treatment
anywhere else *before* doing it. This "Behind the covers" section only exists on session pages, so
there's nothing identical elsewhere — but if other heavy multi-image blocks are worth the same fix,
that's a separate, deliberate decision.

---

## Optional cleanup — NOT part of this task, do not do it unasked

- The 37 individual cover assets and the old `Wall-DH-blue2.webp` cutout become unused by session
  pages and could be removed from Assets later.
- The covers-building code in `dd-sessions.js`, and the `.dd-covers` grid CSS in the Sessions
  Template's inline `<style>`, become dead. Both are **harmless as-is** (the code no-ops without the
  element). Housekeeping, not a requirement.
- The single image is grayscale covers + **Darren in full colour**, with a subtle vignette so he
  pops. Already toned and sized — don't run it back through a compressor.
- **Unrelated bandwidth note:** session **thumbnails** should always be saved as **WebP** (~70 KB),
  not 2 MB PNGs. That's the other big bandwidth item. See the intake SOP.

---

## Appendix A — Manual Designer steps (fallback, or if you'd rather click it yourself)

1. **Assets panel** → upload `dh-covers.webp`. Don't re-export it.
2. Open the **Sessions Template**, scroll to "Behind the covers. Behind closed doors.", select the
   `.bio-wall` element.
3. Inside it: **delete** the `.dd-covers` div and the `.bio-cutout` image.
4. **Add an Image** element → source `dh-covers.webp` → new class `bio-single` → Position
   **Absolute**, offsets **0** on all sides, Width **100%**, Height **100%**, Fit **Cover**, Position
   **Center** (or custom `object-position: 50% 38%`), **Lazy load**.
5. **Publish**, then check desktop and phone.

Same scope rules apply: new class only, and don't edit inside a Component.

Questions on any step — ask before executing, not after.
