# Darren Hardy — Brand & Design System
**v1.0 · June 2026 · For use on DarrenHardy.com and all owned web properties**

---

## Package Contents

| File | Description |
|------|-------------|
| `brand-guide.html` | Full 11-page brand guide — fully self-contained, open anywhere |
| `brand-guide.pdf` | Print/share version |
| `fonts/inter-latin.woff2` | Inter variable font (Latin) |
| `fonts/inter-latin-ext.woff2` | Inter variable font (Latin Extended) |
| `logos/logo-white.png/.webp` | DH mark · white · for dark backgrounds |
| `logos/logo-black.png/.webp` | DH mark · black · for light backgrounds |
| `logos/products/` | All product logos — see below |
| `assets/hero.webp` | Hero background image |
| `assets/media-logos/` | Media contributor logos (SVG + WebP) |
| `assets/ribbons/` | Bestseller badge images |
| `assets/awards/` | Award seal images |

### Logo Files (`logos/products/`)

| File | Mark |
|------|------|
| `BMC_COLLECTIVE_logo_white.webp` | BMC\|Collective combo lockup · white |
| `BMC_logo_white.webp` | Business Master Class mark |
| `THE COLLECTIVE_logo_white.webp` | The Collective wordmark |
| `HC_logo_white.webp` | Hardy Club mark (white on transparent) |
| `DarrenDaily_logo_white.webp` | DarrenDaily mark |
| `DDoD_podcast_logo_white.webp` | DarrenDaily On Demand mark |
| `HJ_logo_white.webp` | Hero's Journey mark |
| `IP_logo_white.webp` | Insane Productivity mark |
| `JST_logo_white.webp` | Jumpstart mark |
| `RIVETING_logo_white.webp` | RIVETING wordmark |
| `EFP_logo_white.webp` | eFASTPASS mark |

---

## 01 · Logo System

**Three approved forms:**
1. **Mark only** — `dh_logo.webp` — circular D monogram (use when name already established)
2. **Lockup (standard)** — mark + "DARREN HARDY" wordmark side by side
3. **Wordmark only** — "DARREN HARDY" text, for text-only environments

**Wordmark spec:** Inter 900 · `letter-spacing: 0.28em` · uppercase · minimum 14px / 10pt

**On dark:** white mark + white wordmark  
**On light:** `logo-black.png/webp` + dark wordmark (`color: #0a0a0a`)

**Clear space:** cap-height of the wordmark on all sides. Do not stretch, recolor, add drop shadow, or use any weight other than 900.

---

## 02 · Color System

```css
:root {
  --black:              #0a0a0a;   /* page bg, primary dark surface */
  --ink:                #141414;   /* nav, cards, dark ribbons */
  --ink-soft:           #1c1c1c;   /* subtle nested dark surfaces */
  --white:              #ffffff;
  --bone:               #f5f5f5;   /* light section bg — surface color, NOT type */
  --silver:             #b8b8b8;   /* body copy on dark, UI marks — type color */
  --grey:               #888888;
  --grey-soft:          #6a6a6a;
  --muted:              #444444;   /* body copy on light */
  --rule:               rgba(255,255,255,0.08);   /* hairline on dark */
  --rule-strong:        rgba(255,255,255,0.15);   /* border on dark */
  --rule-dark:          rgba(10,10,10,0.10);      /* hairline on light */
  --rule-dark-strong:   rgba(10,10,10,0.18);      /* border on light */
}
```

> **Silver ≠ Bone.** Silver (`#b8b8b8`) is a *type color* — body copy, nav links, UI marks. Bone (`#f5f5f5`) is a *surface color* — alternate section background. Never swap their roles.

**Section rule:** Dark sections use `--black` or `--ink` bg with white/silver type. Light sections use `--bone` bg with black/muted type. Never use a mid-grey background.

**A-Team accent** (A-Team pages only — never on core DH pages):
```css
--accent: #A0252B;
```

