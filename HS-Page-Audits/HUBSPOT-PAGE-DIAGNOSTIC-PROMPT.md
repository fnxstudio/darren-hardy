# HubSpot Page Diagnostic — paste-ready prompt

**How to use:** copy everything below the line into Claude Code, replace `<PAGE_URL>` with one HubSpot page URL, and send it.

---

You are auditing a single HubSpot-hosted page. Investigate it and report what is actually broken. Work from evidence you gather yourself — never from assumption about how HubSpot "usually" behaves.

**Page to audit:** `<PAGE_URL>`

## Step 0 — Browser tools are required. Check first.

Much of this audit is impossible from the served HTML alone. Desktop-vs-mobile divergence, hidden form labels, which tags actually fire, and dead content all require rendering the page.

Check whether you have browser tools available (a `claude-in-chrome`, Browser pane, or equivalent MCP browser toolset).

**If you do not have them, stop and tell the operator this, verbatim:**

> This audit needs browser tools. To turn them on:
> 1. Install the **Claude in Chrome** extension (v1.0.36+) from the Chrome Web Store.
> 2. Quit Claude Code and relaunch it with: `claude --chrome`
> 3. Run `/chrome` — it is working when the panel shows **Status: Enabled** and **Extension: Installed**.
> 4. To keep it on for future sessions, run `/chrome` and pick **"Enabled by default"**.
>
> Requirements: Chrome, Edge, or another Chromium browser; a direct Anthropic plan (Pro, Max, Team, or Enterprise); and you must be signed in via `/login` — API-key and `setup-token` sessions cannot use Chrome integration. Not supported on WSL, or via Bedrock / Vertex / Foundry.
> If the extension is installed but not detected: restart Chrome (it reads the native-messaging config at startup), then run `/chrome` → **Reconnect extension**.

Do not attempt a partial audit and present it as complete. If the operator asks you to proceed anyway, run only Steps 1, 5, 6 and 7 and label the report **PARTIAL — no browser**, listing what was skipped.

## Hard rules

- **Never submit a form.** These are live pages wired to a real CRM. Read configuration; do not create records.
- **Never accept or dismiss consent banners before you have recorded what fires pre-consent** (Step 2).
- Report only what you verified. If something is uncertain, label it **VERIFY** rather than asserting it.

## Step 1 — Provenance

```bash
curl -sSI -A "Mozilla/5.0 Chrome/126" "<PAGE_URL>" | grep -iE 'x-hs-|server|location'
curl -sSL -A "Mozilla/5.0 Chrome/126" -o page.html -w "HTTP %{http_code} %{size_download}B %{num_redirects} redirects -> %{url_effective}\n" "<PAGE_URL>"
```

Record `x-hs-portal-id`, `x-hs-content-id`, `x-hs-content-campaign-id`, and any redirect. Then extract the template and module names from the HTML — these reveal **which page this one was cloned from**, which is often the root cause:

```bash
grep -oE '(module|template)_[A-Za-z0-9_.-]+\.min\.(js|css)' page.html | sort -u
```

## Step 2 — What actually fires at runtime

Load the page in the browser. **Before touching the cookie banner**, capture:

```js
(()=>{const r=performance.getEntriesByType('resource');
const ids=new Set();
r.forEach(x=>{const m=x.name.match(/(GTM-[A-Z0-9]+|G-[A-Z0-9]{9,}|AW-[0-9]+|sdkid=[A-Z0-9]+|ti=[0-9]{7,}|pid=[0-9]{5,}|id=[0-9]{15,})/g);if(m)m.forEach(v=>ids.add(v))});
const hosts={};r.forEach(x=>{try{hosts[new URL(x.name).host]=1}catch(e){}});
return JSON.stringify({requests:r.length,hosts:Object.keys(hosts).length,
 transferKB:Math.round(r.reduce((a,x)=>a+(x.transferSize||0),0)/1024),
 decodedKB:Math.round(r.reduce((a,x)=>a+(x.decodedBodySize||0),0)/1024),
 trackerIds:[...ids].sort(), hostList:Object.keys(hosts).sort(),
 globals:Object.keys(window).filter(k=>/^fbq|^ttq|^uetq|^lintrk|^clarity|^funnelytics|^hyros|^mbsy|^_hsq|^dataLayer|^gtag/i.test(k)),
 heaviest:r.map(x=>({n:x.name.split('/').pop().split('?')[0].slice(0,50),kb:Math.round((x.transferSize||0)/1024)})).filter(x=>x.kb>60).sort((a,b)=>b.kb-a.kb).slice(0,12),
 fontFacesDeclared:document.fonts.size, fontsLoaded:[...document.fonts].filter(f=>f.status==='loaded').length
},null,1)})()
```

