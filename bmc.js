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

// ===== Video testimonial slider — prev/next arrows (looping) =====
// Native CSS scroll-snap does the heavy lifting; the arrows step by one card
// width (including the gap) and WRAP AROUND at the ends so they always move:
// "next" at the end loops back to the start, "prev" at the start jumps to the
// end. No DOM cloning — just edge detection + a scroll to the opposite end.
(function () {
  document.querySelectorAll('[data-video-track]').forEach(track => {
    const slider = track.closest('.t-video-slider');
    if (!slider) return;
    const prev = slider.querySelector('[data-video-prev]');
    const next = slider.querySelector('[data-video-next]');
    if (!prev || !next) return;

    const EDGE = 4; // px tolerance for "at the end / at the start"

    const step = () => {
      const firstCard = track.querySelector('.t-video');
      if (!firstCard) return 0;
      const trackStyle = window.getComputedStyle(track);
      const gap = parseFloat(trackStyle.columnGap || trackStyle.gap || '0');
      return firstCard.offsetWidth + gap;
    };

    const scrollByCard = (dir) => {
      const maxScroll = track.scrollWidth - track.clientWidth;
      const atEnd = track.scrollLeft >= maxScroll - EDGE;
      const atStart = track.scrollLeft <= EDGE;

      if (dir > 0 && atEnd) {
        // Past the last card → loop to the start.
        track.scrollTo({ left: 0, behavior: 'smooth' });
      } else if (dir < 0 && atStart) {
        // Before the first card → loop to the end.
        track.scrollTo({ left: maxScroll, behavior: 'smooth' });
      } else {
        track.scrollBy({ left: dir * step(), behavior: 'smooth' });
      }
    };

    prev.addEventListener('click', () => scrollByCard(-1));
    next.addEventListener('click', () => scrollByCard(1));
  });
})();
