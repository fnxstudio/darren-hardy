# BMC | COLLECTIVE — Brand & Design System
**v1.0 · June 2026 · For use on hardybmc.com and all BMC|COLLECTIVE web properties**

---

## Package Contents

| File | Description |
|------|-------------|
| `brand-guide.html` | Full brand guide — fully self-contained, open anywhere |
| `brand-guide.pdf` | Print/share version |
| `fonts/inter-latin.woff2` | Inter variable font (Latin) |
| `fonts/inter-latin-ext.woff2` | Inter variable font (Latin Extended) |
| `logos/logo-white.webp` | BMC\|Collective combo lockup · white · dark backgrounds |
| `logos/logo-dark.webp/.png` | BMC\|Collective combo lockup · dark/colored version |
| `logos/products/` | Individual marks — see below |
| `assets/hero.webp` | BMC stage hero image |
| `assets/hero-bg.webp` | BMC stage background |
| `assets/media-logos/` | Media contributor logos (SVG + WebP) |
| `assets/ribbons/` | Bestseller badge images |
| `assets/awards/` | Award seal images |

### Logo Files (`logos/products/`)

| File | Mark |
|------|------|
| `BMC_COLLECTIVE_logo_white.webp` | Combo lockup · white (primary) |
| `BMC_COLLECTIVE_logo_dark.webp` | Combo lockup · dark/colored |
| `BMC_logo_white.webp` | BMC mark alone |
| `THE_COLLECTIVE_logo_white.webp` | The Collective wordmark alone |
| `dh_logo_white.webp` | DH parent mark (footer use only) |

---

## Logo System

### Primary identity — Combo Lockup
The **BMC|COLLECTIVE combo lockup** is the primary brand identity for all contexts. Use the supplied artwork — never rebuild it.

### Logo hierarchy
1. **BMC|COLLECTIVE combo** — all primary contexts
2. **BMC mark alone** — when the full lockup is already established on the page
3. **The Collective wordmark alone** — THE COLLECTIVE sub-brand contexts
4. **DH parent mark** — footer only; never in hero, nav, or primary position on BMC pages

