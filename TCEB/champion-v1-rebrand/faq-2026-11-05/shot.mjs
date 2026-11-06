// Capture one section of /champion: node shot.mjs out.jpg selector [width] [openAll]
import { spawn } from 'node:child_process';
import fs from 'node:fs';
const [out, sel, w, open] = process.argv.slice(2); const W = +(w || 1440), port = 9901 + (W < 768 ? 1 : 0);
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
await send('Emulation.setDeviceMetricsOverride', { width: W, height: W < 768 ? 844 : 1000, deviceScaleFactor: W < 768 ? 2 : 1, mobile: W < 768 });
await send('Page.navigate', { url: 'https://www.thecompoundeffect.com/champion?cb=' + Date.now() });
await sleep(6000);
const r = await ev(`(async()=>{await document.fonts.ready; const c=document.getElementById('CybotCookiebotDialog'); if(c) c.remove();
  document.querySelectorAll('[class*=reveal],[data-reveal]').forEach(n=>{n.style.opacity=1;n.style.transform='none'});
  if(${open ? 1 : 0}) document.querySelectorAll('.champ-faq-item').forEach(d=>d.open=true);
  const el=document.querySelector(${JSON.stringify(sel)}); el.scrollIntoView(); await new Promise(r=>setTimeout(r,1200));
  const b=el.getBoundingClientRect(); return JSON.stringify({y:b.top+scrollY,h:b.height});})()`);
const b = JSON.parse(r.value);
const s = await send('Page.captureScreenshot', { format: 'jpeg', quality: 82, captureBeyondViewport: true, clip: { x: 0, y: b.y, width: W, height: Math.min(b.h, 12000), scale: 1 } });
fs.writeFileSync(out, Buffer.from(s.result.data, 'base64')); console.log(out, b.h);
ws.close(); chrome.kill();
