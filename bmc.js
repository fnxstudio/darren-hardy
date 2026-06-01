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

// ===== Video testimonial slider — prev/next arrows (seamless infinite loop) =====
// The original cards are cloned once and appended, so the track can keep
// sliding one card at a time in the same direction past the end. When a full
// set has scrolled by, scrollLeft is silently rewound by one set-width — the
// clones are pixel-identical to the originals, so the rewind is invisible and
// the motion reads as one continuous loop (no big jump-back).
(function () {
  document.querySelectorAll('[data-video-track]').forEach(track => {
    const slider = track.closest('.t-video-slider');
    if (!slider) return;
    const prev = slider.querySelector('[data-video-prev]');
    const next = slider.querySelector('[data-video-next]');
    if (!prev || !next) return;

    const originals = Array.from(track.querySelectorAll('.t-video'));
    const N = originals.length;
    if (!N) return;

    // Clone the full set once and append (kept out of the a11y tree / tab order).
    originals.forEach(card => {
      const clone = card.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      clone.querySelectorAll('button, a, [tabindex]').forEach(el => el.setAttribute('tabindex', '-1'));
      track.appendChild(clone);
    });

    let index = 0; // logical left-most card index (can exceed N transiently)

    const step = () => {
      const card = track.querySelector('.t-video');
      if (!card) return 0;
      const cs = window.getComputedStyle(track);
      const gap = parseFloat(cs.columnGap || cs.gap || '0');
      return card.offsetWidth + gap;
    };

    const go = (dir) => {
      const s = step();
      // Before moving, if we're at a set boundary, silently shift by one full
      // set (N cards) into the clone buffer so there's always room to slide.
      if (dir > 0 && index >= N) {
        index -= N;
        track.scrollLeft -= N * s;
      } else if (dir < 0 && index <= 0) {
        index += N;
        track.scrollLeft += N * s;
      }
      index += dir;
      track.scrollBy({ left: dir * s, behavior: 'smooth' });
    };

    prev.addEventListener('click', () => go(-1));
    next.addEventListener('click', () => go(1));
  });
})();
