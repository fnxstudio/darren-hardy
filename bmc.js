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
  }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });
  staggerEls.forEach(el => staggerIO.observe(el));

  // .reveal-rg — large blocks (testimonial row-groups) that should pop in
  // EARLY so they don't sit blank. threshold 0 = first pixel; positive bottom
  // rootMargin = fire while the element is still ~14% below the viewport.
  const rgEls = document.querySelectorAll('.reveal-rg');
  const rgIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        rgIO.unobserve(entry.target);
      }
    });
  }, { threshold: 0, rootMargin: '0px 0px 14% 0px' });
  rgEls.forEach(el => rgIO.observe(el));
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

// ===== Vimeo players — custom play button only (no Vimeo controls) =====
// Every embed loads with controls=0 (no scrub bar, settings, CC/AI buttons).
// A cyan button starts playback via the Vimeo Player API and fades out while
// playing; clicking the video (controls=0) pauses and the button returns.
// Handles the VSL ("What's Inside") and any video-grid testimonial embeds.
(function () {
  // Pair each player iframe with its full-area toggle button. Clicking the
  // toggle plays if paused, pauses if playing (controls=0 has no native
  // click-to-pause). The .is-playing class fades the cyan visual.
  const pair = (iframe, toggle) => {
    if (!iframe || !toggle) return;
    const player = new window.Vimeo.Player(iframe);
    toggle.addEventListener('click', () => {
      player.getPaused()
        .then(paused => (paused ? player.play() : player.pause()))
        .catch(() => {});
    });
    player.on('play',  () => toggle.classList.add('is-playing'));
    player.on('pause', () => toggle.classList.remove('is-playing'));
    player.on('ended', () => toggle.classList.remove('is-playing'));
  };

  const init = () => {
    if (!window.Vimeo || !window.Vimeo.Player) return false;
    // VSL (What's Inside)
    pair(document.getElementById('vsl-player'), document.querySelector('[data-vsl-play]'));
    // Video-grid testimonial embeds — toggle lives in the same card.
    document.querySelectorAll('.t-video-iframe').forEach(iframe => {
      const card = iframe.closest('.t-video');
      pair(iframe, card && card.querySelector('.t-video-toggle'));
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
