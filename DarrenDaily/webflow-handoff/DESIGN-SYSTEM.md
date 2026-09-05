# DarrenDaily Webflow — class system

Established 2026-09-05, before rebuilding Welcome / Home / 404. Read this before adding
any class to this site.

## Naming convention

| Scope | Prefix | Examples |
|---|---|---|
| Shared primitives + chrome | `dd-` | `dd-container`, `dd-btn`, `dd-btn-line`, `dd-eyebrow`, `dd-micro`, `dd-key`, `dd-dot`, `dd-page`, `dd-main` |
| Nav / footer components | `dd-nav-*`, `dd-footer-*` | `dd-nav-brand`, `dd-footer-col-title`, `dd-footer-slim-row` |
| Page-scoped sections | short page prefix | `champ-hero`, `gift-card`, and for the rebuilds `wel-*`, `home-*`, `exp-*` |

Single hyphens throughout, no `__`, no machine-generated names. A class that belongs to one
page gets that page's prefix; if a second page needs it, promote it to `dd-`.

## Global components (Group: Global)

| Component | Id |
|---|---|
| Site Nav | `033d1565-317d-9443-72c2-3a51e1dc0940` |
| Site Footer | `536ecfab-8245-b46e-1146-06542f759ebc` |
| Site Footer Slim | `2a7f26af-7b55-2597-099b-da6c2165d855` |

They carry their own `font-family: Inter`, so they work on any page with or without a
`.dd-page` wrapper. The nav's scrolled state is the `.solid` combo on `.dd-nav`, toggled by
the shared script in Site Settings > Custom Code (footer). Do not re-add that script per page.

## What changed in the 2026-09-05 cleanup

- **275 global classes -> 126.** 149 orphans deleted: 67 machine-generated `f-*` names plus
  the leftovers of the deleted `welcome-native` page (`hero-confirm`, `steps`, `ptile`,
  `pgallery`, `xp-*`, `tw-*`, `vf-*`, `ep-*`, `side-*`, `quote-*`…). Every one was proven
  unreferenced by any page, component or CMS template first.
- **Numeric-suffixed duplicates gone** (`footer-grid-1`, `bmc-corner-1`, `footer-bottom-1`,
  `video-frame-1`, `hero-cue-1`…). These are what Webflow creates when you insert a class
  name that already exists — always re-query after inserting.
- **Three container classes -> one.** `.container` (991px) deleted, `.footer-container`
  deleted, `.dd-container` (1320/48, 22px at small) is the only one.
- **Two footer systems -> one.** The Sessions CMS template had its own parallel footer
  (`post-footer`, `footer-grid-1`, `fb-tag`, `footer-link`, `bmc-corner-1`…). It now uses the
  Site Footer component and those 14 classes are deleted.
- **The site custom code no longer styles the footer.** It used to carry a third, structural
  override (`.foot-brand > div:last-child a`, `.foot-brand p{color:#b0a8a6!important}`) that
  out-ranked the Designer classes and caused hours of "why won't this apply". Removed. The
  head block now holds only fonts + Sessions-template styling; the footer block holds only the
  shared nav script + HubSpot.

## Breakpoints

Webflow is fixed at 991 / 767 / 479; the hand-written CSS used 860 / 720 / 520. Shared chrome
(nav, footer, container) now uses **native Designer breakpoint variants** so it stays editable
on canvas. Page-specific spacing that must hit an exact pixel keeps a small `@media` block in
that page's embed, scoped to `.dd-page` so it out-ranks Webflow's own rules.

## The footer that won (2026-09-05)

When the Sessions CMS template was migrated onto the Site Footer component, the component
initially replaced the template's own footer wholesale. The template's version was the better
one in several respects, so those details were **ported into the component** rather than
kept as a second system:

| Detail | Ported value |
|---|---|
| `dd-footer-tag` colour | `#b0a8a6` (was `#fff`) — this warm grey is what every page has actually been rendering; it used to come from an `!important` rule in site custom code |
| `dd-footer-bmc-tag` | 13px, `max-width:180px`, `letter-spacing:0.28px` (was 14px, unbounded) |
| BMC tag copy | single text run, wraps naturally (the hard `<br>` is gone) |
| `dd-footer-grid` | two columns below **767** (was 991); one column below 479 retained |

Deliberately **not** ported: the template's flat `<a>` link stack (the component keeps
`ul`/`li`/`a`, which is better for screen readers) and its `::after` BMC arrow (a real `<span>`
is expressible as a Designer class, a pseudo-element is not). Its social icons were also left
off — they were styled structurally from custom code, which is the exact pattern being retired.

## Still open

- The full **Site Footer** component is currently instanced only on the Sessions CMS template,
  which has no published items right now — so its rendering after the migration has been
  verified structurally but **not** on a live URL. Check a session page once one publishes.
- Full-footer design corrections vs. the real darrenhardy.com home footer are the user's, not
  to be done unprompted.
