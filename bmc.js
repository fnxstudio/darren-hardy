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

// ===== Video testimonials — manual arrows, seamless loop =====
// The card set is duplicated once so the track is exactly 2x its content
// width. Arrows scroll one card at a time; at a set boundary scrollLeft is
// silently rewound/advanced by one set-width (half the track) BEFORE the
// smooth scroll. The second set is pixel-identical to the first, so the wrap
// is invisible — clicking past the end glides straight on, no jump-back.
(function () {
  document.querySelectorAll('[data-video-marquee]').forEach(track => {
    const marquee = track.closest('.t-video-marquee');
    if (!marquee) return;
    const prev = marquee.querySelector('[data-video-prev]');
    const next = marquee.querySelector('[data-video-next]');

    const originals = Array.from(track.querySelectorAll('.t-video'));
    if (!originals.length) return;

    // Duplicate the set once (clones out of the a11y tree / tab order).
    originals.forEach(card => {
      const clone = card.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      clone.querySelectorAll('button, a, [tabindex]').forEach(el => el.setAttribute('tabindex', '-1'));
      track.appendChild(clone);
    });

    const step = () => {
      const card = track.querySelector('.t-video');
      if (!card) return 0;
      const cs = window.getComputedStyle(card);
      return card.offsetWidth + parseFloat(cs.marginRight || '0');
    };

    const go = (dir) => {
      const half = track.scrollWidth / 2; // one full (original) set width
      const s = step();
      if (dir > 0 && track.scrollLeft >= half - 1) {
        // Reached the start of the duplicate set → rewind to the real start
        // (identical content, so invisible) before sliding forward.
        track.scrollLeft -= half;
      } else if (dir < 0 && track.scrollLeft < s) {
        // At the real start → jump forward into the duplicate set, then slide
        // back so "prev" reveals the last cards seamlessly.
        track.scrollLeft += half;
      }
      track.scrollBy({ left: dir * s, behavior: 'smooth' });
    };

    if (prev) prev.addEventListener('click', () => go(-1));
    if (next) next.addEventListener('click', () => go(1));
  });
})();
