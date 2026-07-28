# DarrenDaily — Webflow source & deploy

Editable source of truth for the **DarrenDaily home page** as it runs in Webflow,
plus the tooling to deploy a change. Built so a copy edit is a short, repeatable
procedure — prompt an agent ("lowercase X in the hero"), it edits one readable
file and runs the deploy.

## How the page is wired (read this first)

The Webflow home page body is a single **HTML Embed** (a "loader"). It contains:

```html
<div id="dd-app"></div>
<link rel="stylesheet" href="…/dd-home.css">
<style>html{scroll-behavior:auto;background:#0a0a0a}</style>
<script src="…/dd-home-vN.js"></script>
```

`dd-home-vN.js` sets `#dd-app`'s innerHTML to the page markup, then runs the page
behavior (covers wall, spine animation, font-fit, form). **All page copy lives in
that bundle** — which is why a "change one word" edit isn't a Webflow text edit.

We keep the bundle readable by splitting it into source files and rebuilding:

```
home/body.html     ← the page markup. COPY LIVES HERE. Edit this for wording.
home/behavior.js   ← DD_COVERS map + `__BODY__` marker + runtime (covers/spine/form).
                     Edit this only for behavior or the covers wall.
home/dist/dd-home.js  ← BUILT artifact (do not edit by hand).
tools/build-home.mjs  ← body.html + behavior.js → dist/dd-home.js
tools/s3-upload.sh    ← posts a built file to Webflow's CDN using create_asset's presigned form
```

`build-home.mjs` just does `behavior.replace("__BODY__", JSON.stringify(body))`.
The build is deterministic (same sources → identical md5).

## Fixed IDs

| Thing | Value |
|---|---|
| Site ID | `6a66d7a6f9d116b514a13ae1` (shortName `darrendaily`) |
| Staging | https://darrendaily.webflow.io |
| Home page ID | `6a66d7a8f9d116b514a13ae4` (path `/`) |
| Home embed element | component `6a66d7a8f9d116b514a13ae4`, element `0d7817a0-d0c3-b1e1-d140-f9d1415ecdae` |
| CSS asset (stable) | `…/6a66e77d7eed2e69a3015d73_dd-home.css` |

The **CSS URL is stable** and reused each deploy. Only the **JS URL changes** (a new
asset per upload), so the embed's `<script src>` must be re-pointed every deploy.

## Deploy a change (the procedure)

Steps marked **[MCP]** are Webflow MCP tool calls the agent makes; **[shell]** are scripts.

1. **[shell]** Edit `home/body.html` (copy) or `home/behavior.js` (behavior/covers).
2. **[shell]** Build: `node webflow-src/tools/build-home.mjs` → note the printed **md5** + **bytes**.
3. **[MCP]** `data_assets_tool` → `create_asset`
   `{ site_id, file_name: "dd-home-vN.js", file_hash: <md5> }`
   (bump `N`; the current live bundle is `dd-home-v4.js`). Save the tool result JSON to a file, e.g. `resp.json`.
4. **[shell]** Upload: `bash webflow-src/tools/s3-upload.sh resp.json webflow-src/home/dist/dd-home.js`
   → expects `S3 HTTP 201` and prints the new **hostedUrl**.
5. **[MCP]** `data_element_settings_tool` → `set_settings` on the home embed element,
   key `code`, value = the loader block above with `<script src>` set to the new hostedUrl.
6. **[MCP]** `data_sites_tool` → `publish_site` `{ site_id, publishToWebflowSubdomain: true }`.
7. **Verify** at https://darrendaily.webflow.io — check the copy, and that
   `#covers-grid .c-tile` count is unchanged and no console errors.

Fallback: if `s3-upload.sh` ever fails, the upload is just a multipart POST of the
`uploadDetails` fields (key first, `file` last) to `uploadUrl` — do it with curl.

## Covers wall notes

- The wall (`#covers-grid`) is a decorative 5-col grid, parallax-clipped. Only the
  **top ~37 tiles ever render** on screen; the rest are permanently below the clip line.
  It currently ships **37 covers** (was 63 — the 26 never-visible ones were removed).
- Covers are defined in `behavior.js`: the `var covers = [...]` array (order = fill
  order) and the `DD_COVERS` filename→URL map. To add/remove a cover, edit **both**.
  Adding one also means uploading its image asset and adding its CDN URL to `DD_COVERS`.

## Portability — who can edit, and how

- **Editing the site at all** requires a Webflow account with access to the DHLLC
  workspace + that person's own authenticated Webflow MCP connection.
- **This convenient workflow** (readable sources + scripts + this RUNBOOK) lives in
  this git repo. Anyone who is to use it needs the repo (share it via a git remote).
- **The how-to is also attached to the Webflow site as an agent instruction**, so any
  MCP agent that connects discovers the procedure. That instruction points back here.

## History

- Copy is authored in `body.html`; hosting/GitHub is not a runtime dependency (all
  assets on Webflow's CDN). Old bundles `dd-home-v2.js` / `dd-home-v3.js` are
  superseded and unreferenced (safe to delete anytime).
