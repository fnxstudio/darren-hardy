document.getElementById("dd-app").innerHTML="<!-- ============ NAV ============ -->\n<nav class=\"top\">\n  <a class=\"nav-brand\" href=\"/\">\n    <img class=\"logo-white\" src=\"https://cdn.prod.website-files.com/6a66d7a6f9d116b514a13ae1/6a66e37bd7033981c3c54ca8_dd-logo-white.png\" alt=\"DarrenDaily, Daily Mentoring with Darren Hardy\" width=\"534\" height=\"120\">\n    <img class=\"logo-color\" src=\"https://cdn.prod.website-files.com/6a66d7a6f9d116b514a13ae1/6a66e55222bf946a016bb03d_dd-logo-color.webp\" alt=\"DarrenDaily, Daily Mentoring with Darren Hardy\" width=\"268\" height=\"63\">\n  </a>\n  <button class=\"nav-cta\" type=\"button\" data-share>Share DarrenDaily <span class=\"arrow\">&rarr;</span></button>\n</nav>\n\n<main id=\"top\">\n\n<!-- ============ HERO: full-bleed garden chair, \"your seat is set\" ============ -->\n<section class=\"hero-confirm\">\n  <img class=\"hero-bg\" src=\"https://cdn.prod.website-files.com/6a66d7a6f9d116b514a13ae1/6a66e55270b11505bd250f68_hero-chair.webp\" alt=\"The DarrenDaily garden set: an open chair, an orchid, and a DarrenDaily mug in the morning light\" width=\"2200\" height=\"1229\" fetchpriority=\"high\">\n  <div class=\"container\">\n    <h1>You're in<span class=\"dot\">.</span></h1>\n    <p class=\"lead\"><b>Your seat is set.</b> Take a minute. Watch this. Then do the one thing that makes sure every mentor session reaches you.</p>\n\n    <!-- Facade: poster + play button. Clicking mounts the Vimeo iframe (zero bytes until then). -->\n    <div class=\"video-frame\" id=\"welcomeVideo\" data-vimeo-id=\"298901870\" role=\"button\" tabindex=\"0\" aria-label=\"Play Darren's welcome message\">\n      <img src=\"https://cdn.prod.website-files.com/6a66d7a6f9d116b514a13ae1/6a66e552daf5e386ed5dd8d1_dh-waving.webp\" srcset=\"https://cdn.prod.website-files.com/6a66d7a6f9d116b514a13ae1/6a66e55270b11505bd250f80_dh-waving-m.webp 820w, https://cdn.prod.website-files.com/6a66d7a6f9d116b514a13ae1/6a66e552daf5e386ed5dd8d1_dh-waving.webp 1600w\" sizes=\"(max-width: 980px) 100vw, 940px\" alt=\"Darren Hardy waving hello on the DarrenDaily garden set\" width=\"1600\" height=\"893\">\n      <span class=\"vf-chip\">Watch &middot; 90 seconds</span>\n      <span class=\"vf-play\" aria-hidden=\"true\">\n        <svg viewBox=\"0 0 24 24\"><path d=\"M8 5v14l11-7z\"/></svg>\n      </span>\n    </div>\n    <a class=\"hero-cue\" href=\"#sessions\" aria-label=\"Bonus: Watch the latest sessions now before they expire\">\n      <span class=\"hero-cue-text\"><b>Bonus:</b> Watch the latest sessions now before they expire.</span>\n      <span class=\"hero-cue-arrow\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><polyline points=\"6 9 12 15 18 9\"/></svg></span>\n    </a>\n  </div>\n</section>\n\n<!-- ============ WHAT HAPPENS NEXT ============ -->\n<section class=\"next\">\n  <div class=\"container\">\n    <div class=\"next-head reveal\">\n      <div class=\"eyebrow center\"><span class=\"pip\"></span>What Happens Next</div>\n      <h2>Three simple steps to <em>#BetterEveryDay</em></h2>\n    </div>\n    <div class=\"steps stagger\">\n      <span class=\"steps-rail\" aria-hidden=\"true\"></span>\n      <div class=\"step\">\n        <div class=\"step-num\">01</div>\n        <h3>Coming in HOT</h3>\n        <p><b>Your first mentor session arrives within 24-48 hours.</b> After that. Five minutes every weekday morning. 260 mornings a year. No ads. Ever.</p>\n      </div>\n      <div class=\"step\">\n        <div class=\"step-num\">02</div>\n        <h3>Prep your inbox</h3>\n        <p><b>New senders get buried.</b> Move this one to your inbox now so a session never slips into spam or promotions. The steps are just below.</p>\n      </div>\n      <div class=\"step\">\n        <div class=\"step-num\">03</div>\n        <h3>Show up Every Day</h3>\n        <p><b>Open it. Sit with the idea for a beat</b> before the day takes over. Then carry it into one real decision. That small habit is where #BetterEveryDay begins.</p>\n      </div>\n    </div>\n\n    <!-- Whitelist detail (\"an apple a day\" note pattern) -->\n    <div class=\"whitelist-note reveal\">\n      <span class=\"wn-badge\">#NeverMiss</span>\n      <h4>Add Darren to your inbox</h4>\n      <p>Add <b>darrendaily@darrenhardy.com</b> to your contacts. Gmail buries new senders in Promotions. Drag the first email into <b>Primary</b>. Using Apple Mail or Outlook? Mark the sender as a <b>known contact</b>.</p>\n      <p>Nothing after a day? Check Spam or Junk. Mark it Not spam. That is all it takes.</p>\n      <p class=\"wn-help\">Still stuck? <a href=\"https://helpme.darrenhardy.com/hc/en-us\" target=\"_blank\" rel=\"noopener\">Visit the help center</a></p>\n    </div>\n  </div>\n</section>\n\n<!-- ============ RECENT SESSIONS + 72-HOUR EXPIRY ============ -->\n<!-- WEBFLOW: bind .ep-grid to a Collection List on the Sessions CMS.\n     Sort by Publish date (descending), Limit 2 -> always the two latest.\n     Each card is a self-contained designed graphic (title + PLAY NOW baked in):\n       .ep-card img       -> session \"card image\" field (set alt text = session title)\n       .ep-card href      -> session slug / post page\n       .ep-meta--date     -> Publish date field\n     Cards below are the two real latest sessions (Resilience Jul 23, Saturdays Jul 24 2026). -->\n<section class=\"sessions\" id=\"sessions\">\n  <div class=\"container\">\n    <div class=\"ep-head reveal\">\n      <div class=\"eyebrow accent center\"><span class=\"pip\"></span>Expiring Soon</div>\n      <h2>Start with the <em>latest</em>.</h2>\n      <div class=\"ep-expiry\">\n        <svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"12\" r=\"9\"/><polyline points=\"12 7 12 12 15.5 14\"/></svg>\n        Each session lives 72 hours. Then it is gone.\n      </div>\n    </div>\n    <div class=\"ep-grid stagger\">\n      <a class=\"ep-card\" href=\"https://dd.darrenhardy.com/inspiring-real-life-story-for-career-resilience\">\n        <img src=\"https://cdn.prod.website-files.com/6a66d7a6f9d116b514a13ae1/6a66e5536c506c4f5d517398_ep-card-3.webp\" alt=\"Watch: An inspiring real-life story for career resilience\" width=\"440\" height=\"244\" loading=\"lazy\">\n        <div class=\"ep-metarow\">\n          <span class=\"ep-meta ep-meta--date\">Jul 23 &middot; 2026</span>\n        </div>\n      </a>\n      <a class=\"ep-card\" href=\"https://dd.darrenhardy.com/high-achievers-do-on-saturdays\">\n        <img src=\"https://cdn.prod.website-files.com/6a66d7a6f9d116b514a13ae1/6a66e5534df7439ce7c712fa_ep-card-2.webp\" alt=\"Watch: What high-achievers do on Saturdays\" width=\"440\" height=\"244\" loading=\"lazy\">\n        <div class=\"ep-metarow\">\n          <span class=\"ep-meta ep-meta--date\">Jul 24 &middot; 2026</span>\n        </div>\n      </a>\n    </div>\n\n    <!-- ===================== WEBFLOW-READY (hidden until you activate it) =====================\n         Rebuild the .ep-grid above as a COLLECTION LIST, then delete the hardcoded cards above.\n           Collection: Sessions   |   Sort: Published date (DESC)   |   Limit: 2\n         Bind each [[FIELD]] in the Designer (one Collection Item shown; Webflow repeats it):\n           href                -> the Session item (link to whole item)\n           img src             -> \"Card Image\" field  (the designed card with the title baked in)\n           img alt             -> \"Title\" field        (IMPORTANT: keeps the baked-in headline accessible + SEO)\n           .ep-meta--date text -> \"Published\" date field\n\n    <div class=\"ep-grid stagger\">\n      <a class=\"ep-card\" href=\"[[SESSION_URL]]\">\n        <img src=\"[[SESSION_CARD_IMAGE]]\" alt=\"[[SESSION_TITLE]]\" width=\"440\" height=\"244\" loading=\"lazy\">\n        <div class=\"ep-metarow\">\n          <span class=\"ep-meta ep-meta--date\">[[SESSION_PUBLISHED_DATE]]</span>\n        </div>\n      </a>\n    </div>\n         ============================== end WEBFLOW-READY ============================== -->\n  </div>\n</section>\n\n<!-- ============ TESTIMONIALS ============ -->\n<section class=\"tw\" id=\"voices\">\n  <div class=\"container\">\n    <div class=\"tw-head reveal\">\n      <div class=\"eyebrow accent center\"><span class=\"pip\"></span>From The Community</div>\n      <h2>You're in <em>excellent company</em>.</h2>\n      <div class=\"tw-proof\">\n        <div class=\"proof-stars\" aria-hidden=\"true\">&#9733;&#9733;&#9733;&#9733;&#9733;</div>\n        <p class=\"proof-line\">You just joined <b>350,000+ business builders</b> who start every weekday morning right here.</p>\n      </div>\n    </div>\n    <!-- PLACEHOLDER member wall: all 9 tiles are intentionally the SAME member\n         (Michael Soler) so this reads as an obvious placeholder. Replace with real,\n         consented member portraits, names, titles and quotes before launch.\n         3 columns; each .pcol parallaxes on scroll via data-speed. -->\n    <div class=\"pgallery reveal\" data-parallax-gallery>\n      <div class=\"pcol\" data-speed=\"0.05\">\n        <div class=\"ptile\">\n          <img src=\"https://cdn.prod.website-files.com/6a66d7a6f9d116b514a13ae1/6a66e55522bf946a016bb101_Michael-Soler-studio-blue.webp\" width=\"820\" height=\"590\" alt=\"Michael Soler\" loading=\"lazy\">\n          <span class=\"ptile-chip\">Dog Training</span>\n          <div class=\"ptile-info\"><div class=\"ptile-stars\" aria-hidden=\"true\">&#9733;&#9733;&#9733;&#9733;&#9733;</div><p class=\"ptile-quote\">&ldquo;Quietly game-changing&rdquo;</p><div class=\"ptile-name\">Michael Soler<span>Founder &middot; Dog Training Co.</span></div></div>\n        </div>\n        <div class=\"ptile\">\n          <img src=\"https://cdn.prod.website-files.com/6a66d7a6f9d116b514a13ae1/6a66e55522bf946a016bb101_Michael-Soler-studio-blue.webp\" width=\"820\" height=\"590\" alt=\"Michael Soler\" loading=\"lazy\">\n          <span class=\"ptile-chip\">Dog Training</span>\n          <div class=\"ptile-info\"><div class=\"ptile-stars\" aria-hidden=\"true\">&#9733;&#9733;&#9733;&#9733;&#9733;</div><p class=\"ptile-quote\">&ldquo;Quietly game-changing&rdquo;</p><div class=\"ptile-name\">Michael Soler<span>Founder &middot; Dog Training Co.</span></div></div>\n        </div>\n        <div class=\"ptile\">\n          <img src=\"https://cdn.prod.website-files.com/6a66d7a6f9d116b514a13ae1/6a66e55522bf946a016bb101_Michael-Soler-studio-blue.webp\" width=\"820\" height=\"590\" alt=\"Michael Soler\" loading=\"lazy\">\n          <span class=\"ptile-chip\">Dog Training</span>\n          <div class=\"ptile-info\"><div class=\"ptile-stars\" aria-hidden=\"true\">&#9733;&#9733;&#9733;&#9733;&#9733;</div><p class=\"ptile-quote\">&ldquo;Quietly game-changing&rdquo;</p><div class=\"ptile-name\">Michael Soler<span>Founder &middot; Dog Training Co.</span></div></div>\n        </div>\n      </div>\n      <div class=\"pcol\" data-speed=\"-0.06\">\n        <div class=\"ptile\">\n          <img src=\"https://cdn.prod.website-files.com/6a66d7a6f9d116b514a13ae1/6a66e55522bf946a016bb101_Michael-Soler-studio-blue.webp\" width=\"820\" height=\"590\" alt=\"Michael Soler\" loading=\"lazy\">\n          <span class=\"ptile-chip\">Dog Training</span>\n          <div class=\"ptile-info\"><div class=\"ptile-stars\" aria-hidden=\"true\">&#9733;&#9733;&#9733;&#9733;&#9733;</div><p class=\"ptile-quote\">&ldquo;Quietly game-changing&rdquo;</p><div class=\"ptile-name\">Michael Soler<span>Founder &middot; Dog Training Co.</span></div></div>\n        </div>\n        <div class=\"ptile\">\n          <img src=\"https://cdn.prod.website-files.com/6a66d7a6f9d116b514a13ae1/6a66e55522bf946a016bb101_Michael-Soler-studio-blue.webp\" width=\"820\" height=\"590\" alt=\"Michael Soler\" loading=\"lazy\">\n          <span class=\"ptile-chip\">Dog Training</span>\n          <div class=\"ptile-info\"><div class=\"ptile-stars\" aria-hidden=\"true\">&#9733;&#9733;&#9733;&#9733;&#9733;</div><p class=\"ptile-quote\">&ldquo;Quietly game-changing&rdquo;</p><div class=\"ptile-name\">Michael Soler<span>Founder &middot; Dog Training Co.</span></div></div>\n        </div>\n        <div class=\"ptile\">\n          <img src=\"https://cdn.prod.website-files.com/6a66d7a6f9d116b514a13ae1/6a66e55522bf946a016bb101_Michael-Soler-studio-blue.webp\" width=\"820\" height=\"590\" alt=\"Michael Soler\" loading=\"lazy\">\n          <span class=\"ptile-chip\">Dog Training</span>\n          <div class=\"ptile-info\"><div class=\"ptile-stars\" aria-hidden=\"true\">&#9733;&#9733;&#9733;&#9733;&#9733;</div><p class=\"ptile-quote\">&ldquo;Quietly game-changing&rdquo;</p><div class=\"ptile-name\">Michael Soler<span>Founder &middot; Dog Training Co.</span></div></div>\n        </div>\n      </div>\n      <div class=\"pcol\" data-speed=\"0.035\">\n        <div class=\"ptile\">\n          <img src=\"https://cdn.prod.website-files.com/6a66d7a6f9d116b514a13ae1/6a66e55522bf946a016bb101_Michael-Soler-studio-blue.webp\" width=\"820\" height=\"590\" alt=\"Michael Soler\" loading=\"lazy\">\n          <span class=\"ptile-chip\">Dog Training</span>\n          <div class=\"ptile-info\"><div class=\"ptile-stars\" aria-hidden=\"true\">&#9733;&#9733;&#9733;&#9733;&#9733;</div><p class=\"ptile-quote\">&ldquo;Quietly game-changing&rdquo;</p><div class=\"ptile-name\">Michael Soler<span>Founder &middot; Dog Training Co.</span></div></div>\n        </div>\n        <div class=\"ptile\">\n          <img src=\"https://cdn.prod.website-files.com/6a66d7a6f9d116b514a13ae1/6a66e55522bf946a016bb101_Michael-Soler-studio-blue.webp\" width=\"820\" height=\"590\" alt=\"Michael Soler\" loading=\"lazy\">\n          <span class=\"ptile-chip\">Dog Training</span>\n          <div class=\"ptile-info\"><div class=\"ptile-stars\" aria-hidden=\"true\">&#9733;&#9733;&#9733;&#9733;&#9733;</div><p class=\"ptile-quote\">&ldquo;Quietly game-changing&rdquo;</p><div class=\"ptile-name\">Michael Soler<span>Founder &middot; Dog Training Co.</span></div></div>\n        </div>\n        <div class=\"ptile\">\n          <img src=\"https://cdn.prod.website-files.com/6a66d7a6f9d116b514a13ae1/6a66e55522bf946a016bb101_Michael-Soler-studio-blue.webp\" width=\"820\" height=\"590\" alt=\"Michael Soler\" loading=\"lazy\">\n          <span class=\"ptile-chip\">Dog Training</span>\n          <div class=\"ptile-info\"><div class=\"ptile-stars\" aria-hidden=\"true\">&#9733;&#9733;&#9733;&#9733;&#9733;</div><p class=\"ptile-quote\">&ldquo;Quietly game-changing&rdquo;</p><div class=\"ptile-name\">Michael Soler<span>Founder &middot; Dog Training Co.</span></div></div>\n        </div>\n      </div>\n    </div>\n  </div>\n</section>\n\n<!-- ============ CLOSE ============ -->\n<section class=\"close-band\">\n  <div class=\"container\">\n    <div class=\"eyebrow on-dark center\"><span class=\"pip\"></span>Pass It On</div>\n    <h2>You are the <em>exception</em>.</h2>\n    <p>You just did what most people only think about. Know a builder who would start their morning sharper too? Send them here.</p>\n    <div class=\"close-actions\">\n      <a class=\"btn ondark\" href=\"https://darrendaily.com/\" data-share>Share DarrenDaily <span class=\"arrow\">&rarr;</span></a>\n      <a class=\"btn-line ondark\" href=\"https://darrendailyondemand.com/\" target=\"_blank\" rel=\"noopener\">Listen While You Wait <span class=\"arrow\">&rarr;</span></a>\n    </div>\n  </div>\n</section>\n\n<!-- ============ FOOTER ============ -->\n<footer>\n  <div class=\"container\">\n    <div class=\"footer-grid\">\n      <div class=\"foot-brand\">\n        <img class=\"fb-logo\" src=\"https://cdn.prod.website-files.com/6a66d7a6f9d116b514a13ae1/6a66e37bd7033981c3c54ca8_dd-logo-white.png\" alt=\"DarrenDaily, Daily Mentoring with Darren Hardy\" width=\"534\" height=\"120\">\n        <p class=\"tag\">Five days a week, 260 days a year, one strategic idea to start the day. No ads, no sponsors. Your attention is never for sale here.</p>\n        <div class=\"socials\">\n          <a href=\"https://www.youtube.com/channel/UCYoFxvZAFr_eBVsNNKQYWKQ\" title=\"YouTube\" target=\"_blank\" rel=\"noopener\"><svg viewBox=\"0 0 24 24\"><path d=\"M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.5 15.6V8.4l6.3 3.6-6.3 3.6z\"/></svg></a>\n          <a href=\"https://www.instagram.com/darrenhardy/\" title=\"Instagram\" target=\"_blank\" rel=\"noopener\"><svg viewBox=\"0 0 24 24\"><path d=\"M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z\"/></svg></a>\n          <a href=\"https://www.facebook.com/DarrenHardyFan/\" title=\"Facebook\" target=\"_blank\" rel=\"noopener\"><svg viewBox=\"0 0 24 24\"><path d=\"M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z\"/></svg></a>\n          <a href=\"https://twitter.com/DARRENHARDY\" title=\"X\" target=\"_blank\" rel=\"noopener\"><svg viewBox=\"0 0 24 24\"><path d=\"M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z\"/></svg></a>\n        </div>\n      </div>\n      <div class=\"footer-col\">\n        <h3>Explore</h3>\n        <ul>\n          <li><a href=\"https://darrenhardy.com/about/\">About</a></li>\n          <li><a href=\"https://darrenhardy.com/programs/\">Resources</a></li>\n          <li><a href=\"https://darrendaily.com/\">Daily Mentoring</a></li>\n          <li><a href=\"https://darrendailyondemand.com/\">Podcast</a></li>\n          <li><a href=\"https://store.darrenhardy.com/\">Books</a></li>\n        </ul>\n      </div>\n      <div class=\"footer-col\">\n        <h3>Support</h3>\n        <ul>\n          <li><a href=\"https://helpme.darrenhardy.com/\">Help Center</a></li>\n          <li><a href=\"https://darrenhardy.com/careers/\">Careers</a></li>\n        </ul>\n      </div>\n      <div class=\"footer-col\">\n        <a class=\"bmc-corner\" href=\"https://hardybmc.com\" target=\"_blank\" rel=\"noopener\">\n          <img src=\"https://cdn.prod.website-files.com/6a66d7a6f9d116b514a13ae1/6a66e5535a1a5ea0057e2346_BMC_Logo.png\" width=\"236\" height=\"240\" alt=\"BMC|COLLECTIVE\">\n          <div class=\"bmc-corner-text\">\n            <span class=\"bmc-corner-title\">BMC|COLLECTIVE</span>\n            <span class=\"bmc-corner-tag\">The Unfair Advantage<br>for Driven Leaders</span>\n            <span class=\"bmc-corner-cta\">Explore Further <span class=\"arrow\">&#8599;</span></span>\n          </div>\n        </a>\n      </div>\n    </div>\n    <div class=\"footer-bottom\">\n      <span>\u00a9 Darren Hardy, LLC. All Rights Reserved.</span>\n      <div class=\"legal-links\">\n        <a href=\"https://dh.darrenhardy.com/terms-of-service/\">Terms &amp; Conditions</a>\n        <a href=\"https://dh.darrenhardy.com/privacy\">Privacy Policy</a>\n      </div>\n    </div>\n  </div>\n</footer>\n\n</main>\n\n<!-- Share confirmation toast -->\n<div class=\"toast\" id=\"toast\" role=\"status\" aria-live=\"polite\"></div>\n\n<!-- ============ EXIT-INTENT \"LATEST SESSION\" POPUP ============ -->\n<!-- WEBFLOW: .xp-list is a Collection List bound to Sessions, Sort = Published DESC, Limit = 1\n     (this page is not a session, so there's no current slug to skip). Bind each item's image,\n     date, and link to CMS fields. Auto-updates on publish; the team never resets it. -->\n<div class=\"xp-modal\" id=\"exitPopup\" role=\"dialog\" aria-modal=\"true\" aria-labelledby=\"xpTitle\" data-current-slug=\"\">\n  <div class=\"xp-card\">\n    <button class=\"xp-close\" type=\"button\" data-xp-close aria-label=\"Close\">\n      <svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><line x1=\"6\" y1=\"6\" x2=\"18\" y2=\"18\"/><line x1=\"18\" y1=\"6\" x2=\"6\" y2=\"18\"/></svg>\n    </button>\n    <span class=\"xp-accent\" aria-hidden=\"true\"></span>\n    <div class=\"xp-eyebrow\">Before you go</div>\n    <h3 class=\"xp-title\" id=\"xpTitle\">Don't miss the <em>latest</em>.</h3>\n    <p class=\"xp-sub\">It's live right now, but every DarrenDaily expires in 72 hours. Then it's gone. No exceptions.</p>\n    <div class=\"xp-list\" data-xp-list>\n      <a class=\"xp-session\" href=\"https://dd.darrenhardy.com/high-achievers-do-on-saturdays\" data-session-slug=\"high-achievers-do-on-saturdays\">\n        <img src=\"https://cdn.prod.website-files.com/6a66d7a6f9d116b514a13ae1/6a66e5534df7439ce7c712fa_ep-card-2.webp\" alt=\"Watch: What high-achievers do on Saturdays\" width=\"440\" height=\"244\" loading=\"lazy\">\n        <span class=\"xp-session-date\">Jul 24 &middot; 2026</span>\n      </a>\n      <a class=\"xp-session\" href=\"https://dd.darrenhardy.com/inspiring-real-life-story-for-career-resilience\" data-session-slug=\"inspiring-real-life-story-for-career-resilience\">\n        <img src=\"https://cdn.prod.website-files.com/6a66d7a6f9d116b514a13ae1/6a66e5536c506c4f5d517398_ep-card-3.webp\" alt=\"Watch: An inspiring real-life story for career resilience\" width=\"440\" height=\"244\" loading=\"lazy\">\n        <span class=\"xp-session-date\">Jul 23 &middot; 2026</span>\n      </a>\n    </div>\n\n    <!-- ===================== WEBFLOW-READY (hidden until you activate it) =====================\n         Rebuild the .xp-list above as a COLLECTION LIST, then delete the hardcoded items above.\n           Collection: Sessions   |   Sort: Published date (DESC)   |   Limit: 1   (this page is not a session, nothing to skip)\n         Bind each [[FIELD]] in the Designer (one Collection Item shown; Webflow repeats it):\n           href                   -> the Session item\n           img src                -> \"Card Image\" field\n           img alt                -> \"Title\" field   (IMPORTANT)\n           .xp-session-date text  -> \"Published\" date field\n           data-session-slug attr -> \"Slug\" field\n         Leave #exitPopup data-current-slug empty on this page.\n\n    <div class=\"xp-list\" data-xp-list>\n      <a class=\"xp-session\" href=\"[[SESSION_URL]]\" data-session-slug=\"[[SESSION_SLUG]]\">\n        <img src=\"[[SESSION_CARD_IMAGE]]\" alt=\"[[SESSION_TITLE]]\" width=\"440\" height=\"244\" loading=\"lazy\">\n        <span class=\"xp-session-date\">[[SESSION_PUBLISHED_DATE]]</span>\n      </a>\n    </div>\n         ============================== end WEBFLOW-READY ============================== -->\n  </div>\n</div>\n";

