// ===== Scroll-triggered reveal (single + stagger group) =====
(function () {
  // Skip animation entirely if user prefers reduced motion
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.reveal, .stagger').forEach(el => el.classList.add('visible'));
    return;
  }
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal, .stagger').forEach(el => el.classList.add('visible'));
    return;
  }
  // Standalone .reveal elements — fire when each enters viewport
  const revealEls = document.querySelectorAll('.reveal');
  const revealIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealIO.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
  revealEls.forEach(el => revealIO.observe(el));

  // .stagger groups — fire on the parent, children cascade via CSS nth-child delays
  const staggerEls = document.querySelectorAll('.stagger');
  const staggerIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        staggerIO.unobserve(entry.target);
      }
    });
    // threshold 0 (fire as the TOP edge enters) instead of 0.1 — on tall
    // groups like the 12-card quote grid, 0.1 meant the first card didn't
    // reveal until you'd already scrolled ~10% into the grid (too late).
  }, { threshold: 0, rootMargin: '0px 0px -8% 0px' });
  staggerEls.forEach(el => staggerIO.observe(el));

})();

// ===== Count-up animation for stat numbers =====
(function () {
  const els = document.querySelectorAll('.stat-number[data-count]');
  if (!els.length) return;

  // Respect reduced-motion — just show final values
  const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion || !('IntersectionObserver' in window)) {
    els.forEach(el => {
      const end = parseFloat(el.dataset.count);
      const dec = parseInt(el.dataset.decimals) || 0;
      // Write to the inner .stat-value if present so a sibling "/10" survives.
      (el.querySelector('.stat-value') || el).textContent = end.toFixed(dec);
    });
    return;
  }

  const ease = t => 1 - Math.pow(1 - t, 3); // ease-out cubic

  function animate(el) {
    const end = parseFloat(el.dataset.count);
    const dec = parseInt(el.dataset.decimals) || 0;
    // Write to the inner .stat-value if present so a sibling "/10" survives.
    const out = el.querySelector('.stat-value') || el;
    const dur = 1100;
    const t0 = performance.now();
    (function tick(now) {
      const p = Math.min((now - t0) / dur, 1);
      out.textContent = (ease(p) * end).toFixed(dec);
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  }

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animate(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.45 });
  els.forEach(el => obs.observe(el));
})();

// ===== FAQ accordion (one at a time) =====
(function () {
  const buttons = document.querySelectorAll('.faq-q');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      const panel = btn.nextElementSibling;

      // Close any others
      buttons.forEach(other => {
        if (other !== btn) {
          other.setAttribute('aria-expanded', 'false');
          const p = other.nextElementSibling;
          p.style.maxHeight = null;
        }
      });

      if (isOpen) {
        btn.setAttribute('aria-expanded', 'false');
        panel.style.maxHeight = null;
      } else {
        btn.setAttribute('aria-expanded', 'true');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });
})();

// (Video testimonials are now a static 2x3 grid — no slider/marquee JS needed.)

