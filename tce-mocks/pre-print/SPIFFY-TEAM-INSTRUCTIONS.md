# Spiffy: TCE pre-print checkout (`the-compound-effect-pre-print`)

Two pastes in this one checkout, then publish. Nothing else in Spiffy changes, and no other checkout is affected.

**This replaces our earlier request** to change the "TCEB Hardcover" option to an Order Field so a link could pre-select the bundle. Please skip that one; this script does the job instead.

## 1. Custom code: lets our page pick the bundle

Where: open the checkout in the editor, **Settings** tab, custom code. Paste this:

```html
<script>
/* TCEB pre-print page (thecompoundeffect.com/pre-print).
   When a visitor picks 3, 10 or 100 books on our page, the page tells this embedded
   checkout which bundle to select. Only messages from our own site are accepted. */
(function () {
  var ALLOWED = /^https:\/\/((www\.)?thecompoundeffect\.com|the-compound-effect-dh\.webflow\.io)$/;
  var INDEX = { '3': 0, '10': 1, '100': 2 };
  function pick(tier, tries) {
    var btn = document.querySelectorAll('#block-370965 label.option-button-auto-width')[INDEX[tier]];
    if (!btn) { if (tries > 0) setTimeout(function () { pick(tier, tries - 1); }, 100); return; }
    if (!btn.classList.contains('option-button-auto-width--selected')) btn.click();
  }
  window.addEventListener('message', function (e) {
    if (!ALLOWED.test(e.origin) || !e.data || e.data.type !== 'tceb-preprint-tier') return;
    if (!(String(e.data.tier) in INDEX)) return;
    pick(String(e.data.tier), 50);
  });
})();
</script>
```

It clicks the checkout's own 3 / 10 / 100 Books button, exactly as a person would, so the order line, price and saved option all stay correct. It does nothing when someone opens the checkout directly.

## 2. Custom CSS: brand styling

Where: same checkout, **Design** tab, **Custom CSS**. Paste the CSS from the preview page (Copy button):
https://fnxstudio.github.io/darren-hardy/tce-mocks/pre-print/spiffy-css-preview.html

## 3. Publish the checkout

Both only show on the live (published) checkout, not in the editor preview.

## Tell us when it's published

We'll test it on the page and only come back if something doesn't work.

## Notes for whoever installs it

- The script depends on the bundle buttons staying in that option block (block 370965) in the order 3, 10, 100. If the options are ever reordered or rebuilt, let us know.
- If we add a production domain other than thecompoundeffect.com, the address list in the first line of the script needs it added.