// Nav: transparent at the very top, flips to solid white after a small scroll
  (function () {
    var nav = document.querySelector('nav.top');
    if (!nav) return;
    var ticking = false;
    function update() { ticking = false; nav.classList.toggle('solid', window.scrollY > 24); }
    function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
  })();

  // Scroll reveal
  (function () {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.reveal, .stagger').forEach(function (el) { io.observe(el); });
  })();

  // Welcome video facade: swap the poster for the Vimeo player on click / Enter / Space
  (function () {
    var frame = document.getElementById('welcomeVideo');
    if (!frame) return;
    function play() {
      var id = frame.getAttribute('data-vimeo-id');
      if (!id || frame.querySelector('iframe')) return;
      var iframe = document.createElement('iframe');
      iframe.src = 'https://player.vimeo.com/video/' + id + '?autoplay=1&color=a72632&title=0&byline=0&portrait=0&dnt=1';
      iframe.allow = 'autoplay; fullscreen; picture-in-picture';
      iframe.setAttribute('allowfullscreen', '');
      iframe.setAttribute('title', 'Darren Hardy welcomes you to DarrenDaily');
      frame.appendChild(iframe);
      frame.classList.add('playing');
      frame.style.cursor = 'default';
    }
    frame.addEventListener('click', play);
    frame.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); play(); }
    });
  })();

  // Share DarrenDaily: native share sheet with a copy-link fallback
  (function () {
    var SHARE = {
      title: 'DarrenDaily',
      text: 'Daily mentoring with Darren Hardy. One idea, five minutes, every weekday morning. Free.',
      url: 'https://darrendaily.com/'
    };
    var toast = document.getElementById('toast');
    var toastTimer;
    function showToast(msg) {
      if (!toast) return;
      toast.textContent = msg;
      toast.classList.add('show');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 2600);
    }
    function share(ev) {
      if (ev) ev.preventDefault();
      if (navigator.share) {
        navigator.share(SHARE).catch(function () {});
        return;
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(SHARE.url).then(function () {
          showToast('Link copied. Thank you for sharing.');
        }).catch(function () {
          window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(SHARE.url), '_blank', 'noopener');
        });
        return;
      }
      window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(SHARE.url), '_blank', 'noopener');
    }
    document.querySelectorAll('[data-share]').forEach(function (el) {
      el.addEventListener('click', share);
    });
  })();

  // Member wall: gentle per-column scroll parallax (disabled on mobile / reduced-motion)
  (function () {
    var g = document.querySelector('[data-parallax-gallery]');
    if (!g || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var cols = Array.prototype.slice.call(g.querySelectorAll('.pcol'));
    var ticking = false;
    function draw() {
      ticking = false;
      if (window.innerWidth <= 860) { cols.forEach(function (c) { c.style.transform = ''; }); return; }
      var rect = g.getBoundingClientRect();
      var delta = (rect.top + rect.height / 2) - (window.innerHeight / 2);
      cols.forEach(function (c) {
        var sp = parseFloat(c.getAttribute('data-speed')) || 0;
        var y = Math.max(-40, Math.min(40, delta * sp));
        c.style.transform = 'translateY(' + y.toFixed(1) + 'px)';
      });
    }
    function onScroll() { if (!ticking) { ticking = true; window.requestAnimationFrame(draw); } }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    draw();
  })();

  // Exit-intent "latest session" popup (offers the newest session, auto-updating from the CMS)
  (function () {
    var pop = document.getElementById('exitPopup');
    if (!pop) return;
    var STORE = window.sessionStorage;            // once per browsing session (swap to localStorage for longer)
    var SHOWN_KEY = 'dd-exit-shown';
    var CAP_ENABLED = false;                      // TESTING: false = show on every trigger. SET TO true BEFORE LAUNCH.
    var DISMISS_KEY = 'dd-exit-dismissed';        // once the user closes it, stay closed for the rest of the session (even with the cap off)
    function isDismissed() { try { return !!STORE.getItem(DISMISS_KEY); } catch (e) { return false; } }
    var listEl = pop.querySelector('[data-xp-list]');
    var lastActive = null;
    var reachedBottom = false;                    // welcome: the popup waits until the reader reaches the page bottom (past the CTA)
    function currentSlug() { var a = pop.getAttribute('data-current-slug'); return a ? a.trim() : ''; }
    function resolveLatest() {
      var cur = currentSlug();
      var items = Array.prototype.slice.call(listEl.querySelectorAll('.xp-session'));
      var shown = null;
      items.forEach(function (it) {
        var slug = (it.getAttribute('data-session-slug') || '').trim();
        if (!shown && slug !== cur) { it.hidden = false; shown = it; } else { it.hidden = true; }
      });
      return shown;
    }
    function canShow() { if (!CAP_ENABLED) return true; try { return !STORE.getItem(SHOWN_KEY); } catch (e) { return true; } }
    function markShown() { if (!CAP_ENABLED) return; try { STORE.setItem(SHOWN_KEY, String(Date.now())); } catch (e) {} }
    function open(force) {
      if (pop.classList.contains('open')) return;
      if (!force && isDismissed()) return;         // user already closed it this session -> stay closed
      if (!force && !reachedBottom) return;        // don't cover the CTA -> hold until they've scrolled to the bottom
      if (!force && !canShow()) return;
      if (!resolveLatest()) return;                // nothing to offer -> don't nag
      lastActive = document.activeElement;
      pop.classList.add('open');
      document.body.style.overflow = 'hidden';
      markShown();
      var c = pop.querySelector('[data-xp-close]'); if (c) c.focus();
    }
    function close() {
      pop.classList.remove('open');
      document.body.style.overflow = '';
      try { STORE.setItem(DISMISS_KEY, '1'); } catch (e) {}   // closing = dismissed for this session
      if (lastActive && lastActive.focus) lastActive.focus();
    }
    // Desktop: pointer leaves through the top edge. Mobile: intercept the first back gesture.
    document.addEventListener('mouseout', function (e) {
      if (e.clientY <= 0 && !e.relatedTarget && !e.toElement) open(false);
    });
    try {
      history.pushState(null, '', location.href);
      window.addEventListener('popstate', function () {
        if (canShow()) { history.pushState(null, '', location.href); open(false); }
      });
    } catch (e) {}
    // Also treat a fast upward scroll as leave-intent (helps on trackpads and touch, where mouseout never fires).
    var lastY = window.pageYOffset, lastT = Date.now();
    window.addEventListener('scroll', function () {
      var y = window.pageYOffset, t = Date.now(), dt = (t - lastT) || 1;
      if ((y - lastY) / dt < -0.5 && lastY > 300) open(false);   // ~500px/s upward flick after scrolling down
      lastY = y; lastT = t;
    }, { passive: true });
    // Welcome: arm the popup only once the reader reaches the bottom (past the CTA), then show it.
    // Until reachedBottom is true, every other trigger (mouseout, back, scroll-up, idle) is held off.
    var bottomTick = false;
    window.addEventListener('scroll', function () {
      if (bottomTick) return; bottomTick = true;
      requestAnimationFrame(function () {
        bottomTick = false;
        if (window.pageYOffset + window.innerHeight >= document.documentElement.scrollHeight - 40) {
          reachedBottom = true;
          open(false);
        }
      });
    }, { passive: true });
    // Idle: no touch/scroll/tap/keypress for 30s -> about to drift off.
    var idleTimer;
    function resetIdle() { clearTimeout(idleTimer); idleTimer = setTimeout(function () { open(false); }, 45000); }
    ['touchstart', 'scroll', 'click', 'keydown', 'mousemove'].forEach(function (evt) {
      window.addEventListener(evt, resetIdle, { passive: true });
    });
    resetIdle();
    pop.querySelectorAll('[data-xp-close]').forEach(function (el) { el.addEventListener('click', close); });
    pop.addEventListener('click', function (e) { if (e.target === pop) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && pop.classList.contains('open')) close(); });
    if (/[?&]exit=1/.test(location.search)) open(true);   // QA: append ?exit=1 to force-preview
  })();

  // ============ DYNAMIC SESSIONS (auto-syncs from the Sessions CMS) ============
  // This page is a static JS-built embed, so it can't host a native Collection List.
  // It reads the hidden "Sessions Feed - Do Not Delete" page (/sessions-feed), which IS
  // a native Collection List (Sessions, Sort Published DESC, Limit 2), and fills the cards
  // from it. On any failure it silently leaves the hardcoded cards.
  //   - .ep-grid section  -> the latest up-to-2 NON-EXPIRED sessions
  //   - .xp-list exit-pop -> ONLY the single newest session (no exclusions)
  // Nothing here excludes a "current" slug: these pages are not themselves a session.
  (function () {
    if (window.__ddSessionsSynced) return;
    window.__ddSessionsSynced = true;
    var FEED_URL  = '/sessions-feed';                    // same-origin on webflow.io AND darrendaily.com
    var POST_BASE = '/sessions/';       // Webflow CMS session page /sessions/{slug}
    var MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    function esc(s) { return String(s == null ? '' : s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
    function parseDate(s) {
      if (!s) return null;
      s = String(s).replace(/ /g, ' ').replace(/\s+/g, ' ').trim();
      var d = new Date(s);
      if (!isNaN(d.getTime())) return d;
      d = new Date(s.replace(/^[A-Za-z]+,?\s+/, ''));    // drop a leading weekday name if present
      return isNaN(d.getTime()) ? null : d;
    }
    function fmtDate(d) { return d ? (MONTHS[d.getMonth()] + ' ' + d.getDate() + ' · ' + d.getFullYear()) : ''; }
    function url(slug) { return POST_BASE + encodeURIComponent(slug); }
    function epCard(s) {
      return '<a class="ep-card" href="' + url(s.slug) + '">'
        + '<img src="' + esc(s.thumb) + '" alt="Watch: ' + esc(s.title) + '" width="440" height="244" loading="lazy">'
        + '<div class="ep-metarow"><span class="ep-meta ep-meta--date">' + fmtDate(s.pub) + '</span></div>'
        + '</a>';
    }
    function xpItem(s) {
      return '<a class="xp-session" href="' + url(s.slug) + '" data-session-slug="' + esc(s.slug) + '">'
        + '<img src="' + esc(s.thumb) + '" alt="Watch: ' + esc(s.title) + '" width="440" height="244" loading="lazy">'
        + '<span class="xp-session-date">' + fmtDate(s.pub) + '</span>'
        + '</a>';
    }
    function parseFeed(html) {
      var doc = new DOMParser().parseFromString(html, 'text/html');
      return Array.prototype.slice.call(doc.querySelectorAll('[data-sf="row"]')).map(function (row) {
        function txt(sel) { var el = row.querySelector('[data-sf="'+sel+'"]'); return el ? el.textContent.trim() : ''; }
        var img = row.querySelector('img');
        return {
          slug:  txt('slug'),
          title: txt('title'),
          thumb: img ? (img.getAttribute('src') || '') : '',
          pub:   parseDate(txt('pub')),
          exp:   parseDate(txt('exp'))
        };
      }).filter(function (s) { return s.slug && s.thumb; });
    }
    fetch(FEED_URL, { credentials: 'same-origin' })
      .then(function (r) { return r.ok ? r.text() : Promise.reject(r.status); })
      .then(function (html) {
        var all = parseFeed(html);
        if (!all.length) return;                          // no data -> keep the hardcoded fallback
        all.sort(function (a, b) { return (b.pub ? b.pub.getTime() : 0) - (a.pub ? a.pub.getTime() : 0); });
        var now = Date.now();
        var live = all.filter(function (s) { return !s.exp || s.exp.getTime() > now; });

        var grid = document.querySelector('.ep-grid');    // on-page: up to 2 non-expired
        if (grid && live.length) {
          grid.innerHTML = live.slice(0, 2).reverse().map(epCard).join('');
          if (live.length === 1) { grid.style.gridTemplateColumns = 'minmax(0, 507px)'; grid.style.justifyContent = 'center'; }
          else { grid.style.gridTemplateColumns = ''; grid.style.justifyContent = ''; }
        }

        var xp = document.querySelector('[data-xp-list]'); // exit-pop: 1 newest, no exclusions
        if (xp) xp.innerHTML = xpItem(all[0]);
      })
      .catch(function () { /* offline / not on Webflow -> hardcoded cards stay */ });
  })();
