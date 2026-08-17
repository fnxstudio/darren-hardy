# Tracking & Attribution — architecture findings

**Audited:** 2026-08-17 · **HubSpot portal:** 2518645 · **Checkout:** Spiffy (`darrenhardy.spiffy.co`)
**Method:** live cookie-continuity probe walking `bmc.darrenhardy.com` → `secure.darrenhardy.com` back to back, plus runtime resource capture on each

> Cross-page report. Page-level findings are in `01`–`03`.

---

## Scope

This report covers the tracking architecture across the properties, not any single page. It exists because a cross-domain attribution concern was raised, investigated, and **largely disproved** — the real attribution gap is elsewhere and has a different fix.

---

## 1. Identity is continuous across `*.darrenhardy.com` — no linker needed

Tested by reading cookies on each hostname in sequence, plus writing a probe cookie at `.darrenhardy.com` on one subdomain and reading it from another.

The two routes to checkout that matter:

- **Zoom webinar → `secure.darrenhardy.com`**
- **`bmc.darrenhardy.com` → `secure.darrenhardy.com`**

| Cookie | bmc.darrenhardy.com | secure.darrenhardy.com | Carried? |
|---|---|---|---|
| `_ga` | `GA1.1.1894555036.1786987128` | `GA1.1.1894555036.1786987128` | ✅ |
| `_fbp` | `fb.1.1786987130963.914015…` | identical | ✅ |
| `_gcl_au` | `1.1.1699020135.1786987128` | identical + click data | ✅ |
| probe cookie set at `.darrenhardy.com` | — | readable | ✅ |

**Same GA4 client ID on both.** These cookies are scoped to the root domain, so Google and Meta identity carries automatically between subdomains.

### Consequence
- `bmc.darrenhardy.com → secure.darrenhardy.com` is a **same-site hop**. Cross-domain linking is neither required nor missing.
- Any report claiming a missing `_gl` linker on this path is **wrong** and will be disproved in minutes by anyone with GTM access. Do not include it.

---

## 2. The checkout is fully instrumented

`secure.darrenhardy.com` is **Spiffy** (CNAME `darrenhardy.spiffy.co`, Fly.io, Stripe). It is not an untracked third-party island — the entire portal stack fires there:

| Firing on checkout | Requests observed |
|---|---|
| GTM `GTM-TTK5KZ` | 11 |
| GA4 `G-TLRGHBVSZ7`, `G-K5Q92SJZ4M` | 2 |
| Google Ads `AW-852119677`, `AW-674886041` | 21 |
| Meta Pixel `1490399231274221` | 3 |
| TikTok | 5 |
| LinkedIn | 5 |
| Bing UET | 3 |
| Clarity | 8 |
| Hyros | 1 |
| Funnelytics | 3 |
| ClickCease | 2 |
| HubSpot | 6 |

So the instrumentation exists and identity carries. **The attribution gap is not a tagging gap.**

---

## 3. Where attribution actually breaks: the webinar → checkout path

When traffic arrives at the checkout from a Zoom webinar rather than from a site page, a direct load presents as:

```
referrer:  (none)
urlParams: (none)
```

Three failure modes, most severe first:

### 3.1 Device switching — the primary loss
A webinar attended on a laptop and purchased on a phone shares no cookie and no client ID. Nothing stitches the two. The sale records as `(direct) / (none)`. Webinar-to-purchase routinely spans devices and days, so this is the common case, not an edge case.

### 3.2 The checkout link carries no campaign parameters
Whatever ad or email drove webinar registration, those UTMs ended at the registration page. The checkout URL is bare, so the checkout session has no campaign data of its own to attribute against.

### 3.3 Zoom app clicks send no referrer
A link clicked inside the Zoom desktop or mobile client opens with no HTTP referrer — not even `zoom.us / referral`. The session is `(direct) / (none)`.

### Where it still works
A buyer who previously visited any `*.darrenhardy.com` page **in the same browser** already has `_ga`, `_gcl_au` and `_fbp` set. GA4's attribution model can credit the earlier paid touch within its lookback window, and Meta can match on `_fbp`. Same-device buyers are largely fine.

### Implication for the fix
Not a linker. The workable directions are:
- **Put identifiers on the checkout link the webinar presents** — UTMs at minimum, ideally a registration or contact ID so Spiffy can stitch the purchase to the known registrant.
- **Attribute server-side.** The registrant's email is already captured at webinar signup. That identifier survives a device switch; no browser cookie will.

---

## 3A. Root cause of "13 cart views, 23 buys"

The team observed, for a Zoom webinar broadcast:

| Audience | Registered | Attended | Clicked to Cart | Bought |
|---|---|---|---|---|
| New to DB | 498 | 132 | 2 | 1 |
| Existing MQL | 906 | 322 | 6 | 9 |
| Existing Non-MQL | 2478 | 1094 | **0** | **2** |
| Alumni | 707 | 355 | 5 | 11 |
| **Total** | 4589 | 1903 | **13** | **23** |

More purchases than cart views, and one segment with **zero cart views but two purchases** — physically impossible. That rules out noise and proves a systematic undercount.

### The mechanism, measured

The two metrics use **different identity methods**, and only one of them survives the trip to the checkout.

| | "Clicked to Cart" | "Bought" |
|---|---|---|
| Identified by | HubSpot cookie `hubspotutk` | **email on the purchase record** |
| Survives a new browser/device | ❌ | ✅ |
| Can be bucketed by segment | only if tied to a known contact | always |

