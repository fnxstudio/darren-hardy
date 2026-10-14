# Spiffy: Founder 100 button label (`the-compound-effect-pre-print` checkout)

One paste in this one checkout, then publish. Nothing else in Spiffy changes, and no other checkout is affected.

**What it does:** on thecompoundeffect.com/founder100 the checkout button reads
**YES. I WANT TO BE PART OF THE LEGACY.** On /pre-print, and when someone opens the checkout directly,
it keeps Spiffy's own label ("Complete Purchase"). Only the Founder 100 page sends the new label, so
nothing else can change it.

## Replace the custom code

Where: open the checkout in the editor, **Settings** tab, custom code. **Replace** the existing
"TCEB pre-print page" script with this one. It is the same script with the button part added, so the
bundle picking on /pre-print keeps working exactly as before.

```html
<script>
/* TCEB pre-print page (thecompoundeffect.com/pre-print) and Founder 100 page (/founder100).
   When a visitor picks 3, 10 or 100 books on our page, the page tells this embedded
   checkout which bundle to select. Only messages from our own site are accepted.
   The Founder 100 page also sends buttonText, which relabels the checkout button for that visit;
   /pre-print never sends it, so its button keeps Spiffy's own label. */
(function () {
  var ALLOWED = /^https:\/\/((www\.)?thecompoundeffect\.com|the-compound-effect-dh\.webflow\.io)$/;
  var INDEX = { '3': 0, '10': 1, '100': 2 };
  function pick(tier, tries) {
    var btn = document.querySelectorAll('#block-370965 label.option-button-auto-width')[INDEX[tier]];
    if (!btn) { if (tries > 0) setTimeout(function () { pick(tier, tries - 1); }, 100); return; }
    if (!btn.classList.contains('option-button-auto-width--selected')) btn.click();
  }
  function relabel(text, tries) {
    var b = document.querySelector('button[data-cy="checkout-button"]');
    if (!b) { if (tries > 0) setTimeout(function () { relabel(text, tries - 1); }, 100); return; }
    function apply() {
      var t = [].slice.call(b.childNodes).filter(function (n) { return n.nodeType === 3 && n.textContent.trim(); });
      if (t.length && t[0].textContent.trim() !== text) t[0].textContent = ' ' + text + ' ';
    }
    apply();
    if (!b.__f100obs) { b.__f100obs = new MutationObserver(apply); b.__f100obs.observe(b, { childList: true, characterData: true, subtree: true }); }
  }
  window.addEventListener('message', function (e) {
    if (!ALLOWED.test(e.origin) || !e.data || e.data.type !== 'tceb-preprint-tier') return;
    if (String(e.data.tier) in INDEX) pick(String(e.data.tier), 50);
    if (typeof e.data.buttonText === 'string' && e.data.buttonText.length <= 60) relabel(e.data.buttonText, 50);
  });
})();
</script>
```

## Publish the checkout

Custom code only runs on the live (published) checkout, not in the editor preview.

## Tell us when it's published

We'll check both pages: /founder100 shows the new label, /pre-print still says "Complete Purchase".

## Notes for whoever installs it

- The button is found by `button[data-cy="checkout-button"]`. If Spiffy changes that attribute, the label quietly falls back to Spiffy's own text. Nothing breaks.
- Tested 2026-10-14 by running this code on the live checkout in a browser: the label changed, the button's spinner icons stayed, and the label held when the bundle was switched.
