# Tracking audit — what's running, what's broken, what to decide

Beyond accuracy, this matters for weight: every tag adds bandwidth, slows page load, and drags on page speed scores — and on bandwidth-metered hosting such as Webflow, unnecessary scripts carry a direct cost.

---

## 1. Two platforms, and one property with nothing on it

| Platform | Properties |
|---|---|
| **HubSpot** | bmc.darrenhardy.com, dh.darrenhardy.com, darrendaily.com |
| **WordPress** | darrenhardy.com, **hardybmc.com** |
| **Spiffy** | secure.darrenhardy.com (checkout) |

Tags are installed a different way on each, by different people, at different times. Nothing enforces consistency across them.

### hardybmc.com has no tracking at all

No tag manager. No analytics. No advertising pixels. **Zero cookies set.** The only third-party code is a HubSpot form embed.

It carries checkout links to Spiffy.

**Every visitor to that site is invisible** — absent from GA4, Meta, HubSpot, and Hyros. Traffic, conversions and ad performance for that property cannot be measured at all, and paid traffic sent there cannot be optimised or attributed.

*Question for the team: is hardybmc.com receiving traffic, and is any of it paid?*

---

## 2. Four GA4 properties, two Google Ads accounts, one container

| ID | How it's installed | Where |
|---|---|---|
| `G-TLRGHBVSZ7` | via GTM | everywhere GTM runs |
| `G-K5Q92SJZ4M` | via GTM | everywhere GTM runs |
| `G-GVSMHHWKB7` | hardcoded in page | **only** the two Missing Multiplier pages |
| `G-EJL7QTX77N` | Google Site Kit plugin | **only** darrenhardy.com (WordPress) |
| `AW-852119677` | via GTM | fires its beacon **3× per pageview** |
| `AW-674886041` | via GTM | second Ads account |

GTM itself (`GTM-TTK5KZ`) is installed correctly and consistently — script in `<head>`, `<noscript>` in body, same on every property except hardybmc.com. That part is fine.

**The problem is what's layered on top of it.** Two GA4 properties arrive through GTM everywhere. Two more were added separately — one pasted into specific pages, one through a WordPress plugin. Three properties record the same pageview, so their session and conversion counts will never reconcile.

*Questions for the team:*
- *Which GA4 property is the source of truth? What are the other three for?*
- *Why is one hardcoded onto two pages only — was it for a specific campaign, and is it still needed?*
- *Are both Google Ads accounts active, or is one legacy?*
- *Why is `AW-852119677` firing three times per pageview?*

---

## 3. Everything firing — mark **needed / not needed / unknown**

The full set observed across the pages audited.

**Google**

1. GTM container `GTM-TTK5KZ`
2. GA4 `G-GVSMHHWKB7` — hardcoded inline, separate from GTM
3. GA4 `G-TLRGHBVSZ7` — via GTM
4. GA4 `G-K5Q92SJZ4M` — via GTM
5. GA4 `G-EJL7QTX77N` — via Google Site Kit plugin (WordPress)
6. Google Ads `AW-852119677` — beacon fires 3× per pageview
7. Google Ads `AW-674886041`

Hardcoded inline GA4 tags turn up on multiple pages, in addition to the properties already delivered through GTM. Worth establishing what each was added for and whether it's still required.

**Ad platform pixels**

8. Meta Pixel `1490399231274221` — PageView + ViewContent
9. Microsoft UET `26014474`
10. Microsoft Clarity `ng44tconm0` — session recording
11. LinkedIn Insight `266308`
12. TikTok Pixel `D0SAP2JC77UBTE66MR7G`
13. X/Twitter `uwt.js`

**Attribution / monitoring**

14. Hyros — `hyros.darrenhardy.com`
15. Funnelytics — `track-v3.js` + sessions + steps + a Cloudflare worker
16. ClickCease — click-fraud monitoring
17. Meta Conversions API Gateway — see below
18. Ambassador — 831 KB of JavaScript (145 KB over the wire) — see below

**Platform**

19. HubSpot suite — analytics, cookie banner, collected-forms, ads pixel, web-interactives, live chat, tools menu, CWV embed, 3 `__ptq.gif` beacons
20. `utm-tracking.js` — custom; runs `setInterval(…, 2000)`, a DOM query every 2 seconds for as long as the tab stays open, never cleared

---

## 4. Two of these are already broken

### Ambassador — dead
Its endpoint returns:
```js
var mbsy_short_code = '';
var mbsy_campaign_uid = '';
```
Empty. It is the largest single script on the page and returns nothing.

It is found on multiple HubSpot pages.

*Question: does anyone still use Ambassador? If not, it can be removed wherever it appears.*

### Meta Conversions API Gateway — running on its fallback
Configured against the Meta Pixel in Events Manager, not installed on the page — so it runs wherever that pixel loads.

Its primary endpoint, `capi.thecompoundeffect.com`, **no longer resolves in DNS.** Every call fails and falls through to a CloudFront address. A gateway exists to send events from a domain matching the site; a raw CloudFront host doesn't do that, so the reason it was set up no longer applies.

Low urgency — events still reach Meta via the browser pixel.

*Questions: should it be repointed to a darrenhardy.com subdomain, or switched off? And is an AWS deployment still running (and billing) behind it?*

---

## 5. One thing to investigate — possible duplicate Meta conversions

**What's verifiable:** an inline script generates a unique event ID and tries to write it into `input[name="bmc_event_id"]`. That field doesn't exist — not in the DOM, not in shadow DOM, not in the form's own configuration. The script also listens for a HubSpot Forms **v2** message while the page runs the **v4** embed, which fires a different event.

So the deduplication ID never reaches the form. That much is certain.

**What isn't known:** whether this causes double-counting depends on what else sends events to this pixel and whether those deduplicate independently. There appear to be three paths:

- the browser pixel
- Meta's CAPI Gateway — mirrors browser events, handles its own deduplication
- HubSpot's native Meta integration — portal config maps **six forms** to Facebook `LEAD` events

The first two should reconcile. **The open question is whether HubSpot's server-side lead events carry an event ID matching the browser's.** If they do, the broken script is harmless dead code. If they don't, each lead is counted twice.

Checkable in Events Manager's event-quality / deduplication view.

### Why it matters if duplication is happening

Meta both optimises delivery on the conversion count and reports cost against it. If conversions are inflated:

- **Cost per conversion is understated.** Double the count and true CPA is twice what the dashboard shows. Every scale/pause/budget decision is made against a cost that isn't real.
- **ROAS is overstated by the same factor** — campaigns look profitable that may not be.
- **Optimisation is misdirected.** Meta's delivery model learns from the conversion signal and will favour audiences, placements and creative on the strength of events that didn't happen.
- **Campaign comparisons break.** If duplication isn't uniform, the comparison used to decide what to scale is invalid — and budget goes to the wrong campaign.
- **Learning thresholds can be met artificially**, leaving ad sets in worse delivery than the interface suggests.

None of this is established. It's the specific question the broken script makes worth asking, and it's answerable in an afternoon.

---

## Priority

1. **hardybmc.com** — decide whether it should be tracked at all. Currently unmeasurable.
2. **Meta duplication** — check Events Manager. Directly affects reported ad cost.
3. **GA4 / Ads consolidation** — decide the source of truth, retire the rest.
4. **Ambassador** — remove if unused.
5. **CAPI Gateway** — repoint or switch off; check for an orphaned AWS deployment.
