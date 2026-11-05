// Inspect podium cards on /champion: node inspect.mjs [css-file] [shot-prefix]
import { spawn } from 'node:child_process';
import fs from 'node:fs';
const CSS = process.argv[2] ? fs.readFileSync(process.argv[2], 'utf8') : '', PRE = process.argv[3] || '', port = 9891;
const prof = fs.mkdtempSync('/private/tmp/claude-502/-Users-maggiescott34-Claude-Folder/80c4b99f-f8bc-464e-a726-c4e5843587a0/scratchpad/prof-');
const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${prof}`, '--hide-scrollbars', 'about:blank'], { stdio: 'ignore' });
const sleep = ms => new Promise(r => setTimeout(r, ms));
let tabs;
for (let i = 0; i < 50; i++) { try { tabs = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); if (tabs.length) break; } catch {} await sleep(200); }
const ws = new WebSocket(tabs.find(t => t.type === 'page').webSocketDebuggerUrl);
await new Promise(r => ws.onopen = r);
let id = 0; const pend = {};
ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pend[m.id]) { pend[m.id](m); delete pend[m.id]; } };
const send = (method, params = {}) => new Promise(r => { const i = ++id; pend[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async expr => (await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true })).result?.result;
await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
await send('Page.navigate', { url: 'https://www.thecompoundeffect.com/champion?cb=' + Date.now() });
await sleep(6000);
await ev(`(()=>{const s=document.createElement('style');s.textContent=${JSON.stringify(CSS)};document.head.appendChild(s);const c=document.getElementById('CybotCookiebotDialog');if(c)c.remove();})()`);
const r = await ev(`(async()=>{
  const pd=document.querySelector('#board .champ-pd.is-3'); pd.scrollIntoView({block:'center'}); await new Promise(r=>setTimeout(r,1500));
  const out={};
  for (const k of ['is-1','is-2','is-3']) { const e=document.querySelector('#board .champ-pd.'+k); const c=getComputedStyle(e), a=getComputedStyle(e,'::after'), b=getComputedStyle(e,'::before');
    out[k]={pos:c.position,ov:c.overflow,iso:c.isolation,bg:c.backgroundImage.slice(0,80),after:a.content+' '+a.position+' '+a.animationName,before:b.content+' '+b.position}; }
  const row=document.querySelector('#board .champ-pd').parentElement.closest('[class*=podium]')||document.querySelector('#board .champ-pd').parentElement.parentElement.parentElement;
  const rb=[...document.querySelectorAll('#board .champ-pd')].map(e=>e.getBoundingClientRect()); const x=Math.min(...rb.map(b=>b.left))-40,y=Math.min(...rb.map(b=>b.top))+scrollY-40,w=Math.max(...rb.map(b=>b.right))-x+40,h=Math.max(...rb.map(b=>b.bottom))+scrollY-y+40;
  out.box={x,y,w,h}; out.heroPcard3=getComputedStyle(document.querySelector('.champ-pcard.is-3')).backgroundImage.slice(0,60); out.heroAfter=getComputedStyle(document.querySelector('.champ-pcard.is-1'),'::after').animationName;
  return JSON.stringify(out);
})()`);
console.log(r.value);
if (PRE) { const b = JSON.parse(r.value).box;
  for (let i = 0; i < 40; i++) { const s = await send('Page.captureScreenshot', { format: 'jpeg', quality: 85, captureBeyondViewport: true, clip: { x: b.x, y: b.y, width: b.w, height: b.h, scale: 1 } }); fs.writeFileSync(`${PRE}-${i}.jpg`, Buffer.from(s.result.data, 'base64')); await sleep(170); } }
ws.close(); chrome.kill();
