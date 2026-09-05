(function(){
  var d=document, page=d.querySelector('.dd-page'); if(!page) return;
  var BASE="https://traffic.libsyn.com/secure/darrendailyondemand/";
  var EPS=[["The Procrastination Kill Switch","2024-12-11",319,"DDOD_Episode1582_mixdown.mp3"],["The One Question Great Leaders Ask That Most Managers Fear","2026-06-26",336,"DDOD-Episode_1985_Mixdown.mp3"],["The Hiring Mistake That's Quietly Killing Your Culture","2026-02-25",478,"DDOD-Episode_1898_Mixdown.mp3"],["The Day The CEO Got Beat Down by His Own Employees","2026-08-21",364,"DDOD-Episode_2025_Mixdown.mp3"],["The One Question that Instantly Fixes Team Dysfunction","2026-02-18",340,"DDOD-Episode_1893_Mixdown.mp3"],["Stop 'Coaching' People. Instead Do This.","2024-09-12",368,"DDOD_Episode1508_mixdown.mp3"],["Unmasking the Motives of A-Players","2023-10-05",406,"DDOD_Episode1263_mixdown.mp3"],["The Dark Side of Servant Leadership","2026-03-19",499,"DDOD-Episode_1914_Mixdown.mp3"],["How Successful Leaders (Accidentally!) Destroy Their Own Companies","2026-08-17",330,"DDOD-Episode_2021_Mixdown.mp3"],["3 Keys to Grow Your Business","2025-04-16",417,"DDOD_Episode1673_mixdown.mp3"],["The Hidden Profit Leak Costing You 10X More Than You Think","2026-06-24",402,"DDOD-Episode_1983_Mixdown.mp3"],["Selling Is Dead. Here's What Top Performers Do Instead","2025-09-03",258,"DDOD-Episode_1773_Mixdown.mp3"],["A Killer Strategy Your Competition Can't Copy","2026-05-19",357,"DDOD-Episode_1957_Mixdown.mp3"],["The Million-Dollar Skill Most Entrepreneurs (Mistakenly!) Refuse to Develop","2026-08-24",309,"DDOD-Episode_2026_Mixdown.mp3"],["The Small Shift That Gets Customers Raving","2026-02-06",390,"DDOD-Episode_1885_Mixdown.mp3"],["How to Build Loyalty Money Can't Buy","2026-07-13",328,"DDOD-Episode_1996_Mixdown.mp3"],["Key Systems to Scale Hyper-Growth","2023-11-07",455,"DDOD_Episode1286_mixdown.mp3"],["The Real Reason You Procrastinate (It's Not What You Think)","2026-07-23",457,"DDOD-Episode_2004_Mixdown.mp3"],["The 3 Steps That End Procrastination for Good","2026-07-24",653,"DDOD-Episode_2005_Mixdown.mp3"],["Why Your Morning Routine is Sabotaging Your Success","2026-06-23",445,"DDOD-Episode_1982_Mixdown.mp3"],["99% of Your Calendar is Wasted on This (Fix It Now!)","2026-07-17",435,"DDOD-Episode_2000_Mixdown.mp3"],["The Discipline of NO","2026-03-05",241,"DDOD-Episode_1904_Mixdown.mp3"],["How to (Successfully!) Block Out Distractions","2024-12-04",318,"DDOD_Episode1576_mixdown.mp3"],["The Silent Productivity Killer That's Draining 10% of Your Income","2025-12-02",265,"DDOD-Episode_1837_Mixdown.mp3"],["How to Reclaim the 5+ Hours of Wasted Time Every Single Day","2026-08-06",418,"DDOD-Episode_2014_Mixdown.mp3"],["How to Bounce Back From Failure Faster Than 99% of People","2026-07-27",261,"DDOD-Episode_2006_Mixdown.mp3"],["How to Banish Fear & Anxiety Permanently","2025-12-01",363,"DDOD-Episode_1836_Mixdown.mp3"],["The Real Cause of Failure (& Success!)","2025-10-21",443,"DDOD-Episode_1807_Mixdown.mp3"],["The 5 Questions That Tell You Exactly When to Quit","2026-08-25",364,"DDOD-Episode_2027_Mixdown.mp3"],["Transforming Setbacks into Comebacks","2024-04-06",286,"DDOD_Episode1395_mixdown.mp3"],["High Achievers Hide This Secret Struggle. Do You?","2025-08-25",594,"DDOD-Episode_1766_Mixdown.mp3"],["The One Choice That Eliminates Daily Anxiety","2026-05-26",206,"DDOD-Episode_1962_Mixdown-v2.mp3"],["How to Instantly Diffuse Your Stress","2025-11-06",103,"DDOD-Episode_1819_Mixdown.mp3"],["Break Through Self-Limiting Beliefs Part 1","2021-07-20",311,"DDOD_Episode684_mixdown.mp3"],["Break Through Self-Limiting Beliefs Part 2","2021-07-21",199,"DDOD_Episode685_mixdown.mp3"],["Break Through Self-Limiting Beliefs Part 3","2021-07-22",305,"DDOD_Episode686_mixdown.mp3"],["Are Your Beliefs Really Your Own?","2025-03-19",336,"DDOD_Episode1653_mixdown.mp3"],["Gain Unshakeable Confidence TODAY!","2024-12-16",221,"DDOD_Episode1586_mixdown.mp3"],["The Brutal Question That Forces Breakthrough Decisions","2026-04-27",355,"DDOD-Episode_1941_Mixdown.mp3"],["How to Shatter Every Ceiling You Think You've Hit","2025-11-03",546,"DDOD-Episode_1816_Mixdown.mp3"],["The Gratitude That You Don't Want to Feel","2025-11-27",432,"DDOD-Episode_1834_Mixdown.mp3"],["The Psychology of Persuasion No One Talks About","2026-01-09",360,"DDOD-Episode_1865_Mixdown.mp3"],["How to Make People Instantly Trust You","2025-12-23",333,"DDOD-Episode_1852_Mixdown.mp3"],["Mastering the First Impression Game","2026-01-16",198,"DDOD-Episode_1870_Mixdown.mp3"],["How to Have Magnetic Charisma (3 Secrets)","2026-07-07",277,"DDOD-Episode_1992_Mixdown.mp3"],["Why Introverts Make the Most Powerful Influencers","2026-01-22",239,"DDOD-Episode_1874_Mixdown.mp3"],["How to Command Respect Without Saying a Word","2025-08-29",375,"DDOD-Episode_1770_Mixdown.mp3"],["The Wolf of Wall Street's Billion-Dollar Communication Secret","2025-12-17",370,"DDOD-Episode_1848_Mixdown.mp3"],["Your Guide to Owning Any Room You Walk Into","2026-08-10",475,"DDOD-Episode_2016_Mixdown-v2.mp3"]];      /* [title, date, seconds, file] */
  var RUNS=[["Leading People",["DDOD-Episode_1985_Mixdown.mp3","DDOD-Episode_1898_Mixdown.mp3","DDOD-Episode_2025_Mixdown.mp3","DDOD-Episode_1893_Mixdown.mp3","DDOD_Episode1508_mixdown.mp3","DDOD_Episode1263_mixdown.mp3","DDOD-Episode_1914_Mixdown.mp3","DDOD-Episode_2021_Mixdown.mp3"]],["Building The Business",["DDOD_Episode1673_mixdown.mp3","DDOD-Episode_1983_Mixdown.mp3","DDOD-Episode_1773_Mixdown.mp3","DDOD-Episode_1957_Mixdown.mp3","DDOD-Episode_2026_Mixdown.mp3","DDOD-Episode_1885_Mixdown.mp3","DDOD-Episode_1996_Mixdown.mp3","DDOD_Episode1286_mixdown.mp3"]],["Getting It Done",["DDOD-Episode_2004_Mixdown.mp3","DDOD-Episode_2005_Mixdown.mp3","DDOD-Episode_1982_Mixdown.mp3","DDOD-Episode_2000_Mixdown.mp3","DDOD-Episode_1904_Mixdown.mp3","DDOD_Episode1576_mixdown.mp3","DDOD-Episode_1837_Mixdown.mp3","DDOD-Episode_2014_Mixdown.mp3"]],["When It's Hard",["DDOD-Episode_2006_Mixdown.mp3","DDOD-Episode_1836_Mixdown.mp3","DDOD-Episode_1807_Mixdown.mp3","DDOD-Episode_2027_Mixdown.mp3","DDOD_Episode1395_mixdown.mp3","DDOD-Episode_1766_Mixdown.mp3","DDOD-Episode_1962_Mixdown-v2.mp3","DDOD-Episode_1819_Mixdown.mp3"]],["The Inner Game",["DDOD_Episode684_mixdown.mp3","DDOD_Episode685_mixdown.mp3","DDOD_Episode686_mixdown.mp3","DDOD_Episode1653_mixdown.mp3","DDOD_Episode1586_mixdown.mp3","DDOD-Episode_1941_Mixdown.mp3","DDOD-Episode_1816_Mixdown.mp3","DDOD-Episode_1834_Mixdown.mp3"]],["Winning People Over",["DDOD-Episode_1865_Mixdown.mp3","DDOD-Episode_1852_Mixdown.mp3","DDOD-Episode_1870_Mixdown.mp3","DDOD-Episode_1992_Mixdown.mp3","DDOD-Episode_1874_Mixdown.mp3","DDOD-Episode_1770_Mixdown.mp3","DDOD-Episode_1848_Mixdown.mp3","DDOD-Episode_2016_Mixdown-v2.mp3"]]];     /* [name, [file,...]] */
  var byFile={}; EPS.forEach(function(e){ byFile[e[3]]=e; });

  /* ---------- audio ---------- */
  var audio=new Audio(); audio.preload='none';
  var queue=[], qi=-1, curRun=-1;
  var sticky=d.getElementById('sticky'), skFill=d.getElementById('skFill'),
      skTitle=d.getElementById('skTitle'), skTime=d.getElementById('skTime'),
      skPlay=d.getElementById('skPlay'), skProg=d.getElementById('skProg'),
      heroFill=d.getElementById('heroFill'), heroPlay=d.getElementById('heroPlay'),
      heroBar=d.getElementById('heroBar'), heroTitle=d.getElementById('heroTitle'),
      runList=d.getElementById('runList');

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

  /* ---------- runs ---------- */
  function closeRun(){ curRun=-1; if(runList) runList.innerHTML='';
    d.querySelectorAll('.ddod-run').forEach(function(c){ c.classList.remove('is-active'); }); }
  function openRun(i){
    var run=RUNS[i]; if(!run||!runList) return;
    curRun=i;
    d.querySelectorAll('.ddod-run').forEach(function(c){ c.classList.toggle('is-active', +c.getAttribute('data-run')===i); });
    var head='<div class="ddod-run-head"><div class="ddod-run-head-t">'+run[0]+'</div><div class="ddod-run-close" role="button" tabindex="0">Close</div></div>';
    var rows=run[1].map(function(f,n){ var e=byFile[f]; if(!e) return '';
      return '<div class="ddod-ep" data-file="'+f+'" data-i="'+n+'"><div class="ddod-ep-n">'+(n+1)+'</div><div class="ddod-ep-t">'+e[0]+'</div><div class="ddod-ep-d">'+clock(e[2])+'</div></div>'; }).join('');
    runList.innerHTML=head+rows;
    runList.querySelector('.ddod-run-close').addEventListener('click',closeRun);
    runList.querySelectorAll('.ddod-ep').forEach(function(r){
      r.addEventListener('click',function(){ queue=run[1].slice(); playAt(+r.getAttribute('data-i')); });
    });
    runList.scrollIntoView({behavior:'smooth',block:'nearest'});
  }
  d.querySelectorAll('.ddod-run').forEach(function(c){
    c.addEventListener('click',function(){ var i=+c.getAttribute('data-run'); if(i===curRun) closeRun(); else openRun(i); });
  });

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
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var band=d.querySelector('.ddod-band');
  if(band && !reduced && 'IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){
      es.forEach(function(en){
        if(!en.isIntersecting) return; io.unobserve(en.target);
        en.target.querySelectorAll('[data-count]').forEach(function(el){
          var end=+el.getAttribute('data-count'), final=el.textContent, t0=null;
          if(!end||end<100) return;
          function step(ts){ if(!t0) t0=ts; var p=Math.min(1,(ts-t0)/900); var v=Math.floor(end*(1-Math.pow(1-p,3)));
            el.textContent=v.toLocaleString('en-US'); if(p<1) requestAnimationFrame(step); else el.textContent=final; }
          el.textContent='0'; requestAnimationFrame(step);
        });
      });
    },{threshold:.35});
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