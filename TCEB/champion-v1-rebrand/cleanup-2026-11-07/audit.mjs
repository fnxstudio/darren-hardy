// Audit live /champion: which head-CSS selectors match nothing, which script ids exist. node audit.mjs [query] [width] out.json
import { spawn } from 'node:child_process';
import fs from 'node:fs';
const q = process.argv[2] || '', W = +(process.argv[3] || 1440), out = process.argv[4], port = 9870 + Math.floor(Math.random()*100);
const prof = fs.mkdtempSync('/private/tmp/claude-502/-Users-maggiescott34-Claude-Folder/80c4b99f-f8bc-464e-a726-c4e5843587a0/scratchpad/prof-');
const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${prof}`, '--hide-scrollbars', 'about:blank'], { stdio: 'ignore' });
const sleep = ms => new Promise(r => setTimeout(r, ms));
let tabs;
for (let i = 0; i < 50; i++) { try { tabs = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); if (tabs.length) break; } catch {} await sleep(200); }
const ws = new WebSocket(tabs.find(t => t.type === 'page').webSocketDebuggerUrl);
await new Promise(r => ws.onopen = r);
let id = 0; const pend = {}; const errs = [];
ws.onmessage = e => { const m = JSON.parse(e.data); if (m.method === 'Runtime.exceptionThrown') errs.push(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text); if (m.id && pend[m.id]) { pend[m.id](m); delete pend[m.id]; } };
const send = (method, params = {}) => new Promise(r => { const i = ++id; pend[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async expr => (await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true })).result?.result;
await send('Page.enable'); await send('Runtime.enable');
await send('Emulation.setDeviceMetricsOverride', { width: W, height: 1000, deviceScaleFactor: 1, mobile: W < 768 });
await send('Page.navigate', { url: 'https://www.thecompoundeffect.com/champion?cb=' + Date.now() + q });
await sleep(7000);
const r = await ev(`(async()=>{
  try{Cookiebot.submitCustomConsent(true,true,true)}catch(e){}
  const fb=document.getElementById('fullBtn'); if(fb) fb.click();
  await new Promise(r=>setTimeout(r,2500));
  if(location.search.includes('strip=1')){document.querySelectorAll('[data-cut],#hpop,#lv,[data-promo],.champ-ping.is-a,.champ-ping.is-c,.champ-st-next,.champ-chip,.champ-full-coin,.champ-full-head-coin').forEach(n=>n.remove());}
  const ids=[...document.querySelectorAll('[id]')].map(e=>e.id);
  const sheets=[...document.styleSheets].filter(s=>s.ownerNode && s.ownerNode.closest && s.ownerNode.closest('head') && (s.ownerNode.textContent||'').includes('CHAMPION BOARD'));
  const res=[];
  const strip=s=>s.replace(/::?(before|after|placeholder|marker|selection|-webkit-[a-z-]+|backdrop|first-letter|first-line)\\b/g,'').replace(/:(hover|focus|focus-visible|focus-within|active|visited|checked|disabled|target)\\b/g,'').replace(/:not\\(\\s*\\)/g,'');
  function walk(rules,media){ for(const ru of rules){ if(ru.selectorText){ for(const sel of ru.selectorText.split(/,(?![^(]*\\))/)){ let n=0; try{ n=document.querySelectorAll(strip(sel.trim())||'*').length }catch(e){ n=-1 } res.push([media,sel.trim(),n]); } } else if(ru.cssRules) walk(ru.cssRules,(ru.conditionText||ru.name||'')); } }
  sheets.forEach(s=>walk(s.cssRules,''));
  return JSON.stringify({ids, sel:res, dialogs:[...document.querySelectorAll('dialog')].map(d=>d.id), sheets:sheets.length});
})()`);
const d = JSON.parse(r.value); d.errs = errs;
fs.writeFileSync(out, JSON.stringify(d));
console.log('ids', d.ids.length, 'selectors', d.sel.length, 'unmatched', d.sel.filter(x=>x[2]===0).length, 'dialogs', d.dialogs, 'errs', errs);
ws.close(); chrome.kill();