### On dark backgrounds
White versions on `--black` (#0a0a0a) or `--ink` (#141414). Never place on bone, white, or light surfaces without a dark scrim.

---

## Color System

```css
:root {
  /* Neutrals */
  --black:          #0a0a0a;
  --ink:            #141414;
  --surface-card:   #0e0c12;
  --white:          #ffffff;
  --bone:           #f5f5f5;
  --silver:         #b8b8b8;
  --muted:          #444444;

  /* Brand — use rgba(var(--x-rgb), opacity) for any transparency */
  --bmc-cyan-rgb:     120, 228, 239;   /* #78e4ef — primary accent on dark */
  --bmc-plum-rgb:     75, 44, 106;     /* #4b2c6a — primary accent on light */
  --bmc-purple-rgb:   156, 39, 172;    /* #9c27ac */
  --bmc-magenta-rgb:  214, 42, 143;    /* #d62a8f */
  --gold:           #f5b301;           /* review stars ONLY */

  --radius: 4px;
  --section-pad-mobile: 72px;
}
```

**Accent logic (load-bearing):**
- **Cyan on dark** — functional UI (links, play buttons, active states), accent text
- **Plum on light** — same accent role re-hued for bone/white backgrounds
- **Gold** — review stars exclusively, never decorative
- Radial purple/magenta gradients — background depth only, never on type or borders

---

## Typography

**Typeface:** Inter by Rasmus Andersson  
**Download:** fonts.google.com/specimen/Inter · rsms.me/inter  
**License:** SIL Open Font License 1.1 (free, commercial use permitted)

| Weight | Name | Usage |
|--------|------|-------|
| 400 | Regular | Body copy, descriptions |
| 500 | Medium | Eyebrows, nav labels |
| 700 | Bold | Buttons, UI labels, stat labels |
| 900 | Black | All headlines, wordmarks |

| Role | Size | Weight | Notes |
|------|------|--------|-------|
| Hero / H1 | clamp(40px, 5.5vw, 88px) | 900 | uppercase, tight tracking |
| Section heading | clamp(28px, 3.6vw, 56px) | 900 | uppercase |
| Eyebrow | 11px | 700 | ls 0.28em · uppercase · plum on light / cyan on dark |
| Body | clamp(16px, 1.3vw, 18px) | 400 | lh 1.65 |
| Buttons | 11–12px | 700 | ls 0.22–0.24em · uppercase |

**Font hosting:** Self-host via `@font-face` — never Google Fonts CDN.

---

## Buttons & UI Marks

### Button states

**On dark background:**
- **Ghost default:** transparent · `border: 1px solid var(--bmc-cyan)` · cyan text
- **Ghost hover:** fills solid cyan · dark text
- **Solid default:** white bg · dark text · white border
- **Solid hover:** transparent · `border-color: var(--bmc-cyan)` · cyan text

**On light background:**
- **Ghost default:** transparent · `border: 1px solid var(--bmc-plum)` · plum text
- **Ghost hover:** fills solid plum · white text

```css
.btn-ghost { border: 1px solid var(--bmc-cyan); color: var(--bmc-cyan); background: transparent; }
.btn-ghost:hover { background: var(--bmc-cyan); color: var(--black); }

.btn-solid { background: var(--white); color: var(--black); border: 1px solid var(--white); }
.btn-solid:hover { background: transparent; color: var(--bmc-cyan); border-color: var(--bmc-cyan); }
```

**Spec:** Inter 700 · 11–12px · `letter-spacing: 0.24em` · uppercase · `border-radius: var(--radius)` (4px)

### Recurring UI Marks
- **Badge:** cyan pill — `background: var(--bmc-cyan)` · dark text · `border-radius: 99px`
- **Industry chip:** plum border · transparent bg · plum text
- **Play button:** circle · cyan bg · dark triangle · `border-radius: 50%`
- **Review stars:** gold (`#f5b301`) · exclusively for ratings
- **Eyebrow pip:** plum line preceding uppercase label text

---

## Components & Treatments

### Testimonial card (dark)
Dark card (`--surface-card: #0e0c12`) · cyan `<strong>` emphasis inside quote · horizontal rule divider · name/title below

### Rating lockup
Large bold number (`9.8`) · `<small>/10</small>` · vertical divider · gold stars · label text

### Chevron stages ribbon
Overlapping plum-gradient chevrons: Install → Activate → Compound

### Ambient wash
Low-opacity purple/magenta radial gradients behind dark sections for depth. **Background only** — never applied to type, icons, or borders.

### Elevation & borders
Borders over shadows. Cards gain `cyan border on hover`. Flat and sharp — 4px radius everywhere (circles only for play buttons and seals).

### Motion
Scroll-reveal (fade-up 28–40px) + count-up stats. Easing: `cubic-bezier(.16,1,.3,1)`. No bounce or spin. Honors `prefers-reduced-motion`.

---

## Web Implementation

```css
:root {
  --black: #0a0a0a;   --ink: #141414;   --surface-card: #0e0c12;
  --white: #ffffff;   --bone: #f5f5f5;  --silver: #b8b8b8;  --muted: #444;
  --bmc-cyan-rgb: 120,228,239;   --bmc-plum-rgb: 75,44,106;
  --bmc-purple-rgb: 156,39,172;  --bmc-magenta-rgb: 214,42,143;
  --gold: #f5b301;
  --radius: 4px;   --section-pad-mobile: 72px;
}
```

**Layout:** Container max-width 1380px · 48px desktop / 24px mobile  
**Section padding:** 120–200px desktop (climax largest) · 72px mobile (uniform)  
**Images:** All `.webp` · lazy-load below fold  
**Fonts:** Self-hosted Inter — never Google Fonts CDN  
**Accessibility:** Body ≥ 4.5:1 contrast · visible focus states · alt text on all images  
**Reduced motion:** Honor `prefers-reduced-motion` on all animations

### A-Team Wrapper — any page referencing "A-Team"
Add whenever the term "A-Team" appears. Never on core BMC brand pages where A-Team is not referenced.

```css
:root { --accent: #A0252B; }
em { font-style: normal; color: var(--accent); }
.nobreak { white-space: nowrap; }   /* e.g. <em class="nobreak">A-Team</em> */
```

---

## Emphasis & Word Craft

**Rule 1 — No italics.**  
The brand never uses italics. `<em>` is used semantically but its italic is overridden:
```css
em { font-style: normal; }
```

**Rule 2 — Em color-shift.**  
Emphasized phrases render in the brand accent color (cyan on dark, plum on light):
```css
em { font-style: normal; color: var(--bmc-cyan); }  /* dark bg */
em { font-style: normal; color: var(--bmc-plum); }  /* light bg */
```

**Rule 3 — Contrast-weight compensation.**  
Cyan text reads optically thinner than white at the same weight. A 5-shadow stack compensates:
```css
em {
  text-shadow:
    0.4px 0 0 currentColor, -0.4px 0 0 currentColor,
    0 0.4px 0 currentColor,  0 -0.4px 0 currentColor,
    0 0 0.6px currentColor;
}
```

**Rule 4 — Punctuation outside em:**  
✓ `Our <em>Core Values</em> & <em>Attributes</em>.`  
✗ `Our <em>Core Values & Attributes.</em>`

**Rule 5 — Distribute emphasis around connectors.**  
When two phrases share "&" or "and", each gets its own `<em>`. The connector stays neutral.

**`.nobreak` — brand term protection:**
```css
.nobreak { white-space: nowrap; }
/* Usage: <em class="nobreak">A-Team</em> */
```

---

## CTA System

### CTA hierarchy — one primary per view

| Tier | Style | Use |
|------|-------|-----|
| Primary (solid) | White bg · dark text · white border | Page-closing conversion · maximum weight |
| Ghost | Transparent · cyan/plum border + text | Header invite · low-pressure · never competes with solid |

**Solid → Hover:** fill drops out, type flips to cyan/plum  
**Ghost → Hover:** fills solid cyan/plum, type flips dark

### CTA placement pattern
`Header: Ghost (low-pressure)` → `Content` → `Closing section: Solid (actual conversion)`

A page can host both — ghost in the header, solid at the close. On bone-background sections, invert the swatch references (solid becomes black-on-bone, ghost gets dark outline) so contrast logic stays the same.

---

*BMC | COLLECTIVE Brand & Design System · v1.0 · June 2026*
