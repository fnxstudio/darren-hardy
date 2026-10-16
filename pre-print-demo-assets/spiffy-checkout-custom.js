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

/* 3. VIP and Team sections. Finds the section holding the VIP checkbox and the one holding the Extra Team Seats
      dropdown and builds the rest of each box: corner tab, headline, grey line, bullets, price on the right
      (prepay prices on the -pif cart), and a "Get more details from Darren" link that plays Darren's video inline.
      Also styles the action rows (champagne tint, 44px checkbox), relabels the checkbox "Add VIP to my seat" and
      takes the apostrophe out of "FOUNDER'S" on the Join button. If the script doesn't run, the plain Spiffy
      checkbox and dropdown show instead and still work. */
(function () {
  var PIF = /-pif(\/|$|\?)/.test(location.pathname + '/');
  var BOX = {
    vip: {
      tab: 'Extra half-day with Darren',
      price: PIF ? ['Only $1,495'] : ['Only $115 today', '+$115 for 12 months'],
      head: 'YES! Make me a VIP',
      sub: 'Private additional session · April 28, 2027',
      bullets: ['Connect with your fellow VIP Founders before the event begins',
        'Your own VIP virtual space throughout the event',
        'Two weeks of recording access instead of 96 hours'],
      video: '1236615000'
    },
    team: {
      tab: 'Save $6,000 per seat',
      price: PIF ? ['Only $3,995/ea'] : ['Only $308/ea today', '+$308 for 12 months'],
      head: 'YES! I want to bring my leaders',
      sub: 'General Admission seats for your key leaders',
      bullets: ['They see the vision and share your conviction firsthand',
        'You come back with a team ready to lead the change',
        'Option to upgrade seat(s) to VIP before the event'],
      video: '1236615058'
    }
  };

  var font = document.createElement('link');
  font.rel = 'stylesheet';
  font.href = 'https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap';
  document.head.appendChild(font);

  var css = document.createElement('style');
  css.textContent =
    '.tceb-box .card{position:relative;overflow:hidden}' +
    '.tceb-tab{position:absolute;top:0;right:0;z-index:1;padding:7px 12px;background:#e1132e;color:#fff;font-size:11px;font-weight:800;letter-spacing:.1em;line-height:1.2;text-transform:uppercase}' +
    '.tceb-content{position:relative;color:#000}' +
    '.tceb-head{margin:0 0 10px;padding-right:230px;font-family:"Bebas Neue",sans-serif;font-size:30px;font-weight:400;line-height:.95;letter-spacing:.02em;text-transform:uppercase}' +
    '.tceb-sub{margin:0 0 10px;padding-right:230px;color:#7a7a7a;font-size:13px;font-weight:600;letter-spacing:.04em;text-transform:uppercase}' +
    '.tceb-list{margin:0;padding-left:18px;font-size:14px;line-height:1.6}' +
    '.tceb-more{padding:0;border:0;background:none;color:inherit;font:inherit;text-decoration:underline;text-underline-offset:3px;cursor:pointer}' +
    '.tceb-price{position:absolute;top:20px;right:0;text-align:right}' +
    '.tceb-price b{display:block;font-size:16px;font-weight:700;line-height:1.25}' +
    '.tceb-price small{display:block;margin-top:2px;color:#6e6e6e;font-size:12px}' +
    '.tceb-video{position:relative;margin-top:12px;padding-top:56.25%;background:#000}' +
    '.tceb-video iframe{position:absolute;top:0;left:0;width:100%;height:100%;border:0}' +
    '.tceb-vip .layout-checkboxes1,.tceb-team .tceb-team-row{margin-top:16px;padding:14px 16px;border-radius:2px;background:#f5eedf}' +
    '.tceb-vip .custom-control{padding-left:0}' +
    '.tceb-vip .custom-control-label{position:relative;display:flex;align-items:center;min-height:44px;padding-left:58px;font-size:17px;font-weight:700;cursor:pointer}' +
    '.tceb-vip .custom-control-label::before,.tceb-vip .custom-control-label::after{top:0!important;left:0!important;width:44px!important;height:44px!important;margin-top:0!important}' +
    '.tceb-vip .custom-control-label::before{border:1px solid #dedede;border-radius:2px;background:#fff;box-shadow:none}' +
    '.tceb-vip .custom-control-input:checked~.custom-control-label::before{border-color:#e1132e!important;background-color:#e1132e!important}' +
    '.tceb-vip .custom-control-label::after{background-size:22px}' +
    '.tceb-vip .option-price{display:none!important}' +
    '@media (max-width:600px){.tceb-box .section__inner{padding-top:40px}.tceb-head,.tceb-sub{padding-right:0}' +
    '.tceb-price{position:static;margin:0 0 12px}}';
  document.head.appendChild(css);

  function esc(t) { var d = document.createElement('div'); d.textContent = t; return d.innerHTML; }

  function build(sec, kind) {
    var c = BOX[kind], card = sec.querySelector('.card'), inner = sec.querySelector('.section__inner') || card;
    if (!card || card.querySelector('.tceb-tab')) return;
    var tab = document.createElement('span');
    tab.className = 'tceb-tab'; tab.textContent = c.tab;
    card.insertBefore(tab, card.firstChild);

    var box = document.createElement('div');
    box.className = 'tceb-content';
    box.innerHTML =
      '<div class="tceb-price"><b>' + esc(c.price[0]) + '</b>' + (c.price[1] ? '<small>' + esc(c.price[1]) + '</small>' : '') + '</div>' +
      '<h3 class="tceb-head">' + esc(c.head) + '</h3>' +
      '<p class="tceb-sub">' + esc(c.sub) + '</p>' +
      '<ul class="tceb-list">' + c.bullets.map(function (b) { return '<li>' + esc(b) + '</li>'; }).join('') +
      '<li><button type="button" class="tceb-more">Get more details from Darren →</button></li></ul>';
    inner.insertBefore(box, inner.firstChild);

    // Darren's video plays right under the bullets; a second click closes it
    var more = box.querySelector('.tceb-more');
    more.addEventListener('click', function () {
      var open = box.querySelector('.tceb-video');
      if (open) { open.remove(); return; }
      var v = document.createElement('div');
      v.className = 'tceb-video';
      v.innerHTML = '<iframe src="https://player.vimeo.com/video/' + c.video + '?autoplay=1&title=0&byline=0&portrait=0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen title="Darren on the ' + (kind === 'vip' ? 'VIP upgrade' : 'team seats') + '"></iframe>';
      box.appendChild(v);
    });
  }

  function tag(block, kind) {
    var sec = block && block.closest('.section');
    if (!sec) return;
    if (!sec.classList.contains('tceb-' + kind)) sec.classList.add('tceb-box', 'tceb-' + kind);
    build(sec, kind);
  }

  function relabel(label) {
    // The checkbox label's own text (the price badge beside it is hidden by the CSS above)
    for (var n = label.firstChild; n; n = n.nextSibling) {
      if (n.nodeType === 3 && n.nodeValue.trim()) {
        if (n.nodeValue.trim() !== 'Add VIP to my seat') n.nodeValue = ' Add VIP to my seat ';
        return;
      }
    }
  }

  function scan() {
    document.querySelectorAll('[id^="block-"]').forEach(function (b) {
      var cbLabel = b.querySelector('input[type="checkbox"] ~ label');
      if (cbLabel && /vip/i.test(cbLabel.textContent)) { tag(b, 'vip'); relabel(cbLabel); }
      if (b.querySelector('select') && /extra team seats/i.test(b.textContent)) tag(b, 'team');
    });
    // Join button: FOUNDER'S -> FOUNDERS
    document.querySelectorAll('button, .btn').forEach(function (btn) {
      for (var n = btn.firstChild; n; n = n.nextSibling) {
        if (n.nodeType === 3 && /FOUNDER['’]S/i.test(n.nodeValue)) n.nodeValue = n.nodeValue.replace(/(FOUNDER)['’](S)/gi, '$1$2');
      }
    });
  }
  var tries = 0;
  (function wait() { scan(); if (!document.querySelector('.tceb-vip') && tries++ < 100) setTimeout(wait, 100); })();
  new MutationObserver(scan).observe(document.documentElement, { childList: true, subtree: true, characterData: true });
})();