Then list **every distinct marketing/analytics tool** with its ID, as a table the operator can mark **needed / not needed / unknown**. Group by vendor. Flag specifically:
- more than one GA4 property (their numbers will never reconcile)
- more than one Google Ads account
- any tag whose vendor the business may no longer use
- anything that fired **before** consent was given

Also capture console errors and long-task blocking:

```js
new Promise(res=>{let t=[];new PerformanceObserver(l=>{for(const e of l.getEntries())t.push(e.duration)}).observe({type:'longtask',buffered:true});
setTimeout(()=>res(JSON.stringify({longTasks:t.length,totalBlockingMs:Math.round(t.reduce((a,b)=>a+b,0))})),1200)})
```

## Step 3 — Desktop vs mobile (highest-yield step — do not skip)

HubSpot pages routinely carry **two different versions of the page** with CSS choosing between them. The editor's desktop preview hides this completely.

Define a probe, then run it at **1280, 768, and 375** px, reloading is not required — just resize and re-probe:

```js
window.__snap=()=>{const vis=e=>{const s=getComputedStyle(e),r=e.getBoundingClientRect();
 return !(s.display==='none'||s.visibility==='hidden'||(r.width===0&&r.height===0));};
 const out=[];(function w(n){for(const c of n.children){
  if(/^(SCRIPT|STYLE|NOSCRIPT|TEMPLATE)$/.test(c.tagName))continue; if(!vis(c))continue;
  const own=[...c.childNodes].filter(x=>x.nodeType===3).map(x=>x.textContent.replace(/\s+/g,' ').trim()).filter(Boolean).join(' ');
  if(own)out.push(own); w(c);}})(document.body);
 return {w:innerWidth, text:out.join(' | '),
  headings:[...document.querySelectorAll('h1,h2,h3')].filter(vis).map(e=>e.tagName+':'+e.textContent.replace(/\s+/g,' ').trim().slice(0,60)),
  ctas:[...document.querySelectorAll('button,input[type=submit],a.button')].filter(vis).map(e=>(e.textContent||e.value).trim().slice(0,40)).filter(Boolean),
  visibleForms:[...document.querySelectorAll('form')].map((f,i)=>({i,id:f.id.slice(0,44),visible:vis(f)}))};};
JSON.stringify(window.__snap(),null,1)
```

Compare the three. Report explicitly:
- **Does the headline, offer, or CTA change between breakpoints?** If yes, that is a top finding — state both versions side by side.
- **Does a different form become visible?** Compare their field lists (Step 4). If the mobile form cannot collect what the page's purpose requires, say so plainly.
- Any element visible at one width and not another.

Take a screenshot at desktop and at mobile as evidence.

## Step 4 — Forms

For every form on the page:

```js
(()=>{const vis=e=>{const r=e.getBoundingClientRect();return !(getComputedStyle(e).display==='none'||(r.width===0&&r.height===0));};
return JSON.stringify([...document.querySelectorAll('form')].map((f,i)=>({i,id:f.id.slice(0,44),
 guid:(f.id.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/)||[''])[0],
 visible:vis(f), submit:[...f.querySelectorAll('input[type=submit],button')].map(b=>(b.value||b.textContent).trim().slice(0,36)),
 fields:[...f.querySelectorAll('input,select,textarea')].filter(x=>x.type!=='hidden'&&x.type!=='submit').map(x=>{
   const l=f.querySelector('label[for="'+x.id+'"]');
   return {name:x.name,required:x.required,placeholder:x.placeholder||'(none)',
     label:l?l.textContent.trim():'(no label)',
     labelVisible:l?(l.getBoundingClientRect().height>0&&getComputedStyle(l).display!=='none'):false,
     aria:x.getAttribute('aria-label')||'(none)'};})
})),null,1)})()
```

