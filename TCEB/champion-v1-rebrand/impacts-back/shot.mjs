// Capture /champion hero deck + board (full standings open): node shot.mjs prefix [width]
import { spawn } from 'node:child_process';
import fs from 'node:fs';
const pre = process.argv[2], W = +(process.argv[3] || 390), port = 9860 + (W > 700 ? 1 : 0);
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
const r = await ev(`(async()=>{
  await document.fonts.ready;
  try{Cookiebot.submitCustomConsent(true,true,true)}catch(e){}
  document.querySelectorAll('[class*=reveal],[data-reveal]').forEach(n=>{n.style.opacity=1;n.style.transform='none'});
  const fb=document.getElementById('fullBtn'); if(fb) fb.click();
  await new Promise(r=>setTimeout(r,2500));
  const box=el=>{const b=el.getBoundingClientRect();return {y:b.top+scrollY,h:b.height}};
  const vis=s=>[...document.querySelectorAll(s)].filter(e=>e.offsetParent).length;
  return JSON.stringify({hero:box(document.querySelector('.champ-hero')),board:box(document.getElementById('board')),
    shown:{pcard:vis('.champ-pcard-meta'),pd:vis('.champ-pd-score'),tile:vis('.champ-tile-score'),st:vis('.champ-st-imp'),full:vis('.champ-full-imp'),head:vis('.champ-full-head-r')},
    firstRows:[...document.querySelectorAll('.champ-full-row')].slice(0,3).map(r=>r.innerText.replace(/\\s+/g,' '))});
})()`);
console.log(r?.value);
const b = JSON.parse(r.value);
for (const [k, v] of [['hero', b.hero], ['board', b.board]]) {
  const shot = await send('Page.captureScreenshot', { format: 'jpeg', quality: 80, captureBeyondViewport: true, clip: { x: 0, y: v.y, width: W, height: Math.min(v.h, 9000), scale: 1 } });
  fs.writeFileSync(`${pre}-${k}-${W}.jpg`, Buffer.from(shot.result.data, 'base64'));
}
ws.close(); chrome.kill();
