/* TCEB Founders Event: custom code for the Spiffy checkouts (base, -200-off, -1000-off, -pif).
   One file for everything we add inside Spiffy. The demo pages run this same file, so what the team
   sees in the demo is what gets installed. Hand-over: paste inside <script></script> in each checkout's
   Settings > custom code. */

/* 1. Order summary.
      a. Show the total a second time, right above the Join button, after address, shipping and tax. Spiffy
         already draws this copy (.order-summary-mobile) and shows it on phones; this shows it on desktop too.
      b. Prepay: hide the code chip and the Discount row, so the PIF summary reads like the monthly carts
         (the credit is still applied; only the display changes). */
(function () {
  var css = document.createElement('style');
  css.textContent = '.order-summary-mobile{display:flex!important}' +
    '.coupon-code,.line--discount{display:none!important}';
  document.head.appendChild(css);
})();

/* 2. Spiffy's Quantity block can't go to 0, so the checkout keeps the "Extra Team Seats" dropdown (0 to 10) as the
   real control. This script hides the dropdown and shows a − / + counter that sets it, exactly as if the buyer
   had picked a number. If the script doesn't run, the plain dropdown shows instead and still works. */
(function () {
  var css = document.createElement('style');
  css.textContent =
    '.tceb-team-row{display:flex;justify-content:flex-start;align-items:center;gap:14px}' +
    '.tceb-team-label{font-weight:700;font-size:17px}' +
    '.tceb-stepper{display:inline-flex;border:1px solid #dedede;border-radius:2px;background:#fff}' +
    '.tceb-stepper button{width:42px;height:44px;border:0;background:#fff;color:#000;font-size:20px;line-height:1;cursor:pointer}' +
    '.tceb-stepper button:disabled{color:#c4c4c4;cursor:default}' +
    '.tceb-stepper output{display:grid;place-items:center;width:48px;border-left:1px solid #dedede;border-right:1px solid #dedede;font-size:16px;font-weight:700}';
  document.head.appendChild(css);

  function findSelect() {
    var blocks = document.querySelectorAll('[id^="block-"]');
    for (var i = 0; i < blocks.length; i++) {
      var sel = blocks[i].querySelector('select');
      if (sel && /extra team seats/i.test(blocks[i].textContent)) return sel;
    }
    return null;
  }

  function build() {
    var sel = findSelect();
    if (!sel) return false;
    if (sel.getAttribute('data-tceb-stepper')) return true;
    sel.setAttribute('data-tceb-stepper', '1');
    var max = 0;
    for (var i = 0; i < sel.options.length; i++) max = Math.max(max, parseInt(sel.options[i].value, 10) || 0);

    var field = sel.closest('.has-float-label') || sel.parentElement;
    field.style.display = 'none';
    var row = document.createElement('div');
    row.className = 'tceb-team-row';
    // Counter first, label after it (mirrors the VIP checkbox + label)
    row.innerHTML = '<span class="tceb-stepper"><button type="button" aria-label="Fewer seats">&minus;</button>' +
      '<output aria-live="polite">0</output><button type="button" aria-label="More seats">+</button></span>' +
      '<span class="tceb-team-label">Extra team seats</span>';
    field.parentNode.insertBefore(row, field.nextSibling);
    var minus = row.querySelectorAll('button')[0], plus = row.querySelectorAll('button')[1], out = row.querySelector('output');

    function show() {
      var n = parseInt(sel.value, 10) || 0;
      out.textContent = n; minus.disabled = n <= 0; plus.disabled = n >= max;
    }
    function set(n) {
      n = Math.max(0, Math.min(max, n));
      sel.value = String(n);
      sel.dispatchEvent(new Event('change', { bubbles: true }));  // Spiffy reprices exactly as for a dropdown pick
      show();
    }
    minus.addEventListener('click', function () { set((parseInt(sel.value, 10) || 0) - 1); });
    plus.addEventListener('click', function () { set((parseInt(sel.value, 10) || 0) + 1); });
    sel.addEventListener('change', show);
    show();
    return true;
  }

  // Spiffy draws the form after load, and can redraw it: build once it appears, and again if it is redrawn
  var tries = 0;
  (function wait() { if (!build() && tries++ < 100) setTimeout(wait, 100); })();
  new MutationObserver(function () { var s = findSelect(); if (s && !s.getAttribute('data-tceb-stepper')) build(); })
    .observe(document.documentElement, { childList: true, subtree: true });
})();

/* 3. Pop-up videos (not code): Spiffy's "Get more details from Darren" Popup Link blocks
      VIP:  https://vimeo.com/1236615000
      Team: https://vimeo.com/1236615058 */
