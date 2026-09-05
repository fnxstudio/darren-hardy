(function(){
  var d=document, page=d.querySelector('.dd-page'); if(!page) return;
  var BASE="https://traffic.libsyn.com/secure/darrendailyondemand/", ART="https://cdn.prod.website-files.com/6a66d7a6f9d116b514a13ae1/6a9c9b6ea38269eaec0a1612_ddod-artwork-116.webp";
  var EPS=[["The Procrastination Kill Switch","2024-12-11",319,"DDOD_Episode1582_mixdown.mp3"],["The One Question Great Leaders Ask That Most Managers Fear","2026-06-26",336,"DDOD-Episode_1985_Mixdown.mp3"],["The Hiring Mistake That's Quietly Killing Your Culture","2026-02-25",478,"DDOD-Episode_1898_Mixdown.mp3"],["The Day The CEO Got Beat Down by His Own Employees","2026-08-21",364,"DDOD-Episode_2025_Mixdown.mp3"],["The One Question that Instantly Fixes Team Dysfunction","2026-02-18",340,"DDOD-Episode_1893_Mixdown.mp3"],["Stop 'Coaching' People. Instead Do This.","2024-09-12",368,"DDOD_Episode1508_mixdown.mp3"],["Unmasking the Motives of A-Players","2023-10-05",406,"DDOD_Episode1263_mixdown.mp3"],["The Dark Side of Servant Leadership","2026-03-19",499,"DDOD-Episode_1914_Mixdown.mp3"],["How Successful Leaders (Accidentally!) Destroy Their Own Companies","2026-08-17",330,"DDOD-Episode_2021_Mixdown.mp3"],["3 Keys to Grow Your Business","2025-04-16",417,"DDOD_Episode1673_mixdown.mp3"],["The Hidden Profit Leak Costing You 10X More Than You Think","2026-06-24",402,"DDOD-Episode_1983_Mixdown.mp3"],["Selling Is Dead. Here's What Top Performers Do Instead","2025-09-03",258,"DDOD-Episode_1773_Mixdown.mp3"],["A Killer Strategy Your Competition Can't Copy","2026-05-19",357,"DDOD-Episode_1957_Mixdown.mp3"],["The Million-Dollar Skill Most Entrepreneurs (Mistakenly!) Refuse to Develop","2026-08-24",309,"DDOD-Episode_2026_Mixdown.mp3"],["The Small Shift That Gets Customers Raving","2026-02-06",390,"DDOD-Episode_1885_Mixdown.mp3"],["How to Build Loyalty Money Can't Buy","2026-07-13",328,"DDOD-Episode_1996_Mixdown.mp3"],["Key Systems to Scale Hyper-Growth","2023-11-07",455,"DDOD_Episode1286_mixdown.mp3"],["The Real Reason You Procrastinate (It's Not What You Think)","2026-07-23",457,"DDOD-Episode_2004_Mixdown.mp3"],["The 3 Steps That End Procrastination for Good","2026-07-24",653,"DDOD-Episode_2005_Mixdown.mp3"],["Why Your Morning Routine is Sabotaging Your Success","2026-06-23",445,"DDOD-Episode_1982_Mixdown.mp3"],["99% of Your Calendar is Wasted on This (Fix It Now!)","2026-07-17",435,"DDOD-Episode_2000_Mixdown.mp3"],["The Discipline of NO","2026-03-05",241,"DDOD-Episode_1904_Mixdown.mp3"],["How to (Successfully!) Block Out Distractions","2024-12-04",318,"DDOD_Episode1576_mixdown.mp3"],["The Silent Productivity Killer That's Draining 10% of Your Income","2025-12-02",265,"DDOD-Episode_1837_Mixdown.mp3"],["How to Reclaim the 5+ Hours of Wasted Time Every Single Day","2026-08-06",418,"DDOD-Episode_2014_Mixdown.mp3"],["How to Bounce Back From Failure Faster Than 99% of People","2026-07-27",261,"DDOD-Episode_2006_Mixdown.mp3"],["How to Banish Fear & Anxiety Permanently","2025-12-01",363,"DDOD-Episode_1836_Mixdown.mp3"],["The Real Cause of Failure (& Success!)","2025-10-21",443,"DDOD-Episode_1807_Mixdown.mp3"],["The 5 Questions That Tell You Exactly When to Quit","2026-08-25",364,"DDOD-Episode_2027_Mixdown.mp3"],["Transforming Setbacks into Comebacks","2024-04-06",286,"DDOD_Episode1395_mixdown.mp3"],["High Achievers Hide This Secret Struggle. Do You?","2025-08-25",594,"DDOD-Episode_1766_Mixdown.mp3"],["The One Choice That Eliminates Daily Anxiety","2026-05-26",206,"DDOD-Episode_1962_Mixdown-v2.mp3"],["How to Instantly Diffuse Your Stress","2025-11-06",103,"DDOD-Episode_1819_Mixdown.mp3"],["Break Through Self-Limiting Beliefs Part 1","2021-07-20",311,"DDOD_Episode684_mixdown.mp3"],["Break Through Self-Limiting Beliefs Part 2","2021-07-21",199,"DDOD_Episode685_mixdown.mp3"],["Break Through Self-Limiting Beliefs Part 3","2021-07-22",305,"DDOD_Episode686_mixdown.mp3"],["Are Your Beliefs Really Your Own?","2025-03-19",336,"DDOD_Episode1653_mixdown.mp3"],["Gain Unshakeable Confidence TODAY!","2024-12-16",221,"DDOD_Episode1586_mixdown.mp3"],["The Brutal Question That Forces Breakthrough Decisions","2026-04-27",355,"DDOD-Episode_1941_Mixdown.mp3"],["How to Shatter Every Ceiling You Think You've Hit","2025-11-03",546,"DDOD-Episode_1816_Mixdown.mp3"],["The Gratitude That You Don't Want to Feel","2025-11-27",432,"DDOD-Episode_1834_Mixdown.mp3"],["The Psychology of Persuasion No One Talks About","2026-01-09",360,"DDOD-Episode_1865_Mixdown.mp3"],["How to Make People Instantly Trust You","2025-12-23",333,"DDOD-Episode_1852_Mixdown.mp3"],["Mastering the First Impression Game","2026-01-16",198,"DDOD-Episode_1870_Mixdown.mp3"],["How to Have Magnetic Charisma (3 Secrets)","2026-07-07",277,"DDOD-Episode_1992_Mixdown.mp3"],["Why Introverts Make the Most Powerful Influencers","2026-01-22",239,"DDOD-Episode_1874_Mixdown.mp3"],["How to Command Respect Without Saying a Word","2025-08-29",375,"DDOD-Episode_1770_Mixdown.mp3"],["The Wolf of Wall Street's Billion-Dollar Communication Secret","2025-12-17",370,"DDOD-Episode_1848_Mixdown.mp3"],["Your Guide to Owning Any Room You Walk Into","2026-08-10",475,"DDOD-Episode_2016_Mixdown-v2.mp3"]];      /* [title, date, seconds, file] */
  var PLAYLISTS=[["Leading People",["DDOD-Episode_1985_Mixdown.mp3","DDOD-Episode_1898_Mixdown.mp3","DDOD-Episode_2025_Mixdown.mp3","DDOD-Episode_1893_Mixdown.mp3","DDOD_Episode1508_mixdown.mp3","DDOD_Episode1263_mixdown.mp3","DDOD-Episode_1914_Mixdown.mp3","DDOD-Episode_2021_Mixdown.mp3"]],["Building The Business",["DDOD_Episode1673_mixdown.mp3","DDOD-Episode_1983_Mixdown.mp3","DDOD-Episode_1773_Mixdown.mp3","DDOD-Episode_1957_Mixdown.mp3","DDOD-Episode_2026_Mixdown.mp3","DDOD-Episode_1885_Mixdown.mp3","DDOD-Episode_1996_Mixdown.mp3","DDOD_Episode1286_mixdown.mp3"]],["Getting It Done",["DDOD-Episode_2004_Mixdown.mp3","DDOD-Episode_2005_Mixdown.mp3","DDOD-Episode_1982_Mixdown.mp3","DDOD-Episode_2000_Mixdown.mp3","DDOD-Episode_1904_Mixdown.mp3","DDOD_Episode1576_mixdown.mp3","DDOD-Episode_1837_Mixdown.mp3","DDOD-Episode_2014_Mixdown.mp3"]],["When It's Hard",["DDOD-Episode_2006_Mixdown.mp3","DDOD-Episode_1836_Mixdown.mp3","DDOD-Episode_1807_Mixdown.mp3","DDOD-Episode_2027_Mixdown.mp3","DDOD_Episode1395_mixdown.mp3","DDOD-Episode_1766_Mixdown.mp3","DDOD-Episode_1962_Mixdown-v2.mp3","DDOD-Episode_1819_Mixdown.mp3"]],["The Inner Game",["DDOD_Episode684_mixdown.mp3","DDOD_Episode685_mixdown.mp3","DDOD_Episode686_mixdown.mp3","DDOD_Episode1653_mixdown.mp3","DDOD_Episode1586_mixdown.mp3","DDOD-Episode_1941_Mixdown.mp3","DDOD-Episode_1816_Mixdown.mp3","DDOD-Episode_1834_Mixdown.mp3"]],["Winning People Over",["DDOD-Episode_1865_Mixdown.mp3","DDOD-Episode_1852_Mixdown.mp3","DDOD-Episode_1870_Mixdown.mp3","DDOD-Episode_1992_Mixdown.mp3","DDOD-Episode_1874_Mixdown.mp3","DDOD-Episode_1770_Mixdown.mp3","DDOD-Episode_1848_Mixdown.mp3","DDOD-Episode_2016_Mixdown-v2.mp3"]]];/* [name, [file,...]] */
  var ICONS={"Apple Podcasts":"<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><defs><linearGradient id=\"ddApple\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#D24BE8\"/><stop offset=\"1\" stop-color=\"#822CBE\"/></linearGradient></defs><rect width=\"24\" height=\"24\" rx=\"5.4\" fill=\"url(#ddApple)\"/><path fill=\"#fff\" d=\"M12 3.6a6.6 6.6 0 0 0-3.6 12.1.85.85 0 1 0 .94-1.42 4.9 4.9 0 1 1 5.32 0 .85.85 0 1 0 .94 1.42A6.6 6.6 0 0 0 12 3.6z\"/><circle cx=\"12\" cy=\"10.3\" r=\"2\" fill=\"#fff\"/><path fill=\"#fff\" d=\"M12 13.2c-1.6 0-2.75.86-2.75 2 0 .55.22 2.02.44 3.06.2.94.42 1.45 1.03 1.79.4.22.86.33 1.28.33s.88-.11 1.28-.33c.61-.34.83-.85 1.03-1.79.22-1.04.44-2.51.44-3.06 0-1.14-1.15-2-2.75-2z\"/></svg>","Spotify":"<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"12\" r=\"12\" fill=\"#1DB954\"/><path fill=\"#fff\" d=\"M18.1 10.6a1 1 0 0 1-1.37.34c-3.03-1.85-7.6-2.27-11.34-1.13a1 1 0 1 1-.58-1.91c4.2-1.28 9.24-.8 12.7 1.32a1 1 0 0 1 .59 1.38z\"/><path fill=\"#fff\" d=\"M16.6 13.9a.83.83 0 0 1-1.14.28c-2.53-1.55-6.32-2-9.24-1.11a.83.83 0 1 1-.48-1.59c3.35-1.02 7.55-.52 10.47 1.27a.83.83 0 0 1 .39 1.15z\"/><path fill=\"#fff\" d=\"M15.2 16.9a.66.66 0 0 1-.91.22c-2.2-1.35-4.98-1.65-8.24-.9a.66.66 0 1 1-.3-1.29c3.57-.82 6.66-.47 9.14 1.05a.66.66 0 0 1 .31.92z\"/></svg>","YouTube":"<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path fill=\"#FF0000\" d=\"M23.5 7.4a3 3 0 0 0-2.11-2.12C19.5 4.77 12 4.77 12 4.77s-7.5 0-9.39.51A3 3 0 0 0 .5 7.4 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 4.6 3 3 0 0 0 2.11 2.12c1.89.51 9.39.51 9.39.51s7.5 0 9.39-.51a3 3 0 0 0 2.11-2.12A31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-.5-4.6z\"/><path fill=\"#fff\" d=\"M9.6 15.5V8.5l6.1 3.5-6.1 3.5z\"/></svg>","iHeart":"<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path fill=\"#C6002B\" d=\"M12 21.6S1.9 15.6 1.9 9.7a4.9 4.9 0 0 1 8.7-3.1 4.9 4.9 0 0 1 1.4 1.3 4.9 4.9 0 0 1 1.4-1.3 4.9 4.9 0 0 1 8.7 3.1c0 5.9-10.1 11.9-10.1 11.9z\"/><circle cx=\"8.5\" cy=\"9.3\" r=\"1.25\" fill=\"#fff\"/><rect x=\"7.45\" y=\"11.35\" width=\"2.1\" height=\"5.1\" rx=\"1.05\" fill=\"#fff\"/></svg>","Amazon Music":"<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><rect width=\"24\" height=\"24\" rx=\"5.4\" fill=\"#25D1DA\"/><path fill=\"#fff\" d=\"M17 4.7v7.7a2.45 2.45 0 1 1-1.55-2.28V7.03l-5.3 1.15v6.36a2.45 2.45 0 1 1-1.55-2.28V6.9L17 4.7z\"/><path fill=\"#fff\" d=\"M5.9 18.1c2.55 1.45 8.15 1.55 12.2.1-.35.5-1 .95-1.95 1.3-2.85 1.05-7.6.6-10.25-1.4z\"/></svg>","RSS":"<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><rect width=\"24\" height=\"24\" rx=\"5.4\" fill=\"#F26522\"/><circle cx=\"7.6\" cy=\"16.4\" r=\"1.95\" fill=\"#fff\"/><path fill=\"#fff\" d=\"M5.65 10.9v2.75a4.75 4.75 0 0 1 4.75 4.75h2.75a7.5 7.5 0 0 0-7.5-7.5z\"/><path fill=\"#fff\" d=\"M5.65 5.9v2.75a9.75 9.75 0 0 1 9.75 9.75h2.75A12.5 12.5 0 0 0 5.65 5.9z\"/></svg>"};    /* brand mark per podcast app, keyed by its label */
  var byFile={}; EPS.forEach(function(e){ byFile[e[3]]=e; });

  /* ---------- podcast app brand marks ---------- */
  d.querySelectorAll('.ddod-sub').forEach(function(a){
    var label=(a.textContent||'').trim();
    if(!ICONS[label]) return;
    var w=d.createElement('span'); w.className='ddod-sub-ico'; w.innerHTML=ICONS[label];
    a.insertBefore(w,a.firstChild);
  });

  /* ---------- review marquee ---------- */
  /* each row is duplicated once so the -50% translate loops seamlessly.
     The originals stay in the Designer; only the clones are generated. */
  ['rvRow1','rvRow2'].forEach(function(id){
    var row=d.getElementById(id); if(!row) return;
    row.querySelectorAll('.ddod-rv').forEach(function(c){
      var k=c.cloneNode(true); k.setAttribute('aria-hidden','true'); row.appendChild(k);
    });
  });

  /* ---------- audio ---------- */
  var audio=new Audio(); audio.preload='none';
  var queue=[], qi=-1, curPl=-1;
  var sticky=d.getElementById('sticky'), skFill=d.getElementById('skFill'),
      skTitle=d.getElementById('skTitle'), skTime=d.getElementById('skTime'),
      skPlay=d.getElementById('skPlay'), skProg=d.getElementById('skProg'),
      heroFill=d.getElementById('heroFill'), heroPlay=d.getElementById('heroPlay'),
      heroBar=d.getElementById('heroBar'),
      plList=d.getElementById('plList');

  function clock(s){ s=Math.max(0,Math.floor(s||0)); var m=Math.floor(s/60); return m+':'+('0'+(s%60)).slice(-2); }
  function icon(el,playing){ if(el) el.textContent = playing ? '\u2016' : '\u25b6'; }

  function load(file, autoplay){
    var e=byFile[file]; if(!e) return;
    audio.src=BASE+file;
    if(skTitle) skTitle.textContent=e[0];
    if(skTime) skTime.textContent='0:00 / '+clock(e[2]);
    if(sticky) sticky.classList.add('is-on');
    try{ localStorage.setItem('ddod:last',file); }catch(err){}
    if(autoplay!==false) audio.play().catch(function(){});
    mark();
  }
  function playAt(i){ if(i<0||i>=queue.length) return; qi=i; load(queue[qi],true); }
  function mark(){
    var f=queue[qi];
    d.querySelectorAll('.ddod-ep').forEach(function(r){ r.classList.toggle('is-playing', r.getAttribute('data-file')===f); });
    var onFeatured = audio.src.indexOf(EPS[0][3])>-1;
    icon(d.querySelector('.ddod-play-icon'), onFeatured && !audio.paused);
    icon(skPlay, !audio.paused);
  }

  audio.addEventListener('timeupdate',function(){
    var p = audio.duration ? (audio.currentTime/audio.duration*100) : 0;
    if(skFill) skFill.style.width=p+'%';
    if(skTime && audio.duration) skTime.textContent=clock(audio.currentTime)+' / '+clock(audio.duration);
    var onFeatured = audio.src.indexOf(EPS[0][3])>-1;
    if(heroFill) heroFill.style.width = onFeatured ? p+'%' : '0%';
    try{ localStorage.setItem('ddod:pos', JSON.stringify({f:queue[qi]||'', t:audio.currentTime})); }catch(err){}
  });
  audio.addEventListener('play',mark);
  audio.addEventListener('pause',mark);
  audio.addEventListener('ended',function(){ if(qi<queue.length-1) playAt(qi+1); else mark(); });

  /* ---------- hero featured ---------- */
  function toggleFeatured(){
    var f=EPS[0][3];
    if(audio.src.indexOf(f)===-1){ queue=[f]; qi=0; load(f,true); return; }
    if(audio.paused) audio.play().catch(function(){}); else audio.pause();
  }
  if(heroPlay){ heroPlay.addEventListener('click',toggleFeatured);
    heroPlay.addEventListener('keydown',function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); toggleFeatured(); } }); }
  d.querySelectorAll('[data-play-featured]').forEach(function(b){
    b.addEventListener('click',function(e){ e.preventDefault(); toggleFeatured();
      var t=d.getElementById('featured'); if(t) t.scrollIntoView({behavior:'smooth',block:'center'}); });
  });
  function seek(bar,ev){ var r=bar.getBoundingClientRect(); var p=(ev.clientX-r.left)/r.width;
    if(audio.duration) audio.currentTime=Math.max(0,Math.min(1,p))*audio.duration; }
  if(heroBar) heroBar.addEventListener('click',function(e){ seek(heroBar,e); });
  if(skProg) skProg.addEventListener('click',function(e){ seek(skProg,e); });

  /* ---------- playlists ---------- */
  function closePlaylist(){ curPl=-1; if(plList) plList.innerHTML='';
    d.querySelectorAll('.ddod-pl').forEach(function(c){ c.classList.remove('is-active'); }); }
  function openPlaylist(i, scroll){
    var pl=PLAYLISTS[i]; if(!pl||!plList) return;
    curPl=i;
    d.querySelectorAll('.ddod-pl').forEach(function(c){ c.classList.toggle('is-active', +c.getAttribute('data-pl')===i); });
    var head='<div class="ddod-pl-head"><div class="ddod-pl-head-t">'+pl[0]+'</div><div class="ddod-pl-close" role="button" tabindex="0">Close</div></div>';
    var rows=pl[1].map(function(f,n){ var e=byFile[f]; if(!e) return '';
      return '<div class="ddod-ep" data-file="'+f+'" data-i="'+n+'">'
        +'<div class="ddod-ep-art"><img src="'+ART+'" alt="" width="96" height="96" loading="lazy"></div>'
        +'<div class="ddod-ep-t">'+e[0]+'</div>'
        +'<div class="ddod-ep-d">'+clock(e[2])+'</div></div>'; }).join('');
    plList.innerHTML=head+rows;
    plList.querySelector('.ddod-pl-close').addEventListener('click',closePlaylist);
    plList.querySelectorAll('.ddod-ep').forEach(function(r){
      r.addEventListener('click',function(){ queue=pl[1].slice(); playAt(+r.getAttribute('data-i')); });
    });
    if(scroll!==false) plList.scrollIntoView({behavior:'smooth',block:'nearest'});
  }
  d.querySelectorAll('.ddod-pl').forEach(function(c){
    c.addEventListener('click',function(){ var i=+c.getAttribute('data-pl'); if(i===curPl) closePlaylist(); else openPlaylist(i); });
  });
  /* Open the first playlist on load so the shelf is never empty.
     scroll=false, otherwise the page would jump on arrival. */
  if(PLAYLISTS.length) openPlaylist(0,false);

  /* ---------- sticky controls ---------- */
  if(skPlay) skPlay.addEventListener('click',function(){ if(audio.paused) audio.play().catch(function(){}); else audio.pause(); });
  var back=d.getElementById('skBack'), fwd=d.getElementById('skFwd'), skx=d.getElementById('skClose');
  if(back) back.addEventListener('click',function(){ audio.currentTime=Math.max(0,audio.currentTime-15); });
  if(fwd) fwd.addEventListener('click',function(){ audio.currentTime=Math.min(audio.duration||0,audio.currentTime+30); });
  if(skx) skx.addEventListener('click',function(){ audio.pause(); if(sticky) sticky.classList.remove('is-on'); });

  /* resume where the listener stopped, without autoplaying */
  try{
    var saved=JSON.parse(localStorage.getItem('ddod:pos')||'null');
    if(saved && saved.f && byFile[saved.f] && saved.t>5){
      queue=[saved.f]; qi=0; load(saved.f,false);
      audio.addEventListener('loadedmetadata',function once(){ audio.currentTime=saved.t; audio.removeEventListener('loadedmetadata',once); });
    }
  }catch(err){}

  /* ---------- stats count-up ---------- */
  /* Each figure keeps its finished value in data-final, so the band reads
     correctly with no JS and under prefers-reduced-motion. */
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var band=d.querySelector('.ddod-band');
  function runCount(root){
    root.querySelectorAll('[data-count]').forEach(function(el){
      if(el.dataset.counted) return; el.dataset.counted='1';
      var end=parseFloat(el.getAttribute('data-count'));
      var dec=parseInt(el.getAttribute('data-decimals')||'0',10);
      var suffix=el.getAttribute('data-suffix')||'';
      var final=el.getAttribute('data-final')||el.textContent;
      var tail=[].map.call(el.querySelectorAll('b'),function(b){return b.outerHTML;}).join('');
      if(isNaN(end)||reduced){ el.classList.add('is-counted'); return; }
      var t0=null;
      function fmt(v){ return (dec ? v.toFixed(dec) : Math.floor(v).toLocaleString('en-US'))+suffix; }
      function step(ts){
        if(!t0) t0=ts;
        var p=Math.min(1,(ts-t0)/1100), eased=1-Math.pow(1-p,3);
        el.innerHTML = fmt(end*eased)+tail;
        if(p<1) requestAnimationFrame(step);
        else { el.innerHTML = final+tail; el.classList.add('is-counted'); }
      }
      el.innerHTML = fmt(0)+tail;
      requestAnimationFrame(step);
    });
  }
  if(band && !('IntersectionObserver' in window)) runCount(band);
  if(band && 'IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){
      es.forEach(function(en){ if(en.isIntersecting){ io.unobserve(en.target); runCount(en.target); } });
    },{threshold:.35});
    /* belt and braces: if the observer never fires (some embedded/headless
       contexts never deliver entries) the numbers still animate on first scroll. */
    var kick=function(){ var b=band.getBoundingClientRect();
      if(b.top<window.innerHeight && b.bottom>0){ runCount(band); window.removeEventListener('scroll',kick); } };
    window.addEventListener('scroll',kick,{passive:true});
    setTimeout(kick,2500);
    io.observe(band);
  }

  /* ---------- opt-in drawer ---------- */
  var drawer=d.getElementById('ddDrawer'), overlay=d.getElementById('ddOverlay'),
      closeBtn=d.getElementById('ddClose'), mount=d.getElementById('ddJoinForm'), lastFocus=null, hsLoaded=false;

  function mountForm(){
    if(hsLoaded||!mount) return; hsLoaded=true;
    var s=d.createElement('script'); s.src='https://js.hsforms.net/forms/embed/v2.js';
    s.onload=function(){ if(window.hbspt) hbspt.forms.create({
      region:'na1', portalId:'2518645', formId:'41958dbb-3c3a-439b-b747-bb96acf50680', target:'#ddJoinForm' }); };
    d.head.appendChild(s);
  }
  function openDrawer(){
    if(!drawer) return; lastFocus=d.activeElement;
    drawer.classList.add('is-open'); if(overlay) overlay.classList.add('is-open');
    drawer.setAttribute('aria-hidden','false');
    page.style.overflow='hidden'; d.body.style.overflow='hidden';
    mountForm();
    setTimeout(function(){ var f=drawer.querySelector('input,button,[tabindex]'); if(f) f.focus(); },120);
  }
  function closeDrawer(){
    if(!drawer) return;
    drawer.classList.remove('is-open'); if(overlay) overlay.classList.remove('is-open');
    drawer.setAttribute('aria-hidden','true');
    page.style.overflow=''; d.body.style.overflow='';
    if(lastFocus && lastFocus.focus) lastFocus.focus();
  }
  d.querySelectorAll('[data-open-drawer]').forEach(function(b){
    b.addEventListener('click',function(e){ e.preventDefault(); openDrawer(); });
  });
  if(closeBtn) closeBtn.addEventListener('click',closeDrawer);
  if(overlay) overlay.addEventListener('click',closeDrawer);
  d.addEventListener('keydown',function(e){
    if(!drawer||!drawer.classList.contains('is-open')) return;
    if(e.key==='Escape'){ closeDrawer(); return; }
    if(e.key!=='Tab') return;
    var f=drawer.querySelectorAll('a[href],button,input,select,textarea,[tabindex]:not([tabindex="-1"])');
    if(!f.length) return; var first=f[0], last=f[f.length-1];
    if(e.shiftKey && d.activeElement===first){ e.preventDefault(); last.focus(); }
    else if(!e.shiftKey && d.activeElement===last){ e.preventDefault(); first.focus(); }
  });
  window.ddodOpenDrawer=openDrawer;
})();