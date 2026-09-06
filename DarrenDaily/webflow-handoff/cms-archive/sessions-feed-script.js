// ============ DYNAMIC SESSIONS (auto-syncs from the Sessions CMS) ============
// Reads /sessions-feed (native Collection List, Published DESC, Limit 40). Fields addressed
// by [data-sf]. Links -> /sessions/{slug}. On failure, keeps the hardcoded fallback cards.
//   .ep-grid -> up-to-2 sessions that are PUBLISHED (their date has arrived) AND not expired
//   .xp-list -> the single newest currently-live session
// Scheduled reveal: future-dated posts stay hidden until their day; expired ones drop off. No republish.
(function () {
  if (window.__ddSessionsSynced) return;
  var FEED_URL = '/sessions-feed', POST_BASE = '/sessions/';
  var MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  function esc(s){ return String(s==null?'':s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
  function parseDate(s){ if(!s) return null; s=String(s).replace(/ /g,' ').replace(/\s+/g,' ').trim(); var d=new Date(s); if(!isNaN(d.getTime())) return d; d=new Date(s.replace(/^[A-Za-z]+,?\s+/,'')); return isNaN(d.getTime())?null:d; }
  function fmtDate(d){ return d?(MONTHS[d.getMonth()]+' '+d.getDate()+' · '+d.getFullYear()):''; }
  function url(slug){ return POST_BASE+encodeURIComponent(slug); }
  function epCard(s){ return '<a class="ep-card" href="'+url(s.slug)+'"><img src="'+esc(s.thumb)+'" alt="Watch: '+esc(s.title)+'" width="440" height="244" loading="lazy"><div class="ep-metarow"><span class="ep-meta ep-meta--date">'+fmtDate(s.pub)+'</span></div></a>'; }
  function xpItem(s){ return '<a class="xp-session" href="'+url(s.slug)+'" data-session-slug="'+esc(s.slug)+'"><img src="'+esc(s.thumb)+'" alt="Watch: '+esc(s.title)+'" width="440" height="244" loading="lazy"><span class="xp-session-date">'+fmtDate(s.pub)+'</span></a>'; }
  function parseFeed(html){ var doc=new DOMParser().parseFromString(html,'text/html'); return Array.prototype.slice.call(doc.querySelectorAll('[data-sf="row"]')).map(function(row){ function t(n){ var el=row.querySelector('[data-sf="'+n+'"]'); return el?el.textContent.trim():''; } var img=row.querySelector('img'); return { slug:t('slug'), title:t('title'), thumb:img?(img.getAttribute('src')||''):'', pub:parseDate(t('pub')), exp:parseDate(t('exp')) }; }).filter(function(s){ return s.slug && s.thumb; }); }
  function run(){ if(window.__ddSessionsSynced) return; window.__ddSessionsSynced=true; fetch(FEED_URL,{credentials:'same-origin'}).then(function(r){ return r.ok?r.text():Promise.reject(r.status); }).then(function(html){ var all=parseFeed(html); if(!all.length) return; all.sort(function(a,b){ return (b.pub?b.pub.getTime():0)-(a.pub?a.pub.getTime():0); }); var now=Date.now(); var live=all.filter(function(s){ return (!s.pub || s.pub.getTime()<=now) && (!s.exp || s.exp.getTime()>now); }); var grid=document.querySelector('.ep-grid'); if(grid && live.length){ grid.innerHTML=live.slice(0,2).reverse().map(epCard).join(''); if(live.length===1){ grid.style.gridTemplateColumns='minmax(0, 507px)'; grid.style.justifyContent='center'; } else { grid.style.gridTemplateColumns=''; grid.style.justifyContent=''; } } var xp=document.querySelector('[data-xp-list]'); if(xp && live.length) xp.innerHTML=xpItem(live[0]); }).catch(function(){}); }
  function ready(){ return document.querySelector('.ep-grid') || document.querySelector('[data-xp-list]'); }
  if(ready()){ run(); } else { var n=0, iv=setInterval(function(){ if(ready()||++n>60){ clearInterval(iv); if(ready()) run(); } },50); }
})();