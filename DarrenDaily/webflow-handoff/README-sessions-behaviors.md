# Session template behaviors — dd-sessions.js

The session (CMS) template's JS is ONE hosted, versioned bundle: `dd-sessions.js`.

- Loaded via the registered site script **`ddsessions`** (footer, applied site-wide),
  hosted on the Webflow CDN. A top guard `if (!document.querySelector('.post-layout')) return;`
  makes it a no-op on every non-session page, so site-wide application is safe.
- The Sessions Template page footer custom code is now just a pointer comment (no inline JS).
- Consolidated 2026-07-29: folded the old `ddctaantiflash` (banner+sticky beacon anti-flash)
  and `ddcoverslazy` (covers wall lazy) INTO this file; removed the dead Featured-CTA section
  (right column was deleted); dropped `.side-feature-img` from anti-flash. The old registered
  patch scripts (ddctaantiflash / ddfeaturedctahide / ddcoverslazy / sidebarcardtypes) are
  unapplied+dormant (API can't delete them; clear from the Designer if desired).

## To update
1. Edit `dd-sessions.js`.
2. `create_asset` (new file) → S3 upload → get hostedUrl + `openssl dgst -sha384 -binary … | openssl base64 -A`.
3. `register_hosted_script` a NEW version (e.g. 1.0.2) of `ddsessions` at the new URL+integrity.
4. `set_site_scripts [{id:ddsessions, location:footer, version:<new>}]`.
5. `publish_site`.

Superseded inline source kept as `sessions-footer-code.SUPERSEDED.html` for history.

## Live version log
- v1.0.3 (dd-sessions-v4.js) — CURRENT. Hyvor comments mount on first user engagement
  (scroll/tap/key) or when the section enters view, so Hyvor's 3rd-party JS is off the initial
  (unscrolled) load that pagespeed audits measure. Verified: 0 Hyvor requests until scroll.
- v1.0.1 — first consolidated build (antiflash + covers-lazy folded, featured-CTA removed).
