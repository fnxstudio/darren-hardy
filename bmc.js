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
      el.textContent = end.toFixed(dec);
    });
    return;
  }

  const ease = t => 1 - Math.pow(1 - t, 3); // ease-out cubic

  function animate(el) {
    const end = parseFloat(el.dataset.count);
    const dec = parseInt(el.dataset.decimals) || 0;
    const dur = 1100;
    const t0 = performance.now();
    (function tick(now) {
      const p = Math.min((now - t0) / dur, 1);
      el.textContent = (ease(p) * end).toFixed(dec);
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

    // IMPORTANT: call play() synchronously inside the click gesture (NOT from
    // a promise callback) — otherwise the browser drops the user-gesture and
    // forces muted playback. We track play state via the class, not getPaused().
    toggle.addEventListener('click', () => {
      if (el.classList.contains('is-playing')) {
        player.pause();
      } else {
        if (!el.classList.contains('is-muted')) player.setMuted(false); // ensure audible
        player.play();
      }
    });
    player.on('play',  () => { el.classList.add('is-playing'); el.classList.add('has-played'); });
    player.on('pause', () => el.classList.remove('is-playing'));
    player.on('ended', () => el.classList.remove('is-playing'));

    // Simple mute toggle (its own button, sibling of the toggle).
    if (vol) {
      vol.addEventListener('click', (e) => {
        e.stopPropagation();
        const mute = !el.classList.contains('is-muted');
        player.setMuted(mute).catch(() => {});
        el.classList.toggle('is-muted', mute);
      });
    }
  };

  const init = () => {
    if (!window.Vimeo || !window.Vimeo.Player) return false;
    // VSL (What's Inside) — state class on the frame.
    const vsl = document.getElementById('vsl-player');
    if (vsl) {
      const frame = vsl.closest('.vsl-frame');
      wire(vsl,
        document.querySelector('[data-vsl-play]'),
        frame && frame.querySelector('.vsl-vol'),
        frame);
    }
    // Video-grid testimonial embeds — state class on the thumbnail.
    document.querySelectorAll('.t-video-iframe').forEach(iframe => {
      const thumb = iframe.closest('.t-video-thumb');
      wire(iframe,
        thumb && thumb.querySelector('.t-video-toggle'),
        thumb && thumb.querySelector('.t-video-vol'),
        thumb);
    });
    return true;
  };

  // The Vimeo API script is deferred too; if it hasn't defined window.Vimeo
  // yet, retry briefly until it's ready.
  if (!init()) {
    let tries = 0;
    const t = setInterval(() => {
      if (init() || ++tries > 40) clearInterval(t);
    }, 100);
  }
})();
