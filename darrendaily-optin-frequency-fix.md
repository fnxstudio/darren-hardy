# Task: Cap the DarrenDaily opt-in popups to once per day

**For a developer using Claude Code.** Open Claude Code inside the repo/theme that
contains the live `darrenhardy.com` homepage template, then say:

> "Follow the instructions in `darrendaily-optin-frequency-fix.md`. Make the edits,
> then show me a diff before saving."

This file is self-contained — everything needed is below.

---

## Goal (plain English)

The homepage has **two** DarrenDaily opt-ins:
- a **slide-in** panel (triggers after ~20s or at 70% scroll)
- an **exit-intent modal** (triggers when the cursor leaves the top of the window)

Right now they can appear on **every visit**, and dismissing one does not stop the
other — so visitors see them too often.

**Change the behavior to:** a visitor sees the opt-in **at most once per calendar day**.
As soon as they **submit the form** OR **dismiss it** (the ✕, an outside/backdrop click,
or Esc — on *either* popup), **both** popups are hidden for the **rest of that day**.
They become eligible again the **next day**.

**How:** store one date string in `localStorage` under a single shared key,
`ddOptinDismissed`. Write it on submit/close; on load, each popup stays hidden if that
value equals today's date. Different day → different value → it can show again.

---

## Where the code lives

Two inline `<script>` blocks near the **bottom of the homepage template** (WordPress
theme `eighteen-tags`). Identify them by their form targets:
- **Slide-in script** — contains `target: "#ddHsForm"` and `#ddOptin` / `.dd-panel`
- **Exit-intent script** — contains `target: "#ddExitHsForm"` and `#ddExitOptin` / `.dd-modal`

Search the template for `ddOptinSeen` (slide-in) and `ddOptinSeenExit` (exit modal) to
jump straight to the blocks. **Do not touch any HTML or CSS — JavaScript only.**

---

## Edit 1 of 2 — the SLIDE-IN script (`#ddHsForm`)

### 1a. Replace the frequency block

**FIND:**
```js
  const FREQUENCY_DAYS = 0;
  const KEY     = 'ddOptinSeen';
  let lastFocus = null, timer = null, shown = false;

  function recentlyShown() {
    if (!FREQUENCY_DAYS) return false;
    try { const t = +localStorage.getItem(KEY); return t && (Date.now() - t) < FREQUENCY_DAYS * 86400000; }
    catch (e) { return false; }
  }
  function remember() { try { localStorage.setItem(KEY, Date.now()); } catch (e) {} }
  if (!FREQUENCY_DAYS) { try { localStorage.removeItem(KEY); } catch (e) {} }
```

**REPLACE WITH:**
```js
  let lastFocus = null, timer = null, shown = false;

  // Once a visitor submits OR closes EITHER popup, hide BOTH for the rest of the
  // calendar day (shared via one localStorage key). Eligible again the next day.
  var DAY_KEY = 'ddOptinDismissed';
  function todayStamp() { var d = new Date(); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); }
  function dismissedToday() { try { return localStorage.getItem(DAY_KEY) === todayStamp(); } catch (e) { return false; } }
  function markDismissed() { try { localStorage.setItem(DAY_KEY, todayStamp()); } catch (e) {} }
```

### 1b. In `open()` — add the daily guard, remove `remember()`

**FIND:**
```js
  function open() {
    if (shown) return;
    shown = true;
    remember();
```
**REPLACE WITH:**
```js
  function open() {
    if (shown || dismissedToday()) return;
    shown = true;
```

### 1c. In `close()` — record the dismissal

Add `markDismissed();` inside the `close()` function (just before the
`if (lastFocus ...)` line):

```js
  function close() {
    optin.classList.remove('open');
    optin.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', onKey);
    markDismissed();                          // <-- ADD THIS LINE
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
```

### 1d. In the form's `onFormSubmitted` — count a signup as done for the day

