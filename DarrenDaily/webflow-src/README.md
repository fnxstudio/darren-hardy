# DarrenDaily — Webflow source & deploy

Editable source of truth for the **DarrenDaily pages** as they run in Webflow, plus
the tooling to deploy a change. Built so a copy edit is a short, repeatable procedure —
prompt an agent ("lowercase X in the hero"), it edits one readable file and deploys.

## How the pages are wired (read this first)

Each page body is a single **HTML Embed** (a "loader"):

```html
<div id="dd-app"></div>
<link rel="stylesheet" href="…/dd-<page>.css">
<style>html{background:#0a0a0a}</style>
<script src="…/dd-<page>-vN.js"></script>
```

`dd-<page>-vN.js` sets `#dd-app`'s innerHTML to the page markup, then runs the page
behavior. **All page copy lives in that bundle** — a "change one word" edit is therefore
not a Webflow text edit. We keep the bundle readable by splitting it into source files
and rebuilding:

```
<page>/body.html      ← the page markup. COPY LIVES HERE.
<page>/behavior.js    ← (optional DD_COVERS map +) `__BODY__` marker + runtime.
<page>/dist/dd-<page>.js  ← BUILT artifact (do not edit by hand).
tools/build.mjs       ← body.html + behavior.js → dist/dd-<page>.js  (deterministic)
tools/s3-upload.sh    ← posts a built file to Webflow's CDN via create_asset's presigned form
```

`build.mjs` just does `behavior.replace("__BODY__", JSON.stringify(body))`.

## Pages & fixed IDs

Site ID `6a66d7a6f9d116b514a13ae1` — staging https://darrendaily.webflow.io

| page | page ID | embed element (component / element) | CSS asset (stable) | live bundle | wall |
|---|---|---|---|---|---|
| `home` (`/`) | `6a66d7a8f9d116b514a13ae4` | `6a66d7a8f9d116b514a13ae4` / `0d7817a0-d0c3-b1e1-d140-f9d1415ecdae` | `…6a66e77d7eed2e69a3015d73_dd-home.css` | `dd-home-v4.js` | 37 |
| `welcome` (`/welcome`) | `6a66d8230844a5c2cd424b8c` | `6a66d8230844a5c2cd424b8c` / `7c712307-20c8-c4f6-105c-30077eae66db` | `…6a66e77d57b738a7a039a11d_dd-welcome.css` | `dd-welcome-v4.js` | — |
| `expired` (`/404`) | `6a66de9ace5d93878f95f7d5` | `6a66de9ace5d93878f95f7d5` / `f017d0a2-8e60-3155-f5b2-8f84f863a211` | `…6a66e77d3eefd66b6dc3ca65_dd-expired.css` | `dd-expired-v5.js` | 37 |

The **CSS URL is stable** and reused each deploy. Only the **JS URL changes** (new asset
per upload), so the embed's `<script src>` must be re-pointed every deploy. Bump `-vN`.

## Deploy a change (the procedure)

**[MCP]** = a Webflow MCP tool call; **[shell]** = a script. Replace `<page>` with home/welcome/expired.

1. **[shell]** Edit `<page>/body.html` (copy) or `<page>/behavior.js` (behavior/covers).
2. **[shell]** `node webflow-src/tools/build.mjs <page>` → note the printed **md5** + **bytes**.
3. **[MCP]** `data_assets_tool` → `create_asset` `{ site_id, file_name: "dd-<page>-vN.js", file_hash: <md5> }`.
   Save the tool result JSON to a file, e.g. `resp.json`.
4. **[shell]** `bash webflow-src/tools/s3-upload.sh resp.json webflow-src/<page>/dist/dd-<page>.js`
   → expects `S3 HTTP 201`, prints the new **hostedUrl**.
5. **[MCP]** `data_element_settings_tool` → `set_settings` on that page's embed element,
   key `code` = the loader block above with `<script src>` set to the new hostedUrl.
6. **[MCP]** `data_sites_tool` → `publish_site` `{ site_id, publishToWebflowSubdomain: true }`.
7. **Verify** on staging — copy is right, `#covers-grid .c-tile` count unchanged, no console errors.

Fallback if `s3-upload.sh` fails: the upload is a multipart POST of the `uploadDetails`
fields (`key` first, `file` last) to `uploadUrl` — do it with curl.

## Covers wall

- `home` and `expired` share a decorative, parallax-clipped `#covers-grid` (5-col grid).
  Only the top **~37 tiles** ever render on screen; deeper tiles are permanently clipped.
  Both ship **37 covers** (trimmed from 63 — the 26 never-visible ones were removed and
  their image assets deleted). **Keep the two walls in sync.**
- Covers live in `behavior.js`: the `var covers = [...]` array (fill order) and the
  `DD_COVERS` filename→URL map. To add/remove a cover, edit **both** (adding one also
  means uploading its image asset and adding its CDN URL to `DD_COVERS`).

## Portability — who can edit, and how

- **Editing at all** requires a Webflow account with access to the DHLLC workspace + that
  person's own authenticated Webflow MCP connection.
- **This convenient workflow** (readable sources + scripts + this RUNBOOK) lives in this
  git repo — share it via a git remote for teammates to use it.
- **The how-to is also attached to the Webflow site** as an agent instruction
  (`rules/darrendaily-editing.md`), so any connecting MCP agent discovers the procedure —
  with a repo-free fallback. That instruction points back here.

## Notes

- `welcome-native` (`/welcome-native`) is a separate experiment and is **not** covered here
  (likely to be deleted).
- Superseded bundles (`dd-home-v2/v3.js`, `dd-expired-v4.js`, etc.) are unreferenced and
  safe to delete anytime.
