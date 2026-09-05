/* =============================================================================
   DarrenDaily — WELCOME page functional JS  (native Webflow rebuild)
   -----------------------------------------------------------------------------
   In a NATIVE build, the Designer handles layout, style, and motion (Interactions).
   THIS file is the behavior that Webflow elements can't express and that must ship
   as ONE custom-code embed on the page (Page Settings -> Custom Code -> before </body>,
   requires a paid Site plan):

     1. Nav flips transparent -> solid white after 24px of scroll   (toggles nav.top .solid)
     2. Scroll-reveal: adds .in to .reveal / .stagger               (optional; content is
        visible by default in the CSS, so this is motion polish only — safe to replace
        with a Webflow "scroll into view" Interaction and delete this block)
     3. Welcome video facade: click/Enter/Space mounts the Vimeo iframe (0 bytes until then)
     4. Share DarrenDaily: navigator.share() with clipboard + Facebook fallbacks + toast
     5. Member-wall parallax: gentle per-column translateY (off <=860px / reduced-motion)
     6. Exit-intent popup: offers the newest session; armed only after the reader reaches
        the page bottom (never covers the CTA). QA with ?exit=1.  Set CAP_ENABLED=true
        before launch (currently false = shows on every trigger for testing).

   HOOKS this script needs in the markup (all preserved in welcome-native.html):
     #welcomeVideo[data-vimeo-id]  ·  [data-share]  ·  #toast  ·  [data-parallax-gallery]
     #exitPopup[data-current-slug] + [data-xp-list] / .xp-session[data-session-slug] /
     [data-xp-close]  ·  nav.top

   INTERIM: the opt-in redirect to /welcome is not on THIS page (welcome is post-opt-in).
   ============================================================================= */