Check and report:
- **Are labels hidden with no placeholder and no aria-label?** That leaves the visitor guessing at blank boxes — a conversion blocker and a screen-reader failure.
- **Duplicate forms** (same GUID rendered twice, both visible) inflate form-view counts and conversion rates.
- **The success message.** Search the HTML for `inlineMessage` and map each one to its `formId`. Confirm the message names the *correct* thing the visitor will receive. Wrong-reward and wrong-offer confirmations are common on cloned pages:
  ```bash
  grep -oE 'formId: .{0,80}|inlineMessage: "[^"]*"' page.html
  ```
- **Does the form carry the fields the page's purpose requires?** A shipping page with no address field, a webinar page with no time selector, etc.
- If page scripts reference a form field by name, **confirm that field exists.** HubSpot v4 forms embed a full JSON definition in the page listing every real field — trust that over the DOM.

## Step 5 — Hidden and dead content

```js
(()=>{const hid=e=>{const s=getComputedStyle(e),r=e.getBoundingClientRect();
 return s.display==='none'||s.visibility==='hidden'||(r.width===0&&r.height===0);};
const out=[];[...document.querySelectorAll('body *')].forEach(e=>{
 if(/^(SCRIPT|STYLE|NOSCRIPT|TEMPLATE|OPTION)$/.test(e.tagName))return;
 const t=e.textContent.replace(/\s+/g,' ').trim(); if(t.length<25||!hid(e))return;
 let p=e.parentElement,outer=true; while(p&&p!==document.body){if(hid(p)){outer=false;break}p=p.parentElement}
 if(outer)out.push({cls:(e.className||'').toString().slice(0,60),chars:t.length,text:t.slice(0,300)});});
return JSON.stringify({blocks:out.length,chars:out.reduce((a,x)=>a+x.chars,0),out},null,1)})()
```

Ignore HubSpot's form-renderer payload (large blobs of inline CSS, country-code lists, form JSON) — that is machinery, not content. For the remaining blocks, classify each as:

1. **Responsive variant** — hidden at this width, visible at another. Confirm by re-probing at all three widths.
2. **Dead at every breakpoint** — visible to nobody, still downloaded by everybody and still read by crawlers. Report these individually; whole heroes and whole content sections turn up here.
3. **Duplicate** of visible copy.
4. **Copy belonging to a different offer** — see the test below.

**Test for foreign copy by deliverable, not vocabulary.** Two offers in the same campaign share all their words. Ask instead: what does the visitor *receive*, and what is the conversion event? A free download and a webinar registration are different lead magnets even when every sentence sounds alike. Look for machinery that belongs to another offer — a time picker, merge fields, registration language, a bonus block, download language — and note which page it is live on versus hidden on.

Also flag text hidden by other means: `font-size` under ~5px, text-indent off-screen, colour matching the background.

## Step 6 — SEO / AEO

- **`<title>`, `<meta description>`, `og:title`, `og:description`, `twitter:*`** — do any contain an internal working name (brackets, "Opt-in Page", "HomePage", a template name)? That string is the Google headline and every link preview.
- **Is the description accurate for *this* page?** Cloned pages routinely inherit the source page's description.
- **Consistency:** does `<title>` describe the same offer as the `<h1>`, the meta description, the URL slug, and the CTA button? List all five together. Divergence here also breaks ad-platform relevance, since Meta requires that what an ad promotes match what the landing page promotes.
- **Headings:** count visible `<h1>`s; find empty headings; find an `<h1>` containing only an image; find run-together text where `<br>` removes a space (e.g. `Strength<br>in` extracts as "Strengthin").
- **`og:image` present?** `twitter:card` set to `summary_large_image`?
- **JSON-LD structured data** — count `application/ld+json` blocks. For a product, book, event, or review claim, absence means answer engines have nothing to extract. If the page makes a review or rating claim in visible text, check whether `aggregateRating` exists to support it.
- **Alt text** — flag alt values that are filenames (`Group 21`, `Frame 4273`, `Rectangle 30`, `tst`, `Untitled`).
- **`/robots.txt` and `/sitemap.xml`** — fetch both. In a shared HubSpot portal these are portal-wide, so a brand's domain may serve another brand's rules, and may publicly expose internal slugs. Check the sitemap actually contains URLs and that robots.txt declares it.

