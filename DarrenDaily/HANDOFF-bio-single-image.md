# Handoff: replace the SUCCESS-covers bio wall with ONE image (Sessions Template)

**Goal:** On the DarrenDaily **Sessions Template**, swap the animated wall — 37 separate cover
images + a Darren cutout + the scroll parallax — for a **single pre-composited image**. Same look
(Darren in color, covers in high-quality B&W), but it drops that section from **~2.5 MB to ~100 KB
on every session page**. This is a meaningful bandwidth reduction.

**Nothing in the layout or the page code needs to change beyond the bio section itself. No custom
JavaScript edits are required** (see step 4 — removing the covers element disables the old script on
its own).

---

## The image
`dh-covers.webp` — Darren in front of the SUCCESS covers, baked into one 1200×750 WebP, ~100 KB.

- **Download:** https://github.com/fnxstudio/darren-hardy/raw/main/DarrenDaily/dh-covers.webp
- **See the finished result in the full page (target to match):**
  https://fnxstudio.github.io/darren-hardy/DarrenDaily/darrendaily-post-single-lite.html#about
- **See the bio section ON ITS OWN (resize the window to watch it respond):**
  https://fnxstudio.github.io/darren-hardy/DarrenDaily/darrendaily-bio.html

---

## Steps in Webflow (Designer → Sessions Template page)

**1. Upload the image**
Assets panel → upload `dh-covers.webp`. (It's already WebP and optimized — do **not** re-export it;
leave it as-is.)

**2. Find the bio section**
On the Sessions Template, scroll to the "Behind the covers. Behind closed doors." section. Its wall
is the element with class **`.bio-wall`**, which currently contains two things:
- **`.dd-covers`** — an empty div the script fills with the 37 cover tiles (this is the parallax grid), and
- **`.bio-cutout`** — the Darren cutout image (`Wall-DH-blue2.webp`).

**3. Replace the wall contents with one image**
Inside `.bio-wall`:
- **Delete** the `.dd-covers` div.
- **Delete** the `.bio-cutout` image.
- **Add** an **Image** element, set its source to **`dh-covers.webp`**, and give it a class (e.g.
  `bio-single`) with these settings:
  - Position: **Absolute**, offsets **0** on all sides (fills `.bio-wall`)
  - Width **100%**, Height **100%**
  - **Fit: Cover** (Webflow's object-fit Cover)
  - **Position: Center** — or, for a touch more headroom on Darren, set custom CSS
    `object-position: 50% 38%`
  - Set the image to **Lazy load**

  Equivalent CSS if you prefer to paste it:
  ```css
  .bio-single { position: absolute; inset: 0; width: 100%; height: 100%;
                object-fit: cover; object-position: 50% 38%; display: block; }
  ```

**4. That's it for behavior — no script change needed**
The old covers grid and the scroll **parallax** are built by the shared session script only when it
finds a `.dd-covers` element. Once you delete that element (step 3), the script simply skips it — so
the **parallax and the hover-to-color both stop automatically.** You do **not** need to edit any
JavaScript.

**5. Publish** and check on desktop + phone. The image is centered on Darren, so it crops cleanly to
either shape.

---

## Scope & safety — this change stays on the Sessions Template only

Done as written above, this affects **only the Sessions Template** (i.e. every session detail page —
which is the whole point). It **cannot** touch the Home, Welcome, Expired, Champion, or any other
page. Two simple rules keep it that way:

1. **Only delete instances and add a NEW class.** The steps above delete the `.dd-covers` and
   `.bio-cutout` elements and add one image with a brand-new class (`bio-single`). Deleting an element
   and adding a new-class element are both scoped to this template — they don't propagate.
2. **Do NOT edit the *style* of an existing shared class,** and **do NOT edit inside a Component.**
   Those are the only two things in Webflow that change every page at once. If the bio section ever
   shows the little green **Component** badge, don't edit it in place — that would change every
   instance; ask first. (As built, this section is plain template elements, not a Component.)

If you follow the steps as written, there is nothing to worry about — the marketing pages are
untouched.

**After it's live and verified:** please **ask the team** whether they'd like the same single-image /
bandwidth treatment applied anywhere else on the site before doing it. This "Behind the covers"
section only exists on session pages, so there's nothing identical elsewhere — but if there are other
heavy multi-image blocks worth the same fix, that's a separate, deliberate decision, not part of this
one.

---

## Notes / optional cleanup (not required)
- The single image is grayscale covers + **Darren in full color**, with a subtle vignette so he pops.
  It's already toned and sized — please don't run it back through any compressor (it's at the size
  budget already).
- **Optional, later:** once this is live, the 37 individual cover image assets and the old cutout are
  no longer used by session pages and can be removed from Assets to tidy up. The covers-building code
  in the shared session script can also be deleted whenever convenient — but it is harmless as-is
  (it no-ops without the `.dd-covers` element), so this is housekeeping, not a requirement.
- **Bandwidth reminder unrelated to this task:** session **thumbnails** should always be saved as
  **WebP** (~70 KB), not 2 MB PNGs — that's the other big bandwidth item. See the intake SOP.

Questions on any step — happy to clarify.