// Nav: transparent at the very top, flips to solid white after a small scroll
  (function () {
    var nav = document.querySelector('nav.top');
    if (!nav) return;
    var logoW = nav.querySelector('.f-nav-brand-logo-white');
    var logoC = nav.querySelector('.f-nav-brand-logo-color');
    var ticking = false;
    function update() {
      ticking = false;
      var solid = window.scrollY > 24;
      nav.classList.toggle('solid', solid);
      // logo swap (native Interaction replacement): white over the hero, color on the solid white bar
      if (logoW && logoC) { logoW.style.display = solid ? 'none' : 'block'; logoC.style.display = solid ? 'block' : 'none'; }
    }
    function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
  })();

  // Scroll reveal
  (function () {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.reveal, .stagger').forEach(function (el) { io.observe(el); });
  })();

  // Welcome video facade: swap the poster for the Vimeo player on click / Enter / Space
  (function () {
    var frame = document.getElementById('welcomeVideo');
    if (!frame) return;
    function play() {
      var id = frame.getAttribute('data-vimeo-id');
      if (!id || frame.querySelector('iframe')) return;
      var iframe = document.createElement('iframe');
      iframe.src = 'https://player.vimeo.com/video/' + id + '?autoplay=1&color=a72632&title=0&byline=0&portrait=0&dnt=1';
      iframe.allow = 'autoplay; fullscreen; picture-in-picture';
      iframe.setAttribute('allowfullscreen', '');
      iframe.setAttribute('title', 'Darren Hardy welcomes you to DarrenDaily');
      frame.appendChild(iframe);
      frame.classList.add('playing');
      frame.style.cursor = 'default';
    }
    frame.addEventListener('click', play);
    frame.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); play(); }
    });
  })();

  // Share DarrenDaily: native share sheet with a copy-link fallback
  (function () {
    var SHARE = {
      title: 'DarrenDaily',
      text: 'Daily mentoring with Darren Hardy. One idea, five minutes, every weekday morning. Free.',
      url: 'https://darrendaily.com/'
    };
    var toast = document.getElementById('toast');
    var toastTimer;
    function showToast(msg) {
      if (!toast) return;
      toast.textContent = msg;
      toast.classList.add('show');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 2600);
    }
    function share(ev) {
      if (ev) ev.preventDefault();
      if (navigator.share) {
        navigator.share(SHARE).catch(function () {});
        return;
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(SHARE.url).then(function () {
          showToast('Link copied. Thank you for sharing.');
        }).catch(function () {
          window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(SHARE.url), '_blank', 'noopener');
        });
        return;
      }
      window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(SHARE.url), '_blank', 'noopener');
    }
    document.querySelectorAll('[data-share]').forEach(function (el) {
      el.addEventListener('click', share);
    });
  })();

  // Member wall: gentle per-column scroll parallax (disabled on mobile / reduced-motion)
  (function () {
    var g = document.querySelector('[data-parallax-gallery]');
    if (!g || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var cols = Array.prototype.slice.call(g.querySelectorAll('.pcol'));
    var ticking = false;
    function draw() {
      ticking = false;
      if (window.innerWidth <= 860) { cols.forEach(function (c) { c.style.transform = ''; }); return; }
      var rect = g.getBoundingClientRect();
      var delta = (rect.top + rect.height / 2) - (window.innerHeight / 2);
      cols.forEach(function (c) {
        var sp = parseFloat(c.getAttribute('data-speed')) || 0;
        var y = Math.max(-40, Math.min(40, delta * sp));
        c.style.transform = 'translateY(' + y.toFixed(1) + 'px)';
      });
    }
    function onScroll() { if (!ticking) { ticking = true; window.requestAnimationFrame(draw); } }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    draw();
  })();

  // Exit-intent "latest session" popup (offers the newest session, auto-updating from the CMS)
  (function () {
    var pop = document.getElementById('exitPopup');
    if (!pop) return;
    var STORE = window.sessionStorage;            // once per browsing session (swap to localStorage for longer)
    var SHOWN_KEY = 'dd-exit-shown';
    var CAP_ENABLED = false;                      // TESTING: false = show on every trigger. SET TO true BEFORE LAUNCH.
    var DISMISS_KEY = 'dd-exit-dismissed';        // once the user closes it, stay closed for the rest of the session (even with the cap off)
    function isDismissed() { try { return !!STORE.getItem(DISMISS_KEY); } catch (e) { return false; } }
    var listEl = pop.querySelector('[data-xp-list]');
    var lastActive = null;
    var reachedBottom = false;                    // welcome: the popup waits until the reader reaches the page bottom (past the CTA)
    function currentSlug() { var a = pop.getAttribute('data-current-slug'); return a ? a.trim() : ''; }
    function resolveLatest() {
      var cur = currentSlug();
      var items = Array.prototype.slice.call(listEl.querySelectorAll('.xp-session'));
      var shown = null;
      items.forEach(function (it) {
        var slug = (it.getAttribute('data-session-slug') || '').trim();
        if (!shown && slug !== cur) { it.style.display = ''; shown = it; } else { it.style.display = 'none'; }
      });
      return shown;
    }
    function canShow() { if (!CAP_ENABLED) return true; try { return !STORE.getItem(SHOWN_KEY); } catch (e) { return true; } }
    function markShown() { if (!CAP_ENABLED) return; try { STORE.setItem(SHOWN_KEY, String(Date.now())); } catch (e) {} }
    function open(force) {
      if (pop.classList.contains('open')) return;
      if (!force && isDismissed()) return;         // user already closed it this session -> stay closed
      if (!force && !reachedBottom) return;        // don't cover the CTA -> hold until they've scrolled to the bottom
      if (!force && !canShow()) return;
      if (!resolveLatest()) return;                // nothing to offer -> don't nag
      lastActive = document.activeElement;
      pop.classList.add('open');
      document.body.style.overflow = 'hidden';
      markShown();
      var c = pop.querySelector('[data-xp-close]'); if (c) c.focus();
    }
    function close() {
      pop.classList.remove('open');
      document.body.style.overflow = '';
      try { STORE.setItem(DISMISS_KEY, '1'); } catch (e) {}   // closing = dismissed for this session
      if (lastActive && lastActive.focus) lastActive.focus();
    }
    // Desktop: pointer leaves through the top edge. Mobile: intercept the first back gesture.
    document.addEventListener('mouseout', function (e) {
      if (e.clientY <= 0 && !e.relatedTarget && !e.toElement) open(false);
    });
    try {
      history.pushState(null, '', location.href);
      window.addEventListener('popstate', function () {
        if (canShow()) { history.pushState(null, '', location.href); open(false); }
      });
    } catch (e) {}
    // Also treat a fast upward scroll as leave-intent (helps on trackpads and touch, where mouseout never fires).
    var lastY = window.pageYOffset, lastT = Date.now();
    window.addEventListener('scroll', function () {
      var y = window.pageYOffset, t = Date.now(), dt = (t - lastT) || 1;
      if ((y - lastY) / dt < -0.5 && lastY > 300) open(false);   // ~500px/s upward flick after scrolling down
      lastY = y; lastT = t;
    }, { passive: true });
    // Welcome: arm the popup only once the reader reaches the bottom (past the CTA), then show it.
    // Until reachedBottom is true, every other trigger (mouseout, back, scroll-up, idle) is held off.
    var bottomTick = false;
    window.addEventListener('scroll', function () {
      if (bottomTick) return; bottomTick = true;
      requestAnimationFrame(function () {
        bottomTick = false;
        if (window.pageYOffset + window.innerHeight >= document.documentElement.scrollHeight - 40) {
          reachedBottom = true;
          open(false);
        }
      });
    }, { passive: true });
    // Idle: no touch/scroll/tap/keypress for 30s -> about to drift off.
    var idleTimer;
    function resetIdle() { clearTimeout(idleTimer); idleTimer = setTimeout(function () { open(false); }, 45000); }
    ['touchstart', 'scroll', 'click', 'keydown', 'mousemove'].forEach(function (evt) {
      window.addEventListener(evt, resetIdle, { passive: true });
    });
    resetIdle();
    pop.querySelectorAll('[data-xp-close]').forEach(function (el) { el.addEventListener('click', close); });
    pop.addEventListener('click', function (e) { if (e.target === pop) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && pop.classList.contains('open')) close(); });
    if (/[?&]exit=1/.test(location.search)) open(true);   // QA: append ?exit=1 to force-preview
  })();
