# Page Audit — bmc.darrenhardy.com/multiplier

**Audited:** 2026-08-17 · **HubSpot portal:** 2518645 · **HS content ID:** 215742594976
**Method:** served HTML inspected + page executed in real Chrome (runtime network, console, DOM, long-task capture)

> Standalone report. Findings for unbreakablesole.com are in `02-unbreakable-sole-findings.md`.

---

## Measured baseline

Real Chrome, desktop, fast connection — i.e. the **best case**. Mobile ad traffic will be worse.

| Metric | Measured |
|---|---|
| Network requests | 148 |
| Distinct third-party hosts | 52 |
| Transferred / uncompressed | 1.65 MB / 2.97 MB |
| Scripts executed | 50 |
| Main-thread blocking (long tasks) | 13 tasks, 1,246 ms total |
| Stylesheets + inline `<style>` blocks | 40 + 24 (1,645 CSS rules) |
| DOM nodes | 1,086 |
| `load` event | 5.4 s |

Google's "good" threshold is LCP < 2.5 s at the 75th percentile of real users.
*Note: Google PageSpeed API was rate-limited at audit time; figures above are direct measurements.*

---

## Everything firing — triage list

Mark each: **needed / not needed / unknown**

### Google — 6 separate IDs
| # | Tool | ID | Notes |
|---|---|---|---|
| 1 | Google Tag Manager | `GTM-TTK5KZ` | hardcoded inline |
| 2 | GA4 | `G-GVSMHHWKB7` | hardcoded *separately* from GTM (page-specific) |
| 3 | GA4 | `G-TLRGHBVSZ7` | via GTM |
| 4 | GA4 | `G-K5Q92SJZ4M` | via GTM |
| 5 | Google Ads | `AW-852119677` | conversion beacon fired **3× per pageview** |
| 6 | Google Ads | `AW-674886041` | second account |

→ Three GA4 properties record the same pageview. Counts will not reconcile between them.

### Ad platform pixels
| # | Tool | ID |
|---|---|---|
| 7 | Meta Pixel | `1490399231274221` (PageView + ViewContent) |
| 8 | Microsoft UET | `26014474` |
| 9 | Microsoft Clarity | `ng44tconm0` (session recording) |
| 10 | LinkedIn Insight | `266308` |
| 11 | TikTok Pixel | `D0SAP2JC77UBTE66MR7G` |
| 12 | X / Twitter | `uwt.js` |

### Attribution / monitoring
| # | Tool | Notes |
|---|---|---|
| 13 | Hyros | `hyros.darrenhardy.com` |
| 14 | Funnelytics | `track-v3.js` + sessions + steps + Cloudflare worker |
| 15 | ClickCease | click-fraud monitoring |
| 16 | Custom CAPI relay | `capi.thecompoundeffect.com` + CloudFront (2 calls each) |
| 17 | **Ambassador** | `cdn.getambassador.com` — **831 KB** JS (145 KB wire) + second `mbsy.co` call |

**Ambassador is confirmed dead.** Its endpoint returns:
```js
var mbsy_short_code = '';
var mbsy_campaign_uid = '';
```
Empty. Largest script on the page; returns nothing. Account UID `c5b1d215-7123-40d7-8ba7-dd57b3959b6d`.

### HubSpot + custom
| # | Tool | Notes |
|---|---|---|
| 18 | HubSpot suite | analytics, cookie banner, collected-forms, ads pixel, web-interactives, **live chat**, tools menu, CWV embed, 4× `__ptq.gif` |
| 19 | `utm-tracking.js` | custom; requested **3×** (one aborted); runs `setInterval(…, 2000)` — a DOM query every 2 s for as long as the tab is open, never cleared |

---

## Priority 1 — Actively costing ad money

### 1.1 The Meta deduplication ID is never sent
An inline script generates an event ID and writes it into `input[name="bmc_event_id"]`. **That field does not exist** anywhere in the page (verified: 0 in light DOM, 0 in shadow DOM).

