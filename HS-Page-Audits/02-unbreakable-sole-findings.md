# Page Audit — www.unbreakablesole.com/home

**Audited:** 2026-08-17 · **HubSpot portal:** 2518645 (**same portal as bmc.darrenhardy.com**)
**HS content ID:** 205379137192 · **HS campaign ID:** 33667029-0a53-4415-bcd1-253267c5d060
**Method:** served HTML inspected + page executed in real Chrome (runtime network, DOM, headers, robots/sitemap)

> Standalone report. Findings for bmc.darrenhardy.com/multiplier are in `01-bmc-multiplier-findings.md`.

---

## Headline: the DH brand stack is inherited wholesale

Response headers confirm it: `x-hs-portal-id: 2518645`, `x-hs-hub-id: 2518645` — the same HubSpot portal as the BMC pages. As a result this niche book site loads Darren Hardy's entire advertising and analytics stack.

### Identical to the BMC page, byte for byte

| Item | Value | Same as BMC page? |
|---|---|---|
| Google Tag Manager | `GTM-TTK5KZ` | **Identical** |
| GA4 | `G-TLRGHBVSZ7` | **Identical** |
| GA4 | `G-K5Q92SJZ4M` | **Identical** |
| Google Ads | `AW-852119677` | **Identical** |
| Google Ads | `AW-674886041` | **Identical** |
| Meta Pixel | `1490399231274221` | **Identical** |
| TikTok Pixel | `D0SAP2JC77UBTE66MR7G` | **Identical** |
| Microsoft UET | `ti=26014474` | **Identical** |
| LinkedIn Insight | `pid=266308` | **Identical** |
| Ambassador UID | `c5b1d215-7123-40d7-8ba7-dd57b3959b6d` | **Identical** |
| Microsoft Clarity | (session recording) | Identical tool |
| Hyros | **`hyros.darrenhardy.com`** | Identical |
| CAPI relay | **`capi.thecompoundeffect.com`** | Identical |
| Funnelytics · ClickCease · X/Twitter | — | Identical |
| jQuery | 1.11.2 + Migrate 1.2.1 | Identical |
| FontAwesome kit | `9d54c9348c` | Identical |
| `utm-tracking.js` | 2-second forever-interval | Identical |

**Only the BMC-page-specific GA4 `G-GVSMHHWKB7` is absent here** — that one was hardcoded on the Multiplier page itself rather than inherited from the portal.

### Explicitly Darren-Hardy-named code on Missy's domain

```html
<script src="https://mbsy.co/embed/v2/getcookie/darrenhardy"></script>
```
Darren Hardy's Ambassador referral-cookie endpoint, by name, on unbreakablesole.com. It returns the same empty values as on the BMC page — `mbsy_short_code = ''`, `mbsy_campaign_uid = ''`. Dead, and still loading **831 KB** of JavaScript.

Also present:
- `hyros.darrenhardy.com` — DH attribution on a non-DH domain
- `capi.thecompoundeffect.com` — DH's Compound Effect CAPI relay
- `module_DH_-_Video_Background_-_Video.min.js`, `module_DH_-_Testimonial_Cards_Slider.min.js` — DH-prefixed HubSpot modules
- `template_kore-slick.min.js` — the DH "kore" theme
- `/hs/scriptloader/2518645.js` — the DH portal loader, the mechanism pulling most of the above in
- One module served cross-portal from a **different hub ID** (`hubfs/7052064/`)
- Privacy Policy links to **`dh.darrenhardy.com/privacy`** — the policy governing all this tracking sits on a different brand's domain

**Net effect:** every visitor to this niche book site is loaded into Darren Hardy's Meta, TikTok, LinkedIn, Google Ads and Microsoft remarketing audiences, and recorded in DH's GA4 properties and Hyros. Book-buyer intent and BMC business-owner intent are being pooled into the same audiences.

### Intentional, not a leak — do not flag
- Checkout → `secure.darrenhardy.com/checkout/unbreakable-sole` (DH commerce infrastructure)
- The Darren Hardy endorsement quote in the hero (editorial content)
- Nav "SHOP" → same DH checkout

