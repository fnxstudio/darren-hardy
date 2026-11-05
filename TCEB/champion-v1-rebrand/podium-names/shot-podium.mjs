// Phone capture of the /champion podium: node shot-podium.mjs out.png [width]
import { spawn } from 'node:child_process';
import fs from 'node:fs';
const out = process.argv[2], W = +(process.argv[3] || 390), port = 9853;
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
await send('Emulation.setDeviceMetricsOverride', { width: W, height: 844, deviceScaleFactor: 2, mobile: true });
await send('Page.navigate', { url: 'https://www.thecompoundeffect.com/champion?cb=' + Date.now() });
await sleep(6000);
const r = await ev(`(async()=>{
  await document.fonts.ready;
  const pod=document.querySelector('.champ-pd').closest('.champ-podium')||document.querySelector('.champ-pd').parentElement.parentElement.parentElement.parentElement;
  pod.scrollIntoView({block:'center'}); await new Promise(r=>setTimeout(r,1500));
  document.querySelectorAll('[class*=reveal],[data-reveal]').forEach(n=>{n.style.opacity=1;n.style.transform='none'});
  const cards=[...document.querySelectorAll('.champ-pd')].map(c=>{const n=c.querySelector('.champ-pd-name');return {cls:c.className,h:Math.round(c.getBoundingClientRect().height),name:n.innerText,nameH:Math.round(n.getBoundingClientRect().height)}});
  const b=pod.getBoundingClientRect();
  return JSON.stringify({x:b.left+scrollX,y:b.top+scrollY,w:b.width,h:b.height,cards});
})()`);
console.log(r?.value);
const box = JSON.parse(r.value);
const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { x: 0, y: box.y - 20, width: W, height: box.h + 40, scale: 1 } });
fs.writeFileSync(out, Buffer.from(shot.result.data, 'base64'));
ws.close(); chrome.kill();