**FIND:**
```js
        onFormSubmitted: function () {
          formEl.hidden = true;
```
**REPLACE WITH:**
```js
        onFormSubmitted: function () {
          markDismissed();                    // <-- ADD THIS LINE
          formEl.hidden = true;
```

### 1e. The arming guard at the bottom

**FIND:**
```js
  if (!recentlyShown()) {
    timer = setTimeout(open, DELAY);
    window.addEventListener('scroll', onScrollGuarded, { passive: true });
  }
```
**REPLACE WITH:**
```js
  if (!dismissedToday()) {
    timer = setTimeout(open, DELAY);
    window.addEventListener('scroll', onScrollGuarded, { passive: true });
  }
```

---

## Edit 2 of 2 — the EXIT-INTENT script (`#ddExitHsForm`)

Apply the **same five edits**. Keep `DAY_KEY = 'ddOptinDismissed'` (the shared key is
what links the two popups). Only these spots differ from the slide-in:

- **1a.** The frequency block here uses `const KEY = 'ddOptinSeenExit';` and
  `let lastFocus = null, shown = false;` (no `timer`). Replace that whole block with the
  same shared-key helper — but keep the `let lastFocus = null, shown = false;` line as-is
  (no `timer` in this script):
  ```js
  let lastFocus = null, shown = false;

  var DAY_KEY = 'ddOptinDismissed';
  function todayStamp() { var d = new Date(); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); }
  function dismissedToday() { try { return localStorage.getItem(DAY_KEY) === todayStamp(); } catch (e) { return false; } }
  function markDismissed() { try { localStorage.setItem(DAY_KEY, todayStamp()); } catch (e) {} }
  ```
- **1b.** Same `open()` change: `if (shown || dismissedToday()) return;` and delete `remember();`.
- **1c.** Same `close()` change: add `markDismissed();`.
- **1d.** Same `onFormSubmitted` change: add `markDismissed();` as the first line.
- **1e.** The arming guard wraps the mouseout listener — change the condition only:
  ```js
  if (!dismissedToday()) {
    document.addEventListener('mouseout', onExitIntent);
  }
  ```

---

## Verify

1. Load the homepage in a fresh **incognito** window (clean `localStorage`).
2. Trigger the slide-in (wait ~20s or scroll down ~70%). **Close it** (✕).
3. **Reload the page.** ✅ It should **not** reappear — and the exit-intent modal should
   **not** fire on mouse-out either.
4. Repeat but **submit** the form instead of closing — same result: neither reappears
   for the rest of the day.
5. Simulate the next day: DevTools → **Application → Local Storage** → delete the
   `ddOptinDismissed` key (or open a new incognito window). ✅ The opt-in shows again.
6. Console should be clean — no JS errors.

---

## Guardrails

- **JavaScript only.** Do not change any HTML, CSS, the popup copy, or the HubSpot IDs
  (`portalId: "2518645"`, `formId: "7aded4d3-951e-41ee-b813-ab3d21a5387a"`).
- Make the **same** edits to **both** scripts, and keep the key `'ddOptinDismissed'`
  identical in both — that shared key is what makes dismissing one hide the other.
- Delete the leftover testing line `if (!FREQUENCY_DAYS) { ... removeItem(KEY) ... }` in
  both scripts (step 1a removes it) — it was wiping the cap on every page load.
- The old keys `ddOptinSeen` / `ddOptinSeenExit` are no longer used; you can leave any
  stragglers in visitors' browsers, they're harmless.

## Rollback

The change is confined to those two `<script>` blocks. To revert, restore them from
version control (or your backup of the template).

---

### Optional tweaks (ask if you want them)

- **Only suppress on the ✕ and a real submit** (so an accidental backdrop/Esc close
  doesn't burn the visitor's day): move `markDismissed()` out of `close()` and instead
  call it only from the ✕ button's handler and from `onFormSubmitted`.
- **Drop exit-intent entirely** if once-a-day still feels like too much: delete the
  `if (!dismissedToday()) { document.addEventListener('mouseout', onExitIntent); }` block
  in the exit script.
