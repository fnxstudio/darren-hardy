/* DarrenDaily opt-in upgrade — swaps the interim #ddForm for the real HubSpot
   opt-in form (e74fd54c, classic/DOM so it's CSS-stylable), brand-styled to
   match the pages. Phone + SMS-consent hidden (SMS needs a phone). Keeps the
   urgency + micro trust copy. Redirects to /welcome (set in HubSpot). Hidden
   dd_id (referral) + UTM fields ride along automatically. */
(function () {
  var FORM = { region: "na1", portalId: "2518645", formId: "e74fd54c-8940-43db-99e5-6f016b6dfc8a" };

  var css = `
  .dd-hsform { max-width: 540px; margin: 42px auto 0; text-align: left; }
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
  /* Drop phone + the SMS-consent checkbox (SMS needs a phone); let Role fill its row */
  .dd-hsform .hs_mobilephone, .dd-hsform .hs_text_messaging_optin_property, .dd-hsform .legal-consent-container { display: none !important; }
  .dd-hsform .hs-form .form-columns-2 > .hs-form-field.hs_company_role { width: 100% !important; } /* Role fills the row under First Name / Email (phone, its row-mate, is hidden) */
  .dd-hsform .hs-form .hs_company_role > label { display: none !important; } /* drop the redundant "Role" header; the dropdown placeholder carries it */
  .dd-hsform .hs-error-msgs { list-style: none; margin: 6px 0 0; padding: 0; }
  .dd-hsform .hs-error-msg { color: #a72632; font-size: 12.5px; }
  .dd-hsform .hs_submit { margin-top: 6px; }
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

  function polish() {
    var root = document.querySelector('.dd-hsform') || document;
    // Role: header label hidden via CSS; move the required * into the dropdown placeholder
    var sel = root.querySelector('.hs_company_role select');
    if (sel) { var o = sel.querySelector('option[value=""]') || sel.options[0]; if (o) o.textContent = 'Role *'; var sync = function () { sel.classList.toggle('dd-chosen', !!sel.value); }; sync(); sel.addEventListener('change', sync); }
    // Our button copy + arrow (shimmer/glow come from CSS)
    var btn = root.querySelector('.hs-button');
    if (btn) { var t = 'Start My Morning Edge →'; if (btn.tagName === 'INPUT') btn.value = t; else btn.textContent = t; }
  }
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
    s.onload = function () { if (window.hbspt) hbspt.forms.create(Object.assign({ target: '#hsFormDD', onFormReady: polish }, FORM)); };
    document.head.appendChild(s);
  }
  mount();
})();