Tested on the live path, navigating `bmc.darrenhardy.com` → `secure.darrenhardy.com` back to back in one browser with no steps in between:

| Cookie | On bmc | On secure | Carried? |
|---|---|---|---|
| **`hubspotutk`** | **`ce7d80b43ee2040c8989ded40621ac68`** | **`e4faa2d4ee207b68c0e19ebb5ef0115f`** | **❌ new ID minted** |
| `_ga` | `GA1.1.1894555036.1786987128` | `GA1.1.1894555036.1786987128` | ✅ |
| `_fbp` | `fb.1.1786987130963.914015…` | identical | ✅ |

A controlled comparison — same browser, same navigation, same moment, same root domain. Google and Meta identity carried. **HubSpot's did not.**

**This happens on every route to the checkout, not just the Zoom one.** Even a visitor who goes bmc → secure in one session arrives at the cart as a brand-new anonymous HubSpot visitor. That is why the undercount is severe rather than marginal.

The HubSpot beacon does fire on the checkout, but anonymously:
```
track.hubspot.com/__ptq.gif ... vi=e4faa2d4ee207b68c0e19ebb5ef0115f
   pu=https://secure.darrenhardy.com/checkout/unbreakable-sole
```
A page view is recorded against a **fresh, unassociated visitor token**. With no contact attached, it cannot be placed in New to DB / MQL / Non-MQL / Alumni — so it drops out of a segmented report entirely.

Purchases don't have this problem: Spiffy captures the buyer's email at checkout, HubSpot resolves it to the contact record, and the segment is known with certainty. Hence complete purchase counts and badly incomplete cart-view counts.

**The Zoom path adds a second layer.** Attendees clicking the cart link from the Zoom app also arrive with no referrer and no UTMs (see §3), and many are on a different device from the one they attended on. But the HubSpot identity is lost either way — so both routes produce anonymous cart views.

### On the team's read

The practical conclusion — *don't trust the cart-view number* — is **correct**, and the numbers should not be reported as-is.

The stated cause needs adjusting. This is not HubSpot being inherently poor at tracking Spiffy pages: the tracking code is present and firing on the checkout. It is that **HubSpot visitor identity is not being carried across the hostnames**, so the view lands anonymously. That is a configuration problem, which matters because it is fixable rather than something to live with.

### What would fix it

- **Carry the contact identifier on the cart link the webinar presents.** If the link includes the registrant's identifier (or email), the cart view can be tied to the known contact regardless of cookie state or device. This is the single highest-value change and it also fixes §3.2.
- **Confirm HubSpot cross-domain tracking is configured** for the domains in the portal, so `hubspotutk` persists across them for same-browser visitors.
- **Until then, report cart views from Spiffy** — which counts the page server-side and is not cookie-dependent — and accept that the segment split isn't available for that metric rather than publishing a number that is wrong by a factor of several.

---

## 4. Unverified — needs a test that cannot be run read-only

**Does the Purchase event fire correctly on completion?** Determining this requires either Spiffy's test mode or a real transaction. It was not tested, and no live checkout was submitted.

This matters more than usual here because of the broken Meta deduplication ID documented in report `01`: the page-side script writes an event ID into a form field that does not exist. If a server-side CAPI Purchase fires without a matching `event_id`, purchases can be counted twice. Per Meta's Conversions API documentation, without matching IDs *"duplicate events will be sent to the ad delivery system"* — and inflated purchase counts are precisely what the ad platforms optimise against.

---

## 5. Consent gating — flagged, not concluded

On a page load in this portal, **42 tracking requests had fired and 19 tracking cookies were set** (`_fbp`, `_ttp`, `_ga`, `_gcl_au`, `_uetsid`, `_clck`, `_twpid` among them) with no consent choice recorded, and no banner present on that load.

**This is not yet a finding.** The browser carried state from earlier navigation in the same session, which could explain the absent banner. Confirming it requires a clean profile:

1. Clear all cookies, load the page, snapshot tracking requests and cookies.
2. Click **Reject All**, reload, snapshot again.
3. If the two snapshots match, the banner is decorative.

If confirmed, that is CPRA and GDPR/ePrivacy exposure, and it is cheap to demonstrate.

---

## Summary for the decision

| Concern | Status |
|---|---|
| **"13 cart views, 23 buys"** | **Explained and measured.** HubSpot visitor ID does not carry to the checkout; cart views land anonymously while purchases resolve by email. Fixable by config, not a platform limit. |
| Missing cross-domain linker, bmc → secure | **Disproved.** Same root domain; Google/Meta identity verified continuous. |
| Checkout untracked | **Disproved.** Full stack fires on Spiffy. |
| Webinar → checkout attribution | **Real.** Cross-device loss, no UTMs on checkout link, no referrer from Zoom app. |
| Purchase event integrity | **Untested.** Compounded by the broken dedup ID in report 01. |
| Pre-consent tracking | **Flagged.** Needs clean-profile confirmation. |

### Note on which cookies carry

Worth holding onto, because it explains why some numbers look fine and others don't: between `bmc.darrenhardy.com` and `secure.darrenhardy.com` **Google and Meta identity carries and HubSpot identity does not**. So GA4 and the ad platforms can often stitch a same-browser journey that HubSpot reports as two unrelated anonymous visitors. Any metric sourced from HubSpot page views across a hostname hop should be treated as suspect until the identity config is fixed; metrics keyed on email (purchases, form submissions) are reliable.
