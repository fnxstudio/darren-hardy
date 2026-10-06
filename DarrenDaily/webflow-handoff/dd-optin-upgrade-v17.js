/* DarrenDaily opt-in upgrade: swaps the interim #ddForm for the real HubSpot
   opt-in form (41958dbb, classic/DOM so it's CSS-stylable), brand-styled to
   match the pages. Phone is SHOWN and optional; typing one reveals the SMS
   opt-in checkbox and makes it required (see ddSmsWire). The Role placeholder
   reads 'Your Role*' so it matches the /on-demand drawer form word for word.
   Consent line hidden (.dd-micro below the button already carries it). Keeps the
   urgency + micro trust copy. Redirects to /welcome (set in HubSpot). Hidden
   dd_id (referral) + UTM fields ride along automatically. */
(function () {
  var FORM = { region: "na1", portalId: "2518645", formId: "41958dbb-3c3a-439b-b747-bb96acf50680" };

  var css = `
  /* NO top margin here. This mount sits inside .home-dd-form, whose Designer
     rule already sets margin-top:42px AND max-width:540px. Setting them again
     stacked a SECOND 42px, so the gap from the copy above to the first field
     was 90px against a 12px field rhythm -- it read as a hole. The wrapper is
     the single source of that spacing now; change it there, not here.
     max-width stays as a floor for any page that mounts this outside a
     .home-dd-form wrapper. */
  .dd-hsform { max-width: 540px; margin: 0 auto; text-align: left; }
  .dd-hsform .hs-form { display: block; }
  .dd-hsform .hs-form fieldset { max-width: none !important; }
  .dd-hsform .hs-form .form-columns-2 { display: flex; gap: 12px; }
  .dd-hsform .hs-form .form-columns-2 > .hs-form-field { width: 50% !important; float: none !important; padding: 0 !important; }
  .dd-hsform .hs-form .form-columns-1 > .hs-form-field { width: 100% !important; float: none !important; padding: 0 !important; }
  .dd-hsform .hs-form .hs-form-field { margin-bottom: 12px; min-width: 0; }
  .dd-hsform .hs-form .hs-form-field > label { display: block; font-size: 12px; font-weight: 600; letter-spacing: .03em; color: #616a78; margin-bottom: 6px; }
  .dd-hsform .hs-form .hs-form-required { color: #a72632; margin-left: 2px; }
  .dd-hsform .hs-form .input { margin: 0 !important; }
  .dd-hsform .hs-form .hs-input { width: 100% !important; box-sizing: border-box; font-family: 'Inter', -apple-system, sans-serif; font-size: 15px; color: #14171c; padding: 16px 18px; border: 1.5px solid rgba(20,23,28,.12); border-radius: 4px; background: #fff; transition: border-color .18s, box-shadow .18s; }
  .dd-hsform .hs-form .hs-input:focus { outline: none; border-color: #a72632; box-shadow: 0 0 0 3px rgba(167,38,50,.16); }
  .dd-hsform .hs-form select.hs-input { -webkit-appearance: none; appearance: none; cursor: pointer; padding-right: 42px; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' fill='none' stroke='%23616a78' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 16px center; color: #757575; }
  .dd-hsform .hs-form select.hs-input.dd-chosen { color: #14171c; } /* real role picked -> ink; placeholder stays grey to match the input placeholders */
  /* Only the consent line is hidden -- .dd-micro under the button already says it.
     (The old .hs_text_messaging_optin_property rule is gone: that field no longer
     exists on form 41958dbb, so the selector matched nothing.) */
  .dd-hsform .legal-consent-container { display: none !important; }
  /* Placeholder-in-field: Role and Phone carry their name inside the control, so the
     header labels are dropped -- matches First Name / Email, whose HubSpot placeholders
     already do this. Both sit in their own form-columns-1 row, so no width override. */
  /* v17: HubSpot ships First Name, Email and Mobile Phone with EMPTY labels.
     ddNameLabels() gives each its placeholder words in a .dd-vh span, clipped the
     same way, so the field gets an accessible name while the label box keeps the
     exact size it had empty (the First Name and Email labels stay in flow). */
  .dd-hsform .hs-form .hs-form-field { position: relative; }
  .dd-hsform .hs-form .dd-vh{position:absolute !important;width:1px !important;height:1px !important;padding:0 !important;margin:-1px !important;overflow:hidden !important;clip:rect(0 0 0 0) !important;white-space:nowrap !important;border:0 !important}
  .dd-hsform .hs-form .hs_company_role > label, .dd-hsform .hs-form .hs_mobilephone > label{position:absolute !important;width:1px !important;height:1px !important;padding:0 !important;margin:-1px !important;overflow:hidden !important;clip:rect(0 0 0 0) !important;white-space:nowrap !important;border:0 !important}
  /* --- Conditional SMS consent -----------------------------------------------
     HubSpot's OWN dependent-field logic owns show/hide here: it injects this field
     the instant mobilephone gets a value and removes it from the DOM when the field
     is cleared. So we deliberately do NOT hide it ourselves. An earlier version
     defaulted it to display:none and revealed it via a .dd-sms-on class -- that
     risked a dead end where the field was present but invisible while the submit
     guard below blocked submission, leaving nothing the visitor could click.
     Being removed from the DOM also satisfies rules/hidden-dialogs-must-be-unfocusable.md
     for free. We only style it, fix its copy, and enforce consent. */
  .dd-hsform .hs_text_messaging_optin_property .inputs-list { list-style: none; margin: 0; padding: 0; }
  /* HubSpot ships this field's copy in <legend class="hs-field-desc"> and leaves the
     checkbox's own <span> EMPTY. ddSmsWire() moves the copy into that span; these rules
     style it either way, so the consent text can never end up invisible. */
  .dd-hsform .hs-form-booleancheckbox-display { display: flex; align-items: flex-start; gap: 10px; font-size: 13px; font-weight: 400; line-height: 1.5; color: #616a78; cursor: pointer; }
  .dd-hsform .hs_text_messaging_optin_property .hs-field-desc { font-size: 13px; font-weight: 400; line-height: 1.5; color: #616a78; margin: 0 0 8px; padding: 0; }
  /* the generic .hs-input rule above would stretch the checkbox to full width */
  .dd-hsform .hs-form .hs-form-booleancheckbox-display > input.hs-input { width: 18px !important; height: 18px; flex: 0 0 auto; margin: 1px 0 0; padding: 0 !important; accent-color: #a72632; box-shadow: none; cursor: pointer; }
  .dd-hsform .dd-sms-fine { display: block; margin-top: 6px; font-size: 11.5px; font-weight: 400; line-height: 1.45; color: #8a919c; }
  .dd-hsform .dd-sms-fine a { color: #8a919c; text-decoration: underline; }
  .dd-hsform .dd-sms-error { margin: 8px 0 0; font-size: 12.5px; color: #a72632; }
  .dd-hsform .hs-error-msgs { list-style: none; margin: 6px 0 0; padding: 0; }
  .dd-hsform .hs-error-msg { color: #a72632; font-size: 12.5px; }
  /* Gap from the last field to the button. Fields carry margin-bottom:12px,
     so 12 here totals 24px -- deliberately the same 24px as the DDOD drawer
     form, so the two opt-ins read identically. It was 6 (=18px total).
     DDOD reaches 24 differently (10px over a 14px field rhythm, set in that
     page's body embed), so match the RESULTING gap, not the number, and
     change both together or they drift.
     NOTE this whole CSS block is a JS template literal -- no backticks in
     these comments, ever. One in v13 closed the string early and the script
     died before mounting the form. */
  .dd-hsform .hs_submit { margin-top: 12px; }
  .dd-hsform .hs_submit .actions { position: relative; overflow: hidden; margin: 0; padding: 0; border-radius: 4px; box-shadow: 0 14px 30px -12px rgba(167,38,50,.5); }
  /* DarrenDaily signature button shine (input can't take ::after, so it rides on the wrapper) */
  .dd-hsform .hs_submit .actions::after { content: ""; position: absolute; top: 0; left: -80%; width: 60%; height: 100%; z-index: 2; pointer-events: none; background: linear-gradient(105deg, transparent 20%, rgba(255,255,255,.28) 50%, transparent 80%); animation: dd-cta-shimmer 4s ease-in-out infinite; }
  .dd-hsform .hs_submit .actions:hover::after { opacity: 0; }
  @keyframes dd-cta-shimmer { 0% { left: -80%; opacity: 1; } 38% { left: 110%; opacity: 1; } 39% { opacity: 0; } 100% { left: 110%; opacity: 0; } }
  .dd-hsform .hs-button { width: 100%; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; font-family: 'Inter', -apple-system, sans-serif; font-weight: 800; font-size: 12.5px; letter-spacing: .2em; text-transform: uppercase; padding: 19px 28px; border-radius: 4px; background: #a72632; color: #fff; border: 2px solid #a72632; transition: background .2s, color .2s, transform .2s; -webkit-appearance: none; appearance: none; }
  .dd-hsform .hs_submit .actions:hover .hs-button { background: #fff; color: #a72632; }
  .dd-hsform .hs-button:hover { background: #fff; color: #a72632; }
  @media (max-width: 560px) { .dd-hsform .hs-form .form-columns-2 { flex-direction: column; gap: 0; } .dd-hsform .hs-form .form-columns-2 > .hs-form-field { width: 100% !important; } }
  `;
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  // v16: css:'' (above) skips HubSpot's theme sheet; the sites self-host Inter and
  // never load fonts from Google, so remove HubSpot's injected Lato link if present.
  function dropLato() {
    document.querySelectorAll('link[href*="fonts.googleapis.com"]').forEach(function (l) {
      if (/Lato/i.test(l.href)) l.parentNode.removeChild(l);
    });
  }
  function polish() {
    var root = document.querySelector('.dd-hsform') || document;
    // Role: header label hidden via CSS; move the required * into the dropdown placeholder
    var sel = root.querySelector('.hs_company_role select');
    if (sel) { var o = sel.querySelector('option[value=""]') || sel.options[0]; if (o) o.textContent = 'Your Role*'; var sync = function () { sel.classList.toggle('dd-chosen', !!sel.value); }; sync(); sel.addEventListener('change', sync); }
    // Phone: optional, and the placeholder says so. The other three fields carry a
    // trailing *, so an unmarked phone box read as an oversight rather than a
    // choice. Drop the word if HubSpot ever makes the field required.
    // HubSpot ships it with an empty placeholder, hence setting it at all.
    var tel = root.querySelector(".hs_mobilephone input");
    if (tel && !tel.placeholder) tel.placeholder = "Mobile Phone (optional)";
    // Our button copy + arrow (shimmer/glow come from CSS)
    var btn = root.querySelector('.hs-button');
    if (btn) { var t = 'Start My Morning Edge →'; if (btn.tagName === 'INPUT') btn.value = t; else btn.textContent = t; }
  }
  // v17: accessible names for the fields HubSpot ships with an EMPTY label
  // (First Name, Email, Mobile Phone). Same idea as ddod-player nameLabels():
  // the label gets the words the visitor sees as the placeholder, minus the
  // trailing *. They go in a .dd-vh span (clip pattern, see CSS), so nothing
  // visible changes. Runs after polish(), which sets the phone placeholder, and
  // again on timers because HubSpot can re-render the field group.
  function ddNameLabels() {
    var root = document.querySelector('.dd-hsform');
    if (!root) return;
    ['firstname', 'email', 'mobilephone'].forEach(function (n) {
      var f = root.querySelector('.hs_' + n); if (!f) return;
      var lab = f.querySelector(':scope > label'), ctl = f.querySelector('[name="' + n + '"]');
      if (!lab || !ctl) return;
      var t = (ctl.placeholder || '').replace(/\*\s*$/, '').trim(); if (!t) return;
      var sp = lab.querySelector('span:not(.hs-form-required)');
      if (sp && sp.textContent.trim() && !sp.classList.contains('dd-vh')) return; // HubSpot label has words: leave it
      if (!sp) { sp = document.createElement('span'); lab.insertBefore(sp, lab.firstChild); }
      sp.classList.add('dd-vh');
      if (sp.textContent !== t) sp.textContent = t;
    });
  }
  /* --- Conditional SMS consent -------------------------------------------
     Phone is optional; entering one requires express written consent before we
     may text it, so the opt-in appears and becomes required. Clearing the number
     puts it away and unchecks it again.

     This lives OUTSIDE polish() deliberately. HubSpot adds this field to the DOM
     *after* onFormReady fires, so the one-shot snapshot v8 used inside polish()
     always found it missing. We wire idempotently from a MutationObserver, and the
     submit guard resolves its elements at event time so it survives a re-render. */
  function ddSmsParts() {
    var r = document.querySelector('.dd-hsform');
    if (!r) return null;
    var tel = r.querySelector('.hs_mobilephone input');
    var wrap = r.querySelector('.hs_text_messaging_optin_property');
    var box = wrap && wrap.querySelector('input[type="checkbox"]');
    var form = r.querySelector('form.hs-form');
    return (tel && wrap && box && form) ? { tel: tel, wrap: wrap, box: box, form: form } : null;
  }

  function ddSmsWire() {
    var p = ddSmsParts();
    if (!p || p.wrap.getAttribute('data-dd-sms') === '1') return;
    p.wrap.setAttribute('data-dd-sms', '1');

    // Move HubSpot's copy into the empty checkbox span (links preserved) and split the
    // disclosure off as fine print, so the copy stays owned by HubSpot -- nothing is
    // hardcoded here. Falls back to the styled legend if the span is already filled.
    var span = p.wrap.querySelector('.hs-form-booleancheckbox-display span');
    var desc = p.wrap.querySelector('.hs-field-desc');
    if (span && desc && !span.innerHTML.trim()) {
      var bits = desc.innerHTML.split(/(?:\s*<br\s*\/?>\s*){2,}/i);
      var lead = bits.shift() || '';
      var fine = bits.join('<br>');
      span.innerHTML = lead + (fine ? '<span class="dd-sms-fine">' + fine + '</span>' : '');
      desc.parentNode.removeChild(desc);
    }

    var err = p.wrap.querySelector('.dd-sms-error');
    if (!err) {
      err = document.createElement('p');
      err.className = 'dd-sms-error';
      err.setAttribute('role', 'alert');
      err.hidden = true;
      err.textContent = 'Please agree to receive texts, or clear the phone number.';
      p.wrap.appendChild(err);
    }

    // HubSpot removes the whole field when the phone empties, so this mainly asserts
    // required=true at wire time; the clear-branch is belt-and-braces for any config
    // where HubSpot keeps the node instead of dropping it.
    var sync = function () {
      var on = !!p.tel.value.trim();
      p.box.required = on;
      if (!on) { p.box.checked = false; err.hidden = true; }
    };
    p.tel.addEventListener('input', sync);
    p.tel.addEventListener('change', sync);
    p.box.addEventListener('change', function () { if (p.box.checked) err.hidden = true; });
    sync();
  }

  // The form carries novalidate and HubSpot validates with its own jQuery handler
  // bound to the form, so a listener on the form itself could run after theirs.
  // Capturing at document level always runs first. Registered once.
  document.addEventListener('submit', function (e) {
    var p = ddSmsParts();
    if (!p || e.target !== p.form) return;
    if (p.tel.value.trim() && !p.box.checked) {
      e.preventDefault();
      e.stopImmediatePropagation();
      var er = p.wrap.querySelector('.dd-sms-error');
      if (er) er.hidden = false;
      p.box.focus();
    }
  }, true);

  if (window.MutationObserver) {
    new MutationObserver(ddSmsWire).observe(document.documentElement, { childList: true, subtree: true });
  }
  ddSmsWire();

  var tries = 0;
  function mount() {
    var old = document.getElementById('ddForm');
    if (!old) { if (tries++ < 120) return setTimeout(mount, 100); return; }
    var wrap = document.createElement('div');
    wrap.className = 'dd-hsform';
    wrap.innerHTML =
      '<div id="hsFormDD"></div>' +
      '<p class="dd-urgency">Every message expires in 72 hours.<br class="br-m"> There is no archive. No catching up.</p>' +
      '<p class="dd-micro">Join 350,000+ driven business builders. No cost. No ads. Ever. Unsubscribe in one click. Your information is never shared.</p>';
    old.parentNode.replaceChild(wrap, old);
    var s = document.createElement('script'); s.src = 'https://js.hsforms.net/forms/embed/v2.js';
    s.onload = function () { if (window.hbspt) hbspt.forms.create(Object.assign({ target: '#hsFormDD', css: '', onFormReady: function () { dropLato(); polish(); ddNameLabels(); setTimeout(ddNameLabels, 400); setTimeout(ddNameLabels, 1500); } }, FORM)); };
    document.head.appendChild(s);
  }
  mount();
})();