It also listens for `hsFormCallback` — the HubSpot Forms **v2** postMessage — while the page runs the **v4** embed (`hs-form-html` / `hs-form-event:on-ready`), which fires a different event entirely. Two independent breaks in ~30 lines.

Per Meta's Conversions API docs, the Pixel's `eventID` must match the server `event_id` or *"duplicate events will be sent to the ad delivery system."* With a CAPI relay also firing, browser and server conversions cannot be matched → reported conversions inflated, and Meta optimizes against corrupted signal.

**Confirmed a second way.** The HubSpot form's own JSON definition (embedded in the page) enumerates every field on the form:
`firstname`, `email`, `company_role`, `phone`, `text_messaging_optin_property`, `utm_source`, `utm_medium`, `utm_term`, `utm_campaign`.
There is no `bmc_event_id`. The field the script writes to was never added to the form.

### 1.2 ~~The email field is not required~~ — RETRACTED
An earlier pass flagged this from the DOM attribute `required=false`. **That was wrong.** The form's JSON definition sets `"propertyReference":"0-1/email","required":true`, and the form runs `"enabledLiveValidation":true` — HubSpot's v4 embed enforces validation in JavaScript rather than via the native `required` attribute, which is why `aria-required="true"` is present and the native attribute is not. Email is genuinely required. Same for `company_role`.

---

## Priority 2 — Page speed

- **737 KB in two decorative background gradients** shipped as PNG (439 KB + 298 KB). A WebP of the same gradient is **already on the page at 47 KB**. ~690 KB avoidable using a format they already had.
- **Ambassador's 831 KB** (dead — see 17).
- **jQuery 1.11.2 + Migrate 1.2.1** (2014-era), render-blocking in `<head>`. Within the affected range of CVE-2020-11022 (jQuery 1.2 → <3.5.0, CVSS 6.1). Its only real job here is the `utm-tracking.js` interval.
- **All 17 images are `loading="lazy"` — including above-the-fold hero images.** Lazy-loading the LCP element delays the thing the visitor is waiting for.
- The page stylesheet chains `@import`-style `url()` calls to Google Fonts and Typekit, serializing render-blocking requests.

---

## Priority 3 — Pure waste

- **Adobe Typekit kit loaded — 9 `@font-face` for `neue-haas-grotesk`. Zero uses.** Neither family is referenced anywhere on the page.
- **122 `@font-face` declared; 15 actually load.** Inter requested from 3 sources, Lato from 3, plus Source Sans Pro. Only 2 families render text.
- **FontAwesome loaded 3×** (kit JS + kit CSS + v5.9.0 `all.css`) **for exactly 1 icon.** Config still carries dev-only settings (`domains: "localhost, *.dev"`).
- HubSpot **live chat** loading on a single-purpose opt-in page.
- **Invalid CSS from empty module fields:** 16 declarations such as `border-radius:px`, `font-size:px`, `line-height:px`, `margin-top:px`; plus 11 empty `{}` rules and 5 fully transparent shadows. All discarded by the browser.

---

## Priority 4 — Experience / conversion

- **The cookie banner covers the form and submit button on first load.** On mobile it sits directly over the input fields; on desktop it covers the value proposition and part of the form. The primary conversion action is obscured until dismissed.
- **The same 6-field form is rendered twice**, both visible, same form GUID (`6bb21130-e64e-4fab-9acf-5c276d764df6`), at y=687 and y=2506. Both register a form view → HubSpot view counts and conversion rate inflated ~2×; duplicate-submission exposure.
- ~~A field with `placeholder="Search"` appears twice in each form; only 2 of 6 visible inputs carry a submittable field name.~~ **RETRACTED.** The "Search" inputs are HubSpot's built-in dropdown search (`showDropdownSearch: true` + the `SEARCH_PLACEHOLDER` translation string), and the empty-named visible inputs are the v4 embed's normal proxy-input pattern backed by the hidden named fields. Neither is a defect.
- **Zero working field labels** — 8 `<label>` elements, all empty. Placeholder-only, which disappears on focus. (Still valid — a labelling/accessibility issue independent of the v4 pattern.)
- Mobile and desktop see **different copy** (213 characters vs 35) via duplicated hide/show blocks.

