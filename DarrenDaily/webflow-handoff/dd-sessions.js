
/* ============ DarrenDaily Sessions Template — page behaviors ============
   Reveal, video facade, share, sticky CTA, Expiring-Soon date format,
   SUCCESS covers wall + parallax, Hyvor comments. Idempotent. */
(function () {
  if (window.__ddSessInit) return;
  // Loaded site-wide: run only on session detail pages (they alone have .post-layout in the DOM).
  if (!document.querySelector('.post-layout')) return;
  window.__ddSessInit = true;

  // 0) LCP hint: the hero poster is the largest above-the-fold image -> load it eagerly, high priority.
  (function () { var p = document.querySelector('.video-poster'); if (p) { p.setAttribute('fetchpriority', 'high'); p.setAttribute('loading', 'eager'); } })();

  // 0b) Micro-polish CSS: the whole video thumb shows a clickable cursor before Vimeo loads,
  //     and the Expiring-Soon cards get the same hover bump as the Welcome/Expired feed cards.
  (function () {
    if (document.getElementById('dd-sess-polish')) return;
    var st = document.createElement('style'); st.id = 'dd-sess-polish';
    st.textContent =
      '[class*="video-frame"]{cursor:pointer}' +
      ".ss-card{transition:transform .25s cubic-bezier(.16,1,.3,1),box-shadow .25s cubic-bezier(.16,1,.3,1)}" +
      ".ss-card:hover{transform:translateY(-4px);box-shadow:0 26px 50px -24px rgba(20,23,28,.46)}";
    document.head.appendChild(st);
  })();

  // 1) Reveal: hero + content boxes fade in on load; lower sections on scroll.
  (function () {
    var SEL = '[class*="video-frame"],.share-bar,.post-caption,.cta-banner,.xsoon-head,.ss-card,.bio-text';
    var els = Array.prototype.slice.call(document.querySelectorAll(SEL));
    els.forEach(function (el) { el.classList.add('dd-reveal'); });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('dd-in'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    var immediate = Array.prototype.slice.call(document.querySelectorAll('.post-hero .dd-reveal, .post-layout .dd-reveal'));
    var im = new Set(immediate), i = 0;
    immediate.forEach(function (el) { el.style.transitionDelay = (i++ * 0.07) + 's'; });
    requestAnimationFrame(function () { requestAnimationFrame(function () { immediate.forEach(function (el) { el.classList.add('dd-in'); }); }); });
    els.forEach(function (el) { if (!im.has(el)) io.observe(el); });
  })();

  // 2) Video facade: click the frame -> mount the Vimeo iframe (id read from hidden .vf-vid).
  (function () {
    Array.prototype.slice.call(document.querySelectorAll('[class*="video-frame"]')).forEach(function (frame) {
      function play() {
        var v = frame.querySelector('.vf-vid'); var id = v ? v.textContent.trim() : '';
        if (!id || frame.querySelector('iframe')) return;
        var f = document.createElement('iframe');
        f.src = 'https://player.vimeo.com/video/' + encodeURIComponent(id) + '?autoplay=1&color=a72632&title=0&byline=0&portrait=0&dnt=1';
        f.allow = 'autoplay; fullscreen; picture-in-picture'; f.setAttribute('allowfullscreen', '');
        f.setAttribute('title', "Today's DarrenDaily session");
        f.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:0;z-index:5';
        frame.appendChild(f); frame.style.cursor = 'default';
      }
      frame.setAttribute('role', 'button'); frame.setAttribute('tabindex', '0');
      frame.addEventListener('click', play);
      frame.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); play(); } });
    });
  })();

  // 3) Share buttons: build targets from this post's canonical URL + title. Copy uses clipboard.
  (function () {
    var canonical = document.querySelector('link[rel="canonical"]');
    var ogt = document.querySelector('meta[property="og:title"]');
    var url = (canonical && canonical.href) || location.href;
    var title = (ogt && ogt.content) || document.title;
    var eu = encodeURIComponent(url), et = encodeURIComponent(title);
    var T = { facebook: 'https://www.facebook.com/sharer/sharer.php?u=' + eu, twitter: 'https://twitter.com/intent/tweet?url=' + eu + '&text=' + et, linkedin: 'https://www.linkedin.com/sharing/share-offsite/?url=' + eu, email: 'mailto:?subject=' + et + '&body=' + et + '%0A%0A' + eu };
    var toast;
    function showToast(msg) {
      if (!toast) { toast = document.createElement('div'); toast.setAttribute('role', 'status'); toast.style.cssText = 'position:fixed;left:50%;bottom:26px;transform:translateX(-50%);background:#14171c;color:#fff;padding:11px 18px;border-radius:4px;font:600 13px Inter,sans-serif;z-index:9999;opacity:0;transition:opacity .25s;pointer-events:none'; document.body.appendChild(toast); }
      toast.textContent = msg; requestAnimationFrame(function () { toast.style.opacity = '1'; });
      clearTimeout(toast._t); toast._t = setTimeout(function () { toast.style.opacity = '0'; }, 2600);
    }
    Array.prototype.slice.call(document.querySelectorAll('.share-bar [data-net]')).forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var net = btn.getAttribute('data-net');
        if (net === 'copy') { if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(url).then(function () { showToast('Link copied. Thank you for sharing.'); }); } else { showToast(url); } return; }
        if (net === 'email') { location.href = T.email; return; }
        if (navigator.share && /Mobi|Android/i.test(navigator.userAgent)) { navigator.share({ title: title, url: url }).catch(function () { window.open(T[net], '_blank', 'noopener,width=640,height=560'); }); return; }
        window.open(T[net], '_blank', 'noopener,width=640,height=560');
      });
    });
  })();

  // 3b) DarrenDaily Journal plug: a small, box-less open-book-being-written-in (icon F) + link on the LEFT of the share bar
  //     (balances the right-justified share links). Whole thing is clickable.
  (function () {
    var sb = document.querySelector('.share-bar');
    if (!sb || sb.querySelector('.dd-ondemand')) return;
    var a = document.createElement('a');
    a.className = 'dd-ondemand';
    a.href = 'https://store.darrenhardy.com/collections/merchandise/products/darrendaily-journal';
    a.target = '_blank'; a.rel = 'noopener';
    a.setAttribute('aria-label', 'Get your DarrenDaily Journal');
    a.innerHTML = '<svg class="dd-od-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 7.2C10.4 5.9 8.3 5.3 4.5 5.3v11.5c3.8 0 5.9.6 7.5 1.9"/><path d="M12 7.2c1-.8 2.3-1.3 4-1.6"/><path d="M12 18.7c1.4-1.3 3.5-1.9 7.5-1.9v-6"/><path d="M18.8 4.2a1.6 1.6 0 0 1 2.3 2.3L16 11.6l-2.8.6.6-2.8z"/></svg>' +
      '<span>Get Your DarrenDaily Journal</span>';
    sb.insertBefore(a, sb.firstChild);
    if (!document.getElementById('dd-ondemand-css')) {
      var st = document.createElement('style'); st.id = 'dd-ondemand-css';
      st.textContent = ".share-bar .dd-ondemand{margin-right:auto;display:inline-flex;align-items:center;gap:8px;text-decoration:none;color:rgba(255,255,255,.82);font:700 11px/1 'Inter',sans-serif;letter-spacing:2.42px;text-transform:uppercase;transition:color .2s}" +
        ".share-bar .dd-ondemand:hover{color:#fff}" +
        ".share-bar .dd-ondemand .dd-od-ic{width:19px;height:19px;flex:none;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}" +
        "@media(max-width:640px){.share-bar{flex-wrap:wrap;justify-content:center}.share-bar .dd-ondemand{order:-1;width:100%;margin:0 0 6px;justify-content:center}}";
      document.head.appendChild(st);
    }
  })();

  // 4) Sticky CTA: drop the top bar in once the inline banner (or ~60% scroll) passes mid-screen.
  (function () {
    var bar = document.getElementById('ctaSticky'); if (!bar) return;
    var trig = document.querySelector('.cta-banner');
    function update() {
      var show;
      if (trig) { var r = trig.getBoundingClientRect(); show = (r.top + r.height / 2) <= window.innerHeight / 2; }
      else { show = window.pageYOffset > window.innerHeight * 0.6; }
      bar.style.transform = show ? 'translateY(0)' : 'translateY(-100%)';
    }
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update); update();
  })();

  // 5) Expiring-Soon date -> "Jul 27 · 2026"
  (function () {
    var M = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    Array.prototype.slice.call(document.querySelectorAll('.ss-date')).forEach(function (el) {
      var t = (el.textContent || '').replace(/ /g, ' ').trim(); if (!t) return;
      var d = new Date(t); if (isNaN(d.getTime())) d = new Date(t.replace(/^[A-Za-z]+,?\s+/, ''));
      if (!isNaN(d.getTime())) el.textContent = M[d.getMonth()] + ' ' + d.getDate() + ' · ' + d.getFullYear();
    });
  })();

  // 6) SUCCESS covers wall + scroll parallax.
  (function () {
    var covers = ['https://cdn.prod.website-files.com/6a66d7a6f9d116b514a13ae1/6a66e5554df7439ce7c715ab_JackWelch.webp','https://cdn.prod.website-files.com/6a66d7a6f9d116b514a13ae1/6a66e62b14427c7ab009b4e1_SM_13_05_FORD.webp','https://cdn.prod.website-files.com/6a66d7a6f9d116b514a13ae1/6a66e6247eed2e69a3002cb2_SM_12_01_DOWNEY.webp','https://cdn.prod.website-files.com/6a66d7a6f9d116b514a13ae1/6a66e5563a7bdd61c3f57593_SM_09_07_BRANSON.webp','https://cdn.prod.website-files.com/6a66d7a6f9d116b514a13ae1/6a66e61f14427c7ab009ab87_SM_10_06_JOBS.webp','https://cdn.prod.website-files.com/6a66d7a6f9d116b514a13ae1/6a66e556a4b0de80b8b501e2_SM_09_08_FOX.webp','https://cdn.prod.website-files.com/6a66d7a6f9d116b514a13ae1/6a66e55557b738a7a0384417_SM_08_01_Kiyosaki.webp','https://cdn.prod.website-files.com/6a66d7a6f9d116b514a13ae1/6a66e5554df7439ce7c715df_SM_08_02_50.webp','https://cdn.prod.website-files.com/6a66d7a6f9d116b514a13ae1/6a66e555e77ce54f28afa6ca_SM_08_04_OZ.webp','https://cdn.prod.website-files.com/6a66d7a6f9d116b514a13ae1/6a66e55589d4dc60a5949544_SM_08_05_HAWK.webp','https://cdn.prod.website-files.com/6a66d7a6f9d116b514a13ae1/6a66e555e77ce54f28afa6e7_SM_08_06_Deutsch.webp','https://cdn.prod.website-files.com/6a66d7a6f9d116b514a13ae1/6a66e620e77ce54f28b00f1d_SM_10_12_SHRIVER.webp','https://cdn.prod.website-files.com/6a66d7a6f9d116b514a13ae1/6a66e5566ec51493e8c20979_SM_09_02_Powell.webp','https://cdn.prod.website-files.com/6a66d7a6f9d116b514a13ae1/6a66e55632c1b5d12231eb58_SM_09_03_FOREMAN.webp','https://cdn.prod.website-files.com/6a66d7a6f9d116b514a13ae1/6a66e55632c1b5d12231eb6d_SM_09_04_Maxwell.webp','https://cdn.prod.website-files.com/6a66d7a6f9d116b514a13ae1/6a66e55632c1b5d12231eb82_SM_09_05_ORMAN.webp','https://cdn.prod.website-files.com/6a66d7a6f9d116b514a13ae1/6a66e55632c1b5d12231eb97_SM_09_06_LANCE.webp','https://cdn.prod.website-files.com/6a66d7a6f9d116b514a13ae1/6a66e556daf5e386ed5dd9a5_SM_09_01_Robbins.webp','https://cdn.prod.website-files.com/6a66d7a6f9d116b514a13ae1/6a66e61c5a1a5ea0057e80b9_SM_09_09_FOSTER_Barcode.webp','https://cdn.prod.website-files.com/6a66d7a6f9d116b514a13ae1/6a66e61c32c1b5d12232382b_SM_09_10_SERENA_barcode.webp','https://cdn.prod.website-files.com/6a66d7a6f9d116b514a13ae1/6a66e61c7eed2e69a3002a34_SM_09_11_OSTEEN_barcode.webp','https://cdn.prod.website-files.com/6a66d7a6f9d116b514a13ae1/6a66e61d7eed2e69a3002a5e_SM_09_12_DrPHIL.webp','https://cdn.prod.website-files.com/6a66d7a6f9d116b514a13ae1/6a66e628e123fb9285f83052_SM_12_07_TECHNOLOGY.webp','https://cdn.prod.website-files.com/6a66d7a6f9d116b514a13ae1/6a66e61e44f46a1ffc5421ab_SM_10_01_KEYES.webp','https://cdn.prod.website-files.com/6a66d7a6f9d116b514a13ae1/6a66e61e70b11505bd255a0d_SM_10_02_RAMSEY.webp','https://cdn.prod.website-files.com/6a66d7a6f9d116b514a13ae1/6a66e61eccabcac5f094e87e_SM_10_03_HOPKINS.webp','https://cdn.prod.website-files.com/6a66d7a6f9d116b514a13ae1/6a66e61ebbf0595728193948_SM_10_04_COLLINS.webp','https://cdn.prod.website-files.com/6a66d7a6f9d116b514a13ae1/6a66e61ebbf0595728193975_SM_10_05_MICHAELS.webp','https://cdn.prod.website-files.com/6a66d7a6f9d116b514a13ae1/6a66e61f1dabea02a089a958_SM_10_07_COLE.webp','https://cdn.prod.website-files.com/6a66d7a6f9d116b514a13ae1/6a66e61f22bf946a016c20f8_SM_10_08_JOHNSON.webp','https://cdn.prod.website-files.com/6a66d7a6f9d116b514a13ae1/6a66e6204d2ae840ef944797_SM_10_09_DELL.webp','https://cdn.prod.website-files.com/6a66d7a6f9d116b514a13ae1/6a66e620d4f0219be4240398_SM_10_10_USHER.webp','https://cdn.prod.website-files.com/6a66d7a6f9d116b514a13ae1/6a66e6201dabea02a089aa11_SM_10_11_MANNINGS.webp','https://cdn.prod.website-files.com/6a66d7a6f9d116b514a13ae1/6a66e621e123fb9285f82d0f_SM_11_01_HOWARD.webp','https://cdn.prod.website-files.com/6a66d7a6f9d116b514a13ae1/6a66e621901776d33b22791f_SM_11_02_CHAN.webp','https://cdn.prod.website-files.com/6a66d7a6f9d116b514a13ae1/6a66e6216c506c4f5d51d6fa_SM_11_03_SCHWAB.webp','https://cdn.prod.website-files.com/6a66d7a6f9d116b514a13ae1/6a66e6226c506c4f5d51d781_SM_11_04_SCHULTZ.webp'];
    function cleanName(f) { var n = f.replace(/\.(jpg|jpeg|png|gif|webp)$/i, ''); n = n.replace(/^SM_\d+_\d+_/i, ''); n = n.replace(/([a-z])([A-Z])/g, '$1 $2'); n = n.replace(/[_-]/g, ' '); n = n.replace(/\bbarcode\b/gi, '').replace(/\s+/g, ' ').trim(); n = n.toLowerCase().replace(/\b\w/g, function (c) { return c.toUpperCase(); }); return n; }
    var featuredTypes = ['large', 'tall', 'large', 'tall', 'standard'];
    function buildSpreadPool(n) {
      // Scale the count of special (multi-cell) tiles to n so smaller walls keep enough 1x1
      // "standard" tiles for grid-auto-flow:dense to backfill holes. Desktop (n=32) is
      // unchanged: round(32*0.62)=20 -> 4 wide + 16 tall, exactly as before. On mobile
      // (n=19) a fixed 20 specials left ZERO standards, so dense couldn't fill the single
      // cells that tall tiles free up (the gap under Jobs). Now mobile keeps ~7-8 standards.
      var nSpecial = Math.min(n, Math.round(n * 0.62));
      var nWide = Math.round(nSpecial * 0.2); var nTall = nSpecial - nWide;
      var special = Array(nWide).fill('wide').concat(Array(nTall).fill('tall')); var s = 0xc0ffee42;
      for (var i = special.length - 1; i > 0; i--) { s = Math.imul(s ^ (s >>> 16), 0x45d9f3b); s = Math.imul(s ^ (s >>> 16), 0x45d9f3b); s ^= s >>> 16; var j = (Math.abs(s) >>> 0) % (i + 1); var t = special[i]; special[i] = special[j]; special[j] = t; }
      var pool = Array(n).fill('standard');
      if (special.length > 1) { var step = (n - 1) / (special.length - 1); special.forEach(function (type, i) { pool[Math.round(i * step)] = type; }); }
      else if (special.length === 1) { pool[Math.floor(n / 2)] = special[0]; }
      return pool;
    }
    var grid = document.querySelector('.dd-covers'); if (!grid) return;
    var wall = document.querySelector('.bio-wall'); if (!wall) return;
    var list = (window.innerWidth <= 767) ? covers.slice(0, 24) : covers;
    var built = false;
    function build() {
      if (built) return; built = true;
      var bodyTypes = buildSpreadPool(list.length - 5);
      var frag = document.createDocumentFragment();
      list.forEach(function (cover, i) {
        var tile = document.createElement('div'); tile.className = 'c-tile';
        var t = i < 5 ? featuredTypes[i] : bodyTypes[i - 5];
        if (t === 'wide') tile.classList.add('c-wide'); if (t === 'tall') tile.classList.add('c-tall'); if (t === 'large') tile.classList.add('c-large');
        var img = document.createElement('img'); img.src = cover; img.alt = cleanName((cover.split('/').pop() || '').replace(/\.webp$/i, '').replace(/^[0-9a-f]+_/, '')); img.width = 200; img.height = 280; img.loading = 'lazy'; img.decoding = 'async';
        tile.appendChild(img); frag.appendChild(tile);
      });
      grid.appendChild(frag);
    }
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (e) { if (e[0].isIntersecting) { build(); io.disconnect(); } }, { rootMargin: '1200px 0px' });
      io.observe(wall);
    } else { build(); }
    var rp = false;
    window.addEventListener('scroll', function () {
      if (!built || rp) return; rp = true;
      requestAnimationFrame(function () { var rect = wall.getBoundingClientRect(); var progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height); var offset = Math.max(0, progress * 500); grid.style.transform = 'translateY(-' + offset + 'px)'; rp = false; });
    }, { passive: true });
  })();

  // 7) Hyvor comments -> mount on first user engagement (scroll/tap/key) OR when the section
  //    actually enters view, whichever is first. Comments are below the fold, so this keeps
  //    Hyvor's third-party JS off the initial (unscrolled) load that pagespeed audits measure.
  (function () {
    var box = document.querySelector('.comments-embed'); if (!box) return;
    var done = false;
    var evs = ['scroll', 'pointerdown', 'touchstart', 'keydown'];
    function cleanup() { evs.forEach(function (e) { window.removeEventListener(e, onEv, { passive: true }); }); }
    function mount() {
      if (done) return; done = true; cleanup();
      box.innerHTML = '';
      var el = document.createElement('hyvor-talk-comments');
      el.setAttribute('website-id', '13897');
      el.setAttribute('page-id', location.pathname);
      box.appendChild(el);
      if (!document.querySelector('script[data-hyvor]')) { var s = document.createElement('script'); s.async = true; s.type = 'module'; s.src = 'https://talk.hyvor.com/embed/embed.js'; s.setAttribute('data-hyvor', '1'); document.head.appendChild(s); }
    }
    function onEv() { mount(); }
    evs.forEach(function (e) { window.addEventListener(e, onEv, { passive: true }); });
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (e) { if (e[0].isIntersecting) { io.disconnect(); mount(); } }, { rootMargin: '0px' });
      io.observe(box);
    }
  })();

  // 9) (removed) Sidebar/right-column promo cards, Moneyline, and Featured CTA were removed from this template.

  // Shared HubSpot CTA helpers (portal 2518645). Reliable image-beacon + click-redirect.
  function ddCtaId(sel){ var h = document.querySelector(sel), v = h ? (h.textContent || '').trim() : ''; return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v) ? v : ''; }
  function ddBeacon(id){ return 'https://no-cache.hubspot.com/cta/default/2518645/' + id + '.png'; }
  function ddRedirect(id){ return 'https://cta-redirect.hubspot.com/cta/redirect/2518645/' + id; }

  // A) Anti-flash: HubSpot beacon imgs (inline banner + sticky) fade in on load, no placeholder flash.
  (function () {
    var S = ['.cta-banner-img', '.cta-sticky-img'];
    function g(i){ if(!i||i.getAttribute('data-ddaf'))return; var s=i.getAttribute('src')||''; if(s.indexOf('no-cache.hubspot.com')===-1)return; i.setAttribute('data-ddaf','1'); if(i.complete&&i.naturalWidth>0)return; var r=function(){i.style.opacity='1';}; i.style.transition='opacity .2s ease'; i.style.opacity='0'; i.addEventListener('load',r,{once:true}); i.addEventListener('error',r,{once:true}); setTimeout(r,6000); }
    function scan(){ S.forEach(function(sel){ var l=document.querySelectorAll(sel); for(var k=0;k<l.length;k++) g(l[k]); }); }
    var mo=new MutationObserver(scan); scan();
    try{ mo.observe(document.documentElement,{subtree:true,attributes:true,attributeFilter:['src'],childList:true}); }catch(e){}
    setTimeout(function(){ try{mo.disconnect();}catch(e){} },8000);
  })();

  // 10) Inline-banner Smart CTA override.
  (function () {
    var id = ddCtaId('.xcta-inline'); if (!id) return;
    var link = document.querySelector('.cta-banner'), img = document.querySelector('.cta-banner-img');
    if (link) { link.setAttribute('href', ddRedirect(id)); link.setAttribute('target', '_blank'); link.setAttribute('rel', 'noopener'); }
    if (img) { img.removeAttribute('srcset'); img.removeAttribute('sizes'); img.setAttribute('loading', 'lazy'); img.src = ddBeacon(id); img.alt = 'Featured offer'; }
  })();

  // 11) Sticky-banner Smart CTA override.
  (function () {
    var id = ddCtaId('.xcta-sticky'); if (!id) return;
    var rd = ddRedirect(id);
    var link = document.querySelector('.cta-sticky-link'), img = document.querySelector('.cta-sticky-img'), btn = document.querySelector('.cta-sticky-btn');
    if (link) { link.setAttribute('href', rd); link.setAttribute('target', '_blank'); link.setAttribute('rel', 'noopener'); }
    if (img) { img.removeAttribute('srcset'); img.removeAttribute('sizes'); img.src = ddBeacon(id); img.alt = 'Featured offer'; }
    if (btn) { btn.style.display = 'none'; }
  })();

  // 12) Secondary-caption Smart CTA override.
  (function () {
    var holder = document.querySelector('.xcta-secondary'); if (!holder) return;
    var id = ddCtaId('.xcta-secondary'); if (!id) return;
    var sec = document.getElementById('postSecCaption'); if (sec) sec.style.display = 'none';
    holder.innerHTML = '<a href="' + ddRedirect(id) + '" target="_blank" rel="noopener" style="display:block"><img src="' + ddBeacon(id) + '" loading="lazy" alt="Featured offer" style="display:block;width:100%;height:auto;border-radius:4px"></a>';
    holder.style.display = 'block';
  })();

  // 13) Masthead date -> "Tuesday, July 28, 2026" (weekday + long date).
  (function () {
    var el = document.querySelector('.post-date'); if (!el) return;
    var raw = (el.textContent || '').replace(/^[A-Za-z]+,\s*/, '').trim(); if (!raw) return;
    var d = new Date(raw); if (isNaN(d.getTime())) return;
    var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    el.textContent = days[d.getDay()] + ', ' + months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
  })();

  // 14) "Expiring Soon" -> render from /sessions-feed: only PUBLISHED-and-not-expired sessions, excluding this one.
  (function () {
    var row = document.querySelector('.xsoon-row'); if (!row) return;
    var items = row.querySelector('.w-dyn-items'); var list = row.querySelector('.w-dyn-list');
    if (!items || !list) return;
    var M = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var here; try { here = decodeURIComponent((location.pathname.split('/').pop() || '')).trim(); } catch (e) { here = (location.pathname.split('/').pop() || '').trim(); }
    function pd(s){ if(!s) return null; s=String(s).replace(/\s+/g,' ').trim(); var d=new Date(s); if(!isNaN(d.getTime())) return d; d=new Date(s.replace(/^[A-Za-z]+,?\s+/,'')); return isNaN(d.getTime())?null:d; }
    function fmt(d){ return d ? (M[d.getMonth()] + ' ' + d.getDate() + ' · ' + d.getFullYear()) : ''; }
    function esc(s){ return String(s==null?'':s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
    function card(s){ return '<div role="listitem" class="w-dyn-item"><a href="/sessions/' + encodeURIComponent(s.slug) + '" class="ss-card w-inline-block"><img src="' + esc(s.thumb) + '" alt="' + esc(s.title) + '" class="ss-card-img" loading="lazy"><div class="ss-date">' + fmt(s.pub) + '</div></a></div>'; }
    var done = false; function reveal(){ if (done) return; done = true; list.style.visibility = ''; }
    list.style.visibility = 'hidden'; setTimeout(reveal, 4000);
    function build(){
      fetch('/sessions-feed', { credentials: 'same-origin' }).then(function (r) { return r.ok ? r.text() : Promise.reject(); }).then(function (html) {
        var doc = new DOMParser().parseFromString(html, 'text/html');
        var all = Array.prototype.slice.call(doc.querySelectorAll('[data-sf="row"]')).map(function (r) {
          function t(n){ var e = r.querySelector('[data-sf="' + n + '"]'); return e ? e.textContent.trim() : ''; }
          var img = r.querySelector('img');
          return { slug: t('slug'), title: t('title'), thumb: img ? (img.getAttribute('src') || '') : '', pub: pd(t('pub')), exp: pd(t('exp')) };
        }).filter(function (s) { return s.slug && s.thumb; });
        var now = Date.now();
        var live = all.filter(function (s) { return s.slug !== here && (!s.pub || s.pub.getTime() <= now) && (!s.exp || s.exp.getTime() > now); });
        live.sort(function (a, b) { return (b.pub ? b.pub.getTime() : 0) - (a.pub ? a.pub.getTime() : 0); });
        if (live.length) { items.innerHTML = live.slice(0, 2).reverse().map(card).join(''); }
        reveal();
      }).catch(reveal);
    }
    if ('IntersectionObserver' in window) { var io = new IntersectionObserver(function (e) { if (e[0].isIntersecting) { io.disconnect(); build(); } }, { rootMargin: '700px 0px' }); io.observe(row); }
    else { build(); }
  })();
})();