## Step 7 — Assets and weight

```js
JSON.stringify([...document.querySelectorAll('img')].map(i=>({src:i.currentSrc.split('/').pop().split('?')[0].slice(0,48),
 natural:i.naturalWidth+'x'+i.naturalHeight, shown:Math.round(i.getBoundingClientRect().width)+'px',
 oversizeX:i.getBoundingClientRect().width?+(i.naturalWidth/(i.getBoundingClientRect().width*devicePixelRatio)).toFixed(1):null,
 lazy:i.loading, aboveFold:i.getBoundingClientRect().top<innerHeight})).filter(x=>x.natural!=='0x0'),null,1)
```

Flag: images far larger than their display size; PNGs used for photos or gradients (check whether a WebP of the same asset is already on the page); above-the-fold images with `loading="lazy"` (this delays the LCP element); unused webfonts (declared vs loaded); the same icon library or font loaded more than once; placeholder filenames in production (`tst`, `Untitled`, `Photoroom`, hash-named exports).

Also check the served CSS for invalid declarations left by empty editor fields — `font-size:px`, `border-radius:px`, `margin-top:px`, empty `{}` rules, fully transparent shadows:

```bash
grep -oE '[a-z-]+: *px' page.html | sort | uniq -c
```

## Step 8 — Compare against sibling pages

If the page is one of a set (tiers, variants, a series), fetch the siblings and diff them. Shared form GUIDs or an identical meta description across two pages proves one was cloned from the other. Check whether tier-specific values (numbers, reward names, prices, dates) were all updated or only some.

## Verification discipline — avoid these specific traps

These produce confident, wrong findings. Each has burned a previous audit:

- **Do not judge whether a field is required from the DOM `required` attribute.** HubSpot v4 validates in JavaScript; the native attribute is often absent while the form definition says required. Read the embedded form JSON.
- **Do not report unrendered merge fields as bugs** (`{!something}`) until you check the rendered DOM — they are usually replaced at runtime.
- **Do not report normal platform machinery as defects.** HubSpot's dropdown search field, its proxy inputs with empty `name` attributes, and its translation strings are standard. Confirm a pattern is unique to this page before flagging it.
- **Do not call a `-hidden` CSS class an "A/B variant."** Test it at all three widths. Real HubSpot A/B tests appear as an `abTestId` in the page metadata, not as CSS classes.
- **Do not treat shared vocabulary as proof two pages are the same offer.** Test by deliverable and conversion event.
- **Do not report a hidden text block without saying which category it falls into** (Step 5). "Hidden text exists" is not a finding; "an entire hero is hidden at every breakpoint" is.

## Output

Produce a single markdown report:

1. **Page identity** — URL, portal ID, content ID, template, what it was cloned from if determinable.
2. **Measured baseline** — requests, distinct hosts, transferred/uncompressed bytes, blocking time, DOM nodes. State the conditions you measured under and note that real mobile traffic will be worse.
3. **Findings in priority order**, most severe first. Severity = does it stop the page doing its job? Order: *page cannot fulfil its purpose for some visitors* → *wrong information shown to visitors* → *conversion blockers* → *tracking/data integrity* → *speed* → *SEO/AEO* → *waste*.
4. For each finding: what it is, the evidence (quote the code, the config value, or the measurement), and who it affects.
5. **Tag inventory table** for the operator to mark needed / not needed / unknown.
6. **A "verified correct" section** — things you checked that are fine. This keeps the report credible and stops the reader dismissing it as one-sided.

Do not estimate repair time or effort. Report what is true.
