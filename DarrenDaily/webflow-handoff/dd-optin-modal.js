/* DarrenDaily opt-in — MODAL variant (expired page #joinForm). Swaps the interim
   join-modal form for the real HubSpot opt-in (e74fd54c, classic/DOM). Single-column
   + compact for the narrow modal. Phone + SMS hidden, Role header dropped (* in the
   placeholder), our brand button. Redirects to /welcome; dd_id + UTMs ride along. */
(function () {
  var FORM = { region: "na1", portalId: "2518645", formId: "e74fd54c-8940-43db-99e5-6f016b6dfc8a" };

  var css = `
  .dd-hsform { text-align: left; margin: 0; }
  .dd-hsform .hs-form { display: block; }
  .dd-hsform .hs-form fieldset { max-width: none !important; }
  /* modal is narrow → stack every field */
  .dd-hsform .hs-form .form-columns-2, .dd-hsform .hs-form .form-columns-1 { display: block; }
  .dd-hsform .hs-form .hs-form-field { width: 100% !important; float: none !important; padding: 0 !important; margin-bottom: 11px; min-width: 0; }
  .dd-hsform .hs-form .hs-form-field > label { display: block; font-size: 12px; font-weight: 600; letter-spacing: .03em; color: #616a78; margin-bottom: 5px; }
  .dd-hsform .hs-form .hs-form-required { color: #a72632; margin-left: 2px; }
  .dd-hsform .hs-form .input { margin: 0 !important; }
  .dd-hsform .hs-form .hs-input { width: 100% !important; box-sizing: border-box; font-family: 'Inter', -apple-system, sans-serif; font-size: 15px; color: #14171c; padding: 15px 16px; border: 1.5px solid rgba(20,23,28,.12); border-radius: 4px; background: #fff; transition: border-color .18s, box-shadow .18s; }
  .dd-hsform .hs-form .hs-input:focus { outline: none; border-color: #a72632; box-shadow: 0 0 0 3px rgba(167,38,50,.16); }
  .dd-hsform .hs-form select.hs-input { -webkit-appearance: none; appearance: none; cursor: pointer; padding-right: 42px; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' fill='none' stroke='%23616a78' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 16px center; color: #757575; }
  .dd-hsform .hs-form select.hs-input.dd-chosen { color: #14171c; } /* real role picked -> ink; placeholder stays grey to match the input placeholders */
  .dd-hsform .hs_mobilephone, .dd-hsform .hs_text_messaging_optin_property, .dd-hsform .legal-consent-container { display: none !important; }
  .dd-hsform .hs-form .hs_company_role > label { display: none !important; }
  .dd-hsform .hs-error-msgs { list-style: none; margin: 5px 0 0; padding: 0; }
  .dd-hsform .hs-error-msg { color: #a72632; font-size: 12.5px; }
  .dd-hsform .hs_submit { margin-top: 5px; }
  .dd-hsform .hs_submit .actions { position: relative; overflow: hidden; margin: 0; padding: 0; border-radius: 4px; box-shadow: 0 12px 26px -12px rgba(167,38,50,.5); }
  .dd-hsform .hs_submit .actions::after { content: ""; position: absolute; top: 0; left: -80%; width: 60%; height: 100%; z-index: 2; pointer-events: none; background: linear-gradient(105deg, transparent 20%, rgba(255,255,255,.28) 50%, transparent 80%); animation: dd-cta-shimmer 4s ease-in-out infinite; }
  .dd-hsform .hs_submit .actions:hover::after { opacity: 0; }
  @keyframes dd-cta-shimmer { 0% { left: -80%; opacity: 1; } 38% { left: 110%; opacity: 1; } 39% { opacity: 0; } 100% { left: 110%; opacity: 0; } }
  .dd-hsform .hs-button { width: 100%; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; font-family: 'Inter', -apple-system, sans-serif; font-weight: 800; font-size: 12px; letter-spacing: .18em; text-transform: uppercase; padding: 17px 22px; border-radius: 4px; background: #a72632; color: #fff; border: 2px solid #a72632; transition: background .2s, color .2s; -webkit-appearance: none; appearance: none; }
  .dd-hsform .hs_submit .actions:hover .hs-button, .dd-hsform .hs-button:hover { background: #fff; color: #a72632; }
  `;
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  function polish() {
    var root = document.querySelector('.dd-hsform') || document;
    var sel = root.querySelector('.hs_company_role select');
    if (sel) { var o = sel.querySelector('option[value=""]') || sel.options[0]; if (o) o.textContent = 'Role *'; var sync = function () { sel.classList.toggle('dd-chosen', !!sel.value); }; sync(); sel.addEventListener('change', sync); }
    var btn = root.querySelector('.hs-button');
    if (btn) { var t = 'Start My Morning Edge →'; if (btn.tagName === 'INPUT') btn.value = t; else btn.textContent = t; }
  }

  // Guarantee the join CTAs open the modal and can NEVER fall through to a URL
  // (the bottom button ships with href="https://darrendaily.com/" as a no-JS
  // fallback — strip it so a tap before/around wiring can't leave the page).
  function hardenTriggers() {
    var modal = document.getElementById('joinModal');
    if (!modal) return;
    function openModal(ev) {
      if (ev) ev.preventDefault();
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    document.querySelectorAll('a[data-open-form]').forEach(function (a) {
      if (a.dataset.ddHardened) return;
      a.dataset.ddHardened = '1';
      a.removeAttribute('href');            // no navigation fallback, ever
      a.setAttribute('role', 'button');
      a.setAttribute('tabindex', '0');
      a.style.cursor = 'pointer';
      a.addEventListener('click', openModal);
      a.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') openModal(e);
      });
    });
  }

  var tries = 0;
  function mount() {
    var old = document.getElementById('joinForm');
    if (!old) { if (tries++ < 120) return setTimeout(mount, 100); return; }
    var wrap = document.createElement('div');
    wrap.className = 'dd-hsform';
    wrap.innerHTML =
      '<div id="hsFormJoin"></div>' +
      '<p class="modal-micro">Free. No ads, ever. Unsubscribe in one click. Your information is never shared.</p>';
    old.parentNode.replaceChild(wrap, old);
    hardenTriggers();
    var s = document.createElement('script'); s.src = 'https://js.hsforms.net/forms/embed/v2.js';
    s.onload = function () { if (window.hbspt) hbspt.forms.create(Object.assign({ target: '#hsFormJoin', onFormReady: polish }, FORM)); };
    document.head.appendChild(s);
  }
  mount();
})();
