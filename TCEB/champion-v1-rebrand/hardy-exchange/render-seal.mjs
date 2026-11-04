// Capture the Hardy Exchange portal's seal + title (credits.darrenhardy.com/login) on a transparent background.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
const out = process.argv[2], port = 9851;
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
await send('Emulation.setDeviceMetricsOverride', { width: 1400, height: 900, deviceScaleFactor: 1, mobile: false });
await send('Page.navigate', { url: 'https://credits.darrenhardy.com/login' });
await sleep(5000);
const r = await ev(`(async()=>{
  await document.fonts.ready;
  const img=document.querySelector('img[alt="Business Master Class"]');
  const title=[...document.querySelectorAll('h1,h2,div,span,p')].find(e=>e.children.length===0&&/^the hardy exchange$/i.test(e.textContent.trim()));
  if(!img||!title) return JSON.stringify({img:!!img,title:!!title});
  // Two-line title so the image is closer to the card's portrait image slot
  title.innerHTML='The Hardy<br>Exchange'; title.style.textAlign='center'; title.style.lineHeight='0.95';
  await new Promise(r=>setTimeout(r,200));
  document.querySelectorAll('body *').forEach(n=>n.style.visibility='hidden');
  [img,title].forEach(n=>n.style.visibility='visible');
  document.querySelectorAll('*').forEach(n=>{n.style.background='transparent';n.style.boxShadow='none';});
  const a=img.getBoundingClientRect(), b=title.getBoundingClientRect();
  const x=Math.min(a.left,b.left)-8, y=a.top-8, w=Math.max(a.right,b.right)-x+8, h=b.bottom-y+8;
  return JSON.stringify({x,y,w,h,font:getComputedStyle(title).fontFamily,color:getComputedStyle(title).color});
})()`);
console.log(r?.value);
const box = JSON.parse(r.value);
await send('Emulation.setDefaultBackgroundColorOverride', { color: { r: 0, g: 0, b: 0, a: 0 } });
const shot = await send('Page.captureScreenshot', { format: 'png', clip: { x: box.x, y: box.y, width: box.w, height: box.h, scale: 4 } });
fs.writeFileSync(out, Buffer.from(shot.result.data, 'base64'));
ws.close(); chrome.kill();
console.log('saved', out);