---

## Priority 6 — Hidden text

Excluding HubSpot's inert form-renderer payload (~36 KB of inline CSS, a country-code list, and form JSON — machinery, not copy), the page carries these **content-bearing but invisible** blocks against **2,052 characters of visible text**:

**Copy belonging to a different offer.** The visible page sells a self-serve diagnostic — the button reads *"GET THE FREE DIAGNOSTIC."* Hidden in the markup is briefing/webinar copy:

> "**Video training BONUS!** Darren will walk you through every step to find the one hire that will transform your business… This is the same process he's used to personally mentor top business leaders like: **Sidd Pagidipati** who TRIPLED his revenue from $60M to $180M with one key hire · **Troy Berg** who went from $1M to $30M by filling one key seat · **Kevin Ortner** who saw an 11X ROI off his one key hire in the first year"

That block belongs to the sibling funnel at `dh.darrenhardy.com/one-multiplier` ("AI DIAGNOSTIC + FREE TRAINING", *"Register now… reserve your seat for a free bonus briefing"*). Named clients and specific revenue claims are sitting in the HTML of a page that never displays them.

**Duplicated hero.** The full H1 block — *"FIND THE ONE HIRE YOUR BUSINESS NEEDS NEXT / Find which critical role could remove bottlenecks…"* — exists twice: once visible, once hidden. This is the source of the duplicate-H1 finding above.

**Triplicated disclaimer.** *"Free. Read it once. Use it forever. Darren Hardy LLC values your privacy…"* appears three times, hidden.

**Note on `{!evergreen-webinar2/3/4}`:** these merge-field placeholders appear in the served HTML of `/one-multiplier`'s briefing-time dropdown, but are **replaced at runtime** with real dates ("Monday, 17th August – 12:00 PM PDT"). Not a live bug — verified in the rendered DOM.

### Same pattern on the sibling page
`dh.darrenhardy.com/one-multiplier` (title: **"Missing Multiplier - Opt-in Page"** — another internal working name in `<title>`) carries **8,628 hidden characters against 2,192 visible** — roughly 4:1.

---

## Priority 7 — What the `-hidden` classes actually are

The `-hidden` suffix classes are **not A/B variants**. Tested empirically by probing all 24 `-hidden` elements at 375 px, 768 px and 1280 px:

| Category | Count | What it means |
|---|---|---|
| Responsive breakpoint toggles | **15** | 7 mobile-only, 8 desktop/tablet-only — duplicated modules, each shown to someone |
| Always visible | **2** | the `-hidden` suffix is simply misleading |
| **Hidden at every breakpoint** | **7** | **dead content — shipped to every visitor, shown to nobody** |

The A/B test on this page is real but runs through a completely different mechanism: HubSpot's own page-level testing, `"abTestId": 215178475808` in the page metadata. (By contrast `/multiplier` has `"abTestId": null`.) The CSS classes have nothing to do with it.

### The 7 dead blocks include two complete sections
- **An entire second hero:** *"FIND THE ONE HIRE THAT WILL DELIVER THE HIGHEST ROI IN YOUR BUSINESS / You are only one hire away from multiplying your company… | AI DIAGNOSTIC + FREE TRAINING"*
- **The entire "WHAT'S INCLUDED" block:** *"The five key seats that compound a business at scale. (And the four seats most CEOs waste a decade chasing.) A 20-question Yes/No diagnostic…"*

Both are downloaded by every visitor and readable by crawlers. Neither is displayed at any screen size.

### Visible order differs by breakpoint
Any "what actually shows" model built from a single viewport will be wrong — 15 modules differ between mobile and desktop.

