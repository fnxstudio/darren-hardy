/* =============================================================================
   CHAMPION BOARD v2 (/champion-v2): page script
   -----------------------------------------------------------------------------
   The board (deck, podium, ranks 4-11, coin faces, Platinum Circle, new coins,
   pings) is native Webflow CMS lists bound to Champions. This script adds
   behaviour only, and reads three hidden CMS template pages:
     /champion-data/<ref>   one Champion's numbers   -> "Where you stand"
     /champion-board/p1..pN full standings as text  -> counts + searchable list
     /champion-key/<hash>   email sign-in key -> referral ID
   Hooks are ids and data-* attributes only. Classes are only toggled for state (is-*).

   v2 coin thresholds (design only, 2026-10-18): Copper 2, Silver 4, Gold 8, Platinum 16.
   The sync still writes the v1 thresholds into the CMS coin field; the stand card
   below works from impacts, so it shows the v2 numbers.
   REF_IN/OUT: referral param names (waiting on the real HubSpot field name)
   ============================================================================= */
(function () {
  var $ = function (id) { return document.getElementById(id); };
  var all = function (sel, root) { return [].slice.call((root || document).querySelectorAll(sel)); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[<>&"]/g, function (c) { return { '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c]; }); };
  var page = document.querySelector('.cb-page');
  if (!page) return;

  // Open seats and missing headshots show the midnight-glow placeholder (the CMS open-seat image is v1's purple one)
  var PH = 'https://cdn.prod.website-files.com/6aa109c0730dcec4155908e1/6ad59b670153fbdf72e77b16_cb-headshot-placeholder.webp';
  function isOpenSeat(src) { return !src || /champ-open-seat/.test(src); }
  all('img', page).forEach(function (im) {
    if (im.closest('#cbIndex, #cbindex') || !/face|photo|frame|plaque|member|rank|tier|ping|person|chip/.test(im.className + ' ' + (im.parentNode.className || ''))) return;
    if (im.classList.contains('w-dyn-bind-empty') || isOpenSeat(im.getAttribute('src'))) { im.removeAttribute('srcset'); im.removeAttribute('sizes'); im.src = PH; im.classList.remove('w-dyn-bind-empty'); }
  });

  // Buttons JUMP to their section, no animated scroll (user call, 2026-10-09).
  function go(el) {
    if (typeof el === 'string') el = $(el);
    if (!el) return;
    scrollTo(0, Math.max(0, el.getBoundingClientRect().top + pageYOffset - (parseFloat(getComputedStyle(el).scrollMarginTop) || 0)));
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('.cb-page a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute('href').slice(1);
    if (!id) { e.preventDefault(); return; } // href="#" controls: their own handlers run
    if (a.hasAttribute('data-own')) return;
    var t = $(id);
    if (!t || t.hidden) { if (id === 'stand') { e.preventDefault(); go('link'); } return; }
    e.preventDefault(); e.stopPropagation(); if (e.detail) a.blur();
    if (a.hasAttribute('data-lv-close')) closeLv();
    go(t);
  }, true);
  // Webflow's own smooth scroll (listening on document) would also jump to a data-own link's #target; stop it at the page
  page.addEventListener('click', function (e) { if (e.target.closest && e.target.closest('a[data-own]')) e.stopPropagation(); });
  // Space and Enter on role=button links
  page.addEventListener('keydown', function (e) {
    var b = e.target.closest('[role=button]');
    if (b && (e.key === ' ' || e.key === 'Enter') && b.tagName !== 'BUTTON') { e.preventDefault(); b.click(); }
  });

  // ---------- coins (v2 thresholds) ----------
  var COINS = [['Copper', 2], ['Silver', 4], ['Gold', 8], ['Platinum', 16]];
  function coinFor(imp) { var c = ''; COINS.forEach(function (x) { if (imp >= x[1]) c = x[0]; }); return c; }
  function nextCoin(imp) { for (var i = 0; i < COINS.length; i++) if (imp < COINS[i][1]) return COINS[i]; return null; }
  var plural = function (n, w) { return n + ' ' + w + (n === 1 ? '' : 's'); };

  // ---------- CMS lists: coin colours, movement chips, pings ----------
  // An element marked data-coin-text holds the CMS coin; its item takes that coin on every [data-coin].
  all('[data-coin-text]').forEach(function (t) {
    var coin = t.textContent.trim(), item = t.closest('.w-dyn-item') || t.parentNode;
    if (!coin) return;
    all('[data-coin]', item).forEach(function (e) { e.setAttribute('data-coin', coin); });
  });
  // Movement: chips read "▲ 2", "▼ 1" or "—"; a move ping with no move this week is hidden.
  all('[data-move]').forEach(function (m) {
    var n = parseInt(m.textContent, 10) || 0, kind = m.getAttribute('data-move');
    if (kind === 'ping') { if (n <= 0) { var it = m.closest('.w-dyn-item'); if (it) it.hidden = true; } return; }
    m.textContent = n > 0 ? '▲ ' + n : n < 0 ? '▼ ' + Math.abs(n) : '—';
    m.classList.remove('w-dyn-bind-empty'); // an empty CMS field hides the element; the chip always shows
    m.classList.toggle('is-up', n > 0);
  });

  // ---------- scale-to-fit: the hero deck keeps the desktop layout on small screens; the tier row does on tablets ----------
  function fit() {
    var df = $('deckFit'), d = $('deck');
    if (df && d) {
      if (innerWidth > 991) { d.style.transform = ''; df.style.height = ''; }
      else { var sc = Math.min(1, df.clientWidth / 660); d.style.transform = 'translateX(' + Math.max(0, Math.round((df.clientWidth - 640 * sc) / 2)) + 'px) scale(' + sc.toFixed(4) + ')'; df.style.height = Math.round(680 * sc) + 'px'; }
    }
    var tf = $('tiersFit'), t = $('tiers');
    if (tf && t) {
      t.style.width = ''; t.style.transform = ''; tf.style.height = '';
      if (tf.clientWidth < 1000 && innerWidth > 767) { var s2 = tf.clientWidth / 1000; t.style.width = '1000px'; t.style.transform = 'scale(' + s2.toFixed(4) + ')'; tf.style.height = Math.round(t.offsetHeight * s2) + 'px'; }
    }
  }
  fit(); addEventListener('resize', fit); addEventListener('load', fit);

  // ---------- scroll reveal: section heads and cards rise in as they enter, staggered per batch ----------
  (function () {
    if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var sel = '.cb-head, .cb-board-head, .cb-podium-slot, .cb-ranks-list > .w-dyn-item, .cb-rewards-copy, .cb-reward, .cb-start, .cb-tier, .cb-prize, .cb-step, .cb-play, .cb-play-photo, .cb-studio-copy, .cb-perk, .cb-tableband-copy, .cb-season-head, .cb-video, .cb-stop, .cb-circle-head, .cb-member, .cb-open, .cb-newcoins-head, .cb-coinwall-item, .cb-friday-photo, .cb-friday-copy, .cb-opt, .cb-panel, .cb-close-in, .cb-faq-intro, .cb-qa';
    var els = all(sel, page).filter(function (e) { return !e.closest('.cb-hero, .cb-overlay, #cbIndex, #cbindex') && e.getBoundingClientRect().top > innerHeight * 0.9; });
    if (!els.length) return;
    els.forEach(function (e) { e.setAttribute('data-in', ''); });
    document.documentElement.classList.add('cb-motion');
    var io = new IntersectionObserver(function (ents) {
      ents.filter(function (x) { return x.isIntersecting; }).sort(function (a, b) { return a.boundingClientRect.top - b.boundingClientRect.top || a.boundingClientRect.left - b.boundingClientRect.left; })
        .forEach(function (x, i) { x.target.style.setProperty('--in-d', Math.min(i * 0.08, 0.48) + 's'); x.target.classList.add('is-in'); io.unobserve(x.target); });
    }, { rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (e) { io.observe(e); });
  })();

  // ---------- full standings ----------
  // Board Pages (/champion-board/p1..pN): line 1 of p1 is "pages=N"; each row is rank|name|coin|impacts.
  // Photos and team lines come from the hidden index list (#cbIndex: Champions by rank, first 100).
  var full = $('full'), fullBtn = $('fullBtn'), list = $('fullList'), search = $('fullSearch'), pin = $('fullPin'), ALL = null, me = null;
  var IDX = {};
  all('#cbIndex .w-dyn-item').forEach(function (it) {
    var r = it.querySelector('[data-i="rank"]'), im = it.querySelector('img'), tm = it.querySelector('[data-i="team"]');
    if (r) IDX[r.textContent.trim()] = { src: im && !im.classList.contains('w-dyn-bind-empty') && !isOpenSeat(im.getAttribute('src')) ? (im.currentSrc || im.src) : '', team: tm ? tm.textContent.trim() : '' };
  });
  var OPEN_SEAT = PH;
  function boardPage(n) {
    return fetch('/champion-board/p' + n, { credentials: 'same-origin' }).then(function (r) { if (!r.ok) throw r.status; return r.text(); }).then(function (h) {
      var el = new DOMParser().parseFromString(h, 'text/html').querySelector('[data-board]');
      return el ? el.innerHTML.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&') : '';
    });
  }
  function parse(txt) { return txt.split('\n').map(function (l) { return l.trim().split('|'); }).filter(function (r) { return r.length === 4; }); }
  var boardP = null;
  function loadBoard() {
    if (boardP) return boardP;
    boardP = boardPage(1).then(function (t) {
      var m = /pages=(\d+)/.exec(t), n = m ? +m[1] : 1, more = [];
      for (var i = 2; i <= n; i++) more.push(boardPage(i));
      return Promise.all(more).then(function (rest) { var a = parse(t); rest.forEach(function (x) { a = a.concat(parse(x)); }); ALL = a; return a; });
    }).catch(function () { ALL = []; return ALL; });
    return boardP;
  }
  function chip(coin) { return coin ? '<span class="cb-chip" data-coin="' + esc(coin) + '"><span class="cb-chip-core"></span></span>' : ''; }
  function row(r, isMe) {
    var rank = +r[0], x = IDX[r[0]] || {}, imp = +r[3] || 0, coin = r[2];
    var sub = isMe ? meLine(imp) : (x.team || '');
    return '<li class="cb-row' + (isMe ? ' is-me' : '') + '" data-rank="' + rank + '"><span class="cb-row-rank">' + rank + '</span><img class="cb-row-face" src="' + esc(x.src || OPEN_SEAT) + '" alt="" loading="lazy">' +
      '<span><span class="cb-row-name">' + esc(r[1]) + '</span>' + (sub ? '<span class="cb-row-team" style="display:block">' + esc(sub) + '</span>' : '') + '</span>' +
      '<span class="cb-row-coin">' + (coin ? chip(coin) + esc(coin) : 'On the board') + '</span><span class="cb-row-imp">' + esc(r[3]) + '</span></li>';
  }
  function meLine(imp) { var n = nextCoin(imp); return 'You' + (n ? ' · ' + (n[1] - imp === 1 ? 'one more leader earns ' : (n[1] - imp) + ' more leaders earn ') + n[0] : ''); }
  function render(q) {
    if (!ALL) return;
    $('fullCount').textContent = ALL.length ? plural(ALL.length, 'Champion') + ' on the board' : '';
    if (!ALL.length) { list.innerHTML = '<li class="cb-row-note">The full board is updating. Check back shortly.</li>'; pin.hidden = true; return; }
    q = (q || '').trim().toLowerCase();
    var rows = q ? ALL.filter(function (r) { return r[1].toLowerCase().indexOf(q) > -1; }) : ALL;
    list.innerHTML = rows.length ? rows.map(function (r) { return row(r, me && +r[0] === me.rank); }).join('') : '<li class="cb-row-note">No Champion by that name yet</li>';
    // Signed in: your row is also pinned under the list
    var mine = me && ALL.filter(function (r) { return +r[0] === me.rank; })[0];
    pin.hidden = !mine;
    if (mine) pin.innerHTML = '<div class="cb-row-gap">· · ·</div>' + row(mine, true).replace('<li', '<div').replace(/<\/li>$/, '</div>');
  }
  function centerRow(r) { list.scrollTop += r.getBoundingClientRect().top - list.getBoundingClientRect().top - Math.min(list.clientHeight * 0.3, 240); }
  function showMe() { if (search) search.value = ''; render(''); var r = me && list.querySelector('[data-rank="' + me.rank + '"]'); if (r) centerRow(r); }
  function setOpen(open) {
    full.hidden = !open;
    fullBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    fullBtn.innerHTML = open ? 'Hide full standings <span>&uarr;</span>' : 'Full standings <span>&darr;</span>';
  }
  function isOpen() { return fullBtn.getAttribute('aria-expanded') === 'true'; }
  function openFull() { setOpen(true); list.innerHTML = ALL ? list.innerHTML : '<li class="cb-row-note">Loading the board&hellip;</li>'; return loadBoard().then(function () { if (me) showMe(); else render(search ? search.value : ''); }); }
  setOpen(false);
  fullBtn.setAttribute('data-own', '');
  // closing keeps the button where it was on screen; opening jumps to the top of the table
  fullBtn.addEventListener('click', function (e) { e.preventDefault(); if (isOpen()) { var t0 = fullBtn.getBoundingClientRect().top; setOpen(false); scrollBy(0, fullBtn.getBoundingClientRect().top - t0); return; } openFull().then(function () { go(full); }); });
  if (search) { var st0; search.addEventListener('input', function () { clearTimeout(st0); st0 = setTimeout(function () { render(search.value); }, 120); }); }
  $('fullMe').setAttribute('data-own', '');
  // Show my spot: the table is already open (the button lives in it), so the page stays put; the list scrolls to your row and it flashes
  $('fullMe').addEventListener('click', function (e) {
    e.preventDefault();
    if (!me) { go('link'); return; }
    loadBoard().then(function () {
      if (search) search.value = '';
      render('');
      var r = list.querySelector('[data-rank="' + me.rank + '"]') || pin.querySelector('.cb-row');
      if (!r) return;
      if (list.contains(r)) {
        // put your row in the part of the list that is on screen
        var lt = list.getBoundingClientRect().top, rh = r.offsetHeight;
        var want = Math.max(lt + 8, Math.min(lt + list.clientHeight * 0.3, innerHeight - rh - 120));
        list.scrollTop += r.getBoundingClientRect().top - want;
      }
      var b = r.getBoundingClientRect();
      if (b.bottom > innerHeight - 24) scrollBy(0, b.bottom - innerHeight + 96); else if (b.top < 24) scrollBy(0, b.top - 96);
      r.classList.remove('is-flash'); void r.offsetWidth; r.classList.add('is-flash');
    });
  });

  // Coin counts ("# here now") from the full board
  loadBoard().then(function (rows) {
    var n = {};
    rows.forEach(function (r) { n[r[2]] = (n[r[2]] || 0) + 1; });
    all('[data-count]').forEach(function (e) { var k = e.getAttribute('data-count'); e.textContent = n[k] || 0; });
  });

  // ---------- coin pop-up ----------
  var LV = {
    copper:   { coin: 'Copper', i: 1, desc: 'Two leaders in April because of you. Your name is on the board and climbing.',
                tips: [['Start with the leader closest to you.', 'Your number two is the easiest first yes on the board.'], ['Investing for your own team?', 'Enroll each leader and every one shows on your board.'], ['Your first impact is the hardest one.', 'Your Copper coin follows the next.']] },
    silver:   { coin: 'Silver', i: 2, desc: 'Four leaders in April because of you. Keep going.',
                tips: [['Bring them as a team.', 'Two leaders from the same company is two impacts in one conversation.'], ['Use the Challenge.', 'Leaders who spend three days with Darren in December say yes to April.'], ['Follow up personally.', 'A two-line text a week later turns maybes into yeses.']] },
    gold:     { coin: 'Gold', i: 3, desc: 'Eight leaders in April because of you. The top ranks are now in reach.',
                tips: [['Think past your company.', 'A key vendor, a client, a partner. The relationship is already there.'], ['A spouse or business partner counts.', 'Same language at home and at work.'], ['Watch for each sprint.', 'Each one brings a new play. Run it the week it opens.']] },
    platinum: { coin: 'Platinum', i: 4, desc: 'Sixteen leaders and counting. Hold your rank to the final count.',
                tips: [['Your org chart is the fastest path.', 'Every Platinum Champion on the board brought their own leaders.'], ['Ask to speak.', 'Your association, your mastermind, your forum. One room, several leaders.'], ['Rank decides the Studio.', 'Hold your rank to the final count to be eligible.']] }
  };
  var dlg = $('lv');
  function openLv(key) {
    var d = LV[key]; if (!d || !dlg) return;
    var need = COINS[d.i - 1][1], k = key;
    $('lvTop').className = 'cb-modal-top is-' + k;
    $('lvNum').textContent = need;
    $('lvReq').textContent = need + (k === 'platinum' ? '+' : '') + ' IMPACTS · COIN ' + d.i + ' OF 4';
    $('lvName').textContent = d.coin;
    $('lvDesc').textContent = d.desc;
    all('[data-lv-num]', dlg).forEach(function (n) { n.className = 'cb-step-num is-' + k; });
    d.tips.forEach(function (t, i) { dlg.querySelector('[data-lv-t="' + i + '"]').textContent = t[0]; dlg.querySelector('[data-lv-c="' + i + '"]').textContent = t[1]; });
    $('lvWho').textContent = 'At ' + d.coin + ' now';
    var seen = {}, ppl = [];
    all('[data-slot="faces-' + k + '"] .w-dyn-item').forEach(function (it) {
      var im = it.querySelector('img'), nm = im && im.getAttribute('alt'), tm = it.querySelector('[data-i="team"]');
      if (im && ppl.length < 3) ppl.push([im.currentSrc || im.src, nm || '', tm ? tm.textContent.trim() : '']);
    });
    $('lvPeople').setAttribute('data-coin', d.coin);
    $('lvPeople').innerHTML = ppl.map(function (p) { return '<div class="cb-person"><div class="cb-person-frame"><img class="cb-person-face" src="' + esc(p[0]) + '" alt="' + esc(p[1]) + '" loading="lazy"></div><div class="cb-person-name">' + esc(p[1]) + '</div>' + (p[2] ? '<div class="cb-person-team">' + esc(p[2]) + '</div>' : '') + '</div>'; }).join('') +
      '<div class="cb-person-open">Your seat<br>is open</div>';
    lastFocus = document.activeElement;
    dlg.classList.add('is-open'); document.documentElement.classList.add('cb-lock');
    requestAnimationFrame(function () { requestAnimationFrame(function () { dlg.classList.add('is-shown'); $('lvX').focus({ preventScroll: true }); }); });
  }
  var lastFocus = null;
  function closeLv() {
    if (!dlg || !dlg.classList.contains('is-open')) return;
    dlg.classList.remove('is-shown');
    setTimeout(function () { dlg.classList.remove('is-open'); document.documentElement.classList.remove('cb-lock'); if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true }); }, 250);
  }
  all('[data-lv]').forEach(function (c) { c.addEventListener('click', function (e) { if (e.target.closest('a[href]:not([href="#"])')) return; e.preventDefault(); openLv(c.getAttribute('data-lv')); }); });
  if (dlg) {
    $('lvX').addEventListener('click', function (e) { e.preventDefault(); closeLv(); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) closeLv(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeLv(); });
  }

  // ---------- Champion Friday: a drawn waveform (the real clip comes from the Champion's phone) ----------
  (function () {
    var w = $('wave'); if (!w) return;
    var h = '';
    for (var i = 0; i < 64; i++) h += '<i class="cb-wave-bar' + (i < 27 ? ' is-played' : '') + '" style="height:' + Math.round(18 + Math.abs(Math.sin(i * 1.7)) * 26) + 'px"></i>';
    w.innerHTML = h;
  })();

  // ---------- questions ----------
  all('[data-qa]').forEach(function (qa) {
    qa.querySelector('.cb-qa-q').addEventListener('click', function (e) {
      e.preventDefault();
      var open = !qa.classList.contains('is-open');
      qa.classList.toggle('is-open', open);
      qa.querySelector('.cb-qa-a').classList.toggle('is-open', open);
      var ic = qa.querySelector('.cb-qa-icon'); ic.classList.toggle('is-open', open); ic.textContent = open ? '−' : '+';
      this.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });

  // ---------- WHERE YOU STAND ----------
  // The Champion's referral ID arrives in the URL; it is also the slug of their Champions item.
  var REF_IN = ['id', 'ID', 'ref', 'rid', 'cid'], REF_OUT = 'ref';
  var qs = new URLSearchParams(location.search), refId = null, signedIn = false;
  REF_IN.forEach(function (k) { if (!refId && qs.get(k)) refId = qs.get(k).trim(); });
  function st(k) { return document.querySelector('[data-st="' + k + '"]'); }
  function standLinks(inside) {
    all('[data-stand-link]').forEach(function (a) {
      a.setAttribute('href', inside ? '#stand' : '#link');
      if (!a.hasAttribute('data-label')) a.setAttribute('data-label', a.firstChild.nodeValue);
      a.firstChild.nodeValue = inside ? a.getAttribute('data-label') : 'Sign in to see where you stand ';
    });
  }
  function fillStand(f) {
    var rank = +f.rank || 0, imp = +f.impacts || 0, move = +f.move || 0, nm = f.name || f['first-name'] || '';
    me = { rank: rank, imp: imp };
    $('stChipName').textContent = nm;
    var ci = $('stChipImg') || $('stchipimg'); // Webflow lowercases ids set on images
    if (ci && f.photo && !isOpenSeat(f.photo)) { ci.src = f.photo; ci.removeAttribute('srcset'); ci.alt = nm; ci.style.display = ''; } else if (ci) { ci.src = PH; ci.removeAttribute('srcset'); ci.style.display = ''; }
    st('rank').textContent = rank;
    st('move').textContent = move > 0 ? '▲ ' + move : 'Holding';
    st('impacts').textContent = imp;
    var n = nextCoin(imp), have = coinFor(imp);
    if (n) {
      var togo = n[1] - imp;
      st('next').textContent = n[0]; st('next').setAttribute('data-coin', n[0]);
      st('togo').textContent = togo;
      st('next-line').hidden = false;
      st('say').textContent = f.status || (have ? plural(togo, 'more leader') + ' to ' + n[0] + '.' : (togo === 1 ? 'One more leader to get your first coin!' : plural(togo, 'more leader') + ' to get your first coin!'));
    } else {
      st('next-line').hidden = true;
      st('say').textContent = f.status || 'Platinum. Hold your rank to the final count.';
    }
    // Bars: each coin fills over its own stretch (Copper 0-2, Silver 2-4, Gold 4-8, Platinum 8-16)
    var lo = 0;
    COINS.forEach(function (c) {
      var pct = Math.max(0, Math.min(1, (imp - lo) / (c[1] - lo)));
      document.querySelector('[data-bar="' + c[0] + '"]').style.width = Math.round(pct * 100) + '%';
      document.querySelector('[data-bar-label="' + c[0] + '"]').classList.toggle('is-on', imp >= lo && (imp < c[1] || c[0] === have));
      lo = c[1];
    });
  }
  function loadStand(ref) {
    return fetch('/champion-data/' + encodeURIComponent(ref.toLowerCase()), { credentials: 'same-origin' }).then(function (r) { if (!r.ok) throw r.status; return r.text(); }).then(function (h) {
      var doc = new DOMParser().parseFromString(h, 'text/html'), f = {};
      doc.querySelectorAll('[data-f]').forEach(function (e) { f[e.getAttribute('data-f')] = e.textContent.trim(); });
      var ph = doc.querySelector('img[data-f="photo"]'); f.photo = ph && !ph.classList.contains('w-dyn-bind-empty') ? ph.getAttribute('src') : '';
      if (!f.rank) throw 'empty';
      return f;
    });
  }
  function setSignedIn(on) {
    signedIn = on;
    $('stand').hidden = !on;
    standLinks(on);
    refNote();
    var o = document.querySelector('[data-opt].is-on'); pick(o ? o.getAttribute('data-opt') : 'audio');
    if (on && ALL) render(search ? search.value : '');
  }
  $('stand').hidden = true; standLinks(false);
  if (refId) loadStand(refId).then(function (f) { refId = f['champion-id'] || refId; fillStand(f); setSignedIn(true); }, function () { refId = null; setSignedIn(false); });
  var linkRef = function () { return refId || 'DEMO123'; };
  // Spiffy credits referred sales by utm_content = Champion ID
  function withRef(u) { try { var x = new URL(u, location.href); x.searchParams.set(REF_OUT, linkRef()); x.searchParams.set('utm_content', linkRef()); return x.toString(); } catch (e) { return u; } }
  function refNote() { $('refNote').innerHTML = 'Your referral ID: <span class="cb-code">' + esc(linkRef()) + '</span>. Every link here carries it.'; }

  // ---------- LINK HUB ----------
  var OPTS = {
    audio:  { name: 'The Compound Effect', url: 'https://www.thecompoundeffect.com/champion-audiobook', subject: 'A gift: The Compound Effect, 10th Anniversary Edition',
              msg: function (l) { return "This is the book I tell everyone about. The Compound Effect by Darren Hardy, the 10th Anniversary Edition, the hardcover and the audiobook, on me.\n\nGrab it here: " + l + "\n\nListen to the first chapter tonight."; } },
    event:  { name: 'The Founders Event', url: 'https://www.thecompoundeffect.com/founders-event', subject: 'You came to mind for this',
              msg: function (l) { return "I don't send many of these.\n\nDarren Hardy is holding his Founders Event this April, live, for leaders building their companies with The Compound Effect In Business. I'm going, and you're the first person I thought of.\n\nI've seen what a few days with Darren does for a company. It's the clearest my thinking gets all year, and my team feels it for months.\n\nTake a look: " + l + "\n\nIf it's a fit, I'd love to have you there with me."; } },
    leader: { name: 'Enroll a leader', url: 'https://www.thecompoundeffect.com/founders-event#enroll', subject: 'You are enrolled: the Founders Event',
              msg: function (l) { return "I've enrolled you in Darren Hardy's Founders Event in April. Here's where to complete your enrollment: " + l + "\n\nSee you there."; } }
  };
  var opts = all('[data-opt]'), linkEl = $('refLink'), msgEl = $('refMsg');
  function count() { $('msgCount').textContent = plural(msgEl.value.length, 'character'); }
  msgEl.addEventListener('input', count);
  function pick(key) {
    var o = OPTS[key], l = withRef(o.url), m = o.msg(l);
    opts.forEach(function (b) {
      var on = b.getAttribute('data-opt') === key, tag = b.querySelector('[data-opt-tag]');
      b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', on ? 'true' : 'false');
      if (tag) { tag.classList.toggle('is-on', on); tag.textContent = on ? 'SELECTED' : 'CHOOSE'; }
    });
    var enrolling = key === 'leader';
    $('sharePane').hidden = enrolling || !signedIn;
    $('enrollPane').hidden = !enrolling || !signedIn;
    $('signPane').hidden = signedIn;
    $('linkLabel').textContent = 'Your link · ' + o.name;
    linkEl.textContent = l; msgEl.value = m; count();
    $('refOpen').href = l;
    $('refMail').href = 'mailto:?subject=' + encodeURIComponent(o.subject) + '&body=' + encodeURIComponent(m);
    $('refSms').href = 'sms:?&body=' + encodeURIComponent(m);
  }
  ['refMail', 'refSms', 'refOpen'].forEach(function (id) { $(id).setAttribute('data-own', ''); });
  opts.forEach(function (b) { b.addEventListener('click', function (e) { e.preventDefault(); pick(b.getAttribute('data-opt')); if (innerWidth <= 767) setTimeout(function () { go('hubOut'); }, 60); }); });
  function selectCopy(el) { if (el.select) el.select(); else { var r = document.createRange(); r.selectNodeContents(el); var sl = getSelection(); sl.removeAllRanges(); sl.addRange(r); } document.execCommand('copy'); }
  all('[data-copy]').forEach(function (b) {
    b.addEventListener('click', function (e) {
      e.preventDefault();
      var el = $(b.getAttribute('data-copy')), label = b.textContent, val = 'value' in el ? el.value : el.textContent;
      function done() { b.textContent = 'Copied'; setTimeout(function () { b.textContent = label; }, 1600); }
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(val).then(done, function () { selectCopy(el); done(); });
      else { selectCopy(el); done(); }
    });
  });

  // Enroll a leader: covered by a seat credit (portal) or a new seat (checkout). PORTAL_URL is blank until the portal exists.
  var PORTAL_URL = '';
  var ef = $('enrollPane'), eGo = $('enrollGo'), pays = all('[data-pay]', ef), pay = 'credit';
  function setPay(v) {
    pay = v;
    pays.forEach(function (x) { var on = x.getAttribute('data-pay') === v; x.classList.toggle('is-on', on); x.setAttribute('aria-checked', on ? 'true' : 'false'); });
    eGo.innerHTML = (v === 'credit' ? 'Go to the portal to enroll them' : 'Continue to secure checkout') + ' <span>&rarr;</span>';
  }
  pays.forEach(function (x) { x.addEventListener('click', function (e) { e.preventDefault(); setPay(x.getAttribute('data-pay')); }); });
  function enroll(e) {
    if (e) e.preventDefault();
    if (pay === 'credit' && PORTAL_URL) { window.open(withRef(PORTAL_URL), '_blank', 'noopener'); return; }
    var f1 = $('enFirst').value.trim(), ln = $('enLast').value.trim(), em = $('enEmail').value.trim(), ok = !!f1 && !!ln && /\S+@\S+\.\S+/.test(em);
    $('enrollErr').hidden = ok;
    if (!ok) return;
    if (pay === 'invest') { window.open(withRef(OPTS.leader.url), '_blank', 'noopener'); return; }
    $('enrollWho').textContent = f1 + ' ' + ln;
    $('enrollDone').hidden = false;
  }
  all('.cb-field', ef).forEach(function (i) { i.addEventListener('keydown', function (e) { if (e.key === 'Enter') enroll(e); }); });
  eGo.addEventListener('click', enroll);

  // SIGN IN BY EMAIL: /champion-key/<first 40 hex of sha256(lowercased email)> holds the Champion ID.
  var signErr = $('signErr'), signFine = $('signFine'), signGo = $('signGo'), busy = false;
  function signMsg(html) { signErr.innerHTML = html; signErr.hidden = !html; signFine.hidden = !!html; }
  function emailKey(em) {
    return crypto.subtle.digest('SHA-256', new TextEncoder().encode(em.trim().toLowerCase())).then(function (b) {
      return Array.prototype.map.call(new Uint8Array(b), function (x) { return ('0' + x.toString(16)).slice(-2); }).join('').slice(0, 40);
    });
  }
  function refFor(em) {
    return emailKey(em).then(function (k) { return fetch('/champion-key/' + k, { credentials: 'same-origin' }); }).then(function (r) { if (!r.ok) throw r.status; return r.text(); }).then(function (h) {
      var el = new DOMParser().parseFromString(h, 'text/html').querySelector('[data-f="ref"]'), ref = el && el.textContent.trim();
      if (!ref) throw 'empty';
      return ref;
    });
  }
  function signIn(e) {
    if (e) e.preventDefault();
    if (busy) return;
    var em = $('signEmail').value.trim();
    if (!/\S+@\S+\.\S+/.test(em)) { signMsg('Enter the email you use for the Champion Program.'); return; }
    signMsg(''); busy = true;
    refFor(em).then(function (ref) { return loadStand(ref).then(function (f) {
      refId = f['champion-id'] || ref; fillStand(f); setSignedIn(true);
      try { var u = new URL(location.href); u.searchParams.set('id', ref); history.replaceState(null, '', u); } catch (x) {}
    }); }).catch(function () {
      signMsg('Sorry, we couldn\'t find you today. Please contact Member Services to get your unique referral links. <a href="mailto:helpme@darrenhardy.com?subject=I%20can%27t%20access%20my%20referral%20link" style="color:inherit;text-decoration:underline;text-underline-offset:3px">Email us directly here.</a>');
    }).then(function () { busy = false; });
  }
  $('signEmail').addEventListener('keydown', function (e) { if (e.key === 'Enter') signIn(e); });
  signGo.addEventListener('click', signIn);

  refNote();
  pick('audio');
  all('a[data-ref]').forEach(function (a) { a.href = withRef(a.getAttribute('href')); });
})();
