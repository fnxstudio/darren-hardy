# BMC|COLLECTIVE — Design System

The brand guide for **BMC|COLLECTIVE** (Darren Hardy's Business Master Class).
This file is the machine-readable source of truth for AI + dev work; the team
PDF is generated from it. It mirrors the live implementation in `bmc.css`
(the `:root` token block) — **if you change a token here, change it there too,
and vice-versa.**

> **Prime directive:** the brand is *implicit restraint*. Near-monochrome,
> Inter-only, with **one** chromatic accent applied sparingly. Premium comes
> from type discipline and space, not decoration.

---

## 1. Foundations

- **Typeface:** **Inter** — *everything*. No second family, ever. Hierarchy is
  built from **weight + size + letter-spacing + color**, not new fonts.
- **Weights in use:** 400 (body), 500 (eyebrows/labels), 600 (emphasis),
  700 (names/sub-labels), 800–900 (display headlines & big numbers).
- **Case:** display headlines, eyebrows, labels, chips, and titles are
  **UPPERCASE**. Body copy and testimonial quotes are sentence case.

---

## 2. Color tokens

All values live in `:root` in `bmc.css`. Brand hues carry an **`-rgb` companion**
so any opacity is minted with `rgba(var(--x-rgb), a)` — never hardcode a raw
`rgba(120,228,239,…)` again.

### Neutrals
| Token | Value | Use |
|---|---|---|
| `--black` | `#0a0a0a` | dark section backgrounds |
| `--ink` | `#141414` | secondary dark surface |
| `--ink-soft` | `#1c1c1c` | — |
| `--white` | `#ffffff` | text on dark, solid CTA |
| `--bone` | `#f5f5f5` | light section background |
| `--bone-soft` | `#ececec` | light section (testimonials) |
| `--silver` | `#b8b8b8` | body copy on dark |
| `--grey` | `#888888` | tertiary text |
| `--grey-soft` | `#6a6a6a` | eyebrow/label on light |
| `--muted` | `#444444` | body copy on light |
| `--surface-card` | `#0e0c12` | dark testimonial / video card background |
| `--text-on-dark` | `#f1f1f4` | quote text on dark cards (soft white) |

### Brand palette
| Token | Value | Role |
|---|---|---|
| `--bmc-cyan` (`--bmc-cyan-rgb` `120,228,239`) | `#78e4ef` | **THE accent.** Used on **dark** backgrounds only — eyebrows, `em.key`, ghost CTAs, play buttons, dark-card titles/emphasis. |
| `--bmc-cyan-soft` | `rgba(…,0.85)` | softened cyan |
| `--rule-cyan` | `rgba(…,0.32)` | cyan hairline / hover border |
| `--bmc-plum` (`--bmc-plum-rgb` `75,44,106`) | `#4b2c6a` | **The accent's light-mode twin.** Used on **light** backgrounds — `em.key` on bone, light-section titles. |
| `--gold` | `#f5b301` | **Review stars only.** Never type, never UI. |
| `--bmc-purple` (`156,39,172`) | `#9c27ac` | ambient wash hue (low-opacity radial bg only) |
| `--bmc-magenta` (`214,42,143`) | `#d62a8f` | secondary wash hue (low-opacity radial bg only) |

### Rules / borders
`--rule` `rgba(255,255,255,0.08)` · `--rule-strong` `0.15` ·
`--rule-dark` `rgba(10,10,10,0.1)` · `--rule-dark-strong` `0.18`

### 🔑 Accent logic (the one rule that governs the whole page)
> **Cyan on dark. Plum on light.**
> The accent is the same *idea* in both modes — it just changes hue so it stays
> legible and premium. Cyan reads loud and washed-out on a light background;
> plum reads premium there (and would disappear on dark). So:
> - Dark section → emphasis/`em.key`/titles = **cyan**.
> - Light section → emphasis/`em.key`/titles = **plum**.
> - Play buttons & functional cyan UI stay **cyan** regardless (they live on media).

---

## 3. Typography scale

| Role | Spec | Token/Class |
|---|---|---|
| **Display headline** | Inter **900**, UPPERCASE, `letter-spacing: -0.03em`, `line-height: 1.0` | `.section-headline` |
| **Big number** (price, 9.8 rating) | Inter **900**, `clamp(56px,6.5vw,88px)`, `-0.03em` | `.price-num` pattern |
| **Eyebrow** | Inter **500**, `11px`, `letter-spacing: 0.42em`, UPPERCASE, `--silver` (dark) / `--grey-soft` (light); paired with a `28×1px` pip | `.eyebrow` |
| **Body copy** | Inter **400**, `clamp(17px,1.45vw,21px)`, `line-height: 1.6`, `--silver`/`--muted` | section bodies |
| **Quote (dark card)** | Inter **400**, `18px`, `line-height: 1.5`, `--text-on-dark`; emphasis = `<strong>` 600 cyan | `.t-quote-text` |
| **Name** (card author) | Inter **700**, `~15px`, `-0.01em` | `.t-quote-name` |
| **Title / role label** | Inter **600**, `11px`, `letter-spacing: 0.14em`, UPPERCASE; cyan on dark, plum on light | `.t-quote-title` |
| **Chip / micro-label** | Inter **700**, `9px`, `letter-spacing: 0.24em`, UPPERCASE | `.t-quote-chip` |

**`em.key`** = the one emphasized word in a headline. It is the *only* chromatic
glyph in the line (cyan on dark / plum on light). Use sparingly — one per headline.

---

## 4. Spacing & layout

- **Container:** `max-width: 1380px`, side padding `48px` desktop / `24px` mobile.
- **Section padding (desktop):** generous and intentionally varied — `120–200px`
  vertical (the climax/final CTA runs the largest). *Open space is part of the brand.*
- **Section padding (mobile):** **uniform** `--section-pad-mobile` = **72px** top/bottom
  for every content section (hero `88/56`, final CTA `80`, Meet keeps a tight
  `44` bottom for the seal strip). Tighten the scroll on mobile; never let it sprawl.
- **Mobile breakpoints:** `880px` (tablet/stack), `720px`, `600px`, `480px`.
  Two-column layouts stack at `≤880–960px`.

### Mobile-only helpers (in `bmc.css`)
- `.m-br` — a `<br>` that only shows ≤600px (phone-only line break).
- `.d-br` — a `<br>` that hides ≤880px (desktop-only line break; flows on mobile).
- `.d880-only` / `.m880-only` — text swap at the ≤880px stack point
  (e.g. "left column" → "first box").
- `.cs-full` / `.cs-short` — long/short string swap for cramped mobile lines.

---

## 5. Radius & elevation

- **Radius:** `--radius` = **4px** — the single standard for cards, chips,
  badges, the rating tablet. Circles (play buttons, seals) use `50%`.
  Flat and sharp-ish is the house style; avoid large rounded corners.
- **Elevation:** the page prefers **borders over shadows**. Bordered cards
  go **cyan-bordered on hover** (`--rule-cyan`) rather than lifting heavily.
  Dark cards use a soft `0 6px 22px rgba(10,10,10,0.10)` rest shadow.

---

## 6. Components

- **Ghost CTA** (the recurring button): transparent + `--bmc-cyan` border & text →
  inverts to solid cyan + black text on hover. Uppercase, `letter-spacing ~0.28em`.
- **Solid CTA:** white bg + black text → on hover goes transparent + cyan border/text.
- **Badge** (e.g. "BEST VALUE", "ACTIVATED IMMEDIATELY"): solid `--bmc-cyan` pill,
  black text, uppercase, tight tracking, floated on the card edge.
- **Industry chip:** cyan **outline** (ghost pattern) on the photo — `1px` cyan
  border, cyan text, faint dark backing, `--radius`.
- **Rating lockup:** big plum **9.8** (Inter 900) · divider · gold stars over an
  uppercase "RATING FROM 11,738 CEOs" label, in a flat white tablet.
- **Testimonial card (dark):** photo on top fading into a `--surface-card` body;
  white quote with **cyan** emphasis; full-width hairline divider; white name +
  **cyan UPPERCASE** title. (Video cards are the same family.)
- **Chevron "stages" ribbon:** interlocking arrows implying progression; purple
  tints deepen along the sequence. Rightward on desktop, **downward** when stacked.
- **Ambient purple wash** (`.bmc-wash`): low-opacity `--bmc-purple` / `--bmc-magenta`
  radial gradients behind a section. **Background only — never type, icons, or borders.**

---

## 7. Motion

- Scroll-reveal via `IntersectionObserver` (`bmc.js`): `.reveal` (single) and
  `.stagger` (parent fires, children cascade via CSS `nth-child` delays).
- Stagger fires as the element's **top edge enters** (`threshold: 0`) so the
  first item in a tall group isn't late.
- Respects `prefers-reduced-motion` (everything shows immediately).
- Keep motion subtle: short fade-up (`translateY` ~28–40px), premium easing
  (`cubic-bezier(0.16, 1, 0.3, 1)`). No bounce, no spin.

---

## 8. Imagery — testimonial headshots

(See the project `CLAUDE.md` for the full generation spec.)
- **Static quote-card headshots:** 3:2, solid deep-plum (~`#1E1533`) background
  with a soft radial glow, premium editorial lighting, gentle cool rim light.
- **Video testimonial stills:** 16:9, **cyan→purple duotone** background, subject
  on the left/centered with direct eye contact, open negative space lower-right
  for the overlaid teal play button.
- **Head size must be consistent** across every testimonial image on the page.
- Resolution 2K, PNG → optimized WebP (~800px for quote cards, ~1000px for posters).

---

## 9. Do / Don't

**Do**
- Build hierarchy with Inter weight/size/tracking + the one accent.
- Use cyan on dark, plum on light — always.
- Reference tokens (`var(--…)`), never raw hex/rgba, in new CSS.
- Let desktop breathe; tighten and unify spacing on mobile.

**Don't**
- Introduce a second typeface or a third accent color.
- Put gold anywhere but review stars, or the purple/magenta wash anywhere but backgrounds.
- Use cyan for emphasis on a light background (use plum), or plum on dark (use cyan).
- Add heavy drop-shadows or large rounded corners — stay flat, bordered, sharp.
