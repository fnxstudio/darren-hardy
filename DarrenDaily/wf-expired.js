// Nav: transparent at the very top, flips to solid white after a small scroll
  (function () {
    var nav = document.querySelector('nav.top');
    if (!nav) return;
    var ticking = false;
    function update() { ticking = false; nav.classList.toggle('solid', window.scrollY > 24); }
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

  // "Why it expires" video facade: swap the poster for the Vimeo player on click / Enter / Space
  (function () {
    var frame = document.getElementById('whyVideo');
    if (!frame) return;
    function play() {
      var id = frame.getAttribute('data-vimeo-id');
      if (!id || frame.querySelector('iframe')) return;
      var iframe = document.createElement('iframe');
      iframe.src = 'https://player.vimeo.com/video/' + id + '?autoplay=1&color=a72632&title=0&byline=0&portrait=0&dnt=1';
      iframe.allow = 'autoplay; fullscreen; picture-in-picture';
      iframe.setAttribute('allowfullscreen', '');
      iframe.setAttribute('title', 'Darren Hardy explains why DarrenDaily expires after 72 hours');
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

  // Join modal: opt-in form popup (progressive enhancement over the darrendaily.com link)
  (function () {
    var modal = document.getElementById('joinModal');
    if (!modal) return;
    var form = document.getElementById('joinForm');
    var role = document.getElementById('jmRole');
    var firstEl = document.getElementById('jmFirst');
    var lastActive = null;
    function open(ev) {
      if (ev) ev.preventDefault();
      lastActive = document.activeElement;
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
      setTimeout(function () { if (firstEl) firstEl.focus(); }, 60);
    }
    function close() {
      modal.classList.remove('open');
      document.body.style.overflow = '';
      if (lastActive && lastActive.focus) lastActive.focus();
    }
    document.querySelectorAll('[data-open-form]').forEach(function (el) { el.addEventListener('click', open); });
    document.querySelectorAll('[data-close-form]').forEach(function (el) { el.addEventListener('click', close); });
    modal.addEventListener('click', function (e) { if (e.target === modal) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && modal.classList.contains('open')) close(); });
    if (role) role.addEventListener('change', function () { role.classList.toggle('filled', !!role.value); });
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      // On valid submit, send the new member to the welcome page (wire to HubSpot on launch)
      window.location.href = 'darrendaily-welcome.html';
    });
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
    function currentSlug() { var a = pop.getAttribute('data-current-slug'); return a ? a.trim() : ''; }
    function resolveLatest() {
      var cur = currentSlug();
      var items = Array.prototype.slice.call(listEl.querySelectorAll('.xp-session'));
      var shown = null;
      items.forEach(function (it) {
        var slug = (it.getAttribute('data-session-slug') || '').trim();
        if (!shown && slug !== cur) { it.hidden = false; shown = it; } else { it.hidden = true; }
      });
      return shown;
    }
    function canShow() { if (!CAP_ENABLED) return true; try { return !STORE.getItem(SHOWN_KEY); } catch (e) { return true; } }
    function markShown() { if (!CAP_ENABLED) return; try { STORE.setItem(SHOWN_KEY, String(Date.now())); } catch (e) {} }
    function open(force) {
      if (pop.classList.contains('open')) return;
      if (!force && isDismissed()) return;         // user already closed it this session -> stay closed
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
    // Mobile-friendly signals: reached the end of the page, or went idle.
    // Scroll depth: fire once the reader hits ~90% of the page (they've seen everything).
    var depthTick = false;
    window.addEventListener('scroll', function () {
      if (depthTick) return; depthTick = true;
      requestAnimationFrame(function () {
        depthTick = false;
        var scrolled = window.pageYOffset + window.innerHeight;
        if (scrolled / document.documentElement.scrollHeight >= 0.9) open(false);
      });
    }, { passive: true });
    // Idle: no touch/scroll/tap/keypress for 30s -> about to drift off.
    var idleTimer;
    function resetIdle() { clearTimeout(idleTimer); idleTimer = setTimeout(function () { open(false); }, 30000); }
    ['touchstart', 'scroll', 'click', 'keydown', 'mousemove'].forEach(function (evt) {
      window.addEventListener(evt, resetIdle, { passive: true });
    });
    resetIdle();
    pop.querySelectorAll('[data-xp-close]').forEach(function (el) { el.addEventListener('click', close); });
    pop.addEventListener('click', function (e) { if (e.target === pop) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && pop.classList.contains('open')) close(); });
    if (/[?&]exit=1/.test(location.search)) open(true);   // QA: append ?exit=1 to force-preview
  })();

  // ── Media cover bio: SUCCESS covers wall + Darren cutout (ported from darrendaily.html) ──
  (function () {
    var covers = [
      'JackWelch.jpg','SM_13_05_FORD.jpg','SM_12_01_DOWNEY.jpg',
      'SM_09_07_BRANSON.jpg','SM_10_06_JOBS.jpg',
      'SM_09_08_FOX.jpg',
      'SM_08_01_Kiyosaki.jpg','SM_08_02_50.jpg','SM_08_04_OZ.jpg',
      'SM_08_05_HAWK.jpg','SM_08_06_Deutsch.jpg','SM_10_12_SHRIVER.jpg',
      'SM_09_02_Powell.jpg','SM_09_03_FOREMAN.jpg','SM_09_04_Maxwell.jpg',
      'SM_09_05_ORMAN.jpg','SM_09_06_LANCE.jpg','SM_09_01_Robbins.jpg',
      'SM_09_09_FOSTER_Barcode.jpg','SM_09_10_SERENA_barcode.jpg',
      'SM_09_11_OSTEEN_barcode.jpg','SM_09_12_DrPHIL.jpg',
      'SM_12_07_TECHNOLOGY.jpg','SM_10_01_KEYES.jpg','SM_10_02_RAMSEY.jpg',
      'SM_10_03_HOPKINS.jpg','SM_10_04_COLLINS.jpg','SM_10_05_MICHAELS.jpg',
      'SM_10_07_COLE.jpg','SM_10_08_JOHNSON.jpg',
      'SM_10_09_DELL.jpg','SM_10_10_USHER.jpg','SM_10_11_MANNINGS.jpg',
      'SM_11_01_HOWARD.jpg','SM_11_02_CHAN.jpg','SM_11_03_SCHWAB.jpg',
      'SM_11_04_SCHULTZ.jpg','SM_12_08_BRANSON.jpg','SM_11_05_ZUCKERBERG.jpg',
      'SM_11_06_MARTIN.jpg','SM_11_07_DICAPRIO.jpg','SM_11_08_BEZOS.jpg',
      'SM_11_09_CONNICK.jpg','SM_11_10_OZ.jpg','SM_11_11_CUBAN.jpg',
      'SM_11_12_SANTA.jpg','SM_12_02_KARDASHIAN.jpg','SM_12_03_BLOOMBERG.jpg',
      'SM_12_04_LOWE.jpg','SM_12_05_ORMAN.jpg','SM_12_06_JOHANNSON.jpg',
      'SM_12_09_BURNETT.jpg','SM_12_10_MAXWELL.jpg','SM_12_11_WASHINGTON.jpg',
      'SM_12_12_COURIC.jpg','SM_13_01_STEWART.jpg','SM_13_02_MUSK.jpg',
      'SM_13_03_CORCORAN.jpg','SM_13_04_DIAMANDIS.jpg','SM_08_03_Trump.jpg',
      'SM_14_11_COOK.jpg','Santa1977.jpg','Tony_Hseih.jpg'
    ];

    function cleanName(f) {
      var n = f.replace(/\.(jpg|jpeg|png|gif|webp)$/i, '');
      n = n.replace(/^SM_\d+_\d+_/i, '');
      n = n.replace(/([a-z])([A-Z])/g, '$1 $2');
      n = n.replace(/[_-]/g, ' ');
      n = n.replace(/\bbarcode\b/gi, '').replace(/\s+/g, ' ').trim();
      n = n.toLowerCase().replace(/\b\w/g, function (c) { return c.toUpperCase(); });
      return n;
    }

    var featuredTypes = ['large', 'tall', 'large', 'tall', 'standard'];
    function buildSpreadPool(n) {
      var special = Array(4).fill('wide').concat(Array(16).fill('tall'));
      var s = 0xc0ffee42;
      for (var i = special.length - 1; i > 0; i--) {
        s = Math.imul(s ^ (s >>> 16), 0x45d9f3b);
        s = Math.imul(s ^ (s >>> 16), 0x45d9f3b);
        s ^= s >>> 16;
        var j = (Math.abs(s) >>> 0) % (i + 1);
        var t = special[i]; special[i] = special[j]; special[j] = t;
      }
      var pool = Array(n).fill('standard');
      var step = (n - 1) / (special.length - 1);
      special.forEach(function (type, i) { pool[Math.round(i * step)] = type; });
      return pool;
    }

    var bodyTypes = buildSpreadPool(covers.length - 5);
    var coversGrid = document.getElementById('covers-grid');
    if (!coversGrid) return;

    covers.forEach(function (cover, i) {
      var tile = document.createElement('div');
      tile.className = 'c-tile';
      var t = i < 5 ? featuredTypes[i] : bodyTypes[i - 5];
      if (t === 'wide')  tile.classList.add('c-wide');
      if (t === 'tall')  tile.classList.add('c-tall');
      if (t === 'large') tile.classList.add('c-large');
      var img = document.createElement('img');
      img.src = 'https://fnxstudio.github.io/darren-hardy/DarrenDaily/covers/' + cover.replace(/\.(jpg|jpeg)$/i, '.webp');
      img.alt = cleanName(cover);
      img.loading = i < 12 ? 'eager' : 'lazy';
      img.decoding = 'async';
      var cap = document.createElement('div');
      cap.className = 'c-cap';
      cap.textContent = cleanName(cover);
      tile.appendChild(img);
      tile.appendChild(cap);
      coversGrid.appendChild(tile);
    });

    // Entrance - reveal tiles when the wall scrolls into view
    var introWall = document.querySelector('.intro-wall');
    var wallObserver = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        requestAnimationFrame(function () {
          document.querySelectorAll('.c-tile').forEach(function (tile) { tile.classList.add('visible'); });
        });
        wallObserver.disconnect();
      }
    }, { threshold: 0.1 });
    wallObserver.observe(introWall);

    // Touch tap-to-color
    document.querySelectorAll('.c-tile').forEach(function (tile) {
      var ty, tx;
      tile.addEventListener('touchstart', function (e) { ty = e.touches[0].clientY; tx = e.touches[0].clientX; }, { passive: true });
      tile.addEventListener('touchend', function (e) {
        if (Math.abs(e.changedTouches[0].clientY - ty) > 8 || Math.abs(e.changedTouches[0].clientX - tx) > 8) return;
        var active = tile.classList.contains('tapped');
        document.querySelectorAll('.c-tile.tapped').forEach(function (t) { t.classList.remove('tapped'); });
        if (!active) tile.classList.add('tapped');
      });
    });

    // Parallax - rAF-throttled (same as homepage)
    (function () {
      var rafPending = false;
      window.addEventListener('scroll', function () {
        if (rafPending) return;
        rafPending = true;
        requestAnimationFrame(function () {
          var rect = introWall.getBoundingClientRect();
          var progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
          var offset = Math.max(0, progress * 500);
          coversGrid.style.transform = 'translateY(-' + offset + 'px)';
          rafPending = false;
        });
      }, { passive: true });
    })();
  })();