// ===== Vimeo players — custom play/pause + simple mute (no Vimeo controls) =====
// Every embed loads with controls=0 (no scrub bar, settings, CC/AI buttons).
// State classes on `target`: .is-playing (swap play/pause visual), .has-played
// (drop poster / reveal volume), .is-muted (mute icon). Handles the VSL and
// every video-grid testimonial embed.
(function () {
  const wire = (iframe, toggle, vol, target) => {
    if (!iframe || !toggle) return;
    const el = target || toggle;
    const player = new window.Vimeo.Player(iframe);

    // Keep the mute ICON in sync with the player's ACTUAL muted state. The
    // browser's autoplay policy can force a video to start muted even after we
    // asked for sound — e.g. when the very first play of the session lands a
    // beat outside the click gesture because player.js was still downloading.
    // Without this the button's class desyncs from reality, so the first
    // volume click toggles the WRONG way and it takes two or three clicks to
    // actually unmute. This reads the truth and reflects it on the icon.
    const syncMuted = () => player.getMuted()
      .then(m => el.classList.toggle('is-muted', m))
      .catch(() => {});

    // Clicking play = "watch this, WITH sound." This click is a real user
    // gesture and player.js is preloaded in the background (below), so the
    // browser allows audible playback. We call setMuted(false)+play() inside
    // the gesture (NOT from a promise callback) so the user-activation isn't
    // dropped. Play state is tracked via the class, not getPaused().
    toggle.addEventListener('click', () => {
      if (el.classList.contains('is-playing')) {
        player.pause();
        return;
      }
      player.setMuted(false).catch(() => {});   // an explicit play always wants sound
      player.setVolume(1).catch(() => {});
      player.play().then(syncMuted).catch(() => {
        // Audible play was blocked (player.js finished loading a beat AFTER the
        // click, so this ran just outside the gesture). Start it muted so the
        // video at least PLAYS; the icon shows muted and one tap of the sound
        // button (a fresh gesture) turns audio on.
        player.setMuted(true).then(() => player.play()).then(syncMuted).catch(() => {});
      });
    });
    player.on('play',  () => { el.classList.add('is-playing'); el.classList.add('has-played'); syncMuted(); });
    player.on('pause', () => el.classList.remove('is-playing'));
    player.on('ended', () => el.classList.remove('is-playing'));
    player.on('volumechange', syncMuted); // browser/user changed volume → keep icon honest

    // Mute toggle (its own button, sibling of the toggle). On unmute we also
    // push the volume back to full — a video that was force-muted by autoplay
    // policy can come back at zero volume otherwise.
    if (vol) {
      vol.addEventListener('click', (e) => {
        e.stopPropagation();
        const mute = !el.classList.contains('is-muted');
        el.classList.toggle('is-muted', mute);                    // instant icon feedback
        const apply = mute
          ? player.setMuted(true)
          : player.setMuted(false).then(() => player.setVolume(1));
        apply.then(syncMuted).catch(syncMuted);                   // then confirm against reality
      });
    }
  };

  // Collect every controllable video (VSL + grid testimonials).
  const collect = () => {
    const out = [];
    const vsl = document.getElementById('vsl-player');
    if (vsl) {
      const frame = vsl.closest('.vsl-frame');
      out.push({ iframe: vsl, toggle: document.querySelector('[data-vsl-play]'), vol: frame && frame.querySelector('.vsl-vol'), target: frame });
    }
    document.querySelectorAll('.t-video-iframe').forEach(iframe => {
      const thumb = iframe.closest('.t-video-thumb');
      out.push({ iframe: iframe, toggle: thumb && thumb.querySelector('.t-video-toggle'), vol: thumb && thumb.querySelector('.t-video-vol'), target: thumb });
    });
    return out;
  };

  // PERF: Vimeo's player.js (~190KB) is kept OFF the initial critical path — it
  // loads lazily via the preload triggers below, never blocking first paint.
  // (The hero background loop autoplays via its own iframe params, no JS needed.)
  let wired = false, loading = false, pendingToggle = null;
  const wireAll = () => {
    if (wired || !window.Vimeo || !window.Vimeo.Player) return;
    wired = true;
    collect().forEach(t => wire(t.iframe, t.toggle, t.vol, t.target));
    if (pendingToggle) pendingToggle.click(); // replay the click that triggered the load
  };
  const loadVimeo = () => {
    if (window.Vimeo && window.Vimeo.Player) { wireAll(); return; }
    if (loading) return;
    loading = true;
    const s = document.createElement('script');
    s.src = 'https://player.vimeo.com/api/player.js';
    s.onload = wireAll;
    document.head.appendChild(s);
  };
  // First click on any video control loads Vimeo, then wires every player + plays it.
  const onFirstClick = (e) => {
    const toggle = e.target.closest('.t-video-toggle, .vsl-toggle');
    if (!toggle) return;
    document.removeEventListener('click', onFirstClick, true);
    pendingToggle = toggle;
    loadVimeo();
  };
  document.addEventListener('click', onFirstClick, true);

  // Preload player.js BEFORE any click so the first play runs inside the user
  // gesture — the only state where the browser allows audible playback. (An
  // async load AFTER the click loses the gesture and playback is forced to
  // muted.) loadVimeo() is idempotent, so we fire it from a few triggers:
  //
  //   • a guaranteed backstop ~3s after the page settles — the real safety net,
  //     ready for every visitor well before they scroll down to the videos;
  //   • a video scrolling into view, or the first hover / press on one — earlier
  //     still, for anyone who races down the page.
  //
  // The 3s defer keeps it off the critical path (Lighthouse neither waits that
  // long nor scrolls), so the page-speed score is unaffected.
  const preload = () => setTimeout(loadVimeo, 3000);
  if (document.readyState === 'complete') preload();
  else window.addEventListener('load', preload);

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries, obs) => {
      if (entries.some(en => en.isIntersecting)) { obs.disconnect(); loadVimeo(); }
    }, { rootMargin: '0px' });
    document.querySelectorAll('.t-video-thumb, .vsl-frame').forEach(v => io.observe(v));
  }
  const onIntent = (e) => {
    if (!e.target.closest('.t-video-thumb, .vsl-frame')) return;
    document.removeEventListener('pointerover', onIntent, true);
    document.removeEventListener('pointerdown', onIntent, true);
    loadVimeo();
  };
  document.addEventListener('pointerover', onIntent, true);
  document.addEventListener('pointerdown', onIntent, true);
})();
