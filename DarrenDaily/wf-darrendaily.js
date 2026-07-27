// Nav: transparent over the hero, appears (solid white + CTA) once you scroll past the hero button
  (function () {
    var nav = document.querySelector('nav.top');
    var trigger = document.querySelector('.hero-actions') || document.querySelector('.hero');
    if (!nav || !trigger) return;
    var ticking = false;
    function update() {
      ticking = false;
      nav.classList.toggle('solid', trigger.getBoundingClientRect().bottom <= 64);
    }
    function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
  })();

  // Count-up stats (BMCC-style): .cnt[data-count] animates from 0 when scrolled into view
  (function () {
    var els = document.querySelectorAll('.cnt[data-count]');
    if (!els.length) return;
    var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || !('IntersectionObserver' in window)) return; // markup already shows final values
    var ease = function (t) { return 1 - Math.pow(1 - t, 3); };
    function animate(el) {
      var end = parseFloat(el.dataset.count);
      var t0 = performance.now();
      (function tick(now) {
        var p = Math.min((now - t0) / 1100, 1);
        el.textContent = Math.round(ease(p) * end).toLocaleString('en-US');
        if (p < 1) requestAnimationFrame(tick);
      })(t0);
      // Guarantee the final value even if rAF is throttled (background tab etc.)
      setTimeout(function () { el.textContent = end.toLocaleString('en-US'); }, 1300);
    }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { animate(entry.target); obs.unobserve(entry.target); }
      });
    }, { threshold: 0.45 });
    els.forEach(function (el) { obs.observe(el); });
  })();

  // Scroll reveal
  (function () {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.reveal, .stagger').forEach(function (el) { io.observe(el); });
  })();

  // ── Covers wall + Darren cutout (ported from the homepage) ──
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

  // Opt-in form - on valid submit, redirect to the welcome page (wire #ddForm to HubSpot on launch)
  (function () {
    var f = document.getElementById('ddForm');
    f.addEventListener('submit', function (ev) {
      ev.preventDefault();
      if (!f.checkValidity()) { f.reportValidity(); return; }
      // On valid submit, send the visitor to the welcome page (relative path resolves on both local preview and GitHub Pages)
      window.location.href = 'darrendaily-welcome.html';
    });
  })();

  // Preview lightbox: open from the "Preview an episode" play button, close on backdrop / X / Esc
  (function () {
    var lb = document.getElementById('previewLightbox');
    if (!lb) return;
    var wrap = lb.querySelector('.lightbox-video');
    var lastFocus = null;
    function mountVideo() {
      var id = wrap.getAttribute('data-vimeo-id');
      if (!id || wrap.querySelector('iframe')) return; // no id set yet, or already mounted
      var iframe = document.createElement('iframe');
      iframe.src = 'https://player.vimeo.com/video/' + id + '?autoplay=1&loop=1&color=a72632&title=0&byline=0&portrait=0&dnt=1';
      iframe.allow = 'autoplay; fullscreen; picture-in-picture';
      iframe.setAttribute('allowfullscreen', '');
      iframe.setAttribute('title', "Darren Hardy on who DarrenDaily is for");
      wrap.appendChild(iframe);
    }
    function unmountVideo() {
      var iframe = wrap.querySelector('iframe');
      if (iframe) iframe.remove(); // tearing it down stops playback and frees the player
    }
    function open(ev) {
      if (ev) ev.preventDefault();
      lastFocus = document.activeElement;
      lb.classList.add('open');
      lb.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      mountVideo();
      var close = lb.querySelector('.lightbox-close');
      if (close) close.focus();
    }
    function close() {
      lb.classList.remove('open');
      lb.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      unmountVideo();
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }
    document.querySelectorAll('[data-preview-open]').forEach(function (o) {
      o.addEventListener('click', open);
    });
    lb.querySelectorAll('[data-lb-close]').forEach(function (c) {
      c.addEventListener('click', close);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lb.classList.contains('open')) close();
    });
  })();

/* Fit the closing "your tribe" line to a single line, scaling font-size to the container width */
  (function () {
    var el = document.querySelector('.who-tribe');
    if (!el) return;
    var box = el.closest('.container') || el.parentElement;
    function fit() {
      el.style.whiteSpace = 'nowrap';
      el.style.fontSize = '80px';
      var cs = getComputedStyle(box);
      var avail = box.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      var w = el.scrollWidth;
      if (!w) return;
      var size = 80 * (avail * 0.92) / w;
      size = Math.max(14, Math.min(40, size));
      el.style.fontSize = size + 'px';
    }
    fit();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
    var t;
    window.addEventListener('resize', function () { clearTimeout(t); t = setTimeout(fit, 80); });
  })();

/* Scroll-draw the numbered spine (fills as the section passes the viewport) */
  (function () {
    var spine = document.querySelector('.spine');
    var fill = document.getElementById('spineFill');
    if (!spine || !fill) return;
    var rows = spine.querySelectorAll('.spine-row');
    var ticking = false;
    function draw() {
      ticking = false;
      var r = spine.getBoundingClientRect();
      var pct = Math.max(0, Math.min(1, (window.innerHeight * 0.7 - r.top) / (window.innerHeight * 0.5)));
      fill.style.setProperty('--fill', pct * 100 + '%');
      var horizontal = window.innerWidth > 760;
      var lead = horizontal ? (r.left + pct * r.width) : (r.top + pct * r.height);
      rows.forEach(function (row) {
        var b = row.getBoundingClientRect();
        row.classList.toggle('lit', lead >= (horizontal ? b.left : b.top) + 2);
      });
    }
    function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(draw); } }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    draw();
  })();
