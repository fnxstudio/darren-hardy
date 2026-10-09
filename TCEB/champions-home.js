/* =============================================================================
   CHAMPIONS HOME (TCEB) — page script
   -----------------------------------------------------------------------------
   Hooks are ids and data-* attributes only, never style classes, so the Designer
   classes can be renamed freely. Rendered markup uses the champ-* classes from
   champions-home.css (Part B).

   Launch switches (search for them):
     PROMO_LIVE   nav shows the promo clock + "Add a seat"; false = "Get my link"
     HP_ONCE      takeover once per visit (true for launch; false while testing)
     REF_IN/OUT   referral param names (waiting on the real HubSpot field name)
   ============================================================================= */
(function () {
  var P = 'img/champions-home/';
  // Sample standings: real alumni faces as stand-ins; names, ranks and numbers invented for layout.
  var B = [
    ['taylor','Taylor Richardson','Leadership team of 6',18],['jeannie','Jeannie Henderson','The GM, ops lead and 3 managers',15],['michael','Michael Kara','COO and 2 managers',13],
    ['lisac','Lisa Chase','13 named seats',13,4],['emeka','Emeka Ikechi','3 forum peers and the team',12],['maria','Maria Oliver','Practice partners',12],
    ['spencer','Spencer Ford','Leadership team of 5',12,2],['rebecca','Rebecca Jones','Partner and 4 managers',11],['gerald','Gerald Leonard','A mastermind group',11],
    ['derrick','Derrick Westbrook','The number two and the team',11,1],['kristi','Kristi Lopez','Association peers',11,6],['danm','Dan Mumm','Leadership team of 4',11]
  ];
  var $ = function (id) { return document.getElementById(id); };
  function img(k, alt, cls) { return '<img class="' + cls + '" src="' + P + k + '.webp" alt="' + (alt || '') + '" width="360" height="360">'; }
  function coin(n) { return n >= 10 ? 'plat' : n >= 5 ? 'gold' : n >= 3 ? 'silver' : 'copper'; }
  function faces(list) { return '<span class="champ-faces">' + list.map(function (k) { return img(k, '', 'champ-face'); }).join('') + '</span>'; }

  // Nav during a promo: ONE button. It becomes the promo action and the clock is info only.
  // Between promos set PROMO_LIVE = false: the clock hides and the button is Get my link.
  var PROMO_LIVE = true;
  (function () {
    var cta = $('navCta');
    if (PROMO_LIVE) { cta.innerHTML = 'Add a seat <span class="champ-arw">&rarr;</span>'; cta.setAttribute('data-enroll', ''); }
    else { document.querySelectorAll('[data-promo]').forEach(function (e) { e.style.display = 'none'; }); }
  })();

  // Hero deck: on small screens scale the desktop composition to fit
  function fitDeck() {
    var fit = $('deckFit'), d = $('deck');
    if (innerWidth > 960) { d.style.transform = ''; fit.style.height = ''; return; }
    var w = fit.clientWidth, sc = Math.min(1, w / 620);
    d.style.transform = 'translateX(' + Math.round((w - 540 * sc) / 2) + 'px) scale(' + sc.toFixed(4) + ')';
    fit.style.height = Math.round(570 * sc) + 'px';
  }
  addEventListener('resize', fitDeck);

  // Hero deck + live moments
  var deck = [[2,1],[1,0],[3,2]].map(function (a) { var r = B[a[1]];
    return '<div class="champ-pcard is-' + a[0] + '">' + img(r[0], r[1], 'champ-pcard-img') + '<span class="champ-pcard-rank">#' + (a[1] + 1) + '</span><div class="champ-pcard-name">' + r[1] + '</div><div class="champ-pcard-meta"><span>Impacts</span><b class="champ-pcard-score">' + r[3] + '</b></div></div>'; }).join('');
  deck += '<div class="champ-ping is-a"><img class="champ-ping-img" src="' + P + 'kristi.webp" alt=""><div><b class="champ-ping-b">Kristi Lopez just went Platinum</b><small class="champ-ping-small"><span class="champ-ping-up">▲ 6 spots</span> · 4 min ago</small></div></div>';
  deck += '<div class="champ-ping is-b"><img class="champ-ping-img is-small" src="' + P + 'spencer.webp" alt=""><div><b class="champ-ping-b">Spencer Ford</b><small class="champ-ping-small">Moved to #7 · 1 hr ago</small></div></div>';
  deck += '<div class="champ-ping is-c"><img class="champ-ping-img" src="' + P + 'lisag.webp" alt=""><div><b class="champ-ping-b">3 leaders joined Lisa Good today</b><small class="champ-ping-small">+3 impacts · now Silver</small></div></div>';
  $('deck').innerHTML = deck;
  fitDeck();

  // Podium 2, 1, 3
  $('podium').innerHTML = [1, 0, 2].map(function (i) { var r = B[i], n = i + 1;
    return '<div class="champ-pd is-' + n + '">' + img(r[0], r[1], 'champ-pd-img') + '<span class="champ-pd-rank is-' + n + '"><b class="champ-pd-num is-' + n + '">' + n + '</b></span><div class="champ-pd-name">' + r[1] + '</div><div class="champ-pd-bio">' + r[2] + '</div><div class="champ-pd-score">' + r[3] + '<small class="champ-pd-score-lab">IMPACTS</small></div></div>'; }).join('');
  $('tiles').innerHTML = [3,4,5,6,7,8,9,10].map(function (i) { var r = B[i];
    return '<div class="champ-tile"><span class="champ-tile-rank">' + (i + 1) + '</span>' + img(r[0], r[1], 'champ-tile-img') + '<span class="champ-tile-name">' + r[1] + (r[4] ? '<span class="champ-tile-move">▲' + r[4] + '</span>' : '') + '<small class="champ-tile-sub"><i class="champ-chip is-' + coin(r[3]) + '"></i>' + r[2] + '</small></span><span class="champ-tile-score">' + r[3] + '<small class="champ-tile-score-lab">IMPACTS</small></span></div>'; }).join('');

  // Full standings: everyone on the board, ranked. Rows past #12 are placeholder names.
  var MORE = [['Rachel Monroe',10],['Marcus Bell',10],['Dana Whitfield',10],['Chris Alvarez',10],['Priya Nair',10],['Tom Kessler',10],['Hannah Brooks',10],['Victor Lane',10],['Jenna Ortiz',10],['Brian Cho',10],['Alicia Grant',10],['Owen Pierce',10],['Sofia Reyes',10],
              ['Grant Hollis',9],['Megan Shaw',9],['Luis Duarte',8],['Kara Lindqvist',8],['Nate Fowler',7],['Tasha Greene',7],['Ben Okafor',6],['Laura Kim',6],['Eric Vaughn',5],['Mia Castillo',5],['Paul Jensen',4],['Renee Watts',4],['Sam Delgado',3],['Ivy Thornton',3],['Josh Mercer',2],['Claire Dunn',1],['Andre Pollard',1]];
  var ALL = B.map(function (r) { return [r[1], r[3]]; }).concat(MORE);
  var coinName = { plat: 'Platinum', gold: 'Gold', silver: 'Silver', copper: 'Copper' };
  $('fullList').innerHTML = ALL.map(function (r, i) {
    var c = coin(r[1]);
    return '<li class="champ-full-row"><span class="champ-full-rank' + (i < 5 ? ' is-top' : '') + '">' + (i + 1) + '</span><span class="champ-full-name">' + r[0] + '</span><span class="champ-full-coin"><i class="champ-chip is-' + c + '"></i>' + coinName[c] + '</span><span class="champ-full-imp">' + r[1] + '</span></li>' + (i === 24 ? '<li class="champ-full-line">The Studio Line</li>' : '');
  }).join('');
  var fullBtn = $('fullBtn'), full = $('full');
  fullBtn.addEventListener('click', function () {
    var open = full.hasAttribute('hidden');
    if (open) { full.removeAttribute('hidden'); full.classList.add('is-open'); } else { full.setAttribute('hidden', ''); full.classList.remove('is-open'); }
    fullBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    fullBtn.innerHTML = open ? 'Hide full standings <span class="champ-arw">&uarr;</span>' : 'Full standings <span class="champ-arw">&darr;</span>';
  });

  // How to win: the climb (five stacked cards) and the two rewards
  var W = [
    ['lead','','Start here','Your link','Send it to the leader you want next to you in April. Every one who joins compounds your impact.',null,''],
    ['copper','1','Copper','1 impact','Your numbered Copper coin and a handwritten note from Darren naming your leader.',['dant','mike','david'],'86 here now'],
    ['silver','3','Silver','3 impacts','The Silver coin and <span class="champ-ph">[reward]</span>.',['thomas','angelina','lisag'],'41 here now'],
    ['gold','5','Gold','5 impacts','The Gold coin and <span class="champ-ph">[reward]</span>.',['suzanne','zach','antonia'],'56 here now'],
    ['plat','10','Platinum','10+ impacts',"The Platinum coin. You're a Studio Contender.",['kristi','danm','derrick'],'31 here now'],
    ['studio','25','In the Studio','Top 25 with 10+','Three days live with Darren. Earned at the final count.',['?','?','?'],'25 seats'],
    ['table','5',"Darren's Table",'Top 5','A private dinner with Darren and Georgia. Earned at the final count.',['?','?','?'],'5 places']
  ];
  function card(c) {
    var lead = c[0] === 'lead';
    return '<a class="champ-wcard is-' + c[0] + '" href="#win" data-lv="' + c[0] + '"><div>' + (c[1] ? '<div class="champ-wcard-n">' + c[1] + '</div>' : '') + '<h3 class="champ-wcard-title' + (lead ? ' is-lead' : '') + '">' + c[2] + '</h3><div class="champ-wcard-req">' + c[3] + '</div><p class="champ-wcard-p">' + c[4] + '</p></div>' +
      (c[5] ? '<div class="champ-here">' + faces(c[5]) + '<span class="champ-here-count">' + c[6] + '</span></div>' : '<span class="champ-btn is-solid is-card">Get my link <span class="champ-arw">→</span></span>') + '</a>';
  }
  function prize(c) {
    var v = ' is-' + c[0];
    return '<a class="champ-reward' + v + '" href="#win" data-lv="' + c[0] + '"><span class="champ-reward-tag' + v + '">&#9733; Reward</span><h3 class="champ-reward-title' + v + '">' + c[2] + '</h3><div class="champ-reward-req">' + c[3] + ' at the final count</div><p class="champ-reward-p">' + c[4].replace(' Earned at the final count.', '') + '</p><span class="champ-reward-count">' + c[6] + '</span><span class="champ-reward-ph' + v + '">Placeholder<br>image</span></a>';
  }
  $('rail').innerHTML =
    '<div class="champ-rgroup"><div class="champ-rlab">The climb</div><div class="champ-steps-fit" id="stepsFit"><div class="champ-rail-steps" id="railSteps">' + W.slice(0, 5).map(card).join('') + '</div></div></div>' +
    '<div class="champ-rail-arrow" aria-hidden="true">&rarr;</div>' +
    '<div class="champ-rgroup is-prize"><div class="champ-rlab is-prize">The reward</div><div class="champ-rail-prize">' + prize(W[5]) + prize(W[6]) + '</div></div>';

  // Champion Friday: a fake waveform (the real clip comes from the Champion's phone recording)
  (function () {
    var h = '';
    for (var i = 0; i < 48; i++) {
      var a = (0.18 + Math.abs(Math.sin(i * 0.7)) * 0.5).toFixed(2), b = (0.3 + Math.abs(Math.cos(i * 1.3)) * 0.7).toFixed(2);
      h += '<i class="champ-wave-bar' + (i < 18 ? ' is-played' : '') + '" style="--a:' + a + ';--b:' + b + ';animation-delay:-' + (i * 0.07).toFixed(2) + 's"></i>';
    }
    $('wave').innerHTML = h;
  })();

  // The climb: on small screens scale the whole five-card stack to fit one row (no side scroll)
  function fitSteps() {
    var fit = $('stepsFit'), st = $('railSteps');
    if (!fit) return;
    if (innerWidth > 1100) { st.style.transform = ''; fit.style.height = ''; return; }
    var sc = Math.min(1, fit.clientWidth / 768);
    st.style.transform = 'scale(' + sc.toFixed(4) + ')';
    fit.style.height = Math.round((st.offsetHeight) * sc) + 'px';
  }
  fitSteps(); addEventListener('resize', fitSteps);

  // Level pop-up: more info, tips, and who's there now
  var NM = {}; B.forEach(function (r) { NM[r[0]] = r[1]; });
  [['suzanne','Suzanne Grady'],['zach','Zach Holmes'],['antonia','Antonia Roybal-Mack'],['thomas','Thomas Petersen'],['angelina','Angelina Feichko'],['lisag','Lisa Good'],['emily','Emily Weber'],['louis','Louis Richard'],['david','David Koepsell'],['mike','Mike Keesee'],['dant','Dan Tripp']].forEach(function (v) { NM[v[0]] = v[1]; });
  var TOP = ['taylor','jeannie','michael','lisac','emeka','maria','spencer','rebecca','gerald','derrick','kristi','danm'];
  var LV = {
    lead:   { tips: ['<b>Get your link.</b> It is yours alone, and every leader who joins through it is credited to you.', '<b>Write down three names.</b> Your number two, the leader in your forum, the one you call when something breaks.', '<b>Send one text today.</b> Your kit has it written. Add one line in your own words.'],
              who: 'Champions on the board', people: TOP, more: '214 Champions and counting' },
    copper: { tips: ['<b>Start with the leader closest to you.</b> Your number two is the easiest first yes on the board.', '<b>Investing for your own team?</b> Enroll each leader and every one shows on your board.', '<b>Your first impact is the hardest one.</b> Your Copper coin and a note from Darren follow it.'],
              who: 'At Copper now', people: ['louis','mike','david','dant'], more: '+ 80 more Champions at Copper' },
    silver: { tips: ['<b>Bring them as a team.</b> Two leaders from the same company is two impacts in one conversation.', '<b>Use the Challenge.</b> Leaders who spend three days with Darren in December say yes to April.', '<b>Follow up personally.</b> A two-line text a week later turns maybes into yeses.'],
              who: 'At Silver now', people: ['thomas','angelina','lisag'], more: '+ 35 more Champions at Silver' },
    gold:   { tips: ['<b>Think past your company.</b> A key vendor, a client, a partner. The relationship is already there.', '<b>A spouse or business partner counts.</b> Same language at home and at work.', '<b>Watch the moments.</b> Hardy Harvest: add a seat this week and Darren sends the Harvest kit.'],
              who: 'At Gold now', people: ['suzanne','zach','antonia'], more: '+ 50 more Champions at Gold' },
    plat:   { tips: ['<b>Your org chart is the fastest path.</b> Every Platinum Champion on the board brought their own leaders.', '<b>Ask to speak.</b> Your association, your mastermind, your forum. One room, several leaders.', '<b>Ten makes you a Studio Contender.</b> From there, rank decides who goes In the Studio.'],
              who: 'At Platinum now', people: TOP, more: '+ 19 more Champions at Platinum' },
    studio: { tips: ['<b>Reach Platinum first.</b> Only Champions with 10 or more impacts are in the running.', '<b>Then climb.</b> The top 25 at the final count earn three days In the Studio with Darren.', '<b>Ties go to whoever got there first.</b> Seats 26 to 42 open only if Champions earn them.'],
              who: 'Awarded at the final count', people: ['?','?','?','?','?','?'], more: 'Seats are earned at the final count. Nothing is left to chance.' },
    table:  { tips: ['<b>Finish top five.</b> Rank at the final count decides it.', '<b>Bring your whole leadership team.</b> Every Champion at the top so far did.', '<b>Keep going after Platinum.</b> The top five are separated by a handful of leaders.'],
              who: 'Awarded at the final count', people: ['?','?','?','?','?'], more: 'Five places, earned at the final count.' }
  };
  var dlg = $('lv'), lvTop = $('lvTop');
  function openLv(card) {
    var key = card.getAttribute('data-lv'), d = LV[key], c = W.filter(function (w) { return w[0] === key; })[0];
    lvTop.className = 'champ-lv-top is-' + key;
    $('lvTitle').textContent = c[2];
    $('lvReq').textContent = c[3];
    $('lvDesc').innerHTML = c[4];
    $('lvTips').innerHTML = d.tips.map(function (t) { return '<li class="champ-lv-tip">' + t + '</li>'; }).join('');
    $('lvWhoH').textContent = d.who;
    $('lvGrid').innerHTML = d.people.map(function (k) { return k === '?' ? '<div class="champ-lv-person"><span class="champ-lv-face is-q">?</span><span class="champ-lv-name">You?</span></div>' : '<div class="champ-lv-person">' + img(k, NM[k], 'champ-lv-face') + '<span class="champ-lv-name">' + (NM[k] || '') + '</span></div>'; }).join('');
    $('lvMore').textContent = d.more;
    var r = card.getBoundingClientRect();
    dlg.style.setProperty('--from', 'translate(' + Math.round(r.left + r.width / 2 - innerWidth / 2) + 'px,' + Math.round(r.top + r.height / 2 - innerHeight / 2) + 'px)');
    dlg.classList.remove('is-open');
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
    requestAnimationFrame(function () { requestAnimationFrame(function () { dlg.classList.add('is-open'); }); });
  }
  function closeLv() { dlg.classList.remove('is-open'); setTimeout(function () { if (dlg.close) dlg.close(); else dlg.removeAttribute('open'); }, 280); }
  // Phones have no hover: the stack lifts one card at a time on its own; a tap pulls that card out, a second tap opens it
  var wc = [].slice.call($('railSteps').querySelectorAll('[data-lv]')), li = 0, auto = null;
  function lift(c) { wc.forEach(function (x) { x.classList.toggle('is-lift', x === c); }); }
  if (innerWidth <= 1100) auto = setInterval(function () { li = (li + 1) % wc.length; lift(wc[li]); }, 1700);
  $('rail').addEventListener('click', function (e) {
    var card = e.target.closest('[data-lv]'); if (!card) return; e.preventDefault();
    if (innerWidth <= 1100 && wc.indexOf(card) > -1) { clearInterval(auto); if (!card.dataset.tapped) { lift(card); wc.forEach(function (x) { delete x.dataset.tapped; }); card.dataset.tapped = 1; return; } }
    if (card.getAttribute('data-lv') === 'lead') { $('link').scrollIntoView({ behavior: 'smooth' }); return; }
    openLv(card);
  });
  $('lvX').addEventListener('click', closeLv);
  dlg.addEventListener('click', function (e) { if (e.target === dlg || e.target.closest('#lvCta a')) closeLv(); });
  dlg.addEventListener('cancel', function (e) { e.preventDefault(); closeLv(); });

  // Walls: the Platinum Circle and this month's new coins
  $('wallPlat').innerHTML = B.map(function (r, i) { return '<div class="champ-wf"><div class="champ-wf-pic">' + img(r[0], r[1], 'champ-wf-img') + '<span class="champ-wf-badge">#' + (i + 1) + '</span></div><b class="champ-wf-name">' + r[1] + '</b><span class="champ-wf-role">' + r[2] + '</span></div>'; }).join('');
  var nw = [['suzanne','Suzanne Grady','gold',7],['zach','Zach Holmes','gold',6],['antonia','Antonia Roybal-Mack','gold',5],['thomas','Thomas Petersen','silver',4],['angelina','Angelina Feichko','silver',3],
            ['lisag','Lisa Good','silver',3],['louis','Louis Richard','copper',2],['mike','Mike Keesee','copper',2],['david','David Koepsell','copper',1],['dant','Dan Tripp','copper',1]];
  $('wallNew').innerHTML = nw.map(function (p) { return '<div class="champ-wf"><div class="champ-wf-pic is-small is-' + p[2] + '">' + img(p[0], p[1], 'champ-wf-img') + '</div><b class="champ-wf-name is-small">' + p[1] + '<span class="champ-wf-count"><i class="champ-chip is-' + p[2] + ' is-count"></i>' + p[3] + '</span></b></div>'; }).join('');

  // Hardy Harvest: this mock pretends today is Wed., Nov 11th, mid-promo. Ends Thurs., Nov 12th, 11:59 pm ET.
  var hvEnd = new Date('2026-11-13T04:59:00Z'), simStart = new Date('2026-11-11T19:00:00Z'), realStart = Date.now();
  function tick() {
    var left = Math.max(0, hvEnd - (simStart.getTime() + (Date.now() - realStart)));
    var h = Math.floor(left / 36e5), m = Math.floor(left % 36e5 / 6e4), sec = Math.floor(left % 6e4 / 1e3);
    document.querySelectorAll('[data-h-mini]').forEach(function (e) { e.textContent = h; });
    document.querySelectorAll('[data-hhms]').forEach(function (e) { e.textContent = h + ':' + String(m).padStart(2, '0') + ':' + String(sec).padStart(2, '0'); });
    document.querySelectorAll('[data-cd]').forEach(function (c) {
      c.querySelector('[data-h]').textContent = String(h).padStart(2, '0');
      c.querySelector('[data-m]').textContent = String(m).padStart(2, '0');
      c.querySelector('[data-s]').textContent = String(sec).padStart(2, '0');
    });
  }
  tick(); setInterval(tick, 1000);
  var hp = $('hpop');
  function hpOpen() { if (hp.showModal) hp.showModal(); else hp.setAttribute('open', ''); setTimeout(function () { hp.classList.add('is-open'); }, 30); }
  function hpClose() { hp.classList.remove('is-open'); setTimeout(function () { if (hp.close) hp.close(); else hp.removeAttribute('open'); }, 320); }
  // TESTING: show the pop-up on every page load. For launch, set HP_ONCE = true to show it once per visit.
  var HP_ONCE = false, seen = false;
  if (HP_ONCE) { try { seen = sessionStorage.getItem('hv-pop') === '1'; } catch (e) {} }
  if (!seen) setTimeout(function () { hpOpen(); if (HP_ONCE) { try { sessionStorage.setItem('hv-pop', '1'); } catch (e) {} } }, 3000);
  $('hpopX').addEventListener('click', hpClose);
  $('hpopLater').addEventListener('click', hpClose);
  $('hpopGo').addEventListener('click', hpClose);
  hp.addEventListener('click', function (e) { if (e.target === hp) hpClose(); });
  hp.addEventListener('cancel', function (e) { e.preventDefault(); hpClose(); });

  // LINK HUB. The Champion's referral ID arrives in the URL from their HubSpot email.
  // TODO: confirm the real HubSpot param name with the team; these are the names it accepts for now.
  var REF_IN = ['id', 'ID', 'ref', 'rid', 'cid'], REF_OUT = 'ref';
  var qs = new URLSearchParams(location.search), refId = null;
  REF_IN.forEach(function (k) { if (!refId && qs.get(k)) refId = qs.get(k).trim(); });
  // No ID in the URL = signed out: hide "Where you stand" (we don't know who they are) and gate the link behind a sign-in (demo only).
  var signedIn = !!refId; if (!signedIn) refId = 'DEMO123';
  var fn = (qs.get('fn') || qs.get('firstname') || qs.get('name') || '').trim().split(/\s+/)[0];
  var standLinks = document.querySelectorAll('[data-stand-link]');
  function standCopy(inside) { standLinks.forEach(function (a) { a.href = inside ? '#stand' : '#link'; a.firstChild.textContent = inside ? 'Where do I stand? ' : 'Sign in to see where you stand '; }); }
  if (!signedIn) { $('stand').hidden = true; standCopy(false); }
  if (fn) $('stName').textContent = ' · ' + fn.replace(/[<>&"]/g, '');
  function withRef(u) { try { var x = new URL(u, location.href); x.searchParams.set(REF_OUT, refId); return x.toString(); } catch (e) { return u; } }
  function refNote() { $('refNote').innerHTML = 'Your referral ID: <code class="champ-hub-code">' + refId.replace(/[<>&"]/g, '') + '</code>. Every link above carries it.'; }
  var OPTS = {
    event:  { url: 'https://fnxstudio.github.io/darren-hardy/TCEB/founders-event.html', subject: 'You came to mind for this',
              msg: function (l) { return "I don't send many of these.\n\nDarren Hardy is holding his Founders Event this April, live, for leaders building their companies with The Compound Effect in Business. I'm going, and you're the first person I thought of.\n\nI've seen what a few days with Darren does for a company. It's the clearest my thinking gets all year, and my team feels it for months.\n\nTake a look: " + l + "\n\nIf it's a fit, I'd love to have you there with me."; } },
    audio:  { url: 'https://www.thecompoundeffect.com/free-audiobook', subject: 'A gift: The Compound Effect, 10th Anniversary Edition',
              msg: function (l) { return "This is the book I tell everyone about. The Compound Effect by Darren Hardy, the 10th Anniversary Edition, audiobook and ebook, on me.\n\nGrab it here: " + l + "\n\nListen to the first chapter tonight."; } },
    leader: { url: 'https://fnxstudio.github.io/darren-hardy/TCEB/founders-event.html#enroll', subject: 'You are enrolled: the Founders Event',
              msg: function (l) { return "I've enrolled you in Darren Hardy's Founders Event in April. Here's where to complete your enrollment: " + l + "\n\nSee you there."; } }
  };
  var opts = document.querySelectorAll('[data-opt]'), linkEl = $('refLink'), msgEl = $('refMsg');
  function pick(key) {
    var o = OPTS[key], l = withRef(o.url), m = o.msg(l);
    opts.forEach(function (b) { b.classList.toggle('is-on', b.getAttribute('data-opt') === key); });
    var enrolling = key === 'leader';
    $('sharePane').hidden = enrolling || !signedIn;
    $('enrollPane').hidden = !enrolling || !signedIn;
    $('signPane').hidden = signedIn;
    linkEl.value = l; msgEl.value = m;
    $('refOpen').href = l;
    $('refMail').href = 'mailto:?subject=' + encodeURIComponent(o.subject) + '&body=' + encodeURIComponent(m);
    $('refSms').href = 'sms:?&body=' + encodeURIComponent(m);
  }
  opts.forEach(function (b) { b.addEventListener('click', function () { pick(b.getAttribute('data-opt'));
    // Phones: the options stack above the link, so jump down to it
    if (innerWidth <= 900) setTimeout(function () { $('hubOut').scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 60); }); });
  // "Add a seat" buttons open the Enroll tab with a new seat pre-selected.
  document.querySelectorAll('[data-enroll]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      pick('leader');
      var inv = $('enrollPane').querySelector('input[value=invest]'); inv.checked = true; inv.dispatchEvent(new Event('change'));
      setTimeout(function () { $('link').scrollIntoView({ behavior: 'smooth' }); }, 340);
    });
  });
  // Enroll a leader: the Champion covers the seat with a credit or a new investment. Mock only; this becomes the real checkout/HubSpot form.
  var ef = $('enrollPane'), eGo = $('enrollGo'), pays = ef.querySelectorAll('input[name=pay]');
  pays.forEach(function (r) {
    r.addEventListener('change', function () {
      pays.forEach(function (x) { x.parentNode.classList.toggle('is-on', x.checked); });
      eGo.innerHTML = (r.value === 'credit' && r.checked ? 'Enroll them with my credit' : 'Continue to secure checkout') + ' <span class="champ-arw">&rarr;</span>';
    });
  });
  ef.addEventListener('submit', function (e) {
    e.preventDefault();
    var n = ef.elements['name'].value.trim(), em = ef.elements['email'].value.trim(), ok = n.split(/\s+/).length > 1 && /\S+@\S+\.\S+/.test(em);
    $('enrollErr').hidden = ok;
    if (!ok) return;
    if (ef.elements['pay'].value === 'invest') { window.open(withRef('https://fnxstudio.github.io/darren-hardy/TCEB/founders-event.html#enroll'), '_blank', 'noopener'); return; }
    $('enrollWho').textContent = n;
    $('enrollDone').hidden = false;
  });
  document.querySelectorAll('[data-copy]').forEach(function (b) {
    b.addEventListener('click', function () {
      var el = $(b.getAttribute('data-copy')), label = b.textContent;
      function done() { b.classList.add('is-done'); b.textContent = 'Copied'; setTimeout(function () { b.classList.remove('is-done'); b.textContent = label; }, 1600); }
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(el.value).then(done, function () { el.select(); document.execCommand('copy'); done(); });
      else { el.select(); document.execCommand('copy'); done(); }
    });
  });
  // Demo sign-in: any email works; it loads a sample Champion (Brenda) and her link. Nothing is sent anywhere.
  $('signPane').addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = /\S+@\S+\.\S+/.test(this.elements['email'].value.trim());
    $('signErr').hidden = ok;
    if (!ok) return;
    signedIn = true; fn = 'Brenda';
    $('stName').textContent = ' · ' + fn;
    $('stand').hidden = false;
    standCopy(true);
    refNote();
    var on = document.querySelector('[data-opt].is-on'); pick(on ? on.getAttribute('data-opt') : 'audio');
  });
  refNote();
  pick('audio');
  // Any outbound link marked data-ref carries the ID too.
  document.querySelectorAll('a[data-ref]').forEach(function (a) { a.href = withRef(a.getAttribute('href')); });
})();