### One tag to verify ownership
- **LinkedIn `pid=593781052`** — present here, **not** on the BMC page. This is the only tag that may be Unbreakable Sole's own. Confirm who owns it.

### Note
Funnelytics is rewriting outbound commerce links, appending `?_fs=17094336997-15813169898&_fsRef=` to the `secure.darrenhardy.com` checkout URLs. If Funnelytics is unwanted, it is currently mutating purchase links.

---

## SEO / AEO — can this brand be recognized and crawled as itself?

This is the weakest area, and it is independent of the DH inheritance.

### The internal page name is the public identity

**"HomePage [Unbreakable Sole]"** appears in **six places**:

```
<title>                        HomePage [Unbreakable Sole]
<meta name="description">      HomePage [Unbreakable Sole]
<meta property="og:title">     HomePage [Unbreakable Sole]
<meta property="og:description"> HomePage [Unbreakable Sole]
<meta name="twitter:title">    HomePage [Unbreakable Sole]
<meta name="twitter:description"> HomePage [Unbreakable Sole]
```

That string — a HubSpot internal working name, brackets included — is the Google result headline, the Google snippet, and the Facebook / LinkedIn / X / iMessage preview for the book's homepage. There is no descriptive title or description anywhere on the page.

Other page titles are no better:
| URL | `<title>` |
|---|---|
| `/home` | `HomePage [Unbreakable Sole]` |
| `/resources` | `Unbreakable Sole` (brand name only, no page description) |
| `/wall` | `Unbreakable Sole Journal Congrats` (a confirmation-page title on the public Sole Wall) |

### Both H1s are unusable to a crawler
- **H1 #1 contains only an image** (`UNBREAKABLE SOLE BANNER IMAGE.png` wrapped in `<h1><strong><span>`). Extracted text: **empty**.
- **H1 #2 extracts as "Finding Joy, Purpose, and Strengthin Life's Toughest Miles"** — `Strength<br>in` with no surrounding space. Renders fine visually; reads as a typo to every crawler and answer engine.
- Two H1s on one page; one further heading is entirely empty.

### Nothing machine-readable identifies the book
- **Zero JSON-LD structured data.** No `Book`, no `Person` (author), no `Organization`, no `WebSite`.
- The author, Missy, is named 16 times in prose but has **no author entity** an answer engine can attach to the book.
- **No ISBN** anywhere on the homepage.
- **"OVER 1,000 FIVE STAR REVIEWS"** is claimed in visible text with `aggregateRating: 0`, `reviewCount: 0`, `ratingValue: 0` — not eligible for review rich results and not citable by an answer engine.

For a book brand, `Book` + `Person` + `aggregateRating` schema is the single highest-leverage fix. Without it there is nothing telling Google or an LLM that "Unbreakable Sole" is a book, who wrote it, or that it is well reviewed.

### robots.txt on this domain is Darren Hardy's
50 `Disallow` entries — **16 are DH / DarrenDaily paths that do not exist on Unbreakable Sole**, including:

```
Disallow: /darrendaily-welcome
Disallow: /darren-hardy-email-subscription-update
Disallow: /welcome-to-darrendaily
Disallow: /dd-unsubscribe-typ
Disallow: /camp-hardy-optout
Disallow: /a-team-portal
Disallow: /internal-only-avatar-interview-hardy-club
Disallow: /darrendaily              (duplicated)
Disallow: /darrendaily-indispensable (duplicated)
```

robots.txt is world-readable. This publicly exposes DH's internal and unpublished slugs — including one literally named `internal-only-avatar-interview-hardy-club` — on a domain that appears to belong to a different brand. It also contains duplicate entries.

### No sitemap at all
- `robots.txt` has **no `Sitemap:` directive.**
- `sitemap.xml` returns HTTP 200 and is an **empty `<urlset/>` — 223 bytes, zero URLs.**

Crawlers get no map of the site whatsoever.