---

## 03 · Typography

**Typeface:** Inter by Rasmus Andersson  
**Download:** fonts.google.com/specimen/Inter · rsms.me/inter  
**License:** SIL Open Font License 1.1 (free, commercial use permitted)

| Role | Size | Weight | Spec |
|------|------|--------|------|
| Hero close | clamp(64px, 10vw, 170px) | 900 Black | ls –0.05em · lh 0.86 · uppercase |
| Section heading / H1 | clamp(51px, 7.2vw, 115px) | 900 Black | ls –0.04em · lh 0.92 · uppercase |
| Magnet / H2 | clamp(32px, 4.6vw, 77px) | 900 Black | ls –0.035em · lh 0.95 · uppercase |
| Ghost numeral | clamp(120px, 16vw, 230px) | 900 Black | ls –0.06em · color:transparent · -webkit-text-stroke |
| Eyebrow | 11px | 500 Medium | ls 0.42em · uppercase · silver · preceded by 28px pip line |
| Nav links | 10px | 500 Medium | ls 0.24em · uppercase |
| Body on dark | clamp(17px, 1.4vw, 20px) | 400 Regular | color: --silver · lh 1.6 |
| Body on light | clamp(17px, 1.4vw, 20px) | 400 Regular | color: --muted · lh 1.6 |
| Buttons / labels | 12px | 700 Bold | ls 0.24em · uppercase |
| Wordmark | 18px | 900 Black | ls 0.28em · uppercase |

**Font hosting:** Always self-host via `@font-face` — never use Google Fonts CDN.

---

## 04 · Buttons & CTA System

### Button variants

**On dark background:**
- **Solid default:** white bg · black text · white border → hover: transparent + white border/text
- **Ghost default:** transparent · white border/text → hover: fills white · black text

**On light background (bone):**
- **Solid default:** black bg · white text · black border → hover: transparent + black border/text
- **Ghost default:** transparent · dark border/text → hover: fills black · white text

**Spec:** Inter 700 · 12px · `letter-spacing: 0.24em` · uppercase · padding 22px 44px · `transition: all 0.2s`

### Shimmer CTA
Silver diagonal sweep (`rgba(210,210,230,0.32)`) on a 4s loop. Used **exclusively** on the "Get The Free Guide + Audio Series" homepage button. Disabled on mobile. Never replicate on other pages or CTAs.

```css
.magnet-cta::after {
  background: linear-gradient(105deg, transparent 20%, rgba(210,210,230,0.32) 50%, transparent 80%);
  animation: cta-shimmer 4s ease-in-out infinite;
}
```

---

## 05 · Components & Patterns

### Eyebrow + Pip
Inter 500 · 11px · `letter-spacing: 0.42em` · uppercase · `color: --silver`  
Preceded by a `28px × 1px` inline line in the same color.

### Navigation
Fixed · `background: rgba(10,10,10,0.78)` · `backdrop-filter: blur(14px)` · `border-bottom: var(--rule)`  
Three-column grid: nav-left | brand center | nav-right  
Brand name center: Inter 900 · 14px · `letter-spacing: 0.32em` · uppercase

### Ribbon / Marquee — Dark (Media Contributor)
`background: --ink` · `padding: 48px 0` · `border: var(--rule)` top/bottom  
Logos: `filter: brightness(0) invert(1)` · `opacity: 0.65` · 32s infinite scroll  
All logos are SVG or WebP — files in `assets/media-logos/`

### Ribbon / Marquee — Light (Bestseller Author)
`background: --bone` · `padding: 28px 0` · `border: var(--rule-dark)` top/bottom  
Badges: `mix-blend-mode: multiply` eliminates white bg · `filter: grayscale(1)` · 28s scroll  
Standard badge height 68px · NYT badge 94px  
Files in `assets/ribbons/`

