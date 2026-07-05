# Guided fix: cap the DarrenDaily opt-in popups to once per day

**How to use this:** open Claude Code inside the codebase for the live `darrenhardy.com`
homepage (the WordPress `eighteen-tags` theme), attach this file, and say:

> "Walk me through this."

---

## Instructions to Claude Code (read this, then run the session below)

You are helping a developer reduce how often the DarrenDaily opt-in popups appear on
`darrenhardy.com`. **Be conversational and teach as you go.** Do not make any edits until
you've walked the developer through the steps and they've told you how they want to
proceed.

Rules for the session:
- Go **one step at a time.** After each **❓ ASK** checkpoint, stop and wait for the
  developer's answer before continuing.
- Explain *what* you're about to do and *why*, in plain language, before doing it.
- **JavaScript only** — never change HTML, CSS, the popup copy, or the HubSpot IDs
  (`portalId: "2518645"`, `formId: "7aded4d3-951e-41ee-b813-ab3d21a5387a"`).
- If you make edits, **show a diff and get approval before saving.**
- If anything you find doesn't match what's described here, pause and flag it rather than
  guessing.

---

### Step 1 — Get oriented

Tell the developer, in your own words:

> "This site has **two** DarrenDaily opt-ins on the homepage: a **slide-in** panel that
> appears after ~20 seconds or at 70% scroll, and an **exit-intent modal** that fires when
> the cursor leaves the top of the window. Right now they can show on *every* visit, and
> closing one doesn't stop the other — so visitors see them too often. We're going to make
> it so a visitor sees the opt-in **at most once per day**."

Then locate the code. Search the theme for `ddOptinSeen` and `ddOptinSeenExit` — these
mark the two inline `<script>` blocks near the bottom of the homepage template. The
slide-in block contains `target: "#ddHsForm"`; the exit-intent block contains
`target: "#ddExitHsForm"`.

**❓ ASK:** "I found both opt-in scripts in `<file/location>`. Want me to give you a quick
tour of how they currently decide when to show, before we change anything?"
→ If yes, briefly explain the three current problems (below). If no, continue.

The three reasons it over-shows today:
1. `FREQUENCY_DAYS = 0` plus a leftover testing line that **wipes the saved value on every
   page load** (`localStorage.removeItem(KEY)`) — so there's effectively no cap.
2. It records "seen" when the popup **opens**, not when the visitor acts on it.
3. The two popups use **separate** storage keys, so dismissing one has no effect on the other.

---

### Step 2 — Explain the plan, then ask how to proceed

Explain the fix:

> "The fix is small. Both popups will share **one** value in the browser's `localStorage`
> called `ddOptinDismissed`, holding today's date. We write that date the moment the
> visitor **submits** the form or **dismisses** the popup. On every load, each popup checks
> that value — if it's today, it stays hidden; if it's a different day (or empty), it can
> show again. One shared key is what makes dismissing *either* popup hide *both*."

**❓ ASK (this is the important one):** "How do you want to do this — **should I make the
edits myself** (I'll walk you through each one and show you a diff before saving), **or
would you rather I just give you the exact changes** and you apply them? Either way I'll
explain every change."

Remember their answer and follow it for the rest of the session.

---

### Step 3 — Confirm the two behavior choices

Before touching code, confirm how they want it to behave:

**❓ ASK:** "Two quick product decisions:
1. **What counts as 'dismissed'?** The default is *any* close — the ✕, clicking the dark
   backdrop, or pressing Esc — plus a successful submit. The alternative is to only count
   the **✕ and a real submit** (so an accidental backdrop/Esc click doesn't use up their
   day). Which do you want?
2. **Keep the exit-intent modal?** With the once-a-day cap it's much gentler, but if you'd
   rather remove that trigger entirely and keep only the slide-in, I can do that too. Keep
   it, or drop it?"

Apply their answers in Step 4 (notes on how are inline below).

---

### Step 4 — Make the changes (or hand them over)

Apply these **five edits to each of the two scripts**. Explain each edit in one sentence as
you go. Keep the key `'ddOptinDismissed'` **identical in both** scripts.

**Edit A — replace the frequency block.**
Explain: *"This swaps the old no-op frequency logic for three tiny helpers that read/write
today's date under the shared key."*

Slide-in — FIND:
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
REPLACE WITH:
```js
  let lastFocus = null, timer = null, shown = false;

  // Once a visitor submits OR closes EITHER popup, hide BOTH for the rest of the
  // calendar day (shared via one localStorage key). Eligible again the next day.
  var DAY_KEY = 'ddOptinDismissed';
  function todayStamp() { var d = new Date(); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); }
  function dismissedToday() { try { return localStorage.getItem(DAY_KEY) === todayStamp(); } catch (e) { return false; } }
  function markDismissed() { try { localStorage.setItem(DAY_KEY, todayStamp()); } catch (e) {} }
```
*(Exit-intent script is identical except its old line is `const KEY = 'ddOptinSeenExit';`
and it has no `timer` — keep its `let lastFocus = null, shown = false;` line as-is.)*

**Edit B — guard `open()` and stop recording on open.**
Explain: *"Now the popup won't even open if it was already dismissed today, and we no
longer mark it 'seen' just for showing."*
FIND `if (shown) return;` (first line of `open()`), REPLACE with `if (shown || dismissedToday()) return;`,
and **delete** the `remember();` line just below it.

**Edit C — record the dismissal on close.**
Explain: *"When the visitor closes the popup, we stamp today's date."*
Add `markDismissed();` inside `close()`, just before the `if (lastFocus ...)` line.
→ *If the developer chose "only ✕ + submit" in Step 3:* do **not** add it to `close()`;
instead add `markDismissed();` only inside the ✕ button's own click handler.

**Edit D — record the dismissal on submit.**
Explain: *"A successful signup also counts as done for the day."*
In the form's `onFormSubmitted` callback, add `markDismissed();` as the first line
(before `formEl.hidden = true;`).

**Edit E — the arming guard.**
Explain: *"On load, if it was dismissed today, we don't even wire up the triggers."*
FIND `if (!recentlyShown()) {` and REPLACE with `if (!dismissedToday()) {`.
*(Slide-in: this wraps the `setTimeout` + scroll listener. Exit modal: it wraps the
`mouseout` listener.)*
→ *If the developer chose "drop exit-intent" in Step 3:* in the exit script, remove that
whole `if (...) { document.addEventListener('mouseout', onExitIntent); }` block instead.

When done (if you made the edits): show the full diff and ask for approval before saving.

---

### Step 5 — Verify together

Walk the developer through testing:

> "Let's confirm it works:
> 1. Open the homepage in a **fresh incognito** window.
> 2. Trigger the slide-in (wait ~20s or scroll ~70%), then **close** it.
> 3. **Reload** — it should NOT come back, and the exit-intent modal should NOT fire on
>    mouse-out either. ✅
> 4. Try again but **submit** the form instead — same result.
> 5. To simulate the next day: DevTools → Application → Local Storage → delete the
>    `ddOptinDismissed` key (or use a new incognito window) — the opt-in shows again. ✅
> 6. Check the console is clean — no JS errors."

**❓ ASK:** "Want me to do anything else — e.g., adjust the once-a-day to a different
window, or wire this same behavior into any other pages that use the opt-in?"

---

### Rollback

All changes are confined to the two `<script>` blocks. To revert, restore them from
version control or your backup of the template.
