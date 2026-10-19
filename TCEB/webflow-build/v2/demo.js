/* LOCAL PREVIEW ONLY (never goes to Webflow): repeats CMS items and fakes the hidden CMS pages. */
(function () {
  var ranks = { offset0: 1, offset1: 2, offset2: 3 };
  document.querySelectorAll('[data-repeat]').forEach(function (it) {
    var n = +it.getAttribute('data-repeat');
    for (var i = 1; i < n; i++) it.parentNode.appendChild(it.cloneNode(true));
  });
  document.querySelectorAll('[data-cms="offset3 limit8"] .cb-rank').forEach(function (r, i) {
    r.querySelector('.cb-rank-num').textContent = i + 4;
    r.querySelector('[data-move]').textContent = [2, 0, 5, -1, 0, 3, 0, 1][i];
  });
  document.querySelectorAll('[data-move]').forEach(function (m) { if (!m.getAttribute('data-move')) m.setAttribute('data-move', m.classList.contains('cb-move') ? 'chip' : 'ping'); });
  document.querySelectorAll('.cb-member-rank').forEach(function (r, i) { r.textContent = i + 1; });
  var coins = ['Gold', 'Gold', 'Gold', 'Silver', 'Silver', 'Silver', 'Copper', 'Copper', 'Copper', 'Copper'];
  document.querySelectorAll('[data-slot="wall-new"] [data-coin-text]').forEach(function (t, i) { t.textContent = coins[i]; });
  document.querySelectorAll('.cb-pings.is-coins [data-coin-text]').forEach(function (t, i) { t.textContent = ['Platinum', 'Silver'][i]; });
  // index list for full-standings photos
  var idx = document.querySelector('#cbIndex .w-dyn-items'), h = '';
  for (var r = 1; r <= 52; r++) h += '<div class="w-dyn-item"><img src="assets/open-seat.webp" alt=""><div data-i="rank">' + r + '</div><div data-i="team">' + (r <= 12 ? 'Open seat' : '') + '</div></div>';
  idx.innerHTML = h;
  // fake hidden CMS pages
  var rows = [];
  for (var k = 1; k <= 52; k++) rows.push(k + '|' + (k === 27 ? 'Demo Member' : 'Your Name Here') + '|' + (k <= 25 ? 'Platinum' : k <= 38 ? 'Gold' : k <= 45 ? 'Silver' : 'Copper') + '|' + (k === 27 ? 1 : 0));
  var real = window.fetch;
  window.fetch = function (u) {
    u = String(u);
    if (u.indexOf('/champion-board/p1') > -1) return Promise.resolve(new Response('<div data-board>pages=1<br>' + rows.join('<br>') + '</div>'));
    if (u.indexOf('/champion-data/demo123') > -1) return Promise.resolve(new Response('<div><span data-f="rank">27</span><span data-f="impacts">1</span><span data-f="name">Demo Member</span><span data-f="champion-id">DEMO123</span><span data-f="move"></span><span data-f="status"></span><img data-f="photo" src="assets/open-seat.webp"></div>'));
    if (u.indexOf('/champion-') > -1) return Promise.resolve(new Response('', { status: 404 }));
    return real.apply(this, arguments);
  };
})();