### Award Seals
Three seals centered on black: DD · NSA (center, 10px taller) · DDOD  
DD/DDOD: `filter: invert(1) brightness(0.58)`  
NSA: `filter: brightness(1.35)` (white on transparent — no invert needed)  
Files in `assets/awards/`

### Stat Counter
Inter 900 · `clamp(58px, 7.2vw, 115px)` · `letter-spacing: -0.04em`  
JS count-up on scroll. Cell padding: 88px top / 40px bottom. Label: 500 · 13px · `letter-spacing: 0.18em`

### Recurring Marks — Core DH
- **Eyebrow pip:** 28px × 1px inline line + Inter 500 11px tracked text
- **Scroll cue:** double-chevron SVG · opacity 0.6 · infinite bob animation
- **Spine node unlit:** 9×9px square · transparent · `border: 1px solid var(--silver)`
- **Spine node lit:** `background: var(--white)` · `border-color: var(--white)` · `scale(1.25)`

### Recurring Marks — A-Team Context
Requires `--accent: #A0252B` in `:root`

- **Position tag default:** Inter 600 · 10px · ls 0.28em · silver border · `padding: 9px 16px`
- **Position tag A-Team red:** white text · `border: 1px solid var(--accent)` · `background: rgba(160,37,43,0.16)`
- **Own-word chip:** white fill · black text · Inter 800 · ls 0.06em · `padding: 9px 14px`
- **Red play button:** `border-radius: 50%` · `background: #A0252B` · white triangle inside
- **Red stars:** `color: #A0252B` (5-star rating display)
- **Em emphasis:** `font-style: normal` · `color: var(--accent)` · 5-shadow contrast-weight compensation

---

## 06 · Spine & Node System

The scroll-driven vertical spine is the primary interactive motif in the Ecosystem section, terminating at "Be The Exception."

- **Spine track:** 1px · `background: var(--rule)` · `left: 20px` within `.aaa-stack`
- **Spine fill:** same position · height driven by JS `draw()` at `window.innerHeight × 0.55`
- **Node unlit:** 9×9px · transparent · `border: 1px solid var(--silver)`
- **Node lit:** `background: var(--white)` · `border-color: var(--white)` · `transform: scale(1.25)` · 0.35s ease
- **Terminus node (Be The Exception):** 11×11px · same lit/unlit states

**CSS sibling selectors — no extra JS needed:**
```css
.node.lit ~ .ghost-num  { -webkit-text-stroke-color: var(--silver); }
.node.lit ~ .man-title  { color: var(--white); -webkit-text-stroke-color: transparent; }
```

Body text (`.col`) reveals via `.aaa.in` added one-way by JS when the line first hits each node.  
To adjust where the line leads relative to viewport: change `0.55` in `window.innerHeight * 0.55`.

---

## 07 · Web Implementation

```css
:root {
  --black: #0a0a0a;   --ink: #141414;   --ink-soft: #1c1c1c;
  --white: #ffffff;   --bone: #f5f5f5;
  --silver: #b8b8b8;  --grey: #888888;  --grey-soft: #6a6a6a;  --muted: #444444;
  --rule: rgba(255,255,255,0.08);         --rule-strong: rgba(255,255,255,0.15);
  --rule-dark: rgba(10,10,10,0.10);       --rule-dark-strong: rgba(10,10,10,0.18);
}
```

**Layout:** Container max-width 1380px · 48px padding desktop / 24px mobile  
**Section padding:** 120–160px desktop · 80–100px mobile  
**Images:** All `.webp` · cover images max 600px wide · lazy-load below fold  
**Video backgrounds:** Vimeo `background=1` embed — never native MP4 for background  
**Fonts:** Self-hosted Inter — never Google Fonts CDN  
**Reduced motion:** Honor `prefers-reduced-motion` on all animations

### A-Team Wrapper — any page referencing "A-Team"
Add whenever the term "A-Team" appears. Never on core DH pages (home / about / resources).