| | Desktop (1280) | Mobile (375) |
|---|---|---|
| 1 | H1 — FIND THE ONE HIRE… | H1 — FIND THE ONE HIRE… |
| 2 | H1 — WALK AWAY WITH: | **REGISTER NOW! (form)** |
| 3 | H1 — WHY NOW: | H1 — WALK AWAY WITH: |
| 4 | **H1 — THE MISSING MULTIPLIER BRIEFING** | **H1 — "X"** |
| 5 | REGISTER NOW! (form) | H1 — WHY NOW: |
| 6 | H2 — The Advisor Behind… | H2 — The Advisor Behind… |

Three things fall out of this:
- **The form sits in a different place** — second element on mobile, fifth on desktop.
- **"THE MISSING MULTIPLIER BRIEFING" never appears on mobile.**
- **Four visible `<h1>` elements on desktop.** "WALK AWAY WITH:" and "WHY NOW:" are section labels marked up as H1, not H2.

### A stray `<h1>` containing "X"
On mobile only, an `<h1>` whose entire content is the letter **X**, set to `font-size: 3px` in the body text colour. It occupies a 335 × 3 px strip — technically rendered, invisible in practice, and read by crawlers as a top-level heading. It appears to be a leftover shrunk out of view rather than deleted.

---

## Priority 5 — SEO / AEO

- **Four different descriptions of one offer:** title *"Your Missing Multiplier"* / H1 *"Find the One Hire Your Business Needs Next"* / meta description *"5 critical roles that multiply growth"* / URL `/multiplier` / button *"Get the Free Diagnostic."* Meta's Advertising Standards require that *"the products and services promoted in an ad must match those promoted on the landing page"* — there is no single consistent claim to match against.
- **Two `<h1>` elements**, identical text (duplicate hero block).
- **Two completely empty `<h3>` elements.**
- **No `og:image`** — every share and link preview renders imageless.
- **No structured data** (zero JSON-LD) — nothing for answer engines to extract.
- **Alt text is raw filenames:** "Group 21", "Group 19-1", "Group 18-3", "Group 20", "Group 10 (1) (1)", "tst" — duplicated into `title` attributes, so hovering shows a tooltip reading "Group 21".
- Production filenames include **`tst.webp`** and **`imagw.webp`** (typo of "image").

---

## On ad cost — stated precisely

Meta's auction values ads on bid × **estimated action rate** + **ad quality**. Meta explicitly states that ad relevance diagnostics (quality / engagement / conversion rate ranking) are **diagnostics, not direct auction inputs** — so slow pages do not directly raise CPM.

The real mechanism: a slower page means fewer clickers reach the form → lower measured conversion rate and estimated action rate → higher **cost per result**. Meta also notes lower-quality ads *"may experience impacted performance."*

The broken dedup ID (1.1) is the more concrete money problem — corrupted optimization signal, not a speed inference.

For sizing the speed effect on a lead-gen page, the Google/Deloitte *Milliseconds Make Millions* study measured that a **0.1-second** mobile improvement moved lead-gen bounce rate 8.3% and progression to the contact page **+20.6%**. This page has multiple seconds available.

---

## Sources

- [web.dev — Core Web Vitals](https://web.dev/articles/vitals)
- [Meta — Deduplicate Pixel and Conversions API events](https://developers.facebook.com/docs/marketing-api/conversions-api/deduplicate-pixel-and-server-events/)
- [Meta — Ad auction](https://www.facebook.com/business/ads/ad-auction)
- [Meta — About ad quality](https://www.facebook.com/business/help/423781975167984)
- [Meta — Advertising Standards](https://transparency.meta.com/policies/ad-standards/)
- [NVD — CVE-2020-11022](https://nvd.nist.gov/vuln/detail/cve-2020-11022)
- [Google / Deloitte — Milliseconds Make Millions](https://www.thinkwithgoogle.com/_qs/documents/9757/Milliseconds_Make_Millions_report_hQYAbZJ.pdf)
