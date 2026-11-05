// Capture the hero button over the shine cycle: node frames.mjs css-file
import { spawn } from 'node:child_process';
import fs from 'node:fs';
const CSS = process.argv[2] ? fs.readFileSync(process.argv[2], 'utf8') : '', port = 9881;
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
await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 2, mobile: false });
await send('Page.navigate', { url: 'https://www.thecompoundeffect.com/champion?cb=' + Date.now() });
await sleep(6000);
await ev(`(()=>{const s=document.createElement('style');s.textContent=${JSON.stringify(CSS)};document.head.appendChild(s);const c=document.getElementById('CybotCookiebotDialog');if(c)c.remove();})()`);
const r = await ev(`(()=>{const q=document.querySelector('.champ-bigq');q.scrollIntoView({block:'center'});const b=q.querySelector('.champ-d-em').getBoundingClientRect();const n=document.querySelector('.champ-btn.is-nav');return JSON.stringify({x:b.left,y:b.top+scrollY,w:b.width,h:b.height,navAnim:getComputedStyle(n,'::after').animationName,heroAnim:getComputedStyle(document.querySelector('.champ-hero .champ-btn.is-solid'),'::after').animationName})})()`);
console.log(r.value); const b = JSON.parse(r.value);
for (let i = 0; i < 24; i++) {
  const s = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { x: b.x - 30, y: b.y - 30, width: b.w + 60, height: b.h + 60, scale: 1 } });
  fs.writeFileSync(`button-shine/f${i}.png`, Buffer.from(s.result.data, 'base64')); await sleep(300);
}
ws.close(); chrome.kill();