```css
:root { --accent: #A0252B; }
em { font-style: normal; color: var(--accent); }
.nobreak { white-space: nowrap; }   /* e.g. <em class="nobreak">A-Team</em> */
```

---

## 08 · Emphasis & Word Craft

**Rule 1 — No italics, ever.**  
The DH brand never uses italics. Override the browser default:
```css
em { font-style: normal; }
```

**Rule 2 — Emphasis = scale and weight, not color.**  
On core DH pages, the brand has no hue. Emphasized phrases earn weight through font-size or font-weight 700 + `color: var(--white)` in body copy. Never use a color accent on core pages.

**Rule 3 — `.nobreak`**  
Multi-word brand terms must never break across lines:
```css
.nobreak { white-space: nowrap; }
/* Usage: */
<em class="nobreak">Be The Exception</em>.
<em class="nobreak">The Compound Effect</em>
```

**Rule 4 — Punctuation placement**  
Closing punctuation goes **outside** the em:  
✓ `<em>Be The Exception</em>.`  
✗ `<em>Be The Exception.</em>`  
Exception: quoted exclamations keep punctuation inside.

---

## 09 · CTA System

### Three tiers — one primary per page

| Tier | Style | Usage |
|------|-------|-------|
| 1 · Primary | Solid fill (black bg, white text) | One per page · always the closing action |
| 2 · Ghost | Transparent + border | Nav, early-section invitations · never competes with Tier 1 |
| 3 · Text link | Small, tracked, no border | Nav links, footer, inline contextual references |

### Page CTA pattern
`Nav: Ghost "Start Here"` → `Content flows` → `Closing: Solid primary "Get The Free Guide"`

A page may host both a ghost CTA early (low-pressure) and a solid CTA at close (conversion). Never two solid CTAs competing on the same view.

### Shimmer CTA rule
Reserved exclusively for the "Get The Free Guide + Audio Series" homepage button. Never replicate on other pages — it signals the single most important action on the site.

---

## 10 · Footer Logo System

**Three forms — standard is the lockup:**

```html
<div class="dh-brand-mark">
  <img src="dh_logo.webp" alt="Darren Hardy" width="48" height="48">
  <span class="dh-name">Darren Hardy</span>
</div>
<p class="tag">Darren Hardy is the unfair advantage for unusually driven
business leaders building something that matters.</p>
```

```css
.dh-name {
  font-family: 'Inter', sans-serif;
  font-weight: 900;
  font-size: 18px;
  letter-spacing: 0.28em;
  color: var(--white);
  text-transform: uppercase;
}
```

**On dark:** white mark + white wordmark (standard site footer)  
**On light:** `logo-black.webp` + `color: #0a0a0a` wordmark (print / light-bg microsites)

Tagline always appears below the lockup in the footer, never above. Inter 400 · 12–13px · `color: --silver` on dark.

---

## 11 · Product Logo System

All product logos are **white on transparent** and must always be placed on `--black` or `--ink` backgrounds.

| File | Product |
|------|---------|
| `BMC_COLLECTIVE_logo_white.webp` | BMC\|Collective combo |
| `BMC_logo_white.webp` | Business Master Class |
| `THE COLLECTIVE_logo_white.webp` | The Collective |
| `HC_logo_white.webp` | Hardy Club |
| `DarrenDaily_logo_white.webp` | DarrenDaily |
| `DDoD_podcast_logo_white.webp` | DarrenDaily On Demand |
| `HJ_logo_white.webp` | Hero's Journey |
| `IP_logo_white.webp` | Insane Productivity |
| `JST_logo_white.webp` | Jumpstart |
| `RIVETING_logo_white.webp` | RIVETING |
| `EFP_logo_white.webp` | eFASTPASS |

If a light-background context is unavoidable, place a dark panel or scrim behind the logo. Never recolor or place on bone/white directly.

---

*Darren Hardy Brand & Design System · v1.0 · June 2026*