### Sharing and images
- **No `og:image`**, and `twitter:card` is `summary` rather than `summary_large_image`. The book cover — the strongest asset the brand has — never appears in a single share or link preview.
- **31 of 60 images have empty `alt`.**
- One filename-as-alt remains: `Frame 427319503-1`.

### What is actually correct
- Canonicals are clean: `/Resources` and `/resources` both canonical to `/resources`; `/` 301s to `/home`.
- The printed-book URLs resolve here: `/Resources`, `/resources`, `/wall` all return 200, and `/free-resources` 301s to `/resources`.
- No stray `noindex` — the site is indexable.
- 54 of 60 images use `loading="lazy"`, with only 2 above the fold (much better than the Multiplier page).

---

## Hidden text — checked for old DH lead-magnet copy

Checked specifically, because DH lead-magnet copy was found hidden on the Multiplier pages. **It is not present here.**

Every content-bearing hidden block on this page is **Unbreakable Sole copy**, hidden as responsive desktop/mobile clones:

| Hidden block | Content |
|---|---|
| `dnd_area-row-0-hidden` | duplicate of the visible DH endorsement + hero |
| `dnd_area-row-3-hidden` | *"Life may break you open… UNBREAKABLE SOUL already inside you." — MISSY MOSS WRIGHT* (duplicated twice within the row) |
| `dnd_area-row-4-hidden` | **an entire duplicate testimonial row** (Jessica Fairbanks, Thomas Petersen) |
| rich-text span | *"Life can be heavy. You've carried so much… 26.2 chapters"* — book copy, 612 chars |
| `header-menu` | duplicate nav |

**False positives ruled out.** The words "CEO", "entrepreneur" and "business owner" appear in the source and look like DH lead-magnet vocabulary, but every instance is a **testimonial job title** for a real book reviewer (Thomas Petersen, *CEO of SportProsUSA*; Elo Jones, *Business Owner and Investor*; Holly Nye, *Entrepreneur*). Legitimate content — do not flag.

The DH contamination on this page is in **code and infrastructure**, not body copy.

---

## Page weight

| Metric | Measured |
|---|---|
| Network requests | 140 |
| Distinct third-party hosts | 48 |
| Transferred / uncompressed | **3.85 MB / 5.19 MB** |
| DOM nodes | 946 |
| `@font-face` declared / actually loaded | 133 / 13 |

More than **double** the Multiplier page's payload. Largest offenders:

| Asset | Size | Note |
|---|---|---|
| `9dc97fc9c0a88c0b3335df172fcbabdd48094a471.png` | **2,352 KB** | hash-named raw export; 1403×2154 natural, displayed 325×499 — 2.2× oversized even at 2× DPR |
| `SOLE-A-THON opt-in page 1-1.png` | 552 KB | an **opt-in page graphic** used as a CSS background on the homepage |
| `1cbc2e42554205e0e524a55f1a38ef772b56e672-1.png` | 448 KB | hash-named CSS background |
| `Untitled-1111-Photoroom.png` | 144 KB | "Untitled" + background-removal tool name in a production filename |

A single 2.3 MB PNG is ~60% of the page's transferred weight, rendered into a 325 px slot.

Also: an **autoplaying, looping, muted `<video>`** plus a separate **Vimeo player iframe** (`player.vimeo.com/video/1157625628`) — two video runtimes on one page.

### Shared with the Multiplier page
- Cookie banner covers the hero (here, the book cover) on first load
- 120 unused `@font-face` declarations
- jQuery 1.11.2 (CVE-2020-11022 range, CVSS 6.1)
- `utm-tracking.js` 2-second forever-interval

---

## Sources

- [web.dev — Core Web Vitals](https://web.dev/articles/vitals)
- [NVD — CVE-2020-11022](https://nvd.nist.gov/vuln/detail/cve-2020-11022)
- [Google — Book structured data](https://developers.google.com/search/docs/appearance/structured-data/book)
- [Google — Review snippet structured data](https://developers.google.com/search/docs/appearance/structured-data/review-snippet)
